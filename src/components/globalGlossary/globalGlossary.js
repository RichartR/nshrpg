import "../../css/glossaryGeneral.scss";

class GlobalGlossaryComponent extends HTMLElement {
  constructor() {
    super();
    this.villages = [];
  }

  setVillages(villages) {
    this.villages = villages;
    this.render();
  }

  render() {
    if (!Array.isArray(this.villages) || this.villages.length === 0) {
      this.innerHTML = '';
      return;
    }

    const wrapper = this.createGeneralWrapper();
    const container = this.createGeneralGridContainer();

    this.villages.forEach(village => {
      const gridItem = this.createGeneralGridItem(village);
      container.appendChild(gridItem);
    });

    wrapper.appendChild(container);
    this.innerHTML = '';
    this.appendChild(wrapper);
  }

  createGeneralWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper-glossary-general');
    return wrapper;
  }

  createGeneralGridContainer() {
    const container = document.createElement('div');
    container.classList.add('grid-container-general');
    return container;
  }

  createGeneralGridItem(village) {
    
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
}

export default GlobalGlossaryComponent;