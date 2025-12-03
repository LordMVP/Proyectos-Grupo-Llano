import React, { Component } from 'react'
import { Combo, Input, Interruptor, VentanaDialogo } from 'appfuture-react'

import Util from '../../../global/util'
import Peticion from '../../../global/peticion'
import API from '../../../global/rutas_api'


/**
 *
 *
 * @class Gestion
 * @extends {Component}
 */
class Gestion extends Component {

	montado = false

	/**
     *Define estados iniciales
     * @memberof Gestion
     */
	state = {
		dialogoModal: false,

		// defecto

		identificador: '',

		codigo: '',
		orden: '',
		nombre: '',
		valor: '',
		porcentaje: '',
		permitirAdjunto: false,

		padre: '-1',
		tipo: '-1',
		empresa: '-1',
		dependencia: '-1',
		municipio: '-1',
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
			? <button className="btn" onClick={this.handleDialogo}>guardar</button>
			: <button className="btn" disabled={true}>guardar</button>
	}
	/**
     *
     *Habilita el botón eliminar
     *@method
     *@return {JSX} Componente - Button
     */
	BotonEliminar = () => {
		/* prettier-ignore */

		return this.props.value.servicioCod
			? <button className="btn" onClick={this.eliminar}>eliminar</button>
			: <button className="btn" disabled={true}>eliminar</button>
	}

	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     */
	componentDidMount() {
		// empresaJson

		Peticion.post({
			url: API.LISTAR_SERVICIOS.LISTAR_EMPRESAS,
			config: {
				valor: 'empresaCod',
				texto: 'empresaNom',
			},
			callback: empresaJson => this.setState({ empresaJson }),
		})

		// datos

		if (this.props.value.servicioCod) {
			// editar

			this.obtenerServicio()
		}

		else this.montado = true
	}

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} props - Cargar atributos del componente
     */
	componentDidUpdate(props, state) {
		if (this.montado) {
			// dependenciaJson y municipioJson

			if (this.state.empresa !== state.empresa) {
				// consultar dependencias

				if (Util.validarValor(this.state.empresa)) {
					this.cambioEmpresa(this.state.empresa)
				}

				else this.setState({
					dependencia: '-1',
					municipio: '-1',
					dependenciaJson: undefined,
					municipioJson: undefined,
				})
			}

			// padreJson

			if (this.state.tipo !== state.tipo) {
				if (Util.validarValor(this.state.tipo)) {
					this.obtenerPadre(this.state.tipo)
				}

				else this.setState({
					padre: '-1',
					padreJson: undefined,
				})
			}

			// tipoJson

			if (this.state.dependencia !== state.dependencia) {
				const { dependencia, empresa } = this.state

				if (Util.validarValor(dependencia) && Util.validarValor(empresa)) {
					this.obtenerTipo(dependencia, empresa)
				}

				else this.setState({
					tipo: '-1',
					padre: '-1',
					tipoJson: undefined,
					padreJson: undefined,
				})
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

	/**
	 *
	 *Detecta el cambio de empresa y lista las dependecias asociadas
	 * @method
	 * @async
	 * @param {string} empresa - Valor empresa
	 */
	cambioEmpresa = async (empresa) => {
		empresa = Util.obtenerId(empresa)

		// dependenciaJson

		await Peticion.post({
			url: API.LISTAR_AGENDAS.LISTAR_DEPENDENCIAS,
			parametros: {
				depempresaCodemp: empresa
			},
			config: {
				valor: 'depempresaCod',
				texto: 'depempresaNom',
			},
			callback: dependenciaJson => this.setState({ dependenciaJson })
		})

		// municipioJson

		await Peticion.post({
			url: API.LISTAR_SERVICIOS.LISTAR_MUNICIPIOS,
			parametros: {
				proyectoCodemp: empresa
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
	 * Lista los niveles con la empresa y la dependencia
	 * @method
	 * @async
	 * @param {string} empresa - Valor empresa
	 * @param {string} dependencia - Valor dependencia
	 */
	obtenerTipo = async (dependencia, empresa) => {
		return Peticion.post({
			url: API.LISTAR_SERVICIOS.LISTAR_NIVELES,
			parametros: {
				nivelCodemp: Util.obtenerId(empresa),
				nivelCoddepemp: Util.obtenerId(dependencia),
			},
			config: {
				valor: 'nivelCod',
				texto: 'nivelNom',
			},
			callback: tipoJson => this.setState({ tipoJson })
		})
	}

	/**
	 *
	 * Lista los niveles por servicio
	 * @method
	 * @async
	 * @param {string} tipo - Valor tipo
	 */
	obtenerPadre = async (tipo) => {
		return Peticion.post({
			url: API.LISTAR_SERVICIOS.CONSULTA_POR_NIVEL,
			parametros: {
				servicioNiv: Util.obtenerId(tipo)
			},
			config: {
				valor: 'servicioCod',
				texto: 'servicioNom',
			},
			callback: padreJson => this.setState({ padreJson })
		})
	}
	/**
	 *
	 * Lista los niveles por servicio
	 * @method
	 * @async
	 */
	obtenerServicio = async () => {
		const servicio = this.props.value

		this.setState({
			identificador: servicio.servicioLlacom,
			codigo: servicio.servicioCod,
			orden: servicio.servicioOrdser,
			nombre: servicio.servicioNom,
			valor: servicio.servicioValuni,
			porcentaje: servicio.servicioPorval,
			permitirAdjunto: servicio.servicioAdjuntoreial || false,

			padre: servicio.servicioItedep,
			tipo: servicio.servicioNiv,
			empresa: servicio.servicioCodemp,
			dependencia: servicio.servicioCoddepemp,
			municipio: servicio.servicioCodpro,
		})

		await this.cambioEmpresa(servicio.servicioCodemp)
		await this.obtenerPadre(servicio.servicioNiv)
		await this.obtenerTipo(servicio.servicioCoddepemp, servicio.servicioCodemp)

		this.montado = true
	}

	/**
	 *
	 * Cierra la acción de gestión
	 * @method
	 */
	cerrar = () => this.props.onChange(null)

	/**
	 *
	 * Elimina el servicio seleccionado
	 * @method
	 */
	eliminar = () => {
		Peticion.post({
			url: API.LISTAR_SERVICIOS.ELIMINAR_SERVICIO,
			parametros: {
				servicioCod: this.state.codigo
			}
		})

		// final

		this.cerrar()
	}

	/**
	 *
	 * Guarda el servicio seleccionado
	 * @method
	 */
	guardar = () => {
		const servicio = this.props.value
		const parametros = {
			servicioNom: this.state.nombre,
			servicioNiv: Util.obtenerId(this.state.tipo),
			servicioCoddepemp: Util.obtenerId(this.state.dependencia),
			servicioCodemp: this.state.empresa,
			servicioAdjuntoreial: this.state.permitirAdjunto,
			servicioValuni: this.state.valor,
			servicioPorval: this.state.porcentaje,
			servicioItedep: Util.obtenerId(this.state.padre),
			servicioCodpro: Util.obtenerId(this.state.municipio),
		}

		if (servicio.servicioLlacom) {
			// editar

			parametros.servicioCod = servicio.servicioLlacom
			parametros.servicioLlacom = this.state.identificador
		}

		Peticion.post({
			url: API.LISTAR_SERVICIOS.CREAR_EDITAR,
			parametros,
		})

		// final

		this.cerrar()
	}


	/**
	 *
	 * Despliega el modal
	 * @method
	 * 
	 */
	handleDialogo = () => {
		this.setState({ dialogoModal: !this.state.dialogoModal })
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
		const { BotonGuardar, BotonEliminar } = this

		return (
			<React.Fragment>
				<h1>Crear/Editar servicio</h1>

				<VentanaDialogo
					titulo="Confirmación"
					texto="¿Confirma transacción?"
					mostrar={this.state.dialogoModal}
					botones={this.botones}
				/>

				<div className="d-flex justify-content-center btn-group">
					<BotonGuardar />
					<BotonEliminar />
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
						label="codigo"
						value={this.state.codigo || 'Autogenerado'}
						extra={{ disabled: true }}
					/>

					<Combo
						id="empresa"
						label="empresa"
						value={this.state.empresa}
						opciones={this.state.empresaJson}
						onChange={this.change}
					/>

					<Combo
						id="dependencia"
						label="dependencia"
						value={this.state.dependencia}
						opciones={this.state.dependenciaJson}
						onChange={this.change}
						extra={{ disabled: !this.state.dependenciaJson }}
					/>

					<Combo
						id="municipio"
						label="municipio"
						value={this.state.municipio}
						opciones={this.state.municipioJson}
						onChange={this.change}
						extra={{ disabled: !this.state.municipioJson }}
					/>

					<Combo
						id="tipo"
						label="tipo"
						value={this.state.tipo}
						opciones={this.state.tipoJson}
						onChange={this.change}
						extra={{ disabled: !this.state.tipoJson }}
					/>

					<Combo
						id="padre"
						label="padre"
						value={this.state.padre}
						opciones={this.state.padreJson}
						onChange={this.change}
						extra={{ disabled: !this.state.padreJson }}
					/>

					<Input
						id="orden"
						label="orden"
						value={this.state.orden}
						onChange={this.change}
					/>

					<Input
						id="nombre"
						label="nombre"
						value={this.state.nombre}
						onChange={this.change}
					/>

					<Input
						id="valor"
						label="valor"
						value={this.state.valor}
						onChange={this.change}
					/>

					<Input
						id="porcentaje"
						label="porcentaje"
						value={this.state.porcentaje}
						onChange={this.change}
					/>
				</div>

				<div className="contenedor columna">
					<Interruptor
						id="permitirAdjunto"
						label="permitir adjuntar archivos"
						value={this.state.permitirAdjunto}
						onChange={this.change}
					/>
				</div>
			</React.Fragment>
		)
	}
}

export default Gestion
