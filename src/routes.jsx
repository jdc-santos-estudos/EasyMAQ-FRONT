import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Home from './pages/Home';
import LayoutPage from './pages/LayoutPage';
import Dashboard from './pages/Dashboard';
import Carrinho from './pages/Carrinho';
import Cadastro from './pages/Cadastro';
import NotFound from './pages/NotFound';

// maquinas
import MaquinaForm from './pages/Maquina/Form';
import MaquinaTable from './pages/Maquina/Table';
import MaquinaInfo from './pages/Maquina/Info';

// pedidos
import PedidoTable from './pages/Pedidos/Table';
import PedidoForm from './pages/Pedidos/Form';

import ConfiguracoesTable from './pages/Configuracoes/Table';
import EmailTemplates from './pages/Configuracoes/EMAIL_TEMPLATES';
import ConfigFront from './pages/Configuracoes/CONFIG_FRONT';
import TermosUso from './pages/Configuracoes/TERMOS_USO';
import TemplateContrato from './pages/Configuracoes/TEMPLATE_CONTRATO';
import Termos from './pages/Termos';

import ConfirmEmail from './pages/ConfirmEmail';
import StripeResponse from './pages/StripeResponse';
import RedefinirSenha from './pages/RedefinirSenha'
import Perfil from './pages/Perfil';

const PagesRoutes = () => {
    return(
        <Router>
            <LayoutPage>
                <Routes>
                    {/* <Route path="sso-authenticate" element={<SSOAuthenticate/>} /> */}
                    <Route path="" element={<Home/>} />
                    <Route path="dashboard" element={<Dashboard/>} />
                    <Route path="carrinho" element={<Carrinho/>} />
                    <Route path="cadastro" element={<Cadastro/>} />
                    <Route path="maquina/:cd_maquina" element={<MaquinaInfo/>} />
                    
                    <Route path="painel/maquina" element={<MaquinaForm/>} /> 
                    <Route path="painel/maquina/:cd_maquina" element={<MaquinaForm/>} />
                    <Route path="painel/maquinas" element={<MaquinaTable/>} />

                    <Route path="painel/pedido/:cd_pedido" element={<PedidoForm/>} />
                    <Route path="painel/pedidos" element={<PedidoTable/>} />

                    <Route path="termos" element={<Termos/>} />

                    {/* configurações */}
                    <Route path="painel/configuracoes" element={<ConfiguracoesTable/>} />
                    <Route path="painel/configuracoes/EMAIL_TEMPLATES" element={<EmailTemplates/>} />
                    <Route path="painel/configuracoes/CONFIG_FRONT" element={<ConfigFront/>} />
                    <Route path="painel/configuracoes/TERMOS_USO" element={<TermosUso/>} />
                    <Route path="painel/configuracoes/TEMPLATE_CONTRATO" element={<TemplateContrato/>} />

                    <Route path="confirm-email" element={<ConfirmEmail/>} />

                    <Route path="retorno-stripe" element={<StripeResponse/>} />
                    <Route path="redefinir-senha" element={<RedefinirSenha/>} />
                    <Route path="painel/perfil" element={<Perfil/>} />
                
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </LayoutPage>
        </Router>
    );
}

export default PagesRoutes;