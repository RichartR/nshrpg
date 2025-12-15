import { Subject } from 'rxjs';

//Servicio para no sar el window
class EventBus {
  constructor() {
    this.affiliationsUpdated$ = new Subject();
    this.categoriesUpdated$ = new Subject();
    this.subcategoriesUpdated$ = new Subject();
  }

  //Emitir los eventos
  emit(eventName, data = null) {
    if (this[`${eventName}$`]) {
      this[`${eventName}$`].next(data);
    } else {
      console.warn(`Evento "${eventName}" no existe en EventBus`);
    }
  }

  // Suscribirse
  on(eventName, callback) {
    if (this[`${eventName}$`]) {
      return this[`${eventName}$`].subscribe(callback);
    } else {
      console.warn(`Evento "${eventName}" no existe en EventBus`);
      return null;
    }
  }

  destroy() {
    Object.keys(this).forEach(key => {
      if (key.endsWith('$') && this[key].complete) {
        this[key].complete();
      }
    });
  }
}

export const eventBus = new EventBus();
