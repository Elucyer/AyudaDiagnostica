"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ResultCard from "@/components/ResultCard";
import HeatmapOverlay from "@/components/HeatmapOverlay";
import ReportView from "@/components/ReportView";
import { predict, type PredictionResponse } from "@/lib/api";

export default function DiagnosticoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const response = await predict(file);
      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al analizar la imagen"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Analisis histopatologico
        </h1>
        <p className="mt-2 text-gray-600">
          Sube una imagen de tejido para analizar la presencia de metastasis.
        </p>
      </div>

      {/* Uploader */}
      <ImageUploader onFileSelected={handleFileSelected} disabled={loading} />

      {/* Boton analizar */}
      {file && !result && (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analizando...
              </span>
            ) : (
              "Analizar imagen"
            )}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
          <p><strong>Error:</strong> {error}</p>
          <p className="mt-1 text-xs text-red-500">
            Asegurate de que el backend este corriendo (deploy.bat) y vuelve a intentar.
          </p>
        </div>
      )}

      {/* Resultados */}
      {result && (
        <div className="mt-8 space-y-6">
          <ResultCard
            prediction={result.prediction}
            confidence={result.confidence}
            threshold={result.threshold}
          />

          {preview && (
            <HeatmapOverlay
              originalSrc={preview}
              heatmapBase64={result.heatmap_base64}
            />
          )}

          <ReportView
            prediction={result.prediction}
            confidence={result.confidence}
            metrics={result.metrics}
            disclaimer={result.disclaimer}
          />

          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Analizar otra imagen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
