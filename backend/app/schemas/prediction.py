from pydantic import BaseModel


class PredictionResponse(BaseModel):
    prediction: str  # "metastasis" o "normal"
    confidence: float  # probabilidad del modelo (0-1)
    threshold: float  # threshold usado para la decisión
    heatmap_base64: str  # imagen con overlay Grad-CAM en base64
    metrics: dict  # métricas del modelo (accuracy, auc_roc)
    disclaimer: str  # aviso legal médico


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    device: str
