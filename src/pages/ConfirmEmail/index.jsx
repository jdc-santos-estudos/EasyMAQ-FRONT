import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Show from '../../components/ShowIf';
import EMModal from '../../components/EMModal';
import LoadingContext from '../../contexts/LoadingContext';
import appFactory from '../../services/appFactory';
import Auth from '../../Auth';
import { toast } from 'react-toastify';
import EMButton from '../../components/EMButton';
import {Modal, Col, Row} from 'react-bootstrap';
import UserContext from '../../contexts/UserContext';

const ConfirmEmail = props => {
  const history = useNavigate();
  const [searchParams] = useSearchParams();
  const { setLoading } = useContext(LoadingContext);
  const [showError, setShowError] = useState(false);

  const { setUserData } = useContext(UserContext);

  useEffect(() => {
    if(searchParams.get('token')) {
      async function confirmEmail() {
        try {
          setLoading(true);
          const res = await appFactory.confirmEmail(searchParams.get('token'));

          if(res.success) {           

            if (res.dados) {
              console.log(res);
              Auth.saveSession(res.dados);
              const userInfo = await appFactory.getUserInfo();
              setUserData(userInfo.dados);
            }

            toast.success('Conta verificada com sucesso!');
            history('/');
          } else {
            setShowError(true);
          }

          setLoading(false);
        } catch(e) {
          setShowError(true);
          setLoading(false);
          console.log(e);
        }
      }
      confirmEmail();
    }
    
  },[searchParams]);

  return (
    <>
      <EMModal
          modalProps={{
            "size": "md",
            "show": showError,
            "onHide": () => {
              setShowError(false);
              history('/');
            }
          }}
          titulo="Falha ao verificar o E-mail"
        >
          <Modal.Body>
            <Row>
              <Col>
                Ops... não foi possivel verificar o seu e-mail =(<br/>
                Entre em contato conosco pelos canais de suporte.
              </Col>
            </Row>
            <Row>
              <Col className="text-right mt-4 mb-2">
                <EMButton
                  text="OK"
                  onClick={() => {
                    setShowError(false);
                    history('/');
                  }}
                />
              </Col>
            </Row>
          </Modal.Body>
        </EMModal>
    </>
  )
}

export default ConfirmEmail;