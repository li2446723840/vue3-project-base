import { defineStore } from "pinia";
import { loginCallback } from "@/api/login";

export const useUserStore = defineStore({
  id: "user",
  persist: {
    enabled: true,
    strategies: [
      {
        key: "accessToken",
        paths: ["accessToken"],
      },
      {
        key: "userInfo",
        paths: ["userInfo"],
      },
    ],
  },
  state: () => {
    return {
      accessToken: "",
      userInfo: "",
    };
  },
  actions: {
    setToken(payload: any) {
      return new Promise(async (resove, reject) => {
        try {
          const res = await loginCallback(payload);
          if (res.code === 0) {
            this.accessToken = res.data.userToken;
            this.userInfo = res.data;
          }
          resove(res);
        } catch (error) {
          reject(error);
        }
      });
    },
  },
});
