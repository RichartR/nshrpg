export { techPage };
import "../css/card.scss";
import { fetchTech, fetchAbilitys } from '../services/supabase.js';
import { getCurrentRoute } from "../router.js";

async function techPage() {
  console.log('Ruta actual para API:', getCurrentRoute());
  const currentRoute = getCurrentRoute();

  const routeProcessed = processUrl(currentRoute);
  console.log(routeProcessed);
  
  // Aquí puedes usar currentRoute para modificar tu petición
  const dataTech = await fetchTech(routeProcessed);
  /* TODO: Comprobar porqué se muestra el inuzuka en todos lados*/
  const dataAbility = await fetchAbilitys(routeProcessed);
  
  return renderPage(dataTech, dataAbility);
}

function processUrl(currentRoute){
    const sinHash = currentRoute.replace(/^#/, '');
    const decodificada = decodeURI(sinHash);
    return decodificada.split('/');
}

function renderPage(dataTech, dataAbility) {
  if (!Array.isArray(dataTech)) return '<p>No hay datos.</p>';

  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');  

  wrapper.innerHTML = Object.values(dataAbility).map(ability => `
    <div class="card">
        <div class="title-ability">${ability.category_name}</div>
        <div class="ability-effect">
            <div class="ability-image" style="background-image: url('${ability.image_url}')"></div>
            <div class="effect">${ability.description}</div>
            <div class="effect">${ability.stats}</div>
            <div class="effect"><b><span class="destacado">Características:</span> </b><br>
            - ${ability.abilities.map(a => a)}</div>
        </div>
    </div>
  `)

         wrapper.innerHTML += Object.values(dataTech).map(tech => `
            <div class="card">
                <div class="title">${tech.technique_name} - ${tech.japanese_name}</div>
                <div class="tech-type">${tech.type_name}</div>
                <div class="tech-info">
                    <div class="info">${tech.rank_name}</div>
                    <div class="info">${tech.jutsu_classifications}</div>
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
}