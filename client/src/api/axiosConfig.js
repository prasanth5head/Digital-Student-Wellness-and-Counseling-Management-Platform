import axios from 'axios';

const backendOrigin = import.meta.env.VITE_API_URL || '';
const api = axios.create({
  baseURL: backendOrigin ? `${backendOrigin}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aurawell_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, clear token and redirect unless on login/register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('aurawell_token');
        localStorage.removeItem('aurawell_user');
        window.location.href = '/login';
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  googleAuth: (googleData) => api.post('/auth/google', googleData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getProfile: () => api.get('/student/profile'),
  updateProfile: (profileData) => api.put('/student/profile', profileData),
  getAssessments: () => api.get('/student/assessments'),
  getAppointments: () => api.get('/student/appointments'),
  getRequests: () => api.get('/student/requests'),
  getSessions: () => api.get('/student/sessions'),
};

export const assessmentAPI = {
  getQuestions: () => api.get('/assessments/questions'),
  submitAssessment: (answers) => api.post('/assessments/submit', { answers }),
  getHistory: () => api.get('/assessments/history'),
  getById: (id) => api.get(`/assessments/${id}`),
};

export const counselingRequestAPI = {
  create: (requestData) => api.post('/requests', requestData),
  getStudentRequests: () => api.get('/requests/student'),
  getAll: (page = 0, size = 20) => api.get(`/requests/all?page=${page}&size=${size}`),
};

export const appointmentAPI = {
  create: (appointmentData) => api.post('/appointments', appointmentData),
  update: (id, updateData) => api.put(`/appointments/${id}`, updateData),
  cancel: (id, reason) => api.delete(`/appointments/${id}/cancel?reason=${encodeURIComponent(reason || '')}`),
  getAll: (page = 0, size = 20) => api.get(`/appointments/all?page=${page}&size=${size}`),
};

export const counselorAPI = {
  getAllCounselors: () => api.get('/counselor/list'),
  getDashboard: () => api.get('/counselor/dashboard'),
  getProfile: () => api.get('/counselor/profile'),
  updateProfile: (profileData) => api.put('/counselor/profile', profileData),
  getStudentWellnessProfile: (studentId) => api.get(`/counselor/students/${studentId}/wellness-profile`),
  getAppointments: () => api.get('/counselor/appointments'),
  getRequests: () => api.get('/counselor/requests'),
  updateRequestStatus: (id, status, notes) => api.put(`/counselor/requests/${id}/status?status=${status}&notes=${encodeURIComponent(notes || '')}`),
  createSession: (sessionData) => api.post('/counselor/sessions', sessionData),
  saveClinicalNote: (noteData) => api.post('/counselor/notes', noteData),
  getNotesForStudent: (studentId) => api.get(`/counselor/notes/student/${studentId}`),
};

export const messageAPI = {
  send: (messageData) => api.post('/messages/send', messageData),
  getConversation: (conversationId) => api.get(`/messages/conversation/${conversationId}`),
  getWithUser: (userId) => api.get(`/messages/with/${userId}`),
  markAsRead: (conversationId) => api.put(`/messages/conversation/${conversationId}/read`),
  getUnreadCount: () => api.get('/messages/unread-count'),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const resourceAPI = {
  getAll: (category, search) => api.get(`/resources?category=${encodeURIComponent(category || '')}&search=${encodeURIComponent(search || '')}`),
  getById: (id) => api.get(`/resources/${id}`),
  getRecommended: () => api.get('/resources/recommended'),
  toggleBookmark: (id) => api.post(`/resources/${id}/bookmark`),
  getBookmarks: () => api.get('/resources/bookmarks'),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  getAnalytics: (id) => api.get(`/departments/${id}/analytics`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const adminAPI = {
  getOverview: () => api.get('/admin/analytics/overview'),
  getUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getStudents: (search, page = 0, size = 15) => api.get(`/admin/students?search=${encodeURIComponent(search || '')}&page=${page}&size=${size}`),
  getQuestions: () => api.get('/admin/questions'),
  createQuestion: (data) => api.post('/admin/questions', data),
  updateQuestion: (id, data) => api.put(`/admin/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),
  getAnnouncements: () => api.get('/admin/announcements'),
  createAnnouncement: (data) => api.post('/admin/announcements', data),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`),
  getAuditLogs: (page = 0, size = 25) => api.get(`/admin/audit-logs?page=${page}&size=${size}`),
};

export default api;
