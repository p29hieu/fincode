import { FincodeConfig } from "@fincode/node";

export const getFincodeConfig = (): FincodeConfig => ({
  apiKey: process.env.FINCODE_SK!,
  isLiveMode: false,
  options: {}
})