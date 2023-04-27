import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import {
  getContact,
  updateContact,
  dissociateContactApi,
} from "src/api/contact";

const useContactStore = defineStore("useContact", {
  state() {
    return {
      contact: {},
      currentCustomerId: "",
    };
  },
  getters: {
    getContacts: (state) => state.contact,
    getCurrentCustomerId: (state) => state.currentCustomerId,
  },

  actions: {
    async getContactById(chat) {
      this.currentCustomerId = chat.customers_id;
      const result = await getContact(chat.contacts_id);
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

    async dissociateContact() {
      const payload = {
        customer_id: this.currentCustomerId,
        contact_id: this.contact.id,
      };
      Loading.show();
      await dissociateContactApi(payload);

      Notify.create({
        message: "Successfully",
        position: "top",
        type: "positive",
        color: "blue-9",
      });
      Loading.hide();
    },
  },
});

export default useContactStore;
