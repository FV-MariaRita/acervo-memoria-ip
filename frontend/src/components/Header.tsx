import { Link } from 'react-router-dom';
import logo from '../images/logo.png'
import {Menu, X} from 'lucide-react'
import { useState } from 'react';

const Header = () =>  {

    const [aberto, setAberto] = useState(false); 

    const menuDropdown = () => {
        setAberto(!aberto);
    }
    
    return (
        <header className='bg-verde w-full h-20 relative px-4 md:px-10 flex justify-between items-center z-50'>
            
           <Link to='/'>
                <img 
                    src={logo} 
                    alt='Logo Vozes do Imagens do Povo' 
                    className='w-auto h-8 h:12' 
                />
           </Link>

           <button 
                onClick={menuDropdown}
                className='md:hidden text-branco focus:outline-none p-2'
                aria-label='Menu'
            >
                {aberto ? 
                    <X className='w-6 h-6' />
                :
                    <Menu className='w-6 h-6' />
                }

            </button>
            
            <nav className={`font-title font-bold text-branco text-sm 
                ${aberto ? 'flex' : 'hidden'}
                
                flex-col absolute top-20 left-0 w-full bg-verde p-6 gap-4

                md:flex md:static md:flex-row md:w-auto md:p-0 md:shadow-none md:gap-8
                `}>

                <div className="flex items-center gap-4 md:gap-8">
                    <Link to="/" className='hover:underline whitespace-nowrap' onClick={() => setAberto(false)}>
                        Início
                    </Link>
                    <Link to="/entrevistados" className="hover:underline whitespace-nowrap" onClick={() => setAberto(false)}>
                        Entrevistados
                    </Link>
                    <Link to="/entrevistadores" className="hover:underline whitespace-nowrap" onClick={() => setAberto(false)}>
                        Entrevistadores
                    </Link>
                    <Link to="/sobre-nos" className="hover:underline whitespace-nowrap" onClick={() => setAberto(false)}>
                        Sobre
                    </Link>
                </div>
            </nav>

        </header>
    )
}

export default Header; 