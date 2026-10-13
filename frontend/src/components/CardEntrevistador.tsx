//import type { EntrevistadorLista } from "../types/entrevistador"

interface CardProps {
    id: number
}

const CardEntrevistador = ({id} : CardProps) => {

    return (
        <>

        <div className="px-8 py-4 flex flex-row gap-4 justify-evenly">

            <img src="/src/images/ratao.jpg" className="rounded-2xl object-cover w-36 h-48 shrink-0"/>

            <div className="flex flex-col gap-4 pt-2 max-w-3/5">

                <div className="font-semibold text-lg text-grafite">Ratão</div>

                <p className="text-sm font-corpo text-justify text-grafite w-auto">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
                    Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
                    Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. 
                    Donec.
                </p>

            </div>            

        </div>
        
        </>
    )

}

export default CardEntrevistador