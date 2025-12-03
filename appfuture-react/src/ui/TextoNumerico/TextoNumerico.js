import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Util } from '../../util/Util';

class TextoNumerico extends Component {
  state = { _id: this.props.id || Util.generarIdControl('txt') }

  onKeyPress = (evento) => {
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
  };

  onChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };

  render() {
    const {
      aceptaNegativos,
      aceptaDecimales,
      formatearOnBlur,
      tipoMoneda,
      simboloMoneda,
      cols, label, name, placeholder, className, inputClassName, value, maxLength, required, extra } = this.props;

    const lblRequired = required ? '*' : '';

    return (
      <div className={`form-group col-${cols} ${className}`}>
        <label htmlFor={this.state._id}>{label}{lblRequired}</label>
        <input
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          type='text'
          name={name}
          id={this.state._id}
          className={`form-control ${inputClassName}`}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          required={required}
          {...extra}
        />
      </div>
    );
  }
}

TextoNumerico.propTypes = {
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
  extra: PropTypes.object,

  aceptaNegativos: PropTypes.bool,
  aceptaDecimales: PropTypes.bool,
  formatearOnBlur: PropTypes.bool,
  tipoMoneda: PropTypes.bool,
  simboloMoneda: PropTypes.string
};

TextoNumerico.defaultProps = {
  cols: '4',
  placeholder: '',
  className: '',
  inputClassName: '',
  value: '',
  required: false,

  aceptaNegativos: true,
  aceptaDecimales: true,
  formatearOnBlur: true,
  tipoMoneda: false,
  simboloMoneda: '$'
};

export default TextoNumerico;
