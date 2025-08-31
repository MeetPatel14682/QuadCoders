"use client";
import React, { useState, useEffect, use } from "react";
import axios from "axios";

const DynamicRazorpayPayment = () => {
  const [amount, setAmount] = useState(100);
  const [receiverKeyId, setReceiverKeyId] = useState("");
  const [receiverKeySecret, setReceiverKeySecret] = useState("");
  const [fundAccountId, setFundAccountId] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [status, setstatus] = useState([])
  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => alert("Razorpay SDK failed to load");
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Razorpay is still loading, try again in a second...");
      return;
    }

    try {
      // 1️⃣ Create order in sender account
      const orderRes = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/payment/create-order`,
        { amount: amount * 100 }
      );
      const order = orderRes.data;

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async (response) => {
          alert("Payment done, now transferring to receiver...");

          // 3️⃣ Trigger transfer to receiver
          const transferRes = await axios.post(
            `${process.env.NEXT_PUBLIC_URL}/payment/transfer`,
            {
              amount: order.amount,
              receiver_key_id: receiverKeyId,
              receiver_key_secret: receiverKeySecret,
              fund_account_id: fundAccountId,
            }
          );

          alert("Transfer result: " + JSON.stringify(transferRes.data));
        },
        prefill: { name: "User", email: "user@example.com" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
   
  useEffect(() => {
    //get status from the backend
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/status`);
        const data=await response.json()
        setstatus(data.data);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
    fetchStatus();
  },[])

  
  useEffect(() => {
    console.log("Status updated:", status);
  const saveStatusHistory = async () => {
    if (!status || status.length === 0) {
      console.log("No status to save");
      return;
    }
    try {
      const updatedStatus = await Promise.all(
        status.map(async (item) => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/history/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: item.userId._id,
                company:item.userId.company,
              produceCount: item.credits,
              amount: item.amount || 10,
            }),
          });

          const data = await response.json();
          console.log("Data saved:", data);

          return data.information?.RazorpayId && data.information?.RazorpaySecret;
        })
      );

      console.log("Updated status results:", updatedStatus);
    } catch (err) {
      console.error("Error saving status history:", err);
    }
  };

  saveStatusHistory();
}, [status]);


  return (
    <div>
      <h1>Dynamic Razorpay Payment</h1>
      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        placeholder="Receiver Key ID"
        value={receiverKeyId}
        onChange={(e) => setReceiverKeyId(e.target.value)}
      />
      <input
        placeholder="Receiver Key Secret"
        value={receiverKeySecret}
        onChange={(e) => setReceiverKeySecret(e.target.value)}
      />
      <input
        placeholder="Receiver Fund Account ID"
        value={fundAccountId}
        onChange={(e) => setFundAccountId(e.target.value)}
      />
      <button onClick={handlePayment}>Pay & Transfer</button>
    </div>
  );
};

export default DynamicRazorpayPayment;
