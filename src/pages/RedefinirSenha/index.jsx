import { useEffect, useContext, useState } from 'react';
import { Row, Col, Container, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import EMButton from '../../components/EMButton';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify'
import eventHandlers from '../../helpers/eventHandlers';
import userFactory from '../../services/userFactory';
import LoadingContext from '../../contexts/LoadingContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { inputValue, regexPatterns, senhaValida } from '../../helpers';
import appFactory from '../../services/appFactory';

const RedefinirSenha = props => {
  const history = useNavigate();
  const [searchParams] = useSearchParams();

  const { setLoading } = useContext(LoadingContext);
  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);
    
  const handleOnChange = eventHandlers.onChange(formData, setFormData);

  const checkFormErrors = () => {
    if(!senhaValida(formData?.ds_senha)) return true;
    if(formData?.ds_senha !== formData?.conf_senha) return true;
  }

  const handleSubmit = async (e) => {
    try {
      
      e.preventDefault();
      const form = e.currentTarget;

      if (!form.checkValidity() || checkFormErrors()) {
        e.preventDefault();
        e.stopPropagation();
        toast.warning("Informe uma senha válida");
        setLoading(false);
        return;
      }
      const f = formData;
      f.token = searchParams.get('token');
 
      setLoading(true);
      const res = await userFactory.atualizarSenha(f);
      setLoading(false);

      if(!res.success) return toast.error('Erro ao tentar atualizar a senha');

      toast.success('Senha atualizada com sucesso!');
      history('/');
    } catch (err) {
      toast.error('Erro ao tentar atualizar a senha');
      setLoading(false);
      console.log(err)
    }
  }

  return (
    <Container>
        <Row>
          <Col lg={{ span: 8, offset: 2 }} className="formCadastroContainer">
            <FormContainer>
              <Form className="formCadastro" validated={validated} onSubmit={handleSubmit}>
                <h4>Redefinir senha</h4>

                <Row>
                  <div className="formFieldTitle">
                    <hr />
                  </div>
                </Row>

                <Row className="mb-4">

                  <Col md={6}>
                    <Form.Label htmlFor="ds_senha">Nova senha</Form.Label>
                    <Form.Control
                      type="password"
                      id="ds_senha"
                      name="ds_senha"
                      aria-describedby="passwordHelpBlock"
                      value={inputValue(formData?.ds_senha)}
                      onChange={handleOnChange}
                      minLength={6}
                      required
                    />
                    <Form.Text id="passwordHelpBlock" muted>
                      A senha deve conter de 6 á 20 caracteres, conter letras e números.
                    </Form.Text>
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="conf_senha">Confirmar nova senha</Form.Label>
                    <Form.Control
                      type="password"
                      id="conf_senha"
                      name="conf_senha"
                      aria-describedby="conf_senhaHelpBlock"
                      value={inputValue(formData?.conf_senha)}
                      isInvalid={formData?.ds_senha && formData?.conf_senha !== formData?.ds_senha}
                      onChange={handleOnChange}
                      minLength={6}
                      required
                    />
                    <Form.Text id="conf_senhaHelpBlock" muted>
                      A confirmação senha deve ser igual ao campo NOVA SENHA.
                    </Form.Text>
                  </Col>
                </Row>

                <hr />

                <Row className="mt-4">
                  <Col className="text-right">
                    <EMButton type="submit" text="Atualizar senha" />
                  </Col>
                </Row>

              </Form>
            </FormContainer>
          </Col>
        </Row>
      </Container>
  )
}

export default RedefinirSenha;