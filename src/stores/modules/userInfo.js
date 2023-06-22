import { defineStore } from "pinia";
import { api, axiosInstance } from "boot/axios";
import { LocalStorage, Notify } from "quasar";

const useUserInfoStore = defineStore("userInfo", {
  state: () => ({
    userInfo: {
      access_token: "",
      expires: null,
      refresh_token: "",
    },
    userProfile: null,
    userRoleName: "",
  }),
  getters: {
    token: (state) => state.userInfo?.access_token,
    getUserInfo: (state) => state.userInfo,
    getUserProfile: (state) => state.userProfile,
    getUserRoleName: (state) => state.userRoleName,
  },
  actions: {
    async login(params) {
      try {
        api.defaults.headers.common.Authorization = "";
        const data = await api.post("/auth/login", params);
        if (!data) {
          return Notify.create({
            message: "Invalid user credentials.",
            color: "red-7",
            position: "top",
            type: "negative",
          });
        }
        const user = data.data.data;
        this.userInfo = user;
        LocalStorage.set("userinfo", JSON.stringify(user));
        this.getProfile();
        Notify.create({
          message: "Successful login.",
          color: "blue-9",
          position: "top",
          type: "positive",
        });
        this.router.push("/");
      } catch (err) {
        console.log(err.response, err);
      }
    },
    async getProfile() {
      try {
        const userinfo = JSON.parse(LocalStorage.getItem("userinfo"));
        if (userinfo) {
          api.defaults.headers.common.Authorization = `Bearer ${userinfo.access_token}`;
          // "/users/me?fields=*,role.description,role.name,role.tags,role.pages.pages_id.*,role.pages.pages_id.children.*"
          const data = await api.get(
            "/users/me?fields=id,first_name,last_name,email,role.name,role.pages.pages_id.id,role.pages.pages_id.name,role.pages.pages_id.status,role.pages.pages_id.url,role.pages.pages_id.children.id,role.pages.pages_id.children.parent_id,role.pages.pages_id.children.status,role.pages.pages_id.children.url,role.pages.pages_id.children.name,role.pages.pages_id.children.group_by,role.pages.pages_id.page_actions.*"
          );

          if (data) {
            const user = data.data.data;
            this.userProfile = user;
            this.userRoleName = user?.role.name;
          }
          return data;
        }
      } catch (err) {
        this.router.push("/login");
      }
    },
    async refreshToken() {
      try {
        const userinfo = JSON.parse(LocalStorage.getItem("userinfo"));
        if (userinfo) {
          axiosInstance.defaults.headers.common.Authorization = "";
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
        this.$reset();
        LocalStorage.clear();
        this.router.push("/login");
        // Notify.create({
        //   message: "login timeout",
        //   type: "positive",
        //   position: "top",
        //   color: "primary",
        // });
      }
    },
    setUserInfo(params) {
      this.userInfo = params;
    },
    // setUserProfile(params) {
    //   this.userProfile = params;
    // },
  },
});

export default useUserInfoStore;
