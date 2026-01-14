import { CONFIG } from '../config/constants.js';
import Store from '../js/store/store.js'; 

export const ApiService = {

  async login(email, password) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || result.message || "Identifiants incorrects.");
        }
        
        Store.login(result.user || { email }, result.token);
        
    } catch (error) {
      throw(error)
    }
  },

  async register(userData) {
    try {
          const response = await fetch(`${CONFIG.API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.message || "Informations incorrectes.");
        }

        Store.login(result.user || { email }, result.token);

        window.location.href = "/index.html";
    } catch (error) {
      throw error;
    }
  },
  async request(endpoint, options = {}) {
    const token = Store.getToken();  

    const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

   
    if (response.status === 401) {
      Store.logout();
      window.location.href = '/authentification/login.html';
      throw new Error('Session expirée');
    }

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