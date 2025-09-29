# OceanLens

OceanLens is a full-stack application designed to make oceanographic data more accessible, interpretable, and actionable. It combines modern web development with machine learning and visualization to deliver insights from complex datasets in a user-friendly interface.

## Overview

- **Problem**: Oceanographic datasets such as NetCDF files are often difficult to work with, requiring specialized tools and expertise for preprocessing, filtering, and analysis.  
- **Solution**: OceanLens provides an end-to-end pipeline that allows users to query raw datasets, automatically filter and process them, visualize relevant metrics, and receive AI-generated insights.  

This approach eliminates the technical barrier for students, researchers, and policymakers, enabling faster decision-making and supporting global sustainability efforts such as **SDG 13 (Climate Action)** and **SDG 14 (Life Below Water)**.

## Features

- **AI-Driven Querying**: Uses Large Language Models (LLMs) with Retrieval-Augmented Generation (RAG) to interpret user questions and return contextualized answers.  
- **Automated Data Processing**: Filters and structures raw ocean observation data into interpretable formats.  
- **Visualization Tools**: Generates interactive plots and charts for variables such as temperature, chlorophyll concentration, and turbidity.  
- **Downloadable Data**: Allows exporting structured datasets (CSV) for offline analysis.  
- **Full-Stack Deployment**: Built with a FastAPI backend and a responsive frontend for real-time interaction.  

## Tech Stack

- **Frontend**: React (or equivalent modern JS framework)  
- **Backend**: FastAPI (Python) for REST API endpoints  
- **Machine Learning**: Hugging Face Transformers, Meta LLaMA (planned GGUF/llama.cpp integration)  
- **Data Processing**: Pandas, NumPy, Regex utilities  
- **Visualization**: Matplotlib, Seaborn  

## Use Cases

- **Researchers**: Quickly extract, sort, and visualize scientific data.  
- **Policymakers**: Access actionable insights without needing technical preprocessing.  
- **Students & Educators**: Explore marine science datasets through natural language queries.  

## Roadmap

- [ ] Integration of quantized LLaMA models (GGUF with llama.cpp) for local inference  
- [ ] Expanded dataset compatibility (e.g., satellite archives, multi-source feeds)  
- [ ] Enhanced frontend visualizations with interactive dashboards  
- [ ] Cloud deployment for broader accessibility  
