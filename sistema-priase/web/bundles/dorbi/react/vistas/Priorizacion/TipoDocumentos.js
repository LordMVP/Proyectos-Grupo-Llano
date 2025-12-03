import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import axios from 'axios';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import RUTAS_API from '../../global/rutas_api';
import { PROGRAMAS, URL_PRIORI } from '../../global/constantes';
import { RPrioriNavBar } from './utiles/PrioriNavbar/PrioriNavBar';
import { RPrioriTabla } from './utiles/PrioriTabla/PrioriTabla';

class PriorizacionTipoDocumentos extends Component {
  state = {
    /* Array de objetos:
      {
        uni_tipdocument: int,
        tido_nombre: string,
        tido_pagpriori: int
      }
    */
    tidocumentos: []
  }

  /**
   * Variable para identificar las cabeceras de las tablas.
   */
  cabeceras = [
    {
      titulo: "Tipo de documentos",
      llave: "tido_nombre"
    }
  ]

  /**
   * Método encargado de cargar la lista en la tabla cuando se monte el componente
   */
  componentDidMount() {
    this.obtenerTipoDocumentos();
  }

  /**
   * Método encargado de consultar las variables de priorización de tipo de documentos
   */
  obtenerTipoDocumentos = () => {
    axios.get(URL_PRIORI+RUTAS_API.PRIORIZACION.TIPO_DOCUMENTOS+'/'+PROGRAMAS.TIPO_DOCUMENTOS)
      .then(respuesta => this.setState({ tidocumentos: respuesta.data.datos }))
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de actualizar el valor de la prioridad del tipo de documento en base de datos.
   */
  actualizarPrioridad = (tidocumento) => {
    const data = {
      tido_pagpriori: tidocumento.tido_pagpriori
    }

    axios.put(URL_PRIORI+RUTAS_API.PRIORIZACION.TIPO_DOCUMENTOS+'/'+tidocumento.uni_tipdocument, data)
      .then(respuesta => console.log(respuesta))
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de renderizar la tabla de prioridad de tipo de documentos.
   */
  render() {
    const { tidocumentos } = this.state;

    return (
      <Fragment>
        <RPrioriNavBar history={this.props.history}/>
        <br/>
        {tidocumentos.length > 0 ? <RPrioriTabla
          datos={tidocumentos}
          cabeceras={this.cabeceras}
          priori="tido_pagpriori"
          id="uni_tipdocument"
          actualizarPrioridad={this.actualizarPrioridad}/> :
          
          <span>No hay datos para mostrar</span>}
      </Fragment>
    );
  }
}

PriorizacionTipoDocumentos.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(PriorizacionTipoDocumentos);

export { VistaRedux as RPriorizacionTipoDocumentos };