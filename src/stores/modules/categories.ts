import { defineStore } from "pinia";
import {
  getCategories,
  getCategoriesById,
  getProducts,
  getAllCategoriesMulti,
} from "src/api/categories";

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
    getProducts: (state) => state.products,
  },
  actions: {
    async getAll() {
      const { data } = await getCategories();

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
    },
    async getCategoriesDetails(id: number) {
      const { data } = await getAllCategoriesMulti(id);
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
        // children: children.map((lvl2: any) => {
        //   const lvl3 = {
        //     ...lvl2,
        //     openCollapse: false,
        //   };

        //   if (lvl3.children.length === 0) delete lvl3.openCollapse;

        //   return lvl3;
        // }),
      };

      this.items[categoryProductIndex] = obj;
    },
    async get(id: number) {
      const { data } = await getCategoriesById(id);

      this.item = data.data;
    },

    async getProduct(keyword: string, categories: []) {
      const { data } = await getProducts(keyword, categories);
      this.products = data.data;
    },
    deleteProduct(id: number) {
      const productIndex = this.products.findIndex((item) => item.id === id);

      this.products.splice(productIndex, 1);
    },
    async storeProduct(item: []) {
      item.forEach((value) => {
        this.products.push(value.product_id);
      });
    },
  },
});

export default useCategoriesStore;
