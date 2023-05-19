export namespace FincodeNs {
  // https://docs.fincode.jp/api#tag/%E3%82%AB%E3%83%BC%E3%83%89/operation/getCustomersCustomer_idCards
  export type CardInfo = {
    customer_id: string;
    id: string;
    default_flag: string;
    card_no: string;
    expire: string;
    holder_name: string;
    card_no_hash: string;
    created: string;
    updated: string;
    type: string;
    brand: string;
  };

  // https://docs.fincode.jp/api#tag/%E9%A1%A7%E5%AE%A2/operation/postCustomers
  export type PostCustomerRequest = {
    id?: string | null,
    name: string,
    email: string,
    phone_cc?: string,
    phone_no?: string,
    addr_city?: string,
    addr_country?: string,
    addr_line_1?: string,
    addr_line_2?: string | null,
    addr_line_3?: string | null,
    addr_post_code?: string,
    addr_state?: string
  }
  export type CustomerInformationResponse = PostCustomerRequest & {
    card_registration: string,
    created: string,
    updated: string
  }
  export type CustomerInfo = CustomerInformationResponse;

  // https://docs.fincode.jp/api#tag/%E3%82%AB%E3%83%BC%E3%83%89/operation/postCustomersCustomer_idCards
  export type RegisterCardRequest = {
    default_flag: string; // '0' or '1',
    token: string;
  }
  export type RegisterCardResponse = CardInfo;

  export type PurchaseData = {
    access_id: string;
    card_id: string;
  }

  export type OrderDetail = {
    shop_id: string,
    id: string,
    pay_type: string,
    status: string,
    access_id: string,
    process_date: string,
    job_code: string,
    item_code: string,
    amount: number,
    tax: number,
    total_amount: number,
    customer_group_id: string | null,
    customer_id: string | null,
    card_no: string | null,
    card_id: string | null,
    expire: string | null,
    holder_name: string | null,
    card_no_hash: string | null,
    method: string | null,
    pay_times: string | null,
    forward: string | null,
    issuer: string | null,
    transaction_id: string | null,
    approve: string | null,
    auth_max_date: string | null,
    client_field_1: string | null,
    client_field_2: string | null,
    client_field_3: string | null,
    tds_type: string,
    tds2_type: string | null,
    tds2_ret_url: string | null,
    tds2_status: string | null,
    merchant_name: string | null,
    send_url: string | null,
    subscription_id: string | null,
    brand: string,
    error_code: string | null,
    created: string,
    updated: string
  }
}
