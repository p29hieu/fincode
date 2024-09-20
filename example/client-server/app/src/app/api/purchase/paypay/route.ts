
import { getFincodeConfig } from "@/app/api/config/fincode.config";
import { PurchaseDto } from "@/app/api/purchase/route";
import { getTdsRetUrl } from "@/utils";
import { CreatingPaymentRequest, ExecutingPaymentRequest, Payment } from "@fincode/node";
import { NextResponse } from "next/server";
import { uid } from "uid";

export type PurchaseWithPayPay = { amount: number, appUrl: string }
export async function POST(request: Request, other: { params: any }) {
  const paymentService = new Payment(getFincodeConfig())
  const { amount, appUrl } =
    (await request.json()) as PurchaseWithPayPay;
  try {
    const orderId = `o_paypay${uid(12)}`;
    const order = await paymentService.create({
      amount: `${amount}`,
      job_code: "CAPTURE",
      pay_type: "Paypay",
      client_field_1: "TEST",
      id: orderId,
      td_tenant_name: "MikoSea Inc. Payment testing",
    });
    console.log("==== Order created", order);
    const paymentExecutionRes = await paymentService.execute(
      order.id,
      {
        access_id: order.access_id,
        pay_type: "Paypay",
        redirect_url: `${appUrl}/payment/paypay/success`,
        redirect_type: "1"
      }
    );
    console.log("==== paymentExecution res", paymentExecutionRes);
    console.log("==== Order after executed", await paymentService.retrieve(orderId, { pay_type: "Paypay" }));
    return NextResponse.json({
      order_id: orderId,
      code_url: paymentExecutionRes.code_url,
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
