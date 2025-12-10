import { fetchTech, fetchAbilitys, fetchMenuData, fetchVillageData, fetchVillages, fetchContentCategories, updateAffiliationStatus, updateCategoryStatus, updateSubcategoryStatus, fetchAffiliationById, updateAffiliation, fetchCategoryById, updateCategory, fetchSubcategoryById, updateSubcategory } from '../services/supabase.js';
import { getCurrentRoute } from "../router.js";
export { renderGeneralGlossaryController, techPageController, renderVillageGlossaryController, renderHeaderDataController, renderContentCategoriesController, toggleAffiliationController, toggleCategoryController, toggleSubcategoryController, updateAffiliationController, updateCategoryController, updateSubcategoryController, processUrl };

async function techPageController() {
  const currentRoute = getCurrentRoute();
  const routeProcessed = processUrl(currentRoute);

  const dataTech = await fetchTech(routeProcessed);

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

async function toggleAffiliationController(affiliationId, newStatus) {
  const result = await updateAffiliationStatus(affiliationId, newStatus);
  return result;
}

async function toggleCategoryController(categoryId, newStatus) {
  const result = await updateCategoryStatus(categoryId, newStatus);
  return result;
}

async function toggleSubcategoryController(subcategoryId, newStatus) {
  const result = await updateSubcategoryStatus(subcategoryId, newStatus);
  return result;
}

async function updateAffiliationController(affiliationId, updates) {
  const result = await updateAffiliation(affiliationId, updates);
  return result;
}

async function updateCategoryController(categoryId, updates) {
  const result = await updateCategory(categoryId, updates);
  return result;
}

async function updateSubcategoryController(subcategoryId, updates) {
  const result = await updateSubcategory(subcategoryId, updates);
  return result;
}