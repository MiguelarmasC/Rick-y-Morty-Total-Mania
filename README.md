**Proyecto-Tarea del Master en Desarrollo Wed Full Stack de ConquerBlocks**

# 📌 Requerimientos del Proyecto

A continuación se detallan los requisitos técnicos y de diseño para la realización del proyecto:

# 📥 Entrega

Para la entrega del proyecto, sigue los siguientes pasos:

### 📌 Repositorio:

* Crear un **repositorio específico** para este proyecto.
* Se requerirá el enlace al repositorio para la evaluación.

### 📌 Enlace público:

* Subid el proyecto a **GitHub Pages** o una plataforma similar. *(https://miguelarmasc.github.io/Entregable-5-CSS/).*
* Se requerirá un **enlace público** para la corrección.

# Rick & Morty Total Manía

Aplicación web interactiva construida con **TypeScript**, **SCSS** y **Vite** que consume la [Rick and Morty API](https://rickandmortyapi.com/) para explorar personajes, episodios y localizaciones del universo de la serie.

## Características principales

- **Búsqueda y filtrado de personajes**: Búsqueda por nombre y filtros por estado (`Alive`, `Dead`, `Unknown`) y genero (`female`, `male`, `genderless`, `unknown`).
- **Detalle de personaje**: Panel ampliado al dar click en un personaje con su origen, localización actual y listado de episodios en los que aparece.
- **Sección de episodios**: Exploración de episodios con nombre, código de temporada, fecha de emisión y acceso a los personajes participantes al dar click en la ficha.
- **Carga dinámica**: Carga incremental de resultados desde los endpoints paginados de la API.
- **Favoritos con `localStorage`**: Posibilidad de marcar o desmarcar personajes, episodios y localizaciones como favoritos, con persistencia local y visibles en una sección dedicada.
- **Estados de carga y manejo de errores**: Indicadores visuales mientras se realizan las peticiones (**spinner**) y mensajes claros ante fallos de red, filtros sin resultados o respuestas no válidas.
- **Diseño responsive**: Interfaz adaptable a dispositivos móviles, tabletas y escritorio mediante CSS Grid / Flexbox y estilos modulares en SCSS.

## Tecnologías utilizadas

- **Lenguaje**: TypeScript
- **Estilos**: SCSS (`@use`, variables y mixins)
- **Bundler / Entorno de desarrollo**: Vite
- **API externa**: [Rick and Morty API](https://rickandmortyapi.com/api)

## Estructura del proyecto

```text
rick-y-morty-total-mania/
├── pages/
|   ├── HTML          # Archivos HTML de las distintas pgs del proyecto
├── src/
│   ├── img/          # Carpetas de imagenes del proyecto
│   ├── styles/       # Hojas de estilo SCSS, variables, mixins y layouts
│   ├── ts/           # Archivos TypeScript para cada pg
│   └── main.ts       # Punto de entrada de la aplicación
|
├── .gitignore
├── index.html
├── package-lock.json
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.js