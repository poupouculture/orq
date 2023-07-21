import { orqApi } from "boot/axios";

export const getCategories = async () => {
  const categories = await orqApi.get("products/categories/multi");
  return categories;
};

export const getCategoriesById = async (id: number) => {
  const categories = await orqApi.get(`items/category/${id}`);
  return categories;
};

export const searchProduct = async (search: string) => {
  const product = await orqApi.get("products", {
    params: {
      search,
    },
  });

  return product;
};
