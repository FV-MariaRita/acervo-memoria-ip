import type {
  EntrevistaCreate,
  Fotos_entrevistaCreate,
} from "../types/entrevista";

import type { EntrevistadoLista } from "../types/entrevistado";
import type { EntrevistadorLista } from "../types/entrevistador";

import React, { useEffect, useId, useState } from "react";

import SelectEntrevistadores from "./SelectEntrevistadores";
import SelectEntrevistado from "./SelectEntrevistado";
import GridFotos from "./GridFotos";
import CadastroSumario from "./CadastroSumario";

import { listarEntrevistadores } from "../services/entrevistador";
import { listarEntrevistados } from "../services/entrevistados";
import {
  cadastrarEntrevista,
  mostrarEntrevista,
} from "../services/entrevista";

import { useNavigate } from "react-router-dom";
import BotaoOcre from "./buttons/BotaoOcre";

interface FotoComId {
  arquivo: File;
  arquivo_id: string;
}

export interface dadosEntrevistaForm {
  dados: EntrevistaCreate;
  audio: File;
  transcricao: File;
  fotosEntrevista: FotoComId[];
  fotosMarcantes: FotoComId[];
}

interface Props {
  modo?: "unificado" | "adicional";
  entrevistadoId?: number | null;
  bloqueado?: boolean;
  enviandoExterno?: boolean;
  onEnviarUnificado?: (payload: dadosEntrevistaForm) => Promise<void>;
  onCadastroAdicionalSucesso?: () => void;
}

const normalizarData = (data: Date | string | null) => {
  if (!data) return "";

  if (typeof data === "string") {
    return data.substring(0, 10);
  }

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
};

const CadastroEntrevistaForm = ({
  modo = "adicional",
  entrevistadoId = null,
  bloqueado = false,
  enviandoExterno = false,
  onEnviarUnificado,
  onCadastroAdicionalSucesso,
}: Props) => {
  const navigate = useNavigate();
  const formUid = useId();

  const precisaSelecionarEntrevistado =
    modo === "adicional" && entrevistadoId === null;

  const [dadosEntrevista, setDadosEntrevista] =
    useState<EntrevistaCreate>({
      local: "",
      data: null,
      entrevistadores: [],
      sumario: [],
      fotos: [],
    });

  const [fotosEntrevista, setFotosEntrevista] = useState<File[]>([]);
  const [fotosMarcantes, setFotosMarcantes] = useState<File[]>([]);

  const [audio, setAudio] = useState<File | null>(null);
  const [transcricao, setTranscricao] = useState<File | null>(null);

  const [enviandoLocal, setEnviandoLocal] = useState(false);

  const [entrevistadoSelecionadoId, setEntrevistadoSelecionadoId] =
    useState<number | null>(null);

  const [entrevistados, setEntrevistados] =
    useState<EntrevistadoLista[]>([]);

  const [entrevistadores, setEntrevistadores] =
    useState<EntrevistadorLista[]>([]);

  useEffect(() => {
    listarEntrevistadores()
      .then((dataEntrevistadores) => {
        setEntrevistadores(dataEntrevistadores);
      })
      .catch((error: unknown) => {
        console.error("Erro ao buscar entrevistadores:", error);
      });

    if (precisaSelecionarEntrevistado) {
      listarEntrevistados()
        .then((dataEntrevistados) => {
          setEntrevistados(dataEntrevistados);
        })
        .catch((error: unknown) => {
          console.error("Erro ao buscar entrevistados:", error);
        });
    }
  }, [precisaSelecionarEntrevistado]);

  const enviando =
    modo === "unificado" ? enviandoExterno : enviandoLocal;

  const idEntrevistadoFinal = precisaSelecionarEntrevistado
    ? entrevistadoSelecionadoId
    : entrevistadoId;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!audio || !transcricao) {
      alert("Selecione o áudio e a transcrição da entrevista.");
      return;
    }

    // Associa um UUID a cada arquivo.
    const fotosEntrevistaComId: FotoComId[] = fotosEntrevista.map(
      (arquivo) => ({
        arquivo,
        arquivo_id: crypto.randomUUID(),
      })
    );

    const fotosMarcantesComId: FotoComId[] = fotosMarcantes.map(
      (arquivo) => ({
        arquivo,
        arquivo_id: crypto.randomUUID(),
      })
    );

    // Cria os metadados utilizando os mesmos UUIDs dos arquivos.
    const fotos: Fotos_entrevistaCreate[] = [
      ...fotosEntrevistaComId.map(({ arquivo_id }, index) => ({
        categoria: "entrevista" as const,
        numero: index + 1,
        arquivo_id,
      })),

      ...fotosMarcantesComId.map(({ arquivo_id }, index) => ({
        categoria: "marcantes" as const,
        numero: index + 1,
        arquivo_id,
      })),
    ];

    const dados: EntrevistaCreate = {
      ...dadosEntrevista,
      fotos,
    };

    // MODO UNIFICADO: cadastra entrevistado e primeira entrevista.
    if (modo === "unificado") {
      try {
        if (!onEnviarUnificado) {
          throw new Error("Função de cadastro unificado não configurada.");
        }

        await onEnviarUnificado({
          dados,
          audio,
          transcricao,
          fotosEntrevista: fotosEntrevistaComId,
          fotosMarcantes: fotosMarcantesComId,
        });
      } catch (erro) {
        console.error("Erro no cadastro unificado:", erro);

        alert(
          erro instanceof Error
            ? erro.message
            : "Não foi possível concluir o cadastro."
        );
      }

      // IMPORTANTE: impede que o código continue para o modo adicional.
      return;
    }

    // MODO ADICIONAL: cadastra uma entrevista para entrevistado existente.
    if (idEntrevistadoFinal === null) {
      alert("Selecione um entrevistado.");
      return;
    }

    try {
      setEnviandoLocal(true);

      const entrevistasExistentes = await mostrarEntrevista(
        idEntrevistadoFinal
      );

      const localInformado = dadosEntrevista.local
        .trim()
        .toLocaleLowerCase("pt-BR");

      const dataInformada = normalizarData(dadosEntrevista.data);

      const entrevistaDuplicada = entrevistasExistentes.some(
        (entrevista) =>
          entrevista.local.trim().toLocaleLowerCase("pt-BR") ===
            localInformado &&
          normalizarData(entrevista.data) === dataInformada
      );

      if (entrevistaDuplicada) {
        alert(
          "Já existe uma entrevista cadastrada para esse entrevistado, nesse local e nessa data."
        );
        return;
      }

      const resultado = await cadastrarEntrevista({
        entrevistado_id: idEntrevistadoFinal,
        dados,
        audio,
        transcricao,
        fotosEntrevista: fotosEntrevistaComId,
        fotosMarcantes: fotosMarcantesComId,
      });

      console.log("Entrevista cadastrada:", resultado);

      alert("Entrevista cadastrada com sucesso!");

      if (onCadastroAdicionalSucesso) {
        onCadastroAdicionalSucesso();
      } else {
        navigate("/admin");
      }
    } catch (erro) {
      console.error("Erro no cadastro:", erro);

      alert(
        erro instanceof Error
          ? erro.message
          : "Não foi possível cadastrar a entrevista."
      );
    } finally {
      setEnviandoLocal(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[1000px] flex flex-col gap-6"
      >
        <fieldset
          disabled={bloqueado}
          className={`flex flex-col gap-4 transition-opacity ${
            bloqueado ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {precisaSelecionarEntrevistado && (
            <>
              <SelectEntrevistado
                lista={entrevistados}
                selecionado={entrevistadoSelecionadoId}
                onChange={setEntrevistadoSelecionadoId}
              />

              <div className="px-2 text-sm text-vinho-hover font-medium">
                <span>Entrevistado não encontrado? </span>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/cadastro-entrevistado")
                  }
                  className="hover:bg-vinho/15 w-fit px-2 rounded-xl border-solid border border-vinho hover:cursor-pointer"
                >
                  Criar entrevistado
                </button>
              </div>
            </>
          )}

          {/* Data e local */}
          <div className="grid grid-cols-5 gap-4">
            <div className="flex col-span-4 flex-col">
              <label className="px-2 font-semibold text-vinho text-m">
                Local:
              </label>

              <div className="flex col-span-3 items-center gap-3 rounded-xl border border-vinho/70 w-full bg-[#E3E3E380] px-3 py-1">
                <input
                  type="text"
                  name="local"
                  value={dadosEntrevista.local}
                  required
                  onChange={(e) =>
                    setDadosEntrevista((prev) => ({
                      ...prev,
                      local: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex col-span-1 flex-col">
              <label className="px-2 font-semibold text-vinho text-m">
                Data:
              </label>

              <div className="flex col-span-1 items-center gap-3 rounded-xl border border-vinho/70 w-full bg-[#E3E3E380] px-3 py-1">
                <input
                  type="date"
                  name="date"
                  value={
                    dadosEntrevista.data
                      ? dadosEntrevista.data.toISOString().split("T")[0]
                      : ""
                  }
                  placeholder="dd/mm/aaaa"
                  required
                  onChange={(e) =>
                    setDadosEntrevista((prev) => ({
                      ...prev,
                      data: e.target.value
                        ? new Date(`${e.target.value}T00:00:00`)
                        : null,
                    }))
                  }
                  className="w-full text-center placeholder-text-center bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Entrevistadores */}
          <SelectEntrevistadores
            lista={entrevistadores}
            selecionados={dadosEntrevista.entrevistadores}
            onChange={(ids) =>
              setDadosEntrevista((prev) => ({
                ...prev,
                entrevistadores: ids,
              }))
            }
          />

          {!bloqueado && (
            <div className="px-2 text-sm text-vinho-hover font-medium">
              <span>Entrevistador não encontrado? </span>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/cadastro-entrevistador")
                }
                className="hover:bg-vinho/15 w-fit px-2 rounded-xl border-solid border border-vinho hover:cursor-pointer"
              >
                Criar entrevistador
              </button>
            </div>
          )}

          {/* Sumário */}
          <div className="flex flex-col gap-2">
            <CadastroSumario
              itens={dadosEntrevista.sumario}
              onChange={(sumario) =>
                setDadosEntrevista((prev) => ({
                  ...prev,
                  sumario,
                }))
              }
            />
          </div>

          {/* Áudio e transcrição */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transcrição */}
            <div className="flex flex-col md:col-span-1 gap-2">
              <label className="text-vinho text-base font-semibold">
                Transcrição (PDF):
              </label>

              <div className="flex items-center gap-3">
                <label
                  htmlFor={`transcricao-${formUid}`}
                  className="cursor-pointer shrink-0 rounded-md border border-vinho bg-[#E3E3E380] px-4 py-2 text-vinho font-corpo text-sm hover:bg-vinho hover:text-white transition"
                >
                  Escolher arquivo
                </label>

                <span className="text-sm text-gray-500 truncate">
                  {transcricao?.name ?? "Nenhum arquivo"}
                </span>

                <input
                  id={`transcricao-${formUid}`}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    setTranscricao(e.target.files?.[0] ?? null)
                  }
                />
              </div>
            </div>

            {/* Áudio */}
            <div className="flex flex-col md:col-span-1 gap-2">
              <label className="text-vinho text-base font-semibold">
                Áudio:
              </label>

              <div className="flex items-center gap-3">
                <label
                  htmlFor={`audio-${formUid}`}
                  className="cursor-pointer shrink-0 rounded-md border border-vinho bg-[#E3E3E380] px-4 py-2 text-vinho font-corpo text-sm hover:bg-vinho hover:text-white transition"
                >
                  Escolher arquivo
                </label>

                <span className="text-sm text-gray-500 truncate">
                  {audio?.name ?? "Nenhum arquivo"}
                </span>

                <input
                  id={`audio-${formUid}`}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) =>
                    setAudio(e.target.files?.[0] ?? null)
                  }
                />
              </div>
            </div>
          </div>

          {/* Fotos */}
          <GridFotos
            titulo="Fotos da entrevista"
            fotos={fotosEntrevista}
            onChange={setFotosEntrevista}
          />

          <GridFotos
            titulo="Fotos marcantes"
            fotos={fotosMarcantes}
            onChange={setFotosMarcantes}
          />

          {/* Botão de envio */}
          {!bloqueado && (
            <div className="flex w-full text-brancoPapel text-m font-corpo font-semibold justify-center items-center">
              <BotaoOcre tipo="submit" disabled={enviando}>
                {enviando
                  ? "Enviando"
                  : modo === "unificado"
                    ? "Cadastrar entrevistado e entrevista"
                    : "Cadastrar"}
              </BotaoOcre>
            </div>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default CadastroEntrevistaForm;