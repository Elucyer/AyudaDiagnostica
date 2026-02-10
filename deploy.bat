@echo off
echo ============================================
echo  AyudaDiagnostica - Deploy
echo ============================================
echo.

:: Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no encontrado. Instala Python 3.11+
    exit /b 1
)

:: Instalar dependencias base
echo [1/3] Instalando dependencias...
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121 -q
pip install fastapi "uvicorn[standard]" python-multipart h5py scikit-learn matplotlib seaborn tqdm Pillow -q
echo       Dependencias instaladas.
echo.

:: Verificar que el modelo existe
if not exist "model\checkpoints\best_model.pth" (
    echo [AVISO] No se encontro el modelo entrenado.
    echo         Ejecuta primero: python model\src\train.py
    echo         O descarga el dataset: python model\download_dataset.py
    exit /b 1
)

:: Verificar metricas
if not exist "model\results\test_metrics.json" (
    echo [AVISO] No se encontraron metricas. Ejecutando evaluacion...
    cd model\src
    python evaluate.py
    cd ..\..
)

:: Levantar API
echo [2/3] Modelo encontrado en model\checkpoints\best_model.pth
echo [3/3] Levantando API en http://127.0.0.1:8000 ...
echo.
echo       Docs:    http://127.0.0.1:8000/docs
echo       Health:  http://127.0.0.1:8000/api/health
echo       Predict: POST http://127.0.0.1:8000/api/predict
echo.
echo       Presiona Ctrl+C para detener.
echo ============================================
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
