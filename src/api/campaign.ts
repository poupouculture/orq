import { api } from "src/boot/axios";

export const getCampaigns = async ({ limit = 10, page = 1 }) => {
  try {
    const fields = `*.*.*`;
    const offset = page === 1 ? 0 : (page - 1) * limit;
    const params = {
      fields: `${fields}`,
      sort: `-date_created`,
      limit,
      offset,
      meta: "*",
    };
    const data = await api.get(`/items/sales_campaigns`, {
      params,
    });
    return data;
  } catch (error) {}
};
