const routes = [
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
    children: [
      {
        path: "",
        name: "login",
        component: () => import("pages/Login.vue"),
      },
    ],
  },
  {
    path: "/landing",
    component: () => import("pages/landingpage/index.vue"),
    children: [
      {
        path: "",
        name: "landingpage",
        component: () => import("pages/landingpage/index.vue"),
      },
    ],
  },
  {
    path: "/me",
    name: "me",
    component: () => import("pages/Me.vue"),
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
        path: "application-programs/campaign",
        component: () => import("pages/ApplicationProgram/Campaign/Index.vue"),
      },
      {
        path: "application-programs/campaign/create",
        component: () => import("pages/ApplicationProgram/Campaign/Create.vue"),
      },
      {
        path: "application-programs/campaign",
        component: () => import("pages/ApplicationProgram/Campaign/Index.vue"),
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
        path: "application-programs/chatbots",
        component: () =>
          import("pages/ApplicationProgram/BotTemplate/index.vue"),
      },
      {
        path: "application-programs/chatbots/create",
        component: () =>
          import("pages/ApplicationProgram/BotTemplate/create.vue"),
      },
      {
        path: "application-programs/chatbots/:id",
        component: () =>
          import("pages/ApplicationProgram/BotTemplate/edit.vue"),
      },
      {
        path: "application-programs/customer-services",
        component: () =>
          import("pages/ApplicationProgram/CustomerService/index.vue"),
      },
      {
        path: "application-programs/customer-services/create",
        component: () =>
          import("pages/ApplicationProgram/CustomerService/create.vue"),
      },
      {
        path: "application-programs/customer-services/:id",
        component: () =>
          import("pages/ApplicationProgram/CustomerService/edit.vue"),
      },
      {
        path: "application-programs/surveys",
        component: () => import("pages/ApplicationProgram/Survey/index.vue"),
      },
      {
        path: "application-programs/surveys/create",
        component: () => import("pages/ApplicationProgram/Survey/create.vue"),
      },
      {
        path: "application-programs/surveys/:id",
        component: () => import("pages/ApplicationProgram/Survey/edit.vue"),
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
        path: "document-components",
        component: () =>
          import("pages/DocumentBuilder/MasterComponents/index.vue"),
      },
      {
        path: "document-components/create",
        component: () =>
          import("pages/DocumentBuilder/MasterComponents/create.vue"),
      },
      {
        path: "document-components/:id",
        component: () =>
          import("pages/DocumentBuilder/MasterComponents/edit.vue"),
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
        name: "customers",
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
        path: "/order/invoices",
        name: "order.invoices",
        component: () => import("src/pages/Order/Invoice/index.vue"),
      },
      {
        path: "/order/payment",
        name: "order.payment",
        component: () => import("src/pages/Order/Invoice/payment.vue"),
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
        path: "personal-groups",
        name: "personalgroups",
        component: () => import("pages/UserGroup/PersonalGroup/Index.vue"),
      },
      {
        path: "customer-groups",
        name: "customergroups",
        component: () => import("pages/CustomerGroup/Index.vue"),
      },
      {
        path: "customer-groups/summary",
        name: "customergroups.summary",
        component: () => import("pages/CustomerGroup/Index.vue"),
      },
      {
        path: "customer-groups/create",
        name: "customergroups.create",
        component: () => import("pages/CustomerGroup/Create.vue"),
      },
      {
        path: "customer-groups/:id/edit",
        name: "customergroups.edit",
        component: () => import("pages/CustomerGroup/Edit.vue"),
      },
      {
        path: "internal-group",
        name: "internal-group",
        component: () => import("pages/UserGroup/InternalGroup/Index.vue"),
      },
      {
        path: "internal-group/create",
        name: "internal-group.create",
        component: () => import("pages/UserGroup/InternalGroup/Create.vue"),
      },
      {
        path: "internal-group/:id/edit",
        name: "internal-group.edit",
        component: () => import("pages/UserGroup/InternalGroup/Edit.vue"),
      },
    ],
  },
  {
    path: "/messaging",
    component: () => import("components/Messaging/MessageLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        name: "messaging",
        component: () => import("components/Messaging/Message.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
