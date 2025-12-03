import React, { useState, useEffect } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes, { element } from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha } from 'appfuture-react';
import RUTAS_API from '../../../../../global/rutas_api';
import axios from 'axios';

import { TablaHistorico, CamposIngreso } from './components';

const Encabezado = ({ limpiarDetalle, habilitarDetalle, setMensaje }) => {
	const [listaAreaPrestacion, setListaAreaPrestacion] = useState([]);
	const [listaPeriodo, setListaPeriodo] = useState([]);
	const [listaAsociaciones, setListaAsociaciones] = useState([]);
	const [listaAnio, setListaAnio] = useState([]);
	const [areaPrestacionSeleccionada, setAreaPrestacionSeleccionada] = useState(-1);
	const [periodoSeleccionado, setPeriodoSeleccionado] = useState(-1);
	const [anioSeleccionado, setAnioSeleccionado] = useState(-1);
	const [asociacionSeleccionada, setAsociacionSeleccionada] = useState(-1);

	// ListasGenerales
	const [allListPeriodo, setAllListPeriodo] = useState([]);

	const [listaHistorico, setListaHistorico] = useState(null);
	const [valorToneladas, setValorToneladas] = useState("");
	const [observacion, setObservacion] = useState("");

	useEffect(() => {
		consultarAreaPrestacion();
	}, []);

	useEffect(() => {
		if (asociacionSeleccionada != -1) {
			habilitarDetalle(true);
			obtenerHistoricoToneladas();
		} else {
			habilitarDetalle(false);
			setListaHistorico(null);
		}
	}, [asociacionSeleccionada]);

	const consultarAreaPrestacion = () => {
		axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO, { criterio: "" })
			.then(respuesta => {
				setListaAreaPrestacion(respuesta.data.datos);
			});
	};

	/**
	 * Método encargado de consultar los periodos semestrales por área de prestación.
	 * @param {Number} i
	 * 
	 * dArea Identificador del área de prestación.
	 */
	const consultarAnioDePeriodo = (idArea) => {
		axios
			.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_MESES_PERIODO, {
				idArea: idArea,
			})
			.then((respuesta) => {
				console.log(respuesta.data.datos);
				const { listaAnio, listaPeriodo } = sortAnioPeriodo(respuesta.data.datos);
				listaPeriodo.sort((a, b) => (a.numeroMes > b.numeroMes) ? 1 : -1);
				setListaAnio(listaAnio);
				setAllListPeriodo(listaPeriodo);
			});
	};

	const sortAnioPeriodo = (periodos) => {
		let listaPeriodo = [], listaAnio = [];
		periodos.map((dato) => {
			listaPeriodo.push({
				idRegistroMes: dato.perIdeRegistro,
				titulo: `${dato.smperDescripcion}`,
				anio: dato.perFecInicial,
				idPeriodo: dato.perIdEPadre,
				numeroMes: dato.smperNumero,
			});

			listaAnio.push({
				titulo: `${dato.perFecInicial} - ${dato.nombrePeriodo}`,
				perIderegistro: dato.perIdEPadre,
			});
		});
		listaAnio = [...new Map(listaAnio.map(item => [item["perIderegistro"], item])).values()];
		console.log(listaPeriodo);
		return { listaPeriodo, listaAnio }
	};

	const cargarPeriodo = (value) => {
		const filterPeriodo = allListPeriodo.filter(x => x.idPeriodo === +value);
		setListaPeriodo(filterPeriodo);
	};

	const consultarAsociaciones = () => {
		axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS_APROVECHAMINETO.CONSULTAR_APROVECHADORES)
			.then(respuesta => {
				setListaAsociaciones(respuesta.data.datos);
			});
	};

	/**
	* Método encargado de generar los botones del formulario
	* @returns {Object}
	*/
	const obtenerFunciones = () => {
		return [
			{ texto: 'Guardar', callback: guardar },
			{ texto: 'Cancelar', callback: limpiarFormulario }
		];
	};

	const guardar = (e) => {
		e.preventDefault();
		if (valorToneladas.trim() != "" &&
			!isNaN(valorToneladas.trim()) &&
			observacion.trim() != "") {
			const peticion = {
				idPeriodo: periodoSeleccionado,
				idArea: areaPrestacionSeleccionada,
				idAsociacion: asociacionSeleccionada,
				valor: valorToneladas,
				numeroActualizacion: listaHistorico ? listaHistorico.length : 0,
				idPeriodoPadre: anioSeleccionado,
				observacion: observacion,
			};
			console.log("peticion::peticion", peticion);
			axios.post(RUTAS_API.RECALCULO_APROVECHAMIENTO.INSERTAR_TONELADAS
				, peticion)
				.then(respuesta => {
					if (respuesta.data.datos) {
						return obtenerHistoricoToneladas();
					} else {
						setMensaje({ tipo: "Error", mensaje: "Ha ocurrido un error interno" });
					}
				});
		} else {
			setMensaje({ tipo: "Error", mensaje: "faltan datos por ingresar al sistema" });
		};
	};

	const obtenerHistoricoToneladas = () => {
		setObservacion("");
		setValorToneladas("");
		setListaHistorico(null);
		const peticion = {
			idPeriodo: periodoSeleccionado,
			idArea: areaPrestacionSeleccionada,
			idAsociacion: asociacionSeleccionada,
		};
		axios.post(RUTAS_API.RECALCULO_APROVECHAMIENTO.OBTENER_HISTORICO_TONELADAS, peticion)
			.then(respuesta => {
				setListaHistorico(respuesta.data.datos);
			});
	};

	const limpiarFormulario = () => {
		setAreaPrestacionSeleccionada(-1);
		setPeriodoSeleccionado(-1);
		setAnioSeleccionado(-1);
		setAsociacionSeleccionada(-1);
		habilitarDetalle(false);
		limpiarDetalle();
		setValorToneladas("");
		setObservacion("");
	};

	const controlarCambio = (evento) => {
		let change = {};
		const { name, value } = evento.target;
		switch (name) {
			case "areaPrestacion":
				setPeriodoSeleccionado(-1);
				setAnioSeleccionado(-1);
				setAsociacionSeleccionada(-1);
				setAreaPrestacionSeleccionada(value);
				if (value != '-1') {
					consultarAnioDePeriodo(value);
				}
				break;
			case 'anio':
				setPeriodoSeleccionado(-1);
				setAsociacionSeleccionada(-1);
				setAnioSeleccionado(value);
				cargarPeriodo(value);
				break;
			case 'periodo':
				setAsociacionSeleccionada(-1);
				setPeriodoSeleccionado(value);
				consultarAsociaciones();
				break;
			case "asociacion":
				setAsociacionSeleccionada(value);

				break;
			default:
				break;
		}
	};

	return (
		<div>
			<Botonera funciones={obtenerFunciones()} />
			<div className='conf-general row mt-5'>
				<Combo
					opciones={listaAreaPrestacion}
					key="arprIderegistro"
					propTexto='arprNombre'
					propValor='arprIderegistro'
					label='Área prestación:'
					name='areaPrestacion'
					value={areaPrestacionSeleccionada}
					onChange={(e) => controlarCambio(e)}
				/>
				<Combo
					opciones={listaAnio}
					key="perIderegistro"
					propTexto="titulo"
					propValor="perIderegistro"
					label="Año:"
					name="anio"
					value={anioSeleccionado}
					onChange={(e) => controlarCambio(e)}
				/>
				<Combo
					opciones={listaPeriodo}
					key='idRegistroMes'
					propTexto='titulo'
					propValor='idRegistroMes'
					label='Período'
					name='periodo'
					value={periodoSeleccionado}
					onChange={(e) => controlarCambio(e)}
				/>
				<Combo
					opciones={listaAsociaciones}
					key="terIderegistro"
					propTexto='terNomcompleto'
					propValor='terIderegistro'
					label='Asociación:'
					name='asociacion'
					value={asociacionSeleccionada}
					onChange={(e) => controlarCambio(e)}
				/>
			</div>
			{
				asociacionSeleccionada != -1 && listaHistorico &&
				<TablaHistorico limpiarDetalle={limpiarDetalle}
					comboSeleccionado={asociacionSeleccionada != -1}
					listaHistoricoToneladas={listaHistorico} />
			}
			{
				asociacionSeleccionada != -1 &&
				<CamposIngreso comboSeleccionado={asociacionSeleccionada != -1}
					valorToneladas={valorToneladas} observacion={observacion}
					setValorToneladas={setValorToneladas} setObservacion={setObservacion} />
			}
		</div>
	)
}

export default Encabezado;