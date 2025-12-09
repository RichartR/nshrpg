export { renderVillageGlossary };
import "../css/villageGlossary.scss";

function renderVillageGlossary(villageData) {
    if (!Array.isArray(villageData) || villageData.length === 0) {
        return document.createElement('div');
    }

    const wrapper = createWrapper();
    
    // Cabecera
    const headerBox = createVillageHeader(villageData);
    wrapper.appendChild(headerBox);
    
    const gridContainer = createGridContainer();
    const { uniqueCategories, noCategoryItems } = processCategories(villageData);

    // Procesar categorías únicas
    uniqueCategories.forEach(item => {
        const gridItem = createCategoryGridItem(item);
        gridContainer.appendChild(gridItem);
    });

    // Procesar items sin categoría (solo una vez)
    if (noCategoryItems.length > 0) {
        const specialItems = createSpecialGridItems(noCategoryItems[0]);
        specialItems.forEach(item => gridContainer.appendChild(item));
    }

    wrapper.appendChild(gridContainer);
    return wrapper;
}

function createWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper-village');
    return wrapper;
}

function createVillageHeader(villageData) {
    const headerBox = document.createElement('div');
    headerBox.classList.add('main-box-village');
    headerBox.textContent = villageData[0].affiliation_name;
    headerBox.style.backgroundImage = `url('${villageData[0].affiliation_image_glossary_url}')`;
    return headerBox;
}

function createGridContainer() {
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container-village');
    return gridContainer;
}

function processCategories(villageData) {
    const uniqueCategories = new Map();
    const noCategoryItems = [];

    villageData.forEach(item => {
        if (item.category_name) {
            if (!uniqueCategories.has(item.category_name)) {
                uniqueCategories.set(item.category_name, item);
            }
        } else {
            if (noCategoryItems.length === 0) {
                noCategoryItems.push(item);
            }
        }
    });

    return { uniqueCategories, noCategoryItems };
}

function createCategoryGridItem(item) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item-village');
    
    const link = document.createElement('a');
    link.href = "#" + item.affiliation_abbr + "/" + item.category_name;
    link.style.backgroundImage = `url('${item.category_image_url}')`;
    
    const span = document.createElement('span');
    span.textContent = item.category_name;
    
    link.appendChild(span);
    gridItem.appendChild(link);
    return gridItem;
}

function createSpecialGridItems(item) {
    const gridItems = [];
    
    // Técnicas Generales
    const gridItemTecnicas = document.createElement('div');
    gridItemTecnicas.classList.add('grid-item-village');
    
    const linkTecnicas = document.createElement('a');
    linkTecnicas.href = "#" + item.affiliation_abbr + "/tecnicas-generales";
    linkTecnicas.style.backgroundImage = `url('${item.category_image_url}')`;
    
    const spanTecnicas = document.createElement('span');
    spanTecnicas.textContent = 'Técnicas Generales';
    
    linkTecnicas.appendChild(spanTecnicas);
    gridItemTecnicas.appendChild(linkTecnicas);
    gridItems.push(gridItemTecnicas);

    // Material Limitado
    const gridItemMaterial = document.createElement('div');
    gridItemMaterial.classList.add('grid-item-village');
    
    const linkMaterial = document.createElement('a');
    linkMaterial.href = "#" + item.affiliation_abbr + "/material-limitado";
    linkMaterial.style.backgroundImage = `url('${item.category_image_url}')`;
    
    const spanMaterial = document.createElement('span');
    spanMaterial.textContent = 'Material Limitado';
    
    linkMaterial.appendChild(spanMaterial);
    gridItemMaterial.appendChild(linkMaterial);
    gridItems.push(gridItemMaterial);

    return gridItems;
}