# Empório da Música Frontend

## Overview

The Empório da Música frontend is a responsive instrument-store interface built with React. It presents a hero section, instrument categories, a product catalog populated by the FastAPI backend, active product promotions, product details, and a virtual assistant chat.

## Technologies

- React 19 and React DOM
- TypeScript for typed components, services, and data models; the app entry point is JSX
- Vite 8 for development and production builds
- Tailwind CSS 4, processed with PostCSS and Autoprefixer
- Lucide React for interface icons
- ESLint for linting

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (required by the installed Vite 8 version)
- npm
- Access to the FastAPI backend at `http://127.0.0.1:8000` for live catalog, promotions, and chat data

## Installation

From the `frontend/` directory, install the locked dependencies:

```bash
npm ci
```

## Environment Configuration

The frontend does not currently define environment variables or read a `.env` file for the API URL. `src/services/api.ts` uses the fixed base URL:

```text
http://127.0.0.1:8000/api
```

To use a different backend host, update `API_BASE_URL` in `src/services/api.ts`. No `VITE_*` API URL variable is currently supported.

## Running

Start the Vite development server:

```bash
npm run dev
```

Create a production build in `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

`npm run preview` serves the already-built output; run `npm run build` first.

## Project Structure

```text
frontend/
├── public/                 # Static public assets, including product images
├── src/
│   ├── assets/             # Imported frontend assets
│   ├── components/         # Header, hero, categories, catalog, footer, and 404 UI
│   ├── services/api.ts     # FastAPI requests and fixed API base URL
│   ├── types/              # Product, promotion, chat, and API response types
│   ├── App.jsx             # Main page composition and pathname-based 404 choice
│   ├── index.css           # Tailwind CSS entry point
│   └── main.jsx            # React application bootstrap
├── eslint.config.js        # ESLint configuration
├── postcss.config.js       # Tailwind CSS and Autoprefixer configuration
├── tailwind.config.js      # Tailwind content configuration
├── tsconfig.json           # TypeScript compiler configuration
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and npm scripts
```

## Main Features

- **Catalog:** `ProductGrid` loads products from the backend, removes duplicate product IDs, and presents responsive product cards with price, stock/status, and available local or backend images.
- **Categories:** `Categories` presents the instrument categories with Lucide icons.
- **Promotions:** `ProductGrid` loads promotions and displays valid active discounts on the corresponding product cards. Product details also show the promotion when available. `PromotionsSection.tsx` exists as a standalone component but is not mounted by the current `App`.
- **Product details:** Selecting a product opens a responsive modal with its image, name, description, price, promotion, and availability. It can be dismissed using the close button, Escape, or a click outside the dialog.
- **AI assistant chat:** The header opens the “Music Store Assistant” chat. Messages are sent through the API service; the interface shows sending and error states. “New conversation” clears the current client-side messages and input.
- **Navigation:** The header links to the existing home (`#home`), catalog (`#catalog`), and footer (`#footer`) sections. The hero also provides catalog and assistant actions.
- **404 page:** With no routing library installed, `App.jsx` renders the custom 404 page when the pathname is neither `/` nor `/index.html`. The host serving the built single-page application must return `index.html` for unknown paths.

## Backend Integration

Requests are implemented in `src/services/api.ts` using the fixed API base URL `http://127.0.0.1:8000/api`:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check backend availability when the header mounts |
| `GET` | `/api/products` | Load catalog products |
| `GET` | `/api/promotions` | Load product promotions |
| `POST` | `/api/chat` | Send a message to the assistant |

The chat request sends JSON in the form `{ "message": "..." }`; the frontend reads the `reply` field from the response. The catalog and chat surface loading or request errors in the interface. Product and promotion data are represented by types in `src/types/index.ts`.

## Validation

Run the available lint, TypeScript, and production-build checks from `frontend/`:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

There is no dedicated test script in `package.json`.
