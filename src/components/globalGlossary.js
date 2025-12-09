export { renderGeneralGlossary };
import "../css/glossaryGeneral.scss";

function renderGeneralGlossary(villages) {
    if (!Array.isArray(villages) || villages.length === 0) {
        return document.createElement('div');
    }

    const wrapper = createGeneralWrapper();
    const container = createGeneralGridContainer();
    
    villages.forEach(village => {
        const gridItem = createGeneralGridItem(village);
        container.appendChild(gridItem);
    });

    wrapper.appendChild(container);
    return wrapper;
}

function createGeneralWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper-glossary-general');
    return wrapper;
}

function createGeneralGridContainer() {
    const container = document.createElement('div');
    container.classList.add('grid-container-general');
    return container;
}

function createGeneralGridItem(village) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item-general';
    
    const link = document.createElement('a');
    link.href = `#${village.abbreviation}`;
    link.className = 'village-link-general';
    
    const image = document.createElement('img');
    image.src = village.image_url;
    image.alt = village.affiliation_name;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'village-name-general';
    nameDiv.textContent = village.affiliation_name;
    
    link.appendChild(image);
    link.appendChild(nameDiv);
    gridItem.appendChild(link);
    
    return gridItem;
}