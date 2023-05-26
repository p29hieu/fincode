import axios, { AxiosInstance } from "axios";
import { FincodeNs } from "./types";
type FincodeClientConfig = {
  baseUrl: string;
  dashBoardUrl: string;
  publicKey: string;
}
export class FincodeClientService {
  static _instance: FincodeClientService;

  static getConfig(config: Partial<FincodeClientConfig>): FincodeClientConfig {
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
    return config as FincodeClientConfig
  }

  /**
   * get FincodeClientService singleton
   */
  static get i() {
    if (!this._instance) {
      this._instance = new FincodeClientService();
    }
    return this._instance;
  }

  static createInstance(config: Partial<FincodeClientConfig>) {
    if (!config.publicKey) {
      throw new Error("config.publicKey is required");
    }
    const instance = new FincodeClientService()
    instance.config(config);
    return instance;
  }

  private _config: FincodeClientConfig;
  private service: AxiosInstance;

  get configData() {
    return this._config;
  }

  config(config: Partial<FincodeClientConfig>) {
    this._config = FincodeClientService.getConfig(config)
    this.service = axios.create({
      baseURL: this._config.baseUrl,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${this._config.publicKey}`,
      },
    });
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E3%82%AB%E3%83%BC%E3%83%89/operation/getCustomersCustomer_idCards
   */
  async getCustomersCustomerIdCards(customerId: string): Promise<{ list: FincodeNs.CardInfo[] }> {
    const endpoint = "/customers/{customer_id}/cards".replace(
      "{customer_id}",
      customerId
    );
    const res = await this.service.get(endpoint)
    return res.data;
  }

  /**
   * Perform 3DS2.0 authentication.
    カード決済available for trades of
   *
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/paths/~1secure2~1%7Baccess_id%7D/put
   */
  async run3DS2Authentication(access_id: string, data: FincodeNs.Run3DS2Authentication): Promise<FincodeNs.Result3DS2Authentication> {
    const endpoint = "/secure2/{access_id}".replace("{access_id}", access_id);
    const res = await this.service.put(`${endpoint}`, data)
    return res.data;
  }


  /**
   * Acquire 3DS2.0 authentication execution result.
    カード決済available for trades of
   *
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/paths/~1secure2~1%7Baccess_id%7D/get
   */
  async get3DS2Result(access_id: string): Promise<FincodeNs.Result3DS2> {
    const endpoint = "/secure2/{access_id}".replace("{access_id}", access_id);
    const res = await this.service.get(`${endpoint}`)
    return res.data;
  }
}
