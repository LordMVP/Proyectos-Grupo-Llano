import React, { Component } from 'react'
import { Combo, Input, Interruptor, VentanaDialogo } from 'appfuture-react'

import API from '../../global/rutas_api'
import Util from '../../global/util'
import Peticion from '../../global/peticion'

// redux

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

class ParametrizacionMateriales extends Component {
	state = {
		dialogoModal: false,

		// defecto

		codigoMaterial: '',
		nombreMaterial: '',
		valor: '',

		activo: false,
		medidor: false,
		editable: false,

		empresa: '-1',
		dependencia: '-1',
	}

	// componentes

	BotonGuardar = () => {
		const { dialogoModal, ...estado } = this.state

		/* prettier-ignore */

		return Util.validarObjeto(estado)
			? <button className="btn" onClick={this.handleDialogo}>guardar</button>
            : <button className="btn" disabled={true}>guardar</button>
	}

	// interno

	componentDidMount() {
		// empresaJson

		Peticion.post({
            url: API.PARAMETRIZACION_MATERIALES.LISTAR_EMPRESAS,
            config: {
                valor: 'empresaCod',
                texto: 'empresaNom',
            },
            callback: empresaJson => this.setState({ empresaJson }),
		})
	}

	componentDidUpdate (props, state) {
		if (state.empresa !== this.state.empresa) {
			if (Util.validarValor(this.state.empresa)) {
				this.obtenerDependencias(this.state.empresa)
			}

			else this.setState({
				dependencia: '-1',
				dependenciaJson: undefined,
			})
		}
	}

	change = ({ target: { id, value } }) => this.setState({ [id]: value })

	// vista

	cancelar = () => {
		this.handleDialogo(false)
		this.limpiarCampos()
	}

	guardar = () => {
		const { codigoMaterial, empresa } = this.state

		Peticion.post({
			url: API.PARAMETRIZACION_MATERIALES.MATERIALES,
			parametros: {
				materialCod: codigoMaterial,
				materialNom: this.state.nombreMaterial,
				codemp: {
					empresaCod: Util.obtenerId(empresa)
				},
				materialCoddepemp: Util.obtenerId(this.state.dependencia),
				materialVlruni: this.state.valor,
				materialSwtact: this.state.activo,
				materialSwtmed: this.state.medidor,
				materialSwtedi: this.state.editable,
				materialLlacom: codigoMaterial + Util.obtenerId(empresa)
			}
		})

		// final

		this.cancelar()
	}

	limpiarCampos = () => {
		this.setState({
			codigoMaterial: '',
			nombreMaterial: '',
			valor: '',

			activo: false,
			medidor: false,

			empresa: '-1',
			dependencia: '-1',
		})
	}

	obtenerDependencias = (empresa) => {
		return Peticion.post({
			url: API.PARAMETRIZACION_MATERIALES.LISTAR_DEPENDENCIAS,
			parametros: {
				depempresaCodemp: Util.obtenerId(empresa)
			},
			config: {
				valor: 'depempresaCod',
				texto: 'depempresaNom',
			},
			callback: dependenciaJson => this.setState({ dependenciaJson })
		})
	}

	handleDialogo = (valor) => {
		valor = valor == undefined ? valor : !this.state.dialogoModal
		return this.setState({ dialogoModal: valor })
	}

	botones = [
		{ texto: 'guardar', callback: this.guardar },
		{ texto: 'cancelar', callback: this.cancelar },
	]

	render() {
		const { BotonGuardar } = this

		return (
			<React.Fragment>
				<VentanaDialogo
					titulo="Confirmación"
					texto="¿Confirma transacción?"
					mostrar={this.state.dialogoModal}
					botones={this.botones}
				/>

				<h1>Parametrización de materiales</h1>

				<div className="contenedor d-flex justify-content-center btn-group">
					<BotonGuardar />
					<button className="btn" onClick={this.cancelar}>
						<span>cancelar</span>
					</button>
				</div>

				<div className="contenedor formulario">
					<Input
						id="codigoMaterial"
						label="codigo material"
						value={this.state.codigoMaterial}
						onChange={this.change}
					/>

					<Input
						id="nombreMaterial"
						label="nombre material"
						value={this.state.nombreMaterial}
						onChange={this.change}
					/>

					<Combo
						id="empresa"
						label="empresa"
						opciones={this.state.empresaJson}
						value={this.state.empresa}
						onChange={this.change}
						required={true}
					/>

					<Combo
						id="dependencia"
						label="dependencia"
						opciones={this.state.dependenciaJson}
						value={this.state.dependencia}
						onChange={this.change}
						required={true}
						extra={{ disabled: !this.state.dependenciaJson, }}
					/>

					<Input
						id="valor"
						label="valor"
						value={this.state.valor}
						onChange={this.change}
					/>

					<div className="fila">
						<Interruptor
							id="activo"
							label="activo"
							value={this.state.activo}
							onChange={this.change}
						/>

						<Interruptor
							id="medidor"
							label="medidor"
							value={this.state.medidor}
							onChange={this.change}
						/>

						<Interruptor
							id="editable"
							label="editable"
							value={this.state.editable}
							onChange={this.change}
						/>
					</div>
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
)(ParametrizacionMateriales)

export { VistaRedux as RParametrizacionMateriales }
