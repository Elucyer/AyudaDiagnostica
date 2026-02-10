import type { ModelMetrics } from "@/lib/api";

interface Props {
  prediction: "metastasis" | "normal";
  confidence: number;
  metrics: ModelMetrics;
  disclaimer: string;
}

export default function ReportView({
  prediction,
  confidence,
  metrics,
  disclaimer,
}: Props) {
  const rows = [
    { label: "Clasificacion", value: prediction === "metastasis" ? "Metastasis" : "Normal" },
    { label: "Confianza", value: `${(confidence * 100).toFixed(1)}%` },
    { label: "Accuracy del modelo", value: `${(metrics.accuracy * 100).toFixed(1)}%` },
    { label: "AUC-ROC", value: metrics.auc_roc.toFixed(4) },
    { label: "Sensibilidad", value: `${(metrics.sensitivity * 100).toFixed(1)}%` },
    { label: "Especificidad", value: `${(metrics.specificity * 100).toFixed(1)}%` },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-800">
        Reporte de analisis
      </h3>

      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-gray-100 last:border-0">
              <td className="py-2 pr-4 font-medium text-gray-600">
                {row.label}
              </td>
              <td className="py-2 text-right text-gray-900">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
        <div className="flex gap-2">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-xs leading-relaxed text-amber-800">{disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
