import axios from 'axios';
import { 
  User, 
  UserCreate, 
  UserLogin, 
  LoginResponse, 
  UserStats, 
  Achievement, 
  UserProgress,
  GameStats 
} from '../types/user';
import { API_URL } from '../hooks/apiURL';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData: UserCreate): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: UserLogin): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    }, {
      headers: {
        'Content-Type': 'application/json', // Axios lo agrega automáticamente, pero lo dejamos explícito
      },
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/user/me');
    return response.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await api.get('/user/me/stats');
    return response.data;
  },

  getUserAchievements: async (): Promise<Achievement[]> => {
    const response = await api.get('/user/me/achievements');
    return response.data;
  },

  getUserProgress: async (): Promise<UserProgress> => {
    const response = await api.get('user/me/progress');
    return response.data;
  },

  updateGameStats: async (gameStats: GameStats): Promise<void> => {
    await api.post('/auth/update-stats', gameStats);
  },
};

export default api;