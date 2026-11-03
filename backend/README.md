# Backend — Empório da Música AI Customer Support Agent

## 1. Overview

This backend implements the customer support layer for Empório da Música, a fictional musical instrument retailer based in Campo Grande, MS, Brazil. It exposes a FastAPI application that integrates Google Gemini 2.5 Flash to answer customer questions in natural language using local structured data.

The application is intentionally lightweight and deterministic. Instead of relying on a remote database or a complex retrieval stack, it loads CSV files into memory and provides those datasets to the model as contextual facts during chat generation.

## 2. Project Structure

The repository structure relevant to the backend is:

```text
backend/
├── .env.example
├── .gitignore
├── README.md
├── data/
│   ├── categories.csv
│   ├── customers.csv
│   ├── order_items.csv
│   ├── orders.csv
│   ├── policies.pdf
│   ├── products.csv
│   ├── promotions.csv
│   └── políticas_da_loja.pdf
├── docs/
├── exceptions.py
├── main.py
├── requirements.txt
├── routes/
│   └── api.py
├── services/
│   └── ai_engine.py
└── venv/
```

Important notes:

- `venv/` is a local development environment and should not be committed to the repository.
- `.env` is also local-only and should not be versioned.
- `.env.example` is the repository-safe template for local configuration.
- The presence of `policies.pdf` and `políticas_da_loja.pdf` indicates that policy documents are stored in the data folder as reference material, but the current implementation does not actively load them into the AI retrieval flow.

## 3. Repository and Environment Setup

### 3.1 Clone the repository

The project remote configured in Git is:

```bash
git clone https://github.com/fau-33/emporium-the-music-project.git
cd emporium-the-music-project/backend
```

### 3.2 Create a virtual environment

```bash
python3.12 -m venv venv
source venv/bin/activate
```

### 3.3 Install dependencies

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### 3.4 Configure environment variables

The project uses the following environment variable for the Gemini API key:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

The template is provided in `backend/.env.example`.

```bash
cp .env.example .env
```

Do not commit `.env` to the repository.

## 4. Dependencies

The backend imports and uses the following packages:

- `fastapi`
- `uvicorn`
- `pandas`
- `pydantic`
- `python-dotenv`
- `google-genai`

The actual project dependency file currently includes:

```txt
fastapi==0.110.0
uvicorn==0.28.0
pandas==2.2.1
pydantic==2.6.4
python-dotenv==1.0.1
google-genai==1.0.0
```

This matches the imports used by the application and is consistent with the current backend implementation.

## 5. Runtime Configuration and Model Provider

The backend uses Google Gemini 2.5 Flash via the official Google GenAI SDK.

Relevant implementation details:

- the model is initialized in `backend/services/ai_engine.py` with `client = genai.Client()`;
- the environment variable is `GEMINI_API_KEY`;
- the model call is performed with `client.models.generate_content(...)`;
- the configured model name in code is `gemini-2.5-flash`.

If the API key is missing or the provider call fails, the code returns a fallback message instead of crashing the request pipeline.

## 6. How the API is Structured

### 6.1 Application entry point

`backend/main.py` initializes the FastAPI app and registers the router:

```python
app = FastAPI(...)
app.include_router(api_router, prefix="/api")
```

It also registers CORS and a custom exception handler.

### 6.2 API router

`backend/routes/api.py` contains the route definitions and dataset loading logic.

Registered endpoints:

- `GET /health`
- `GET /products`
- `GET /orders`
- `GET /promotions`
- `POST /chat`

The router exposes the following behavior:

- `health_check()` returns a simple online status payload;
- `get_products()` loads `products.csv` and returns records;
- `get_orders()` loads `orders.csv` and returns records;
- `get_promotions()` loads `promotions.csv` and returns records;
- `chat_endpoint()` validates incoming text and forwards it to the AI engine.

## 7. API Endpoints

### 7.1 Health check

```bash
curl -X GET http://127.0.0.1:8000/api/health \
  -H "accept: application/json"
```

### 7.2 Product catalog

```bash
curl -X GET http://127.0.0.1:8000/api/products \
  -H "accept: application/json"
```

### 7.3 Orders

```bash
curl -X GET http://127.0.0.1:8000/api/orders \
  -H "accept: application/json"
```

### 7.4 Promotions

```bash
curl -X GET http://127.0.0.1:8000/api/promotions \
  -H "accept: application/json"
```

### 7.5 AI chat

Request body:

```json
{
  "message": "How much is the Takamine GD20 guitar?"
}
```

Example:

```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How much is the Takamine GD20 guitar?"}'
```

Response format:

```json
{
  "reply": "..."
}
```

## 8. Retrieval Architecture

This project uses a CSV-based structured retrieval pattern.

### 8.1 How the data is loaded

The backend code loads CSV files from the `backend/data` directory via `pandas.read_csv()`.

The data is organized as:

- `products.csv`
- `orders.csv`
- `customers.csv`
- `categories.csv`
- `order_items.csv`
- `promotions.csv`

These are used as structured factual sources for the agent.

### 8.2 How the AI receives the data

In `services/ai_engine.py`, the assistant checks for product-specific keywords and, when relevant, calls `query_product_catalog(product_name)`. That function:

- opens `products.csv`;
- filters rows by matching product names case-insensitively;
- returns a compact product summary including name, price, stock, and description;
- includes this summary in the final prompt sent to the model.

This means the model is not operating on full unstructured corpus retrieval; instead, it works with targeted CSV context and a fixed system prompt.

### 8.3 Policy PDF status

The file `políticas_da_loja.pdf` and the file `policies.pdf` are present in `backend/data`, but they are not currently loaded by the backend. There is no code path that reads those PDFs to generate retrieval context. Therefore, the project should be described as a CSV-based structured retrieval architecture, not as a hybrid semantic retrieval layer.

## 9. AI Agent and Guardrails

The core agent logic lives in `backend/services/ai_engine.py`.

### 9.1 Flow of a customer message

1. The client sends a message to `POST /api/chat`.
2. `ChatRequest` validates the payload and requires a non-empty `message` string.
3. `generate_chat_response(user_message)` builds the prompt.
4. The code checks for product keywords such as `Takamine`, `Yamaha`, or `Fender` and retrieves product context from CSV data when relevant.
5. The final prompt includes:
   - system instructions;
   - store policies;
   - allowed scope;
   - optional product context;
   - the customer's message.
6. Gemini generates the response.
7. The backend cleans markdown formatting and returns the final answer as `{"reply": "..."}`.

### 9.2 Business guardrails in code

The `SYSTEM_PROMPT` explicitly restricts the assistant to a musical instruments store and forbids accessory recommendations such as:

- cables,
- picks,
- pedals,
- amplifiers,
- instrument cases.

This is enforced through the prompt itself, not through a separate validation engine. The code does not provide a strict product catalog validator beyond the prompt and the product lookup function.

## 10. Running the Backend

From the backend folder:

```bash
cd /home/flavio/projetos2/emporium-the-music-project/backend
source venv/bin/activate
python -m uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger docs:

```text
http://127.0.0.1:8000/docs
```

## 11. Known Limitations

This implementation is intentionally simple and suitable for a technical challenge, but it has real limitations.

### 11.1 CSV-only retrieval

The backend does not use a database, a vector database, or semantic search. Retrieval is based on direct file reads and filtered Pandas queries.

### 11.2 No persistent session memory

Each request is processed independently. There is no conversation history persistence between calls.

### 11.3 No automated tests yet

There is no formal test suite for routes, prompt validation, or data integrity.

### 11.4 External dependency on Gemini

The final answer depends on the availability and reliability of the Google Gemini API, as well as the quality of the prompt and the data passed to it.

## 12. Improvements with More Time

If the project had more time, the following improvements would be valuable:

- migrate from CSV files to a relational database or a more structured data layer;
- add semantic retrieval with ChromaDB or Qdrant;
- implement session memory with Redis or database-backed chat state;
- add pytest coverage for API and data flows;
- add structured logs and monitoring;
- add prompt and answer evaluation against curated scenarios.

## 13. AI-Assisted Development Workflow

This section is intentionally limited to what can be confirmed from the actual development context.

The project was developed with assistance from AI-enabled tooling, but the evidence available for this repository points primarily to GitHub Copilot in VS Code as the practical coding assistant used in the workflow.

The AI was used to help with:

- scaffolding the FastAPI structure;
- improving code organization and route design;
- debugging import/runtime issues;
- refining prompt wording and guardrail logic;
- drafting technical documentation.

Important note: the AI was a productivity enhancer, not the final decision-maker. The final architecture, implementation choices, and responsible engineering decisions were made by the developer.

## 14. Dependencies Summary

The project dependency file currently declares:

```txt
fastapi==0.110.0
uvicorn==0.28.0
pandas==2.2.1
pydantic==2.6.4
python-dotenv==1.0.1
google-genai==1.0.0
```

These are the packages actually required by the code in its current state.

## 15. Final Notes

This backend is a functional and transparent proof-of-concept for an AI-powered customer support system. It combines:

- a lightweight FastAPI API,
- deterministic local CSV retrieval,
- Google Gemini 2.5 Flash,
- explicit business guardrails in the system prompt.

It is appropriate for a technical challenge, a prototype, or a demo, but it is not yet a production-grade system with semantic retrieval, persistent memory, or end-to-end automated coverage.

---

**Backend documentation — Empório da Música AI Customer Support Agent**
