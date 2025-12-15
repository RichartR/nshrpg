import "../../css/contentManagement.scss";
import { fetchSubcategoryById, fetchCategories, uploadImageToStorage } from "../../services/supabase.js";
import { updateSubcategoryController } from "../../controller/controller.js";
import toast from "../../utils/toast.js";
import { eventBus } from "../../services/eventBus.js";
import { navigation } from "../../services/navigation.js";

class ContentSubcategoriesEditComponent extends HTMLElement {
  constructor() {
    super();
    this.subcategoryId = null;
    this.subcategoryData = null;
    this.categories = [];
  }

  async setSubcategoryId(id) {
    this.subcategoryId = id;
    await this.loadSubcategory();
    await this.loadCategories();
    this.render();
    this.setupEventListeners();
  }

  async loadSubcategory() {
    const result = await fetchSubcategoryById(this.subcategoryId);
    if (result.success) {
      this.subcategoryData = result.data;
    } else {
      toast.error('Error al cargar la subcategoría: ' + result.error);
      setTimeout(() => {
        navigation.navigate('#Contenido/subcategorias');
      }, 2000);
    }
  }

  async loadCategories() {
    this.categories = await fetchCategories(true);
  }

  render() {
    if (!this.subcategoryData || !this.categories) {
      this.innerHTML = '<p>Cargando...</p>';
      return;
    }

    const categoryId = this.subcategoryData.category?.category_id || this.subcategoryData.category_id;

    this.innerHTML = `
      <div class="wrapper-content-management">
        <div class="content-management-container">
          <div class="content-management-header">
            <a href="#Contenido/subcategorias" class="back-link">← Volver</a>
            <h1>Editar Subcategoría</h1>
          </div>

          <form class="edit-form" id="subcategoryEditForm" enctype="multipart/form-data">
            <div class="form-group">
              <label for="subcategory_name">Nombre de la Subcategoría:</label>
              <input
                type="text"
                id="subcategory_name"
                name="subcategory_name"
                value="${this.subcategoryData.subcategory_name || ''}"
                required
              />
            </div>

            <div class="form-group">
              <label for="category_id">Categoría:</label>
              <select
                id="category_id"
                name="category_id"
                required
              >
                <option value="">Selecciona una categoría</option>
                ${this.categories.map(cat => `
                  <option value="${cat.category_id}" ${cat.category_id === categoryId ? 'selected' : ''}>
                    ${cat.category_name}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label for="description">Descripción:</label>
              <textarea
                id="description"
                name="description"
                rows="4"
              >${this.subcategoryData.description || ''}</textarea>
            </div>

            <div class="form-group">
              <label>Imagen Actual:</label>
              ${this.subcategoryData.image_url ? `
                <div class="current-image">
                  <img src="${this.subcategoryData.image_url}" alt="${this.subcategoryData.subcategory_name}" />
                </div>
              ` : '<p class="no-image">No hay imagen actual</p>'}
              <label for="image_file" class="file-label">Nueva Imagen:</label>
              <input
                type="file"
                id="image_file"
                name="image_file"
                accept="image/*"
                class="file-input"
              />
              <small class="file-hint">Selecciona una imagen para reemplazar la actual</small>
            </div>

            <div class="form-group">
              <label for="menu_order">Orden en el Menú:</label>
              <input
                type="number"
                id="menu_order"
                name="menu_order"
                value="${this.subcategoryData.menu_order || 0}"
                required
                min="0"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save">Guardar Cambios</button>
              <a href="#Contenido/subcategorias" class="btn-cancel">Cancelar</a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const form = this.querySelector('#subcategoryEditForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        await this.handleSubmit(e);
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const updates = {
      subcategory_name: formData.get('subcategory_name'),
      category_id: parseInt(formData.get('category_id')),
      description: formData.get('description'),
      menu_order: parseInt(formData.get('menu_order'))
    };

    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    try {
      // Subida de imagen
      const imageFile = formData.get('image_file');
      if (imageFile && imageFile.size > 0) {
        const subcategoryName = formData.get('subcategory_name');
        const result = await uploadImageToStorage(imageFile, 'subcategories', '', subcategoryName);
        if (result.success) {
          updates.image_url = result.url;
        } else {
          throw new Error('Error al subir imagen: ' + result.error);
        }
      }

      const result = await updateSubcategoryController(this.subcategoryId, updates);

      if (result.success) {
        eventBus.emit('subcategoriesUpdated');
        toast.success('Subcategoría actualizada correctamente');
        setTimeout(() => {
          navigation.navigate('#Contenido/subcategorias');
        }, 1500);
      } else {
        toast.error('Error al actualizar la subcategoría: ' + result.error);
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar Cambios';
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al actualizar la subcategoría');
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar Cambios';
    }
  }

}

export default ContentSubcategoriesEditComponent;
