import { fincodeServer } from "@/app/api/config/fincode";
import { fincodeClient } from "@/utils";
import { NextResponse } from "next/server";
import { FincodeNs } from "fincode";

const acquire3DS2 = async (access_id: string) => {
  try {
    const acquire3DS2Result = await fincodeClient.acquire3DS2Result(access_id);
    console.log("acquire3DS2Result", acquire3DS2Result);
  } catch (error: any) {
    console.error("acquire3DS2Result error", error?.response?.data);
  }
};

const paymentAfterAuthentication = async (
  order_id: string,
  data: FincodeNs.PaymentAfterAuthentication
) => {
  try {
    const res = await fincodeServer.paymentAfterAuthentication(order_id, data);
    console.log("paymentAfterAuthentication res", res);
  } catch (error: any) {
    return NextResponse.json({
      message: "paymentAfterAuthentication error",
      error: error?.response?.data ?? error,
    });
  }
};

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const bodyText = await request.text();

  const bodyParam = new URLSearchParams(bodyText);
  const event = bodyParam.get("event") ?? "";
  const param = bodyParam.get("param") ?? "";

  const { searchParams } = new URL(request.url);
  const access_id = searchParams.get("MD") ?? "";
  const appUrl = searchParams.get("appUrl") ?? ""; // require name appURL, see in getTdsRetUrl
  const { orderId } = params;
  console.log("validate", { bodyText, searchParams, params });

  const order = await fincodeServer.getPaymentsId(orderId);
  if (["3DSMethodFinished", "3DSMethodSkipped"].includes(event)) {
    try {
      const run3DS2Authentication =
        await fincodeServer.perform3DS2Authentication(access_id, {
          param,
        });
      console.log("run3DS2Authentication", access_id, run3DS2Authentication);

      const { challenge_url } = run3DS2Authentication;
      if (challenge_url) {
        const urlSearch = new URLSearchParams();
        urlSearch.set("url", challenge_url);
        return NextResponse.redirect(
          `${appUrl}/redirect?${urlSearch.toString()}`
        );
      } else {
        await paymentAfterAuthentication(orderId, {
          access_id: order.access_id,
          pay_type: order.pay_type,
        });
      }
    } catch (error: any) {
      console.error(
        "run3DS2Authentication error",
        error?.response?.data ?? error
      );
      return NextResponse.json({
        message: "run3DS2Authentication error",
        error: error?.response?.data ?? error,
      });
    }
  }
  if (["AuthResultReady"].includes(event)) {
    await acquire3DS2(access_id);
    await paymentAfterAuthentication(orderId, {
      access_id: order.access_id,
      pay_type: order.pay_type,
    });
  }
  return NextResponse.json({
    message: "Purchase success!",
    detail: `${process.env.NEXT_PUBLIC_FINCODE_DASHBOARD_URL}/payment/Card/${orderId}`,
  });
}
