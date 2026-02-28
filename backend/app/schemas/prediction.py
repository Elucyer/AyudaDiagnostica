from pydantic import BaseModel


class PredictionResponse(BaseModel):
    prediction: str  # "metastasis" o "normal"
    confidence: float  # probabilidad del modelo (0-1)
    threshold: float  # threshold usado para la decisión
    heatmap_base64: str  # Grad-CAM overlay en base64
    gradcam_pp_base64: str  # Grad-CAM++ overlay en base64
    bounding_box_base64: str  # imagen original con bounding box en base64
    metrics: dict  # métricas del modelo (accuracy, auc_roc)
    disclaimer: str  # aviso legal médico


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    device: str
