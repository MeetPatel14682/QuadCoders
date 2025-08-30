// app/login/page.jsx  (for Next.js 13+ App Router)
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here...
    console.log("Login submitted ✅");
    router.push("/dashboard"); // Example redirect
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-100 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Logo + Header */}
        <div className="text-center mb-8">
          <img
            src="/logo.svg"
            alt="VerdeChain Logo"
            className="h-12 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your VerdeChain account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Business Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-teal-600 hover:text-teal-500"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
        </form>

        {/* Register + Back Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-teal-600 font-semibold hover:text-teal-500"
            >
              Register here
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
