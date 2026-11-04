import SolicitacaoForm from "../components/solicitacoes/SolicitacaoForm";

const Solicitacoes = () => {

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl py-4 flex flex-col items-start justify-start">

                <div className="w-full max-w-4xl mb-4 py-4 flex flex-col items-start justify-start">
                    <h1 className="text-2xl w-full">
                        Solicitação de acesso à transcrição
                    </h1>

                    <p className="font-corpo text-grafite text-center text-base mb-6 pr-6 w-full">
                        Preencha o formulário para solicitar acesso à transcrição
                        dessa entrevista.
                    </p>
                </div>

                <div className="w-full flex items-center justify-center mb-8">
                    <SolicitacaoForm />
                </div>

            </div>
        </div>
    );
};

export default Solicitacoes;