import { Link, useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";

import Carrossel from "../components/Carrossel";
import DropdownSumario from "../components/DropdownSumario";

import type { Entrevista } from "../types/entrevista";
import type { EntrevistadoEntrevista } from "../types/entrevistado";

import { mostrarEntrevista } from "../services/entrevista";
import { listarEntrevistadoId } from "../services/entrevistados";


const EntrevistadoEspecifica = () => {

  //Puxa o id da rota para ser utilizado 
  const {id} = useParams<{id:string}>(); 

  //Variáveis utilizadas para fazer a chamada à API
  const [entrevistado, setEntrevistado] = useState<EntrevistadoEntrevista | null>(null); 
  const [entrevistas, setEntrevistas] = useState<Entrevista[] | null>(null);

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
        setEntrevistas(dadosEntrevistas);
      })
      .catch((error: unknown) => {
        console.error("Erro ao carregar os dados:", error);
        setErro("Não foi possível carregar os dados dessa página.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }, [id]);

  //Funções para gerenciar o audio da entrevista
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

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">
      {/*dados do entrevistado */}
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

      {entrevistas?.length == 0 ? (
        <p className="text-center text-grafite">
          Nenhuma entrevista encontrada para este entrevistado.
        </p> 
      ) : (
        entrevistas?.map((item, index) => {

          return (
          <section key={index} className="flex flex-col items-center justify-center py-6 w-full">
            <div className="w-full max-w-[52rem] flex flex-col justify-center gap-12 mb-10 px-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl font-bold text-ocre font-serif">Sobre a entrevista</h2>
                  <p className="text-grafite text-base leading-relaxed text-justify">

                    Essa entrevista foi realizada em {item.local} com os entrevistadores{" "}

                    {item.entrevistadores.map((entrevistador, index) => (
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
                    {new Date(item.data).toLocaleDateString("pt-BR")}.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="w-full my-2">
                    <audio
                      ref={audio}
                      controls
                      src={item?.path_audio}
                      className="w-full h-12 rounded-full shadow-md custom-audio-player"
                    />
                  </div>
                  <DropdownSumario 
                    itens={item?.sumario}
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
              <div className="w-full bg-verde py-12 px-6 h-1/2">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6">
                  <h2 className="text-[1.5rem] font-semibold text-branco font-serif md:w-1/3 text-center md:text-right">
                    Registros do encontro
                  </h2>

                  <div className="w-full md:w-1/2 max-w-md">
                    <Carrossel
                      path_fotos={item.path_fotos_entrevista}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full bg-vinho py-12 px-6 h-1/2">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-6">
                  <div className="w-full md:w-1/2 max-w-md">
                    <Carrossel
                      path_fotos={item.path_fotos_marcantes}
                    />
                  </div>

                  <h2 className="text-[1.5rem] font-semibold text-branco font-serif md:w-1/3 text-center md:text-left">
                    Fotos marcantes
                  </h2>
                </div>
              </div>
            </div>
          </section>
        )})
      )}

      <div className="w-full max-w-[52rem] flex flex-col justify-center gap-12 mb-10 px-6">
        <div className="w-full max-w-[52rem] flex flex-col justify-center gap-12 mt-10 mb-8 px-6">
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
  )


}

export default EntrevistadoEspecifica;