import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Container, Button, InputGroup, Modal } from 'react-bootstrap';
import useLogged from "../../../hooks/useLogged";
import { useEffect, useContext, useState } from 'react';
import LoadingContext from '../../../contexts/LoadingContext';
import UserContext from "../../../contexts/UserContext";
import EMTable from "../../../components/EMTable";
import EMButton from "../../../components/EMButton";
import MaquinaFactory from '../../../services/maquinaFactory';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinusCircle, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { currencyFormat} from '../../../helpers';

import { toast } from "react-toastify";

const tblCols = [
  { name: '#', field:'cd_maquina' },
  { name: 'Categoria', field:'nm_categoria' },
  { name: 'Fornecedor', field:'nm_fornecedor' },
  { name: 'Estado', field:'nm_estado' },
  { name: 'Cidade', field:'nm_cidade' },
  { name: 'Valor/hora', field:'vl_hora' },
  { name: 'Situação', field:'cd_status' },
  { name: 'Placa', field:'cd_placa' },
  { name: 'Chassi', field:'nr_chassi' }
];

const MaquinaTable = props => {
  useLogged('/');
  const navigate = useNavigate();

  const { setLoading } = useContext(LoadingContext);
  const { userData } = useContext(UserContext);
  const [cols, setCols] = useState([]);
  const [registros, setRegistros] = useState([]);
  
  const handleEditar = ({cd_maquina}) => {
    navigate('/painel/maquina/'+cd_maquina);
  }

  const handleExcluir = async ({cd_maquina}) => {
    try {
      if(cd_maquina > 0) {
        setLoading(true);

        const res = await MaquinaFactory.excluir(cd_maquina);
        
        if(res.success) {
          setRegistros(registros.filter(r => r.cd_maquina !== cd_maquina));
          toast.success('Máquina excluida com sucesso.');    
        } else {
          toast.error('Ocorreu um erro ao tentar remover a máquina.');    
        }

        return setLoading(false);
      }
    } catch(e) {
      setLoading(false);
      toast.error('Ocorreu um erro ao tentar remover a máquina.');
      console.log(e);
    }
    
  }

  useEffect(() => {
    let _cols = tblCols;
    if (userData?.tipo_perfil && ['FORNECEDOR'].includes(userData?.tipo_perfil)) _cols = _cols.filter((c) => c.name != 'Fornecedor');
    setCols(_cols);
  }, [userData?.tipo_perfil]);

  useEffect(() => {      
    async function listarMaquinas() {
      setLoading(true);
      const dados = await MaquinaFactory.listarPorPerfil();

      if(dados.success) setRegistros(dados.dados.map(d => {
        d.vl_hora = currencyFormat(d.vl_hora);
        return d;
      }));
      setLoading(false);
    }
    listarMaquinas();
  
  },[]);

  return (
    <Container className="__MaquinaForm" fluid>
      <Row>
        <Col lg={{span:10, offset:1}} className="formCadastroContainer">

          <EMTable
            titulo="Máquinas"
            headerActions={{ 
              "btnCadastrar" : ['FORNECEDOR'].includes(userData?.tipo_perfil) ? {
                "to": "/painel/maquina",
                "text": "Nova Máquina"
              }: false
            }}
            cols={cols}
            registros={registros}
            acoes={{
              editar: ['ADMIN1','ADMIN2','FORNECEDOR'].includes(userData?.tipo_perfil) ? handleEditar: null,
              excluir: ['ADMIN1','ADMIN2','FORNECEDOR'].includes(userData?.tipo_perfil) ? handleExcluir: null,
            }}
            modal={{
              titulo: "Excluir Máquina",
              texto: <p>Tem certeza que deseja excluir esta máquina? <br/>Ela será apagada do sistema e não poderá ser recuperada.</p>
            }}
          >
          </EMTable>
        </Col>
      </Row>
    </Container>
  )
}

export default MaquinaTable;