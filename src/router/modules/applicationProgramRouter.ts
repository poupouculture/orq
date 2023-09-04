const routes = [
  {
    path: "/application-programs",
    component: () => import("layouts/DrawerLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        component: () => import("pages/ApplicationProgram/index.vue"),
      },
      {
        path: "campaign",
        component: () => import("pages/ApplicationProgram/Campaign/Index.vue"),
      },
      {
        path: "campaign/create",
        component: () => import("pages/ApplicationProgram/Campaign/Create.vue"),
      },
      {
        path: "campaign",
        component: () => import("pages/ApplicationProgram/Campaign/Index.vue"),
      },
      {
        path: "message-templates",
        component: () =>
          import("pages/ApplicationProgram/MessageTemplate/index.vue"),
      },
      {
        path: "message-templates/create",
        component: () =>
          import("pages/ApplicationProgram/MessageTemplate/create.vue"),
      },
      {
        path: "message-templates/:id",
        component: () =>
          import("pages/ApplicationProgram/MessageTemplate/edit.vue"),
      },
      {
        path: "chatbots",
        component: () =>
          import("pages/ApplicationProgram/BotTemplate/index.vue"),
      },
      {
        path: "chatbots/create",
        component: () =>
          import("pages/ApplicationProgram/BotTemplate/create.vue"),
      },
      {
        path: "chatbots/:id",
        component: () =>
          import("pages/ApplicationProgram/BotTemplate/edit.vue"),
      },
      {
        path: "customer-services",
        component: () =>
          import("pages/ApplicationProgram/CustomerService/index.vue"),
      },
      {
        path: "customer-services/create",
        component: () =>
          import("pages/ApplicationProgram/CustomerService/create.vue"),
      },
      {
        path: "customer-services/:id",
        component: () =>
          import("pages/ApplicationProgram/CustomerService/edit.vue"),
      },
      {
        path: "surveys",
        component: () => import("pages/ApplicationProgram/Survey/index.vue"),
      },
      {
        path: "surveys/create",
        component: () => import("pages/ApplicationProgram/Survey/create.vue"),
      },
      {
        path: "surveys/:id",
        component: () => import("pages/ApplicationProgram/Survey/edit.vue"),
      },
    ],
  },
];
export default routes;
