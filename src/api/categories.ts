import { publicApi } from "boot/axios";

export const getCategories = async () => {
  const categories = await publicApi.get("products/categories/multi");
  return categories;
};

export const getCategoriesById = async (id: number) => {
  const categories = await publicApi.get(`items/category/${id}`);
  return categories;
};

export const searchProduct = async (search: string) => {
  const product = await publicApi.get("products", {
    params: {
      search,
    },
  });

  return product;
};
