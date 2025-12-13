import "../../css/footer.scss";

class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <footer class="footer">
        &copy; 2025 NSHRPG. Todos los derechos reservados.
      </footer>
    `;
  }
}

export default FooterComponent;