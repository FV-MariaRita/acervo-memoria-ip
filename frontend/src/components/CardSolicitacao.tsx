import type { SolicitacaoLista } from "../types/solicitacao";
import { ExternalLink } from 'lucide-react';


const CardSolicitacao = ({ id, nome, entrevistado, data, path_termo, status }: SolicitacaoLista) => {
    const handleDownload = () => {
        window.open(path_termo, "_blank", "noopener,noreferrer");
    };

    return (
            <div className="flex items-center gap-1 w-full h-8 rounded-xs text-center bg-verde-hover/40 font-bold text-grafite text-xs md:text-sm">
                <div className="w-1/15 items-center">
                    {id}
                </div >
                <p>|</p>
                <div className="w-2/5 items-center px-2 text-left">
                    {nome}
                </div>
                <p>|</p>
                <div className="w-1/5 items-center">
                    {entrevistado}
                </div>
                <p>|</p>
                <div className="w-2/15 items-center">
                    {data}
                </div>
                <p>|</p>
                <div className="w-2/15 items-center">
                    {status}
                </div>
                <p>|</p>
                <button 
                    onClick={handleDownload}
                    className = "w-1/15 flex items-center justify-center">
                    <ExternalLink size={20} strokeWidth={2.5} />
                </button>
            </div>
    );
};

export default CardSolicitacao;