
import { CONFIG } from '../config/constants.js';

export const ApiService = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    
    return response.json();
  },
  
  get: (endpoint) => ApiService.request(endpoint),
  
  post: (endpoint, data) => ApiService.request(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  put: (endpoint, data) => ApiService.request(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  patch: (endpoint, data) => ApiService.request(endpoint, { 
    method: 'PATCH', 
    body: JSON.stringify(data) 
  }),
  
  delete: (endpoint) => ApiService.request(endpoint, { 
    method: 'DELETE' 
  })
};
