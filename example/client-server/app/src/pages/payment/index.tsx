"use client";
import { fincodeClient } from "@/utils";
import { FincodeNs } from "fincode";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type PurchaseDataResponse = {
  access_id: string;
  id: string;
};
const PaymentPage = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [purchaseData, setPurchaseData] = useState<PurchaseDataResponse>();
  const [customerId, setCustomerId] = useState<string>();
  const [cards, setCards] = useState<FincodeNs.CardInfo[]>([]);
  const [cardSelected, setCardSelected] = useState<FincodeNs.CardInfo>();

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
    if (!purchaseData || !customerId || !cardSelected) {
      return;
    }
    const urlSearch = new URLSearchParams();
    urlSearch.set("access_id", purchaseData.access_id);
    urlSearch.set("order_id", purchaseData.id);
    urlSearch.set("customer_id", customerId);
    urlSearch.set("card_id", cardSelected.id);
    window.open(`/api/purchase?${urlSearch.toString()}`, "_blank");
  }, [purchaseData, customerId, cardSelected]);

  const fetchCardList = useCallback(async () => {
    if (customerId) {
      const cardList = await fincodeClient.getCustomersCustomerIdCards(
        customerId
      );
      const cardSelected = cardList.list.findLast(
        (card) => card.default_flag === "1"
      );
      cardSelected && setCardSelected(cardSelected);
      setCards(cardList.list);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCardList();
  }, [fetchCardList]);

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

        <div>
          <div className="flex flex-col">
            <label htmlFor="customerId">Customer Id</label>
            <input
              id="customerId"
              onChange={(e) => setCustomerId(e.target.value)}
              defaultValue={customerId}
              placeholder="CustomerId"
            />
          </div>
          <button onClick={fetchCardList} disabled={!customerId}>
            Get cards
          </button>
          {cards.length ? (
            <table>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>CardNumber</th>
                  <th>Expirer</th>
                  <th>Card ID</th>
                  <th>Default</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => {
                  return (
                    <tr
                      key={card.card_no_hash}
                      className={
                        card.id === cardSelected?.id ? "bg-blue-50" : ""
                      }
                    >
                      <td>{card.brand}</td>
                      <td>{card.card_no}</td>
                      <td>{card.expire}</td>
                      <td>{card.id}</td>
                      <td>{card.default_flag}</td>
                      <td>
                        <button
                          onClick={() => setCardSelected(card)}
                          disabled={card.id === cardSelected?.id}
                        >
                          {card.id === cardSelected?.id ? "Chosen" : "Choose"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <></>
          )}
        </div>

        {purchaseData?.access_id && purchaseData?.id && cardSelected ? (
          <div>
            <button onClick={handlePayment}>Purchase</button>
          </div>
        ) : (
          <></>
        )}
      </div>

      <Link href="/payment/card">Payment with card</Link>
    </div>
  );
};

export default PaymentPage;
