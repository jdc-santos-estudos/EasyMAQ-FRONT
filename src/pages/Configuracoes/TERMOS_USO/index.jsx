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
import eventHandlers from '../../../helpers/eventHandlers';

import './style.scss';

const TermosUso = props => {
  const history = useNavigate();

  const { setLoading } = useContext(LoadingContext);
  const {userData} = useContext(UserContext);
  useLogged('/', (userData?.tipo_perfil && !['ADMIN1','ADMIN2'].includes(userData?.tipo_perfil)));
  

  const [termo, setTermo] = useState([]);

  const handleOnChange = eventHandlers.onChange(termo, setTermo);

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await appFactory.saveConfig('TERMOS_USO', termo?.conteudo);

      if (res.success) {
        toast.success('Termos de uso atualizados com sucesso');
        history('/painel/configuracoes');
      } else {
        toast.error('Ops, ocorreu um erro ao tentar atualizar os termos de uso');
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
      const dados = await appFactory.getConfigs('TERMOS_USO');
      if (dados.success) {
        setTermo({conteudo:dados.dados[0]['ds_valor']});
      }
      setLoading(false);
    }
    listarConfigs();
  }, []);

  return (
    <Container className="__MaquinaForm" fluid>

      <Row className="mt-5">
        <Col lg={{ span: 8, offset: 2 }}>
          <h2>Termos de uso</h2>
          <hr />
          <CKEditor
            editor={ClassicEditor}
            data={inputValue(termo?.conteudo)}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleOnChange({ target: { name: "conteudo", value: data } })
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={{ span: 8, offset: 2 }} className="mt-4 mb-5">
          <Row>
            <Col className="text-right">
              <EMButton text={"Salvar"} type="button" onClick={handleSave} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default TermosUso;
