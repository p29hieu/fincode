export const getTdsRetUrl = (orderId: string) =>
  `${process.env.NEXT_PUBLIC_APP_URL}/api/validate/${orderId}`;
