interface Props {
  originalSrc: string;
  heatmapBase64: string;
  gradcamPpBase64: string;
  boundingBoxBase64: string;
}

interface PanelProps {
  src: string;
  alt: string;
  label: string;
  description: string;
}

function ImagePanel({ src, alt, label, description }: PanelProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <img
          src={src}
          alt={alt}
          className="h-52 w-52 object-cover"
          style={{ imageRendering: "auto" }}
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <span className="text-center text-xs text-gray-400 leading-tight max-w-[13rem]">
        {description}
      </span>
    </div>
  );
}

export default function HeatmapOverlay({
  originalSrc,
  heatmapBase64,
  gradcamPpBase64,
  boundingBoxBase64,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-1 text-base font-semibold text-gray-800">
        Visualizaciones diagnosticas
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        Zonas calidas (rojo/amarillo) indican las regiones que mas influyeron en la prediccion.
        El recuadro rojo marca el area sospechosa principal.
      </p>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <ImagePanel
          src={originalSrc}
          alt="Imagen original"
          label="Original"
          description="Imagen enviada sin modificar"
        />
        <ImagePanel
          src={`data:image/png;base64,${heatmapBase64}`}
          alt="Heatmap Grad-CAM"
          label="Grad-CAM"
          description="Activaciones ponderadas por gradiente"
        />
        <ImagePanel
          src={`data:image/png;base64,${gradcamPpBase64}`}
          alt="Heatmap Grad-CAM++"
          label="Grad-CAM++"
          description="Mayor precision con multiples focos"
        />
        <ImagePanel
          src={`data:image/png;base64,${boundingBoxBase64}`}
          alt="Region sospechosa"
          label="Region sospechosa"
          description="Area de maxima activacion delimitada"
        />
      </div>
    </div>
  );
}
