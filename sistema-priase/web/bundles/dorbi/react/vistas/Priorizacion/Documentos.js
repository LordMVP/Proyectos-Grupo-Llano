import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import axios from 'axios';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import RUTAS_API from '../../global/rutas_api';
import { PROGRAMAS, URL_PRIORI } from '../../global/constantes';
import { RPrioriNavBar } from './utiles/PrioriNavbar/PrioriNavBar';
import { RPrioriTabla } from './utiles/PrioriTabla/PrioriTabla';

class PriorizacionDocumentos extends Component {
  state = {
    /* Array de objetos:
      {
        uni_documento: int,
        doc_nombre: string,
        doc_pagpriori: int
      }
    */
    documentos: []
  }

  /**
   * Variable para identificar las cabeceras de las tablas.
   */
  cabeceras = [
    {
      titulo: "Documentos",
      llave: "doc_nombre"
    }
  ]
  
  /**
   * Método encargado de cargar la lista en la tabla cuando se monte el componente
   */
  componentDidMount() {
    this.obtenerDocumentos();
  }

  /**
   * Método encargado de consultar las variables de priorización de documentos
   */
  obtenerDocumentos = () => {
    axios.get(URL_PRIORI+RUTAS_API.PRIORIZACION.DOCUMENTOS+'/'+PROGRAMAS.DOCUMENTOS)
      .then(respuesta => this.setState({ documentos: respuesta.data.datos }))
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de actualizar el valor de la prioridad del documento en base de datos.
   */
  actualizarPrioridad = (documento) => {
    const data = {
      doc_pagpriori: documento.doc_pagpriori
    }

    axios.put(URL_PRIORI+RUTAS_API.PRIORIZACION.DOCUMENTOS+'/'+documento.uni_documento, data)
      .then(respuesta => console.log(respuesta))
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de renderizar la tabla de prioridad de documentos.
   */
  render() {
    const { documentos } = this.state;
    
    return (
      <Fragment>
        <RPrioriNavBar history={this.props.history}/>
        <br/>
        {documentos.length > 0 ? <RPrioriTabla
          datos={documentos}
          cabeceras={this.cabeceras}
          priori="doc_pagpriori"
          id="uni_documento"
          actualizarPrioridad={this.actualizarPrioridad}/> :
          
          <span>No hay datos para mostrar</span>}
      </Fragment>
    );
  }
}

PriorizacionDocumentos.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(PriorizacionDocumentos);

export { VistaRedux as RPriorizacionDocumentos };