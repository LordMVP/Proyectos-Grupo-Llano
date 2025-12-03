import React, { Component } from 'react'
import { Input, Tabla } from 'appfuture-react'

//Componentes Modal
import Modal from '../../Assets/componentes/Modal'


/**
 *
 *
 * @class Jornada
 * @extends {Component}
 */
class Jornada extends Component {
    //Restablece valores

    //inicialización de variables
   /**
     *Define estados iniciales
     * @memberof Jornada
     */
    state = {
        lista: [],
        horaInicio: '-1',
        horaFin: '-1',
        mostrar: false,
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Jornadas',

            columns: [
                { Header: 'Jornada', accessor: 'jornada' },
                { Header: 'Inicio', accessor: 'horaInicio' },
                { Header: 'Fin', accessor: 'horaFin' },
                {
                    Header: 'Acción',
                    accessor: 'jornada',
                    Cell: (props) => (
                        <button
                            className="btn"
                            onClick={(e) => this.remover(props.index)}>
                            -
                        </button>
                    ),
                },
            ],
        },
    ]

    /**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */

    BotonAgregar = () => {
        const { horaInicio, horaFin } = this.state

        return horaInicio === '-1' || horaFin === '-1' ? (
            <button className="btn" disabled={true}>
                agregar
            </button>
        ) : (
            <button className="btn" onClick={this.agregar}>
                agregar
            </button>
        )
    }

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.lista !== prevProps.lista) {
            this.setState({
                lista: this.props.lista,
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
     * Agrega una nueva fila a la tabla. Evaluando previamente que la información no este repetida.
     * @method
     */

    agregar = () => {
        const { horaInicio, horaFin } = this.state
        const tiempo = parseInt(horaInicio.split(':')[0])
        const jornada =
            tiempo < 12 ? 'mañana' : tiempo >= 18 ? 'noche' : 'tarde'

        const filtrar = this.state.lista.map((fila) => {
            return fila.horaInicio === horaInicio &&
                fila.horaFin === horaFin &&
                fila.jornada === jornada
                ? true
                : false
        })

        if (filtrar.includes(true)) {
            this.setState({
                titulo: '¡INFORMACIÓN REPETIDA!',
                texto: 'La hora de inicio y fin ya están asociados.',
            })
            //despliega modal
            this.setState({ mostrar: true })
        } else if (horaInicio === horaFin) {
            this.setState({
                titulo: '¡INFORMACIÓN REPETIDA!',
                texto: 'La hora de inicio y fin deben ser diferentes.',
            })
            //despliega modal
            this.setState({ mostrar: true })
        } else {
            const lista = [
                ...this.state.lista,
                { horaInicio, horaFin, jornada },
            ]
            this.setState({ lista }, () => {
                this.setState({ horaInicio: '-1', horaFin: '-1' })
            })
            this.props.onChange({ target: { id: 'jornada', value: lista } })
        }
    }

    /**
     * Elimina la fila seleccionada en la tabla
     * @method
     * @param {int} index -Índice que corresponde al número de la fila que se desea eliminar
     */
    remover = (index) => {
        const lista = this.state.lista.filter((a, b) => index !== b)

        this.setState({ lista })
        this.props.onChange({ target: { id: 'jornada', value: lista } })
    }

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <div className="caja">
                <label className="tag">jornada</label>

                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />
                <div className="formulario">
                    <Input
                        id="horaInicio"
                        label="inicio (24 horas)"
                        type="time"
                        value={this.state.horaInicio}
                        onChange={this.change}
                    />

                    <Input
                        id="horaFin"
                        label="fin (24 horas)"
                        type="time"
                        value={this.state.horaFin}
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

export default Jornada
