import { config } from 'dotenv';
config();

import { FincodeService, FincodeClientService, FincodeNs } from "../src";

const createCustomer = async () => {
  console.log('createCustomer');
  const customerCreated = await FincodeService.i.postCustomers({
    email: "p29hieu@gmail.com",
    name: "p29hieu",
  })
  console.log(customerCreated);
  /**
{
  id: 'c_vv7Tk0P2Tau5B5jQuRsaCQ',
  name: 'p29hieu',
  email: 'p29hieu@gmail.com',
  phone_cc: null,
  phone_no: null,
  addr_city: null,
  addr_country: null,
  addr_line_1: null,
  addr_line_2: null,
  addr_line_3: null,
  addr_post_code: null,
  addr_state: null,
  card_registration: '0',
  created: '2023/05/22 10:07:58.747',
  updated: '2023/05/22 10:07:58.747'
}
   */
}

const getCustomer = async (customer_id: string) => {
  console.log('getCustomer');
  const customer = await FincodeService.i.getCustomersId(customer_id)
  console.log(customer);
  return customer;
}

const createCard = async () => {
  console.log('createCard');
  const card = await FincodeService.i.registerCard('c_poJq9ZToSN2rnvrz_Sm8LQ', {
    default_flag: "1",
    token: "34303634643431666661633536333364613466643637643062636261393635636534666263306666313736353136633138303063346532643834376162396163"
  })
  console.log(card);
  /**
{
  customer_id: 'c_5iZZH9W5RjO5Pt4Y5zBHwA',
  id: 'cs_F_-y8HV-QG-skfugoExmpw',
  default_flag: '1',
  card_no: '************4242',
  expire: '2411',
  holder_name: 'hiiu',
  card_no_hash: '477bba133c182267fe5f086924abdc5db71f77bfc27f01f2843f2cdc69d89f05',
  created: '2023/05/19 01:38:57.147',
  updated: '2023/05/19 01:38:57.147',
  type: '0',
  brand: 'VISA'
} */
}

const getCustomerCards = async (customer_id: string) => {
  console.log('getCustomerCards');
  const cards = await FincodeClientService.i.getCustomersCustomerIdCards(customer_id)
  console.log(cards);
  /**
{
  list: [
    {
      customer_id: 'c_5iZZH9W5RjO5Pt4Y5zBHwA',
      id: 'cs_F_-y8HV-QG-skfugoExmpw',
      default_flag: '1',
      card_no: '************4242',
      expire: '2411',
      holder_name: 'hiiu',
      card_no_hash: '477bba133c182267fe5f086924abdc5db71f77bfc27f01f2843f2cdc69d89f05',
      created: '2023/05/19 01:38:57.147',
      updated: '2023/05/19 01:38:57.147',
      type: '0',
      brand: 'VISA'
    }
  ]
}
   */
}

const createOrder = async () => {
  const order = await FincodeService.i.createOrder({
    job_code: "AUTH",
    amount: 1000,
    pay_type: "Card",
  });
  console.log(order);
  return order;
  /**
{
  access_id: 'a_fqd2tpI4TMGjBentnP30cg',
  id: 'o_j5Y2sbz-SuuLpdCfF4WyDg'
}
   */
}

const createOrder3DS2 = async () => {
  const order = await FincodeService.i.createOrder({
    job_code: "AUTH",
    amount: 1000,
    pay_type: "Card",
    tds_type: "2",
    tds2_type: "2"
  });
  console.log(order);
  return order;
}

const purchaseOrder = async (orderId: string, data: FincodeNs.PaymentExecution) => {
  console.log('purchaseOrder');
  const res = await FincodeService.i.paymentExecution(orderId, data);
  console.log(res);
  return res;
}

const getPaymentsId = async (orderId: string) => {
  console.log('getPaymentsId');
  const res = await FincodeService.i.getPaymentsId(orderId)
  console.log(res);
  return res;
}

const run3DS2AuthenticationByServer = async (access_id: string, param: string) => {
  console.log("run3DS2AuthenticationByServer");
  const res = await FincodeService.i.perform3DS2Authentication(access_id, { param })
  console.log(res);
  return res;
}

const confirmSales = async (orderId: string, data: FincodeNs.ConfirmSales) => {
  console.log("confirmSales");
  const res = await FincodeService.i.putPaymentsIdCapture(orderId, data)
  console.log(res);
  return res;
}

const get3DS2Result = async (access_id: string) => {
  console.log("get3DS2Result");
  const res = await FincodeClientService.i.acquire3DS2Result(access_id)
  console.log(res);
  return res;
}

const paymentAfterAuthentication = async (orderId: string, data: FincodeNs.PaymentAfterAuthentication) => {
  console.log("paymentAfterAuthentication");
  const res = await FincodeService.i.paymentAfterAuthentication(orderId, data)
  console.log(res);
  return res;
}

(async () => {
  FincodeService.i.config({
    secretKey: process.env.FINCODE_SK,
    publicKey: process.env.FINCODE_PK
  });
  FincodeClientService.i.config({
    publicKey: process.env.FINCODE_PK
  });

  const customer_id = 'c_poJq9ZToSN2rnvrz_Sm8LQ';
  const card_id = 'cs_iADgG895QAq3XNcPIVfQ0g';
  const access_id = 'a_hsB1o4YOS5-RglcSIpcAKA';
  const orderId = 'o_jDgDQTsqRT6NhvGC7JTknQ';

  try {
    // await createCustomer();
    // await getCustomer(customer_id);
    // await createCard();
    // await getCustomerCards(customerId);
    // await createOrder();
    // await purchaseOrder(orderId, {
    //   access_id,
    //   pay_type: "Card",
    //   card_id,
    //   customer_id,
    //   method: 1
    // });
    // await confirmSales(orderId, {
    //   access_id,
    //   pay_type: "Card",
    //   method: 1
    // });
    // await getPaymentsId(orderId);

    // 3DS2: https://docs.fincode.jp/payment/fraud_protection/3d_secure_2
    const tds2_ret_url = `http://localhost:3000/redirect`
    // step 1: choose customer_id and card_id
    // step2: merchants create order (settlement registration)
    // await createOrder3DS2();
    // step3: merchants store access_id & order_id into db
    // step5
    // await purchaseOrder(orderId, {
    //   access_id,
    //   pay_type: "Card",
    //   card_id,
    //   customer_id,
    //   method: 1,
    //   tds2_ret_url,
    // }); // return acs_url if tds_type === '2'

    // step6: redirect to acs_url if exists
    // step 8
    // await run3DS2AuthenticationByServer(access_id, tds2_ret_url)

    // client run 1 below steps
    // step 9: if challenge_url is not empty: open challenge_url, click 決済に進む button. Then wait few seconds (utils webhook sent)
    // await get3DS2Result(access_id); // return error when 3ds2 authenticated

    // step 14
    // await paymentAfterAuthentication(orderId, {
    //   access_id,
    //   pay_type: "Card",
    // });
    // await getPaymentsId(orderId);
  } catch (error: any) {
    console.error(error?.response?.data ?? error)
  }
})();