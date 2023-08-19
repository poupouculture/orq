// ref: Component/BackgroundWithIcon.vue, types/LandingPageTypes.ts
export const iconAlignment = (alignment: string) => {
  if (alignment === "center") {
    return "md:justify-center md:items-center";
  } else if (alignment === "left") {
    return "md:justify-start md:items-start";
  } else if (alignment === "around") {
    return "md:justify-around md:items-center";
  } else if (alignment === "right") {
    return "md:justify-end md:items-end";
  } else {
    return "md:justify-evenly md:items-center";
  }
};
