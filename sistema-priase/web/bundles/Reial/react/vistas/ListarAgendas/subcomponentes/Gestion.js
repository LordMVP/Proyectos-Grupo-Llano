import React, { Component } from 'react'
import { Combo, Input, VentanaDialogo } from 'appfuture-react'

import API from '../../../global/rutas_api'
import Peticion from '../../../global/peticion'
import Util from '../../../global/util'


/**
 *
 *
 * @class Gestion
 * @extends {Component}
 */
class Gestion extends Component {
	/**
     *Define estados iniciales
     * @memberof Gestion
     */
	state = {
		dialogoModal: false,

		// defecto

		identificador: '',
		codigo: '',
		descripcion: '',
		alias: '',

		dependencia: '-1',
	}

	/**
     *
     *Habilita el botón guardar
     *@method
     *@return {JSX} Componente - Button
     */

	BotonGuardar = () => {
		const { dialogoModal, identificador, codigo, ...estado } = this.state

		/* prettier-ignore */

		return Util.validarObjeto(estado)
			? <button className="btn" onClick={this.handleDialogo}>Guardar</button>
			: <button className="btn" disabled={true}>Guardar</button>
	}

	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     */
	async componentDidMount() {
		// defecto

		if (this.props.value.empresa) {
			const {
				agendaLlacom,
				agendaAlias,
				agendaCod,
				agendaNom,
				agendaCodemp,
				agendaCoddepemp

			} = this.props.value

			await this.obtenerDependencias(agendaCodemp)

			await this.setState({
				identificador: agendaLlacom,
				codigo: agendaCod,
				descripcion: agendaNom,
				alias: agendaAlias,
				dependencia: Util.obtenerId(agendaCoddepemp)
			})
		} else {
			Peticion.post({
				url: API.LISTAR_AGENDAS.LISTAR_DEPENDENCIAS_SIN_PARAMETROS,
				parametros: {},
				config: {
					valor: 'depempresaCod',
					texto: 'depempresaNom',
				},
				callback: dependenciaJson => this.setState({ dependenciaJson })
			})
		}
	}

	/**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @async
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */
	change = ({ target: { id, value } }) => this.setState({ [id]: value })

	/**
	 *
	 * Cierra el componente gestión y actualiza estados del componente padre
	 * @method
	 */
	cerrar = () => this.props.onChange(null)

	/**
	 *
	 * Permite guardar la gestión
	 * @method
	 * 
	 */
	guardar = () => {
		const parametros = {
			agendaNom: this.state.descripcion,
			agendaAlias: this.state.alias,
			agendaCoddepemp: Util.obtenerId(this.state.dependencia),
		}

		if (this.props.value.agendaLlacom) {
			// editar

			parametros.agendaCod = this.state.codigo
			parametros.agendaLlacom = this.state.identificador
		}

		Peticion.post({
			url: API.LISTAR_AGENDAS.CREAR_EDITAR,
			parametros,
		})

		// final

		this.cerrar()
	}

	/**
	 *
	 * Despliega modal
	 * @method
	 */
	handleDialogo = () => {
		this.setState({ dialogoModal: !this.state.dialogoModal })
	}

	/**
	 *
	 * Obtener dependencias y listarlas en el componente combobox
	 * @method
	 */
	obtenerDependencias = (empresa) => {
		return Peticion.post({
			url: API.LISTAR_AGENDAS.LISTAR_DEPENDENCIAS,
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

	botones = [
		{ texto: 'guardar', callback: this.guardar },
		{ texto: 'cancelar', callback: this.handleDialogo },
	]

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
	render() {
		const { BotonGuardar } = this

		return (
			<React.Fragment>
				<h1>Crear/Editar agenda</h1>

				<VentanaDialogo
					titulo="Confirmación"
					texto="¿Confirma transacción?"
					mostrar={this.state.dialogoModal}
					botones={this.botones}
				/>

				<div className="contenedor d-flex justify-content-center btn-group">
					<BotonGuardar />
					<button className="btn" onClick={this.cerrar}>
						<span>cancelar</span>
					</button>
				</div>

				<div className="contenedor formulario">
					<Input
						id="identificador"
						label="identificador"
						value={this.state.identificador || 'Autogenerado'}
						extra={{ disabled: true }}
					/>

					<Input
						id="codigo"
						label="código"
						value={this.state.codigo || 'Autogenerado'}
						extra={{ disabled: true }}
					/>

					<Input
						id="descripcion"
						label="descripcion"
						value={this.state.descripcion}
						onChange={this.change}
					/>

					<Input
						id="alias"
						label="alias"
						type="number"
						value={this.state.alias}
						onChange={this.change}
						extra={{ maxLength: 3 }}
					/>

					<Combo
						id="dependencia"
						label="dependencia"
						opciones={this.state.dependenciaJson}
						value={this.state.dependencia}
						onChange={this.change}
						extra={{ disabled: !this.state.dependenciaJson }}
					/>
				</div>
			</React.Fragment>
		)
	}
}

export default Gestion
