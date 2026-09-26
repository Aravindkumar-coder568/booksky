import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (name, email, password) => api.post('/auth/register', { name, email, password });

export const getBooks = (genre) => api.get(`/books${genre ? `?genre=${genre}` : ''}`);
export const searchBooks = (query) => api.get(`/books/search?query=${query}`);
export const getBookDetails = (id) => api.get(`/books/${id}`);

export const logActivity = (book_id, activity_type) => api.post('/activity', { book_id, activity_type });
export const rateBook = (book_id, rating) => api.post('/activity/rating', { book_id, rating });

export const getRecommendations = () => api.get('/recommendations');

export default api;
