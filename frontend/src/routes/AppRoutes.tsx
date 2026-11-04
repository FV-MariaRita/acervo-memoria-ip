import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layout/MainLayout';

import Home from '../pages/Home';
import Entrevistados from '../pages/Entrevistados';
import SobreNos from '../pages/Sobre';
import Entrevistadores from '../pages/Entrevistadores';
import EntrevistadoEspecifica from '../pages/EntrevistadoEspecifica';
import Login from '../pages/Login';
import ProtectedRoutes from './ProtectedRoutes';
import Teste from '../pages/Teste';
import Solicitacoes from '../pages/SolicitacaoTranscricao';
import Painel from '../pages/Painel';
import CadastroEntrevista from '../pages/CadastroEntrevista';
import CadastroEntrevistado from '../pages/CadastroEntrevistado';
function AppRoutes() {

    return (

        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/entrevistados' element={<Entrevistados />} />
                <Route path='/sobre-nos' element={<SobreNos />} />
                <Route path='/entrevistadores' element={<Entrevistadores />} />
                <Route path={'/entrevistados/:id'} element={<EntrevistadoEspecifica  />} />

                <Route path='/login' element={<Login />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path='/admin' element={<Teste />} />
                </Route>
                <Route path='/painel' element={<Painel  />} />
                <Route path='/cadastro-entrevista' element={<CadastroEntrevista  />} />
                <Route path='/cadastro-entrevistado' element={<CadastroEntrevistado  />} />
            </Route>           
        </Routes>

    );
}

export default AppRoutes; 