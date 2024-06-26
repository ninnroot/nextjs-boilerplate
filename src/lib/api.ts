import axios from "axios";

import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

if (!baseURL) {
  throw new Error("env variable 'NEXT_PUBLIC_BASE_API_URL' is not undefined.");
}

const axiosClient = axios.create({
  baseURL,
});

axiosClient.interceptors.request.use(async (request) => {
  if (getCookie("access")) {
    request.headers["Authorization"] = `Bearer ${getCookie("access")}`;
  }
  return request;
});



export { axiosClient };
