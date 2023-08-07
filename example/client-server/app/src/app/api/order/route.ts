import { fincodeServer } from "@/app/api/config/fincode";
import { NextResponse } from "next/server";

export async function POST(request: Request, other: { params: any }) {
  const { searchParams } = new URL(request.url);
  const amount = +(searchParams.get("amount") ?? "0");

  try {
    const order = await fincodeServer.createOrder({
      amount,
      job_code: "CAPTURE",
      pay_type: "Card",
      tds2_type: "2",
      tds_type: "2",
      td_tenant_name: "MikoSea Inc",
      client_field_1: "STATE_abcd",
    });
    console.log("=== order created", order);

    return NextResponse.json(order);
  } catch (error: any) {
    throw error?.response?.data ?? error;
  }
}
