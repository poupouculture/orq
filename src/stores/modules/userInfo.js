import { defineStore } from "pinia";
import { api, axiosInstance } from "boot/axios";
import { LocalStorage } from "quasar";

const useUserInfoStore = defineStore("userInfo", {
  state: () => ({
    userInfo: {
      access_token: "",
      expires: null,
      refresh_token: "",
    },
    userProfile: null,
  }),
  getters: {
    token: (state) => state.userInfo?.access_token,
    getUserInfo: (state) => state.userInfo,
    getUserProfile: (state) => state.userProfile,
  },
  actions: {
    async login(params) {
      try {
        api.defaults.headers.common.Authorization = ``;
        const {
          data: { data },
        } = await api.post("/auth/login", params);

        this.userInfo = data;

        LocalStorage.set("userinfo", JSON.stringify(data));

        await this.getProfile();

        this.router.push("/");
      } catch (err) {
        console.log(err);
      }
    },
    async getProfile() {
      try {
        const userinfo = JSON.parse(LocalStorage.getItem("userinfo"));
        if (userinfo) {
          api.defaults.headers.common.Authorization = `Bearer ${userinfo.access_token}`;

          const {
            data: { data },
          } = await api.get(
            "/users/me?fields=*,role.description, role.name, role.tags, role.pages.pages_id.*,role.pages.pages_id.children.*"
          );

          this.userProfile = data;
          return data;
        }
      } catch (err) {
        console.log(err);
        this.router.push("/login");
      }
    },
    async refreshToken() {
      try {
        const userinfo = JSON.parse(LocalStorage.getItem("userinfo"));
        if (userinfo) {
          axiosInstance.defaults.headers.common.Authorization = ``;
          const {
            data: { data },
          } = await axiosInstance.post("/auth/refresh", {
            refresh_token: userinfo.refresh_token,
          });
          this.userInfo = data;

          LocalStorage.set("userinfo", JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.log(err);
        this.router.push("/login");
      }
    },
    setUserInfo(params) {
      this.userInfo = params;
    },
    setUserProfile(params) {
      this.userProfile = params;
    },
  },
});

export default useUserInfoStore;
