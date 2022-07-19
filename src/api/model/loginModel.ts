//sendMsg接口入参
export interface sendMsgParams {
  appKey: string; // appkey
  phone: string; // 手机号
  text?: string; // 图形验证码
}
//sendMsg接口返回值
export interface sendMsgRes {
  msg: any;
  success: boolean;
  token: string; // 短信验证码token
}

export interface loginParams {
  appKey: string;
  areaCode: string;
  code: string;
  phone: string;
  platform: string;
  rememberMe: number;
  timestamp: number;
  responseType: string;
  state: string;
}

export interface loginRes {
  code: string; // 用来置换token
  rememberMe: number;
  state: string;
}

export interface loginCallbackParams {
  code: string;
  rememberMe: number;
  state: number;
}

export interface loginCallbackRes {
  avatar: any;
  platformInfo: any[];
  unionId: string;
  userId: number;
  userName: string;
}
