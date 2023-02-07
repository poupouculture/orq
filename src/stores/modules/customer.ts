import { defineStore } from "pinia";
import {
  getCustomer,
  addContact,
  addCustomerContact,
  addCustomer,
  updateCustomer,
} from "../../api/customers";
import { IState, FormPayload } from "src/types/CustomerTypes";
import { getUser } from "src/api/user";

const useCustomerStore = defineStore("customer", {
  state: () =>
    ({
      customer: {
        customer_code: "",
        date_created: "",
        date_updated: "",
        dob: "",
        email: "",
        first_name: "",
        gender: "",
        id: null,
        id_number: "",
        isActive: true,
        last_name: "",
        position: "",
        status: "",
        user_created: "",
        user_updated: "",
        customer_groups: [],
        companies: [],
      },
    } as unknown as IState),
  getters: {
    getCustomer: (state) => state.customer,
  },
  actions: {
    async fetchCustomer(id: string) {
      const {
        data: { data: customer },
      } = await getCustomer(id);
      this.customer = customer;
    },
    async fetchUser(id: string) {
      const {
        data: { data: user },
      } = await getUser(id);
      this.customer = user;
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
