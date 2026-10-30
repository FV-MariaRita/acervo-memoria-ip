import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Entrevista } from "../types/entrevista";

interface DropdownEntrevistasProps {
  entrevistas: Entrevista[];
  selecionada: number | null;
  onSelect: (index: number | null) => void;
}

const DropdownEntrevistas = ({entrevistas, selecionada, onSelect}: DropdownEntrevistasProps) => {

  const [isAberto, setIsAberto] = useState(false);
  const entrevistaAtual = selecionada !== null ? entrevistas[selecionada] : null;

  return (
    <div className="relative w-full max-w-[52rem]">
      
      <button
        type="button"
        onClick={() => setIsAberto(!isAberto)}
        className="w-full p-4 flex items-center justify-between text-left font-serif text-[0.8rem] font-semibold text-vinho bg-brancoPapel border border-ocre rounded-2xl shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-ocre/50 transition-all"
      >
        <span>
          {entrevistaAtual
            ? `Entrevista de ${new Date(entrevistaAtual.data).toLocaleDateString("pt-BR")} (${entrevistaAtual.local})`
            : "Selecione a data da entrevista desejada"}
        </span>
        <ChevronDown
          className={`w-6 h-6 text-ocre transform transition-transform duration-200 ${
            isAberto ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Lista de Opções Exibida ao Abrir */}
      {isAberto && (
        <div className="absolute top-full left-0 w-full mt-2 z-20 bg-brancoPapel border border-ocre rounded-2xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
          {entrevistas.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onSelect(index);
                setIsAberto(false);
              }}
              className={`w-full p-3.5 text-left font-sans text-sm transition-colors cursor-pointer border-b border-ocre/20 last:border-none flex items-center justify-between ${
                selecionada === index
                  ? "bg-vinho/10 font-bold text-vinho"
                  : "text-grafite hover:bg-brancoPapel-hover hover:text-vinho"
              }`}
            >
              <span>
                Entrevista realizada em {new Date(item.data).toLocaleDateString("pt-BR")}
              </span>
              <span className="text-xs text-grafite/70 font-normal">
                {item.local}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownEntrevistas;