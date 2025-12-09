import { router } from './router';
import { fetchMenuData } from './services/supabase.js';

import HeaderComponent from './components/header/header.js';
import FooterComponent from './components/footer/footer.js';
import GlobalGlossaryComponent from './components/globalGlossary/globalGlossary.js';
import VillageGlossaryComponent from './components/villageGlossary/villageGlossary.js';
import ContentCategoriesComponent from './components/contentCategoriesGlossary/contentCategoriesGlossary.js';
import TechniquePageComponent from './components/technique/technique.js';
import AuthComponent from './components/auth/auth.js';

customElements.define('header-component', HeaderComponent);
customElements.define('footer-component', FooterComponent);
customElements.define('global-glossary', GlobalGlossaryComponent);
customElements.define('village-glossary', VillageGlossaryComponent);
customElements.define('content-categories', ContentCategoriesComponent);
customElements.define('technique-page', TechniquePageComponent);
customElements.define('auth-component', AuthComponent);

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



