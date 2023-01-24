import { defineStore } from "pinia";
import {
  getCustomer,
  addContact,
  addCustomerContact,
  addCustomer,
  updateCustomer,
} from "../../api/customers";
import { IState, FormPayload } from "src/types/CustomerTypes";

const useCustomerStore = defineStore("customer", {
  state: () =>
    ({
      customer: null,
    } as unknown as IState),
  getters: {
    getCustomer: (state) => state.customer,
  },
  actions: {
    resetCustomer() {
      this.customer = null;
    },
    async fetchCustomer(id: string) {
      const {
        data: { data: customer },
      } = await getCustomer(id);
      this.customer = customer;
    },
    async updateCustomer(id: string, payload: FormPayload) {
      const {
        data: { data },
      } = await updateCustomer(id, payload);
      return data;
    },
    async addContact(customerId: string, payload: unknown) {
      const {
        data: { data: contact },
      } = await addContact(payload);
      const { id: contactId } = contact;

      const result = await addCustomerContact(customerId, contactId);
      return result;
    },
    async addCustomer(payload: FormPayload) {
      const {
        data: { data },
      } = await addCustomer(payload);
      return data;
    },
    async addCustomerContact(customerId: string, contactId: string) {
      const result = await addCustomerContact(customerId, contactId);
      return result;
    },
  },
});

export default useCustomerStore;
