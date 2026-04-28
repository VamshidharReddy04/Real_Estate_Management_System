require("dotenv").config();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Property = require("../models/Property");
const { cloudinary } = require("../config/cloudinary");

const ESTATE_ROOT = path.resolve(__dirname, "../../frontend/public/estate");
const CLOUDINARY_READY = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET,
);

function isCloudinaryUrl(url = "") {
  return /res\.cloudinary\.com/i.test(url);
}

function isLocalEstateUrl(url = "") {
  return /^\/estate\//i.test(url);
}

function getLocalFileFromEstateUrl(url) {
  const relative = url.replace(/^\/estate\//i, "");
  return path.join(ESTATE_ROOT, relative);
}

async function uploadLocalImage(localPath, propertyId, imageIndex) {
  return cloudinary.uploader.upload(localPath, {
    folder: "real-estate/properties/migrated",
    resource_type: "image",
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    context: `property_id=${propertyId}|slot=${imageIndex}`,
    transformation: [{ quality: "auto:best", fetch_format: "auto" }],
  });
}

function localFileToDataUri(localPath) {
  const ext = path.extname(localPath).toLowerCase();
  const mimeByExt = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  const mime = mimeByExt[ext] || "image/jpeg";
  const data = fs.readFileSync(localPath).toString("base64");
  return `data:${mime};base64,${data}`;
}

async function migrate() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  console.log(
    CLOUDINARY_READY
      ? "Upload mode: cloudinary"
      : "Upload mode: inline-data-uri (stored in MongoDB)",
  );

  const properties = await Property.find({ "images.0": { $exists: true } });
  let propertiesUpdated = 0;
  let imagesUploaded = 0;
  let imagesSkipped = 0;
  let missingFiles = 0;

  for (const property of properties) {
    let changed = false;
    const nextImages = [];

    for (let i = 0; i < property.images.length; i += 1) {
      const current = property.images[i] || {};
      const currentUrl = current.url || "";

      if (!currentUrl) {
        imagesSkipped += 1;
        continue;
      }

      if (isCloudinaryUrl(currentUrl)) {
        nextImages.push(current);
        imagesSkipped += 1;
        continue;
      }

      if (!isLocalEstateUrl(currentUrl)) {
        nextImages.push(current);
        imagesSkipped += 1;
        continue;
      }

      const localFile = getLocalFileFromEstateUrl(currentUrl);
      if (!fs.existsSync(localFile)) {
        nextImages.push(current);
        missingFiles += 1;
        continue;
      }

      if (CLOUDINARY_READY) {
        const uploaded = await uploadLocalImage(
          localFile,
          property._id.toString(),
          i,
        );
        nextImages.push({
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
      } else {
        nextImages.push({
          url: localFileToDataUri(localFile),
        });
      }
      imagesUploaded += 1;
      changed = true;
    }

    if (changed) {
      property.images = nextImages;
      await property.save();
      propertiesUpdated += 1;
    }
  }

  const summary = {
    propertiesScanned: properties.length,
    propertiesUpdated,
    imagesUploaded,
    imagesSkipped,
    missingFiles,
  };

  console.log(JSON.stringify(summary, null, 2));
  await mongoose.disconnect();
}

migrate().catch(async (error) => {
  console.error("Migration failed:", error?.message || error);
  if (error?.http_code || error?.name || error?.stack) {
    console.error(
      JSON.stringify(
        {
          name: error?.name,
          message: error?.message,
          http_code: error?.http_code,
          details: error?.error,
        },
        null,
        2,
      ),
    );
    if (error?.stack) console.error(error.stack);
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
