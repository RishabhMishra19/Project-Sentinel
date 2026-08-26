import axios from "axios";

export const AxiosClient = axios.create({
  baseURL: "http://localhost:8083/v1/load-engine",
  headers: {
    "Content-Type": "application/json"
  }
});