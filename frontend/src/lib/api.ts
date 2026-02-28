const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface ModelMetrics {
  accuracy: number;
  auc_roc: number;
  sensitivity: number;
  specificity: number;
}

export interface PredictionResponse {
  prediction: "metastasis" | "normal";
  confidence: number;
  threshold: number;
  heatmap_base64: string;
  gradcam_pp_base64: string;
  bounding_box_base64: string;
  metrics: ModelMetrics;
  disclaimer: string;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  device: string;
}

export async function predict(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/predict`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Error desconocido" }));
    throw new Error(error.detail || `Error ${res.status}`);
  }

  return res.json();
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error("API no disponible");
  return res.json();
}
