import { FincodeClientService, FincodeNs, FincodeService } from 'fincode';
import { NextResponse } from 'next/server';

export async function GET(request: Request, other: { params: any }) {
  FincodeService.i.config({
    secretKey: process.env.FINCODE_SK,
    publicKey: process.env.NEXT_PUBLIC_FINCODE_PK
  });
  FincodeClientService.i.config({
    publicKey: process.env.NEXT_PUBLIC_FINCODE_PK
  });

  const { searchParams } = new URL(request.url);
  const order_id = searchParams.get("order_id") ?? '';
  const access_id = searchParams.get("access_id") ?? '';
  const card_id = searchParams.get("card_id") ?? '';
  const customer_id = searchParams.get("customer_id") ?? '';
  const data: FincodeNs.PaymentExecution = {
    access_id,
    pay_type: "Card",
    card_id,
    customer_id,
    method: 1,
    tds2_ret_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/validate/${order_id}`,
  }
  try {
    console.log('paymentExecution', order_id, data);

    const res = await FincodeService.i.paymentExecution(order_id, data);
    console.log("paymentExecution res", res);

    if (res.acs_url) {
      const urlSearch = new URLSearchParams();
      urlSearch.set('url', res.acs_url)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/redirect?${urlSearch.toString()}`)
    }
    return NextResponse.json(res);
  } catch (error: any) {
    console.error(error?.response?.data ?? error)
    throw error?.response?.data ?? error;
  }
}
