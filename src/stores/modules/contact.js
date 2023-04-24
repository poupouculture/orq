import { defineStore } from "pinia";

import { getContact } from "src/api/contact";

const useContactStore = defineStore("useContact", {
  state() {
    return {
      contact: {},
    };
  },
  getters: {
    getContacts: (state) => state.contact,
  },

  actions: {
    async getContactById(id) {
      const result = await getContact(id);
      const { data } = result.data;

      this.contact = data[0];
    },
  },
});

export default useContactStore;
