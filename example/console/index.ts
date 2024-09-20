import { config } from "dotenv";
config();

import { payment } from "./payment";
import { getSaleList } from "./getSalesList";
import { paypayPurchase } from "./paypay-purchase";

const main = async () => {
  // await payment();
  // await getSaleList();
  await paypayPurchase();
};

main();
