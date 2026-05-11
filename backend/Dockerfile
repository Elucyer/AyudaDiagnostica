FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias Python (CPU-only para deploy ligero)
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r /app/backend/requirements.txt

# Copiar codigo del backend
COPY backend/ /app/backend/

# Copiar model/src (config, model, gradcam)
COPY model/src/ /app/model/src/

# Copiar pesos del modelo y metricas
COPY model/checkpoints/best_model.pth /app/model/checkpoints/best_model.pth
COPY model/results/test_metrics.json /app/model/results/test_metrics.json

EXPOSE 8000

CMD python -m uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}
