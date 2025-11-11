import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse } from './types';

// Centraliza a configuração do axios na aplicação
const axiosInstance = axios.create({
  baseURL: 'https://localhost:7053/api/v1/',
});

// Interceptor para adicionar o token JWT a cada requisição
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Exporta um encapsulamento para uso na aplicação
const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.get(url, config);
    return response as AxiosResponse<ApiResponse<T>>;
  },
  post: async <T>(url: string, data?: T, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.post(url, data, config);
    return response as AxiosResponse<ApiResponse<T>>;
  },
  put: async <T>(url: string, data?: T, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.put(url, data, config);
    return response as AxiosResponse<ApiResponse<T>>;
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.delete(url, config);
    return response as AxiosResponse<ApiResponse<T>>;
  },
  patch: async <T>(url: string, data?: T, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.patch(url, data, config);
    return response as AxiosResponse<ApiResponse<T>>;
  },
};

export default api;
