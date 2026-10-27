import type { EntrevistadorLista } from "../types/entrevistador";

const CardEntrevistador = ({nome, bio, path_foto}: EntrevistadorLista) => {

    return (
        <>

        <div className="px-8 py-4 flex flex-row gap-2 justify-evenly max-w-2xl">

            <img src={path_foto} className="rounded-2xl object-cover w-32 h-44 shrink-0"/>

            <div className="flex flex-col gap-2 pt-2 max-w-3/5">

                <div className="font-semibold text-lg text-grafite">{nome}</div>

                <p className="text-sm font-corpo text-justify text-grafite w-auto">
                    {bio}
                </p>

            </div>            

        </div>
        
        </>
    )

}

export default CardEntrevistador