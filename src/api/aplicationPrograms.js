// import { api } from "boot/axios";

export const getApplicationPrograms = async ({ limit = 10, page = 1 }) => {
  // const fields = `id, first_name, last_name`;
  // const companies = `companies.companies_id.name_english`;

  // const offset = page === 1 ? 0 : (page - 1) * limit;

  // const customers = await api.get(`/items/customers`, {
  //   params: {
  //     fields: `${fields},${companies}`,
  //     sort: `-date_created`,
  //     limit,
  //     offset,
  //     meta: "*",
  //   },
  // });
  return {
    data: {
      meta: {
        total_count: 17,
        filter_count: 17
      },
      data: [
        {
          id: "e4f1fe13-ece5-46b4-ade6-a5fec5dbcaa0",
          name: "[template] VIP",
          status: "Draft",
          language: "English",
          delivered: 10,
          read: 5,
          replied: 1,
          created_by: "Salim Arizi",
          created_on: "Thu, 12 Jan 2023"
        },
      ]
    }
  };
};
