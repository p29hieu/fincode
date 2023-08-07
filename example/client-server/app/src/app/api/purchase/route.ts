import { fincodeServer } from "@/app/api/config/fincode";
import { getTdsRetUrl } from "@/utils";
import { FincodeNs } from "fincode";
import { NextResponse } from "next/server";

export async function GET(request: Request, other: { params: any }) {
  const { searchParams } = new URL(request.url);
  const order_id = searchParams.get("order_id") ?? "";
  const access_id = searchParams.get("access_id") ?? "";
  const card_id = searchParams.get("card_id") ?? undefined;
  const customer_id = searchParams.get("customer_id") ?? undefined;
  const token = searchParams.get("token") ?? undefined;
  const data: FincodeNs.PaymentExecution = {
    access_id,
    pay_type: "Card",
    card_id,
    customer_id,
    token,
    method: 1,
    tds2_ret_url: getTdsRetUrl(order_id),
  };
  try {
    const res = await fincodeServer.paymentExecution(order_id, data);
    console.log("paymentExecution res", res);

    if (res.acs_url) {
      const urlSearch = new URLSearchParams();
      urlSearch.set("url", res.acs_url);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/redirect?${urlSearch.toString()}`
      );
    }
    return NextResponse.json(res);
  } catch (error: any) {
    console.error(error?.response?.data ?? error);
    return NextResponse.json({
      ...error?.response?.data,
      message: "Error when purchase",
    });
  }
}

export async function POST(request: Request, other: { params: any }) {
  const searchParams = new URLSearchParams(await request.text());
  const order_id = searchParams.get("order_id") ?? "";
  const access_id = searchParams.get("access_id") ?? "";
  const card_id = searchParams.get("card_id") ?? undefined;
  const customer_id = searchParams.get("customer_id") ?? undefined;
  const token = searchParams.get("token") ?? undefined;
  const data: FincodeNs.PaymentExecution = {
    access_id,
    pay_type: "Card",
    card_id,
    customer_id,
    token,
    method: 1,
    tds2_ret_url: getTdsRetUrl(order_id),
  };
  try {
    const res = await fincodeServer.paymentExecution(order_id, data);
    console.log("paymentExecution res", res);

    if (res.acs_url) {
      const urlSearch = new URLSearchParams();
      urlSearch.set("url", res.acs_url);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/redirect?${urlSearch.toString()}`
      );
    }
    return NextResponse.json(res);
  } catch (error: any) {
    console.error(error?.response?.data ?? error);
    return NextResponse.json({
      ...error?.response?.data,
      message: "Error when purchase",
    });
  }
}
