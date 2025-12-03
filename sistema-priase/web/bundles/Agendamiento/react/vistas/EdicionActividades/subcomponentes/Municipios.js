import React, { Component } from 'react'
//componentes appfuture-react
import { Combo, Tabla } from 'appfuture-react'
//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../../global/rutas_api'
import Peticion from '../../Assets/util/peticion'
//Componente autocompletado
import Autocompletado from '../../Assets/componentes/Autocompletado'
//Componente modal
import Modal from '../../Assets/componentes/Modal'
//Carga de funciones
import { Util } from '../../Assets/util/Util'


/**
 *
 *
 * @class Municipios
 * @extends {Component}
 */
class Municipios extends Component {

    /**
     *Inicializar estados
     * @constructor
     * @param {*} props
     * @memberof Municipios
     */
    constructor(props) {
        super(props)
        this.state = {
            mostrar: false,
            municipio: '-1',
            /**
             * Lista de unidades para visualizar en la tabla
             * de relación municipios
             */
            lista: this.props.value,
            /**
             * Lista de opciones para el combo municipios
             * desde el componente padre Edición Actividades
             */
            ciudadJson: this.props.opciones,
        }
    }
    //ejemplificar objeto POST y GET axios
    peticion = new Peticion(this)

    /**
     * Arreglo para el componente tabla, dos columnas:
     * Municipio y Acción(eliminar).
     * Este último llama función remover
     */

    //Arreglo con los id y nombre de columnas para el componente Tabla

    columnas = [
        {
            Header: 'Municipios',
            columns: [
                { Header: 'Municipio', accessor: 'municipio' },

                {
                    Header: 'Acción',
                    accesor: 'id',
                    Cell: (props) => (
                        <button onClick={(e) => this.remover(props.index)}>
                            eliminar
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
        if (this.props.opciones !== prevProps.opciones) {
            this.setState({
                ciudadJson: this.props.opciones,
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
                  municipio: '-1',
                })
                this.props.onChange({
                    target: { id: 'limpieza' },
                    value: false,
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

    BotonAgregar = () => {
        const { municipio } = this.state

        return municipio !== '-1' ? (
            <button onClick={this.agregar}>agregar</button>
        ) : (
            <button disabled={true}>agregar</button>
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

    change = ({ target: { id, value } }) => {
        this.setState({ [id]: value })
    }

    /**
     * Agrega una nueva fila a la tabla. Evaluando previamente que la información no este repetida.
     * @method
     */

    agregar = () => {
        const { municipio } = this.state

        const buscarCiudad = this.state.ciudadJson.map((ciudad) =>
            ciudad.texto == municipio ? true : false
        )
        const filtrar = this.state.lista.map((fila) => {
            return fila.municipio === municipio ? true : false
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
            if (municipio !== '-1') {
                this.setState(
                    { lista: [...this.state.lista, { municipio }] },
                    () => {
                        this.props.onChange({
                            target: {
                                id: 'municipios',
                                value: this.state.lista,
                            },
                        })
                    }
                )
                // limpieza

                this.setState({
                    municipio: '-1',
                })
            }
        }
    }

    /**
     * Elimina la fila seleccionada en la tabla
     * @method
     * @param {int} index -Índice que corresponde al número de la fila que se desea eliminar
     */

    remover = (index) => {
        const fila = this.state.lista.filter((a, b) => {
            return index == b
        })
        if (fila[0].hasOwnProperty('eliminarMunicipios')) {
            this.peticion.post({
                url: URL.EDICIONACTIVIDADES.ELIMINAR_CIA_CIUDADES,
                parametros: {
                    ciudadcCod: Util.obtenerId(fila[0].municipio),
                    proaIderegistro: fila[0].proaIderegistro,
                },
            })
        }

        const lista = this.state.lista.filter((a, b) => index !== b)

        this.setState({ lista }, () => {
            this.props.onChange({
                target: { id: 'municipios', value: this.state.lista },
            })
        })
    }

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
                        id="municipio"
                        label="Municipio:"
                        marcaAgua={'Escriba el código o el municipio'}
                        opciones={this.state.ciudadJson}
                        onChange={this.change}
                        value={this.state.municipio}
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

export default Municipios
