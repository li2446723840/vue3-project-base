/**
 * @description element icons全局注册
 */
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "@element-plus/icons-vue";

const components = [ArrowDown, ArrowLeft, ArrowRight, ArrowUp];

export default {
  install(app) {
    components.forEach((comp) => {
      app.component(comp.name, comp);
    });
  },
};
