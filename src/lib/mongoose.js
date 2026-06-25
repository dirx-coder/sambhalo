import mongoose from "mongoose";

/**
 * Mongoose connection utility for business logic (Boards, Columns, Tasks).
 *
 * Uses a cached connection stored on the Node.js global object to prevent
 * creating multiple connections during hot-reloads in development.
 *
 * @returns {Promise<typeof mongoose>} The Mongoose instance.
 */

/**
 * Global cache to maintain the Mongoose connection across hot-reloads
 * in development. In production, this is simply used once.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "❌ MONGODB_URI is not defined. Please add it to your .env.local file."
    );
  }

  // If we already have a connection, return it immediately.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is being established, wait for it.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected via Mongoose");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
