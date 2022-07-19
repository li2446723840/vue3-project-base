import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "@/style/index.less";
import store from "@/store";
import ElementIcons from "@/plugin/elementIcons";

const app = createApp(App);
app.use(ElementIcons);
app.use(store);

app.use(router).mount("#app");
