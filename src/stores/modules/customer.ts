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
import { Loading, Notify } from "quasar";

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
        tags: [],
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
      Loading.show();
      try {
        const {
          data: { data },
        } = await updateCustomer(id, payload);
        Notify.create({
          message: "Successful to update customer",
          position: "top",
          color: "primary",
          type: "positive",
        });
        Loading.hide();
        return data;
      } catch (err: any) {
        console.log(err);
        Notify.create({
          message: `Error: ${
            err.response.data?.errors[0]?.message || "Fail to updated"
          }`,
          position: "top",
          type: "negative",
        });
        Loading.hide();
      }
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
      Loading.show();
      try {
        const {
          data: { data },
        } = await addCustomer(payload);
        Notify.create({
          message: "Successful to saved customer",
          position: "top",
          color: "primary",
          type: "positive",
        });
        this.customer.id = data.id;
        Loading.hide();
        return data;
      } catch (err: any) {
        Notify.create({
          message: `Error: ${
            err.response.data?.errors[0]?.message || "Fail to saved"
          }`,
          position: "top",
          type: "negative",
        });
        Loading.hide();
      }
    },
    async addCustomerContact(customerId: string, contactId: string) {
      const result = await addCustomerContact(customerId, contactId);
      return result;
    },
  },
});

export default useCustomerStore;
