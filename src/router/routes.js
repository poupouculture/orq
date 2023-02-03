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
        path: "application-programs",
        component: () => import("pages/ApplicationProgram/index.vue"),
      },
      {
        path: "application-programs/create",
        component: () => import("pages/ApplicationProgram/create.vue"),
      },
      {
        path: "application-programs/message-templates",
        component: () =>
          import("pages/ApplicationProgram/MessageTemplate/index.vue"),
      },
      {
        path: "application-programs/message-templates/create",
        component: () =>
          import("pages/ApplicationProgram/MessageTemplate/create.vue"),
      },
      {
        path: "application-programs/message-templates/:id",
        component: () =>
          import("pages/ApplicationProgram/MessageTemplate/edit.vue"),
      },
      {
        path: "document-builders",
        component: () => import("pages/DocumentBuilder/index.vue"),
      },
      {
        path: "document-builders/create",
        component: () => import("pages/DocumentBuilder/create.vue"),
      },
      {
        path: "document-builders/:id",
        component: () => import("pages/DocumentBuilder/edit.vue"),
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
        path: "/order/service-records",
        name: "order.service-record",
        component: () => import("src/pages/Order/ServiceRecord/Index.vue"),
      },
      {
        path: "/order/service-records/:id",
        name: "order.service-record.detail",
        component: () => import("src/pages/Order/ServiceRecord/Detail.vue"),
      },
      {
        path: "work-order",
        component: () => import("pages/WorkOrder.vue"),
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
      {
        path: "customer-groups/:id/edit",
        name: "customergroups.edit",
        component: () => import("pages/UserGroup/Edit.vue"),
      },
      {
        path: "customer-groups/internal-group",
        name: "customergroups-internal-group",
        component: () => import("pages/UserGroup/InternalGroup/Index.vue"),
      },
      {
        path: "customer-groups/internal-group/create",
        name: "customergroups-internal-group.create",
        component: () => import("pages/UserGroup/InternalGroup/Create.vue"),
      },
      {
        path: "customer-groups/internal-group/:id/edit",
        name: "customergroups-internal-group.edit",
        component: () => import("pages/UserGroup/InternalGroup/Edit.vue"),
      },
    ],
  },
  {
    path: "/messaging",
    component: () => import("layouts/MessagingLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "messaging",
        component: () => import("pages/Messaging/Index.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
