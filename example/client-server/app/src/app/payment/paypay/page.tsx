"use client";

import { PurchaseWithPayPay } from "@/app/api/purchase/paypay/route";
import  React, { useState } from "react";

const PaymentWithPayPay = () => {
  const [amount, setAmount] = useState<number>();
  const [error, setError] = useState<string>();

  const createOrder = async () => {
    if (amount) {
      setError(undefined);
      const body: PurchaseWithPayPay = {
        amount,
        appUrl: "https://subtle-bluejay-quietly.ngrok-free.app",
      };
      const response = await fetch("/api/purchase/paypay", {
        method: "POST",
        body: JSON.stringify(body),
      }).then(async (r) => {
        const result = await r.json();
        if (r.ok) {
          return result;
        }
        setError(result.message);
      });
      console.log("===response", response);
      if (response.code_url) {
        window.open(response.code_url, "_blank");
      }
    }
  };
  return (
    <div>
      <h1>Payment with paypay</h1>
      <div>
        <label htmlFor="amount">Amount</label>
        <br />
        <input
          id="amount"
          placeholder="Input amount"
          type="number"
          inputMode="numeric"
          onChange={(e) => setAmount(+e.target.value || 0)}
          min={1}
          max={999999}
          className="mt-2 h-8 w-1/2 text-lg"
        />
        <br />
        <button className="mt-2" onClick={createOrder} disabled={!amount}>
          Execute
        </button>
        <div className="text-red-500">{error}</div>
      </div>
    </div>
  );
};

export default PaymentWithPayPay;
