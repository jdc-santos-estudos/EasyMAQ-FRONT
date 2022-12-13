import { useContext, useState, useRef, useEffect } from 'react';
import { Row, Col, Container, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import logoBranca from '../../images/logo-branca.png';
import UserContext from '../../contexts/UserContext';
import CartContext from '../../contexts/CartContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Auth from '../../Auth';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faUser, faBars, faXmark, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import useOutsideClick from '../../hooks/useOutsideClick';
import useWindowDimensions from '../../hooks/useWindowDimensions';

import Show from '../ShowIf';
import ConfigContext from '../../contexts/ConfigContext';
import EMModal from '../../components/EMModal';
import FormContainer from '../FormContainer';
import LoadingContext from '../../contexts/LoadingContext';
import EMButton from '../EMButton';
import { toast } from 'react-toastify';
import appFactory from '../../services/appFactory';
import { inputValue } from '../../helpers';
import eventHandlers from '../../helpers/eventHandlers';

import './style.scss';

const Menu = props => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const { width } = useWindowDimensions();

  const { showHeader } = useContext(ConfigContext);

  const { userData, setUserData } = useContext(UserContext);
  const { setLoading } = useContext(LoadingContext);
  const { cart } = useContext(CartContext);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showMenuMobile, setShowMenuMobile] = useState(false);
  const [filtros, setFiltros] = useState({search: searchParams.get('search')});
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({});
  const [showRecuperarSenhaForm, setShowRecuperarSenhaForm] = useState(false);

  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef, () => setShowUserOptions(false));
  const onChangeFiltro = eventHandlers.onChange(filtros, setFiltros);

  const logout = () => {
    setShowUserOptions(false);
    setShowMenuMobile(false);
    setUserData(false);
    Auth.destroySession();
    navigate('/');
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleLogin = async (event) => {
    try {
      setLoading(true);
      const form = event.currentTarget;

      event.preventDefault();

      if (!form.checkValidity()) return toast.error('Preencha os campos corretamente!');

      setValidated(true);

      const data = await appFactory.login(formData);

      if (!data.success) {
        setLoading(false);
        return toast.error(data.message);
      }

      Auth.saveSession(data.dados);

      const userInfo = await appFactory.getUserInfo();

      setUserData(userInfo.dados);

      toast.success('Login efetuado com sucesso!');

      setShowModalLogin(false);
      setValidated(false);
      setFormData({});

      setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(e);
      setLoading(false);
    }
  }

  const handleRecuperarSenha = async (event) => {
    try {
      setLoading(true);
      const form = event.currentTarget;

      event.preventDefault();

      if (!form.checkValidity()) return toast.error('Preencha os campos corretamente!');

      setValidated(true);

      const data = await appFactory.redefinirSenha(formData);

      if (!data.success) {
        setLoading(false);
        return toast.error(data.message);
      }

      toast.success('Pedido enviado com sucesso! Verifique o seu e-mail.');

      setShowModalLogin(false);
      setValidated(false);
      setFormData({});

      setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(e);
      setLoading(false);
    }
  }

  const handleFormSearch = (e) => {
    e.preventDefault();
    if(filtros.search.length) {
      navigate('/?search='+filtros.search);
    } else {
      navigate('/');
    }
  }

  const goTo = (location) => {
    setShowModalLogin(false);
    navigate(location);
  }

  useEffect(() => {
    setFiltros({
      search: searchParams.get('search')
    })
  },[searchParams]);

  return (
    <>
      <Show if={showHeader} >
        <div className="menu">
          <Container fluid>

            <Row>
              <Col sm={2} xs={3}>
                <Link to="/" onClick={() => {
                  setShowMenuMobile(false);
                  setShowUserOptions(false);
                }}>
                  <img src={logoBranca} alt="" className="logo" />
                </Link>
              </Col>
              <Col md={{ span: 4, offset: 2 }} sm={{ span: 6 }} xs={{ span: 1 }} className='searchContainer'>
                <Form onSubmit={handleFormSearch}>
                  <InputGroup className="searchContainerPC">
                    <Form.Control
                      name="search"
                      onChange={onChangeFiltro}
                      value={inputValue(filtros?.search)}
                      placeholder="O que está procurando?"
                    />
                    <Button className="btnSearch" type="submit">
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
              <Col md={4} sm="4" xs="8" className="buttonsContainer">

                <Show if={!userData?.cd_usuario}>
                  <a className="menuButton itemPC" onClick={() => setShowModalLogin(true)}>Entrar</a>
                  <span className="menuDivisor itemPC">|</span>

                  <Link to="/cadastro" className="menuButton itemPC">
                    Cadastrar-se
                  </Link>
                </Show>

                <div className="userIconContainer itemMOBILE" onClick={() => setShowMenuMobile(!showMenuMobile)}>
                  <FontAwesomeIcon icon={showMenuMobile ? faXmark : faBars} className={"icon iconCart " + (showMenuMobile ? 'mobOn' : 'mobOff')} />
                </div>

                <Show if={userData?.cd_usuario}>
                  <div className="userIconContainer itemPC" onClick={() => setShowUserOptions(!showUserOptions)}>
                    <FontAwesomeIcon icon={faUser} className="icon iconCart" />
                  </div>
                </Show>

                {/* <Show if={!['ADMIN1','ADMIN2','FORNECEDOR'].includes(userData?.tipo_perfil)}> */}
                  <Link to="/carrinho">
                    <div className="cartContainer">
                      <div className="cartCircle">
                        <FontAwesomeIcon icon={faCartShopping} className="icon iconCart" />
                        <span
                          className={"nrItensCart " + (cart?.length > 9 ? 'nrItensCart2Digitos' : '')}
                        >
                          {cart?.length}
                        </span>
                      </div>
                    </div>
                  </Link>
                {/* </Show> */}
              </Col>
            </Row>
          </Container>
          <div className="userOptionsContainer" ref={wrapperRef} style={{ display: showUserOptions ? 'block' : 'none' }}>
            <ul>
              Olá, {userData?.nm_usuario?.split(' ')[0]}
              <hr />
              <Show if={['ADMIN1', 'ADM2'].includes(userData?.tipo_perfil)}>
                <li><Link to="/painel/configuracoes" onClick={() => setShowUserOptions(false)}>Gerenciar Configurações do site</Link></li>
                <li><Link to="/" onClick={() => setShowUserOptions(false)}>Gerenciar Usuários</Link></li>
              </Show>

              <li><Link to="/painel/maquinas" onClick={() => setShowUserOptions(false)}>{['ADMIN1', 'ADM2'].includes(userData?.tipo_perfil) ? 'Gerenciar ' : 'Minhas '}Máquinas</Link></li>
              <li><Link to="/painel/pedidos" onClick={() => setShowUserOptions(false)}>{['ADMIN1', 'ADM2'].includes(userData?.tipo_perfil) ? 'Gerenciar ' : 'Meus '}Pedidos</Link></li>
              <li><Link to="/painel/perfil" onClick={() => setShowUserOptions(false)}>Meu Perfil</Link></li>
              <li><div className="userOptionsLineDivisor"></div></li>
              <li><span className="btnLogout" onClick={() => { setShowUserOptions(false); logout(); }}>Deslogar</span></li>
            </ul>
          </div>

          <div className="userOptionsContainer userOptionsContainerMobile" style={{ display: showMenuMobile && width < 891 ? 'block' : 'none' }}>
            <ul>
              <li>
                {
                  userData && userData.nm_usuario && ("Olá, " + userData?.nm_usuario?.split(' ')[0])
                }
              </li>

              <Show if={!userData?.cd_usuario}>
                <li>
                  <a className="cursor-pointer" onClick={() => setShowModalLogin(true)}>Entrar</a>
                </li>
                <li>
                  <Link to="/cadastro" onClick={() => setShowMenuMobile(false)}>Cadastrar-se</Link>
                </li>
              </Show>


              <Show if={['ADMIN1', 'ADM2'].includes(userData?.tipo_perfil)}>
                <Link to="/painel/configuracoes" className="mobileMenuLink" onClick={() => setShowMenuMobile(false)}>
                  <li >Gerenciar Configurações do site</li>
                </Link>
                <Link to="/" className="mobileMenuLink" onClick={() => setShowMenuMobile(false)}>
                  <li >Gerenciar usuários</li>
                </Link>
              </Show>
              {
                userData && userData.nm_usuario && (
                  <>
                    <Link to="/painel/maquinas" className="mobileMenuLink">
                      <li onClick={() => setShowMenuMobile(false)}>
                        {['ADMIN1', 'ADM2'].includes(userData?.tipo_perfil) ? 'Gerenciar ' : 'Minhas '}
                        Máquinas
                      </li>
                    </Link>
                    <Link to="/painel/pedidos" className="mobileMenuLink">
                      <li onClick={() => setShowMenuMobile(false)}>
                        {['ADMIN1', 'ADM2'].includes(userData?.tipo_perfil) ? 'Gerenciar ' : 'Meus '}
                        Pedidos
                      </li>
                    </Link>
                    <Link to="/painel/perfil" className="mobileMenuLink">
                      <li onClick={() => setShowMenuMobile(false)}>Meu Perfil</li>
                    </Link>
                    <Link to="#" className="mobileMenuLink btnLogout" onClick={() => logout()}>
                      <li onClick={() => setShowMenuMobile(false)} >Deslogar</li>
                    </Link>
                  </>
                )
              }

            </ul>
          </div>
        </div>
        <div className="menuMobileMargin"></div>
      </Show>

      <EMModal
        modalProps={{
          "size": "md",
          "show": showModalLogin,
          "onHide": () => {
            setShowModalLogin(false);
            setShowRecuperarSenhaForm(false);
          }
        }}

        titulo={showRecuperarSenhaForm ? "Recuperar Senha":"Entrar"}
      >
        <Modal.Body>
          <Row>
            <Col>
              <Form className="formLogin" validated={validated} onSubmit={(evt) => {
                if (showRecuperarSenhaForm) {
                  handleRecuperarSenha(evt);
                } else {
                  handleLogin(evt);
                }
              }}>

                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Digite o seu email"
                      onChange={handleOnChange}
                      value={inputValue(formData?.email)}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Show if={!showRecuperarSenhaForm}>
                  <Form.Group controlId="senha">
                    <Form.Label>Senha</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">
                        <FontAwesomeIcon icon={faLock} />
                      </InputGroup.Text>
                      <Form.Control
                        name="senha"
                        value={inputValue(formData?.senha)}
                        type="password"
                        placeholder="Digite a sua senha"
                        onChange={handleOnChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <div style={{ textAlign: 'center' }}>
                    <EMButton type="submit" className="btnLogar" text="Entrar" />
                    <br />
                    <p className="btnRecuperarSenha">
                      <a className="cursor-pointer" onClick={() => setShowRecuperarSenhaForm(true)}>Esqueci minha senha</a>
                    </p>

                    <p className="btnCadastreSe">Não possui conta? <a className="cursor-pointer" onClick={() => goTo('/cadastro')}>cadastre-se!</a></p>
                  </div>
                </Show>

                <Show if={showRecuperarSenhaForm}>
                <div style={{ textAlign: 'center' }}>
                  <EMButton type="submit" className="btnLogar" text="Enviar" />
                  <br /><br />
                  <a className="cursor-pointer" onClick={() => setShowRecuperarSenhaForm(false)}>Voltar</a>                    
                </div>

                </Show>

                
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </EMModal>
    </>
  )
}

export default Menu;