import "../../css/contentManagement.scss";
import { fetchCategories } from "../../services/supabase.js";
import { toggleCategoryController } from "../../controller/controller.js";

class ContentCategoriesComponent extends HTMLElement {
  constructor() {
    super();
    this.categories = [];
    this.filteredCategories = [];
    this.searchTerm = '';
    this.searchTimeout = null;
  }

  async connectedCallback() {
    await this.loadCategories();
    this.render();
    this.setupEventListeners();
  }

  async loadCategories() {
    this.categories = await fetchCategories(true);
    this.filteredCategories = this.categories;
  }

  filterCategories() {
    const search = this.searchTerm.toLowerCase().trim();
    if (search === '') {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.category_name.toLowerCase().includes(search)
      );
    }
  }

  render() {
    this.innerHTML = `
      <div class="wrapper-content-management">
        <div class="content-management-container">
          <div class="content-management-header">
            <a href="#Contenido" class="back-link">← Volver al Panel</a>
            <h1>Gestión de Categorías</h1>
          </div>

          <div class="search-container">
            <input
              type="text"
              class="search-input"
              placeholder="Buscar categoría..."
              value="${this.searchTerm}"
            />
          </div>

          <div class="items-grid">
            ${this.filteredCategories.length > 0
              ? this.filteredCategories.map(category => this.createCategoryRow(category)).join('')
              : '<div class="no-results">No se encontraron resultados</div>'
            }
          </div>
        </div>
      </div>
    `;
  }

  createCategoryRow(category) {
    const isVisible = category.is_active !== false;
    const statusClass = isVisible ? 'visible' : 'hidden';
    const buttonText = isVisible ? 'Ocultar' : 'Mostrar';
    const buttonClass = isVisible ? 'btn-hide' : 'btn-show';

    return `
      <div class="item-row item-row-with-edit ${statusClass}" data-category-id="${category.category_id}">
        <div class="item-name-col">
          <h3 class="item-name">${category.category_name}</h3>
        </div>
        <div class="item-status-col">
          <span class="status-badge ${statusClass}">
            ${isVisible ? 'Visible' : 'Oculto'}
          </span>
        </div>
        <div class="item-action-col">
          <button class="toggle-btn ${buttonClass}" data-category-id="${category.category_id}" data-current-status="${isVisible}">
            ${buttonText}
          </button>
        </div>
        <div class="item-action-col">
          <a href="#Contenido/categorias/editar/${category.category_id}" class="edit-btn">
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
          this.filterCategories();
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
    const categoryId = button.dataset.categoryId;
    const currentStatus = button.dataset.currentStatus === 'true';
    const newStatus = !currentStatus;

    button.disabled = true;
    button.textContent = 'Procesando...';

    try {
      const result = await toggleCategoryController(categoryId, newStatus);

      if (result.success) {
        await this.loadCategories();
        this.render();
        this.setupEventListeners();
        window.dispatchEvent(new CustomEvent('categoriesUpdated'));
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

export default ContentCategoriesComponent;
