import "../../css/auth.scss";
import { signUp, signIn, signOut, getCurrentUser } from "../../services/supabase.js";
import { navigation } from "../../services/navigation.js";

class AuthComponent extends HTMLElement {
  constructor() {
    super();
    this.currentUser = null;
    this.mode = 'login'; // 'login' o 'register'
  }

  setMode(mode) {
    if (mode === 'register' || mode === 'login') {
      this.mode = mode;
    }
  }

  async connectedCallback() {
    await this.checkUser();
    this.render();
    this.setupEventListeners();
  }

  async checkUser() {
    this.currentUser = await getCurrentUser();
  }

  render() {
    if (this.currentUser) {
      this.renderUserProfile();
    } else {
      this.renderAuthForm();
    }
  }

  renderUserProfile() {
    this.innerHTML = `
      <div class="wrapper-auth">
        <div class="auth-container">
          <div class="auth-card">
            <h2 class="auth-title">Perfil de Usuario</h2>
            <div class="user-info">
              <p><strong>Email:</strong> ${this.currentUser.email}</p>
              <p><strong>Usuario:</strong> ${this.currentUser.user_metadata?.username || 'Sin nombre'}</p>
            </div>
            <button class="auth-button" id="logout-btn">Cerrar Sesión</button>
          </div>
        </div>
      </div>
    `;
  }

  renderAuthForm() {
    this.innerHTML = `
      <div class="wrapper-auth">
        <div class="auth-container">
          <div class="auth-card">
            <h2 class="auth-title">${this.mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>

            <form class="auth-form" id="auth-form">
              ${this.mode === 'register' ? `
                <div class="form-group">
                  <label for="username">Nombre de Usuario</label>
                  <input type="text" id="username" name="username" required>
                </div>
              ` : ''}

              <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" required>
              </div>

              <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" required minlength="6">
              </div>

              ${this.mode === 'register' ? `
                <div class="form-group">
                  <label for="confirm-password">Confirmar Contraseña</label>
                  <input type="password" id="confirm-password" name="confirm-password" required minlength="6">
                </div>
              ` : ''}

              <div class="error-message" id="error-message"></div>
              <div class="success-message" id="success-message"></div>

              <button type="submit" class="auth-button" id="submit-btn">
                ${this.mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>

            <div class="auth-switch">
              ${this.mode === 'login'
                ? '¿No tienes cuenta? <a href="#" id="switch-mode">Regístrate aquí</a>'
                : '¿Ya tienes cuenta? <a href="#" id="switch-mode">Inicia sesión aquí</a>'
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  //Activamos los eventos de los botones
  setupEventListeners() {
    const form = this.querySelector('#auth-form');
    const switchModeLink = this.querySelector('#switch-mode');
    const logoutBtn = this.querySelector('#logout-btn');

    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (switchModeLink) {
      switchModeLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.mode = this.mode === 'login' ? 'register' : 'login';
        this.render();
        this.setupEventListeners();
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }
  }

  //Ejecutamos el submit
  async handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = this.querySelector('#submit-btn');
    const errorMessage = this.querySelector('#error-message');
    const successMessage = this.querySelector('#success-message');

    errorMessage.textContent = '';
    successMessage.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    const email = form.email.value;
    const password = form.password.value;

    try {
      if (this.mode === 'register') {
        const username = form.username.value;
        const confirmPassword = form['confirm-password'].value;

        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }

        const result = await signUp(email, password, username);

        if (result.success) {
          successMessage.textContent = 'Registro exitoso. Por favor verifica tu correo electrónico.';
          form.reset();

          setTimeout(() => {
            this.mode = 'login';
            this.render();
            this.setupEventListeners();
          }, 3000);
        } else {
          throw new Error(result.error || 'Error al registrarse');
        }
      } else {
        const result = await signIn(email, password);

        if (result.success) {
          successMessage.textContent = 'Inicio de sesión exitoso. Redirigiendo...';

          setTimeout(async () => {
            await this.checkUser();
            this.render();
            this.setupEventListeners();

            // Actualizamos el estado del header
            const headerComponent = document.querySelector('header-component');
            if (headerComponent) {
              await headerComponent.updateAuthState();
            }

            navigation.navigate('#');
          }, 1500);
        } else {
          throw new Error(result.error || 'Error al iniciar sesión');
        }
      }
    } catch (error) {
      errorMessage.textContent = error.message;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = this.mode === 'login' ? 'Iniciar Sesión' : 'Registrarse';
    }
  }

  //Ejecutamos el logout
  async handleLogout() {
    const result = await signOut();

    if (result.success) {
      this.currentUser = null;
      this.render();
      this.setupEventListeners();

      // Actualizamos el estado del header
      const headerComponent = document.querySelector('header-component');
      if (headerComponent) {
        await headerComponent.updateAuthState();
      }

      navigation.navigate('#');
    } else {
      alert('Error al cerrar sesión: ' + result.error);
    }
  }
}

export default AuthComponent;
