# backend/api/views.py
import os
import pandas as pd
from django.conf import settings
from django.http import StreamingHttpResponse, HttpResponse

# Paths to CSV files
OON_CSV_PATH = os.path.join(str(settings.BASE_DIR), "data_filters", "data", "OON-data.csv")
IFREMER_CSV_PATH = os.path.join(str(settings.BASE_DIR), "data_filters", "data", "ifremer-data.csv")

# Map region names -> bounding boxes (lat/lon ranges)
region_bounds = {
    "Arabian Sea":     {"lat_min": 5,  "lat_max": 25, "lon_min": 50,  "lon_max": 75},
    "Bay of Bengal":   {"lat_min": 5,  "lat_max": 22, "lon_min": 80,  "lon_max": 100},
    "Andaman Sea":     {"lat_min": 5,  "lat_max": 16, "lon_min": 92,  "lon_max": 98},
    "Laccadive Sea":   {"lat_min": 6,  "lat_max": 16, "lon_min": 72,  "lon_max": 78},
    "Somali Sea":      {"lat_min": -5, "lat_max": 15, "lon_min": 40,  "lon_max": 55},
    "Mozambique Channel": {"lat_min": -25, "lat_max": -10, "lon_min": 40, "lon_max": 50},
    "Madagascar Basin": {"lat_min": -30, "lat_max": -15, "lon_min": 40, "lon_max": 60},
    "Mascarene Basin": {"lat_min": -25, "lat_max": -10, "lon_min": 55, "lon_max": 75},
    "Central Indian Basin": {"lat_min": -15, "lat_max": 5, "lon_min": 70, "lon_max": 90},
    "Wharton Basin":   {"lat_min": -15, "lat_max": 5, "lon_min": 90,  "lon_max": 110},
    "Perth Basin":     {"lat_min": -35, "lat_max": -20, "lon_min": 110, "lon_max": 130},
    "Great Australian Bight": {"lat_min": -40, "lat_max": -30, "lon_min": 130, "lon_max": 140},
    # OON Data Regions (Pacific Ocean around Australia)
    "Coral Sea":       {"lat_min": -30, "lat_max": -10, "lon_min": 145, "lon_max": 165},
    "Tasman Sea":      {"lat_min": -40, "lat_max": -20, "lon_min": 150, "lon_max": 170},
    "South Pacific":   {"lat_min": -35, "lat_max": -15, "lon_min": 140, "lon_max": 160},
}

def download_filtered_csv(request):
    # Read query params
    region = request.GET.get("region")
    data_source = request.GET.get("data_source", "OON")  # Default to OON
    start_date = request.GET.get("start_date")
    end_date = request.GET.get("end_date")
    parameters = request.GET.get("parameters")  # e.g. "sst,chlor_a"
    
    # Determine which CSV file to use
    if data_source == "Ifremer":
        csv_path = IFREMER_CSV_PATH
        lat_col = "latitude"
        lon_col = "longitude"
        date_col = "date"
    else:  # Default to OON
        csv_path = OON_CSV_PATH
        lat_col = "lat"
        lon_col = "lon"
        date_col = None  # OON data doesn't have date column
    
    # Check if CSV file exists
    if not os.path.exists(csv_path):
        return HttpResponse(f"CSV not found at {csv_path}", status=404)

    # Parse parameters -> list of columns to include
    if parameters:
        cols = [c.strip() for c in parameters.split(",") if c.strip()]
    else:
        cols = None  # None means include all columns

    # Determine region bounds (if provided)
    lat_min = lon_min = None
    lat_max = lon_max = None
    if region and region in region_bounds:
        box = region_bounds[region]
        lat_min, lat_max = box["lat_min"], box["lat_max"]
        lon_min, lon_max = box["lon_min"], box["lon_max"]

    chunksize = 100000  # adjust if necessary

    def row_generator():
        header_emitted = False
        # iterate CSV in chunks to avoid OOM
        for chunk in pd.read_csv(csv_path, chunksize=chunksize):
            df = chunk

            # Filter by region box if requested and if lat/lon columns exist
            if lat_min is not None and {lat_col, lon_col}.issubset(df.columns):
                df = df[
                    (df[lat_col] >= lat_min) & (df[lat_col] <= lat_max) &
                    (df[lon_col] >= lon_min) & (df[lon_col] <= lon_max)
                ]

            # Filter by date range if date column exists (only for Ifremer data)
            if start_date and end_date and date_col and date_col in df.columns:
                # ensure date column is datetime
                df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
                df = df[(df[date_col] >= start_date) & (df[date_col] <= end_date)]

            # Select only requested columns (if provided)
            if cols:
                # keep only existing columns to avoid errors
                selected_cols = [c for c in cols if c in df.columns]
                if not selected_cols:
                    continue
                df = df[selected_cols]

            if df.empty:
                continue

            # Emit CSV: include header only once
            csv_chunk = df.to_csv(index=False, header=not header_emitted)
            header_emitted = True
            yield csv_chunk

    # Stream result
    response = StreamingHttpResponse(row_generator(), content_type="text/csv")
    filename = f"filtered_{data_source.lower()}_data.csv"
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response
