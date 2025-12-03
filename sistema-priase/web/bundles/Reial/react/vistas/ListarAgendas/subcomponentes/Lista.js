import React, { Component } from 'react'
import { Botonera, Input, Tabla } from 'appfuture-react'

import Util from '../../../global/util'
import Peticion from '../../../global/peticion'
import API from '../../../global/rutas_api'

import { toast } from 'react-toastify'

/**
 *
 *
 * @class Lista
 * @extends {Component}
 */
class Lista extends Component {

	/**
     *Define estados iniciales
     * @memberof Lista
     */
	state = {
		lista: [],

		// defecto

		empresa: '8000212729',
		agenda: '',
	}

	columnas = [
		{
			Header: 'Agendas',

			columns: [
				{ Header: 'Agenda', accessor: 'agendaCod' },
				{ Header: 'Descripcion', accessor: 'agendaNom' },
				{ Header: 'Alias', accessor: 'agendaAlias' },

				{
					Header: 'Acción',
					accessor: 'id',
					Cell: (props) => {
						const editar = () => {
							const { empresa } = this.state
							const { original } = props

							this.props.onChange({ ...original, empresa })
						}

						const eliminar = async () => {
							const {
								original: { agendaLlacom },
							} = props

							await Peticion.post({
								url: API.LISTAR_AGENDAS.ELIMINAR_AGENDA,
								parametros: { agendaLlacom },
							})

							this.buscar()
						}

						// elemento

						return (
							<div className="d-flex justify-content-center btn-group">
								<button className="btn" onClick={editar}>
									editar
								</button>
								<button className="btn" onClick={eliminar}>
									eliminar
								</button>
							</div>
						)
					},
				},
			],
		},
	]

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
	 * Busca por agenda y lista la información en una tabla
	 * @async
	 * @method
	 */
	buscar = async () => {
		let parametros = {
			agendaNom: this.state.agenda,
		}

		// peticion

		let lista = await Peticion.post({
			url: API.LISTAR_AGENDAS.CONSULTA_POR_CODIGO,
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

	/**
	 *
	 * Crear la lista y actualiza los estados del componente padre
	 * @method
	 */
	crear = () => this.props.onChange({})

	/**
	 *Renderiza la vista 
	 * @return {JSX} componente - returna vista jsx 
	 */
	render() {
		const { BotonBuscar } = this

		return (
			<React.Fragment>
				<h1>Listar agendas</h1>

				<div className="d-flex justify-content-center btn-group">
					<button className="btn" onClick={this.buscar}>
						<span>buscar</span>
					</button>
					<button className="btn" onClick={this.crear}>
						<span>crear</span>
					</button>
				</div>

				<div className="contenedor fila">
					<Input
						id="agenda"
						label="código o nombre"
						value={this.state.agenda}
						onChange={this.change}
					/>
				</div>

				<div className="contenedor">
					<Tabla datos={this.state.lista} columnas={this.columnas} />
				</div>
			</React.Fragment>
		)
	}
}

export default Lista
