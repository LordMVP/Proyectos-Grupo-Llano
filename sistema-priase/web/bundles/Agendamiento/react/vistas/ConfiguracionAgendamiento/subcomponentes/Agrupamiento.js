import React, { Component } from 'react'
import { Combo, Input, Tabla } from 'appfuture-react'

import { Util } from '../../Assets/util/Util'
//Usar componente modal
import Modal from '../../Assets/componentes/Modal'


/**
 *
 *
 * @class Agrupamiento
 * @extends {Component}
 */
class Agrupamiento extends Component {
    //inicialización de variables
   /**
     *Define estados iniciales
     * @memberof Agrupamiento
     */
    state = {
        lista: this.props.value || [],
        agrupamientoJson: this.props.opcionesCombobox,

        // defecto

        agrupamiento: '-1',
        valor: '',
        orden: 0,
        minima: 0,
        maxima: 0,
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Configuraciones',

            columns: [
                {
                    Header: 'Agrupamiento',
                    accessor: 'agrupamiento',
                },

                {
                    Header: 'Orden',
                    accessor: 'orden',
                },
                {
                    Header: 'Valor',
                    accessor: 'valor',
                },
                {
                    Header: 'Acción',
                    accessor: 'id',
                    Cell: (props) => (
                        <button
                            className="btn"
                            onClick={(e) => this.remover(props.index)}>
                            Remover
                        </button>
                    ),
                },
            ],
        },
    ]

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.opciones !== prevProps.opciones) {
            this.setState({
                agrupamientoJson: this.props.opciones,
            })
        }
        if (this.props.value !== prevProps.value) {
            if (this.props.value.length > 0) {
                this.setState({
                    lista: this.props.value,
                    minima: this.props.value[0].minima,
                    maxima: this.props.value[0].maxima,
                })
            } else {
                this.setState({
                    lista: this.props.value,
                })
            }
        }
        if (this.props.limpieza !== prevProps.limpieza) {
            if (this.props.limpieza) {
                this.setState({
                    agrupamiento: '-1',
                    orden: 0,
                    minima: 0,
                    maxima: 0,
                    valor: '',
                    lista: [],
                    mostrar: false,
                })
                this.props.onChange({
                    target: { id: 'limpieza', value: false },
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

    change = ({ target }) => {
        this.setState({ [target.id]: target.value })
    }

    /**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */

    BotonAgregar = () => {
        const { agrupamiento, valor } = this.state

        return agrupamiento !== '-1' && valor !== '' ? (
            <button className="btn" onClick={this.agregar}>
                agregar
            </button>
        ) : (
            <button className="btn" disabled={true}>
                agregar
            </button>
        )
    }

    /**
     * Agrega una nueva fila a la tabla. Evaluando previamente que la información no este repetida.
     * @method
     */

    agregar = () => {
        const { agrupamiento, orden, minima, maxima, valor } = this.state
        const filtrar = this.state.lista.map((fila) => {
            // return (
            //   (fila.agrupamiento == agrupamiento && fila.orden == orden) ||
            //   fila.agrupamiento == agrupamiento
            // )
            return fila.orden == orden
        })

        if (filtrar.includes(true)) {
            // Modal
            this.setState({
                titulo: '¡INFORMACIÓN DUPLICADA!',
                texto: 'El orden ya está asociado.',
            })

            // despliega modal

            this.setState({ mostrar: true })
        } else {
            if (agrupamiento !== '-1') {
                if (this.state.lista.length <= 0) {
                    this.setState(
                        {
                            lista: [
                                ...this.state.lista,
                                { agrupamiento, orden, minima, maxima, valor },
                            ],
                        },
                        () => {
                            this.props.onChange({
                                target: {
                                    id: 'listaAgrupamiento',
                                    value: this.state.lista,
                                },
                            })
                        }
                    )
                } else {
                    // captura los datos digitados de mínima y máxima

                    if (
                        this.state.lista[0].minima != minima ||
                        this.state.lista[0].maxima != maxima
                    ) {
                        //Modal

                        this.setState({
                            titulo: '¡INFORMACIÓN INCONSISTENTE!',
                            texto:
                                'El valor mínimo y máximo se deben mantener. De lo contrario,  elimine todos los elementos listados en agrupamiento.',
                        })

                        // despliega modal
                        this.setState({ mostrar: true })
                        return false
                    }
                    this.setState(
                        {
                            lista: [
                                ...this.state.lista,
                                { agrupamiento, orden, minima, maxima, valor },
                            ],
                        },
                        () => {
                            this.props.onChange({
                                target: {
                                    id: 'listaAgrupamiento',
                                    value: this.state.lista,
                                },
                            })
                        }
                    )
                }

                // limpieza
                this.setState({ agrupamiento: '-1' })
            }
        }
    }

    /**
     * Elimina la fila seleccionada en la tabla
     * @method
     * @param {int} index -Índice que corresponde al número de la fila que se desea eliminar
     */

    remover = (index) => {
        const lista = this.state.lista.filter((a, b) => index !== b)

        this.setState({ lista }, () => {
            this.props.onChange({
                target: { id: 'listaAgrupamiento', value: this.state.lista },
            })
        })
    }

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <div className="columna">
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />

                <Combo
                    propTexto="texto"
                    propValor="id"
                    id="agrupamiento"
                    label="Agrupamiento:"
                    value={this.state.agrupamiento}
                    opciones={this.state.agrupamientoJson}
                    onChange={this.change}
                />

                <Input
                    id="orden"
                    label="Orden:"
                    max="10"
                    min="0"
                    type="number"
                    value={this.state.orden}
                    onChange={this.change}
                />

                <div className="contenedor formulario">
                    <Input
                        id="minima"
                        min="0"
                        type="number"
                        label="Cantidad mínima"
                        value={this.state.minima}
                        onChange={this.change}
                    />

                    <Input
                        id="maxima"
                        min="0"
                        type="number"
                        label="Cantidad máxima:"
                        value={this.state.maxima}
                        onChange={this.change}
                    />

                    <Input
                        id="valor"
                        label="valor"
                        value={this.state.valor}
                        onChange={this.change}
                    />
                </div>

                <div className="contenedor">
                    <this.BotonAgregar />
                </div>
                <div className="contenedor">
                    <Tabla datos={this.state.lista} columnas={this.columnas} />
                </div>
            </div>
        )
    }
}

export default Agrupamiento
