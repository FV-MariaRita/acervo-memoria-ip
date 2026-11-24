
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";

import Carrossel from "../components/Carrossel";
import DropdownSumario from "../components/DropdownSumario";

import type { Entrevista } from "../types/entrevista";
import type { EntrevistadoEntrevista } from "../types/entrevistado";

import { mostrarEntrevista } from "../services/entrevista";
import { listarEntrevistadoId } from "../services/entrevistados";

const EntrevistadoEspecifica = () => {

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [entrevistado, setEntrevistado] =
    useState<EntrevistadoEntrevista | null>(null);

  const [entrevistas, setEntrevistas] =
    useState<Entrevista[] | null>(null);

  const [selecionada, setSelecionada] = useState<number | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setErro("ID do entrevistado não informado.");
      setCarregando(false);
      return;
    }

    const entrevistadoId = Number(id);

    if (!Number.isInteger(entrevistadoId) || entrevistadoId <= 0) {
      setErro("ID do entrevistado inválido.");
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro(null);

    Promise.all([
      listarEntrevistadoId(entrevistadoId),
      mostrarEntrevista(entrevistadoId),
    ])
      .then(([dadosEntrevistado, dadosEntrevistas]) => {
        setEntrevistado(dadosEntrevistado);

        // Ordena as entrevistas da mais antiga para a mais recente
        const entrevistasOrdenadas = [...dadosEntrevistas].sort(
          (a, b) =>
            new Date(a.data).getTime() - new Date(b.data).getTime()
        );

        setEntrevistas(entrevistasOrdenadas);

        // Seleciona automaticamente a entrevista mais antiga
        setSelecionada(
          entrevistasOrdenadas.length > 0 ? 0 : null
        );
      })
      .catch((error: unknown) => {
        console.error("Erro ao carregar os dados:", error);
        setErro("Não foi possível carregar os dados dessa página.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }, [id]);

  const audio = useRef<HTMLAudioElement>(null);

  const audioJump = (seg: number) => {
    if (audio.current) {
      audio.current.currentTime = seg;
      audio.current.play();
    }
  };

  if (carregando) {
    return (
      <p className="p-8 text-center text-vinho font-semibold">
        Carregando entrevistas...
      </p>
    );
  }

  if (erro) {
    return (
      <p className="p-8 text-center text-vinho font-semibold">
        {erro}
      </p>
    );
  }

  if (!entrevistado) {
    return (
      <p className="p-8 text-center text-vinho font-semibold">
        Entrevistado não encontrado.
      </p>
    );
  }

  const entrevistaAtual =
    entrevistas && selecionada != null
      ? entrevistas[selecionada]
      : null;

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full gap-6">

      {/* Dados do entrevistado */}
      <div className="w-full max-w-[52rem] flex flex-col justify-center gap-12 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">

          <img
            src={entrevistado.path_foto}
            alt={`Foto de ${entrevistado.nome}`}
            className="rounded-full w-32 h-32 md:w-56 md:h-56 object-cover shrink-0"
          />

          <div className="flex flex-col gap-8 max-w-lg text-left">
            <h3 className="text-3xl font-bold text-vinho font-serif">
              {entrevistado.nome}
            </h3>

            <p className="text-grafite text-base leading-relaxed text-justify">
              {entrevistado.bio}
            </p>
          </div>
        </div>
      </div>

      {!entrevistas || entrevistas.length === 0 ? (
        <p className="text-center text-grafite">
          Nenhuma entrevista encontrada para este entrevistado.
        </p>
      ) : (
        <>
          {/* Conteúdo principal da entrevista */}
          <div className="w-full flex flex-col items-center justify-center py-6">

            {/* Menu de seleção das entrevistas */}
            {entrevistas.length > 1 && (
              <div className="w-full max-w-[52rem] px-6 mb-6 flex flex-col gap-2">

                <div className="w-full flex  border-ocre border-2 rounded-xl overflow-hidden">

                  {entrevistas.map((entrevista, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelecionada(index)}
                      aria-pressed={selecionada === index}
                      className={`
                        flex-1 min-w-0 px-3 py-4
                        text-center font-serif font-semibold text-vinho
                        text-sm md:text-base
                        transition-colors
                        ${index !== 0 ? "border-l border-ocre" : ""}
                        ${
                          selecionada === index
                            ? "bg-ocre/40 text-branco font-bold"
                            : "bg-transparent hover:bg-ocre/10 hover:cursor-pointer "
                        }
                      `}
                    >
                      {new Date(entrevista.data).toLocaleDateString("pt-BR")}
                    </button>
                  ))}

                </div>
              </div>
            )}

            {/* Informações da entrevista */}
            {entrevistaAtual && (
              <section className="w-full flex flex-col items-center justify-center py-4">

                <div className="w-full max-w-[52rem] flex flex-col justify-center mb-10 gap-12 px-6">

                  <div className="flex flex-col gap-6">

                    <div className="flex flex-col gap-3">

                      <h2 className="text-2xl font-bold text-ocre font-serif">
                        Sobre a entrevista
                      </h2>

                      <p className="text-grafite text-base leading-relaxed text-justify">
                        Essa entrevista foi realizada em {entrevistaAtual.local} com os entrevistadores{" "}

                        {entrevistaAtual.entrevistadores.map((entrevistador, index) => (
                          <span key={entrevistador.id}>
                            {index > 0 && ", "}

                            <Link
                              to={`/entrevistadores/${entrevistador.id}`}
                              className="hover:font-semibold hover:text-verde"
                            >
                              {entrevistador.nome}
                            </Link>
                          </span>
                        ))}

                        {" "}em{" "}
                        {new Date(entrevistaAtual.data).toLocaleDateString("pt-BR")}.
                      </p>

                    </div>

                    <div className="flex flex-col gap-6">

                      <div className="w-full my-2">
                        <audio
                          ref={audio}
                          controls
                          src={entrevistaAtual.path_audio}
                          className="w-full h-12 rounded-full shadow-md custom-audio-player"
                        />
                      </div>

                      <DropdownSumario
                        itens={entrevistaAtual.sumario}
                        onSelectTempos={audioJump}
                      />

                    </div>

                    <h2 className="text-[1.2rem] font-bold text-ocre font-serif flex flex-row gap-3 items-center mt-2">
                      Deseja ter acesso à transcrição?

                      <button
                        type="button"
                        className="text-vinho hover:text-vinho-hover hover:underline px-2 rounded-2xl cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/entrevistados/${id}/entrevista/${entrevistaAtual.data}/solicitar-transcricao`
                          )
                        }
                      >
                        Solicite acesso
                      </button>
                    </h2>

                  </div>
                </div>

                {/* Seção de fotos: ocupa toda a largura da página */}
                {(entrevistaAtual.path_fotos_entrevista.length > 0 ||
                  entrevistaAtual.path_fotos_marcantes.length > 0) && (

                  <div className="w-full flex flex-col overflow-hidden">

                    {/* Registros do encontro */}
                    {entrevistaAtual.path_fotos_entrevista.length > 0 && (
                      <div className="w-full bg-verde py-12 px-6">

                        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6">

                          <h2 className="text-[1.5rem] font-semibold text-branco font-serif md:w-1/3 text-center md:text-right">
                            Registros do encontro
                          </h2>

                          <div className="w-full md:w-1/2 max-w-md">
                            <Carrossel
                              path_fotos={entrevistaAtual.path_fotos_entrevista}
                            />
                          </div>

                        </div>
                      </div>
                    )}

                    {/* Fotos marcantes */}
                    {entrevistaAtual.path_fotos_marcantes.length > 0 && (
                      <div className="w-full bg-vinho py-12 px-6">

                        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6">

                          <div className="w-full md:w-1/2 max-w-md">
                            <Carrossel
                              path_fotos={entrevistaAtual.path_fotos_marcantes}
                            />
                          </div>

                          <h2 className="text-[1.5rem] font-semibold text-branco font-serif md:w-1/3 text-center md:text-left">
                            Fotos marcantes
                          </h2>

                        </div>
                      </div>
                    )}

                  </div>
                )}

              </section>
            )}
          </div>
        </>
      )}

      {/* Sugestões */}
      <div className="w-full max-w-[52rem] flex flex-col gap-12 mb-8">

        <div className="w-full max-w-[52rem] flex flex-col gap-12 mb-8 px-6">

          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-ocre font-serif">
              Sugestões
            </h2>
          </div>

        </div>
      </div>

    </div>
  );
};

export default EntrevistadoEspecifica;
