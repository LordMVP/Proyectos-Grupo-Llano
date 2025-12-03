import React, { Component } from 'react'
import { Combo, Input, Interruptor, Tabla, VentanaModal } from 'appfuture-react'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../../Assets/util/peticion'
//Carga de funciones
import { Util } from '../../Assets/util/Util'
//Usar componente modal
import Modal from '../../Assets/componentes/Modal'
import axios from 'axios'


/**
 *
 *
 * @class ConsultaInformacion
 * @extends {Component}
 */
class ConsultaInformacion extends Component {
    //inicialización de variables
    /**
     *Define estados iniciales
     * @memberof ConsultaInformacion
     */
    state = {
        lista: [],

        // defecto

        funcion: '-1',
        proceso: '-1',
        prioridad: '',
        regla: '-1',
        estado: false,
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.mostrar !== prevProps.mostrar) {
            if (this.props.mostrar) {
                this.setState({
                    proceso: '-1',
                    funcion: '-1',
                    regla: '-1',
                    prioridad: '',
                    descripcion: '',
                    estado: false,
                    lista: [],
                })
            }
        }
        if (prevProps.opcionesProceso !== this.props.opcionesProceso) {
            this.setState({
                procesoJson: this.props.opcionesProceso,
            })
        }
        if (prevProps.opcionesRegla !== this.props.opcionesRegla) {
            this.setState({
                reglaJson: this.props.opcionesRegla,
            })
        }
        if (prevProps.opcionesFuncion !== this.props.opcionesFuncion) {
            this.setState({
                funcionJson: this.props.opcionesFuncion,
            })
        }
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Consulta información',

            columns: [
                { Header: 'Proceso', accessor: 'proceso' },
                { Header: 'Id configuración', accessor: 'idConfiguracion' },
                //{ Header: 'Descripción', accessor: 'descripcion' },
                {
                    Header: 'Acción',
                    accessor: 'cagIderegistro',
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
     *Asigna la fila seleccionada para procesarla más adelante
     *@method
     *@param {int} index - número de la fila
     */
    asignar = (index) => {
        this.props.cerrarModal(this.state.lista[index])
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
     *Consulta filtrando información, previa selección de varios campos para listarlos en una tabla
     *@method
     */

    consultar = () => {
        this.peticion
            .post({
                url:
                    URL.CONFIGURACION_AGENDAMIENTO
                        .BUSCAR_CONFIGURACION_AGENDAMIENTO,
                parametros: {
                    cagDescripcion:
                        this.state.descripcion !== ''
                            ? this.state.descripcion
                            : null,
                    uniProceso: {
                        uniProceso:
                            this.state.proceso !== '-1'
                                ? Util.obtenerId(this.state.proceso)
                                : null,
                    },
                    afnIderegistro: {
                        afnIderegistro:
                            this.state.funcion !== '-1'
                                ? Util.obtenerId(this.state.funcion)
                                : null,
                    },
                    ideregistro: {
                        creIderegistro:
                            this.state.regla !== '-1'
                                ? Util.obtenerId(this.state.regla)
                                : null,
                    },
                    cagEstado: this.state.estado ? 'A' : 'I',
                    cagPrioridad:
                        this.state.prioridad !== ''
                            ? this.state.prioridad
                            : null,
                },
            })
            .then((data) => {
                if (data != null) {
                    const lista = data.map((elemento) => {
                        return {
                            proceso: `${elemento.uniProceso.uniProceso} - ${elemento.uniProceso.prcDescripcion}`,
                            idConfiguracion: `${elemento.cagIderegistro} - ${elemento.cagDescripcion}`,
                            //descripcion:elemento.cagDescripcion
                        }
                    })
                    this.setState({
                        lista,
                    })
                } else {
                    this.setState({
                        lista: [],
                    })
                }
            })
    }

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */

    render() {
        return (
            <VentanaModal
                titulo="Consulta configuracion agendamiento"
                mostrar={this.props.mostrar}
                cerrarModal={this.props.cerrarModal}>
                <div className="caja">
                    <label className="tag">informacion consulta</label>

                    <div className="formulario">
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="proceso"
                            label="proceso"
                            opciones={this.state.procesoJson}
                            value={this.state.proceso}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="funcion"
                            label="función"
                            opciones={this.state.funcionJson}
                            value={this.state.funcion}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="regla"
                            label="regla"
                            opciones={this.state.reglaJson}
                            value={this.state.regla}
                            onChange={this.change}
                        />

                        <Input
                            id="prioridad"
                            label="prioridad"
                            value={this.state.prioridad}
                            onChange={this.change}
                        />

                        <Interruptor
                            id="estado"
                            label="estado"
                            value={this.state.estado}
                            onChange={() =>
                                this.change({
                                    target: {
                                        id: 'estado',
                                        value: !this.state.estado,
                                    },
                                })
                            }
                        />

                        <Input
                            id="descripcion"
                            label="descripcion"
                            value={this.state.descripcion}
                            onChange={this.change}
                        />
                    </div>

                    <div className="contenedor">
                        <button className="btn" onClick={this.consultar}>
                            consultar
                        </button>
                    </div>

                    <div className="contenedor">
                        <Tabla
                            datos={this.state.lista}
                            columnas={this.columnas}
                        />
                    </div>
                </div>
            </VentanaModal>
        )
    }
}

export default ConsultaInformacion
