import logo from '../images/logo.png'
import logoInct from '../images/inct.png'
import logoObservatorio from '../images/logo-observatorio-favelas.png'
import logoImagens from '../images/logo-imagens-do-povo.png'

const Footer = () => {

    return (
        <footer className='bg-verde m-0 w-full h-auto p-6
        flex flex-col items-start gap-2'>

            <img src={logo} alt='Logo Vozes do Imagens do Povo' className='w-auto h-8 object-contain'/>

            <div className='flex flex-row gap-1 items-left '>
                <a href='https://www.inctantirracismo.com.br/pt-BR'> 
                    <img src={logoInct} alt='INCT Antirracismo' className='w-auto h-12 object-contain'/> 
                </a>
                <a href='https://imagensdopovo.org.br/'> 
                    <img src={logoImagens} alt='Imagens do Povo' className='w-auto h-12 object-contain'/> 
                </a>
                <a href='https://observatoriodefavelas.org.br/'> 
                    <img src={logoObservatorio} alt='Observatorio de Favelas' className='w-auto h-12 object-contain'/> 
                </a>
            </div>

        </footer>

    )

}

export default Footer 