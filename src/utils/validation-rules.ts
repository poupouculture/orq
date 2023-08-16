export const required = (val) => !!val || "This field is required";
export const validateEmail = (val) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(val);
