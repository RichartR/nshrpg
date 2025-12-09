import "../../css/content.scss";
import { fetchVillages, toggleVillageVisibility } from "../../services/supabase.js";

class ContentComponent extends HTMLElement {
  constructor() {
    super();
    this.villages = [];
  }

  async connectedCallback() {
    await this.loadVillages();
    this.render();
    this.setupEventListeners();
  }

  async loadVillages() {
    this.villages = await fetchVillages();
  }

  render() {
    this.innerHTML = `
      <div class="content-container">
        <div class="content-header">
          <h1>Gestión de Contenido</h1>
          <p>Administra la visibilidad de las aldeas en el glosario</p>
        </div>

        <div class="villages-grid">
          ${this.villages.map(village => this.createVillageCard(village)).join('')}
        </div>
      </div>
    `;
  }

  createVillageCard(village) {
    const isVisible = village.is_visible !== false; // Por defecto visible si no existe el campo
    const statusClass = isVisible ? 'visible' : 'hidden';
    const buttonText = isVisible ? 'Ocultar' : 'Mostrar';
    const buttonClass = isVisible ? 'btn-hide' : 'btn-show';

    return `
      <div class="village-card ${statusClass}" data-village-id="${village.id}">
        <div class="village-image" style="background-image: url('${village.image_url}')">
          <div class="village-status">
            <span class="status-badge ${statusClass}">
              ${isVisible ? 'Visible' : 'Oculto'}
            </span>
          </div>
        </div>
        <div class="village-info">
          <h3 class="village-name">${village.affiliation_name}</h3>
          <p class="village-abbr">${village.abbreviation}</p>
          <button class="toggle-btn ${buttonClass}" data-village-id="${village.id}" data-current-status="${isVisible}">
            ${buttonText}
          </button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const toggleButtons = this.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        await this.handleToggle(e);
      });
    });
  }

  async handleToggle(e) {
    const button = e.target;
    const villageId = button.dataset.villageId;
    const currentStatus = button.dataset.currentStatus === 'true';
    const newStatus = !currentStatus;

    // Deshabilitar el botón mientras se procesa
    button.disabled = true;
    button.textContent = 'Procesando...';

    try {
      const result = await toggleVillageVisibility(villageId, newStatus);

      if (result.success) {
        // Actualizar la lista de aldeas
        await this.loadVillages();
        this.render();
        this.setupEventListeners();
      } else {
        alert('Error al actualizar la visibilidad: ' + result.error);
        button.disabled = false;
        button.textContent = currentStatus ? 'Ocultar' : 'Mostrar';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar la visibilidad');
      button.disabled = false;
      button.textContent = currentStatus ? 'Ocultar' : 'Mostrar';
    }
  }
}

export default ContentComponent;
