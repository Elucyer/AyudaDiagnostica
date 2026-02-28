import sys
from pathlib import Path
import torch
import torchvision.transforms.functional as TF
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
    """Singleton que carga el modelo y realiza inferencia con TTA."""

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

    def _tta_views(self, tensor: torch.Tensor) -> list[torch.Tensor]:
        """Genera 8 vistas aumentadas para Test-Time Augmentation.

        Usa las 4 rotaciones (0°, 90°, 180°, 270°) × flip horizontal,
        que son las transformaciones simétricas válidas para imágenes
        histopatológicas (no tienen orientación canónica).
        """
        t = tensor.squeeze(0)  # (3, 96, 96)
        return [
            t,
            TF.hflip(t),
            TF.rotate(t, 90),
            TF.hflip(TF.rotate(t, 90)),
            TF.rotate(t, 180),
            TF.hflip(TF.rotate(t, 180)),
            TF.rotate(t, 270),
            TF.hflip(TF.rotate(t, 270)),
        ]

    @torch.no_grad()
    def predict(self, image: Image.Image) -> tuple[float, str]:
        """Predice si una imagen tiene metástasis usando TTA (8 vistas).

        Promedia las probabilidades sobre 8 versiones rotadas/volteadas
        de la imagen, mejorando la robustez de la predicción.

        Returns:
            (probability, label): probabilidad media y etiqueta predicha.
        """
        base = self.preprocess(image)

        probs = [
            torch.sigmoid(self.model(v.unsqueeze(0)).squeeze()).item()
            for v in self._tta_views(base)
        ]

        probability = sum(probs) / len(probs)
        label = "metastasis" if probability >= self.threshold else "normal"
        return probability, label

    def get_input_tensor(self, image: Image.Image) -> torch.Tensor:
        """Retorna el tensor preprocesado (para Grad-CAM, sin TTA)."""
        return self.preprocess(image)


# Instancia global
model_service = ModelService()
