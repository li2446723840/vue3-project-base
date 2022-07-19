import { isPhone } from "./common";

/**
 * @description 手机号
 */
const validPhone = function (msg: string) {
  return function (rule: any, value: any, callback: any) {
    if (!isPhone(value)) {
      callback(new Error(msg));
    } else {
      callback();
    }
  };
};

/**
 * @description element-form校验函数
 * @param type 需要那些校验规则
 * @return 返回校验列表
 */
export const validRule = function (
  type: string | string[],
  msg = "不能为空",
  trigger = "change",
): any[] {
  const validList: any[] = [];
  const types = typeof type === "string" ? [type] : type;
  types.forEach((val) => {
    if (val === "required") {
      validList.push({ required: true, message: msg, trigger });
    }
    if (val === "phone") {
      validList.push({ validator: validPhone(msg), message: msg, trigger });
    }
  });
  return validList;
};
