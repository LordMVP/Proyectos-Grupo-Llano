import React, { Component } from 'react'
import { Combo, Input, Tabla, VentanaModal } from 'appfuture-react'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
//Carga de funciones
import { Util } from '../../Assets/util/Util'
//Usar componente modal
import Modal from '../../Assets/componentes/Modal'
import axios from 'axios'
import Peticion from '../../Assets/util/peticion'



/**
 *
 *
 * @class ConsultaRegla
 * @extends {Component}
 */
class ConsultaRegla extends Component {
    //inicialización de variables

    /**
     *Define estados iniciales
     * @memberof ConsultaRegla
     */
    state = {
        lista: [],
        procesoJson: [],

        // defecto
        regla: '',
        proceso: '-1',
        mostrar: false,
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Consulta información',

            columns: [
                {
                    Header: 'Regla',
                    accessor: 'regla',
                },

                {
                    Header: 'Descripcion',
                    accessor: 'descripcion',
                },
                {
                    Header: 'Acción',
                    accesor: 'id',
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

    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (prevProps.opcionesProceso !== this.props.opcionesProceso) {
            this.setState({
                procesoJson: this.props.opcionesProceso,
            })
        }
        if (prevProps.mostrar !== this.props.mostrar) {
            this.setState({
                regla: '',
                proceso: '-1',
                lista: [],
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
     * Despliega el modal para realizar la consulta
     * @method
     */

    consultar = () => {
        const { regla, proceso } = this.state
        if (regla === '' && proceso === '-1') {
            this.setState({
                titulo: '¡FALTA INFORMACIÓN!',
                texto: 'Digite el proceso y/o regla',
            })
            //despliega modal
            this.setState({ mostrar: true })
            return
        }

        this.peticion
            .post({
                url: URL.EDICIONREGLAS.BUSCAR_REGLA,
                parametros: {
                    creIderegistro: (this.state.regla == '' || isNaN(this.state.regla)
                        ? null
                        : this.state.regla
                    ),
                    creDesripcion: (this.state.regla == '' || !isNaN(this.state.regla)
                        ? null
                        : this.state.regla
                    ),
                    proceso: {
                        uniProceso:
                            this.state.proceso === '-1'
                                ? null
                                : Util.obtenerId(this.state.proceso),
                    },
                },
            })
            .then((data) => {
                if (data != null) {
                    const lista = data.map((fila) => {
                        return {
                            regla: `${fila.creIderegistro} - ${fila.creDesripcion}`,
                            descripcion: `${fila.proceso.uniProceso} - ${fila.proceso.prcDescripcion}`,
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
     * Cierra el modal de la consulta
     * @method
     */

    cerrarModal = () => { }

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <VentanaModal
                titulo="Consulta informacion"
                mostrar={this.props.mostrar}
                cerrarModal={this.props.cerrarModal}>
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />

                <div className="caja contenedor">
                    <label className="tag">informacion consulta</label>

                    <div className="">
                        <div className="caja fila contenedor">
                            <Input
                                id="regla"
                                label="regla"
                                value={this.state.regla}
                                onChange={this.change}
                            />

                            <Combo
                                propTexto="texto"
                                propValor="id"
                                id="proceso"
                                label="proceso"
                                value={this.state.proceso}
                                opciones={this.state.procesoJson}
                                onChange={this.change}
                            />
                        </div>
                    </div>

                    <div className="contenedor">
                        <button onClick={this.consultar}>consultar</button>
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

export default ConsultaRegla
