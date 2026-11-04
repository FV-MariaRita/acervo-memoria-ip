import type { EntrevistaCreate } from "../types/entrevista";
import React, { useState } from "react";

const CadastroEntrevistaForm = (entrevista: EntrevistaCreate) => {
    const [dadosEntrevista, setDadosEntrevista] = useState<EntrevistaCreate>({
        local: "",
        data: "",
        entrevistadores: [],
        sumario: [],
        fotos: []
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const dados: EntrevistaCreate = {
            ...dadosEntrevista
        };

        console.log(dados);
    };
    return (
        <div className="w-full flex flex-col items-center px-4">

            {/* Cabeçalho */}
            <div className="w-full max-w-[1000px]">
                <h1 className="text-ocre text-title text-m text-center">
                    Cadastro
                </h1>
            </div>

            {/* Formulário */}
            <form className="w-full max-w-[1000px] flex flex-col gap-6">

                {/* Sobre a entrevista */}
                <section className="flex flex-col gap-4">
                    <h2>Sobre a entrevista</h2>

                    {/* Campos */}
                    <input
                            type="string"
                            name="string"
                            value={entrevista.local}
                            placeholder="Local"
                            required
                            className="w-full bg-transparent outline-none placeholder:text-vinho/70 placeholder:font-semibold placeholder:text-sm"
                        />
                </section>

                {/* Fotografias */}
                <section className="flex flex-col gap-4">
                    <h2>Dados da entrevista</h2>

                    {/* Campos */}
                </section>


                {/* Botão de envio */}
                <div className="flex justify-end">
                    <button type="submit">
                        Cadastrar
                    </button>
                </div>

            </form>
        </div>
    );
};
export default CadastroEntrevistaForm;