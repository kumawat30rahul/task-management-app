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

export const getAllTasks = async () => {
  const url = envBaseUrl + serviceList.task + `/all`;
  return getRequest(url);
};

export const updateTaskStatus = async (payload) => {
  const url = envBaseUrl + serviceList.task + `/update-status`;
  return patchRequest(url, payload);
};

export const createTask = async (payload) => {
  const url = envBaseUrl + serviceList.task + `/create`;
  return postRequest(url, payload);
};

export const getTaskById = async (taskId) => {
  const url = envBaseUrl + serviceList.task + `/get-task/${taskId}`;
  return getRequest(url);
};

export const editTask = async (payload) => {
  const url = envBaseUrl + serviceList.task + `/edit`;
  return patchRequest(url, payload);
};

export const googleLogin = async (payload) => {
  const url = envBaseUrl + serviceList.user + `/google-login`;
  return postRequest(url, payload);
};

export const getUserDetails = async (userId) => {
  const url = envBaseUrl + serviceList.user + `/${userId}`;
  return getRequest(url);
};

export const deleteTask = async (payload) => {
  const url = envBaseUrl + serviceList.task + `/delete`;
  return postRequest(url, payload);
};

export const searchTasks = async (searchQuery) => {
  const url = envBaseUrl + serviceList.task + `/search?taskName=${searchQuery}`;
  return getRequest(url);
};

export const sortTasks = async (payload) => {
  const url = envBaseUrl + serviceList.task + `/sort`;
  return postRequest(url, payload);
};
