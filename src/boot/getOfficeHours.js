import { boot } from "quasar/wrappers";
import useMessagingStore from "src/stores/modules/messaging";

export default boot(async ({ store }) => {
  const messagingStore = useMessagingStore(store);
  messagingStore.officeHours_get_set();
});
