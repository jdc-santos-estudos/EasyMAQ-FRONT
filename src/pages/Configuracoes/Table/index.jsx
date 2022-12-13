import { useEffect, useContext, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import UserContext from '../../../contexts/UserContext';
import LoadingContext from '../../../contexts/LoadingContext';
import { useNavigate  } from 'react-router-dom';
import useLogged from "../../../hooks/useLogged";
import EMTable from "../../../components/EMTable";
import appFactory from '../../../services/appFactory';

const tblCols = [
  { name: '#', field:'cd_configuracao' },
  { name: 'NOME', field:'nm_config' },
  { name: 'DECRIÇÃO', field:'ds_config' }
];

const ConfiguracoesTable = props => {
  
  const navigate = useNavigate();

  const { setLoading } = useContext(LoadingContext);
  const { userData } = useContext(UserContext);

  useLogged('/', (userData?.tipo_perfil && !['ADMIN1','ADMIN2'].includes(userData?.tipo_perfil)));

  const [registros, setRegistros] = useState([]);

  useEffect(() => {      
    async function listarConfigs() {
      setLoading(true);
      const dados = await appFactory.getConfigs();
      console.log(dados);
      if(dados.success) setRegistros(dados.dados);
      setLoading(false);
    }
    listarConfigs();
  },[]);
  
  const handleEditar = ({nm_config}) => {
    navigate('/painel/configuracoes/'+nm_config);
  }
  
  return (
    <Container className="__MaquinaForm" fluid>
      <Row>
        <Col lg={{span:10, offset:1}} className="formCadastroContainer">

          <EMTable
            titulo="Configurações"
            cols={tblCols}
            registros={registros}
            acoes={{
              editar: ['ADMIN1','ADMIN2'].includes(userData?.tipo_perfil) ? handleEditar: null,
            }}
          >
          </EMTable>
        </Col>
      </Row>
    </Container>
  )
}

export default ConfiguracoesTable;