import { useEffect, useContext, useState } from 'react';
import { Row, Col, Container, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import UserContext from '../../../contexts/UserContext';
import CartContext from '../../../contexts/CartContext';
import ConfigContext from '../../../contexts/ConfigContext';
import cartFactory from '../../../services/cartFactory';
import Carousel from 'react-bootstrap/Carousel';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import EMButton from '../../../components/EMButton';
import Show from '../../../components/ShowIf';
import { inputValue, currencyFormat, toFixed, formataCEP, getMinutesDiff, getStatusPedido } from '../../../helpers';
import LoadingContext from '../../../contexts/LoadingContext';
import pedidoFactory from '../../../services/pedidoFactory';
import { toast } from 'react-toastify';
import EMModal from '../../../components/EMModal';
import { useNavigate, useParams } from 'react-router-dom';
import useLogged from '../../../hooks/useLogged';
import moment from 'moment';

import './style.scss';

const PedidoForm = props => {
  const { cd_pedido } = useParams();

  useLogged('/');
  const history = useNavigate();
  const { userData } = useContext(UserContext);
  const { setLoading } = useContext(LoadingContext);
  const [pedido, setPedido] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [listaCarrinho, setListaCarrinho] = useState([]);
  const [formData, setFormData] = useState({});
  const [minTer, setMinTer] = useState('');
  const [totPedido, setTotPedido] = useState(0);
  const [novoStatus, setNovoStatus] = useState('');
  const [ showModalAPR, setShowModalAPR] = useState(false);

  const atualizarStatus = (novoStatus) => {
    setNovoStatus(novoStatus);
    setShowModal(true);
  }

  useEffect(() => {
    const a = localStorage.getItem('pgto_pedido');
    localStorage.removeItem('pgto_pedido');
    if(a == '1') { setShowModalAPR(true); }
  },[]);

  useEffect(() => {
    if (cd_pedido && !isNaN(cd_pedido)) {

      async function carregarDadosPedido() {
        try {
          setLoading(true);
          const res = await pedidoFactory.listar({ cd_pedido: cd_pedido });

          if (res.success) {
            const _pedido = res.dados[0];
           
            const totMins = getMinutesDiff(_pedido?.dt_entrega, _pedido?.dt_devolucao);

            _pedido.dt_entrega = moment(_pedido.dt_entrega, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [às] HH:mm:ss');
            _pedido.dt_devolucao = moment(_pedido.dt_devolucao, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY [às] HH:mm:ss');

            let _totPedido = 0;

            if (totMins > 0) {
              _pedido.maquinas = _pedido.maquinas.map(m => {
                m.vl_total = toFixed(toFixed(m.vl_hora / 60, 5) * totMins, 2);
                _totPedido = toFixed(parseFloat(_totPedido) + parseFloat(m.vl_total), 2);
                return m;
              });
            }
            setTotPedido(_totPedido);
            setPedido(_pedido);
          } else {
            toast.error("Ocorreu um erro ao tentar recuperar os dados do pedido");
          }

          setLoading(false);
        } catch (e) {
          setLoading(false);
          console.log(e);
        }
      }

      carregarDadosPedido();
    }
  }, [cd_pedido]);

  useEffect(() => {
    if (pedido?.cd_pedido) {
      let novaLista = [];
      let vlTot = 0;

      novaLista = pedido.maquinas.reduce((r, a) => {
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

      setListaCarrinho(novaLista);
    }
  }, [pedido]);

  const AtualizarPedido = async (_novoStatus = false) => {
    try {
      setLoading(true);

      const ns = _novoStatus ? _novoStatus : novoStatus;

      const res = await pedidoFactory.atualizarStatus({cd_pedido: cd_pedido, nm_status_pedido: ns});
   
      if(res.success && res.dados.stripe_url) {
        window.location.href = res.dados.stripe_url;
        return;
      }

      if (res.success) {
        toast.success("Pedido atualizado com sucesso!");
        history('/painel/pedidos');
      } else {
        toast.error("Erro ao tentar atualizar o pedido");
      }

      setLoading(false);
      setShowModal(false);
    } catch(e) {
      toast.error("Ops, ocorreu um erro ao tentar atualizar o status do pedido");
      setLoading(false);
      console.log(e);
    }
    
  }

  useEffect(() => {
    if (formData?.dt_entrega) {
      let _d = new Date(formData?.dt_entrega);
      let _a = new Date(_d.valueOf() - _d.getTimezoneOffset() * 60000);

      _a.setTime(_a.getTime() + 1 * 60 * 60 * 1000);

      setMinTer((_a.toISOString().split('.')[0]).slice(0, -3));
    }
  }, [formData?.dt_entrega]);

  return (
    <Container fluid className="__FormPedidos">
      <Row>
        {/* itens do carrinho */}
        <Col lg={{ span: 6, offset: 3 }} sm={{ span: 10, offset: 1 }} xs={{ span: 12, offset: '0' }}>

          <div className="carrinho">
            <h4>Pedido Nº{cd_pedido}</h4>
            <hr />
            {
              listaCarrinho.length > 0 && listaCarrinho.map((f, k) => (
                <div key={k} className="fornecedorContainer">
                  <Show if={userData?.tipo_perfil != 'FORNECEDOR'}>
                    <p className="fornecedorName">{f?.nm_razao_social_fornecedor ? f?.nm_razao_social_fornecedor : f?.nm_fornecedor}</p>
                  </Show>


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

      <Row className="mt-5">
        <Col lg={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }}>
          <hr />
          <h4>Dados do pedido</h4>
          <Row>
            <Col>
            <p>Situação:  <b>{getStatusPedido(pedido?.nm_status_pedido)}</b></p>
              <p>Cliente: <b>{pedido?.nm_razao_social_cliente ? pedido?.nm_razao_social_cliente : pedido.nm_cliente}</b></p>
              <p>
                <b>Endereço de entrega: </b>{pedido?.ds_sigla}/{pedido?.nm_cidade}, {pedido?.nm_logradouro} <b>Nº</b>  {pedido?.nr_local}, &nbsp;
                <b>Bairro: </b>{pedido?.nm_bairro} <b>CEP: </b>{formataCEP(inputValue(pedido?.cd_cep))}
              </p>
              <p>
                Período: de <b>{pedido?.dt_entrega}</b> até <b>{pedido?.dt_devolucao}</b>
              </p>
              <p>VALOR TOTAL DO PEDIDO: <span id="vlTotPedido">{currencyFormat(inputValue(totPedido, 0))}</span></p>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col lg={{ span: 6, offset: 3 }} md={{ span: 8, offset: 2 }}>
          <div className="acoesContainer">
            <Show if={pedido?.nm_status_pedido == 'ANA' && userData?.tipo_perfil == 'FORNECEDOR'}>
              <EMButton type="button" className="EMbuttonDanger" onClick={() => atualizarStatus('REC')} text="Recusar" />
              <EMButton type="button" onClick={() => atualizarStatus('ACE')} text="Aceitar" />
            </Show>

            <Show if={pedido?.nm_status_pedido == 'ACE' && userData?.tipo_perfil == 'CLIENTE'}>
              <EMButton type="button" className="EMbuttonDanger" onClick={() => atualizarStatus('CAN')} text="Cancelar" />
              <EMButton type="button" onClick={() => AtualizarPedido('AGU_PGTO')} text="Pagar" />
              <br/>
              <small>Para finalizar o pedido é necessário efetuar o pagamento e assinar o contrato.</small>
            </Show>

            <Show if={pedido?.nm_status_pedido == 'ASSINADO' && userData?.tipo_perfil == 'FORNECEDOR'}>
              <EMButton type="button" onClick={() => atualizarStatus('ROTA_ENTREGA')} text="atualizar para EM ROTA DE ENTREGA" />
            </Show>

            <Show if={pedido?.nm_status_pedido == 'ROTA_ENTREGA' && userData?.tipo_perfil == 'FORNECEDOR'}>
              <EMButton type="button" onClick={() => atualizarStatus('POSSE_CLI')} text="atualizar para EM POSSE DO CLIENTE" />
            </Show>

            <Show if={pedido?.nm_status_pedido == 'POSSE_CLI' && userData?.tipo_perfil == 'FORNECEDOR'}>
              <EMButton type="button" onClick={() => atualizarStatus('RECOLHIDO')} text="atualizar para RECOLHIDO" />
            </Show>
          </div>
        </Col>
      </Row>

      <EMModal
        modalProps={{
          "size": "lg",
          "show": showModal,
          "onHide": () => setShowModal(false)
        }}
        titulo="Atualizar Pedido"
      >
        <Modal.Body>
          <Row>
            <Col className="text-center pt-3">
              <p>
                Tem certeza que deseja alterar o status do pedido para <b>{ getStatusPedido(novoStatus) }</b>?
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="text-right mt-4 mb-2">
              <EMButton className="EMbuttonDanger" onClick={() => setShowModal(false)} text="Sair" />&nbsp; &nbsp; 
               <EMButton
                text="Confirmar"
                onClick={() => AtualizarPedido(false)}
              />
            </Col>
          </Row>
        </Modal.Body>
      </EMModal>

      <EMModal
        modalProps={{
          "size": "lg",
          "show": showModalAPR,
          "onHide": () => setShowModalAPR(false)
        }}
        titulo="Pedido Aprovado"
      >
        <Modal.Body>
          <Row>
            <Col className="text-center pt-3">
              <p>
                Para garantir uma maior segurança a ambas as partes envolvidas na locação das máquinas a EasMAQ gera um contrato de locação. <br/>
                Dentro de alguns minutos o contrato será enviado para o seu email.<br/>
                Assine-o para finalizar o pedido.
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="text-right mt-4 mb-2">
               <EMButton
                text="OK"
                onClick={() => {
                  setShowModalAPR(false);
                  history('/painel/pedidos');
                }}
              />
            </Col>
          </Row>
        </Modal.Body>
      </EMModal>
    </Container>
  )
}

export default PedidoForm;