import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

def get_product_price_from_csv(product_name_query: str):
    """
    Search for a product in the products.csv dataset and return its price and details.
    """
    path = os.path.join(DATA_DIR, "products.csv")
    if not os.path.exists(path):
        return None
        
    df = pd.read_csv(path)
    # Search case-insensitive for matching product name
    match = df[df["name"].str.contains(product_name_query, case=False, na=False)]
    if match.empty:
        return None
        
    product = match.iloc[0]
    return {
        "name": product["name"],
        "price": product["price_brl"],
        "description": product["description"],
        "stock": product["stock_quantity"]
    }

def generate_chat_response(user_message: str) -> str:
    """
    Generate an intelligent response based on store policies and live CSV catalog data.
    """
    message_lower = user_message.lower()
    
    # 1. Check for scope restriction (accessories)
    if any(item in message_lower for item in ["palheta", "cabo", "pedal", "amplificador", "case", "corda"]):
        return (
            "Na Empório da Música trabalhamos exclusivamente com a venda de instrumentos musicais "
            "(guitarras, violões, baixos, teclados, baterias, etc.). Não comercializamos acessórios "
            "como cabos, palhetas, pedais ou amplificadores. Posso te ajudar a escolher um instrumento?"
        )

    # 2. Check if user is asking for a specific product price/info (e.g. Takamine GD20)
    if "takamine gd20" in message_lower or "gd20" in message_lower:
        prod = get_product_price_from_csv("Takamine GD20")
        if prod:
            return (
                f"O {prod['name']} custa R$ {prod['price']:.2f}. "
                f"Descrição: {prod['description']} "
                f"Temos {prod['stock']} unidades disponíveis em estoque!"
            )

    # 3. General catalog or greeting fallback
    if "violão" in message_lower or "preço" in message_lower or "catálogo" in message_lower:
        return (
            "Temos diversos instrumentos musicais em nosso catálogo com ótimas condições! "
            "Oferecemos 5% de desconto no PIX e parcelamento em até 12x. Qual instrumento você procura?"
        )

    return (
        "Olá! Seja bem-vindo à Empório da Música. "
        "Como posso ajudar você com nossos instrumentos musicais hoje?"
    )