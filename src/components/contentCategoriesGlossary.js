
export { renderContentCategoriesGlossary }
import "../css/glossaryGeneral.scss";

function renderContentCategoriesGlossary(contentData, routeProcessed){
   
    if (!Array.isArray(contentData)) return wrapper;

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper-glossary-general');

    const container = document.createElement('div');
    container.classList.add('grid-container-general');

    const generalContent = document.createElement('div');
    generalContent.className = 'grid-item-general';
    generalContent.innerHTML = `
            <a href="#${routeProcessed[0] + "/" + routeProcessed[1] + "/tech/generales"}" class="village-link-general">
                <img src="" alt="Técnicas Generales ${routeProcessed[1]}">
                <div class="village-name-general">${processName(routeProcessed[1])}</div>
            </a>
        `;  

    container.appendChild(generalContent);
  
    contentData.forEach(content => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item-general';
        
        gridItem.innerHTML = `
            <a href="#${content.affiliation_abbr}/${content.category_name}/tech/${content.technique_name}" class="village-link-general">
                <img src="${content.image_url}" alt="${content.affiliation_name}">
                <div class="village-name-general">${content.japanese_name} - ${content.technique_name}</div>
            </a>
        `;       
        
        container.appendChild(gridItem);
    });

    wrapper.appendChild(container);
    return wrapper;
}

function processName(name) {
    const words = name.split('-');
    
    return words.join(' ');
}

