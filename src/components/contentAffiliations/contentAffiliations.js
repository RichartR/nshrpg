import "../../css/contentManagement.scss";
import { fetchVillages } from "../../services/supabase.js";
import { toggleAffiliationController } from "../../controller/controller.js";
import { Subject, debounceTime } from "rxjs";
import { eventBus } from "../../services/eventBus.js";

class ContentAffiliationsComponent extends HTMLElement {
  constructor() {
    super();
    this.villages = [];
    this.filteredVillages = [];
    this.searchTerm = '';
    this.searchSubject$ = new Subject();
  }

  async connectedCallback() {
    await this.loadVillages();
    this.render();
    this.setupEventListeners();
    this.setupSearchDebounce();
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

  //Creamos la fila de cada afiliación
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

  setupSearchDebounce() {
    this.searchSubject$
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.filterVillages();
        this.render();
        this.setupEventListeners();
      });
  }

  // Añadimos eventos a los botones
  setupEventListeners() {
    const searchInput = this.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.searchSubject$.next();
      });
    }

    const toggleButtons = this.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        await this.handleToggle(e);
      });
    });
  }

  // Cambiamos si una afiliación es o no visible
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
        eventBus.emit('affiliationsUpdated');
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

  disconnectedCallback() {
    if (this.searchSubject$) {
      this.searchSubject$.complete();
    }
  }
}

export default ContentAffiliationsComponent;
