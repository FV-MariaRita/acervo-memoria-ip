import { useState } from "react";
import TabelaSolicitacoes from "../components/TabelaSolicitações";
import { solicitacoes } from "../data/solicitacoes";
import { Link } from "react-router-dom";

type StatusFiltro = "todos" | "aprovada" | "pendente" | "recusada";
type OrdemData = "recentes" | "antigas";

const PainelSolicitacoes = () => {

    const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("todos");
    const [ordemData, setOrdemData] = useState<OrdemData>("recentes");

    // Obtém os entrevistados sem repetir nomes


    // Aplica os filtros e a ordenação
    const solicitacoesFiltradas = solicitacoes
        .filter((item) => {
            const correspondeStatus =
                statusFiltro === "todos" || item.status === statusFiltro;

            return correspondeStatus;
        })
        .sort((a, b) => {
            const diferenca = new Date(a.data).getTime() - new Date(b.data).getTime();

            return ordemData === "recentes" ? -diferenca : diferenca;
        });

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl py-4 flex flex-col items-start justify-start">

                <Link to='/admin'> 
                    <p className="font-corpo text-vinho text-sm mt-3 pr-6 w-full text-left font-semibold hover:cursor-pointer">
                        ← Voltar para o painel
                    </p>
                </Link>
                

                <h2 className="text-ocre text-2xl sm:text-3xl font-bold font-serif my-4 text-left">
                    Solicitações realizadas
                </h2>

                <p className="font-corpo text-grafite text-base mb-10 pr-6 w-full text-left">
                    Gerencie as solicitações de transcrição realizadas.
                </p>

                {/* Filtros */}
                <div className="w-full flex flex-wrap gap-4 mb-6">

                    {/* Filtro por status */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="status" className="font-corpo text-grafite font-bold">
                            Status
                        </label>
                        
                        <div className="border-2 border-ocre rounded-xl  bg-[#E3E3E380] px-3">
                            <select
                                id="status"
                                value={statusFiltro}
                                onChange={(e) => setStatusFiltro(e.target.value as StatusFiltro)}
                                className="px-3 py-2 text-vinho bg-transparent outline-none font-semibold placeholder:text-sm"
                            >
                                <option value="todos">Todos</option>
                                <option value="pendente">Pendente</option>
                                <option value="aprovada">Aprovada</option>
                                <option value="recusada">Recusada</option>
                            </select>
                        </div>
                        
                    </div>

                    {/* Ordenação por data */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="ordem" className="font-corpo text-grafite font-bold">
                            Ordenar por
                        </label>

                        <div className="border-2 border-ocre rounded-xl  bg-[#E3E3E380] px-3">

                            <select
                                id="ordem"
                                value={ordemData}
                                onChange={(e) => setOrdemData(e.target.value as OrdemData)}
                                className="px-3 py-2 text-vinho bg-transparent outline-none font-semibold placeholder:text-sm"
                            >
                                <option value="antigas">Mais antigas</option>
                                <option value="recentes">Mais recentes</option>
                            
                            </select>
                        </div>
                        
                    </div>
                </div>

                <TabelaSolicitacoes solicitacoes={solicitacoesFiltradas} />

            </div>
        </div>
    );
};

export default PainelSolicitacoes;