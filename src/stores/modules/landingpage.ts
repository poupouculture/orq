import { defineStore } from "pinia";
import { getAllNavigation, getNavigationById } from "src/api/landingpage";
import { Notify } from "quasar";
import { Navigation } from "src/types/LandingPageTypes";

const useNavigationStore = defineStore("navigationStore", {
  state: () =>
    ({
      items: [],
      navigationBottom: [],
      component: {
        content: [],
        iconCover: "",
        children: [],
        heroText: "",
      },
    } as Navigation),

  getters: {
    allNavigation: (state) => state.items,
    bottomNavigation: (state) =>
      state.items.filter((item: any) => item.name === "bottom"),
    getComponent: (state) => state.component,
    topNavigation: (state) =>
      state.items.filter((item: any) => item.name === "top"),
  },
  actions: {
    async getAll() {
      try {
        const { data, status } = await getAllNavigation();

        if (status !== 200) {
          Notify.create({
            message: "Something Wrong",
            type: "negative",
            position: "top",
          });
        } else {
          if (data.data.length > 0) {
            const sorting = data.data.map((navigation: any) => {
              const obj = {
                ...navigation,
                pages: navigation.pages.sort(
                  (a: any, b: any) => a.sort - b.sort
                ),
                icon: "",
              };

              if (navigation.icon !== null) {
                obj.icon = `${process.env.ORQ_API}/assets/${navigation.icon}`;
              }

              return obj;
            });

            this.items = sorting;
          } else {
            Notify.create({
              message: "Data is Empty",
              type: "negative",
              position: "top",
            });
          }
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

          // const cover = data.data.component.find( function ( item: any ) {
          //   let dataItem = ''
          //   if ( item.page_component_id !== null ) {
          //     if ( item.page_component_id.type === "cover_photo" ) {

          //       dataItem = item
          //     }
          //   }

          //   return dataItem
          // } )

          const cover = data.data.component.find((item: any) => {
            let dataItem = "";
            if (item.page_component_id !== null) {
              if (item.page_component_id.type === "cover_photo") {
                dataItem = item;
              }
            }

            return dataItem;
          });

          const content = data.data.component.filter(function (item: any) {
            let dataItem = "";
            if (item.page_component_id !== null) {
              if (item.page_component_id.type !== "cover_photo") {
                dataItem = item;
              }
            }
            return dataItem;
          });

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

            if (itemContent.page_component_id.type === "icon") {
              itemObj.children = itemContent.page_component_id.children.map(
                (children: any) => {
                  const childrenObject = {
                    ...children,
                    icon: null,
                  };

                  if (children.icon !== null) {
                    childrenObject.icon = `${process.env.ORQ_API}/assets/${children.icon}`;
                  }

                  return childrenObject;
                }
              );
            }

            if (itemContent.page_component_id.type === "carousel_icon") {
              itemObj.children = itemContent.page_component_id.children.map(
                (children: any) => {
                  const childrenObject = {
                    ...children,
                    icon: null,
                  };

                  if (children.icon !== null) {
                    childrenObject.icon = `${process.env.ORQ_API}/assets/${children.icon}`;
                  }

                  return childrenObject;
                }
              );
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
