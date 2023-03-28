import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import {
  addUserToUserGroup,
  deleteInternalGroup,
  deleteUserFromInternalGroup,
  getInternalGroup,
  getInternalGroups,
} from "src/api/InternalGroup";

const useInternalGroupStore = defineStore("internalGroup", {
  state: () => ({
    items: [],
    item: null,
    meta: {
      filter_count: 0,
      total_count: 0,
      page: 1,
      rowsPerPage: 4,
    },
  }),
  getters: {
    getInternalGroups: (state) => state.items,
  },
  actions: {
    async getAll({ rowsPerPage = 4, page = 1, search = undefined }) {
      try {
        const {
          data: { data: internalGroups, meta },
        } = await getInternalGroups({
          limit: rowsPerPage,
          page,
          search,
        });

        this.items = internalGroups.filter((item) => item !== null);
        this.meta = {
          ...this.meta,
          total_count: meta?.total_count,
          filter_count: meta?.filter_count,
        };
        return;
      } catch (error) {
        console.log(error);
      }
    },
    async get(id) {
      const {
        data: { data: internalGroups },
      } = await getInternalGroup(id);
      this.item = {
        ...internalGroups,
        customer_groups: internalGroups.customer_groups.filter(
          (item) => item.customer_groups_id
        ),
      };
    },
    async delete(id) {
      Loading.show();
      try {
        await deleteInternalGroup(id);
        this.items = this.items.filter((item) => item.id !== id);
        Loading.hide();
        Notify.create({
          message: "User Group successfully deleted!",
          type: "positive",
          color: "primary",
          position: "top",
        });
        this.getAll(this.meta.rowsPerPage, this.meta.page);
      } catch (error) {
        Loading.hide();
        Notify.create({
          message: error.response?.data.errors[0].message,
        });
      }
    },
    async addUsers(payload) {
      Loading.show();
      try {
        await addUserToUserGroup(payload);
        Loading.hide();
        Notify.create({
          message: "User successfully added!",
          type: "positive",
          color: "primary",
          position: "top",
        });
      } catch (error) {}
      Loading.hide();
    },
    async deleteUser(payload) {
      try {
        Loading.show();
        await deleteUserFromInternalGroup(payload);
        Notify.create({
          message: "User successfully deleted!",
          type: "positive",
          color: "primary",
          position: "top",
        });
        Loading.hide();
      } catch (error) {
        Notify.create({
          message: error.response?.data.errors[0].message,
        });
        Loading.hide();
      }
    },
    setMeta(val) {
      this.meta.page = val.page;
    },
  },
});

export default useInternalGroupStore;
