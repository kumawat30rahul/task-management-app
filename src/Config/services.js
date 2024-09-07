import config from "./config";
import { getRequest, patchRequest, postRequest } from "./servicesHeaders";

let envBaseUrl = config[import.meta.env.VITE_MY_ENV].backendUrl;

const serviceList = {
  user: "/user",
  task: "/task",
};

export const registerUser = async (payload) => {
  const url = envBaseUrl + serviceList.user + `/register`;
  return postRequest(url, payload);
};

export const loginUser = async (payload) => {
  const url = envBaseUrl + serviceList.user + `/login`;
  return postRequest(url, payload);
};

export const googleLogin = async (payload) => {
  const url = envBaseUrl + serviceList.user + `/google-login`;
  return postRequest(url, payload);
};
