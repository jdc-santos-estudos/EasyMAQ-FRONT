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
import pedidoFactory from '../../services/pedidoFactory';

const StripeResponse = props => {
  const history = useNavigate();
  const [searchParams] = useSearchParams();
  const { setLoading } = useContext(LoadingContext);
  const [showError, setShowError] = useState(false);

  const { setUserData } = useContext(UserContext);
  useEffect(() => {
    const cd_pedido = searchParams.get('cd_pedido');
    const res = searchParams.get('res');

    if(!isNaN(cd_pedido) && res) {
      async function aprovado() {
        try {
          
          if(res == 'success') {
            setLoading(true);
            const _res = await pedidoFactory.atualizarStatus({cd_pedido: cd_pedido, nm_status_pedido: 'APR'});
            setLoading(false);

            localStorage.setItem('pgto_pedido', '1');

            if(_res.success) { toast.success('Pagamento efetuado com sucesso!');   }
          }

          history('/painel/pedido/'+cd_pedido);
        } catch(e) {
          localStorage.setItem('pgto_pedido', '0');
          history('/painel/pedido/'+cd_pedido);
          setLoading(false);
          console.log(e);
        }
      }
      aprovado();
    }
    
  },[searchParams]);

}

export default StripeResponse;