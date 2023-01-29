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
    async getAll(rowsPerPage = 4, page = 1) {
      const {
        data: { data: internalGroups, meta },
      } = await getInternalGroups({
        limit: rowsPerPage,
        page,
      });
      this.items = internalGroups;
      this.meta = {
        ...this.meta,
        total_count: meta?.total_count,
        filter_count: meta?.filter_count,
      };
    },
    async get(id) {
      const {
        data: { data: internalGroups },
      } = await getInternalGroup(id);
      this.item = internalGroups;
    },
    async delete(id) {
      Loading.show();
      try {
        await deleteInternalGroup(id);
        this.items = this.items.filter((item) => item.id !== id);
        Loading.hide();
        Notify.create({
          message: "User Group successfully deleted!",
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
        });
        this.getAll();
      } catch (error) {}
      Loading.hide();
    },
    async deleteUser(payload) {
      try {
        Loading.show();
        await deleteUserFromInternalGroup(payload);
        Notify.create({
          message: "User successfully deleted!",
        });
        Loading.hide();
        this.getAll(this.meta.rowsPerPage, this.meta.page);
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
