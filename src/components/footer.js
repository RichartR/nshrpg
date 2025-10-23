export { renderFooter };
import "../css/footer.scss";

function renderFooter(){

    const footer = document.createElement('footer');
    footer.classList.add('footer');

    footer.innerHTML = `
            &copy; 2025 NSHRPG. Todos los derechos reservados.
    `
    return footer;
}