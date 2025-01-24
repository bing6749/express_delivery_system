import axios from 'axios'

const API = axios.create({
  baseURL:'http://localhost:3066/api',
  timeout: 20000
})

// 请求拦截器
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // token 过期或无效,清除本地 token
      localStorage.removeItem('token');
      window.location.href = '/adminLogin';
    }
    return Promise.reject(error);
  }
);

export default API
