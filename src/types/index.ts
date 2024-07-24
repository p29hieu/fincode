import { APIErrorResponse } from "@fincode/js";

export namespace FincodeNs {
  export namespace Callback {
    export type Success<T> = (data: T) => void | PromiseLike<void> | Promise<void>;
    export type Error = (error: APIErrorResponse) => void | PromiseLike<void> | Promise<void>;
  }
  export type ListResponse<T> = {
    total_count?: number | null;
    last_page?: number | null;
    current_page?: number | null;
    limit?: number | null;
    link_next?: string | null;
    link_previous?: string | null;
    list?: T[] | null;
  };
}
