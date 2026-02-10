@echo off
echo ============================================
echo  AyudaDiagnostica - Setup completo
echo ============================================
echo.
echo Este script configura todo el proyecto desde cero.
echo.

:: Instalar dependencias
echo [1/4] Instalando dependencias...
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121 -q
pip install fastapi "uvicorn[standard]" python-multipart h5py scikit-learn matplotlib seaborn tqdm Pillow -q
echo       Listo.
echo.

:: Descargar dataset
echo [2/4] Descargando dataset PatchCamelyon (~7.5 GB)...
python model\download_dataset.py
echo.

:: Entrenar modelo
echo [3/4] Entrenando modelo EfficientNet-B3...
cd model\src
python train.py
echo.

:: Evaluar
echo [4/4] Evaluando modelo...
python evaluate.py
cd ..\..
echo.

echo ============================================
echo  Setup completado!
echo  Ejecuta deploy.bat para levantar la API.
echo ============================================
