import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import axios from 'axios';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import RUTAS_API from '../../global/rutas_api';
import { PROGRAMAS, URL_PRIORI } from '../../global/constantes';
import { RPrioriNavBar } from './utiles/PrioriNavbar/PrioriNavBar';
import { RPrioriTabla } from './utiles/PrioriTabla/PrioriTabla';

class PriorizacionConHomologados extends Component {
  state = {
    /* Array de objetos:
      {
        dicn_ideregistr: int,
        dicn_nombre: string,
        emp_ideregistro: int,
        dicn_pagprioridad: int
      } 
    */
    disconvens: []
  }

  /**
   * Variable para identificar las cabeceras de las tablas.
   */
  cabeceras = [
    {
      titulo: "Convenios",
      llave: "dicn_nombre"
    }, {
      titulo: "Empresa Id Seven",
      llave: "emp_ideregistro"
    }, 
    {
      titulo: "Empresa Descripcion",
      llave:"empresa_nom" 
    },
   {
      titulo: "Tipo Suscripcion",
      llave:"tipo_suscripcion" }  
  ]

  /**
   * Método encargado de cargar la lista en la tabla cuando se monte el componente
   */
  componentDidMount() {
    this.obtenerConvenios();
  }

  /**
   * Método encargado de consultar las variables de priorización de convenios homologados.
   */
  obtenerConvenios = () => {
    axios.get(URL_PRIORI+RUTAS_API.PRIORIZACION.CONVENIOS_HOMOLOGADOS+'/'+PROGRAMAS.CONVENIOS_HOMOLOGAODS)
      .then(respuesta => this.organizarLista(respuesta.data.datos))
      .catch((error) => console.log(error));
  }

  organizarLista = (datos) => {
    const nuevaData = datos;
    
    for (let i = 0; i < nuevaData.length; i++) {
      nuevaData[i].dicn_nombre = nuevaData[i].cnre_recaudo.cnre_nombre;
      nuevaData[i].empresa_nom = nuevaData[i].empresa.empresa_nom;
      nuevaData[i].tipo_suscripcion = nuevaData[i].unidad.suscripcion;

    }

    this.setState({ disconvens: nuevaData });
  }

  /**
   * Método encargado de actualizar el valor de la prioridad del convenio homologado en base de datos.
   */
  actualizarPrioridad = (disconven) => {
    const data = {
      dicn_pagprioridad: disconven.dicn_pagprioridad
    }

    axios.put(URL_PRIORI+RUTAS_API.PRIORIZACION.CONVENIOS_HOMOLOGADOS+'/'+disconven.dicn_ideregistr, data)
      .then(respuesta => console.log(respuesta))
      .catch((error) => console.log(error));
  }

  /**
   * Método encargado de renderizar la tabla de prioridad de convenios homologados.
   */
  render() {
    const { disconvens } = this.state;
    
    return (
      <Fragment>
        <RPrioriNavBar history={this.props.history}/>
        <br/>
        {disconvens.length > 0 ? <RPrioriTabla
          datos={disconvens}
          cabeceras={this.cabeceras}
          priori="dicn_pagprioridad"
          id="dicn_ideregistr"
          actualizarPrioridad={this.actualizarPrioridad}/> :
          
          <span>No hay datos para mostrar</span>}
      </Fragment>
    );
  }
}

PriorizacionConHomologados.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(PriorizacionConHomologados);

export { VistaRedux as RPriorizacionConHomologados };