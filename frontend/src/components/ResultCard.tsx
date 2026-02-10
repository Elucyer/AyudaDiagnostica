interface Props {
  prediction: "metastasis" | "normal";
  confidence: number;
  threshold: number;
}

export default function ResultCard({ prediction, confidence, threshold }: Props) {
  const isMetastasis = prediction === "metastasis";
  const percent = Math.round(confidence * 100);

  return (
    <div
      className={`rounded-2xl border-2 p-6 ${
        isMetastasis
          ? "border-red-200 bg-red-50"
          : "border-green-200 bg-green-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
            isMetastasis ? "bg-red-100" : "bg-green-100"
          }`}
        >
          {isMetastasis ? (
            <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          ) : (
            <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div>
          <h3
            className={`text-lg font-bold ${
              isMetastasis ? "text-red-800" : "text-green-800"
            }`}
          >
            {isMetastasis ? "Metastasis detectada" : "Tejido normal"}
          </h3>
          <p
            className={`text-sm ${
              isMetastasis ? "text-red-600" : "text-green-600"
            }`}
          >
            Confianza del modelo: {percent}%
          </p>
        </div>
      </div>

      {/* Barra de confianza */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Normal</span>
          <span>Metastasis</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isMetastasis ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>0%</span>
          <span className="text-gray-500">Umbral: {Math.round(threshold * 100)}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
