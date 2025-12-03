import React, { Component } from 'react'
import { Botonera, Combo, Input, VentanaDialogo } from 'appfuture-react'

import API from '../../global/rutas_api'
import Peticion from '../../global/peticion'
import Util from '../../global/util'

import { toast } from 'react-toastify'

// redux

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'

/**
 *
 *
 * @class ActividadesMunicipios
 * @extends {Component}
 */
class ActividadesMunicipios extends Component {
	/**
     *Define estados iniciales
     * @memberof ActividadesMunicipios
     */
	state = {
		dialogoModal: false,

		// defecto

		actividad: '-1',
		municipio: '-1',
		empresa: '8000212729',
		contratista: '',
		valor: '',
	}

	modificar = false


	/**
     *
     *Habilita el botón cancelar
     *@method
     *@return {JSX} Componente - Button
     */

	BotonCancelar = () => {
		const { dialogoModal, ...estado } = this.state

		/* prettier-ignore */

		return Util.validarObjeto(estado)
			? <button className="btn" onClick={this.limpiarCampos}>cancelar</button>
			: <button className="btn" disabled={true}>cancelar</button>
    }

	/**
     *
     *Habilita el botón guardar
     *@method
     *@return {JSX} Componente - Button
     */
	BotonGuardar = () => {
		const { dialogoModal, ...estado } = this.state

		/* prettier-ignore */

		return Util.validarObjeto(estado)
			? <button className="btn" onClick={this.handleDialogo}>guardar</button>
			: <button className="btn" disabled={true}>guardar</button>
    }

	// interno

	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     */
	componentDidMount() {
		// empresaJson

		Peticion.post({
            url: API.ACTIVIDADES_MUNICIPIOS.LISTAR_EMPRESAS,
            config: {
                valor: 'empresaCod',
                texto: 'empresaNom',
            },
            callback: empresaJson => this.setState({ empresaJson }),
		})

		// contratistaJson

		Peticion.post({
            url: API.ACTIVIDADES_MUNICIPIOS.LISTAR_CONTRATISTAS,
            config: {
                valor: 'empresaCod',
                texto: 'empresaNom',
            },
            callback: contratistaJson => this.setState({ contratistaJson }),
		})
	}

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} props - Cargar atributos del componente
     */	
	componentDidUpdate (props, state) {
		// municipioJson y actividadJson

		if (state.empresa !== this.state.empresa ||
			state.contratista !== this.state.contratista) {

			const { empresa, contratista } = this.state

			if (Util.validarValor(empresa)) {
				// municipioJson

				this.obtenerMunicipios(empresa)

				// actividadJson

				if (Util.validarValor(contratista)) {
					this.obtenerActividades(empresa, contratista)
				}

				else this.setState({
					actividad: '-1',
					actividadJson: undefined
				})
			}

			else this.setState({
				actividad: '-1',
				municipio: '-1',
				actividadJson: undefined,
				municipioJson: undefined,
			})
		}

		// valor

		const { actividad, municipio } = this.state

		if (state.actividad !== actividad ||
			state.municipio !== municipio) {


			if (Util.validarValor(actividad) &&
				Util.validarValor(municipio)) {

				this.buscarValor(actividad, municipio)
			}
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

	// vista

	/**
	 *
	 *Buscar valor de manera dinámica al digitar en el componente input Valor
	 * @async
	 * @method
	 * @param {string} actividad - valor del componente combobox actividad
	 * @param {string} municipio - valor del componente autocompletado actividad
	 */
	buscarValor = async (actividad, municipio) => {
		actividad = Util.obtenerId(actividad)
		municipio = Util.obtenerId(municipio)

		// peticion

		const valor = await Peticion.post({
			url: API.ACTIVIDADES_MUNICIPIOS.CONSULTAR_VALOR,
			parametros: {
				proIdeproyec: municipio,
				actIdeactivi: actividad,
				empCodempresa: Util.obtenerId(this.state.empresa),
				conIdecontra: Util.obtenerId(this.state.contratista),
			}
		})

		const opciones = {
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		}

		let mensaje = 'Valor obtenido correctamente'

		if (!valor || valor == '') {
			mensaje = 'La relación no tiene valor asociado'

			this.modificar = false

			toast.warn(mensaje, opciones)
			return
		}

		this.modificar = true
		toast.success(mensaje, opciones)

		this.setState({ valor: valor.actProactval })
	}

	/**
	 *
	 *Carga la lista de municipios al escoger un contratista del combobox
	 * @method
	 * @param {string} empresa - Valor de la empresa escogido desde el combobox
	 */
	obtenerMunicipios = (empresa = this.state.empresa) => {
		empresa = Util.obtenerId(empresa)

		// municipioJson

		Peticion.post({
			url: API.ACTIVIDADES_MUNICIPIOS.LISTAR_MUNICIPIOS,
			parametros: {
				proyectoCodemp: Util.obtenerId(empresa)
			},
			config: {
				valor: 'proyectoCod',
				texto: 'proyectoNom',
			},
			callback: municipioJson => this.setState({ municipioJson })
		})
	}

	/**
	 *
	 *Carga la lista de actividades al escoger un contratista del combobox
	 * @method
	 * @param {String} empresa - Valor de la empresa escogido desde el combobox
	 * @param {String} contratista - Valor del contratista escogido desde el combobox  
	 */
	obtenerActividades = (empresa, contratista) => {
		// actividadJson

		Peticion.post({
			url: API.ACTIVIDADES_MUNICIPIOS.LISTAR_ACTIVIDADES,
			parametros: {
				empCodempresa: Util.obtenerId(empresa),
				conIdecontra: Util.obtenerId(contratista),
			},
			config: {
				valor: 'actIdeactivi',
				texto: 'actDescripci',
			},
			callback: actividadJson => this.setState({ actividadJson })
		})
	}

	/**
	 *
	 *Crear el valor
	 * @method
	 * 
	 */
	crear = () => {
		Peticion.post({
			url: API.ACTIVIDADES_MUNICIPIOS.CREAR_VALOR,
			parametros: {
				empCodempresa: Util.obtenerId(this.state.empresa),
				conIdecontra: Util.obtenerId(this.state.contratista),
				proIdeproyec: Util.obtenerId(this.state.municipio),
				actIdeactivi: Util.obtenerId(this.state.actividad),
				actProactval: parseInt(this.state.valor),
			}
		})
	}

	/**
	 *
	 *Permite la edición del valor
	 * @method
	 * 
	 */
	editar = () => {
		Peticion.post({
			url: API.ACTIVIDADES_MUNICIPIOS.EDITAR_VALOR,
			parametros: {
				empCodempresa: Util.obtenerId(this.state.empresa),
				conIdecontra: Util.obtenerId(this.state.contratista),
				proIdeproyec: Util.obtenerId(this.state.municipio),
				actIdeactivi: Util.obtenerId(this.state.actividad),
				actProactval: parseInt(this.state.valor),
			}
		})
	}

	/**
	 *
	 * Permite guardar las actividades asociadas a los municipios
	 * @method
	 * 
	 */
	guardar = () => {
		if (!this.modificar) this.crear()
		else this.editar()

		// final

		this.handleDialogo(false)
		this.limpiarCampos()
	}

	/**
	 *
	 *Despliega el modal
	 * @method
	 * 
	 */
	handleDialogo = () => {
		this.setState({ dialogoModal: !this.state.dialogoModal })
	}

	/**
	 *
	 *Limpiar el formulario
	 * @method
	 * 
	 */
	limpiarCampos = () => {
		this.modificar = true

		this.setState({
			actividad: '-1',
			municipio: '-1',
			empresa: '-1',
			contratista: '-1',
			valor: '',
		})
	}

	funciones = [
		{ texto: 'guardar', callback: this.handleDialogo },
		{ texto: 'cancelar', callback: this.cerrar },
	]

	botones = [
		{ texto: 'guardar', callback: this.guardar },
		{ texto: 'cancelar', callback: this.handleDialogo },
	]

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
	render() {
		const { BotonCancelar, BotonGuardar } = this

		return (
			<React.Fragment>
				<VentanaDialogo
					titulo="Confirmación"
					texto="¿Confirma transacción?"
					mostrar={this.state.dialogoModal}
					botones={this.botones}
				/>

				<h1>Actividades por municipio</h1>

				<div className="d-flex justify-content-center btn-group">
					<BotonGuardar/>
					<BotonCancelar/>
				</div>

				<div className="contenedor fila">
					<Combo
						id="empresa"
						label="empresa"
						value={this.state.empresa}
						opciones={this.state.empresaJson}
						onChange={this.change}
						required={true}
					/>

					<Combo
						id="contratista"
						label="contratista"
						value={this.state.contratista}
						opciones={this.state.contratistaJson}
						onChange={this.change}
						required={true}
					/>
				</div>

				<div className="contenedor caja formulario">
					<Combo
						id="actividad"
						label="actividad"
						opciones={this.state.actividadJson}
						value={this.state.actividad}
						onChange={this.change}
						extra={{ disabled: !this.state.actividadJson }}
					/>

					<Combo
						id="municipio"
						label="municipio"
						opciones={this.state.municipioJson}
						value={this.state.municipio}
						onChange={this.change}
						extra={{ disabled: !this.state.municipioJson }}
					/>

					<Input
						id="valor"
						label="valor"
						type="number"
						min="1"
						step="1"
						value={this.state.valor}
						onChange={this.change}
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
)(ActividadesMunicipios)

export { VistaRedux as RActividadesMunicipios }
