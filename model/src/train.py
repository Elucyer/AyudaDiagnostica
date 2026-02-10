import sys
import json
import torch
import torch.nn as nn
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from sklearn.metrics import roc_auc_score
from tqdm import tqdm

from config import (
    DEVICE, CHECKPOINTS_DIR, RESULTS_DIR,
    PHASE1_EPOCHS, PHASE1_LR,
    PHASE2_EPOCHS, PHASE2_LR,
    WEIGHT_DECAY, PATIENCE, BEST_MODEL_PATH,
)
from dataset import get_dataloaders
from model import create_model, unfreeze_backbone


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

        optimizer.zero_grad()
        outputs = model(images).squeeze(1)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        probs = torch.sigmoid(outputs).detach()
        preds = (probs >= 0.5).float()
        correct += (preds == labels).sum().item()
        total += labels.size(0)

        all_labels.extend(labels.cpu().numpy())
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

    criterion = nn.BCEWithLogitsLoss()
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
    print("FASE 2: Fine-tuning completo (backbone descongelado)")
    print("=" * 60)

    model = unfreeze_backbone(model, unfreeze_from=5)

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


if __name__ == "__main__":
    main()
