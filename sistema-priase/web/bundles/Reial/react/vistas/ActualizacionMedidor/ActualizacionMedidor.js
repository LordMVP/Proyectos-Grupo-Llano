import React, { Component } from 'react'
import { Input, VentanaDialogo } from 'appfuture-react'

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
 * @class ActualizacionMedidor
 * @extends {Component}
 */
class ActualizacionMedidor extends Component {
	/**
     *Define estados iniciales
     * @memberof ActualizacionMedidor
     */
	state = {
		dialogoModal: false,

		// defecto

		empresa: '',
		suscriptor: '0113800501601',

		medidor: '',
		capacidad: '',
		marca: '',
		lectura: '',
	}

	/**
     *
     *Habilita el botón guardar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */
	BotonGuardar = () => {
		if (this.state.empresa) {
			const { dialogoModal, ...estado } = this.state

			/* prettier-ignore */

			return Util.validarObjeto(estado)
                ? <button className="btn" onClick={this.handleDialogo}>guardar</button>
                : <button className="btn" disabled={true}>guardar</button>
        }

        /* prettier-ignore */

        else return <button className="btn" disabled={true}>guardar</button>
    }
	
	/**
     *
     *Habilita el botón cancelar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */	
    BotonCancelar = () => {
        /* prettier-ignore */

        return this.state.empresa
            ? <button className="btn" onClick={this.limpiar}>cancelar</button>
            : <button className="btn" disabled={true}>cancelar</button>
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
 *
 * Buscar por suscriptor
 * @method
 * @async

 */
buscar = async () => {
		let datos = await Peticion.post({
			url: API.ACTUALIZACION_MEDIDOR.CONSULTA_POR_SUSCRIPTOR,
			parametros: {
				idSuscriptor: this.state.suscriptor,
			},
		})

		if (!datos.medidorCodmar) {
            // no hay datos

			let opciones = {
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			}

			toast.error('Medidor no encontrado', opciones)
			return
		}

		this.setState({
			empresa: datos.medidorCodemp,

			medidor: datos.medidorNummed,
			capacidad: datos.medidorCap,
			marca: datos.medidorCodmar,
			lectura: datos.medidorVallec,
		})
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
	limpiar = () => {
		// limpieza

		this.setState({
			empresa: '',

			medidor: '',
			capacidad: '',
			marca: '',
			lectura: '',
		})
	}

	/**
	 *
	 *Permite guardar los medidores y después limpiar el formulario
	 * @method
	 * 
	 */	
	guardar = () => {
		Peticion.post({
			url: API.ACTUALIZACION_MEDIDOR.ACTUALIZAR_MEDIDOR,
			parametros: {
				medidorNummed: this.state.medidor,
				medidorCap: this.state.capacidad,
				medidorCodmar: this.state.marca,
				medidorVallec: this.state.lectura,
				medidorCodsus: this.state.suscriptor,
				medidorCodemp: this.state.empresa,
			},
		})

		// final

		this.limpiar()
		this.handleDialogo()
	}

	/**
	 *
	 *Limpiar el formulario y ocultar el modal
	 * @method
	 * 
	 */		
	cancelar = () => {
		this.limpiar()
		this.handleDialogo() // Cerrar modal
	}

	botones = [
		{ texto: 'guardar', callback: this.guardar },
		{ texto: 'cancelar', callback: this.cancelar },
	]

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */	
	render() {
		return (
			<React.Fragment>
				<VentanaDialogo
					titulo="Confirmación"
					texto="¿Confirma transacción?"
					mostrar={this.state.dialogoModal}
					botones={this.botones}
				/>

				<h1>Actualización medidor</h1>

				<div className="contenedor d-flex justify-content-center btn-group">
					<this.BotonGuardar />
					<this.BotonCancelar />
				</div>

				<div className="contenedor fila">
					<Input
						id="suscriptor"
						label="suscriptor"
						value={this.state.suscriptor}
						onChange={this.change}
						extra={{ disabled: this.state.empresa }}
					/>

					<div>
						<button className="btn" onClick={this.buscar}>
							<span>buscar</span>
						</button>
					</div>
				</div>

				<div className="contenedor caja formulario">
					<label className="tag">Datos por suscriptor</label>

					<Input
						id="medidor"
						label="medidor"
						value={this.state.medidor}
						onChange={this.change}
						extra={{ disabled: !this.state.empresa }}
					/>

					<Input
						id="capacidad"
						label="capacidad"
						value={this.state.capacidad}
						onChange={this.change}
						extra={{ disabled: !this.state.empresa }}
					/>

					<Input
						id="marca"
						label="marca"
						value={this.state.marca}
						onChange={this.change}
						extra={{ disabled: !this.state.empresa }}
					/>

					<Input
						id="lectura"
						label="lectura"
						value={this.state.lectura}
						onChange={this.change}
						extra={{ disabled: !this.state.empresa }}
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
)(ActualizacionMedidor)

export { VistaRedux as RActualizacionMedidor }
