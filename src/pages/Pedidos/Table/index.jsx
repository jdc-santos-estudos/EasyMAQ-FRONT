import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Container, Button, InputGroup, Modal } from 'react-bootstrap';
import useLogged from "../../../hooks/useLogged";
import { useEffect, useContext, useState } from 'react';
import LoadingContext from '../../../contexts/LoadingContext';
import UserContext from "../../../contexts/UserContext";
import EMTable from "../../../components/EMTable";
import EMButton from "../../../components/EMButton";
import { toast } from "react-toastify";
import pedidoFactory from "../../../services/pedidoFactory";
import moment from "moment/moment";
import {getMinutesDiff,toFixed, currencyFormat, getStatusPedido } from '../../../helpers';

const tblCols = [
  { name: '#', field:'cd_pedido' },
  { name: 'Cliente', field:'nm_cliente' },
  { name: 'Fornecedor', field:'nm_fornecedor' },
  { name: 'Situação', field: 'nm_status_pedido' },
  { name: 'Valor', field:'vl_total' },
  { name: 'Data de Entrega', field:'dt_entrega' },
  { name: 'Data de Devolução', field:'dt_devolucao' }
];

const PedidoTable = props => {
  useLogged('/');
  const navigate = useNavigate();

  const { setLoading } = useContext(LoadingContext);
  const { userData } = useContext(UserContext);
  const [cols, setCols] = useState([]);
  const [registros, setRegistros] = useState([]);
  
  const handleVisualizar = ({cd_pedido}) => {
    navigate('/painel/pedido/'+cd_pedido);
  }

  useEffect(() => {
    let _cols = tblCols;

    // se for fornecedor, remove a coluna dele proprio
    if (userData?.tipo_perfil && ['FORNECEDOR'].includes(userData?.tipo_perfil)) _cols = _cols.filter((c) => c.name != 'Fornecedor');

    // se for cliente, remove a coluna dele proprio
    if (userData?.tipo_perfil && ['CLIENTE'].includes(userData?.tipo_perfil)) _cols = _cols.filter((c) => c.name != 'Cliente');
    
    setCols(_cols);
  }, [userData?.tipo_perfil]);

  useEffect(() => {      
    async function listarPedido() {
      setLoading(true);

      // await pedidoFactory.docusign();
      const dados = await pedidoFactory.listar();
      // console.log(dados);
      
      if(dados.success) setRegistros(dados.dados.map(p => {
        
        const totMins = getMinutesDiff(p?.dt_entrega, p?.dt_devolucao);

        p.dt_entrega = moment(p.dt_entrega,'YYYY-MM-DD H:m:s').format('DD/MM/YYYY HH:mm:ss');
        p.dt_devolucao = moment(p.dt_devolucao,'YYYY-MM-DD H:m:s').format('DD/MM/YYYY HH:mm:ss');
        p.nm_status_pedido = getStatusPedido(p.nm_status_pedido);
        p.nm_fornecedor = p?.maquinas?.[0]?.nm_razao_social_fornecedor ? p?.maquinas?.[0]?.nm_razao_social_fornecedor: p?.maquinas?.[0]?.nm_fornecedor;       

        let totPedido = 0;

        if (totMins > 0) {
          p?.maquinas?.map(m => {
            let vl_total = toFixed(toFixed(m.vl_hora_contratada / 60, 5) * totMins, 2);
            totPedido = toFixed(parseFloat(totPedido) + parseFloat(vl_total), 5);
            return m;
          });
        }
        p.vl_total = currencyFormat(totPedido);

        // gerando o botão de download
        if (p.baixou_pdf) { p.downloadLink = 'https://api.easymaq.app/contrato/download-pdf?cd=' + p.cd_pedido; }

        return p;
      }));
      setLoading(false);
    }
    listarPedido();
  },[]);

  return (
    <Container className="__MaquinaForm">
      <Row>
        <Col className="formCadastroContainer">

          <EMTable
            titulo="Pedidos"
            headerActions={{ 
              
            }}
            cols={cols}
            registros={registros}
            acoes={{
              visualizar: ['ADMIN1','ADMIN2','FORNECEDOR','CLIENTE'].includes(userData?.tipo_perfil) ? handleVisualizar: null,
              download: true,
            }}
          >
          </EMTable>
        </Col>
      </Row>
    </Container>
  )
}

export default PedidoTable;