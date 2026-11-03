import os
import pandas as pd
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables from .env file
load_dotenv()

# Initialize Gemini client (it automatically picks up GEMINI_API_KEY from environment)
client = genai.Client()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

# Comprehensive System Prompt implementing store persona, scope rules, and policies
SYSTEM_PROMPT = """
You are the virtual customer service assistant for Empório da Música, a musical instruments store located in Campo Grande, MS.

Key Directives:
1. Persona: Friendly, welcoming, and knowledgeable about musical instruments.
2. Scope Restriction: The store EXCLUSIVELY sells musical instruments (guitars, basses, drums, keyboards, ukuleles, wind, and orchestral strings). The store DOES NOT sell accessories (strings, picks, cables, cases, pedals, or amplifiers). Always politely decline accessory inquiries and explain this store policy.
3. Store Policies:
   - Payments: PIX (5% discount), Debit, Credit (up to 12x, min installment R$ 100), Boleto.
   - Shipping: Free delivery in Greater Campo Grande for orders over R$ 500.00 (R$ 35.00 fixed fee for under R$ 500.00).
   - Warranty: 90 days legal warranty against manufacturing defects.
   - Returns: 7 calendar days for online purchase regret (CDC Law).
4. Language: Respond to the customer in Portuguese, maintaining a helpful and professional tone.
"""

def query_product_catalog(product_name: str) -> str:
    """
    Tool function to look up product details, price, and stock in the CSV dataset.
    """
    path = os.path.join(DATA_DIR, "products.csv")
    if not os.path.exists(path):
        return "Dataset products.csv not found."
        
    df = pd.read_csv(path)
    match = df[df["name"].str.contains(product_name, case=False, na=False)]
    if match.empty:
        return f"Product '{product_name}' was not found in our catalog."
        
    prod = match.iloc[0]
    return (
        f"Product Found: {prod['name']} | "
        f"Price: R$ {prod['price_brl']:.2f} | "
        f"Stock: {prod['stock_quantity']} units available | "
        f"Description: {prod['description']}"
    )

def generate_chat_response(user_message: str) -> str:
    """
    Generate an intelligent response using Google Gemini API combined with catalog lookup.
    """
    message_lower = user_message.lower()
    
    # Quick keyword check for product pricing/info to augment context if needed
    context_data = ""
    if "takamine" in message_lower or "gd20" in message_lower:
        context_data = query_product_catalog("Takamine GD20")
    elif "yamaha" in message_lower or "c40" in message_lower:
        context_data = query_product_catalog("Yamaha C40")
    elif "fender" in message_lower or "stratocaster" in message_lower:
        context_data = query_product_catalog("Stratocaster")

    # Construct full prompt with system directives and formatting constraints
    full_prompt = f"""
    {SYSTEM_PROMPT}
    
    [Formatting Guideline]:
    Respond in clear, natural paragraphs without excessive bullet points or raw symbols. Keep it clean, professional, and customer-friendly.
    
    [Live Context Data Retrieved from Store Database]:
    {context_data if context_data else "No specific product queried yet. Answer based on general store policies or general catalog guidance."}
    
    Customer Message: {user_message}
    """

    try:
        # Call Google Gemini API using the official SDK
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=full_prompt,
        )
        # Clean markdown asterisks for plain JSON readability
        cleaned_text = response.text.replace("*", "").strip()
        return cleaned_text
    except Exception as e:
        # Fallback graceful response if API key is missing or quota/network error occurs
        if "API_KEY" in str(e) or not os.getenv("GEMINI_API_KEY"):
            return (
                "Olá! O assistente está configurado com o motor Gemini, mas a chave de API (GEMINI_API_KEY) "
                "ainda não foi configurada no arquivo .env. Configure sua chave gratuita do Google AI Studio para ativar a IA completa!"
            )
        return f"Desculpe, ocorreu um erro ao processar sua mensagem: {str(e)}"