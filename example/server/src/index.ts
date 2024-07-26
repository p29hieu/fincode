import { config } from 'dotenv'
config()

import axios from 'axios'
import { FincodeClientService } from "fincode";
import { createFincode, FincodeConfig, Payment } from "@fincode/node";

const fincodeIsLiveMode = process.env.FINCODE_IS_LIVEMODE === 'true';
const apiKey = process.env.FINCODE_SK || '';
const fincodeConfig: FincodeConfig = {
  apiKey,
  isLiveMode: fincodeIsLiveMode,
  options: {}
}
const fincodeApiUrl = fincodeIsLiveMode ? 'https://api.fincode.jp/v1' : 'https://api.test.fincode.jp/v1'

const axiosInstance = axios.create({
  baseURL: fincodeApiUrl,
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  }
})
const purchaseWithBank = async () => {
  const fincode = createFincode(fincodeConfig);
  const orderId = `o_test_${Date.now()}`
  const order = await fincode.payments.create({
    id: orderId,
    pay_type: "Virtualaccount",
    billing_amount: "10000",
  } as any)

  console.log("===order", order)

  const orderExecuted = await fincode.payments.execute(orderId, {
    access_id: order.access_id,
    payment_term_day: "0",
    pay_type: "Virtualaccount",
  } as any)
  console.log("===orderExecuted", orderExecuted)
}

const main = async () => {
  try {
    await purchaseWithBank()
  } catch (error: any) {
    console.error(error)
  }
}

main()