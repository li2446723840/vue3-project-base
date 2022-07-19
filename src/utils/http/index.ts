import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { ApiDataResponse } from "#/axios";
import Axios from "axios";
import { ElMessage } from "element-plus";
import { whiteCodes } from "./codes";

Axios.defaults.withCredentials = true;

const defaultConfig: AxiosRequestConfig = {
  baseURL: "",
  timeout: 1000 * 30,
};
class Request {
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = Axios.create(defaultConfig);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  /**
   * @description 请求拦截器
   */
  private httpInterceptorsRequest(): void {
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 添加逻辑
        return config;
      },
      (error: AxiosError): Promise<any> => {
        return Promise.reject(error);
      },
    );
  }
  /**
   * @description 响应拦截器
   */
  private httpInterceptorsResponse(): void {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.headers.hxe_auth) {
          response.data.data.userToken = response.headers.hxe_auth;
        }
        this.errorHandle(response);
        return response;
      },
      (error: AxiosError): Promise<any> => {
        const { response } = error;
        if (response) {
          this.errorHandle(response);
        } else {
          const message = error.message.includes("timeout")
            ? "请求超时！请检查网络是否正常"
            : "请求失败，请检查网络是否已连接";
          ElMessage.error(message);
        }
        return Promise.reject(error);
      },
    );
  }
  request<T = any, U = any>(config: AxiosRequestConfig): Promise<ApiDataResponse<T> | U> {
    return new Promise((resolve, reject) => {
      this.axiosInstance(config)
        .then((res: AxiosResponse) => {
          resolve(res.data);
        })
        .catch((err: Error | AxiosError) => {
          reject(err);
        });
    });
  }

  /**
   * @description 错误码处理
   * @param { Object } response 响应结果
   */
  private errorHandle(response: AxiosResponse): void {
    switch (response.status) {
      case 401:
      case 403:
        console.log("需求登录");
        break;
      case 404:
        ElMessage.error("请求资源不存在");
        break;
      case 200:
        if (response.config.responseType === "blob") {
          return;
        }
        const code = response.data?.code;
        if (code !== 0 && !Object.keys(whiteCodes).includes(String(code))) {
          ElMessage.error(response.data?.message ?? "出错了");
        }
        break;
    }
  }
}

export const http = new Request();
