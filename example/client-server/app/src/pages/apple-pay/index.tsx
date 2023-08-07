"use client";

import Head from "next/head";
import Script from "next/script";
import { useCallback, useState } from "react";

const onAppleJsReady = async (
  errorCallback: (error: string) => void,
  options: {
    amount: number;
    onGetCardTokenSuccess: (token: string) => void;
  }
) => {
  const APPLE_PAY_SUPPORTED_VERSION = 3; /* Apple PayJSのサポートバージョン */
  const MARCHANT_IDENTIFIER =
    process.env.NEXT_PUBLIC_APPLE_PAY_MERCHANT_ID ??
    "merchant.com.example"; /* マーチャントID */
  const APPLE_PAY_BUTTON_ID = "apple-pay-button"; /* Apple Payボタン要素のID */
  const applePayButton = document.getElementById(`${APPLE_PAY_BUTTON_ID}`);
  if (!applePayButton) {
    return;
  }
  applePayButton.style.display = "none";
  /**
   * 各ショップで作成したマーチャントID検証用のURL
   * https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/providing_merchant_validation
   */
  const MERCHANT_VALIDATION_URL = "/api/apple-pay/validate";
  if (window.ApplePaySession) {
    const canMakePaymentsWithActiveCard =
      await ApplePaySession.canMakePaymentsWithActiveCard(MARCHANT_IDENTIFIER);
    if (
      ApplePaySession.supportsVersion(APPLE_PAY_SUPPORTED_VERSION) &&
      canMakePaymentsWithActiveCard
    ) {
      applePayButton.style.display = "unset";
      applePayButton.addEventListener("click", function () {
        /* 商品の情報 */
        let request = {
          countryCode: "JP",
          currencyCode: "JPY",
          /* 利用可能なカードブランドの種類 */
          supportedNetworks: ["visa", "masterCard", "jcb", "amex"],
          merchantCapabilities: ["supports3DS"],
          total: {
            label: "Apple Pay Order test",
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
          const token = event.payment.token;
          console.log("===onpaymentauthorized", event);
          console.log(token);
          /* base64エンコードしたトークンをfincodeの決済実行APIのtokenに設定する */
          const encodedToken = btoa(JSON.stringify(token));
          options.onGetCardTokenSuccess(encodedToken);
        };
        session.begin();
      });
    }
  }
};

type PurchaseDataResponse = {
  access_id: string;
  id: string;
};
const ApplePayPayment = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [order, setOrder] = useState<PurchaseDataResponse>({
    access_id: "test",
    id: "test",
  });
  const [cardToken, setCardToken] = useState<string>();
  const [error, setError] = useState("");

  const handleCreateOrder = useCallback(async () => {
    const response = await fetch(`/api/order?amount=${amount}`, {
      method: "POST",
    })
      .then(async (r) => (await r.json()) as PurchaseDataResponse)
      .catch((error) => {
        console.error(error);
      });
    if (response) {
      setOrder(response);
    }
  }, [amount]);

  const handlePayment = useCallback(async () => {
    if (!order || !cardToken) {
      return;
    }
    const urlSearch = new URLSearchParams();
    urlSearch.set("access_id", order.access_id);
    urlSearch.set("order_id", order.id);
    urlSearch.set("token", cardToken);
    await fetch("/api/purchase", {
      method: "POST",
      body: JSON.stringify({
        ...order,
        token: cardToken,
      }),
    });
  }, [order, cardToken]);

  const onGetCardTokenSuccess = (cardToken: string) => {
    setCardToken(cardToken);
  };

  return (
    <div>
      <Head>
        <title>Apple payment</title>
      </Head>
      <div>
        <input
          onChange={(e) => setAmount(+(e.target.value ?? 0))}
          placeholder="Amount"
          type="number"
          min={0}
          defaultValue={amount}
        />
        {amount > 0 ? (
          <button onClick={handleCreateOrder}>create order</button>
        ) : (
          <></>
        )}
        <div>
          <div>
            <label htmlFor="order_id">orderId:</label>
          </div>
          <input
            id="order_id"
            defaultValue={order?.id}
            placeholder="order id"
            disabled
          />
        </div>
        <div>
          <div>
            <label htmlFor="access_id">accessId:</label>
          </div>
          <input
            id="access_id"
            defaultValue={order?.access_id}
            placeholder="access id"
            disabled
          />
        </div>

        {order ? (
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
              ></apple-pay-button>
                `,
                }}
              ></div>
            </div>
            <Script
              src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"
              crossOrigin="anonymous"
              async
              onReady={() => {
                onAppleJsReady(setError, {
                  amount,
                  onGetCardTokenSuccess,
                });
              }}
            ></Script>
          </div>
        ) : (
          <></>
        )}
        <div className="break-all">Apple pay token: {cardToken}</div>
        {order?.id && cardToken && (
          <div>
            <button onClick={handlePayment}>Purchase</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ApplePayPayment;
