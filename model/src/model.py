import torch
import torch.nn as nn
from torchvision import models


def create_model(pretrained=True, freeze_backbone=True):
    """Crea EfficientNet-B3 con classifier personalizado para clasificación binaria.

    Estrategia de fine-tuning progresivo:
    1. freeze_backbone=True: Solo entrena el classifier (Fase 1)
    2. freeze_backbone=False: Entrena todo el modelo (Fase 2)
    """
    weights = models.EfficientNet_B3_Weights.IMAGENET1K_V1 if pretrained else None
    model = models.efficientnet_b3(weights=weights)

    if freeze_backbone:
        for param in model.features.parameters():
            param.requires_grad = False

    in_features = model.classifier[1].in_features  # 1536 para B3

    model.classifier = nn.Sequential(
        nn.Dropout(p=0.5),
        nn.Linear(in_features, 512),
        nn.ReLU(),
        nn.Dropout(p=0.3),
        nn.Linear(512, 1),
    )

    return model


def unfreeze_backbone(model, unfreeze_from=5):
    """Descongela las capas del backbone desde `unfreeze_from` en adelante.

    EfficientNet-B3 tiene 8 bloques en features (0-7).
    unfreeze_from=5 descongela los últimos 3 bloques.
    """
    for i, block in enumerate(model.features):
        if i >= unfreeze_from:
            for param in block.parameters():
                param.requires_grad = True

    return model


def load_model(checkpoint_path, device="cuda"):
    """Carga un modelo desde un checkpoint."""
    model = create_model(pretrained=False, freeze_backbone=False)
    checkpoint = torch.load(checkpoint_path, map_location=device, weights_only=True)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()
    return model
