import React, { Component } from 'react'
import {
    Combo,
    Input,
    Tabla,
    VentanaModal,
    Autocompletado,
} from 'appfuture-react'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../../Assets/util/peticion'
//Carga de funciones
import { Util } from '../../Assets/util/Util'
//Usar componente modal
import Modal from '../../Assets/componentes/Modal'


/**
 *
 *
 * @class NuevaRuta
 * @extends {Component}
 */
class NuevaRuta extends Component {

    /**
     *Inicializar estados
     * @param {*} props - inicializar variables
     * @memberof NuevaRuta
     */
    constructor(props) {
        super(props)
        this.state = {
            lista: [],
            nuevaRuta: '',

            // defecto
        }
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */

    componentDidUpdate(prevProps) {
        if (this.props.opciones !== prevProps.opciones) {
            this.setState({
                rutaJson: this.props.opciones,
            })
        }
        if (this.props.mostrar !== prevProps.mostrar) {
            this.setState({
                nuevaRuta: '',
            })
        }
        if (this.props.limpieza !== prevProps.limpieza) {
            if (this.props.limpieza) {
                this.setState({
                    nuevaRuta: '',
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

    change = async ({ target: { id, value } }) => {
        await this.setState({ [id]: value })
    }

    /**
     * Crea ruta nueva
     * @method
     * @async
     */

    crear = async () => {
        const { rutaJson, nuevaRuta } = this.state
        const cantidadRutas = rutaJson.filter((a) => {
            return Util.obtenerId(a.texto, 1) === nuevaRuta.trim()
        })
        if (this.state.nuevaRuta === '') {
            this.setState({
                titulo: '¡FALTA INFORMACIÓN!',
                texto: `Defina una nueva ruta o pulse en Nuevo para seleccionar una diferente`,
            })
            //despliega modal
            this.setState({ mostrar: true })
        } else if (cantidadRutas.length > 0) {
            this.setState({
                titulo: '¡RUTA REPETIDA!',
                texto: `La ruta ingresada ya existe.`,
            })
            //Elimina si existe un segundo botón
            this.botones.length === 2 ? this.botones.shift() : null
            //despliega modal
            this.setState({ mostrar: true })
        } else {
            const { rutaJson, nuevaRuta } = this.state
            const cantidadRutas = rutaJson.filter((a) => {
                return Util.obtenerId(a.texto, 1) === nuevaRuta.trim()
            })
            if (cantidadRutas.length > 0) {
                this.setState({
                    titulo: '¡RUTA REPETIDA!',
                    texto: `La ruta ingresada ya existe.`,
                })
                //despliega modal
                this.setState({ mostrar: true })
                return false
            }
            this.peticion
                .post({
                    url: URL.RUTAS_MUNICIPIOS.AGREGAR_RUTA,
                    parametros: {
                        rumDescripcion: nuevaRuta.trim(),
                        rumMunicipios: [],
                    },
                })
                .then((data) => {
                    //Al realizar el ingreso de la ruta
                    //LLama nuevamente a listar Rutas
                    this.peticion
                        .get({
                            url: URL.RUTAS_MUNICIPIOS.LISTAR_RUTAS,
                            config: ['rumIderegistro', 'rumDescripcion'],
                            json: 'rutaJson',
                            value: 'ruta',
                        })
                        .then((dato) => {
                            this.props.onChange({
                                target: {
                                    id: 'nuevaRuta',
                                    value: this.state.rutaJson,
                                },
                            })
                            this.props.cerrarModal()
                        })
                })
        }

        //restablece valores
        this.setState({
            actividad: '-1',
        })
    }

    /**
     * Cierra el modal de la consulta
     * @method
     */

    cerrarModal = () => {}

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <VentanaModal
                titulo="Crear Ruta"
                mostrar={this.props.mostrar}
                cerrarModal={() => this.props.cerrarModal()}>
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />
                <div className="contenedor fila">
                    <Input
                        id="nuevaRuta"
                        label="nueva ruta"
                        value={this.state.nuevaRuta}
                        onChange={this.change}
                    />
                </div>

                <div className="contenedor">
                    <button onClick={this.crear}>crear</button>
                </div>
            </VentanaModal>
        )
    }
}

export default NuevaRuta
