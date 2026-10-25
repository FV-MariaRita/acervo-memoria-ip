import logo from '../images/logo.png'
import logoInct from '../images/logo-inct.png'
import logoObservatorio from '../images/logo-observatorio-favelas.png'
import logoImagens from '../images/logo-imagens-do-povo.png'

const Footer = () => {

    return (
        <footer className=' bg-verde m-0 w-full h-auto p-6 flex flex-col items-center gap-6  md:flex-row md:justify-between md:items-center md:px-12'>

            <img 
                src={logo} 
                alt='Logo Vozes do Imagens do Povo' 
                className='w-auto h-8 object-contain md:h-10'
            />

            <div className='flex flex-wrap justify-center gap-4 md:flex-row md:justify-end md:gap-6 '>

                <a href='https://www.inctantirracismo.com.br/pt-BR' target='_blank' rel='noopener noreferrer'> 
                    <img src={logoInct} alt='INCT Antirracismo' className='w-auto h-10 object-contain md:h-12'/> 
                </a>

                <a href='https://imagensdopovo.org.br/' target='_blank' rel='noopener noreferrer'> 
                    <img src={logoImagens} alt='Imagens do Povo' className='w-auto h-10 object-contain md:h-12'/> 
                </a>

                <a href='https://observatoriodefavelas.org.br/' target='_blank' rel='noopener noreferrer'> 
                    <img src={logoObservatorio} alt='Observatorio de Favelas' className='w-auto h-10 object-contain md:h-12'/> 
                </a>

            </div>

        </footer>

    )

}

export default Footer 
