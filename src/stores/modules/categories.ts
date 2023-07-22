import { defineStore } from "pinia";
import {
  getCategories,
  getCategoriesById,
  searchProduct,
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
            product: [],
          };

          if (item.product.length > 0) {
            obj.product = item.product.map((product) => {
              return {
                ...product,
                active: false,
              };
            });
          }
        }

        return obj;
      });

      this.meta = {
        ...this.meta,
        total_count: data.total_count,
        filter_count: data.filter_count,
      };
    },
    async get(id: number) {
      const { data } = await getCategoriesById(id);

      this.item = data.data;
    },
    async searchProduct(keyword: string) {
      const { data } = await searchProduct(keyword);

      data.data.forEach((element: any) => {
        const obj = {
          ...element,
          cat2: "",
        };

        if (element.category.length > 0) {
          obj.cat2 = element.category[0].category_id.name;
        }

        this.products.push(obj);
      });
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
