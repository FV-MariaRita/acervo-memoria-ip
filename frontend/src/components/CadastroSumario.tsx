
import { useState } from "react";
import type { SumarioCreate } from "../types/entrevista";

interface CadastroSumarioProps {
    itens: SumarioCreate[];
    onChange: (itens: SumarioCreate[]) => void;
}

const CadastroSumario = ({ itens, onChange }: CadastroSumarioProps) => {

    const [editorAberto, setEditorAberto] = useState(false);
    const [editandoIndex, setEditandoIndex] = useState<number | null>(null);

    // Durante a edição, o tempo será uma string no formato MM:SS.
    const [tempo, setTempo] = useState("");
    const [assunto, setAssunto] = useState("");

    const abrirNovo = () => {
        setTempo("");
        setAssunto("");
        setEditandoIndex(null);
        setEditorAberto(true);
    };

    const abrirEdicao = (index: number) => {
        const segundos = itens[index].tempo_segundos;

        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;

        const tempoFormatado =
            `${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;

        setTempo(tempoFormatado);
        setAssunto(itens[index].assunto);
        setEditandoIndex(index);
        setEditorAberto(true);
    };

    const salvarItem = () => {

        const formatoValido = /^\d+:[0-5]\d:[0-5]\d$/;

        if (!formatoValido.test(tempo) || !assunto.trim()) {
            alert("Informe um tempo válido (HH:MM:SS) e o assunto.");
            return;
        }

        const [horas, minutos, segundos] = tempo.split(":").map(Number);

        const novoItem: SumarioCreate = {
            tempo_segundos: horas * 3600 +minutos * 60 + segundos,
            assunto: assunto.trim()
        };

        if (editandoIndex !== null) {
            const atualizados = [...itens];
            atualizados[editandoIndex] = novoItem;
            onChange(atualizados);
        } else {
            onChange([...itens, novoItem]);
        }

        cancelarEdicao();
    };

    const excluirItem = (index: number) => {
        onChange(itens.filter((_, i) => i !== index));
    };

    const cancelarEdicao = () => {
        setEditorAberto(false);
        setTempo("");
        setAssunto("");
        setEditandoIndex(null);
    };

    const formatarTempo = (segundos: number) => {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segundosRest = segundos % 60;


        return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundosRest).padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col gap-4">

            <h3 className="text-vinho font-semibold">
                Sumário da entrevista
            </h3>

            {/* Itens já cadastrados */}
            <div className="flex flex-col gap-3">

                {itens.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-8 rounded-xl border border-vinho/50 p-3"
                    >
                        <div className="flex gap-3">
                            <span className="text-verde medium text-sm">
                                {formatarTempo(item.tempo_segundos)}
                            </span>

                            <span className="text-grafite text-sm">
                                {item.assunto}
                            </span>
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => abrirEdicao(index)}
                                className="text-vinho hover:text-ocre text-sm"
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                onClick={() => excluirItem(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            {/* Editor de novo item ou edição */}
            {editorAberto && (
                <div className="flex flex-col gap-3 rounded-xl border border-vinho/50 p-4">

                    <div className="flex flex-row gap-5 w-full pr-4">

                        <div className=" flex flex-col w-1/5">
                            <label className="text-vinho font-semibold text-sm">
                                Tempo:
                            </label>

                            <input
                                type="time"
                                step={1}
                                value={tempo}
                                onChange={(e) => setTempo(e.target.value)}
                                placeholder="Formato (HH:MM:SS)"
                                className="w-full rounded-lg border border-vinho/50 bg-[#E3E3E380] px-3 py-2 outline-none placeholder:text-sm"
                            />
                        </div>

                        <div className="flex flex-col flex-1">
                            <label className="text-vinho font-semibold text-sm">
                                Assunto:
                            </label>

                            <input
                                type="text"
                                value={assunto}
                                onChange={(e) => setAssunto(e.target.value)}
                                placeholder="Digite o assunto abordado"
                                className="w-full rounded-lg border border-vinho/50 bg-[#E3E3E380] px-3 py-2 outline-none placeholder:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={cancelarEdicao}
                            className="text-vinho text-sm hover:cursor-pointer"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={salvarItem}
                            className="rounded-lg bg-ocre px-4 py-1 text-white font-semibold hover:cursor-pointer"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            )}

            {/* Botão minimalista de adicionar */}
            {!editorAberto && (
                <button
                    type="button"
                    onClick={abrirNovo}
                    className="flex items-center gap-2 self-start bg-brancoPapel-hover rounded-xl px-2 text-vinho text-sm font-semibold hover:text-verde transition hover:cursor-pointer"
                >
                    <span className="text-xl leading-none">+</span>
                        Adicionar item
                    </button>
            )}

        </div>
    );
};

export default CadastroSumario;
