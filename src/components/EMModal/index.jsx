import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './style.scss';

function EMModal(props) {
  const { titulo, children, modalProps } = props;
  return (
    <Modal
      {...modalProps}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName ="__modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {titulo}
        </Modal.Title>
      </Modal.Header>
      {children}
    </Modal>
  );
}

export default EMModal;