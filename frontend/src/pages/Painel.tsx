import { Link } from "react-router-dom";
//import ListaSolicitacoes from "../components/ListaSolicitacoes";
import TabelaSolicitacoes from "../components/TabelaSolicitações";
import { solicitacoes } from "../data/solicitacoes";

const Painel = () => {

    const solicitacoesRecentes = [...solicitacoes]
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 5);

    const botoesCadastro = [
        {
            "title": "Adicionar entrevistado",
            "linkTo": "/admin/cadastro-entrevistado"
        },
        {
            "title": "Adicionar entrevista para um entrevistado",
            "linkTo": "/admin/cadastro-entrevista"
        },
        {
            "title": "Adicionar entrevistador",
            "linkTo": "/admin/cadastro-entrevistador"
        }
    ];

    return (
        <>
        <div className="flex flex-col items-center px-4 py-8 gap-10 w-full">
            <h2 className="text-vinho text-2xl sm:text-3xl font-bold font-serif my-4 p-4 text-center border-solid border-vinho/30 border-b-3  shadow-md">
                Bem vindo, administrador!
            </h2>
            {/*
            <p className="text-grafite text-base text-justify">
                textinho textinho lalala
            </p>
            */}
            
            <div className="flex flex-col max-w-4xl gap-12">

                {/*Cadastro de conteúdos*/}
                <div className="flex flex-col gap-5 w-full">
                    <h3 className="text-[1.2rem] font-bold text-ocre font-serif">
                        Inclua novos conteúdos no site
                    </h3>

                    <div className="flex flex-wrap w-full max-w-4xl gap-10">

                        {botoesCadastro.map((item, index) => (
                            <Link key={index} to={item.linkTo} className="w-[30%]">
                                <button
                                    className=" w-full h-20 text-branco border-ocre border-solid border-2 bg-vinho text-sm md:text-base
                                        font-bold font-corpo px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:-translate-y-1
                                        hover:shadow-lg hover:cursor-pointeractive:translate-y-0active:scale-[0.98]
                                    "
                                >
                                    {item.title}
                                </button>
                            </Link>
                        ))}

                    </div>

                </div>

                {/*Painel de solicitações*/}
                <div className="flex flex-col gap-8 w-full">
                    
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[1.2rem] font-bold text-ocre font-serif">
                            Solicitações de transcrição
                        </h3>

                        <p className="font-semibold text-grafite text-left text-base pr-6 w-full">
                            As últimas solicitações realizadas estão descritas abaixo.
                        </p>
                    </div>
                   

                    <div className="flex flex-wrap gap-10">
                        <TabelaSolicitacoes solicitacoes={solicitacoesRecentes} />
                    </div>

                    <div className="w-fit self-end">
                        <Link to="/admin/solicitacoes">
                            <h3 className="text-base font-bold text-vinho font-serif text-right hover:bg-brancoPapel-hover rounded-xl px-5 hover:cursor-pointer">
                                Ver todas as solicitações
                            </h3>
                        </Link>
                        
                    </div>
                    
                </div>

            </div>
            
        </div>
        </>
    );
}

export default Painel; 


/*

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

<div className="text-grafite-hover text-xl sm:text-3xl font-bold font-serif my-4 text-center">
                Solicitações
            </div>
            

*/