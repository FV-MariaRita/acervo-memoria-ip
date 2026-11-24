import { useState } from "react";
import type { dadosEntrevistadoForm } from "../../components/CadastroEntrevistadoForm";
import type { dadosEntrevistaForm } from "../../components/CadastroEntrevista";
import { criarEntrevistadoComEntrevista } from "../../services/entrevistados";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";

import CadastroEntrevistadoForm from "../../components/CadastroEntrevistadoForm";
import CadastroEntrevistaForm from "../../components/CadastroEntrevista";

interface EntrevistaCard {
  id: number;
  salva: boolean;
}

const CadastroHistoriaOral = () => {
  const [secaoAberta, setSecaoAberta] = useState<string | number | null>(
    "entrevistado"
  );

  const [dadosEntrevistadoTemp, setDadosEntrevistadoTemp] =
    useState<dadosEntrevistadoForm | null>(null);

  const [entrevistadoId, setEntrevistadoId] = useState<number | null>(null);
  const [enviandoCadastroInicial, setEnviandoCadastroInicial] = useState(false);

  const [entrevistasVisiveis, setEntrevistasVisiveis] = useState<
    EntrevistaCard[]
  >([{ id: 1, salva: false }]);

  const entrevistadoPreenchido = dadosEntrevistadoTemp != null;
  const cadastroEntrevistadoConcluido = entrevistadoId !== null;

  const ultimaEntrevistaSalva =
    entrevistasVisiveis[entrevistasVisiveis.length - 1]?.salva;

  // Guarda os dados do entrevistado
  const handleEntrevistadoCadastrado = (
    dados: dadosEntrevistadoForm
  ) => {
    setDadosEntrevistadoTemp(dados);
    setSecaoAberta(1);
  };

  // Cadastro do entrevistado com a primeira entrevista
  const handleCadastrarEntrevistadoEntrevista = async (
    dadosEntrevista: dadosEntrevistaForm
  ) => {
    if (!dadosEntrevistadoTemp) {
      alert("Preencha os dados do entrevistado.");
      setSecaoAberta("entrevistado");
      return;
    }

    try {
      setEnviandoCadastroInicial(true);

      const resultado = await criarEntrevistadoComEntrevista({
        dados: {
          entrevistado: dadosEntrevistadoTemp.dados,
          entrevista: dadosEntrevista.dados,
        },
        fotoEntrevistado: dadosEntrevistadoTemp.foto,
        audio: dadosEntrevista.audio,
        transcricao: dadosEntrevista.transcricao,

        // Os arquivos são enviados junto dos respectivos UUIDs.
        fotosEntrevista: dadosEntrevista.fotosEntrevista,
        fotosMarcantes: dadosEntrevista.fotosMarcantes,
      });

      alert(
        `Entrevistado "${resultado.entrevistado_nome}" e primeira entrevista cadastrados com sucesso!`
      );

      setEntrevistadoId(resultado.entrevistado_id);
      setEntrevistasVisiveis([{ id: 1, salva: true }]);
      setSecaoAberta("");
    } catch (erro) {
      console.error("Erro no cadastro:", erro);

      alert(
        erro instanceof Error
          ? erro.message
          : "Não foi possível concluir o cadastro."
      );
    } finally {
      setEnviandoCadastroInicial(false);
    }
  };

  // Salva as entrevistas adicionais
  const handleEntrevistaAdicionalSalva = (indexId: number) => {
    setEntrevistasVisiveis((prev) =>
      prev.map((item) =>
        item.id === indexId ? { ...item, salva: true } : item
      )
    );

    setSecaoAberta("");
  };

  const handleAdicionarEntrevista = () => {
    const proximoId =
      entrevistasVisiveis[entrevistasVisiveis.length - 1].id + 1;

    setEntrevistasVisiveis((prev) => [
      ...prev,
      { id: proximoId, salva: false },
    ]);

    setSecaoAberta(proximoId);
  };

  const secao = (id: string | number) => {
    if (typeof id === "number" && !entrevistadoPreenchido) {
      alert("Preencha e confirme os dados do entrevistado primeiro.");
      return;
    }

    setSecaoAberta((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="flex flex-col items-center mx-10 md:mx-24 my-10">
      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <h2 className="text-3xl text-ocre font-title text-center mb-2">
          Cadastro de História Oral
        </h2>

        {/* Entrevistado dropdown */}
        <div className="w-full border-2 border-solid border-vinho rounded-xl overflow-hidden shadow-[-8px_8px_12px_0px_rgba(90,30,45,0.20)]">
          <button
            type="button"
            onClick={() => secao("entrevistado")}
            className="w-full flex items-center justify-between px-6 py-3.5 bg-vinho text-brancoPapel font-semibold"
          >
            <div className="flex items-center gap-3">
              <span>Entrevistado</span>

              {cadastroEntrevistadoConcluido && (
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Salvo
                </span>
              )}
            </div>

            {secaoAberta === "entrevistado" ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          <div
            className={
              secaoAberta === "entrevistado"
                ? "flex flex-col items-center w-full py-8 px-4 sm:px-6 gap-8"
                : "hidden"
            }
          >

            <CadastroEntrevistadoForm
              bloqueado={cadastroEntrevistadoConcluido}
              confirmado={entrevistadoPreenchido}
              onConfirmarDados={handleEntrevistadoCadastrado}
            />
          </div>
        </div>

        {/* Entrevistas dropdowns */}
        {entrevistasVisiveis.map((entrevista) => {
          const estaAberta = secaoAberta === entrevista.id;
          const primeiraEntrevista = entrevista.id === 1;

          return (
            <div
              key={entrevista.id}
              className="w-full border-2 border-solid border-vinho rounded-xl overflow-hidden shadow-[-8px_8px_12px_0px_rgba(90,30,45,0.20)]"
            >
              <button
                type="button"
                onClick={() => secao(entrevista.id)}
                className={`w-full flex items-center justify-between px-6 py-3.5 font-semibold transition-colors ${
                  entrevistadoPreenchido
                    ? "bg-vinho text-brancoPapel"
                    : "bg-vinho/60 text-brancoPapel/80 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>Entrevista #{entrevista.id}</span>

                  {entrevista.salva && (
                    <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded uppercase tracking-wider">
                      Salvo
                    </span>
                  )}
                </div>

                {estaAberta ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <div
                className={
                  estaAberta
                    ? "flex flex-col items-center w-full py-8 px-4 sm:px-6 gap-8"
                    : "hidden"
                }
              >
                
                <CadastroEntrevistaForm
                  modo={primeiraEntrevista ? "unificado" : "adicional"}
                  entrevistadoId={entrevistadoId}
                  bloqueado={entrevista.salva}
                  enviandoExterno={
                    primeiraEntrevista ? enviandoCadastroInicial : false
                  }
                  onEnviarUnificado={
                    primeiraEntrevista
                      ? handleCadastrarEntrevistadoEntrevista
                      : undefined
                  }
                  onCadastroAdicionalSucesso={
                    !primeiraEntrevista
                      ? () =>
                          handleEntrevistaAdicionalSalva(entrevista.id)
                      : undefined
                  }
                />
              </div>
            </div>
          );
        })}

        {/* Botão de adicionar entrevista */}
        {cadastroEntrevistadoConcluido && ultimaEntrevistaSalva && (
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={handleAdicionarEntrevista}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-solid border-vinho text-vinho text-sm font-semibold hover:bg-vinho hover:text-white transition shadow-[-4px_4px_8px_0px_rgba(90,30,45,0.15)]"
            >
              <Plus size={16} />
              Adicionar nova entrevista
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadastroHistoriaOral;