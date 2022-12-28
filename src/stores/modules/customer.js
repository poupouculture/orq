import { defineStore } from "pinia";
import {
  getCustomer,
  addContact,
  addCustomerContact,
} from "src/api/customers.js";

const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: null,
  }),
  getters: {
    getCustomer: (state) => state.customer,
  },
  actions: {
    async fetchCustomer(id) {
      const {
        data: { data: customer },
      } = await getCustomer(id);
      this.customer = customer;
    },
    async addContact(customerId, payload) {
      const {
        data: { data: contact },
      } = await addContact(payload);
      const { id: contactId } = contact;

      const result = await addCustomerContact(customerId, contactId);
      return result;
    },
  },
});

export default useCustomerStore;
