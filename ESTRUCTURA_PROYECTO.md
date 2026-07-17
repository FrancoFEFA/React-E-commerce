# Estructura del Proyecto

```
Verduleria Ecommerce/
│
├─ .gitignore                  # Archivos que no se suben a GitHub
├─ eslint.config.js            # Reglas de formato y linter
├─ index.html                  # Punto de entrada: el HTML principal donde React se monta
├─ package-lock.json           # Controla las versiones exactas de las dependencias
├─ package.json                # Info del proyecto: scripts, dependencias, nombre, versión
├─ README.md                   # Presentación del proyecto en GitHub
├─ vite.config.js              # Configuración de Vite (el empaquetador)
│
├─ public/                     # Archivos estáticos: se sirven tal cual, sin pasar por React
│  ├─ About/                   # Imágenes de la página "Nosotros"
│  │  ├─ Nosotros-hero.png     #   Hero principal de la sección
│  │  ├─ tierra.jpg            #   Fondo de la tarjeta Frescura
│  │  ├─ confianza.jpg         #   Fondo de la tarjeta Confianza
│  │  └─ delivey.png           #   Fondo de la tarjeta Delivery
│  ├─ Readme/                  # Capturas de pantalla para el README
│  │  ├─ AuthenticationCap.png #   Panel de usuarios registrados
│  │  ├─ FirestoreAdminUserCap.png  #   Usuario con rol admin en Firestore
│  │  ├─ FirestoreOrders.png   #   Órdenes de compra guardadas
│  │  └─ FirestoreUsersCap.png #   Colección de usuarios en Firestore
│  ├─ favicon.png              # Ícono principal de la página
│  └─ favicon.svg              # Ícono en formato vectorial (modo oscuro)
│
└─ src/                        # TODO el código de la aplicación
   ├─ App.jsx                  # Componente raíz: define las rutas y providers
   ├─ App.scss                 # Estilos principales del layout
   ├─ main.jsx                 # Punto de entrada: arranca React y monta la app
   │
   ├─ assets/                  # Imágenes importadas desde los componentes
   │  ├─ cat_bebidas.png       #   Imagen para categoría Bebidas
   │  ├─ cat_frutas.png        #   Imagen para categoría Frutas
   │  ├─ cat_otros.png         #   Imagen para categoría Otros
   │  ├─ cat_verduras.png      #   Imagen para categoría Verduras
   │  └─ icon-verdu-colon.png  #   Logo de la verdulería
   │
   ├─ components/              # Todos los componentes de React, ordenados por tema
   │  ├─ admin/                # Panel del administrador
   │  │  ├─ AdminProducts.jsx  #   Lista, edita y elimina productos + edición rápida
   │  │  └─ CreateProduct.jsx  #   Formulario para publicar un producto nuevo
   │  │
   │  ├─ auth/                 # Autenticación
   │  │  ├─ Login.jsx          #   Formulario de inicio de sesión y registro
   │  │  └─ ProtectedRoute.jsx #   Bloquea rutas si no estás logueado o no sos admin
   │  │
   │  ├─ carrito/              # Compra
   │  │  ├─ Cart.jsx           #   Vista del carrito con detalle y precios
   │  │  └─ Checkout.jsx       #   Formulario final para confirmar la compra
   │  │
   │  ├─ comunes/              # Componentes que se ven en todas las páginas
   │  │  ├─ CartWidget.jsx     #   Icono del carrito en la barra de navegación
   │  │  ├─ Footer.jsx         #   Pie de página con links y datos
   │  │  ├─ NavBar.jsx         #   Barra de navegación principal
   │  │  ├─ NavDropdown.jsx    #   Menú desplegable del usuario (login/logout)
   │  │  └─ ScrollToTop.jsx    #   Sube al inicio al cambiar de página
   │  │
   │  ├─ error/                # Páginas de error
   │  │  └─ NotFound.jsx       #   Página 404: cuando la ruta no existe
   │  │
   │  ├─ informacion/          # Páginas informativas
   │  │  ├─ About.jsx          #   "Nosotros": historia, valores y contacto
   │  │  └─ Policies.jsx       #   "Políticas": términos, privacidad, devoluciones
   │  │
   │  └─ productos/            # Catálogo y vista de productos
   │     ├─ CategoryFilter.jsx #   Filtro de categorías en el catálogo
   │     ├─ Home.jsx           #   Página principal: hero, categorías, destacados
   │     ├─ Item.jsx           #   Tarjeta individual de producto en la grilla
   │     ├─ ItemCount.jsx      #   Selector de cantidad con botones + y -
   │     ├─ ItemDetail.jsx     #   Vista detallada de un producto
   │     ├─ ItemDetailContainer.jsx  #   Se encarga de pedir los datos del producto
   │     ├─ ItemList.jsx       #   Grilla de productos
   │     └─ ItemListContainer.jsx    #   Se encarga de pedir los datos del catálogo
   │
   ├─ context/                 # Estado global compartido entre componentes
   │  ├─ CartContext.jsx       #   Estado del carrito (productos, cantidades, total)
   │  ├─ ProductsContext.jsx   #   Estado del catálogo (productos, caché, paginación)
   │  ├─ UserContext.jsx       #   Estado del usuario logueado
   │  ├─ useCart.js            #   Hook para consumir el carrito desde cualquier componente
   │  ├─ useProducts.js        #   Hook para consumir el catálogo
   │  └─ useUser.js            #   Hook para consumir el usuario
   │
   ├─ services/                # Conexión con Firebase
   │  └─ firebase/
   │     ├─ authService.js     #   Registro, inicio y cierre de sesión
   │     ├─ config.js          #   Inicialización de Firebase (Firestore + Auth)
   │     ├─ ordersService.js   #   Guarda las órdenes de compra en la base
   │     └─ productsService.js #   CRUD de productos + categorías
   │
   ├─ styles/                  # Hojas de estilo (Sass)
   │  ├─ index.scss            #   Archivo principal: importa todos los parciales
   │  ├─ _about.scss           #   Estilos de la página "Nosotros"
   │  ├─ _admin.scss           #   Estilos del panel administrador
   │  ├─ _animations.scss      #   Animaciones (fadeInUp, badgePop, pulse)
   │  ├─ _base.scss            #   Reset y estilos base (tipografía, colores)
   │  ├─ _cart.scss            #   Estilos del carrito
   │  ├─ _checkout.scss        #   Estilos del formulario de compra
   │  ├─ _create-product.scss  #   Estilos del formulario de crear producto
   │  ├─ _footer.scss          #   Estilos del pie de página
   │  ├─ _home.scss            #   Estilos de la página principal
   │  ├─ _item.scss            #   Estilos de productos (tarjeta, detalle, grilla)
   │  ├─ _login.scss           #   Estilos del inicio de sesión
   │  ├─ _mixins.scss          #   Mixins reutilizables (responsive, hover, botones)
   │  ├─ _navbar.scss          #   Estilos de la barra de navegación
   │  ├─ _notfound.scss        #   Estilos de la página 404
   │  ├─ _politicas.scss       #   Estilos de la página de políticas
   │  └─ _variables.scss       #   Colores, sombras, radios y transiciones
   │
   └─ utils/                   # Utilitarios
      └─ imageCompression.js   #   Comprime imágenes a 400×400 JPEG base64
```

## Cómo navegar este proyecto

### `src/components/` — El corazón de la app

Cada carpeta agrupa componentes que cumplen una función parecida:

| Carpeta | ¿Qué hay ahí? |
|---|---|
| `admin/` | Todo lo que ve solo el dueño del negocio |
| `auth/` | Registrarse y entrar |
| `carrito/` | El proceso de compra |
| `comunes/` | Lo que está siempre visible (nav, footer) |
| `error/` | Cuando algo sale mal |
| `informacion/` | Páginas fijas: Nosotros, Políticas |
| `productos/` | El catálogo que ve el cliente |

### `src/context/` — El estado que comparten los componentes

Los contextos son como "cajas" donde se guarda información que muchos componentes necesitan:

- **CartContext** — los productos que el usuario va a comprar
- **ProductsContext** — la lista de productos que viene de Firebase, con su caché
- **UserContext** — quién está logueado y si es admin

Los hooks (`useCart`, `useProducts`, `useUser`) son la manera de agarrar esos datos desde cualquier componente.

### `src/services/firebase/` — La conección con la nube

Acá está todo lo que habla con Firebase. Si mañana cambiás Firebase por otra cosa, solo tocás esta carpeta.

### `src/styles/` — La pinta de la app

Los archivos que arrancan con `_` son "parciales": se importan todos desde `index.scss`. Están separados para no mezclar estilos de diferentes secciones.
