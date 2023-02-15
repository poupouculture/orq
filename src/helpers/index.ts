export const difference = (arr1: string[], arr2: string[]) => {
  return arr1.filter((arr: string) => !arr2.includes(arr));
};
