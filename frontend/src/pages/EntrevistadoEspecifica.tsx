import { Link, useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";

import Carrossel from "../components/Carrossel";
import DropdownSumario from "../components/DropdownSumario";
import DropdownEntrevistas from "../components/DropdownEntrevistas"; // <--- Importado

import type { Entrevista } from "../types/entrevista";
import type { EntrevistadoEntrevista } from "../types/entrevistado";

import { mostrarEntrevista } from "../services/entrevista";
import { listarEntrevistadoId } from "../services/entrevistados";

const EntrevistadoEspecifica = () => {
  const { id } = useParams<{ id: string }>(); 

  const [entrevistado, setEntrevistado] = useState<EntrevistadoEntrevista | null>(null); 
  const [entrevistas, setEntrevistas] = useState<Entrevista[] | null>(null);

  const [carregando, setCarregando] = useState(true); 
  const [erro, setErro] = useState<string | null>(null); 
  const [selecionada, setSelecionada] = useState<number | null>(null); 

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
        setEntrevistas(dadosEntrevistas);

        if (dadosEntrevistas && dadosEntrevistas.length === 1) {
          setSelecionada(0);
        } else {
          setSelecionada(null);
        }
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

  const entrevistaAtual = entrevistas && selecionada != null ? entrevistas[selecionada] : null;

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      {/* Dados do entrevistado */}
      <div className="w-full max-w-[52rem] flex flex-col justify-center gap-12 mb-10 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <img
            src={entrevistado.path_foto}
            alt={`Foto de ${entrevistado.nome}`}
            className="rounded-full w-32 h-32 md:w-56 md:h-56 object-cover shrink-0"
          />

          <div className="flex flex-col gap-8 max-w-lg text-left">
            <h3 className="text-3xl font-bold text-vinho font-serif">{entrevistado.nome}</h3>
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
        <div className="w-full flex flex-col items-center justify-center py-6">

          {/* Seletor Customizado estilo DropdownSumario */}
          {entrevistas.length > 1 && (
            <div className="w-full max-w-[52rem] px-6 mb-6 flex flex-col gap-2">
              <label className="text-vinho font-semibold text-lg font-serif">
                Selecione a data da entrevista desejada:
              </label>
              <DropdownEntrevistas
                entrevistas={entrevistas}
                selecionada={selecionada}
                onSelect={(index) => setSelecionada(index)}
              />
            </div>
          )}

          {entrevistas.length > 1 && selecionada === null && (
            <div className="w-full max-w-[52rem] px-6 py-12 text-center bg-brancoPapel rounded-2xl border border-dashed border-vinho/40 my-4">
              <p className="text-vinho text-lg font-serif font-medium">
                Por favor, selecione uma data no menu acima para visualizar os detalhes da entrevista.
              </p>
            </div>
          )}

          {entrevistaAtual && (
            <section className="flex flex-col items-center justify-center py-4 w-full">
              <div className="w-full max-w-[52rem] flex flex-col justify-center mb-10 gap-12 px-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-bold text-ocre font-serif">Sobre a entrevista</h2>
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

                  <div className="flex flex-col gap-4">
                    <div className="w-full my-2">
                      <audio
                        ref={audio}
                        controls
                        src={entrevistaAtual?.path_audio}
                        className="w-full h-12 rounded-full shadow-md custom-audio-player"
                      />
                    </div>
                    <DropdownSumario 
                      itens={entrevistaAtual?.sumario}
                      onSelectTempos={audioJump}
                    />
                  </div>

                  <h2 className="text-[1.2rem] font-bold text-ocre font-serif flex flex-row gap-3 items-center mt-2">
                    Deseja ter acesso à transcrição?
                    <Link
                      to="/solicitar-transcricao"
                      className="text-vinho hover:bg-brancoPapel-hover px-2 rounded-2xl cursor-pointer"
                    >
                      Solicite acesso
                    </Link>
                  </h2>
                </div>
              </div>

              <div className="w-full h-screen flex flex-col overflow-hidden">
                {entrevistaAtual.path_fotos_entrevista.length > 0 && (
                  <div className="w-full bg-verde py-12 px-6 h-1/2">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6">
                      <h2 className="text-[1.5rem] font-semibold text-branco font-serif md:w-1/3 text-center md:text-right">
                        Registros do encontro
                      </h2>
                      <div className="w-full md:w-1/2 max-w-md">
                        <Carrossel path_fotos={entrevistaAtual.path_fotos_entrevista} />
                      </div>
                    </div>
                  </div>
                )}
                
                {entrevistaAtual.path_fotos_marcantes.length > 0 && (
                  <div className="w-full bg-vinho py-12 px-6 h-1/2">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6">
                      <div className="w-full md:w-1/2 max-w-md">
                        <Carrossel path_fotos={entrevistaAtual.path_fotos_marcantes} />
                      </div>
                      <h2 className="text-[1.5rem] font-semibold text-branco font-serif md:w-1/3 text-center md:text-left">
                        Fotos marcantes
                      </h2>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div> 
      )}

      {/* Sugestões */}
      <div className="w-full max-w-[52rem] flex flex-col justify-center gap-12 mb-10 px-6">
        <div className="w-full max-w-[52rem] flex flex-col justify-center gap-12 mb-8 px-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-ocre font-serif">
              Sugestões
            </h2>
            <p className="text-grafite text-base leading-relaxed text-justify">
              pipipi
              <br />
              popopo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrevistadoEspecifica;