import React, { Component } from 'react'
import { Combo, Input, Tabla } from 'appfuture-react'

import Peticion from '../../../global/peticion'
import API from '../../../global/rutas_api'

/**
 *
 *
 * @class Busqueda
 * @extends {Component}
 */
class Busqueda extends Component {

	/**
     *Define estados iniciales
     * @memberof Busqueda
     */
	state = {
		lista: [],

		// defecto

		id: '',
		año: new Date().getFullYear(),
		estado: '-1',

		estadoJson: [
			{ texto: 'Activo', valor: 1 },
			{ texto: 'Inactivo', valor: 0 },
		],
	}

	columnas = [
		{
			Header: 'Consulta de periodos',

			columns: [
				{ Header: 'Periodo', accessor: 'periodo' },

				{
					Header: 'Fecha Inicial',
					accessor: 'fechaInicial',
					Cell: (props) => {
						return new Date(props.value).toISOString().split('T')[0]
					}
				},

				{
					Header: 'Fecha Final',
					accessor: 'fechaFinal',
					Cell: (props) => {
						return props.value.split('T')[0]
					}
				},

				{ Header: 'Liquidación', accessor: 'liquidacion' },
				{ Header: 'Estado', accessor: 'estado' },
				{
					Header: 'Acción',
					accessor: 'id',
					Cell: (props) => (
						<button className="btn" onClick={(e) => this.editar(props.original)}>
							Editar
						</button>
					),
				},
			],
		},
	]

	/**
     *
     *Habilita el botón buscar
     *@method
     *@return {JSX} Componente - Button
     */

	BotonBuscar = () => {
		const { año, estado } = this.state

		/* prettier-ignore */

		return estado !== '-1' && año
			? <button className="btn" onClick={this.buscar}>Buscar</button>
			: <button className="btn" disabled={true}>Buscar</button>
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
	 *Búsqueda por año y estado y agregarlo a la tabla
	 * @async
	 * @method
	  */
	buscar = async () => {
		let lista = await Peticion.post({
			url: API.CONSULTA_PERIODOS.CONSULTAR_PERIODO,
			parametros: {
				anio: this.state.año,
				estado: this.state.estado,
			},
		})

		if (lista.length == undefined) return // no hay datos

		lista = lista.map(function (datos) {
			return {
				id: datos.ppeIderegistro,
				periodo: datos.ppeDescripcion,
				fechaInicial: datos.ppeMinvalue,
				fechaFinal: datos.ppeMaxvalue,
				liquidacion: datos.ppeTipo,
				estado: datos.ppeEstado == 1 ? 'Activo' : 'Inactivo',
			}
		})

		this.setState({ lista })
	}

	/**
	 *
	 * Crea los estados del componente padre
	 * @method
	 */
	crear = () => this.props.onChange({})

	/**
	 *
	 * Edita los estados del componente padre
	 * @method
	 * @param {object} datos Pasa un object al padre para editarlo
	 */
	editar = (datos) => this.props.onChange(datos)

	/**
	* Renderiza la vista 
	* @return {JSX} componente - returna vista jsx 
	*/
	render() {
		return (
			<React.Fragment>
				<h1>Consulta de periodos</h1>

				<div className="contenedor d-flex justify-content-center btn-group">
					<button className="btn" onClick={this.crear}>
						Crear
					</button>
					<this.BotonBuscar />
				</div>

				<div className="contenedor formulario">
					<Input
						id="año"
						label="año"
						type="number"
						value={this.state.año}
						onChange={this.change}
						extra={{ min: 1999, max: 3000 }}
					/>

					<Combo
						id="estado"
						label="estado"
						opciones={this.state.estadoJson}
						value={this.state.estado}
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

export default Busqueda
