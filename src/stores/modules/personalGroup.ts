import { defineStore } from "pinia";
import {
  getPersonalGroups,
  getPersonalGroup,
  addRelationship,
} from "src/api/PersonalGroup";

const usePersonalGroupStore = defineStore("personalGroup", {
  state: () => ({
    items: [],
    item: null,
    meta: {
      page: 0,
      total_count: 0,
      filter_count: 0,
    },
  }),

  getters: {
    getInternalPersonalGroup: (state) => state.items,
  },

  actions: {
    async getAll({ rowsPerPage = 4, page = 1, search = undefined }) {
      try {
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

        return this.items;
      } catch (error) {
        console.log(error);
      }
    },

    async get(id: any) {
      const {
        data: { data: customerGroups },
      } = await getPersonalGroup(id);
      return customerGroups;
    },

    async addRelation(userGroupId: string, customerGroupId: string) {
      const { data: result } = await addRelationship(
        userGroupId,
        customerGroupId
      );

      return result;
    },

    setMeta(val: { page: number }) {
      this.meta.page = val.page;
    },
  },
});

export default usePersonalGroupStore;
