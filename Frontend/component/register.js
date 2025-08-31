"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!form.terms) {
      alert("You must agree to the terms and conditions");
      return;
    }

    try {
      console.log(process.env.NEXT_PUBLIC_URL);
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/register/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data)
      if (!res.ok) {
        toast.error(data.message || "Something went wrong"); // show backend error
      } else {

        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        } else if (data.message?.accessToken) {
          localStorage.setItem("accessToken", data.message.accessToken);
        }

        console.log("Access Token: ", localStorage.getItem('accessToken'))
        router.push("/verification");
      }
    } catch (error) {

      console.log("Token in localStorage:", localStorage.getItem("accessToken"));
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-100 min-h-screen flex items-center justify-center py-12">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <Image
            src="/logo.svg"
            alt="VerdeChain Logo"
            width={48}
            height={48}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">Join VerdeChain</h2>
          <p className="text-gray-600">Register your green hydrogen company</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              required
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
            />
            <label className="ml-3 block text-sm text-gray-700">
              I agree to the{" "}
              <Link href="#" className="text-teal-600 hover:text-teal-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-teal-600 hover:text-teal-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
          >
            Create Account
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-teal-600 font-semibold hover:text-teal-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
