# Pinkie · Tienda de ropa online (Next.js + TypeScript)

Proyecto DSY1104 Desarrollo Fullstack II – Evaluación Parcial 2.
Frontend de una tienda de ropa con **Next.js (App Router)**, **React 19**, **TypeScript** y **Bootstrap 5**.
Los datos son simulados y se guardan en `localStorage`. Pruebas unitarias con **Jasmine + Karma**.

## Cómo ejecutar

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # build de producción (incluye revisión de tipos)
npm start           # sirve el build
npm run typecheck   # solo revisión de TypeScript
npm test            # pruebas Jasmine + Karma (Chrome Headless) y cobertura
```

Cobertura: `coverage/html/index.html` (detalle) y `coverage/resumen.txt` (tabla en texto).

**Cuenta de administrador:** `admin@pinkie.cl` / `admin123`

## Estructura

```
src/
├── app/                      Rutas del App Router (cada carpeta es una URL)
│   ├── layout.tsx            Layout raíz: Bootstrap, estilos y TiendaProvider
│   ├── not-found.tsx         Página 404
│   ├── (tienda)/             Páginas públicas (el grupo no aparece en la URL)
│   │   ├── layout.tsx        Navbar + footer
│   │   ├── page.tsx          /
│   │   ├── productos/        /productos
│   │   ├── producto/[id]/    /producto/1
│   │   ├── categorias/       /categorias y /categorias/[nombre]
│   │   ├── blog/             /blog y /blog/[id]
│   │   ├── comprar/          /comprar, /comprar/ok/[numero], /comprar/error/[numero]
│   │   └── ...               ofertas, nosotros, contacto, carrito, iniciar-sesion, crear-cuenta
│   └── admin/                Panel de administración
│       ├── layout.tsx        Protección por rol + menú lateral
│       └── ...               ordenes, productos, categorias, usuarios, reportes, perfil
├── paginas/                  Vistas (reciben datos y funciones por props)
│   └── admin/
├── componentes/              Componentes reutilizables (Navbar, ProductCard, CampoFormulario...)
├── context/TiendaContext.tsx Estado global: carrito, productos, categorías, usuarios, órdenes, sesión
├── hooks/useLocalStorage.ts  Persistencia compatible con el render del servidor de Next
├── data/                     Fuente de datos simulada (productos, regiones, blog)
├── utils/                    Lógica pura: CRUD, carrito, órdenes, validaciones
├── tipos/                    Tipos de TypeScript compartidos
├── estilos/style.css         Paleta y estilos sobre Bootstrap
└── tests/                    Pruebas *.spec.ts / *.spec.tsx y mocks de Next
```

**Cómo se conectan las capas:** cada `page.tsx` de `app/` lee el estado con `useTienda()` y se lo pasa por
props a una vista de `paginas/`. Las vistas no conocen el contexto, por eso se prueban solas pasándoles
props. La lógica de negocio vive en `utils/` como funciones puras (reciben datos y devuelven datos nuevos).

**localStorage y Next:** Next renderiza primero en el servidor, donde no existe `localStorage`.
`useLocalStorage` lee lo guardado después de montar (`useEffect`) para evitar errores de hidratación,
y `TiendaProvider` muestra un indicador de carga hasta tener los datos.

## Vistas

**Tienda:** Inicio · Productos (buscador + filtro, sincronizados con la URL) · Detalle de producto ·
Categorías y Categoría · Ofertas · Nosotros · Blog y Detalle · Contacto · Registro · Inicio de sesión ·
Carrito · Checkout (región/comuna dependientes, autocompletado con sesión) · Pago correcto · Pago con error.

**Administrador** (`/admin`, requiere rol admin): Dashboard · Órdenes/boletas y Boleta ·
Productos (listar, nuevo, editar, eliminar) · Stock crítico · Categorías (CRUD) ·
Usuarios (CRUD) con historial de compras · Reportes · Perfil.

### Cómo probar el pago con error

El pago se rechaza cuando el stock cambió después de agregar al carrito:
1. Como cliente, agrega 3 suéteres al carrito.
2. En otra pestaña, entra como admin y baja el stock del suéter a 1.
3. Vuelve al checkout y paga: verás "No se pudo realizar el pago" y el carrito se ajusta al stock real.

## Pruebas

- **Entorno:** Karma ejecuta las pruebas en Chrome Headless con webpack + Babel (`@babel/preset-typescript` quita los tipos); istanbul mide la cobertura. Ver `karma.conf.cjs`.
- **Mocks de Next:** `next/navigation` y `next/link` se reemplazan por `src/tests/mocks/` (alias en `karma.conf.cjs`). `configurarRuta()` simula la URL y los parámetros, y `routerMock` registra las navegaciones.
- **Otros mocks/spies:** `jasmine.createSpy` para props, `spyOn(Storage.prototype, ...)` para `localStorage`, `spyOn(window, 'confirm' | 'print')`.
- **Lógica (`utils/`)**: CRUD de productos, categorías y usuarios, carrito con stock, órdenes, reportes, validaciones (RUN con dígito verificador).
- **Componentes:** renderizado de listas, renderizado condicional, props y `onClick`, estado de formularios, eventos.
- **Integración (`Integracion.spec.tsx`):** las rutas reales de `app/` con el contexto real: compra completa, pago rechazado, registro e inicio de sesión, CRUD del admin, protección de `/admin`.
- `modulos.spec.ts` importa todos los archivos de `src` para que la cobertura se mida sobre el proyecto completo.
- Umbrales mínimos de cobertura en `karma.conf.cjs`: si bajan, `npm test` falla.
- Las pruebas tienen su propio `src/tests/tsconfig.json` (tipos de Jasmine) y quedan fuera del `tsconfig.json` principal, así `next build` no las revisa.
