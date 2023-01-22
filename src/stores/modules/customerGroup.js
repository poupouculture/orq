import { defineStore } from "pinia";
import { Notify } from "quasar";
import { deleteCustomerGroup, getCustomerGroups } from "src/api/customerGroup";

const useCustomerGroupStore = defineStore("customerGroup", {
  state: () => ({
    items: [],
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
      this.items = customerGroups;
      this.meta = {
        ...this.meta,
        total_count: meta?.total_count,
        filter_count: meta?.filter_count,
      };
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
