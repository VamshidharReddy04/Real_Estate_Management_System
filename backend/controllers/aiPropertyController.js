// aiPropertyController.js
// Converts plain-English property search into a MongoDB filter using Anthropic
// Requires Node 18+ (built-in fetch) or install node-fetch for older Node

const Property = require("../models/Property");

const SYSTEM_PROMPT = `You convert a user's plain-English property search into a JSON filter object.

Only output valid JSON. No explanation, no markdown, no code fences — just the JSON object.

Schema fields you can filter on:
- type: "apartment" | "villa" | "plot" | "commercial" | "house" | "land" | "office"
- city: string (e.g. "Gachibowli", "Kondapur")
- bedrooms: number
- price: { "$lte": number } or { "$gte": number } or { "$gte": number, "$lte": number }  (in INR, not lakhs — convert "50L" to 5000000)

If the user doesn't mention a field, omit it from the JSON entirely.

Examples:
User: "2BHK under 50L in Gachibowli"
Output: {"bedrooms": 2, "city": "Gachibowli", "price": {"$lte": 5000000}}

User: "villas above 1 crore"
Output: {"type": "villa", "price": {"$gte": 10000000}}

User: "3 bedroom apartments in Kondapur between 60L and 90L"
Output: {"bedrooms": 3, "type": "apartment", "city": "Kondapur", "price": {"$gte": 6000000, "$lte": 9000000}}`;

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function normalizeAiFilters(rawFilters = {}) {
  const filters =
    rawFilters && typeof rawFilters === "object" ? rawFilters : {};
  const normalized = {};

  if (filters.type) {
    normalized.type = {
      $regex: `^${escapeRegex(String(filters.type).trim())}$`,
      $options: "i",
    };
  }

  if (filters.city) {
    normalized["location.city"] = {
      $regex: `^\\s*${escapeRegex(String(filters.city).trim())}`,
      $options: "i",
    };
  }

  if (
    filters.bedrooms !== undefined &&
    filters.bedrooms !== null &&
    filters.bedrooms !== ""
  ) {
    normalized["features.bedrooms"] = Number(filters.bedrooms);
  }

  if (filters.status) {
    normalized.status = {
      $regex: `^${escapeRegex(String(filters.status).trim())}$`,
      $options: "i",
    };
  }

  if (filters.price && typeof filters.price === "object") {
    normalized.price = {};
    if (filters.price.$gte !== undefined) {
      normalized.price.$gte = Number(filters.price.$gte);
    }
    if (filters.price.$lte !== undefined) {
      normalized.price.$lte = Number(filters.price.$lte);
    }
    if (Object.keys(normalized.price).length === 0) {
      delete normalized.price;
    }
  }

  return normalized;
}

async function parseQueryWithAI(userMessage) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {};
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  const data = await res.json();
  const rawText = data.content?.[0]?.text?.trim();

  try {
    return JSON.parse(rawText);
  } catch (err) {
    console.error("AI returned non-JSON:", rawText);
    return {};
  }
}

exports.aiSearch = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    const rawFilters = await parseQueryWithAI(message);
    const normalizedFilters = normalizeAiFilters(rawFilters);

    const query = {
      isApproved: true,
      isAvailable: true,
      ...normalizedFilters,
    };

    if (Object.keys(normalizedFilters).length === 0) {
      const fallbackText = String(message).trim();
      query.$or = [
        { title: { $regex: escapeRegex(fallbackText), $options: "i" } },
        { description: { $regex: escapeRegex(fallbackText), $options: "i" } },
        {
          "location.city": { $regex: escapeRegex(fallbackText), $options: "i" },
        },
      ];
    }

    const properties = await Property.find(query).limit(20);

    res.json({
      query: message,
      interpretedFilters: normalizedFilters,
      results: properties,
      count: properties.length,
    });
  } catch (err) {
    console.error("AI search error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong processing your search" });
  }
};
