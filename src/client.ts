import axios, { AxiosInstance } from "axios";
import { FincodeNs } from "./types";
import { CardObject, CustomerObject, Executing3DSecureAuthResponse, PaymentObject, ExecutingPaymentRequest } from "@fincode/js";
import { assert } from "console";

type Config = {
  isLiveMode?: boolean;
  publicKey: string;
  /**
   * Unique value (UUIDv4)
   *
   * Please specify a unique value for each request in a format that follows the idempotent key UUIDv4.
   *
   * For more information, see [idempotent processing](https://docs.fincode.jp/api#tag/%E5%86%AA%E7%AD%89%E5%87%A6%E7%90%86) .
   */
  idempotentKey?: string;
  /**
   * *For platforms
   *
   * Used when the platform executes the API as a tenant.
   *
   * Please specify the shop ID of the tenant belonging to the operating platform.
   */
  tenantShopId?: string;
};
export class FincodeClientService {
  private service: AxiosInstance;
  private baseUrl: string;
  private dashBoardUrl: string;
  private publicKey: string;
  private tenantShopId?: string;
  private idempotentKey?: string;
  private isLiveMode: boolean;

  constructor(config: Config) {
    if (!config.publicKey) {
      throw new Error("publicKey must be required");
    }
    this.isLiveMode = config.isLiveMode || false;
    this.publicKey = config.publicKey;
    this.idempotentKey = config.idempotentKey;
    this.tenantShopId = config.tenantShopId;
    if (this.isLiveMode) {
      this.dashBoardUrl = "https://dashboard.fincode.jp";
      this.baseUrl = "https://api.fincode.jp";
    } else {
      this.dashBoardUrl = "https://dashboard.test.fincode.jp";
      this.baseUrl = "https://api.test.fincode.jp";
    }
    this.service = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.publicKey}`,
        ...(this.tenantShopId ? { "Tenant-Shop-Id": this.tenantShopId } : {}),
        ...(this.idempotentKey ? { idempotent_key: this.idempotentKey } : {}),
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
      onSuccess?: FincodeNs.Callback.Success<CustomerObject>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<CustomerObject> {
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
      onSuccess?: FincodeNs.Callback.Success<FincodeNs.ListResponse<CardObject>>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<FincodeNs.ListResponse<CardObject>> {
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
    data: ExecutingPaymentRequest,
    options?: {
      onSuccess?: FincodeNs.Callback.Success<PaymentObject>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<PaymentObject> {
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
      onSuccess?: FincodeNs.Callback.Success<PaymentObject>;
      onError?: FincodeNs.Callback.Error;
    },
  ): Promise<Executing3DSecureAuthResponse> {
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
