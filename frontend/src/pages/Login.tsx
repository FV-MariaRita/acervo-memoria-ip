import logo from "../../public/logo_icon.png"
import LoginForm from "../components/LoginForm";

const Login = () => {

    return (
        <div className="flex flex-col items-center mx-10 md:mx-24">

            <div className="flex flex-col w-full max-w-md py-8 px-4 sm:px-6 gap-10 border-2 border-solid border-vinho rounded-xl items-center justify-center my-10 shadow-[-8px_8px_12px_0px_rgba(90,30,45,0.20)]">

                <div className="flex flex-col gap-4"> 
                    <img 
                        src={logo}
                        alt="Logo Acervo Oral do Imagens do Povo"
                        className='w-auto h-10 shrink-0 object-contain md:h-18 sm:h-24'
                    />

                    <h2 className="text-3xl text-verde font-title">Login</h2>
                </div>
                

                <LoginForm />

            </div>
            
        </div>
    )
}

export default Login;