import { FincodeService } from "fincode";

export const fincodeServer2ndMarket = FincodeService.createInstance({
  baseUrl: process.env.NEXT_PUBLIC_FINCODE_BASE_URL,
  secretKey: process.env.FINCODE_2ND_SK,
  publicKey: process.env.NEXT_PUBLIC_FINCODE_2ND_PK,
});
