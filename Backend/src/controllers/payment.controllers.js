import { getRazorpayInstance } from "../utils/razorpay.js";
import {History} from "../models/history.models.js";

// Create order in sender account
export const createOrder = async (req, res) => {
  const { amount, userId } = req.body;

  try {
    const razorpay = getRazorpayInstance(
      process.env.RAZORPAY_KEY_ID,
      process.env.RAZORPAY_KEY_SECRET
    );

    const order = await razorpay.orders.create({
      amount, // in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    // Optional: store preliminary order in History (if you want)
    // await History.create({ userId, produceCount: 0, amount: amount / 100 });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Transfer payment to dynamic receiver and store history
export const transferToReceiver = async (req, res) => {
  const { amount, receiver_key_id, receiver_key_secret, fund_account_id, userId, produceCount } =
    req.body;

  try {
    // Initialize Razorpay instance for receiver
    const razorpayReceiver = getRazorpayInstance(
      receiver_key_id,
      receiver_key_secret
    );

    // Create transfer
    const transfer = await razorpayReceiver.payouts.create({
      fund_account: fund_account_id,
      amount,
      currency: "INR",
      mode: "IMPS",
      purpose: "payout",
    });

    // ✅ Store transaction in History
    await History.create({
      userId,                // user who made the payment
      produceCount,          // quantity in Tonnes
      amount: amount / 100,  // store in Rupees
    });

    res.json({ success: true, transfer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
