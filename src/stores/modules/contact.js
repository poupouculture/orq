import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import { getContact, updateContact } from "src/api/contact";

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
    async updateContact(payload) {
      const getObj = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        is_active: payload.is_active,
        number: payload.number,
        status: payload.status,
      };
      Loading.show();
      const result = await updateContact(payload.id, getObj);
      const { data } = result.data;

      this.contact = data;

      Notify.create({
        message: "Update Contact Successfully",
        position: "top",
        type: "positive",
        color: "blue-9",
      });
      Loading.hide();
    },
  },
});

export default useContactStore;
