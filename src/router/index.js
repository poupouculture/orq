import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import useUserInfoStore from "stores/modules/userInfo";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const userStore = useUserInfoStore();
    const userProfile = userStore.getUserProfile;
    if (to.path === "/login" && userProfile) {
      return next("/");
    }

    if (to.matched.some((record) => record.meta.requiresAuth) && !userProfile) {
      // need to return, because it throw the warn and will be error if in production
      return next("/login");
    } else {
      return next();
    }
  });

  return Router;
}
