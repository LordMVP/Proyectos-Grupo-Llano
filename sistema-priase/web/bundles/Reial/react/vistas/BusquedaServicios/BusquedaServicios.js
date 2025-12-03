import React, { Component } from 'react'

import Busqueda from './subcomponentes/Busqueda'
import Servicio from './subcomponentes/Servicio'

// redux

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

// vista

/**
 *
 *
 * @class BusquedaServicios
 * @extends {Component}
 */
class BusquedaServicios extends Component {
  /**
  *Define estados iniciales
  * @memberof SolicitudAgendamiento
  */
  state = {
    servicio: null,
    lista: []
  }

	/**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */  
  change = (servicio) => this.setState({ servicio });

  /**
   *
   *Modifica lista
   * @method
   * @param {Array} lista - Carga lista 
   */
  cambioLista = (lista) => this.setState({ lista: lista });

  /**
  *Renderiza la vista 
  * @return {JSX} componente - returna vista jsx 
  */ 
  render() {
    /* prettier-ignore */
    return (
      <div className='Container'>
        <Busqueda onChange={this.change} onChangeLista={this.cambioLista} />
        {this.state.lista.length > 0 &&
          <Servicio value={this.state.servicio} onChange={this.change} lista={this.state.lista} />
        }
      </div>
    )
  }
}

// redux

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(BusquedaServicios)

export { VistaRedux as RBusquedaServicios }
