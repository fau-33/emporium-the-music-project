import os
from fastapi import FastAPI, HTTPException
import pandas as pd

app = FastAPI(
    title="Empório da Música API",
    description="Backend API for Empório da Música datasets and support services.",
    version="1.0.0",
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
DATASET_FILES = {
    "products": "products.csv",
    "orders": "orders.csv",
    "customers": "customers.csv",
    "categories": "categories.csv",
    "promotions": "promotions.csv",
    "order_items": "order_items.csv",
}


def load_dataset(filename: str):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(
            status_code=404, detail=f"File {filename} not found."
        )
    return pd.read_csv(path)


@app.get("/api/health")
def health_check():
    return {"status": "online", "system": "Empório da Música API"}


@app.get("/api/products")
def get_products():
    df = load_dataset(DATASET_FILES["products"])
    return df.to_dict(orient="records")