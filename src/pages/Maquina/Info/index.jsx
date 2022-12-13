import { useContext, useEffect, useState } from 'react';
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from 'react-router-dom';
import CartContext from '../../../contexts/CartContext';
import cartFactory from '../../../services/cartFactory';
import ConfigContext from '../../../contexts/ConfigContext';
import MaquinaFactory from '../../../services/maquinaFactory';
import LoadingContext from '../../../contexts/LoadingContext';
import Show from '../../../components/ShowIf';
import parse from 'html-react-parser'
import { inputValue } from '../../../helpers';

import './style.scss';

const MaquinaInfo = props => {
  const { cd_maquina } = useParams();

  const { setLoading } = useContext(LoadingContext);

  const [maquina, setMaquina] = useState(false);
  const [estaNoCart, setEstaNoCart] = useState(false);

  const { cart, setCart } = useContext(CartContext);
  const { useCookies } = useContext(ConfigContext);

  const addItem = (item) => {
    let itens = useCookies ? (cartFactory.getLocalItens() || []) : (cart || []);
    itens = itens.concat([item]);
    if (useCookies) cartFactory.setLocalItens(itens);
    setCart(itens);
  }

  const removeItem = (item) => {
    let itens = useCookies ? (cartFactory.getLocalItens() || []) : (cart || []);
    itens = itens.filter(i => i.cd_maquina !== maquina?.cd_maquina);
    if (useCookies) cartFactory.setLocalItens(itens);
    setCart(itens);
    // toast.success('Produto removido do carrinho');
  }

  useEffect(() => {
    async function getMaquina() {
      setLoading(true);
      const res = await MaquinaFactory.listar({ cd_maquina: cd_maquina });
      console.log(res.dados?.[0]?.ds_uso);
      if (res.success) setMaquina(res.dados?.[0]);
      setLoading(false);
    }
    getMaquina().catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setEstaNoCart(cart.find(cartItem => cartItem.cd_maquina === maquina.cd_maquina));
  }, [cart]);

  return (
    <Container fluid>
      <div className='__MaquinaInfo'>
        <Row>
          <Col>
          <h2>Detalhes da Máquina</h2>
          <hr />
          </Col>
        </Row>
        <Row>
          <Col xl={5} lg={7} md={12} sm={12} xs={12} className="cardContainer">            
            <Col className="_card">
              <Col md={12} className="imgContaienr">

                <Carousel indicators={false} interval={null}>
                  {
                    maquina?.imagens?.map((img, indexImg) => (
                      <Carousel.Item key={indexImg}>
                        <div style={{ backgroundImage: "url('" + img.fileUrl + "')" }} className="_cardImage"></div>
                      </Carousel.Item>
                    ))
                  }
                </Carousel>
              </Col>
            </Col>

          </Col>
          <Col className="maquinaInfoContainer">
              <h3>{maquina?.nm_categoria}

              <Show if={estaNoCart ? true : false}>

                    <FontAwesomeIcon
                      onClick={() => removeItem(maquina)}
                      className="btnRemoveDoCarrinho"
                      title="Remover produto do carrinho"
                      icon={faTrash}
                    />
                  </Show>

                  <Show if={!estaNoCart ? true : false}>
                    <FontAwesomeIcon
                      onClick={() => addItem(maquina)}
                      className="btnAdicionarAoCarrinho"
                      title="Adicionar ao carrinho"
                      icon={faCartPlus}
                    />
                  </Show>
              </h3>
              <br/>
              <span>{maquina?.nm_razao_social_fornecedor ? maquina?.nm_razao_social_fornecedor : maquina?.nm_fornecedor}</span><br />
              <span><b>R$ {maquina?.vl_hora?.replace('.', ',')}/h</b></span><br />
              <span>{maquina?.ds_sigla}/{maquina?.nm_cidade}</span><br/><br/>

              <h5>Descrição de uso</h5>

              <p>
                { parse(inputValue(maquina?.ds_uso?.replace(/[\n\r]/ig,'<br/>')))}
              </p>
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default MaquinaInfo;