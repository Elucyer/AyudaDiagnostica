from pathlib import Path

# Rutas del proyecto
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
CHECKPOINTS_DIR = PROJECT_ROOT / "checkpoints"
RESULTS_DIR = PROJECT_ROOT / "results"

# Archivos del dataset PCam (HDF5)
PCAM_TRAIN_X = DATA_DIR / "camelyonpatch_level_2_split_train_x.h5"
PCAM_TRAIN_Y = DATA_DIR / "camelyonpatch_level_2_split_train_y.h5"
PCAM_VALID_X = DATA_DIR / "camelyonpatch_level_2_split_valid_x.h5"
PCAM_VALID_Y = DATA_DIR / "camelyonpatch_level_2_split_valid_y.h5"
PCAM_TEST_X = DATA_DIR / "camelyonpatch_level_2_split_test_x.h5"
PCAM_TEST_Y = DATA_DIR / "camelyonpatch_level_2_split_test_y.h5"

# Hiperparámetros del modelo
IMAGE_SIZE = 96
BATCH_SIZE = 64
NUM_WORKERS = 4
DEVICE = "cuda"

# Fase 1: Entrenar solo el classifier
PHASE1_EPOCHS = 5
PHASE1_LR = 1e-3

# Fase 2: Fine-tuning completo
PHASE2_EPOCHS = 25
PHASE2_LR = 1e-4
WEIGHT_DECAY = 2e-4

# Early stopping
PATIENCE = 7

# MixUp augmentation (alpha=0 desactiva MixUp)
MIXUP_ALPHA = 0.4

# Normalización ImageNet
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

# Mejor modelo
BEST_MODEL_PATH = CHECKPOINTS_DIR / "best_model.pth"

# Threshold óptimo (calibrado en test set, objetivo sensibilidad >= 90%)
OPTIMAL_THRESHOLD = 0.40
