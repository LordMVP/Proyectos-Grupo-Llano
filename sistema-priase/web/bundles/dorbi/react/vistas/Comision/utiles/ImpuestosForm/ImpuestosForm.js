import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import RUTAS_API from '../../../../global/rutas_api';
import { URL_COM } from '../../../../global/constantes';
import './ImpuestosForm.scss';

class ImpuestosForm extends Component {
  state = {
    impuestos: []
  }

  /**
   * Método encargado de cargar la lista en la tabla cuando se monte el componente
   */
  componentDidMount() {
    this.obtenerImpuestos();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.editable !== this.props.editable) {
      this.actualizarInfo(this.props.impuestosInfo);
    }
  }

  actualizarInfo = (impuestosInfo) => {
    if (this.props.editable) {
      const impuestos = this.state.impuestos;

      for (let i = 0; i < impuestos.length; i++) {
        const j = impuestosInfo.findIndex((impuestoInfo) =>
          impuestoInfo.uni_impuesto === impuestos[i].uni_concepto);
  
        if (j > -1) {
          if (impuestosInfo[j].irc_valor) 
            impuestos[i].con_valor = impuestosInfo[j].irc_valor;
          else impuestos[i].con_valor = impuestosInfo[j].icc_valor;
          impuestos[i].active = true;
        } else {
          impuestos[i].active = false;
        }
      }

      this.setState({ impuestos });
    } else {
      const impuestos = this.state.impuestos;

      for (let i = 0; i < impuestos.length; i++) {
        impuestos[i].active = false;
      }

      this.setState({ impuestos }, () =>
        this.props.modificarImpuestos(this.state.impuestos));
    }
  }

  /**
   * Método encargado de consultar las variables de priorización de conceptos
   */
  obtenerImpuestos = () => {
    axios.get(URL_COM+RUTAS_API.COMISION.IMPUESTOS)
      .then(respuesta => this.setState({ impuestos: respuesta.data.datos },
        () => this.agregarActivo()))
      .catch((error) => console.log(error));
  }

  agregarActivo = () => {
    const impuestos = this.state.impuestos;

    impuestos.forEach(impuesto => {
      impuesto.active = false;
    });

    this.setState({ impuestos }, () =>
      this.props.modificarImpuestos(this.state.impuestos));
  }

  /**
   * Método encargado de controlar el cambio del valor del impuesto.
   */
  controlarCambioImpuestoValor = (evento, impuesto) => {
    evento.preventDefault();

    const impuestos = [...this.state.impuestos];
    const index = impuestos.findIndex(imp => imp.uni_concepto == impuesto.uni_concepto);
    impuestos[index].con_valor = Number(evento.target.value);

    this.props.modificarImpuestos(impuestos);

    this.setState({ impuestos }, () =>
      this.props.modificarImpuestos(this.state.impuestos));
  }

  /**
   * Método encargado de controlar el cambio de impuesto activo.
   */
  controlarCambioImpuestoActivo = (evento, impuesto) => {
    const impuestos = [...this.state.impuestos];
    const index = impuestos.findIndex(i => i.uni_concepto == impuesto.uni_concepto);
    impuestos[index].active = evento.target.checked;

    this.props.modificarImpuestos(impuestos);

    this.setState({ impuestos }, () =>
      this.props.modificarImpuestos(this.state.impuestos));
  }

  render() {
    const { impuestos } = this.state;

    return (
      <Fragment>
        <h3><strong>Impuestos</strong></h3><br/>
        <table className='table mt-8'>
          <thead>
            <tr>
              <th scope="col">Tipo</th>
              <th scope="col">%</th>
              <th scope="col">Aplica</th>
            </tr>
          </thead>
          <tbody>
            {impuestos.map((impuesto, index) => 
            <tr key={`impuesto-${index}`}>
              <td>{impuesto.con_alias}</td>
              <td>
                <input
                  value={impuesto.con_valor !== null ? impuesto.con_valor : 0}
                  type="number"
                  step=".01"
                  min={0}
                  onChange={(evento) => this.controlarCambioImpuestoValor(evento, impuesto)}
                  name="impuesto-valor"
                  className="form-control"/>
              </td>
              <td>
                <input
                  checked={impuesto.active}
                  type="checkbox"
                  onChange={(evento) => this.controlarCambioImpuestoActivo(evento, impuesto)}/>
              </td>
            </tr>)}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

ImpuestosForm.propTypes = {
  modificarImpuestos: PropTypes.func,
  impuestosInfo: PropTypes.array,
  editable: PropTypes.bool
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ImpuestosForm);

export { VistaRedux as RImpuestosForm };