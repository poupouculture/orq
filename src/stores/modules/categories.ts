import { defineStore } from "pinia";
import {
  getCategories,
  getCategoriesById,
  getProducts,
  getAllCategoriesMulti,
} from "src/api/categories";
import { Notify } from "quasar";

interface State {
  items: [] | any;
  products: [] | any;
  item: null;
  meta: {
    total_count: number;
    filter_count: number;
  };
}

const useCategoriesStore = defineStore("categoriesStore", {
  state: () =>
    ({
      items: [],
      products: [],
      item: null,
      meta: {
        total_count: 0,
        filter_count: 0,
      },
    } as State),

  getters: {
    allCategories: (state) => state.items,
    getProducts: (state) =>
      state.products.map((item: any) => {
        const obj = {
          ...item,
          qty: 1,
        };

        return obj;
      }),
  },
  actions: {
    async getAll() {
      try {
        const { data, status } = await getCategories();

        if (status !== 200) {
          Notify.create({
            message: "Something Wrong",
            type: "negative",
            position: "top",
          });
        } else {
          this.items = data?.data.map((item: any) => {
            let obj = {};

            if (item !== null) {
              obj = {
                ...item,
                image: `${process.env.ORQ_API}/assets/${item.icon}`,
                openCollapse: false,
              };
            }

            return obj;
          });

          this.meta = {
            ...this.meta,
            total_count: data.total_count,
            filter_count: data.filter_count,
          };
        }
      } catch (error) {}
    },
    async getCategoriesDetails(id: number) {
      try {
        const { data, status } = await getAllCategoriesMulti(id);

        if (status !== 200) {
          Notify.create({
            message: "Something Wrong",
            type: "negative",
            position: "top",
          });
        } else {
          const { children } = data.data;
          let obj = {
            children: [],
          };
          const categoryProductIndex = this.items.findIndex(
            (dataProduct: any) => dataProduct.id === id
          );

          obj = {
            ...this.items[categoryProductIndex],
            openCollapse: true,
            children,
          };

          this.items[categoryProductIndex] = obj;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async get(id: number) {
      try {
        const { data, status } = await getCategoriesById(id);

        if (status !== 200) {
          Notify.create({
            message: "Something Wrong",
            type: "negative",
            position: "top",
          });
        } else {
          this.item = data.data;
        }
      } catch (error) {}
    },

    async getProduct(keyword: string, categories: []) {
      try {
        if (categories.length > 0) {
          const { data } = await getProducts(keyword, categories);
          this.products = data.data;
        } else {
          this.products = [];
        }
      } catch (error) {}
    },
  },
});

export default useCategoriesStore;
