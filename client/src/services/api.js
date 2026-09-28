const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : '/api'
);

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('faq_ai_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authAPI = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  googleLogin: (googleData) => request('/auth/google', { method: 'POST', body: JSON.stringify(googleData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  changePassword: (passwordData) => request('/auth/change-password', { method: 'PUT', body: JSON.stringify(passwordData) })
};

export const faqAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/faqs${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/faqs/${id}`),
  search: (q, category) => {
    const params = new URLSearchParams({ q });
    if (category) params.append('category', category);
    return request(`/faqs/search?${params.toString()}`);
  },
  duplicateCheck: (question) => request('/faqs/duplicate-check', { method: 'POST', body: JSON.stringify({ question }) }),
  create: (faqData) => request('/faqs', { method: 'POST', body: JSON.stringify(faqData) }),
  update: (id, faqData) => request(`/faqs/${id}`, { method: 'PUT', body: JSON.stringify(faqData) }),
  delete: (id) => request(`/faqs/${id}`, { method: 'DELETE' }),
  voteHelpful: (id, vote) => request(`/faqs/${id}/helpful`, { method: 'POST', body: JSON.stringify({ vote }) }),
  toggleFavorite: (id) => request(`/faqs/${id}/favorite`, { method: 'POST' }),
  restoreVersion: (id, versionNumber) => request(`/faqs/${id}/restore-version`, { method: 'POST', body: JSON.stringify({ versionNumber }) })
};

export const categoryAPI = {
  getAll: () => request('/categories'),
  create: (categoryData) => request('/categories', { method: 'POST', body: JSON.stringify(categoryData) }),
  update: (id, categoryData) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(categoryData) }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' })
};

export const aiAPI = {
  generateFAQ: (data) => request('/ai/generate-faq', { method: 'POST', body: JSON.stringify(data) }),
  improveAnswer: (data) => request('/ai/improve-answer', { method: 'POST', body: JSON.stringify(data) }),
  qualityCheck: (data) => request('/ai/quality-check', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: () => request('/ai/history'),
  deleteHistory: (id) => request(`/ai/history/${id}`, { method: 'DELETE' })
};

export const unansweredAPI = {
  getAll: () => request('/unanswered'),
  dismiss: (id) => request(`/unanswered/${id}`, { method: 'DELETE' })
};

export const analyticsAPI = {
  getOverview: () => request('/analytics'),
  getActivity: () => request('/analytics/activity'),
  getHealth: () => request('/analytics/health')
};

export const userAPI = {
  getAll: () => request('/users'),
  updateRole: (id, role) => request(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  toggleStatus: (id, status) => request(`/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  delete: (id) => request(`/users/${id}`, { method: 'DELETE' })
};
