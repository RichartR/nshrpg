export { renderVillageGlossary };
import "../css/villageGlossary.scss";

function renderVillageGlossary(villageData) {
    if (!Array.isArray(villageData) || villageData.length === 0) {
        return document.createElement('div'); // o maneja el error
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper-village');
    
    // Encabezado (afiliación)
    const headerBox = document.createElement('div');
    headerBox.classList.add('main-box-village');
    headerBox.textContent = villageData[0].affiliation_name;
    headerBox.style.backgroundImage = `url('${villageData[0].affiliation_image_glossary_url}')`;
    wrapper.appendChild(headerBox);
    
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container-village');

    villageData.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item-village');
        
        const link = document.createElement('a');
        link.href = item.category_name;
        link.style.backgroundImage = `url('${item.category_image_url}')`;
        
        const span = document.createElement('span');
        span.textContent = item.category_name ?? 'Técnicas Generales';
        
        link.appendChild(span);
        gridItem.appendChild(link);
        gridContainer.appendChild(gridItem);
    });

    wrapper.appendChild(gridContainer);
    return wrapper;
}