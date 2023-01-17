const routes = [
  {
    path: "/login",
    component: () => import("../../src/pages/Login.vue"),
    children: [
      {
        path: "",
        name: "login",
        component: () => import("../../src/pages/Login.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/DrawerLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/Dashboard.vue"),
      },
      {
        path: "contact-settings",
        component: () => import("pages/ContactSettings.vue"),
      },
      {
        path: "stow",
        component: () => import("pages/Stow.vue"),
      },
      {
        path: "application-program",
        component: () => import("pages/ApplicationProgram.vue"),
      },
      {
        path: "calendar",
        component: () => import("pages/Calendar.vue"),
      },
      {
        path: "company",
        component: () => import("pages/Company.vue"),
      },
      {
        path: "customers/:id",
        component: () => import("pages/Customers/edit.vue"),
      },
      {
        path: "customers",
        component: () => import("pages/Customers/index.vue"),
      },
      {
        path: "customers/create",
        component: () => import("pages/Customers/create.vue"),
      },
      {
        path: "dashboard",
        component: () => import("pages/Dashboard.vue"),
      },
      {
        path: "phone-record",
        component: () => import("pages/PhoneRecord.vue"),
      },
      {
        path: "report-form",
        component: () => import("pages/ReportForm.vue"),
      },
      {
        path: "service-record",
        component: () => import("pages/ServiceRecord.vue"),
      },
      {
        path: "work-order",
        component: () => import("pages/WorkOrder.vue"),
      },
      {
        path: "message",
        component: () => import("pages/MessageUi.vue"),
      },
      {
        path: "customer-groups",
        name: "customergroups",
        component: () => import("pages/UserGroup/Index.vue"),
      },
      {
        path: "customer-groups/create",
        name: "customergroups.create",
        component: () => import("pages/UserGroup/Create.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
