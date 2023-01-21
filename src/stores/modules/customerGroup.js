import { defineStore } from "pinia";
import { Notify } from "quasar";
import { deleteCustomerGroup, getCutomerGroups } from "src/api/customerGroup";

const useCustomerGroupStore = defineStore("customerGroup", {
  state: () => ({
    items: [],
    meta: {
      total_count: 0,
    },
  }),
  getters: {
    getCustomer: (state) => state.customer,
  },
  actions: {
    async getAll(rowsPerPage = 4, page = 1) {
      const {
        data: { data: customerGroups, meta },
      } = await getCutomerGroups({
        limit: rowsPerPage,
        page,
      });
      this.items = customerGroups;
      this.meta = meta;
    },
    async delete(id) {
      try {
        await deleteCustomerGroup(id);
        this.items = this.items.filter((item) => item.id !== id);
        Notify.create({
          message: "Customer Group successfully deleted!",
        });
        this.getAll();
      } catch (error) {}
    },
  },
});

export default useCustomerGroupStore;
