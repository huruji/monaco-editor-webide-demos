import retry from "fetch-retry";
import { map } from "lodash";

type Options = {
  baseUrl?: string;
};

const fetchWithRetry = retry(fetch);

class ApiClient {
  baseUrl: string;

  constructor(options: Options = {}) {
    this.baseUrl = options.baseUrl || "/api";
  }

  fetch = async (
    path: string,
    method: string,
    data: Record<string, any> | FormData | undefined,
    options: Record<string, any> = {}
  ) => {
    let body: string | FormData | undefined;
    let modifiedPath;
    let urlToFetch;
    let isJson;

    if (method === "GET") {
      if (data) {
        modifiedPath = `${path}?${data && this.constructQueryString(data)}`;
      } else {
        modifiedPath = path;
      }
    } else if (method === "POST" || method === "PUT") {
      if (data instanceof FormData || typeof data === "string") {
        body = data;
      }

      // Only stringify data if its a normal object and
      // not if it's [object FormData], in addition to
      // toggling Content-Type to application/json
      if (
        typeof data === "object" &&
        (data || "").toString() === "[object Object]"
      ) {
        isJson = true;
        body = JSON.stringify(data);
      }
    }

    if (path.match(/^http/)) {
      urlToFetch = modifiedPath || path;
    } else {
      urlToFetch = this.baseUrl + (modifiedPath || path);
    }

    let response;

    try {
      response = await fetchWithRetry(urlToFetch, {
        method,
        body,
        cache: "no-cache",
      });
    } catch (err) {
    }

    const status = (response?.status || 0)

    const success = status >= 200 && status < 300;

    if (options.download && success) {
    } else if (success && status === 204) {
      return;
    } else if (success) {
      return response?.json();
    }
  };

  get = (
    path: string,
    data: Record<string, any> | undefined = {},
    options?: Record<string, any>
  ) => {
    return this.fetch(path, "GET", data, options);
  };

  post = (
    path: string,
    data?: Record<string, any> | undefined,
    options?: Record<string, any>
  ) => {
    return this.fetch(path, "POST", data, options);
  };

  private constructQueryString = (data: Record<string, any>) => {
    return map(
      data,
      (v, k) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    ).join("&");
  };
}

export const client = new ApiClient();
