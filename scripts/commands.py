"""Comandos CLI del proyecto, expuestos via poetry run <comando>."""
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_SRC = PROJECT_ROOT / "model" / "src"


def serve():
    """Levanta la API de predicción (FastAPI + Uvicorn)."""
    subprocess.run(
        [sys.executable, "-m", "uvicorn", "backend.app.main:app",
         "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=str(PROJECT_ROOT),
    )


def train():
    """Entrena el modelo EfficientNet-B3 sobre PCam."""
    subprocess.run(
        [sys.executable, "train.py"],
        cwd=str(MODEL_SRC),
    )


def evaluate():
    """Evalúa el modelo en el test set y genera métricas + gráficas."""
    subprocess.run(
        [sys.executable, "evaluate.py"],
        cwd=str(MODEL_SRC),
    )


def download_data():
    """Descarga el dataset PatchCamelyon desde Zenodo."""
    subprocess.run(
        [sys.executable, "download_dataset.py"],
        cwd=str(PROJECT_ROOT / "model"),
    )
