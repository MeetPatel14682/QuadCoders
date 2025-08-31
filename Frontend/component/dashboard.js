// app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const historyRes = await fetch("http://localhost:3000/history");
        const statusRes = await fetch("http://localhost:3000/status");

        if (historyRes.ok) setHistory(await historyRes.json());
        if (statusRes.ok) setStatus(await statusRes.json());
      } catch (err) {
        console.error("Error fetching:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 p-8 text-white">
      {/* Dashboard Title */}
      <motion.h1
        className="text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Dashboard
      </motion.h1>

      {/* Status Section */}
      {status && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md mb-12"
        >
          {/* Section Heading */}
          <h2 className="text-2xl font-bold mb-6">Status Overview</h2>

          {/* Row Layout */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
            {/* Company Info */}
            <div>
              <p className="text-sm text-gray-300">Company</p>
              <p className="text-lg font-semibold">{status.companyName}</p>
              <p className="text-sm text-gray-400">{status.email}</p>
            </div>

            {/* Credit Amount */}
            <div>
              <p className="text-sm text-gray-300">Credit Amount</p>
              <p className="text-2xl font-bold text-green-400">
                {status.currentAmount?.toLocaleString()}
              </p>
            </div>

            {/* Month */}
            <div>
              <p className="text-sm text-gray-300">Month</p>
              <p className="text-lg">{status.month}</p>
            </div>

            {/* Year */}
            <div>
              <p className="text-sm text-gray-300">Year</p>
              <p className="text-lg">{status.year}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/10 rounded-xl shadow-lg p-6 backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="p-3">User ID</th>
                <th className="p-3">Products</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <motion.tr
                  key={idx}
                  className="border-t border-gray-600 hover:bg-white/5 transition"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <td className="p-3">{item.userId}</td>
                  <td className="p-3">{item.productCount}</td>
                  <td className="p-3">₹{item.amount?.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
