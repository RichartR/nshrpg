import "../../css/contentManagement.scss";
import { fetchAffiliationById, uploadImageToStorage } from "../../services/supabase.js";
import { updateAffiliationController } from "../../controller/controller.js";
import toast from "../../utils/toast.js";
import { eventBus } from "../../services/eventBus.js";
import { navigation } from "../../services/navigation.js";

class ContentAffiliationsEditComponent extends HTMLElement {
  constructor() {
    super();
    this.affiliationId = null;
    this.affiliationData = null;
  }

  async setAffiliationId(id) {
    this.affiliationId = id;
    await this.loadAffiliation();
    this.render();
    this.setupEventListeners();
  }

  async loadAffiliation() {
    const result = await fetchAffiliationById(this.affiliationId);
    if (result.success) {
      this.affiliationData = result.data;
    } else {
      toast.error('Error al cargar la afiliación: ' + result.error);
      setTimeout(() => {
        navigation.navigate('#Contenido/afiliaciones');
      }, 2000);
    }
  }

  render() {
    if (!this.affiliationData) {
      this.innerHTML = '<p>Cargando...</p>';
      return;
    }

    this.innerHTML = `
      <div class="wrapper-content-management">
        <div class="content-management-container">
          <div class="content-management-header">
            <a href="#Contenido/afiliaciones" class="back-link">← Volver</a>
            <h1>Editar Afiliación</h1>
          </div>

          <form class="edit-form" id="affiliationEditForm" enctype="multipart/form-data">
            <div class="form-group">
              <label for="affiliation_name">Nombre de la Afiliación:</label>
              <input
                type="text"
                id="affiliation_name"
                name="affiliation_name"
                value="${this.affiliationData.affiliation_name || ''}"
                required
              />
            </div>

            <div class="form-group">
              <label for="abbreviation">Abreviatura:</label>
              <input
                type="text"
                id="abbreviation"
                name="abbreviation"
                value="${this.affiliationData.abbreviation || ''}"
                required
              />
            </div>

            <div class="form-group">
              <label for="spanish_name">Nombre en Español:</label>
              <input
                type="text"
                id="spanish_name"
                name="spanish_name"
                value="${this.affiliationData.spanish_name || ''}"
              />
            </div>

            <div class="form-group">
              <label for="description">Descripción:</label>
              <textarea
                id="description"
                name="description"
                rows="4"
              >${this.affiliationData.description || ''}</textarea>
            </div>

            <div class="form-group">
              <label>Imagen Actual:</label>
              ${this.affiliationData.image_url ? `
                <div class="current-image">
                  <img src="${this.affiliationData.image_url}" alt="${this.affiliationData.affiliation_name}" />
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
                value="${this.affiliationData.menu_order || 0}"
                required
                min="0"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save">Guardar Cambios</button>
              <a href="#Contenido/afiliaciones" class="btn-cancel">Cancelar</a>
            </div>
          </form>
        </div>
      </div>
    `;
  }
  // Añadimos eventos a los botones
  setupEventListeners() {
    const form = this.querySelector('#affiliationEditForm');
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
      affiliation_name: formData.get('affiliation_name'),
      abbreviation: formData.get('abbreviation'),
      spanish_name: formData.get('spanish_name'),
      description: formData.get('description'),
      menu_order: parseInt(formData.get('menu_order'))
    };

    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';

    try {
      // Manejar subida de imagen principal
      const imageFile = formData.get('image_file');
      if (imageFile && imageFile.size > 0) {
        const abbreviation = formData.get('abbreviation');
        const result = await uploadImageToStorage(imageFile, 'villages', '', abbreviation);
        if (result.success) {
          updates.image_url = result.url;
        } else {
          throw new Error('Error al subir imagen: ' + result.error);
        }
      }

      const result = await updateAffiliationController(this.affiliationId, updates);

      if (result.success) {
        eventBus.emit('affiliationsUpdated');
        toast.success('Afiliación actualizada correctamente');
        setTimeout(() => {
          navigation.navigate('#Contenido/afiliaciones');
        }, 1500);
      } else {
        toast.error('Error al actualizar la afiliación: ' + result.error);
        submitButton.disabled = false;
        submitButton.textContent = 'Guardar Cambios';
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al actualizar la afiliación');
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar Cambios';
    }
  }

}

export default ContentAffiliationsEditComponent;
