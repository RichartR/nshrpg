import "../../css/contentManagement.scss";
import { fetchSubcategories } from "../../services/supabase.js";
import { toggleSubcategoryController } from "../../controller/controller.js";

class ContentSubcategoriesComponent extends HTMLElement {
  constructor() {
    super();
    this.subcategories = [];
    this.filteredSubcategories = [];
    this.searchTerm = '';
    this.searchTimeout = null;
  }

  async connectedCallback() {
    await this.loadSubcategories();
    this.render();
    this.setupEventListeners();
  }

  async loadSubcategories() {
    this.subcategories = await fetchSubcategories(true);
    this.filteredSubcategories = this.subcategories;
  }

  filterSubcategories() {
    const search = this.searchTerm.toLowerCase().trim();
    if (search === '') {
      this.filteredSubcategories = this.subcategories;
    } else {
      this.filteredSubcategories = this.subcategories.filter(subcategory =>
        subcategory.subcategory_name.toLowerCase().includes(search) ||
        subcategory.category_name.toLowerCase().includes(search)
      );
    }
  }

  render() {
    this.innerHTML = `
      <div class="wrapper-content-management">
        <div class="content-management-container">
          <div class="content-management-header">
            <a href="#Contenido" class="back-link">← Volver al Panel</a>
            <h1>Gestión de Subcategorías</h1>
          </div>

          <div class="search-container">
            <input
              type="text"
              class="search-input"
              placeholder="Buscar subcategoría o categoría..."
              value="${this.searchTerm}"
            />
          </div>

          <div class="items-grid">
            ${this.filteredSubcategories.length > 0
              ? this.filteredSubcategories.map(subcategory => this.createSubcategoryRow(subcategory)).join('')
              : '<div class="no-results">No se encontraron resultados</div>'
            }
          </div>
        </div>
      </div>
    `;
  }

  createSubcategoryRow(subcategory) {
    const isVisible = subcategory.is_active !== false;
    const statusClass = isVisible ? 'visible' : 'hidden';
    const buttonText = isVisible ? 'Ocultar' : 'Mostrar';
    const buttonClass = isVisible ? 'btn-hide' : 'btn-show';

    return `
      <div class="item-row item-row-with-edit ${statusClass}" data-subcategory-id="${subcategory.subcategory_id}">
        <div class="item-name-col">
          <h3 class="item-name">${subcategory.subcategory_name}</h3>
          <span class="item-subtitle">${subcategory.category_name}</span>
        </div>
        <div class="item-status-col">
          <span class="status-badge ${statusClass}">
            ${isVisible ? 'Visible' : 'Oculto'}
          </span>
        </div>
        <div class="item-action-col">
          <button class="toggle-btn ${buttonClass}" data-subcategory-id="${subcategory.subcategory_id}" data-current-status="${isVisible}">
            ${buttonText}
          </button>
        </div>
        <div class="item-action-col">
          <a href="#Contenido/subcategorias/editar/${subcategory.subcategory_id}" class="edit-btn">
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
          this.filterSubcategories();
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
    const subcategoryId = button.dataset.subcategoryId;
    const currentStatus = button.dataset.currentStatus === 'true';
    const newStatus = !currentStatus;

    button.disabled = true;
    button.textContent = 'Procesando...';

    try {
      const result = await toggleSubcategoryController(subcategoryId, newStatus);

      if (result.success) {
        await this.loadSubcategories();
        this.render();
        this.setupEventListeners();
        window.dispatchEvent(new CustomEvent('subcategoriesUpdated'));
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

export default ContentSubcategoriesComponent;
