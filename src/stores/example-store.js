import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    isChecked: false,
    login: { email: "", password: "" },
    loading: false,
    isShow: false,
    message: "",
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
