import ListaEntrevistadores from "../components/ListaEntrevistadores";

const Entrevistadores = () => {
  return (
    <div className="flex flex-col items-center px-4 w-full py-4">

      <div className="max-w-4xl flex flex-col gap-8">

        {/*titulo e texto*/}
        <div className="w-full flex flex-col gap-2">
          <h1 >Entrevistadores</h1>

          <p className="font-corpo text-grafite text-justify text-base px-2 sm:px-6 py-0 my-0 h-fit">
            Os entrevistadores que compõem este acervo são parte fundamental da construção dessas memórias. Por meio de suas escutas, perguntas e trocas, contribuem para registrar histórias, compartilhar experiências e preservar trajetórias que ajudam a compreender a fotografia popular e sua importância social, cultural e histórica.
          </p>
        </div>  

        {/*tabela de entrevistadores*/}
        <div className="flex flex-col items-center justify-start mx-auto gap-2 bg-verde-hover/40 w-full md:max-w-2xl rounded-2xl overflow-hidden">

          <div className="bg-verde-hover text-white font-bold text-left w-full pl-6 py-2 rounded-t-2xl" />
          <div className="w-full">
            <ListaEntrevistadores />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Entrevistadores;