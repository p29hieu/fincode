import axios, { AxiosInstance } from "axios";
import { FincodeNs } from "./types";

type FincodeConfig = {
  baseUrl: string;
  dashBoardUrl: string;
  secretKey: string;
  publicKey: string;
};
export class FincodeService {
  static _instance: FincodeService;

  static getConfig(config?: Partial<FincodeConfig>): FincodeConfig {
    config ??= {};
    config.secretKey = config.secretKey || process.env.FINCODE_SK;
    config.publicKey = config.publicKey || process.env.FINCODE_PK;
    if (!config.secretKey) {
      throw new Error("config.secretKey or env FINCODE_SK must be required");
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
    return config as FincodeConfig;
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

  static createInstance(config?: Partial<FincodeConfig>) {
    const instance = new FincodeService();
    instance.config(config);
    return instance;
  }

  private _config: FincodeConfig;
  private _service: AxiosInstance;

  private get service() {
    return this._service;
  }

  get configData() {
    return this._config;
  }

  config(config?: Partial<FincodeConfig>) {
    this._config = FincodeService.getConfig(config);
    this._service = axios.create({
      baseURL: this._config.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this._config.secretKey}`,
      },
    });
  }

  /**
   *
   * ref: https://docs.fincode.jp/api#tag/%E9%A1%A7%E5%AE%A2/operation/postCustomers
   */
  async postCustomers(
    data: FincodeNs.PostCustomerRequest,
    options?: { onSuccess?: FincodeNs.Callback.Success<FincodeNs.CustomerInformationResponse>; onError?: FincodeNs.Callback.Error },
  ): Promise<FincodeNs.CustomerInformationResponse> {
    try {
      const res = await this.service.post("/v1/customers", data);
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
   * ref: https://docs.fincode.jp/api#tag/%E9%A1%A7%E5%AE%A2/operation/getCustomers
   */
  async getCustomers(options?: {
    onSuccess?: FincodeNs.Callback.Success<FincodeNs.CustomersResponse>;
    onError?: FincodeNs.Callback.Error;
  }): Promise<FincodeNs.CustomersResponse> {
    try {
      const res = await this.service.get("/v1/customers");
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
   * ref: https://docs.fincode.jp/api#tag/%E9%A1%A7%E5%AE%A2/operation/putCustomersId
   */
  async putCustomersId(
    customerId: string,
    data: Partial<FincodeNs.PostCustomerRequest>,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.CustomerInfo>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.CustomerInfo> {
    try {
      const oldData = await this.getCustomersId(customerId);
      const res = await this.service.put("/v1/customers/{id}".replace("{id}", customerId), {
        ...oldData,
        ...data,
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
   *
   * ref: https://docs.fincode.jp/api#tag/%E9%A1%A7%E5%AE%A2/operation/deleteCustomersId
   */
  async deleteCustomersId(
    customerId: string,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.CustomerInfo>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.CustomerInfo> {
    try {
      const endpoint = "/v1/customers/{id}".replace("{id}", customerId);
      const res = await this.service.delete(endpoint);
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
   * ref: https://docs.fincode.jp/api#tag/%E3%82%AB%E3%83%BC%E3%83%89/operation/postCustomersCustomer_idCards
   */
  async registerCard(
    customerId: string,
    data: FincodeNs.RegisterCardRequest,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.RegisterCardResponse>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.RegisterCardResponse> {
    try {
      const endpoint = "/v1/customers/{customer_id}/cards".replace("{customer_id}", customerId);
      const res = await this.service.post(endpoint, data);
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
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.CardInfo[]>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.CardInfo[]> {
    if (!this._config.publicKey) {
      throw new Error("publicKey is required");
    }
    try {
      const endpoint = "/v1/customers/{customer_id}/cards".replace("{customer_id}", customerId);
      const res = await axios.get(this._config.baseUrl + endpoint, {
        headers: {
          Authorization: `Bearer ${this._config.publicKey}`,
        },
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
   *
   * ref: https://docs.fincode.jp/api#tag/%E3%82%AB%E3%83%BC%E3%83%89/operation/deleteCustomersCustomer_idCardsId
   */
  async deleteCustomersCustomerIdCardsId(
    customerId: string,
    cardId: string,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.DeleteCardSuccess>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.DeleteCardSuccess> {
    try {
      const endpoint = "/v1/customers/{customer_id}/cards/{id}".replace("{customer_id}", customerId).replace("{id}", cardId);
      const res = await this.service.delete(endpoint);
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
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/postPayments
   */
  async createOrder(
    data: FincodeNs.SettlementRegistration,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<{ access_id: string; id: string }>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<{ access_id: string; id: string }> {
    try {
      const res = await this.service.post("/v1/payments", {
        ...data,
        ...(data.amount ? { amount: `${Math.ceil(data.amount)}` } : {}),
        ...(data.tds2_type ? { tds2_type: data.tds2_type.toString() } : {}),
        ...(data.tds_type ? { tds_type: data.tds_type.toString() } : {}),
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
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/putPaymentsId
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
   * Performs sales confirmation processing for payment. Available for transactions with settlement
    カード決済status of AUTHORIZEDor for transactions with settlement status of .CANCELED
    PayPayAUTHORIZED
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/putPaymentsIdCapture
   */
  async putPaymentsIdCapture(
    orderId: string,
    data: FincodeNs.ConfirmSales,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.OrderDetail>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.OrderDetail> {
    try {
      const endpoint = "/v1/payments/{id}/capture".replace("{id}", orderId);
      const res = await this.service.put(endpoint, {
        ...data,
        ...(data.method ? { method: data.method.toString() } : {}),
      });
      if (options?.onSuccess) {
        await options.onSuccess(res.data);
      }
      return res?.data;
    } catch (error) {
      if (options?.onError) {
        await options.onError(error.response.data);
      }
    }
  }

  /**
   * [putPaymentsIdCancel](https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/putPaymentsIdCancel)
   * We will cancel the payment.
   */
  async putPaymentsIdCancel(
    orderId: string,
    data: FincodeNs.PayType & FincodeNs.AccessId,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.OrderDetail>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.OrderDetail> {
    try {
      const endpoint = "/v1/payments/{id}/cancel".replace("{id}", orderId);
      const res = await this.service.put(endpoint, {
        ...data,
      });
      if (options?.onSuccess) {
        await options.onSuccess(res.data);
      }
      return res?.data;
    } catch (error) {
      if (options?.onError) {
        await options.onError(error.response.data);
      }
    }
  }

  /**
   * Analyze 3D Secure results and use that information to make payments.
   *
   * カード決済available for trades of
   *
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/putPaymentsIdSecure
   */
  async paymentAfterAuthentication(
    orderId: string,
    data: FincodeNs.PaymentAfterAuthentication,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.OrderDetail>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.OrderDetail> {
    try {
      const endpoint = "/v1/payments/{id}/secure".replace("{id}", orderId);
      const res = await this.service.put(endpoint, data);
      if (options?.onSuccess) {
        await options.onSuccess(res.data);
      }
      return res?.data;
    } catch (error) {
      if (options?.onError) {
        await options.onError(error.response.data);
      }
    }
  }

  /**
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/operation/getPaymentsId
   */
  async getPaymentsId(
    orderId: string,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.OrderDetail>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.OrderDetail> {
    try {
      const endpoint = "/v1/payments/{id}".replace("{id}", orderId);
      const query = new URLSearchParams({ pay_type: "Card" }).toString();
      const res = await this.service.get(`${endpoint}?${query}`);
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
   * Perform 3DS2.0 authentication.
    カード決済available for trades of
   *
   * ref: https://docs.fincode.jp/api#tag/%E6%B1%BA%E6%B8%88/paths/~1secure2~1%7Baccess_id%7D/put
   */
  async perform3DS2Authentication(
    access_id: string,
    data: FincodeNs.Run3DS2Authentication,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.Result3DS2Authentication>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.Result3DS2Authentication> {
    try {
      const endpoint = "/v1/secure2/{access_id}".replace("{access_id}", access_id);
      const res = await this.service.put(`${endpoint}`, data);
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
   * [Obtain platform sales list.](https://docs.fincode.jp/api#tag/%E3%83%97%E3%83%A9%E3%83%83%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E5%A3%B2%E4%B8%8A/operation/getPlatform_accounts)
   */
  async getPlatformSaleList<T = FincodeNs.PlatformSale.ObtainsPlatformSalesList>(
    params?: FincodeNs.PlatformSale.PlatformSaleListRequest,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<T>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<T> {
    try {
      const endpoint = "/v1/accounts";
      const { data } = await this.service.get<T>(`${endpoint}`, { params });
      if (options?.onSuccess) {
        await options.onSuccess(data);
      }
      return data;
    } catch (error) {
      if (options?.onError) {
        await options.onError(error.response.data);
      }
    }
  }
  /**
   * [Obtain platform sales](https://docs.fincode.jp/api#tag/%E3%83%97%E3%83%A9%E3%83%83%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E5%A3%B2%E4%B8%8A/operation/getPlatform_accountsId)
   */
  async getPlatformSaleDetail<T = FincodeNs.PlatformSale.PlatformSaleDetail>(
    ID: string,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<T>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<T> {
    try {
      const endpoint = "/v1/accounts/{id}".replace("{id}", ID);
      const { data } = await this.service.get<T>(endpoint);
      if (options?.onSuccess) {
        await options.onSuccess(data);
      }
      return data;
    } catch (error) {
      if (options?.onError) {
        await options.onError(error.response.data);
      }
    }
  }
}
