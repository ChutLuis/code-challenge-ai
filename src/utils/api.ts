import { AxiosRequestConfig } from "axios";
import apiFacade from "./apiFacade";

const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    return await apiFacade.get<T>(url, config);
  },

  post: async <T>(url: string, data: any, config?: AxiosRequestConfig) => {
    return await apiFacade.post<T>(url, data, config);
  },
};

export default api;