from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.prediction import router as prediction_router
from .schemas.prediction import HealthResponse
from .services.model_service import model_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: cargar modelo
    print("Cargando modelo EfficientNet-B3...")
    model_service.load()
    print(f"Modelo cargado en {model_service.device}")
    yield
    # Shutdown
    print("Apagando servidor...")


app = FastAPI(
    title="AyudaDiagnostica API",
    description="API para detección de metástasis en imágenes histopatológicas",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(prediction_router, prefix="/api")


@app.get("/api/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        model_loaded=model_service.is_loaded,
        device=str(model_service.device) if model_service.device else "none",
    )
