import { useState } from "react";
import type { Sumario as ISumario } from "../types/entrevista";
import { ChevronDown } from "lucide-react";

interface SumarioProps {
  itens?: ISumario[];
  onSelectTempos: (segundos: number) => void;
}

const converteSegundos = (segundosTotais: number): string => {

  if (segundosTotais === undefined || segundosTotais === null) 
    return "00:00";

  const horas = Math.floor(segundosTotais / 3600);
  const min = Math.floor((segundosTotais % 3600) / 60);
  const seg = segundosTotais % 60;

  const tempo = (n: number) => String(n).padStart(2, '0');

  if (horas > 0) {
    return `${tempo(horas)}:${tempo(min)}:${tempo(seg)}`;
  }

  return `${tempo(min)}:${tempo(seg)}`;
};

const DropdownSumario = ({ itens = [], onSelectTempos }: SumarioProps) => {
  const [isAberto, setAberto] = useState(false);


  return (
    <div className="border border-ocre rounded-2xl overflow-hidden bg-brancoPapel">
      <button 
        type="button" 
        onClick={() => setAberto(!isAberto)} 
        className="w-full p-4 flex items-center justify-between text-left font-serif text-[1.2rem] font-semibold text-vinho cursor-pointer"
      >
        <span>Sumário</span>
        <span className={`transform transition-transform duration-200 ${isAberto ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-8 h-8 text-ocre" />
        </span>
      </button>

      {isAberto && (
        <div className="p-4 pt-0 border-t border-ocre/40 flex flex-col gap-2 max-h-60 overflow-y-auto">
          { itens && itens.length > 0 ? (
            itens.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectTempos(item.tempo_segundos)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-brancoPapel-hover hover:text-vinho text-left group cursor-pointer" 
              >
                <span className="text-sm font-semibold px-2 py-1 rounded text-grafite">
                  {converteSegundos(item.tempo_segundos)}
                </span>
                <span className="text-grafite text-sm group-hover:font-medium">
                  {item.assunto}
                </span>
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500 py-2">
              Não foi encontrado um sumário para essa entrevista
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownSumario;


/*
dados para efeito de teste usando o áudio da Patrícia 

const dados: Sumario[] = [
    {"tempo_segundos": 0, "assunto": "Apresentação da entrevista"}, 
    {"tempo_segundos": 60, "assunto": "Apresentação pessoal de Patrícia"},
    {"tempo_segundos": 155, "assunto": "Introdução de Patrícia ao mundo da arte"},
    {"tempo_segundos": 245, "assunto": "Trajetória de formação acadêmica e afastamento do universo artístico"},
    {"tempo_segundos": 475, "assunto": "Reaproximação com o mundo da arte"},
  ]

*/