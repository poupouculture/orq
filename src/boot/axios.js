import { boot } from "quasar/wrappers";
import axios from "axios";
import { LocalStorage } from "quasar";
import useUserInfoStore from "stores/modules/userInfo";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const userinfo = JSON.parse(LocalStorage.getItem("userinfo"));

if (userinfo) {
  axios.defaults.headers.common.Authorization = `Bearer ${userinfo.access_token}`;
}

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  withCredentials: true,
});

// different axios instance to handle the refresh token. Because
// refresh token need new instance of axios
const axiosInstance = axios.create({ baseURL: process.env.BACKEND_URL });

export default boot(({ app, store, router }) => {
  const userStore = useUserInfoStore(store);
  userStore.setUserInfo(userinfo);

  api.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error) => {
      const originalConfig = error.config;

      if (error.response.status !== 401) {
        return Promise.reject(error);
      }

      if (error.response) {
        if (error.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const result = await userStore.refreshToken();
            originalConfig.headers.Authorization = `Bearer ${result?.access_token}`;
            api.defaults.headers.common.Authorization = `Bearer ${result?.access_token}`;
            return api(originalConfig);
          } catch (err) {
            router.push("/login");
            return Promise.reject(err);
          }
        }
      }
    }
  );

  app.config.globalProperties.$axios = axios;

  app.config.globalProperties.$api = api;
});

export { api, axiosInstance };
