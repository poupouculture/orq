import { defineStore } from "pinia";
import {
  getCustomer,
  addContact,
  addCustomerContact,
  addCustomer,
  updateCustomer,
} from "src/api/customers.js";

const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: null,
  }),
  getters: {
    getCustomer: (state) => state.customer,
  },
  actions: {
    resetCustomer() {
      this.customer = {};
    },
    async fetchCustomer(id) {
      const {
        data: { data: customer },
      } = await getCustomer(id);
      this.customer = customer;
    },
    async updateCustomer(id, payload) {
      const {
        data: { data },
      } = await updateCustomer(id, payload);
      return data;
    },
    async addContact(customerId, payload) {
      const {
        data: { data: contact },
      } = await addContact(payload);
      const { id: contactId } = contact;

      const result = await addCustomerContact(customerId, contactId);
      return result;
    },
    async addCustomer(payload) {
      const {
        data: { data },
      } = await addCustomer(payload);
      return data;
    },
  },
});

export default useCustomerStore;
