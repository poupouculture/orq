import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import {
  getContact,
  updateContact,
  dissociateContactApi,
  saveContact,
} from "src/api/contact";
import { Contact } from "src/types/ContactTypes";
import { IChat } from "src/types/MessagingTypes";

const useContactStore = defineStore("useContact", {
  state: () => ({
    contact: {
      id: "",
      first_name: "",
      last_name: "",
      number: "",
      category: "",
      preferred_language: "",
    } as Contact,
    contacts: [],
    currentCustomerId: "",
  }),
  getters: {
    getContacts: (state) => state.contact,
    getCurrentCustomerId: (state) => state.currentCustomerId,
  },
  actions: {
    getContactById(id: string) {
      try {
        console.log(id);
      } catch (error) {}
    },
    setCurrentCustomerId(customerID: string) {
      this.currentCustomerId = customerID;
    },
    clearCurrentCustomerId() {
      this.currentCustomerId = "";
    },
    setFirstname(firstName: string) {
      this.contact.first_name = firstName;
    },
    // async getContactById(chat: IChat) {
    //   console.log("fnc:getContactById");
    //   this.currentCustomerId = chat?.customers_id ?? "";
    //   const result = await getContact(chat.contacts_id);
    //   const { data } = result.data;
    //   this.contact = data[0];
    //   return this.contact;
    // },
    async getContactByChat(chat: IChat) {
      console.log("fnc:getContactByChat");
      this.currentCustomerId = chat?.customers_id ?? "";
      const result = await getContact(chat.contacts_id);
      const { data } = result.data;
      this.contact = data[0];
      return this.contact;
    },
    async setContact(contact: Contact) {
      this.contact = contact;
    },
    async saveContact(payload: any) {
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
    async updateContact(payload: any) {
      const getObj = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        is_active: payload.is_active,
        number: payload.number,
        status: payload.status,
        preferred_language: payload.preferred_language,
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

      if (!result || result.status !== 200) {
        Notify.create({
          message:
            "Failed: " + result?.data?.errors[0]?.message || "something error",
          type: "negative",
          position: "top",
        });
      } else {
        Notify.create({
          message: `Successfully Dissociated: ${this.contact?.number}`,
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
