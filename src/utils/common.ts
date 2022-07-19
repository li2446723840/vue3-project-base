import { NumorString, AnyFunction, TimeoutHandle } from "./types";
/**
 * @description 手机号校验
 */
export const isPhone = function (phone: string): boolean {
  const pattern = /^1[3456789]\d{9}$/;
  return pattern.test(phone);
};
/**
 * @description 数字千分位
 * @param num 数字
 * @return 千分位数字
 */
export const numDeal = function (num: NumorString): NumorString {
  if (!num) return num == 0 ? 0 : "";
  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  const numArr = num.toString().split(".");
  const point = numArr[1] ? "." + numArr[1] : "";
  return numArr[0].replace(reg, "$&,") + point;
};

/**
 * @description 价格转换 分-→元
 */
export const priceTransform = function (price: any): NumorString {
  const priceTemp = isNaN(Number(price)) ? 0 : Number(price);
  const rmb = priceTemp / 100;
  return Number.isInteger(rmb) ? rmb : rmb.toFixed(2);
};

/**
 * @description vue模板价格展示
 */
export const priceShow = function (num: NumorString): NumorString {
  return numDeal(priceTransform(num));
};

/**
 * @description 复制函数
 * @param id dom的id
 * @param cb 复制成功后的回调
 */
export const copyHandler = function (id: string, cb: any): void {
  try {
    const dom = document.querySelector(`#${id}`);
    if (!dom) {
      return;
    }
    (dom as any).select();
    document.execCommand("Copy");
    cb && cb();
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description 防抖函数
 * @param fn 最后执行的函数
 * @param wait 多少秒执行
 * @param immediate 是否立即执行
 * @return 返回闭包函数
 */
export const debounce = function (fn: AnyFunction, wait: number, immediate: boolean) {
  let timer: TimeoutHandle;
  let imFlag = immediate ? true : false;
  return function (...args: any[]) {
    clearTimeout(timer);
    if (imFlag) {
      if (fn) {
        // @ts-ignore
        fn.apply(this, args);
      }
      imFlag = false;
    } else {
      timer = setTimeout(() => {
        // @ts-ignore
        fn.apply(this, args);
      }, wait);
    }
  };
};
