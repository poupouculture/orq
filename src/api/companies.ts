import { api } from "boot/axios";

export const getCompanies = async () => {
  const fields =
    "company_cd,company_number,name_english,name_chinese,customers.customers_id.*,is_active";
  const result = await api.get("items/companies", {
    params: {
      fields,
    },
  });
  return result;
};
