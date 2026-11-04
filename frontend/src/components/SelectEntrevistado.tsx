
import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface Entrevistado {
  id: number;
  nome: string;
}

interface Props {
  lista: Entrevistado[];
  selecionado: number | null;
  onChange: (id: number | null) => void;
}

const SelectEntrevistado = ({
  lista,
  selecionado,
  onChange,
}: Props) => {
  const [aberto, setAberto] = useState(false);

  const entrevistadoSelecionado = lista.find(
    (entrevistado) => entrevistado.id === selecionado
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="px-2 font-semibold text-vinho text-m">
        Entrevistado:
      </label>

      <div className="relative">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAberto(!aberto)}
            className="flex min-h-10 w-full items-center justify-between
                       gap-3 rounded-xl border border-vinho/70
                       bg-[#E3E3E380] px-3 text-left text-sm
                       text-vinho transition hover:bg-[#E3E3E3]"
          >
            <span className="truncate">
              {entrevistadoSelecionado?.nome ??
                "Selecionar entrevistado"}
            </span>

            {aberto ? (
              <ChevronUp size={18} className="shrink-0" />
            ) : (
              <ChevronDown size={18} className="shrink-0" />
            )}
          </button>

          {selecionado !== null && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex shrink-0 items-center justify-center
                         rounded-md border border-vinho
                         bg-[#E3E3E3] p-3 text-vinho
                         transition hover:bg-vinho hover:text-white"
              aria-label="Desmarcar entrevistado"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {aberto && (
          <div
            className="absolute z-20 mt-1 max-h-60 w-full
                       overflow-y-auto rounded-md border border-vinho
                       bg-[#E3E3E3] p-2 shadow-md"
          >
            {lista.length === 0 ? (
              <p className="p-2 text-sm text-gray-500">
                Nenhum entrevistado cadastrado.
              </p>
            ) : (
              lista.map((entrevistado) => (
                <button
                  key={entrevistado.id}
                  type="button"
                  onClick={() => {
                    onChange(entrevistado.id);
                    setAberto(false);
                  }}
                  className={`w-full rounded-md p-2 text-left
                              text-grafite transition text-sm
                              hover:bg-vinho hover:text-white
                              ${
                                selecionado === entrevistado.id
                                  ? "font-semibold"
                                  : ""
                              }`}
                >
                  {entrevistado.nome}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectEntrevistado;
