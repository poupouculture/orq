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
    async getAll({
      rowsPerPage = 25,
      page = 1,
      search = undefined,
      type = undefined,
      source = undefined,
    }) {
      const { data } = await getCustomerGroups({
        limit: rowsPerPage,
        page,
        search,
        type,
        source,
      });
      this.items = data.data.filter((item) => item !== null);
      this.meta = {
        ...this.meta,
        total_count: data.total_count,
        filter_count: data.filter_count,
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
          position: "top",
          type: "positive",
          color: "primary",
        });
      } catch (error) {}
      Loading.hide();
    },
    async delete(id) {
      try {
        Loading.show();
        await deleteCustomerGroup(id);
        this.items = this.items.filter((item) => item.id !== id);
        Loading.hide();
        Notify.create({
          message: "Customer Group successfully deleted!",
          position: "top",
          type: "positive",
          color: "primary",
        });
      } catch (error) {
        Notify.create({
          message: error,
        });
      }
      this.getAll({
        rowsPerPage: 25,
      });
    },
    async deleteCustomer(id, customerId) {
      Loading.show();
      try {
        await deleteCustomer(id, customerId);
        Loading.hide();
        Notify.create({
          message: "Customer successfully deleted!",
          position: "top",
          type: "positive",
          color: "primary",
        });
      } catch (error) {
        console.log(error);
        Notify.create({
          message: error,
        });
      }
      Loading.hide();
    },
    setMeta(val) {
      this.meta.page = val.page;
    },
  },
});

export default useCustomerGroupStore;
