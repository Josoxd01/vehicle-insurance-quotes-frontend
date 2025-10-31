# vehicle-insurance-quotes-frontend (React)

Interfaz web para la gestión de **Clientes** y **Cotizaciones de Vehículos**, desarrollada en **React.js** y conectada a la API del backend Laravel.

---

## Requisitos

- Node.js >= 18
- npm >= 9
- Navegador moderno (Chrome, Edge, Firefox)
- Backend Laravel ejecutándose en `http://127.0.0.1:8000`

---

## Instalación

```bash
cd vehicle-insurance-quotes-frontend

npm install
```

Levantar el servidor de desarrollo(El backend corriendo):

```bash
npm start
```

Abrir en el navegador:  
👉 `http://localhost:3000`

---

## Estructura del proyecto

```
src/
│
├── components/
│   ├── Clients.js        # Módulo de gestión de clientes
│   └── Quotes.js         # Módulo de gestión de cotizaciones
│
├── App.js                # Enrutamiento principal (Clientes / Cotizaciones)
├── index.js              # Punto de entrada
└── styles.css            # Estilos base (si aplica)
```

---

## Funcionalidades principales

### 🧍‍♂️ Clientes

- Crear, actualizar y eliminar clientes.
- Campos requeridos:
  - Nombre
  - Correo electrónico
  - Cédula/RUC
- Tabla con listado de clientes.
- Botones **Editar** y **Eliminar**.

---

### 🚘 Cotizaciones

- Crear y actualizar cotizaciones asociadas a clientes.
- Consultar prima (valor del seguro) con servicio externo:
  - `https://68fe50c97c700772bb13737d.mockapi.io/api/test/quotes`
- Subir documentos asociados (PDF/JPG).
- Cambiar estado y registrar historial automáticamente.
- Filtros:
  - Estado (`pending`, `review`, `approved`, `rejected`, `closed`)
  - Cliente (por ID)
  - Año (rango `start_year` - `end_year`)
- Paginación del listado.

---

## Configuración de entorno (opcional)

Si el backend no está en el mismo host o puerto, puedes modificar la URL base en los archivos:

```js
// Ejemplo (Quotes.js / Clients.js)
const API_URL = "http://127.0.0.1:8000/api";
```

---

## Ejecución en producción

Generar build optimizada:

```bash
npm run build
```

Esto creará la carpeta `build/`, lista para desplegar en cualquier servidor estático.

---

## API utilizada (Backend)

- **Clientes:** `/api/clients`
- **Cotizaciones:** `/api/quotes`
- **Subida de documentos:** `/api/quotes/{id}/documents`
- **Correo de notificación:** `/api/quotes/{id}/send-mail`

---

## Errores comunes

- **CORS error:** habilitar `CORS` en Laravel (middleware o paquete `fruitcake/laravel-cors`).
- **Backend apagado:** asegurarse de que `php artisan serve` esté activo.
- **Archivo inválido:** solo se permiten PDF o JPG en la subida de documentos.

---

## Notas finales

- El proyecto no usa Bootstrap ni librerías externas de estilo.
- Se utiliza **React Icons** (`react-icons`) para botones de acción (buscar/agregar).
- Compatible con cualquier backend Laravel >= 9 configurado según el README del backend.

---


**Autor:** Jose Mora  
**Proyecto:** Vehicle Insurance Quotes Frontend  
**Versión:** 1.0.0  
**Framework:** React 18
