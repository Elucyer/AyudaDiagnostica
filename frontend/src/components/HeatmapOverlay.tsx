interface Props {
  originalSrc: string;
  heatmapBase64: string;
}

export default function HeatmapOverlay({ originalSrc, heatmapBase64 }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-800">
        Mapa de activacion (Grad-CAM)
      </h3>
      <p className="mb-4 text-sm text-gray-500">
        Las zonas calidas (rojo/amarillo) indican las regiones que mas influyeron en la prediccion del modelo.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <img
              src={originalSrc}
              alt="Imagen original"
              className="h-48 w-48 object-cover"
            />
          </div>
          <span className="text-xs font-medium text-gray-500">Original</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <img
              src={`data:image/png;base64,${heatmapBase64}`}
              alt="Heatmap Grad-CAM"
              className="h-48 w-48 object-cover"
            />
          </div>
          <span className="text-xs font-medium text-gray-500">Grad-CAM</span>
        </div>
      </div>
    </div>
  );
}
