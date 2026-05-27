import client from './client';

// Auth
export const authAPI = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  me: () => client.get('/auth/me'),
};

// Users
export const usersAPI = {
  getAll: () => client.get('/users'),
  getById: (id) => client.get(`/users/${id}`),
  getMatches: () => client.get('/users/matches'),
  updateProfile: (data) => client.put('/users/profile', data),
  getDashboardStats: () => client.get('/users/dashboard/stats'),
};

// Teams
export const teamsAPI = {
  getAll: () => client.get('/teams'),
  getMy: () => client.get('/teams/my'),
  getById: (id) => client.get(`/teams/${id}`),
  create: (data) => client.post('/teams', data),
  join: (id) => client.post(`/teams/${id}/join`),
};

// Competitions
export const competitionsAPI = {
  getAll: (params) => client.get('/competitions', { params }),
  getById: (id) => client.get(`/competitions/${id}`),
  create: (data) => client.post('/competitions', data),
  update: (id, data) => client.put(`/competitions/${id}`, data),
};

// Achievements
export const achievementsAPI = {
  getAll: () => client.get('/achievements'),
  markRead: (id) => client.put(`/achievements/${id}/read`),
  markAllRead: () => client.put('/achievements/read-all'),
};

// Messages
export const messagesAPI = {
  getConversations: () => client.get('/messages'),
  getMessages: (userId) => client.get(`/messages/${userId}`),
  send: (data) => client.post('/messages', data),
};
