import sys
from pathlib import Path
import numpy as np
from PIL import Image

MODEL_SRC = Path(__file__).resolve().parent.parent.parent.parent / "model" / "src"
sys.path.insert(0, str(MODEL_SRC))

from gradcam import GradCAM, apply_heatmap, heatmap_to_base64
from .model_service import model_service


def generate_heatmap_base64(image: Image.Image) -> str:
    """Genera el heatmap Grad-CAM y lo retorna como base64.

    Args:
        image: Imagen PIL original.

    Returns:
        String base64 de la imagen con el heatmap superpuesto.
    """
    input_tensor = model_service.get_input_tensor(image)

    gradcam = GradCAM(model_service.model)
    heatmap, _ = gradcam.generate(input_tensor)

    # Convertir imagen original a numpy array para overlay
    image_resized = image.convert("RGB").resize((96, 96))
    image_array = np.array(image_resized)

    overlayed = apply_heatmap(image_array, heatmap, alpha=0.4)
    return heatmap_to_base64(overlayed)
