require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const User = require("../models/User");
const Property = require("../models/Property");

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required to seed sample properties");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const demoUsers = [
    {
      name: "User",
      email: "user@demo.com",
      password: "User@123",
      role: "user",
      phone: "9000000001",
    },
    {
      name: "Agent",
      email: "agent@demo.com",
      password: "Agent@123",
      role: "agent",
      phone: "9000000002",
    },
    {
      name: "Admin",
      email: "admin@demo.com",
      password: "Admin@123",
      role: "admin",
      phone: "9000000003",
    },
  ];

  for (const demo of demoUsers) {
    let user = await User.findOne({ email: demo.email }).select("+password");

    if (!user) {
      const created = await User.create(demo);
      console.log(`Created demo user: ${created.email} (role=${created.role})`);
      continue;
    }

    user.name = demo.name;
    user.role = demo.role;
    user.phone = demo.phone;
    user.isActive = true;
    user.password = demo.password;
    await user.save();
    console.log(`Updated demo user: ${user.email} (role=${user.role})`);
  }

  const agent = await User.findOne({ email: "agent@demo.com", role: "agent" });

  if (!agent) {
    throw new Error("Demo agent user was not found after setup");
  }

  const samples = [
    {
      title: "Modern House in Hyderabad",
      description:
        "Spacious modern independent house in Gachibowli with parking and garden.",
      type: "house",
      status: "sale",
      price: 8500000,
      location: {
        address: "Gachibowli Main Road",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        zipCode: "500032",
      },
      features: {
        bedrooms: 3,
        bathrooms: 3,
        area: 2200,
        areaUnit: "sqft",
        parking: true,
        furnished: "semi-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "Apartment for Rent in Bangalore",
      description: "Well-lit apartment near IT corridor with metro access.",
      type: "apartment",
      status: "rent",
      price: 42000,
      priceUnit: "per_month",
      location: {
        address: "Whitefield Road",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        zipCode: "560066",
      },
      features: {
        bedrooms: 2,
        bathrooms: 2,
        area: 1250,
        areaUnit: "sqft",
        parking: true,
        furnished: "fully-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "Luxury Villa in Mumbai",
      description: "Premium sea-facing villa with private pool and terrace.",
      type: "villa",
      status: "sale",
      price: 34000000,
      location: {
        address: "Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        zipCode: "400050",
      },
      features: {
        bedrooms: 4,
        bathrooms: 5,
        area: 4200,
        areaUnit: "sqft",
        parking: true,
        furnished: "fully-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "Commercial Office Space in Delhi",
      description: "Ready-to-move office floor in central business district.",
      type: "commercial",
      status: "rent",
      price: 180000,
      priceUnit: "per_month",
      location: {
        address: "Connaught Place",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        zipCode: "110001",
      },
      features: {
        bedrooms: 0,
        bathrooms: 2,
        area: 3000,
        areaUnit: "sqft",
        parking: true,
        furnished: "semi-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "Family House in Pune",
      description:
        "Independent family home in Baner with modular kitchen and private parking.",
      type: "house",
      status: "sale",
      price: 9800000,
      location: {
        address: "Baner Main Road",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        zipCode: "411045",
      },
      features: {
        bedrooms: 4,
        bathrooms: 3,
        area: 2600,
        areaUnit: "sqft",
        parking: true,
        furnished: "semi-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "Lakeview House in Chennai",
      description:
        "Peaceful house near the lake with landscaped yard and spacious interiors.",
      type: "house",
      status: "sale",
      price: 11200000,
      location: {
        address: "Velachery Lake View",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        zipCode: "600042",
      },
      features: {
        bedrooms: 4,
        bathrooms: 4,
        area: 2900,
        areaUnit: "sqft",
        parking: true,
        furnished: "fully-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "City Apartment in Hyderabad",
      description: "Smart 2BHK apartment close to metro station and tech hubs.",
      type: "apartment",
      status: "rent",
      price: 36000,
      priceUnit: "per_month",
      location: {
        address: "Madhapur Metro Road",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        zipCode: "500081",
      },
      features: {
        bedrooms: 2,
        bathrooms: 2,
        area: 1180,
        areaUnit: "sqft",
        parking: true,
        furnished: "fully-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "Premium Apartment in Mumbai",
      description:
        "Sea-facing high-rise apartment with clubhouse and gym access.",
      type: "apartment",
      status: "rent",
      price: 92000,
      priceUnit: "per_month",
      location: {
        address: "Worli Sea Face",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        zipCode: "400018",
      },
      features: {
        bedrooms: 3,
        bathrooms: 3,
        area: 1850,
        areaUnit: "sqft",
        parking: true,
        furnished: "semi-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "Garden Villa in Bangalore",
      description:
        "Elegant gated-community villa with private garden and terrace lounge.",
      type: "villa",
      status: "sale",
      price: 28500000,
      location: {
        address: "Sarjapur Road",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        zipCode: "560035",
      },
      features: {
        bedrooms: 4,
        bathrooms: 4,
        area: 3800,
        areaUnit: "sqft",
        parking: true,
        furnished: "fully-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "Modern Villa in Hyderabad",
      description:
        "Contemporary villa with pool deck, skylight living room, and home office.",
      type: "villa",
      status: "sale",
      price: 31500000,
      location: {
        address: "Kokapet Financial District",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        zipCode: "500075",
      },
      features: {
        bedrooms: 5,
        bathrooms: 5,
        area: 4500,
        areaUnit: "sqft",
        parking: true,
        furnished: "fully-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "Retail Shop Space in Pune",
      description:
        "Ground-floor commercial unit suitable for showroom or branded retail outlet.",
      type: "commercial",
      status: "rent",
      price: 125000,
      priceUnit: "per_month",
      location: {
        address: "FC Road Junction",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        zipCode: "411004",
      },
      features: {
        bedrooms: 0,
        bathrooms: 1,
        area: 2100,
        areaUnit: "sqft",
        parking: false,
        furnished: "unfurnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
    {
      title: "IT Office Floor in Bangalore",
      description:
        "Fully serviced office floor with conference rooms and workstation layout.",
      type: "commercial",
      status: "rent",
      price: 260000,
      priceUnit: "per_month",
      location: {
        address: "Outer Ring Road",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        zipCode: "560103",
      },
      features: {
        bedrooms: 0,
        bathrooms: 3,
        area: 4200,
        areaUnit: "sqft",
        parking: true,
        furnished: "fully-furnished",
      },
      images: [
        {
          url: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1200",
        },
      ],
    },
  ];

  for (const sample of samples) {
    const normalizedImages = (sample.images || [])
      .map((image) => {
        if (typeof image === "string") {
          return { url: image, public_id: undefined };
        }

        if (image && image.url) {
          return { url: image.url, public_id: image.public_id };
        }

        return null;
      })
      .filter(Boolean);

    await Property.updateOne(
      { title: sample.title },
      {
        $set: {
          ...sample,
          priceUnit: sample.priceUnit || "total",
          images: normalizedImages,
          agent: agent._id,
          isApproved: true,
          isAvailable: true,
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  const total = await Property.countDocuments({
    isApproved: true,
    isAvailable: true,
  });
  console.log(
    JSON.stringify({ seeded: samples.length, approvedAvailable: total }),
  );

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
