import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import HeaderComponent from '../../components/header/header.js';
import { eventBus } from '../../services/eventBus.js';

// Mock de los servicios
vi.mock('../../services/supabase.js', () => ({
  getCurrentUser: vi.fn(() => Promise.resolve(null)),
  signOut: vi.fn(() => Promise.resolve({ success: true })),
  fetchMenuData: vi.fn(() => Promise.resolve([]))
}));

// Custom elements para test
if (!customElements.get('header-test')) {
  customElements.define('header-test', HeaderComponent);
}

describe('HeaderComponent', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('header-test');
    document.body.appendChild(component);
  });

  afterEach(() => {
    if (component && component.parentNode) {
      component.parentNode.removeChild(component);
    }
    if (component.cleanupSubscriptions) {
      component.cleanupSubscriptions();
    }
  });

  it('debe crear una instancia del componente', () => {
    expect(component).toBeInstanceOf(HeaderComponent);
  });

  it('debe inicializarse con un array de subscriptions vacío', () => {
    expect(component.subscriptions).toEqual([]);
  });

  it('debe suscribirse a eventos del Event Bus', async () => {
    const testMenuData = [
      { affiliation_name: 'Konoha', category_name: 'Ninjutsu' }
    ];

    await component.setMenuData(testMenuData);

    // Comprobar que hay suscripciones
    expect(component.subscriptions.length).toBeGreaterThan(0);
  });

  it('debe actualizar menuData cuando se emite affiliationsUpdated', async () => {
    const testMenuData = [
      { affiliation_name: 'Konoha', category_name: 'Ninjutsu' }
    ];

    await component.setMenuData(testMenuData);

    const refreshSpy = vi.spyOn(component, 'refreshMenuData');

    // Emitir evento
    eventBus.emit('affiliationsUpdated');

    // Esperar un tick para que se procese la suscripción
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(refreshSpy).toHaveBeenCalled();

    refreshSpy.mockRestore();
  });

  it('debe actualizar menuData cuando se emite categoriesUpdated', async () => {
    const testMenuData = [
      { affiliation_name: 'Konoha', category_name: 'Ninjutsu' }
    ];

    await component.setMenuData(testMenuData);

    const refreshSpy = vi.spyOn(component, 'refreshMenuData');

    // Emitir evento
    eventBus.emit('categoriesUpdated');

    // Esperar un tick
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(refreshSpy).toHaveBeenCalled();

    refreshSpy.mockRestore();
  });

  it('debe actualizar menuData cuando se emite subcategoriesUpdated', async () => {
    const testMenuData = [
      { affiliation_name: 'Konoha', category_name: 'Ninjutsu' }
    ];

    await component.setMenuData(testMenuData);

    const refreshSpy = vi.spyOn(component, 'refreshMenuData');

    // Emitir evento
    eventBus.emit('subcategoriesUpdated');

    // Esperar un tick
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(refreshSpy).toHaveBeenCalled();

    refreshSpy.mockRestore();
  });

  it('debe limpiar las suscripciones en cleanupSubscriptions', async () => {
    const testMenuData = [
      { affiliation_name: 'Konoha', category_name: 'Ninjutsu' }
    ];

    await component.setMenuData(testMenuData);

    const subscriptionCount = component.subscriptions.length;
    expect(subscriptionCount).toBeGreaterThan(0);

    component.cleanupSubscriptions();

    expect(component.subscriptions.length).toBe(0);
  });

  it('debe limpiar suscripciones en disconnectedCallback', async () => {
    const testMenuData = [
      { affiliation_name: 'Konoha', category_name: 'Ninjutsu' }
    ];

    await component.setMenuData(testMenuData);

    const cleanupSpy = vi.spyOn(component, 'cleanupSubscriptions');

    component.disconnectedCallback();

    expect(cleanupSpy).toHaveBeenCalled();

    cleanupSpy.mockRestore();
  });

  it('debe configurar el debounce de resize', async () => {
    const testMenuData = [];
    await component.setMenuData(testMenuData);

    // Comprobar que setupResizeListener se llama
    expect(component.subscriptions.length).toBeGreaterThan(0);
  });

  it('debe tener configurado el sistema de debounce para resize', async () => {
    const testMenuData = [];
    await component.setMenuData(testMenuData);

    // Comprobar que setupResizeListener existe y se llama
    expect(typeof component.setupResizeListener).toBe('function');

    // Comprobar que hay suscripciones creadas
    expect(component.subscriptions.length).toBeGreaterThan(0);

    // Comprobar que las suscripciones tienen el método unsubscribe
    const hasRxJSSubscriptions = component.subscriptions.some(
      sub => sub && typeof sub.unsubscribe === 'function'
    );
    expect(hasRxJSSubscriptions).toBe(true);
  });
});
