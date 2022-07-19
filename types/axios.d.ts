export interface ApiDataResponse<T = any> {
  code: number;
  data: T;
  message?: string;
  msg?: string;
}
