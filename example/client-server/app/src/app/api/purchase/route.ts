import { getFincodeConfig } from "@/app/api/config/fincode.config";
import { getTdsRetUrl } from "@/utils";
import { ExecutingPaymentRequest, Payment } from "@fincode/node";
import { NextResponse } from "next/server";
import { uid } from "uid";

export type PurchaseDto = Pick<
  ExecutingPaymentRequest,
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
  const paymentService = new Payment(getFincodeConfig())
  const { amount, useSecurity, appUrl, ...paymentData } =
    (await request.json()) as PurchaseDto;
  try {
    const orderId = `o_card_${uid(12)}`;
    const order = await paymentService.create({
      amount: `${amount}`,
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
    const paymentExecutionData: ExecutingPaymentRequest = {
      ...paymentData,
      access_id: order.access_id,
      method: "1",
      ...(useSecurity
        ? {
          tds2_ret_url: getTdsRetUrl(appUrl, orderId),
        }
        : {}),
    };
    const paymentExecutionRes = await paymentService.execute(
      order.id,
      paymentExecutionData
    );
    console.log("==== paymentExecution res", paymentExecutionRes);
    return NextResponse.json({
      order_id: orderId,
      acs_url: (paymentExecutionRes as any).acs_url,
    });
  } catch (error: any) {
    console.error(error);
    const message = JSON.stringify(error);
    return NextResponse.json(
      {
        message,
      },
      { status: 400 }
    );
  }
}
