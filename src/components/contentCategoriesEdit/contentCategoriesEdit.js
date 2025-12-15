import "../../css/contentManagement.scss";
import { fetchCategoryById, uploadImageToStorage } from "../../services/supabase.js";
import { updateCategoryController } from "../../controller/controller.js";
import toast from "../../utils/toast.js";
import { eventBus } from "../../services/eventBus.js";
import { navigation } from "../../services/navigation.js";

class ContentCategoriesEditComponent extends HTMLElement {
  constructor() {
    super();
    this.categoryId = null;
    this.categoryData = null;
  }

  async setCategoryId(id) {
    this.categoryId = id;
    await this.loadCategory();
    this.render();
    this.setupEventListeners();
  }

  async loadCategory() {
    const result = await fetchCategoryById(this.categoryId);
    if (result.success) {
      this.categoryData = result.data;
    } else {
      toast.error('Error al cargar la categoría: ' + result.error);
      setTimeout(() => {
        navigation.navigate('#Contenido/categorias');
      }, 2000);
    }
  }

  render() {
    if (!this.categoryData) {
      this.innerHTML = '<p>Cargando...</p>';
      return;
    }

    this.innerHTML = `
      <div class="wrapper-content-management">
        <div class="content-management-container">
          <div class="content-management-header">
            <a href="#Contenido/categorias" class="back-link">← Volver</a>
            <h1>Editar Categoría</h1>
          </div>

          <form class="edit-form" id="categoryEditForm" enctype="multipart/form-data">
            <div class="form-group">
              <label for="category_name">Nombre de la Categoría:</label>
              <input
                type="text"
                id="category_name"
                name="category_name"
                value="${this.categoryData.category_name || ''}"
                required
              />
            </div>

            <div class="form-group">
              <label for="description">Descripción:</label>
              <textarea
                id="description"
                name="description"
                rows="4"
              >${this.categoryData.description || ''}</textarea>
            </div>

            <div class="form-group">
              <label>Imagen Actual:</label>
              ${this.categoryData.image_url ? `
                <div class="current-image">
                  <img src="${this.categoryData.image_url}" alt="${this.categoryData.category_name}" />
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
                value="${this.categoryData.menu_order || 0}"
                required
                min="0"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save">Guardar Cambios</button>
              <a href="#Contenido/categorias" class="btn-cancel">Cancelar</a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // Añadimos eventos a los botones
  setupEventListeners() {
    const form = this.querySelector('#categoryEditForm');
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
      category_name: formData.get('category_name'),
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
        const categoryName = formData.get('category_name');
        const result = await uploadImageToStorage(imageFile, 'categories', '', categoryName);
        if (result.success) {
          updates.image_url = result.url;
        } else {
          throw new Error('Error al subir imagen: ' + result.error);
        }
      }

      const result = await updateCategoryController(this.categoryId, updates);

      if (result.success) {
        eventBus.emit('categoriesUpdated');
        toast.success('Categoría actualizada correctamente');
        setTimeout(() => {
          navigation.navigate('#Contenido/categorias');
        }, 1500);
      } else {
        toast.error('Error al actualizar la categoría: ' + result.error);
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar Cambios';
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al actualizar la categoría');
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar Cambios';
    }
  }

}

export default ContentCategoriesEditComponent;
