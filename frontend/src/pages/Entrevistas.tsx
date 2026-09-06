import ListaEntrevistados from "../components/ListaEntrevistados";

const Entrevistas = () => {

    return (
        <div className="flex flex-col items-center">
            
            <div className="w-full max-w-4xl py-4"> 

                <h1 className="font-title text-vinho text-2xl font-bold my-4 text-center">
                    Entrevistas
                </h1>

                <p className="font-corpo text-grafite text-justify text-sm mb-6 px-6">
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

export default Entrevistas;