import { boot } from "quasar/wrappers";
import { LocalStorage } from "quasar";
import useUserInfoStore from "stores/modules/userInfo";
const userStore = useUserInfoStore();

export default boot(async ({ router }) => {
  console.log("boot: getProfile");
  let userData = LocalStorage.getItem("userinfo");
  // console.log(userData);
  if (!userData) {
    LocalStorage.remove("userinfo");
    userStore.$reset();
    router.push("/login");
    return;
  }

  userData = JSON.parse(userData);

  if (!userData?.access_token) {
    return;
  }

  try {
    const userInfo = useUserInfoStore();
    const user = await userInfo.getProfile();
    if (!user) {
      LocalStorage.remove("userinfo");
      router.push("/login");
    }
  } catch (err) {
    console.log(err);
  }
});
