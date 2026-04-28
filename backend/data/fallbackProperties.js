const fallbackProperties = [
  {
    _id: "fallback-1",
    title: "Modern House in Hyderabad",
    description:
      "Spacious modern independent house in Gachibowli with parking and garden.",
    type: "house",
    status: "sale",
    price: 8500000,
    priceUnit: "total",
    location: {
      city: "Hyderabad",
      state: "Telangana",
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      areaUnit: "sqft",
    },
    images: [
      {
        url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
    agent: { name: "Verified Agent" },
    isApproved: true,
    isAvailable: true,
    views: 0,
  },
  {
    _id: "fallback-2",
    title: "Apartment for Rent in Bangalore",
    description: "Well-lit apartment near IT corridor with metro access.",
    type: "apartment",
    status: "rent",
    price: 42000,
    priceUnit: "per_month",
    location: {
      city: "Bangalore",
      state: "Karnataka",
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1250,
      areaUnit: "sqft",
    },
    images: [
      {
        url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
    agent: { name: "Verified Agent" },
    isApproved: true,
    isAvailable: true,
    views: 0,
  },
  {
    _id: "fallback-3",
    title: "Luxury Villa in Mumbai",
    description: "Premium sea-facing villa with private pool and terrace.",
    type: "villa",
    status: "sale",
    price: 34000000,
    priceUnit: "total",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      area: 4200,
      areaUnit: "sqft",
    },
    images: [
      {
        url: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
    agent: { name: "Verified Agent" },
    isApproved: true,
    isAvailable: true,
    views: 0,
  },
  {
    _id: "fallback-4",
    title: "Commercial Office Space in Delhi",
    description: "Ready-to-move office floor in central business district.",
    type: "commercial",
    status: "rent",
    price: 180000,
    priceUnit: "per_month",
    location: {
      city: "Delhi",
      state: "Delhi",
    },
    features: {
      bedrooms: 0,
      bathrooms: 2,
      area: 3000,
      areaUnit: "sqft",
    },
    images: [
      {
        url: "https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg?auto=compress&cs=tinysrgb&w=1200",
      },
    ],
    agent: { name: "Verified Agent" },
    isApproved: true,
    isAvailable: true,
    views: 0,
  },
];

module.exports = fallbackProperties;
