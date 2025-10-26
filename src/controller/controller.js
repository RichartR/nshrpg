import { renderGeneralGlossary } from "../components/globalGlossary.js";
import { renderPage } from "../components/technique.js";
import { fetchTech, fetchAbilitys, fetchMenuData, fetchVillageData, fetchVillages, fetchContentCategories } from '../services/supabase.js';
import { renderVillageGlossary } from "../components/villageGlossary.js";
import { getCurrentRoute } from "../router.js";
import { renderHeader } from "../components/header.js";
import { renderContentCategoriesGlossary } from "../components/contentCategoriesGlossary.js";
export { renderGeneralGlossaryController, techPageController, renderVillageGlossaryController, renderHeaderDataController, renderContentCategoriesController, processUrl };

// Controlador crear técnica
async function techPageController() {
  const currentRoute = getCurrentRoute();
  const routeProcessed = processUrl(currentRoute);  
  
  // Obtener los datos en base a la ruta
  const dataTech = await fetchTech(routeProcessed);
  console.log(dataTech);
  
  const dataAbility = await fetchAbilitys(routeProcessed);
  console.log(dataAbility);
  
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

// Controlador glosario de una aldea en concreto
async function renderVillageGlossaryController() {
    const currentRoute = getCurrentRoute();
    const routeProcessed = processUrl(currentRoute);

    const villageData = await fetchVillageData(routeProcessed);

    return renderVillageGlossary(villageData); 
}

async function renderHeaderDataController(){
    const menuData = await fetchMenuData();    

    return renderHeader(menuData);
}

async function renderContentCategoriesController(){
    
    const currentRoute = getCurrentRoute();
    const routeProcessed = processUrl(currentRoute);

    const contentData = await fetchContentCategories(routeProcessed);       

    return renderContentCategoriesGlossary(contentData, routeProcessed);
}