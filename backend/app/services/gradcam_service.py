import sys
from pathlib import Path
import numpy as np
from PIL import Image

MODEL_SRC = Path(__file__).resolve().parent.parent.parent.parent / "model" / "src"
sys.path.insert(0, str(MODEL_SRC))

from gradcam import (
    GradCAM,
    GradCAMPlusPlus,
    apply_heatmap,
    draw_bounding_box,
    heatmap_to_base64,
)
from .model_service import model_service

# Resolución de salida de las visualizaciones.
# 4× el tamaño del modelo (96px) → imágenes nítidas en pantallas HiDPI.
_OUTPUT_SIZE = 384


def _upscale_heatmap(heatmap: np.ndarray, size: int) -> np.ndarray:
    """Redimensiona un heatmap float [0,1] (H,W) a (size,size) con Lanczos."""
    heatmap_pil = Image.fromarray((heatmap * 255).astype(np.uint8))
    heatmap_pil = heatmap_pil.resize((size, size), Image.LANCZOS)
    return np.array(heatmap_pil).astype(np.float32) / 255.0


def generate_visualizations(image: Image.Image) -> dict[str, str]:
    """Genera las tres visualizaciones diagnósticas para una imagen.

    Los heatmaps se calculan a 96×96 (resolución del modelo) y luego
    se upscalan a _OUTPUT_SIZE×_OUTPUT_SIZE con Lanczos antes de
    codificar, evitando el escalado borroso del browser.

    Args:
        image: Imagen PIL original enviada por el usuario.

    Returns:
        Dict con claves 'gradcam', 'gradcam_pp' y 'bounding_box',
        cada una conteniendo la imagen codificada en base64.
    """
    # Imagen de alta resolución para compositing
    image_hires = image.convert("RGB").resize((_OUTPUT_SIZE, _OUTPUT_SIZE), Image.LANCZOS)
    image_array = np.array(image_hires)

    # ── Grad-CAM ────────────────────────────────────────────────────────────
    input_tensor_1 = model_service.get_input_tensor(image)
    gradcam = GradCAM(model_service.model)
    heatmap_gc, _ = gradcam.generate(input_tensor_1)
    heatmap_gc_hires = _upscale_heatmap(heatmap_gc, _OUTPUT_SIZE)
    overlayed_gc = apply_heatmap(image_array, heatmap_gc_hires, alpha=0.4)
    gradcam_b64 = heatmap_to_base64(overlayed_gc)

    # ── Grad-CAM++ ──────────────────────────────────────────────────────────
    input_tensor_2 = model_service.get_input_tensor(image)
    gradcam_pp = GradCAMPlusPlus(model_service.model)
    heatmap_pp, _ = gradcam_pp.generate(input_tensor_2)
    heatmap_pp_hires = _upscale_heatmap(heatmap_pp, _OUTPUT_SIZE)
    overlayed_pp = apply_heatmap(image_array, heatmap_pp_hires, alpha=0.4)
    gradcam_pp_b64 = heatmap_to_base64(overlayed_pp)

    # ── Bounding box (basado en Grad-CAM++) ─────────────────────────────────
    # thickness=4 proporcional al upscale ×4 respecto al tamaño del modelo
    bbox_image = draw_bounding_box(image_array, heatmap_pp_hires, threshold=0.5, thickness=4)
    bbox_b64 = heatmap_to_base64(bbox_image)

    return {
        "gradcam": gradcam_b64,
        "gradcam_pp": gradcam_pp_b64,
        "bounding_box": bbox_b64,
    }


def generate_heatmap_base64(image: Image.Image) -> str:
    """Compatibilidad con versiones anteriores: retorna solo el Grad-CAM."""
    return generate_visualizations(image)["gradcam"]
