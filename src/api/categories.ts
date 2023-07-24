import { orqApi } from "boot/axios";

export const getCategories = async () => {
  const categories = await orqApi.get("/orders/category");
  return categories;
};

export const getAllCategoriesMulti = async (id?: number, search?: string) => {
  const params = {
    fields: "*.*.*",
    "filter[name][_eq]": search,
  };

  if (search === "") delete params["filter[name][_eq]"];

  if (id) {
    return await orqApi.get(`items/category/${id}`, {
      params,
    });
  } else {
    return await orqApi.get("items/category/", {
      params,
    });
  }
};

export const getCategoriesById = async (id: number) => {
  const categories = await orqApi.get(`items/category/${id}`);
  return categories;
};

export const searchProduct = async (search: string) => {
  const product = await orqApi.get("/orders/product", {
    params: {
      search,
    },
  });

  return product;
};
