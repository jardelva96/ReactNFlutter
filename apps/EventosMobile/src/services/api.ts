// src/services/api.ts
import axios from "axios";
import { Platform } from "react-native";

const BASE_URL = Platform.OS === "android"
  ? "http://10.0.2.2:3005"
  : "http://localhost:3005";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});
