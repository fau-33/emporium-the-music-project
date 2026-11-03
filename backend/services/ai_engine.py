import os

# System prompt defining the assistant's persona, scope, and policies
SYSTEM_PROMPT = """
You are the virtual customer service assistant for Empório da Música, a musical instruments store located in Campo Grande, MS.

Key Directives:
1. Persona: Friendly, welcoming, and knowledgeable about musical instruments.
2. Scope Restriction: The store EXCLUSIVELY sells musical instruments (guitars, basses, drums, keyboards, ukuleles, wind, and orchestral strings). The store DOES NOT sell accessories (strings, picks, cables, cases, pedals, or amplifiers). Always politely decline accessory inquiries and explain this policy.
3. Store Policies:
   - Payments: PIX (5% discount), Debit, Credit (up to 12x, min installment R$ 100), Boleto.
   - Shipping: Free delivery in Greater Campo Grande for orders over R$ 500.00 (R$ 35.00 fixed fee for under R$ 500.00).
   - Warranty: 90 days legal warranty against manufacturing defects.
   - Returns: 7 calendar days for online purchase regret (CDC Law).
4. Language: Respond to the customer in Portuguese, maintaining a helpful and professional tone.
"""

def generate_chat_response(user_message: str) -> str:
    """
    Generate a response for the customer query based on store persona and policies.
    """
    # Base fallback response logic (to be connected to LLM provider API)
    message_lower = user_message.lower()
    
    # Check for scope restriction (accessories)
    if any(item in message_lower for item in ["palheta", "cabo", "pedal", "amplificador", "case", "corda"]):
        return (
            "Na Empório da Música trabalhamos exclusivamente com a venda de instrumentos musicais "
            "(guitarras, violões, baixos, teclados, baterias, etc.). Não comercializamos acessórios "
            "como cabos, palhetas, pedais ou amplificadores. Posso te ajudar a escolher um instrumento?"
        )

    return f"Olá! Obrigado por entrar em contato com a Empório da Música. Como posso ajudar com seu instrumento hoje?"