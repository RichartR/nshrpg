// router.js
import { fetchTech } from './services/supabase.js';
import { renderTech } from './main.js';

// ⚠️ NO importes renderTech desde main.js → mueve renderTech a su propio archivo
// Por ahora, lo definimos aquí para que funcione (pero luego lo refactorizamos)


async function techPage() {
  const data = await fetchTech();
  return renderTech(data); // devuelve string HTML
}

const routes = new Map([
  ['', techPage],
  ['#/', techPage],
  ['#/login', techPage],
]);

// ✅ router debe ser async
export async function router(route, container) {
  const handler = routes.get(route);

  if (!handler) {
    container.innerHTML = `<h2>404</h2>`;
    return;
  }

  try {
    // ✅ await para esperar la Promise
    const elementDOM = await handler(); // techPage() → Promise<string>

    // ✅ Usa innerHTML, no replaceChildren, si trabajas con strings
    container.replaceChildren(elementDOM);
  } catch (error) {
    console.error('Error en la ruta:', error);
    container.innerHTML = `<p>Error al cargar la página.</p>`;
  }
}