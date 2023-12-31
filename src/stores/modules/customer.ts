import { defineStore } from "pinia";
import {
  getCustomer,
  // addContact,
  addCustomerContact,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerContactAlong,
} from "../../api/customers";
import { IState, FormPayload, ICustomer } from "src/types/CustomerTypes";
import { getUser } from "src/api/user";
import { Loading, Notify } from "quasar";
// import useContactStore from "./contact";
// const contactStore = useContactStore();

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
        company_cd: "",
      },
      user: null,
      resetForm: false,
    } as unknown as IState),
  getters: {
    getCustomer: (state) => state.customer,
    isCustomerExist: (state) => !!state.customer?.id,
  },
  actions: {
    async deleteCustomer(id: [string]) {
      Loading.show();

      try {
        const { data } = await deleteCustomer(id);

        Notify.create({
          message: "Successful to delete customer",
          position: "top",
          color: "primary",
          type: "positive",
        });

        return data;
      } catch (err: any) {
        Notify.create({
          message: `Error: ${
            err.response.data?.errors[0]?.message || "Fail to updated"
          }`,
          position: "top",
          type: "negative",
        });
      } finally {
        Loading.hide();
      }

      deleteCustomer(id)
        .then((res) => {
          console.log(res.data);
        })
        .finally(() => {
          Loading.hide();

          // try {
          //   const {
          //     data: { data },
          //   } = await deleteCustomer(ids);
          //   Notify.create({
          //     message: "Successful to delete customer",
          //     position: "top",
          //     color: "primary",
          //     type: "positive",
          //   });
          //   Loading.hide();
          //   return data;
          // } catch (err: any) {
          //   console.log(err);
          //   Notify.create({
          //     message: `Error: ${
          //       err.response.data?.errors[0]?.message || "Fail to updated"
          //     }`,
          //     position: "top",
          //     type: "negative",
          //   });
          //   Loading.hide();
          // }
        });
    },
    /**
     * fetch from api and set customer store
     * @param id
     * @returns
     */
    async fetchCustomer(id: string) {
      try {
        const data = await getCustomer(id);
        if (data) {
          const customer = data?.data?.data;
          this.setCustomer(customer);
          // store to contact store because the customer related the contacts
          // if (customer?.contacts.length === 1) {
          //   const contact = customer?.contacts[0].contacts_id;
          //   // contactStore.setCurrentCustomerId(customer.id);
          //   contactStore.setContact(contact);
          // }
          return customer;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    setCustomer(customer: ICustomer | null) {
      if (customer === null) {
        this.customer = {
          customer_code: "",
          date_created: "",
          date_updated: "",
          dob: "",
          email: "",
          first_name: "",
          gender: "",
          id: "",
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
          company_cd: "",
        };
      } else {
        this.customer = [customer].map((item: ICustomer) => ({
          ...item,
          customer_groups:
            item.customer_groups?.filter(
              (data: any) => data.customer_groups_id
            ) || [],
          tags: item.tags?.filter((data: any) => data.tags_id) || [],
          companies:
            item.companies?.filter((data: any) => data.companies_id) || [],
        }))[0] as ICustomer;
      }
    },
    async fetchUser(id: string) {
      const {
        data: { data: user },
      } = await getUser(id);
      this.user = user;
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
    async addContact(customerId: string, contactId: string) {
      const result = await addCustomerContactAlong({
        contact_id: contactId,
        customer_id: customerId,
      });
      return result;
    },
    async addCustomer(payload: FormPayload) {
      Loading.show();
      try {
        const data = await addCustomer(payload);

        if (data.data?.errors) {
          Notify.create({
            message: "Error: " + data.data.errors[0].message,
            type: "negative",
          });
        } else {
          Notify.create({
            message: "Successful to saved customer",
            position: "top",
            color: "primary",
            type: "positive",
          });

          this.setCustomer(data.data.data);
        }
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
