import type { Metadata } from "next";
import { CedulaSimulador } from "@/components/cedula/CedulaSimulador";

export const metadata: Metadata = {
  title: "Simulador de Cédula — Voto Seguro 2026",
  description:
    "Practica tu voto para las Elecciones Generales 2026. Simula la cédula con 5 columnas: Presidencial, Senadores Nacionales, Senadores Regionales, Diputados y Parlamento Andino.",
};

export default function SimuladorPage() {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6">
      {/* Header de página */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
          🗳️ Simulador de Cédula de Sufragio
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          Practica tu voto para las{" "}
          <strong>Elecciones Generales del Perú — 13 de abril de 2026</strong>.
          Selecciona un partido en cada columna y opcionalmente marca tus
          candidatos preferidos. Al finalizar, verifica si tu voto es válido.
        </p>
      </div>

      {/* Instrucciones rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 max-w-3xl mx-auto">
        {[
          { paso: "1", texto: "Selecciona un partido en cada columna" },
          { paso: "2", texto: "Opcionalmente escoge candidatos preferidos" },
          { paso: "3", texto: "Puedes votar distinto en cada columna" },
          { paso: "4", texto: 'Presiona "Verificar mi voto"' },
        ].map((item) => (
          <div
            key={item.paso}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center"
          >
            <div className="w-6 h-6 bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-black mx-auto mb-1.5">
              {item.paso}
            </div>
            <p className="text-xs text-gray-700 leading-tight">{item.texto}</p>
          </div>
        ))}
      </div>

      {/* Simulador principal */}
      <CedulaSimulador />

      {/* Info sobre valla electoral */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-3xl mx-auto">
        <h3 className="font-bold text-blue-800 mb-2 text-sm">
          📊 ¿Qué es la valla electoral?
        </h3>
        <p className="text-xs text-blue-700 leading-relaxed">
          Un partido debe obtener <strong>al menos el 5%</strong> de votos
          válidos a nivel nacional para ingresar al Congreso. Las alianzas
          necesitan un 1% adicional por cada partido integrante. Además, deben
          elegir <strong>mínimo 7 diputados</strong> o{" "}
          <strong>3 senadores</strong>. Si no superan la valla, pierden su
          inscripción como partido.
        </p>
      </div>
    </div>
  );
}
