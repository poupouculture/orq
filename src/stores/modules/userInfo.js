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
    userId: "",
    userRoleName: "",
    pageActions: null,
  }),
  getters: {
    token: (state) => state.userInfo?.access_token,
    getUserInfo: (state) => state.userInfo,
    getUserProfile: (state) => state.userProfile,
    getUserId: (state) => state.userId,
    getUserRoleName: (state) => state.userRoleName,
    getAllUserPages: (state) => {
      return state.userProfile?.role.pages || [];
    },
  },
  actions: {
    getPageActionsByPageId(id, pageActionName) {
      if (!this.pageActions) {
        this.refreshPageActions();
      }
      if (!this.pageActions[id]) {
        return false;
      }
      return this.pageActions[id][pageActionName];
      // const pages = this.getAllUserPages.filter(
      //   (page) => page?.pages_id?.id === id
      // );
      // return (
      //   pages.map((page) =>
      //     page?.pages_id?.page_actions.find(
      //       (action) => action.name === pageActionName
      //     )
      //   )[0]?.status === "published"
      // );
    },
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
            this.userId = user?.id;
            this.userRoleName = user?.role.name;
            this.refreshPageActions();
          }
          return data;
        } else {
          this.$reset();
          LocalStorage.clear();
          this.router.push("/login");
        }
      } catch (err) {
        this.router.push("/login");
      }
    },
    /**
     * looks at all pages with status='published' and established accessible actions
     * @returns
     */
    async refreshPageActions() {
      // const pages = this.getAllUserPages.filter(
      //   (page) => page?.pages_id?.id === id
      // );
      console.log("refreshPageActions");
      if (this.pageActions && Object.keys(this.pageActions).length > 0) return;
      if (!this.pageActions) this.pageActions = {};
      const pagesWithActions = this.getAllUserPages.filter(
        (page) => page?.pages_id?.page_actions != null
      );
      // console.log("pages with pageActions", pages);
      pagesWithActions.forEach((page) => {
        // console.log(page);
        page?.pages_id?.page_actions.forEach((action) => {
          console.log(action);
          if (action.status === "published") {
            const pageId = page?.pages_id?.id;
            if (!this.pageActions[pageId]) {
              this.pageActions[pageId] = {};
            }
            this.pageActions[pageId][action.name] = true;
          }
        });
      });
      console.log("pageActions", this.pageActions);
      // return (
      //   pages.map((page) =>
      //     page?.pages_id?.page_actions.find(
      //       (action) => action.name === this.pageActionName
      //     )
      //   )[0]?.status === "published"
      // );
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
        } else {
          this.$reset();
          LocalStorage.clear();
          this.router.push("/login");
        }
      } catch (err) {
        this.$reset();
        LocalStorage.clear();
        this.router.push("/login");
        Notify.create({
          message: "Login timeout. Please Log in again",
          type: "positive",
          position: "top",
          color: "primary",
        });
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
