import fs from "fs";
import https from "https";
import { NextResponse } from "next/server";
import fetch from "node-fetch";
import path from "path";

type ApplePayValidateBody = {
  validationURL: string;
};
const createApplePaymentSession = async ({
  validationURL,
}: ApplePayValidateBody) => {
  const certPath = path.resolve(
    __dirname,
    "../../../../../../certs/MerchantIDCertificates.pem"
  );
  const cert = fs.readFileSync(certPath, `utf-8`);
  const certKeyPath = path.resolve(
    __dirname,
    "../../../../../../certs/MerchantIDCertificates.key.pem"
  );
  const key = fs.readFileSync(certKeyPath, `utf-8`);
  const sslConfiguredAgent = new https.Agent({
    cert,
    key,
  });

  const body = {
    merchantIdentifier: process.env.NEXT_PUBLIC_APPLE_PAY_MERCHANT_ID, // Your merchant ID. For payment platforms registering merchants through the Apple Pay Web Merchant Registration API, this should be the partnerInternalMerchantIdentifier defined for the each registered merchant.
    displayName: "Mikosea Inc.", // A string of 64 or fewer UTF-8 characters containing the canonical name for your store, suitable for display. This needs to remain a consistent value for the store and shouldn’t contain dynamic values such as incrementing order numbers. Don’t localize the name. Use only characters from the supported character sets in the fonts listed in the table below.
    initiative: "web", // A predefined value that identifies the e-commerce application making the request. For Apple Pay on the web, use “web” for the initiative parameter. For the initiativeContext parameter, provide your fully qualified domain name associated with your Apple Pay Merchant Identity Certificate.
    initiativeContext: process.env.APPLE_PAY_FQDN,
  };
  console.log("APPLE_PAY validation body", body);
  const res = await fetch(`${validationURL}`, {
    method: "POST",
    agent: sslConfiguredAgent,
    body: JSON.stringify(body),
  }).then(async (r) => {
    const res = await r.json();
    if (r.ok) {
      return res;
    }
    console.error("APPLE_PAY Error when validate", res);
    throw new Error(r.statusText);
  });
  return res;
};

export async function POST(request: Request, other: { params: any }) {
  const bodyJson = (await request.json()) as ApplePayValidateBody;
  console.log("bodyJson", bodyJson);
  try {
    const appleSession = await createApplePaymentSession(bodyJson);
    console.log("appleSession", appleSession);

    return NextResponse.json(appleSession);
  } catch (error: any) {
    console.error("createApplePaymentSession error", error);
    return NextResponse.json(
      {
        message: error,
      },
      {
        status: 400,
      }
    );
  }
}
