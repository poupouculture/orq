import { api } from "src/boot/axios";

export const getUsers = async ({ limit = 10, page = 1 }) => {
  const fields = `id, first_name, last_name, gender, date_created, position, role.name`;

  const offset = page === 1 ? 0 : (page - 1) * limit;
  try {
    const users = await api.get("/users", {
      params: {
        fields: `${fields}`,
        limit,
        offset,
        meta: "*",
        filter: {
          _or: [
            { role: { name: { _eq: "CS-Manager" } } },
            { role: { name: { _eq: "CS" } } },
          ],
        },
      },
    });
    return users;
  } catch (error) {}
};

export const getUser = async (id) => {
  const fields = "*";
  const companies = "companies.companies_id.*";
  const contacts = "contacts.contacts_id.*";

  const customer = await api.get(
    `/users/${id}?fields=${fields},${companies},${contacts}`
  );
  return customer;
};

export const addUser = async (payload) => {
  const customer = await api.post("/users", payload);
  return customer;
};
