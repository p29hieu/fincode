export namespace FincodeNs {
  type PayType = {
    pay_type: "Card" | "Konbini" | "Paypay"
  }

  type JobCode = {
    /**
     * string[ 1 .. 11 ] characters
     *
     * Processing division
     *
     * CHECK- Validity check
     *
     * AUTH- provisional sales
     *
     * CAPTURE- Confirm sales
     */
    job_code: "AUTH" | "CAPTURE" | "CHECK"
  }

  type AccessId = {
    access_id: string
  }

  type PaymentMethod = {
    /**
     * Required if you have specified or in the payment method 条件付き必須;
     *
     * settlement register: AUTH | CAPTURE
     *
     * 1- Bulk
     *
     * 2- Split
     *
     * 5- Ribo
     */
    method?: 1 | 2 | 5
  }

  type PayTimes = {
    /**
     * Please specify the number of payments below.
     */
    pay_times: 3 | 5 | 6 | 10 | 12 | 15 | 18 | 20 | 24;
  }

  type TdsType = {
    /**
     * 3D Secure usage type
     *
     * 0- Do not use
     *
     * 2- Uses 3DS2.0
     */
    tds_type: "0" | "2"
  }

  type Tds2Type = {
    /**
     * string= 1 characters
     *
     * Operation when 3DS2.0 is not supported
     *
     * 2- Return an error and do not process the payment.
     *
     * 3- Perform authorization and payment processing without 3DS2.0 authentication.
     */
    tds2_type: "2" | "3"
  }

  export type Tds2RetUrl = {
    /**
     * string[ 1 .. 256 ] characters
     *
      Merchant return URL When sing 3DS2.0, the following data will be returned
      from the URL set in this parameter . - to return. A value equal to - to return. - to return. - to return. Used to request 3DS2.0 authentication execution.3DSサーバー

      MDクエリストリングaccess_id

      requestorTransIdapplication/x-www-form-urlencoded

      eventapplication/x-www-form-urlencoded

      paramapplication/x-www-form-urlencoded
     */
    tds2_ret_url: string;
  }

  type CardPayment3DS2Custom = Tds2RetUrl & {
    /**
     * string = 8 characters

      The date the 3DS Requestor account was last updated. yyyyMMddformat
     */
    tds2_ch_acc_change: string;

    /**
     * string = 8 characters
     *
     * 3DS Requestor account opening date.yyyyMMdd format
     */
    tds2_ch_acc_date: string;

    /**
     * string = 8 characters
     *
     * 3DS Requestor account password change date.yyyyMMddformat
     */
    tds2_ch_acc_pw_change: string;

    /**
     * string[1 .. 4 ]characters
     *
     * Number of purchases in the last 6 months
     */
    tds2_nb_purchase_account: string;

    /**
     * string = 8 characters
     *
     * Card registration date.yyyyMMdd format
     */
    tds2_payment_acc_age: string;

    /**
     * string[1 .. 3 ]characters
     *
     * Number of card addition attempts in the last 24 hours
     */
    tds2_provision_attempts_day: string;

    /**
     * string = 8 characters
     *
     * The date the shipping address was first used.yyyyMMdd format
     */
    tds2_ship_address_usage: string;

    /**
     * string = 2 characters
     *
     * Enum: "01" "02"
     *
     * Card customer name and ship - to name match / mismatch information
     *
     * 01 - Card customer name and shipping name match
     *
     * 02 - Card customer name and shipping name do not match
     */
    tds2_ship_name_ind: "01" | "02";

    /**
     * string = 2 characters
     *
     * Enum: "01" "02"
     *
     * Account mistrust information
     *
     *  01 - No suspicious activity observed
     *
     *  02 - Suspicious behavior seen
     */
    tds2_suspicious_acc_activity: "01" | "02";

    /**
     *   string[1 .. 3 ]characters
     *
     * Number of transactions in the last 24 hours
     */

    tds2_txn_activity_day: string;

    /**
     * string[1 .. 3 ]characters

     * Number of transactions in the previous year
     */
    tds2_txn_activity_year: string;

    /**
     * string[1 .. 2048 ]characters
     *
     * Login trail(If you use it, you need to set the login method and login date and time)
     */
    tds2_three_ds_req_auth_data: string;

    /**
     * string = 2 characters
     *
     * Enum: "01" "02" "03" "04" "05" "06"
     *
     * Login method
      01 - no authentication(login as guest)

      02 - Merchant's own authentication information

      03 - SSO(single sign - on)

      04 - Issuer credentials

      05 - 3rd party authentication

      06 - FIDO certified
     */
    tds2_three_ds_req_auth_method: "01" | "02" | "03" | "04" | "05" | "06";

    /**
     * string = 12 characters
     *
     * Login date and time.yyyyMMddHHmm format
     */
    tds2_three_ds_req_auth_timestamp: string;

    /**
     * string = 1 characters
     *
     * Enum: "Y" "N"
     *
     * Billing and shipping address match / mismatch information
      Y - consistent

      N - inconsistent
     */
    tds2_addr_match: "Y" | "N";

    /**
     * string[1 .. 50 ]characters
     *
     * The city of the card customer's billing address
     */
    tds2_bill_addr_city: string;

    /**
     * string[1 .. 3 ]characters
     *
     * Card customer billing address country code
     */
    tds2_bill_addr_country: string;

    /**
     * string[1 .. 50 ]characters
     *
     * Line 1 of the district portion of the card customer's billing address
     */
    tds2_bill_addr_line_1: string;

    /**
     * string[1 .. 50 ]characters
     * Line 2 of the district portion of the card customer's billing address
     */
    tds2_bill_addr_line_2: string;

    /**
     * string[1 .. 16 ]characters
     *
     * Card customer's billing address postal code
     */
    tds2_bill_addr_post_code: string;

    /**
     * string[1 .. 3 ]characters
     *
    State or province code of the card customer's billing address
     */
    tds2_bill_addr_state: string;

    /**
     *   string[1 .. 254 ]characters
     *
    customer email address
     */
    tds2_email: string;

    /**
     *   string[1 .. 3 ]characters
     *
    Phone number country code
     */
    tds2_home_phone_cc: string;

    /**
      string[1 .. 15 ]characters

    telephone number
     */
    tds2_home_phone_no: string;

    /**
     * string[1 .. 3 ]characters
     *
     * Phone number country code
     */
    tds2_mobile_phone_cc: string;
  } & Record<string, string>;

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
    default_flag: '0' | '1';
    token: string;
  }

  export type RegisterCardResponse = CardInfo;

  type CardPayment = PayType & AccessId & {
    card_id?: string;
    customer_id?: string,
    token?: string; // card token
  } & Partial<PaymentMethod> & Partial<PayTimes>

  type CardPayment3DS2 = PayType & AccessId & {
    card_id?: string;
    customer_id?: string,
    token?: string; // card token
  } & Partial<PaymentMethod> & Partial<PayTimes> & Partial<CardPayment3DS2Custom>

  export type PaymentExecution = CardPayment | CardPayment3DS2

  export type OrderDetail = JobCode & PayType & AccessId & Partial<PayTimes> & Partial<PaymentMethod> & Partial<Tds2Type> & Partial<Tds2RetUrl> & {
    shop_id: string,
    id: string,
    /**
     * 	string[ 1 .. 15 ] characters
     *
     * payment status
     *
     * UNPROCESSED- Unsettled
     *
     * CHECKED- Validity check
     *
     * AUTHORIZED- provisional sales
     *
     * CAPTURED- Confirm sales
     *
     * CANCELED- cancel
     *
     * AUTHENTICATED- Pending (3DS)
     */
    status: 'UNPROCESSED' | 'CHECKED' | 'AUTHORIZED' | 'CAPTURED' | 'CANCELED' | 'AUTHENTICATED',
    /**
     * YYYY/MM/dd HH:mm:ss.SSS
     */
    process_date: string,
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
    forward: string | null,
    issuer: string | null,
    transaction_id: string | null,
    approve: string | null,
    auth_max_date: string | null,
    client_field_1: string | null,
    client_field_2: string | null,
    client_field_3: string | null,
    /**
     * string[ 1 .. 15 ] characters
     *
     * 3DS2.0 processing status
     *
     * 2- Return an error and do not process the payment.
     *
     * 3- Perform authorization and payment processing without 3DS2.0 authentication.
     */
    tds2_status: string | null,
    merchant_name: string | null,
    send_url: string | null,
    subscription_id: string | null,
    /**
     * If the international brand cannot be identified, it will be an empty string.
     */
    brand: "VISA" | "MASTER" | "JCB" | "AMEX" | "DINERS",
    error_code: string | null,
    /**
     * YYYY/MM/dd HH:mm:ss.SSS
     */
    created: string,
    /**
     * YYYY/MM/dd HH:mm:ss.SSS
     */
    updated: string
    acs_url?: string;
  }

  type SettlementRegistrationCommon = JobCode & PayType & Partial<Tds2Type> & Partial<TdsType> & {
    id?: string, //Specify a unique value for each transaction. If not specified, it will be created and returned on the fincode side.
    tax?: string,
    client_field_1?: string,
    client_field_2?: string,
    client_field_3?: string,
    /**
     * 3D secure display store name
     */
    td_tenant_name?: string,
    subscription_id?: string,
  }
  /**
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/postPayments
   */
  export type SettlementRegistration = (SettlementRegistrationCommon & {
    job_code: "AUTH" | "CAPTURE",
    amount: number, // range from 1 to 9,999,999. Please specify the total including tax and shipping in 7 digits. * job_code='CHECK'Required except for
  }) | (SettlementRegistrationCommon & { job_code: "CHECK", amount: undefined })

  /**
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/getPaymentsId
   */
  export type ConfirmSales = PayType & AccessId & Partial<PayTimes> & Partial<PaymentMethod>

  /**
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/putPaymentsIdSecure
   */
  export type PaymentAfterAuthentication = PayType & AccessId & {
    /**
     * Required only when using 3DS1.0. 3DS service result message encrypted by the card company
     */
    pa_res?: string;
  }

  /**
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/paths/~1secure2~1%7Baccess_id%7D/put
   */
  export type Run3DS2Authentication = {
    /**
     * string [ 1 .. 2000 ] characters
     *
     * browser information
     *
     * After executing payment, access `acs_url` and set the `param` returned for `tds2_ret_url` to this parameter.
     */
    param: string;
  }

  /**
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/paths/~1secure2~1%7Baccess_id%7D/put
   */
  export type Result3DS2 = {
    /**
     * string= 1 characters
     *
     * Enum: "Y" "N" "U" "A" "C" "R"
     *
     * 3ds2.0 Authentication Result
     *
     * C- Authentication
     *
     * Y- Course Verification Successful
     *
     * A- Attempted Processing
     *
     * N- Authorization/Account Not Confirmed or Transaction Denied
     *
     * U- Authorization/Account Confirmation could not be performed. Or technical or other issues indicated by ARes or RReq
     *
     * R- Authorization/Account Verification Denied;
     */
    tds2_trans_result: "Y" | "N" | "U" | "A" | "C" | "R";
    /**
     * string[1 .. 2 ]characters
     *
     * Enum: 1 2 3 4 5 6 7 8 9 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 "80...99"
     *
     * Authentication result reason
     */
    tds2_trans_result_reason: string
  }
  export type Result3DS2Authentication = Partial<Result3DS2> & {
    challenge_url: string;
  }

  export type MerchantReturnURLData = {
    /**
     * application/x-www-form-urlencoded
     *
     * Requester transaction ID (don't use this value)
     */
    requestorTransId: string;
    /**
     * application/x-www-form-urlencoded
     *
     * event
     *
     * `3DSMethodFinished`: 3DS2.0 initialization process completed. Run `3DS2.0 authentication` please do.
     *
     * `3DSMethodSkipped`: 3DS2.0 initialization process completed. Run `3DS2.0 authentication` please do.
     *
     * `AuthResultReady`：`Acquisition of 3DS2.0 certification result` is ready.
     */
    event: "3DSMethodFinished" | "3DSMethodSkipped" | "AuthResultReady";
    /**
     * application/x-www-form-urlencoded
     *
     * 3DS2.0 authentication parameters. Use in `Run 3DS2.0 authentication`
     */
    param: string
  }
}
