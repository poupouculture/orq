import { api } from "boot/axios";

export const getFirebaseToken = async () => {
  const result = await api.get(`waba/whoami-firebase`);
  return result;
};
