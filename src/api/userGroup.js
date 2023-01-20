<<<<<<< HEAD
import { api } from "src/boot/axios";
=======
import { api } from "src/boot/axios"
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21

export const getUserGroups = async ({ limit = 10, page = 1 }) => {
  const fields = `id, name, status, users.*`;
  const offset = page === 1 ? 0 : (page - 1) * limit;
  try {
<<<<<<< HEAD
    const userGroups = await api.get("/items/user_groups", {
=======
    const userGroups = await api.get('/items/user_groups', {
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21
      params: {
        fields: `${fields}`,
        sort: `-date_created`,
        limit,
        offset,
<<<<<<< HEAD
        meta: "*",
      },
    });
    return userGroups;
  } catch (error) {}
};
=======
        meta: "*"
      },
    })
    return userGroups
  } catch (error) { }
}
>>>>>>> 992d3e5a4e2f95c396ee84753ed48cba54749a21
