import { router } from './router';
import { fetchMenuData } from './services/supabase.js';

import HeaderComponent from './components/header/header.js';
import FooterComponent from './components/footer/footer.js';
import WelcomeComponent from './components/welcome/welcome.js';
import GlobalGlossaryComponent from './components/globalGlossary/globalGlossary.js';
import VillageGlossaryComponent from './components/villageGlossary/villageGlossary.js';
import ContentCategoriesComponent from './components/contentCategoriesGlossary/contentCategoriesGlossary.js';
import TechniquePageComponent from './components/technique/technique.js';
import AuthComponent from './components/auth/auth.js';
import ContentComponent from './components/content/content.js';
import ContentAffiliationsComponent from './components/contentAffiliations/contentAffiliations.js';
import ContentCategoriesManagementComponent from './components/contentCategories/contentCategories.js';
import ContentSubcategoriesComponent from './components/contentSubcategories/contentSubcategories.js';
import ContentAffiliationsEditComponent from './components/contentAffiliationsEdit/contentAffiliationsEdit.js';
import ContentCategoriesEditComponent from './components/contentCategoriesEdit/contentCategoriesEdit.js';
import ContentSubcategoriesEditComponent from './components/contentSubcategoriesEdit/contentSubcategoriesEdit.js';

customElements.define('header-component', HeaderComponent);
customElements.define('footer-component', FooterComponent);
customElements.define('welcome-component', WelcomeComponent);
customElements.define('global-glossary', GlobalGlossaryComponent);
customElements.define('village-glossary', VillageGlossaryComponent);
customElements.define('content-categories', ContentCategoriesComponent);
customElements.define('technique-page', TechniquePageComponent);
customElements.define('auth-component', AuthComponent);
customElements.define('content-component', ContentComponent);
customElements.define('content-affiliations', ContentAffiliationsComponent);
customElements.define('content-categories-management', ContentCategoriesManagementComponent);
customElements.define('content-subcategories', ContentSubcategoriesComponent);
customElements.define('content-affiliations-edit', ContentAffiliationsEditComponent);
customElements.define('content-categories-edit', ContentCategoriesEditComponent);
customElements.define('content-subcategories-edit', ContentSubcategoriesEditComponent);

document.addEventListener('DOMContentLoaded', async () => {
  const app = document.querySelector('#app');
  const header = document.querySelector('#header');
  const footer = document.querySelector('#footer');

  const menuData = await fetchMenuData();
  const headerComponent = document.createElement('header-component');
  await headerComponent.setMenuData(menuData);
  header.innerHTML = '';
  header.appendChild(headerComponent);

  const footerComponent = document.createElement('footer-component');
  footer.innerHTML = '';
  footer.appendChild(footerComponent);

  router(window.location.hash, app);
  window.addEventListener("hashchange", () => {
    router(window.location.hash, app);
  });
})



