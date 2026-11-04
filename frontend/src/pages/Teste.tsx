import { useNavigate } from "react-router-dom";
import { logoutTeste } from "../services/authTemp";

const Teste = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutTeste();
        navigate("/login");
    };

    return (
        <div className="min-h-screen p-10 flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-verde">
                Painel administrativo
            </h1>

            <p>Você está autenticado!</p>

            <button
                onClick={handleLogout}
                className="bg-vinho text-white px-6 py-2 rounded w-fit"
            >
                Sair
            </button>
        </div>
    );
};

export default Teste;