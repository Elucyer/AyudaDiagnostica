# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

AyudaDiagnostica is a diagnostic support tool that detects cancer metastases in histopathological lymph node images using deep learning (EfficientNet-B3 + Grad-CAM). It is a portfolio project with three independent sub-projects: a trained ML model, a FastAPI backend, and a Next.js frontend.

## Commands

### Backend (from project root)

```bash
# Run the API server (development, with hot reload)
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

# Or via pyproject.toml script (requires pip install -e .)
serve
```

### Frontend (from `frontend/`)

```bash
npm run dev       # Development server at http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
```

### Full stack via Docker

```bash
docker compose up --build
```

### ML model (from project root)

```bash
# Download dataset (~7.5 GB from Zenodo)
python model/download_dataset.py   # or: download-data (requires pip install -e .)

# Train (requires GPU, ~30 min with RTX 4060 Ti)
cd model/src && python train.py    # or: train

# Evaluate on test set (generates metrics + plots in model/results/)
cd model/src && python evaluate.py # or: evaluate
```

## Architecture

### Data flow

User uploads image → `frontend/src/lib/api.ts` → `POST /api/predict` → `backend/app/routes/prediction.py` → `ModelService.predict()` + visualization services → returns `PredictionResponse` with label, confidence, threshold, three base64 images (Grad-CAM, Grad-CAM++, bounding box overlay), model metrics, and a medical disclaimer → frontend renders results in `HeatmapOverlay.tsx`, `ResultCard.tsx`, and `ReportView.tsx`.

### Backend

- **Entry point:** `backend/app/main.py` — FastAPI app with lifespan that loads the model at startup via `model_service.load()`. CORS is restricted to `localhost:3000`.
- **`ModelService`** (`backend/app/services/model_service.py`) — singleton that loads `model/checkpoints/best_model.pth` and exposes `predict(image)`. It dynamically adds `model/src` to `sys.path` to import `config.py` and `model.py` from the ML package.
- **`gradcam_service`** (`backend/app/services/gradcam_service.py`) — also adds `model/src` to `sys.path` and imports `GradCAM`, `apply_heatmap`, `heatmap_to_base64` from the ML package. Grad-CAM runs with gradients enabled (not `@torch.no_grad()`). Produces three visualizations: standard Grad-CAM, Grad-CAM++, and bounding box on the original image.
- Metrics displayed to users are read from `model/results/test_metrics.json` at request time.

### ML model (`model/src/`)

- `config.py` — all hyperparameters and paths. Key values: `IMAGE_SIZE=96`, `OPTIMAL_THRESHOLD=0.40`, `DEVICE="cuda"` (overridable via `DEVICE` env var).
- `model.py` — EfficientNet-B3 wrapper with `load_model()` factory function.
- `train.py` — two-phase training: phase 1 trains only the classifier head, phase 2 fine-tunes all layers.
- `gradcam.py` — `GradCAM` class targeting the last convolutional block; `apply_heatmap` overlays the heatmap; `heatmap_to_base64` encodes the result.
- Dataset: PatchCamelyon (PCam) — 327,680 images at 96×96px, stored as HDF5 files in `model/data/`.

### Frontend

- Next.js 16 + React 19 + Tailwind CSS 4 (App Router).
- Two pages: `src/app/page.tsx` (landing) and `src/app/diagnostico/page.tsx` (main UI).
- API client: `src/lib/api.ts` — reads `NEXT_PUBLIC_API_URL` env var (defaults to `http://127.0.0.1:8000`).
- Key components: `HeatmapOverlay.tsx` (toggles between Grad-CAM / Grad-CAM++ / bounding box views), `ResultCard.tsx` (prediction label + confidence), `ReportView.tsx` (printable diagnostic report).
- All three base64 images from the API are rendered directly via `<img src="data:image/png;base64,...">` without any server-side processing.

## Key dependencies

- **PyTorch** is not in `pyproject.toml` dependencies — it must be installed separately with the correct CUDA/CPU wheel before the backend can start. The optional `[cuda]` extra (`pip install -e ".[cuda]"`) pulls `torch` and `torchvision` but uses the default PyPI index, not the CUDA-specific wheel URL.
- **`model/checkpoints/best_model.pth`** (126 MB) is tracked via Git LFS. If missing, run `git lfs pull`.
- The backend imports directly from `model/src/` via `sys.path` manipulation, so the `model/` directory must remain at the project root when running the backend locally.
