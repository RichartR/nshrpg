import "../../css/header.scss";
import { getCurrentUser, signOut, fetchMenuData } from "../../services/supabase.js";
import { fromEvent, debounceTime } from "rxjs";
import { eventBus } from "../../services/eventBus.js";
import { navigation } from "../../services/navigation.js";

class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.menuData = null;
    this.currentUser = null;
    this.subscriptions = [];
  }

  async setMenuData(menuData) {
    this.menuData = menuData;
    await this.checkUser();
    await this.render();
    this.setupEventListeners();
    this.setupContentUpdateListeners();
  }

  setupContentUpdateListeners() {
    // Limpiar suscripciones anteriores
    this.cleanupSubscriptions();

    // Suscribirse a eventos del Event Bus
    const affiliationsSubscription = eventBus.on('affiliationsUpdated', async () => {
      await this.refreshMenuData();
    });

    const categoriesSubscription = eventBus.on('categoriesUpdated', async () => {
      await this.refreshMenuData();
    });

    const subcategoriesSubscription = eventBus.on('subcategoriesUpdated', async () => {
      await this.refreshMenuData();
    });

    // Guardar referencias para limpiarlas después
    this.subscriptions.push(affiliationsSubscription, categoriesSubscription, subcategoriesSubscription);
  }

  async refreshMenuData() {
    const freshMenuData = await fetchMenuData();
    this.menuData = freshMenuData;
    await this.render();
    this.setupEventListeners();
  }

  async checkUser() {
    this.currentUser = await getCurrentUser();
  }

  async updateAuthState() {
    await this.checkUser();
    await this.render();
    this.setupEventListeners();
  }

  async render() {
    if (!this.menuData) return;

    const affiliations = this.obtainAffiliations(this.menuData);
    const submenu = this.obtainSubMenus(this.menuData);
    const subcategories = this.obtainSubCategories(this.menuData);

    const affiliationItems = await Promise.all(
      affiliations.map(async (affiliationItem) => {
        const categories = submenu[affiliationItem] || [];
        let addedExclusive = false;

        const categoryItems = await Promise.all(
          categories.map(async (category) => {
            const subcats = subcategories[category] || [];

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

    this.innerHTML = `
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

          ${this.currentUser && this.currentUser.role === 'ADMIN' ? '<li class="nav-item"><a href="#Contenido">Contenido</a></li>' : ''}
        </ul>

        <div class="nav-end">
          ${this.currentUser
            ? `<button class="btn btn-primary" id="logout-btn">Cerrar sesión</button>`
            : `<a href="#register" class="btn btn-primary">Registrarse</a>
               <a href="#login" class="btn btn-secondary">Iniciar sesión</a>`
          }
        </div>

        <button class="nav-toggle" aria-label="Alternar menú" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    `;
  }

  setupEventListeners() {
    const navToggle = this.querySelector(".nav-toggle");
    const navMenu = this.querySelector(".nav-center");
    const logoutBtn = this.querySelector("#logout-btn");

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", !isExpanded);
        navMenu.classList.toggle("is-active");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await this.handleLogout();
      });
    }

    this.initMobileSubmenus();
    this.setupResizeListener();
  }

  setupResizeListener() {
    const resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .subscribe(() => this.initMobileSubmenus());

    this.subscriptions.push(resizeSubscription);
  }

  initMobileSubmenus() {
    if (navigation.getViewportWidth() > 1023) return;

    const navToggle = this.querySelector(".nav-toggle");
    const navMenu = this.querySelector(".nav-center");

    this.querySelectorAll(".submenu-toggle").forEach((el) => {
      const clone = el.cloneNode(true);
      el.parentNode.replaceChild(clone, el);
    });

    this.querySelectorAll(".submenu-toggle").forEach((link) => {
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
        this.querySelectorAll(".has-submenu").forEach((item) => {
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

  obtainAffiliations(data) {
    const affiliations = new Set(data.map((item) => item.affiliation_abbr));
    return [...affiliations];
  }

  obtainSubMenus(data) {
    const subMenus = {};
    data
      .filter((item) => item.category_name !== null)
      .forEach((item) => {
        const aff = item.affiliation_abbr;
        const cat = item.category_name;
        if (!subMenus[aff]) subMenus[aff] = new Set();
        subMenus[aff].add(cat);
      });
    for (const key in subMenus) {
      subMenus[key] = [...subMenus[key]];
    }
    return subMenus;
  }

  obtainSubCategories(data) {
    const subCategories = {};
    data
      .filter((item) => item.subcategory_name !== null)
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

  async handleLogout() {
    const result = await signOut();
    if (result.success) {
      await this.updateAuthState();
      navigation.navigate('#');
    } else {
      alert('Error al cerrar sesión: ' + result.error);
    }
  }

  cleanupSubscriptions() {
    //Limpiar suscripciones
    this.subscriptions.forEach(subscription => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    });
    this.subscriptions = [];
  }

  disconnectedCallback() {
    this.cleanupSubscriptions();
  }
}

export default HeaderComponent;