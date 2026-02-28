import h5py
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

from config import (
    PCAM_TRAIN_X, PCAM_TRAIN_Y,
    PCAM_VALID_X, PCAM_VALID_Y,
    PCAM_TEST_X, PCAM_TEST_Y,
    IMAGE_SIZE, BATCH_SIZE, NUM_WORKERS,
    IMAGENET_MEAN, IMAGENET_STD,
)


class PCamDataset(Dataset):
    """Dataset para PatchCamelyon (PCam).

    Lee parches histopatológicos 96x96 desde archivos HDF5.
    Cada parche está etiquetado como 0 (normal) o 1 (metástasis).
    Usa apertura lazy de archivos para compatibilidad con multiprocessing en Windows.
    """

    def __init__(self, images_path, labels_path, transform=None):
        self.images_path = str(images_path)
        self.labels_path = str(labels_path)
        self.transform = transform
        self._images_file = None
        self._labels_file = None

        # Leer el tamaño una vez y cerrar
        with h5py.File(self.images_path, "r") as f:
            self._len = f["x"].shape[0]

    def _open_files(self):
        if self._images_file is None:
            self._images_file = h5py.File(self.images_path, "r")
            self._labels_file = h5py.File(self.labels_path, "r")

    def __len__(self):
        return self._len

    def __getitem__(self, idx):
        self._open_files()

        image = self._images_file["x"][idx]  # (96, 96, 3) uint8
        label = self._labels_file["y"][idx].flatten()[0]  # scalar 0 or 1

        image = image.astype(np.float32) / 255.0

        if self.transform:
            image = self.transform(torch.from_numpy(image).permute(2, 0, 1))
        else:
            image = torch.from_numpy(image).permute(2, 0, 1)

        label = torch.tensor(label, dtype=torch.float32)
        return image, label


def get_train_transforms():
    """Augmentación orientada a variabilidad de tinción H&E.

    - Flips y rotaciones: imágenes histológicas no tienen orientación canónica.
    - ColorJitter amplio: simula diferencias de tinción entre laboratorios/slides.
    - GaussianBlur: simula variaciones de foco del microscopio.
    """
    return transforms.Compose([
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomApply([transforms.RandomRotation(90)], p=0.75),
        transforms.RandomApply([
            transforms.ColorJitter(
                brightness=0.3,
                contrast=0.3,
                saturation=0.3,   # variabilidad de intensidad de tinción
                hue=0.08,         # variabilidad de tono H&E entre laboratorios
            )
        ], p=0.5),
        transforms.RandomApply([
            transforms.GaussianBlur(kernel_size=3, sigma=(0.1, 1.0))
        ], p=0.2),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def get_eval_transforms():
    return transforms.Compose([
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def get_dataloaders():
    """Retorna los DataLoaders de train, validation y test."""
    train_dataset = PCamDataset(
        PCAM_TRAIN_X, PCAM_TRAIN_Y, transform=get_train_transforms()
    )
    valid_dataset = PCamDataset(
        PCAM_VALID_X, PCAM_VALID_Y, transform=get_eval_transforms()
    )
    test_dataset = PCamDataset(
        PCAM_TEST_X, PCAM_TEST_Y, transform=get_eval_transforms()
    )

    train_loader = DataLoader(
        train_dataset, batch_size=BATCH_SIZE, shuffle=True,
        num_workers=NUM_WORKERS, pin_memory=True,
    )
    valid_loader = DataLoader(
        valid_dataset, batch_size=BATCH_SIZE, shuffle=False,
        num_workers=NUM_WORKERS, pin_memory=True,
    )
    test_loader = DataLoader(
        test_dataset, batch_size=BATCH_SIZE, shuffle=False,
        num_workers=NUM_WORKERS, pin_memory=True,
    )

    return train_loader, valid_loader, test_loader
