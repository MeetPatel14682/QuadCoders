// models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  receipt: { type: String, required: true },
  amount: { type: Number, required: true },  // in paise
  currency: { type: String, default: "INR" },
  status: { type: String, default: "created" }, // created, paid, failed
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", OrderSchema);
