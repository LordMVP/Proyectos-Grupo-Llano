import React, { Component } from 'react'
import { Combo, Input, Tabla } from 'appfuture-react'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../../Assets/util/peticion'
//Componente de Prueba Autocompletado
import Autocompletado from '../../Assets/componentes/Autocompletado'
//Carga de funciones
import { Util } from '../../Assets/util/Util'
//Usar componente modal
import Modal from '../../Assets/componentes/Modal'


/**
 *
 *
 * @class Ordenamiento
 * @extends {Component}
 */
class Ordenamiento extends Component {
    //inicialización de variables
   /**
     *Define estados iniciales
     * @memberof Ordenamiento
     */
    state = {
        lista: this.props.value || [],
        ordenamientoJson: this.props.opciones,

        // defecto

        ordenamiento: '-1',
        posicion: '0',
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Configuraciones',

            columns: [
                {
                    Header: 'Ordenamiento',
                    accessor: 'ordenamiento',
                },

                {
                    Header: 'Posicion',
                    accessor: 'posicion',
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
                ordenamientoJson: this.props.opciones,
            })
        }
        if (this.props.value !== prevProps.value) {
            this.setState({
                lista: this.props.value,
            })
        }
        if (this.props.limpieza !== prevProps.limpieza) {
            if (this.props.limpieza) {
                this.setState({
                    ordenamiento: '-1',
                    posicion: 0,
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

    change = ({ target: { id, value } }) => {
        this.setState({ [id]: value })
    }

    /**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */

    BotonAgregar = () => {
        const { ordenamiento, posicion } = this.state

        return ordenamiento !== '-1' ? (
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
        const { ordenamiento, posicion } = this.state
        const filtrar = this.state.lista.map((fila) => {
            return (
                (fila.ordenamiento == ordenamiento &&
                    fila.posicion == posicion) ||
                fila.ordenamiento == ordenamiento
            )
        })
        if (filtrar.includes(true)) {
            //Modal
            this.setState({
                titulo: '¡INFORMACIÓN DUPLICADA!',
                texto:
                    'El ordenamiento y la posición ya está asociado o el ordenamiento ya existe',
            })
            //despliega modal
            this.setState({ mostrar: true })
        } else {
            if (ordenamiento !== '-1') {
                this.setState(
                    {
                        lista: [
                            ...this.state.lista,
                            { ordenamiento, posicion },
                        ],
                    },
                    () => {
                        this.props.onChange({
                            target: {
                                id: 'listaOrdenamiento',
                                value: this.state.lista,
                            },
                        })
                    }
                )
                // limpieza

                this.setState({ ordenamiento: '-1' })
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
                target: { id: 'listaOrdenamiento', value: this.state.lista },
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
                    id="ordenamiento"
                    label="Ordenamiento:"
                    value={this.state.ordenamiento}
                    opciones={this.state.ordenamientoJson}
                    onChange={this.change}
                />

                <Input
                    id="posicion"
                    max="10"
                    min="0"
                    type="number"
                    label="Posición:"
                    value={this.state.posicion}
                    onChange={this.change}
                />

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

export default Ordenamiento
