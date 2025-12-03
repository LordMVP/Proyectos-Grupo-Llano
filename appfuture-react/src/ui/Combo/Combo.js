import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Util } from '../../util/Util';

class Combo extends Component {
  state = { _id: this.props.id || Util.generarIdControl('cmb') };

  onChange = (event) => {
    if (this.props.onChange) {
      this.props.onChange(event.nativeEvent);
    }
  };

  obtenerValorObjeto = (objeto, llaves) => {
    const keys = llaves.split('.');

    let objTemporal = null;
    for (let i = 0; i < keys.length; i++) {
      const llaveObjeto = keys[i];
      if (!objTemporal) {
        objTemporal = objeto[llaveObjeto];
      } else {
        objTemporal = objTemporal[llaveObjeto];
      }
    }
    return objTemporal;
  };

  crearOpcion = (opcion) => {
    if (opcion.defecto) {
      return <option key={this.state._id + '_' + opcion.valor} value={opcion.valor}>{opcion.texto}</option>
    }

    const { propTexto, propValor } = this.props;

    let texto = opcion[propTexto];
    let valor = opcion[propValor];

    if (propTexto.indexOf('.') > -1) {
      texto = this.obtenerValorObjeto(opcion, propTexto);
    }
    if (propValor.indexOf('.') > -1) {
      valor = this.obtenerValorObjeto(opcion, propValor);
    }

    return <option key={this.state._id + '_' + valor} value={valor}>{texto}</option>
  }

  renderOpciones = () => {
    const { textoPorDefecto, mostrarOpcionPorDefecto, opciones = [] } = this.props;

    const arreglo = opciones.map((elemento, index) => this.crearOpcion(elemento, index));

    if (!mostrarOpcionPorDefecto) return arreglo;

    const defecto = {
      valor: -1,
      texto: textoPorDefecto || 'Seleccione una opción',
      'defecto': true
    }

    return [this.crearOpcion(defecto), ...arreglo]
  };

  render() {
    const id = this.state._id;
    const { cols, label, className, controlClassName, value, size, name, extra, required } = this.props;

    const _className = className
      ? `form-group col-${cols} ${className}`
      : `form-group col-${cols}`;

    const _controlClassName = controlClassName
      ? `form-control ${controlClassName}` : `form-control`;

    // required

    const lblRequired = required ? '*' : '';

    return (
      <div className={_className}>
        <label htmlFor={id}>{label}{lblRequired}</label>
        <select id={id} name={name} className={`form-control ${_controlClassName}`} size={size} onChange={this.onChange} value={value} {...extra}>
          {this.renderOpciones()}
        </select>
      </div>
    );
  }
}

Combo.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  cols: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  controlClassName: PropTypes.string,
  opciones: PropTypes.array,
  onChange: PropTypes.func,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  propValor: PropTypes.string,
  propTexto: PropTypes.string,
  mostrarOpcionPorDefecto: PropTypes.bool,
  textoPorDefecto: PropTypes.string,
  value: PropTypes.any,
  extra: PropTypes.object
};

Combo.defaultProps = {
  cols: '4',
  propValor: 'valor',
  size: 0,
  propTexto: 'texto',
  mostrarOpcionPorDefecto: true,
  textoPorDefecto: 'Seleccione una Opción',
  value: '-1',
  required: false,
};

export default Combo;
