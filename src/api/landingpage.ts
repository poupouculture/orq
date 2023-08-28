import { orqApi } from "boot/axios";

export const getAllNavigation = async (param?: string) => {
  const params = {
    fields:
      "name,raw,icon,logo,header_position,pages.name,pages.name,pages.url,pages.id,pages.sort",
    "filter[name][_eq]": param,
  } as any;
  if (process.env.APP) {
    params["filter[app][_eq]"] = process.env.APP;
  }
  if (param === "") {
    delete params["filter[name][_eq]"];
  }

  const navigation = orqApi.get("/items/page_navigation", { params });

  return navigation;
};

export const getNavigationById = async (id?: string) => {
  return orqApi.get(
    `/items/pages/${id}?fields=id,name,slug,url,group_by&sort=sort&fields=component.page_component_id.*,component.page_component_id.children.*`
  );
};

export const contactUs = async (args: any) => {
  return orqApi.post("/items/form", {
    app: args.app,
    raw: args,
  });
};
