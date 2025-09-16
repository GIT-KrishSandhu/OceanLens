# app.py - Fixed FastAPI code
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from sentence_transformers import SentenceTransformer
import faiss
import pickle
import torch
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
import nest_asyncio

# Apply nest_asyncio
nest_asyncio.apply()

def haversine_vectorized(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points
    on the earth (specified in decimal degrees)
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    r = 6371  # Radius of earth in kilometers
    return c * r

def sort_df_by_distance(df, ref_lat, ref_lon, lat_col="latitude", lon_col="longitude", new_col="distance_km"):
    """
    Adds a `new_col` to df containing distance (km) from (ref_lat, ref_lon), then returns
    a new DataFrame sorted by that column (ascending). Does not modify original df unless you want it to.
    """
    df = df.copy()
    # Validate presence of columns
    if lat_col not in df.columns or lon_col not in df.columns:
        raise ValueError(f"DataFrame must contain '{lat_col}' and '{lon_col}' columns.")

    # create numeric copies and handle missing values
    lat_vals = pd.to_numeric(df[lat_col], errors="coerce")
    lon_vals = pd.to_numeric(df[lon_col], errors="coerce")

    # compute distances; where coords are NaN, set distance to a large number (so they go to bottom)
    distances = haversine_vectorized(lat_vals.fillna(0.0).values, lon_vals.fillna(0.0).values, ref_lat, ref_lon)
    distances = np.where(lat_vals.isna() | lon_vals.isna(), np.inf, distances)

    df[new_col] = distances
    df_sorted = df.sort_values(by=new_col, ascending=True).reset_index(drop=True)
    return df_sorted

def plot_argo(df, parameter):
    """
    Create a simple plot for ARGO data
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    
    if parameter in df.columns:
        ax.plot(df.index, df[parameter], 'b-', linewidth=2, label=parameter)
        ax.set_xlabel('Data Point Index')
        ax.set_ylabel(parameter)
        ax.set_title(f'ARGO Data: {parameter}')
        ax.legend()
        ax.grid(True, alpha=0.3)
    else:
        # Fallback plot if parameter not found
        ax.text(0.5, 0.5, f'Parameter "{parameter}" not found in data', 
                ha='center', va='center', transform=ax.transAxes, fontsize=12)
        ax.set_title('ARGO Data Plot')
    
    plt.tight_layout()
    return fig

# === FastAPI setup ===
app = FastAPI(title="OceanLens AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to OceanLens domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Load Models & Indexes on Startup ===
print("Loading AI models...")
try:
    sentence_model = SentenceTransformer("all-MiniLM-L6-v2")
    print("✅ Sentence transformer loaded")
except Exception as e:
    print(f"❌ Error loading sentence transformer: {e}")
    sentence_model = None

try:
    llm = pipeline("text-generation", model="gpt2-medium", device_map="auto")
    print("✅ LLM loaded")
except Exception as e:
    print(f"❌ Error loading LLM: {e}")
    llm = None

try:
    index = faiss.read_index("argo_index.faiss")
    print("✅ FAISS index loaded")
except Exception as e:
    print(f"❌ Error loading FAISS index: {e}")
    index = None

try:
    with open("metadata_map.pkl", "rb") as f:
        metadata_map = pickle.load(f)
    print("✅ Metadata map loaded")
except Exception as e:
    print(f"❌ Error loading metadata map: {e}")
    metadata_map = {}

# === Request Schema ===
class QueryRequest(BaseModel):
    query: str  # Changed from 'question' to 'query' to match frontend

# === API Routes ===
@app.get("/")
def root():
    return {"message": "OceanLens AI API is running!", "status": "healthy"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "sentence_model": sentence_model is not None,
            "llm": llm is not None,
            "faiss_index": index is not None,
            "metadata_map": len(metadata_map) > 0
        }
    }

@app.post("/query")
def query_handler(data: QueryRequest):
    try:
        query = data.query.strip()
        print(f"Received query: {query}")

        if not sentence_model or not llm or not index or not metadata_map:
            return {
                "response": "AI models are not fully loaded. Please try again in a moment.",
                "error": "Models not ready"
            }

        # Embed query
        query_embedding = sentence_model.encode([query])
        D, I = index.search(query_embedding, k=5)

        # Get top 5 ARGO summaries
        results = [metadata_map[i] for i in I[0]]
        context = "\n".join(results)

        # Construct prompt
        prompt = f"Using the following ARGO ocean data:\n{context}\n\nAnswer this question about ocean data: {query}\n\nAnswer:"

        # Run LLM
        output = llm(prompt, max_new_tokens=512, do_sample=True, temperature=0.7)[0]['generated_text']
        
        # Extract just the answer part (after "Answer:")
        if "Answer:" in output:
            answer = output.split("Answer:")[-1].strip()
        else:
            answer = output.strip()
        
        return {"response": answer, "context_used": len(results)}
        
    except Exception as e:
        print(f"Error in query handler: {e}")
        return {
            "response": f"Sorry, I encountered an error processing your query: {str(e)}",
            "error": str(e)
        }

@app.get("/plot")
def get_plot():
    try:
        # Create sample data for demonstration
        # In production, you would load your actual ARGO data here
        sample_data = {
            'latitude': [20.0, 21.0, 22.0, 23.0, 24.0],
            'longitude': [70.0, 71.0, 72.0, 73.0, 74.0],
            'sea_surface_temperature': [25.5, 26.1, 25.8, 26.3, 25.9],
            'salinity': [35.2, 35.1, 35.3, 35.0, 35.2]
        }
        
        df = pd.DataFrame(sample_data)
        ref_latitude, ref_longitude = 22.0, 72.0  # Reference point
        
        # Sort by distance
        df_sorted = sort_df_by_distance(df, ref_latitude, ref_longitude)
        
        # Create plot
        fig = plot_argo(df_sorted, "sea_surface_temperature")

        # Save figure to memory buffer
        buf = BytesIO()
        fig.savefig(buf, format="png", dpi=150, bbox_inches='tight')
        buf.seek(0)
        plt.close(fig)  # Free memory

        return StreamingResponse(buf, media_type="image/png")
        
    except Exception as e:
        print(f"Error in plot handler: {e}")
        # Return a simple error plot
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.text(0.5, 0.5, f'Error generating plot: {str(e)}', 
                ha='center', va='center', transform=ax.transAxes, fontsize=12)
        ax.set_title('Plot Error')
        
        buf = BytesIO()
        fig.savefig(buf, format="png")
        buf.seek(0)
        plt.close(fig)
        
        return StreamingResponse(buf, media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    print("Starting OceanLens AI API...")
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)

