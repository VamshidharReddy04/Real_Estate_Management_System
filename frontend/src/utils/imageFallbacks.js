const HIGH_RES_BASE = "https://picsum.photos";

const fallbackSeeds = {
  generic: "estate-generic-main",
  hero: "estate-hero-banner",
  cityMumbai: "estate-city-mumbai",
  cityDelhi: "estate-city-delhi",
  cityBangalore: "estate-city-bangalore",
  cityHyderabad: "estate-city-hyderabad",
  cityChennai: "estate-city-chennai",
  cityPune: "estate-city-pune",
  typeApartment: "estate-type-apartment",
  typeHouse: "estate-type-house",
  typeVilla: "estate-type-villa",
  typeCommercial: "estate-type-commercial",
  roomKitchen: "estate-room-kitchen",
  roomBedroom: "estate-room-bedroom",
  roomHall: "estate-room-hall",
};

const seedImage = (seed, width, height) =>
  `${HIGH_RES_BASE}/seed/${seed}/${width}/${height}`;

const toSeedSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const getPropertySeed = (property, fallbackIndex = 0) => {
  const preferredSeed =
    property?._id ||
    property?.id ||
    property?.slug ||
    `${property?.title || "property"}-${property?.location?.city || "city"}`;

  const normalized = toSeedSlug(preferredSeed);
  return normalized || `property-${fallbackIndex || 0}`;
};

export const genericPropertyFallbackImage = seedImage(
  fallbackSeeds.generic,
  1600,
  1000,
);

export const heroBannerImage = "/hero-building.jpg";

export const featuredCityImages = {
  Mumbai:
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1400",
  Delhi:
    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1400",
  Bangalore:
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1400",
  Hyderabad:
    "https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg?auto=compress&cs=tinysrgb&w=1400",
  Chennai:
    "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=1400",
  Pune: "https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=1400",
};

const fallbackByType = {
  apartment: seedImage(fallbackSeeds.typeApartment, 1600, 1000),
  house: seedImage(fallbackSeeds.typeHouse, 1600, 1000),
  villa: seedImage(fallbackSeeds.typeVilla, 1600, 1000),
  commercial: seedImage(fallbackSeeds.typeCommercial, 1600, 1000),
};

const roomFallbacksByType = {
  apartment: {
    kitchen:
      "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1400",
    bedroom:
      "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=1400",
    hall: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1400",
  },
  house: {
    kitchen:
      "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1400",
    bedroom:
      "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1400",
    hall: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1400",
  },
  villa: {
    kitchen:
      "https://images.pexels.com/photos/6585597/pexels-photo-6585597.jpeg?auto=compress&cs=tinysrgb&w=1400",
    bedroom:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1400",
    hall: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1400",
  },
  commercial: {
    kitchen:
      "https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg?auto=compress&cs=tinysrgb&w=1400",
    bedroom:
      "https://images.pexels.com/photos/245240/pexels-photo-245240.jpeg?auto=compress&cs=tinysrgb&w=1400",
    hall: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1400",
  },
};

export const getPropertyFallbackImage = (property, fallbackIndex = 0) => {
  const typeKey = property?.type?.toLowerCase() || "generic";
  const propertySeed = getPropertySeed(property, fallbackIndex);

  return seedImage(`estate-${typeKey}-${propertySeed}`, 1600, 1000);
};

export const getPropertyRoomPreviewImages = (property) => {
  const roomImages =
    property?.images
      ?.map((image) => (typeof image === "string" ? image : image?.url))
      .filter(Boolean) || [];

  const typeKey = property?.type?.toLowerCase() || "apartment";
  const typeRoomFallbacks =
    roomFallbacksByType[typeKey] || roomFallbacksByType.apartment;
  const baseImage = roomImages[0] || getPropertyFallbackImage(property);

  return {
    kitchen: roomImages[1] || typeRoomFallbacks.kitchen || baseImage,
    bedroom: roomImages[2] || typeRoomFallbacks.bedroom || baseImage,
    hall: roomImages[3] || typeRoomFallbacks.hall || baseImage,
  };
};
