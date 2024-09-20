import { FincodeConfig, Payment } from '@fincode/node'

const fincodeConfig: FincodeConfig = {
  apiKey: process.env.FINCODE_SK!,
  isLiveMode: false,
  options: {}
}
const paymentService = new Payment(fincodeConfig)
export const paypayPurchase = async () => {
  const payment = await paymentService.create({
    pay_type: "Paypay",
    job_code: "CAPTURE",
    amount: "1000",
    client_field_1: "test",
  })
}