import { fincodeServer } from "@/app/api/config/fincode";
import { getTdsRetUrl } from "@/utils";
import { FincodeNs } from "fincode";
import { NextResponse } from "next/server";

export type PurchaseDto = Pick<
  FincodeNs.PaymentExecution,
  "card_id" | "customer_id" | "pay_type" | "token"
> & {
  amount: number;
  useSecurity: boolean;
  appUrl: string;
};

export type PurchaseDtoRes = {
  order_id: string;
  acs_url: string | undefined;
};
export async function POST(request: Request, other: { params: any }) {
  const { amount, useSecurity, appUrl, ...paymentData } =
    (await request.json()) as PurchaseDto;
  try {
    const orderId = `order_test_${Date.now()}`;
    const order = await fincodeServer.createOrder({
      amount,
      job_code: "CAPTURE",
      pay_type: paymentData.pay_type,
      client_field_1: "TEST",
      id: orderId,
      td_tenant_name: "MikoSea Inc. Payment testing",
      ...(useSecurity
        ? {
            tds_type: "2",
            tds2_type: "3",
          }
        : {
            tds_type: "0",
          }),
    });
    console.log("==== Order created", order);
    const paymentExecutionData: FincodeNs.PaymentExecution = {
      ...paymentData,
      access_id: order.access_id,
      method: 1,
      ...(useSecurity
        ? {
            tds2_ret_url: getTdsRetUrl(appUrl, orderId),
          }
        : {}),
    };
    console.log("==== PaymentExecution data", paymentExecutionData);

    const paymentExecutionRes = await fincodeServer.paymentExecution(
      order.id,
      paymentExecutionData
    );
    console.log("==== paymentExecution res", paymentExecutionRes);
    return NextResponse.json({
      order_id: orderId,
      acs_url: paymentExecutionRes.acs_url,
    });
  } catch (error: any) {
    console.error(error?.response?.data ?? error);
    const message = JSON.stringify(error?.response?.data);
    return NextResponse.json(
      {
        message,
      },
      { status: 400 }
    );
  }
}
