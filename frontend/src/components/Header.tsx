import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { Menu, X, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

import { verificarAdminTeste, logoutTeste } from "../services/authTemp";

const Header = () => {

    const navigate = useNavigate();

    const [aberto, setAberto] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const sair = () => {
        logoutTeste();
        setAberto(false);
        navigate("/");
    }

    useEffect(() => {

        const atualizarAutenticacao = () => {
            setIsAdmin(verificarAdminTeste());
        };

        atualizarAutenticacao();

        window.addEventListener("authChange", atualizarAutenticacao);

        return () => {
            window.removeEventListener("authChange", atualizarAutenticacao);
        };

    }, []);

    const menuDropdown = () => {
        setAberto(!aberto);
    };

    const links = isAdmin? 
        [
            { nome: "Início", caminho: "/admin" },
            { nome: "Entrevistados", caminho: "/admin/entrevistados" },
            { nome: "Entrevistadores", caminho: "/admin/entrevistadores" },
            { nome: "Solicitações", caminho: "/admin/solicitacoes" },
        ]
        : 
        [
            { nome: "Início", caminho: "/" },
            { nome: "Entrevistados", caminho: "/entrevistados" },
            { nome: "Entrevistadores", caminho: "/entrevistadores" },
            { nome: "Sobre", caminho: "/sobre-nos" },
        ];

    return (
    
        <header className="bg-verde w-full h-20 relative px-4 md:px-10 flex justify-between items-center z-50">

            <Link to={isAdmin ? "/admin" : "/"}>
                <img
                src={logo}
                alt="Logo Vozes do Imagens do Povo"
                className="w-auto h-8"
                />
            </Link>

            <button
                onClick={menuDropdown}
                className="md:hidden text-branco focus:outline-none p-2"
                aria-label="Menu"
            >
                {aberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav 

                className={`font-title text-branco text-sm
                            ${aberto ? "flex" : "hidden"}
                            flex-col absolute top-20 left-0 w-full bg-verde p-6 gap-4
                            md:flex md:static md:flex-row md:w-auto md:p-0 md:shadow-none md:gap-8`}
            >

                <div className="flex items-center gap-4 md:gap-8 font-light">

                    {links.map((link) => (
                        <Link
                            key={link.caminho}
                            to={link.caminho}
                            className="hover:underline whitespace-nowrap tracking-wider"
                            onClick={() => setAberto(false)}
                        >
                            {link.nome}
                        </Link>
                    ))}
                </div>

                {isAdmin && (
                    <button
                        type="button"
                        onClick={sair}
                        className="flex items-center gap-2 rounded-lg border border-branco/60 px-3 py-2
                                 hover:text-ocre hover:border-ocre/60 hover:cursor-pointer transition-colors
                                whitespace-nowrap"
                    >
                        <LogOut size={16} />
                        Sair
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;