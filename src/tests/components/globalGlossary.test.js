import { describe, it, expect, beforeEach } from 'vitest';
import GlobalGlossaryComponent from '../../components/globalGlossary/globalGlossary.js';

// Register custom element
if (!customElements.get('global-glossary')) {
  customElements.define('global-glossary', GlobalGlossaryComponent);
}

describe('GlobalGlossaryComponent', () => {
  let component;

  beforeEach(() => {
    component = document.createElement('global-glossary');
    document.body.appendChild(component);
  });

  it('debe crear una instancia del componente', () => {
    expect(component).toBeInstanceOf(GlobalGlossaryComponent);
  });

  it('debe inicializarse con un array de villages vacío', () => {
    expect(component.villages).toEqual([]);
  });

  it('debe establecer los datos de villages', () => {
    const testVillages = [
      { abbreviation: 'KN', affiliation_name: 'Konoha', image_url: 'test.jpg' }
    ];
    component.setVillages(testVillages);
    expect(component.villages).toEqual(testVillages);
  });

  it('debe renderizar villages cuando se proporcionan datos', () => {
    const testVillages = [
      { abbreviation: 'KN', affiliation_name: 'Konoha', image_url: 'test.jpg' }
    ];
    component.setVillages(testVillages);

    const gridItems = component.querySelectorAll('.grid-item-general');
    expect(gridItems.length).toBe(1);
  });

  it('no debe renderizar cuando el array de villages está vacío', () => {
    component.setVillages([]);
    expect(component.innerHTML).toBe('');
  });

  it('debe crear un wrapper con la clase correcta', () => {
    const testVillages = [
      { abbreviation: 'KN', affiliation_name: 'Konoha', image_url: 'test.jpg' }
    ];
    component.setVillages(testVillages);

    const wrapper = component.querySelector('.wrapper-glossary-general');
    expect(wrapper).toBeTruthy();
  });

  it('debe crear un contenedor grid con la clase correcta', () => {
    const testVillages = [
      { abbreviation: 'KN', affiliation_name: 'Konoha', image_url: 'test.jpg' }
    ];
    component.setVillages(testVillages);

    const container = component.querySelector('.grid-container-general');
    expect(container).toBeTruthy();
  });

  it('debe crear links con el href correcto', () => {
    const testVillages = [
      { abbreviation: 'KN', affiliation_name: 'Konoha', image_url: 'test.jpg' }
    ];
    component.setVillages(testVillages);

    const link = component.querySelector('a');
    expect(link.getAttribute('href')).toBe('#KN');
  });

  it('debe mostrar el nombre del village', () => {
    const testVillages = [
      { abbreviation: 'KN', affiliation_name: 'Konoha', image_url: 'test.jpg' }
    ];
    component.setVillages(testVillages);

    const nameDiv = component.querySelector('.village-name-general');
    expect(nameDiv.textContent).toBe('Konoha');
  });
});
