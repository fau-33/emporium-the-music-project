from fastapi import FastAPI, HTTPException
import pandas as pd
import os

app = FastAPI(
    title="Empório da Música API",
    description="Backend services integrating CSV datasets and RAG policies for Empório da Música.",
    version="1.0.0"
)

# Paths to data files
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def load_csv(filename: str):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Dataset {filename} not found.")
    return pd.read_csv(path)

@app.get("/api/health", summary="Check backend health status")
def health_check():
    return {"status": "online", "store": "Empório da Música"}

@app.get("/api/products", summary="Retrieve all active musical instruments")
def get_products():
    """Fetches products directly from products.csv to sync with frontend."""
    df = load_csv("desafio_tecnico_ai_eng - products.csv")
    # Convert dataframe to dictionary records to return as JSON
    return df.to_dict(orient="records")