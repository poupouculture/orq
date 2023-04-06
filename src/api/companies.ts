import { api } from "boot/axios";

export const getCompanies = async () => {
  const field =
    "company_cd,company_number,name_english,name_chinese,customers,is_active";
  const result = await api.get(`/items/companies`, {
    params: {
      field,
    },
  });
  return result;
};
