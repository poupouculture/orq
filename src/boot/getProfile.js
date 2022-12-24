import { boot } from "quasar/wrappers";
import { LocalStorage } from "quasar";
import useUserInfoStore from "stores/modules/userInfo";

export default boot(async ({ router }) => {
  const userInfo = useUserInfoStore();

  try {
    const user = await userInfo.getProfile();
    if (!user) {
      LocalStorage.remove("userinfo");
      router.push("/login");
    }
  } catch (err) {
    console.log(err);
  }
});
