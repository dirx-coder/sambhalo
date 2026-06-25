import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import clientPromise from "@/lib/mongodb";

/**
 * NextAuth.js configuration — shared between the route handler and
 * any server-side `getServerSession()` calls.
 *
 * Uses JWT session strategy so the proxy (which cannot query the DB)
 * can verify authentication via `getToken()`.
 */
export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    ...(process.env.EMAIL_SERVER
      ? [
          EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM || "noreply@example.com",
          }),
        ]
      : []),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    /**
     * JWT callback — persist the user's MongoDB `_id` into the token
     * on initial sign-in. This runs BEFORE the session callback.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    /**
     * Session callback — expose the user's ID on the session object
     * so client and server code can scope data to the authenticated user.
     */
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
