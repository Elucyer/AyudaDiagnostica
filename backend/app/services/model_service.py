import sys
from pathlib import Path
import numpy as np
import torch
from torchvision import transforms
from PIL import Image

# Agregar model/src al path para importar config y model
MODEL_SRC = Path(__file__).resolve().parent.parent.parent.parent / "model" / "src"
sys.path.insert(0, str(MODEL_SRC))

from config import (
    BEST_MODEL_PATH, DEVICE, IMAGE_SIZE,
    IMAGENET_MEAN, IMAGENET_STD, OPTIMAL_THRESHOLD,
)
from model import load_model


class ModelService:
    """Singleton que carga el modelo y realiza inferencia."""

    def __init__(self):
        self.model = None
        self.device = None
        self.transform = None
        self.threshold = OPTIMAL_THRESHOLD

    def load(self):
        self.device = torch.device(DEVICE if torch.cuda.is_available() else "cpu")
        self.model = load_model(BEST_MODEL_PATH, self.device)
        self.transform = transforms.Compose([
            transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ])

    @property
    def is_loaded(self) -> bool:
        return self.model is not None

    def preprocess(self, image: Image.Image) -> torch.Tensor:
        """Preprocesa una imagen PIL para el modelo."""
        if image.mode != "RGB":
            image = image.convert("RGB")
        tensor = self.transform(image)
        return tensor.unsqueeze(0).to(self.device)  # (1, 3, 96, 96)

    @torch.no_grad()
    def predict(self, image: Image.Image) -> tuple[float, str]:
        """Predice si una imagen tiene metástasis.

        Returns:
            (probability, label): probabilidad y etiqueta predicha.
        """
        input_tensor = self.preprocess(image)
        output = self.model(input_tensor).squeeze()
        probability = torch.sigmoid(output).item()
        label = "metastasis" if probability >= self.threshold else "normal"
        return probability, label

    def get_input_tensor(self, image: Image.Image) -> torch.Tensor:
        """Retorna el tensor preprocesado (para Grad-CAM)."""
        return self.preprocess(image)


# Instancia global
model_service = ModelService()
