import { defineStore } from "pinia";
import { getAllNavigation, getNavigationById } from "src/api/landingpage";
import { Notify } from "quasar";

interface State {
  items: [] | any;
  component: any | unknown;
}

const useNavigationStore = defineStore("navigationStore", {
  state: () =>
    ({
      items: [],
      component: {},
    } as State),

  getters: {
    allNavigation: (state) => state.items,
    getComponent: (state) => state.component,
  },
  actions: {
    async getAll() {
      try {
        const params = "top";
        const { data, status } = await getAllNavigation(params);

        if (status !== 200) {
          Notify.create({
            message: "Something Wrong",
            type: "negative",
            position: "top",
          });
        } else {
          this.items = data.data[0].pages;
        }
      } catch (error) {}
    },

    async getComponentByid(id?: string) {
      try {
        const { data, status } = await getNavigationById(id);

        if (status !== 200) {
          Notify.create({
            message: "Something Wrong",
            type: "negative",
            position: "top",
          });
        } else {
          const cover = data.data.component.find(
            (item: any) => item.page_component_id.type === "cover_photo"
          );

          const obj = {
            ...cover.page_component_id,
            icon: `${process.env.ORQ_API}/assets/${cover.page_component_id.icon}`,
          };

          this.component = obj;
        }
      } catch (error) {}
    },
  },
});

export default useNavigationStore;
