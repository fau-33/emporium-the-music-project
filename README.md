# Empório da Música

Empório da Música is a technical-challenge project for a musical-instrument store based in Campo Grande, MS, Brazil. It combines a React storefront with a FastAPI backend and a Portuguese-language customer-support assistant powered by Google Gemini.

The application displays a product catalog and promotions, and lets visitors ask about products, orders, and store policies. Product and order information comes from local CSV files; the assistant receives relevant, filtered data as prompt context.

## Features

- Responsive storefront with instrument categories, product cards, product details, and a chat interface.
- Catalog and promotion data loaded from the backend.
- Chat responses grounded in matching product or order data and the store-policy PDF.
- API endpoints for health status, products, orders, promotions, and chat.

## Technology

**Frontend**

- React 19 and React DOM
- TypeScript for shared types and API service code; the application entry points and page composition use JSX
- Vite 8
- Tailwind CSS 4, PostCSS, and Autoprefixer
- Lucide React icons

**Backend**

- Python with FastAPI, Uvicorn, and Pydantic
- pandas for reading and filtering CSV data
- `python-dotenv` for loading local environment variables
- Google Gen AI SDK (`google-genai`) for Gemini requests
- pypdf for extracting text from the store-policy PDF

## Architecture and request flow

```text
Browser (React/Vite)
    │  HTTP requests to http://127.0.0.1:8000/api
    ▼
FastAPI (backend/main.py)
    │
    ├── API routes (backend/routes/api.py)
    │     └── pandas reads local CSV files for catalog and order endpoints
    │
    └── Chat service (backend/services/ai_engine.py)
          ├── detects product and order questions
          ├── builds context from matching CSV rows
          ├── extracts text from the store-policy PDF
          └── sends the prompt to Google Gemini
```

The frontend calls the backend through `frontend/src/services/api.ts`. Its API base URL is currently hard-coded as `http://127.0.0.1:8000/api`; the frontend does not currently read an API URL from an environment variable. FastAPI enables CORS for local development origins on ports 3000 and 5173.

This design keeps the UI, API, local data handling, and model integration in separate, small components. CSV files are sufficient for this demonstration dataset and avoid introducing a database service. The API layer provides a single interface for the frontend and the chat service, while the model is used for natural-language responses rather than as the source of catalog facts.

## Requirements

- Python 3.12 is the version used in the backend setup instructions.
- Node.js `^20.19.0` or `>=22.12.0` and npm, as required by the frontend's Vite version.
- A Google Gemini API key to generate AI chat responses.

## Setup

Clone the repository and enter its root directory:

```bash
git clone https://github.com/fau-33/emporium-the-music-project.git
cd emporium-the-music-project
```

### Configure the backend

Create and activate a virtual environment, then install the pinned dependencies:

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Copy the safe template and add your own key to `backend/.env`:

```bash
cp .env.example .env
```

Set the value in `.env`:

```dotenv
GEMINI_API_KEY=your_google_gemini_api_key
```

Keep the real key in `backend/.env` only. The repository's `.gitignore` excludes `.env`; do not commit, publish, or include the key in screenshots or logs. The backend loads it with `python-dotenv`. Without a key, chat returns a configuration message instead of a Gemini-generated answer.

### Install frontend dependencies

In a second terminal, from the repository root:

```bash
cd frontend
npm ci
```

## Run the application

Start the backend from `backend/` with its virtual environment activated:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API is available at `http://127.0.0.1:8000`; its interactive Swagger documentation is at `http://127.0.0.1:8000/docs`.

Start the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

Vite serves the development app at `http://localhost:5173` by default. The frontend service is configured to call the backend at `http://127.0.0.1:8000/api`.

## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | API welcome response and links to health and API documentation |
| `GET` | `/api/health` | Returns the API's online status |
| `GET` | `/api/products` | Returns rows from `products.csv` |
| `GET` | `/api/orders` | Returns rows from `orders.csv` |
| `GET` | `/api/promotions` | Returns rows from `promotions.csv` |
| `POST` | `/api/chat` | Sends a customer message to the assistant |

Chat request:

```json
{
  "message": "Do you have a Yamaha C40?"
}
```

Chat response:

```json
{
  "reply": "..."
}
```

For example:

```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Do you have a Yamaha C40?"}'
```

The chat endpoint rejects empty messages. The product, order, and promotion endpoints return the underlying dataset records; the promotions endpoint does not itself limit its response to active promotions.

## Data retrieval

The backend's local data files are `products.csv`, `categories.csv`, `promotions.csv`, `orders.csv`, `order_items.csv`, and `customers.csv`, all under `backend/data/`. Endpoints load their respective files with pandas. The assistant conditionally creates chat context rather than sending all CSV files on every request.

**Product questions:** The chat service normalizes text, handles common Portuguese accents and stop words, and recognizes product IDs, category aliases, product-name tokens, and price limits. For name matching, each remaining query token must occur in the normalized product name; this is token-based filtering, not semantic or fuzzy search. Category matching uses `categories.csv`. Price constraints are applied to the matched rows, which are sorted by price and limited to ten results.

The assistant context includes a product's ID, name, price, stock quantity, status, and description. Availability is derived from status and stock. Promotions are joined by `product_id` and included only when marked active with a discount greater than 0 and no greater than 100 percent. A category-only query selects active, in-stock items; an explicit ID or name match can also return a product that is out of stock or discontinued so that its status can be described.

**Order questions:** When a message looks like an order query, the service extracts an order number and matches `orders.csv` to `order_items.csv` by `order_id`, then item records to `products.csv` by `product_id`. Its context includes order status, total, payment method, tracking code, estimated delivery, and item names and quantities. It does not include customer phone or email in that summary.

The storefront catalog and promotion endpoints expose their CSV records separately from this assistant-specific filtering. Data is read from local files at request time; there is no database or vector index.

## Assistant prompt, rules, and limitations

The backend's `SYSTEM_PROMPT` instructs Gemini to respond in Portuguese with a friendly, professional tone; limit store-related recommendations to musical instruments; decline accessory requests; treat CSV context as authoritative for product existence, price, stock, and status; and avoid inventing policy details. Each prompt also includes text extracted from `backend/data/políticas_da_loja.pdf` (or a fallback message if the policy file is unavailable) and any relevant product or order context.

The provider and model identifier configured in `backend/services/ai_engine.py` are **Google Gemini**, called through Google's `google-genai` SDK, with the model string **`gemini-3.5-flash-lite`**. This describes the identifier in the current code; successful use still depends on the configured key and the model's availability to that key. The key is read from `GEMINI_API_KEY`, not embedded in source code.

These safeguards are prompt instructions and context-building logic, not a separate policy-enforcement or answer-verification system. Responses can still be incomplete or incorrect. Product detection relies on keywords and simple token matching, and an ambiguous query may not retrieve the intended rows. Each chat request is independent: the backend does not persist conversation history or provide session memory. Gemini availability, quota, and network access also affect generated responses.

## Technical decisions

- **React and FastAPI are separate applications:** This allows the frontend to consume a small HTTP API without coupling UI code to Python or model-provider details.
- **Local CSVs and pandas provide structured lookup:** This is a lightweight fit for the supplied challenge data, and the filtering and ID-based joins are inspectable. It does not provide transactional updates, concurrent-write handling, or database query capabilities.
- **Gemini generates conversational wording, not catalog records:** The backend selects structured context before calling the model, reducing the need to place all source data in each request while giving the model facts to reference.
- **The policy PDF is extracted with pypdf:** Its text can be included alongside the hard-coded assistant rules without treating the PDF as a vector-search corpus.
- **The API key stays in the backend environment:** The frontend makes requests to the backend and does not receive the Gemini credential.

## Known limitations and possible improvements

- There is no authentication or authorization on the API, including the orders endpoint; it should not be exposed as-is for real customer data.
- Data is stored in CSV files and re-read for requests; there is no database, transaction layer, or data-management interface.
- Product lookup uses keyword/token matching rather than semantic retrieval, and the assistant has no persistent chat history.
- The frontend API URL and backend CORS development origins are configured in code, rather than through deployment-specific environment settings.
- The model is an external service dependency. The backend returns a configuration or sanitized service-error message when it cannot produce a Gemini response.
- Production hardening could include access controls and customer-level order authorization, configurable API URLs and CORS origins, database-backed data, better search, persisted sessions, and automated tests and monitoring.

## AI-assisted development workflow

The backend documentation records the use of GitHub Copilot in VS Code as a development aid for scaffolding and organizing the FastAPI project, debugging, refining prompt and guardrail wording, and drafting documentation. AI assistance is part of the development workflow, not a runtime dependency for the storefront or backend itself; Gemini is the runtime provider for chat responses. The code and technical decisions remain subject to developer review, and this README describes the implementation visible in the repository rather than claiming that AI-generated output was automatically correct.

## Conversation examples

The repository includes four illustrative conversations in [`backend/docs/conversations/`](backend/docs/conversations/):

- [Catalog and pricing](backend/docs/conversations/01_catalogo_e_precos.md)
- [Returns and warranty](backend/docs/conversations/02_politica_devolucao_e_garantia.md)
- [Out-of-scope requests](backend/docs/conversations/03_recusa_fora_de_escopo.md)
- [Store information and shipping](backend/docs/conversations/04_informacoes_loja_e_frete.md)

These files are examples, not automated tests or guaranteed model outputs. Their sample answers may not exactly match the current CSV data, prompt, or policy document; the current implementation and data files are the source to consult when evaluating behavior.
