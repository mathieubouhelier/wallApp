import React from 'react';
import { inputConstants } from '../utils/constants'


const Input = ({ className, name, type, dataTestid, placeholder, value, onChange, inputType, inputValid }) => {
  const TypeOfInput = inputType ? inputType : "default"; //Replace by default props ?


  return (
    <div className="row mt-3">
      <div className="col-md-12 form-group">
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
      </div>
    </div>


  )
}

export default Input;
