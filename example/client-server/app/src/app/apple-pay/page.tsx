"use client";

import Head from "next/head";
import Script from "next/script";
import { useCallback, useState } from "react";

import { PurchaseDto, PurchaseDtoRes } from "@/app/api/purchase/route";
import { useRouter } from "next/dist/client/router";

const onAppleJsReady = async (options: {
  label: string;
  amount: number;
  onGetCardTokenSuccess: (token: string) => Promise<void>;
}) => {
  const APPLE_PAY_SUPPORTED_VERSION = 3; /* Apple PayJSのサポートバージョン */
  const APPLE_PAY_BUTTON_ID = "apple-pay-button"; /* Apple Payボタン要素のID */
  const applePayButton = document.getElementById(`${APPLE_PAY_BUTTON_ID}`);
  const loadingIcon = document.getElementById(`loading-icon`);
  if (!applePayButton || !loadingIcon) {
    return;
  }
  applePayButton.style.display = "none";
  loadingIcon.style.display = "none";
  /**
   * 各ショップで作成したマーチャントID検証用のURL
   * https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/providing_merchant_validation
   */
  const MERCHANT_VALIDATION_URL = "/api/apple-pay/validate";
  if (window.ApplePaySession) {
    applePayButton.style.display = "unset";
    loadingIcon.style.display = "unset";
    const canMakePayments = ApplePaySession.canMakePayments();
    if (
      ApplePaySession.supportsVersion(APPLE_PAY_SUPPORTED_VERSION) &&
      canMakePayments
    ) {
      applePayButton.addEventListener("click", function () {
        console.log("applePayButton CLICK");
        /* 商品の情報 */
        let request = {
          countryCode: "JP",
          currencyCode: "JPY",
          /* 利用可能なカードブランドの種類 */
          supportedNetworks: ["visa", "masterCard", "jcb", "amex"],
          merchantCapabilities: ["supports3DS"],
          total: {
            label: options.label,
            amount: `${options.amount}`, // ¥
          },
        };
        let session = new ApplePaySession(APPLE_PAY_SUPPORTED_VERSION, request);
        session.onvalidatemerchant = function (event) {
          console.log("===onvalidatemerchant", event);
          fetch(MERCHANT_VALIDATION_URL, {
            method: "POST",
            body: JSON.stringify({ validationURL: event.validationURL }),
          }).then(async (r) => {
            const res = await r.json();
            if (r.status === 200) {
              session.completeMerchantValidation(res);
              return;
            } else {
              console.log("===error", res);
              session.abort();
              alert(JSON.stringify(res));
            }
          });
        };
        /* キャンセルを押した時に呼ばれる */
        session.oncancel = function (event) {
          console.log("===oncancel", event);
        };
        /* 購入者が支払いを承認した時に呼ばれる */
        session.onpaymentauthorized = function (event) {
          console.log("===onpaymentauthorized", event);
          const token = event.payment.token.paymentData;
          /* base64エンコードしたトークンをfincodeの決済実行APIのtokenに設定する */
          const encodedToken = btoa(JSON.stringify(token));
          options
            .onGetCardTokenSuccess(encodedToken)
            .then((r) => {
              session.completePayment(ApplePaySession.STATUS_SUCCESS);
            })
            .catch(() => {
              session.completePayment(ApplePaySession.STATUS_FAILURE);
            });
        };
        session.begin();
      });
      loadingIcon.style.display = "none";
    } else {
      console.log({ canMakePayments });
      applePayButton.style.display = "none";
      loadingIcon.style.display = "none";
    }
  }
};

const ApplePayPayment = () => {
  const [amount, setAmount] = useState<string>("100");
  const [changingAmount, setChangingAmount] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const router = useRouter();

  const handlePayment = useCallback(
    async (token: string) => {
      if (!token && !+amount) {
        return;
      }
      setPurchasing(true);
      const body: PurchaseDto = {
        amount: +amount,
        appUrl: window.origin,
        pay_type: "Applepay",
        useSecurity: false,
        token,
      };
      try {
        const res = await fetch("/api/purchase", {
          method: "POST",
          body: JSON.stringify(body),
        }).then(async (r) => {
          const res = await r.json();
          if (r.ok) {
            return res as PurchaseDtoRes;
          }
          throw res;
        });
        setTimeout(() => {
          if (res.acs_url) {
            router.push(res.acs_url);
            return;
          }
          alert("Purchased success!");
        }, 1000);
      } catch (error) {
        console.error("error when purchase", error);
        setTimeout(() => {
          alert(JSON.stringify(error));
        }, 1000);
        throw error;
      } finally {
        setPurchasing(false);
      }
    },
    [amount, router]
  );

  return (
    <div>
      <Head>
        <title>Apple payment</title>
      </Head>
      <div className="p-12">
        <input
          onChange={(e) => {
            const value = e.target.value;
            setChangingAmount(true);
            setAmount(value || "");
            setTimeout(() => {
              setChangingAmount(false);
            }, 300);
          }}
          placeholder="Amount"
          type="number"
          value={amount}
          min={1}
          max={999999}
        />
        <button
          disabled={purchasing}
          onClick={() => {
            setAmount("");
          }}
        >
          Reset
        </button>
        {purchasing ? (
          <div style={{ display: "none" }}>Apple-pay purchasing...</div>
        ) : (
          <></>
        )}
        {+amount && !changingAmount && !purchasing ? (
          <div className="h-[200px]">
            <div className="payment-container mt-12 flex flex-col items-center">
              <div
                dangerouslySetInnerHTML={{
                  __html: `
                <apple-pay-button
                id="apple-pay-button"
                buttonstyle="black"
                type="buy"
                locale="ja-JP"
                style="display: none;"
              ></apple-pay-button>
                `,
                }}
              ></div>
              <div id="loading-icon" style={{ display: "none" }}>
                Apple-pay loading...
              </div>
            </div>
            <Script
              src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"
              crossOrigin="anonymous"
              async
              onReady={() => {
                console.log("onAppleJsReady");
                onAppleJsReady({
                  amount: +amount,
                  label: "Pay for testing",
                  onGetCardTokenSuccess: handlePayment,
                });
              }}
            ></Script>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default ApplePayPayment;
