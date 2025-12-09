import { fetchTech, fetchAbilitys, fetchVillageData, fetchVillages, fetchContentCategories } from './services/supabase.js';
export { router, getCurrentRoute };

let currentRoute = "";

async function router(route, container) {
  currentRoute = route;

  try {
    const component = await routeToComponent(route);
    container.replaceChildren(component);
  } catch (error) {
    console.error('Error en la ruta:', error);
    container.innerHTML = `<p>Error 404</p>`;
  }
}

function getCurrentRoute() {
  return currentRoute;
}

async function routeToComponent(route) {
  const processedUrl = processUrl(route);

  if (route === '' || route === '/#') {
    return await createTechniquePage(processedUrl);
  }

  if (route === '#Glosario') {
    return await createGlobalGlossary();
  }

  if (route === '#login') {
    return createAuthComponent('login');
  }

  if (route === '#register') {
    return createAuthComponent('register');
  }

  if (processedUrl.length === 1) {
    return await createVillageGlossary(processedUrl);
  }

  if (processedUrl.length === 2) {
    return await createContentCategories(processedUrl);
  }

  if (processedUrl.length === 3 || processedUrl.length === 4) {
    return await createTechniquePage(processedUrl);
  }

  return document.createElement('div');
}

function processUrl(currentRoute) {
  const sinHash = currentRoute.replace(/^#/, '');
  const decodificada = decodeURI(sinHash);
  return decodificada.split('/');
}

function createAuthComponent(mode = 'login') {
  const component = document.createElement('auth-component');
  component.setMode(mode);
  return component;
}

async function createTechniquePage(routeProcessed) {
  const dataTech = await fetchTech(routeProcessed);
  console.log(routeProcessed);

  const dataAbility = await fetchAbilitys(routeProcessed);

  const component = document.createElement('technique-page');

  if (routeProcessed[3] === 'generales') {
    component.setData(dataTech, dataAbility);
  } else {
    component.setData(dataTech, null);
  }

  return component;
}

async function createGlobalGlossary() {
  const villages = await fetchVillages();

  const component = document.createElement('global-glossary');
  component.setVillages(villages);

  return component;
}

async function createVillageGlossary(routeProcessed) {
  const villageData = await fetchVillageData(routeProcessed);

  const component = document.createElement('village-glossary');
  component.setVillageData(villageData);  

  return component;
}

async function createContentCategories(routeProcessed) {
  const contentData = await fetchContentCategories(routeProcessed);

  const component = document.createElement('content-categories');
  component.setContentData(contentData, routeProcessed);

  return component;
}
