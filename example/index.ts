import { config } from 'dotenv';
config();

import { FincodeService, FincodeClientService } from "../src";

const createCustomer = async () => {
  const customerCreated = await FincodeService.i.postCustomers({
    email: "p29hieu@gmail.com",
    name: "p29hieu",
  })
  console.log(customerCreated);
  /**
{
  id: 'c_5iZZH9W5RjO5Pt4Y5zBHwA',
  name: 'p28hieu',
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
  created: '2023/05/19 00:58:26.006',
  updated: '2023/05/19 00:58:26.006'
}
   */
}

const getCustomer = async () => {
  const customer = await FincodeService.i.getCustomersId('c_5iZZH9W5RjO5Pt4Y5zBHwA')
  console.log(customer);
}

const createCard = async () => {
  const card = await FincodeService.i.postCustomersCustomerIdCards('c_5iZZH9W5RjO5Pt4Y5zBHwA', {
    default_flag: "1",
    token: "34313532666435386236623866353035313763363834643664643238343265663061376161613236376537646338393536346235346261623363623561653732"
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
  const cards = await FincodeClientService.i.getCustomersCustomerIdCards('c_5iZZH9W5RjO5Pt4Y5zBHwA')
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
    price: 1000
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
  const res = await FincodeService.i.putPaymentsId('o_j5Y2sbz-SuuLpdCfF4WyDg', {
    access_id: 'a_fqd2tpI4TMGjBentnP30cg',
    card_id: 'cs_F_-y8HV-QG-skfugoExmpw'
  })
  console.log(res);
}

const getPaymentsId = async () => {
  const res = await FincodeService.i.getPaymentsId('o_j5Y2sbz-SuuLpdCfF4WyDg')
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
    await getCustomerCards();
    // await createOrder();
    // await purchaseOrder();
    // await getPaymentsId();
  } catch (error: any) {
    console.error(error?.response?.data ?? error)
  }
})();