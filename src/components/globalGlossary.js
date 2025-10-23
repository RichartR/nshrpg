
export { renderGeneralGlossary }
import "../css/glossaryGeneral.scss";

function renderGeneralGlossary(villages){
   
    if (!Array.isArray(villages)) return '<p>No hay datos.</p>';

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
