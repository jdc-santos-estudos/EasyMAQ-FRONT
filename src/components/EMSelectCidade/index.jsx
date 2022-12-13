import { useEffect, useContext, useState } from 'react';
import { Row, Col, Container, Form, Button, InputGroup } from 'react-bootstrap';
import appFactory from '../../services/appFactory';
import { inputValue, ordenarObjectArray } from '../../helpers';
import LoadingContext from '../../contexts/LoadingContext';
import Select from 'react-select'
import eventHandlers from '../../helpers/eventHandlers';

import './style.scss';

const EMSelectCidade = props => {
  
  const {className, controlId, form, setter, watch, required, validated} = props;

  const [cidades, setCidades] = useState([]);
  const [selected, setSelected] = useState(false);
  
  const { setLoading } = useContext(LoadingContext);

  const handleOnChange = eventHandlers.onChange(form, setter);

  const handleChangeCidade = (e) => {
    setSelected(e);
    handleOnChange({target: {value: e.value, name: 'cd_cidade'}});
  }

  useEffect(() => {

    if(watch && !isNaN(watch)) {
      
      const a = async () => {

        setLoading(true);
        let tentativas = 0;
        let _cidades = [];

        do {
          _cidades = (await appFactory.getCidades(watch)).dados;

          if (_cidades.length) {
            setCidades(_cidades.sort(ordenarObjectArray('nm_cidade')).map(c => {
              if(form?.cd_cidade && c.cd_cidade == form?.cd_cidade) {
                handleChangeCidade({
                  value: c.cd_cidade,
                  label: c.nm_cidade
                });
              }
              return {
                value: c.cd_cidade,
                label: c.nm_cidade
              }
            }));
          }
        } while(tentativas < 5 && _cidades.length == 0);
        
        setLoading(false);
      }

      a().catch((e) => {
        setLoading(false);
        console.error(e)
      });

    } else {
      setCidades([]);
      setLoading(false);
    }

    
  },[watch]);


  useEffect(() => {
    if (!form?.cd_cidade) setSelected(false);
  },[form?.cd_cidade]);

  return (
    <Form.Group className={className} controlId={controlId}>
      <Form.Label>Cidade</Form.Label>
      <Select 
        classNamePrefix="SC_"
        className={'SelectCidade '+ required && !selected && validated  ? 'invalidSelect' : (
          required && selected && validated ?' validSelect' : ''
        )}
        options={cidades}
        name="cd_cidade"
        onChange={handleChangeCidade}
        value={inputValue(selected)}
        isDisabled={!watch}
      />      
    </Form.Group>
  )
}

export default EMSelectCidade;