import ListaEntrevistados from "../components/ListaEntrevistados";

const Entrevistados = () => {

    return (
        <div className="flex flex-col items-center px-4 w-full py-4">

            <div className="flex flex-col gap-8 max-w-4xl">

                <div className="w-full flex flex-col gap-2"> 
                    <h1>
                        Entrevistados
                    </h1>

                    <p className="font-corpo text-grafite text-justify text-base px-2 sm:px-6 py-0 my-0 h-fit">
                        As entrevistas reunidas neste acervo preservam as memórias, trajetórias e experiências de fotógrafos populares, pesquisadores 
                        e coordenadores. Cada relato contribui para compreender a fotografia como prática social, cultural e instrumento de 
                        construção da memória coletiva.
                    </p>
                </div>

                <div className="flex w-full items-center justify-center px-6">
                    <ListaEntrevistados />
                </div>
            </div>                
        </div>
    )
}

export default Entrevistados;