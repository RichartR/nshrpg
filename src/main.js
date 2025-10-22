import { renderHeader } from './components/header';
import { router } from './router';

document.addEventListener('DOMContentLoaded', () => {
  
  const app = document.querySelector('#app');
  const header = document.querySelector('#header');
  const footer = document.querySelector('#footer');

  renderHeader().then(data => header.innerHTML = data);

  router(window.location.hash, app);
  window.addEventListener("hashchange", () =>{
    router(window.location.hash, app);
  });
})



