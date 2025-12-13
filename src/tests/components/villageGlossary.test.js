import { describe, it, expect, beforeEach } from 'vitest';
import VillageGlossaryComponent from '../../components/villageGlossary/villageGlossary.js';

// Register custom element
if (!customElements.get('village-glossary')) {
  customElements.define('village-glossary', VillageGlossaryComponent);
}

describe('VillageGlossaryComponent', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('village-glossary');
    document.body.appendChild(component);
  });

  it('debe crear una instancia del componente', () => {
    expect(component).toBeInstanceOf(VillageGlossaryComponent);
  });

  it('debe inicializarse con un array de villageData vacío', () => {
    expect(component.villageData).toEqual([]);
  });

  it('debe establecer los datos del village', () => {
    const testData = [
      {
        affiliation_name: 'Konoha',
        affiliation_abbr: 'KN',
        affiliation_image_glossary_url: 'test.jpg',
        category_name: 'Ninjutsu',
        category_image_url: 'cat.jpg'
      }
    ];
    component.setVillageData(testData);
    expect(component.villageData).toEqual(testData);
  });

  it('debe renderizar la cabecera del village', () => {
    const testData = [
      {
        affiliation_name: 'Konoha',
        affiliation_abbr: 'KN',
        affiliation_image_glossary_url: 'test.jpg',
        category_name: 'Ninjutsu',
        category_image_url: 'cat.jpg'
      }
    ];
    component.setVillageData(testData);

    const header = component.querySelector('.main-box-village');
    expect(header).toBeTruthy();
  });

  it('debe mostrar el nombre del village en la cabecera', () => {
    const testData = [
      {
        affiliation_name: 'Konoha',
        affiliation_abbr: 'KN',
        affiliation_image_glossary_url: 'test.jpg',
        category_name: 'Ninjutsu',
        category_image_url: 'cat.jpg'
      }
    ];
    component.setVillageData(testData);

    const headerText = component.querySelector('.village-header-text');
    expect(headerText.textContent).toBe('Konoha');
  });

  it('debe procesar las categorías correctamente', () => {
    const testData = [
      { category_name: 'Ninjutsu', affiliation_abbr: 'KN', category_image_url: 'cat1.jpg' },
      { category_name: 'Ninjutsu', affiliation_abbr: 'KN', category_image_url: 'cat1.jpg' },
      { category_name: 'Genjutsu', affiliation_abbr: 'KN', category_image_url: 'cat2.jpg' }
    ];

    const { uniqueCategories } = component.processCategories(testData);
    expect(uniqueCategories.size).toBe(2);
    expect(uniqueCategories.has('Ninjutsu')).toBe(true);
    expect(uniqueCategories.has('Genjutsu')).toBe(true);
  });

  it('debe crear grid items para cada categoría única', () => {
    const testData = [
      {
        affiliation_name: 'Konoha',
        affiliation_abbr: 'KN',
        affiliation_image_glossary_url: 'test.jpg',
        category_name: 'Ninjutsu',
        category_image_url: 'cat.jpg'
      },
      {
        affiliation_name: 'Konoha',
        affiliation_abbr: 'KN',
        affiliation_image_glossary_url: 'test.jpg',
        category_name: 'Genjutsu',
        category_image_url: 'cat2.jpg'
      }
    ];
    component.setVillageData(testData);

    const gridItems = component.querySelectorAll('.grid-item-village');
    expect(gridItems.length).toBe(2);
  });

  it('debe crear links de categoría con el href correcto', () => {
    const testData = [
      {
        affiliation_name: 'Konoha',
        affiliation_abbr: 'KN',
        affiliation_image_glossary_url: 'test.jpg',
        category_name: 'Ninjutsu',
        category_image_url: 'cat.jpg'
      }
    ];
    component.setVillageData(testData);

    const link = component.querySelector('.grid-item-village a');
    expect(link.getAttribute('href')).toBe('#KN/Ninjutsu');
  });

  it('no debe renderizar cuando villageData está vacío', () => {
    component.setVillageData([]);
    expect(component.innerHTML).toBe('');
  });
});
