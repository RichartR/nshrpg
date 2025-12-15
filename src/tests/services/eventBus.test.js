import { describe, it, expect, beforeEach, vi } from 'vitest';
import { eventBus } from '../../services/eventBus.js';

describe('EventBus', () => {
  beforeEach(() => {
    // Eliminar las suscripciones
    if (eventBus.subscriptions) {
      eventBus.subscriptions = [];
    }
  });

  it('debe emitir eventos correctamente', () => {
    const callback = vi.fn();
    const subscription = eventBus.on('affiliationsUpdated', callback);

    eventBus.emit('affiliationsUpdated');

    expect(callback).toHaveBeenCalled();
    subscription.unsubscribe();
  });

  it('debe emitir eventos con datos', () => {
    const callback = vi.fn();
    const testData = { id: 1, name: 'Test' };
    const subscription = eventBus.on('categoriesUpdated', callback);

    eventBus.emit('categoriesUpdated', testData);

    expect(callback).toHaveBeenCalledWith(testData);
    subscription.unsubscribe();
  });

  it('debe permitir múltiples suscriptores', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const subscription1 = eventBus.on('subcategoriesUpdated', callback1);
    const subscription2 = eventBus.on('subcategoriesUpdated', callback2);

    eventBus.emit('subcategoriesUpdated');

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();

    subscription1.unsubscribe();
    subscription2.unsubscribe();
  });

  it('debe advertir cuando se intenta emitir un evento inexistente', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    eventBus.emit('nonExistentEvent');

    expect(consoleSpy).toHaveBeenCalledWith('Evento "nonExistentEvent" no existe en EventBus');

    consoleSpy.mockRestore();
  });

  it('debe advertir cuando se intenta suscribir a un evento inexistente', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const subscription = eventBus.on('nonExistentEvent', () => {});

    expect(consoleSpy).toHaveBeenCalledWith('Evento "nonExistentEvent" no existe en EventBus');
    expect(subscription).toBeNull();

    consoleSpy.mockRestore();
  });

  it('debe dejar de emitir después de unsubscribe', () => {
    const callback = vi.fn();
    const subscription = eventBus.on('affiliationsUpdated', callback);

    eventBus.emit('affiliationsUpdated');
    expect(callback).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
    eventBus.emit('affiliationsUpdated');

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('debe completar todos los subjects al llamar destroy', () => {
    const callback = vi.fn();
    const subscription = eventBus.on('affiliationsUpdated', callback);

    eventBus.destroy();

    eventBus.emit('affiliationsUpdated');
    expect(callback).not.toHaveBeenCalled();

    subscription.unsubscribe();
  });
});
