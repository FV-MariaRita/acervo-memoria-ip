import { Link } from "react-router-dom";
import ListaSolicitacoes from "../components/ListaSolicitacoes";

const Painel = () => {
    return (
    <div className="flex flex-col items-center px-4 py-8 gap-10 w-full">
        <div className="flex w-full max-w-[1000px] justify-between">
            <Link to="/cadastro-entrevistado" className="w-1/5">
                <button className="w-full bg-vinho text-branco text sm md:text-base font-bold font-corpo px-4 py-2 rounded">
                    Criar entrevistado
                </button>
            </Link>
            <Link to="/cadastro-entrevista" className="w-1/5">
                <button className="w-full bg-vinho text-branco text sm md:text-base font-bold font-corpo px-4 py-2 rounded">
                    Criar entrevista
                </button>
            </Link>
            <Link to="/painel" className="w-1/5">
                <button className=" w-full bg-vinho text-branco text sm md:text-base font-bold font-corpo px-4 py-2 rounded">
                    Criar entrevistador
                </button>
            </Link>
            <Link to="/painel" className="w-1/5">
                <button className="w-full bg-vinho text-branco text sm md:text-base font-bold font-corpo px-4 py-2 rounded">
                    Excluir entrevistador
                </button>
            </Link>
        </div>
        <div className="w-full max-w-[1000px] h-auto flex flex-col justify-center items-center rounded gap-1">
            <div className="w-full max-w-[1000px] h-auto flex flex-col justify-center items-center bg-brancoPapel-hover/40 rounded gap-1 border border-verde">
                <div className="flex items-center gap-1 w-full h-8 rounded text-center bg-verde font-bold text-grafite text-xs md:text-base">
                    <div className="w-1/15 items-center">
                        ID
                    </div >
                    <p>|</p>
                    <div className="w-2/5 items-center px-2 text-left">
                        Solicitante
                    </div>
                    <p>|</p>
                    <div className="w-1/5 items-center">
                        Entrevistado
                    </div>
                    <p>|</p>
                    <div className="w-2/15 items-center">
                        Data
                    </div>
                    <p>|</p>
                    <div className="w-2/15 items-center">
                        Status
                    </div>
                    <p>|</p>
                    <div 
                        className = "w-1/15 flex items-center justify-center">
                        Abrir
                    </div>
                </div>
                <div className="flex item-center w-full px-1 ">
                    <ListaSolicitacoes />
                </div>
            </div>
        </div>
    </div>
    );
}

export default Painel;

/*<div className="text-grafite-hover text-xl sm:text-3xl font-bold font-serif my-4 text-center">
                Solicitações
            </div>
            */