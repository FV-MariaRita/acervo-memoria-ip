import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface Entrevistador {
    id: number;
    nome: string;
}

interface Props {
    lista: Entrevistador[];
    selecionados: number[];
    onChange: (ids: number[]) => void;
}

const SelectEntrevistadores = ({
    lista,
    selecionados,
    onChange
}: Props) => {

    const [aberto, setAberto] = useState(false);

    const alternarSelecao = (id: number) => {
        if (selecionados.includes(id)) {
            onChange(selecionados.filter(item => item !== id));
        } else {
            onChange([...selecionados, id]);
        }
    };

    const nomesSelecionados = lista.filter(
        entrevistador => selecionados.includes(entrevistador.id)
    );

    return (
        <div className="relative flex flex-col gap-2">

            <label  className="px-2 font-semibold text-vinho text-m">Entrevistadores:</label>

            {/* Campo de seleção */}
            <button
                type="button"
                onClick={() => setAberto(!aberto)}
                className="w-full rounded-xl border border-vinho/70 bg-[#E3E3E380] min-h-12 p-3 flex justify-between items-center gap-3 text-left"
            >
                <div className="flex flex-wrap items-center gap-2 flex-1">

                    {nomesSelecionados.length > 0 ? (
                        nomesSelecionados.map(entrevistador => (
                            <span
                                key={entrevistador.id}
                                className="flex items-center gap-1 bg-verde/40 text-grafite rounded-full px-2 py-1 text-sm"
                            >
                                {entrevistador.nome}

                                <span
                                    role="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        alternarSelecao(entrevistador.id);
                                    }}
                                    className="cursor-pointer hover:text-red-600"
                                    aria-label={`Remover ${entrevistador.nome}`}
                                >
                                    <X size={14} />
                                </span>
                            </span>
                        ))
                    ) : (
                        <span className="w-full bg-transparent outline-none text-vinho font-corpo text-sm">
                            Selecionar entrevistadores
                        </span>
                    )}

                </div>

                <span className="shrink-0">
                    {aberto
                        ? <ChevronUp size={18} />
                        : <ChevronDown size={18} />
                    }
                </span>
            </button>

            {/* Lista de opções */}
            {aberto && (
                <div className="border border-vinho bg-[#E3E3E380] rounded-md p-3 flex flex-col gap-2 shadow-sm">

                    {lista.map(entrevistador => (
                        <label
                            key={entrevistador.id}
                            className="flex text-grafite items-center gap-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selecionados.includes(entrevistador.id)}
                                onChange={() => alternarSelecao(entrevistador.id)}
                            />

                            {entrevistador.nome}
                        </label>
                    ))}

                </div>
            )}

        </div>
    );
};

export default SelectEntrevistadores;