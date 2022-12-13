import axios from "axios";
import Auth from "../Auth";
import config from "../config.json";

const base_url = window.location.origin;

const api = axios.create({
  baseURL: base_url == 'http://127.0.0.1:5173' ? config.API_LOCAL: config.API_REMOTA,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(function (config) {
  const token = Auth.getSession();
  config.headers['AUTHORIZATION'] = token;

  return config;
});

api._req = async (method, endpoint, params) => {
  try {
    return await api[method](endpoint, params );
  } catch (err) {
    if (err.request.status == 400) return err.response;
    console.log(err);
    throw new Error(err);
  }
}

export default api;