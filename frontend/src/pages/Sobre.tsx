import logo_icon from '../images/logo_icon.png'

const SobreNos = () => {

    return (
        <>
        <div className="flex flex-col items-center w-full px-4 sm:px-6">
            
            <div className="w-full max-w-4xl py-6 md:py-10"> 

                <h1 className="font-title text-vinho text-2xl font-bold mb-6 text-center sm:text-3xl">
                    Sobre o projeto
                </h1>

                <div className='flex flex-col items-center px-2 gap-6 md:flex-row md:gap-8 sm:px-6'>

                    <img 
                        src={logo_icon} 
                        alt='Logo Vozes do Imagens do Povo' 
                        className='w-auto h-28 shrink-0 object-contain md:h-40 sm:h-36' 
                    />

                    <p className="font-corpo text-grafite text-justify text-sm leading-relaxed sm:text-base">
                        O Vozes do Imagens do Povo é projeto educacional do Centro Federal de Educação Tecnológica Celso Suckow da Fonseca 
                        (CEFET-RJ), apoiado pela FAPERJ e CAPES. O projeto integra a iniciativa de divulgação científica do Instituto Nacional
                        de Ciência e Tecnologia (INCT) “Educação Transformadora: Antirracismo, Intersecionalidades e Justiça Social na América 
                        Latina”. Fundado em 2025, o INCT tem como um de seus objetivos produzir uma divulgação científica eficaz com foco.
                    </p>

                </div>      
                

            </div>         
        
        </div>

        </>
    )
}

export default SobreNos