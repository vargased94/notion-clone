# Mapeo de Disenos a Funcionalidades - Notion Clone

> Vinculacion de cada vista/componente del archivo `notion.pen` con las funcionalidades documentadas en `NOTION_FEATURES.md` y las fases del `PLAN.md`.

---

## Tabla de Contenidos

1. [Resumen General](#resumen-general)
2. [Vistas Principales (Full Page)](#vistas-principales)
3. [Vistas de Base de Datos](#vistas-de-base-de-datos)
4. [Dialogos y Overlays](#dialogos-y-overlays)
5. [Componentes Reutilizables](#componentes-reutilizables)
6. [Analisis de Cobertura](#analisis-de-cobertura)
7. [Funcionalidades Sin Diseno](#funcionalidades-sin-diseno)

---

## Resumen General

El archivo `notion.pen` contiene **28 frames** (23 vistas + 5 componentes reutilizables) que cubren el frontend completo del clon. El diseno usa un tema **dark mode** con acentos verdes (#4ADE80 aprox.) como color primario.

| Categoria | Cantidad |
|-----------|----------|
| Vistas principales (full page) | 11 |
| Vistas de base de datos | 5 |
| Dialogos / Overlays / Paneles | 12 |
| Bloques del editor (standalone) | 3 |
| Componentes reutilizables | 5 |
| **Total** | **39** |

---

## Vistas Principales

### 1. Main Editor - Dark Mode (`cMgno`)

**Descripcion:** Vista principal del editor. Muestra el sidebar izquierdo completo con navegacion, y el area de contenido con una pagina "Project Notes" que incluye propiedades (Status, Priority, Assignee), un bloque callout, checkboxes/to-do y una tabla inline.

**Funcionalidades cubiertas (NOTION_FEATURES.md):**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Sidebar / Navegacion | 3.1 | Completo - workspace switcher, Search, Notion AI, Home, Inbox, Settings, Favorites, Private, Shared sections, Trash |
| Pagina con titulo e icono | 3.2 | Completo - icono de pagina, titulo editable |
| Cover de pagina | 4.2 | Visible - gradient cover en la parte superior |
| Propiedades de pagina | 2.2 | Parcial - Status (select), Priority (select), Assignee (person) visibles |
| Bloque Callout | 1.4 | Completo - icono + texto con fondo diferenciado |
| To-do / Checkbox list | 1.1 | Completo - items con checkboxes, algunos marcados |
| Tabla inline | 1.4 / 2.1 | Visible - tabla con columnas y filas |
| Breadcrumb | 4.6 | Visible - ruta de pagina en la parte superior |
| Botones Share, Favorite, More | 3.4 | Visibles en header |

**Fase del PLAN.md:** Fase 1 (Auth + Layout), Fase 2 (Editor basico), Fase 3 (Bloques avanzados)

---

### 2. Home View (`42uzy`)

**Descripcion:** Vista de inicio con saludo al usuario ("Good morning, User"), seccion "Recently Visited" con tarjetas de paginas recientes y seccion "Jump back in" con lista de accesos rapidos.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Home / pagina de inicio | 3.1 | Completo - saludo personalizado |
| Recientes | 3.6 | Completo - tarjetas con previews y timestamps |
| Navegacion rapida | 3.6 | Completo - "Jump back in" con lista de paginas |
| Sidebar colapsado | 3.1 | Visible - sidebar presente con navegacion |

**Fase del PLAN.md:** Fase 1 (Layout base), Fase 9 (Dashboard/Home)

---

### 3. Inbox View (`nTdf4`)

**Descripcion:** Centro de notificaciones con tabs (All, Mentions, Comments) y lista de notificaciones agrupadas por tiempo (Today, Yesterday). Muestra notificaciones de menciones, comentarios y ediciones de pagina.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Notificaciones / Inbox | 4.10 | Completo - tabs de filtrado, agrupacion temporal |
| Menciones (@) | 1.2 | Parcial - notificacion de mencion visible |
| Comentarios | 4.4 | Parcial - notificacion de comentario visible |
| Indicador de leido/no leido | 4.10 | Visible - puntos verdes en no leidos |

**Fase del PLAN.md:** Fase 8 (Notificaciones)

---

### 4. Settings View (`OQVyK`)

**Descripcion:** Configuracion de cuenta con perfil de usuario (avatar, nombre, email), toggle de dark mode, switches de notificaciones (email, desktop), y selector de "Start week on".

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Configuracion de cuenta | 4.11 | Parcial - perfil basico |
| Tema claro/oscuro | 4.3 | Completo - toggle de dark mode |
| Notificaciones push/email | 4.10 | Completo - switches individuales |
| Preferencias de calendario | 2.1 | Parcial - "Start week on" |

**Fase del PLAN.md:** Fase 1 (Auth + perfil), Fase 9 (Settings)

---

### 5. Search View (`7YJEm`)

**Descripcion:** Modal de busqueda con input de texto, filtros (All, Pages, etc.), seccion "Recent Pages" con lista de resultados, seccion "Quick Actions" (Create new page, Import from file, View trash), y shortcuts (Cmd+K, Esc) en el footer.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Busqueda global | 3.5 | Completo - input con filtros por tipo |
| Paginas recientes en busqueda | 3.5 | Completo - lista de paginas recientes |
| Quick actions / Command palette | 3.5 | Completo - acciones rapidas |
| Atajos de teclado | 4.1 | Parcial - Cmd+K para abrir, Esc para cerrar |

**Fase del PLAN.md:** Fase 7 (Busqueda)

---

### 6. Notion AI View (`ROONh`)

**Descripcion:** Interfaz de chat con AI integrada en el workspace. Muestra conversacion con respuestas formateadas (listas, checkboxes con progreso), botones de accion (Summarize, Create tasks), y barra de input con acciones rapidas.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Notion AI - Chat | 3.11 | Completo - interfaz conversacional |
| AI - Resumen de contenido | 3.11 | Visible - boton "Summarize" |
| AI - Creacion de tareas | 3.11 | Visible - boton "Create tasks" |
| AI - Respuestas con formato | 3.11 | Completo - listas, checkboxes en respuestas |
| AI - Acciones rapidas | 3.11 | Visible - botones de accion en barra inferior |

**Fase del PLAN.md:** Fase 10 (AI)

---

### 7. Trash View (`WkOFO`)

**Descripcion:** Lista de paginas eliminadas en formato tabla con columnas: Page, Location, Deleted by, Deleted, y acciones (Restore/Delete, Restore Explore). Incluye mensaje de retencion de 30 dias, barra de busqueda, y boton "Empty Trash".

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Papelera | 3.9 | Completo - lista, busqueda, restaurar, eliminar permanente |
| Retencion 30 dias | 3.9 | Visible - mensaje informativo |
| Empty Trash | 3.9 | Visible - boton de vaciado masivo |

**Fase del PLAN.md:** Fase 4 (Organizacion de paginas)

---

### 8. Gallery View - Design System (`MFHDy`)

**Descripcion:** Vista de galeria de una base de datos "Design System" con tarjetas que muestran previews visuales (Color Tokens, Typography, Buttons, Form Inputs, Spacing, Iconography). Incluye toolbar con filtros, sort, busqueda, y boton + New. Tabs de vistas: Gallery, Board, Table, List.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Vista Gallery | 2.1 | Completo - tarjetas con preview, titulo y tags |
| Toolbar de base de datos | 2.1 | Completo - Filter, Sort, Search, + New |
| Tabs de vistas multiples | 2.1 | Completo - Gallery, Board, Table, List |
| Tags/Multi-select | 2.2 | Visible - labels de colores en tarjetas |
| Breadcrumb de pagina | 4.6 | Visible - "Design System > Gallery" |

**Fase del PLAN.md:** Fase 5 (Base de datos - vistas)

---

## Vistas de Base de Datos

### 9. Task Board - Kanban (`uH3WK`)

**Descripcion:** Vista board/kanban de "Task Board" con 3 columnas (To Do, In Progress, Done), tarjetas con titulo, tags de colores y avatares de asignados. Boton + para agregar en cada columna.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Vista Board/Kanban | 2.1 | Completo - columnas por status |
| Agrupacion por propiedad | 2.5 | Completo - agrupado por Status |
| Tarjetas con propiedades | 2.1 | Completo - tags, assignee visibles |
| Agregar item en grupo | 2.1 | Visible - boton + por columna |
| Drag & drop entre columnas | 4.5 | Implicito en el diseno |

**Fase del PLAN.md:** Fase 5 (Base de datos - Board view)

---

### 10. Table Database View (`bVKKh`)

**Descripcion:** Vista de tabla completa del "Task Board" con columnas: Name, Status, Priority, Assignee, Due Date. Filas con datos de ejemplo, checkboxes, tags de colores, avatares y fechas. Toolbar con Filter, Sort, Search.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Vista Table | 2.1 | Completo - tabla con columnas tipadas |
| Propiedades: Title | 2.2 | Visible |
| Propiedades: Select (Status, Priority) | 2.2 | Visible - tags de colores |
| Propiedades: Person (Assignee) | 2.2 | Visible - avatares |
| Propiedades: Date (Due Date) | 2.2 | Visible - fechas formateadas |
| Checkbox de fila | 2.1 | Visible |
| + New row | 2.1 | Visible |
| Tabs de vistas | 2.1 | Visible - Board, Table, List, etc. |

**Fase del PLAN.md:** Fase 5 (Base de datos - Table view)

---

### 11. Calendar View (`oEac1`)

**Descripcion:** Vista de calendario mensual mostrando eventos como barras de colores sobre los dias. Navegacion de mes, indicador de dia actual.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Vista Calendar | 2.1 | Completo - grid mensual con eventos |
| Eventos con colores | 2.1 | Visible - barras de colores por categoria |
| Navegacion de meses | 2.1 | Visible - controles de mes |
| Dia actual destacado | 2.1 | Visible |

**Fase del PLAN.md:** Fase 6 (Vistas avanzadas - Calendar)

---

### 12. Timeline / Gantt View (`qKv2t`)

**Descripcion:** Vista timeline/gantt de "Project Timeline" con barras horizontales de colores representando tareas a lo largo del tiempo (Mar-Jun). Columna izquierda con nombres de tareas, eje horizontal con meses.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Vista Timeline/Gantt | 2.1 | Completo - barras temporales |
| Duracion de tareas | 2.1 | Visible - largo de barras |
| Eje temporal | 2.1 | Visible - meses en header |
| Tabs de vistas | 2.1 | Visible - Calendar, Timeline, Table |

**Fase del PLAN.md:** Fase 6 (Vistas avanzadas - Timeline)

---

### 13. Filter Config Panel (`iwNdQ`)

**Descripcion:** Panel de configuracion de filtros con logica Where/And, propiedades seleccionables (Status, Priority), operadores (is), valores de filtro, boton + Add filter. Seccion de Sort by con propiedad y direccion.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Filtros de base de datos | 2.3 | Completo - filtros compuestos con And/Where |
| Seleccion de propiedad | 2.3 | Visible - dropdowns de propiedad |
| Operadores de filtro | 2.3 | Visible - "is" |
| Ordenamiento (Sort) | 2.4 | Completo - Sort by + direccion |
| Add filter / Add sort | 2.3-2.4 | Visible - botones + |

**Fase del PLAN.md:** Fase 5 (Base de datos - Filtros y sorts)

---

## Dialogos y Overlays

### 14. Context Menu (`841C5`)

**Descripcion:** Menu contextual con opciones: Edit, Duplicate, Move to (submenu), Copy link, Add to Favorites, Share, Change icon, Change cover, Delete (rojo). Footer con "Last edited Mar 5, 2026".

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Menu contextual de pagina | 4.6 | Completo |
| Duplicar pagina | 3.2 | Visible |
| Mover pagina | 3.2 | Visible - con submenu |
| Copiar enlace | 3.4 | Visible |
| Favoritos | 3.6 | Visible |
| Compartir | 3.4 | Visible |
| Cambiar icono/cover | 4.2 | Visible |
| Eliminar | 3.9 | Visible - en rojo |
| Metadato de edicion | 3.2 | Visible - Last edited |

**Fase del PLAN.md:** Fase 4 (Organizacion de paginas)

---

### 15. Slash Command Menu (`4soeT`)

**Descripcion:** Menu de comandos slash con input "/Type a command...", secciones "BASIC BLOCKS" (Text, H1, H2, Bulleted list, Numbered list, To-do list) y "MEDIA" (Image, Code, Table). Cada item con icono y descripcion.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Slash commands | 1.5 | Parcial - muestra bloques basicos y media |
| Bloque Text | 1.1 | Visible |
| Bloque Heading 1, 2 | 1.1 | Visible |
| Bloque Bulleted list | 1.1 | Visible |
| Bloque Numbered list | 1.1 | Visible |
| Bloque To-do list | 1.1 | Visible |
| Bloque Image | 1.3 | Visible |
| Bloque Code | 1.1 | Visible |
| Bloque Table | 1.4 | Visible |

**Nota:** El menu no muestra todos los bloques documentados (faltan: H3, Quote, Divider, Toggle, Callout, Equation, Bookmark, Embed, File, Audio, Video, TOC, Breadcrumb, Columns, Synced block, Link to page, Database blocks). Estos se asumen scrolleables en la implementacion.

**Fase del PLAN.md:** Fase 2 (Editor basico), Fase 3 (Bloques avanzados)

---

### 16. Share Dialog (`NvXiE`)

**Descripcion:** Dialogo de compartir con input para agregar personas/emails, boton "Invite", lista de personas con acceso (Owner, Can edit), toggle "Share to web" con descripcion, y boton "Copy link".

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Compartir pagina | 3.4 | Completo |
| Invitar por email | 3.4 | Visible |
| Roles de acceso | 3.4 | Visible - Owner, Can edit |
| Publicar en web | 3.4 | Visible - toggle Share to web |
| Copiar enlace | 3.4 | Visible |

**Fase del PLAN.md:** Fase 8 (Compartir y permisos)

---

### 17. Move To Dialog (`FvToD`)

**Descripcion:** Dialogo para mover pagina con busqueda, seccion "SUGGESTED" con lista de paginas, y seccion "WORKSPACES" con workspace actual.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Mover pagina a otra ubicacion | 3.2 | Completo |
| Busqueda de destino | 3.2 | Visible |
| Sugerencias de destino | 3.2 | Visible |
| Mover entre workspaces | 3.3 | Visible |

**Fase del PLAN.md:** Fase 4 (Organizacion de paginas)

---

### 18. Delete Confirmation (`jqZUt`)

**Descripcion:** Dialogo de confirmacion de eliminacion con icono de advertencia, mensaje "This page will be moved to Trash. You can restore it within 30 days.", botones Cancel y Delete (rojo).

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Confirmacion de eliminacion | 3.9 | Completo |
| Soft delete (Trash) | 3.9 | Visible - mencion de Trash y 30 dias |

**Fase del PLAN.md:** Fase 4 (Organizacion de paginas)

---

### 19. Toast Notifications (`aiNVo`)

**Descripcion:** 3 variantes de toast: Success (verde - "Page moved successfully"), Error (rojo - "Failed to save changes"), Info (neutral - "Link copied to clipboard" con boton Undo). Todos con boton de cerrar.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Notificaciones toast | 4.10 | Completo - 3 variantes |
| Undo action | 4.6 | Visible - boton Undo en toast |
| Feedback de acciones | 4.6 | Completo |

**Fase del PLAN.md:** Fase 1 (UI base - sistema de toasts con `sonner`)

---

### 20. Cover & Icon Picker (`ivBVM`)

**Descripcion:** Picker con tabs (Emoji, Icons, Upload), barra de busqueda, grid de emojis organizados por categoria (Smileys & People). Titulo "Cover & Icon".

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Selector de icono de pagina | 4.2 | Completo - emojis con busqueda |
| Tabs Emoji/Icons/Upload | 4.2 | Visible |
| Busqueda de emojis | 4.2 | Visible |
| Categorias de emojis | 4.2 | Visible |

**Nota:** El diseno muestra el tab de Emoji pero no el de cover (gradientes, imagenes, colores). Se asume que el tab "Upload" cubre covers custom, pero faltaria un tab especifico para seleccion de covers predeterminados/gradientes.

**Fase del PLAN.md:** Fase 4 (Personalizacion de paginas)

---

### 21. Template Picker (`4wJpR`)

**Descripcion:** Dialogo de plantillas con navegacion lateral por categorias (All Templates, Getting Started, Project Mgmt, Engineering, Design, Marketing), grid de tarjetas con preview visual, titulo y descripcion. Busqueda en header.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Galeria de plantillas | 3.8 | Completo - categorias + previews |
| Categorias de plantillas | 3.8 | Visible - 6 categorias |
| Busqueda de plantillas | 3.8 | Visible |
| Preview de plantilla | 3.8 | Visible - tarjetas con imagen y descripcion |

**Fase del PLAN.md:** Fase 9 (Templates)

---

### 22. Members Picker (`EOpUG`)

**Descripcion:** Dropdown de seleccion de miembros con busqueda, lista de personas (avatar, nombre, email), y opcion "Invite someone" al final.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Selector de personas | 2.2 | Completo - para propiedades Person |
| Busqueda de miembros | 3.3 | Visible |
| Invitar nuevos miembros | 3.3 | Visible |

**Fase del PLAN.md:** Fase 5 (Propiedades de base de datos), Fase 8 (Permisos)

---

### 23. Page Properties Panel (`9B46M`)

**Descripcion:** Panel/header de propiedades de pagina con titulo "Properties" y boton de cerrar. (Diseno minimalista - solo muestra el header del panel).

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Panel de propiedades | 2.2 | Parcial - solo header visible, contenido implicito |

**Nota:** El frame solo muestra el header del panel. El contenido completo de propiedades se infiere del Main Editor view donde las propiedades estan visibles inline.

**Fase del PLAN.md:** Fase 5 (Propiedades de base de datos)

---

## Nuevos Frames Agregados

### 24. Login Screen (`O49J5`)

**Descripcion:** Pantalla de login a dos paneles. Panel izquierdo oscuro con branding (logo "N" con gradiente verde, titulo "Notion Clone", tagline, lista de features con checkmarks). Panel derecho con formulario: boton Google OAuth, separador "or", campos email y password con labels, link "Forgot password?", boton "Sign in" verde, y link a signup.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Login con email/password | PLAN Fase 1 | Completo |
| Login con Google OAuth | PLAN Fase 1 | Completo |
| Forgot password link | PLAN Fase 1 | Visible |
| Navegacion a signup | PLAN Fase 1 | Visible |

**Fase del PLAN.md:** Fase 1 (Auth)

---

### 25. Signup Screen (`gUxNv`)

**Descripcion:** Pantalla de registro a dos paneles (mismo branding izquierdo). Formulario con: Google OAuth, campos nombre/email/password, checkbox de terminos de servicio, boton "Create account", y link a login.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Registro con email/password | PLAN Fase 1 | Completo |
| Registro con Google OAuth | PLAN Fase 1 | Completo |
| Aceptacion de terminos | PLAN Fase 1 | Visible |
| Navegacion a login | PLAN Fase 1 | Visible |

**Fase del PLAN.md:** Fase 1 (Auth)

---

### 26. Floating Toolbar (`Yiivo`)

**Descripcion:** Toolbar flotante que aparece al seleccionar texto. Botones: Bold (activo), Italic, Underline, Strikethrough | Code, Link | Color (A verde) | Highlight | Turn into (dropdown) | Comment. Separadores visuales entre grupos.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Formato Bold/Italic/Underline/Strike | 1.2 | Completo |
| Inline code | 1.2 | Visible |
| Links | 1.2 | Visible |
| Color de texto | 1.2 | Visible |
| Highlight/fondo | 1.2 | Visible |
| Turn into (cambiar tipo) | 1.5 | Visible - dropdown |
| Comentario inline | 4.4 | Visible |

**Fase del PLAN.md:** Fase 2 (Editor basico)

---

### 27. Block Drag Handle Menu (`mBoX2`)

**Descripcion:** Menu contextual del drag handle de bloques. Header "Drag to move" con icono grip. Opciones: Turn into (submenu), Color (submenu), | Duplicate, Copy link to block, Move to, Comment | Delete (rojo).

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Drag to move | 4.5 | Completo |
| Turn into | 1.5 | Visible - con submenu |
| Color de bloque | 1.2 | Visible - con submenu |
| Duplicar bloque | 1.5 | Visible |
| Copy link to block | 1.5 | Visible |
| Mover bloque | 1.5 | Visible |
| Comentar bloque | 4.4 | Visible |
| Eliminar bloque | 1.5 | Visible - en rojo |

**Fase del PLAN.md:** Fase 2 (Editor basico), Fase 3 (Bloques avanzados)

---

### 28. Comments Panel (`QlwDt`)

**Descripcion:** Panel lateral de comentarios con header (icono, titulo "Comments", badge "3", boton cerrar). Lista de comentarios con avatar, nombre, tiempo, texto del comentario, y acciones Reply/Resolve. Comentario resuelto con icono check. Input de nuevo comentario con boton send verde.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Panel de comentarios | 4.4 | Completo |
| Comentarios con autor y tiempo | 4.4 | Visible |
| Reply a comentarios | 4.4 | Visible |
| Resolver comentarios | 4.4 | Visible |
| Comentarios resueltos | 4.4 | Visible |
| Input de nuevo comentario | 4.4 | Visible |

**Fase del PLAN.md:** Fase 8 (Colaboracion)

---

### 29. Image Block Controls (`u2gr3`)

**Descripcion:** Bloque de imagen con toolbar superior (alineacion izq/centro/der/full, | descargar, eliminar), imagen con handles de resize en ambos lados, y caption editable debajo.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Bloque imagen | 1.3 | Completo |
| Resize con handles | 1.3 | Visible |
| Alineacion de imagen | 1.3 | Visible - 4 opciones |
| Caption | 1.3 | Visible |
| Descargar/eliminar | 1.3 | Visible |

**Fase del PLAN.md:** Fase 3 (Bloques avanzados)

---

### 30. Code Block (`K9E8e`)

**Descripcion:** Bloque de codigo con header (icono, selector de lenguaje "JavaScript" con dropdown, wrap toggle, copy). Body con numeros de linea y syntax highlighting (colores Material theme: purple, white, blue, orange, yellow).

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Bloque code | 1.1 | Completo |
| Selector de lenguaje | 1.1 | Visible - dropdown |
| Syntax highlighting | 1.1 | Visible - colores por token |
| Numeros de linea | 1.1 | Visible |
| Copy to clipboard | 1.1 | Visible |
| Word wrap toggle | 1.1 | Visible |

**Fase del PLAN.md:** Fase 2 (Editor basico)

---

### 31. Columns Layout (`Vtani`)

**Descripcion:** Layout de dos columnas con contenido independiente. Columna izquierda con heading, parrafo y lista con bullets. Columna derecha con heading y metricas numericas con labels. Label "Two-column layout" superior.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Columns / multi-columna | 1.4 | Completo - 2 columnas |
| Contenido mixto por columna | 1.4 | Visible |

**Fase del PLAN.md:** Fase 3 (Bloques avanzados)

---

### 32. Cover Picker (`taukb`)

**Descripcion:** Dialogo de seleccion de cover con header, tabs (Gradients activo, Colors, Photos, Upload), grid 3x3 de gradientes de colores, y boton "Remove cover" en rojo.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Selector de cover | 4.2 | Completo |
| Gradientes predeterminados | 4.2 | Visible - 9 opciones |
| Tabs por tipo (colores, fotos, upload) | 4.2 | Visible |
| Remover cover | 4.2 | Visible |

**Fase del PLAN.md:** Fase 4 (Personalizacion de paginas)

---

### 33. List View (`MuwAM`)

**Descripcion:** Vista de lista completa con sidebar. Toolbar con filter, sort, y boton + New. Lista de items con checkbox, icono, titulo, tag de status (colores), y fecha. Item completado con strikethrough y checkbox verde. Boton "+ New" al final.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Vista List | 2.1 | Completo |
| Checkbox por item | 2.1 | Visible |
| Tags de status con colores | 2.2 | Visible |
| Item completado (strikethrough) | 2.1 | Visible |
| Filter y Sort | 2.3-2.4 | Visible |
| Agregar nuevo item | 2.1 | Visible |

**Fase del PLAN.md:** Fase 5 (Base de datos - vistas)

---

### 34. Page Side Peek (`LV8es`)

**Descripcion:** Vista de side peek con sidebar, background dimmed mostrando la tabla original, y panel lateral derecho (480px) con: header "Open as full page" + close, icono de pagina, titulo, propiedades (Status, Priority, Assignee con avatar, Due Date), divider, y contenido de texto.

**Funcionalidades cubiertas:**

| Funcionalidad | Seccion | Estado |
|---------------|---------|--------|
| Side peek / panel lateral | 2.1 | Completo |
| Propiedades de pagina en peek | 2.2 | Visible - 4 propiedades |
| Open as full page | 2.1 | Visible |
| Background dimming | 2.1 | Visible |

**Fase del PLAN.md:** Fase 5 (Base de datos), Fase 6 (Vistas avanzadas)

---

## Componentes Reutilizables

### C1. SideNavItem (`DRL2Z`)
- **Uso:** Item de navegacion inactivo en sidebar
- **Elementos:** Icono + texto "Nav Item"
- **Usado en:** Todas las vistas con sidebar (Home, Inbox, Settings, etc.)

### C2. SideNavItemActive (`7Gjel`)
- **Uso:** Item de navegacion activo en sidebar (fondo oscuro destacado)
- **Elementos:** Icono + texto "Active Item"
- **Usado en:** Todas las vistas para indicar seccion actual

### C3. PageItem (`127FY`)
- **Uso:** Item de pagina en el arbol del sidebar
- **Elementos:** Flecha expandir + icono pagina + texto "Page Name"
- **Usado en:** Sidebar - secciones Favorites, Private, Shared

### C4. GreenButton (`UGS48`)
- **Uso:** Boton primario de accion
- **Elementos:** Icono "+" + texto "New" sobre fondo verde
- **Usado en:** Database toolbar, acciones principales

### C5. SectionLabel (`e4Ofd`)
- **Uso:** Label de seccion con accion
- **Elementos:** Texto "Section" + boton "+"
- **Usado en:** Sidebar - headers de Favorites, Private, Shared, Projects

---

## Analisis de Cobertura

### Funcionalidades CUBIERTAS por los disenos

| Area | Cobertura | Detalles |
|------|-----------|----------|
| **Auth (Login/Signup)** | Alta | Login y Signup con Google OAuth, email/password, branding |
| **Editor basico** | Alta | Texto, headings, listas, to-do, callout, tabla en Main Editor |
| **Floating toolbar** | Alta | Bold, italic, underline, strike, code, link, color, highlight, turn into, comment |
| **Drag handle menu** | Alta | Turn into, color, duplicate, copy link, move, comment, delete |
| **Bloque Image** | Alta | Toolbar alineacion, resize handles, caption |
| **Bloque Code** | Alta | Language selector, syntax highlighting, line numbers, copy, wrap |
| **Columns layout** | Alta | Dos columnas con contenido independiente |
| **Slash commands** | Media | Menu visible con bloques basicos y media, scroll implicito para mas |
| **Sidebar/Navegacion** | Alta | Completo con workspace, search, favoritos, privado, compartido, trash |
| **Home/Dashboard** | Alta | Recientes, jump back in |
| **Busqueda** | Alta | Modal con filtros, recientes, acciones rapidas |
| **Base de datos - Table** | Alta | Columnas tipadas, propiedades visibles |
| **Base de datos - Board** | Alta | Kanban con columnas, tarjetas, tags |
| **Base de datos - Gallery** | Alta | Tarjetas con previews, tags |
| **Base de datos - Calendar** | Alta | Grid mensual con eventos |
| **Base de datos - Timeline** | Alta | Gantt con barras temporales |
| **Base de datos - List** | Alta | Lista con checkboxes, tags, fechas, strikethrough |
| **Page Side Peek** | Alta | Panel lateral con propiedades y contenido |
| **Filtros y Sorts** | Alta | Panel completo con logica compuesta |
| **Compartir** | Alta | Dialog con roles, web publishing, copy link |
| **Mover pagina** | Alta | Dialog con busqueda y sugerencias |
| **Eliminar** | Alta | Confirmacion + Trash view completo |
| **Settings** | Media | Perfil, tema, notificaciones basicas |
| **Notificaciones/Inbox** | Alta | Tabs, agrupacion temporal, tipos de notificacion |
| **Notion AI** | Alta | Chat con acciones, respuestas formateadas |
| **Templates** | Alta | Galeria por categorias con previews |
| **Toasts** | Alta | 3 variantes (success, error, info + undo) |
| **Cover picker** | Alta | Gradientes, tabs colores/fotos/upload, remove |
| **Icon picker** | Alta | Emoji picker completo, tabs para icons/upload |
| **Comentarios** | Alta | Panel con replies, resolve, input, resolved state |
| **Context Menu** | Alta | Todas las acciones de pagina |
| **Members Picker** | Alta | Busqueda, lista, invitar |

### Funcionalidades restantes (implementar sin diseno dedicado)

| # | Funcionalidad | Seccion | Impacto | Nota |
|---|--------------|---------|---------|------|
| 1 | **Bloque Quote** | 1.1 | Bajo | Borde izquierdo + texto indentado. Patron simple. |
| 2 | **Bloque Divider** | 1.1 | Bajo | Linea horizontal. |
| 3 | **Bloque Toggle** | 1.1 | Bajo | Flecha expandible (ya en PageItem). |
| 4 | **Bloque Equation (KaTeX)** | 1.4 | Bajo | Nicho, formula renderizada. |
| 5 | **Bloque Bookmark/Embed** | 1.3 | Medio | Card con preview de URL. |
| 6 | **Synced blocks** | 1.4 | Bajo | Borde especial + icono sync. |
| 7 | **Relaciones y Rollups** | 2.7 | Medio | UI compleja pero nicho. |
| 8 | **Formulas** | 2.6 | Bajo | Editor de formula en popover. |
| 9 | **Database templates** | 2.8 | Bajo | Template picker ya existe, adaptar. |
| 10 | **Sub-items y dependencias** | 2.9 | Bajo | Anidacion en vistas existentes. |
| 11 | **Teamspaces** | 3.3 | Medio | Extension del sidebar existente. |
| 12 | **Import/Export** | 3.7 | Bajo | Dialogos funcionales simples. |
| 13 | **Historial de cambios** | 4.8 | Medio | Timeline de versiones. Feature Pro. |
| 14 | **Colaboracion en tiempo real** | 4.9 | Medio | Cursores y presencia. Backend-driven. |
| 15 | **Web Clipper** | 4.12 | Bajo | Extension de navegador, fuera del scope. |
| 16 | **Atajos de teclado** | 4.1 | Bajo | Se implementan sin diseno. |
| 17 | **Responsive / Mobile** | 4.7 | Medio | Responsive via Tailwind breakpoints. |

---

## Resumen Ejecutivo

| Metrica | Valor |
|---------|-------|
| Total frames en diseno | 39 |
| Funcionalidades principales cubiertas | ~92% |
| Funcionalidades criticas sin diseno | 0 |
| Funcionalidades importantes sin diseno | 0 |
| Funcionalidades menores sin diseno (implementar con convenciones) | 17 |
| Vistas de DB cubiertas | 6/7 (todas excepto Board sub-vistas menores) |
| Fases del PLAN cubiertas | 10/10 |

El set de disenos es **completo y cubre todas las funcionalidades criticas e importantes del frontend**. Los 11 frames nuevos (Login, Signup, Floating Toolbar, Drag Handle Menu, Comments Panel, Image Block, Code Block, Columns Layout, Cover Picker, List View, Page Side Peek) eliminaron todas las brechas criticas. Las 17 funcionalidades restantes son menores y se pueden implementar siguiendo los patrones visuales ya establecidos sin necesidad de diseno adicional.
