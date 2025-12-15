# NSHRPG - Naruto Shinobi RPG Glossary

Sistema de gestión de contenido (CMS) para un juego de rol de Naruto, con glosario de técnicas, habilidades y categorías por afiliación.

## Características

- Sistema de Glosarios: Navegación jerárquica por afiliaciones, categorías y técnicas
- Panel de Administración: CRUD completo para afiliaciones, categorías y subcategorías
- Autenticación: Sistema de registro/login con roles (Admin)
- Gestión de Imágenes: Upload automático a Supabase Storage con conversión a WebP
- Diseño Responsive: Adaptado a móvil, tablet y desktop
- Arquitectura MVC: Separación clara de responsabilidades

## Tecnologías

- **Frontend**: Vanilla JavaScript (ES6+), Web Components
- **Estilos**: SCSS con diseño responsive
- **Backend**: Supabase (Base de datos PostgreSQL + Auth + Storage)
- **Build Tool**: Vite 7.x
- **Linting**: ESLint 9.x
- **Testing**: Vitest 3.x con Happy DOM
- **Programación Reactiva**: RxJS 7.x (EventBus con Observables)
- **Gestión de estado**: localStorage (vía Supabase SDK)

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/RichartR/nshrpg.git
cd nshrpg

# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar src/environment.env con tus credenciales de Supabase

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## Testing

El proyecto incluye tests unitarios para los componentes principales, servicios y el router, implementados con Vitest 3.x y Happy DOM.

### Ejecutar Tests

```bash
# Ejecutar tests en modo watch (recomendado durante desarrollo)
npm run test

# Ejecutar tests una vez
npm run test:run

# UI interactiva de tests
npm run test:ui

# Coverage de tests
npm run test:coverage
```

### Estructura de Tests

Los tests se encuentran en `src/tests/` y cubren **74 tests** en total distribuidos en **8 archivos**:

**Servicios (22 tests)**
- NavigationService (15 tests): Navegación hash-based, listeners, viewport
- EventBus (7 tests): Sistema de eventos con RxJS Observables

**Router (5 tests)**
- Exportación correcta de funciones
- Actualización de rutas
- Manejo de rutas vacías y con hash

**Componentes de Glosario (28 tests)**
- GlobalGlossaryComponent (9 tests): Renderizado de lista de afiliaciones
- VillageGlossaryComponent (9 tests): Navegación de categorías por afiliación
- ContentCategoriesGlossaryComponent (10 tests): Listado de técnicas por categoría

**Componentes de Administración (19 tests)**
- ContentAffiliationsComponent (9 tests): CRUD de afiliaciones
- HeaderComponent (10 tests): Navegación y menú responsive

### Configuración de Tests

- **Entorno**: Happy DOM (simula el DOM del navegador)
- **Mocks**: Supabase client, window.location, EventBus, NavigationService
- **Globals**: describe, it, expect disponibles sin importar
- **Setup**: `src/tests/setup.js` configura mocks automáticamente

Nota: Si usas Node.js v24+, asegúrate de usar Vitest 3.x (no 4.x) para evitar problemas de compatibilidad.

## Estructura del Proyecto

```
nshrpg/
├── src/
│   ├── components/         # Web Components
│   │   ├── auth/          # Autenticación (login/register)
│   │   ├── content*/      # Gestión de contenido CRUD
│   │   ├── *Glossary/     # Componentes de glosario (global, village, categories)
│   │   ├── header/        # Cabecera con menú de navegación
│   │   ├── footer/        # Pie de página
│   │   └── technique/     # Vista de detalles de técnicas
│   ├── controller/        # Controladores MVC (lógica de negocio)
│   ├── css/              # Estilos SCSS organizados por componente
│   ├── images/           # Recursos estáticos (logos, iconos)
│   ├── services/         # Servicios de integración con Supabase
│   │   ├── supabase.js   # Cliente de Supabase
│   │   ├── eventBus.js   # Sistema de eventos con RxJS
│   │   └── navigation.js # Servicio de navegación hash-based
│   ├── tests/            # Tests unitarios con Vitest (74 tests)
│   │   ├── setup.js      # Configuración de mocks
│   │   ├── router.test.js
│   │   ├── services/     # Tests de servicios
│   │   │   ├── eventBus.test.js
│   │   │   └── navigation.test.js
│   │   └── components/   # Tests de componentes
│   │       ├── globalGlossary.test.js
│   │       ├── villageGlossary.test.js
│   │       ├── contentCategoriesGlossary.test.js
│   │       ├── contentAffiliations.test.js
│   │       └── header.test.js
│   ├── environment.env   # Variables de entorno (credenciales Supabase)
│   ├── router.js         # Enrutador SPA con hash routing
│   └── main.js          # Punto de entrada de la aplicación
├── dist/                 # Build de producción (generado por Vite)
├── index.html           # HTML principal
├── package.json         # Dependencias y scripts npm
├── vite.config.js       # Configuración de Vite
├── vitest.config.js     # Configuración de Vitest
└── eslint.config.js     # Configuración de ESLint
```

### Funcionamiento del Router

El router implementa navegación SPA mediante hash routing:

- **Hash routing**: Las rutas usan el formato `#ruta` para evitar recargas de página
- **Rutas dinámicas**: Soporta rutas anidadas como `#Konohagakure/Clan Inuzuka/tech/generales`
- **Protección de rutas**: Verifica permisos de admin para rutas de contenido
- **Componentes dinámicos**: Carga componentes según la ruta actual

Ejemplo de flujo:
1. Usuario navega a `#Glosario` → Router carga GlobalGlossaryComponent
2. Usuario hace clic en una afiliación → Router navega a `#Konohagakure`
3. VillageGlossaryComponent se renderiza con las categorías de Konoha

### Gestión de Estado

El estado se maneja mediante:

- **Supabase SDK**: Almacena tokens de sesión en localStorage automáticamente
- **EventBus con RxJS**: Sistema de eventos reactivo centralizado usando Observables
  - `affiliationsUpdated$`, `categoriesUpdated$`, `subcategoriesUpdated$`
  - Permite comunicación desacoplada entre componentes
  - Métodos: `emit()` para emitir eventos, `on()` para suscribirse
- **NavigationService**: Servicio centralizado para gestión de navegación
  - Abstrae el acceso directo a `window.location.hash`
  - Proporciona listeners para cambios de ruta
  - Facilita testing mediante inyección de dependencias
- **Props directos**: Los datos se pasan directamente a los Web Components mediante métodos setter

No se usa Redux ni Context API - la arquitectura usa programación reactiva con RxJS de forma ligera.

## Servicios del Proyecto

### EventBus (eventBus.js)

Sistema de eventos centralizado implementado con **RxJS Observables** para comunicación reactiva entre componentes:

```javascript
import { eventBus } from './services/eventBus.js';

// Emitir un evento
eventBus.emit('affiliationsUpdated', newData);

// Suscribirse a un evento
const subscription = eventBus.on('affiliationsUpdated', (data) => {
  console.log('Afiliaciones actualizadas:', data);
});

// Cancelar suscripción
subscription.unsubscribe();
```

**Eventos disponibles:**
- `affiliationsUpdated$`: Se emite cuando se modifican afiliaciones
- `categoriesUpdated$`: Se emite cuando se modifican categorías
- `subcategoriesUpdated$`: Se emite cuando se modifican subcategorías

**Ventajas:**
- Desacopla componentes (no necesitan referencias directas)
- Facilita testing con mocks
- Permite múltiples suscriptores por evento
- Gestión automática de memoria con `destroy()`

### NavigationService (navigation.js)

Servicio de navegación que abstrae el acceso a `window.location.hash`:

```javascript
import { navigation } from './services/navigation.js';

// Navegar a una ruta
navigation.navigate('#Glosario');
navigation.navigate('KN'); // Añade # automáticamente

// Obtener ruta actual
const currentRoute = navigation.getCurrentRoute();

// Escuchar cambios de ruta
const unsubscribe = navigation.onNavigate((hash) => {
  console.log('Nueva ruta:', hash);
});

// Dejar de escuchar
unsubscribe();

// Obtener ancho del viewport
const width = navigation.getViewportWidth();
```

**Ventajas:**
- Testeable (no depende directamente de window)
- API consistente y predecible
- Soporte para múltiples listeners
- Formateo automático de rutas

## Autenticación y Permisos

El proyecto utiliza **Supabase Auth** con sistema de roles:

- **Usuario regular**: Puede ver el glosario público
- **Admin**: Acceso completo al panel de administración (#Contenido)

### Configuración de Roles

Las políticas RLS (Row Level Security) en Supabase requieren:

```sql
-- Tabla profiles debe tener una columna 'role'
-- Solo usuarios con role = 'ADMIN' pueden editar contenido
```

## Características del UI

- **Diseño Moderno**: Gradientes, sombras, animaciones CSS
- **Navegación Intuitiva**: Sistema de hash routing sin recargas
- **Toasts**: Notificaciones no intrusivas para feedback de acciones
- **Responsive**: 3 breakpoints (móvil, tablet, desktop)
- **Imágenes Optimizadas**: Conversión automática a WebP con 85% calidad

### Sistema de Toasts

Los toasts son notificaciones temporales que aparecen en la esquina superior derecha:

- Se crean dinámicamente con `showToast(message, type)`
- Tipos: 'success', 'error', 'info'
- Desaparecen automáticamente después de 3 segundos
- Se usan para confirmar acciones CRUD, errores de validación, etc.

## Base de Datos

El proyecto usa las siguientes vistas y tablas de Supabase:

### Tablas Principales
- `affiliations`: Afiliaciones (aldeas)
- `categories`: Categorías de técnicas
- `subcategories`: Subcategorías
- `techniques`: Técnicas individuales
- `profiles`: Perfiles de usuario con roles

### Vistas
- `entity_profile_abilities_view`: Vista consolidada para glosarios (JOIN de affiliations, categories, techniques)
- `technique_details`: Detalles completos de técnicas con información relacionada

### Relaciones entre Tablas

```
affiliations (1) ──→ (N) categories
categories (1) ──→ (N) subcategories
subcategories (1) ──→ (N) techniques
users (1) ──→ (1) profiles
```

La vista `entity_profile_abilities_view` consolida datos de múltiples tablas para optimizar las consultas del glosario.

## Gestión de Imágenes

El proyecto implementa un sistema completo de gestión de imágenes:

### Proceso de Upload

1. **Selección**: Usuario selecciona imagen desde formulario
2. **Conversión**: Imagen se convierte automáticamente a formato WebP con 85% de calidad
3. **Upload**: Se sube a Supabase Storage en el bucket correspondiente
4. **URL firmada**: Se genera una URL firmada con 1 año de expiración
5. **Base de datos**: La URL se guarda en la tabla correspondiente

### Buckets de Storage

- `villages`: Imágenes de afiliaciones
- `categories`: Imágenes de categorías
- `subcategories`: Imágenes de subcategorías

Cada bucket tiene políticas RLS configuradas para permitir lectura pública y escritura solo a admins.

## Despliegue

### Requisitos previos
1. Cuenta en Supabase
2. Buckets de Storage configurados:
   - `villages` (afiliaciones)
   - `categories` (categorías)
   - `subcategories` (subcategorías)

### Políticas de Storage (RLS)

```sql
-- Permitir lectura pública
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id IN ('villages', 'categories', 'subcategories'));

-- Permitir escritura solo a Admins
CREATE POLICY "Admin Upload" ON storage.objects
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'ADMIN'
  )
);
```

### Deploy a Producción

```bash
# Build
npm run build

# Los archivos en dist/ están listos para Vercel
```

## Criterios de Evaluación Cumplidos

### Conceptos JavaScript
- Objectes literals
- Variables let i const
- Template literals
- QuerySelector
- Modificar el nodes (DOM)
- Validació de formularis
- Destructuring
- Registre d'events W3C
- Programació reactiva (RxJS Observables + CustomEvents)
- Programació funcional (map, filter, forEach)
- FormData
- Classes i encapsulació (EventBus, NavigationService)

### Backend y Persistencia
- API REST (Supabase)
- LocalStorage (Supabase Auth tokens)
- Mòduls (ES6 imports/exports)
- Programació reactiva amb RxJS (Observables, Subject)

### Arquitectura
- MVC i router
- Gestió d'errors (try-catch)

### Tooling
- Tests (Vitest 3.x con 74 tests en 8 archivos)
- Vite (build tool)
- ESLint (linting)

### Funcionalidades
- Registre/Login con roles
- Imatges en Storage (conversión a WebP)
- Permisos (RLS + roles)
- Pàgina principal (glosario)
- Llista CRUD (afiliaciones, categorías, subcategorías)
- Vista Detall (técnicas individuales)
- README completo
- GitHub
- Funcionalitat completa
- Disseny i interacció responsive

## Licencia

Este proyecto es privado y está en desarrollo.

## Autor

**GitHub**: [@RichartR](https://github.com/RichartR)

