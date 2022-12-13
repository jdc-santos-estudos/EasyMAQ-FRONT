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

import './style.scss';

const EmailTemplates = props => {

  useLogged('/');
  const history = useNavigate();

  const { setLoading } = useContext(LoadingContext);

  const [emails, setEmails] = useState([]);

  const addNewTemplate = () => {
    setEmails(emails.concat([{
      "acao": "",
      "titulo": "",
      "conteudo": ""
    }]));
  }

  const handleOnChangeArray = (e, index) => {
    const { value, name } = e.target;
    setEmails(emails.map((em, i) => {
      if (i === index) {
        em[name] = value;
      }
      return em;
    }));
  }

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await appFactory.saveConfig('EMAIL_TEMPLATES', emails);

      console.log(res);
      if (res.success) {
        toast.success('Templates atualizados com sucesso');
        history('/painel/configuracoes');
      } else {
        toast.error('Ops, ocorreu um erro ao tentar atualizar os templates');
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
      const dados = await appFactory.getConfigs('EMAIL_TEMPLATES');
      if (dados.success) {
        setEmails(dados.dados[0]['ds_valor']);
      }
      setLoading(false);
    }
    listarConfigs();
  }, []);

  return (
    <Container className="__EmailTemplates" fluid>
      <Row className="mt-5">

        <Col lg={{ span: 8, offset: 2 }}>
          <h2>Templates de emails</h2>
        </Col>
      </Row>
      {
        emails.map((email, index) => (
          <Row className="mt-2">

            <Col lg={{ span: 8, offset: 2 }}>
              <hr />

              <Row className="mb-3">
                <Col>
                  <Form.Label htmlFor="acao">ação</Form.Label>
                  <Form.Control
                    type="text"
                    name="acao"
                    id="acao"
                    className="mb-3"
                    value={inputValue(email?.acao)}
                    onChange={(e) => {
                      handleOnChangeArray(e, index);
                    }}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label htmlFor="titulo">Titulo</Form.Label>
                  <Form.Control
                    type="text"
                    name="titulo"
                    id="titulo"
                    className="mb-3"
                    value={inputValue(email?.titulo)}
                    onChange={(e) => {
                      handleOnChangeArray(e, index);
                    }}
                    required
                  />
                </Col>
              </Row>

              <CKEditor
                editor={ClassicEditor}
                data={inputValue(email?.conteudo)}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleOnChangeArray({ target: { name: "conteudo", value: data } }, index);
                }}
              />
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
              <EMButton text={"Adicionar novo template "} type="button" onClick={addNewTemplate} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default EmailTemplates;
