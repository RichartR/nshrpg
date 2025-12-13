import { fetchTech, fetchAbilitys, fetchVillageData, fetchVillages, fetchContentCategories, getCurrentUser } from './services/supabase.js';
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
    return createWelcome();
  }

  if (route === '#Glosario') {
    return await createGlobalGlossary();
  }

  // Verificar permisos de administrador para rutas de Contenido
  if (route === '#Contenido' || route.startsWith('#Contenido/')) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      alert('Acceso denegado. Necesitas permisos de administrador.');
      window.location.hash = '#';
      return await createTechniquePage(processedUrl);
    }
  }

  if (route === '#Contenido') {
    return createContentComponent();
  }

  if (route === '#Contenido/afiliaciones') {
    return createContentAffiliations();
  }

  if (route === '#Contenido/categorias') {
    return createContentCategoriesManagement();
  }

  if (route === '#Contenido/subcategorias') {
    return createContentSubcategories();
  }

  if (route.startsWith('#Contenido/afiliaciones/editar/')) {
    const id = route.split('/')[3];
    return createContentAffiliationsEdit(id);
  }

  if (route.startsWith('#Contenido/categorias/editar/')) {
    const id = route.split('/')[3];
    return createContentCategoriesEdit(id);
  }

  if (route.startsWith('#Contenido/subcategorias/editar/')) {
    const id = route.split('/')[3];
    return createContentSubcategoriesEdit(id);
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

function createContentComponent() {
  const component = document.createElement('content-component');
  return component;
}

function createContentAffiliations() {
  const component = document.createElement('content-affiliations');
  return component;
}

function createContentCategoriesManagement() {
  const component = document.createElement('content-categories-management');
  return component;
}

function createContentSubcategories() {
  const component = document.createElement('content-subcategories');
  return component;
}

function createContentAffiliationsEdit(id) {
  const component = document.createElement('content-affiliations-edit');
  component.setAffiliationId(id);
  return component;
}

function createContentCategoriesEdit(id) {
  const component = document.createElement('content-categories-edit');
  component.setCategoryId(id);
  return component;
}

function createContentSubcategoriesEdit(id) {
  const component = document.createElement('content-subcategories-edit');
  component.setSubcategoryId(id);
  return component;
}

function createWelcome() {
  const component = document.createElement('welcome-component');
  return component;
}
