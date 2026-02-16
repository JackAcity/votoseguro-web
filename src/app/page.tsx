import Link from "next/link";
import { CountdownElecciones } from "@/components/CountdownElecciones";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-white overflow-hidden">
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 pt-12 pb-10">
          {/* Bandera + título oficial */}
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-9 rounded overflow-hidden shadow-lg border border-white/20">
                <div className="w-1/3 bg-red-500" />
                <div className="w-1/3 bg-white" />
                <div className="w-1/3 bg-red-500" />
              </div>
              <div className="text-left">
                <div className="text-xs text-red-300 uppercase tracking-widest font-semibold">República del Perú</div>
                <div className="text-sm font-black text-white leading-tight">ONPE · JNE · 2026</div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 leading-tight">
            Aprende a votar
            <br />
            <span className="text-yellow-300">correctamente</span>
          </h1>

          <p className="text-base sm:text-lg text-red-100 mb-6 max-w-xl mx-auto leading-relaxed">
            Simula tu cédula de sufragio con los <strong className="text-white">candidatos reales</strong> del JNE.
            Practica las 5 columnas y llega preparado el día de las elecciones.
          </p>

          {/* Countdown */}
          <div className="mb-6">
            <p className="text-xs text-red-300 uppercase tracking-widest font-semibold mb-2">
              Faltan para las elecciones
            </p>
            <CountdownElecciones />
            <p className="text-xs text-red-300 mt-2 font-medium">
              Domingo 13 de abril de 2026 · 8:00 AM – 4:00 PM
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/simulador"
              className="btn-secondary text-base sm:text-lg px-8 sm:px-10 py-4 inline-flex items-center justify-center gap-2 shadow-xl"
            >
              <span className="text-xl">🗳️</span>
              Simular mi voto ahora
            </Link>
            <a
              href="#como-funciona"
              className="border-2 border-white/60 text-white hover:bg-white hover:text-red-800 font-bold py-4 px-8 rounded-lg text-base transition-colors inline-block"
            >
              ¿Cómo funciona?
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-sm mx-auto">
            <div className="text-center bg-white/10 rounded-xl py-3">
              <div className="text-2xl font-black text-yellow-300">5</div>
              <div className="text-[10px] text-red-200 mt-0.5 leading-tight">columnas<br/>en la cédula</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl py-3">
              <div className="text-2xl font-black text-yellow-300">9,061</div>
              <div className="text-[10px] text-red-200 mt-0.5 leading-tight">candidatos<br/>reales JNE</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl py-3">
              <div className="text-2xl font-black text-yellow-300">100%</div>
              <div className="text-[10px] text-red-200 mt-0.5 leading-tight">gratuito<br/>y educativo</div>
            </div>
          </div>
        </div>

        {/* Franja decorativa inferior */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400" />
      </section>

      {/* Aviso urgente — votos nulos */}
      <section className="bg-amber-50 border-b border-amber-200 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-center">
          <span className="text-amber-600 text-lg shrink-0">⚠️</span>
          <p className="text-xs sm:text-sm text-amber-800 font-medium">
            En las últimas elecciones, <strong>más del 18% de votos fueron nulos o en blanco</strong>.
            Practica ahora y evita anular tu voto.
          </p>
        </div>
      </section>

      {/* Las 5 columnas */}
      <section id="como-funciona" className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Guía electoral 2026
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Las 5 columnas de tu cédula
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              En las Elecciones Generales 2026 votarás por hasta 5 cargos distintos en una sola cédula.
              Puedes elegir partidos diferentes en cada columna (<strong>voto cruzado</strong>).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                num: "1",
                titulo: "Fórmula Presidencial",
                desc: "Presidente + 2 Vicepresidentes. Marca con aspa dentro del recuadro del partido.",
                prefs: "Sin preferencial",
                color: "bg-red-50 border-red-200 hover:border-red-400",
                numColor: "bg-red-700",
                icon: "🏛️",
              },
              {
                num: "2",
                titulo: "Senadores Nacionales",
                desc: "Elegidos a nivel nacional. Puedes marcar hasta 2 candidatos preferidos.",
                prefs: "Hasta 2 preferenciales",
                color: "bg-blue-50 border-blue-200 hover:border-blue-400",
                numColor: "bg-blue-700",
                icon: "🗳️",
              },
              {
                num: "3",
                titulo: "Senadores Regionales",
                desc: "Representan tu departamento en el Senado. Solo 1 preferencial.",
                prefs: "Hasta 1 preferencial",
                color: "bg-green-50 border-green-200 hover:border-green-400",
                numColor: "bg-green-700",
                icon: "📍",
              },
              {
                num: "4",
                titulo: "Diputados",
                desc: "Cámara de Diputados de tu región. El preferencial define el orden dentro de la lista.",
                prefs: "Hasta 2 preferenciales",
                color: "bg-purple-50 border-purple-200 hover:border-purple-400",
                numColor: "bg-purple-700",
                icon: "🏛️",
              },
              {
                num: "5",
                titulo: "Parlamento Andino",
                desc: "Representación del Perú ante la Comunidad Andina de Naciones.",
                prefs: "Hasta 2 preferenciales",
                color: "bg-yellow-50 border-yellow-200 hover:border-yellow-400",
                numColor: "bg-yellow-600",
                icon: "🌎",
              },
            ].map((col) => (
              <div
                key={col.num}
                className={`border-2 rounded-xl p-4 transition-colors ${col.color}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-7 h-7 ${col.numColor} text-white rounded-full flex items-center justify-center font-black text-xs shrink-0`}
                  >
                    {col.num}
                  </div>
                  <span className="text-lg">{col.icon}</span>
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

      {/* Voto preferencial */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Voto preferencial
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              ¿Cómo funciona el voto preferencial?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Además de elegir tu partido, puedes impulsar a un candidato específico dentro de esa lista.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "✅",
                titulo: "Es opcional",
                desc: "No estás obligado a marcar un preferencial. Puedes votar solo por el partido y tu voto sigue siendo válido.",
                color: "border-green-200",
              },
              {
                icon: "🔢",
                titulo: "Escribe el número",
                desc: "Anota el número de posición del candidato preferido. El número debe estar dentro del espacio designado en la cédula.",
                color: "border-blue-200",
              },
              {
                icon: "📊",
                titulo: "Reordena la lista",
                desc: "Los preferenciales reordenan a los candidatos dentro de su partido. No compiten con candidatos de otros partidos.",
                color: "border-purple-200",
              },
            ].map((item) => (
              <div key={item.titulo} className={`bg-white rounded-xl p-6 shadow-sm border-2 ${item.color}`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.titulo}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Votos nulos */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Evita el voto nulo
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              ¿Cuándo se anula tu voto?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              En las últimas elecciones, más del 18% de votos fueron nulos o blancos. Aprende a evitarlo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2 text-base">
                <span className="text-xl">❌</span> Tu voto es NULO si:
              </h3>
              <ul className="space-y-2">
                {[
                  "Usas palomita ✓, círculo u otro símbolo diferente a aspa o cruz",
                  "La intersección del aspa cae fuera del recuadro del partido",
                  "Marcas más preferenciales de los permitidos",
                  "Repites el mismo número preferencial",
                  "Escribes frases, dibujos o realizas tachaduras",
                  "Marcas preferenciales de dos partidos distintos en una columna",
                ].map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-red-500 shrink-0 mt-0.5 font-bold">✗</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2 text-base">
                <span className="text-xl">✅</span> Tu voto es VÁLIDO si:
              </h3>
              <ul className="space-y-2">
                {[
                  "Marcas con aspa (✗) o cruz (+) dentro del recuadro",
                  "La intersección de las líneas está dentro del recuadro",
                  "El voto cruzado está permitido (partidos distintos por columna)",
                  "Un nulo en una columna NO invalida las demás",
                  "Votar en blanco es válido (pero no se cuenta para nadie)",
                  "Puedes no votar en una columna sin anular las demás",
                ].map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 shrink-0 mt-0.5 font-bold">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative bg-gradient-to-br from-red-700 to-red-900 text-white py-14 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-2xl mx-auto">
          <div className="text-4xl mb-4">🗳️</div>
          <h2 className="text-3xl font-black mb-4">
            ¿Listo para practicar tu voto?
          </h2>
          <p className="text-red-100 mb-8 text-base sm:text-lg">
            Usa nuestro simulador con los candidatos reales del JNE y llega preparado
            el <strong className="text-yellow-300">13 de abril de 2026</strong>.
          </p>
          <Link
            href="/simulador"
            className="btn-secondary text-base sm:text-lg px-8 sm:px-10 py-4 inline-flex items-center gap-2 shadow-xl"
          >
            <span className="text-xl">🗳️</span>
            Ir al simulador de cédula
          </Link>
          <p className="text-red-300 text-xs mt-4">
            Gratuito · Sin registro · Datos reales JNE 2026
          </p>
        </div>
      </section>
    </div>
  );
}
