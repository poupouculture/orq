import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import {
  deleteCustomerGroup,
  deleteCustomer,
  getCustomerGroups,
  addCustomerToCustomerGroup,
} from "src/api/customerGroup";

const useCustomerGroupStore = defineStore("customerGroup", {
  state: () => ({
    items: [],
    item: null,
    meta: {
      total_count: 0,
      filter_count: 0,
    },
  }),
  getters: {
    getCustomer: (state) => state.customer,
  },
  actions: {
    async getAll(rowsPerPage = 4, page = 1) {
      const {
        data: { data: customerGroups, meta },
      } = await getCustomerGroups({
        limit: rowsPerPage,
        page,
      });
      this.items = customerGroups.filter((item) => item !== null);
      this.meta = {
        ...this.meta,
        total_count: meta?.total_count,
        filter_count: meta?.filter_count,
      };
    },
    async get(id) {
      const {
        data: { data: customerGroups },
      } = await getCustomerGroups({}, id);
      this.item = customerGroups;
    },
    async addCustomer(payload) {
      Loading.show();
      try {
        await addCustomerToCustomerGroup(payload);
        Loading.hide();
        Notify.create({
          message: "Customer successfully added!",
        });
        this.getAll();
      } catch (error) {}
      Loading.hide();
    },
    async delete(id) {
      try {
        await deleteCustomerGroup(id);
        this.items = this.items.filter((item) => item.id !== id);
        Notify.create({
          message: "Customer Group successfully deleted!",
        });
        this.getAll();
      } catch (error) {
        Notify.create({
          message: error,
        });
      }
    },
    async deleteCustomer(id, customerId) {
      Loading.show();
      try {
        await deleteCustomer(id, customerId);
        Loading.hide();
        Notify.create({
          message: "Customer successfully deleted!",
        });
        this.getAll();
      } catch (error) {
        Notify.create({
          message: error,
        });
      }
      Loading.hide();
    },
  },
});

export default useCustomerGroupStore;
