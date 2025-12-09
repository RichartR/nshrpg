import "../../css/glossaryGeneral.scss";

class ContentCategoriesComponent extends HTMLElement {
  constructor() {
    super();
    this.contentData = [];
    this.routeProcessed = [];
  }

  setContentData(contentData, routeProcessed) {
    this.contentData = contentData;
    this.routeProcessed = routeProcessed;
    this.render();
  }

  render() {
    const wrapper = this.createContentWrapper();
    const container = this.createContentGridContainer();

    const generalContent = this.createGeneralContentItem(this.routeProcessed);
    container.appendChild(generalContent);

    if (Array.isArray(this.contentData) && this.contentData.length > 0) {
      this.contentData.forEach(content => {
        const gridItem = this.createContentGridItem(content);
        container.appendChild(gridItem);
      });
    }

    wrapper.appendChild(container);
    this.innerHTML = '';
    this.appendChild(wrapper);
  }

  createContentWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper-glossary-general');
    return wrapper;
  }

  createContentGridContainer() {
    const container = document.createElement('div');
    container.classList.add('grid-container-general');
    return container;
  }

  createGeneralContentItem(routeProcessed) {
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
    nameDiv.textContent = this.processName(routeProcessed[1]);

    link.appendChild(image);
    link.appendChild(nameDiv);
    generalContent.appendChild(link);

    return generalContent;
  }

  createContentGridItem(content) {
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

  processName(name) {
    const words = name.split('-');
    return words.join(' ');
  }
}

export default ContentCategoriesComponent;