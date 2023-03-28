import { defineStore } from "pinia";
// import { Loading, Notify } from "quasar";
import {
  getPersonalGroups,
  // addPersonalGroup,
  // deletePersonalGroup,
} from "src/api/PersonalGroup";

const usePersonalGroupStore = defineStore("personalGroup", {
  state: () => ({
    items: [],
    item: null,
    meta: {
      total_count: 0,
      filter_count: 0,
    },
  }),

  actions: {
    async getAll({ rowsPerPage = 4, page = 1, search = undefined }) {
      const {
        data: { data: personalGroup, meta },
      } = await getPersonalGroups({
        limit: rowsPerPage,
        page,
        search,
      });
      this.items = personalGroup.filter((item: any) => item !== null);
      this.meta = {
        ...this.meta,
        total_count: meta?.total_count,
        filter_count: meta?.filter_count,
      };
    },
    // async get(id) {
    //   const {
    //     data: { data: customerGroups },
    //   } = await getCustomerGroups({}, id);
    //   this.item = customerGroups;
    // },
    // async addCustomer(payload) {
    //   Loading.show();
    //   try {
    //     await addCustomerToCustomerGroup(payload);
    //     Loading.hide();
    //     Notify.create({
    //       message: "Customer successfully added!",
    //       position: "top",
    //       type: "positive",
    //       color: "primary",
    //     });
    //   } catch (error) {}
    //   Loading.hide();
    // },
    // async delete(id) {
    //   try {
    //     Loading.show();
    //     await deleteCustomerGroup(id);
    //     this.items = this.items.filter((item) => item.id !== id);
    //     Loading.hide();
    //     Notify.create({
    //       message: "Customer Group successfully deleted!",
    //       position: "top",
    //       type: "positive",
    //       color: "primary",
    //     });
    //     this.getAll();
    //   } catch (error) {
    //     Notify.create({
    //       message: error,
    //     });
    //   }
    // },
    // async deleteCustomer(id, customerId) {
    //   Loading.show();
    //   try {
    //     await deleteCustomer(id, customerId);
    //     Loading.hide();
    //     Notify.create({
    //       message: "Customer successfully deleted!",
    //       position: "top",
    //       type: "positive",
    //       color: "primary",
    //     });
    //   } catch (error) {
    //     console.log(error);
    //     Notify.create({
    //       message: error,
    //     });
    //   }
    //   Loading.hide();
    // },
    // setMeta(val) {
    //   this.meta.page = val.page;
    // },
  },
});

export default usePersonalGroupStore;
