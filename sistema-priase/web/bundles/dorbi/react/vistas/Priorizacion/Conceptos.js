import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import axios from 'axios';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import RUTAS_API from '../../global/rutas_api';
import { PROGRAMAS, URL_PRIORI } from '../../global/constantes';
import { RPrioriNavBar } from './utiles/PrioriNavbar/PrioriNavBar';
import { RPrioriTabla } from './utiles/PrioriTabla/PrioriTabla';

class PriorizacionConceptos extends Component {
  state = {
    /* Array de objetos:
      {
        uni_concepto: int,
        con_nombre: string,
        con_operacion: string,
        con_pagpriori: int
      } 
    */
    conceptos: []
  }

  /**
   * Variable para identificar las cabeceras de las tablas.
   */
  cabeceras = [
    {
      titulo: "Conceptos",
      llave: "con_nombre"
    }, {
      titulo: "Operación",
      llave: "con_operacion"
    }
  ]

  /**
   * Método encargado de cargar la lista en la tabla cuando se monte el componente
   */
  componentDidMount() {
    this.obtenerConceptos();
  }

  /**
   * Método encargado de consultar las variables de priorización de conceptos
   */
  obtenerConceptos = () => {
    axios.get(URL_PRIORI+RUTAS_API.PRIORIZACION.CONCEPTOS+'/'+PROGRAMAS.CONCEPTOS)
      .then(respuesta => this.setState({ conceptos: respuesta.data.datos }))
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de actualizar el valor de la prioridad del concepto en base de datos.
   */
  actualizarPrioridad = (concepto) => {
    const data = {
      con_pagpriori: concepto.con_pagpriori
    }

    axios.put(URL_PRIORI+RUTAS_API.PRIORIZACION.CONCEPTOS+'/'+concepto.uni_concepto, data)
      .then(respuesta => console.log(respuesta))
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de renderizar la tabla de prioridad de conceptos.
   */
  render() {
    const { conceptos } = this.state;

    return (
      <Fragment>
        <RPrioriNavBar history={this.props.history}/>
        <br/>
        {conceptos.length > 0 ? <RPrioriTabla
          datos={conceptos}
          cabeceras={this.cabeceras}
          priori="con_pagpriori"
          id="uni_concepto"
          actualizarPrioridad={this.actualizarPrioridad}/> :
          
          <span>No hay datos para mostrar</span>}
      </Fragment>
    );
  }
}

PriorizacionConceptos.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(PriorizacionConceptos);

export { VistaRedux as RPriorizacionConceptos };