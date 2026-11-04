import { useState } from "react";
import type { FormEvent } from "react";

import { criarSolicitacao } from "../../services/solicitacaoTemp";
import { useNavigate, useParams } from "react-router-dom";

import type { SolicitacaoCreate } from "../../types/solicitacao";

interface ErrosFormulario {
    nome?: string;
    email?: string;
    cpf?: string;
    telefone?: string;
    rua?: string;
    cep?: string;
    cidade?: string;
    uf?: string;
    pais?: string;
}

const SolicitacaoForm = () => {
    const navigate = useNavigate();

    const { id_entrevistado, id_entrevista } = useParams<{
        id_entrevistado: string;
        id_entrevista: string;
    }>();

    const [erros, setErros] = useState<ErrosFormulario>({});
    const [enviando, setEnviando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState("");

    // Estilos dos elementos do formulário
    const inputClass = `
        w-full h-10 px-3
        bg-[#F5F1E8]
        border border-grafite/70
        rounded-xl
        text-vinho text-sm font-medium
        outline-none
        focus:ring-2 focus:ring-vinho/30
        placeholder:text-ocre/80
    `;

    const labelClass = `
        text-vinho
        text-sm
        font-semibold
    `;

    const erroClass = "text-red-600 text-xs font-medium";

    // Funções auxiliares de validação
    const validarEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validarCPF = (cpf: string): boolean => {
        cpf = cpf.replace(/\D/g, "");

        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += Number(cpf[i]) * (10 - i);
        }

        let resto = (soma * 10) % 11;
        const digito1 = resto === 10 ? 0 : resto;

        if (digito1 !== Number(cpf[9])) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += Number(cpf[i]) * (11 - i);
        }

        resto = (soma * 10) % 11;
        const digito2 = resto === 10 ? 0 : resto;

        return digito2 === Number(cpf[10]);
    };

    const validarTelefone = (telefone: string): boolean => {
        const numeros = telefone.replace(/\D/g, "");
        return numeros.length === 10 || numeros.length === 11;
    };

    const validarCEP = (cep: string): boolean => {
        const numeros = cep.replace(/\D/g, "");
        return numeros.length === 8;
    };

    const validarUF = (uf: string): boolean => {
        return /^[A-Za-z]{2}$/.test(uf);
    };

    // Validação de todos os campos executada APENAS ao enviar
    const validarFormulario = (formData: FormData): boolean => {
        const novosErros: ErrosFormulario = {};

        const nome = String(formData.get("nome") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const cpf = String(formData.get("cpf") ?? "");
        const telefone = String(formData.get("telefone") ?? "");
        const rua = String(formData.get("rua") ?? "").trim();
        const cep = String(formData.get("cep") ?? "");
        const cidade = String(formData.get("cidade") ?? "").trim();
        const uf = String(formData.get("uf") ?? "").trim();
        const pais = String(formData.get("pais") ?? "").trim();

        if (!nome) novosErros.nome = "Informe seu nome.";

        if (!email) {
            novosErros.email = "Informe seu e-mail.";
        } else if (!validarEmail(email)) {
            novosErros.email = "Digite um e-mail válido.";
        }

        if (!cpf) {
            novosErros.cpf = "Informe seu CPF.";
        } else if (!validarCPF(cpf)) {
            novosErros.cpf = "Informe um CPF válido.";
        }

        if (!telefone) {
            novosErros.telefone = "Informe seu telefone.";
        } else if (!validarTelefone(telefone)) {
            novosErros.telefone = "Informe um telefone válido.";
        }

        if (!rua) novosErros.rua = "Informe sua rua e número.";

        if (!cep) {
            novosErros.cep = "Informe seu CEP.";
        } else if (!validarCEP(cep)) {
            novosErros.cep = "Informe um CEP válido.";
        }

        if (!cidade) novosErros.cidade = "Informe sua cidade.";

        if (!uf) {
            novosErros.uf = "Informe a UF.";
        } else if (!validarUF(uf)) {
            novosErros.uf = "Informe uma sigla de estado válida.";
        }

        if (!pais) novosErros.pais = "Informe seu país.";

        // Atualiza todos os erros de uma só vez na tela
        setErros(novosErros);

        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (enviando) return;

        setErroEnvio("");

        const formulario = e.currentTarget;
        const formData = new FormData(formulario);

        // Se houver erros, cancela a submissão e exibe as mensagens
        if (!validarFormulario(formData)) {
            return;
        }

        const entrevistadoId = Number(id_entrevistado);
        const entrevistaId = Number(id_entrevista);

        if (
            !id_entrevistado ||
            !id_entrevista ||
            !Number.isInteger(entrevistadoId) ||
            entrevistadoId <= 0 ||
            !Number.isInteger(entrevistaId) ||
            entrevistaId <= 0
        ) {
            setErroEnvio("Não foi possível identificar a entrevista.");
            return;
        }

        const dados: SolicitacaoCreate = {
            solicitante: {
                nome: String(formData.get("nome")).trim(),
                email: String(formData.get("email")).trim(),
                cpf: String(formData.get("cpf")).replace(/\D/g, ""),
                telefone: String(formData.get("telefone")).replace(/\D/g, ""),
                rua: String(formData.get("rua")).trim(),
                cep: String(formData.get("cep")).replace(/\D/g, ""),
                cidade: String(formData.get("cidade")).trim(),
                uf: String(formData.get("uf")).trim().toUpperCase(),
                pais: String(formData.get("pais")).trim()
            },
            mensagem: String(formData.get("mensagem") ?? "").trim() || undefined
        };

        try {
            setEnviando(true);

            const solicitacao = await criarSolicitacao(entrevistaId, dados);

            navigate(
                `/entrevistados/${entrevistadoId}/entrevista/${entrevistaId}/solicitar-transcricao/termo/${solicitacao.id}`
            );
        } catch (erro) {
            console.error("Erro ao criar solicitação:", erro);
            setErroEnvio("Não foi possível registrar sua solicitação. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="w-full flex justify-center">
            <form
                onSubmit={handleSubmit}
                noValidate
                className="border-solid border-3 border-verde text-verde px-10 py-6 flex flex-col gap-10 w-full max-w-[50rem] rounded-xl shadow-[-8px_8px_12px_0px_rgba(90,30,45,0.20)]"
            >
                <h2 className="text-verde-hover font-semibold font-serif text-2xl text-center">
                    Formulário
                </h2>

                <section className="flex flex-col gap-2">
                    <h3 className="text-xl font-serif font-semibold">Dados pessoais</h3>

                    {/* Nome */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="nome" className={labelClass}>Nome:</label>
                        <input
                            type="text"
                            name="nome"
                            id="nome"
                            placeholder="Digite o nome:"
                            className={inputClass}
                        />
                        {erros.nome && <p className={erroClass}>{erros.nome}</p>}
                    </div>

                    {/* E-mail */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className={labelClass}>E-mail:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Digite seu email:"
                            className={inputClass}
                        />
                        {erros.email && <p className={erroClass}>{erros.email}</p>}
                    </div>

                    {/* CPF e telefone */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <label htmlFor="cpf" className={labelClass}>CPF:</label>
                            <input
                                type="text"
                                name="cpf"
                                id="cpf"
                                placeholder="Digite seu CPF:"
                                className={inputClass}
                                maxLength={14}
                            />
                            {erros.cpf && <p className={erroClass}>{erros.cpf}</p>}
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                            <label htmlFor="telefone" className={labelClass}>Telefone:</label>
                            <input
                                type="tel"
                                name="telefone"
                                id="telefone"
                                placeholder="Insira seu telefone:"
                                className={inputClass}
                                maxLength={15}
                            />
                            {erros.telefone && <p className={erroClass}>{erros.telefone}</p>}
                        </div>
                    </div>

                    {/* Rua */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="rua" className={labelClass}>Rua e número:</label>
                        <input
                            type="text"
                            name="rua"
                            id="rua"
                            placeholder="Insira seu endereço:"
                            className={inputClass}
                        />
                        {erros.rua && <p className={erroClass}>{erros.rua}</p>}
                    </div>

                    {/* CEP, cidade e UF */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <label htmlFor="cep" className={labelClass}>CEP:</label>
                            <input
                                type="text"
                                name="cep"
                                id="cep"
                                placeholder="Insira o CEP:"
                                className={inputClass}
                                maxLength={9}
                            />
                            {erros.cep && <p className={erroClass}>{erros.cep}</p>}
                        </div>

                        <div className="flex flex-col gap-1 flex-[2]">
                            <label htmlFor="cidade" className={labelClass}>Cidade:</label>
                            <input
                                type="text"
                                name="cidade"
                                id="cidade"
                                placeholder="Insira a cidade:"
                                className={inputClass}
                            />
                            {erros.cidade && <p className={erroClass}>{erros.cidade}</p>}
                        </div>

                        <div className="flex flex-col gap-1 flex-1">
                            <label htmlFor="uf" className={labelClass}>UF:</label>
                            <input
                                type="text"
                                name="uf"
                                id="uf"
                                placeholder="UF"
                                maxLength={2}
                                className={inputClass}
                            />
                            {erros.uf && <p className={erroClass}>{erros.uf}</p>}
                        </div>
                    </div>

                    {/* País */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="pais" className={labelClass}>País:</label>
                        <input
                            type="text"
                            name="pais"
                            id="pais"
                            placeholder="Insira o país:"
                            className={inputClass}
                        />
                        {erros.pais && <p className={erroClass}>{erros.pais}</p>}
                    </div>
                </section>

                {/* Motivação */}
                <section className="flex flex-col gap-2">
                    <h3 className="text-xl font-serif font-semibold">Motivação</h3>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="mensagem" className={labelClass}>
                            Justifique a motivação e o uso da transcrição:
                        </label>
                        <textarea
                            name="mensagem"
                            id="mensagem"
                            placeholder="Digite sua justificativa (opcional):"
                            rows={4}
                            maxLength={1000}
                            className={`${inputClass} h-24 py-3 resize-none`}
                        />
                    </div>
                </section>

                {/* Erro no envio */}
                {erroEnvio && (
                    <p className={erroClass} role="alert">
                        {erroEnvio}
                    </p>
                )}

                {/* Botão */}
                <section className="w-full items-center justify-center flex mt-5">
                    <button
                        type="submit"
                        disabled={enviando}
                        className="bg-vinho text-branco w-64 h-12 font-serif rounded-2xl hover:cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {enviando ? "Gerando solicitação..." : "Gerar termo de solicitação"}
                    </button>
                </section>
            </form>
        </div>
    );
};

export default SolicitacaoForm;