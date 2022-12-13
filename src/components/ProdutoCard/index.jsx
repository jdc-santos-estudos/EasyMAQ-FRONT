import {useContext} from 'react';
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import CartContext from '../../contexts/CartContext';
import cartFactory from '../../services/cartFactory';
import Show from '../ShowIf';
import ConfigContext from '../../contexts/ConfigContext';
import './style.scss';

const ProdutoCard = ({ currentItems }) => {

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
    itens = itens.filter(i => i.cd_maquina !== item.cd_maquina);
    if (useCookies) cartFactory.setLocalItens(itens);
    setCart(itens);
    // toast.success('Produto removido do carrinho');
  }

  return (
    <>
      <div className='__ProdutoCard'>
        <Row>
          {
            currentItems && currentItems.map((item, key) => {
              const estaNoCart = cart.find(cartItem => cartItem.cd_maquina === item.cd_maquina);

              return (

              <Col md={3} sm={4} xs={6} key={key} className="cardContainer">
                <Col className="_card">
                  <Col md={12} className="imgContaienr">

                    <Carousel indicators={false} interval={null}>
                      {
                        item?.imagens?.map((img, indexImg) => (
                          <Carousel.Item key={indexImg}>
                            <div style={{ backgroundImage: "url('"+img.fileUrl+"')" }} className="_cardImage"></div>
                          </Carousel.Item>
                        ))
                      }
                    </Carousel>
                  </Col>

                  <Col md={12} className="_cardInfo">
                    <p>
                      <Link to={"/maquina/"+ item.cd_maquina}>
                        <b>{item.nm_categoria}<br /></b>
                      </Link>
                      {/* Lorem ipsum dolor sit amet consectetur adipisicing elit<br/> */}
                      <i><span>{item?.nm_razao_social_fornecedor ? item?.nm_razao_social_fornecedor : item?.nm_fornecedor}</span></i><br />
                      <span>R$ {item.vl_hora.replace('.',',')}/h</span><br />
                      <span>{item.ds_sigla}/{item.nm_cidade}</span>

                      <Show if={estaNoCart ? true : false}>
                        
                        <FontAwesomeIcon 
                          onClick={() => removeItem(item) }
                          className="btnRemoveDoCarrinho"
                          title="Remover produto do carrinho"
                          icon={faTrash}
                        />  
                      </Show>

                      <Show if={!estaNoCart ? true: false}>
                        <FontAwesomeIcon 
                          onClick={() => addItem(item) }
                          className="btnAdicionarAoCarrinho"
                          title="Adicionar ao carrinho"
                          icon={faCartPlus}
                        />  
                      </Show>
                      
                    </p>
                  </Col>

                </Col>

              </Col>
            )})
          }
        </Row>
      </div>
    </>
  )
}

export default ProdutoCard;