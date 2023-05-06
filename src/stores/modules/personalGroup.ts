import { defineStore } from "pinia";
import {
  getPersonalGroups,
  // getPersonalGroup,
  addRelationship,
  getCustomerGroup,
} from "src/api/PersonalGroup";
import { CustomerGroup, PState } from "src/types/PersonalGroups";

const usePersonalGroupStore = defineStore("personalGroup", {
  state: () =>
    ({
      // items: [],
      // item: null,
      // meta: {
      //   page: 0,
      //   total_count: 0,
      //   filter_count: 0,
      // },
      personalGroups: {
        data: [],
        meta: { total_count: 0, filter_count: 0 },
      },
      customerGroups: {
        data: [],
        meta: { total_count: 0, filter_count: 0 },
      },
    } as PState),

  // getters: {
  //   getInternalPersonalGroup: (state) => state.items,
  // },

  actions: {
    async getAll(
      rowsPerPage: number = 4,
      page: number = 1,
      search?: string,
      type?: string
    ) {
      try {
        const {
          data: { data = [], meta },
        } = await getPersonalGroups(rowsPerPage, page, search, type);
        this.personalGroups.data = data;
        this.personalGroups.meta = meta || {
          // page: 0,
          total_count: 0,
          filter_count: 0,
        };
        // this.setMeta(fetchMeta);
      } catch (error) {
        console.log(error);
      }
    },

    async getCustomerGroup(
      rowsPerPage: number = 10,
      page: number = 1,
      type = "personal",
      search?: string,
      selectedCustomerGroups?: CustomerGroup[],
      customerFilter?: string
    ) {
      try {
        const {
          data: { data = [], meta },
        } = await getCustomerGroup(
          rowsPerPage,
          page,
          type,
          search,
          selectedCustomerGroups,
          customerFilter
        );
        this.customerGroups.data = data;
        this.customerGroups.meta = meta || {
          // page: 0,
          total_count: 0,
          filter_count: 0,
        };
      } catch (error) {
        console.log(error);
      }
    },
    resetCustomerGroup() {
      this.customerGroups = {
        data: [],
        meta: { total_count: 0, filter_count: 0 },
      };
    },

    // async get(id: any) {
    //   const {
    //     data: { data: customerGroups },
    //   } = await getPersonalGroup(id);
    //   return customerGroups;
    // },

    async addRelation(userGroupId: string, customerGroupId: string) {
      const { data: result } = await addRelationship(
        userGroupId,
        customerGroupId
      );

      return result;
    },

    // setMeta(meta: Meta) {
    //   this.personalGroups.meta = { ...this.personalGroups.meta, ...meta };
    // },
  },
});

export default usePersonalGroupStore;
