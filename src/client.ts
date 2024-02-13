import axios, { AxiosInstance } from "axios";
import { FincodeNs } from "./types";
type FincodeClientConfig = {
  baseUrl: string;
  dashBoardUrl: string;
  publicKey: string;
};
export class FincodeClientService {
  static _instance: FincodeClientService;

  static getConfig(config?: Partial<FincodeClientConfig>): FincodeClientConfig {
    config ??= {};
    config.publicKey = config.publicKey || process.env.FINCODE_PK;
    if (!config.publicKey) {
      throw new Error("config.publicKey or env FINCODE_PK is required");
    }
    if (!config.baseUrl) {
      if (process.env.NODE_ENV === "production") {
        config.baseUrl = "https://api.fincode.jp";
      } else {
        config.baseUrl = "https://api.test.fincode.jp";
      }
    }
    if (!config.dashBoardUrl) {
      if (process.env.NODE_ENV === "production") {
        config.dashBoardUrl = "https://dashboard.test.fincode.jp";
      } else {
        config.dashBoardUrl = "https://dashboard.fincode.jp";
      }
    }
    return config as FincodeClientConfig;
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

  static createInstance(config?: Partial<FincodeClientConfig>) {
    const instance = new FincodeClientService();
    instance.config(config);
    return instance;
  }

  private _config: FincodeClientConfig;
  private service: AxiosInstance;

  get configData() {
    return this._config;
  }

  config(config?: Partial<FincodeClientConfig>) {
    this._config = FincodeClientService.getConfig(config);
    this.service = axios.create({
      baseURL: this._config.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this._config.publicKey}`,
      },
    });
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E9%A1%A7%E5%AE%A2/operation/getCustomersId
   */
  async getCustomersId(
    customerId: string,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.CustomerInfo>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.CustomerInfo> {
    try {
      const res = await this.service.get("/v1/customers/{id}".replace("{id}", customerId));
      if (options?.onSuccess) {
        await options.onSuccess(res.data);
      }
      return res.data;
    } catch (error) {
      if (options?.onError) {
        await options.onError(error.response.data);
      }
    }
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E3%82%AB%E3%83%BC%E3%83%89/operation/getCustomersCustomer_idCards
   */
  async getCustomersCustomerIdCards(
    customerId: string,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<{ list: FincodeNs.CardInfo[] }>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<{ list: FincodeNs.CardInfo[] }> {
    try {
      const endpoint = "/v1/customers/{customer_id}/cards".replace("{customer_id}", customerId);
      const res = await this.service.get(endpoint);
      if (options?.onSuccess) {
        await options.onSuccess(res.data);
      }
      return res.data;
    } catch (error) {
      if (options?.onError) {
        await options.onError(error.response.data);
      }
    }
  }

  /**
   * [Payment execution](https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/postPayments)
   */
  async paymentExecution(
    orderId: string,
    data: FincodeNs.PaymentExecution,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.OrderDetail>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.OrderDetail> {
    try {
      const endpoint = "/v1/payments/{id}".replace("{id}", orderId);
      const res = await this.service.put(endpoint, {
        ...data,
        ...(data.method ? { method: data.method.toString() } : {}),
        ...(data.pay_times ? { pay_times: data.pay_times.toString() } : {}),
      });
      if (options?.onSuccess) {
        await options.onSuccess(res.data);
      }
      return res.data;
    } catch (error) {
      if (options?.onError) {
        await options.onError(error.response.data);
      }
    }
  }

  /**
   * Acquire 3DS2.0 authentication execution result.
    カード決済available for trades of
   *
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/paths/~1secure2~1%7Baccess_id%7D/get
   */
  async acquire3DS2Result(
    access_id: string,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.OrderDetail>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.Result3DS2> {
    try {
      const endpoint = "/v1/secure2/{access_id}".replace("{access_id}", access_id);
      const res = await this.service.get(`${endpoint}`);
      if (options?.onSuccess) {
        await options.onSuccess(res.data);
      }
      return res.data;
    } catch (error) {
      if (options?.onError) {
        await options.onError(error.response.data);
      }
    }
  }
}
