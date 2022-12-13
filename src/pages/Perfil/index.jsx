import { useEffect, useContext, useState } from 'react';
import { Row, Col, Container, Form, Modal, InputGroup} from 'react-bootstrap';
import EMButton from '../../components/EMButton';
import FormContainer from '../../components/FormContainer';
import Show from '../../components/ShowIf';
import { toast } from 'react-toastify'
import EMSelectEstado from '../../components/EMSelectEstado';
import EMSelectCidade from '../../components/EMSelectCidade';
import eventHandlers from '../../helpers/eventHandlers';
import userFactory from '../../services/userFactory';
import LoadingContext from '../../contexts/LoadingContext';
import { useNavigate } from 'react-router-dom';
import {
  formatarTelCel,
  formataRG,
  formataCPF,
  formataCNPJ,
  formataCEP,
  inputValue,
  regexPatterns,
  senhaValida
} from '../../helpers';
import UserContext from '../../contexts/UserContext';
import EMModal from '../../components/EMModal';

import './style.scss';

const Perfil = props => {
  const history = useNavigate();

  const { userData, setUserData } = useContext(UserContext);

  const { setLoading } = useContext(LoadingContext);
  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);
  const [tipoPessoa, setTipoPessoa] = useState('cpf');
  const [showModal, setShowModal] = useState(false);

  const handleOnChange = eventHandlers.onChange(formData, setFormData);

  const checkFormErrors = () => {
    if(!formData?.cd_cidade) return true;
    if(formData?.cd_cep.length < 8) return true;
  }

  const handleSubmit = async (e) => {
    try {
      
      e.preventDefault();
      const form = e.currentTarget;

      console.log('checkFormErrors(): ', checkFormErrors());

      if (!form.checkValidity() || checkFormErrors()) {
        e.preventDefault();
        e.stopPropagation();
        toast.warning("Existem erros no formulário, por favor verifique os campos marcados em vermelho.");
        return;
      }
      setValidated(true);
      
      const f = { ...formData };

      f.ds_telefone = f.ds_telefone.replace(regexPatterns.onlyNumbers,'');
      f.cd_cep = f.cd_cep.replace(regexPatterns.onlyNumbers,'');

      if(f?.ds_senha && !senhaValida(f?.ds_senha)) {
        return toast.warning("A senha deve conter de 6 á 20 caracteres, conter letras e números e 1 caractere especial.")
      }

      setFormData(f);
      setShowModal(true);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  const handleModal = async (f) => {
    try {
      if (!formData?.senha_atual || !formData?.senha_atual?.length) return toast.error('Informe a senha atual');
      
      f.senha_atual = formData.senha_atual;

      setLoading(true);
      const res = await userFactory.atualizar(f);
      setLoading(false);
      
      if(!res.success) return toast.error('Erro ao tentar atualizar o usuário');

      toast.success('dados atualizados com sucesso!');
      history('/');
    } catch(e) {
      toast.error('Erro ao tentar atualizar os dados');
      setLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    if (tipoPessoa && tipoPessoa == 'cpf') setFormData({ ...formData, nm_fantasia: null, nm_razao_social: null, cd_cnpj: null });
    if (tipoPessoa && tipoPessoa == 'cnpj') setFormData({ ...formData, cd_rg: null, cd_cpf: null })
  }, [tipoPessoa]);

  useEffect(() => {
    if (!formData?.cd_usuario && userData?.cd_usuario ) {
      async function getPerfil() {
        setLoading(true);
        const dados = await userFactory.getPerfil();
        if (dados.success) {
          if(dados.dados?.cd_rg?.length) {
            setTipoPessoa('cpf');
          } else {
            setTipoPessoa('cnpj');
          }
          setFormData(dados.dados)
        }
        setLoading(false);
      }
      getPerfil();
    }
  }, [userData]);

  return (
    <>
      <Container>
        <Row>
          <Col lg={{ span: 8, offset: 2 }} className="formCadastroContainer">
            <FormContainer>
              <Form className="formCadastro" validated={validated} onSubmit={handleSubmit}>
                <h4>Dados cadastrais</h4>

                <Row>
                  <div className="formFieldTitle">
                    <hr />
                  </div>
                </Row>

                {/* dados de login (nome, email, senha) */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-4" controlId="perfil">
                      <Form.Label>Perfil</Form.Label>
                      <Form.Select
                        name="cd_perfil"
                        value={inputValue(formData?.cd_perfil)}
                        aria-describedby='perfilHelp'
                        disabled
                      >
                        <option value="">Perfil Inválido</option>
                        <option value="1">Administrador Mestre</option>
                        <option value="2">Administrador</option>
                        <option value="3">Cliente</option>
                        <option value="4">Fornecedor</option>
                      </Form.Select>
                      <Form.Text id="perfilHelp" muted>
                        {formData?.cd_perfil == "3" ? 'Este é o perfil de quem deseja alugar máquinas para usa-las em suas óbras' : ''}
                        {formData?.cd_perfil == "4" ? 'Este é o perfil de quem deseja fornecer suas máquinas para os clientes' : ''}
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Label htmlFor="nm_usuario">Nome completo</Form.Label>
                    <Form.Control
                      type="text"
                      name="nm_usuario"
                      id="nm_usuario"
                      autoComplete="off"
                      value={inputValue(formData?.nm_usuario)}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(regexPatterns.alphaComEspaco,'');
                        handleOnChange(e);
                      }}
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="ds_telefone">Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder='(xx) xxxxx-xxxx'
                      onChange={ handleOnChange }
                      name="ds_telefone"
                      id="ds_telefone"
                      value={formatarTelCel(inputValue(formData?.ds_telefone))}
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="ds_email">Email</Form.Label>
                    <Form.Control
                      type="email"
                      id="ds_email"
                      name="ds_email"
                      value={inputValue(formData?.ds_email)}
                      disabled
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="ds_senha">Nova Senha</Form.Label>
                    <Form.Control
                      type="password"
                      id="ds_senha"
                      name="ds_senha"
                      aria-describedby="passwordHelpBlock"
                      value={inputValue(formData?.ds_senha)}
                      onChange={handleOnChange}
                    />
                    <Form.Text id="passwordHelpBlock" muted>
                      A senha deve conter de 6 á 20 caracteres, conter letras e números e 1 caractere especial.
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
                      required={formData?.ds_senha?.length > 0}
                    />
                    <Form.Text id="conf_senhaHelpBlock" muted>
                      A confirmação senha deve ser igual ao campo SENHA.
                    </Form.Text>
                  </Col>
                </Row>

                <Row>
                  <Col md={10} lg={8}>
                    <Form.Group className="mb-3" controlId="perfil">
                      <Form.Label className="mb-3">Tipo de pessoa</Form.Label>
                      <Row>
                        <Col>
                          <Form.Check
                            type='radio'
                            label={`Física (CPF)`}
                            id={`cpf`}
                            name="tipo_pessoa"
                            checked={tipoPessoa == 'cpf'}
                            value="cpf"
                            onChange={(e) => setTipoPessoa(e.target.value)}
                            disabled
                          />
                        </Col>
                        <Col>
                          <Form.Check
                            type='radio'
                            label={`Jurídica (CNPJ)`}
                            id={`cnpj`}
                            name="tipo_pessoa"
                            checked={tipoPessoa == 'cnpj'}
                            value="cnpj"
                            onChange={(e) => setTipoPessoa(e.target.value)}
                            disabled
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>

                  <Show if={tipoPessoa == 'cpf'}>
                    <Row>
                      <Col sm={6} md={6} className="mb-3">
                        <Form.Label htmlFor="cd_rg">RG</Form.Label>
                        <Form.Control
                          type="text"
                          id="cd_rg"
                          name="cd_rg"
                          value={formataRG(inputValue(formData?.cd_rg))}
                          isInvalid={formData?.cd_rg && formData?.cd_rg?.length < 9}
                          maxLength={12}
                          onChange={(e) => {
                            handleOnChange(e);
                          }}
                          required={tipoPessoa == 'cpf'}
                          disabled
                        />
                      </Col>

                      <Col sm={6} md={6} className="mb-3">
                        <Form.Label htmlFor="cd_cpf">CPF</Form.Label>
                        <Form.Control
                          type="text"
                          name="cd_cpf"
                          id="cd_cpf"
                          value={formataCPF(inputValue(formData?.cd_cpf))}
                          isInvalid={formData?.cd_cpf && formData?.cd_cpf?.length < 9}
                          maxLength={12}
                          onChange={(e) => {handleOnChange(e);}}
                          required={tipoPessoa == 'cpf'}
                          disabled
                        />
                      </Col>
                    </Row>
                  </Show>

                  <Show if={tipoPessoa == 'cnpj'}>
                    <Row>
                      <Col md={12} lg={4} className="mb-3">
                        <Form.Label htmlFor="cd_cnpj">CNPJ</Form.Label>
                        <Form.Control
                          type="text"
                          name="cd_cnpj"
                          id="cd_cnpj"
                          value={formataCNPJ(inputValue(formData?.cd_cnpj))}
                          isInvalid={formData?.cd_cnpj && formData?.cd_cnpj?.length < 12}
                          maxLength={16}
                          onChange={(e) => { handleOnChange(e); }}
                          required={tipoPessoa == 'cnpj'}
                          disabled
                        />
                      </Col>

                      <Col md={12} lg={4} className="mb-3">
                        <Form.Label htmlFor="nm_razao_social">Razão social</Form.Label>
                        <Form.Control
                          type="text"
                          name="nm_razao_social"
                          id="nm_razao_social"
                          value={inputValue(formData?.nm_razao_social)}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(regexPatterns.alphaNumericosComEspaco,'');
                            handleOnChange(e);
                          }}
                          required={tipoPessoa == 'cpf'}
                          disabled
                        />
                      </Col>

                      <Col md={12} lg={4} className="mb-3">
                        <Form.Label htmlFor="nm_fantasia">Nome fantasia</Form.Label>
                        <Form.Control
                          type="text"
                          name="nm_fantasia"
                          id="nm_fantasia"
                          value={inputValue(formData?.nm_fantasia)}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(regexPatterns.alphaNumericosComEspaco,'');
                            handleOnChange(e);
                          }}
                          required={tipoPessoa == 'cpf'}
                          disabled
                        />
                      </Col>
                    </Row>
                  </Show>
                </Row>

                <hr />

                {/* DADOS DE ENDEREÇO */}
                <Row>
                  <Col className="mb-2" md={12}>
                    <h5>Dados do endereço <Show if={tipoPessoa == 'cnpj'}>da sede</Show> </h5>
                  </Col>

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
                      value={formataCEP(inputValue(formData?.cd_cep))}
                      isInvalid={formData?.cd_cep && formData?.cd_cep?.length < 8}
                      maxLength={9}
                      onChange={(e) => { handleOnChange(e); }}
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
                        e.target.value = e.target.value.replace(regexPatterns.alphaNumericosComEspaco,'');
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
                        e.target.value = e.target.value.replace(regexPatterns.alphaNumericosComEspaco,'');
                        handleOnChange(e);
                      }}
                      required
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col className="text-right">
                    <EMButton type="submit" text="Atualizar dados" />
                  </Col>
                </Row>

              </Form>
            </FormContainer>
          </Col>
        </Row>
        <EMModal
          modalProps={{
            "size": "lg",
            "show": showModal,
            "onHide": () => {
              setShowModal(false)
            }
          }}
          titulo="Confirmar atualizações"
        >
          <Modal.Body>
            <Row>
              <Col className="text-center pt-3">
                <p>Para atualizar os dados do seu perfil, informa sua senha atual.</p>
                <Col sm={{offset: 2, span: 8}} className="mb-5">
                    <Form.Control
                      autocomplete="off"
                      type="password"
                      id="senha_atual"
                      name="senha_atual"
                      value={inputValue(formData?.senha_atual)}
                      onChange={handleOnChange}
                    />
                  </Col>

              </Col>
            </Row>
            <Row>
              <Col className="text-center mt-4 mb-2">
                <EMButton
                  text="Confirmar"
                  onClick={handleModal}
                />
              </Col>
            </Row>
          </Modal.Body>
        </EMModal>
      </Container>
    </>
  )
}

export default Perfil;