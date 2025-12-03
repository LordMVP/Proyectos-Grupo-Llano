import React, { Component } from 'react'
import { Tabla } from 'appfuture-react'

//Usar componente Autocompletado
import Autocompletado from '../../Assets/componentes/Autocompletado'

//Usar componente modal
import Modal from '../../Assets/componentes/Modal'


/**
 *
 *
 * @class Municipio
 * @extends {Component}
 */
class Municipio extends Component {

    //inicialización de variables
   /**
     *Define estados iniciales
     * @memberof Municipio
     */
    state = {
        lista: [],
        idMunicipio: '-1',
        municipioJson: this.props.value || [],
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Municipio',

            columns: [
                { Header: 'Municipio', accessor: 'idMunicipio' },
                {
                    Header: 'Acción',
                    accessor: 'id',
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
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @param {Object} prepProps - Cargar atributos del componente
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                municipioJson: this.props.value,
            })
        }
        if (this.props.lista !== prevProps.lista) {
            this.setState({
                lista: this.props.lista,
            })
        }
        if (this.props.limpieza !== prevProps.limpieza) {
            if (this.props.limpieza) {
                this.setState({
                    lista: [],
                    idMunicipio: '-1',
                })
                this.props.onChange({
                    target: { id: 'limpieza', value: false },
                })
            }
        }
    }

    /**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */
    BotonAgregar = (props) => {
        const { idMunicipio } = this.state

        return idMunicipio === '-1' ? (
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
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */

    agregar = () => {
        const { idMunicipio } = this.state
        const buscarCiudad = this.state.municipioJson.map((ciudad) =>
            ciudad.texto == idMunicipio ? true : false
        )
        const filtrar = this.state.lista.map((fila) => {
            return fila.idMunicipio == idMunicipio ? true : false
        })

        if (!buscarCiudad.includes(true)) {
            //Modal
            this.setState({
                titulo: '¡MUNICIPIO NO ENCONTRADO!',
                texto: `El municipio que escogío no está en la lista principal`,
            })
            //despliega modal
            this.setState({ mostrar: true })
        } else if (filtrar.includes(true)) {
            //Modal
            this.setState({
                titulo: '¡MUNICIPIO YA ESTA ASOCIADO!',
                texto: `El municipio ya se encuentra relacionado en la lista`,
            })
            //despliega modal
            this.setState({ mostrar: true })
        } else {
            const lista = [
                ...this.state.lista,
                { idMunicipio /* CAMBIA ESTO */ },
            ]
            this.setState({ lista }, () => {
                this.setState({ idMunicipio: '-1' })
            })
            this.props.onChange({
                target: { id: 'listaMunicipio', value: lista },
            })
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
        this.props.onChange({ target: { id: 'listaMunicipio', value: lista } })
    }

    /**
     * Cierra el modal de la consulta
     * @method
     */

    cerrarModal = () => {}

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    /**
     *Renderiza la vista
     * @return {JSX} componente - returna vista jsx
     */
    render() {
        return (
            <React.Fragment>
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
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

                <div className="contenedor">
                    <this.BotonAgregar />
                </div>

                <div className="contenedor">
                    <Tabla datos={this.state.lista} columnas={this.columnas} />
                </div>
            </React.Fragment>
        )
    }
}

export default Municipio
