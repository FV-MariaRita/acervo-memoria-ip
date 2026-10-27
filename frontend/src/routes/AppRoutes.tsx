import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layout/MainLayout';

import Home from '../pages/Home';
import Entrevistados from '../pages/Entrevistados';
import SobreNos from '../pages/Sobre';
import Entrevistadores from '../pages/Entrevistadores';
import EntrevistadoEspecifica from '../pages/EntrevistadoEspecifica';


function AppRoutes() {

    return (

        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/entrevistados' element={<Entrevistados />} />
                <Route path='/sobre-nos' element={<SobreNos />} />
                <Route path='/entrevistadores' element={<Entrevistadores />} />
                <Route path={'/entrevistados/:id'} element={<EntrevistadoEspecifica  />} />
            </Route>           
        </Routes>

    )
}

export default AppRoutes; 