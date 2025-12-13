import { describe, it, expect, beforeEach } from 'vitest';
import ContentCategoriesComponent from '../../components/contentCategoriesGlossary/contentCategoriesGlossary.js';

// Register custom element
if (!customElements.get('content-categories-test')) {
  customElements.define('content-categories-test', ContentCategoriesComponent);
}

describe('ContentCategoriesComponent', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('content-categories-test');
    document.body.appendChild(component);
  });

  it('debe crear una instancia del componente', () => {
    expect(component).toBeInstanceOf(ContentCategoriesComponent);
  });

  it('debe inicializarse con arrays vacíos y categoryImage', () => {
    expect(component.contentData).toEqual([]);
    expect(component.routeProcessed).toEqual([]);
    expect(component.categoryImage).toBe('');
  });

  it('debe procesar el nombre de la categoría correctamente', () => {
    const name = 'test-category';
    const processed = component.processName(name);
    expect(processed).toBe('test category');
  });

  it('debe procesar el nombre de la categoría con múltiples guiones', () => {
    const name = 'my-test-category';
    const processed = component.processName(name);
    expect(processed).toBe('my test category');
  });

  it('debe crear un wrapper con la clase correcta', () => {
    const wrapper = component.createContentWrapper();
    expect(wrapper.classList.contains('wrapper-glossary-general')).toBe(true);
  });

  it('debe crear un contenedor grid con la clase correcta', () => {
    const container = component.createContentGridContainer();
    expect(container.classList.contains('grid-container-general')).toBe(true);
  });

  it('debe crear un item de contenido general con la estructura correcta', () => {
    component.categoryImage = 'test.jpg';
    const routeProcessed = ['KN', 'ninjutsu'];
    const item = component.createGeneralContentItem(routeProcessed);

    expect(item.className).toBe('grid-item-general');
    const link = item.querySelector('a');
    expect(link.getAttribute('href')).toBe('#KN/ninjutsu/tech/generales');
  });

  it('debe crear un grid item de contenido con los datos correctos', () => {
    const content = {
      affiliation_abbr: 'KN',
      category_name: 'ninjutsu',
      technique_name: 'Rasengan',
      japanese_name: 'らせんがん',
      image_url: 'test.jpg',
      affiliation_name: 'Konoha'
    };

    const item = component.createContentGridItem(content);
    expect(item.className).toBe('grid-item-general');

    const link = item.querySelector('a');
    expect(link.getAttribute('href')).toBe('#KN/ninjutsu/tech/Rasengan');

    const nameDiv = item.querySelector('.village-name-general');
    expect(nameDiv.textContent).toBe('らせんがん - Rasengan');
  });

  it('debe renderizar el contenido cuando se proporcionan datos', async () => {
    const contentData = [
      {
        affiliation_abbr: 'KN',
        category_name: 'ninjutsu',
        technique_name: 'Rasengan',
        japanese_name: 'らせんがん',
        image_url: 'test.jpg',
        affiliation_name: 'Konoha'
      }
    ];
    const routeProcessed = ['KN', 'ninjutsu'];

    await component.setContentData(contentData, routeProcessed);

    const gridItems = component.querySelectorAll('.grid-item-general');
    // 1 general item + 1 content item
    expect(gridItems.length).toBe(2);
  });

  it('debe manejar datos de contenido vacíos', async () => {
    const routeProcessed = ['KN', 'ninjutsu'];
    await component.setContentData([], routeProcessed);

    const gridItems = component.querySelectorAll('.grid-item-general');
    // Only general item
    expect(gridItems.length).toBe(1);
  });
});
