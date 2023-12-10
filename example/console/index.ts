import { config } from "dotenv";
config();

import { payment } from "./payment";
import { getSaleList } from "./getSalesList";

const main = async () => {
  // await payment();
  await getSaleList();
};

main();
