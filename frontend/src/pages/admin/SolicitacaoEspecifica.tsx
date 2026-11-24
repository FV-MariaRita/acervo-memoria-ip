import { Link, useParams } from "react-router-dom";
//import type { Solicitacao, Solicitante } from "../types/solicitacao";
import { FileText } from "lucide-react";
import { useState } from "react";
import BotaoVerde from "../../components/buttons/BotaoVerde";
import BotaoVinho from "../../components/buttons/BotaoVinho";

const SolicitacaoEspecifica = () => {

    const {id} = useParams<{id: string}>(); 

    //const [solicitante, setSolicitante] = useState<Solicitante | null>(null); 
    //const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null); 
    const [status, setStatus] = useState<string>("pendente"); 

    const textClass = `text-grafite text-sm`;

    const labelClass = `text-vinho/80 text-sm font-semibold`

    const statusClass: Record<string, string> = {
        pendente: "text-yellow-600 bg-ocre/30",
        aprovada: "text-green-700 bg-verde/30",
        recusada: "text-red-700 bg-vinho/30",
    };

    const handleDownload = (path_termo : string) => {
        return window.open(path_termo, "_blank", "noopener,noreferrer");
    }

    function primeiraLetraMaiuscula (texto: string) {

        if (!texto) return '';
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }

    const handleStatusSolicitacao = (novoStatus: string) => {

        if (status !== "pendente") {
            alert(`Essa solicitação já foi ${status}.`);
            return;
        }

        const resposta = window.confirm(
            `Tem certeza que deseja ${
                novoStatus === "aprovada" ? "aprovar" : "recusar"
            } essa solicitação?`
        );

        if (!resposta) return;

        setStatus(novoStatus);
    };

    return (
        <div className="flex flex-col items-center">

            <div className="w-full max-w-5xl py-4 flex flex-col items-start justify-start gap-3">

                <h2 className="text-ocre text-2xl sm:text-3xl font-bold font-serif my-4 text-left">
                    Solicitação #{id}
                </h2>

                {/*container total*/}
                <div className="border-solid border border-marrom/30 px-6 py-6 flex flex-col gap-8 w-full rounded-xl">

                    {/*Dados do solicitante */}
                    <section className="flex flex-col gap-6">

                        <h3 className="text-[1.2rem] font-serif font-semibold text-vinho-hover">
                            Dados do solicitante
                        </h3>

                        {/*dados*/}
                        <div className="flex flex-col gap-4">

                            <div className="flex flex-row gap-4">
                                <p className={labelClass}>Nome:</p>
                                <p className={textClass}>
                                    {/*{solicitante?.nome} */}
                                    João Silva
                                </p>     
                            </div>

                            {/* E-mail */}
                            <div className="flex flex-row gap-4">
                                <p className={labelClass}>E-mail:</p>
                                <p className={textClass}>
                                    {/*{solicitante?.email}*/}
                                    joãosilva@gmail.com
                                </p>    
                            </div>

                            {/* CPF e telefone */}
                            <div className="flex flex-row gap-16">
                                
                                <div className="flex flex-row gap-4">
                                    <p className={labelClass}>CPF:</p>
                                    <p className={textClass}>
                                        {/*{solicitante?.cpf}*/}
                                        123.456.789-10
                                    </p>
                                </div>

                                <div className="flex flex-row gap-4">
                                    <p className={labelClass}>Telefone:</p>
                                    <p className={textClass} >
                                        {/*{solicitante?.telefone}*/}
                                        (21) 98765-4321
                                    </p>  
                                </div>
                            </div>
                        </div>
                    </section>
                

                    {/*Dados da solicitação*/}
                    <section className="flex flex-col gap-6">

                        <h3 className="text-[1.2rem] font-serif font-semibold text-vinho-hover">
                            Dados da solicitação #{id}
                        </h3>

                        <div className="flex flex-col gap-4">

                            {/*data e status*/}
                            <div className="flex flex-col sm:flex-row gap-16">

                                <div className="flex flex-row gap-4">
                                    <p className={labelClass}>Data:</p>
                                    <p className={textClass}>
                                        08/11/2026
                                    </p>
                                </div>

                                <div className="flex flex-row gap-4">
                                    <p className={labelClass}>Status:</p>
                                    <p className={`text-sm font-semibold rounded-xl px-2 w-fit ${statusClass[status]}`}>
                                        {primeiraLetraMaiuscula(status)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className={labelClass}>
                                    Motivação:
                                </p>

                                <p className={textClass}>
                                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu
                                </p>
                                    {/*solicitacao?.mensagem ? 
                                        <p className={textClass}>
                                            {solicitacao?.mensagem}
                                        </p>
                                    : 
                                        <p className={textClass}>
                                            Não há uma mensagem para esta solicitação
                                        </p>
                                    */}                                
                            </div>

                            <div className="flex flex-row gap-4 items-center align-middle py-1">
                                <p className={labelClass}>
                                    Termo de responsabilidade:
                                </p>

                                <button
                                    type="button"
                                    onClick={() => handleDownload(`/arquivos/termo-${id}.pdf`)}
                                    className="flex items-center gap-3 px-4 py-1 rounded-lg border border-verde/50 text-verde hover:bg-verde/10 hover:border-verde w-fit"
                                >
                                    <div className="relative">
                                        <FileText size={14} strokeWidth={1.8} />
                                    </div>

                                    <span className="text-sm font-semibold">
                                        Visualizar termo
                                    </span>
                                </button>                     
                            </div>

                            <div className="flex flex-row gap-4 items-center align-middle">
                                <p className="text-ocre text-sm font-semibold">
                                    Entrevista solicitada:
                                </p>
                                
                                <Link 
                                    to={`/entrevistados/${id}`} 
                                    className="font-corpo text-grafite hover:cursor-pointer hover:text-verde hover:font-semibold text-sm"
                                >
                                    Entrevista de Elisângela Leite realizada em 05/02/2025
                                </Link>
                            </div>   
                        </div>
                    </section>
                </div>

                {/*botões de aprovar ou recusar */}
                <div className="flex flex-col items-center justify-center w-full px-5">

                    <div className="flex flex-row items-center gap-20 w-[50%]">
                        {/*Aprovar*/}
                        <BotaoVerde tipo="submit" variante="borda" onClick={() => handleStatusSolicitacao("aprovada")}>
                            Aprovar
                        </BotaoVerde>

                        {/*Recusar*/}
                        <BotaoVinho tipo="submit" variante="borda" onClick={() => handleStatusSolicitacao("recusada")}>
                            Recusar
                        </BotaoVinho>
                    </div>
                </div>

            </div>
        </div>
    ) 
}

export default SolicitacaoEspecifica;