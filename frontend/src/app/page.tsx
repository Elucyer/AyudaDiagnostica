export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="flex flex-col items-center py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100">
          <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Deteccion de metastasis<br />
          con inteligencia artificial
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
          Herramienta de apoyo diagnostico que analiza imagenes histopatologicas de
          ganglios linfaticos para identificar tejido metastasico, ayudando a
          patologos a reducir el tiempo de revision.
        </p>
        <a
          href="/diagnostico"
          className="mt-8 rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          Iniciar diagnostico
        </a>
      </section>

      {/* Como funciona */}
      <section className="py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
          Como funciona
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Sube una imagen",
              desc: "Arrastra o selecciona un parche histopatologico (96x96 px, H&E stain) en formato PNG, JPEG o TIFF.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              ),
            },
            {
              step: "2",
              title: "Analisis con IA",
              desc: "Un modelo EfficientNet-B3 fine-tuned sobre 327,680 imagenes clasifica el parche como normal o metastasis.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              ),
            },
            {
              step: "3",
              title: "Resultados + Grad-CAM",
              desc: "Recibe la prediccion con nivel de confianza y un mapa de calor que muestra las regiones relevantes.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
              ),
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {item.icon}
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Metricas del modelo */}
      <section className="py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
          Rendimiento del modelo
        </h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Accuracy", value: "86.6%", desc: "Precision general" },
            { label: "AUC-ROC", value: "0.942", desc: "Area bajo la curva ROC" },
            { label: "Sensibilidad", value: "93.8%", desc: "Detecta metastasis correctamente" },
            { label: "Especificidad", value: "79.4%", desc: "Identifica tejido normal" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center"
            >
              <span className="text-3xl font-bold text-blue-600">
                {metric.value}
              </span>
              <span className="mt-1 text-sm font-semibold text-gray-900">
                {metric.label}
              </span>
              <span className="mt-1 text-xs text-gray-500">{metric.desc}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          Evaluado sobre 32,768 imagenes del test set de PatchCamelyon.
          Modelo: EfficientNet-B3 fine-tuned con umbral optimizado (0.20).
        </p>
      </section>

      {/* Sobre el proyecto */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Sobre el proyecto
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-gray-600">
            <p>
              <strong>AyudaDiagnostica</strong> es un proyecto de portafolio que demuestra
              el uso de deep learning aplicado a imagenes medicas. Utiliza el dataset
              PatchCamelyon (PCam), un benchmark estandar para clasificacion de imagenes
              histopatologicas.
            </p>
            <p>
              El modelo base es <strong>EfficientNet-B3</strong> preentrenado en ImageNet,
              con fine-tuning progresivo sobre 262,144 imagenes de entrenamiento.
              Se utiliza <strong>Grad-CAM</strong> para interpretabilidad, mostrando
              que regiones de la imagen influyen en la prediccion.
            </p>
            <p>
              <strong>Stack tecnologico:</strong> PyTorch, FastAPI, Next.js, Tailwind CSS.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
