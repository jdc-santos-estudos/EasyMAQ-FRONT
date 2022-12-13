import { useEffect, useContext, useState } from 'react';
import { Row, Col, Container, Form, Button, InputGroup } from 'react-bootstrap';

import appFactory from '../../services/appFactory';
import { ordenarObjectArray, inputValue } from '../../helpers';
import eventHandlers from '../../helpers/eventHandlers';

let TENTATIVAS = 0;

const EMSelectEstado = props => {

  const {className, controlId, form, setter, required} = props;

  const [estados, setEstados] = useState([]);

  const handleOnChange = eventHandlers.onChange(form, setter);

  useEffect(() => {
    (async () => {
      let _estados = null;

      do {
        _estados = (await appFactory.getEstados()).dados;
        console.log('tentou');
        if (_estados?.length) setEstados(_estados);
        TENTATIVAS++;

      } while(TENTATIVAS < 5 && _estados?.length == 0);
      
    
    })().catch(console.error);
  },[]);

  useEffect(() => {
    setter({ ...form, cd_cidade: null })
  },[form?.cd_estado])

  return (
    <Form.Group className={className} controlId={controlId}>
      <Form.Label>Estado</Form.Label>
      <Form.Select 
        name="cd_estado"
        onChange={handleOnChange}
        value={ inputValue(form?.cd_estado) }
        required={required}
      >
        <option value="">Selecione um estado</option>
        {
          estados?.sort(ordenarObjectArray('nm_estado')).map((e, k) => (
            <option value={e.cd_estado} key={k}>{e.nm_estado}</option>
          ))
        }
      </Form.Select>
    </Form.Group>
  )
}

export default EMSelectEstado;