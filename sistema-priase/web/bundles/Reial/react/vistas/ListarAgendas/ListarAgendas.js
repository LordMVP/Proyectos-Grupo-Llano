import React, { Component } from 'react'

import Gestion from './subcomponentes/Gestion'
import Lista from './subcomponentes/Lista'

// redux

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

/**
 *
 *
 * @class ListarAgendas
 * @extends {Component}
 */
class ListarAgendas extends Component {
	/**
     *Define estados iniciales
     * @memberof ListarAgendas
     */
	state = { agenda: null }

	/**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @async
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */
	change = (agenda) => this.setState({ agenda })

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
	render() {
		const { agenda } = this.state

		/* prettier-ignore */

		return agenda
            ? <Gestion value={agenda} onChange={this.change}/>
            : <Lista onChange={this.change}/>
	}
}

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListarAgendas)

export { VistaRedux as RListarAgendas }
