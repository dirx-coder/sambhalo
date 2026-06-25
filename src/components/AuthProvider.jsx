"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Wraps the app with NextAuth's SessionProvider so `useSession()`
 * is available in all client components.
 */
export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}