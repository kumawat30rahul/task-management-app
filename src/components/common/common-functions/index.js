import { format } from "date-fns";

export const emailValidator = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const dateFormater = (date, type) => {
  if (date === null || date === undefined || date === "") {
    return "NA";
  }
  return format(date, type);
};
