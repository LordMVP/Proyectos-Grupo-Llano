import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Util } from '../../util/Util';

class Input extends Component {
  state = { _id: this.props.id || Util.generarIdControl('input') };

  onKeyPress = (evento) => {
    if (this.props.type === 'number') {
      const input = evento.currentTarget;
      let texto = input.value;

      const { aceptaDecimales, aceptaNegativos } = this.props;

      if (aceptaDecimales && evento.which === 46) {

        if (texto.trim() === '') {  //evita que se ponga un . al iniciar la caja
          Util.detenerEvento(evento);
          return false;
        }

        if (texto.indexOf('.') !== -1) { //evita que se ponga más de un signo .
          Util.detenerEvento(evento);
          return false;
        }

        if (!isNaN(texto) && parseInt(texto) === 0) {
          if (texto.startsWith('-')) {
            input.value = '-0.';
          } else {
            input.value = '0.';
          }
          Util.detenerEvento(evento);
          return false;
        }
        return true; //se agrega un punto normalmente
      }

      if (aceptaNegativos && evento.which === 45) {
        if (input.selectionStart === 0) {
          return true;  //evita que se ponga el guión, si no es la en la primera posición.
        }
        if (texto.indexOf('-') !== -1) {
          Util.detenerEvento(evento);
          return false;  //evita que se pueda agregar más de un guión
        }
        if (texto.trim().length > 0) { //evita que se ponga un guión, si no es el primer carácter
          Util.detenerEvento(evento);
          return false;
        }
        return true;
      }

      if (evento.which !== 8 && evento.which !== 0 && (evento.which < 48 || evento.which > 57)) {
        Util.detenerEvento(evento);
        return false;
      }
    }
  };

  onChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  render() {
    const { aceptaNegativos, aceptaDecimales, ...props } = this.props;
    const { cols, className, inputClassName, name, label, placeholder, type, value, extra, required } = props;

    // attrs

    const classNameElement = className
      ? `form-group col-${cols} ${className}`
      : `form-group col-${cols}`;

    const lblRequired = required ? '*' : '';

    return (
      <div className={classNameElement}>
        <label htmlFor={this.state._id}>{label}{lblRequired}</label>
        <input
          type={type}
          name={name}
          id={this.state._id}
          placeholder={placeholder}
          className={`form-control ${inputClassName}`}
          onChange={this.onChange}
          value={value}
          {...extra}
        />
      </div>
    );
  }
}

Input.propTypes = {
  id: PropTypes.string,
  cols: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
  maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  extra: PropTypes.object
};

Input.defaultProps = {
  cols: '4',
  inputClassName: '',
  type: 'text',
  required: false,
  aceptaNegativos: true,
  aceptaDecimales: true,
};

export default Input;
