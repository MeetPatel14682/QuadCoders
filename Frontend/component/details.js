"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  // --- mock company data (replace with real API data) ---
  const company = {
    name: "Sample Green Hydrogen Pvt Ltd",
    owner: "Asha Gupta",
    months: [
      { id: "2025-05", label: "May 2025", producedKg: 3200, creditRs: 32000, collectedOn: "2025-05-12" },
      { id: "2025-06", label: "Jun 2025", producedKg: 4100, creditRs: 41000, collectedOn: "2025-06-05" },
      { id: "2025-07", label: "Jul 2025", producedKg: 4800, creditRs: 48000, collectedOn: "2025-07-02" },
      { id: "2025-08", label: "Aug 2025", producedKg: 5300, creditRs: 53000, collectedOn: null },
    ],
    milestones: [
      {
        id: 1,
        title: "Commissioning Completed",
        achievedOn: "2025-05-12",
        creditRs: 10000,
        status: "Completed",
      },
      {
        id: 2,
        title: "First Month Production >= 3t",
        achievedOn: "2025-06-05",
        creditRs: 15000,
        status: "Completed",
      },
      {
        id: 3,
        title: "NABL Meter Calibration",
        achievedOn: "2025-07-02",
        creditRs: 12000,
        status: "Completed",
      },
      {
        id: 4,
        title: "Environmental Compliance Audit",
        achievedOn: null,
        creditRs: 20000,
        status: "Pending",
      },
    ],
  };

  const [selectedMonthId, setSelectedMonthId] = useState(company.months[company.months.length - 1].id);

  const selectedMonth = useMemo(
    () => company.months.find((m) => m.id === selectedMonthId) || company.months[0],
    [selectedMonthId]
  );

  const totalProduced = useMemo(() => company.months.reduce((s, m) => s + m.producedKg, 0), []);
  const totalCredits = useMemo(() => company.milestones.reduce((s, m) => s + (m.creditRs || 0), 0), []);

  // Group milestones by achievedOn date (excluding null)
  const milestonesByDate = useMemo(() => {
    const groups = {};
    company.milestones.forEach((ms) => {
      if (!ms.achievedOn) return;
      if (!groups[ms.achievedOn]) groups[ms.achievedOn] = [];
      groups[ms.achievedOn].push(ms);
    });
    // convert to sorted array of { date, items }
    return Object.keys(groups)
      .sort((a, b) => (a < b ? 1 : -1)) // newest first
      .map((date) => ({ date, items: groups[date] }));
  }, []);

  // CSV export (simple)
  const downloadCSV = () => {
    const headers = ["Month", "Produced (kg)", "Credit (₹)", "Collected On"];
    const rows = company.months.map((m) => [m.label, m.producedKg, m.creditRs, m.collectedOn || "-"]);
    const milestoneHeaders = ["Milestone", "Status", "Achieved On", "Credit (₹)"];
    const milestoneRows = company.milestones.map((ms) => [ms.title, ms.status, ms.achievedOn || "-", ms.creditRs]);

    let csv = "";
    csv += headers.join(",") + "\n";
    rows.forEach((r) => (csv += r.join(",") + "\n"));
    csv += "\n";
    csv += milestoneHeaders.join(",") + "\n";
    milestoneRows.forEach((r) => (csv += r.join(",") + "\n"));

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${company.name.replace(/\s+/g, "_")}_report.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // prepare chart data from months
  const chartData = company.months.map((m) => ({
    name: m.label.split(" ")[0], // e.g., "May"
    producedKg: m.producedKg,
    creditRs: m.creditRs,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-gray-50 p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-sm text-gray-600">Owner: <span className="font-medium text-gray-800">{company.owner}</span></p>
            <p className="text-sm text-gray-600 mt-1">Total produced: <span className="font-semibold text-green-600">{totalProduced.toLocaleString()} kg</span></p>
          </div>

          <div className="flex items-center gap-3">
            <select value={selectedMonthId} onChange={(e) => setSelectedMonthId(e.target.value)} className="px-4 py-2 border rounded-lg bg-white">
              {company.months.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>

            <button onClick={downloadCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
              Export CSV
            </button>
          </div>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm text-gray-500">Produced (selected month)</h3>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{selectedMonth.producedKg.toLocaleString()}</span>
              <span className="text-sm text-gray-500">kg</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Month: {selectedMonth.label}</p>
            <p className="text-xs text-gray-500 mt-1">Collected on: {selectedMonth.collectedOn || "—"}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm text-gray-500">Credits earned (selected month)</h3>
            <div className="mt-3">
              <span className="text-2xl font-bold text-emerald-600">₹ {selectedMonth.creditRs.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Based on milestone rules</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-sm text-gray-500">Total subsidy credits (milestones)</h3>
            <div className="mt-3">
              <span className="text-2xl font-bold text-indigo-700">₹ {totalCredits.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Sum of milestone credits</p>
          </div>
        </div>

        {/* === Added Chart Section: H2 Produced (bar) & Credits (line) in same theme === */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Production & Credits Overview</h3>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ef" />
                <XAxis dataKey="name" tick={{ fill: "#374151" }} />
                <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => v} tick={{ fill: "#374151" }} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `₹${v/1000}k`} tick={{ fill: "#374151" }} />
                <Tooltip formatter={(value, name) => name === "creditRs" ? `₹ ${value.toLocaleString()}` : `${value} kg`} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: 8 }} />
                <Bar yAxisId="left" dataKey="producedKg" name="Produced (kg)" barSize={36} fill="#10b981" radius={[6,6,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="creditRs" name="Credits (₹)" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
