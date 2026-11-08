import { Link } from "react-router-dom";
import type { SolicitacaoLista } from "../types/solicitacao";
import { ExternalLink } from "lucide-react";

interface TabelaProps {
    solicitacoes: SolicitacaoLista[];
}

const TabelaSolicitacoes = ({ solicitacoes }: TabelaProps) => {

    /*const handleDownload = (path: string) => {
        window.open(path, "_blank", "noopener,noreferrer");
    };*/

    return (
        <div className="w-full overflow-x-auto rounded-xl border-2 border-ocre text-center text-xs md:text-base font-bold text-grafite">

            <table className="w-full table-fixed border-collapse">
                <thead className="font-bold text-center text-verde">
                    <tr className="text-center text-preto">
                        <th className="w-[7%] border-r border-ocre/50 px-2 py-4">ID</th>
                        <th className="w-[28%] border-r border-ocre/50 px-3 py-4">Solicitante</th>
                        <th className="w-[25%] border-r border-ocre/50 px-3 py-4">Entrevistado</th>
                        <th className="w-[15%] border-r border-ocre/50 px-2 py-4">Data</th>
                        <th className="w-[15%] border-r border-ocre/50 px-2 py-4">Status</th>
                        <th className="w-[10%] px-2 py-4">Abrir</th>
                    </tr>
                </thead>

                <tbody className="border-t border-verde/30">
                    {solicitacoes.map((item) => (
                        <tr
                            key={item.id}
                            className="border-t border-verde/50 hover:bg-brancoPapel-hover text-sm"
                        >
                            <td className="border-r border-verde/30 px-2 py-4">{item.id}</td>
                            <td className="border-r border-verde/30 px-3 py-4">{item.nome}</td>
                            <td className="border-r border-verde/30 px-3 py-4">{item.entrevistado}</td>
                            <td className="border-r border-verde/30 px-2 py-4">{item.data}</td>
                            <td className="border-r border-verde/30 px-2 py-4">{item.status}</td>
                            <td className="px-2 py-4">
                                <Link to={`/admin/solicitacoes/${item.id}`}>
                                    <button
                                        //onClick={() => handleDownload(item.path_termo)}
                                        className="mx-auto flex items-center justify-center rounded p-2 text-verde hover:text-vinho hover:shadow-md"
                                        aria-label={`Abrir termo da solicitação ${item.id}`}
                                    >
                                        <ExternalLink size={24} strokeWidth={2.5} />
                                    </button>
                                </Link>
                                
                            </td>
                        </tr>
                    ))}

                    {solicitacoes.length === 0 && (
                        <tr>
                            <td colSpan={6} className="py-8 text-center">
                                Nenhuma solicitação encontrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TabelaSolicitacoes;