/**
 * API Service for communicating with Django backend
 */

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem('access_token', response.data.access);

        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/token/', { username: email, password }),
  
  refreshToken: (refreshToken: string) =>
    api.post('/token/refresh/', { refresh: refreshToken }),
};

export const userApi = {
  getCurrentUser: () => api.get('/users/me/'),
  getUser: (id: string) => api.get(`/users/${id}/`),
  listUsers: () => api.get('/users/'),
};

export const profileApi = {
  getMyProfile: () => api.get('/profiles/me/'),
  getProfile: (id: string) => api.get(`/profiles/${id}/`),
  listProfiles: () => api.get('/profiles/'),
};

export const projectApi = {
  listAllProjects: () => api.get('/projects/'),
  getProject: (id: string) => api.get(`/projects/${id}/`),
  createProject: (data: any) => api.post('/projects/', data),
  updateProject: (id: string, data: any) => api.put(`/projects/${id}/`, data),
  deleteProject: (id: string) => api.delete(`/projects/${id}/`),
  
  getMyProjects: () => api.get('/projects/my_projects/'),
  getPublicProjects: () => api.get('/projects/public/'),
  
  requestAccess: (projectId: string, message?: string) =>
    api.post(`/projects/${projectId}/request_access/`, { message }),
  
  approveAccess: (projectId: string, requestId: string) =>
    api.post(`/projects/${projectId}/approve_access/`, { request_id: requestId }),
  
  rejectAccess: (projectId: string, requestId: string) =>
    api.post(`/projects/${projectId}/reject_access/`, { request_id: requestId }),
};

export const teamMemberApi = {
  listTeamMembers: () => api.get('/team-members/'),
  createTeamMember: (data: any) => api.post('/team-members/', data),
};

export const accessRequestApi = {
  listAccessRequests: () => api.get('/access-requests/'),
  getMyRequests: () => api.get('/access-requests/my_requests/'),
  getReceivedRequests: () => api.get('/access-requests/received_requests/'),
};

export default api;
