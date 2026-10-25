import ListaEntrevistados from "../components/ListaEntrevistados";

const Entrevistados = () => {

    return (
        <div className="flex flex-col items-center mx-10 md:mx-24">
            
            <div className="w-full max-w-4xl py-4"> 

                <h1>
                    Entrevistados
                </h1>

                <p className="font-corpo text-grafite text-justify text-base mb-6 px-6">
                    As entrevistas reunidas neste acervo preservam as memórias, trajetórias e experiências de fotógrafos populares, pesquisadores 
                    e coordenadores. Cada relato contribui para compreender a fotografia como prática social, cultural e instrumento de 
                    construção da memória coletiva.
                </p>
                
                <div className="flex items-center justify-center">
                    <ListaEntrevistados />
                </div>
                

            </div>         
        
        </div>
    )
}

export default Entrevistados;