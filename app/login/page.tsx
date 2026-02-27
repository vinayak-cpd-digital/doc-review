"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import logo from "@/public/copperpod-logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  // If already logged in, redirect
  if (user) {
    router.replace("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 400));

    const user = authenticate(email, password);
    if (!user) {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }

    login(user);
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.07] blur-3xl"
        style={{ backgroundColor: "#be1549" }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.05] blur-3xl"
        style={{ backgroundColor: "#be1549" }}
      />

      <div className="w-full max-w-lg px-6 relative z-10">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div
            className="px-10 pt-12 pb-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, #be1549 0%, #9b1040 100%)",
            }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-xl p-3 shadow-lg">
                <Image
                  src={logo}
                  alt="Copperpod Logo"
                  width={200}
                  height={68}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Contract Agent Platform
            </h1>
            <p className="text-sm mt-2 text-white/70 font-medium">
              Sign in to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-10 py-10 space-y-6">
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in duration-200">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@copperpoddigital.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-transparent transition-all"
                  onFocus={(e) =>
                    (e.target.style.boxShadow =
                      "0 0 0 2px rgba(190, 21, 73, 0.2)")
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  onFocus={(e) =>
                    (e.target.style.boxShadow =
                      "0 0 0 2px rgba(190, 21, 73, 0.2)")
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: isLoading
                  ? "#d1476e"
                  : "linear-gradient(135deg, #be1549 0%, #9b1040 100%)",
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} Copperpod Digital. All rights
          reserved.
        </p>
      </div>
    </div>
  );
}
