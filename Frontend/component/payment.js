"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const DynamicRazorpayPayment = () => {
  const [amount, setAmount] = useState(100); // number
  const [receiverKeyId, setReceiverKeyId] = useState("");
  const [receiverKeySecret, setReceiverKeySecret] = useState("");
  const [fundAccountId, setFundAccountId] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [data,setdata]=useState({"RazorpayId":"","RazorpaySecret":"","fundAccountId":"","amount":100})
  // Raw status array from backend (original payload .data[])
  const [status, setStatus] = useState([]);

  // Extracted receiver records: [{ credit, razorpayId, razorpaySecret, userId, company }, ...]
  const [receivers, setReceivers] = useState([]);

  // Load Razorpay script once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error("Razorpay SDK failed to load");
      alert("Razorpay SDK failed to load");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch status from backend (runs once)
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/status`);
        const json = await resp.json();
        const items = json.data || [];
        setStatus(items);

        // Extract required fields and store in receivers state
        const extracted = items.map((it) => ({
          credit: it.credits ?? 0,
          razorpayId: it.RazorpayId ?? it.userId?.RazorpayId ?? "",
          razorpaySecret: it.RazorpaySecret ?? "",
          userId: it.userId?._id ?? "",
          company: it.userId?.company ?? "",
          // keep original id if you want reference
          statusRecordId: it._id ?? "",
        }));

        setReceivers(extracted);
      } catch (err) {
        console.error("Error fetching status:", err);
      }
    };

    fetchStatus();
  }, []);

  // Example: run once when receivers populate — you can adapt this to save history or open UI
  useEffect(() => {
    if (!receivers || receivers.length === 0) return;
    console.log("Receivers loaded:", receivers);

    // Optional: automatically populate inputs (for demo). If multiple receivers exist, you might want to pick one.
    // Here we choose the first receiver as default for the UI inputs:
    const first = receivers[0];
    if (first) {
      // Only set these to UI inputs for convenience in demo; in production, do transfers on server
      if (!receiverKeyId) setReceiverKeyId(first.razorpayId);
      if (!receiverKeySecret) setReceiverKeySecret(first.razorpaySecret);
      if (!fundAccountId) setFundAccountId(""); // if your API returned fundAccountId, map it above
    }

    // Example of storing to local variables (in-memory)
    // If you really need simple variables (not state), you can access them via receivers var below.
    // DO NOT store secrets to localStorage/sessionStorage.
  }, [receivers]);

  // Save status history to server — this keeps the previous behavior of posting /history for each record
  const saveStatusHistory = async () => {
    if (!status || status.length === 0) {
      console.log("No status to save");
      return;
    }
    try {
      const results = await Promise.all(
        status.map(async (item) => {
          // defensive checks
          const userId = item.userId?._id;
          const company = item.userId?.company ;
          const produceCount = item.credits ?? 0;
          const amount = item.amount ?? 10;

          if (!userId) {
            console.warn("Skipping save for item without userId:", item);
            return null;
          }

          const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              company,
              produceCount: produceCount,
              amount: amount,
            }),
          });

          const data = await resp.json();
          console.log("Saved history response:", data);
          return data;
        })
      );

      console.log("All history saves completed:", results);
    } catch (err) {
      console.error("Error saving status history:", err);
    }
  };

  // Optional: trigger saveStatusHistory automatically after first load:
  useEffect(() => {
    if (status.length > 0) {
      // call it once — comment out if you don't want automatic posting
      saveStatusHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Payment & transfer flow (keeps your existing logic, but handles amount as number)
  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Razorpay is still loading, try again...");
      return;
    }

    try {
      // create order on your backend
      const orderRes = await axios.post(`${process.env.NEXT_PUBLIC_URL}/payment/create-order`, {
        amount: data.amount, // paise
      });
      const order = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        order_id: order.id,
        handler: async (response) => {
          alert("Payment completed. Initiating transfer to receiver...");

          // Trigger transfer on backend — do NOT send receiver secret from client in production
          const transferRes = await axios.post(`${process.env.NEXT_PUBLIC_URL}/payment/transfer`, {
            amount: order.amount,
            receiver_key_id: data.RazorpayId ,
            receiver_key_secret: data.RazorpaySecret,
            fund_account_id: data.fundAccountId ,
          });

          alert("Transfer result: " + JSON.stringify(transferRes.data));
        },
        prefill: { name: "User", email: "user@example.com" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert(err?.message || "Payment failed");
    }
  };

  const payment=async()=>{
   //For payment and transfer
   status.map(async(item)=>{
    console.log(item)
    setdata({"RazorpayId":item.userId.RazorpayId,"RazorpaySecret":item.userId.RazorpaySecret,"fundAccountId":item.userId.FundAccountId,"amount":item.amount})
      await handlePayment()
   })
}


  return (
   <>
   <h1>Click the Below button</h1>
      
        <button onClick={()=>payment()} className="px-4 py-2 bg-blue-500 text-white rounded">
            Pay & Transfer
        </button>
</>
  );
};

export default DynamicRazorpayPayment;