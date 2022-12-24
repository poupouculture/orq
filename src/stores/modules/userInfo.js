import { defineStore } from "pinia";
import { api } from "boot/axios";
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
    token: (state) => state.userInfo.access_token,
    getUserInfo: (state) => state.userInfo,
    getUserProfile: (state) => state.userProfile,
  },
  actions: {
    async login(params) {
      try {
        const {
          data: { data },
        } = await api.post("/auth/login", params);

        this.userInfo = data;

        LocalStorage.set("userinfo", JSON.stringify(data));

        api.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
        await this.getProfile();

        this.router.push("/");
      } catch (err) {
        console.log(err);
      }
    },
    async getProfile() {
      try {
        const { data } = await api.get("/users/me");

        this.userProfile = data;
        return data;
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
