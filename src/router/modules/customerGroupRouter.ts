const routes = [
  {
    path: "/customer-groups",
    component: () => import("layouts/DrawerLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "customergroups",
        component: () => import("pages/CustomerGroup/Index.vue"),
      },
      {
        path: "summary",
        name: "customergroups.summary",
        component: () => import("pages/CustomerGroup/Index.vue"),
      },
      // {
      //   path: "create",
      //   name: "customergroups.create",
      //   component: () => import("pages/CustomerGroup/Create.vue"),
      // },
      {
        path: ":id/edit",
        name: "customergroups.edit",
        component: () => import("pages/CustomerGroup/Edit.vue"),
      },
    ],
  },
];
export default routes;
