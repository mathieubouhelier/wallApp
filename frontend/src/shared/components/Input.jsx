import React from 'react';
import { inputConstants } from '../utils/constants'
import { Col, Row } from 'react-bootstrap/';


const Input = ({ className, name, type, dataTestid, placeholder, value, onChange, inputType, inputValid }) => {
  const TypeOfInput = inputType ? inputType : "default";

  return (
    <Row className="mt-4 justify-content-center ">
      <Col className="col-md-4 form-group">
        <input
          className={className ? `${className}` : inputConstants[TypeOfInput].className}
          name={name ? name : inputConstants[TypeOfInput].name}
          type={type ? type : inputConstants[TypeOfInput].type}
          data-testid={dataTestid ? dataTestid : null}
          placeholder={placeholder ? placeholder : inputConstants[TypeOfInput].placeholder}
          value={value ? value : null}
          onChange={onChange}
        />
        {!inputValid ?
          <small id="emailHelp" className="form-text text-danger">{inputConstants[TypeOfInput].invalidMessage}</small> :
          <small>  </small>}
      </Col>
    </Row>
  )
}

export default Input;
