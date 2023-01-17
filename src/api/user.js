import { api } from "src/boot/axios"

export const getUsers = async ({ limit = 10, page = 1 }) => {
  const fields = `id, first_name, last_name, gender, date_created, position`;

  const offset = page === 1 ? 0 : (page - 1) * limit;
  try {
    const users = await api.get('/users', {
      params: {
        fields: `${fields}`,
        sort: `-date_created`,
        limit,
        offset,
        meta: "*",
        filter: {
          _or: [
            { role: { name: { _eq: "CS-Manager" } } },
            { role: { name: { _eq: "CS" } } }
          ]
        }
      },
    })
    return users
  } catch (error) { }
}
