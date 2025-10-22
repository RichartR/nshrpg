export { renderHeader };
import "../css/header.scss";
import { URL, KEY } from "../environment.env";

async function renderHeader() {
  const menuData = await fetchData();
  const affiliations = obtainAffiliations(menuData);
  const submenu = obtainSubMenus(menuData);
  const subcategories = obtainSubCategories(menuData);

  // Mapear y esperar las promesas de cada afiliación
  const affiliationItems = await Promise.all(
    affiliations.map(async (affiliationItem) => {
      const categories = submenu[affiliationItem] || [];
      let addedExclusive = false; // Insertar "Contenido Exclusivo" solo una vez por afiliación

      // Mapear y esperar las promesas de cada categoría
      const categoryItems = await Promise.all(
        categories.map(async (category) => {
          const subcats = subcategories[category] || [];

          // La categoría NO tiene subcategorías
          if (subcats.length === 0) {
            if (!addedExclusive) {
              addedExclusive = true;
              return `
                <li class="dropdown-item has-submenu" data-category="${category}" data-menu-id="submenu-${category}">
                  <a href="#${affiliationItem}/contenido-exclusivo" class="nav-link">
                    Contenido Exclusivo
                  </a>
                  <a href="#${affiliationItem}/${category}" class="nav-link submenu-toggle">
                    ${category}
                    <span class="submenu-arrow"></span>
                  </a>
                </li>
              `;
            } else {
              return `
                <li class="dropdown-item has-submenu" data-category="${category}" data-menu-id="submenu-${category}">
                  <a href="#${affiliationItem}/${category}" class="nav-link submenu-toggle">
                    ${category}
                    <span class="submenu-arrow"></span>
                  </a>
                </li>
              `;
            }
          }

          // La categoría SÍ tiene subcategorías
          const subcatItems = await Promise.all(
            subcats.map(async (subcat) => {
              return `
                <li class="dropdown-item has-submenu" data-subcategory="${subcat}" data-menu-id="submenu-${subcat}">
                  <a href="#${affiliationItem}/${category}/${subcat}" class="nav-link submenu-toggle">
                    ${subcat}
                    <span class="submenu-arrow"></span>
                  </a>
                </li>
              `;
            })
          );

          return `
            <li class="dropdown-item has-submenu" data-category="${category}" data-menu-id="submenu-${category}">
              <a href="#${affiliationItem}/${category}" class="nav-link submenu-toggle">
                ${category}
                <span class="submenu-arrow"></span>
              </a>
              <ul class="dropdown-menu level-3">
                <li class="dropdown-item">
                  <a href="#${affiliationItem}/${category}/tecnicas-generales" class="nav-link">
                    Generales ${category}
                  </a>
                </li>
                ${subcatItems.join("")}
              </ul>
            </li>
          `;
        })
      );

      const categoriesHTML =
        categories.length > 0
          ? categoryItems.join("")
          : '<li class="dropdown-item disabled"><span>No hay categorías</span></li>';

      return `
        <li class="dropdown-item has-submenu" data-affiliation="${affiliationItem}" data-menu-id="submenu-${affiliationItem}">
          <a href="#${affiliationItem}" class="nav-link submenu-toggle">
            ${affiliationItem}
            <span class="submenu-arrow"></span>
          </a>
          <ul class="dropdown-menu level-2">
            <li class="dropdown-item">
              <a href="#${affiliationItem}/tecnicas-generales" class="nav-link">
                Generales ${affiliationItem}
              </a>
            </li>
            ${categoriesHTML}
          </ul>
        </li>
      `;
    })
  );

  return `
    <nav class="main-nav" role="navigation" aria-label="Navegación principal">
      <div class="nav-start">
        <a href="#" class="nav-logo"><strong>Mi Sitio</strong></a>
      </div>

      <ul class="nav-center">
        <li class="nav-item"><a href="#">Inicio</a></li>

        <li class="nav-item nav-dropdown" id="main-dropdown">
          <a href="#Glosario" class="nav-link dropdown-toggle">Glosario</a>
          <ul class="dropdown-menu level-1">
            <div class="dropdown-scroll-wrapper">
              ${affiliationItems.join("")}
            </div>
          </ul>
        </li>

        <li class="nav-item"><a href="#Contenido">Contenido</a></li>
      </ul>

      <div class="nav-end">
        <a href="#" class="btn btn-primary">Registrarse</a>
        <a href="#" class="btn btn-secondary">Iniciar sesión</a>
      </div>

      <button class="nav-toggle" aria-label="Alternar menú" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-center"); // ahora es .nav-center

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      navMenu.classList.toggle("is-active");
    });
  }

  function initMobileSubmenus() {
    if (window.innerWidth > 1023) return;

    // Evitar duplicados de eventos
    document.querySelectorAll(".submenu-toggle").forEach((el) => {
      const clone = el.cloneNode(true);
      el.parentNode.replaceChild(clone, el);
    });

    document.querySelectorAll(".submenu-toggle").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const parent = link.closest(".has-submenu");
        if (parent) {
          parent.classList.toggle("is-open");
        }
      });
    });

    const handleClickOutside = (e) => {
      if (!e.target.closest(".main-nav")) {
        document.querySelectorAll(".has-submenu").forEach((item) => {
          item.classList.remove("is-open");
        });
        if (navMenu?.classList.contains("is-active")) {
          navMenu.classList.remove("is-active");
          navToggle?.setAttribute("aria-expanded", "false");
        }
      }
    };

    document.removeEventListener("click", handleClickOutside);
    document.addEventListener("click", handleClickOutside);
  }

  initMobileSubmenus();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initMobileSubmenus, 250);
  });
});

// === Funciones auxiliares ===
async function fetchData() {
  try {
    const response = await fetch(URL + "navigation_menu?active_menu=eq.true", {
      method: "GET",
      headers: {
        apiKey: KEY,
        Authorization: "Bearer " + KEY,
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return [];
  }
}

function obtainAffiliations(data) {
  const affiliations = new Set(data.map((item) => item.abbreviation));
  return [...affiliations];
}

function obtainSubMenus(data) {
  const subMenus = {};
  data
    .filter((item) => item.category_name !== null)
    .forEach((item) => {
      const aff = item.abbreviation;
      const cat = item.category_name;
      if (!subMenus[aff]) subMenus[aff] = new Set();
      subMenus[aff].add(cat);
    });
  for (const key in subMenus) {
    subMenus[key] = [...subMenus[key]];
  }
  return subMenus;
}

function obtainSubCategories(data) {
  const subCategories = {};
  data
    .filter((item) => item.has_subcategories)
    .forEach((item) => {
      const cat = item.category_name;
      const sub = item.subcategory_name;
      if (!subCategories[cat]) subCategories[cat] = new Set();
      subCategories[cat].add(sub);
    });
  for (const key in subCategories) {
    subCategories[key] = [...subCategories[key]];
  }
  return subCategories;
}