const routes = [
  {
    path: "/document-component",
    component: () => import("layouts/DrawerLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        component: () =>
          import("pages/DocumentBuilder/MasterComponents/index.vue"),
      },
      {
        path: "create",
        component: () =>
          import("pages/DocumentBuilder/MasterComponents/create.vue"),
      },
      {
        path: ":id",
        component: () =>
          import("pages/DocumentBuilder/MasterComponents/edit.vue"),
      },
    ],
  },
];
export default routes;
