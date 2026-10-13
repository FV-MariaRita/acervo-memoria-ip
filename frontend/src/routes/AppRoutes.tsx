import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layout/MainLayout';

import Home from '../pages/Home';
import Entrevistas from '../pages/Entrevistas';
import SobreNos from '../pages/Sobre';
import Entrevistadores from '../pages/Entrevistadores';


function AppRoutes() {

    return (

        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/entrevistas' element={<Entrevistas />} />
                <Route path='/sobre-nos' element={<SobreNos />} />
                <Route path='/entrevistadores' element={<Entrevistadores />} />
            </Route>           
        </Routes>

    )
}

export default AppRoutes; 