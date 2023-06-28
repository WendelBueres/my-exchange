import axios from 'axios';

const api = axios.create({
  baseURL: process.env.URL_BASE_API,
  data: {
    apiKey: process.env.API_KEY,
  },
});

export default api;
