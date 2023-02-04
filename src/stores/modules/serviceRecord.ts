import { defineStore } from "pinia";
import { getServiceRecords, getServiceReferences } from "src/api/serviceRecord";
import { IServiceRecord, IState } from "src/types/ServiceRecordTypes";

const useServiceRecordStore = defineStore("serviceRecord", {
  state: () =>
    ({
      items: [],
      item: null,
      serviceRecords: null,
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
        } = await getServiceReferences({
          limit: rowsPerPage,
          page,
        });
        this.items = serviceRecords
          .filter((item: IServiceRecord) => item !== null)
          .map((data: IServiceRecord, index: number) => ({
            ...data,
            index: index + 1,
          }));
        this.meta = {
          ...this.meta,
          total_count: meta?.total_count,
          filter_count: meta?.filter_count,
        };
      } catch (error) {}
    },
    async getServiceRecords(id: string) {
      try {
        const {
          data: { data: serviceRecords },
        } = await getServiceRecords(id);
        this.serviceRecords = serviceRecords;
      } catch (error) {}
    },
  },
});

export default useServiceRecordStore;
