import { FincodeService } from "../../src/server";

export const getSaleList = async () => {
  const service = FincodeService.createInstance();
  console.log(service.configData);
  await service.getSaleList(
    {},
    {
      onSuccess: console.log,
      onError: console.error,
    },
  );
  await service.getSaleItem("sales_s_22082100904_231130_00001", {
    onSuccess: console.log,
    onError: console.error,
  });
  await service.getSaleDetail(
    "sales_s_22082100904_231130_00001",
    { trade_type: [1, 2] },
    {
      onSuccess: console.log,
      onError: console.error,
    },
  );
};
