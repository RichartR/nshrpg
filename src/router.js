// router.js
import { techPage } from './components/technique.js';
export { getCurrentRoute }


// Ruta que viene del menú
let currentRoute = "";

// ✅ Map de rutas con referencias a funciones, NO ejecuciones
const routes = new Map([
  ['', techPage],
  ['/#', techPage],
  ['#login', techPage],
  ['#Konohagakure', techPage],
  ['#Konohagakure/Clan%20Inuzuka', techPage],
  ['#Sunagakure', techPage],
]);

// Función de router
export async function router(route, container) {
  // Guardar la ruta actual antes de llamar al handler
  currentRoute = route;
  
  const handler = routes.get(route);

  if (!handler) {
    container.innerHTML = `<h2>Error 404</h2>`;
    return;
  }

  try {
    const elementDOM = await handler();
    container.replaceChildren(elementDOM);
  } catch (error) {
    console.error('Error en la ruta:', error);
    container.innerHTML = `<p>Error 404</p>`;
  }
}

// Obtener la ruta actual
function getCurrentRoute() {
  return currentRoute;
}