import { defineStore } from "pinia";
import { Loading, Notify } from "quasar";
import {
  deleteInternalGroup,
  deleteUser,
  getInternalGroups,
} from "src/api/InternalGroup";

const useInternalGroup = defineStore("internalGroup", {
  state: () => ({
    items: [],
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
    async deleteUser(id) {
      try {
        await deleteUser(id);
        this.items = this.items.filter((item) => item.id !== id);
        Notify.create({
          message: "User successfully deleted!",
        });
        this.getAll(this.meta.rowsPerPage, this.meta.page);
      } catch (error) {
        Notify.create({
          message: error.response?.data.errors[0].message,
        });
      }
    },
    setMeta(val) {
      this.meta.page = val.page;
    },
  },
});

export default useInternalGroup;
