import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Cron job: run every day at 23:59
cron.schedule("59 23 * * *", async () => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  // Only execute if today is the last day of the month
  if (today.getDate() !== lastDay) return;

  console.log("Running end-of-month transfers...");

  try {
    // 1️⃣ Fetch all statuses
    const statusRes = await axios.get(`${process.env.NEXT_PUBLIC_URL}/status`);
    const statusList = statusRes.data.data;

    // 2️⃣ Loop and transfer
    for (const item of statusList) {
      const transferRes = await axios.post(`${process.env.NEXT_PUBLIC_URL}/payment/transfer`, {
        amount: item.amount || 10,
        receiver_key_id: item.userId.RazorpayId,
        receiver_key_secret: item.userId.RazorpaySecret,
        fund_account_id: item.userId.FundAccountId,
      });

      console.log(`Transfer done for ${item.userId.company}:`, transferRes.data);
    }

    console.log("All transfers completed!");
  } catch (err) {
    console.error("Automatic monthly transfer failed:", err);
  }
});
