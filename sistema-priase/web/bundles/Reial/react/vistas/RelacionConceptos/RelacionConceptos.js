import React, { Component } from 'react'
import { Combo, Input, Tabla, VentanaDialogo } from 'appfuture-react'

import Util from '../../global/util'
import Peticion from '../../global/peticion'

// redux

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

class RelacionConceptos extends Component {
	state = {
		dialogoModal: false,
		lista: [],

		// defecto

		concepto: '-1',
		material: '-1',
	}

	columnas = [
		{
			Header: 'Relación concepto',

			columns: [
				{ Header: 'Concepto', accessor: 'CAMBIAR_ESTO' },
				{ Header: 'Material', accessor: 'CAMBIAR_ESTO' },
				{ Header: 'Cantidad', accessor: 'CAMBIAR_ESTO' },
			],
		},
	]

	// componentes

	BotonAgregar = () => {
        /* prettier-ignore */

		return Util.validarObjeto(this.state)
			? <button className="btn" onClick={this.agregar}>agregar</button>
		    : <button className="btn" disabled={true}>agregar</button>
	}

	BotonGuardar = () => {
		const { dialogoModal, ...estado } = this.state

		/* prettier-ignore */

		return Util.validarObjeto(estado)
			? <button className="btn" onClick={this.handleDialogo}>guardar</button>
			: <button className="btn" disabled={true}>guardar</button>
	}

	// interno

	componentDidMount() {}

	change = ({ target: { id, value } }) => this.setState({ [id]: value })

	// vista

	agregar = () => {
		const { concepto, material } = this.state

		const lista = [...this.state.lista, { concepto, material }]

		this.setState({ lista })
	}

	limpiarCampos = () => {
		this.setState({
			concepto: '-1',
			material: '-1',
		})
	}

	guardar = () => {
		// TODO
	}

	remover = (index) => {
		const lista = this.state.lista.filter((a, b) => index !== b)
		this.setState({ lista })
	}

	handleDialogo = () => {
		this.setState({ dialogoModal: !this.state.dialogoModal })
	}
	
	botones = [
		{ texto: 'guardar', callback: this.guardar },
		{ texto: 'cancelar', callback: this.handleDialogo },
	]

	render() {
		const { BotonAgregar, BotonGuardar } = this

		return (
			<React.Fragment>
				<VentanaDialogo
					titulo="Confirmación"
					texto="¿Confirma transacción?"
					mostrar={this.state.dialogoModal}
					botones={this.botones}
				/>

				<h1>Relación material - concepto | EN DESARROLLO</h1>

				<div className="d-flex justify-content-center btn-group">
					<BotonGuardar />
					<button className="btn" onClick={this.limpiarCampos}>
						<span>cancelar</span>
					</button>
				</div>

				<div className="contenedor fila">
					<Combo
						id="concepto"
						label="concepto"
						opciones={this.state.conceptoJson}
						value={this.state.concepto}
						onChange={this.change}
					/>

					<Combo
						id="material"
						label="material"
						opciones={this.state.materialJson}
						value={this.state.material}
						onChange={this.change}
					/>

					<div>
						<BotonAgregar />
					</div>
				</div>

				<div className="contenedor">
					<Tabla
						datos={this.state.lista}
						columnas={this.columnas}
					/>
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
)(RelacionConceptos)

export { VistaRedux as RRelacionConceptos }
