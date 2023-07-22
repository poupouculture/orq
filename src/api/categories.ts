import { orqApi } from "boot/axios";

export const getCategories = async () => {
  const categories = await orqApi.get("/orders/category");
  return categories;
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
