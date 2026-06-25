"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Map NextAuth error codes to user-friendly messages.
 */
const AUTH_ERRORS = {
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method. Try a different method.",
  OAuthSignin: "Could not start Google sign-in. Please try again.",
  OAuthCallback: "Google sign-in failed. Please try again.",
  EmailSignin:
    "Could not send the magic link. Please check your email and try again.",
  SessionRequired: "Please sign in to continue.",
  Default: "An authentication error occurred. Please try again.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(AUTH_ERRORS[errorParam] || AUTH_ERRORS.Default);
    }
  }, [searchParams]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn("email", {
        email: email.trim(),
        redirect: false,
        callbackUrl: "/board",
      });
      if (result?.error) {
        setError(AUTH_ERRORS.EmailSignin);
        setLoading(false);
      } else {
        setEmailSent(true);
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError("");
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/board" });
  };

  return (
    <main className="relative flex flex-1 items-center justify-center min-h-screen px-4 overflow-hidden bg-[#09090b]">
      {/* Abstract Background Elements matching the image */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.15]">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="dotted-grid"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1"
                fill="currentColor"
                className="text-white/20"
              />
            </pattern>
            <linearGradient
              id="line-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted-grid)" />

          {/* Animated connection lines reminiscent of the design */}
          <motion.path
            d="M 0,300 C 300,300 400,100 700,100"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="hidden lg:block absolute left-0"
          />
          <motion.path
            d="M 100vw,600 C calc(100vw - 300px),600 calc(100vw - 400px),800 calc(100vw - 700px),800"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            className="hidden lg:block absolute right-0"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-105"
      >
        <div className="bg-[#111113]/90 backdrop-blur-2xl border border-[#27272a]/80 rounded-[20px] p-8 shadow-2xl shadow-black/50">
          {/* Header & Animated Logo */}
          <div className="flex flex-col items-center text-center space-y-5 mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              className="relative w-14 h-14 flex items-center justify-center rounded-2xl bg-[#18181b] border border-[#27272a] shadow-inner"
            >
              <div className="absolute inset-0 bg-[#0070f3]/20 blur-xl rounded-full" />
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="#818cf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.path
                  d="M2 17L12 22L22 17"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                />
                <motion.path
                  d="M2 12L12 17L22 12"
                  stroke="#4338ca"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.25, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Welcome Back
              </h1>
              <p className="text-[#a1a1aa] text-sm">
                Sign in to manage your Sambhalo boards
              </p>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 overflow-hidden"
            >
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400 leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}

          {emailSent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#0070f3]/10 mx-auto flex items-center justify-center border border-[#0070f3]/20">
                <Mail className="w-6 h-6 text-[#0070f3]" />
              </div>
              <div>
                <p className="text-base text-white font-medium mb-1">
                  Check your inbox
                </p>
                <p className="text-sm text-[#a1a1aa]">
                  We sent a magic link to{" "}
                  <span className="text-white font-medium">{email}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="mt-4 text-sm text-[#0070f3] hover:text-[#3291ff] transition-colors cursor-pointer"
              >
                Use a different email
              </button>
            </motion.div>
          ) : (
            <div className="space-y-5">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-1">
                  <div className="relative flex items-center group">
                    <Mail className="absolute left-3.5 w-4.5 h-4.5 text-[#52525b] group-focus-within:text-[#0070f3] transition-colors" />
                    <input
                      type="email"
                      placeholder="email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#09090b] border border-[#27272a] text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:ring-1 focus:ring-[#0070f3]/50 focus:border-[#0070f3]/50 transition-all duration-200"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0070f3] text-white text-sm font-medium hover:bg-[#0070f3]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,112,243,0.3)]"
                >
                  {loading ? (
                    <Loader2 className="w-4.5[18px] animate-spin" />
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="grow border-t border-[#27272a]"></div>
                <span className="shrink-0 mx-4 text-[10px] text-[#52525b] uppercase tracking-widest font-medium">
                  OR
                </span>
                <div className="grow border-t border-[#27272a]"></div>
              </div>

              {/* Google sign-in */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#18181b] border border-[#27272a] text-white text-sm font-medium hover:bg-[#27272a]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {googleLoading ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                ) : (
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Continue with Google
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
