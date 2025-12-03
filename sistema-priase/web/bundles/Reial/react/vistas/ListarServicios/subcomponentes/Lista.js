import React, { Component } from 'react'
import { Botonera, Input, Tabla } from 'appfuture-react'

import API from '../../../global/rutas_api'
import Peticion from '../../../global/peticion'

import { toast } from 'react-toastify'

class Lista extends Component {
	state = {
		lista: [],

		// defecto

		servicio: '',
	}

	columnas = [
		{
			Header: 'Servicios',

			columns: [
				{ Header: 'Servicio', accessor: 'servicioCod' },
				{ Header: 'Nombre', accessor: 'servicioNom' },

				{
					Header: 'Acción',
					accessor: 'id',
					Cell: (props) => (
						<div className="d-flex justify-content-center btn-group">
							<button className="btn" onClick={() => this.editar(props)}>
								<span>editar</span>
							</button>
							<button className="btn" onClick={() => this.eliminar(props)}>
								<span>eliminar</span>
							</button>
						</div>
					),
				},
			],
		},
	]

	// interno

	change = ({ target: { id, value } }) => this.setState({ [id]: value })

	// vista

	buscar = async () => {
		let parametros = {
			servicioNom: this.state.servicio
		}

		let lista = await Peticion.post({
			url: API.LISTAR_SERVICIOS.CONSULTA_POR_CODIGO,
			parametros,
		})

		if (!lista.length) {
			// no hay datos

			let opciones = {
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			}

			toast.error('Nada que coincida con ese código', opciones)
			return
		}

		this.setState({ lista })
	}

	crear = () => this.props.onChange({})

	editar = ({ original }) => {
		this.props.onChange(original)
	}

	eliminar ({ original: { servicioLlacom } }) {
		Peticion.post({
			url: API.LISTAR_SERVICIOS.ELIMINAR_SERVICIO,
			parametros: { servicioLlacom }
		})

		// final

		this.buscar()
	}

	funciones = [
		{ texto: 'buscar', callback: this.buscar },
		{ texto: 'crear', callback: this.crear },
	]

	render() {
		const { BotonBuscar } = this

		return (
			<React.Fragment>
				<h1>Listar servicios</h1>

				<Botonera funciones={this.funciones} />

				<div className="contenedor fila">
					<Input
						id="servicio"
						label="código o nombre"
						value={this.state.servicio}
						onChange={this.change}
					/>
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

export default Lista
