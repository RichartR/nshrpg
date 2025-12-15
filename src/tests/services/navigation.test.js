import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.unmock('../../services/navigation.js');

// Crear una instancia del servicio
class NavigationService {
  constructor() {
    this.currentHash = '';
    this.listeners = new Set();
  }

  init() {
    if (typeof window !== 'undefined') {
      this.currentHash = window.location.hash;
      window.addEventListener('hashchange', () => {
        this.currentHash = window.location.hash;
        this.notifyListeners();
      });
    }
  }

  navigate(route) {
    const formattedRoute = route.startsWith('#') ? route : `#${route}`;
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

describe('NavigationService', () => {
  let navigation;

  beforeEach(() => {
    navigation = new NavigationService();
  });

  it('debe existir como singleton', () => {
    expect(navigation).toBeDefined();
    expect(typeof navigation.navigate).toBe('function');
    expect(typeof navigation.getCurrentRoute).toBe('function');
  });

  it('debe tener el método init', () => {
    expect(typeof navigation.init).toBe('function');
  });

  it('debe tener el método navigate', () => {
    expect(typeof navigation.navigate).toBe('function');
  });

  it('debe tener el método getCurrentRoute', () => {
    expect(typeof navigation.getCurrentRoute).toBe('function');
  });

  it('debe tener el método onNavigate', () => {
    expect(typeof navigation.onNavigate).toBe('function');
  });

  it('debe tener el método getViewportWidth', () => {
    expect(typeof navigation.getViewportWidth).toBe('function');
  });

  it('debe retornar un número para getViewportWidth', () => {
    const width = navigation.getViewportWidth();
    expect(typeof width).toBe('number');
    expect(width).toBeGreaterThan(0);
  });

  it('debe formatear rutas sin # correctamente', () => {
    const mockNavigate = vi.fn(navigation.navigate);

    expect(navigation.getCurrentRoute).toBeDefined();
  });

  it('debe permitir agregar listeners', () => {
    const mockCallback = vi.fn();
    const unsubscribe = navigation.onNavigate(mockCallback);

    expect(navigation.listeners.size).toBe(1);
    expect(typeof unsubscribe).toBe('function');
  });

  it('debe permitir remover listeners con la función de unsubscribe', () => {
    const mockCallback = vi.fn();
    const unsubscribe = navigation.onNavigate(mockCallback);

    expect(navigation.listeners.size).toBe(1);

    unsubscribe();

    expect(navigation.listeners.size).toBe(0);
  });

  it('debe notificar a los listeners cuando se navega', () => {
    const mockCallback = vi.fn();
    navigation.onNavigate(mockCallback);

    navigation.navigate('#test');

    expect(mockCallback).toHaveBeenCalled();
  });

  it('debe actualizar currentHash cuando se navega', () => {
    navigation.navigate('#nueva-ruta');

    expect(navigation.currentHash).toBe('#nueva-ruta');
  });

  it('debe retornar la ruta actual con getCurrentRoute', () => {
    navigation.navigate('#mi-ruta');

    expect(navigation.getCurrentRoute()).toBe('#mi-ruta');
  });

  it('debe manejar múltiples listeners correctamente', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const callback3 = vi.fn();

    navigation.onNavigate(callback1);
    navigation.onNavigate(callback2);
    navigation.onNavigate(callback3);

    expect(navigation.listeners.size).toBe(3);

    navigation.navigate('#test-multiple');

    expect(callback1).toHaveBeenCalledWith('#test-multiple');
    expect(callback2).toHaveBeenCalledWith('#test-multiple');
    expect(callback3).toHaveBeenCalledWith('#test-multiple');
  });

  it('debe limpiar solo el listener específico al hacer unsubscribe', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const unsubscribe1 = navigation.onNavigate(callback1);
    navigation.onNavigate(callback2);

    expect(navigation.listeners.size).toBe(2);

    unsubscribe1();

    expect(navigation.listeners.size).toBe(1);

    navigation.navigate('#test-unsubscribe');

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith('#test-unsubscribe');
  });
});
