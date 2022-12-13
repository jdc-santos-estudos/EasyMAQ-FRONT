import { useParams, useNavigate } from "react-router-dom";
import useLogged from "../../../hooks/useLogged";
import { useEffect, useContext, useState } from 'react';
import { Row, Col, Container, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import EMButton from '../../../components/EMButton';
import FormContainer from '../../../components/FormContainer';
import Show from '../../../components/ShowIf';
import { toast } from 'react-toastify'
import EMSelectEstado from '../../../components/EMSelectEstado';
import EMSelectCidade from '../../../components/EMSelectCidade';
import EMModal from '../../../components/EMModal';
import eventHandlers from '../../../helpers/eventHandlers';
import maquinaFactory from '../../../services/maquinaFactory';
import LoadingContext from '../../../contexts/LoadingContext';
import EMButtonUpload from "../../../components/EMButtonUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../../../contexts/UserContext";

import {
  inputValue,
  regexPatterns,
  currencyFormat
} from '../../../helpers';

import './style.scss';

const MaquinaForm = props => {
  const { cd_maquina } = useParams();  

  const history = useNavigate();

  const { setLoading } = useContext(LoadingContext);
  const { userData } = useContext(UserContext);

  useLogged('/painel/maquinas', isNaN(cd_maquina) && (userData?.tipo_perfil && userData?.tipo_perfil != 'FORNECEDOR'));

  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);
  const [maqFiles, setMaqFiles] = useState([]);
  const [categorias, setCategorias ] = useState([]);

  const handleOnChange = eventHandlers.onChange(formData, setFormData);

  const handleRemoveImage = (i) => {
    setMaqFiles(maqFiles.filter((m,idx) => i !== idx));
  }

  const handleSubmit = async (e) => {
    try {

      setLoading(true);
      e.preventDefault();
      const form = e.currentTarget;

      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        toast.warning("Existem erros no formulário, por favor verifique os campos marcados em vermelho.");
        setLoading(false);
        return;
      }

      if(!/^[a-zA-Z]{3}[0-9]{4}$/.test(formData.cd_placa)) {
        setLoading(false);
        return toast.error("PLACA Inválida");
      }
    
      const f = formData; 
      f.imagens = maqFiles;

      if (!f.imagens?.length) {
        setLoading(false);
        return toast.error("adicione pelo menos uma imagem");
      }

      let res = null;

      if (f.cd_maquina) {
        res = await maquinaFactory.atualizar(f);
      } else {
        res = await maquinaFactory.cadastrar(f);  
      }

      if(!res.success) {
        setLoading(false);
        toast.error('Erro ao tentar '+ (cd_maquina ? 'editar': 'cadastrar') +' a máquina');
        return;
      }
      
      setLoading(false);
      toast.success('Máquina '+ (cd_maquina ? 'editada': 'cadastrada')+' com sucesso!');
      setFormData({});
      setMaqFiles([]);
      setValidated(false);

      history('/painel/maquinas');
    } catch (err) {
      toast.error('Erro ao tentar '+ (cd_maquina ? 'editar': 'cadastrar') +' a máquina');
      setLoading(false);
      console.log(err)
    }
  }

  useEffect(() => {
    if(cd_maquina && !isNaN(cd_maquina) && categorias?.length) {
      
      async function carregarDadosMaquina () {
        setLoading(true);
        const res = await maquinaFactory.listarPorPerfil({cd_maquina: cd_maquina});
        
        if (res.success) {
          const maq = res.dados[0];
          setFormData({
            cd_categoria: maq.cd_categoria,
            cd_status: maq.cd_status,
            cd_estado: maq.cd_estado,
            cd_cidade: maq.cd_cidade,
            cd_placa: maq.cd_placa,
            vl_hora: maq.vl_hora * 100,
            nr_chassi: maq.nr_chassi,
            ds_uso: maq.ds_uso,
            cd_maquina: maq.cd_maquina
          });

          setMaqFiles(maq.imagens ? maq.imagens : []);
          setLoading(false);
        }
      }

      carregarDadosMaquina();
    }
  },[cd_maquina, categorias]);

  useEffect(() => {
    async function getCategorias() {
      try {
        setLoading(true);        
        let res = await maquinaFactory.getCategorias();
        if (res.success) setCategorias(res.dados);

        setLoading(false);
      } catch(e) {
        console.log(e);
        setLoading(false);
      }
    }

    getCategorias();
  },[]);

  return (
    <>
      <Container className="__MaquinaForm">
        <Row>
          <Col lg={{ span: 8, offset: 2 }} className="formCadastroContainer">
            <FormContainer>
              <Form className="formCadastro" validated={validated} onSubmit={handleSubmit}>
                <h4>{cd_maquina ? 'Editar' : 'Cadastrar'} Máquina</h4>

                <Row>
                  <div className="formFieldTitle">
                    <hr />
                  </div>
                </Row>

                <Row className="mb-4">

                  <Col md={6}>
                    <Form.Group className="mb-2" controlId="cd_categoria">
                      <Form.Label>Categoria</Form.Label>
                      <Form.Select
                        id="cd_categoria"
                        name="cd_categoria"
                        onChange={handleOnChange}
                        value={inputValue(formData?.cd_categoria)}
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
                  <Col md={6}>
                    <Form.Group className="mb-2" controlId="cd_status">
                      <Form.Label>Situação</Form.Label>
                      <Form.Select
                        id="cd_status"
                        name="cd_status"
                        onChange={handleOnChange}
                        value={inputValue(formData?.cd_status)}
                        required
                      >
                        <option value="">Selecione a situação da máquina</option>
                        <option value="ATIVO">Disponivel</option>
                        <option value="INATIVO">Indisponivel</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="cd_placa">Placa</Form.Label>
                    <Form.Control
                      type="text"
                      name="cd_placa"
                      id="cd_placa"
                      value={inputValue(formData?.cd_placa)}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(regexPatterns.alphaNumericosComEspaco, '');
                        handleOnChange(e);
                      }}
                      placeholder="ABC1234"
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label htmlFor="nr_chassi">Chassi</Form.Label>
                    <Form.Control
                      type="text"
                      name="nr_chassi"
                      id="nr_chassi"
                      value={inputValue(formData?.nr_chassi)}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(regexPatterns.alphaNumericosComEspaco, '');
                        handleOnChange(e);
                      }}
                      required
                    />
                  </Col>
                </Row>

                {/* DADOS DE ENDEREÇO */}
                <Row>
                  <Col sm={6} md={6}>
                    <EMSelectEstado
                      className="mb-4"
                      controlId="cd_estado"
                      form={formData}
                      setter={setFormData}
                      required
                    />
                  </Col>

                  <Col sm={6} md={6}>
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
                </Row>

                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Label htmlFor="vl_hora">Valor/Hora</Form.Label>
                    <Form.Control
                      type="text"
                      name="vl_hora"
                      id="vl_hora"
                      value={inputValue(currencyFormat(formData?.vl_hora, true))}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(regexPatterns.onlyNumbers, '');
                        handleOnChange(e);
                      }}
                      step={.001}
                      required
                    />
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Label htmlFor="ds_uso">Descrição de uso</Form.Label>
                    <Form.Control
                      rows={3}
                      as="textarea"
                      name="ds_uso"
                      id="ds_uso"
                      value={inputValue(formData?.ds_uso)}
                      onChange={handleOnChange}
                    />
                  </Col>
                </Row>                

                <hr />

                {/* Imagens */}
                <Row>
                  {
                    maqFiles?.map((img, i) => {
                      const url = img.fileUrl.length ? img.fileUrl : img.fileBase64;
                      console.log(img.fileUrl);
                      return (
                      <Col sm={3} key={i} className="mt-3">
                        <div className="maqImgContainer" >
                          <FontAwesomeIcon icon={faTrashAlt} className="iconRemoveImage" onClick={() => handleRemoveImage(i)}/>
                          <img src={url} alt="" />
                        </div>
                      </Col>
                    )})
                  }
                  
                </Row>
                <Row>
                  <Col className="mt-4" md={12}>
                    <h5>Fotos da máquina</h5>
                    <EMButtonUpload
                      text="Adicionar fotos"
                      isMultiple={true}
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      accept="image/png, image/gif, image/jpeg"
                      maxFiles={5}
                      controller={{
                        files: maqFiles,
                        setFiles : setMaqFiles
                      }}
                    />
                    <p>
                      Adicione de 1 a 5 fotos no formato <b>JPG</b> ou <b>PNG</b>, nas dimensões <b>800px</b>*<b>500px</b> e contendo no máximo <b>1.5MB</b> de tamanho cada
                    </p>
                  </Col>                
                </Row>

                <hr />

                <Row className="mt-4">
                  <Col className="text-right">
                    <EMButton type="submit" text="Salvar" />
                  </Col>
                </Row>

              </Form>
            </FormContainer>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default MaquinaForm;