import axios from "axios";

const API = axios.create({
  baseURL: "http://james1.twilightparadox.com", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
