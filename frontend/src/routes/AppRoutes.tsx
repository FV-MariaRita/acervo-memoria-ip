import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layout/MainLayout';

import Home from '../pages/Home';
import Entrevistados from '../pages/Entrevistados';
import SobreNos from '../pages/Sobre';
import Entrevistadores from '../pages/Entrevistadores';
import EntrevistadoEspecifica from '../pages/EntrevistadoEspecifica';
import Login from '../pages/Login';
import Solicitacoes from '../pages/SolicitacaoTranscricao';
import Painel from '../pages/Painel';
import CadastroEntrevista from '../pages/CadastroEntrevista';
import CadastroEntrevistado from '../pages/CadastroEntrevistado';
import PainelSolicitacoes from '../pages/PainelSolicitacoes';
import SolicitacaoEspecifica from '../pages/SolicitacaoEspecifica';
function AppRoutes() {

    return (

        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/entrevistados' element={<Entrevistados />} />
                <Route path='/sobre-nos' element={<SobreNos />} />
                <Route path='/entrevistadores' element={<Entrevistadores />} />
                <Route path={'/entrevistados/:id'} element={<EntrevistadoEspecifica  />} />
                <Route
                    path="/entrevistados/:id_entrevistado/entrevista/:data_entrevista/solicitar-transcricao"
                    element={<Solicitacoes />}
                />


                <Route path='/login' element={<Login />} />
                
                <Route path='/admin' element={<Painel  />} />
                <Route path='/admin/cadastro-entrevista' element={<CadastroEntrevista  />} />
                <Route path='/admin/cadastro-entrevistado' element={<CadastroEntrevistado  />} />
                <Route path='/admin/solicitacoes' element={<PainelSolicitacoes />}/>
                <Route path='/admin/solicitacoes/:id' element={<SolicitacaoEspecifica />} />
            </Route>           
        </Routes>

    );
}

export default AppRoutes; 