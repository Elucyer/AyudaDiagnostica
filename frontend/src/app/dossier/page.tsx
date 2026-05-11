import PrintButton from "@/components/PrintButton";

export default function SustentacionPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">

      {/* Título */}
      <section className="mb-16 text-center">
        <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Dossier Tecnico — DEO104-1
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          AyudaDiagnostica
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Software de apoyo al diagnostico de metastasis en imagenes histopatologicas mediante inteligencia artificial
        </p>
        <p className="mt-2 text-sm text-gray-400">Janer Perez Monsalve · CC: 1007114896 · Curso DEO104-1</p>
        <div className="mt-6 print:hidden">
          <PrintButton />
        </div>
      </section>

      {/* 1. Problemática */}
      <Section id="problematica" title="1. Problematica" color="red">
        <p className="text-gray-600 leading-relaxed mb-6">
          El cancer de mama es una de las principales causas de mortalidad oncologica en Colombia y en el mundo.
          La presencia o ausencia de metastasis en ganglios linfaticos axilares determina el pronostico del paciente
          y las decisiones terapeuticas: quimioterapia adyuvante, radioterapia, cirugia extendida.
        </p>
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          {[
            { stat: "~1.6M", label: "nuevos casos de cancer de mama al año en latinoamerica y el caribe (OMS)" },
            { stat: "~8,000", label: "casos nuevos anuales en Colombia (INC)" },
            { stat: "Deficit", label: "critico de patologos fuera de ciudades principales en Colombia" },
          ].map((item) => (
            <div key={item.stat} className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
              <span className="block text-3xl font-bold text-red-600">{item.stat}</span>
              <span className="mt-2 block text-xs text-gray-600 leading-relaxed">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Poblaciones afectadas</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 font-bold">•</span>Pacientes con cancer de mama en Colombia, con mayor vulnerabilidad en regiones con escasez de especialistas.</li>
            <li className="flex gap-2"><span className="text-red-500 font-bold">•</span>Patologos sobrecargados en laboratorios de referencia de ciudades principales.</li>
            <li className="flex gap-2"><span className="text-red-500 font-bold">•</span>IPS de nivel II y III sin acceso a segunda lectura especializada en histopatologia oncologica.</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            <strong>Dimension geografica:</strong> la lectura manual es lenta y sujeta a fatiga cognitiva;
            la variabilidad interobservador representa un riesgo diagnostico real. En Colombia, municipios
            medianos y pequeños envian muestras a centros de referencia con retrasos de dias a semanas.
          </p>
        </div>

        {/* Perfil demográfico y epidemiológico */}
        <div className="rounded-xl bg-white border border-red-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Perfil demografico y epidemiologico</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Datos del Instituto Nacional de Cancerologia (INC) — Anuario Estadistico 2021 sobre los
            pacientes atendidos en el principal centro oncologico publico de Colombia:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
            {[
              { stat: "5.562", label: "casos nuevos de cancer atendidos en el INC (2021)" },
              { stat: "55,8%", label: "de pacientes oncologicos son mujeres" },
              { stat: "511", label: "casos nuevos de cancer de mama (505 mujeres, 6 hombres)" },
              { stat: "41%", label: "de pacientes son mayores de 65 años" },
            ].map((item) => (
              <div key={item.stat} className="rounded-lg border border-red-100 bg-red-50 p-3 text-center">
                <span className="block text-2xl font-bold text-red-600">{item.stat}</span>
                <span className="mt-1 block text-xs text-gray-600 leading-relaxed">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">Distribucion por edad (cancer de mama)</h4>
              <ul className="space-y-1">
                <li className="flex justify-between border-b border-gray-100 py-1"><span>35–44 años</span><span className="font-medium">76 casos (15%)</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>45–54 años</span><span className="font-medium">126 casos (25%)</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>55–64 años</span><span className="font-medium">144 casos (28%)</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>65+ años</span><span className="font-medium">142 casos (28%)</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">Estado clinico al ingreso (mama)</h4>
              <ul className="space-y-1">
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Estadio temprano (hasta IIIA)</span><span className="font-medium text-green-700">43,6%</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Estadio tardio (IIIB–IV)</span><span className="font-medium text-red-700">44,8%</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Sin estadificar</span><span className="font-medium">11,6%</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Diagnostico tardio en regimen subsidiado</span><span className="font-medium text-red-700">Predominante</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">Distribucion por regimen de afiliacion</h4>
              <ul className="space-y-1">
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Subsidiado</span><span className="font-medium">49,7% (2.766)</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Contributivo</span><span className="font-medium">32,4% (1.804)</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Particular</span><span className="font-medium">12,6% (698)</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Especial / no asegurado</span><span className="font-medium">5,3% (294)</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">Distribucion geografica de pacientes</h4>
              <ul className="space-y-1">
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Bogota D.C.</span><span className="font-medium">59,0% (3.283)</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Cundinamarca</span><span className="font-medium">13,5% (752)</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Boyaca</span><span className="font-medium">5,8% (323)</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Tolima</span><span className="font-medium">5,5% (308)</span></li>
                <li className="flex justify-between border-b border-gray-100 py-1"><span>Meta</span><span className="font-medium">4,1% (226)</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-gray-700">
            <strong>Hallazgos clinicos relevantes:</strong> El 88% de pacientes provienen de Bogota
            y departamentos del area de influencia (Cundinamarca, Boyaca, Tolima, Meta), evidenciando
            la <strong>centralizacion del acceso a servicios oncologicos especializados</strong>.
            En cancer de mama, el 44,8% ingresa en estadio avanzado (IIIB–IV), porcentaje significativamente
            mayor en mujeres del regimen subsidiado, lo que refleja inequidad en el acceso a deteccion
            temprana. Los departamentos perifericos (Vaupes, Vichada, Guainia, Amazonas) registran
            menos de 12 casos atendidos al año, evidenciando barreras geograficas significativas.
          </div>

          <p className="mt-3 text-xs text-gray-500 italic">
            Fuente: Instituto Nacional de Cancerologia (INC). Anuario Estadistico 2021, Volumen 19.
            Bogota D.C.: INC; 2022. ISSN: 1909-8995. Disponible en www.cancer.gov.co
          </p>
        </div>
      </Section>

      {/* 2. Justificación */}
      <Section id="justificacion" title="2. Justificacion" color="blue">
        <p className="text-gray-600 leading-relaxed mb-6">
          AyudaDiagnostica surge como herramienta de <strong>segunda lectura automatizada</strong>:
          no reemplaza al patologo sino que actua como apoyo cuantificado que reduce el tiempo de revision
          y senala regiones de maxima sospecha diagnostica.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              problema: "Escasez de patologos",
              impacto: "Retrasos diagnosticos en oncologia",
              solucion: "La IA procesa una imagen en segundos y entrega un resultado cuantificado disponible inmediatamente.",
            },
            {
              problema: "Fatiga cognitiva",
              impacto: "Mayor probabilidad de error humano en jornadas largas",
              solucion: "El sistema actua como primera capa de acercamiento, priorizando los casos de mayor sospecha para revision humana.",
            },
            {
              problema: "Falta de segunda lectura",
              impacto: "Diagnosticos oncologicos tardios o inconsistentes",
              solucion: "Grad-CAM y Grad-CAM++ entregan explicaciones visuales del razonamiento del modelo.",
            },
            {
              problema: "Costo de envio de muestras",
              impacto: "Inequidad en el acceso al diagnostico de calidad",
              solucion: "Modalidad SaaS: el patologo analiza la imagen digitalizada sin moverla fisicamente.",
            },
          ].map((item) => (
            <div key={item.problema} className="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">{item.problema}</p>
              <p className="text-xs text-gray-500 mb-3">Impacto: {item.impacto}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.solucion}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Ejemplo de análisis */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1.5 rounded-full bg-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900">Ejemplo de analisis real</h2>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <img
            src="/ejemplo-analisis.png"
            alt="Captura del sistema AyudaDiagnostica mostrando un resultado de metastasis detectada con visualizaciones Grad-CAM"
            className="w-full"
          />
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Resultado:</strong> Metastasis detectada · Confianza del modelo: 83% ·
              Se muestran las cuatro vistas: imagen original, Grad-CAM, Grad-CAM++ y region sospechosa con bounding box.
              Las zonas rojas/amarillas indican las regiones que mas influyeron en la prediccion.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Descripción y proceso regulatorio */}
      <Section id="regulatorio" title="3. Descripcion y Proceso Regulatorio" color="purple">

        {/* 3.1 Descripción (8 ítems) */}
        <Subsection title="3.1 Descripcion del dispositivo ">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "1", label: "Nombre", val: "AyudaDiagnostica — Software de apoyo al diagnostico de metastasis en imagenes histopatologicas de ganglios linfaticos mediante IA" },
              { n: "2", label: "Clasificacion regulatoria", val: "SaMD Clase IIa (riesgo moderado) conforme al Decreto 4725/2005 y Decreto 582/2017 de Colombia. Marco IMDRF: Categoria II (condicion seria / funcion de apoyo a la decision clinica)." },
              { n: "3", label: "Indicaciones de uso", val: "Apoyo al analisis de parches histopatologicos de ganglios linfaticos (96x96 px, tincion H&E) para deteccion de celulas tumorales metastasicas. Uso exclusivo por profesionales de la salud." },
              { n: "4", label: "Contraindicaciones", val: "No usar como unico criterio diagnostico. No apto para imagenes fuera del dominio H&E estandar 96x96 px. No indicado para cancer distinto a metastasis en ganglios linfaticos." },
              { n: "5", label: "Descripcion tecnica", val: "EfficientNet-B3 entrenado sobre 327,680 imagenes PCam. Umbral de decision OPTIMAL_THRESHOLD = 0.40. API REST FastAPI + frontend Next.js. Visualizaciones: Grad-CAM, Grad-CAM++, bounding box." },
              { n: "6", label: "Fabricante / version", val: "Janer Perez Monsalve — Version 1.0.0 — Colombia" },
              { n: "7", label: "Advertencia legal", val: "Este dispositivo es una herramienta de apoyo diagnostico. El resultado no constituye un diagnostico medico definitivo. Debe ser interpretado por un profesional de salud calificado." },
              { n: "8", label: "Salida del sistema", val: "Clasificacion binaria (metastasis / normal) con porcentaje de confianza, umbral utilizado, tres visualizaciones XAI en base64 y metricas del modelo (AUC-ROC, accuracy, sensibilidad, especificidad)." },
            ].map((item) => (
              <div key={item.n} className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                <p className="text-xs font-bold text-purple-700 mb-1">{item.n}. {item.label}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{item.val}</p>
              </div>
            ))}
          </div>
        </Subsection>

        {/* 3.2 Justificación de la clasificación Clase IIa */}
        <Subsection title="3.2 Justificacion de la clasificacion regulatoria (Clase IIa)">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            La clasificacion como <strong>SaMD Clase IIa</strong> se sustenta en dos marcos regulatorios
            complementarios: la matriz IMDRF para software medico y el Decreto 4725/2005 del INVIMA.
          </p>

          {/* Matriz IMDRF */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Matriz IMDRF para SaMD</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Significancia de la informacion</th>
                    <th className="text-center p-3 font-semibold text-gray-700 border border-gray-200">Condicion no seria</th>
                    <th className="text-center p-3 font-semibold text-gray-700 border border-gray-200">Condicion seria</th>
                    <th className="text-center p-3 font-semibold text-gray-700 border border-gray-200">Condicion critica</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="p-3 border border-gray-200 font-medium">Tratar / diagnosticar autonomamente</td>
                    <td className="p-3 border border-gray-200 text-center text-gray-600">Categoria II</td>
                    <td className="p-3 border border-gray-200 text-center text-gray-600">Categoria III</td>
                    <td className="p-3 border border-gray-200 text-center text-gray-600">Categoria IV</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border border-gray-200 font-medium">Guiar manejo clinico</td>
                    <td className="p-3 border border-gray-200 text-center text-gray-600">Categoria I</td>
                    <td className="p-3 border border-gray-200 text-center text-gray-600">Categoria II</td>
                    <td className="p-3 border border-gray-200 text-center text-gray-600">Categoria III</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 border border-gray-200 font-medium">Informar manejo clinico</td>
                    <td className="p-3 border border-gray-200 text-center text-gray-600">Categoria I</td>
                    <td className="p-3 border-2 border-purple-500 bg-purple-100 text-center font-bold text-purple-900">Categoria II ← AyudaDiagnostica</td>
                    <td className="p-3 border border-gray-200 text-center text-gray-600">Categoria III</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              AyudaDiagnostica <strong>informa el manejo clinico</strong> (el patologo es quien decide,
              no el sistema) en una <strong>condicion seria</strong> (cancer de mama, no critica
              en sentido de soporte vital inmediato). Por tanto cae en <strong>Categoria II del IMDRF</strong>.
            </p>
          </div>

          {/* Clasificación INVIMA */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Clasificacion segun Decreto 4725/2005 — INVIMA</h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { clase: "Clase I", desc: "Riesgo bajo: software administrativo o de gestion, sin impacto diagnostico", active: false },
                { clase: "Clase IIa", desc: "Riesgo moderado: apoyo diagnostico con interpretacion humana obligatoria", active: true },
                { clase: "Clase IIb", desc: "Riesgo alto: software que guia decisiones de tratamiento o diagnostica autonomamente", active: false },
                { clase: "Clase III", desc: "Riesgo muy alto: software de soporte vital (ej: marcapasos programable)", active: false },
              ].map((item) => (
                <div
                  key={item.clase}
                  className={`rounded-lg p-3 ${item.active ? "border-2 border-purple-500 bg-purple-50" : "border border-gray-200 bg-white"}`}
                >
                  <p className={`font-bold text-sm mb-1 ${item.active ? "text-purple-900" : "text-gray-700"}`}>
                    {item.clase} {item.active && "←"}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ¿Por qué no es otra clase? */}
          <div className="grid gap-3 sm:grid-cols-2 mb-6">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="font-semibold text-red-800 mb-2 text-sm">¿Por que NO es Clase I?</p>
              <p className="text-xs text-gray-700 leading-relaxed">
                Su salida influye directamente en una <strong>decision clinica oncologica</strong>.
                No es un software administrativo: procesa imagenes medicas y entrega un resultado
                que el patologo usa para apoyar su diagnostico.
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="font-semibold text-amber-800 mb-2 text-sm">¿Por que NO es Clase IIb o III?</p>
              <ul className="text-xs text-gray-700 leading-relaxed space-y-1">
                <li>• <strong>No es autonomo</strong>: el patologo siempre valida el resultado</li>
                <li>• <strong>Es segunda lectura</strong>: complementa, no reemplaza la lectura primaria</li>
                <li>• <strong>No guia tratamiento</strong>: la decision terapeutica integra multiples insumos</li>
                <li>• <strong>No es vital inmediato</strong>: un fallo no causa muerte directa</li>
              </ul>
            </div>
          </div>

          {/* Tabla de criterios */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Criterios especificos que confirman Clase IIa</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 font-semibold text-gray-700 border border-gray-200">Criterio</th>
                    <th className="text-left p-2 font-semibold text-gray-700 border border-gray-200">AyudaDiagnostica</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {[
                    ["¿Diagnostica autonomamente?", "No — requiere validacion humana"],
                    ["¿Decide tratamiento?", "No — solo entrega probabilidad + visualizacion"],
                    ["¿Contacto fisico con paciente?", "No — solo procesa imagenes digitales"],
                    ["¿Riesgo de muerte inmediata por fallo?", "No — el patologo detectaria errores"],
                    ["¿Riesgo de error diagnostico moderado?", "Si — un falso negativo puede retrasar diagnostico"],
                    ["¿Requiere validacion clinica?", "Si — conforme a IMDRF N41 para registro INVIMA"],
                  ].map(([criterio, respuesta], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-2 border border-gray-200 font-medium">{criterio}</td>
                      <td className="p-2 border border-gray-200">{respuesta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-purple-50 border border-purple-200 p-4 text-sm text-gray-700 leading-relaxed">
            <strong>En sintesis:</strong> la clasificacion Clase IIa refleja que AyudaDiagnostica
            <strong> informa</strong> una decision clinica seria pero <strong>no la toma autonomamente</strong>,
            manteniendo siempre al patologo en el centro del proceso diagnostico. Esto define el alcance
            de los estudios tecnicos, la documentacion regulatoria y las barreras de seguridad descritas
            en las secciones siguientes.
          </div>
        </Subsection>

        {/* 3.3 Estudios técnicos */}
        <Subsection title="3.3 Estudios tecnicos y normativa tecnica aplicable">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Estudio</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Norma</th>
                  <th className="text-left p-3 font-semibold text-gray-700 border border-gray-200">Por que aplica</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Validacion del rendimiento analitico (Accuracy, AUC-ROC, Sensibilidad, Especificidad)", "ISO 14971:2019", "Cuantifica la capacidad diagnostica real del modelo sobre datos no vistos en entrenamiento"],
                  ["Validacion del software — ciclo de vida, control de versiones, pruebas de regresion", "IEC 62304:2006/AMD1:2015", "Aplica directamente a SaMD; exige trazabilidad de cambios y verificacion reproducible"],
                  ["Validacion de usabilidad de la interfaz de usuario", "IEC 62366-1:2015", "Garantiza que el patologo puede interpretar los resultados sin ambiguedad clinica"],
                  ["Verificacion del entorno de ejecucion: latencia, compatibilidad de navegadores", "IEC 62304", "El tiempo de respuesta impacta el flujo clinico; la compatibilidad garantiza acceso sin instalacion adicional"],
                  ["Validacion clinica piloto (comparacion vs. diagnostico de patologo certificado)", "IMDRF N41 / ISO 14155:2020", "Requerida para demostrar eficacia clinica ante el INVIMA para registro sanitario Clase IIa"],
                ].map(([estudio, norma, razon], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border border-gray-200 text-gray-700">{estudio}</td>
                    <td className="p-3 border border-gray-200 text-purple-700 font-medium whitespace-nowrap">{norma}</td>
                    <td className="p-3 border border-gray-200 text-gray-600">{razon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Subsection>

        {/* 3.3 Esterilización */}
        <Subsection title="3.4 Metodo de esterilizacion y disposicion final">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-green-50 border border-green-200 p-5">
              <p className="font-semibold text-green-800 mb-2">Esterilizacion: No aplica</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                AyudaDiagnostica es un SaMD de naturaleza completamente digital. No tiene componentes fisicos
                que entren en contacto con el paciente, tejidos ni fluidos corporales. Por tanto,
                ningun proceso de esterilizacion (autoclave, oxido de etileno, radiacion gamma, plasma de
                peroxido de hidrogeno) es aplicable.
              </p>
              <p className="mt-3 text-sm text-gray-600">
                La integridad del software se garantiza mediante: hash SHA-256 del modelo, control de
                versiones Git, dependencias fijas en pyproject.toml y CORS restringido al dominio del fabricante.
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-5">
              <p className="font-semibold text-amber-800 mb-2">Disposicion final</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>Software:</strong> detener servicios, eliminar contenedores Docker, desinstalar entorno Python, eliminar directorio del proyecto incluyendo best_model.pth (126 MB).</li>
                <li><strong>Datos del paciente:</strong> el sistema no almacena imagenes de forma persistente; se procesan en RAM y se descartan al finalizar la solicitud HTTP (privacidad por diseno — Ley 1581/2012).</li>
                <li><strong>Hardware de soporte:</strong> cumplimiento de la Ley 1672/2013 (RAEE — Residuos de Aparatos Electricos y Electronicos).</li>
              </ul>
            </div>
          </div>
        </Subsection>

        {/* 3.4 Biocompatibilidad */}
        <Subsection title="3.5 Estudios de biocompatibilidad">
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
            <p className="font-semibold text-gray-800 mb-3">No aplican — justificacion segun ISO 10993-1:2018</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              La norma ISO 10993-1:2018 exige estudios de biocompatibilidad unicamente para dispositivos
              con contacto directo o indirecto con el cuerpo humano (tejidos, celulas, fluidos corporales).
              AyudaDiagnostica opera exclusivamente sobre imagenes digitales: no tiene contacto fisico con
              el paciente, no contiene materiales biologicos ni polimericos, y no emite radiacion ni campos
              electromagneticos hacia el usuario.
            </p>
            <p className="text-sm text-gray-600">
              El equivalente para software es la evaluacion de <strong>seguridad funcional (IEC 62304)</strong>
              y la <strong>gestion de riesgos (ISO 14971)</strong>, que si aplican y se documentan a continuacion.
            </p>
          </div>
        </Subsection>

        {/* 3.5 Riesgos */}
        <Subsection title="3.6 Riesgos del proceso productivo y barreras de seguridad (ISO 14971:2019)">
          <p className="text-sm text-gray-500 mb-4">Metodologia AMFE/FMEA · Escala P: 1–3 · Escala S: 1–5 · NR = P×S · Aceptable ≤6 · Inaceptable &gt;6</p>
          <div className="space-y-4">
            {[
              {
                n: "R1",
                actividad: "Seleccion del umbral de decision",
                causa: "Umbral mal calibrado",
                efecto: "Alta tasa de falsos negativos (metastasis no detectadas) o falsos positivos",
                p: 2, s: 5, nr: 10,
                medida: "Optimizacion del umbral sobre curva ROC maximizando sensibilidad. Documentado en config.py (OPTIMAL_THRESHOLD = 0.40).",
                barrera: "Diseno inherente: umbral configurado para minimizar falsos negativos (prioridad de seguridad sobre especificidad).",
              },
              {
                n: "R2",
                actividad: "Interpretacion del resultado por el profesional de salud",
                causa: "Confianza excesiva en la salida del modelo (automation bias)",
                efecto: "Diagnostico incorrecto basado unicamente en la IA",
                p: 3, s: 5, nr: 15,
                medida: "Disclaimer medico prominente en UI y en todos los reportes. Formacion obligatoria del usuario antes del uso clinico.",
                barrera: "Informacion de seguridad (nivel 3): IFU, advertencias explicitamente destacadas, indicador de confianza del modelo visible.",
              },
              {
                n: "R3",
                actividad: "Uso de imagen fuera del dominio de entrenamiento",
                causa: "Imagen de tejido diferente, tincion no estandar H&E o artefactos",
                efecto: "Prediccion sin validez clinica presentada como valida",
                p: 3, s: 5, nr: 15,
                medida: "Validacion del dominio en documentacion de uso. Advertencia en la UI. Investigacion de OOD detection.",
                barrera: "Medida de proteccion (nivel 2): contraindicaciones documentadas; validacion de formato de imagen en /api/predict.",
              },
              {
                n: "R4",
                actividad: "Preprocesamiento de imagen en inferencia",
                causa: "Normalizacion incorrecta de pixeles o redimension erronea",
                efecto: "Prediccion erronea por desviacion de la distribucion de entrada respecto al entrenamiento",
                p: 2, s: 4, nr: 8,
                medida: "Uso de los mismos parametros de normalizacion del entrenamiento (media y desviacion estandar ImageNet). Redimension fija a 96x96 px aplicada en el backend antes de la inferencia.",
                barrera: "Diseno inherente: el pipeline de preprocesamiento esta centralizado en el backend (model_service.py), eliminando variabilidad de cliente. Pruebas unitarias del pipeline.",
              },
              {
                n: "R5",
                actividad: "Acceso no autorizado al sistema",
                causa: "Ausencia de autenticacion en el API en despliegue en produccion",
                efecto: "Usuario no autorizado realiza predicciones, accede al modelo o sobrecarga el servidor afectando la disponibilidad del servicio clinico",
                p: 2, s: 3, nr: 6,
                medida: "Restriccion de CORS al dominio del fabricante. Implementacion de autenticacion JWT en despliegue en produccion. Monitoreo de solicitudes mediante health check y logs de servidor.",
                barrera: "Medida de proteccion (nivel 2): CORS configurado exclusivamente al dominio autorizado. En produccion clinica: autenticacion obligatoria antes de acceder al endpoint /api/predict.",
              },
            ].map((r) => (
              <div key={r.n} className={`rounded-xl border p-5 ${r.nr > 6 ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">{r.n}</span>
                    <h4 className="font-semibold text-gray-900">{r.actividad}</h4>
                  </div>
                  <div className="flex gap-2 text-center shrink-0">
                    <div className="rounded-lg bg-white border px-3 py-1">
                      <span className="block text-xs text-gray-400">P</span>
                      <span className="font-bold text-gray-800">{r.p}</span>
                    </div>
                    <div className="rounded-lg bg-white border px-3 py-1">
                      <span className="block text-xs text-gray-400">S</span>
                      <span className="font-bold text-gray-800">{r.s}</span>
                    </div>
                    <div className={`rounded-lg border px-3 py-1 ${r.nr > 6 ? "bg-red-600 border-red-600 text-white" : "bg-yellow-500 border-yellow-500 text-white"}`}>
                      <span className="block text-xs opacity-80">NR</span>
                      <span className="font-bold">{r.nr}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1"><strong>Causa:</strong> {r.causa}</p>
                <p className="text-sm text-gray-600 mb-3"><strong>Efecto:</strong> {r.efecto}</p>
                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Medida de mitigacion:</p>
                  <p className="text-xs text-gray-600">{r.medida}</p>
                  <p className="text-xs font-semibold text-gray-700 mt-2 mb-1">Barrera de seguridad:</p>
                  <p className="text-xs text-gray-600">{r.barrera}</p>
                </div>
              </div>
            ))}
          </div>
        </Subsection>

        {/* 3.6 Normativa */}
        <Subsection title="3.7 Normativa aplicable">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Nacional — Colombia</h4>
              <div className="space-y-2">
                {[
                  ["Decreto 4725/2005", "Base regulatoria principal — registro sanitario de dispositivos medicos"],
                  ["Decreto 582/2017", "Modifica Decreto 4725/2005"],
                  ["Resolucion 4816/2008", "Programa Nacional de Tecnovigilancia — reporte de eventos adversos"],
                  ["Ley 1581/2012", "Proteccion de Datos Personales — tratamiento de imagenes medicas"],
                  ["Ley 1672/2013", "RAEE — disposicion del hardware de soporte"],
                ].map(([norma, desc]) => (
                  <div key={norma} className="flex gap-3 text-sm">
                    <span className="font-medium text-purple-700 whitespace-nowrap shrink-0">{norma}</span>
                    <span className="text-gray-600">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Internacional</h4>
              <div className="space-y-2">
                {[
                  ["ISO 14971:2019", "Gestion de riesgos para dispositivos medicos"],
                  ["IEC 62304:2006/A1", "Ciclo de vida del software medico"],
                  ["IEC 62366-1:2015", "Ingenieria de usabilidad"],
                  ["ISO 13485:2016", "Sistema de Gestion de Calidad (requerido para registro INVIMA Clase IIa)"],
                  ["IMDRF N41/2017", "Marco de evaluacion clinica de SaMD"],
                ].map(([norma, desc]) => (
                  <div key={norma} className="flex gap-3 text-sm">
                    <span className="font-medium text-purple-700 whitespace-nowrap shrink-0">{norma}</span>
                    <span className="text-gray-600">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Subsection>
      </Section>

      {/* 4. Modelo Canvas */}
      <Section id="canvas" title="4. Modelo de Negocio — Canvas" color="green">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {/* Fila 1 */}
          <CanvasCell title="Socios Clave" color="green">
            INVIMA · AWS/GCP/Azure · Instituciones academicas (UdeA, UNAL) ·
            Distribuidores de equipos de histopatologia · iNNpulsa / MinCiencias / Ruta N
          </CanvasCell>
          <div className="grid gap-3">
            <CanvasCell title="Actividades Clave" color="green">
              Desarrollo y mantenimiento del modelo IA · Cumplimiento regulatorio INVIMA ·
              Soporte tecnico y onboarding · Reentrenamiento periodico del modelo
            </CanvasCell>
            <CanvasCell title="Recursos Clave" color="green">
              Modelo EfficientNet-B3 entrenado (PCam 327K imagenes) ·
              Registro sanitario INVIMA Clase IIa · Infraestructura cloud con GPU ·
              Equipo de I+D
            </CanvasCell>
          </div>
          <CanvasCell title="Propuesta de Valor" color="blue" highlight>
            <strong>Segunda opinion oncologica en menos de 10 segundos.</strong><br />
            IA explicable (Grad-CAM) que analiza imagenes histopatologicas de ganglios linfaticos
            con <strong>93,8% de sensibilidad y AUC-ROC 0,942</strong>, devolviendo no solo una prediccion
            sino el <strong>razonamiento visual</strong> que la sustenta. Reduce la carga del patologo,
            disminuye variabilidad interobservador y acerca el diagnostico especializado a regiones
            con deficit de personal.
          </CanvasCell>
          <div className="grid gap-3">
            <CanvasCell title="Relacion con Clientes" color="green">
              Onboarding obligatorio · Soporte tecnico continuo ·
              Reportes periodicos de metricas del modelo · Comite de usuarios
            </CanvasCell>
            <CanvasCell title="Canales" color="green">
              Plataforma web SaaS · Venta directa B2B a IPS ·
              Alianzas con distribuidores biomédicos · Ferias y congresos medicos
            </CanvasCell>
          </div>
          <CanvasCell title="Segmentos de Clientes" color="green">
            <strong>Primario:</strong> IPS nivel II/III con servicios de patologia · Laboratorios de referencia<br />
            <strong>Secundario:</strong> Patologos independientes · Grupos de oncologia<br />
            <strong>Terciario:</strong> Universidades / grupos de investigacion<br />
            <strong>Cuaternario:</strong> EPS / entidades territoriales de salud
          </CanvasCell>
        </div>
        {/* Fila costos / ingresos */}
        <div className="grid gap-3 sm:grid-cols-2 mt-3">
          <CanvasCell title="Estructura de Costos" color="gray">
            <strong>Inversion inicial (CAPEX):</strong> ~$180M COP (Registro INVIMA + ISO 13485 + setup)<br />
            <strong>Costos operativos anuales (OPEX):</strong> ~$520M COP<br />
            Incluye: infraestructura cloud GPU, equipo de I+D, soporte, regulatorio continuo
          </CanvasCell>
          <CanvasCell title="Fuentes de Ingresos" color="gray">
            <strong>Licencia mensual fija:</strong> Basico $800K–$1.2M COP · Estandar $2M–$3.5M COP · Corporativo negociado<br />
            <strong>Variable por analisis:</strong> $3,000–$6,000 COP por imagen procesada (excedente del cupo incluido)
          </CanvasCell>
        </div>

        {/* Desglose detallado de la propuesta de valor */}
        <div className="mt-6 rounded-2xl border border-blue-200 bg-white overflow-hidden">
          <div className="bg-blue-50 px-5 py-3 border-b border-blue-200">
            <h3 className="font-semibold text-gray-800">Desglose de la propuesta de valor</h3>
            <p className="text-xs text-gray-500 mt-1">Que entrega AyudaDiagnostica, por que importa y como se mide</p>
          </div>

          {/* Pilares de valor */}
          <div className="px-5 py-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Cuatro pilares de valor</h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: "⚡",
                  title: "Velocidad",
                  desc: "Resultado en < 10 segundos vs. minutos/horas de lectura manual",
                  metric: "10s",
                },
                {
                  icon: "🎯",
                  title: "Precision clinica",
                  desc: "Sensibilidad 93,8% para detectar metastasis en parches H&E",
                  metric: "AUC 0,942",
                },
                {
                  icon: "👁",
                  title: "IA explicable",
                  desc: "Grad-CAM, Grad-CAM++ y bounding box muestran el porque",
                  metric: "3 vistas",
                },
                {
                  icon: "🏥",
                  title: "Acceso equitativo",
                  desc: "Lleva segunda lectura especializada a IPS sin patologos oncologicos",
                  metric: "SaaS",
                },
              ].map((p) => (
                <div key={p.title} className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">{p.metric}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm mb-1">{p.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Para cada segmento de cliente */}
          <div className="px-5 py-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Valor especifico por segmento</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 font-semibold text-gray-700 border border-gray-200">Segmento</th>
                    <th className="text-left p-2 font-semibold text-gray-700 border border-gray-200">Dolor que resuelve</th>
                    <th className="text-left p-2 font-semibold text-gray-700 border border-gray-200">Ganancia entregada</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {[
                    {
                      seg: "Patologos en IPS de referencia",
                      pain: "Sobrecarga: cientos de laminillas/dia, fatiga cognitiva al final del turno",
                      gain: "Priorizacion automatica de casos sospechosos; reduccion del 30–50% en tiempo de revision por parche",
                    },
                    {
                      seg: "IPS nivel II/III sin patologo oncologico",
                      pain: "Dependencia de envio de muestras a centros de referencia (retrasos de dias)",
                      gain: "Resultado preliminar inmediato; reduccion de tiempos de remision; mejor triage",
                    },
                    {
                      seg: "Pacientes oncologicos",
                      pain: "Diagnostico tardio (44,8% ingresa en estadio IIIB-IV); inequidad por region/regimen",
                      gain: "Acceso a diagnostico de calidad equivalente sin importar ubicacion geografica",
                    },
                    {
                      seg: "EPS / pagadores",
                      pain: "Costos elevados por diagnosticos tardios (tratamientos avanzados son mas costosos)",
                      gain: "Deteccion temprana reduce costos terapeuticos; trazabilidad y reportes auditables",
                    },
                    {
                      seg: "Universidades / investigacion",
                      pain: "Acceso limitado a herramientas de patologia computacional para enseñanza",
                      gain: "Licencia academica para entrenamiento de residentes y proyectos de investigacion",
                    },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-2 border border-gray-200 font-medium">{row.seg}</td>
                      <td className="p-2 border border-gray-200 text-gray-600 text-xs">{row.pain}</td>
                      <td className="p-2 border border-gray-200 text-gray-600 text-xs">{row.gain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Diferenciadores */}
          <div className="px-5 py-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Diferenciadores frente a alternativas</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 font-semibold text-gray-700 border border-gray-200">Criterio</th>
                    <th className="text-center p-2 font-semibold text-gray-700 border border-gray-200">Lectura manual tradicional</th>
                    <th className="text-center p-2 font-semibold text-gray-700 border border-gray-200">Soluciones internacionales</th>
                    <th className="text-center p-2 font-semibold text-blue-700 border border-blue-200 bg-blue-50">AyudaDiagnostica</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {[
                    ["Tiempo de analisis por parche", "Minutos – horas", "Segundos", "< 10 segundos"],
                    ["Explicabilidad visual (XAI)", "N/A (criterio humano)", "Limitada / cerrada", "Grad-CAM + Grad-CAM++ + bbox"],
                    ["Registro INVIMA Clase IIa", "No aplica", "Requiere homologacion", "En tramite (compliance local)"],
                    ["Soporte en español", "—", "Limitado", "Nativo + capacitacion"],
                    ["Costo de adopcion", "Sin costo directo (alto costo humano)", "Alto (USD)", "Adaptado al mercado colombiano (COP)"],
                    ["Integracion con HIS/RIS locales", "—", "Compleja", "HL7 / FHIR planificado"],
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-2 border border-gray-200 font-medium">{row[0]}</td>
                      <td className="p-2 border border-gray-200 text-center text-xs text-gray-600">{row[1]}</td>
                      <td className="p-2 border border-gray-200 text-center text-xs text-gray-600">{row[2]}</td>
                      <td className="p-2 border-2 border-blue-200 bg-blue-50 text-center text-xs font-medium text-blue-900">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Impacto cuantificable */}
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Impacto cuantificable esperado</h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { metric: "30–50%", label: "reduccion en tiempo de revision por parche histopatologico" },
                { metric: "↓ Variabilidad", label: "interobservador en clasificacion de casos limitrofes" },
                { metric: "+ Equidad", label: "acceso a segunda opinion en IPS sin patologo oncologico" },
                { metric: "Trazable", label: "reporte auditable con metricas del modelo en cada analisis" },
              ].map((item) => (
                <div key={item.metric} className="rounded-lg bg-white border border-gray-200 p-3 text-center">
                  <span className="block text-lg font-bold text-blue-700">{item.metric}</span>
                  <span className="block text-xs text-gray-600 mt-1 leading-relaxed">{item.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-600 italic leading-relaxed">
              Estas estimaciones se validaran formalmente en el estudio clinico piloto (IMDRF N41 / ISO 14155:2020)
              previo al registro INVIMA. Los porcentajes de reduccion de tiempo se basan en literatura comparable
              de patologia computacional aplicada al benchmark PatchCamelyon (PCam).
            </p>
          </div>
        </div>

        {/* Desglose detallado de estructura de costos */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Desglose detallado de la estructura de costos</h3>
            <p className="text-xs text-gray-500 mt-1">Cifras estimadas en pesos colombianos (COP) para operacion de primer año</p>
          </div>

          {/* Costos iniciales (CAPEX) */}
          <div className="px-5 py-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Inversion inicial — CAPEX (one-time)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-2 font-semibold text-gray-700">Componente</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Descripcion</th>
                    <th className="text-right p-2 font-semibold text-gray-700 whitespace-nowrap">Costo estimado (COP)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {[
                    ["Registro sanitario INVIMA Clase IIa", "Tasas INVIMA + preparacion expediente tecnico + asesoria regulatoria especializada", "$35.000.000 – $60.000.000"],
                    ["Implementacion ISO 13485:2016", "Documentacion del SGC, procedimientos, capacitacion y auditoria de certificacion inicial", "$40.000.000 – $80.000.000"],
                    ["Validacion clinica piloto", "Estudio comparativo vs. patologo certificado (IMDRF N41 / ISO 14155)", "$25.000.000 – $50.000.000"],
                    ["Setup de infraestructura cloud", "Configuracion inicial AWS/GCP/Azure, VPC, certificados SSL, CDN", "$8.000.000 – $15.000.000"],
                    ["Desarrollo de modulos adicionales", "Autenticacion JWT, HL7/FHIR para integracion HIS, panel administrativo", "$30.000.000 – $50.000.000"],
                  ].map(([comp, desc, costo], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-2 border-b border-gray-100 font-medium">{comp}</td>
                      <td className="p-2 border-b border-gray-100 text-gray-600 text-xs">{desc}</td>
                      <td className="p-2 border-b border-gray-100 text-right font-mono text-gray-800 whitespace-nowrap">{costo}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-semibold">
                    <td className="p-2 border-t-2 border-blue-200" colSpan={2}>Total CAPEX</td>
                    <td className="p-2 border-t-2 border-blue-200 text-right font-mono text-blue-700">$138M – $255M COP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Costos operativos (OPEX) */}
          <div className="px-5 py-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Costos operativos anuales — OPEX</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-2 font-semibold text-gray-700">Componente</th>
                    <th className="text-left p-2 font-semibold text-gray-700">Detalle</th>
                    <th className="text-right p-2 font-semibold text-gray-700 whitespace-nowrap">Costo anual (COP)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {[
                    ["Infraestructura cloud con GPU", "Instancias GPU (NVIDIA T4/A10), almacenamiento, ancho de banda, backup", "$35.000.000 – $70.000.000"],
                    ["Equipo de I+D (1 ML engineer)", "Desarrollo, mantenimiento del modelo, reentrenamiento periodico", "$90.000.000 – $130.000.000"],
                    ["Equipo de desarrollo software", "1 desarrollador full-stack medio tiempo (frontend + backend)", "$60.000.000 – $90.000.000"],
                    ["Soporte tecnico y onboarding", "1 persona de soporte, mesa de ayuda, capacitacion de clientes", "$50.000.000 – $80.000.000"],
                    ["Cumplimiento regulatorio continuo", "Tecnovigilancia INVIMA, reportes, mantenimiento ISO 13485, auditorias", "$40.000.000 – $60.000.000"],
                    ["Reentrenamiento del modelo", "Compute para reentrenamiento periodico (cada 6-12 meses)", "$5.000.000 – $12.000.000"],
                    ["Licencias y herramientas SaaS", "GitHub, Sentry, Datadog, herramientas de monitoreo y CI/CD", "$8.000.000 – $15.000.000"],
                    ["Seguros y responsabilidad civil", "Poliza de responsabilidad civil profesional para dispositivos medicos", "$12.000.000 – $25.000.000"],
                    ["Marketing y desarrollo comercial", "Ferias, congresos medicos, material de venta, gestion comercial", "$25.000.000 – $50.000.000"],
                  ].map(([comp, desc, costo], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-2 border-b border-gray-100 font-medium">{comp}</td>
                      <td className="p-2 border-b border-gray-100 text-gray-600 text-xs">{desc}</td>
                      <td className="p-2 border-b border-gray-100 text-right font-mono text-gray-800 whitespace-nowrap">{costo}</td>
                    </tr>
                  ))}
                  <tr className="bg-green-50 font-semibold">
                    <td className="p-2 border-t-2 border-green-200" colSpan={2}>Total OPEX anual</td>
                    <td className="p-2 border-t-2 border-green-200 text-right font-mono text-green-700">$325M – $532M COP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Análisis de punto de equilibrio */}
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Punto de equilibrio estimado</h4>
            <div className="grid gap-3 sm:grid-cols-3 mb-3">
              <div className="rounded-lg bg-white border border-gray-200 p-3 text-center">
                <span className="block text-xs text-gray-500 uppercase">Break-even mensual</span>
                <span className="block text-xl font-bold text-gray-800 mt-1">~$40M COP</span>
                <span className="block text-xs text-gray-500 mt-1">Ingresos para cubrir OPEX</span>
              </div>
              <div className="rounded-lg bg-white border border-gray-200 p-3 text-center">
                <span className="block text-xs text-gray-500 uppercase">Clientes minimos</span>
                <span className="block text-xl font-bold text-gray-800 mt-1">12–15 IPS</span>
                <span className="block text-xs text-gray-500 mt-1">Plan Estandar para break-even</span>
              </div>
              <div className="rounded-lg bg-white border border-gray-200 p-3 text-center">
                <span className="block text-xs text-gray-500 uppercase">Tiempo a rentabilidad</span>
                <span className="block text-xl font-bold text-gray-800 mt-1">18–24 meses</span>
                <span className="block text-xs text-gray-500 mt-1">Recuperacion del CAPEX</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Ejemplo de proyeccion (año 2):</strong> 15 IPS Plan Estandar × $3M COP/mes = $45M COP/mes
              en licencias fijas + ~$10M COP/mes en analisis variables (excedente sobre cupo de 1.000 analisis)
              = ~$55M COP/mes en ingresos, contra ~$40M COP/mes en OPEX. <strong>Margen operativo estimado: ~27%.</strong>
            </p>
          </div>
        </div>
      </Section>

      {/* 5. Referencias */}
      <Section id="referencias" title="5. Referencias Bibliograficas" color="gray">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Normativa nacional — Colombia</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "OMS / IARC. Breast cancer fact sheet. Global Cancer Observatory (GLOBOCAN), 2022. globocan.iarc.fr",
                "Instituto Nacional de Cancerologia (INC) Colombia. Anuario Estadistico 2021, Volumen 19. ISSN: 1909-8995. Bogota D.C.: INC; 2022. Ministerio de Salud y Proteccion Social. Disponible en www.cancer.gov.co (datos demograficos y epidemiologicos del centro oncologico publico de referencia nacional).",
                "Bravo L.E. et al. Cancer en cifras para Colombia. Colombia Medica, 2018. Escasez estructural de patologos documentada por la Federacion Colombiana de Patologia (FECOLPAT).",
                "Decreto 4725 de 2005 — Regimen de registros sanitarios de dispositivos medicos — MinSalud",
                "Decreto 582 de 2017 — Modificacion del Decreto 4725 — INVIMA",
                "Decreto 441 de 2022 — Nuevos modelos de contratacion en salud",
                "Resolucion 3100 de 2019 — Habilitacion de servicios de salud y REPS — MinSalud",
                "Resolucion 2654 de 2019 — Telesalud y telemedicina — MinSalud",
                "Resolucion 740 de 2024 — Prescripcion de tecnologias excluidas del PBS — MinSalud",
                "Resolucion 4816 de 2008 — Tecnovigilancia — INVIMA/MinSalud",
                "Ley 1581 de 2012 — Proteccion de Datos Personales",
                "Ley 1672 de 2013 — Gestion de RAEE",
              ].map((ref) => (
                <li key={ref} className="flex gap-2">
                  <span className="text-gray-400 shrink-0">•</span>
                  <span>{ref}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Normativa y guias internacionales</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "ISO 13485:2016 — Sistema de Gestion de Calidad para dispositivos medicos",
                "ISO 14971:2019 — Gestion de riesgos para dispositivos medicos",
                "IEC 62304:2006/AMD1:2015 — Ciclo de vida del software medico",
                "IEC 62366-1:2015 — Ingenieria de usabilidad para dispositivos medicos",
                "ISO 10993-1:2018 — Evaluacion biologica de dispositivos medicos",
                "ISO/IEC 27001:2022 — Gestion de Seguridad de la Informacion",
                "IMDRF N41 FINAL:2017 — Evaluacion clinica de SaMD",
                "IMDRF/SaMD WG/N81 FINAL:2025 — Caracterizacion de software medico",
                "ISO 14155:2020 — Buenas practicas clinicas para investigacion clinica",
                "Declaracion de Helsinki (revision 2013) — Principios eticos en investigacion medica",
                "Software as a Medical Device (SaMD) — IMDRF Framework",
                "Advancements in Clinical Evaluation and Regulatory Frameworks for AI-Driven SaMD — PMC/NIH",
              ].map((ref) => (
                <li key={ref} className="flex gap-2">
                  <span className="text-gray-400 shrink-0">•</span>
                  <span>{ref}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({
  id,
  title,
  color,
  children,
}: {
  id: string;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    red: "border-red-300 bg-red-600",
    blue: "border-blue-300 bg-blue-600",
    purple: "border-purple-300 bg-purple-600",
    green: "border-green-300 bg-green-600",
    gray: "border-gray-300 bg-gray-600",
  };
  return (
    <section id={id} className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className={`h-6 w-1.5 rounded-full ${colors[color]}`} />
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">{title}</h3>
      {children}
    </div>
  );
}

function CanvasCell({
  title,
  color,
  highlight = false,
  children,
}: {
  title: string;
  color: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  const bg = highlight
    ? "bg-blue-600 text-white border-blue-600"
    : color === "gray"
    ? "bg-gray-50 border-gray-200"
    : `bg-${color}-50 border-${color}-200`;

  const titleColor = highlight ? "text-blue-100" : `text-${color}-700`;
  const textColor = highlight ? "text-white" : "text-gray-700";

  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${titleColor}`}>{title}</p>
      <p className={`text-sm leading-relaxed ${textColor}`}>{children}</p>
    </div>
  );
}
