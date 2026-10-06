import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layout/MainLayout';

import Home from '../pages/Home';
import Entrevistas from '../pages/Entrevistas';


function AppRoutes() {

    return (

        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/entrevistas' element={<Entrevistas />} />
            </Route>           
        </Routes>

    )
}

export default AppRoutes; 