import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Form, Button, Container, Modal, Table } from 'react-bootstrap';
import EMPagination from '../../components/EMPagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus, faEye, faDownload } from "@fortawesome/free-solid-svg-icons";
import Show from '../ShowIf';
import EMModal from '../EMModal';
import EMButton from '../EMButton';

import './style.scss';

const EMTable = props => {
  const {
    titulo,
    headerActions = [],
    cols,
    acoes = {},
    registros = [],
    modal = {}
  } = props;

  const [currentItems, setCurrentItems] = useState([]);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const onChangePage = (dados) => { setCurrentItems(dados?.currentItems); }

  const handleShowModalExcluir = (item) => {
    setSelectedItem(item);
    setShowModalExcluir(true);
  }

  const handleConfirmarExcluir = () => {
    if (acoes?.excluir) acoes?.excluir(selectedItem);
  }

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h2>{titulo}</h2>
        </Col>
        <Col className="text-right">

          <Show if={headerActions?.btnCadastrar}>
            <Link
              to={headerActions?.btnCadastrar?.to}
              className="btnNewItem spanHeaderActions"
            >
              {headerActions?.btnCadastrar?.text} <FontAwesomeIcon icon={faPlus} />
            </Link>
          </Show>

        </Col>
      </Row>

      <Row>
        <Col className="EMTableContainer">
          <Table className="table table-striped">
            <thead>
              <tr>
                {
                  cols?.map((c, i) => (
                    <th key={i}>{c.name}</th>
                  ))
                }
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                currentItems?.map((r, i) => {
                  return (
                    <tr key={i}>
                      {
                        cols.map((cc, ic) => (
                          <td key={ic}>{r[cc.field]}</td>
                        ))
                      }
                      <td className="text-right colActions">
                         
                        <Show if={r['downloadLink'] && r['downloadLink'].length > 0}>
                          <a href={ r['downloadLink'] } download>
                            <Button className="actionButton btn-success" type="button">
                              <FontAwesomeIcon icon={faDownload} />
                            </Button>
                          </a>
                        </Show>

                        <Show if={acoes?.visualizar}>
                          <Button className="actionButton" onClick={() => acoes?.visualizar(r)}>
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                        </Show>

                        <Show if={acoes?.editar}>
                          <Button className="actionButton" onClick={() => acoes?.editar(r)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </Show>

                        <Show if={acoes?.excluir}>
                          <Button className="actionButton btn-danger" onClick={() => handleShowModalExcluir(r)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </Button>
                        </Show>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Col>
      </Row>


      <EMPagination
        itemsPerPage={10}
        onClick={onChangePage}
        items={registros}
      />

      {/* <Show if={modal }></Show> */}
      <EMModal
        modalProps={{
          "size": "lg",
          "show": showModalExcluir,
          "onHide": () => setShowModalExcluir(false)
        }}
        titulo={modal?.titulo}
      >
        <Modal.Body>
          <Row>
            <Col className="text-center pt-3">
              {modal?.texto}
            </Col>
          </Row>
          <Row>
            <Col className="text-right mt-4 mb-2">
              <EMButton
                text="Confirmar"
                onClick={() => {
                  handleConfirmarExcluir();
                  setShowModalExcluir(false);
                }}
              />
            </Col>
          </Row>
        </Modal.Body>
      </EMModal>
    </>

  )
}

export default EMTable;