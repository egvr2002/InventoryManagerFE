import {apiUrl} from "@/config/env.config";
import axios from "axios";

export const inventoryApi = axios.create({
  baseURL: apiUrl,
});
