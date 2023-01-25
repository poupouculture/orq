import { defineStore } from "pinia";
// import { Loading, Notify } from "quasar";
import { getServiceRecords } from "src/api/serviceRecord";
import { IState } from "src/types/ServiceRecordTypes";

const useServiceRecordStore = defineStore("customerGroup", {
  state: () =>
    ({
      items: [],
      meta: {
        total_count: 0,
        filter_count: 0,
      },
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        totalCount: 0,
      },
    } as unknown as IState),
  getters: {
    getItems: (state) => state.items,
  },
  actions: {
    async getAll({ rowsPerPage = 10, page = 1 }) {
      const {
        data: { data: serviceRecords, meta },
      } = await getServiceRecords({
        limit: rowsPerPage,
        page,
      });
      this.items = serviceRecords.filter((item: any) => item !== null);
      this.meta = {
        ...this.meta,
        total_count: meta?.total_count,
        filter_count: meta?.filter_count,
      };
    },
  },
});

export default useServiceRecordStore;
