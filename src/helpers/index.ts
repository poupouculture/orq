export const difference = (arr1: string[], arr2: string[]) => {
  return arr1.filter((arr: string) => !arr2.includes(arr));
};

export const dateFormatter = (dateCreated: string) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateFormat = new Date(dateCreated);

  return `${days[dateFormat.getDay()]}, ${dateFormat.getDate()} ${
    months[dateFormat.getMonth()]
  } ${dateFormat.getFullYear()} • ${("0" + dateFormat.getHours()).slice(-2)}:${(
    "0" + dateFormat.getMinutes()
  ).slice(-2)}:${("0" + dateFormat.getSeconds()).slice(-2)}`;
};
