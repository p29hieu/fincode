"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useCallback, useState } from "react";

const onFincodeReady = (
  errorCallback: (error: string) => void,
  options: {
    fincodePk: string;
    onGetCardTokenSuccess: (token: string) => void;
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
            function (status: number, response: any) {
              if (200 === status) {
                const token = response?.list?.[0]?.token;
                return options.onGetCardTokenSuccess(token);
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

type PurchaseDataResponse = {
  access_id: string;
  id: string;
};
const PaymentWithCard = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [purchaseData, setPurchaseData] = useState<PurchaseDataResponse>();
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
      setPurchaseData(response);
    }
  }, [amount]);

  const handlePayment = useCallback(async () => {
    if (!purchaseData || !cardToken) {
      return;
    }
    const urlSearch = new URLSearchParams();
    urlSearch.set("access_id", purchaseData.access_id);
    urlSearch.set("order_id", purchaseData.id);
    urlSearch.set("token", cardToken);
    window.open(`/api/purchase?${urlSearch.toString()}`, "_blank");
  }, [purchaseData, cardToken]);

  const onGetCardTokenSuccess = (cardToken: string) => {
    setCardToken(cardToken);
  };

  return (
    <div>
      <div>
        <input
          onChange={(e) => setAmount(+(e.target.value ?? 0))}
          placeholder="Amount"
          type="number"
          min={0}
          defaultValue={amount}
        />
        {amount && amount > 0 && (
          <button onClick={handleCreateOrder}>create order</button>
        )}
        <div>
          <div>
            <label htmlFor="order_id">orderId:</label>
          </div>
          <input
            id="order_id"
            defaultValue={purchaseData?.id}
            placeholder="order id"
            onChange={(e) => {
              setPurchaseData((v) => {
                return {
                  access_id: "",
                  ...(v || {}),
                  id: e.target.value,
                };
              });
            }}
          />
        </div>
        <div>
          <div>
            <label htmlFor="access_id">accessId:</label>
          </div>
          <input
            id="access_id"
            defaultValue={purchaseData?.access_id}
            placeholder="access id"
            onChange={(e) => {
              setPurchaseData((v) => {
                return {
                  id: "",
                  ...(v || {}),
                  access_id: e.target.value,
                };
              });
            }}
          />
        </div>

        <div className="h-[700px]">
          <div className="payment-container mt-12 flex flex-col items-center">
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
                  Get card token
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
        <div className="break-all">CardToken: {cardToken}</div>
        {purchaseData?.id && cardToken && (
          <div>
            <button onClick={handlePayment}>Purchase</button>
          </div>
        )}

        <Script
          src={process.env.NEXT_PUBLIC_FINCODE_JS}
          onReady={() =>
            onFincodeReady(setError, {
              fincodePk: process.env.NEXT_PUBLIC_FINCODE_PK ?? "",
              onGetCardTokenSuccess,
            })
          }
        />
      </div>
    </div>
  );
};
export default PaymentWithCard;
