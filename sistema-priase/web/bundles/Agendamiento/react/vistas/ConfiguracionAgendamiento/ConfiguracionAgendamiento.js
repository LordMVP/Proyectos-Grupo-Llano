import React, { Component } from 'react'
import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'
import axios from 'axios'

import { Botonera, Captcha, Combo, Input, Interruptor, validateElement } from 'appfuture-react'

import Agrupamiento from './subcomponentes/Agrupamiento'
import ConsultaAgendamiento from './subcomponentes/ConsultaAgendamiento'
import Ordenamiento from './subcomponentes/Ordenamiento'

//Rutas entre la vista Edición Actividades y Symfony-EdicionActividadesController
import URL from '../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../Assets/util/peticion'
//Carga de funciones
import { Util } from '../Assets/util/Util'
//Usar componente modal
import Modal from '../Assets/componentes/Modal'


/**
 *
 *
 * @class ConfiguracionAgendamiento
 * @extends {Component}
 */
class ConfiguracionAgendamiento extends Component {

    /**
     *Inicializar estados
     * @constructor
     * @param {*} props
     * @memberof NuevaRuta
     */    
    constructor(props) {
        super(props)
        this.state = {
            cagIderegistro: '',
            pagrIderegistro: '',
            pordIderegistro: '',
            prioridad: 0,
            listaAgrupamiento: [],
            listaOrdenamiento: [],
            consultarPrioridadJson: [],
            parametroJson: [],
            estado: false,
            descripcion: '',
            proceso: '-1',
            funcion: '-1',
            origen: '-1',
            prioridad: '',
            vigencia: '',
            limpieza: false,
        }
    }
    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */

    async componentDidMount() {
        /*
         *VISTA PRINCIPAL
         */
        //campo proceso
        await this.peticion.get({
            config: ['uniProceso', 'prcDescripcion'],
            url: URL.CONFIGURACION_AGENDAMIENTO.PROCESO,
            json: 'procesoJson',
            value: 'proceso',
        })
       
        //campo parametro
        await this.peticion
            .get({
                config: ['aparIderegistro', 'aparDescripcion'],
                url: URL.CONFIGURACION_AGENDAMIENTO.PARAMETRO,
                json: 'parametroJson',
                value: 'parametro',
            })
            .then((data) => {
                this.setState({ listaParametro: data })
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

        if (id === 'proceso' && value != -1) {
            this.consultarPrioridad(value);
            this.consultarReglas(value);
            this.consultarFunciones(value);
        }
    }

    consultarPrioridad = async (value) => {
        this.peticion
                .post({
                    url: URL.CONFIGURACION_AGENDAMIENTO.CONSULTAR_PRIORIDADES,
                    config: ['cagPrioridad', 'cagPrioridad'],
                    parametros: {
                        idProceso: Util.obtenerId(value),
                    },
                    json: 'consultarPrioridadJson',
                    value: 'consultarPrioridad',
                })
                .then((data) => {
                    if (data !== null && this.state.prioridad !== '') {
                        const { consultarPrioridadJson, prioridad } = this.state
                        const listaPrioridad = consultarPrioridadJson.filter(
                            (fila) => {
                                return Util.obtenerId(fila.texto) === prioridad
                            }
                        )
                        if (listaPrioridad.length > 0) {
                            //Modal
                            this.setState({
                                titulo: '¡PRIORIDAD DUPLICADA!',
                                texto: `La prioridad digitada ya existe.`,
                            })
                            //Elimina si existe un segundo botón
                            this.botones.length === 2
                                ? this.botones.shift()
                                : null
                            //despliega modal
                            this.setState({ mostrar: true, prioridad: '' })
                        }
                    }
                })
    }
    
    consultarReglas = async (value) =>{
         //campo regla
        this.peticion.post({
            url: URL.CONFIGURACION_AGENDAMIENTO.REGLA,
            config: ['creIderegistro', 'creDesripcion'],
            parametros: {
                idProceso: Util.obtenerId(value)
            },
            json: 'reglaJson',
            value: 'regla',
        })
    }

    consultarFunciones = async(value)=>{
        await this.peticion.post({
            url: URL.CONFIGURACION_AGENDAMIENTO.LISTAR_FUNCIONES,
            config: ['afnIderegistro', 'afnNombre'],
            parametros: {
                idProceso: Util.obtenerId(value)
            },
            json: 'funcionJson',
            value: 'funcion',
        })
    }
 

    /**
     *Detecta el cambio de estado, al digitar en el campo de texto
     *@method
     *@param {Object} e - Adjudicado a un campo de texto
     */

    onBlur = (e) => {
        var currentTarget = e.currentTarget
        const { consultarPrioridadJson, prioridad } = this.state
        setTimeout(() => {
            if (
                !currentTarget.contains(document.activeElement) &&
                consultarPrioridadJson.length != 0
            ) {
                const listaPrioridad = consultarPrioridadJson.filter((fila) => {
                    return Util.obtenerId(fila.texto) === prioridad
                })
                if (listaPrioridad.length > 0) {
                    //Modal
                    this.setState({
                        titulo: '¡PRIORIDAD DUPLICADA!',
                        texto: `La prioridad digitada ya existe.`,
                    })
                    //Elimina si existe un segundo botón
                    this.botones.length === 2 ? this.botones.shift() : null
                    //despliega modal
                    this.setState({ mostrar: true, prioridad: '' })
                }
            }
        }, 0)
    }

    /**
     *
     *Consulta filtrando información, previa selección de varios campos para listarlos en una tabla
     *@method
     *@param {Array} lista - trae la información de la fila seleccionada
     */

    handleConsulta = (lista = '') => {
        this.setState({ consultaModal: !this.state.consultaModal })
        if (lista.hasOwnProperty('idConfiguracion')) {
            axios
                .post(
                    URL.CONFIGURACION_AGENDAMIENTO
                        .CONSULTA_CONFIGURACION_AGENDAMIENTO,
                    { idConfiguracion: Util.obtenerId(lista.idConfiguracion) }
                )
                .then((json) => {
                    return json.data
                })
                .then((data) => {
                    this.setState({
                        cagIderegistro: data.cagIderegistro,
                        pagrIderegistro: data.pagrIderegistro.pagrIderegistro,
                        pordIderegistro: data.pordIderegistro.pordIderegistro,
                        estado: data.cagEstado === 'A' ? true : false,
                        descripcion: data.cagDescripcion,
                        prioridad: data.cagPrioridad,
                        vigencia: data.cagVigencia,
                    })

                    let proceso = this.state.procesoJson.filter(
                        (fila) =>
                            parseInt(Util.obtenerId(fila.texto)) ==
                            parseInt(data.uniProceso.uniProceso)
                    )
                    proceso =
                        proceso.length > 0 ? Util.limpiarDato(proceso) : '-1'

                    let regla = this.state.reglaJson.filter(
                        (fila) =>
                            parseInt(Util.obtenerId(fila.texto)) ==
                            parseInt(data.ideregistro.creIderegistro)
                    )
                    regla = regla.length > 0 ? Util.limpiarDato(regla) : '-1'

                    let funcion = this.state.funcionJson.filter(
                        (fila) =>
                            parseInt(Util.obtenerId(fila.texto)) ==
                            parseInt(data.afnIderegistro.afnIderegistro)
                    )
                    funcion =
                        funcion.length > 0 ? Util.limpiarDato(funcion) : '-1'

                    this.setState({
                        proceso,
                        regla,
                        funcion,
                    })

                    const listaOrdenamiento = data.pordIderegistro.pordParametros.map(
                        (fila) => {
                            return {
                                ordenamiento: `${fila.idParametro} - ${fila.aparDescripcion}`,
                                posicion: fila.secuencia,
                                referenciaMod: fila.referenciaMod,
                            }
                        }
                    )

                    const listaAgrupamiento = data.pagrIderegistro.pagrParametros.map(
                        (fila) => {
                            return {
                                agrupamiento: `${fila.idParametro} - ${fila.aparDescripcion}`,
                                orden: fila.secuencia,
                                minima: data.pagrIderegistro.pagrCantidadminima,
                                maxima: data.pagrIderegistro.pagrCantidadmaxima,
                                valor: fila.valor,
                                referenciaMod: fila.referenciaMod,
                            }
                        }
                    )

                    this.setState({
                        listaOrdenamiento,
                        listaAgrupamiento,
                    })
                })
        }
    }

    /**
     * Se ejecuta al momento de pulsar sobre el botón Guardar
     * @method
     * @async
     */

    guardar = async () => {
        const {
            proceso,
            funcion,
            descripcion,
            prioridad,
            vigencia,
            listaOrdenamiento,
            listaAgrupamiento,
        } = this.state

        if (
            proceso === '-1' ||
            funcion === '-1' ||
            descripcion === '' ||
            prioridad === '' ||
            vigencia === '' ||
            listaOrdenamiento.length <= 0 ||
            listaAgrupamiento.length <= 0
        ) {
            await this.setState({ mensaje: [] })
            proceso === '-1' ? this.state.mensaje.push('Proceso') : ''
            funcion === '-1' ? this.state.mensaje.push('funcion') : ''
            descripcion === '' ? this.state.mensaje.push('Descripción') : ''
            prioridad === '' ? this.state.mensaje.push('Prioridad') : ''
            vigencia === '' ? this.state.mensaje.push('Vigencia') : ''
            listaOrdenamiento.length <= 0
                ? this.state.mensaje.push('Ordenamiento')
                : ''
            listaAgrupamiento.length <= 0
                ? this.state.mensaje.push('Agrupamiento')
                : ''

            //Modal
            this.setState({
                titulo: '¡FALTA INFORMACIÓN!',
                texto: `Falta escoger:\n ${this.state.mensaje.join(', ')}`,
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
     */

    guardarModal = () => {
        //conversion al formato de listado de agrupamiento
        const listaAgrupamiento = this.state.listaAgrupamiento.map((fila) => {
            let referenciaMod = this.state.listaParametro.filter(
                (filaParametro) =>
                    filaParametro.aparIderegistro ==
                    Util.obtenerId(fila.agrupamiento)
            )

            referenciaMod =
                referenciaMod.length > 0
                    ? referenciaMod[0].aparReferenciamodelo
                    : ''

            return {
                idParametro:
                    typeof fila.agrupamiento == 'number'
                        ? fila.agrupamiento
                        : Util.obtenerId(fila.agrupamiento),
                secuencia: fila.orden,
                referenciaMod,
                valor: fila.valor,
            }
        })
        //conversion al formato de listado de  ordenamiento
        const listaOrdenamiento = this.state.listaOrdenamiento.map((fila) => {
            let referenciaMod = this.state.listaParametro.filter(
                (filaParametro) =>
                    filaParametro.aparIderegistro ==
                    Util.obtenerId(fila.ordenamiento)
            )

            referenciaMod =
                referenciaMod.length > 0
                    ? referenciaMod[0].aparReferenciamodelo
                    : ''

            return {
                idParametro:
                    typeof fila.ordenamiento == 'number'
                        ? fila.ordenamiento
                        : Util.obtenerId(fila.ordenamiento),
                secuencia: fila.posicion,
                referenciaMod,
            }
        })

        const datoGuardar = {
            cagDescripcion: this.state.descripcion,
            uniProceso: { uniProceso: Util.obtenerId(this.state.proceso) },
            afnIderegistro: {
                afnIderegistro: Util.obtenerId(this.state.funcion),
            },
            ideregistro: { creIderegistro: Util.obtenerId(this.state.regla) },
            pordIderegistro: {
                pordParametros: listaOrdenamiento,
            },
            pagrIderegistro: {
                pagrParametros: listaAgrupamiento,
                pagrCantidadminima: this.state.listaAgrupamiento[0].minima,
                pagrCantidadmaxima: this.state.listaAgrupamiento[0].maxima,
            },
            cagEstado: this.state.estado ? 'A' : 'I',
            cagPrioridad: this.state.prioridad,
            cagVigencia: this.state.vigencia,
        }

        this.state.cagIderegistro !== ''
            ? (datoGuardar.cagIderegistro = this.state.cagIderegistro)
            : null
        this.state.pagrIderegistro !== ''
            ? (datoGuardar.pagrIderegistro.pagrIderegistro = this.state.pagrIderegistro)
            : null
        this.state.pordIderegistro !== ''
            ? (datoGuardar.pordIderegistro.pordIderegistro = this.state.pordIderegistro)
            : null

        this.peticion.post({
            url:
                this.state.cagIderegistro !== ''
                    ? URL.CONFIGURACION_AGENDAMIENTO
                          .ACTUALIZAR_CONFIGURACION_AGENDAMIENTO
                    : URL.CONFIGURACION_AGENDAMIENTO.REGISTRAR_CONFIGURACION,
            parametros: datoGuardar,
        })
        //limpiar formulario
        this.setState({
            cagIderegistro: '',
            proceso: '-1',
            regla: '-1',
            funcion: '-1',
            descripcion: '',
            prioridad: '',
            estado: false,
            listaAgrupamiento: [],
            listaOrdenamiento: [],
            vigencia: '',
            limpieza: true,
        })
    }

    /**
     * Cierra el modal de la consulta
     * @method
     */

    cerrarModal = () => {}

    /**
     * Restablece los valores a las condiciones iniciales
     * @method
     */

    nuevo = () => {
        //limpiar formulario
        this.setState({
            cagIderegistro: '',
            proceso: '-1',
            regla: '-1',
            funcion: '-1',
            descripcion: '',
            prioridad: '',
            estado: false,
            listaAgrupamiento: [],
            listaOrdenamiento: [],
            vigencia: '',
            limpieza: true,
        })
    }

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    //Arreglo para emplearlo en el componente botonera, con sus respectivas funciones

    funciones = [
        { texto: 'guardar', callback: this.guardar },
        { texto: 'consultar', callback: this.handleConsulta },
        { texto: 'nuevo', callback: this.nuevo },
    ]

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
                <ConsultaAgendamiento
                    opcionesProceso={this.state.procesoJson}
                    opcionesRegla={this.state.reglaJson}
                    opcionesFuncion={this.state.funcionJson}
                    mostrar={this.state.consultaModal}
                    cerrarModal={this.handleConsulta}
                />

                <h1>Empresa - Configuración agendamiento</h1>

                <Botonera funciones={this.funciones} />

                <div className="caja contenedor">
                    <label className="tag">reglas relacionadas</label>

                    <div className="formulario">
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="proceso"
                            label="proceso"
                            value={this.state.proceso}
                            opciones={this.state.procesoJson}
                            onChange={this.change}
                        />
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="regla"
                            label="Regla:"
                            value={this.state.regla}
                            opciones={this.state.reglaJson}
                            onChange={this.change}
                        />
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="funcion"
                            label="Función:"
                            value={this.state.funcion}
                            opciones={this.state.funcionJson}
                            onChange={this.change}
                        />

                        <Input
                            id="descripcion"
                            label="descripcion"
                            type="text"
                            value={this.state.descripcion}
                            onChange={this.change}
                        />
                        <div tabIndex="1" onBlur={this.onBlur}>
                            <Input
                                id="prioridad"
                                label="prioridad"
                                max="100"
                                min="0"
                                type="number"
                                value={this.state.prioridad}
                                onChange={this.change}
                            />
                        </div>

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
                    </div>
                </div>

                <div className="caja contenedor">
                    <label className="tag">ordenamiento y agrupamiento </label>

                    <div className="formulario alineado">
                        <Ordenamiento
                            id="ordenamiento"
                            opciones={this.state.parametroJson}
                            value={this.state.listaOrdenamiento}
                            onChange={this.change}
                            limpieza={this.state.limpieza}
                        />
                        <Agrupamiento
                            id="agrupammiento"
                            opciones={this.state.parametroJson}
                            value={this.state.listaAgrupamiento}
                            onChange={this.change}
                            limpieza={this.state.limpieza}
                        />
                    </div>

                    <div className="contenedor fila">
                        <Input
                            id="vigencia"
                            type="number"
                            label="vigencia (horas)"
                            value={this.state.vigencia}
                            onChange={this.change}
                        />
                    </div>
                </div>

                <Captcha />
            </React.Fragment>
        )
    }
}

//export default ConfiguracionAgendamiento
ConfiguracionAgendamiento.propTypes = {}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfiguracionAgendamiento)

export { VistaRedux as RConfiguracionAgendamiento }
