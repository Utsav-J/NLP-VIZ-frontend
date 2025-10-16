import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} for ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  healthCheck: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // POS Analysis
  analyzePOS: async (text) => {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    
    const response = await api.post('/pos', { text: text.trim() });
    return response.data;
  },

  // NER Analysis
  analyzeNER: async (text) => {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    
    const response = await api.post('/ner', { text: text.trim() });
    return response.data;
  },

  // Translation
  translateText: async (text, targetLanguage) => {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    if (!targetLanguage) {
      throw new Error('Target language is required');
    }

    const response = await api.post('/translate', {
      text: text.trim(),
      target_language: targetLanguage,
    });
    return response.data;
  },

  // Get supported languages
  getLanguages: async () => {
    const response = await api.get('/languages');
    return response.data;
  },
};

export default api;
