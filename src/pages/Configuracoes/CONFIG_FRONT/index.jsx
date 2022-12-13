import React, { Component, useContext, useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Col, Row, Container, Form } from 'react-bootstrap';
import appFactory from '../../../services/appFactory';
import useLogged from "../../../hooks/useLogged";
import LoadingContext from '../../../contexts/LoadingContext';
import UserContext from '../../../contexts/UserContext';
import EMButton from '../../../components/EMButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { inputValue } from '../../../helpers';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ConfigFront = props => {

  useLogged('/');
  const history = useNavigate();

  const { setLoading } = useContext(LoadingContext);

  const [frontConfig, setFrontConfig] = useState([]);

  const addNewField = () => {
    setFrontConfig(frontConfig.concat([{
      "key": "",
      "value": ""
    }]));
  }

  const handleOnChangeArray = (e, index) => {
    const { value, name } = e.target;
    setFrontConfig(frontConfig.map((em, i) => {
      if (i === index) {
        em[name] = value;
      }
      return em;
    }));
  }

  const handleSave = async () => {
    try {
      setLoading(true);

      const _config = frontConfig.filter(c => c.key !== "");

      console.log(_config);

      const res = await appFactory.saveConfig('CONFIG_FRONT', _config);

      console.log(res);
      if(res.success) {
        toast.success('Configurações atualizadas com sucesso');
        history('/painel/configuracoes');
      } else {
        toast.error('Ops, ocorreu um erro ao tentar atualizar as configurações');
      }
      
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    async function listarConfigs() {
      setLoading(true);
      const dados = await appFactory.getConfigs('CONFIG_FRONT');
      if(dados.success) {
        setFrontConfig(dados.dados[0]['ds_valor']);
      }
      setLoading(false);
    }
    listarConfigs();
  }, []);

  return (
    <Container className="__MaquinaForm" fluid>
      {
        frontConfig.map((item, index) => (
          <Row className="mt-1">

            <Col lg={{ span: 8, offset: 2 }}>
              <Row>
                <Col className="mt-3">
                  <Form.Label htmlFor="key">Chave</Form.Label>
                  <Form.Control
                    type="text"
                    name="key"
                    id="key"
                    className="mb-3"
                    value={inputValue(item?.key)}
                    onChange={(e) => {
                      handleOnChangeArray(e, index);
                    }}
                    required
                  />
                </Col>
                <Col className="mt-3">
                  <Form.Label htmlFor="value">Valor</Form.Label>
                  <Form.Control
                    type="text"
                    name="value"
                    id="value"
                    className="mb-3"
                    value={inputValue(item?.value)}
                    onChange={(e) => {
                      handleOnChangeArray(e, index);
                    }}
                    required
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        ))
      }
      <Row>
        <Col lg={{ span: 8, offset: 2 }} className="mt-4 mb-5">
          <Row>
            <Col>
              <EMButton text={"Salvar"} type="button" onClick={handleSave} />
            </Col>
            <Col className="text-right">
              <EMButton text={"Adicionar novo template "} type="button" onClick={addNewField} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ConfigFront;
