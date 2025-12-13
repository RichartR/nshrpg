import "../../css/welcome.scss";

class WelcomeComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const bannerUrl = new URL('../../images/banner.jpg', import.meta.url).href;

    this.innerHTML = `
      <div class="welcome-container">
        <div class="welcome-banner">
          <img src="${bannerUrl}" alt="NSHRPG Banner" class="banner-image">
          <div class="welcome-overlay">
            <h1 class="welcome-title">Bienvenido a NSHRPG</h1>
            <p class="welcome-subtitle">Explora el mundo ninja y descubre todas las técnicas, aldeas y habilidades</p>
            <div class="welcome-actions">
              <a href="#Glosario" class="btn-welcome">Ver Glosario</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default WelcomeComponent;
