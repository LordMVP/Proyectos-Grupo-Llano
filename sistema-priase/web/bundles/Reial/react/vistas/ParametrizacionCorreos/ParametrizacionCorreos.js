import React, { Component } from 'react'
import { Botonera, Combo, Tabla } from 'appfuture-react'

import Peticion from '../global/peticion'

// redux

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

class ParametrizacionCorreos extends Component {
	state = {
		lista: [],

		// defecto

		reporte: '-1',
	}

	columnas = [
		{
			Header: 'Parametrizacion correos',

			columns: [
				{ Header: 'Correo', accessor: 'CAMBIAR_ESTO' },

				{
					Header: 'Acción',
					accessor: 'id',
					Cell: (props) => (
						<button className="btn" onClick={this.remover(props.index)}>
							Eliminar
						</button>
					),
				},
			],
		},
	]

	// interno

	componentDidMount() {}

	change = ({ target: { id, value } }) => this.setState({ [id]: value })

	// vista

	agregar = () => {}

	guardar = () => {
		if (window.confirm('¿Confirma transacción?')) {
		}
	}

	remover = (index) => {
		const lista = this.state.lista.filter((a, b) => index !== b)

		this.setState({ lista })
	}

	funciones = [{ texto: 'guardar', callback: this.guardar }]

	render() {
		return (
			<React.Fragment>
				<h1>Parametrizacion Correos</h1>

				<div className="contenedor">
					<Botonera funciones={this.funciones} />
				</div>

				<div className="contenedor fila">
					<Combo
						id="reporte"
						label="reporte"
						opciones={this.state.reporteJson}
						value={this.state.reporte}
						onChange={this.change}
					/>

					<div className="botones">
						<button className="btn" onClick={this.agregar}>
							agregar correo
						</button>
					</div>
				</div>

				<div className="contenedor">
					<Tabla datos={this.state.lista} columnas={this.columnas} />
				</div>
			</React.Fragment>
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
)(ParametrizacionCorreos)

export { VistaRedux as RParametrizacionCorreos }
