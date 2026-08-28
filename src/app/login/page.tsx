"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, AlertCircle, Info } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Save mock user to localStorage as specified
    const mockUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: email.trim(),
      name: email.split("@")[0],
      targetExam: "jee-main",
      createdAt: new Date().toISOString(),
      role: "student",
    };

    try {
      localStorage.setItem("exam_saathi_user", JSON.stringify(mockUser));
    } catch {
      // localStorage may fail in private mode
    }

    setTimeout(() => {
      router.push("/dashboard/exams");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FF4D00] text-black flex flex-col justify-between selection:bg-black selection:text-white font-sans">
      {/* Header */}
      <header className="border-brutal-b bg-white p-6 px-8 flex justify-between items-center">
        <Link
          href="/"
          className="font-headline text-2xl tracking-tight flex items-center gap-2 hover:text-[#FF4D00] transition-colors"
        >
          <span>EXAMSAATHI</span>
          <span className="w-2.5 h-2.5 bg-[#FF4D00] inline-block"></span>
        </Link>
        <div className="font-meta text-xs">
          NEED AN ACCOUNT?{" "}
          <Link href="/signup" className="text-[#FF4D00] underline font-bold hover:text-black">
            CREATE ACCOUNT
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto p-6 py-12">
        <div className="border-brutal bg-white p-8 md:p-10 relative">
          <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 font-meta text-[10px] uppercase font-bold">
            AUTH // DEMO SHELL
          </div>

          <span className="font-meta text-xs text-[#FF4D00] font-bold block mb-1">
            [ STUDENT ACCESS PORTAL ]
          </span>
          <h1 className="font-headline text-3xl md:text-4xl text-black mb-2 tracking-tight">
            SIGN IN
          </h1>
          <p className="text-sm text-neutral-600 mb-8 font-medium">
            Enter your credentials to access your exam trends, predictive gap alerts, and formula sheets.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label className="block font-meta text-xs font-bold text-black mb-2">
                EMAIL ADDRESS *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="student@examsaathi.ai"
                  className={`w-full px-4 py-3 border-brutal text-sm bg-neutral-50 text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00] ${
                    errors.email ? "border-red-600 bg-red-50/20" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 font-meta text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-meta text-xs font-bold text-black">
                  PASSWORD *
                </label>
                <span className="font-meta text-[11px] text-neutral-500">MIN 6 CHARS</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border-brutal text-sm bg-neutral-50 text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D00] ${
                    errors.password ? "border-red-600 bg-red-50/20" : ""
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 font-meta text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF4D00] text-black py-4 border-brutal font-headline text-lg hover:bg-black hover:text-[#FF4D00] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "ENTERING DASHBOARD..." : "CONTINUE TO DASHBOARD"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t-2 border-black w-full"></div>
              <span className="bg-white px-3 font-meta text-xs text-neutral-500 uppercase absolute">
                OR
              </span>
            </div>

            {/* Disabled Continue with Google with Tooltip */}
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                type="button"
                disabled
                className="w-full bg-neutral-100 text-neutral-400 py-3.5 border-2 border-neutral-300 font-meta text-xs flex items-center justify-center gap-3 cursor-not-allowed uppercase font-bold"
              >
                <svg className="w-4 h-4 grayscale opacity-50" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>CONTINUE WITH GOOGLE</span>
              </button>

              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 font-meta text-[11px] uppercase border border-black shadow-none whitespace-nowrap z-20 flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-[#FF4D00]" />
                  <span>DEMO ONLY — USE EMAIL/PASSWORD</span>
                </div>
              )}
            </div>
          </form>

          {/* Helper notice */}
          <div className="mt-8 pt-6 border-brutal-t text-center font-meta text-xs text-neutral-500">
            MOCK AUTHENTICATION ACTIVE // DIRECT LOCAL REDIRECT
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-brutal-t bg-black text-white p-6 text-center font-meta text-xs">
        EXAMSAATHI PREDICTIVE PYQ INTELLIGENCE • ALL MOCK DATA LOCAL
      </footer>
    </div>
  );
}
