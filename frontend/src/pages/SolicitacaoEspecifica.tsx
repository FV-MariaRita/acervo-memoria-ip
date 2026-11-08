//import { useState } from "react";
import { Link, useParams } from "react-router-dom";
//import type { Solicitacao, Solicitante } from "../types/solicitacao";
import { FileText } from "lucide-react";
import { useState } from "react";

const SolicitacaoEspecifica = () => {

    const {id} = useParams<{id: string}>(); 

    //const [solicitante, setSolicitante] = useState<Solicitante | null>(null); 
    //const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null); 
    const [status, setStatus] = useState<string>("pendente"); 

    const textClass = `
        w-full h-10 py-1
        bg-[#F5F1E8]
        rounded-xl
        text-grafite text-sm font-medium
        outline-none
        focus:ring-2 focus:ring-vinho/30
        placeholder:text-ocre/80
    `;

    const labelClass = `
        text-vinho
        text-sm
        font-semibold `

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

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-3xl py-4 flex flex-col items-start justify-start gap-5">

                <Link to='/admin/solicitacoes'> 
                    <p className="font-corpo text-vinho text-sm mt-3 pr-6 w-full text-left font-semibold hover:cursor-pointer">
                        ← Voltar para o painel de solicitações
                    </p>
                </Link>
                    

                <h2 className="text-ocre text-2xl sm:text-3xl font-bold font-serif my-4 text-left">
                    Solicitação #{id}
                </h2>

                <div className="border-solid border-2 border-marrom/50 text-verde px-6 py-6 flex flex-col gap-10 w-full max-w-[50rem] rounded-xl">

                    {/*Dados do solicitante */}
                    <section className="flex flex-col gap-2">
                        <h3 className="text-[1.2rem] font-serif font-semibold">Dados do solicitante</h3>

                        {/* Nome */}
                        <div className="flex flex-col gap-1">
                            <p className={labelClass}>Nome:</p>
                            <p className={textClass}>
                                {/*{solicitante?.nome} */}
                                Anna Beatriz Waldheim da Silva
                            </p>     
                        </div>

                        {/* E-mail */}
                        <div className="flex flex-col gap-1">
                            <p className={labelClass}>E-mail:</p>
                            <p className={textClass}>
                                {/*{solicitante?.email}*/}
                                annabwaldheim@gmail.com
                            </p>    
                        </div>

                        {/* CPF e telefone */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <p className={labelClass}>CPF:</p>
                                <p className={textClass}>
                                    {/*{solicitante?.cpf}*/}
                                    210.842.517-95
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 flex-1">
                                <p className={labelClass}>Telefone:</p>
                                <p className={textClass} >
                                    {/*{solicitante?.telefone}*/}
                                    (21) 99669-5644
                                </p>  
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className={labelClass}>
                                Motivação
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
                    </section>
                </div>

                {/*Dados da solicitação*/}
                <div className="border-solid border-2 border-marrom/50 text-verde px-6 py-6 flex flex-col gap-6 w-full max-w-[50rem] rounded-xl">

                    <section className="flex flex-col gap-4">
                        <h3 className="text-[1.2rem] font-serif font-semibold">Dados da solicitacao</h3>

                        {/* ID, data e status da solicitação */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <p className={labelClass}>ID:</p>
                                <p className={textClass}>
                                    {id}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 flex-[2]">
                                <p className={labelClass}>Data da solicitação:</p>
                                <p className={textClass}>
                                    08/11/2026
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 flex-1">
                                <p className={labelClass}>Status:</p>
                                <p className={`text-sm font-semibold rounded-xl px-2 w-fit ${statusClass[status]}`}>
                                    {primeiraLetraMaiuscula(status)}
                                </p>
                            </div>
                        </div>
                            
                        <p className="text-ocre text-base font-semibold font-serif">
                            Entrevista solicitada
                        </p>

                        <div className="flex flex-col gap-1">

                            {/* Entrevistado */}
                            <div className="flex flex-col gap-1">
                                <p className={labelClass}>Entrevistado:</p>
                                <p className={textClass}>
                                    {/*{solicitante?.nome} */}
                                    Elisângela Leite
                                </p>      
                            </div>

                            {/* Data e local */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex flex-col gap-1 flex-1">
                                    <p className={labelClass}>Data:</p>
                                    <p className={textClass}>
                                        {/*{solicitante?.cpf}*/}
                                        05/02/2025
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1 flex-1">
                                    <p className={labelClass}>Local:</p>
                                    <p className={textClass} >
                                        {/*{solicitante?.telefone}*/}
                                        Observatório de Favelas, Maré
                                    </p>
                                </div>
                            </div>
                        </div> 

                        <div className="flex flex-col gap-1">
                            <p className={labelClass}>
                                Termo de responsabilidade 
                            </p>

                            <button
                                type="button"
                                onClick={() => handleDownload(`/arquivos/termo-${id}.pdf`)}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg border border-verde/ text-verde hover:bg-verde/10 hover:border-verde w-fit"
                            >
                                <div className="relative">
                                    <FileText size={20} strokeWidth={1.8} />
                                </div>

                                <span className="text-sm font-semibold">
                                    Visualizar termo
                                </span>
                            </button>                     
                        </div>

                    </section>
                </div>

                {/*botões de aprovar ou recusar */}
                <div className="flex flex-col items-center justify-center w-full px-5">

                    <div className="flex flex-row items-center justify-evenly w-[50%]">
                        {/*Aprovar*/}
                        <button
                            className=" w-fit h-10  text-verde border-verde border-solid border-2 text-base sm:text-sm
                                font-bold font-serif px-4 py-2 rounded-xl hover:shadow-lg hover:cursor-pointer"
                            onClick={() => setStatus("aprovada")}
                        >
                            Aprovar
                        </button>

                        {/*Recusar*/}
                        <button
                            className=" w-fit h-10  text-vinho border-vinho border-solid border-2 text-base sm:text-sm
                                font-bold font-serif px-4 py-2 rounded-xl hover:shadow-lg hover:cursor-pointer"
                            onClick={() => setStatus("recusada")}
                        >
                            Recusar
                        </button>
                    </div>


                </div>

            </div>
        </div>
    ) 
}

export default SolicitacaoEspecifica;