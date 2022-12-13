import React from 'react'
import Select from 'react-select';
import { Row, Col, Container, Form, Button, InputGroup, Modal } from 'react-bootstrap';

import './style.scss';

const SelectWrap = props => {
  const { value, required, disabled, className } = props;
  let pardeValue = value;
  if(Array.isArray(value) || typeof value === 'object') pardeValue = Object.keys(value).length > 0 ? value : "";

  console.log(required);

  return (
    <div className="select-wrapper-container">
      <Select {...props} className={`${className} select-wrapper`}/>
      <Form.Control 
        className="input-required" 
        type="text" 
        // onChange={() => {}}
        // tabIndex={-1}
        required={required} 
        // disabled={disabled} 
      />
    </div>
  )
}

export default SelectWrap