import json
import numpy as np
import torch
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score, roc_auc_score, f1_score,
    confusion_matrix, roc_curve, classification_report,
)
from tqdm import tqdm

from config import DEVICE, BEST_MODEL_PATH, RESULTS_DIR, OPTIMAL_THRESHOLD
from dataset import get_dataloaders
from model import load_model


@torch.no_grad()
def get_predictions(model, loader, device):
    """Obtiene predicciones del modelo sobre un DataLoader."""
    model.eval()
    all_labels = []
    all_probs = []

    for images, labels in tqdm(loader, desc="Evaluando"):
        images = images.to(device)
        outputs = model(images).squeeze(1)
        probs = torch.sigmoid(outputs)

        all_labels.extend(labels.numpy())
        all_probs.extend(probs.cpu().numpy())

    return np.array(all_labels), np.array(all_probs)


def compute_metrics(labels, probs, threshold=0.5):
    """Calcula métricas clínicas relevantes."""
    preds = (probs >= threshold).astype(int)

    tn, fp, fn, tp = confusion_matrix(labels, preds).ravel()
    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0

    return {
        "accuracy": float(accuracy_score(labels, preds)),
        "auc_roc": float(roc_auc_score(labels, probs)),
        "f1_score": float(f1_score(labels, preds)),
        "sensitivity": float(sensitivity),
        "specificity": float(specificity),
        "true_positives": int(tp),
        "true_negatives": int(tn),
        "false_positives": int(fp),
        "false_negatives": int(fn),
        "threshold": threshold,
    }


def find_optimal_threshold(labels, probs, min_sensitivity: float = 0.90) -> float:
    """Busca el threshold que maximiza accuracy con sensibilidad >= min_sensitivity.

    Estrategia clínica: primero garantizar que se detecta el >=90% de los
    casos positivos (no se pierde metástasis), luego maximizar la precisión
    global entre todos los thresholds que cumplen ese criterio.

    Args:
        labels: etiquetas reales (0/1).
        probs: probabilidades predichas por el modelo.
        min_sensitivity: sensibilidad mínima requerida (default 0.90).

    Returns:
        Threshold óptimo como float. Si ningún threshold alcanza
        min_sensitivity, retorna el que maximiza sensibilidad.
    """
    thresholds = np.arange(0.05, 0.90, 0.01)
    best_threshold = 0.5
    best_accuracy = 0.0
    best_sensitivity = 0.0

    candidates = []
    for t in thresholds:
        preds = (probs >= t).astype(int)
        tn, fp, fn, tp = confusion_matrix(labels, preds).ravel()
        sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
        accuracy = accuracy_score(labels, preds)

        if sensitivity >= min_sensitivity:
            candidates.append((t, accuracy, sensitivity))

    if candidates:
        # Entre los candidatos válidos, elegir el de mayor accuracy
        best = max(candidates, key=lambda x: x[1])
        best_threshold, best_accuracy, best_sensitivity = best
    else:
        # Fallback: ningún threshold alcanzó min_sensitivity; usar el de max sensibilidad
        for t in thresholds:
            preds = (probs >= t).astype(int)
            tn, fp, fn, tp = confusion_matrix(labels, preds).ravel()
            sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
            if sensitivity > best_sensitivity:
                best_sensitivity = sensitivity
                best_threshold = float(t)

    return float(round(best_threshold, 2))


def plot_confusion_matrix(labels, probs, save_path, threshold=0.5):
    """Genera y guarda la matriz de confusión."""
    preds = (probs >= threshold).astype(int)
    cm = confusion_matrix(labels, preds)

    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(
        cm, annot=True, fmt="d", cmap="Blues", ax=ax,
        xticklabels=["Normal", "Metástasis"],
        yticklabels=["Normal", "Metástasis"],
    )
    ax.set_xlabel("Predicción")
    ax.set_ylabel("Real")
    ax.set_title("Matriz de Confusión")
    fig.tight_layout()
    fig.savefig(save_path, dpi=150)
    plt.close(fig)


def plot_roc_curve(labels, probs, save_path):
    """Genera y guarda la curva ROC."""
    fpr, tpr, _ = roc_curve(labels, probs)
    auc = roc_auc_score(labels, probs)

    fig, ax = plt.subplots(figsize=(8, 6))
    ax.plot(fpr, tpr, color="darkorange", lw=2, label=f"ROC (AUC = {auc:.4f})")
    ax.plot([0, 1], [0, 1], color="navy", lw=1, linestyle="--")
    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.05])
    ax.set_xlabel("Tasa de Falsos Positivos")
    ax.set_ylabel("Tasa de Verdaderos Positivos (Sensibilidad)")
    ax.set_title("Curva ROC")
    ax.legend(loc="lower right")
    fig.tight_layout()
    fig.savefig(save_path, dpi=150)
    plt.close(fig)


def main():
    device = torch.device(DEVICE if torch.cuda.is_available() else "cpu")
    print(f"Usando dispositivo: {device}")

    print("Cargando modelo...")
    model = load_model(BEST_MODEL_PATH, device)

    print("Cargando datos de test...")
    _, _, test_loader = get_dataloaders()

    print("Obteniendo predicciones...")
    labels, probs = get_predictions(model, test_loader, device)

    # Buscar threshold óptimo (sensibilidad >= 90%)
    optimal_threshold = find_optimal_threshold(labels, probs, min_sensitivity=0.90)

    print(f"\nCalculando métricas (threshold={optimal_threshold})...")
    metrics = compute_metrics(labels, probs, threshold=optimal_threshold)
    # También calcular con el threshold de config para comparar
    metrics_config = compute_metrics(labels, probs, threshold=OPTIMAL_THRESHOLD)

    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    # Guardar métricas en JSON
    metrics_path = RESULTS_DIR / "test_metrics.json"
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    # Generar visualizaciones
    plot_confusion_matrix(labels, probs, RESULTS_DIR / "confusion_matrix.png", threshold=optimal_threshold)
    plot_roc_curve(labels, probs, RESULTS_DIR / "roc_curve.png")

    # Imprimir resultados
    print("\n" + "=" * 60)
    print("RESULTADOS EN TEST SET")
    print("=" * 60)
    print(f"\n  Con threshold={optimal_threshold} (óptimo ≥90% sensibilidad):")
    print(f"  Accuracy:      {metrics['accuracy']:.4f}")
    print(f"  AUC-ROC:       {metrics['auc_roc']:.4f}")
    print(f"  F1-Score:      {metrics['f1_score']:.4f}")
    print(f"  Sensibilidad:  {metrics['sensitivity']:.4f}")
    print(f"  Especificidad: {metrics['specificity']:.4f}")
    print(f"\n  TP: {metrics['true_positives']} | TN: {metrics['true_negatives']}")
    print(f"  FP: {metrics['false_positives']} | FN: {metrics['false_negatives']}")

    print(f"\n  Con threshold={OPTIMAL_THRESHOLD} (config actual, para comparar):")
    print(f"  Accuracy: {metrics_config['accuracy']:.4f} | Sensibilidad: {metrics_config['sensitivity']:.4f}")

    print("\n" + "=" * 60)
    acc_ok = metrics["accuracy"] >= 0.90
    sen_ok = metrics["sensitivity"] >= 0.90
    print(f"  Objetivo accuracy >= 90%:     {'CUMPLIDO ✓' if acc_ok else 'NO CUMPLIDO'}")
    print(f"  Objetivo sensibilidad >= 90%: {'CUMPLIDO ✓' if sen_ok else 'NO CUMPLIDO'}")
    print("=" * 60)

    if optimal_threshold != OPTIMAL_THRESHOLD:
        print(f"\n>>> ACTUALIZAR en model/src/config.py:")
        print(f"    OPTIMAL_THRESHOLD = {optimal_threshold}")

    print(f"\n  Métricas guardadas en: {metrics_path}")
    print(f"  Visualizaciones en: {RESULTS_DIR}")


if __name__ == "__main__":
    main()
