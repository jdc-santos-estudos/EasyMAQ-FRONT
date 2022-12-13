import { useState, useEffect, useRef, useContext } from 'react';
import { Row, Col, Form, Button, Container, InputGroup } from 'react-bootstrap';
import Show from '../../components/ShowIf';
import EMPagination from '../../components/EMPagination';
import EMButton from '../../components/EMButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import EMBanner from '../../components/EMBanner';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import ProdutoCard from '../../components/ProdutoCard';
import MaquinaFactory from '../../services/maquinaFactory';
import LoadingContext from '../../contexts/LoadingContext';
import userFactory from '../../services/userFactory';
import EMSelectEstado from '../../components/EMSelectEstado';
import EMSelectCidade from '../../components/EMSelectCidade';
import eventHandlers from '../../helpers/eventHandlers';
import { currencyFormat, inputValue, regexPatterns } from '../../helpers';
import { useSearchParams  } from 'react-router-dom';

import './style.scss';

const mobile = 891;

const Home = () => {
  const { width } = useWindowDimensions();
  const [searchParams, setSearchParams] = useSearchParams();

  const { setLoading } = useContext(LoadingContext);

  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentItems, setCurrentItems] = useState([]);
  const [showFiltrosMobile, setShowFiltrosMobile] = useState(false);
  const [filtros, setFiltros] = useState({search: searchParams.get('search')});
  const [items, setItems] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const handleOnChangeFiltro = eventHandlers.onChange(filtros, setFiltros);

  useEffect(() => {
    const formFiltroContainer = document.getElementById('formFiltroContainer')
    const maquinasContainer = document.getElementById('maquinasContainer');
    if(formFiltroContainer !== null && maquinasContainer !== null) {
      const xwidth = formFiltroContainer.getBoundingClientRect().width;
      maquinasContainer.style.width = 'calc(100% - ' + xwidth + ')';
    };
    
  }, [width]);

  const scrollRef = useRef(null);
  const onChangePage = (dados) => { setCurrentItems(dados.currentItems); }

  const handleSubmitFiltro = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (filtros?.search !== '' && filtros?.search !== null) {
        searchParams.set('search',filtros?.search);
        setSearchParams(searchParams);
      } else {
        console.log('deletando...');
        searchParams.delete('search');
        setSearchParams(searchParams);
      }
      
      const res = await MaquinaFactory.listar(filtros);
      if (res.success) setItems(res.dados);

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  useEffect(() => {
    async function getFiltros() {
      try {
        setLoading(true);
        let res = await MaquinaFactory.listar({search: searchParams.get('search') });
        if (res.success) setItems(res.dados);

        res = await userFactory.getFornecedores();
        if (res.success) setFornecedores(res.dados);
        
        res = await MaquinaFactory.getCategorias();
        if (res.success) setCategorias(res.dados);

        setLoading(false);
      } catch(e) {
        console.log(e);
        setLoading(false);
      }
    }

    getFiltros().catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    async function getMaquinas() {
      setLoading(true);
      const res = await MaquinaFactory.listar({search: searchParams.get('search') });
      if (res.success) setItems(res.dados);
      setLoading(false);
    }
    getMaquinas().catch(() => setLoading(false));

  },[searchParams]);

  const resetFiltro = async () => {
    try {
      setFiltros({
        search: '',
        cd_usuario: '',
        cd_categoria:'',
        vl_max:'',
        vl_min:'',
        cd_estado: '',
        cd_cidade: ''
      });
      setLoading(true);
      const res = await MaquinaFactory.listar({});
      setLoading(false);
      
      if (res.success) setItems(res.dados);  
    } catch(e) {
      setLoading(false);
    }
  }
  return (
    <>
      <EMBanner />
      <Container fluid className="homeContainer" ref={scrollRef}>
        <Row>
          <Col md={3} xs={12} className="formFiltroContainer" id="formFiltroContainer">
            <Form onSubmit={handleSubmitFiltro}>
              <span onClick={() => setShowFiltrosMobile(!showFiltrosMobile)} className="iconeMostrarFiltrosMobile">
                <FontAwesomeIcon
                  className="_iconeMostrarFiltrosMobile"
                  icon={showFiltrosMobile ? faMinusCircle : faPlusCircle}
                />
              </span>
              <h3>Filtros</h3>
              <Show if={showFiltrosMobile || width > mobile}>
                <hr />
                <Row>
                  <Show if={width <= mobile}>
                    <Col md={12} sm={12} xs={12}>
                      <InputGroup className="mb-3 searchContainerMOBILE">
                        <Form.Control
                          placeholder="O que está procurando?"
                          value={inputValue(filtros?.search)}
                          onChange={handleOnChangeFiltro}
                          name="search"
                        />
                      </InputGroup>
                    </Col>
                  </Show>
                </Row>
                <Row>
                  <Col md={width > mobile ? 12 : 6} sm={6} xs={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fornecedor</Form.Label>
                      <Form.Select
                        name="cd_usuario" 
                        value={inputValue(filtros.cd_usuario)}
                        onChange={handleOnChangeFiltro}
                      >
                        <option value="">Selecione um fornecedor</option>
                        {
                          fornecedores?.map((f, i) => (
                            <option value={f.cd_usuario} key={i}>{f?.nm_razao_social ? f?.nm_razao_social : f?.nm_usuario}</option>
                          ))
                        }
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={width > mobile ? 12 : 6} sm={6} xs={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Categoria</Form.Label>
                      <Form.Select
                        name="cd_categoria"
                        value={inputValue(filtros.cd_categoria)}
                        onChange={handleOnChangeFiltro}
                      >
                        <option value="">Selecione uma categoria</option>
                        {
                          categorias?.map((c, i) => (
                            <option value={c.cd_categoria} key={i}>{c?.nm_categoria}</option>
                          ))
                        }
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={width > mobile ? 12 : 6} sm={6} xs={12}>
                    <EMSelectEstado
                      className="mb-4"
                      controlId="cd_estado"
                      form={filtros}
                      setter={setFiltros}
                    />
                  </Col>

                  <Col md={width > mobile ? 12 : 6} sm={6} xs={12}>
                    <EMSelectCidade
                      className="mb-4"
                      controlId="cd_cidade"
                      form={filtros}
                      setter={setFiltros}
                      watch={filtros?.cd_estado}
                    />
                  </Col>
                </Row>

                <Row>
                  <Form.Label>Valor/Hora</Form.Label>
                  <Col xs={6} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="vl_min"
                        id="vl_min"
                        value={inputValue(currencyFormat(filtros?.vl_min, true))}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(regexPatterns.onlyNumbers, '');
                          handleOnChangeFiltro(e);
                        }}
                        placeholder="Mínimo"
                        maxLength={11}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={6}>
                    <Form.Group className="mb-3" >
                      <Form.Control
                        type="text"
                        name="vl_max"
                        id="vl_max"
                        value={inputValue(currencyFormat(filtros?.vl_max, true))}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(regexPatterns.onlyNumbers, '');
                          handleOnChangeFiltro(e);
                        }}
                        placeholder="Máximo"
                        maxLength={11}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Col className="d-grid gap-2 mt-3" md={{ span: 12, offset: 0 }} sm={{ span: 6, offset: 3 }}>
                  <EMButton type="submit" text={"Filtrar"} />
                </Col>
                <Col className="d-grid gap-2 mt-3" md={{ span: 12, offset: 0 }} sm={{ span: 6, offset: 3 }}>
                  <EMButton type="button" className="btn-reset" text={"Limpar Filtro"} onClick={resetFiltro} />
                </Col>
              </Show>
            </Form>
          </Col>

          <Show if={items.length > 0}>
            <Col id="maquinasContainer" className="maquinasContainer">

              <ProdutoCard currentItems={currentItems} />

              <EMPagination
                itemsPerPage={itemsPerPage}
                onClick={onChangePage}
                items={items}
                scrollRef={scrollRef}
              />
            </Col>
          </Show>

          <Show if={items.length == 0 }>
            <Col className="text-center">
              <h4>Não foram encontradas máquinas</h4>
            </Col>
          </Show>

        </Row>
      </Container>
    </>);
};

export default Home;