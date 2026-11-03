import os
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.ai_engine import generate_chat_response

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

# Centralized dataset filename mapping
DATASET_FILES = {
    "products": "products.csv",
    "orders": "orders.csv",
    "customers": "customers.csv",
    "categories": "categories.csv",
    "promotions": "promotions.csv",
    "order_items": "order_items.csv",
}


class ChatRequest(BaseModel):
    """
    Schema for customer chat incoming request payload.
    """
    message: str


class ChatResponse(BaseModel):
    """
    Schema for customer chat outgoing response payload.
    """
    reply: str


def load_dataset(filename: str) -> pd.DataFrame:
    """
    Safely load a CSV dataset from the data directory.
    Raises an HTTP 404 error if the file does not exist.
    """
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(
            status_code=404, detail=f"File {filename} not found."
        )

    # Read CSV and handle NaN values for JSON compliance
    df = pd.read_csv(path)
    df = df.where(pd.notnull(df), None)
    return df


@router.get("/health")
def health_check():
    """
    Perform a health check on the API service.
    """
    return {"status": "online", "system": "Empório da Música API"}


@router.get("/products")
def get_products():
    """
    Retrieve all musical instruments from the products catalog.
    """
    df = load_dataset(DATASET_FILES["products"])
    return {"products": df.to_dict(orient="records")}


@router.get("/orders")
def get_orders():
    """
    Retrieve all store orders from the orders dataset.
    """
    df = load_dataset(DATASET_FILES["orders"])
    return {"orders": df.to_dict(orient="records")}


@router.get("/promotions")
def get_promotions():
    """
    Retrieve all promotional campaigns from the promotions dataset.
    """
    path = os.path.join(DATA_DIR, "promotions.csv")
    if not os.path.exists(path):
        return {
            "promotions": [
                {"title": "Desconto PIX", "discount": "5%", "description": "Desconto automático em pagamentos via PIX."},
                {"title": "Frete Grátis", "condition": "Pedidos acima de R$ 500,00", "region": "Grande Campo Grande"}
            ]
        }
    df = load_dataset(DATASET_FILES["promotions"])
    return {"promotions": df.to_dict(orient="records")}


@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Process incoming customer messages through the AI agent and return a contextual response.
    """
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=400, detail="Message content cannot be empty."
        )
        
    reply_text = generate_chat_response(request.message.strip())
    return ChatResponse(reply=reply_text)