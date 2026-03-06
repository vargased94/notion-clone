# Notion - Documentación Completa de Funcionalidades

> Investigación exhaustiva de todas las funcionalidades de Notion, organizada por área.

---

## Tabla de Contenidos

1. [Editor y Bloques](#1-editor-y-bloques)
   - [Bloques de Texto](#11-bloques-de-texto)
   - [Formato Inline y Menciones](#12-formato-inline-y-menciones)
   - [Bloques de Media](#13-bloques-de-media)
   - [Bloques Avanzados](#14-bloques-avanzados)
   - [Comportamiento del Editor](#15-comportamiento-del-editor)
2. [Bases de Datos](#2-bases-de-datos)
   - [Vistas de Base de Datos](#21-vistas-de-base-de-datos)
   - [Tipos de Propiedades](#22-tipos-de-propiedades)
   - [Filtros](#23-filtros)
   - [Ordenamiento (Sorts)](#24-ordenamiento-sorts)
   - [Agrupación (Groups)](#25-agrupación-groups)
   - [Fórmulas](#26-fórmulas)
   - [Relaciones y Rollups](#27-relaciones-y-rollups)
   - [Plantillas de Base de Datos](#28-plantillas-de-base-de-datos)
   - [Sub-items y Dependencias](#29-sub-items-y-dependencias)
3. [Workspace y Organización](#3-workspace-y-organización)
   - [Sidebar / Navegación](#31-sidebar--navegación)
   - [Páginas y Subpáginas](#32-páginas-y-subpáginas)
   - [Workspace y Teamspaces](#33-workspace-y-teamspaces)
   - [Compartir y Permisos](#34-compartir-y-permisos)
   - [Búsqueda](#35-búsqueda)
   - [Favoritos y Recientes](#36-favoritos-y-recientes)
   - [Importar / Exportar](#37-importar--exportar)
   - [Plantillas](#38-plantillas)
   - [Papelera (Trash)](#39-papelera-trash)
   - [Integraciones y API](#310-integraciones-y-api)
   - [Notion AI](#311-notion-ai)
4. [UI/UX y Personalización](#4-uiux-y-personalización)
   - [Atajos de Teclado](#41-atajos-de-teclado)
   - [Personalización de Páginas](#42-personalización-de-páginas)
   - [Temas (Modo Claro/Oscuro)](#43-temas-modo-clarooscuro)
   - [Comentarios y Discusiones](#44-comentarios-y-discusiones)
   - [Drag & Drop](#45-drag--drop)
   - [Menús Contextuales](#46-menús-contextuales)
   - [Responsive / Mobile](#47-responsive--mobile)
   - [Historial de Cambios](#48-historial-de-cambios)
   - [Colaboración en Tiempo Real](#49-colaboración-en-tiempo-real)
   - [Notificaciones](#410-notificaciones)
   - [Configuración de Cuenta y Planes](#411-configuración-de-cuenta-y-planes)
   - [Web Clipper](#412-web-clipper)

---

## 1. Editor y Bloques

Notion trata **todo como un bloque**. La estructura es un árbol donde una página es el nodo raíz, cada bloque puede tener bloques hijos (children), y cada bloque tiene un tipo, contenido (rich text), propiedades y metadatos (id, created_time, last_edited_time, created_by).

---

### 1.1 Bloques de Texto

#### Párrafo (Paragraph)

- Bloque más básico y tipo por defecto al escribir
- Texto plano con fuente regular, padding vertical sutil entre párrafos
- Soporta cualquier formato inline (negrita, itálica, subrayado, tachado, código, color)
- Se puede convertir a cualquier otro tipo de bloque mediante "Turn into"
- Creación: escribir directamente, `/text` o `/paragraph`

#### Heading 1 (H1)

- Título principal de sección, el encabezado más grande
- Texto en negrita, tamaño ~1.875em, color prominente
- Shortcut: `# ` + espacio, `/h1`, `Cmd/Ctrl + Shift + 1`
- Aparece en la Tabla de Contenidos
- Soporta modo **toggle** (colapsable) desde el menú del bloque

#### Heading 2 (H2)

- Subtítulo de sección
- Texto en negrita, tamaño ~1.5em
- Shortcut: `## ` + espacio, `/h2`, `Cmd/Ctrl + Shift + 2`

#### Heading 3 (H3)

- Sub-subtítulo
- Texto en negrita, tamaño ~1.25em
- Shortcut: `### ` + espacio, `/h3`, `Cmd/Ctrl + Shift + 3`

> Los tres niveles de heading soportan formato inline, aparecen en Table of Contents, y pueden activarse como toggle headings.

#### Lista con viñetas (Bulleted List)

- Lista no ordenada con marcadores circulares
- Bullet styles por nivel: círculo relleno → círculo vacío → cuadrado pequeño
- Nesting con `Tab` / `Shift+Tab`, múltiples niveles de anidación
- Se pueden anidar otros tipos de bloques dentro
- Shortcut: `- ` o `* ` al inicio, `/bullet`, `Cmd/Ctrl + Shift + 5`
- Enter crea nuevo item, Enter en item vacío sale de la lista

#### Lista numerada (Numbered List)

- Lista ordenada con numeración automática
- Estilos por nivel: números arábigos → letras minúsculas (a, b, c) → números romanos (i, ii, iii)
- Numeración automática que se recalcula al reordenar
- Shortcut: `1. ` al inicio, `/numbered`, `Cmd/Ctrl + Shift + 6`

#### Lista toggle (Toggle List)

- Bloque colapsable con título visible y contenido oculto
- Triángulo/flecha (▶) a la izquierda, rota a (▼) al expandir
- Contenido interno: cualquier tipo de bloque (párrafos, imágenes, listas, toggles anidados)
- El título soporta formato inline
- Shortcut: `> ` al inicio, `/toggle`, `Cmd/Ctrl + Shift + 7`

#### To-Do / Checkbox

- Lista de tareas con casillas de verificación
- Checkbox cuadrado a la izquierda; al marcar, texto con tachado y color gris
- Se pueden anidar (sub-tareas) con Tab
- Marcar el padre NO marca automáticamente los hijos
- Shortcut: `[] ` o `[x] ` al inicio, `/todo`, `Cmd/Ctrl + Shift + 4`

#### Quote (Cita)

- Bloque de cita visual con barra vertical gruesa a la izquierda
- Texto ligeramente más grande que párrafo normal
- Soporta múltiples líneas y bloques hijos
- Se puede convertir a callout y viceversa
- Shortcut: `" ` o `| ` al inicio, `/quote`

#### Callout

- Bloque destacado con icono y fondo de color
- Caja con fondo de color configurable, icono/emoji a la izquierda, bordes redondeados
- **Icono**: cualquier emoji o icono personalizado (clic para cambiar)
- **Color de fondo**: gris, marrón, naranja, amarillo, verde, azul, púrpura, rosa, rojo
- Puede contener múltiples bloques internos (actúa como mini-contenedor)
- Shortcut: `/callout`

#### Divider (Separador)

- Línea horizontal fina gris que ocupa todo el ancho del contenido
- Sin opciones configurables, puramente visual
- Shortcut: `---` (tres guiones) + Enter, `/divider`

#### Toggle Headings (Encabezados colapsables)

- Combinación de heading (H1, H2, H3) con funcionalidad toggle
- Igual que heading normal pero con flecha toggle (▶) a la izquierda
- Contenido colapsado puede ser cualquier tipo de bloque
- Shortcut: `/toggle heading 1`, `/toggle heading 2`, `/toggle heading 3`

---

### 1.2 Formato Inline y Menciones

#### Estilos de texto

| Estilo | Apariencia | Shortcut | Markdown |
|--------|-----------|----------|----------|
| **Negrita** | Texto con peso grueso | `Cmd/Ctrl + B` | `**texto**` |
| **Itálica** | Texto inclinado | `Cmd/Ctrl + I` | `*texto*` o `_texto_` |
| **Subrayado** | Línea debajo del texto | `Cmd/Ctrl + U` | — |
| **Tachado** | Línea horizontal a través | `Cmd/Ctrl + Shift + S` | `~~texto~~` |
| **Código inline** | Fuente mono, fondo gris | `Cmd/Ctrl + E` | `` `texto` `` |

Todos los estilos se pueden combinar (ej: negrita + itálica + subrayado simultáneamente).

#### Colores de texto y fondo

- **Colores disponibles para texto**: Default, gris, marrón, naranja, amarillo, verde, azul, púrpura, rosa, rojo
- **Colores disponibles para fondo/highlight**: mismos 10 colores como resaltado detrás del texto
- Se aplican seleccionando texto → menú flotante → botón "A" con color
- Shortcut: `Cmd/Ctrl + Shift + H` para último color usado
- Se pueden aplicar a nivel de bloque completo desde el menú `...`
- Un mismo párrafo puede tener múltiples colores en diferentes fragmentos

#### Links (Enlaces)

- Hipervínculos a URLs externas o páginas internas de Notion
- Texto subrayado con color azul/acento
- Preview en hover con título y miniatura del destino
- Shortcut: `Cmd/Ctrl + K`, o pegar URL sobre texto seleccionado

#### Mención de persona (@usuario)

- Referencia a un miembro del workspace
- Nombre del usuario con mini avatar, fondo sutil
- Escribir `@` + nombre → dropdown con sugerencias
- El usuario mencionado recibe notificación

#### Mención de página (@página)

- Referencia/link inline a otra página de Notion
- Muestra icono de la página + título
- Se actualiza automáticamente si la página se renombra
- Escribir `@` + nombre de la página

#### Mención de fecha (@fecha)

- Fecha formateada inline (ej: "March 5, 2026", "Today", "Yesterday")
- Fechas pasadas pueden mostrarse en rojo
- Escribir `@today`, `@tomorrow`, `@yesterday` o fecha específica
- Puede incluir hora, rango de fechas, y **recordatorios** (remind)
- Opciones de remind: al momento, 5/10/15/30 min antes, 1/2 horas antes, 1/2 días antes, 1 semana antes

#### Ecuaciones inline

- Fórmulas matemáticas renderizadas con KaTeX/LaTeX dentro del texto
- Soporta: fracciones, raíces, matrices, símbolos griegos, integrales, sumatorios
- Shortcut: `Cmd/Ctrl + Shift + E` o `$$` inline
- Clic en la ecuación renderizada abre campo de edición con preview en tiempo real

---

### 1.3 Bloques de Media

#### Imagen (Image)

- Inserción: subir archivo, pegar URL, pegar/arrastrar desde clipboard
- Redimensionado con handles laterales (mantiene aspect ratio)
- Alineación: izquierda, centro, ancho completo
- Caption (pie de foto) con formato inline
- Clic para lightbox/pantalla completa
- Formatos: JPEG, PNG, GIF, SVG, WebP
- Shortcut: `/image`, arrastrar archivo, pegar desde clipboard

#### Video

- Subir archivo o pegar URL (YouTube, Vimeo, etc.)
- Player embebido con controles de reproducción
- Para URLs de YouTube/Vimeo: player del servicio
- Para archivos subidos: player nativo de Notion
- Caption y redimensionado disponibles
- Formatos upload: MP4, MOV
- Shortcut: `/video`

#### Audio

- Player compacto con barra de progreso, play/pause, indicador de tiempo
- Subir archivo o URL (Spotify, SoundCloud via embed)
- Formatos: MP3, WAV, OGG, M4A
- Shortcut: `/audio`

#### Archivo adjunto (File)

- Icono + nombre + tamaño, bloque rectangular con borde
- Cualquier tipo de archivo, descarga directa
- Sin preview inline (solo nombre e icono)
- Límite: 5MB en plan gratuito, sin límite en planes de pago
- Shortcut: `/file`

#### Bookmark (Web Bookmark)

- Tarjeta con metadatos Open Graph: título, descripción, favicon, thumbnail, URL
- Se genera automáticamente al pegar URL y elegir "Create bookmark"
- Clic abre la URL en nueva pestaña
- Shortcut: `/bookmark`

#### Embeds

Notion soporta embeds interactivos de numerosos servicios:

| Servicio | Descripción |
|----------|-------------|
| **YouTube** | Player de video completo |
| **Twitter/X** | Tweet renderizado con avatar, texto, imágenes |
| **Google Maps** | Mapa interactivo (zoom, navegación) |
| **Google Drive** | Preview de Docs, Sheets, Slides, Forms |
| **Figma** | Preview interactivo del diseño |
| **GitHub Gist** | Código con syntax highlighting |
| **CodePen** | Preview interactivo |
| **Spotify** | Player embebido |
| **Miro** | Tablero interactivo |
| **Loom** | Video embebido con player |
| **Typeform** | Formularios interactivos |
| **PDF** | Viewer con navegación de páginas |
| **Excalidraw** | Diagramas de pizarra |
| **Replit** | Entorno de código interactivo |
| **Framer** | Prototipos interactivos |
| **Whimsical** | Diagramas y wireframes |

- Todos redimensionables, con caption opcional
- Embed genérico disponible para cualquier URL via iframe
- Shortcut: `/embed`, `/youtube`, `/twitter`, `/figma`, etc.

---

### 1.4 Bloques Avanzados

#### Tabla simple (Simple Table)

- Grid de celdas con bordes finos (NO es base de datos)
- **Header row**: fila de cabecera con fondo gris y texto en negrita (activable)
- **Header column**: columna de cabecera (activable)
- Agregar filas/columnas con botón `+` o menú contextual
- Reordenar y redimensionar columnas arrastrando
- Celdas soportan texto con formato inline (NO bloques complejos)
- Tab para moverse entre celdas, Enter crea nueva fila
- Shortcut: `/table` (tabla simple) vs `/table view` (base de datos)

#### Base de datos inline (Inline Database)

- Base de datos completa embebida dentro de una página
- Tabla con cabeceras tipadas, barra de herramientas con filtros, ordenamiento y vistas
- ~20+ tipos de propiedades (ver sección 2.2)
- 6-7 vistas: Table, Board, List, Calendar, Timeline, Gallery, Chart
- Cada fila es una página de Notion que se abre al hacer clic
- Se puede convertir a base de datos de página completa y viceversa
- Shortcut: `/database`, `/table view`, `/board view`, `/timeline`, `/calendar`, `/list view`, `/gallery`

#### Bloque de código (Code Block)

- Fondo gris/oscuro, fuente monoespaciada, syntax highlighting
- Etiqueta de lenguaje en esquina superior derecha
- Botón de copiar código al clipboard
- Word wrap activable/desactivable
- **Mermaid**: si se selecciona como lenguaje, renderiza diagramas

**Lenguajes soportados** (lista parcial):
ABAP, Arduino, Bash, C, C++, C#, Clojure, CoffeeScript, CSS, Dart, Docker, Elixir, Elm, Erlang, F#, Go, GraphQL, Groovy, Haskell, HTML, Java, JavaScript, JSON, Julia, Kotlin, LaTeX, Less, Lisp, Lua, Makefile, Markdown, MATLAB, Mermaid, Nix, Objective-C, OCaml, Pascal, Perl, PHP, PowerShell, Prolog, Python, R, Ruby, Rust, Sass, Scala, Scheme, SCSS, Shell, SQL, Swift, TypeScript, VB.Net, VHDL, WebAssembly, XML, YAML

- Shortcut: `/code` o ` ``` ` (triple backtick)

#### Tabla de Contenidos (Table of Contents)

- Genera automáticamente un índice basado en H1, H2, H3
- Lista indentada de links clickeables
- Se actualiza en tiempo real al agregar/eliminar/renombrar headings
- Color de texto configurable
- Shortcut: `/toc` o `/table of contents`

#### Breadcrumb

- Ruta de navegación jerárquica de la página actual
- Links separados por `/`: Workspace > Página padre > ... > Página actual
- Cada nivel muestra icono y título, es clickeable
- Shortcut: `/breadcrumb`

#### Bloques sincronizados (Synced Blocks)

- Contenido sincronizado en tiempo real entre múltiples páginas
- Borde rojo/naranja con indicador "Synced block"
- Las copias muestran "Synced from [página original]"
- Editar en cualquier instancia actualiza todas las demás
- Se puede "unsync" una copia para hacerla independiente
- Contenido interno: cualquier tipo de bloque
- Shortcut: `/synced` o `/synced block`

#### Button (Botón)

- Botón clickeable que ejecuta acciones configuradas
- Texto y opcionalmente icono personalizables
- **Acciones configurables**:
  - Insert blocks (insertar bloques predefinidos)
  - Add page to database (crear página con propiedades predefinidas)
  - Edit pages in database (modificar propiedades de páginas existentes)
  - Show confirmation (diálogo de confirmación)
  - Encadenar múltiples acciones
- Shortcut: `/button`

#### Columnas (Columns)

- Layout en 2-5 columnas para contenido lado a lado
- Cada columna funciona como contenedor independiente
- Ancho ajustable arrastrando el divisor entre columnas
- Se crean arrastrando un bloque horizontalmente al lado de otro
- También con `/column` o seleccionando bloques → "Turn into columns"

#### Ecuación (Equation Block)

- Ecuación completa centrada (no inline), tamaño mayor
- Sintaxis LaTeX/KaTeX completa
- Caption opcional
- Shortcut: `/equation` o `$$` en línea nueva

#### Link to page

- Link visual prominente a otra página (bloque completo, no inline)
- Muestra icono + título de la página destino
- Shortcut: `/link to page`

#### Child page / Sub-page

- Crea nueva sub-página anidada dentro de la página actual
- Aparece en sidebar como página anidada
- Shortcut: `/page`

---

### 1.5 Comportamiento del Editor

#### Drag & Drop de bloques

- Handle de arrastre (`⋮⋮` - seis puntos) aparece al hover a la izquierda del bloque
- También aparece un `+` para agregar bloque nuevo
- Línea guía azul indica dónde se soltará el bloque:
  - **Horizontal**: entre bloques (reordenar)
  - **Indentado**: dentro de un bloque contenedor
  - **Vertical**: al lado de un bloque (crear columnas)
- Soporta arrastrar múltiples bloques seleccionados

#### Reordenar

- Drag & drop con handle
- `Cmd/Ctrl + Shift + Up/Down`: mover bloque arriba/abajo
- Cortar y pegar (`Cmd/Ctrl + X`, `Cmd/Ctrl + V`)
- Animación suave al reposicionar

#### Indentación / Nesting

- `Tab`: indentar (convertir en hijo del bloque anterior)
- `Shift + Tab`: des-indentar (subir un nivel)
- Especialmente útil con listas (bulleted, numbered, to-do, toggle)
- Bloques contenedores: toggles, callouts, quotes, synced blocks, columnas
- Sin límite de profundidad (impracticable después de 5-6 niveles)

#### Selección múltiple de bloques

- **Clic + arrastre vertical** desde margen izquierdo
- **Shift + clic**: seleccionar rango
- **Shift + Up/Down**: extender selección
- **Cmd/Ctrl + A**: seleccionar texto → presionar de nuevo → todos los bloques
- **Esc**: seleccionar bloque completo (sale del modo texto)
- **Acciones con selección múltiple**: eliminar, arrastrar, cambiar tipo, cambiar color, copiar/cortar, comentar, duplicar, mover, crear columnas

#### Menú Slash "/" (Slash Commands)

Al escribir `/` aparece menú dropdown con categorías:

**BASIC BLOCKS**: text, page, to-do, h1/h2/h3, table, bulleted/numbered list, toggle, quote, divider, link to page, callout

**INLINE**: mention, date, equation, emoji

**MEDIA**: image, video, audio, file, code, web bookmark

**DATABASE**: table view, board view, gallery view, list view, timeline view, calendar view

**EMBEDS**: embed, youtube, twitter, google drive, google maps, figma, github gist, pdf...

**ADVANCED**: table of contents, breadcrumb, synced block, button, toggle heading 1/2/3

- Búsqueda en tiempo real al escribir después del `/`
- Navegación con flechas, Enter para seleccionar, Esc para cerrar

#### Menú de formato flotante (Floating Toolbar)

Aparece al seleccionar texto, opciones:
- Turn into (cambiar tipo de bloque)
- Link (`Cmd/Ctrl + K`)
- Bold, Italic, Underline, Strikethrough, Code
- Equation (ecuación inline)
- Color (texto y fondo)
- Comment
- AI (pedir a la IA que procese el texto)

#### Markdown shortcuts (se convierten al escribir)

| Markdown | Resultado |
|----------|-----------|
| `# ` + espacio | Heading 1 |
| `## ` + espacio | Heading 2 |
| `### ` + espacio | Heading 3 |
| `- ` o `* ` | Bulleted list |
| `1. ` | Numbered list |
| `[] ` | To-do / Checkbox |
| `> ` | Quote / Toggle |
| `--- ` | Divider |
| ` ``` ` | Code block |
| `**texto**` | Negrita |
| `*texto*` | Itálica |
| `` `texto` `` | Código inline |
| `~~texto~~` | Tachado |
| `$$ecuación$$` | Ecuación inline (KaTeX) |

---

## 2. Bases de Datos

Notion permite crear múltiples vistas sobre una misma base de datos. Cada vista es una "ventana" diferente a los mismos datos, con sus propios filtros, ordenamientos y configuraciones.

---

### 2.1 Vistas de Base de Datos

#### Vista de Tabla (Table View)

- Vista por defecto, similar a hoja de cálculo
- Filas (registros) y columnas (propiedades)
- Redimensionar y reordenar columnas arrastrando
- Ocultar/mostrar columnas vía menú "Properties"
- "Wrap cells" para ajustar o truncar contenido
- Fijar columnas para scroll horizontal
- Edición inline directamente en celdas
- **Cálculos** en fila inferior: Count, Count values, Count unique, Count empty, Count not empty, Sum, Average, Median, Min, Max, Range, Percent empty, Percent not empty
- Selección múltiple de filas con Shift+click para operaciones masivas

#### Vista de Tablero / Kanban (Board View)

- Columnas verticales agrupadas por propiedad (Select, Status, etc.)
- Tarjetas arrastrables entre columnas (cambia el valor automáticamente)
- **Configuración**: Group by, Sub-group, Card preview (cover/content/files), Card size (S/M/L), Properties visibles, Hide empty groups, Color columns
- Ideal para flujos de trabajo (To Do → In Progress → Done)

#### Vista de Lista (List View)

- Vista más minimalista: lista vertical simple
- Título y opcionalmente propiedades a la derecha
- Ideal para listas de lectura, notas, bookmarks

#### Vista de Calendario (Calendar View)

- Registros distribuidos en calendario mensual o semanal
- Posicionados según propiedad de tipo Date
- Arrastrar registro a otro día cambia la fecha
- Clic en un día crea registro con fecha pre-asignada
- Registros con rango de fechas se muestran como barras multi-día
- Configuración: Show calendar by, vista mensual/semanal, Start week on

#### Vista de Línea de Tiempo / Timeline (Gantt)

- Eje horizontal de tiempo con barras de duración
- Tabla lateral izquierda con propiedades configurables
- Escalas: Hours, Days, Weeks, Bi-weekly, Months, Quarters, Years
- Arrastrar extremos de barras cambia fechas
- Dependencias con flechas entre registros
- Requiere propiedad de tipo Date con inicio y fin

#### Vista de Galería (Gallery View)

- Cuadrícula de tarjetas con imagen prominente
- Card preview: Page cover, Page content, o Files & media
- Card size: S/M/L, Fit image (crop vs fit)
- Ideal para portafolios, catálogos, directorios

#### Vista de Chart (Gráfico)

- Barras verticales/horizontales, líneas, donut
- Eje X: propiedad de agrupación
- Eje Y: cálculo (count, sum, average, etc.)

#### Configuración común a todas las vistas

Cada vista tiene su propio conjunto independiente de: filtros, ordenamientos, propiedades visibles, agrupación y layout.

---

### 2.2 Tipos de Propiedades

| Propiedad | Descripción | Editable |
|-----------|-------------|----------|
| **Title** | Nombre del registro, obligatoria, una por BD. Link a la página | Sí |
| **Text** | Texto libre con formato (bold, italic, links, etc.) | Sí |
| **Number** | Valor numérico. Formatos: número, moneda (USD, EUR, etc.), porcentaje | Sí |
| **Select** | UNA opción de lista predefinida. Tags con colores (10 colores) | Sí |
| **Multi-Select** | MÚLTIPLES opciones. Tags/chips coloreados | Sí |
| **Status** | Tres categorías: To-do, In progress, Complete (renombrables). Colores automáticos | Sí |
| **Date** | Fecha con hora opcional, rango (End date), zona horaria, recordatorios | Sí |
| **Person** | Asignar miembros del workspace (uno o más) | Sí |
| **Files & Media** | Subir archivos o pegar URLs. Imágenes, PDFs, videos, etc. | Sí |
| **Checkbox** | Booleano: marcado/no marcado | Sí |
| **URL** | URL clickeable | Sí |
| **Email** | Dirección de email (clickeable con mailto:) | Sí |
| **Phone** | Número de teléfono | Sí |
| **Formula** | Cálculo basado en otras propiedades | No (auto) |
| **Relation** | Vínculo con registros de otra BD (o misma) | Sí |
| **Rollup** | Agregación de datos de una Relation | No (auto) |
| **Created Time** | Fecha/hora de creación | No (auto) |
| **Created By** | Usuario que creó el registro | No (auto) |
| **Last Edited Time** | Última edición | No (auto) |
| **Last Edited By** | Último editor | No (auto) |
| **Unique ID** | ID auto-incremental con prefijo personalizable (ej: "TASK-142") | No (auto) |
| **Button** | Botón que ejecuta acciones configuradas al clic | Config |

---

### 2.3 Filtros

#### Mecanismo general

- Cada filtro: **Propiedad** + **Operador** + **Valor**
- Filtros por vista (cada vista tiene los suyos)
- Se aplican en tiempo real

#### Operadores por tipo de propiedad

**Texto (Title, Text, URL, Email, Phone)**:
- Is / Is not, Contains / Does not contain, Starts with / Ends with, Is empty / Is not empty

**Número (Number)**:
- = / ≠ / > / < / ≥ / ≤, Is empty / Is not empty

**Select**:
- Is / Is not, Is empty / Is not empty

**Multi-Select**:
- Contains / Does not contain, Is empty / Is not empty

**Status**:
- Is / Is not, Is empty / Is not empty

**Date (Date, Created Time, Last Edited Time)**:
- Is, Is before / Is after, Is on or before / Is on or after
- Is within (past week, past month, next week, today, tomorrow, etc.)
- Is empty / Is not empty

**Person**:
- Contains / Does not contain, Is empty / Is not empty
- Valor especial **"Me"**: dinámico, se resuelve al usuario actual

**Checkbox**:
- Is: checked / unchecked

**Files & Media / Relation**:
- Contains / Does not contain (Relation), Is empty / Is not empty

#### Filtros compuestos (AND / OR)

- **AND** (por defecto): todos deben cumplirse
- **OR**: al menos uno debe cumplirse
- Clic en conector para alternar AND ↔ OR
- **Grupos anidados** para lógica compleja:
  - Ejemplo: `(Status IS "In Progress" AND Priority IS "High") OR (Status IS "To-do" AND Assignee IS "Me")`

---

### 2.4 Ordenamiento (Sorts)

- Cada criterio: **Propiedad** + **Dirección** (Ascending / Descending)
- Múltiples criterios con orden de prioridad (reordenables arrastrando)
- **Ascending**: A-Z, menor→mayor, antiguo→reciente, unchecked primero
- **Descending**: Z-A, mayor→menor, reciente→antiguo, checked primero
- Select/Status: según orden definido en opciones de la propiedad
- El sort manual (drag & drop de filas) se desactiva cuando hay sorts activos
- Sorts son por vista (independientes)

---

### 2.5 Agrupación (Groups)

- Agrupa registros por valores de una propiedad
- Encabezado colapsable con conteo de registros

**Propiedades para agrupar**: Select, Status, Multi-select, Person, Checkbox, Date (por día/semana/mes/año), Number (rangos), Created by, Last edited by, Relation, etc.

**Opciones**: Hide empty groups, Color groups, Sort groups (Alphabetical/Manual/Reverse), Visible groups, Colapsar/expandir individualmente

**Sub-grupos**: segundo nivel de agrupación anidado. Ejemplo: agrupar por Status y sub-agrupar por Priority.

---

### 2.6 Fórmulas

#### Sintaxis (Formulas 2.0)

```javascript
// Referencias a propiedades
prop("Property Name")

// Variables
let myVar = prop("Price") * prop("Quantity")
myVar + 10

// Condicionales
if (prop("Status") == "Done") {
    "Complete"
} else {
    "Not Started"
}

// Operadores: +, -, *, /, ==, !=, >, <, >=, <=, and, or, not
```

#### Funciones disponibles

**Lógica**: `if()`, `ifs()`, `empty()`, `not()`, `and()`, `or()`

**Texto**: `concat()`, `join()`, `length()`, `contains()`, `test()` (regex), `match()`, `replace()`, `replaceAll()`, `lower()`, `upper()`, `repeat()`, `slice()`, `format()`, `toNumber()`, `trim()`, `padStart()`, `padEnd()`, `link()`, `style()` (bold, italic, etc.), `split()`

**Matemáticas**: `abs()`, `ceil()`, `floor()`, `round()`, `sqrt()`, `pow()`, `log10()`, `log2()`, `ln()`, `exp()`, `sign()`, `min()`, `max()`, `pi()`, `e()`

**Fecha/Tiempo**: `now()`, `today()`, `minute()`, `hour()`, `day()`, `date()`, `week()`, `month()`, `year()`, `dateAdd()`, `dateSubtract()`, `dateBetween()`, `dateRange()`, `dateStart()`, `dateEnd()`, `formatDate()`, `parseDate()`, `fromTimestamp()`, `timestamp()`

**Listas**: `at()`, `first()`, `last()`, `flat()`, `filter()`, `map()`, `find()`, `findIndex()`, `every()`, `some()`, `sort()`, `reverse()`, `includes()`, `unique()`, `length()`, `sum()`, `min()`, `max()`, `average()`, `median()`, `join()`, `slice()`, `concat()`

**Misc**: `id()` (UUID interno del registro)

#### Tipos de retorno

Text (string), Number, Boolean (se muestra como checkbox), Date, List, Person

---

### 2.7 Relaciones y Rollups

#### Relaciones (Relations)

- Vincula registros de una BD con registros de otra (o la misma)
- **Bidireccional**: crea propiedad recíproca en BD destino automáticamente
- **Unidireccional**: solo la BD origen muestra la relación
- Opción de limitar a un solo registro vinculado (uno-a-uno)
- Registros vinculados como chips clickeables
- Muchos-a-muchos por defecto
- **Self-relation**: vincular registros dentro de la misma BD (base para sub-items)

#### Rollups

Calcula valor agregado a partir de registros vinculados via Relation.

**Configuración**: Seleccionar relación → propiedad a agregar → cálculo

**Cálculos disponibles**:

| Categoría | Cálculos |
|-----------|----------|
| **Cualquier tipo** | Count all, Count values, Count unique, Count empty, Count not empty, Percent empty, Percent not empty, Show original, Show unique |
| **Numéricos** | Sum, Average, Median, Min, Max, Range |
| **Fecha** | Earliest date, Latest date, Date range |
| **Checkbox** | Checked, Unchecked, Percent checked, Percent unchecked |

Los rollups pueden encadenarse (un rollup referencia otro rollup o fórmula).

---

### 2.8 Plantillas de Base de Datos

- Templates que pre-llenan propiedades y contenido al crear un registro
- Acceso desde dropdown junto al botón "New"
- Valores predeterminados para cualquier propiedad
- Opción dinámica "Template creator" en propiedades Person
- **Template por defecto**: se aplica al hacer clic en "New" (configurable por vista)
- **Template repetitiva**: crea registros automáticamente (Daily, Weekly, Biweekly, Monthly, Yearly)
- Múltiples templates por BD, cada una con contenido diferente
- Los cambios en template no afectan registros ya creados

---

### 2.9 Sub-items y Dependencias

#### Sub-items

- Jerarquías padre-hijo dentro de una misma BD
- Se activa desde menú `...` > "Sub-items"
- Crea automáticamente propiedades: Parent item y Sub-items (self-relation)
- En tabla: toggle/indent nativo con flechas de expansión
- Se puede arrastrar un item para hacerlo sub-item de otro
- Sin límite práctico de niveles de anidamiento

#### Dependencias

- Relaciones de precedencia (blocking / blocked by)
- Se activa desde menú `...` > "Dependencies"
- Crea propiedades: Blocking y Blocked by
- **En Timeline**: flechas entre barras, se crean arrastrando conectores
- **Shift dependent dates**: al mover un bloqueante, ajusta fechas de dependientes automáticamente
- Múltiples dependencias por registro

---

## 3. Workspace y Organización

---

### 3.1 Sidebar / Navegación

#### Estructura del sidebar

| Sección | Descripción |
|---------|-------------|
| **Encabezado** | Nombre e icono del workspace, cambio entre workspaces, Settings |
| **Search** | Búsqueda global (`Cmd+K` / `Ctrl+K`) |
| **Home** | Vista de inicio con páginas recientes y sugerencias |
| **Inbox** | Notificaciones y menciones pendientes |
| **Favorites** | Páginas marcadas como favoritas (personal por usuario) |
| **Teamspaces** | Espacios de equipo con sus páginas |
| **Shared** | Páginas compartidas directamente |
| **Private** | Páginas privadas del usuario |
| **Trash** | Papelera (parte inferior) |
| **New Page** | Botón de creación rápida (parte inferior) |

#### Funcionalidades

- Colapsar/expandir: `Cmd+\` / `Ctrl+\` o arrastrar borde
- Cada página con subpáginas muestra chevron expandible
- Secciones (Favorites, Private, Shared) colapsables
- Drag & drop: reordenar, anidar, mover entre secciones
- Indicador visual (línea azul) al arrastrar
- **Breadcrumbs** en parte superior de cada página (ruta clickeable)
- **Back/Forward**: `Cmd+[` / `Cmd+]`

---

### 3.2 Páginas y Subpáginas

#### Jerarquía

- Estructura de árbol infinitamente anidable
- Subpáginas creadas con `/page` o arrastrando en sidebar
- Páginas de nivel superior en Private, Shared, o Teamspace

#### Operaciones con páginas

| Operación | Método |
|-----------|--------|
| **Mover** | Menú `...` > "Move to", drag & drop en sidebar, clic derecho > "Move to" |
| **Duplicar** | Menú `...` > "Duplicate", `Cmd/Ctrl + D` |
| **Eliminar** | Menú `...` > "Delete" (va a Trash con todas las subpáginas) |
| **Bloquear** | Menú `...` > "Lock page" (solo Full access puede bloquear/desbloquear) |

#### Page History (Historial de versiones)

- Menú `...` > "Page history" o `Cmd+Shift+H`
- Lista cronológica de snapshots con usuario y fecha
- Preview y restauración de versiones anteriores
- Retención: Free 7 días, Plus 30 días, Business 90 días, Enterprise ilimitado

#### Database lock

- Bloquear estructura de BD (propiedades, vistas) manteniendo la capacidad de editar entradas individuales

---

### 3.3 Workspace y Teamspaces

#### Workspace

- Espacio independiente con contenido, miembros y configuración propios
- Un usuario puede pertenecer a múltiples workspaces
- URL propia (`workspace-name.notion.site`)

#### Roles

| Rol | Permisos |
|-----|----------|
| **Owner** | Control total: eliminar workspace, facturación, cambiar roles |
| **Admin** | Gestionar miembros, configuraciones, integraciones |
| **Member** | Crear páginas, editar donde tenga acceso, crear teamspaces |
| **Guest** | Solo acceso a páginas específicas invitadas, no ve sidebar completo |

#### Teamspaces

| Tipo | Visibilidad | Acceso |
|------|------------|--------|
| **Open** | Visible para todos | Cualquier miembro puede unirse |
| **Closed** | Visible para todos | Requiere invitación o solicitud |
| **Private** | Solo para miembros | Solo visible para miembros (Business/Enterprise) |

Permisos configurables por teamspace, teamspace owners, archivado de teamspaces.

---

### 3.4 Compartir y Permisos

#### Share to Web (Publicar)

- Genera URL pública (`*.notion.site`)
- Opciones: Allow editing, Allow comments, Allow duplicate as template, Search engine indexing
- **Custom domain** en planes de pago
- **Notion Sites**: publicar como sitio web con personalización (favicon, temas, navegación)

#### Niveles de permiso por página

| Nivel | Puede hacer |
|-------|-------------|
| **Full access** | Editar, compartir, eliminar, cambiar permisos |
| **Can edit** | Editar contenido, no cambiar permisos |
| **Can edit content** | (BD) Editar entradas, no estructura |
| **Can comment** | Solo leer y comentar |
| **Can view** | Solo lectura |

- Subpáginas **heredan** permisos del padre por defecto
- Se pueden sobreescribir individualmente
- Al mover una página, permisos se recalculan

---

### 3.5 Búsqueda

#### Quick Find (`Cmd+K` / `Ctrl+K`)

- Busca en: títulos, contenido de páginas, propiedades de BD
- Resultados instantáneos mientras se escribe
- Sin escribir: muestra páginas recientes
- También permite acceder a acciones (Dark mode, Export, etc.)

#### Filtros de búsqueda

- **Sort by**: Best matches, Last edited, Created
- **Created by** / **Last edited by**: filtrar por usuario
- **In**: buscar dentro de página o teamspace específico
- **Date**: filtrar por rango de fechas

#### Búsqueda en página

- `Cmd+F` / `Ctrl+F`: find & replace en página actual

---

### 3.6 Favoritos y Recientes

- Marcar como favorito: icono estrella, clic derecho > "Favorite", menú `...`
- Personales por usuario, sin límite, reordenables con drag & drop
- **Home**: muestra páginas recientes, sugeridas, y con actividad reciente
- **Quick Find**: muestra recientes al abrirse sin escribir

---

### 3.7 Importar / Exportar

#### Importar desde

| Fuente | Resultado en Notion |
|--------|-------------------|
| **Evernote** | Notebooks → páginas, notas → subpáginas |
| **Trello** | Tableros → BD Board view, tarjetas → entradas |
| **Asana** | Proyectos → BD, tareas → entradas |
| **Google Docs** | Documentos con formato básico preservado |
| **Confluence** | Espacios (via exportación HTML) |
| **Word (.docx)** | Documento formateado |
| **HTML** | Página convertida |
| **Markdown (.md)** | Páginas |
| **CSV** | Bases de datos/tablas |

#### Exportar

- **Página individual**: Menú `...` > "Export" → Markdown & CSV, HTML, PDF
- **Workspace completo**: Settings > "Export all workspace content" → ZIP (solo Admins/Owners)
- BD se exportan como CSV, páginas como Markdown, imágenes como archivos separados

---

### 3.8 Plantillas

- **Galería de plantillas** con miles de templates por categoría (Engineering, Design, Marketing, Education, Personal, etc.)
- Preview antes de usar, "Use this template" duplica al workspace
- Cualquier página se puede compartir como template con "Allow duplicate"

---

### 3.9 Papelera (Trash)

- Páginas eliminadas van a Trash (no eliminación permanente inmediata)
- Muestra: nombre, ubicación original, quién eliminó, fecha
- Búsqueda dentro de la papelera
- **Restaurar**: devuelve a ubicación original (o Private si padre fue eliminado)
- **Eliminar permanentemente** desde papelera
- Políticas de retención automática en Enterprise
- Guests solo ven sus propios elementos eliminados

---

### 3.10 Integraciones y API

#### Integraciones oficiales

| Servicio | Funcionalidad |
|----------|---------------|
| **Slack** | Notificaciones, previews de links, búsqueda |
| **Google Drive** | Embeber archivos, preview de links |
| **GitHub** | Preview de issues/PRs, sync de issues a BD |
| **GitLab** | Preview de MRs e issues |
| **Jira** | Sync de issues a BD |
| **Figma** | Preview interactivo de diseños |
| **Zoom** | Crear y vincular reuniones |
| **Loom** | Embed con preview |
| **Google Calendar** | Sync bidireccional |
| **Zapier / Make** | Automatización con cientos de servicios |

#### API de Notion

- **API REST pública** (`https://api.notion.com/v1/`)
- Auth: OAuth 2.0 o Internal Integration Tokens
- **Endpoints**: Pages (CRUD), Databases (CRUD + query con filtros/sorts), Blocks (CRUD), Users, Search, Comments
- Paginación cursor-based, Rate limit: 3 req/s
- SDK oficial: `@notionhq/client` (JS/TS)
- Versionado por fecha (header `Notion-Version`)

#### Notion Automations

- Automatizaciones nativas en BD
- **Triggers**: página añadida, propiedad cambia
- **Actions**: notificación Slack, editar propiedades, enviar email, agregar página a otra BD

---

### 3.11 Notion AI

#### En el editor

| Funcionalidad | Descripción |
|---------------|-------------|
| **Summarize** | Resumen conciso del contenido |
| **Translate** | Traducir a múltiples idiomas |
| **Improve writing** | Mejorar claridad, gramática, fluidez |
| **Make shorter/longer** | Acortar o expandir texto |
| **Change tone** | Profesional, casual, directo, amigable |
| **Simplify language** | Reescribir con vocabulario más sencillo |
| **Fix spelling & grammar** | Corrección ortográfica y gramatical |
| **Explain** | Explicar concepto o texto |
| **Draft with AI** | Generar contenido desde cero |
| **Continue writing** | Continuar texto donde se dejó |
| **Generate action items** | Extraer tareas de un texto |
| **Brainstorm ideas** | Generar ideas sobre un tema |
| **Create outline** | Generar esquema/estructura |

**Acceso**: Tecla `Space` en línea vacía, seleccionar texto + "Ask AI", `/AI`

#### Q&A (Notion AI Q&A)

- Preguntas en lenguaje natural sobre todo el contenido del workspace
- Busca en páginas accesibles al usuario, respeta permisos
- Respuestas con referencias/links a páginas fuente
- Acceso: `Cmd+J` o botón AI en sidebar

#### Autofill en BD

- Propiedad "AI Autofill" con prompt personalizado
- Ejecuta automáticamente al crear/editar o manualmente
- Puede referenciar otras propiedades de la misma entrada
- Usos: resumir, clasificar, extraer keywords, analizar sentimiento

#### AI Connectors

- Conecta con herramientas externas (Slack, Google Drive) para Q&A
- Notion como hub de conocimiento centralizado

#### Pricing

- Add-on de pago separado, por miembro por mes
- Disponible para todos los planes

---

## 4. UI/UX y Personalización

---

### 4.1 Atajos de Teclado

#### Formato de texto

| Acción | Mac | Windows/Linux |
|--------|-----|---------------|
| Negrita | `Cmd + B` | `Ctrl + B` |
| Itálica | `Cmd + I` | `Ctrl + I` |
| Subrayado | `Cmd + U` | `Ctrl + U` |
| Tachado | `Cmd + Shift + S` | `Ctrl + Shift + S` |
| Código inline | `Cmd + E` | `Ctrl + E` |
| Enlace | `Cmd + K` | `Ctrl + K` |
| Color texto/fondo | `Cmd + Shift + H` | `Ctrl + Shift + H` |

#### Bloques y contenido

| Acción | Mac | Windows/Linux |
|--------|-----|---------------|
| Nuevo bloque abajo | `Enter` | `Enter` |
| Nuevo bloque arriba | `Cmd + Shift + Enter` | `Ctrl + Shift + Enter` |
| Duplicar bloque | `Cmd + D` | `Ctrl + D` |
| Borrar bloque | `Delete` / `Backspace` | `Delete` / `Backspace` |
| Mover bloque arriba | `Cmd + Shift + Up` | `Ctrl + Shift + Up` |
| Mover bloque abajo | `Cmd + Shift + Down` | `Ctrl + Shift + Down` |
| Indentar | `Tab` | `Tab` |
| Des-indentar | `Shift + Tab` | `Shift + Tab` |
| Toggle expandir/colapsar | `Cmd + Enter` | `Ctrl + Enter` |
| Seleccionar bloque | `Esc` | `Esc` |
| Seleccionar todos | `Cmd + A` (x2) | `Ctrl + A` (x2) |

#### Turn into (convertir bloque)

| Shortcut | Tipo |
|----------|------|
| `Cmd/Ctrl + Shift + 0` | Texto |
| `Cmd/Ctrl + Shift + 1` | Heading 1 |
| `Cmd/Ctrl + Shift + 2` | Heading 2 |
| `Cmd/Ctrl + Shift + 3` | Heading 3 |
| `Cmd/Ctrl + Shift + 4` | To-do |
| `Cmd/Ctrl + Shift + 5` | Bulleted list |
| `Cmd/Ctrl + Shift + 6` | Numbered list |
| `Cmd/Ctrl + Shift + 7` | Toggle list |
| `Cmd/Ctrl + Shift + 8` | Code block |
| `Cmd/Ctrl + Shift + 9` | Page |

#### Navegación

| Acción | Mac | Windows/Linux |
|--------|-----|---------------|
| Búsqueda rápida | `Cmd + P` o `Cmd + K` | `Ctrl + P` o `Ctrl + K` |
| Ir atrás | `Cmd + [` | `Ctrl + [` |
| Ir adelante | `Cmd + ]` | `Ctrl + ]` |
| Toggle sidebar | `Cmd + \` | `Ctrl + \` |
| Nueva página | `Cmd + N` | `Ctrl + N` |
| Abrir en nueva pestaña | `Cmd + Click` | `Ctrl + Click` |

#### Otros

| Acción | Mac | Windows/Linux |
|--------|-----|---------------|
| Deshacer | `Cmd + Z` | `Ctrl + Z` |
| Rehacer | `Cmd + Shift + Z` | `Ctrl + Shift + Z` |
| Comentar | `Cmd + Shift + M` | `Ctrl + Shift + M` |
| Notion AI Q&A | `Cmd + J` | `Ctrl + J` |
| Page history | `Cmd + Shift + H` | `Ctrl + Shift + H` |
| Buscar en página | `Cmd + F` | `Ctrl + F` |

---

### 4.2 Personalización de Páginas

#### Cover Images (Imágenes de portada)

- "Add cover" al hover sobre la parte superior de la página
- **Galería de Notion**: Color & Gradient, NASA Archive, The Met Museum, Rijksmuseum, Japanese prints, WEBB Space Telescope
- **Upload**: subir imagen propia (JPG, PNG, GIF)
- **Link**: pegar URL de imagen externa
- **Unsplash**: búsqueda integrada
- **Reposition**: arrastrar para reposicionar verticalmente
- Tamaño recomendado: 1500px de ancho mínimo, ratio ~3:1

#### Iconos de página

- Selector completo de emojis con búsqueda
- Custom icons: subir imagen propia (280x280 px recomendado)
- Link: pegar URL de imagen como icono
- Botón "Random" para emoji aleatorio
- Aparece en sidebar, breadcrumb, y menciones
- Se puede cambiar o remover en cualquier momento

#### Fuentes (3 opciones)

| Fuente | Estilo |
|--------|--------|
| **Default** | Sans-serif limpia (similar a Inter) |
| **Serif** | Con serifa (similar a Georgia) |
| **Mono** | Monoespaciada (similar a iA Writer Mono) |

Afecta toda la página, no bloques individuales. Se cambia desde menú `...` > "Style".

#### Ancho de página

- **Centered** (por defecto): contenido centrado ~900px con márgenes amplios
- **Full width**: contenido ocupa todo el ancho disponible
- Toggle desde menú `...`

#### Small text

- Reduce el tamaño de fuente de toda la página
- Menú `...` > "Small text"

---

### 4.3 Temas (Modo Claro/Oscuro)

| Opción | Descripción |
|--------|-------------|
| **Light mode** | Fondo blanco (#FFFFFF), texto oscuro |
| **Dark mode** | Fondo oscuro (#191919), texto claro |
| **System** | Sigue preferencia del SO |

- Cambio desde Settings > Appearance
- Dark mode: todos los elementos UI se adaptan
- Colores de bloques tienen versiones específicas para dark mode
- 10 colores disponibles: default, gray, brown, orange, yellow, green, blue, purple, pink, red (variantes texto y fondo)
- Imágenes y embeds NO se invierten

---

### 4.4 Comentarios y Discusiones

#### Tipos de comentarios

1. **Comentarios en bloque (inline)**: seleccionar texto → toolbar → comentario (`Cmd/Ctrl + Shift + M`). Texto comentado queda resaltado en amarillo/naranja.
2. **Comentarios de página**: sección "Discussion" debajo del título, comentarios generales sobre toda la página.

#### Funcionalidades

- Mencionar personas (`@nombre`), páginas, fechas dentro de comentarios
- **Resolver** comentarios: botón "Resolve" (desaparece del view, visible en historial)
- **Reabrir** comentarios resueltos
- Editar/eliminar propios comentarios
- Respuestas en hilo (threads)
- "Can comment" como nivel de acceso específico

---

### 4.5 Drag & Drop

#### Handle de arrastre

- Icono **gripper** (`⋮⋮` - seis puntos) al hover a la izquierda del bloque
- Sirve para: arrastrar bloque, abrir menú contextual (clic)
- También aparece `+` para agregar bloque nuevo

#### Mover bloques

- Arrastrar verticalmente: reordenar (línea azul horizontal indica posición)
- Seleccionar múltiples bloques (Shift+click) y arrastrar juntos

#### Crear columnas

- Arrastrar horizontalmente al lado de otro bloque (línea azul vertical)
- Hasta 5-6 columnas
- Redimensionar arrastrando borde entre columnas
- Para deshacer: arrastrar bloque de vuelta a posición vertical

#### Drag & drop en sidebar

- Reorganizar jerarquía de páginas
- Convertir en sub-página arrastrando sobre otra
- Mover a Favorites, Private, o secciones de teamspace

---

### 4.6 Menús Contextuales

#### Menú del bloque (clic en `⋮⋮` o clic derecho)

| Opción | Descripción |
|--------|-------------|
| **Delete** | Eliminar bloque |
| **Duplicate** | Duplicar bloque |
| **Turn into** | Convertir a otro tipo (Text, H1-H3, To-do, Bullet, Number, Toggle, Code, Quote, Callout, Page) |
| **Turn into page in...** | Convertir en página dentro de otra sección |
| **Copy link to block** | Copiar enlace directo (deep link) |
| **Move to** | Mover a otra página |
| **Comment** | Agregar comentario |
| **Color** | 10 colores de texto + 10 colores de fondo |
| **Caption** | (imágenes/embeds) Agregar pie de foto |

#### Menú de página (tres puntos `...`)

| Opción | Descripción |
|--------|-------------|
| **Style** | Fuente, Small text, Full width |
| **Lock page** | Bloquear edición |
| **Customize page** | Propiedades visibles y layout |
| **Add to Favorites** | Agregar a favoritos |
| **Copy link** | Copiar link de la página |
| **Undo** | Deshacer |
| **Page history** | Ver historial de versiones |
| **Show deleted pages** | Sub-páginas eliminadas |
| **Import / Export** | PDF, HTML, Markdown, CSV |
| **Move to** | Mover página |
| **Duplicate** | Duplicar página completa |
| **Delete** | Eliminar (va a Trash) |
| **Word count** | Conteo de palabras y caracteres |

#### Toolbar flotante (al seleccionar texto)

Bold, Italic, Underline, Strikethrough, Code, Link, Color, Comment, Turn into, AI, Equation, Mention

---

### 4.7 Responsive / Mobile

#### App móvil (iOS y Android)

- Edición completa: crear y editar páginas, bloques, BD
- Sidebar con gesto de swipe desde la izquierda
- **Quick Note**: widget para notas rápidas desde pantalla de inicio
- **Share sheet**: compartir contenido desde otras apps
- **Offline mode**: acceso offline a páginas visitadas (sync posterior)
- Push notifications nativas
- Cámara integrada para insertar fotos
- Slash commands disponibles
- Toolbar inferior con acceso rápido a: tipos de bloque, formato, colores, menciones, checkbox, adjuntar

#### Limitaciones en mobile

- Columnas se apilan verticalmente (responsive)
- No se pueden crear columnas arrastrando
- Drag & drop más limitado
- BD complejas más difíciles de navegar
- Full width se adapta automáticamente

#### Widgets

- **iOS**: widget de Quick Note y páginas recientes
- **Android**: widget similar con páginas recientes y creación rápida

---

### 4.8 Historial de Cambios

- Menú `...` > "Page history"
- Lista cronológica de snapshots con fecha, hora y usuario
- Preview de cualquier versión anterior
- **Restore**: restaurar versión (la actual se guarda antes de restaurar)
- Snapshots automáticos cada pocos minutos de edición activa

| Plan | Retención |
|------|-----------|
| **Free** | 7 días |
| **Plus** | 30 días |
| **Business** | 90 días |
| **Enterprise** | Ilimitado |

---

### 4.9 Colaboración en Tiempo Real

- Múltiples usuarios editando simultáneamente
- Cambios sincronizados en < 1 segundo
- Sin conflictos de edición (merge automático)
- **Avatares** de usuarios activos en parte superior derecha
- Clic en avatar: scroll a su posición en la página
- **Follow**: seguir vista de otro usuario en tiempo real
- Los cursores exactos de otros usuarios NO se muestran (a diferencia de Google Docs)
- Menciones con `@persona` generan notificaciones
- Reminders con `@remind` + fecha

---

### 4.10 Notificaciones

#### Inbox

- Icono de campana o "Inbox" en sidebar
- Todas las notificaciones en orden cronológico

#### Tipos de notificaciones

| Tipo | Descripción |
|------|-------------|
| **Mentions** | Alguien te menciona con @ |
| **Comments** | Comentarios en páginas donde participas |
| **Page edits** | Ediciones en páginas que sigues |
| **Reminders** | Recordatorios programados |
| **Invitations** | Invitaciones a páginas/workspaces |
| **Property changes** | Cambios en BD items asignados |

#### Configuración

- Push notifications (mobile): activar/desactivar
- Email notifications: frecuencia (instant, daily digest)
- Slack notifications (integración)
- **Follow/Unfollow** páginas específicas
- Auto-follow: páginas que creas o comentas

---

### 4.11 Configuración de Cuenta y Planes

#### Planes

| Plan | Precio | Características clave |
|------|--------|----------------------|
| **Free** | $0 | Bloques ilimitados (individual), 7 días historial, 10 invitados, 5MB/archivo |
| **Plus** | ~$10/mes por usuario | 30 días historial, invitados ilimitados, 5GB/archivo |
| **Business** | ~$18/mes por usuario | 90 días historial, SAML SSO, bulk PDF export, advanced analytics |
| **Enterprise** | Precio personalizado | Historial ilimitado, audit log, SCIM, advanced security |

#### Seguridad

- **2FA**: disponible para todos los planes (Google Authenticator, Authy, etc.)
- **SSO/SAML**: Business y Enterprise
- **SCIM provisioning**: Enterprise
- **Audit log**: Enterprise
- Content export controls, Disable public sharing, Allowed email domains, Session management

#### Configuración general

- Profile: nombre, email, foto
- Language & region: inglés, español, francés, alemán, portugués, japonés, coreano, chino, etc.
- Date & time: formato y zona horaria
- Start week on: lunes o domingo
- Open on start: página al iniciar

---

### 4.12 Web Clipper

- Extensión de navegador (Chrome, Firefox, Safari, Edge)
- Captura contenido de página web actual
- Seleccionar workspace y página/BD destino
- Si se guarda en BD: llenar propiedades
- Guarda URL, título y contenido principal
- Limitaciones: calidad varía por sitio, no captura detrás de paywalls, imágenes como links

---

## Arquitectura de Bloques (Resumen técnico)

Todo en Notion es un bloque. La estructura es un árbol:

```
Página (nodo raíz)
├── Bloque (párrafo)
├── Bloque (heading)
├── Bloque (contenedor: toggle, callout, columna)
│   ├── Bloque hijo
│   └── Bloque hijo
├── Bloque (base de datos inline)
│   ├── Registro (página)
│   └── Registro (página)
└── Bloque (imagen)
```

Cada bloque tiene:
- **type**: tipo de bloque (paragraph, heading_1, bulleted_list_item, etc.)
- **content**: rich text con annotations (bold, italic, color, etc.) y mentions
- **children**: bloques hijos (para contenedores)
- **properties**: configuración específica (language para code, checked para to-do, etc.)
- **metadata**: id, created_time, last_edited_time, created_by, last_edited_by
