import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { AuthResponse, Form, CreateFormDto, FormSubmission } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const formsApi = {
  getAll: async (): Promise<Form[]> => {
    const response = await api.get('/forms');
    return response.data;
  },
  getById: async (id: string): Promise<Form> => {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },
  create: async (data: CreateFormDto): Promise<Form> => {
    const response = await api.post('/forms', data);
    return response.data;
  },
  update: async (id: string, data: CreateFormDto): Promise<Form> => {
    const response = await api.put(`/forms/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/forms/${id}`);
  },
  submit: async (id: string, dataJson: string): Promise<FormSubmission> => {
    const response = await api.post(`/forms/${id}/submit`, { dataJson });
    return response.data;
  },
  getSubmissions: async (id: string): Promise<FormSubmission[]> => {
    const response = await api.get(`/forms/${id}/submissions`);
    return response.data;
  },
};


