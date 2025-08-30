// components/Navbar.js
"use client"
import Link from "next/link";

export default function Navbar(){
  return (
     <header className="fixed w-full bg-white/95 backdrop-blur-lg shadow-sm z-50">
            <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <img src="/logo.svg" alt="VerdeChain Logo" className="h-10" />
                <h1 className="text-2xl font-bold text-green-700">VerdeChain</h1>
              </div>
              <div className="space-x-4">
                <Link href="#about" className="px-6 py-2 text-green-600 hover:text-green-700 transition font-medium">
                  About Us
                </Link>
                <Link href="/login" className="px-6 py-2 text-green-600 border border-green-600 rounded-full hover:bg-green-50 transition">
                  Login
                </Link>
                <Link href="/register" className="px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition">
                  Register
                </Link>
              </div>
            </nav>
          </header>
  );
}
