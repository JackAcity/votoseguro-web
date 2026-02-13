"use client";

// ============================================================
// useCedula — Hook de estado para el simulador de cédula
// ============================================================

import { useState, useCallback } from "react";
import type { VotoCedula, SeleccionColumna, ResultadoCedula } from "@/lib/types";
import { validarCedula } from "@/lib/cedula-logic";

interface UseCedulaReturn {
  voto: VotoCedula;
  resultado: ResultadoCedula | null;
  seleccionarFormula: (idLista: number) => void;
  seleccionarLista: (
    columna: keyof Omit<VotoCedula, "formulaPresidencial">,
    idLista: number
  ) => void;
  togglePreferencial: (
    columna: keyof Omit<VotoCedula, "formulaPresidencial">,
    numeroCandidato: number,
    maxPrefs: number
  ) => void;
  resetear: () => void;
  validar: () => ResultadoCedula;
  tiempoInicio: number;
  cambiosRealizados: number;
}

const VOTO_INICIAL: VotoCedula = {};

export function useCedula(): UseCedulaReturn {
  const [voto, setVoto] = useState<VotoCedula>(VOTO_INICIAL);
  const [resultado, setResultado] = useState<ResultadoCedula | null>(null);
  const [tiempoInicio] = useState<number>(Date.now());
  const [cambiosRealizados, setCambiosRealizados] = useState<number>(0);

  const registrarCambio = useCallback(() => {
    setCambiosRealizados((prev) => prev + 1);
  }, []);

  const seleccionarFormula = useCallback(
    (idLista: number) => {
      setVoto((prev) => {
        // Deseleccionar si ya estaba seleccionado
        if (prev.formulaPresidencial === idLista) {
          const { formulaPresidencial: _, ...rest } = prev;
          void _;
          return rest;
        }
        return { ...prev, formulaPresidencial: idLista };
      });
      registrarCambio();
      setResultado(null);
    },
    [registrarCambio]
  );

  const seleccionarLista = useCallback(
    (
      columna: keyof Omit<VotoCedula, "formulaPresidencial">,
      idLista: number
    ) => {
      setVoto((prev) => {
        const selActual = prev[columna];
        // Deseleccionar si ya estaba seleccionado el mismo partido
        if (selActual?.idLista === idLista) {
          const next = { ...prev };
          delete next[columna];
          return next;
        }
        // Cambiar de lista: resetear preferenciales
        return {
          ...prev,
          [columna]: { idLista, preferencias: [] } as SeleccionColumna,
        };
      });
      registrarCambio();
      setResultado(null);
    },
    [registrarCambio]
  );

  const togglePreferencial = useCallback(
    (
      columna: keyof Omit<VotoCedula, "formulaPresidencial">,
      numeroCandidato: number,
      maxPrefs: number
    ) => {
      setVoto((prev) => {
        const sel = prev[columna];
        if (!sel) return prev; // No hay lista seleccionada, ignorar

        const prefs = sel.preferencias;
        const yaSeleccionado = prefs.includes(numeroCandidato);

        if (yaSeleccionado) {
          // Deseleccionar
          return {
            ...prev,
            [columna]: {
              ...sel,
              preferencias: prefs.filter((p) => p !== numeroCandidato),
            },
          };
        }

        // No agregar si ya llegó al máximo
        if (prefs.length >= maxPrefs) return prev;

        return {
          ...prev,
          [columna]: {
            ...sel,
            preferencias: [...prefs, numeroCandidato],
          },
        };
      });
      registrarCambio();
      setResultado(null);
    },
    [registrarCambio]
  );

  const resetear = useCallback(() => {
    setVoto(VOTO_INICIAL);
    setResultado(null);
    registrarCambio();
  }, [registrarCambio]);

  const validar = useCallback((): ResultadoCedula => {
    const r = validarCedula(voto);
    setResultado(r);
    return r;
  }, [voto]);

  return {
    voto,
    resultado,
    seleccionarFormula,
    seleccionarLista,
    togglePreferencial,
    resetear,
    validar,
    tiempoInicio,
    cambiosRealizados,
  };
}
