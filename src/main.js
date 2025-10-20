import { renderHeader } from './components/header';
import { router } from './router';
export { renderTech };
import "./css/card.scss";


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

function renderTech(data) {
  if (!Array.isArray(data)) return '<p>No hay datos.</p>';

  console.log(data)
  const wrapper = document.createElement('div');

         wrapper.innerHTML = Object.values(data).map(tech => `
            <div class="card">
                <div class="title">${tech.technique_name} - ${tech.japanese_name}</div>
                <div class="tech-type">${tech.category_type}</div>
                <div class="tech-info">
                    <div class="info">${tech.rank_name}</div>
                    <div class="info">${tech.type_name}</div>
                    <div class="info">${tech.style}</div>
                    <div class="info">${tech.range_description}</div>
                    <div class="info">${tech.chakra_cost}</div>
                    <div class="info">Requisitos: ${tech.requirements}</div>
                </div>
                <div class="tech-effect">
                <div class="tech-image" style="background-image: url('${tech.image_url}')"></div>
                <div class="effect">${tech.description}</div>
                <div class="effect"><b><span class="destacado">Efecto:</span> </b>${tech.effects}</div>
                <div class="effect"><b><span class="destacado">Aclaraciones:</span> </b><br>${tech.clarifications}</div>
                </div>
                
            </div>
        `).join('');
        
        return wrapper;
  
  
  /* return data.map(tech => `
    <div class="card">
      <div class="title">${tech.technique_name || 'Sin nombre'}</div>
      <div class="tech-type">${tech.category_type || ''}</div>
      <!-- Asegúrate de que tech.info existe -->
      <div class="tech-info">
        <div class="info">${tech.info?.rank || ''}</div>
        <div class="info">${tech.info?.type || ''}</div>
        <div class="info">${tech.info?.style || ''}</div>
        <div class="info">${tech.info?.alcance || ''}</div>
        <div class="info">${tech.info?.charka || ''}</div>
        <div class="info">Requisitos: ${tech.info?.reqs || ''}</div>
      </div>
      <div class="tech-effect">
        <div class="tech-image" style="background-image: url('${tech.image || ''}')"></div>
        <div class="effect">${tech.descripcion || ''}</div>
        <div class="effect"><b>Efecto:</b> ${tech.efecto || ''}</div>
        <div class="effect"><b>Aclaraciones:</b> ${tech.aclaraciones || ''}</div>
      </div>
    </div>
  `).join(''); */
}

/*

import { renderHeader } from './components/header';
import { router } from './router';
import { fetchTech } from './services/supabase.js';
export { renderTech };


document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  const header = document.querySelector('#header');

  renderHeader().then(data => {
    header.innerHTML = data;
  });

  // ✅ Llama al router (es async, pero no necesitas await si no haces nada después)
  router(window.location.hash, app);

  window.addEventListener('hashchange', () => {
    router(window.location.hash, app);
  });
});

function renderTech(data){
  
  console.log(data);
  const wrapper = document.getElementById("wrapper");

         wrapper.innerHTML = Object.values(data).map(tech => `
            <div class="card">
                <div class="title">${tech.technique_name}</div>
                
            </div>
        `).join('');
        
        return wrapper;
}



*/