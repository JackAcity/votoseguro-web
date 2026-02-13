import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Bandera decorativa */}
          <div className="flex justify-center mb-6">
            <div className="flex h-10 w-16 rounded overflow-hidden shadow-lg">
              <div className="w-1/3 bg-red-500" />
              <div className="w-1/3 bg-white" />
              <div className="w-1/3 bg-red-500" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Aprende a votar correctamente
            <br />
            <span className="text-yellow-300">Elecciones Generales 2026</span>
          </h1>

          <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Simula tu cédula de sufragio con las 5 columnas oficiales.
            Entiende el voto preferencial, evita votos nulos y ejerce tu
            derecho con confianza el{" "}
            <strong className="text-yellow-300">13 de abril de 2026</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/simulador"
              className="btn-secondary text-lg px-10 py-4 inline-block"
            >
              🗳️ Simular mi voto ahora
            </Link>
            <a
              href="#como-funciona"
              className="border-2 border-white text-white hover:bg-white hover:text-red-800 font-bold py-4 px-8 rounded-lg text-lg transition-colors inline-block"
            >
              ¿Cómo funciona?
            </a>
          </div>

          {/* Stats rápidos */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-12 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-300">5</div>
              <div className="text-xs text-red-200 mt-1">columnas en la cédula</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-300">+20M</div>
              <div className="text-xs text-red-200 mt-1">electores en Perú</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-yellow-300">100%</div>
              <div className="text-xs text-red-200 mt-1">gratuito y educativo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona la cédula */}
      <section id="como-funciona" className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Las 5 columnas de tu cédula
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En las Elecciones Generales 2026, votarás por hasta 5 cargos
              diferentes en una sola cédula. Puedes elegir partidos distintos
              en cada columna (voto cruzado).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                num: "1",
                titulo: "Fórmula Presidencial",
                desc: "Presidente + 2 Vicepresidentes. Una sola marca de aspa en la fórmula completa.",
                prefs: "Sin preferencial",
                color: "bg-red-50 border-red-200",
                numColor: "bg-red-700",
              },
              {
                num: "2",
                titulo: "Senadores Nacionales",
                desc: "Elegidos en circunscripción nacional. Puedes marcar hasta 2 candidatos preferidos.",
                prefs: "Hasta 2 preferenciales",
                color: "bg-blue-50 border-blue-200",
                numColor: "bg-blue-700",
              },
              {
                num: "3",
                titulo: "Senadores Regionales",
                desc: "Representan tu departamento en el Senado. Solo 1 preferencial permitido.",
                prefs: "Hasta 1 preferencial",
                color: "bg-green-50 border-green-200",
                numColor: "bg-green-700",
              },
              {
                num: "4",
                titulo: "Diputados",
                desc: "Cámara de Diputados. El voto preferencial determina el orden dentro de la lista.",
                prefs: "Hasta 2 preferenciales",
                color: "bg-purple-50 border-purple-200",
                numColor: "bg-purple-700",
              },
              {
                num: "5",
                titulo: "Parlamento Andino",
                desc: "Representación del Perú ante la Comunidad Andina de Naciones.",
                prefs: "Hasta 2 preferenciales",
                color: "bg-yellow-50 border-yellow-200",
                numColor: "bg-yellow-600",
              },
            ].map((col) => (
              <div
                key={col.num}
                className={`border-2 rounded-xl p-4 ${col.color}`}
              >
                <div
                  className={`w-8 h-8 ${col.numColor} text-white rounded-full flex items-center justify-center font-black text-sm mb-3`}
                >
                  {col.num}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">
                  {col.titulo}
                </h3>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {col.desc}
                </p>
                <span className="inline-block text-[10px] bg-white border border-gray-300 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {col.prefs}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voto preferencial explicado */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              ¿Cómo funciona el voto preferencial?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-bold text-gray-900 mb-2">Es opcional</h3>
              <p className="text-sm text-gray-600">
                No estás obligado a marcar un preferencial. Puedes marcar solo
                el partido y tu voto sigue siendo válido.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">🔢</div>
              <h3 className="font-bold text-gray-900 mb-2">Escribe el número</h3>
              <p className="text-sm text-gray-600">
                Escribe el número de posición del candidato que prefieres dentro
                de la lista de tu partido elegido.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Reordena la lista</h3>
              <p className="text-sm text-gray-600">
                Los preferenciales reordenan a los candidatos dentro de su
                partido. No compiten con candidatos de otros partidos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Votos nulos */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              ¿Cuándo se anula tu voto?
            </h2>
            <p className="text-gray-600">
              En las últimas elecciones, más del 18% de votos fueron nulos o blancos.
              Aprende a evitarlo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                <span className="text-xl">❌</span> Tu voto es NULO si:
              </h3>
              <ul className="space-y-2">
                {[
                  "Usas palomita ✓, círculo u otro símbolo diferente a aspa o cruz",
                  "La intersección del aspa cae FUERA del recuadro del partido",
                  "Marcas más preferenciales de los permitidos",
                  "Repites el mismo número preferencial",
                  "Escribes frases, dibujos o realizas tachaduras",
                  "Marcas preferenciales de dos partidos distintos en una columna",
                ].map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-red-500 shrink-0 mt-0.5">✗</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                <span className="text-xl">✅</span> Tu voto es VÁLIDO si:
              </h3>
              <ul className="space-y-2">
                {[
                  "Marcas con aspa (✗) o cruz (+) dentro del recuadro",
                  "La intersección de las líneas está dentro del recuadro",
                  "El voto cruzado está permitido (partidos distintos por columna)",
                  "Un nulo en una columna NO invalida las demás",
                  "Votar en blanco es válido (pero no se cuenta)",
                ].map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-red-700 text-white py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">
            ¿Listo para practicar tu voto?
          </h2>
          <p className="text-red-100 mb-8 text-lg">
            Usa nuestro simulador gratuito y llega preparado el 13 de abril de 2026.
          </p>
          <Link
            href="/simulador"
            className="btn-secondary text-lg px-10 py-4 inline-block"
          >
            🗳️ Ir al simulador de cédula →
          </Link>
        </div>
      </section>
    </div>
  );
}
