import { FincodeClientService } from "../../../../../dist";

export const getTdsRetUrl = (orderId: string) =>
  `${process.env.NEXT_PUBLIC_APP_URL}/api/validate/${orderId}`;


export const fincodeClient = FincodeClientService.createInstance({
  baseUrl: process.env.NEXT_PUBLIC_FINCODE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_FINCODE_PK,
})
