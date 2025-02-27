import axios from "axios";
import {BASE_URL} from "./baseRouting.js";

const token = localStorage.getItem("access_token");
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
});

export default api;