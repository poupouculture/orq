import { defineStore } from "pinia";
import { getServiceRecords } from "src/api/serviceRecord";
import { IServiceRecord, IState } from "src/types/ServiceRecordTypes";

const useServiceRecordStore = defineStore("serviceRecord", {
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
    async getAll(rowsPerPage = 10, page = 1) {
      try {
        const {
          data: { data: serviceRecords, meta },
        } = await getServiceRecords({
          limit: rowsPerPage,
          page,
        });
        this.items = serviceRecords.filter(
          (item: IServiceRecord) => item !== null
        );
        this.meta = {
          ...this.meta,
          total_count: meta?.total_count,
          filter_count: meta?.filter_count,
        };
      } catch (error) {}
    },
  },
});

export default useServiceRecordStore;
