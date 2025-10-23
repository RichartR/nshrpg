// router.js
import { fetchVillages } from "./services/supabase.js";
import { renderGeneralGlossaryController, techPageController } from "./controller/controller.js";
export { router }
export { getCurrentRoute }


// Ruta que viene del menú
let currentRoute = "";

const routes = new Map([
  ['', techPageController],
  ['/#', techPageController],
  ['#Glosario', renderGeneralGlossaryController],
  ['#login', techPageController],
  ['#Konohagakure', fetchVillages],
  ['#Konohagakure/Clan%20Inuzuka', techPageController],
  ['#Sunagakure', techPageController],
]);

// Función de router
async function router(route, container) {
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