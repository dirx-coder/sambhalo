import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

/**
 * Helper to get the authenticated user's ID from the session.
 * Returns null if not authenticated.
 */
export async function getAuthUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

/**
 * Standard JSON error response.
 */
export function errorResponse(message, status = 400) {
  return Response.json({ error: message }, { status });
}

/**
 * Validate that a string is a valid MongoDB ObjectId.
 * Returns true if valid, false otherwise.
 */
export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
