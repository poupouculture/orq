import { defineStore } from "pinia";
import { getAllNavigation, getNavigationById } from "src/api/landingpage";
import { Notify } from "quasar";
import { Navigation } from "src/types/LandingPageTypes";

const useNavigationStore = defineStore("navigationStore", {
  state: () =>
    ({
      items: [],
      component: {
        content: [],
        iconCover: "",
        children: [],
        heroText: "",
      },
    } as Navigation),

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
          this.items = data.data[0].pages.sort((a: any, b: any) => {
            return a.sort - b.sort;
          });
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
          const obj = {
            content: [],
            iconCover: "",
            children: [],
            heroText: "",
          };

          const cover = data.data.component.find(
            (item: any) => item.page_component_id.type === "cover_photo"
          );

          const content = data.data.component.filter(
            (item: any) => item.page_component_id.type !== "cover_photo"
          );

          if (cover) {
            obj.iconCover = `${process.env.ORQ_API}/assets/${cover.page_component_id.image}`;
            obj.heroText = cover.page_component_id.name;
          }

          // Proccess content here
          obj.content = content.map((itemContent: any) => {
            const itemObj = {
              ...itemContent.page_component_id,
              image: null,
              children: [],
            };

            if (itemContent.page_component_id.image !== null) {
              itemObj.image = `${process.env.ORQ_API}/assets/${itemContent.page_component_id.image}`;
            }

            if (itemContent.page_component_id.type === "carousel") {
              itemObj.children = itemContent.page_component_id.children.map(
                (children: any) => {
                  const childrenObject = {
                    ...children,
                    image: null,
                  };

                  if (children.image !== null) {
                    childrenObject.image = `${process.env.ORQ_API}/assets/${children.image}`;
                  }

                  return childrenObject;
                }
              );
            }

            return itemObj;
          });

          // Sorting content here
          obj.content.sort((a: any, b: any) => {
            return a.sort - b.sort;
          });

          this.component = obj;
        }
      } catch (error) {}
    },
  },
});

export default useNavigationStore;
