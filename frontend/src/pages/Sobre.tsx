import logo_icon from '../images/logo_icon.png'

const SobreNos = () => {

    return (
        <>
        <div className="flex flex-col items-center">
            
            <div className="w-full max-w-4xl py-4"> 

                <h1 className="font-title text-vinho text-2xl font-bold my-4 text-center">
                    Sobre o projeto
                </h1>

                <div className='flex flex-row items-center mx-auto px-16 mt-3 gap-3'>

                    <img src={logo_icon} alt='Logo Vozes do Imagens do Povo' className='w-auto h-36' />

                    <p className="font-corpo text-grafite text-justify text-sm mb-6 px-6">
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