import { useState } from "react";
import TabelaSolicitacoes from "../../components/TabelaSolicitações";
import { solicitacoes } from "../../data/solicitacoes";

type StatusFiltro = "todos" | "aprovada" | "pendente" | "recusada";
type OrdemData = "recentes" | "antigas";

const PainelSolicitacoes = () => {

    const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("todos");
    const [ordemData, setOrdemData] = useState<OrdemData>("recentes");

    //filtros
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

        <div className="flex flex-col items-center py-4">

            <div className="w-full max-w-4xl py-4 flex flex-col gap-4 items-start justify-start">                

                <h2 className="text-ocre text-3xl sm:text-3xl font-bold font-serif py-4 text-left">
                    Solicitações realizadas
                </h2>

                {/*filtros*/}
                <div className="w-full flex flex-wrap gap-4 mb-6">

                    <div className="flex flex-col gap-1">
                        <label htmlFor="status" className="font-corpo text-grafite font-semibold">
                            Status
                        </label>
                        
                        <div className="border-2 border-vinho rounded-xl  bg-brancoPapel/30 px-3">
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

                    <div className="flex flex-col gap-1">
                        <label htmlFor="ordem" className="font-corpo text-grafite font-semibold">
                            Ordenar por
                        </label>

                        <div className="border-2 border-vinho rounded-xl  bg-brancoPapel/30 px-3">

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