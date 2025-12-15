import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ContentAffiliationsComponent from '../../components/contentAffiliations/contentAffiliations.js';
import { eventBus } from '../../services/eventBus.js';

// Mock del servicio de supabase
vi.mock('../../services/supabase.js', () => ({
  fetchVillages: vi.fn(() => Promise.resolve([
    { affiliation_id: 1, affiliation_name: 'Konoha', is_active: true },
    { affiliation_id: 2, affiliation_name: 'Suna', is_active: true }
  ])),
  toggleAffiliationController: vi.fn()
}));

// Mock del controller
vi.mock('../../controller/controller.js', () => ({
  toggleAffiliationController: vi.fn(() => Promise.resolve({ success: true }))
}));

// Custom elements para test
if (!customElements.get('content-affiliations-test')) {
  customElements.define('content-affiliations-test', ContentAffiliationsComponent);
}

describe('ContentAffiliationsComponent', () => {
  let component;

  beforeEach(async () => {
    component = document.createElement('content-affiliations-test');
    document.body.appendChild(component);
    await component.connectedCallback();
  });

  afterEach(() => {
    if (component && component.parentNode) {
      component.parentNode.removeChild(component);
    }
    if (component.searchSubject$) {
      component.searchSubject$.complete();
    }
  });

  it('debe crear una instancia del componente', () => {
    expect(component).toBeInstanceOf(ContentAffiliationsComponent);
  });

  it('debe inicializarse con arrays vacíos y Subject', () => {
    expect(component.villages).toBeDefined();
    expect(component.filteredVillages).toBeDefined();
    expect(component.searchTerm).toBe('');
    expect(component.searchSubject$).toBeDefined();
  });

  it('debe tener un método setupSearchDebounce', () => {
    expect(typeof component.setupSearchDebounce).toBe('function');
  });

  it('debe filtrar afiliaciones por nombre', () => {
    component.villages = [
      { affiliation_name: 'Konoha', is_active: true },
      { affiliation_name: 'Suna', is_active: true },
      { affiliation_name: 'Kiri', is_active: true }
    ];

    component.searchTerm = 'Kon';
    component.filterVillages();

    expect(component.filteredVillages.length).toBe(1);
    expect(component.filteredVillages[0].affiliation_name).toBe('Konoha');
  });

  it('debe mostrar todas las afiliaciones cuando searchTerm está vacío', () => {
    component.villages = [
      { affiliation_name: 'Konoha', is_active: true },
      { affiliation_name: 'Suna', is_active: true }
    ];

    component.searchTerm = '';
    component.filterVillages();

    expect(component.filteredVillages.length).toBe(2);
  });

  it('debe emitir evento al Event Bus cuando se actualiza una afiliación', async () => {
    const emitSpy = vi.spyOn(eventBus, 'emit');

    // Simular que ya hay datos cargados
    component.villages = [
      { affiliation_id: 1, affiliation_name: 'Konoha', is_active: true }
    ];
    component.render();
    component.setupEventListeners();

    // Simular el toggle
    await component.handleToggle({
      target: {
        dataset: { villageId: '1', currentStatus: 'true' },
        disabled: false,
        textContent: 'Ocultar'
      }
    });

    expect(emitSpy).toHaveBeenCalledWith('affiliationsUpdated');

    emitSpy.mockRestore();
  });

  it('debe limpiar el Subject en disconnectedCallback', () => {
    const completeSpy = vi.spyOn(component.searchSubject$, 'complete');

    component.disconnectedCallback();

    expect(completeSpy).toHaveBeenCalled();

    completeSpy.mockRestore();
  });

  it('debe renderizar el input de búsqueda', async () => {
    await component.connectedCallback();

    const searchInput = component.querySelector('.search-input');
    expect(searchInput).toBeTruthy();
    expect(searchInput.tagName).toBe('INPUT');
  });

  it('debe tener configurado el sistema de debounce con RxJS', () => {
    // Comprobar que el Subject existe
    expect(component.searchSubject$).toBeDefined();
    expect(typeof component.searchSubject$.next).toBe('function');

    // Comprobar que el método de setup existe
    expect(typeof component.setupSearchDebounce).toBe('function');

    // Comprobar que al escribir en el input se emite al Subject
    const searchInput = component.querySelector('.search-input');
    const nextSpy = vi.spyOn(component.searchSubject$, 'next');

    searchInput.value = 'test';
    searchInput.dispatchEvent(new Event('input'));

    expect(nextSpy).toHaveBeenCalled();

    nextSpy.mockRestore();
  });
});
