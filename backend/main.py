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

# Centralized mapping of dataset file names
DATASET_FILES = {
    "products": "products.csv",
    "orders": "orders.csv",
    "customers": "customers.csv",
    "categories": "categories.csv",
    "promotions": "promotions.csv",
    "order_items": "order_items.csv",
}


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
    
    # Read CSV and replace NaN with None to ensure JSON compliance
    df = pd.read_csv(path)
    df = df.where(pd.notnull(df), None)
    return df


@app.get("/api/health")
def health_check():
    """
    Perform a health check on the API service.
    """
    return {"status": "online", "system": "Empório da Música API"}


@app.get("/api/products")
def get_products():
    """
    Retrieve all musical instruments from the products catalog.
    """
    df = load_dataset(DATASET_FILES["products"])
    return df.to_dict(orient="records")


@app.get("/api/orders")
def get_orders():
    """
    Retrieve all store orders from the orders dataset.
    Returns a list of dictionaries containing order records.
    """
    df = load_dataset(DATASET_FILES["orders"])
    return df.to_dict(orient="records")