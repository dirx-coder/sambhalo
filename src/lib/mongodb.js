import { MongoClient } from "mongodb";

/**
 * Native MongoClient connection utility — required by the NextAuth MongoDB Adapter.
 *
 * The adapter expects a MongoClient instance (not Mongoose), so we maintain
 * a separate, cached connection here. This client connects to the same
 * MongoDB Atlas cluster but is used exclusively for authentication concerns
 * (Users, Accounts, Sessions, VerificationTokens).
 *
 * @returns {Promise<MongoClient>} A connected MongoClient instance.
 */

const MONGODB_URI = process.env.MONGODB_URI;

const options = {};

let client;
let clientPromise;

if (!MONGODB_URI) {
  // Defer the error — don't crash at module load time (e.g. during `next build`).
  // Instead, return a promise that rejects when actually used.
  clientPromise = Promise.reject(
    new Error("❌ MONGODB_URI is not defined. Please add it to your .env.local file.")
  );
  // Prevent unhandled rejection warning during build
  clientPromise.catch(() => {});
} else if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so the MongoClient is not
  // repeatedly instantiated during hot-reloads.
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a fresh client instance.
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export default clientPromise;
