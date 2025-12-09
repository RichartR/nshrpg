export { renderContentCategoriesGlossary };
import "../css/glossaryGeneral.scss";

function renderContentCategoriesGlossary(contentData, routeProcessed) {
    if (!Array.isArray(contentData) || contentData.length === 0) {
        return document.createElement('div');
    }

    const wrapper = createContentWrapper();
    const container = createContentGridContainer();
    
    const generalContent = createGeneralContentItem(routeProcessed);
    container.appendChild(generalContent);
  
    contentData.forEach(content => {
        const gridItem = createContentGridItem(content, routeProcessed);
        container.appendChild(gridItem);
    });

    wrapper.appendChild(container);
    return wrapper;
}

function createContentWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper-glossary-general');
    return wrapper;
}

function createContentGridContainer() {
    const container = document.createElement('div');
    container.classList.add('grid-container-general');
    return container;
}

function createGeneralContentItem(routeProcessed) {
    const generalContent = document.createElement('div');
    generalContent.className = 'grid-item-general';
    
    const link = document.createElement('a');
    link.href = `#${routeProcessed[0]}/${routeProcessed[1]}/tech/generales`;
    link.className = 'village-link-general';
    
    const image = document.createElement('img');
    image.src = '';
    image.alt = `Técnicas Generales ${routeProcessed[1]}`;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'village-name-general';
    nameDiv.textContent = processName(routeProcessed[1]);
    
    link.appendChild(image);
    link.appendChild(nameDiv);
    generalContent.appendChild(link);
    
    return generalContent;
}

function createContentGridItem(content) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item-general';
    
    const link = document.createElement('a');
    link.href = `#${content.affiliation_abbr}/${content.category_name}/tech/${content.technique_name}`;
    link.className = 'village-link-general';
    
    const image = document.createElement('img');
    image.src = content.image_url;
    image.alt = content.affiliation_name;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'village-name-general';
    nameDiv.textContent = `${content.japanese_name} - ${content.technique_name}`;
    
    link.appendChild(image);
    link.appendChild(nameDiv);
    gridItem.appendChild(link);
    
    return gridItem;
}

function processName(name) {
    const words = name.split('-');
    return words.join(' ');
}