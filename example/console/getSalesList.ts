import { FincodeService } from "../../src/server";
import { FincodeNs } from "../../src/types";

const getFincodeSalesList = async (nextPage = 1): Promise<FincodeNs.Sale.SaleItem[]> => {
  const fincode = FincodeService.createInstance();
  const { current_page, last_page, list } = await fincode.getSaleList({ limit: 100, page: nextPage }, { onError: console.error });
  let result: FincodeNs.Sale.SaleItem[] = list;
  for (let page = current_page; page < last_page; page++) {
    const res = await fincode.getSaleList({ limit: 100, page }, { onError: console.error });
    result = [...res.list, ...result];
  }
  return result;
};

const getSaleDetailItems = async (saleId: string, nextPage = 1): Promise<FincodeNs.Sale.SaleDetailItem[]> => {
  const fincode = FincodeService.createInstance();
  const { current_page, last_page, list } = await fincode.getSaleDetail(
    saleId,
    { limit: 100, page: nextPage, trade_type: [1, 2, 3, 4, 5] },
    { onError: console.error },
  );
  let result: FincodeNs.Sale.SaleDetailItem[] = list;
  for (let page = current_page; page < last_page; page++) {
    const res = await fincode.getSaleDetail(saleId, { limit: 100, page, trade_type: [1, 2, 3, 4, 5] }, { onError: console.error });
    result = [...res.list, ...result];
  }
  return result;
};

export const getSaleList = async () => {
  const saleList = await getFincodeSalesList();
  let saleDetailList: FincodeNs.Sale.SaleDetailItem[] = [];
  for (const saleItem of saleList) {
    const saleDetail = await getSaleDetailItems(saleItem.id);
    saleDetailList = [...saleDetailList, ...saleDetail];
  }
  console.log(saleDetailList);
};
