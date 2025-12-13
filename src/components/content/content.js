import "../../css/contentDashboard.scss";

class ContentComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="wrapper-content-dashboard">
        <div class="dashboard-container">
          <div class="dashboard-header">
            <h1>Panel de Administración</h1>
          </div>

          <div class="dashboard-grid">
            <a href="#Contenido/afiliaciones" class="dashboard-card">
              <h2>Afiliaciones</h2>
              <p>Gestiona la visibilidad de las aldeas</p>
            </a>

            <a href="#Contenido/categorias" class="dashboard-card">
              <h2>Categorías</h2>
              <p>Administra las categorías del contenido</p>
            </a>

            <a href="#Contenido/subcategorias" class="dashboard-card">
              <h2>Subcategorías</h2>
              <p>Gestiona las subcategorías del sistema</p>
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

export default ContentComponent;
