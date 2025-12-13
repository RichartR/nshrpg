import { describe, it, expect, beforeEach } from 'vitest';
import { router, getCurrentRoute } from '../router.js';

describe('Router', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('debe exportar la función router', () => {
    expect(router).toBeDefined();
    expect(typeof router).toBe('function');
  });

  it('debe exportar la función getCurrentRoute', () => {
    expect(getCurrentRoute).toBeDefined();
    expect(typeof getCurrentRoute).toBe('function');
  });

  it('debe actualizar currentRoute cuando se llama al router', async () => {
    const testRoute = '#test';
    await router(testRoute, container);
    expect(getCurrentRoute()).toBe(testRoute);
  });

  it('debe manejar rutas vacías', async () => {
    await router('', container);
    expect(getCurrentRoute()).toBe('');
  });

  it('debe manejar rutas con hash', async () => {
    await router('/#', container);
    expect(getCurrentRoute()).toBe('/#');
  });
});
