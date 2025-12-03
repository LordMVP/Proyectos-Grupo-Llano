import React, { Component } from 'react'
import { Combo, Input, Tabla, VentanaModal, TextArea } from 'appfuture-react'

//Usar componente Autocompletado

import Autocompletado from '../../Assets/componentes/Autocompletado'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController

import URL from '../../../global/rutas_api'

//LLamado de la petición por POST o GET empleando AXIOS

import Peticion from '../../Assets/util/peticion'

//Carga de funciones

import { Util } from '../../Assets/util/Util'


/**
 *
 *
 * @class ConsultaCalendario
 * @extends {Component}
 */
class ConsultaCalendario extends Component {
    /**
     *Define estados iniciales
     * @memberof ConsultaCalendario
     */
    constructor(props) {
        super(props)
        this.state = {
            lista: [],

            // defecto

            fechaInicio: '',
            fechaFinal: '',
            id: '',
            proceso: '-1',
            contratista: '-1',
            unidadResponsable: '-1',
            municipio: '',
            descripcion: '',
            idMunicipio: '-1',

            procesoJson: this.props.opcionesProceso,
            contratanteJson: this.props.opcionesContratante,
            agendaJson: this.props.opcionesAgenda,
            municipioJson: this.props.opcionesMunicipio,
        }
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.opcionesProceso !== prevProps.opcionesProceso) {
            this.setState({
                procesoJson: this.props.opcionesProceso,
            })
        }
        if (this.props.opcionesContratista !== prevProps.opcionesContratista) {
            this.setState({
                contratistaJson: this.props.opcionesContratista,
            })
        }
        if (
            this.props.opcionesUnidadResponsable !==
            prevProps.opcionesUnidadResponsable
        ) {
            this.setState({
                unidadResponsableJson: this.props.opcionesUnidadResponsable,
            })
        }
        if (this.props.opcionesMunicipio !== prevProps.opcionesMunicipio) {
            this.setState({
                municipioJson: this.props.opcionesMunicipio,
            })
        }
        if (this.props.mostrar !== prevProps.mostrar) {
            if (this.props.mostrar) {
                //restablece valores
                this.setState({
                    lista: [],
                    // defecto
                    proceso: '-1',
                    contratante: '-1',
                    agenda: '-1',
                    etapa: '-1',
                    actividad: '-1',
                    descripcion: '',
                    referencia: '',
                })
            }
        }
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Consulta calendario habil',

            columns: [
                {
                    Header: 'Ítem',
                     accessor: 'item'
                },
                {
                    Header: 'Id',
                    accessor: 'id',
                },

                {
                    Header: 'Descripción',
                    accessor: 'descripcion',
                },

                {
                    Header: 'Proceso',
                    accessor: 'proceso',
                },
                {
                    Header: 'Acción',
                    accessor: 'id',
                    Cell: (props) => (
                        <button onClick={(e) => this.asignar(props.index)}>
                            ver
                        </button>
                    ),
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
     *Asigna la fila seleccionada para procesarla más adelante
     *@method
     *@param {int} index - número de la fila
     */
    asignar = (index) => {
        this.props.cerrarModal(this.state.lista[index])
    }

    /**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */
    BotonAgregar = () => {
        const {
            proceso,
            contratista,
            unidadResponsable,
            id,
            idMunicipio,
            fechaInicio,
            fechaFinal,
            descripcion,
        } = this.state
        return proceso != '-1' ||
            contratista != '-1' ||
            unidadResponsable != '-1' ||
            id != '' ||
            idMunicipio != '-1' ||
            fechaInicio != '' ||
            fechaFinal != '' ||
            descripcion != '' ? (
            <button className="btn" onClick={this.consultar}>
                consultar
            </button>
        ) : (
            <button className="btn" disabled>
                consultar
            </button>
        )
    }

    /**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @async
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */

    change = async ({ target: { id, value } }) => {
        await this.setState({ [id]: value })

        switch (id) {
            case 'contratista':
                const a = await this.peticion
                    .post({
                        url: URL.CALENDARIO_HABIL.LISTAR_CUADRILLAS_CONTRATISTA,
                        parametros: {
                            idContratista: Util.obtenerId(value),
                        },
                        config: [
                            'ureIderegistro',
                            'cuadrillaCod',
                            'cuadrillaNom',
                        ],
                        json: 'unidadResponsableJson',
                    })
                    .then((data) => {
                        if (data === undefined) {
                            this.setState({ unidadResponsableJson: [] })
                        }
                    })
                break
        }
    }

    /**
     *
     *Consulta filtrando información, previa selección de varios campos para listarlos en una tabla
     *@method
     */

    consultar = () => {
        this.peticion
            .post({
                url: URL.CALENDARIO_HABIL.CONSULTAR_CALENDARIO_HABIL,
                parametros: {
                    chaIdregistro: this.state.id != '' ? this.state.id : '',
                    uniProceso: {
                        uniProceso:
                            this.state.proceso != '-1'
                                ? Util.obtenerId(this.state.proceso)
                                : '',
                    },
                    chaDescripcion:
                        this.state.descripcion != ''
                            ? this.state.descripcion
                            : '',

                    //Agregar el sufijo a la fecha seleccionada para la conversión necesaria en el backend

                    fechaDesde:
                        this.state.fechaInicio != ''
                            ? this.state.fechaInicio + 'T00:00:00.000+0000'
                            : '',

                    //Agregar el sufijo a la fecha seleccionada para la conversión necesaria en el backend

                    fechaHasta:
                        this.state.fechaFinal != ''
                            ? this.state.fechaFinal + 'T00:00:00.000+0000'
                            : '',
                    empContratista:
                        this.state.contratista != '-1'
                            ? Util.obtenerId(this.state.contratista)
                            : '',
                    municipio:
                        this.state.idMunicipio != '-1'
                            ? Util.obtenerId(this.state.idMunicipio)
                            : '',
                    unidadResponsable:
                        this.state.unidadResponsable != '-1'
                            ? Util.obtenerId(this.state.unidadResponsable)
                            : '',
                },
            })
            .then((data) => {
                if (data == null) {
                    this.setState({ lista: [] })
                    return false
                }
                const lista = data.map((fila, index) => {
                    return {
                        item:index+1,
                        id: fila.chaIdregistro,
                        descripcion: fila.chaDescripcion,
                        proceso: `${fila.uniProceso.uniProceso} - ${fila.uniProceso.prcDescripcion}`,
                    }
                })

                this.setState({ lista: lista }, () => {})
            })
    }

    /**
     *Renderiza la vista
     * @return {JSX} componente - returna vista jsx
     */
    render() {
        return (
            <VentanaModal
                titulo="Consulta Calendario Hábil Proceso"
                mostrar={this.props.mostrar}
                cerrarModal={() => this.props.cerrarModal(undefined)}>
                <div className="contenedor formulario">
                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="proceso"
                        label="proceso"
                        opciones={this.state.procesoJson}
                        value={this.state.proceso}
                        onChange={this.change}
                    />

                    <Input
                        id="id"
                        label="id"
                        value={this.state.id}
                        onChange={this.change}
                    />

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="contratista"
                        label="contratista"
                        opciones={this.state.contratistaJson}
                        value={this.state.contratista}
                        onChange={this.change}
                    />                    

                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="unidadResponsable"
                        label="unidad responsable"
                        opciones={this.state.unidadResponsableJson}
                        value={this.state.unidadResponsable}
                        onChange={this.change}
                    />

                    <div className="formulario">
                        <Autocompletado
                            id="idMunicipio"
                            label="Municipio:"
                            marcaAgua={'Escriba el código o el municipio'}
                            opciones={this.state.municipioJson}
                            value={this.state.idMunicipio}
                            onChange={this.change}
                        />
                    </div>
                </div>

                <div className="contenedor caja formulario">
                    <label className="tag">Fecha</label>

                    <Input
                        id="fechaInicio"
                        type="date"
                        label="fecha inicio"
                        value={this.state.fechaInicio}
                        onChange={this.change}
                    />

                    <Input
                        id="fechaFinal"
                        type="date"
                        label="fecha final"
                        value={this.state.fechaFinal}
                        onChange={this.change}
                    />
                </div>

                <div className="contenedor">
                    <Input
                        id="descripcion"
                        label="descripcion"
                        value={this.state.descripcion}
                        onChange={this.change}
                    />
                </div>

                <div className="contenedor">
                    <this.BotonAgregar />
                </div>

                <div className="contenedor">
                    <Tabla datos={this.state.lista} columnas={this.columnas} />
                </div>
            </VentanaModal>
        )
    }
}

export default ConsultaCalendario
