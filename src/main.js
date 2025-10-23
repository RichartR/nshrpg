import { router } from './router';
import { renderHeader } from './components/header';
import { renderFooter } from './components/footer';

document.addEventListener('DOMContentLoaded', () => {
  
  const app = document.querySelector('#app');
  const header = document.querySelector('#header');
  const footer = document.querySelector('#footer');

  // Revisar para mover la lógica del fetch a un controler
  renderHeader().then(data => header.innerHTML = data);

  footer.appendChild(renderFooter());

  router(window.location.hash, app);
  window.addEventListener("hashchange", () =>{
    router(window.location.hash, app);
  });
})



