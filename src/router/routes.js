const routes = [
  {
    path: "/login",
    name: "auth",
    component: () => import("../../src/pages/Login.vue"),
    children: [
      { path: "", component: () => import("../../src/pages/Login.vue") },
    ],
  },
  {
    path: "/",
    name: "dashboard",
    component: () => import("layouts/DrawerLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
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
        path: "contacts",
        component: () => import("pages/Contacts.vue"),
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
        path: "contacts-general",
        component: () => import("pages/ContactsGeneral.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
