import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://votoseguro-web.vercel.app";

export const metadata: Metadata = {
  title: "Guía para el Día de Elecciones — Voto Seguro 2026",
  description:
    "Todo lo que necesitas saber para votar el domingo 13 de abril de 2026. Qué llevar, cómo encontrar tu local, cómo marcar la cédula y qué evitar.",
  alternates: {
    canonical: `${APP_URL}/guia`,
  },
};

export default function GuiaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-4">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-700 text-xs font-bold uppercase tracking-wide">
            Domingo 13 de abril de 2026
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
          Guía para el día de elecciones
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto">
          Todo lo que necesitas saber para ejercer tu voto correctamente
          y que sea <strong className="text-gray-700">válido y contado</strong>.
        </p>
      </div>

      {/* Antes de ir */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">1</span>
          Antes de ir al local de votación
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: "🪪",
              titulo: "Lleva tu DNI vigente",
              desc: "Es obligatorio presentar tu Documento Nacional de Identidad. Sin DNI no puedes votar.",
              tipo: "obligatorio",
            },
            {
              icon: "📍",
              titulo: "Consulta tu local de votación",
              desc: "Ingresa a wapp.onpe.gob.pe o a la app ONPE Elecciones con tu DNI para saber dónde votar.",
              tipo: "obligatorio",
            },
            {
              icon: "🗳️",
              titulo: "Practica con el simulador",
              desc: "Usa este simulador para conocer los partidos y candidatos antes de llegar a la cabina.",
              tipo: "recomendado",
            },
            {
              icon: "⏰",
              titulo: "Llega temprano",
              desc: "Las mesas abren a las 8:00 AM y cierran a las 4:00 PM. Llegar temprano evita colas.",
              tipo: "recomendado",
            },
          ].map((item) => (
            <div
              key={item.titulo}
              className={`rounded-xl p-4 border-2 flex gap-3 ${
                item.tipo === "obligatorio"
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{item.titulo}</h3>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                      item.tipo === "obligatorio"
                        ? "bg-red-200 text-red-700"
                        : "bg-blue-200 text-blue-700"
                    }`}
                  >
                    {item.tipo}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* En el local */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">2</span>
          En el local de votación
        </h2>
        <div className="space-y-3">
          {[
            {
              paso: "A",
              titulo: "Identifica tu mesa",
              desc: "Al ingresar al local, busca el padrón o consulta con los orientadores. Tu número de mesa figura en la web de la ONPE.",
            },
            {
              paso: "B",
              titulo: "Presenta tu DNI al miembro de mesa",
              desc: "El miembro de mesa verificará tu identidad en el padrón y te entregará la cédula. Firma el acta.",
            },
            {
              paso: "C",
              titulo: "Ingresa a la cabina de votación",
              desc: "La cabina es individual y cerrada. Nadie puede ver cómo votas — el voto es secreto.",
            },
            {
              paso: "D",
              titulo: "Marca tu cédula con el lapicero oficial",
              desc: "Usa el lapicero que te dan en la mesa. No se aceptan bolígrafos propios en la marcación.",
            },
            {
              paso: "E",
              titulo: "Dobla la cédula y entrégala",
              desc: "Dobla la cédula para que no se vea, sal de la cabina y deposítala en la ánfora.",
            },
          ].map((item) => (
            <div key={item.paso} className="flex gap-3 items-start bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <span className="w-7 h-7 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                {item.paso}
              </span>
              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">{item.titulo}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo marcar la cédula */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">3</span>
          Cómo marcar tu cédula correctamente
        </h2>

        {/* Las 5 columnas resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-6">
          {[
            { num: "1", titulo: "Fórmula\nPresidencial", nota: "Sin preferencial", color: "bg-red-700" },
            { num: "2", titulo: "Senadores\nNacionales", nota: "Hasta 2 pref.", color: "bg-blue-700" },
            { num: "3", titulo: "Senadores\nRegionales", nota: "Hasta 1 pref.", color: "bg-green-700" },
            { num: "4", titulo: "Diputados", nota: "Hasta 2 pref.", color: "bg-purple-700" },
            { num: "5", titulo: "Parlamento\nAndino", nota: "Hasta 2 pref.", color: "bg-yellow-600" },
          ].map((col) => (
            <div key={col.num} className="bg-white border border-gray-200 rounded-lg overflow-hidden text-center shadow-sm">
              <div className={`${col.color} text-white py-1.5`}>
                <span className="text-[10px] font-black uppercase tracking-wide">Col. {col.num}</span>
              </div>
              <div className="p-2">
                <p className="text-[10px] font-bold text-gray-800 leading-tight whitespace-pre-line">{col.titulo}</p>
                <p className="text-[9px] text-gray-500 mt-1 bg-gray-50 rounded px-1 py-0.5">{col.nota}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <h3 className="font-black text-green-700 mb-3 flex items-center gap-1.5">
              <span className="text-lg">✅</span> Marca CORRECTA
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Dibuja una aspa (✗) o cruz (+) dentro del recuadro del partido",
                "La intersección de las líneas debe quedar DENTRO del cuadro",
                "Puedes marcar partidos distintos en cada columna (voto cruzado)",
                "El voto preferencial es opcional — no es obligatorio escribir un número",
                "Si no quieres votar en una columna, simplemente no la marques",
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 shrink-0 font-bold">✓</span>
                  <span className="text-xs leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <h3 className="font-black text-red-700 mb-3 flex items-center gap-1.5">
              <span className="text-lg">❌</span> Marca INCORRECTA (anula tu voto)
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Usar palomita (✓), círculo, tachón u otro símbolo distinto a aspa/cruz",
                "La intersección queda fuera del recuadro del partido",
                "Escribir más preferenciales de los permitidos por columna",
                "Anotar el mismo número preferencial dos veces",
                "Escribir palabras, frases o dibujos en la cédula",
                "Hacer tachaduras o manchones sobre una marca anterior",
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500 shrink-0 font-bold">✗</span>
                  <span className="text-xs leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dato clave */}
        <div className="mt-4 bg-amber-50 border border-amber-300 rounded-xl p-4 flex gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            <p className="text-sm font-bold text-amber-800 mb-1">
              Un nulo en una columna NO invalida las demás
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Si cometes un error en una columna, las otras columnas siguen siendo válidas.
              Tu voto presidencial se cuenta aunque la columna de diputados sea nula, y viceversa.
            </p>
          </div>
        </div>
      </section>

      {/* Voto preferencial detallado */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">4</span>
          El voto preferencial explicado
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            En las columnas 2, 3, 4 y 5, además de marcar el partido, puedes escribir
            el <strong>número de posición</strong> de un candidato específico dentro de esa lista.
            Esto se llama <strong>voto preferencial</strong> y es completamente opcional.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                titulo: "¿Qué hace?",
                desc: "Acumula votos para que un candidato suba posiciones dentro de la lista de su partido. No compite contra candidatos de otros partidos.",
                icon: "📊",
              },
              {
                titulo: "¿Cómo se marca?",
                desc: "Escribe el número de orden del candidato en el espacio designado en la cédula. Ese número aparece en la lista oficial del partido.",
                icon: "✍️",
              },
              {
                titulo: "¿Cuántos se pueden marcar?",
                desc: "Senadores Nacionales: hasta 2. Senadores Regionales: hasta 1. Diputados: hasta 2. Parlamento Andino: hasta 2.",
                icon: "🔢",
              },
            ].map((item) => (
              <div key={item.titulo} className="bg-gray-50 rounded-lg p-3">
                <div className="text-xl mb-1">{item.icon}</div>
                <h4 className="font-bold text-gray-800 text-xs mb-1">{item.titulo}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">5</span>
          Preguntas frecuentes
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "¿Es obligatorio votar?",
              a: "Sí. En el Perú el voto es obligatorio para ciudadanos entre 18 y 70 años. La abstención puede resultar en una multa. Los mayores de 70 años votan de manera facultativa.",
            },
            {
              q: "¿Qué pasa si no voy a votar?",
              a: "Se emite una multa (omisión electoral). Puede ser suspendida si demuestras que estabas fuera de tu circunscripción, hospitlizado u otras causas justificadas.",
            },
            {
              q: "¿Puedo votar en blanco en alguna columna?",
              a: "Sí. Si no quieres votar en una columna, simplemente no la marques. Eso se considera voto en blanco para esa columna y es válido. El voto blanco no se contabiliza para ningún partido.",
            },
            {
              q: "¿Qué pasa si me equivoco al marcar?",
              a: "Puedes solicitar una nueva cédula al miembro de mesa. Solo puedes hacerlo una vez. La cédula con error se inutiliza.",
            },
            {
              q: "¿El voto cruzado es permitido?",
              a: "Sí. Puedes votar por diferentes partidos en cada columna. Por ejemplo: partido A para presidente, partido B para senadores nacionales, partido C para diputados, etc.",
            },
            {
              q: "¿Cuándo se publican los resultados?",
              a: "La ONPE publica resultados parciales desde las primeras horas del conteo. Los resultados oficiales finales los certifica el JNE.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden group"
            >
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors list-none">
                <span className="text-sm font-bold text-gray-800">{item.q}</span>
                <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-3 pt-1 border-t border-gray-100">
                <p className="text-xs text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gradient-to-br from-red-700 to-red-900 text-white rounded-2xl p-6 text-center">
        <div className="text-3xl mb-3">🗳️</div>
        <h2 className="text-xl font-black mb-2">¿Listo para practicar?</h2>
        <p className="text-red-100 text-sm mb-5 max-w-md mx-auto">
          Usa el simulador con los candidatos reales del JNE y llega preparado
          el <strong className="text-yellow-300">13 de abril de 2026</strong>.
        </p>
        <Link
          href="/simulador"
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors text-sm shadow-lg"
        >
          🗳️ Ir al simulador de cédula
        </Link>
      </section>

    </div>
  );
}
