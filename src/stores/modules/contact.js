import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import {
  getContact,
  updateContact,
  dissociateContactApi,
  saveContact,
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
    setCurrentCustomerId(customerID) {
      this.currentCustomerId = customerID;
    },
    setFirstname(firstName) {
      this.contact.first_name = firstName;
    },
    async getContactById(chat) {
      console.log("chat:", chat);
      this.currentCustomerId = chat.customers_id;
      const result = await getContact(chat.contacts_id);
      const { data } = result.data;

      this.contact = data[0];
    },
    async saveContact(payload) {
      const getObj = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        // is_active: payload.is_active,
        number: payload.number,
        status: payload.status,
      };
      Loading.show();
      try {
        await saveContact(getObj);
        Notify.create({
          message: "Create Contact Successfully",
          position: "top",
          type: "positive",
          color: "primary",
        });
      } catch (error) {
        console.log(error);
      }
      Loading.hide();
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
      try {
        const result = await updateContact(payload.id, getObj);
        const { data } = result.data;

        this.contact = data;
        Notify.create({
          message: "Update Contact Successfully",
          position: "top",
          type: "positive",
          color: "primary",
        });
      } catch (error) {
        console.log(error);
      }
      Loading.hide();
    },

    async dissociateContact() {
      const payload = {
        customer_id: this.currentCustomerId,
        contact_id: this.contact.id,
      };
      Loading.show();
      const result = await dissociateContactApi(payload);

      if (result.data.errors) {
        Notify.create({
          message: "Failed: " + result.data.errors[0].message,
          type: "error",
        });
      } else {
        Notify.create({
          message: "Successfully",
          position: "top",
          type: "positive",
          color: "blue-9",
        });

        this.currentCustomerId = "";
      }

      Loading.hide();
    },
  },
});

export default useContactStore;
