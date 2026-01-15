const Store = {
  // === L'état centralisé ===
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    todayStats: { sugar: 0, caffeine: 0, calories: 0 }
  },

  // === Liste des "abonnés" qui veulent être notifiés des changements ===
  listeners: [],

  // === Lire l'état ===
  getState() {
    return this.state;
  },

  // === Modifier l'état et notifier tout le monde ===
  setState(newState) {
    this.state = { ...this.state, ...newState };
    // Prévenir tous les abonnés
    this.listeners.forEach(fn => fn(this.state));
  },

  // === S'abonner aux changements ===
  subscribe(fn) {
    this.listeners.push(fn);
    // Retourne une fonction pour se désabonner
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  },

  // === Actions pratiques ===
  
  login(user, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.setState({ user, token, isAuthenticated: true });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      todayStats: { sugar: 0, caffeine: 0, calories: 0 }
    });
  },

  getToken() {
    return this.state.token;
  },

  updateTodayStats(stats) {
    this.setState({
      todayStats: { ...this.state.todayStats, ...stats }
    });
  }
};

// Restaurer l'utilisateur au chargement
const savedUser = localStorage.getItem('user');
if (savedUser) {
  try {
    Store.state.user = JSON.parse(savedUser);
  } catch (e) {}
}

export default Store;