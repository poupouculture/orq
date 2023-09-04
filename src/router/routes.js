import internalGroupRouter from "./modules/internalGroupRouter";
import applicationProgramRouter from "./modules/applicationProgramRouter";
import customerGroupRouter from "./modules/customerGroupRouter";
import documentBuilderRouter from "./modules/documentBuilderRouter";
import documentComponentRouter from "./modules/documentComponentRouter";

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
  // Home Default root path
  {
    path: "/",
    component: () => import("layouts/LandingLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Landing/Content.vue"),
      },
      {
        path: "/us",
        name: "landingpage",
        component: () => import("pages/Landing/Index.vue"),
      },
      {
        path: "/us/products",
        name: "Products",
        component: () => import("pages/Landing/Products.vue"),
      },
      // {
      //   path: "/about-us",
      //   name: "About Us",
      //   component: () => import("pages/Landing/AboutUs.vue"),
      // },
      {
        path: "/us/products/detail/",
        name: "landingcategoriesdetails",
        component: () => import("pages/Landing/CategoriesDetail.vue"),
      },
      {
        path: "/:article",
        component: () => import("pages/Landing/Content.vue"),
      },
    ],
  },

  {
    path: "/me",
    name: "me",
    component: () => import("pages/Me.vue"),
  },
  ...applicationProgramRouter,
  ...documentBuilderRouter,
  ...documentComponentRouter,
  ...customerGroupRouter,
  ...internalGroupRouter,
  {
    path: "/dashboard",
    component: () => import("layouts/DrawerLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/dashboard",
        name: "home",
        component: () => import("pages/Dashboard.vue"),
      },
      {
        path: "/contact-settings",
        component: () => import("pages/ContactSettings.vue"),
      },
      {
        path: "/stow",
        component: () => import("pages/Stow.vue"),
      },
      {
        path: "/calendar",
        component: () => import("pages/Calendar.vue"),
      },
      {
        path: "/company",
        component: () => import("pages/Company.vue"),
      },
      {
        path: "/customers/:id",
        component: () => import("pages/Customers/edit.vue"),
      },
      {
        path: "/customers",
        name: "customers",
        component: () => import("pages/Customers/index.vue"),
      },
      // {
      //   path: "customers/create",
      //   component: () => import("pages/Customers/create.vue"),
      // },
      {
        path: "/contacts",
        name: "contacts",
        component: () => import("pages/Contacts/index.vue"),
      },
      {
        path: "/phone-record",
        component: () => import("pages/PhoneRecord.vue"),
      },
      {
        path: "/report-form",
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
        path: "/work-order",
        component: () => import("pages/WorkOrder.vue"),
      },
      {
        path: "/personal-groups",
        name: "personalgroups",
        component: () => import("pages/UserGroup/PersonalGroup/Index.vue"),
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
