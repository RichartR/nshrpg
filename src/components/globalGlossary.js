import { fetchVillages } from "../services/supabase";
export { renderGeneralGlossary }
import "../css/glossaryGeneral.scss";

async function renderGeneralGlossary(){
    const villages = await fetchVillages();

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper-glossary');

    const container = document.createElement('div');
    container.classList.add('grid-container');
  
    villages.forEach(village => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        
        gridItem.innerHTML = `
            <a href="${village.image_url}" class="village-link">
                <img src="${village.image_url}" alt="${village.affiliation_name}">
                <div class="village-name">${village.affiliation_name}</div>
            </a>
        `;       
        
        container.appendChild(gridItem);
    });

    wrapper.appendChild(container);
    return wrapper;
}
