import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Util } from '../../util/Util';

import './Fecha.scss';
import JDatePicker from './JDatePicker/JDatePicker';
import moment from 'moment';

class Fecha extends Component {

  control = null;
  state = {
    _id: this.props.id || Util.generarIdControl('fecha'),
    fecha: Util.convertirStringAFecha(this.props.fecha)
  };

  static getDerivedStateFromProps(props, current_state) {
    if (props.fecha && (props.fecha !== current_state.fecha)) {
      return { fecha: props.fecha };
    }
    return null;
  }

  onChange = (fecha) => {
    const input = this.control.input;
    this.setState({ fecha: fecha });
    if (fecha) {
      let formato = 'YYYY-MM-DD';
      if (this.props.sinDia) {
        formato = 'YYYY-MM';
      }
      input.value = moment(fecha).format(formato);
    }
    const evento = {
      target: input,
      currentTarget: input
    };
    this.props.onChange(evento, fecha, this.control);
  };

  onInputError = (err) => {
    return null;
  };

  render() {
    const { _id } = this.state;
    let {
      formato,
      name,
      extra,
      label,
      fecha,
      placeholder,
      className,
      cols
    } = this.props;

    const fechaInicio = Util.convertirStringAFecha(this.props.fechaInicio);
    const fechaFin = Util.convertirStringAFecha(this.props.fechaFin);
    if (this.props.sinDia) {
      formato = 'yyyy-MM';
    }

    const propiedadesPorDefecto = {
      defaultValue: Util.convertirStringAFecha(this.state.fecha),
      onChange: this.onChange,
      dateFormat: formato || 'yyyy-MM-dd',
      disabled: true,
    };
    const estilo = `fecha form-group col-${cols} ${className || ''}`;

    return (
      <div className={estilo}>
        <label htmlFor={_id}>{label}</label>
        <JDatePicker
          id={_id}
          ref={(control) => { this.control = control }}
          name={name}
          fecha={fecha}
          min={fechaInicio}
          max={fechaFin}
          sinDia={this.props.sinDia}
          {...propiedadesPorDefecto}
          {...extra}
        />
      </div>
    );
  }
}

Fecha.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number]),
  fechaInicio: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number]),
  fechaFin: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number]),
  formato: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  cols: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

Fecha.defaultProps = {
  fechaInicio: undefined,
  fechaFin: undefined,
  formato: 'yyyy-MM-dd',
  placeholder: 'Seleccione una fecha',
  className: '',
  cols: 4
}

export default Fecha;
