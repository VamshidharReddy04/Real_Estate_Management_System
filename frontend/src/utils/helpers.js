export const formatPrice = (price, unit = "total") => {
  if (!price && price !== 0) return "N/A";
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
  if (unit === "per_month") return `${formatted}/mo`;
  if (unit === "per_year") return `${formatted}/yr`;
  return formatted;
};

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getPropertyIcon = (type) => {
  const icons = {
    house: "🏠",
    apartment: "🏢",
    villa: "🏰",
    commercial: "🏪",
    land: "🌿",
    office: "🏬",
  };
  return icons[type] || "🏠";
};

export const PROPERTY_TYPES = [
  "house",
  "apartment",
  "villa",
  "commercial",
  "land",
  "office",
];
export const PROPERTY_STATUS = ["sale", "rent"];
export const FURNISHED_OPTIONS = [
  "unfurnished",
  "semi-furnished",
  "fully-furnished",
];
export const AMENITIES_LIST = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Security",
  "Power Backup",
  "Lift",
  "Garden",
  "Club House",
  "Children Play Area",
  "CCTV",
  "Water Supply",
  "Internet",
  "Air Conditioning",
  "Intercom",
];

export const truncate = (str, n = 80) =>
  str?.length > n ? str.slice(0, n) + "..." : str;

export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const getAgentDisplayName = (agent, fallback = "Verified Agent") => {
  const name = agent?.name?.trim();
  if (!name) return fallback;
  if (/^demo agent$/i.test(name)) return fallback;
  return name;
};
