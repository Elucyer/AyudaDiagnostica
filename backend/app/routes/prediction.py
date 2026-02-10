import json
from pathlib import Path
from PIL import Image
from fastapi import APIRouter, File, HTTPException, UploadFile

from ..schemas.prediction import PredictionResponse
from ..services.model_service import model_service
from ..services.gradcam_service import generate_heatmap_base64

router = APIRouter()

DISCLAIMER = (
    "Esta herramienta es exclusivamente de apoyo diagnóstico y NO sustituye "
    "el criterio médico profesional. Los resultados deben ser interpretados "
    "por un patólogo certificado. No tome decisiones clínicas basándose "
    "únicamente en esta predicción."
)

# Cargar métricas del modelo
METRICS_PATH = (
    Path(__file__).resolve().parent.parent.parent.parent
    / "model" / "results" / "test_metrics.json"
)


def _load_model_metrics() -> dict:
    if METRICS_PATH.exists():
        with open(METRICS_PATH) as f:
            data = json.load(f)
        return {
            "accuracy": round(data.get("accuracy", 0), 4),
            "auc_roc": round(data.get("auc_roc", 0), 4),
            "sensitivity": round(data.get("sensitivity", 0), 4),
            "specificity": round(data.get("specificity", 0), 4),
        }
    return {}


@router.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """Recibe una imagen histopatológica y retorna la predicción."""

    if not model_service.is_loaded:
        raise HTTPException(status_code=503, detail="Modelo no cargado")

    # Validar tipo de archivo
    if file.content_type not in ("image/png", "image/jpeg", "image/tiff"):
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de archivo no soportado: {file.content_type}. Use PNG, JPEG o TIFF.",
        )

    try:
        image = Image.open(file.file)
    except Exception:
        raise HTTPException(status_code=400, detail="No se pudo leer la imagen")

    # Predicción
    probability, label = model_service.predict(image)

    # Grad-CAM heatmap
    heatmap_b64 = generate_heatmap_base64(image)

    return PredictionResponse(
        prediction=label,
        confidence=round(probability, 4),
        threshold=model_service.threshold,
        heatmap_base64=heatmap_b64,
        metrics=_load_model_metrics(),
        disclaimer=DISCLAIMER,
    )
