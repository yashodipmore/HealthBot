/**
 * HealthBot Monitor - API Service
 * Handles all API communications with the backend
 */
import axios from 'axios';

// API Base URL - Production URL with fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : 'https://healthbot-usp2.onrender.com');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Health Check
 * Check if the API is running and connected to services
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Failed to connect to API');
  }
};

/**
 * Send Chat Message
 * Send a health query and get AI response
 */
export const sendMessage = async (message, conversationId = null) => {
  try {
    const response = await api.post('/chat', {
      message,
      conversation_id: conversationId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to send message');
  }
};

/**
 * Get Metrics
 * Get current system metrics
 */
export const getMetrics = async () => {
  try {
    const response = await api.get('/metrics');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch metrics');
  }
};

/**
 * Get Dashboard Data
 * Get comprehensive dashboard data including metrics and history
 */
export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch dashboard data');
  }
};

/**
 * Get Detailed Stats
 * Get detailed statistics for debugging
 */
export const getStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch stats');
  }
};

/**
 * Get Alerts Status
 * Get current alert status based on metrics thresholds
 */
export const getAlerts = async () => {
  try {
    const response = await api.get('/alerts');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch alerts');
  }
};

/**
 * Setup Datadog Alerts
 * Create monitoring alerts in Datadog
 */
export const setupAlerts = async (email = null) => {
  try {
    const url = email ? `/alerts/setup?email=${encodeURIComponent(email)}` : '/alerts/setup';
    const response = await api.post(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to setup alerts');
  }
};

/**
 * Clear Conversation
 * Clear a specific conversation's history
 */
export const clearConversation = async (conversationId) => {
  try {
    const response = await api.delete(`/conversation/${conversationId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to clear conversation');
  }
};

export default api;
