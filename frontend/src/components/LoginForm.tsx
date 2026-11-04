import { Link, useNavigate } from "react-router-dom";
import { CircleUserRound, Lock, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { loginTeste } from "../services/authTemp";


const LoginForm = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState(""); 
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [erroEmail, setErroEmail] = useState("");
    const [erroLogin, setErroLogin] = useState(""); 

    const validaEmail = (email: string) => {

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(email);
    }

    const handleEmailChange = (val:string) => {

        setEmail(val); 

        if (val !== "" && !validaEmail(val)) {
            setErroEmail("Digite um email válido")
        }
        else {
            setErroEmail("");
        }
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault(); 

        setErroLogin(""); 

        if (!validaEmail(email)) {
            setErroEmail("Digite um e-mail válido.");
            return;
        }

        try {
            await loginTeste(email, senha);
            navigate("/admin");

        } catch (erro) {
            setErroLogin(
                erro instanceof Error
                    ? erro.message
                    : "Não foi possível realizar o login."
            );
        };
    }

    return (

        <div className="w-full flex flex-col gap-6 justify-center items-center">

            <form className="flex flex-col gap-10 justify-center items-center" onSubmit={handleSubmit}>

                <div className="flex flex-col gap-6">

                    <div className="flex items-center gap-3 border-b-2 border-vinho w-88 bg-[#E3E3E380] px-3 py-2">

                        <CircleUserRound size={20} className="text-vinho shrink-0" />

                        <input
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Email"
                            autoComplete="username"
                            required
                            onChange={(e) => handleEmailChange(e.target.value)}
                            className="w-full bg-transparent outline-none placeholder:text-vinho/70 placeholder:font-semibold placeholder:text-sm"
                        />
                    </div>
                    {erroEmail && (
                            
                        <p className="text-red-900 text-sm font-semibold">
                            {erroEmail}
                        </p>
                    )}

                    <div className="flex items-center gap-3 border-b-2 border-vinho w-88 bg-[#E3E3E380] px-3 py-2">

                        <Lock size={20} className="text-vinho shrink-0" />

                        <input
                            type={mostrarSenha ? "text" : "password"}
                            name="senha"
                            value={senha}
                            placeholder="Senha"
                            required
                            onChange={(e) => {
                                setSenha(e.target.value);
                                setErroLogin("");
                            }}
                            className="w-full bg-transparent outline-none placeholder:text-vinho/70 placeholder:font-semibold placeholder:text-sm"
                        />

                        <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            className="text-vinho"
                        >
                            {mostrarSenha
                                ? <EyeOff size={20} />
                                : <Eye size={20} />
                            }
                        </button>
                    </div>

                    {erroLogin && (
                        <p className="text-red-900 text-sm font-semibold">
                            {erroLogin}
                        </p>
                    )}
                </div>

                <button 
                    type="submit"
                    className="bg-vinho text-branco w-64 h-6 font-serif rounded hover:bg-vinho-hover/70 hover:shadow-[8px_8px_12px_0px] hover:cursor-pointer"
                >
                    Entrar
                </button>

                <Link to='/login'>
                    <p className="text-ocre underline font-semibold text-base hover:font-bold">
                        Esqueci a senha
                    </p>
                </Link>
                 
            </form>

        </div>
    )

}

export default LoginForm;