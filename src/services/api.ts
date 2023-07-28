import axios from 'axios';

const api = axios.create({
  baseURL: process.env.URL_BASE_API,
  timeout: 5000,
});

export default api;
