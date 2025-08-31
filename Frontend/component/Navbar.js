// components/Navbar.js
"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [accessToken, setAccessToken] = useState(null);
  const router = useRouter();
  const [count, setcount] = useState(0)
  // ✅ Load token from localStorage after component mounts
  useEffect(() => {
       const token =localStorage.getItem("accessToken");
       setTimeout(() => {
        
         setAccessToken(token);
       }, 3000);
       console.log(accessToken)
       
},[count]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null); // update state
    router.push("/login"); // redirect to login page
  };

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-lg shadow-sm z-50">
    
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link href={"/"}>
          <div className="flex items-center space-x-3 cursor-pointer">
            <img src="/logo.svg" alt="VerdeChain Logo" className="h-10" />
            <h1 className="text-2xl font-bold text-green-700">VerdeChain</h1>
          </div>
        </Link>

        <div className="space-x-4">
          {!accessToken ? (
            <>
              <Link
                href="/login"
                className="px-6 py-2 text-green-600 border border-green-600 rounded-full hover:bg-green-50 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={logout}
                className="px-6 py-2 rounded-full bg-green-500 text-white font-semibold shadow-md hover:bg-red-500 hover:shadow-lg transition-all duration-300"
              >
                Logout
              </button>


            </>
          )}
        </div>
      </nav>
    </header>
  );
}
