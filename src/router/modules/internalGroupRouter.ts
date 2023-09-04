const routes = [
  {
    path: "/internal-group",
    component: () => import("layouts/DrawerLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "internal-group",
        component: () => import("pages/UserGroup/InternalGroup/Index.vue"),
      },
      {
        path: "create",
        name: "internal-group.create",
        component: () => import("pages/UserGroup/InternalGroup/Create.vue"),
      },
      {
        path: ":id/edit",
        name: "internal-group.edit",
        component: () => import("pages/UserGroup/InternalGroup/Edit.vue"),
      },
    ],
  },
];
export default routes;
