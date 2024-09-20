import { config } from 'dotenv'
config()

import { createFincode, FincodeConfig } from "@fincode/node";

const fincodeIsLiveMode = process.env.FINCODE_IS_LIVEMODE === 'true';
const apiKey = process.env.FINCODE_SK || '';
const fincodeConfig: FincodeConfig = {
  apiKey,
  isLiveMode: fincodeIsLiveMode,
  options: {}
}

const fincode = createFincode(fincodeConfig);
const purchaseWithBank = async () => {
  const orderId = `o_test_${Date.now()}`
  const order = await fincode.payments.create({
    id: orderId,
    pay_type: "Virtualaccount",
    billing_amount: "10",
  } as any)

  console.log("===order", order)

  const orderExecuted = await fincode.payments.execute(orderId, {
    access_id: order.access_id,
    payment_term_day: "7",
    pay_type: "Virtualaccount",
  } as any)
  console.log("===orderExecuted", orderExecuted)

}

const main = async () => {
  try {
    await purchaseWithBank()

  // const paymentDetail = await fincode.payments.retrieve('o_test_1721982416236', {
  //   pay_type:"Virtualaccount"
  // } as any);
  // console.log("===paymentDetail",paymentDetail)
  } catch (error: any) {
    console.error(error)
  }
}

main()