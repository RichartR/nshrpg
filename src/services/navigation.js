class NavigationService {
  constructor() {
    this.currentHash = '';
    this.listeners = new Set();
  }

  init() {
    // Leer hash inicial 
    if (typeof window !== 'undefined') {
      this.currentHash = window.location.hash;

      // Escuchar cambios en el hash del navegador
      window.addEventListener('hashchange', () => {
        this.currentHash = window.location.hash;
        this.notifyListeners();
      });
    }
  }

  navigate(route) {
    // Comprobar que la ruta tiene el formato correcto
    const formattedRoute = route.startsWith('#') ? route : `#${route}`;

    // Actualizar hash del navegador
    if (typeof window !== 'undefined') {
      window.location.hash = formattedRoute;
    }

    this.currentHash = formattedRoute;
    this.notifyListeners();
  }

  getCurrentRoute() {
    return this.currentHash;
  }

  onNavigate(callback) {
    this.listeners.add(callback);

    // Devolver función para dejar de escuchar
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentHash));
  }

  getViewportWidth() {
    return typeof window !== 'undefined' ? window.innerWidth : 1024;
  }
}

// Exportar una instancia
export const navigation = new NavigationService();
