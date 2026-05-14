import axios from 'axios';

// Use environment variable for API URL (falls back to localhost for development)
const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('investaToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If token expired, clear local storage
        if (error.response?.status === 401) {
            const isAuthRoute = error.config.url?.includes('/login') || error.config.url?.includes('/register');
            if (!isAuthRoute) {
                localStorage.removeItem('investaToken');
                localStorage.removeItem('investaUser');
            }
        }
        return Promise.reject(error);
    }
);

// ── Auth APIs ────────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/register', data);
export const loginUser = (data) => api.post('/login', data);
export const getUserProfile = () => api.get('/profile');
export const updateUserProfile = (data) => api.put('/profile', data);
export const changePassword = (data) => api.put('/change-password', data);
export const markNotificationRead = (id) => api.put(`/notifications/${id}`);

// ── Article / Blog APIs ──────────────────────────────────────────────────────
// Full CRUD for blog posts
export const getArticles = (params) => api.get('/articles', { params });
export const getArticleById = (id) => api.get(`/articles/${id}`);
export const createArticle = (data) => api.post('/articles', data);
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// ── Investment Ideas APIs ────────────────────────────────────────────────────
export const getInvestmentIdeas = (params) => api.get('/investment-ideas', { params });
export const getIdeaById = (id) => api.get(`/investment-ideas/${id}`);

// ── Video APIs ───────────────────────────────────────────────────────────────
export const getVideos = (params) => api.get('/videos', { params });
export const getVideoById = (id) => api.get(`/videos/${id}`);

// ── Goals APIs ───────────────────────────────────────────────────────────────
export const getGoals = () => api.get('/goals');
export const createGoal = (data) => api.post('/goals', data);
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);

// ── Recommendations API ──────────────────────────────────────────────────────
export const getRecommendations = (profileType) => api.get(`/recommendations/${profileType}`);

// ── Dashboard API ────────────────────────────────────────────────────────────
export const getDashboardData = () => api.get('/dashboard');

// ── News API ─────────────────────────────────────────────────────────────────
export const getNews = () => api.get('/news');

// ── Chatbot API ──────────────────────────────────────────────────────────────
export const queryChatbot = (data) => api.post('/chatbot/query', data);

export default api;
