"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
export default function VerificationPage() {
  const router = useRouter();

  const initial = {
    CIN: "", 
    address: "",
    pancardId: "", 
    phoneNumber: "",
    gstno: "",
    license: "",
    RazorpayId: "",
    RazorpaySecret: "",
    taxId: "",
    owner:"",
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSecret, setShowSecret] = useState(false);

  // Load saved (optional)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("verification_form_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((f) => ({ ...f, ...parsed }));
      }
    } catch (e) {}
  }, []);

  // Persist non-file fields only (files can't be serialized)
  useEffect(() => {
    const toSave = { ...form };
    delete toSave.CIN;
    delete toSave.pancardId;
    localStorage.setItem("verification_form_v1", JSON.stringify(toSave));
  }, [form]);

  const phoneIsValid = (s) => /^[6-9]\d{9}$/.test(s);
  const gstIsValid = (s) => /^[0-9A-Z]{15}$/.test((s || "").toUpperCase());
  const requiredFilled = () =>
    form.CIN &&
    form.pancardId &&
    form.address.trim().length > 0 &&
    phoneIsValid(form.phoneNumber) &&
    form.owner.length>0 &&
    gstIsValid(form.gstno) &&
    form.license.trim().length > 0 &&
    form.RazorpayId.trim().length > 0 &&
    form.RazorpaySecret.trim().length > 0 &&
    form.taxId.trim().length > 0;

  // Count progress (only required fields)
  const progress = useMemo(() => {
    const checks = [
      !!form.CIN,
      !!form.pancardId,
      !!form.owner,
      form.address.trim().length > 0,
      !!form.pancardId,
      phoneIsValid(form.phoneNumber),
      gstIsValid(form.gstno),
      form.license.trim().length > 0,
      form.RazorpayId.trim().length > 0,
      form.RazorpaySecret.trim().length > 0,
      form.taxId.trim().length > 0,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [form]);

  const handleFile = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;
    const file = files[0];
    setForm((p) => ({ ...p, [name]: file }));
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((err) => ({ ...err, [name]: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setTouched((t) => ({ ...t, [name]: true }));
    // Live validate simple rules
    if (name === "phoneNumber") {
      setErrors((err) => ({ ...err, phoneNumber: phoneIsValid(value) ? null : "Enter valid 10-digit Indian phone starting with 6-9" }));
    } else if (name === "gstno") {
      const up = (value || "").toUpperCase();
      setForm((p) => ({ ...p, gstno: up }));
      setErrors((err) => ({ ...err, gstno: gstIsValid(up) ? null : "gstno must be 15 uppercase letters/digits" }));
    } else {
      setErrors((err) => ({ ...err, [name]: value.trim() ? null : `${name} is required` }));
    }
  };

  const validateAll = () => {
    const e = {};
    if (!form.CIN) e.CIN = "Upload Certificate (PDF or Image)";
    if (!form.pancardId) e.pancardId = "Upload Director proof (PDF or Image)";
    if (!form.address || !form.address.trim()) e.address = "Address is required";
    if (!phoneIsValid(form.phoneNumber)) e.phoneNumber = "Enter valid 10-digit phone number";
    if (!gstIsValid(form.gstno)) e.gstno = "gstno must be 15 uppercase letters/digits";
    if (!form.license || !form.license.trim()) e.license = "License is required";
    if (!form.RazorpayId || !form.RazorpayId.trim()) e.RazorpayId = "Razorpay ID is required";
    if (!form.RazorpaySecret || !form.RazorpaySecret.trim()) e.RazorpaySecret = "Razorpay Secret is required";
    if (!form.taxId || !form.taxId.trim()) e.taxId = "Tax ID is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    //final validation
    if (!validateAll()) {
      alert("Please fix errors before submitting");
      return;
    }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/info/information`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(form),
        });
    
        const data = await res.json();
    
        if (res.status < 200 || res.status >= 300) {
          toast.error(data.message || "Something went wrong"); // show backend error
        } else {
          toast.success(data.message || "Submitted Successfully");
          router.push("/login");
        }
      } catch (error) {
        toast.error(error.message);
      }
  };

  // helpers to preview files
  const previewUrl = (file) => (file && file.type?.startsWith("image/") ? URL.createObjectURL(file) : null);

  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-100 min-h-screen flex items-center justify-center py-12 px-4">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <img src="/logo.svg" alt="logo" className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Verification</h1>
            <p className="text-sm text-gray-600">Fill required fields to submit verification — secure & simple.</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <div>Progress</div>
            <div>{progress}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-teal-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
         {/* Certificate of Incorporation (CIN) */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate of Incorporation (CIN) <span className="text-xs text-gray-400">(required)</span>
            </label>
            <input
              id="CIN"
              name="CIN"
              type="text"
              placeholder="Enter CIN (e.g., U72200MH2015PTC123456)"
              value={form.CIN || ""}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
            {errors.Owner && <p className="text-xs text-red-600 mt-2">{errors.Owner}</p>}
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner Name<span className="text-xs text-gray-400">(required)</span>
            </label>
            <input
              id="owner"
              name="owner"
              type="text"
              placeholder="Enter Owner Name"
              value={form.owner || ""}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
            {errors.CIN && <p className="text-xs text-red-600 mt-2">{errors.CIN}</p>}
          </div>

          {/* Address */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Registered Address <span className="text-xs text-gray-400">(required)</span></label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, address: true }))}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-200"
              placeholder="Enter registered address as per incorporation documents"
            />
            {touched.address && errors.address && <p className="text-xs text-red-600 mt-2">{errors.address}</p>}
          </div>

          {/* Director Proof */}
            <div className="bg-gray-50 border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Director Proof (PAN ) <span className="text-xs text-gray-400">(required)</span>
              </label>
              <div className="flex items-center gap-3">
                {/* Dropdown to choose type */}
               

                {/* Input for document number */}
                <input
                  type="text"
                  name="pancardId"
                  placeholder="Enter document number"
                  value={form.pancardId || ""}
                  onChange={handleChange}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>
              {errors.pancardId && <p className="text-xs text-red-600 mt-2">{errors.pancardId}</p>}
            </div>

          {/* phoneNumber & gstno Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-xs text-gray-400">(10-digit)</span></label>
              <input
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, phoneNumber: true }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-200"
                placeholder="e.g. 9123456789"
              />
              {touched.phoneNumber && errors.phoneNumber && <p className="text-xs text-red-600 mt-2">{errors.phoneNumber}</p>}
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">gstno (15 chars)</label>
              <input
                name="gstno"
                type="text"
                value={form.gstno}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, gstno: true }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-200 uppercase"
                placeholder="15 character gstno"
                maxLength={15}
              />
              {touched.gstno && errors.gstno && <p className="text-xs text-red-600 mt-2">{errors.gstno}</p>}
            </div>
          </div>

          {/* License */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">License (type:String)</label>
            <input
              name="license"
              type="text"
              value={form.license}
              onChange={handleChange}
              onBlur={() => setTouched((t) => ({ ...t, license: true }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-200"
              placeholder="Enter license"
            />
            {touched.license && errors.license && <p className="text-xs text-red-600 mt-2">{errors.license}</p>}
          </div>

          {/* Razorpay & Tax */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay ID</label>
              <input
                name="RazorpayId"
                type="text"
                value={form.RazorpayId}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, RazorpayId: true }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-200"
                placeholder="rzp_live_xxxxx"
              />
              {touched.RazorpayId && errors.RazorpayId && <p className="text-xs text-red-600 mt-2">{errors.RazorpayId}</p>}
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Razorpay Secret</label>
              <div className="flex items-center gap-2">
                <input
                  name="RazorpaySecret"
                  type={showSecret ? "text" : "password"}
                  value={form.RazorpaySecret}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, RazorpaySecret: true }))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-200"
                  placeholder="Enter Razorpay secret"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((s) => !s)}
                  className="text-sm text-teal-600 hover:text-teal-500"
                >
                  {showSecret ? "Hide" : "Show"}
                </button>
              </div>
              {touched.RazorpaySecret && errors.RazorpaySecret && <p className="text-xs text-red-600 mt-2">{errors.RazorpaySecret}</p>}
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
              <input
                name="taxId"
                type="text"
                value={form.taxId}
                onChange={handleChange}
                onBlur={() => setTouched((t) => ({ ...t, taxId: true }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-200"
                placeholder="Enter Tax ID"
              />
              {touched.taxId && errors.taxId && <p className="text-xs text-red-600 mt-2">{errors.taxId}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row items-center gap-3 justify-between mt-2">
            <div className="text-sm text-gray-600">
              <strong className={`${requiredFilled() ? "text-teal-700" : "text-yellow-600"}`}>
                {requiredFilled() ? "All required fields valid" : "Required fields missing / invalid"}
              </strong>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setForm(initial);
                  setErrors({});
                  setTouched({});
                  localStorage.removeItem("verification_form_v1");
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={!requiredFilled()}
                className={`px-6 py-2 rounded-md text-white font-medium transition ${
                  requiredFilled() ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Submit Verification
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
