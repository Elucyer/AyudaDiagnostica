FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias Python (CPU-only para deploy ligero)
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu \
    && pip install --no-cache-dir -r /app/backend/requirements.txt

# Copiar codigo del backend
COPY backend/ /app/backend/

# Copiar model/src (config, model, gradcam)
COPY model/src/ /app/model/src/

# Descargar pesos del modelo desde Hugging Face
RUN mkdir -p /app/model/checkpoints && \
    wget -q -O /app/model/checkpoints/best_model.pth \
    "https://huggingface.co/Elcuyer/Eyuda-diagnostica/resolve/main/best_model.pth"

# Copiar metricas del modelo
COPY model/results/test_metrics.json /app/model/results/test_metrics.json

EXPOSE 8000

CMD python -m uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}
