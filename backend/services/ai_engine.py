import os
import re

import pandas as pd
from dotenv import load_dotenv
from google import genai
from pypdf import PdfReader

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()


def get_gemini_client():
    """Create a Gemini client only when an API key is configured."""
    if not GEMINI_API_KEY:
        return None
    return genai.Client(api_key=GEMINI_API_KEY)


client = get_gemini_client()


def is_gemini_configured() -> bool:
    return bool(GEMINI_API_KEY)


def safe_gemini_error_message(error: Exception) -> str:
    """Return a sanitized message that never exposes the real API key or internal details."""
    message = str(error).lower()
    if "api_key" in message or "auth" in message or "key" in message:
        return "O serviço de IA da Gemini não pôde ser acessado com a chave configurada. Verifique o valor de GEMINI_API_KEY no arquivo .env."
    if "rate limit" in message or "quota" in message:
        return "O serviço de IA da Gemini está temporariamente indisponível ou excedeu o limite de requisições. Tente novamente em alguns instantes."
    if "timeout" in message or "unavailable" in message or "connection" in message:
        return "O serviço de IA da Gemini está indisponível no momento. Tente novamente mais tarde."
    return "Não foi possível processar a mensagem no momento. Tente novamente em alguns instantes."


POLICY_FILE_CANDIDATES = [
    "políticas_da_loja.pdf",
    "policies.pdf",
]

CATEGORY_ALIASES = {
    "guitarras": ["guitarra", "guitarras", "guitarra eletrica", "guitarra elétrica"],
    "baixos": ["baixo", "baixos"],
    "baterias": ["bateria", "baterias", "percussao", "percussão"],
    "teclados": ["teclado", "teclados", "piano digital", "piano"],
    "violões": ["violao", "violão", "violões", "violoes", "violao folk", "violão folk", "violao classico", "violão clássico"],
    "instrumentos de sopro": ["sopro", "flauta", "clarinete", "sax", "saxofone", "oboé", "oboe", "trompete", "trombone"],
    "cordas orquestrais": ["cordas", "violino", "viola", "violoncelo", "contrabaixo", "orquestra"],
    "ukuleles": ["ukulele", "ukuleles"],
}

STOP_WORDS = {
    "quanto", "custa", "valor", "preco", "preço", "produto", "produtos", "quais", "qual",
    "vocês", "voce", "voces", "você", "tem", "têm", "temos", "você", "voces", "ha",
    "há", "disponivel", "disponível", "estoque", "algum", "alguns", "são", "serao",
    "são", "me", "minha", "quer", "quero", "loja", "vocês", "nossa", "nos", "ainda",
    "por", "com", "para", "de", "do", "da", "das", "dos", "mais", "menos", "ate",
    "até", "r", "rs", "reais", "real"
}


SYSTEM_PROMPT = """
You are the virtual customer service assistant for Empório da Música, a musical instruments store located in Campo Grande, MS.

Key Directives:
1. Persona: Friendly, welcoming, and knowledgeable about musical instruments.
2. Scope Restriction: The store EXCLUSIVELY sells musical instruments (guitars, basses, drums, keyboards, ukuleles, wind, and orchestral strings). The store DOES NOT sell accessories (strings, picks, cables, cases, pedals, or amplifiers). Always politely decline accessory inquiries and explain this store policy.
3. Store Policies:
   - Address: Rua 14 de Maio, 3200 — Centro, Campo Grande - MS, CEP 79202-333.
   - Store hours: Monday to Friday from 09:00 to 18:00; Saturday from 09:00 to 13:00; Sunday and holidays closed.
   - Payments: PIX with 5% discount, debit, credit (up to 12 installments without interest, minimum installment R$ 100.00), and boleto.
   - Shipping: free delivery in Greater Campo Grande for orders above R$ 500.00; orders below R$ 500.00 have a fixed fee of R$ 35.00; delivery takes 1 to 3 business days in the metropolitan area.
   - Return right: online purchases may be returned within 7 calendar days of receipt, without justification, as long as the item is in original packaging and with accessories/manuals.
   - Refunds: returned to the original payment method within 10 business days.
   - Warranty: 90-day legal warranty against manufacturing defects. Additional manufacturer warranty may vary from 6 months to 2 years.
   - Delivery for other cities: via Correios or Jadlog with tracking and insurance.
4. Language: Respond to the customer in Portuguese, maintaining a helpful and professional tone.
5. If a store policy is not explicitly available in the policy document, say that you do not have that information and do not invent it.
"""


def load_products_df() -> pd.DataFrame:
    path = os.path.join(DATA_DIR, "products.csv")
    df = pd.read_csv(path)
    df["price_brl"] = pd.to_numeric(df["price_brl"], errors="coerce").fillna(0)
    df["stock_quantity"] = pd.to_numeric(df["stock_quantity"], errors="coerce").fillna(0)
    df["status"] = df["status"].fillna("").astype(str).str.lower()
    return df


def load_orders_df() -> pd.DataFrame:
    path = os.path.join(DATA_DIR, "orders.csv")
    df = pd.read_csv(path)
    df["order_id"] = pd.to_numeric(df["order_id"], errors="coerce").fillna(0).astype(int)
    df["total_brl"] = pd.to_numeric(df["total_brl"], errors="coerce").fillna(0)
    return df


def load_customers_df() -> pd.DataFrame:
    path = os.path.join(DATA_DIR, "customers.csv")
    df = pd.read_csv(path)
    df["customer_id"] = pd.to_numeric(df["customer_id"], errors="coerce").fillna(0).astype(int)
    return df


def load_order_items_df() -> pd.DataFrame:
    path = os.path.join(DATA_DIR, "order_items.csv")
    df = pd.read_csv(path)
    df["order_id"] = pd.to_numeric(df["order_id"], errors="coerce").fillna(0).astype(int)
    df["product_id"] = pd.to_numeric(df["product_id"], errors="coerce").fillna(0).astype(int)
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").fillna(0).astype(int)
    return df


def read_store_policy_text() -> str:
    """
    Read the store policy PDF and return the plain-text content.
    If the file does not exist or cannot be read, return a clear fallback message.
    """
    for filename in POLICY_FILE_CANDIDATES:
        policy_path = os.path.join(DATA_DIR, filename)
        if os.path.exists(policy_path):
            try:
                reader = PdfReader(policy_path)
                pages = []
                for page in reader.pages:
                    text = page.extract_text() or ""
                    if text:
                        pages.append(text)
                if pages:
                    return "\n\n".join(pages)
            except Exception:
                return "A política da loja está indisponível no momento. Não há informações verificadas sobre esse assunto."
    return "A política da loja não está disponível no diretório de dados. Não tenho informação confirmada sobre esse assunto."


def normalize_text(value: str) -> str:
    if not value:
        return ""
    value = value.lower().strip()
    value = value.replace("ç", "c")
    value = value.replace("ã", "a").replace("á", "a").replace("à", "a")
    value = value.replace("ẽ", "e").replace("é", "e").replace("ê", "e")
    value = value.replace("í", "i").replace("õ", "o").replace("ó", "o").replace("ô", "o")
    value = value.replace("ú", "u")
    value = value.replace("\n", " ")
    value = re.sub(r"\s+", " ", value)
    return value


def parse_money(value: str) -> float:
    if value is None:
        return 0.0
    cleaned = value.strip().lower().replace("r$", "").replace("rs", "").replace(" ", "")
    if not cleaned:
        return 0.0

    if "," in cleaned and "." in cleaned:
        if cleaned.rfind(",") > cleaned.rfind("."):
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", "")
    elif "," in cleaned:
        if cleaned.count(",") > 1:
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            decimal_part = cleaned.split(",")[-1]
            if len(decimal_part) == 3 and decimal_part.isdigit():
                cleaned = cleaned.replace(",", "")
            else:
                cleaned = cleaned.replace(",", ".")
    elif "." in cleaned:
        parts = cleaned.split(".")
        if len(parts) > 1 and len(parts[-1]) == 3 and parts[-1].isdigit():
            cleaned = "".join(parts)
    return float(cleaned)


def extract_price_range(text: str):
    normalized = normalize_text(text)
    min_price = None
    max_price = None

    if re.search(r"entre\s*(?:r\$\s*)?(\d+(?:[.,]\d{3})*(?:[.,]\d+)?)\s*(?:e|a)\s*(?:r\$\s*)?(\d+(?:[.,]\d{3})*(?:[.,]\d+)?)", normalized):
        numbers = re.findall(r"(?:r\$\s*)?(\d+(?:[.,]\d{3})*(?:[.,]\d+)?)", normalized)
        if len(numbers) >= 2:
            min_price = parse_money(numbers[0])
            max_price = parse_money(numbers[1])
            if min_price > max_price:
                min_price, max_price = max_price, min_price
            return min_price, max_price

    max_match = re.search(r"(?:ate|até|ate r\$|até r\$|maximo|maxima|máximo|máxima|limite)\s*(?:r\$\s*)?(\d+(?:[.,]\d{3})*(?:[.,]\d+)?)", normalized)
    if max_match:
        max_price = parse_money(max_match.group(1))

    min_match = re.search(r"(?:acima de|mais de|superior a|maior que|a partir de)\s*(?:r\$\s*)?(\d+(?:[.,]\d{3})*(?:[.,]\d+)?)", normalized)
    if min_match:
        min_price = parse_money(min_match.group(1))

    if max_price is None:
        has_price_signal = any(marker in normalized for marker in ["r$", "rs", "ate ", "até ", "acima de", "mais de", "maximo", "máximo", "valor", "preco", "preço", "quanto custa"])
        if has_price_signal:
            explicit_price_match = re.search(r"(?:r\$\s*|rs\s*)?(\d+(?:[.,]\d{3})*(?:[.,]\d+)?)", normalized)
            if explicit_price_match:
                max_price = parse_money(explicit_price_match.group(1))

    return min_price, max_price


def infer_category(text: str):
    normalized = normalize_text(text)
    for category_name, aliases in CATEGORY_ALIASES.items():
        for alias in aliases:
            if alias in normalized:
                return category_name
    return None


def looks_like_product_query(text: str) -> bool:
    normalized = normalize_text(text)
    for keyword in [
        "quanto custa", "valor", "preco", "preço", "disponivel", "disponível", "estoque",
        "violao", "violão", "guitarra", "baixo", "bateria", "teclado", "piano",
        "ukulele", "produto", "modelo", "marca", "instrumento"
    ]:
        if keyword in normalized:
            return True
    return infer_category(normalized) is not None


def search_products_in_catalog(user_message: str) -> str:
    """
    Search the products catalog using a flexible set of heuristics: product name, brand, category, price range and availability.
    Returns a compact, readable summary for the prompt.
    """
    df = load_products_df()
    filtered = df[df["status"] == "active"].copy()
    filtered = filtered[filtered["stock_quantity"] > 0].copy()

    text = normalize_text(user_message)

    category_name = infer_category(text)
    if category_name:
        category_lookup = {
            "guitarras": "Guitarras",
            "baixos": "Baixos",
            "baterias": "Baterias e Percussão",
            "teclados": "Teclados e Pianos",
            "violões": "Violões",
            "instrumentos de sopro": "Instrumentos de Sopro",
            "cordas orquestrais": "Cordas Orquestrais",
            "ukuleles": "Ukuleles",
        }
        category_df = pd.read_csv(os.path.join(DATA_DIR, "categories.csv"))
        category_label = category_lookup.get(category_name, category_name)
        category_match = category_df[category_df["name"].str.contains(category_label, case=False, na=False)]
        if not category_match.empty:
            category_id = category_match.iloc[0]["category_id"]
            filtered = filtered[filtered["category_id"] == category_id]

    min_price, max_price = extract_price_range(text)
    if min_price is not None:
        filtered = filtered[filtered["price_brl"] >= min_price]
    if max_price is not None:
        filtered = filtered[filtered["price_brl"] <= max_price]

    if category_name is None:
        product_tokens = [
            token for token in re.findall(r"[a-z0-9]+", text)
            if token and token not in STOP_WORDS and not re.fullmatch(r"\d+(?:[.,]\d+)?", token)
        ]
        if product_tokens:
            product_query = " ".join(product_tokens)
            if len(product_query) >= 3:
                filtered = filtered[filtered["name"].str.contains(product_query, case=False, na=False)]

    if filtered.empty:
        return "Nenhum produto disponível com esses critérios foi encontrado no catálogo atual. Verifique o nome do produto, a categoria, o preço máximo ou a disponibilidade em estoque."

    filtered = filtered.sort_values("price_brl").head(10)
    rows = []
    for _, product in filtered.iterrows():
        rows.append(
            f"{product['name']} | Preço: R$ {float(product['price_brl']):.2f} | Estoque: {int(product['stock_quantity'])} | Descrição: {product['description']}"
        )
    return "\n".join(rows)


def query_product_catalog(product_name: str) -> str:
    """
    Flexible product lookup on the real catalog.
    """
    df = load_products_df()
    filtered = df[(df["status"] == "active") & (df["stock_quantity"] > 0)].copy()

    search_term = normalize_text(product_name)
    if not search_term:
        return "Produto não informado."

    match = filtered[filtered["name"].str.contains(search_term, case=False, na=False)]
    if match.empty:
        return f"Produto '{product_name}' não foi encontrado no catálogo ativo e disponível."

    prod = match.iloc[0]
    return (
        f"Produto encontrado: {prod['name']} | "
        f"Preço: R$ {float(prod['price_brl']):.2f} | "
        f"Estoque: {int(prod['stock_quantity'])} unidades | "
        f"Descrição: {prod['description']}"
    )


def extract_order_id_from_text(text: str):
    if not text:
        return None
    normalized = normalize_text(text)
    match = re.search(r"(?:pedido|order|ordem)\s*(?:n(?:u|ú)m(?:e|e)ro|numero|n\.?\s*)?\s*(\d+)", normalized)
    if match:
        return int(match.group(1))

    digits = re.findall(r"\d+", text)
    if digits:
        return int(digits[0])
    return None


def looks_like_order_query(text: str) -> bool:
    if not text:
        return False
    normalized = normalize_text(text)
    order_keywords = [
        "pedido", "status do pedido", "status pedido", "meu pedido", "detalhes do pedido",
        "order", "tracking", "rastreamento", "entrega", "previsao de entrega", "previsão de entrega"
    ]
    return any(keyword in normalized for keyword in order_keywords)


def get_order_status_details(user_message: str) -> str:
    """
    Read the order, customer, product and item datasets from the local CSVs and return a safe order-status summary.
    This function does not invent data and intentionally avoids exposing personal contact details.
    """
    order_id = extract_order_id_from_text(user_message)
    if order_id is None:
        return "Não consegui identificar o número do pedido na mensagem. Envie o número do pedido para que eu possa localizar o status."

    orders_df = load_orders_df()
    customers_df = load_customers_df()
    order_items_df = load_order_items_df()
    products_df = load_products_df()

    order_match = orders_df[orders_df["order_id"] == order_id]
    if order_match.empty:
        return f"Não localizei o pedido número {order_id}. Verifique o número informado e tente novamente."

    order = order_match.iloc[0]
    customer_id = int(order.get("customer_id", 0))
    customer_match = customers_df[customers_df["customer_id"] == customer_id]
    customer_label = f"cliente #{customer_id}" if customer_match.empty else f"cliente #{customer_id}"

    items = order_items_df[order_items_df["order_id"] == order_id]
    item_lines = []
    if items.empty:
        item_lines.append("Nenhum item registrado para este pedido.")
    else:
        for _, item in items.iterrows():
            product_id = int(item.get("product_id", 0))
            product_match = products_df[products_df["product_id"] == product_id]
            product_name = product_match.iloc[0]["name"] if not product_match.empty else f"produto #{product_id}"
            quantity = int(item.get("quantity", 0))
            item_lines.append(f"- {product_name} (quantidade: {quantity})")

    status = str(order.get("status", "desconhecido")).strip() or "desconhecido"
    order_date = str(order.get("order_date", "não informado")).strip() or "não informado"
    total_brl = float(order.get("total_brl", 0) or 0)
    payment_method = str(order.get("payment_method", "não informado")).strip() or "não informado"
    tracking_code = str(order.get("tracking_code", "")).strip() or "não informado"
    estimated_delivery = str(order.get("estimated_delivery", "")).strip() or "não informado"

    status_label = {
        "pending": "pendente",
        "confirmed": "confirmado",
        "shipped": "em transporte",
        "delivered": "entregue",
    }.get(status.lower(), status.lower())

    summary = (
        f"Pedido nº {int(order['order_id'])} | {customer_label} | Status: {status_label} | "
        f"Data do pedido: {order_date} | Valor total: R$ {total_brl:.2f} | "
        f"Pagamento: {payment_method} | Código de rastreio: {tracking_code} | "
        f"Previsão de entrega: {estimated_delivery}.\n"
        f"Itens:\n" + "\n".join(item_lines)
    )
    return summary


def generate_chat_response(user_message: str) -> str:
    """
    Generate an intelligent response using Google Gemini API combined with catalog lookup.
    """
    if not is_gemini_configured():
        return (
            "Olá! O assistente está configurado com o motor Gemini, mas a chave de API (GEMINI_API_KEY) "
            "ainda não foi configurada no arquivo .env. Configure sua chave gratuita do Google AI Studio para ativar a IA completa!"
        )

    policy_data = read_store_policy_text()

    context_data = ""
    if looks_like_product_query(user_message):
        context_data = search_products_in_catalog(user_message)

    full_prompt = f"""
    {SYSTEM_PROMPT}

    [Formatting Guideline]:
    Respond in clear, natural paragraphs without excessive bullet points or raw symbols. Keep it clean, professional, and customer-friendly.

    [Store Policy Document]:
    {policy_data}

    [Catalog Data Retrieved from Local CSV Files]:
    {context_data if context_data else "No product catalog query was detected for this message. Only use general store-policy guidance."}

    Customer Message: {user_message}
    """

    try:
        gemini_client = get_gemini_client()
        if gemini_client is None:
            return "O serviço de IA não está disponível porque a chave GEMINI_API_KEY não foi configurada."

        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=full_prompt,
        )
        cleaned_text = response.text.replace("*", "").strip()
        return cleaned_text
    except Exception as e:
        return safe_gemini_error_message(e)