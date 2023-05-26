import { FincodeClientService, FincodeService } from 'fincode';
import { NextResponse } from 'next/server';

export async function POST(request: Request, other: { params: any }) {
  try {
    FincodeService.i.config({
      secretKey: process.env.FINCODE_SK,
      publicKey: process.env.NEXT_PUBLIC_FINCODE_PK
    });
    FincodeClientService.i.config({
      publicKey: process.env.NEXT_PUBLIC_FINCODE_PK
    });
    console.log("webhook POST");

    console.log('url', request.url);
    const body = await request.json();
    console.log('bodytext', body);

    // confirm payment
    return NextResponse.json({
      message: "success"
    });
  } catch (error: any) {
    console.error(error?.response?.data ?? error)
    throw error?.response?.data ?? error
  }
}

export async function GET(request: Request, other: { params: any }) {
  try {
    FincodeService.i.config({
      secretKey: process.env.FINCODE_SK,
      publicKey: process.env.NEXT_PUBLIC_FINCODE_PK
    });
    FincodeClientService.i.config({
      publicKey: process.env.NEXT_PUBLIC_FINCODE_PK
    });
    console.log("webhook GET");

    console.log('url', request.url);
    console.log('other', other);
    const body = await request.json();
    console.log('bodytext', body);

    return NextResponse.json({
      message: "success"
    });
  } catch (error: any) {
    console.error(error?.response?.data ?? error)
    throw error?.response?.data ?? error
  }
}
