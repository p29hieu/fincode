import { FincodeClientService, FincodeService } from 'fincode';
import { NextResponse } from 'next/server';

export async function POST(request: Request, other: { params: any }) {
  FincodeService.i.config({
    secretKey: process.env.FINCODE_SK,
    publicKey: process.env.NEXT_PUBLIC_FINCODE_PK
  });
  FincodeClientService.i.config({
    publicKey: process.env.NEXT_PUBLIC_FINCODE_PK
  });
  const { searchParams } = new URL(request.url);

  const amount = +(searchParams.get("amount") ?? '0');

  try {
    const order = await FincodeService.i.createOrder({ amount, job_code: "AUTH", pay_type: "Card", tds2_type: "2", tds_type: "2" })
    return NextResponse.json(order);
  } catch (error: any) {
    throw error?.response?.data ?? error;
  }
}