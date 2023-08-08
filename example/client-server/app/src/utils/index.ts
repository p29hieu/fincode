import { FincodeClientService } from "../../../../../dist";

export const getTdsRetUrl = (appUrl: string, orderId: string) => {
  const urlSearch = new URLSearchParams();
  urlSearch.set("appUrl", appUrl); // require name appUrl
  return `${appUrl}/api/validate/${orderId}?${urlSearch}`;
};

export const fincodeClient = FincodeClientService.createInstance({
  baseUrl: process.env.NEXT_PUBLIC_FINCODE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_FINCODE_PK,
});
