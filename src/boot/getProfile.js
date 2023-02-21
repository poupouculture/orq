import { boot } from "quasar/wrappers";
import { LocalStorage } from "quasar";
import useUserInfoStore from "stores/modules/userInfo";

export default boot(async ({ router }) => {
  let userData = LocalStorage.getItem("userinfo");
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
