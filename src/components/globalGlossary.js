
export { renderGeneralGlossary }
import "../css/glossaryGeneral.scss";

function renderGeneralGlossary(villages){
    if (!Array.isArray(villages)) return wrapper;

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper-glossary-general');

    const container = document.createElement('div');
    container.classList.add('grid-container-general');
  
    villages.forEach(village => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item-general';
        
        gridItem.innerHTML = `
            <a href="#${village.abbreviation}" class="village-link-general">
                <img src="${village.image_url}" alt="${village.affiliation_name}">
                <div class="village-name-general">${village.affiliation_name}</div>
            </a>
        `;       
        
        container.appendChild(gridItem);
    });

    wrapper.appendChild(container);
    return wrapper;
}
