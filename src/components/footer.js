export { renderFooter };
import "../css/footer.scss";

function renderFooter(){

    const footer = document.createElement('footer');
    footer.classList.add('footer');

    footer.innerHTML = `
        <footer class="site-footer">
            &copy; 2025 Tu Nombre o Proyecto. Todos los derechos reservados.
        </footer>
    `
    return footer;
}