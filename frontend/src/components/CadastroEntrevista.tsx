import type { EntrevistaCreate } from "../types/entrevista";
import React, { useState } from "react";
import SelectEntrevistadores from "./SelectEntrevistadores";
import GridFotos from "./GridFotos";
import SelectEntrevistado from "./SelectEntrevistado";

const CadastroEntrevistaForm = (entrevista: EntrevistaCreate) => {
    const [dadosEntrevista, setDadosEntrevista] = useState<EntrevistaCreate>({
        local: "",
        data: "",
        entrevistadores: [],
        sumario: [],
        fotos: []
    });
    interface Entrevistador {
        id: number;
        nome: string;
    }
    interface Entrevistado {
        id: number;
        nome: string;
    }
    const [fotosEntrevista, setFotosEntrevista] = useState<File[]>([]);
    const [fotosMarcantes, setFotosMarcantes] = useState<File[]>([]);
    const [audio, setAudio] = useState<File | null>(null);
    const [transcricao, setTranscricao] = useState<File | null>(null);
    const [entrevistadoId, setEntrevistadoId] = useState<number | null>(null);
    const listaEntrevistadores: Entrevistador[] = [
        { id: 1, nome: "Samuel Oliveira" },
        { id: 2, nome: "Érika Tambke" },
        { id: 3, nome: "Juliana Pereira" },
    ];
    const listaEntrevistados: Entrevistado[] = [
        { id: 1, nome: "Ricardo funari" },
        { id: 2, nome: "Dante Gastaldani" },
    ];
    
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
        ) => {
        event.preventDefault();

        // Verificações básicas antes de enviar
        if (entrevistadoId === null) {
            alert("Selecione um entrevistado.");
            return;
        }

        if (!audio || !transcricao) {
            alert("Selecione o áudio e a transcrição da entrevista.");
            return;
        }

        // Metadados das fotos, mantendo a ordem escolhida pelo usuário.
        const fotos = [
            ...fotosEntrevista.map((_, index) => ({
            categoria: "entrevista",
            numero: index + 1,
            })),
            ...fotosMarcantes.map((_, index) => ({
            categoria: "marcantes",
            numero: index + 1,
            })),
        ];

        const dados: EntrevistaCreate = {
            ...dadosEntrevista,
            fotos,
        };

        // Montagem do multipart/form-data
        const formData = new FormData();

        formData.append("dados", JSON.stringify(dados));
        formData.append("entrevistado_id", String(entrevistadoId));
        formData.append("audio", audio);
        formData.append("transcricao", transcricao);

        fotosEntrevista.forEach((foto) => {
            formData.append("fotos_entrevista", foto);
        });

        fotosMarcantes.forEach((foto) => {
            formData.append("fotos_marcantes", foto);
        });

        try {
            const resposta = await fetch(
            `${import.meta.env.VITE_API_URL}/entrevistas/`,
            {
                method: "POST",
                body: formData,
            }
            );

            if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(
                erro.detail
                ? JSON.stringify(erro.detail)
                : "Erro ao cadastrar entrevista."
            );
            }

            const resultado = await resposta.json();

            console.log("Entrevista cadastrada:", resultado);
            alert("Entrevista cadastrada com sucesso!");

        } catch (erro) {
            console.error("Erro no cadastro:", erro);
            alert(
            erro instanceof Error
                ? erro.message
                : "Não foi possível cadastrar a entrevista."
            );
        }
    };

    return (
        <div className="w-full flex flex-col items-center px-4">
            
            {/* Formulário */}
            <form  onSubmit={handleSubmit} className="w-full max-w-[1000px] flex flex-col gap-6">
                {/* Sobre a entrevista */}
                <section className="flex flex-col gap-4">
    
                    <SelectEntrevistado
                        lista={listaEntrevistados}
                        selecionado={entrevistadoId}
                        onChange={setEntrevistadoId}
                        />
                    {/* Campos */}
                    <div className="grid grid-cols-5 gap-4">
                        <div className="flex col-span-4 flex-col">
                            <label className="px-2 font-semibold text-vinho text-m">Local:</label>
                            <div className="flex col-span-3 items-center gap-3 rounded-xl border border-vinho/70 w-full bg-[#E3E3E380] px-3 py-1">
                                <input
                                        type="string"
                                        name="string"
                                        value={entrevista.local}
                                        required
                                        onChange={(e) =>
                                                setDadosEntrevista((prev) => ({
                                                ...prev,
                                                local: e.target.value,
                                                }))
                                            }
                                        className="w-full bg-transparent outline-none"
                                    />
                            </div>
                        </div>
                        <div className="flex col-span-1 flex-col">
                            <label className="px-2 font-semibold text-vinho text-m">Data:</label>
                            <div className="flex col-span-1 items-center gap-3 rounded-xl border border-vinho/70 w-full bg-[#E3E3E380] px-3 py-1">
                                <input
                                        type="date"
                                        name="date"
                                        value={entrevista.data}
                                        placeholder="dd/mm/aaaa"
                                        required
                                        onChange={(e) =>
                                            setDadosEntrevista((prev) => ({
                                            ...prev,
                                            local: e.target.value,
                                            }))
                                        }
                                        className="w-full text-center placeholder-text-center bg-transparent outline-none placeholder:text-vinho placeholder:font-corpo placeholder:text-sm"
                                    />
                            </div>
                        </div>
                    </div>
                    <SelectEntrevistadores
                        lista={listaEntrevistadores}
                        selecionados={dadosEntrevista.entrevistadores}
                        onChange={(ids) =>
                            setDadosEntrevista(prev => ({
                                ...prev,
                                entrevistadores: ids
                            }))
                        }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Transcrição */}
                        <div className="flex flex-col md:col-span-1 gap-2">
                            <label className="text-vinho text-base font-semibold">
                            Transcrição (PDF):
                            </label>

                            <div className="flex items-center gap-3">
                            <label
                                htmlFor="transcricao"
                                className="cursor-pointer shrink-0 rounded-md border border-vinho
                                        bg-[#E3E3E380] px-4 py-2 text-vinho font-corpo text-sm
                                        hover:bg-vinho hover:text-white transition"
                            >
                                Escolher arquivo
                            </label>

                            <span className="text-sm text-gray-500 truncate">
                                {transcricao?.name ?? "Nenhum arquivo"}
                            </span>

                            <input
                                id="transcricao"
                                type="file"
                                accept=".pdf,application/pdf"
                                className="hidden"
                                onChange={(e) =>
                                setTranscricao(e.target.files?.[0] ?? null)
                                }
                            />
                            </div>
                        </div>

                        {/* Áudio */}
                        <div className="flex flex-col md:col-span-1gap-2">
                            <label className="text-vinho text-base font-semibold">
                            Áudio:
                            </label>

                            <div className="flex items-center gap-3">
                            <label
                                htmlFor="audio"
                                className="cursor-pointer shrink-0 rounded-md border border-vinho
                                        bg-[#E3E3E380] px-4 py-2 text-vinho font-corpo text-sm
                                        hover:bg-vinho hover:text-white transition"
                            >
                                Escolher arquivo
                            </label>

                            <span className="text-sm text-gray-500 truncate">
                                {audio?.name ?? "Nenhum arquivo"}
                            </span>

                            <input
                                id="audio"
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                onChange={(e) =>
                                setAudio(e.target.files?.[0] ?? null)
                                }
                            />
                            </div>
                        </div>
                    </div>
                    <GridFotos
                        titulo="Fotos da entrevista"
                        fotos={fotosEntrevista}
                        onChange={setFotosEntrevista}
                        />

                        <GridFotos
                        titulo="Fotos marcantes"
                        fotos={fotosMarcantes}
                        onChange={setFotosMarcantes}
                        />
                </section>

                {/* Botão de envio */}
                <div className="flex w-full text-brancoPapel text-m font-corpo font-semibold justify-center items-center">
                    <button type="submit" className="w-35 h-7 text-center rounded hover:bg-ocre-hover bg-ocre justify-center items-center flex">
                        Cadastrar
                    </button>
                </div>

            </form>
        </div>
    );
};
export default CadastroEntrevistaForm;