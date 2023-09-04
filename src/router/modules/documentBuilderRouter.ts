const routes = [
  {
    path: "/document-builders",
    component: () => import("layouts/DrawerLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        component: () => import("pages/DocumentBuilder/index.vue"),
      },
      {
        path: "list/:type",
        component: () => import("pages/DocumentBuilder/list.vue"),
      },
      {
        path: "create",
        component: () => import("pages/DocumentBuilder/create.vue"),
      },
      {
        path: ":type/create",
        component: () => import("pages/DocumentBuilder/create.vue"),
      },
      {
        path: ":id",
        component: () => import("pages/DocumentBuilder/edit.vue"),
      },
      {
        path: ":id/preview",
        component: () => import("pages/DocumentBuilder/preview.vue"),
      },
    ],
  },
];
export default routes;
