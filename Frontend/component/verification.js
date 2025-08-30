"use client";
import { useState } from "react";

export default function VerificationPage() {
  const [formData, setFormData] = useState({
    certificate: null,
    address: "",
    directorProof: null,
    contact: "",
    gstin: "",
    license: "",
    razorpayId: "",
    razorpaySecret: "",
    taxId: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Company Verification Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Certificate of Incorporation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate of Incorporation (CIN) — Upload PDF/Image
            </label>
            <input
              type="file"
              name="certificate"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              required
              className="block w-full border rounded-md p-2"
            />
          </div>

          {/* Registered Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Registered Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="block w-full border rounded-md p-2"
              placeholder="Enter registered address"
            />
          </div>

          {/* Director PAN / Proof */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Director PAN / Any Valid Proof (Upload)
            </label>
            <input
              type="file"
              name="directorProof"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleChange}
              required
              className="block w-full border rounded-md p-2"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              pattern="[0-9]{10}"
              required
              className="block w-full border rounded-md p-2"
              placeholder="Enter 10-digit phone number"
            />
          </div>

          {/* GSTIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GSTIN (15 Characters)
            </label>
            <input
              type="text"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              pattern="^[0-9A-Z]{15}$"
              required
              className="block w-full border rounded-md p-2 uppercase"
              placeholder="Enter 15 character GSTIN"
            />
          </div>

          {/* License */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License
            </label>
            <input
              type="text"
              name="license"
              value={formData.license}
              onChange={handleChange}
              required
              className="block w-full border rounded-md p-2"
              placeholder="Enter license"
            />
          </div>

          {/* Razorpay ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razorpay ID
            </label>
            <input
              type="text"
              name="razorpayId"
              value={formData.razorpayId}
              onChange={handleChange}
              required
              className="block w-full border rounded-md p-2"
              placeholder="Enter Razorpay ID"
            />
          </div>

          {/* Razorpay Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razorpay Secret
            </label>
            <input
              type="password"
              name="razorpaySecret"
              value={formData.razorpaySecret}
              onChange={handleChange}
              required
              className="block w-full border rounded-md p-2"
              placeholder="Enter Razorpay Secret"
            />
          </div>

          {/* Tax ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID
            </label>
            <input
              type="text"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              required
              className="block w-full border rounded-md p-2"
              placeholder="Enter Tax ID"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition"
          >
            Submit Verification
          </button>
        </form>
      </div>
    </div>
  );
}
