import { useState, useEffect, useContext } from 'react';
import LoadingContext from "../../contexts/LoadingContext";
import appFactory from '../../services/appFactory';
import parse from 'html-react-parser'
import { Container,Row, Col } from 'react-bootstrap';

const Termos = props => {
  const { setLoading } = useContext(LoadingContext);

  const [termosDeUso, setTermosDeUso] = useState('');

  useEffect(() => {
    async function listarConfigs() {
      setLoading(true);
      const dados = await appFactory.getTermos('TERMOS_USO');
      if (dados.success) {
        setTermosDeUso(dados.dados);
      }
      setLoading(false);
    }
    listarConfigs();
  }, []);

  return (
    <Container>
      <Row>
        <Col className="mt-5 mb-5">
          {parse(termosDeUso)}
        </Col>
      </Row>
    </Container>
  )
}

export default Termos;