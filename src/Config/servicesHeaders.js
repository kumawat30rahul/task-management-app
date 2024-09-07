import axios from "axios";
// import EnvConfig from "./envConfig";

const postHeaders = {
  "Content-Type": "application/json",
  access_token: "",
};
const getHeaders = {
  "Content-Type": "application/json",
  access_token: "",
};
const patchHeaders = {
  "Content-Type": "application/json",
  access_token: "",
};

const imageHeaders = {
  "Content-Type": "multipart/form-data",
  access_token: "",
};

const deleteHeaders = {
  "Content-Type": "application/json",
  access_token: "",
};

export const getRequest = async (url) => {
  const access_token = localStorage.getItem("access_token");
  return new Promise((resolve, reject) => {
    axios
      .get(url, { headers: { ...getHeaders, access_token } })
      .then((response) => {
        resolve(response.data);
        if (response?.data?.message === "Unauthorized Access_token") {
          localStorage.clear();
          window.location.href = "/";
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const postRequest = async (url, data) => {
  const access_token = localStorage.getItem("access_token");
  return new Promise((resolve, reject) => {
    const headers = { ...postHeaders, access_token };
    axios
      .post(url, data, { headers })
      .then((response) => {
        resolve(response.data);
        if (response?.data?.message === "Unauthorized Access_token") {
          localStorage.clear();
          window.location.href = "/";
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const postImageRequest = async (url, data) => {
  const access_token = localStorage.getItem("access_token");
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, { ...imageHeaders, access_token })
      .then((response) => {
        resolve(response.data);
        if (response?.data?.message === "Unauthorized Access_token") {
          localStorage.clear();
          window.location.href = "/";
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const patchRequest = async (url, data) => {
  const access_token = localStorage.getItem("access_token");
  return new Promise((resolve, reject) => {
    axios
      .patch(url, data, { headers: { ...patchHeaders, access_token } })
      .then((response) => {
        resolve(response.data);
        if (response?.data?.message === "Unauthorized Access_token") {
          localStorage.clear();
          window.location.href = "/";
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// export const deleteRequest = async (url, data) => {
//   const access_token = localStorage.getItem("access_token");
//   return new Promise((resolve, reject) => {
//     axios
//       .delete(url, data, { headers: { ...patchHeaders, access_token } })
//       .then((response) => {
//         resolve(response.data);
//         if (response?.data?.message === "Unauthorized Access_token") {
//           localStorage.clear();
//           window.location.href = "/";
//         }
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };
