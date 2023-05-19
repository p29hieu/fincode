import axios, { AxiosInstance } from "axios";
import { FincodeNs } from "./types";

type FincodeConfig = {
  baseUrl: string;
  dashBoardUrl: string;
  secretKey: string;
  publicKey: string;
}
export class FincodeService {
  static _instance: FincodeService;

  static getConfig(config: Partial<FincodeConfig>): FincodeConfig {
    if (!config.baseUrl) {
      if (process.env.NODE_ENV === 'production') {
        config.baseUrl = 'https://api.fincode.jp/v1'
      } else {
        config.baseUrl = 'https://api.test.fincode.jp/v1'
      }
    }
    if (!config.dashBoardUrl) {
      if (process.env.NODE_ENV === 'production') {
        config.dashBoardUrl = 'https://dashboard.test.fincode.jp'
      } else {
        config.dashBoardUrl = 'https://dashboard.fincode.jp'
      }
    }
    return config as FincodeConfig
  }

  /**
   * get FincodeService singleton
   */
  static get i() {
    if (!this._instance) {
      this._instance = new FincodeService();
    }
    return this._instance;
  }

  static createInstance(config: Partial<FincodeConfig>) {
    if (!config.secretKey) {
      throw new Error("config.secretKey is required");
    }
    const instance = new FincodeService();
    instance.config(config);
    return instance;
  }

  private _config: FincodeConfig;
  private service: AxiosInstance;

  get configData() {
    return this._config;
  }

  config(config: Partial<FincodeConfig>) {
    this._config = FincodeService.getConfig(config)
    this.service = axios.create({
      baseURL: this._config.baseUrl,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this._config.secretKey}`,
      },
    });
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E9%A1%A7%E5%AE%A2/operation/postCustomers
   */
  async postCustomers(data: FincodeNs.PostCustomerRequest): Promise<FincodeNs.CustomerInformationResponse> {
    const res = await this.service.post('/customers', data);
    return res.data;
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E9%A1%A7%E5%AE%A2/operation/getCustomersId
   */
  async getCustomersId(customerId: string): Promise<FincodeNs.CustomerInfo> {
    const res = await this.service.get('/customers/{id}'.replace('{id}', customerId));
    return res.data;
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E9%A1%A7%E5%AE%A2/operation/putCustomersId
   */
  async putCustomersId(customerId: string, data: Partial<FincodeNs.PostCustomerRequest>): Promise<FincodeNs.CustomerInfo> {
    const oldData = await this.getCustomersId(customerId);
    const res = await this.service.put('/customers/{id}'.replace('{id}', customerId), {
      ...oldData,
      ...data,
    });
    return res.data;
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E3%82%AB%E3%83%BC%E3%83%89/operation/postCustomersCustomer_idCards
   */
  async postCustomersCustomerIdCards(customerId: string, data: FincodeNs.RegisterCardRequest): Promise<FincodeNs.RegisterCardResponse> {
    const endpoint = "/customers/{customer_id}/cards".replace(
      "{customer_id}",
      customerId
    );
    const res = await this.service.post(endpoint, data);
    return res.data;
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E3%82%AB%E3%83%BC%E3%83%89/operation/getCustomersCustomer_idCards
   */
  async getCustomersCustomerIdCards(customerId: string): Promise<FincodeNs.CardInfo[]> {
    if (!this._config.publicKey) {
      throw new Error("publicKey is required");
    }
    const endpoint = "/v1/customers/{customer_id}/cards".replace(
      "{customer_id}",
      customerId
    );
    const res = await axios.get(this._config.baseUrl + endpoint, {
      headers: {
        Authorization: `Bearer ${this._config.publicKey}`
      }
    })
    return res.data;
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E3%82%AB%E3%83%BC%E3%83%89/operation/deleteCustomersCustomer_idCardsId
   */
  async deleteCustomersCustomerIdCardsId(customerId: string, cardId: string) {
    const endpoint = "/v1/customers/{customer_id}/cards/{id}"
      .replace("{customer_id}", customerId)
      .replace("{id}", cardId);
    await this.service.delete(endpoint);
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/postPayments
   */
  async createOrder({ price, client_field_1, client_field_2, client_field_3 }: { price: number, client_field_1?: string, client_field_2?: string, client_field_3?: string }): Promise<{ access_id: string; id: string }> {
    const res = await this.service.post("/payments", {
      pay_type: "Card",
      job_code: "CAPTURE",
      amount: `${Math.ceil(price)}`,
      client_field_1,
      client_field_2,
      client_field_3
    });
    const { access_id, id } = res.data;
    return { access_id, id };
  }

  /**
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/putPaymentsId
   */
  async putPaymentsId(orderId: string, data: FincodeNs.PurchaseData): Promise<FincodeNs.OrderDetail> {
    const endpoint = "/payments/{id}".replace("{id}", orderId);
    const res = await this.service.put(endpoint, {
      pay_type: "CARD",
      ...data
    });
    return res.data;
  }

  /**
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/putPaymentsIdCapture
   */
  async putPaymentsIdCapture(orderId: string, access_id: string) {
    const endpoint = "/payments/{id}/capture".replace("{id}", orderId);
    await this.service.put(endpoint, {
      pay_type: "Card",
      access_id
    });
  }

  /**
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/getPaymentsId
   */
  async getPaymentsId(orderId: string): Promise<FincodeNs.OrderDetail> {
    const endpoint = "/payments/{id}".replace("{id}", orderId);
    const query = new URLSearchParams({ pay_type: "Card" }).toString();
    const res = await this.service.get(`${endpoint}?${query}`)
    return res.data;
  }
}