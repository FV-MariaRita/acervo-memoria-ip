import CadastroEntrevistadoForm from "../components/CadastroEntrevistadoForm";

const CadastroEntrevistado = () => {

    return (
        <div className="flex flex-col items-center mx-10 md:mx-24">

            <div className="flex flex-col w-full max-w-[1000px]
                            py-8 px-4 sm:px-6 gap-10
                            border-2 border-solid border-vinho
                            rounded-xl items-center justify-center
                            my-10 shadow-[-8px_8px_12px_0px_rgba(90,30,45,0.20)]">

                <div className="text-3xl text-ocre font-title">
                    Cadastro do entrevistado
                </div>

                <CadastroEntrevistadoForm />

            </div>
        </div>
    );
};

export default CadastroEntrevistado;