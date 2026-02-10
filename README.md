# AyudaDiagnostica

Herramienta de apoyo diagnostico que detecta metastasis cancerosas en imagenes histopatologicas de ganglios linfaticos usando deep learning. Ayuda a patologos a reducir el tiempo de revision senalando regiones sospechosas con mapas de calor (Grad-CAM).

> **Disclaimer:** Esta herramienta es exclusivamente de apoyo diagnostico y NO sustituye el criterio medico profesional.

## Rendimiento del modelo

| Metrica | Valor |
|---|---|
| Accuracy | 86.6% |
| AUC-ROC | 0.942 |
| Sensibilidad | 80.5% |
| Especificidad | 92.7% |
| F1-Score | 85.7% |

Evaluado sobre 32,768 imagenes del test set de PatchCamelyon. Modelo: EfficientNet-B3 fine-tuned con umbral optimizado (0.20).

## Inicio rapido con Docker

La forma mas sencilla de ejecutar el proyecto completo. Solo necesitas **Docker Desktop** instalado.

```bash
git clone https://github.com/tu-usuario/AyudaDiagnostica.git
cd AyudaDiagnostica
docker compose up --build
```

> **Nota:** El archivo del modelo (`best_model.pth`, 126 MB) se descarga automaticamente via Git LFS al clonar. Si no tienes Git LFS instalado, ejecuta `git lfs install` antes de clonar.

Una vez que los contenedores esten corriendo:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Docs (Swagger):** http://localhost:8000/docs

## Inicio rapido sin Docker (local)

### Requisitos

- Python 3.11+
- Node.js 18+
- GPU con CUDA (opcional, funciona con CPU pero mas lento)

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/tu-usuario/AyudaDiagnostica.git
cd AyudaDiagnostica
```

Instalar dependencias del backend:

```bash
# Con GPU NVIDIA (CUDA 12.1)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
# Sin GPU (solo CPU)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

pip install fastapi "uvicorn[standard]" python-multipart numpy Pillow scikit-learn matplotlib seaborn
```

Instalar dependencias del frontend:

```bash
cd frontend
npm install
cd ..
```

### 2. Levantar el backend

```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

O en Windows:

```bash
deploy.bat
```

### 3. Levantar el frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

Abrir http://localhost:3000.

## Como usar

1. Abre http://localhost:3000
2. Haz clic en **"Iniciar diagnostico"**
3. Arrastra o selecciona una imagen histopatologica (PNG, JPEG o TIFF)
4. Haz clic en **"Analizar imagen"**
5. Revisa:
   - **Prediccion:** Metastasis o Normal, con porcentaje de confianza
   - **Grad-CAM:** Mapa de calor que muestra las regiones que influyeron en la prediccion
   - **Reporte:** Metricas del modelo y disclaimer medico

Hay imagenes de ejemplo en `model/samples/` para probar.

## API

### `POST /api/predict`

Recibe una imagen y retorna la prediccion.

```bash
curl -X POST http://localhost:8000/api/predict \
  -F "file=@model/samples/metastasis_1.png"
```

Respuesta:

```json
{
  "prediction": "metastasis",
  "confidence": 0.87,
  "threshold": 0.2,
  "heatmap_base64": "iVBORw0KGgo...",
  "metrics": {
    "accuracy": 0.8661,
    "auc_roc": 0.942,
    "sensitivity": 0.8052,
    "specificity": 0.9269
  },
  "disclaimer": "Esta herramienta es exclusivamente de apoyo diagnostico..."
}
```

### `GET /api/health`

Verifica que el servicio y el modelo esten cargados.

## Reentrenar el modelo

Si quieres reentrenar desde cero con el dataset PatchCamelyon (~7.5 GB de descarga):

```bash
# 1. Descargar dataset desde Zenodo
python model/download_dataset.py

# 2. Entrenar (requiere GPU, ~30 min con RTX 4060 Ti)
cd model/src
python train.py

# 3. Evaluar
python evaluate.py
```

O en Windows ejecutar todo de una vez:

```bash
setup.bat
```

## Estructura del proyecto

```
AyudaDiagnostica/
├── backend/                    # API FastAPI
│   ├── app/
│   │   ├── main.py             # App, CORS, lifespan
│   │   ├── routes/
│   │   │   └── prediction.py   # POST /api/predict
│   │   ├── services/
│   │   │   ├── model_service.py    # Carga modelo e inferencia
│   │   │   └── gradcam_service.py  # Generacion de heatmaps
│   │   └── schemas/
│   │       └── prediction.py   # Schemas request/response
│   └── Dockerfile
├── frontend/                   # Next.js + Tailwind
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Landing page
│   │   │   └── diagnostico/
│   │   │       └── page.tsx        # Pagina de diagnostico
│   │   ├── components/
│   │   │   ├── ImageUploader.tsx    # Drag & drop de imagenes
│   │   │   ├── ResultCard.tsx      # Prediccion + confianza
│   │   │   ├── HeatmapOverlay.tsx  # Grad-CAM overlay
│   │   │   └── ReportView.tsx      # Reporte con metricas
│   │   └── lib/
│   │       └── api.ts              # Cliente API
│   └── Dockerfile
├── model/                      # Modelo ML
│   ├── src/
│   │   ├── config.py               # Hiperparametros
│   │   ├── dataset.py              # Dataset PCam (HDF5)
│   │   ├── model.py                # EfficientNet-B3
│   │   ├── train.py                # Entrenamiento
│   │   ├── evaluate.py             # Evaluacion
│   │   └── gradcam.py              # Grad-CAM
│   ├── checkpoints/
│   │   └── best_model.pth          # Pesos (Git LFS)
│   ├── results/                    # Metricas y graficas
│   ├── samples/                    # Imagenes de ejemplo
│   └── download_dataset.py         # Descarga PCam
├── docker-compose.yml
├── setup.bat                   # Setup completo (Windows)
└── deploy.bat                  # Solo levantar API (Windows)
```

## Stack tecnologico

- **Modelo:** PyTorch, EfficientNet-B3 (torchvision), Grad-CAM
- **Dataset:** PatchCamelyon (PCam) — 327,680 imagenes 96x96, clasificacion binaria
- **Backend:** FastAPI, Uvicorn
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Deploy:** Docker Compose
