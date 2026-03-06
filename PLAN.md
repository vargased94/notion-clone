# Plan Maestro - Notion Clone

> React + TypeScript + Tailwind CSS + Supabase

---

## Tabla de Contenidos

1. [Stack Tecnológico y Dependencias](#1-stack-tecnológico-y-dependencias)
2. [Estructura de Carpetas](#2-estructura-de-carpetas)
3. [Arquitectura de Base de Datos (Supabase)](#3-arquitectura-de-base-de-datos-supabase)
4. [Arquitectura Frontend](#4-arquitectura-frontend)
5. [Plan de Implementación por Fases](#5-plan-de-implementación-por-fases)
6. [Convenciones y Patrones](#6-convenciones-y-patrones)

---

## 1. Stack Tecnológico y Dependencias

### Core

| Paquete | Justificación |
|---------|---------------|
| `react` ^18.3 | Framework base |
| `react-dom` ^18.3 | Renderer DOM |
| `typescript` ^5.4 | Tipado estático, esencial para proyecto de esta complejidad |
| `vite` ^6.0 | Build tool (ya instalado) |
| `react-router-dom` ^6.22 | Routing declarativo con nested routes |

### Editor

| Paquete | Justificación |
|---------|---------------|
| `@tiptap/react` ^2.2 | Editor WYSIWYG sobre ProseMirror. Mejor ecosistema de extensiones, drag & drop nativo, API estable |
| `@tiptap/starter-kit` ^2.2 | Extensiones base (paragraph, heading, bold, italic, lists, code) |
| `@tiptap/extension-placeholder` | Placeholder text ("Type / for commands") |
| `@tiptap/extension-mention` | Menciones @persona, @página, @fecha |
| `@tiptap/extension-link` | Links con preview |
| `@tiptap/extension-image` | Bloques de imagen |
| `@tiptap/extension-table` | Tablas simples editables |
| `@tiptap/extension-task-list` | To-do / checkbox lists |
| `@tiptap/extension-code-block-lowlight` | Code blocks con syntax highlighting |
| `@tiptap/extension-color` | Colores de texto |
| `@tiptap/extension-highlight` | Colores de fondo |
| `@tiptap/extension-underline` | Formato underline |
| `lowlight` ^3.1 | Motor de syntax highlighting |
| `katex` ^0.16 | Ecuaciones LaTeX/KaTeX |

### Drag & Drop

| Paquete | Justificación |
|---------|---------------|
| `@dnd-kit/core` | DnD moderno, accesible, performante (react-beautiful-dnd está deprecated) |
| `@dnd-kit/sortable` | Listas ordenables |
| `@dnd-kit/utilities` | Utilidades CSS transform |

### Estado y Data

| Paquete | Justificación |
|---------|---------------|
| `zustand` | Estado global ligero (~1KB). Client state: UI, sidebar, theme |
| `immer` | Actualizaciones inmutables ergonómicas en Zustand |
| `@supabase/supabase-js` | Auth, database, storage, realtime |
| `@tanstack/react-query` | Server state: cache, refetch, optimistic updates |

### UI

| Paquete | Justificación |
|---------|---------------|
| `@radix-ui/react-dropdown-menu` | Primitivos accesibles headless WAI-ARIA |
| `@radix-ui/react-dialog` | Modales accesibles |
| `@radix-ui/react-popover` | Popovers |
| `@radix-ui/react-tooltip` | Tooltips |
| `@radix-ui/react-context-menu` | Menú clic derecho |
| `@radix-ui/react-tabs` | Tabs |
| `@radix-ui/react-switch` | Toggle switch |
| `@radix-ui/react-scroll-area` | Scroll custom |
| `cmdk` | Command palette (Cmd+K) |
| `sonner` | Toasts/notificaciones |
| `react-day-picker` | Date picker |
| `@emoji-mart/react` + `@emoji-mart/data` | Emoji picker |

### Formularios y Validación

| Paquete | Justificación |
|---------|---------------|
| `react-hook-form` | Formularios performantes (uncontrolled) |
| `zod` | Validación de schemas |
| `@hookform/resolvers` | Bridge zod ↔ react-hook-form |

### Utilidades

| Paquete | Justificación |
|---------|---------------|
| `date-fns` | Fechas lightweight, tree-shakeable |
| `lucide-react` | Iconos SVG (mismo set que Notion) |
| `clsx` | Clases condicionales |
| `tailwind-merge` | Resolver conflictos Tailwind |
| `nanoid` | IDs únicos para bloques |
| `react-resizable-panels` | Panels redimensionables (sidebar) |
| `@tanstack/react-virtual` | Virtualización de listas largas |
| `@tanstack/react-table` | Table headless para vista Table de BD |
| `fuse.js` | Búsqueda fuzzy (slash menu, command palette) |

### Dev / Build

| Paquete | Justificación |
|---------|---------------|
| `eslint` + `@typescript-eslint/*` | Linting TypeScript |
| `prettier` + `prettier-plugin-tailwindcss` | Formateo + orden clases Tailwind |
| `vitest` + `@testing-library/react` | Testing |

---

## 2. Estructura de Carpetas

```
src/
├── app/                              # Configuración central
│   ├── App.tsx                       # Root component, providers wrapper
│   ├── main.tsx                      # Entry point
│   ├── router.tsx                    # React Router
│   └── providers.tsx                 # Composición de providers
│
├── components/                       # Componentes compartidos/reutilizables
│   ├── ui/                           # Primitivos de UI (design system)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Dialog.tsx
│   │   ├── Dropdown.tsx
│   │   ├── DropdownMenu.tsx
│   │   ├── Popover.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Switch.tsx
│   │   ├── Tabs.tsx
│   │   ├── ScrollArea.tsx
│   │   ├── Separator.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts
│   │
│   ├── ColorPicker.tsx
│   ├── EmojiPicker.tsx
│   ├── IconPicker.tsx
│   ├── DatePicker.tsx
│   ├── CommandPalette.tsx            # Cmd+K
│   ├── ConfirmDialog.tsx
│   ├── ErrorBoundary.tsx
│   └── EmptyState.tsx
│
├── features/                         # Módulos por feature
│   │
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── AuthGuard.tsx
│   │   │   ├── GuestGuard.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   ├── workspace/
│   │   ├── components/
│   │   │   ├── WorkspaceSwitcher.tsx
│   │   │   ├── WorkspaceSettings.tsx
│   │   │   ├── MembersList.tsx
│   │   │   └── InviteModal.tsx
│   │   ├── hooks/
│   │   │   ├── useWorkspace.ts
│   │   │   └── useMembers.ts
│   │   ├── services/
│   │   │   └── workspace.service.ts
│   │   └── types/
│   │       └── workspace.types.ts
│   │
│   ├── sidebar/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarHeader.tsx
│   │   │   ├── SidebarSearch.tsx
│   │   │   ├── SidebarNav.tsx
│   │   │   ├── PageTree.tsx
│   │   │   ├── PageTreeItem.tsx
│   │   │   ├── FavoritesSection.tsx
│   │   │   ├── PrivateSection.tsx
│   │   │   ├── SharedSection.tsx
│   │   │   ├── TrashButton.tsx
│   │   │   ├── NewPageButton.tsx
│   │   │   └── SidebarResizeHandle.tsx
│   │   ├── hooks/
│   │   │   ├── useSidebar.ts
│   │   │   └── usePageTree.ts
│   │   └── types/
│   │       └── sidebar.types.ts
│   │
│   ├── page/
│   │   ├── components/
│   │   │   ├── PageView.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── PageCover.tsx
│   │   │   ├── PageIcon.tsx
│   │   │   ├── PageTitle.tsx
│   │   │   ├── PageContent.tsx
│   │   │   ├── PageBreadcrumb.tsx
│   │   │   ├── PageTopbar.tsx
│   │   │   ├── ShareMenu.tsx
│   │   │   ├── PageHistory.tsx
│   │   │   ├── PageSettings.tsx
│   │   │   └── PageActions.tsx
│   │   ├── hooks/
│   │   │   ├── usePage.ts
│   │   │   ├── usePageHistory.ts
│   │   │   └── usePageBreadcrumb.ts
│   │   ├── services/
│   │   │   └── page.service.ts
│   │   └── types/
│   │       └── page.types.ts
│   │
│   ├── editor/
│   │   ├── components/
│   │   │   ├── BlockEditor.tsx       # Editor principal (wrapper Tiptap)
│   │   │   ├── SlashMenu.tsx
│   │   │   ├── FloatingToolbar.tsx
│   │   │   ├── DragHandle.tsx
│   │   │   ├── BlockMenu.tsx
│   │   │   ├── TurnIntoMenu.tsx
│   │   │   ├── LinkPopover.tsx
│   │   │   ├── MentionMenu.tsx
│   │   │   ├── ColorMenu.tsx
│   │   │   └── InlineEquationEditor.tsx
│   │   ├── blocks/                   # Un componente por tipo
│   │   │   ├── ParagraphBlock.tsx
│   │   │   ├── Heading1Block.tsx
│   │   │   ├── Heading2Block.tsx
│   │   │   ├── Heading3Block.tsx
│   │   │   ├── BulletedListBlock.tsx
│   │   │   ├── NumberedListBlock.tsx
│   │   │   ├── ToggleBlock.tsx
│   │   │   ├── ToggleHeadingBlock.tsx
│   │   │   ├── TodoBlock.tsx
│   │   │   ├── QuoteBlock.tsx
│   │   │   ├── CalloutBlock.tsx
│   │   │   ├── DividerBlock.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── ImageBlock.tsx
│   │   │   ├── VideoBlock.tsx
│   │   │   ├── AudioBlock.tsx
│   │   │   ├── FileBlock.tsx
│   │   │   ├── BookmarkBlock.tsx
│   │   │   ├── EmbedBlock.tsx
│   │   │   ├── EquationBlock.tsx
│   │   │   ├── TableBlock.tsx
│   │   │   ├── ColumnsBlock.tsx
│   │   │   ├── ColumnBlock.tsx
│   │   │   ├── SyncedBlock.tsx
│   │   │   ├── TableOfContentsBlock.tsx
│   │   │   ├── BreadcrumbBlock.tsx
│   │   │   ├── LinkToPageBlock.tsx
│   │   │   ├── ChildPageBlock.tsx
│   │   │   ├── ButtonBlock.tsx
│   │   │   └── index.ts             # Registry de bloques
│   │   ├── extensions/               # Extensiones Tiptap custom
│   │   │   ├── SlashCommand.ts
│   │   │   ├── DragAndDrop.ts
│   │   │   ├── BlockId.ts
│   │   │   ├── Mention.ts
│   │   │   ├── InlineEquation.ts
│   │   │   ├── TrailingNode.ts
│   │   │   ├── Placeholder.ts
│   │   │   └── MarkdownShortcuts.ts
│   │   ├── hooks/
│   │   │   ├── useBlockEditor.ts
│   │   │   ├── useSlashMenu.ts
│   │   │   ├── useFloatingToolbar.ts
│   │   │   └── useDragDrop.ts
│   │   ├── utils/
│   │   │   ├── block-helpers.ts
│   │   │   └── editor-commands.ts
│   │   └── types/
│   │       └── editor.types.ts
│   │
│   ├── database/
│   │   ├── components/
│   │   │   ├── DatabaseView.tsx
│   │   │   ├── DatabaseToolbar.tsx
│   │   │   ├── ViewTabs.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── FilterBuilder.tsx
│   │   │   ├── SortBar.tsx
│   │   │   ├── GroupBar.tsx
│   │   │   ├── PropertyEditor.tsx
│   │   │   ├── PropertiesPanel.tsx
│   │   │   ├── CalculationRow.tsx
│   │   │   ├── NewRecordButton.tsx
│   │   │   ├── RecordPage.tsx
│   │   │   └── DatabaseTemplates.tsx
│   │   ├── views/
│   │   │   ├── TableView.tsx
│   │   │   ├── BoardView.tsx
│   │   │   ├── ListView.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── TimelineView.tsx
│   │   │   ├── GalleryView.tsx
│   │   │   └── ChartView.tsx
│   │   ├── cells/                    # Celda por tipo de propiedad
│   │   │   ├── TextCell.tsx
│   │   │   ├── NumberCell.tsx
│   │   │   ├── SelectCell.tsx
│   │   │   ├── MultiSelectCell.tsx
│   │   │   ├── StatusCell.tsx
│   │   │   ├── DateCell.tsx
│   │   │   ├── PersonCell.tsx
│   │   │   ├── CheckboxCell.tsx
│   │   │   ├── UrlCell.tsx
│   │   │   ├── EmailCell.tsx
│   │   │   ├── PhoneCell.tsx
│   │   │   ├── FileCell.tsx
│   │   │   ├── RelationCell.tsx
│   │   │   ├── FormulaCell.tsx
│   │   │   ├── RollupCell.tsx
│   │   │   ├── CreatedTimeCell.tsx
│   │   │   ├── CreatedByCell.tsx
│   │   │   ├── LastEditedTimeCell.tsx
│   │   │   ├── LastEditedByCell.tsx
│   │   │   ├── UniqueIdCell.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useDatabase.ts
│   │   │   ├── useDatabaseView.ts
│   │   │   ├── useFilters.ts
│   │   │   ├── useSorts.ts
│   │   │   └── useProperties.ts
│   │   ├── services/
│   │   │   └── database.service.ts
│   │   ├── utils/
│   │   │   ├── filter-engine.ts
│   │   │   ├── sort-engine.ts
│   │   │   ├── formula-engine.ts
│   │   │   └── calculation-engine.ts
│   │   └── types/
│   │       └── database.types.ts
│   │
│   ├── comments/
│   │   ├── components/
│   │   │   ├── CommentThread.tsx
│   │   │   ├── CommentInput.tsx
│   │   │   ├── PageDiscussion.tsx
│   │   │   └── InlineComment.tsx
│   │   ├── hooks/
│   │   │   └── useComments.ts
│   │   ├── services/
│   │   │   └── comments.service.ts
│   │   └── types/
│   │       └── comments.types.ts
│   │
│   ├── search/
│   │   ├── components/
│   │   │   ├── SearchModal.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   └── RecentPages.tsx
│   │   ├── hooks/
│   │   │   └── useSearch.ts
│   │   └── services/
│   │       └── search.service.ts
│   │
│   ├── trash/
│   │   ├── components/
│   │   │   ├── TrashModal.tsx
│   │   │   ├── TrashList.tsx
│   │   │   └── TrashItem.tsx
│   │   └── hooks/
│   │       └── useTrash.ts
│   │
│   ├── notifications/
│   │   ├── components/
│   │   │   ├── InboxPanel.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   └── NotificationSettings.tsx
│   │   └── hooks/
│   │       └── useNotifications.ts
│   │
│   └── settings/
│       └── components/
│           ├── SettingsModal.tsx
│           ├── ProfileSettings.tsx
│           ├── AppearanceSettings.tsx
│           └── NotificationSettings.tsx
│
├── hooks/                            # Hooks globales
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   ├── useClickOutside.ts
│   ├── useKeyboardShortcut.ts
│   └── useOnlineStatus.ts
│
├── stores/                           # Zustand stores
│   ├── auth.store.ts
│   ├── workspace.store.ts
│   ├── page.store.ts
│   ├── sidebar.store.ts
│   ├── editor.store.ts
│   ├── ui.store.ts
│   └── notification.store.ts
│
├── layouts/
│   ├── AppLayout.tsx                 # Sidebar + content
│   ├── AuthLayout.tsx                # Login/register centrado
│   └── SettingsLayout.tsx
│
├── pages/                            # Componentes de ruta
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── HomePage.tsx
│   ├── PagePage.tsx
│   ├── DatabasePage.tsx
│   ├── TrashPage.tsx
│   ├── SettingsPage.tsx
│   └── NotFoundPage.tsx
│
├── lib/                              # Utilidades y config
│   ├── supabase.ts                   # Cliente Supabase
│   ├── constants.ts                  # Colores, tipos, etc.
│   ├── cn.ts                         # clsx + tailwind-merge
│   ├── date.ts                       # Helpers fecha
│   ├── file-upload.ts                # Upload a Supabase Storage
│   ├── keyboard.ts                   # Mapeo shortcuts por plataforma
│   ├── rich-text.ts                  # Serialización rich text
│   └── validators.ts                 # Schemas Zod compartidos
│
├── types/                            # Tipos globales
│   ├── block.types.ts
│   ├── page.types.ts
│   ├── database.types.ts
│   ├── user.types.ts
│   ├── workspace.types.ts
│   ├── comment.types.ts
│   ├── notification.types.ts
│   └── supabase.ts                   # Tipos generados de Supabase
│
└── styles/
    ├── globals.css                   # Tailwind directives + CSS vars
    ├── editor.css                    # Estilos Tiptap overrides
    └── notion-colors.css             # Variables CSS 10 colores (light/dark)
```

---

## 3. Arquitectura de Base de Datos (Supabase)

### 3.1 Diagrama de relaciones

```
auth.users (Supabase Auth)
    │
    ▼
profiles ──────────────────┐
    │                      │
    ▼                      ▼
workspaces           workspace_members
    │                      │
    ▼                      ▼
teamspaces           teamspace_members
    │
    ▼
pages ──────────────────────┬──────────────────┐
    │                       │                  │
    ▼                       ▼                  ▼
blocks              page_permissions     page_favorites
    │               page_shares          page_versions
    ▼               page_followers       page_recent_visits
comments
    │
    ▼
notifications

databases ──► database_properties
    │              │
    ▼              ▼
database_entries ──► database_entry_values
    │
    ▼
database_views ──► view_filters, view_sorts, view_groups
```

### 3.2 Tipos enumerados

```sql
CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member', 'guest');
CREATE TYPE teamspace_type AS ENUM ('open', 'closed', 'private');
CREATE TYPE teamspace_role AS ENUM ('owner', 'member');
CREATE TYPE permission_level AS ENUM (
  'full_access', 'can_edit', 'can_edit_content', 'can_comment', 'can_view'
);
CREATE TYPE page_font AS ENUM ('default', 'serif', 'mono');

CREATE TYPE block_type AS ENUM (
  'paragraph', 'heading_1', 'heading_2', 'heading_3',
  'bulleted_list_item', 'numbered_list_item', 'to_do', 'toggle',
  'quote', 'callout', 'divider',
  'toggle_heading_1', 'toggle_heading_2', 'toggle_heading_3',
  'image', 'video', 'audio', 'file', 'bookmark', 'embed',
  'code', 'equation', 'table_of_contents', 'breadcrumb',
  'synced_block', 'synced_block_reference', 'button',
  'column_list', 'column', 'link_to_page', 'child_page', 'child_database',
  'table', 'table_row'
);

CREATE TYPE db_property_type AS ENUM (
  'title', 'text', 'number', 'select', 'multi_select', 'status',
  'date', 'person', 'files', 'checkbox', 'url', 'email', 'phone',
  'formula', 'relation', 'rollup',
  'created_time', 'created_by', 'last_edited_time', 'last_edited_by',
  'unique_id', 'button'
);

CREATE TYPE db_view_type AS ENUM (
  'table', 'board', 'list', 'calendar', 'timeline', 'gallery', 'chart'
);

CREATE TYPE notification_type AS ENUM (
  'mention', 'comment', 'comment_reply', 'page_edit',
  'reminder', 'invitation', 'property_change'
);

CREATE TYPE comment_status AS ENUM ('open', 'resolved');
```

### 3.3 Tablas

#### `profiles` — Extiende auth.users

```sql
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  preferred_theme TEXT DEFAULT 'system' CHECK (preferred_theme IN ('light', 'dark', 'system')),
  locale          TEXT DEFAULT 'en',
  timezone        TEXT DEFAULT 'UTC',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_email ON profiles(email);
```

#### `workspaces`

```sql
CREATE TABLE workspaces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  icon_url        TEXT,
  slug            TEXT UNIQUE,
  plan            TEXT DEFAULT 'free' CHECK (plan IN ('free', 'plus', 'business', 'enterprise')),
  settings        JSONB DEFAULT '{}',
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `workspace_members`

```sql
CREATE TABLE workspace_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role            workspace_role NOT NULL DEFAULT 'member',
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);
```

#### `teamspaces`

```sql
CREATE TABLE teamspaces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  icon_url        TEXT,
  type            teamspace_type NOT NULL DEFAULT 'open',
  is_archived     BOOLEAN NOT NULL DEFAULT false,
  default_permission permission_level DEFAULT 'full_access',
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `teamspace_members`

```sql
CREATE TABLE teamspace_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teamspace_id    UUID NOT NULL REFERENCES teamspaces(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role            teamspace_role NOT NULL DEFAULT 'member',
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(teamspace_id, user_id)
);
```

#### `pages` — Entidad central, jerarquía infinita

```sql
CREATE TABLE pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_page_id  UUID REFERENCES pages(id) ON DELETE CASCADE,
  teamspace_id    UUID REFERENCES teamspaces(id) ON DELETE SET NULL,
  database_id     UUID,

  title           TEXT NOT NULL DEFAULT '',
  icon            TEXT,
  icon_type       TEXT DEFAULT 'emoji' CHECK (icon_type IN ('emoji', 'url', 'none')),
  cover_url       TEXT,
  cover_position  REAL DEFAULT 0.5,
  font            page_font DEFAULT 'default',
  full_width      BOOLEAN NOT NULL DEFAULT false,
  small_text      BOOLEAN NOT NULL DEFAULT false,
  is_locked       BOOLEAN NOT NULL DEFAULT false,

  section         TEXT DEFAULT 'private' CHECK (section IN ('private', 'shared', 'teamspace')),
  position        REAL NOT NULL DEFAULT 0, -- fractional indexing

  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,
  deleted_by      UUID REFERENCES profiles(id),
  original_parent UUID,

  is_public       BOOLEAN NOT NULL DEFAULT false,
  public_slug     TEXT UNIQUE,
  public_settings JSONB DEFAULT '{}',

  created_by      UUID NOT NULL REFERENCES profiles(id),
  last_edited_by  UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  content_search  TSVECTOR
);

CREATE INDEX idx_pages_workspace ON pages(workspace_id);
CREATE INDEX idx_pages_parent ON pages(parent_page_id);
CREATE INDEX idx_pages_deleted ON pages(workspace_id, is_deleted);
CREATE INDEX idx_pages_search ON pages USING GIN(content_search);
CREATE INDEX idx_pages_position ON pages(parent_page_id, position);
```

#### `page_favorites`, `page_recent_visits`, `page_followers`

```sql
CREATE TABLE page_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  position REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, page_id)
);

CREATE TABLE page_recent_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, page_id)
);

CREATE TABLE page_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page_id, user_id)
);
```

#### `page_permissions`

```sql
CREATE TABLE page_permissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  teamspace_id    UUID REFERENCES teamspaces(id) ON DELETE CASCADE,
  level           permission_level NOT NULL DEFAULT 'can_view',
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT perm_has_target CHECK (user_id IS NOT NULL OR teamspace_id IS NOT NULL),
  UNIQUE(page_id, user_id),
  UNIQUE(page_id, teamspace_id)
);
```

#### `page_shares`

```sql
CREATE TABLE page_shares (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE UNIQUE,
  is_enabled      BOOLEAN NOT NULL DEFAULT false,
  slug            TEXT UNIQUE,
  allow_editing   BOOLEAN DEFAULT false,
  allow_comments  BOOLEAN DEFAULT false,
  allow_duplicate BOOLEAN DEFAULT false,
  search_indexing BOOLEAN DEFAULT false,
  password_hash   TEXT,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `blocks` — Corazón del editor

```sql
CREATE TABLE blocks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  parent_block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
  type            block_type NOT NULL DEFAULT 'paragraph',

  -- Rich text como JSON array
  -- [{ "text": "Hello", "annotations": { "bold": true, "color": "red" } }]
  content         JSONB DEFAULT '[]',

  -- Propiedades por tipo:
  --   to_do: { "checked": false }
  --   code: { "language": "javascript", "wrap": true }
  --   callout: { "icon": "💡", "color": "yellow_background" }
  --   image: { "url": "...", "caption": [...], "width": 400 }
  --   bookmark: { "url": "...", "title": "...", "description": "...", "favicon": "..." }
  --   synced_block_reference: { "synced_from": "block_uuid" }
  --   column: { "width_ratio": 0.5 }
  --   heading: { "is_toggleable": false }
  properties      JSONB DEFAULT '{}',

  color           TEXT,
  position        REAL NOT NULL DEFAULT 0, -- fractional indexing

  created_by      UUID REFERENCES profiles(id),
  last_edited_by  UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blocks_page ON blocks(page_id);
CREATE INDEX idx_blocks_parent ON blocks(parent_block_id);
CREATE INDEX idx_blocks_page_position ON blocks(page_id, position);
```

#### `databases`

```sql
CREATE TABLE databases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title           TEXT NOT NULL DEFAULT 'Untitled Database',
  is_inline       BOOLEAN NOT NULL DEFAULT true,
  is_locked       BOOLEAN NOT NULL DEFAULT false,
  sub_items_enabled BOOLEAN DEFAULT false,
  dependencies_enabled BOOLEAN DEFAULT false,
  unique_id_prefix TEXT DEFAULT '',
  unique_id_counter INTEGER DEFAULT 0,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE pages ADD CONSTRAINT fk_pages_database
  FOREIGN KEY (database_id) REFERENCES databases(id) ON DELETE SET NULL;
```

#### `database_properties`

```sql
CREATE TABLE database_properties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id     UUID NOT NULL REFERENCES databases(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  type            db_property_type NOT NULL,
  position        REAL NOT NULL DEFAULT 0,
  is_visible      BOOLEAN NOT NULL DEFAULT true,
  width           INTEGER,
  config          JSONB DEFAULT '{}',
  -- config examples:
  --   select: { "options": [{ "id": "...", "name": "...", "color": "red" }] }
  --   number: { "format": "currency_usd" }
  --   formula: { "expression": "prop(\"Price\") * prop(\"Qty\")" }
  --   relation: { "database_id": "...", "type": "bidirectional" }
  --   rollup: { "relation_property_id": "...", "target_property_id": "...", "calculation": "sum" }
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `database_entries` y `database_entry_values`

```sql
CREATE TABLE database_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id     UUID NOT NULL REFERENCES databases(id) ON DELETE CASCADE,
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE UNIQUE,
  position        REAL NOT NULL DEFAULT 0,
  unique_id       TEXT,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE database_entry_values (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id        UUID NOT NULL REFERENCES database_entries(id) ON DELETE CASCADE,
  property_id     UUID NOT NULL REFERENCES database_properties(id) ON DELETE CASCADE,
  value_text      TEXT,
  value_number    DOUBLE PRECISION,
  value_boolean   BOOLEAN,
  value_date      TIMESTAMPTZ,
  value_date_end  TIMESTAMPTZ,
  value_json      JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(entry_id, property_id)
);

CREATE INDEX idx_entryvals_entry ON database_entry_values(entry_id);
CREATE INDEX idx_entryvals_json ON database_entry_values USING GIN(value_json) WHERE value_json IS NOT NULL;
```

#### `database_views`, `view_filters`, `view_sorts`, `view_groups`

```sql
CREATE TABLE database_views (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id     UUID NOT NULL REFERENCES databases(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT 'Default view',
  type            db_view_type NOT NULL DEFAULT 'table',
  position        REAL NOT NULL DEFAULT 0,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  layout_config   JSONB DEFAULT '{}',
  visible_properties JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE view_filters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_id         UUID NOT NULL REFERENCES database_views(id) ON DELETE CASCADE,
  parent_filter_id UUID REFERENCES view_filters(id) ON DELETE CASCADE,
  position        REAL NOT NULL DEFAULT 0,
  is_group        BOOLEAN NOT NULL DEFAULT false,
  logical_operator TEXT DEFAULT 'and' CHECK (logical_operator IN ('and', 'or')),
  property_id     UUID REFERENCES database_properties(id) ON DELETE CASCADE,
  operator        TEXT,
  value           JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE view_sorts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_id         UUID NOT NULL REFERENCES database_views(id) ON DELETE CASCADE,
  property_id     UUID NOT NULL REFERENCES database_properties(id) ON DELETE CASCADE,
  direction       TEXT NOT NULL DEFAULT 'ascending' CHECK (direction IN ('ascending', 'descending')),
  position        REAL NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE view_groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_id         UUID NOT NULL REFERENCES database_views(id) ON DELETE CASCADE,
  property_id     UUID NOT NULL REFERENCES database_properties(id) ON DELETE CASCADE,
  is_sub_group    BOOLEAN NOT NULL DEFAULT false,
  hide_empty      BOOLEAN DEFAULT false,
  sort_order      TEXT DEFAULT 'alphabetical',
  collapsed_groups JSONB DEFAULT '[]',
  hidden_groups   JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `database_relations`, `database_templates`

```sql
CREATE TABLE database_relations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entry_id   UUID NOT NULL REFERENCES database_entries(id) ON DELETE CASCADE,
  target_entry_id   UUID NOT NULL REFERENCES database_entries(id) ON DELETE CASCADE,
  property_id       UUID NOT NULL REFERENCES database_properties(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_entry_id, target_entry_id, property_id)
);

CREATE TABLE database_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  database_id     UUID NOT NULL REFERENCES databases(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT 'Untitled Template',
  icon            TEXT,
  default_values  JSONB DEFAULT '{}',
  content_blocks  JSONB DEFAULT '[]',
  is_recurring    BOOLEAN NOT NULL DEFAULT false,
  recurrence      TEXT CHECK (recurrence IN ('daily','weekly','biweekly','monthly','yearly')),
  position        REAL NOT NULL DEFAULT 0,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `comments`

```sql
CREATE TABLE comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  block_id        UUID REFERENCES blocks(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content         JSONB NOT NULL DEFAULT '[]',
  text_range      JSONB,
  status          comment_status NOT NULL DEFAULT 'open',
  resolved_by     UUID REFERENCES profiles(id),
  resolved_at     TIMESTAMPTZ,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `page_versions`

```sql
CREATE TABLE page_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  title           TEXT,
  blocks_snapshot JSONB NOT NULL,
  entry_values_snapshot JSONB,
  version_number  INTEGER NOT NULL,
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_versions_page ON page_versions(page_id, created_at DESC);
```

#### `notifications`

```sql
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  recipient_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id        UUID REFERENCES profiles(id),
  type            notification_type NOT NULL,
  page_id         UUID REFERENCES pages(id) ON DELETE CASCADE,
  block_id        UUID REFERENCES blocks(id) ON DELETE SET NULL,
  comment_id      UUID REFERENCES comments(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  body            TEXT,
  data            JSONB DEFAULT '{}',
  is_read         BOOLEAN NOT NULL DEFAULT false,
  read_at         TIMESTAMPTZ,
  scheduled_for   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notif_recipient ON notifications(recipient_id, is_read, created_at DESC);
```

#### `file_uploads`, `workspace_invitations`

```sql
CREATE TABLE file_uploads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  uploaded_by     UUID NOT NULL REFERENCES profiles(id),
  file_name       TEXT NOT NULL,
  file_size       BIGINT NOT NULL,
  mime_type       TEXT NOT NULL,
  storage_path    TEXT NOT NULL,
  public_url      TEXT,
  page_id         UUID REFERENCES pages(id) ON DELETE SET NULL,
  block_id        UUID REFERENCES blocks(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workspace_invitations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  role            workspace_role NOT NULL DEFAULT 'member',
  invited_by      UUID NOT NULL REFERENCES profiles(id),
  token           TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  accepted_at     TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '7 days',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, email)
);
```

### 3.4 Triggers y funciones

```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
-- (aplicar a todas las tablas con updated_at)

-- Auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-generate unique_id en database_entries
CREATE OR REPLACE FUNCTION generate_unique_id()
RETURNS TRIGGER AS $$
DECLARE prefix TEXT; counter INTEGER;
BEGIN
  SELECT d.unique_id_prefix, d.unique_id_counter + 1 INTO prefix, counter
  FROM databases d WHERE d.id = NEW.database_id FOR UPDATE;
  UPDATE databases SET unique_id_counter = counter WHERE id = NEW.database_id;
  NEW.unique_id := prefix || counter::TEXT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_unique_id BEFORE INSERT ON database_entries
  FOR EACH ROW EXECUTE FUNCTION generate_unique_id();

-- Full-text search vector
CREATE OR REPLACE FUNCTION update_page_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content_search := to_tsvector('simple', COALESCE(NEW.title, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_search_vector
  BEFORE INSERT OR UPDATE OF title ON pages
  FOR EACH ROW EXECUTE FUNCTION update_page_search();
```

### 3.5 RLS (Row Level Security)

Todas las tablas tienen RLS habilitado. Patrón general:
- **SELECT**: miembros del workspace pueden ver
- **INSERT**: miembros del workspace pueden crear
- **UPDATE**: creador, owner/admin, o usuario con permiso específico
- **DELETE**: creador o owner/admin

Las políticas detalladas están en las migraciones de cada fase.

### 3.6 Resumen de tablas (27 total)

| # | Tabla | Descripción |
|---|-------|-------------|
| 1 | `profiles` | Perfil de usuario |
| 2 | `workspaces` | Espacio de trabajo |
| 3 | `workspace_members` | Membresías |
| 4 | `workspace_invitations` | Invitaciones pendientes |
| 5 | `teamspaces` | Espacios de equipo |
| 6 | `teamspace_members` | Miembros teamspace |
| 7 | `pages` | Páginas (árbol infinito) |
| 8 | `page_favorites` | Favoritos por usuario |
| 9 | `page_recent_visits` | Visitas recientes |
| 10 | `page_permissions` | Permisos granulares |
| 11 | `page_shares` | Compartición pública |
| 12 | `page_followers` | Seguidores |
| 13 | `page_versions` | Historial de versiones |
| 14 | `blocks` | Bloques del editor |
| 15 | `comments` | Comentarios e hilos |
| 16 | `databases` | Bases de datos |
| 17 | `database_properties` | Columnas/propiedades |
| 18 | `database_entries` | Registros |
| 19 | `database_entry_values` | Valores de propiedades |
| 20 | `database_relations` | Relaciones entre entradas |
| 21 | `database_views` | Vistas de BD |
| 22 | `view_filters` | Filtros (soporta AND/OR anidados) |
| 23 | `view_sorts` | Ordenamientos |
| 24 | `view_groups` | Agrupaciones |
| 25 | `database_templates` | Plantillas de BD |
| 26 | `notifications` | Notificaciones |
| 27 | `file_uploads` | Archivos subidos |

---

## 4. Arquitectura Frontend

### 4.1 Routing

```typescript
const router = createBrowserRouter([
  // Rutas públicas
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',    element: <GuestGuard><LoginPage /></GuestGuard> },
      { path: '/register', element: <GuestGuard><RegisterPage /></GuestGuard> },
    ],
  },
  // Rutas protegidas
  {
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { path: '/',                element: <HomePage /> },
      { path: '/:pageId',        element: <PagePage /> },
      { path: '/db/:databaseId', element: <DatabasePage /> },
      { path: '/trash',          element: <TrashPage /> },
      { path: '/settings',       element: <SettingsPage /> },
      { path: '/settings/:tab',  element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
```

### 4.2 Zustand Stores

| Store | Responsabilidad | Tipo de estado |
|-------|----------------|----------------|
| `auth.store` | user, session, isAuthenticated, login, logout | Client |
| `workspace.store` | currentWorkspace, workspaces, members, teamspaces | Client + Server cache |
| `page.store` | pages cache, pageTree, favorites, recentPages, currentPageId | Client + Server cache |
| `editor.store` | isSaving, lastSavedAt, activeBlockId, pageFont, isFullWidth, isLocked | Client |
| `sidebar.store` | isOpen, width, expandedNodes | Client (persisted) |
| `ui.store` | theme, resolvedTheme, isCommandPaletteOpen, modals | Client (persisted) |
| `notification.store` | notifications, unreadCount, isInboxOpen | Client + Server cache |

**Patrón**: Zustand para client state. React Query (`@tanstack/react-query`) para server state (cache, refetch, optimistic updates). Nunca duplicar server state en Zustand.

### 4.3 Persistencia del editor

1. **Load**: `usePage(pageId)` carga contenido JSON via React Query
2. **Edit**: cambios locales en Tiptap
3. **Save**: `onUpdate` listener → debounced save (500ms) → serializar → Supabase
4. **Indicator**: "Saving..." / "Saved" en topbar

### 4.4 Error Boundaries (3 niveles)

1. **App-level**: en `providers.tsx`, catch fatal
2. **Page-level**: en `PageContent`, sidebar sigue funcional si editor falla
3. **Block-level**: cada bloque individual (embeds, ecuaciones) tiene su propio boundary

---

## 5. Plan de Implementación por Fases

### Diagrama de dependencias

```
Fase 0 (Setup)
  └── Fase 1 (Auth)
        └── Fase 2 (Workspace + Sidebar)
              ├── Fase 3 (Editor Core) ◄── CRÍTICO
              │     ├── Fase 4 (Bloques Avanzados)
              │     ├── Fase 5 (Bases de Datos) ◄── MÁS COMPLEJO
              │     ├── Fase 6 (Personalización)
              │     └── Fase 8 (Colaboración) ← también depende de Fase 7
              ├── Fase 7 (Compartir y Permisos)
              └── Fase 9 (Teamspaces + Avanzado)
                    └── Fase 10 (Optimización) ← depende de todas
```

> Las fases 4, 5, 6, 7 pueden desarrollarse en paralelo tras completar Fase 3.

---

### Fase 0: Setup del Proyecto

**Objetivo**: Migrar a TypeScript, configurar Supabase, estructura base.

| Tarea | Detalle |
|-------|---------|
| Migrar a TS | `tsconfig.json` con strict, path aliases `@/*`, renombrar `.jsx` → `.tsx` |
| Supabase | Instalar `@supabase/supabase-js`, crear `src/lib/supabase.ts`, `.env.local` |
| ESLint + Prettier | `@typescript-eslint/*`, `prettier-plugin-tailwindcss` |
| Dependencias base | `react-router-dom`, `zustand`, `lucide-react`, `clsx`, `tailwind-merge`, `@tanstack/react-query` |
| Estructura carpetas | Crear toda la estructura de `src/` |
| Tipos base | `block.types.ts`, `page.types.ts`, `workspace.types.ts` |
| Tailwind extendido | Colores Notion (10), fuentes (default/serif/mono), dark mode `class` |
| `cn()` helper | `src/lib/cn.ts` con clsx + tailwind-merge |

**Criterios de aceptación**:
- `npm run dev` sin errores TS
- `npm run lint` y `npm run format` funcionan
- Path aliases `@/` resuelven
- Cliente Supabase se inicializa

---

### Fase 1: Autenticación

**Objetivo**: Login/Register con Supabase Auth, protección de rutas, perfil.

**Tablas**: `profiles` (+ trigger `handle_new_user`)

**Componentes clave**: `LoginForm`, `RegisterForm`, `AuthGuard`, `GuestGuard`, `UserMenu`

**Stores**: `auth.store.ts`

**Queries Supabase**:
- `supabase.auth.signInWithPassword()`
- `supabase.auth.signUp()`
- `supabase.auth.signOut()`
- `supabase.auth.onAuthStateChange()`

**Criterios de aceptación**:
- Registro con email/password
- Login/logout funcional
- Rutas protegidas redirigen a `/login`
- Perfil se crea automáticamente
- Sesión persiste al recargar

---

### Fase 2: Workspace y Sidebar

**Objetivo**: Navegación principal, workspace, sidebar con árbol de páginas, favoritos, CRUD de páginas.

**Tablas**: `workspaces`, `workspace_members`, `pages`, `page_favorites`

**Componentes clave**: `AppLayout`, `Sidebar`, `SidebarHeader`, `PageTree`, `PageTreeItem`, `FavoritesSection`, `NewPageButton`, `Topbar`, `Breadcrumbs`

**Stores**: `workspace.store`, `sidebar.store`, `page.store`

**Criterios de aceptación**:
- Crear/seleccionar workspace al primer login
- Sidebar con árbol de páginas expandible/colapsable
- Crear páginas y subpáginas
- Renombrar páginas inline
- Marcar/desmarcar favoritos
- Sidebar colapsable (`Cmd+\`)
- Breadcrumbs con ruta clickeable
- Navegación al clicar en sidebar
- Soft delete (desaparece de sidebar)

---

### Fase 3: Editor de Bloques (Core) — CRÍTICO

**Objetivo**: Editor WYSIWYG con bloques de texto, formato inline, slash menu, floating toolbar, drag & drop.

**Tablas**: `blocks`

**Dependencias a instalar**: `@tiptap/*`, `@dnd-kit/*`

**Componentes clave**: `BlockEditor`, `SlashMenu`, `FloatingToolbar`, `DragHandle`, `BlockMenu`, `TurnIntoMenu`, `ColorMenu`, + bloques de texto (Paragraph, Heading, Bulleted/Numbered List, Todo, Toggle, Quote, Callout, Divider)

**Lógica del editor**:
- **Enter**: crea nuevo bloque del mismo tipo
- **Backspace vacío**: elimina bloque, merge con anterior
- **Tab/Shift+Tab**: indentar/des-indentar
- **Slash Menu**: `/` abre dropdown filtrable
- **Floating Toolbar**: al seleccionar texto
- **Drag & Drop**: `@dnd-kit` con `SortableContext`
- **Markdown shortcuts**: `# `, `- `, `1. `, `[] `, `> `, `---`, ` ``` `
- **Persistencia**: debounced save (500ms) a Supabase

**Criterios de aceptación**:
- Escribir texto en bloques de párrafo
- Enter crea nuevo bloque, Backspace elimina vacío
- H1/H2/H3 via slash menu y markdown `#`
- Listas (bulleted, numbered, to-do) con nesting
- Toggle, Quote, Callout, Divider funcionales
- Slash menu `/` con filtro y Enter
- Floating toolbar con Bold, Italic, Underline, Strikethrough, Code, Color
- Drag & drop reordena bloques
- Cambios persisten en Supabase
- Markdown shortcuts funcionan

---

### Fase 4: Bloques Avanzados

**Objetivo**: Media, código, tablas simples, columnas, ecuaciones, synced blocks.

**Dependencias**: `lowlight`, `katex`, + configurar Supabase Storage

**Componentes clave**: `CodeBlock` (syntax highlighting, 10+ lenguajes), `ImageBlock` (upload, resize, caption), `VideoBlock`, `AudioBlock`, `FileBlock`, `BookmarkBlock` (OG metadata), `EmbedBlock` (iframe), `TableBlock`, `ColumnsBlock`, `EquationBlock`, `TableOfContentsBlock`, `SyncedBlock`, `ToggleHeadingBlock`

**Criterios de aceptación**:
- Code block con syntax highlighting
- Upload de imágenes con resize
- YouTube embed
- Simple table con add/remove row/col
- Columnas (2-5) con resize
- Ecuaciones KaTeX
- Table of contents auto-generado
- Synced blocks sincronizados

---

### Fase 5: Bases de Datos — MÁS COMPLEJO

**Objetivo**: BD inline/full-page, propiedades tipadas, 6 vistas, filtros/sorts/groups.

**Tablas**: `databases`, `database_properties`, `database_entries`, `database_entry_values`, `database_views`, `view_filters`, `view_sorts`, `view_groups`, `database_relations`, `database_templates`

**Componentes clave**:
- **Core**: `DatabaseView`, `DatabaseToolbar`, `ViewTabs`, `PropertyEditor`, `RecordPage`
- **Vistas**: `TableView` (TanStack Table), `BoardView` (kanban DnD), `ListView`, `CalendarView`, `GalleryView`, `TimelineView`
- **Celdas**: una por tipo de propiedad (20+)
- **Filtros**: `FilterBar`, `FilterBuilder` (AND/OR anidados)
- **Utils**: `filter-engine.ts`, `sort-engine.ts`, `formula-engine.ts`

**Criterios de aceptación**:
- Crear BD inline y full-page
- Propiedades de todos los tipos básicos
- Vista tabla con edición inline, resize columns
- Vista board con drag & drop entre columnas
- Vista lista, calendario, galería funcionales
- Filtros con operadores por tipo, AND/OR
- Sorts multi-criterio
- Groups con headers colapsables
- Cada fila se abre como página con editor

---

### Fase 6: Personalización y Página

**Objetivo**: Cover, iconos, fuentes, full width, page history, lock.

**Tablas**: `page_versions`

**Dependencias**: `@emoji-mart/react`

**Componentes clave**: `PageHeader`, `PageCover`, `PageIcon`, `EmojiPicker`, `PageSettings`, `PageHistory`

**Criterios de aceptación**:
- Cover image (upload/galería/Unsplash)
- Icono emoji picker
- Fuentes (default, serif, mono)
- Full width y small text toggles
- Lock page funcional
- Page history con restore

---

### Fase 7: Compartir y Permisos

**Objetivo**: Share menu, 5 niveles de permiso, publicar web, invitar personas.

**Tablas**: `page_permissions`, `page_shares`

**Componentes clave**: `ShareMenu`, `ShareButton`, `InviteInput`, `PermissionRow`, `PublishToggle`, `PublicPageView`

**Criterios de aceptación**:
- Share menu en topbar
- Invitar por email con nivel de permiso
- 5 niveles funcionan (full_access → can_view)
- Publicar con URL pública
- Herencia de permisos padre → hijo
- Override individual de permisos

---

### Fase 8: Colaboración

**Objetivo**: Comentarios, menciones, notificaciones, búsqueda global.

**Tablas**: `comments`, `notifications`

**Componentes clave**: `CommentThread`, `CommentInput`, `PageDiscussion`, `MentionMenu`, `InboxPanel`, `SearchModal`

**Criterios de aceptación**:
- Comentarios en bloques y páginas
- Threads con respuestas
- Resolver/reabrir comentarios
- `@` abre menciones (usuarios, páginas, fechas)
- Menciones generan notificaciones
- Inbox con badge de no leídas
- `Cmd+K` búsqueda global por título

---

### Fase 9: Teamspaces y Avanzado

**Objetivo**: Teamspaces, papelera, import/export, dark mode, responsive, atajos.

**Tablas**: `teamspaces`, `teamspace_members`

**Componentes clave**: `TeamspaceList`, `TrashPanel`, `ImportModal`, `ExportMenu`

**Tareas adicionales**:
- Dark mode: `darkMode: 'class'` en Tailwind, `useTheme` hook, CSS variables
- Responsive: sidebar overlay en mobile, toolbar inferior, columnas apiladas
- Atajos de teclado completos con `useKeyboardShortcuts`
- Import Markdown/CSV, Export Markdown/HTML/PDF

**Criterios de aceptación**:
- Teamspaces open/closed/private
- Papelera con restaurar y eliminar permanente
- Import Markdown y CSV
- Export Markdown y HTML
- Dark mode completo
- Responsive en mobile
- Atajos principales funcionales

---

### Fase 10: Optimización

**Objetivo**: Performance, offline, real-time, testing.

**Dependencias**: `@tanstack/react-virtual`, `vitest`, `@testing-library/react`

**Tareas**:
- **Performance**: virtualización de listas largas, lazy loading de componentes pesados, `React.memo`, code splitting por rutas
- **Offline**: IndexedDB con sync queue
- **Real-time**: Supabase Realtime para bloques + Presence para avatares activos
- **Testing**: unitarios (editor, filtros, sorts), e2e (crear página → editar → BD → filtrar)

---

## 6. Convenciones y Patrones

### Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `BlockEditor.tsx` |
| Hooks | camelCase + `use` | `useDebounce.ts` |
| Stores | camelCase + `.store` | `page.store.ts` |
| Services | camelCase + `.service` | `auth.service.ts` |
| Types | PascalCase, archivos `.types` | `block.types.ts` |
| Constantes | UPPER_SNAKE_CASE | `NOTION_COLORS` |
| Handlers | `handle` en componentes, `on` en props | `handleClick`, `onClick` |
| Booleanos | `is`, `has`, `should`, `can` | `isOpen`, `canEdit` |

### Estructura de componente

```typescript
// 1. Imports (react, third-party, internos, types)
import { useState, useCallback } from 'react';
import { cn } from '@/lib/cn';
import type { BlockType } from '@/types/block.types';

// 2. Props interface (named export si necesario)
interface SlashMenuProps {
  isOpen: boolean;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

// 3. Componente (SIEMPRE named export, NUNCA default)
export function SlashMenu({ isOpen, onSelect, onClose }: SlashMenuProps) {
  const [query, setQuery] = useState('');

  const handleSelect = useCallback((type: BlockType) => {
    onSelect(type);
    onClose();
  }, [onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className={cn('absolute z-50 w-72 rounded-lg border', 'bg-white shadow-lg dark:bg-gray-900')}>
      {/* ... */}
    </div>
  );
}
```

### Custom hooks

```typescript
// React Query para server state
export function usePage(pageId: string) {
  const queryClient = useQueryClient();

  const { data: page, isLoading } = useQuery({
    queryKey: ['page', pageId],
    queryFn: () => pageService.getPage(pageId),
    enabled: !!pageId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Page>) => pageService.updatePage(pageId, data),
    onMutate: async (newData) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['page', pageId] });
      const previous = queryClient.getQueryData(['page', pageId]);
      queryClient.setQueryData(['page', pageId], (old: Page) => ({ ...old, ...newData }));
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['page', pageId], ctx?.previous);
    },
  });

  return { page, isLoading, updatePage: updateMutation.mutate };
}
```

### Path aliases

```json
// tsconfig.json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

### Decisión arquitectónica clave: Editor

**TipTap (recomendado)** como motor de contenido rico dentro de cada bloque + sistema propio de bloques wrapper para estructura, drag & drop, slash menu y tipos custom.

- TipTap maneja: `contenteditable`, selections, formato inline, markdown shortcuts
- Sistema propio maneja: jerarquía de bloques, drag & drop, slash menu, bloques no-texto (imagen, BD, etc.)
