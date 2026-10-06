import type { EntrevistadoLista } from "../types/entrevistado"

const CardEntrevistado = ({nome, path_foto, funcao}: EntrevistadoLista) => {

    return (
        <>
            <div className='bg-ocre flex gap-4 w-full h-16 rounded-2xl py-10 pl-4 pr-10 items-center my-1 justify-start'>
                
                <img src={path_foto} className='rounded-full w-16 h-16 object-cover'/>

                <div className='flex flex-col gap-1.5 flex-nowrap justify-start'>
                    
                    <h4 className='font-title text-lg font-bold text-branco'>{nome}</h4>
                    
                    <div className="flex flex-row gap-1 font-corpo text-branco text-xs italic">
                        {funcao} 
                    </div>

                </div>

            </div>
        </>
    )
}

export default CardEntrevistado