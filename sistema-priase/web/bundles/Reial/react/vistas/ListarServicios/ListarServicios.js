import React, { Component } from 'react'

import Gestion from './subcomponentes/Gestion'
import Lista from './subcomponentes/Lista'

// redux

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

class ListarServicios extends Component {
	state = {}

	// interno

	change = (servicio) => this.setState({ servicio })

	// vista

	render() {
		const { servicio } = this.state

		/* prettier-ignore */

		return servicio
            ? <Gestion value={servicio} onChange={this.change}/>
            : <Lista onChange={this.change}/>
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
)(ListarServicios)

export { VistaRedux as RListarServicios }
