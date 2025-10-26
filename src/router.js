// router.js
import { renderGeneralGlossaryController, techPageController, renderVillageGlossaryController, renderContentCategoriesController, processUrl } from "./controller/controller.js";
export { router }
export { getCurrentRoute }


// Ruta que viene del menú
let currentRoute = "";

const routes = new Map([
  ['', techPageController],
  ['/#', techPageController],
  ['#Glosario', renderGeneralGlossaryController],
  ['#login', techPageController],
/* 
  ['#Konohagakure/Clan%20Inuzuka/generales', techPageController], */

]);

// Función de router
async function router(route, container) {
  // Guardar la ruta actual antes de llamar al handler
  currentRoute = route;

  
  
  let handler = routes.get(route);
  
  if (!handler) {
    const processedUrlForAdd = processUrl(route);
    handlerRoutes(processedUrlForAdd);
    handler = routes.get(route);
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

function handlerRoutes(processedUrl){
  if(processedUrl.length == 1){
    routes.set(currentRoute, renderVillageGlossaryController);
  } else if (processedUrl.length == 2){
    routes.set(currentRoute, renderContentCategoriesController);
  } else if (processedUrl.length == 3){
    routes.set(currentRoute, techPageController);
  } else if (processedUrl.length == 4){
    routes.set(currentRoute, techPageController);
  }

}
