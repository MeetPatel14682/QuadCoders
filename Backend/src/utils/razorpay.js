import Razorpay from "razorpay";

export const getRazorpayInstance = (key_id, key_secret) => {
  if (!key_id || !key_secret) {
    throw new Error("Razorpay key_id and key_secret are required");
  }
  return new Razorpay({ key_id, key_secret });
};
