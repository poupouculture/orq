const pagesUrl = [
  {
    id: "F00",
    url: "/landing",
    icon: "",
    isMenu: false,
  },
  {
    id: "F00-01",
    url: "/sign-up",
    icon: "",
    isMenu: false,
  },
  {
    id: "F00-02",
    url: "/forget-password",
    icon: "",
    isMenu: false,
  },
  {
    id: "F01",
    url: "/login",
    icon: "",
    isMenu: false,
  },
  {
    id: "F02",
    url: "/",
    icon: "../../src/assets/images/my.png",
    isMenu: true,
  },
  {
    id: "F03",
    icon: "../../src/assets/images/customer.png",
    url: "/customers",
    isMenu: true,
  },
  {
    id: "F03-01",
    icon: "../../src/assets/images/customer.png",
    url: "/customers/:id",
    isMenu: false,
  },
];

export default pagesUrl;
