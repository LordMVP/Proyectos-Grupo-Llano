import React, { Component } from 'react'

import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'
import axios from 'axios'

import {
    Botonera,
    Captcha,
    Combo,
    Interruptor,
    Tab,
    Input,
} from 'appfuture-react'

import Asignacion from './subcomponentes/Asignacion'
import Seleccion from './subcomponentes/Seleccion'
import ConsultaRegla from './subcomponentes/ConsultaRegla'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../Assets/util/peticion'
//Componente de Prueba Autocompletado
import Autocompletado from '../Assets/componentes/Autocompletado'
//Carga de funciones
import { Util } from '../Assets/util/Util'
//Usar componente modal
import Modal from '../Assets/componentes/Modal'


/**
 *
 *
 * @class EdicionReglas
 * @extends {Component}
 */
class EdicionReglas extends Component {
    /**
     *Inicializar estados
     * @constructor
     * @param {*} props
     * @memberof EdicionReglas
     */

    constructor(props) {
        super(props)
        this.state = {
            parametroJson: [],
            consultaModal: false,
            idRegla: '',
            regla: '-1',
            proceso: '-1',
            estado: false,
            seleccion: [],
            asignacion: [],
            descripcionRegla: '',
            seleccion: [],
            asignacion: [],
            limpieza: false,
            procesoJson: [],
            mostrar: false,
        }
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */

    async componentDidMount() {
        /*await this.peticion.get({
            url: URL.EDICIONREGLAS.LISTAR_REGLA,
            config: ['creIderegistro', 'creDesripcion'],
            json: 'reglaJson',
            value: 'regla',
        })*/

        this.peticion
            .get({
                url: URL.EDICIONREGLAS.LISTAR_PROCESO,
                config: ['uniProceso', 'prcDescripcion'],
                json: 'procesoJson',
            })
            .then((e) => {})

        await axios
            .get(URL.EDICIONREGLAS.LISTAR_PARAMETRO)
            .then((data) => {
                return data.data
            })
            .then((json) => {
                const parametro = json.map((elemento) => {
                    return {
                        id: `${elemento.aparIderegistro} - ${elemento.aparDescripcion} - ${elemento.aparReferenciamodelo}`,
                        texto: `${elemento.aparIderegistro} - ${elemento.aparDescripcion} - ${elemento.aparReferenciamodelo}`,
                        salida: `${elemento.aparTiposalida}`,
                    }
                })
                this.setState({
                    parametroJson: parametro,
                })
            })
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
        if (id === 'regla') {
            const [datos] = await this.peticion.post({
                url: URL.EDICIONREGLAS.BUSCAR_REGLA,
                parametros: {
                    idRegla: Util.obtenerId(value),
                    descripcionProceso: 'a',
                },
            })
            this.setState({
                estado: datos.creEstado === 'A',
                proceso: datos.proceso.uniProceso,
            })
        }
    }

    /**
     * Despliega el modal para realizar la consulta
     * @method
     * @param {array} data - arreglo con la fila seleccionada
     */

    handleConsulta = (data) => {
        this.setState({ consultaModal: !this.state.consultaModal })

        if (data.hasOwnProperty('regla'))
            axios
                .post(URL.EDICIONREGLAS.BUSCAR_REGLA_POR_ID, {
                    idRegla: Util.obtenerId(data.regla),
                })
                .then((data) => {
                    return data.data
                })
                .then((arreglo) => {
                    this.nuevo()

                    if (typeof data == 'undefined' || data == null) return false

                    this.setState({
                        descripcionRegla: arreglo.creDesripcion,
                        idRegla: arreglo.creIderegistro,
                        estado: arreglo.creEstado == 'A' ? true : false,
                    })
                    let proceso = this.state.procesoJson.filter(fila => parseInt(Util.obtenerId(fila.texto)) == arreglo.proceso.uniProceso)
                    proceso = proceso.length > 0 ? Util.limpiarDato(proceso) : '-1'
                    this.setState({
                        proceso
                    })


                    let asignacion = arreglo.condiciones.filter(
                        (fila) => fila.dcrTiporegla == 'A'
                    )
                    asignacion = asignacion.map((fila) => {
                        return {
                            dcrIderegistro: fila.dcrIderegistro,
                            usuIderegistro: arreglo.usuIderegistro,
                            secuencia: fila.dcrSecuencia,
                            descripcion: fila.dcrDescripcion,
                            condicion: fila.dcrExpresion,
                        }
                    })
                    let seleccion = arreglo.condiciones.filter(
                        (fila) => fila.dcrTiporegla == 'S'
                    )
                    seleccion = seleccion.map((fila) => {
                        return {
                            dcrIderegistro: fila.dcrIderegistro,
                            usuIderegistro: arreglo.usuIderegistro,
                            secuencia: fila.dcrSecuencia,
                            descripcion: fila.dcrDescripcion,
                            condicion: fila.dcrExpresion,
                        }
                    })

                    this.setState({
                        asignacion,
                        seleccion,
                    })
                })
    }

    /**
     * Se ejecuta al momento de pulsar sobre el botón Guardar
     * @method
     * @async
     */

    guardar = async () => {
        if (
            this.state.descripcionRegla === '' ||
            this.state.proceso === '-1' ||
            this.state.seleccion.length <= 0
            //this.state.asignacion.length <= 0
        ) {
            await this.setState({ mensaje: [] })
            this.state.descripcionRegla === ''
                ? this.state.mensaje.push('Descripción Regla')
                : ''
            this.state.proceso === '-1'
                ? this.state.mensaje.push('Proceso')
                : ''
            this.state.seleccion.length <= 0
                ? this.state.mensaje.push('Lista Selección')
                : ''
            //this.state.asignacion.length <= 0 ? this.state.mensaje.push('Lista Asignación'): '';
            //Modal
            this.setState({
                titulo: '¡FALTA INFORMACIÓN!',
                texto: `Falta escoger:\n ${this.state.mensaje.toString()}`,
            })
            //Elimina si existe un segundo botón
            this.botones.length === 2 ? this.botones.shift() : null
            //despliega modal
            this.setState({ mostrar: true })
        } else {
            this.setState({
                titulo: '¡ENVIAR INFORMACIÓN!',
                texto: '¿Confirma Transacción?',
            })
            //Agrega botón
            this.botones.length === 1
                ? this.botones.unshift({
                      texto: 'Aceptar',
                      callback: this.guardarModal,
                      index: 1,
                  })
                : null
            //despliega modal
            this.setState({ mostrar: true })
        }
    }

    /**
     * Se ejecuta al momento de pulsar en  'aceptar' del modal, desplegado en la función 'guardar'.
     * Y solo ocurre al validar los campos necesarios para registrar o actualizar la información
     * @method
     * @async
     */

    guardarModal = async () => {
        let condicionesActualizar = []
        let condicionesRegistrar = []

        this.state.seleccion.map((fila) => {
            if (fila.hasOwnProperty('dcrIderegistro')) {
                condicionesActualizar.push({
                    dcrDescripcion: fila.descripcion,
                    dcrTiporegla: 'S',
                    dcrSecuencia: fila.secuencia,
                    dcrExpresion: fila.condicion,
                    dcrIderegistro: fila.dcrIderegistro,
                    ideregistro: { creIderegistro: this.state.idRegla },
                })
            } else {
                condicionesRegistrar.push({
                    dcrDescripcion: fila.descripcion,
                    dcrTiporegla: 'S',
                    dcrSecuencia: fila.secuencia,
                    dcrExpresion: fila.condicion,
                })
            }
        })

        this.state.asignacion.map((fila) => {
            if (fila.hasOwnProperty('dcrIderegistro')) {
                condicionesActualizar.push({
                    dcrDescripcion: fila.descripcion,
                    dcrTiporegla: 'A',
                    dcrSecuencia: fila.secuencia,
                    dcrExpresion: fila.condicion,
                    dcrIderegistro: fila.dcrIderegistro,
                    ideregistro: { creIderegistro: this.state.idRegla },
                })
            } else {
                condicionesRegistrar.push({
                    dcrDescripcion: fila.descripcion,
                    dcrTiporegla: 'A',
                    dcrSecuencia: fila.secuencia,
                    dcrExpresion: fila.condicion,
                })
            }
        })

        let datoGuardar = {
            creDesripcion: this.state.descripcionRegla,
            proceso: { uniProceso: Util.obtenerId(this.state.proceso) },
            creEstado: this.state.estado ? 'A' : 'I',
            condiciones:
                this.state.idRegla !== ''
                    ? condicionesActualizar
                    : condicionesRegistrar,
        }
        this.state.idRegla !== ''
            ? (datoGuardar.creIderegistro = this.state.idRegla)
            : null

        //Actualiza o registra
        this.peticion.post({
            url:
                this.state.idRegla !== ''
                    ? URL.EDICIONREGLAS.ACTUALIZAR_REGLA
                    : URL.EDICIONREGLAS.REGISTRAR_REGLA,
            parametros: datoGuardar,
        })
        //Actualiza y si hay registros nuevos agrega solo las condiciones
        if (condicionesRegistrar.length > 0 && this.state.idRegla !== '') {
            condicionesRegistrar = condicionesRegistrar.map((fila) => {
                return {
                    ideregistro: { creIderegistro: this.state.idRegla },
                    dcrDescripcion: fila.dcrDescripcion,
                    dcrTiporegla: fila.dcrTiporegla,
                    dcrSecuencia: fila.dcrSecuencia,
                    dcrExpresion: fila.dcrExpresion,
                }
            })

            this.peticion.post({
                url: URL.EDICIONREGLAS.REGISTRAR_REGLA,
                parametros: { condiciones: condicionesRegistrar },
            })
        }

        //limpieza
        this.setState({
            descripcionRegla: '',
            idRegla: '',
            proceso: '-1',
            seleccion: [],
            asignacion: [],
            estado: false,
            limpieza: true,
        })
    }

    /**
     * Restablece los valores a las condiciones iniciales
     * @method
     */

    nuevo = () => {
        //limpieza

        this.setState({
            descripcionRegla: '',
            idRegla: '',
            proceso: '-1',
            seleccion: [],
            asignacion: [],
            estado: false,
            limpieza: true,
        })
    }

     /**
     * Cierra el modal de la consulta
     * @method
     */

    cerrarModal = () => {}

    //Arreglo para emplearlo en el componente botonera, con sus respectivas funciones

    funciones = [
        { texto: 'guardar', callback: this.guardar },
        { texto: 'consultar', callback: this.handleConsulta },
        { texto: 'nuevo', callback: this.nuevo },
    ]

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
                <ConsultaRegla
                    mostrar={this.state.consultaModal}
                    opcionesProceso={this.state.procesoJson}
                    cerrarModal={this.handleConsulta}
                />

                <h1>Empresa - Edición de reglas</h1>

                <Botonera funciones={this.funciones} />

                <div className="caja contenedor">
                    <label className="tag">reglas de selección</label>

                    <div className="">
                        <div className="caja fila contenedor">
                            <label className="tag">regla</label>
                            <div className="fila">
                                <Input
                                    id="idRegla"
                                    label="id regla"
                                    className={'col-sm-3'}
                                    value={this.state.idRegla}
                                    extra={{ disabled: true }}
                                />
                                <Input
                                    id="descripcionRegla"
                                    label="descripción regla:"
                                    className={'col-sm-9'}
                                    value={this.state.descripcionRegla}
                                    onChange={this.change}
                                />
                            </div>
                        </div>

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="proceso"
                            label="proceso"
                            value={this.state.proceso}
                            opciones={this.state.procesoJson}
                            onChange={this.change}
                        />

                        <Interruptor
                            id="estado"
                            label="estado"
                            value={this.state.estado}
                            onChange={() => {
                                this.change({
                                    target: {
                                        id: 'estado',
                                        value: !this.state.estado,
                                    },
                                })
                            }}
                        />
                    </div>
                </div>

                <div className="contenedor">
                    <Tab>
                        <Seleccion
                            regla={this.state.regla}
                            label="selección"
                            onChange={this.change}
                            lista={this.state.seleccion}
                            value={this.state.parametroJson}
                            limpieza={this.state.limpieza}
                        />
                        <Asignacion
                            regla={this.state.regla}
                            label="Asignacion:"
                            onChange={this.change}
                            lista={this.state.asignacion}
                            value={this.state.parametroJson}
                            limpieza={this.state.limpieza}
                        />
                    </Tab>
                </div>

                <Captcha />
            </React.Fragment>
        )
    }
}

export { EdicionReglas as REdicionReglas }
