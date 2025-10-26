export { renderVillageGlossary };
import "../css/villageGlossary.scss";

function renderVillageGlossary(villageData) {
    if (!Array.isArray(villageData) || villageData.length === 0) {
        return document.createElement('div');
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper-village');
    
    // Cabecera
    const headerBox = document.createElement('div');
    headerBox.classList.add('main-box-village');
    headerBox.textContent = villageData[0].affiliation_name;
    headerBox.style.backgroundImage = `url('${villageData[0].affiliation_image_glossary_url}')`;
    wrapper.appendChild(headerBox);
    
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container-village');

    // Filtrar categorías duplicadas
    const categoriasUnicas = new Map();
    const itemsSinCategoria = [];

    villageData.forEach(item => {
        if (item.category_name) {
            // Usar Map para evitar duplicados por category_name
            if (!categoriasUnicas.has(item.category_name)) {
                categoriasUnicas.set(item.category_name, item);
            }
        } else {
            // Para items sin categoría, agregar solo uno
            if (itemsSinCategoria.length === 0) {
                itemsSinCategoria.push(item);
            }
        }
    });

    // Procesar categorías únicas
    categoriasUnicas.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item-village');
        
        const link = document.createElement('a');
        link.href = "#" + item.affiliation_abbr + "/" + item.category_name;
        link.style.backgroundImage = `url('${item.category_image_url}')`;
        
        const span = document.createElement('span');
        span.textContent = item.category_name;
        
        link.appendChild(span);
        gridItem.appendChild(link);
        gridContainer.appendChild(gridItem);
    });

    // Procesar items sin categoría (solo una vez)
    itemsSinCategoria.forEach(item => {
        // Div para Técnicas Generales
        const gridItemTecnicas = document.createElement('div');
        gridItemTecnicas.classList.add('grid-item-village');
        
        const linkTecnicas = document.createElement('a');
        linkTecnicas.href = "#" + item.affiliation_abbr + "/tecnicas-generales";
        linkTecnicas.style.backgroundImage = `url('${item.category_image_url}')`;
        
        const spanTecnicas = document.createElement('span');
        spanTecnicas.textContent = 'Técnicas Generales';
        
        linkTecnicas.appendChild(spanTecnicas);
        gridItemTecnicas.appendChild(linkTecnicas);
        gridContainer.appendChild(gridItemTecnicas);

        // Div para Material Limitado
        const gridItemMaterial = document.createElement('div');
        gridItemMaterial.classList.add('grid-item-village');
        
        const linkMaterial = document.createElement('a');
        linkMaterial.href = "#" + item.affiliation_abbr + "/material-limitado";
        linkMaterial.style.backgroundImage = `url('${item.category_image_url}')`;
        
        const spanMaterial = document.createElement('span');
        spanMaterial.textContent = 'Material Limitado';
        
        linkMaterial.appendChild(spanMaterial);
        gridItemMaterial.appendChild(linkMaterial);
        gridContainer.appendChild(gridItemMaterial);
    });

    wrapper.appendChild(gridContainer);
    return wrapper;
}