import sys
import json
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from sklearn.metrics import roc_auc_score
from tqdm import tqdm

from config import (
    DEVICE, CHECKPOINTS_DIR, RESULTS_DIR,
    PHASE1_EPOCHS, PHASE1_LR,
    PHASE2_EPOCHS, PHASE2_LR,
    WEIGHT_DECAY, PATIENCE, BEST_MODEL_PATH,
    MIXUP_ALPHA,
)
from dataset import get_dataloaders
from model import create_model, unfreeze_backbone


class FocalLoss(nn.Module):
    """Focal Loss para clasificación binaria histopatológica.

    Reduce el peso de los ejemplos fáciles (tejido claramente normal)
    y concentra el entrenamiento en los casos difíciles de metástasis
    sutil, reduciendo los falsos negativos.

    Args:
        alpha: peso para ejemplos positivos (0.75 prioriza sensibilidad).
        gamma: factor de enfoque; gamma=2 es el valor estándar (Lin et al., 2017).
    """

    def __init__(self, alpha: float = 0.75, gamma: float = 2.0):
        super().__init__()
        self.alpha = alpha
        self.gamma = gamma

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        bce = F.binary_cross_entropy_with_logits(logits, targets, reduction="none")
        p = torch.sigmoid(logits)
        p_t = p * targets + (1 - p) * (1 - targets)
        alpha_t = self.alpha * targets + (1 - self.alpha) * (1 - targets)
        focal_weight = alpha_t * (1 - p_t) ** self.gamma
        return (focal_weight * bce).mean()


def mixup_batch(images: torch.Tensor, labels: torch.Tensor, alpha: float):
    """Aplica MixUp a un batch: mezcla pares de ejemplos e interpola etiquetas.

    Crea ejemplos sintéticos `x_mix = λ·xᵢ + (1-λ)·xⱼ` con etiquetas suaves
    `y_mix = λ·yᵢ + (1-λ)·yⱼ`. El modelo aprende a no memorizar ejemplos
    individuales sino a interpolar correctamente el espacio de características.

    Args:
        alpha: parámetro de la distribución Beta. 0.4 produce mezclas moderadas.

    Returns:
        (mixed_images, labels_a, labels_b, lam)
    """
    lam = float(np.random.beta(alpha, alpha))
    idx = torch.randperm(images.size(0), device=images.device)
    mixed = lam * images + (1 - lam) * images[idx]
    return mixed, labels, labels[idx], lam


def train_one_epoch(model, loader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    all_labels = []
    all_probs = []

    pbar = tqdm(loader, desc="Train", leave=False)
    for images, labels in pbar:
        images = images.to(device)
        labels = labels.to(device)

        # MixUp: mezcla el batch con una permutación aleatoria de sí mismo
        images, labels_a, labels_b, lam = mixup_batch(images, labels, MIXUP_ALPHA)

        optimizer.zero_grad()
        outputs = model(images).squeeze(1)
        # Pérdida interpolada con las dos etiquetas del par mezclado
        loss = lam * criterion(outputs, labels_a) + (1 - lam) * criterion(outputs, labels_b)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        probs = torch.sigmoid(outputs).detach()
        preds = (probs >= 0.5).float()
        # Accuracy aproximada durante entrenamiento (usando etiqueta dominante)
        correct += (lam * (preds == labels_a).float() + (1 - lam) * (preds == labels_b).float()).sum().item()
        total += labels_a.size(0)

        # Para AUC se usan las etiquetas originales (labels_a = batch sin permutar)
        all_labels.extend(labels_a.cpu().numpy())
        all_probs.extend(probs.cpu().numpy())

        pbar.set_postfix(loss=loss.item(), acc=correct / total)

    epoch_loss = running_loss / total
    epoch_acc = correct / total
    epoch_auc = roc_auc_score(all_labels, all_probs)

    return epoch_loss, epoch_acc, epoch_auc


@torch.no_grad()
def validate(model, loader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    all_labels = []
    all_probs = []

    pbar = tqdm(loader, desc="Valid", leave=False)
    for images, labels in pbar:
        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images).squeeze(1)
        loss = criterion(outputs, labels)

        running_loss += loss.item() * images.size(0)
        probs = torch.sigmoid(outputs)
        preds = (probs >= 0.5).float()
        correct += (preds == labels).sum().item()
        total += labels.size(0)

        all_labels.extend(labels.cpu().numpy())
        all_probs.extend(probs.cpu().numpy())

    epoch_loss = running_loss / total
    epoch_acc = correct / total
    epoch_auc = roc_auc_score(all_labels, all_probs)

    return epoch_loss, epoch_acc, epoch_auc


def save_checkpoint(model, optimizer, epoch, val_auc, path):
    CHECKPOINTS_DIR.mkdir(parents=True, exist_ok=True)
    torch.save({
        "epoch": epoch,
        "model_state_dict": model.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "val_auc": val_auc,
    }, path)


def train_phase(model, train_loader, valid_loader, criterion, optimizer,
                scheduler, device, num_epochs, phase_name, best_auc=0.0):
    """Ejecuta una fase de entrenamiento con early stopping."""
    history = []
    patience_counter = 0

    for epoch in range(num_epochs):
        print(f"\n[{phase_name}] Epoch {epoch + 1}/{num_epochs}")

        train_loss, train_acc, train_auc = train_one_epoch(
            model, train_loader, criterion, optimizer, device
        )
        val_loss, val_acc, val_auc = validate(
            model, valid_loader, criterion, device
        )

        if scheduler:
            scheduler.step()

        epoch_data = {
            "phase": phase_name,
            "epoch": epoch + 1,
            "train_loss": train_loss,
            "train_acc": train_acc,
            "train_auc": train_auc,
            "val_loss": val_loss,
            "val_acc": val_acc,
            "val_auc": val_auc,
            "lr": optimizer.param_groups[0]["lr"],
        }
        history.append(epoch_data)

        print(f"  Train - Loss: {train_loss:.4f} | Acc: {train_acc:.4f} | AUC: {train_auc:.4f}")
        print(f"  Valid - Loss: {val_loss:.4f} | Acc: {val_acc:.4f} | AUC: {val_auc:.4f}")

        if val_auc > best_auc:
            best_auc = val_auc
            patience_counter = 0
            save_checkpoint(model, optimizer, epoch, val_auc, BEST_MODEL_PATH)
            print(f"  -> Mejor modelo guardado (AUC: {val_auc:.4f})")
        else:
            patience_counter += 1
            print(f"  -> Sin mejora ({patience_counter}/{PATIENCE})")

        if patience_counter >= PATIENCE:
            print(f"  -> Early stopping en epoch {epoch + 1}")
            break

    return history, best_auc


def main():
    device = torch.device(DEVICE if torch.cuda.is_available() else "cpu")
    print(f"Usando dispositivo: {device}")

    if not torch.cuda.is_available():
        print("ADVERTENCIA: CUDA no disponible. El entrenamiento será lento.")

    print("Cargando datos...")
    train_loader, valid_loader, _ = get_dataloaders()

    # Focal Loss: alpha=0.75 prioriza sensibilidad (detección de metástasis)
    criterion = FocalLoss(alpha=0.75, gamma=2.0)
    all_history = []

    # === FASE 1: Entrenar solo el classifier ===
    print("\n" + "=" * 60)
    print("FASE 1: Entrenamiento del classifier (backbone congelado)")
    print("=" * 60)

    model = create_model(pretrained=True, freeze_backbone=True)
    model.to(device)

    optimizer = AdamW(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=PHASE1_LR, weight_decay=WEIGHT_DECAY,
    )
    scheduler = CosineAnnealingLR(optimizer, T_max=PHASE1_EPOCHS)

    history, best_auc = train_phase(
        model, train_loader, valid_loader, criterion, optimizer,
        scheduler, device, PHASE1_EPOCHS, "Fase1",
    )
    all_history.extend(history)

    # === FASE 2: Fine-tuning completo ===
    print("\n" + "=" * 60)
    print("FASE 2: Fine-tuning completo (descongelando desde bloque 3)")
    print("=" * 60)

    # unfreeze_from=3 libera los bloques 3-7 (vs. 5-7 anterior),
    # permitiendo que más capas del backbone se adapten a H&E.
    model = unfreeze_backbone(model, unfreeze_from=3)

    optimizer = AdamW(
        filter(lambda p: p.requires_grad, model.parameters()),
        lr=PHASE2_LR, weight_decay=WEIGHT_DECAY,
    )
    scheduler = CosineAnnealingLR(optimizer, T_max=PHASE2_EPOCHS)

    history, best_auc = train_phase(
        model, train_loader, valid_loader, criterion, optimizer,
        scheduler, device, PHASE2_EPOCHS, "Fase2", best_auc,
    )
    all_history.extend(history)

    # Guardar historial de entrenamiento
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    history_path = RESULTS_DIR / "training_history.json"
    with open(history_path, "w") as f:
        json.dump(all_history, f, indent=2)

    print(f"\nEntrenamiento completado. Mejor AUC: {best_auc:.4f}")
    print(f"Modelo guardado en: {BEST_MODEL_PATH}")
    print(f"Historial guardado en: {history_path}")
    print("\n>>> Ejecuta evaluate.py para calcular el threshold óptimo <<<")


if __name__ == "__main__":
    main()
