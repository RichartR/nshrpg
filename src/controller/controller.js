import { fetchTech, fetchAbilitys, fetchMenuData, fetchVillageData, fetchVillages, fetchContentCategories } from '../services/supabase.js';
import { getCurrentRoute } from "../router.js";
export { renderGeneralGlossaryController, techPageController, renderVillageGlossaryController, renderHeaderDataController, renderContentCategoriesController, processUrl };

async function techPageController() {
  const currentRoute = getCurrentRoute();
  const routeProcessed = processUrl(currentRoute);

  const dataTech = await fetchTech(routeProcessed);
  console.log(routeProcessed);

  const dataAbility = await fetchAbilitys(routeProcessed);

  const component = document.createElement('technique-page');

  if(routeProcessed[3] === 'generales'){
    component.setData(dataTech, dataAbility);
  } else {
    component.setData(dataTech, null);
  }

  return component;
}

function processUrl(currentRoute){
    const sinHash = currentRoute.replace(/^#/, '');
    const decodificada = decodeURI(sinHash);
    return decodificada.split('/');
}

async function renderGeneralGlossaryController() {
    const villages = await fetchVillages();

    const component = document.createElement('global-glossary');
    component.setVillages(villages);

    return component;
}

async function renderVillageGlossaryController() {
    const currentRoute = getCurrentRoute();
    const routeProcessed = processUrl(currentRoute);

    const villageData = await fetchVillageData(routeProcessed);

    const component = document.createElement('village-glossary');
    component.setVillageData(villageData);

    return component;
}

async function renderHeaderDataController(){
    const menuData = await fetchMenuData();

    const component = document.createElement('header-component');
    await component.setMenuData(menuData);

    return component;
}

async function renderContentCategoriesController(){
    const currentRoute = getCurrentRoute();
    const routeProcessed = processUrl(currentRoute);

    const contentData = await fetchContentCategories(routeProcessed);

    const component = document.createElement('content-categories');
    component.setContentData(contentData, routeProcessed);

    return component;
}