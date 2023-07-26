import { FincodeService } from "fincode";

export const fincodeServer = FincodeService.createInstance({
  baseUrl: process.env.NEXT_PUBLIC_FINCODE_BASE_URL,
  secretKey: process.env.FINCODE_SK,
  publicKey: process.env.NEXT_PUBLIC_FINCODE_PK,
});
