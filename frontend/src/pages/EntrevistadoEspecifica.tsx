import ripperImg from "../images/ripper.jpg";
import rataoImg from "../images/ratao.jpg";
import elisangelaImg from "../images/elisangela.jpg";
import patriciaImg from "../images/patricia.jpg";

import { Link } from 'react-router-dom';
import Carrossel from "../components/Carrossel";
import DropdownSumario from "../components/DropdownSumario";
import type { Entrevista } from "../types/entrevista";
import { useRef } from "react";

interface EntrevistaProps {
  entrevista: Entrevista;
} 

const EntrevistadoEspecifica = ({ entrevista }: EntrevistaProps) => {
  const fotos = [ripperImg, elisangelaImg, patriciaImg];
  const audio = useRef<HTMLAudioElement>(null);

  const audioJump = (seg: number) => {
    if (audio.current) {
      audio.current.currentTime = seg;
      audio.current.play();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full">

      {/* INÍCIO */}
      <div className="w-full max-w-[52rem] flex flex-col justify-center gap-12 mb-10 px-6">
        
        {/* parte 1 --> nome, bio e foto */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <img
            src={rataoImg}
            alt="Ratão Diniz"
            className="rounded-full w-32 h-32 md:w-56 md:h-56 object-cover shrink-0"
          />

          <div className="flex flex-col gap-8 max-w-lg text-left">
            <h3 className="text-3xl font-bold text-vinho font-serif">Ratão Diniz</h3>
            <p className="text-grafite text-base leading-relaxed text-justify">
              Fotógrafo documental, é um dos principais nomes da fotografia popular brasileira. 
              Sua trajetória é marcada pelo registro de comunidades, povos tradicionais e movimentos sociais, 
              utilizando a fotografia como instrumento de memória e transformação social.
            </p>
          </div>
        </div>

        {/* parte 2 --> áudio e sumário */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-ocre font-serif">Sobre a entrevista</h2>
            <p className="text-grafite text-base leading-relaxed text-justify">
              Essa entrevista foi realizada no Observatório de Favelas com os entrevistadores 
              <Link to="/entrevistadores" className="hover:text-verde hover:text-bold"> Samuel Oliveira</Link>,
              <Link to="/entrevistadores" className="hover:text-verde hover:text-bold"> Érika Tambke</Link> e
              <Link to="/entrevistadores" className="hover:text-verde hover:text-bold"> Anna Beatriz Waldheim </Link> 
              no dia 20/06/2025.
            </p>
          </div>
          

          {/* Player de áudio + Sumário */}
          <div className="flex flex-col gap-4">
            <div className="w-full my-2">
              <audio
                ref={audio}
                controls
                src={entrevista?.path_audio}
                className="w-full h-12 rounded-full shadow-md custom-audio-player"
              />
            </div>
            <DropdownSumario 
              itens={entrevista?.sumario}
              onSelectTempos={audioJump}
            />
          </div>

          <h2 className="text-[1.2rem] font-bold text-ocre font-serif flex flex-row gap-3 items-center mt-2">
            Deseja ter acesso à transcrição?
            <div className="text-vinho hover:bg-brancoPapel-hover px-2 rounded-2xl cursor-pointer">
              Solicite acesso
            </div>
          </h2>
        </div>  
      </div>

      {/* FOTOS DO ENCONTRO */}
      <div className="w-full bg-verde py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-[1.2rem] font-semibold text-branco font-serif md:w-1/3 text-center md:text-right">
            Registros do encontro
          </h2>
          <div className="w-full md:w-2/3 max-w-lg">
            <Carrossel path_fotos={fotos} />
          </div>
        </div>
      </div>

      {/* FOTOS MARCANTES */}
      <div className="w-full bg-vinho py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-2/3 max-w-lg">
            <Carrossel path_fotos={fotos} />
          </div>
          <h2 className="text-[1.2rem] font-semibold text-branco font-serif md:w-1/3 text-center md:text-left">
            Fotos marcantes
          </h2>
        </div>
      </div>

      {/* SUGESTÕES */}
      <div className="w-full max-w-[52rem] flex flex-col justify-center gap-12 mt-10 mb-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-ocre font-serif">Sugestões</h2>
          <p className="text-grafite text-base leading-relaxed text-justify">
            pipipi<br />
            popopo
          </p>
        </div>
      </div>
    </div>
  );
};

export default EntrevistadoEspecifica;