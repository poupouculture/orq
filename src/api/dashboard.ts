import { api } from "boot/axios";

interface DashboardAnalyticPayload {
  limit: number;
  page: number;
  search: string;
  filter?: {
    key: string;
    value: string;
  };
}

export const getDashboardAnalytics = async (
  payload: DashboardAnalyticPayload
) => {
  const { limit, page, search = undefined, filter } = payload;
  const fields = "*";

  const offset = page === 1 ? 0 : (page - 1) * limit;

  const filterField =
    filter && filter.key ? { [filter.key]: filter.value } : undefined;
  const params = {
    fields: `${fields}`,
    sort: "-date_created",
    ...filterField,
    limit,
    offset,
    search,
    meta: "*",
  } as any;
  const analytics = await api.get("/items/analytics", {
    params,
  });

  return analytics;
};
