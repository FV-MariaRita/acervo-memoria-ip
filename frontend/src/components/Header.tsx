import { Link } from 'react-router-dom';
import logo from '../images/logo.png'

const Header = () =>  {
    
    return (
        <header className=' bg-verde w-full h-20 m-0 py-6 px-10 flex justify-between items-center'>
            
           <Link to='/'>
                <img src={logo} alt='Logo Vozes do Imagens do Povo' className='w-auto h-12' />
           </Link>
            
            <nav className="font-title font-bold text-branco w-1/4 text-sm p-1">
                <div className="flex justify-around">
                    <Link to="/entrevistas">Entrevistados</Link>
                    <Link to="/entrevistadores">Entrevistadores</Link>
                    <Link to="/sobre-nos">Sobre</Link>
                </div>
            </nav>

        </header>
    )
}

export default Header; 