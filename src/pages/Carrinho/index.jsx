import { useEffect, useContext, useState } from 'react';
import { Row, Col, Container, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import UserContext from '../../contexts/UserContext';
import CartContext from '../../contexts/CartContext';
import ConfigContext from '../../contexts/ConfigContext';
import cartFactory from '../../services/cartFactory';
import Carousel from 'react-bootstrap/Carousel';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EMButton from '../../components/EMButton';
import Show from '../../components/ShowIf';
import { inputValue, formataRG, formatarTelCel, regexPatterns, currencyFormat, toFixed, formataCEP, getMinutesDiff } from '../../helpers';
import eventHandlers from '../../helpers/eventHandlers';
import FormContainer from '../../components/FormContainer';
import EMSelectEstado from '../../components/EMSelectEstado';
import EMSelectCidade from '../../components/EMSelectCidade';
import LoadingContext from '../../contexts/LoadingContext';
import pedidoFactory from '../../services/pedidoFactory';
import { toast } from 'react-toastify';
import EMModal from '../../components/EMModal';
import { useNavigate } from 'react-router-dom';

import './style.scss';
const d = new Date();
d.setTime(d.getTime() + 2 * 60 * 60 * 1000);
const minIni = new Date(d.valueOf() - d.getTimezoneOffset() * 60000).toISOString().split('.')[0];

const Carrinho = props => {
  const history = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const { userData } = useContext(UserContext);
  const { useCookies } = useContext(ConfigContext);
  const { setLoading } = useContext(LoadingContext);

  const [showModal, setShowModal] = useState(false);
  const [listaCarrinho, setListaCarrinho] = useState([]);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({});
  const [valorTotal, setValorTotal] = useState(0);
  const [minTer, setMinTer] = useState('');

  const handleOnChange = eventHandlers.onChange(formData, setFormData);

  useEffect(() => {
    let novaLista = [];
    let vlTot = 0;
    novaLista = cart.reduce((r, a) => {

      vlTot = parseFloat(vlTot) + (a.vl_total ? parseFloat(a.vl_total) : parseFloat(a.vl_hora));
      vlTot = toFixed(parseFloat(vlTot), 2);

      const obj = {
        nm_fornecedor: a.nm_fornecedor,
        nm_razao_social_fornecedor: a.nm_razao_social_fornecedor,
        itens: [a]
      };

      if (r[a.cd_fornecedor]) {
        r[a.cd_fornecedor].itens.push(a);
      } else {
        r[a.cd_fornecedor] = obj;
      }

      return r;
    }, []);

    setValorTotal(vlTot);
    setListaCarrinho(novaLista);    
  }, [cart]);

  const removeItem = (item) => {
    let itens = useCookies ? (cartFactory.getLocalItens() || []) : (cart || []);
    itens = itens.filter(i => i.cd_maquina !== item.cd_maquina);
    if (useCookies) cartFactory.setLocalItens(itens);
    calcularTotal(itens);
    setCart(itens);
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const form = e.currentTarget;

      if (!form.checkValidity()) {
        e.stopPropagation();
        toast.warning("Existem erros no formulário, por favor verifique os campos marcados em vermelho.");
        setLoading(false);
        return;
      }
      const f = {...formData};

      f.rg_receptor = f.rg_receptor.replace(/[\D]/ig,'');
      f.tel_receptor = f.tel_receptor.replace(/[\D]/ig,'');
      f.cd_cep = f.cd_cep.replace(/[\D]/g,'');
      f.maquinas = cart.map(m => ({ cd_maquina: m.cd_maquina }));

      const res = await pedidoFactory.novoPedido(f);
      
      setLoading(false);

      if(!res.success) return toast.error('Erro ao tentar efetuar o pedido');  

      
      cartFactory.destroyCart();
      setCart([]);
      toast.success('Pedido enviado com sucesso');
      setShowModal(true);
      
    } catch (err) {
      toast.error('Erro ao tentar efetuar o pedido');
      setLoading(false);
      console.log(err)
    }
  }

  const handleModal = () => {
    setShowModal(false);
    history('/painel/pedidos');
  }

  const calcularTotal = (_cart = false) => {
    let totPedido = 0;

    if (formData?.dt_entrega && formData?.dt_devolucao) {
      const totMins = getMinutesDiff(formData?.dt_entrega, formData?.dt_devolucao);

      if (totMins > 0) {
        const c = _cart || cart;
        setCart(c.map(m => {
          m.vl_total = toFixed(toFixed(m.vl_hora / 60, 5) * totMins, 2);
          totPedido = toFixed(parseFloat(totPedido) + parseFloat(m.vl_total), 2);
          return m;
        }));
      }
    }
  }

  // atualiza a diferença em horas da data inicial para a final
  useEffect(() => {
    calcularTotal();
  }, [formData?.dt_entrega, formData?.dt_devolucao]);

  useEffect(() => {
    if (formData?.dt_entrega) {
      let _d = new Date(formData?.dt_entrega);
      let _a = new Date(_d.valueOf() - _d.getTimezoneOffset() * 60000);

      _a.setTime(_a.getTime() + 1 * 60 * 60 * 1000);

      setMinTer((_a.toISOString().split('.')[0]).slice(0, -3));
    }
  }, [formData?.dt_entrega]);

  return (
    <Container fluid className="carrinhoContainer">
      <Row>
        {/* itens do carrinho */}
        <Col lg={{ span: 6, offset: 3 }} sm={{ span: 10, offset: 1 }} xs={{ span: 12, offset: '0' }}>

          <div className="carrinho">
            <h1>Meu carrinho</h1>
            <hr />
            {
              listaCarrinho.length > 0 && listaCarrinho.map((f, k) => (
                <div key={k} className="fornecedorContainer">
                  <p className="fornecedorName">{f?.nm_razao_social_fornecedor ? f?.nm_razao_social_fornecedor : f?.nm_fornecedor}</p>

                  <ul className="listaMaquinas">
                    {
                      f.itens.map((m, km) => (
                        <li key={km} >
                          <Row>
                            <Col className="imgContainer">
                              <Carousel indicators={false} interval={null}>
                                {
                                  m?.imagens?.map((img, indexImg) => (
                                    <Carousel.Item key={indexImg}>
                                      <div style={{ backgroundImage: "url('" + img.fileUrl + "')" }} className="_cardImage"></div>
                                    </Carousel.Item>
                                  ))
                                }
                              </Carousel>
                            </Col>
                            <Col className="infoMaquina">
                              <span>
                                <FontAwesomeIcon
                                  onClick={() => removeItem(m)}
                                  className="btnRemoveDoCarrinho"
                                  title="Remover produto do carrinho"
                                  icon={faTrash}
                                />
                              </span>

                              <p><a className="cursor-pointer"><b>{m.nm_maquina}</b></a><br />
                                {currencyFormat(m.vl_hora)}/h <br /><b>TOTAL: {currencyFormat(inputValue(m?.vl_total, m.vl_hora))}</b>
                              </p>

                            </Col>
                          </Row>

                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))
            }
            {
              listaCarrinho.length == 0 && (
                <div style={{ textAlign: 'center' }}>
                  <p>Não existem itens no seu carrinho.</p>
                </div>
              )
            }
          </div>
        </Col>
      </Row>

      <Row>
        <Show if={!userData}>
          <div style={{ textAlign: 'center' }}>
            <p>Você precisa estar logado para finalizar o pedido.</p>
          </div>
        </Show>
        <Show if={userData && userData?.tipo_perfil != 'CLIENTE'}>
          <div style={{ textAlign: 'center' }}>
            <p>Você precisa estar logado com uma conta de CLIENTE para finalizar o pedido.</p>
          </div>
        </Show>

        <Show if={userData && userData?.tipo_perfil == 'CLIENTE'}>
          <Col lg={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }}>
            <FormContainer className="formCarrinho">
              <Form validated={validated} onSubmit={handleSubmit}>
                <h4>Dados do pedido</h4>
                <Row>
                  <div className="formFieldTitle">
                    <hr />
                    Dados do receptor<br />
                    <small style={{ fontSize: 13 }}>Insira aqui os dados de quem irá receber a(s) máquina(s)</small>
                  </div>
                  <Col lg={4} className="mb-3">
                    <Form.Label htmlFor="nm_receptor">Nome completo</Form.Label>
                    <Form.Control
                      type="text"
                      name="nm_receptor"
                      id="nm_receptor"
                      autoComplete="off"
                      value={inputValue(formData?.nm_receptor)}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(regexPatterns.alphaComEspaco, '');
                        handleOnChange(e);
                      }}
                      required
                    />
                  </Col>

                  <Col lg={4} className="mb-3">
                    <Form.Label htmlFor="rg_receptor">RG</Form.Label>
                    <Form.Control
                      type="text"
                      name="rg_receptor"
                      id="rg_receptor"
                      value={inputValue(formData?.rg_receptor)}
                      isInvalid={formData?.rg_receptor && formData?.rg_receptor?.length < 12 && !validated}
                      maxLength={12}
                      onChange={(e) => {
                        e.target.value = formataRG(e.target.value);
                        handleOnChange(e);
                      }}
                      required
                    />
                  </Col>
                  <Col lg={4} className="mb-3">
                    <Form.Label htmlFor="tel_receptor">Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder='(xx) xxxxx-xxxx'
                      onChange={(e) => {
                        e.target.value = formatarTelCel(e.target.value);
                        handleOnChange(e);
                      }}
                      name="tel_receptor"
                      id="tel_receptor"
                      value={inputValue(formData?.tel_receptor)
                      }
                      required
                    />
                  </Col>
                </Row>

                <div className="formFieldTitle">
                  <hr />
                  Endereço de entrega
                </div>
                <Row>

                  <Col sm={6} md={4}>
                    <EMSelectEstado
                      className="mb-4"
                      controlId="cd_estado"
                      form={formData}
                      setter={setFormData}
                      required
                    />
                  </Col>

                  <Col sm={6} md={4}>
                    <EMSelectCidade
                      className="mb-4"
                      controlId="cd_cidade"
                      form={formData}
                      setter={setFormData}
                      watch={formData?.cd_estado}
                      required
                      validated={validated}
                    />
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Label htmlFor="cd_cep">CEP</Form.Label>
                    <Form.Control
                      type="text"
                      id="cd_cep"
                      name="cd_cep"
                      value={inputValue(formData?.cd_cep)}
                      isInvalid={formData?.cd_cep && formData?.cd_cep?.length < 9 && !validated}
                      maxLength={9}
                      onChange={(e) => {
                        e.target.value = formataCEP(e.target.value);
                        handleOnChange(e);
                      }}
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="nm_logradouro">Logradouro</Form.Label>
                    <Form.Control
                      type="text"
                      id="nm_logradouro"
                      name="nm_logradouro"
                      value={inputValue(formData?.nm_logradouro)}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(regexPatterns.alphaNumericosComEspaco, '');
                        handleOnChange(e)
                      }}
                      required
                    />
                  </Col>

                  <Col sm={6} md={2} className="mb-3">
                    <Form.Label htmlFor="nm_usuario">Nº</Form.Label>
                    <Form.Control
                      type="text"
                      id="nr_local"
                      name="nr_local"
                      value={inputValue(formData?.nr_local)}
                      maxLength={7}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/[\D]/ig, '');
                        handleOnChange(e);
                      }}
                      required
                    />
                  </Col>

                  <Col sm={6} md={4} className="mb-3">
                    <Form.Label htmlFor="nm_bairro">Bairro</Form.Label>
                    <Form.Control
                      type="text"
                      id="nm_bairro"
                      name="nm_bairro"
                      value={inputValue(formData?.nm_bairro)}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(regexPatterns.alphaNumericosComEspaco, '');
                        handleOnChange(e);
                      }}
                      required
                    />
                  </Col>

                </Row>

                <Row>
                  <div className="formFieldTitle">
                    <hr />
                    Período da locação
                  </div>
                  <Col>
                    <Form.Group controlId="dt_entrega" className="mb-3">
                      <Form.Label>Data inicial</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="dt_entrega"
                        placeholder="Digite a data inicial da locação"
                        onChange={handleOnChange}
                        value={inputValue(formData?.dt_entrega)}
                        min={minIni.slice(0, -3)}
                        required
                      />
                      <Form.Text id="conf_senhaHelpBlock" muted>
                        A data inicial deve ser pelo menos 2hrs acima do horario que pedido está sendo feito.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="dt_devolucao" className="mb-3">
                      <Form.Label>Data final</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="dt_devolucao"
                        placeholder="Digite a data final da locação"
                        onChange={handleOnChange}
                        value={inputValue(formData?.dt_devolucao)}
                        min={minTer}
                        required
                      />
                      <Form.Text id="conf_senhaHelpBlock" muted>
                        O período minimo de locação é de uma hora.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <div className="formFieldTitle">
                    <hr />
                    Valor total do pedido: {currencyFormat(valorTotal)}
                  </div>
                  <Col>

                  </Col>
                </Row>

                <div style={{ textAlign: 'right' }}>
                  <hr />
                  <EMButton type="submit" text="Enviar pedido" />
                  <br />
                </div>
              </Form>
            </FormContainer>
          </Col>
        </Show>

      </Row>

      <EMModal
          modalProps={{
            "size": "lg",
            "show": showModal,
            "onHide": handleModal
          }}
          titulo="Pedido enviado com sucesso"
        >
          <Modal.Body>
            <Row>
              <Col className="text-center pt-3">
                <p>
                  O seu pedido foi enviado para o(s) fornecedore(s).<br/>
                  Eles serão notificados, e assim que avaliarem o seu pedido voce receberá uma notificação em seu e-mail!
                </p>
              </Col>
            </Row>
            <Row>
              <Col className="text-right mt-4 mb-2">
                <EMButton
                  text="OK"
                  onClick={handleModal}
                />
              </Col>
            </Row>
          </Modal.Body>
        </EMModal>
    </Container>
  )
}

export default Carrinho;