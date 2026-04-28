import axios from 'axios';
import type {
  ApiResponse,
  RestaurantInfo,
  FormattedHours,
  MenuItem,
  GalleryImage,
  Category,
  Reservation,
  User,
  DashboardStats,
} from '../types';

// ===== API URL Configuration =====
// Use VITE_API_URL if defined, otherwise fallback to localhost
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Ensure no trailing slash
export const BASE_URL = rawBaseUrl.replace(/\/$/, '');
export const API_URL = `${BASE_URL}/api`;

// ===== Axios Instance =====
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Helper to get absolute URL for assets (images)
 */
export const getAssetUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// ===== Request Interceptor (attach token if available) =====
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Response Interceptor =====
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and optionally redirect to login
      localStorage.removeItem('token');
      // window.location.href = '/admin/login'; // Let Redux handle logout if preferred
    }
    return Promise.reject(error);
  }
);

// ===== Auth Service =====
export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data; // Expected { token, user }
  },
  getMe: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
    return data.data;
  }
};

// ===== Category Service =====
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },
  create: async (name: string, order: number): Promise<Category> => {
    const { data } = await api.post<ApiResponse<Category>>('/categories', { name, order });
    return data.data;
  },
  update: async (id: string, name: string, order: number): Promise<Category> => {
    const { data } = await api.put<ApiResponse<Category>>(`/categories/${id}`, { name, order });
    return data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  }
};

// ===== Menu Service =====
export const menuService = {
  getAll: async (categoryId?: string): Promise<MenuItem[]> => {
    const url = categoryId ? `/menu/items?categoryId=${categoryId}` : '/menu/items';
    const { data } = await api.get<ApiResponse<MenuItem[]>>(url);
    return data.data;
  },
  getFeatured: async (limit = 8): Promise<MenuItem[]> => {
    const { data } = await api.get<ApiResponse<MenuItem[]>>(`/menu/featured?limit=${limit}`);
    return data.data;
  },
  getById: async (id: string): Promise<MenuItem> => {
    const { data } = await api.get<ApiResponse<MenuItem>>(`/menu/items/${id}`);
    return data.data;
  },
  create: async (formData: FormData): Promise<MenuItem> => {
    const { data } = await api.post<ApiResponse<MenuItem>>('/menu/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
  update: async (id: string, updateData: Partial<MenuItem>): Promise<MenuItem> => {
    const { data } = await api.put<ApiResponse<MenuItem>>(`/menu/items/${id}`, updateData);
    return data.data;
  },
  updateImage: async (id: string, formData: FormData): Promise<MenuItem> => {
    const { data } = await api.put<ApiResponse<MenuItem>>(`/menu/items/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/menu/items/${id}`);
  },
  toggleAvailability: async (id: string): Promise<MenuItem> => {
    const { data } = await api.post<ApiResponse<MenuItem>>(`/menu/items/${id}/availability`);
    return data.data;
  },
  toggleFeatured: async (id: string): Promise<MenuItem> => {
    const { data } = await api.post<ApiResponse<MenuItem>>(`/menu/items/${id}/featured`);
    return data.data;
  }
};

// ===== Gallery Service =====
export const galleryService = {
  getAll: async (): Promise<GalleryImage[]> => {
    const { data } = await api.get<ApiResponse<GalleryImage[]>>('/gallery');
    return data.data;
  },
  getFeatured: async (): Promise<GalleryImage[]> => {
    const { data } = await api.get<ApiResponse<GalleryImage[]>>('/gallery?featured=true');
    return data.data;
  },
  getById: async (id: string): Promise<GalleryImage> => {
    const { data } = await api.get<ApiResponse<GalleryImage>>(`/gallery/${id}`);
    return data.data;
  },
  create: async (formData: FormData): Promise<GalleryImage> => {
    const { data } = await api.post<ApiResponse<GalleryImage>>('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
  update: async (id: string, updateData: Partial<GalleryImage>): Promise<GalleryImage> => {
    const { data } = await api.put<ApiResponse<GalleryImage>>(`/gallery/${id}`, updateData);
    return data.data;
  },
  updateImage: async (id: string, formData: FormData): Promise<GalleryImage> => {
    const { data } = await api.put<ApiResponse<GalleryImage>>(`/gallery/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/gallery/${id}`);
  },
  toggleFeature: async (id: string): Promise<GalleryImage> => {
    const { data } = await api.post<ApiResponse<GalleryImage>>(`/gallery/${id}/feature`);
    return data.data;
  }
};

// ===== Reservation Service =====
export const reservationService = {
  create: async (reservationData: Partial<Reservation>): Promise<Reservation> => {
    const { data } = await api.post<ApiResponse<Reservation>>('/reservations', reservationData);
    return data.data;
  },
  getAll: async (status?: string, date?: string): Promise<Reservation[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (date) params.append('date', date);
    
    const { data } = await api.get<ApiResponse<Reservation[]>>(`/reservations?${params.toString()}`);
    return data.data;
  },
  getUpcoming: async (): Promise<Reservation[]> => {
    const { data } = await api.get<ApiResponse<Reservation[]>>('/reservations/upcoming');
    return data.data;
  },
  update: async (id: string, updateData: Partial<Reservation>): Promise<Reservation> => {
    const { data } = await api.put<ApiResponse<Reservation>>(`/reservations/${id}`, updateData);
    return data.data;
  },
  updateStatus: async (id: string, status: string): Promise<Reservation> => {
    const { data } = await api.put<ApiResponse<Reservation>>(`/reservations/${id}/status`, { status });
    return data.data;
  },
  confirm: async (id: string): Promise<Reservation> => {
    const { data } = await api.post<ApiResponse<Reservation>>(`/reservations/${id}/confirm`);
    return data.data;
  },
  cancel: async (id: string): Promise<Reservation> => {
    const { data } = await api.post<ApiResponse<Reservation>>(`/reservations/${id}/cancel`);
    return data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/reservations/${id}`);
  }
};

// ===== Restaurant Service =====
export const restaurantService = {
  getInfo: async (): Promise<RestaurantInfo> => {
    const { data } = await api.get<ApiResponse<RestaurantInfo>>('/restaurant');
    return data.data;
  },
  getHours: async (): Promise<FormattedHours> => {
    const { data } = await api.get<ApiResponse<FormattedHours>>('/restaurant/hours');
    return data.data;
  },
  updateInfo: async (updateData: Partial<RestaurantInfo>): Promise<RestaurantInfo> => {
    const { data } = await api.put<ApiResponse<RestaurantInfo>>('/restaurant', updateData);
    return data.data;
  },
  updateField: async (field: string, value: any): Promise<RestaurantInfo> => {
    const { data } = await api.put<ApiResponse<RestaurantInfo>>(`/restaurant/${field}`, { value });
    return data.data;
  },
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/restaurant/stats');
    return data.data;
  },
};

export default api;
