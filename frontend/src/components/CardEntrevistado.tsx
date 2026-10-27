import type { EntrevistadoLista } from "../types/entrevistado"

const CardEntrevistado = ({nome, path_foto, funcao}: EntrevistadoLista) => {

    return (
        <>
            <div className='bg-ocre flex items-center gap-3 w-full rounded-2xl p-3 my-1 md:justify-start md:gap-4 md:p-4'>
                
                <img 
                    src={path_foto} 
                    alt={`Foto de ${nome}`}
                    className="rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover shrink-0"
                />

                <div className='flex flex-col gap-2.5 min-w-0 flex-nowrap justify-start'>
                    
                    <h4 className="font-title text-base sm:text-lg font-bold text-branco truncate leading-tight">
                        {nome}
                    </h4>
                    
                    <div className="font-corpo text-xs sm:text-sm text-branco/80 italic truncate">
                        {funcao} 
                    </div>

                </div>

            </div>
        </>
    )
}

export default CardEntrevistado