"use client";

import { PurchaseDto } from "@/app/api/purchase/route";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useCallback, useState } from "react";

const onFincodeReady = (
  errorCallback: (error: string) => void,
  options: {
    fincodePk: string;
    onGetCardTokenSuccess: (token: string) => Promise<void>;
  }
) => {
  (window as any).Fincode = (window as any).Fincode || {};

  try {
    const fincode = (window as any).Fincode(options.fincodePk);

    const ui = fincode.ui({ layout: "vertical" });
    ui.create("Tokens", {
      cardNo: "カード番号",
      cvc: "CVC",
      expireYear: "YY",
      expireMonth: "MM",
      colorPlaceHolder: "#E6E6E6",
    });
    ui.mount("fincode", "300");

    const paymentButton = document.getElementById("payment-button");

    if (!paymentButton) {
      return;
    }

    paymentButton.onclick = function (e) {
      try {
        e.preventDefault();
        ui.getFormData().then((result: any) => {
          // create card token
          const card = {
            card_no: result.cardNo, // カード番号
            expire: result.expire, // カード有効期限(yymm)
            holder_name: result.holderName, // カード名義人
            security_code: result.CVC, // セキュリティコード
            number: 1, // トークン発行数, from 1~10
          };
          // https://docs.fincode.jp/js#tag/%E3%82%AB%E3%83%BC%E3%83%89%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E7%99%BA%E8%A1%8C
          fincode.tokens(
            card,
            async function (status: number, response: any) {
              if (200 === status) {
                const token = response?.list?.[0]?.token;
                return await options.onGetCardTokenSuccess(token);
              }
              // リクエストエラー時の処理
              if (Array.isArray(response.errors)) {
                for (const error of response.errors) {
                  errorCallback(error.error_message);
                }
              }
            },
            function (errors: any) {
              if (Array.isArray(errors)) {
                for (const error of errors) {
                  errorCallback(error.error_message);
                }
              }
            }
          );
        });
      } catch (e) {
        console.error("==submitForm", e);
        alert("Something went wrong, please try again!");
      }
    };
  } catch (error) {
    console.log(error);
  }
};

const PaymentWithCard = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [useSecurity, setUseSecurity] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const onGetCardTokenSuccess = useCallback(
    async (cardToken: string) => {
      if (!cardToken) {
        return;
      }
      try {
        const body: PurchaseDto = {
          amount,
          pay_type: "Card",
          token: cardToken,
          useSecurity,
          appUrl: window.location.origin,
        };
        const response = await fetch("/api/purchase", {
          method: "POST",
          body: JSON.stringify(body),
        }).then(async (r) => {
          const data = await r.json();
          if (!r.ok) {
            throw data;
          }
          return data as {
            order_id: string;
            acs_url?: string;
          };
        });
        setOrderId(response.order_id);
        setRedirectUrl(response.acs_url ?? "");
      } catch (error) {
        console.error(error);
        alert(error);
      }
    },
    [amount, useSecurity]
  );

  return (
    <div>
      <Head>
        <title>Payment with card</title>
      </Head>
      <div className="px-12 py-8">
        <input
          onChange={(e) => setAmount(+(e.target.value ?? 0))}
          placeholder="Amount"
          type="number"
          min={0}
          defaultValue={amount}
        />
        <div>
          <div>
            <label htmlFor="order_id">orderId:</label>
          </div>
          <input
            id="order_id"
            disabled
            value={orderId}
            placeholder="order id"
          />
        </div>
        <div className="mt-2">
          <input
            type="checkbox"
            id="use-security"
            onChange={(e) => {
              setUseSecurity(!!e.target.value);
            }}
            defaultChecked={useSecurity}
          />
          <label htmlFor="use-security">Use 3DS2 payment</label>
        </div>

        <div className="h-[620px]">
          <div className="payment-container flex flex-col items-center">
            <form id="fincode-form">
              <div id="fincode" className="mx-auto flex flex-row"></div>
              <div
                id="fincode-errors"
                className="text-mikosea-red text-center text-xs"
              >
                {error}
              </div>
              <div className="flex flex-col gap-2 px-2 py-6 text-xs">
                ※iPhoneをお使いの方は、Safariブラウザを推奨します。
                <button id="payment-button" type="submit">
                  Get card token & payment
                </button>
              </div>

              <div className="fincode-logo flex items-center">
                <div>Powered by</div>
                <div>
                  <Image
                    src="https://secure.test.fincode.jp/assets/images/logos/vi_01.svg"
                    alt="fincode"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <Link href="https://docs.fincode.jp/develop_support/test_resources">
          See the card test
        </Link>

        <Script
          src={process.env.NEXT_PUBLIC_FINCODE_JS}
          onLoad={() =>
            onFincodeReady(setError, {
              fincodePk: process.env.NEXT_PUBLIC_FINCODE_PK ?? "",
              onGetCardTokenSuccess,
            })
          }
        />

        {redirectUrl && (
          <div>
            click here to verify payment
            <a href={redirectUrl} target="_blank">
              {redirectUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
export default PaymentWithCard;
