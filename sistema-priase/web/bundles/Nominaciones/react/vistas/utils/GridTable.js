import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';

import './GridTable.scss';

class GridTable extends Component {

  state = {
    mostrarModalConsulta: false,

    // Datos de la entidad
    // ...

    // Estado de la aplicacion
    // ...

  };

  componentDidMount() {

  }

  limpiarFormulario = (evento) => {
    this.setState({
    });
  };

  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  objeto = () => {
    const obj = {
      cabeceras: [
        'Punto Consumo',
        'Automático',
        'Pronóstico',
        'Cuenta Balance',
        'Cantidad Máxima',
        'Distribución Nominación',
      ],
      registros: [
        {}
      ],
    };
    return obj;
  };

  render() {
    const configuracion = this.objeto();
    return (
      <Fragment>
        <div className='grid-table'>
          <div className='grid-tr'>
            {//Pintamos la cabecera principal de la tabla...
              configuracion.cabeceras.map(th => {
                return (<div className='grid-th'>{th}</div>);
              })
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

GridTable.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GridTable);

export { VistaRedux as RGridTable };
