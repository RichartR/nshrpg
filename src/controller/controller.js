import { renderGeneralGlossary } from "../components/globalGlossary.js";
import { fetchVillages } from "../services/supabase";
import { renderPage } from "../components/technique.js";
import { fetchTech, fetchAbilitys } from '../services/supabase.js';
import { getCurrentRoute } from "../router.js";
export { renderGeneralGlossaryController, techPageController }

// Controlador crear técnica
async function techPageController() {
  const currentRoute = getCurrentRoute();

  
  const routeProcessed = processUrl(currentRoute);
  
  // Obtener los datos en base a la ruta
  const dataTech = await fetchTech(routeProcessed);
  const dataAbility = await fetchAbilitys(routeProcessed);
  
  //Renderizar la página
  return renderPage(dataTech, dataAbility);
}

function processUrl(currentRoute){
    const sinHash = currentRoute.replace(/^#/, '');
    const decodificada = decodeURI(sinHash);
    return decodificada.split('/');
}

// Controlador crear glosario aldeas
async function renderGeneralGlossaryController() {
    const villages = await fetchVillages();

    return renderGeneralGlossary(villages); 
}