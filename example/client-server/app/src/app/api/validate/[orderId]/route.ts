import { FincodeClientService, FincodeService } from 'fincode';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  FincodeService.i.config({
    secretKey: process.env.FINCODE_SK,
    publicKey: process.env.NEXT_PUBLIC_FINCODE_PK
  });
  FincodeClientService.i.config({
    publicKey: process.env.NEXT_PUBLIC_FINCODE_PK
  });
  const bodyText = await request.text();

  const bodyParam = new URLSearchParams(bodyText)
  const param = bodyParam.get('param') ?? ''
  const event = bodyParam.get('event') ?? ''

  const { searchParams } = new URL(request.url);
  const access_id = searchParams.get("MD") ?? '';
  const { orderId } = params
  console.log("validate", { bodyText, searchParams, params });


  try {
    const get3DS2Result = await FincodeClientService.i.get3DS2Result(access_id)
    console.log("get3DS2Result", get3DS2Result);
  } catch (error: any) {
    console.error("get3DS2Result error", error?.response?.data)
  }

  if (['3DSMethodFinished', '3DSMethodSkipped'].includes(event)) {
    try {
      const run3DS2Authentication = await FincodeService.i.run3DS2Authentication(access_id, { param: `${process.env.NEXT_PUBLIC_APP_URL}/api/validate/${orderId}` })
      console.log('run3DS2Authentication', access_id, run3DS2Authentication);

      const { challenge_url } = run3DS2Authentication;
      if (challenge_url) {
        const urlSearch = new URLSearchParams()
        urlSearch.set('url', challenge_url)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/redirect?${urlSearch.toString()}`)
      }
    }
    catch (error: any) {
      console.error("run3DS2Authentication error", error?.response?.data ?? error)
      return NextResponse.json({ message: "run3DS2Authentication error, Please wait webhook", error: error?.response?.data ?? error })
    }
  }
  if (['AuthResultReady'].includes(event)) {
    try {
      await FincodeService.i.paymentAfterAuthentication(orderId, {
        access_id,
        pay_type: "Card",
      });
    } catch (error: any) {
      return NextResponse.json({ message: "AuthResultReady error", error: error?.response?.data ?? error })
    }
  }
  return NextResponse.json({ message: "Please wait webhook" })
}