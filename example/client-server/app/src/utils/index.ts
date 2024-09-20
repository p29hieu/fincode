export const getTdsRetUrl = (appUrl: string, orderId: string) => {
  const urlSearch = new URLSearchParams();
  urlSearch.set("appUrl", appUrl); // require name appUrl
  return `${appUrl}/api/validate/${orderId}?${urlSearch}`;
};
