const pagesUrl = [
  {
    id: "F00",
    url: "/landing",
    icon: "",
    isMenu: false,
    hasSubMenu: false,
  },
  {
    id: "F00-01",
    url: "/sign-up",
    icon: "",
    isMenu: false,
    hasSubMenu: false,
  },
  {
    id: "F00-02",
    url: "/forget-password",
    icon: "",
    isMenu: false,
    hasSubMenu: false,
  },
  {
    id: "F01",
    url: "/login",
    icon: "",
    isMenu: false,
    hasSubMenu: false,
  },
  {
    id: "F02",
    url: "/",
    icon: "../../src/assets/images/my.png",
    isMenu: true,
    hasSubMenu: false,
  },
  {
    id: "F03",
    icon: "../../src/assets/images/customer.png",
    url: "/customers",
    isMenu: true,
    hasSubMenu: true,
    children: [
      {
        id: "F03",
        icon: "../../src/assets/images/customer.png",
        url: "/customers",
        label: "Customer Info",
        isMenu: true,
        hasSubMenu: false,
      },
      {
        id: "F03-01",
        icon: "../../src/assets/images/customer.png",
        url: "/customers/:id",
        isMenu: false,
        hasSubMenu: false,
      },
    ],
  },
  {
    id: "F04",
    icon: "../../src/assets/images/customer.png",
    url: "/profile",
    isMenu: true,
    hasSubMenu: false,
    children: [

    ],
  },
];

export default pagesUrl;
