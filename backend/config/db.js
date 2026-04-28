const mongoose = require("mongoose");

// Avoid long buffered waits when Atlas is unreachable.
mongoose.set("bufferCommands", false);

const MAX_RETRIES = Math.max(0, Number(process.env.MONGO_MAX_RETRIES || 3));

const connectDB = async (attempt = 1) => {
  if (!process.env.MONGO_URI) {
    console.warn(
      "⚠️ MONGO_URI is not set. Running without database connection.",
    );
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    if (attempt >= MAX_RETRIES) {
      console.warn(
        `⚠️ MongoDB unavailable after ${attempt} attempt(s). Continuing in degraded mode without DB.`,
      );
      return;
    }

    const retryDelayMs = Math.min(30000, attempt * 5000);
    console.log(`🔄 Retrying MongoDB in ${retryDelayMs / 1000}s...`);
    setTimeout(() => {
      connectDB(attempt + 1);
    }, retryDelayMs);
  }
};

module.exports = connectDB;
