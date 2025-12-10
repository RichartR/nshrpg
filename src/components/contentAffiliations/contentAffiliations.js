import "../../css/contentManagement.scss";
import { fetchVillages } from "../../services/supabase.js";
import { toggleAffiliationController } from "../../controller/controller.js";

class ContentAffiliationsComponent extends HTMLElement {
  constructor() {
    super();
    this.villages = [];
    this.filteredVillages = [];
    this.searchTerm = '';
    this.searchTimeout = null;
  }

  async connectedCallback() {
    await this.loadVillages();
    this.render();
    this.setupEventListeners();
  }

  async loadVillages() {
    // Pasamos true para incluir aldeas inactivas en el panel de gestión
    this.villages = await fetchVillages(true);
    this.filteredVillages = this.villages;
  }

  filterVillages() {
    const search = this.searchTerm.toLowerCase().trim();
    if (search === '') {
      this.filteredVillages = this.villages;
    } else {
      this.filteredVillages = this.villages.filter(village =>
        village.affiliation_name.toLowerCase().includes(search)
      );
    }
  }

  render() {
    this.innerHTML = `
      <div class="wrapper-content-management">
        <div class="content-management-container">
          <div class="content-management-header">
            <a href="#Contenido" class="back-link">← Volver al Panel</a>
            <h1>Gestión de Afiliaciones</h1>
          </div>

          <div class="search-container">
            <input
              type="text"
              class="search-input"
              placeholder="Buscar afiliación..."
              value="${this.searchTerm}"
            />
          </div>

          <div class="items-grid">
            ${this.filteredVillages.length > 0
              ? this.filteredVillages.map(village => this.createVillageRow(village)).join('')
              : '<div class="no-results">No se encontraron resultados</div>'
            }
          </div>
        </div>
      </div>
    `;
  }

  createVillageRow(village) {
    const isVisible = village.is_active !== false;
    const statusClass = isVisible ? 'visible' : 'hidden';
    const buttonText = isVisible ? 'Ocultar' : 'Mostrar';
    const buttonClass = isVisible ? 'btn-hide' : 'btn-show';

    return `
      <div class="item-row item-row-with-edit ${statusClass}" data-village-id="${village.affiliation_id}">
        <div class="item-name-col">
          <h3 class="item-name">${village.affiliation_name}</h3>
        </div>
        <div class="item-status-col">
          <span class="status-badge ${statusClass}">
            ${isVisible ? 'Visible' : 'Oculto'}
          </span>
        </div>
        <div class="item-action-col">
          <button class="toggle-btn ${buttonClass}" data-village-id="${village.affiliation_id}" data-current-status="${isVisible}">
            ${buttonText}
          </button>
        </div>
        <div class="item-action-col">
          <a href="#Contenido/afiliaciones/editar/${village.affiliation_id}" class="edit-btn">
            Modificar
          </a>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const searchInput = this.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;

        // Clear previous timeout
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }

        // Set new timeout (300ms debounce)
        this.searchTimeout = setTimeout(() => {
          this.filterVillages();
          this.render();
          this.setupEventListeners();
        }, 300);
      });
    }

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

    button.disabled = true;
    button.textContent = 'Procesando...';

    try {
      const result = await toggleAffiliationController(villageId, newStatus);

      if (result.success) {
        await this.loadVillages();
        this.render();
        this.setupEventListeners();
        window.dispatchEvent(new CustomEvent('affiliationsUpdated'));
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

export default ContentAffiliationsComponent;
