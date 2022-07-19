import { http } from "@/utils/http";
import {
  sendMsgParams,
  sendMsgRes,
  loginParams,
  loginRes,
  loginCallbackParams,
  loginCallbackRes,
} from "./model/loginModel";

const loginUrl = import.meta.env.VITE_LOGIN_URL;
const baseUrl = import.meta.env.VITE_BASE_URL;

export function sendMsg(data: sendMsgParams) {
  const url = `${loginUrl}/sendMsg`;
  return http.request<sendMsgRes>({
    url,
    method: "post",
    params: data,
  });
}

export function getcaptchaoflogin(params: any) {
  const url = `${loginUrl}/getcaptchaoflogin`;
  return http.request({
    url,
    method: "get",
    params,
    responseType: "blob",
  });
}

export function login(data: loginParams, headers: any) {
  const url = `${loginUrl}/login`;
  return http.request<loginRes>({
    url,
    method: "post",
    data,
    headers,
  });
}

export function loginCallback(params: loginCallbackParams) {
  const url = `${baseUrl}/loginCallback`;
  return http.request<loginCallbackRes>({
    url,
    method: "get",
    params,
  });
}
