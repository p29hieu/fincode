import { config } from 'dotenv';
config();

import { FincodeService, FincodeClientService } from "../src";

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

const getCustomer = async () => {
  console.log('getCustomer');
  const customer = await FincodeService.i.getCustomersId('c_5iZZH9W5RjO5Pt4Y5zBHwA')
  console.log(customer);
}

const createCard = async () => {
  console.log('createCard');

  const card = await FincodeService.i.postCustomersCustomerIdCards('c_poJq9ZToSN2rnvrz_Sm8LQ', {
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

const getCustomerCards = async () => {
  console.log('getCustomerCards');

  const cards = await FincodeClientService.i.getCustomersCustomerIdCards('c_poJq9ZToSN2rnvrz_Sm8LQ')
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
    price: 5000
  });
  console.log(order);
  /**
{
  access_id: 'a_fqd2tpI4TMGjBentnP30cg',
  id: 'o_j5Y2sbz-SuuLpdCfF4WyDg'
}
   */
}

const purchaseOrder = async () => {
  console.log('purchaseOrder');
  const res = await FincodeService.i.putPaymentsId('o_j5Y2sbz-SuuLpdCfF4WyDg', {
    access_id: 'a_fqd2tpI4TMGjBentnP30cg',
    customer_id: 'c_5iZZH9W5RjO5Pt4Y5zBHwA',
    card_id: 'cs_F_-y8HV-QG-skfugoExmpw',
    method: '1'
  })
  console.log(res);
}

const getPaymentsId = async () => {
  console.log('getPaymentsId');
  const res = await FincodeService.i.getPaymentsId('o_fZHdCcP_QhKF0SyZk_cVOA')
  console.log(res);
}

(async () => {
  FincodeService.i.config({
    secretKey: process.env.FINCODE_SK,
    publicKey: process.env.FINCODE_PK
  });
  FincodeClientService.i.config({
    publicKey: process.env.FINCODE_PK
  });

  try {
    // await createCustomer();
    // await getCustomer();
    // await createCard();
    // await getCustomerCards();
    // await createOrder();
    // await purchaseOrder();
    // await getPaymentsId();
  } catch (error: any) {
    console.error(error?.response?.data ?? error)
  }
})();