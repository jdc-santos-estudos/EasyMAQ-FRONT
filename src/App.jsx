// import config from './config.json'
import { useState, useEffect } from 'react';
import Auth from './Auth';
import LoadingScreen from './components/LoadingScreen';
import Config from './config.json';

import PagesRoutes from './routes';
import { ToastContainer } from 'react-toastify';

import ConfigContext from './contexts/ConfigContext';
import LoadingContext from './contexts/LoadingContext';
import UserContext from './contexts/UserContext';
import CartContext from './contexts/CartContext';
import cartFactory from './services/cartFactory';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.scss';

import appFactory from './services/appFactory';
import { getCookie } from './helpers';

const App = () => {
  let carregarConfig = true;

  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [loading, setLoading] = useState(0);
  const [userData, setUserData] = useState(false);
  const [config, setConfig] = useState(false);
  const [cart, setCart] = useState([]);
  const [useCookies, setUseCookies ] = useState('x');

  useEffect(() => {

    if (carregarConfig) {
      async function getConfig() {
        try {
          setLoading(true);

          let data = Config.localConfig;

          if (!localStorage.getItem('useLocalConfig')) data = await appFactory.getConfigFront();          

          if (!data.success) throw new Error('Erro ao carregar as configuracoes do FRONT');

          // se tiver token, recupera os dados do usuário antes de iniciar o restante da aplicação

          if(!getCookie('EasyMAQ')) {
            Auth.destroySession();
            cartFactory.destroyCart();
          }

          if (Auth.getSession()) {
            const userInfo = await appFactory.getUserInfo();
            setUserData(userInfo.dados);
          }

          const cartItens = cartFactory.getLocalItens();
          setCart(cartItens ? cartItens : []);

          const cfgs = data.dados.reduce((c,a) => {
            if(a.key != '') c[a.key] = a.value;
            return c;
          },{});

          setConfig(cfgs);
          setLoading(false);
        } catch (e) {
          setLoading(false);
          console.log(e);
        }
      }
      getConfig();
    }

    carregarConfig = false;
  }, []);

  // só carrega o restante do App se ja tiver carregado o config.
  if (!config) return <LoadingScreen show={loading} />;

  return (
    <>
      <ConfigContext.Provider value={{
        config,
        showHeader,
        setShowHeader,
        showFooter,
        setShowFooter,
        useCookies,
        setUseCookies
      }}>
        <LoadingContext.Provider value={{ loading, setLoading }}>
          <CartContext.Provider value={{ cart, setCart }}>
            <UserContext.Provider value={{ userData, setUserData }}>
              <LoadingScreen show={loading} />
              <PagesRoutes />
              <ToastContainer theme={'colored'} />
            </UserContext.Provider>
          </CartContext.Provider>
        </LoadingContext.Provider>
      </ConfigContext.Provider>
    </>
  )
};

export default App;