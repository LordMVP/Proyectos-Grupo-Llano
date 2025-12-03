import React, { Component } from 'react'
import { Captcha, Botonera } from 'appfuture-react'
import axios from 'axios'
// componentes
import Informacion from './subcomponentes/Informacion'
import Flujo from './subcomponentes/Flujo'
import ConsultaParametros from './subcomponentes/ConsultaParametros'

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
 * @class EdicionParametros
 * @extends {Component}
 */
class EdicionParametros extends Component {
    //inicialización de variables

    /**
     *Define estados iniciales
     * @memberof EdicionParametros
     */
 
    state = {
        limpieza: false,
        consultaModal: false,
    }

    peticion = new Peticion(this)

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
     *Obtener información de los parámetros, previo filtrado
     *@method
     *@param {int} idParametro - consultar parámetros
     */
    consultar = (idParametro = '') => {
        if (idParametro.hasOwnProperty('aparIderegistro')) {
            axios
                .post(URL.EDICIONPARAMETROS.CONSULTAR_PARAMETROS, {
                    idParametro: idParametro.aparIderegistro,
                })
                .then((json) => {
                    return json.data
                })
                .then((data) => {
                    this.nuevo()
                    if (typeof data == 'undefined' || data == null) return false
                    const informacionConsulta = {
                        codigoUnidad: data.aparIderegistro,
                        descripcion: data.aparDescripcion,
                        ambito: data.aparAmbito,
                        ambitoValor: data.aparAmbitovalor,
                        unidadTiempo: data.aparTiempo,
                        tipo: data.aparTipo,
                        tipoValor:
                            typeof data.aparFuncion === 'undefined'
                                ? data.aparValor
                                : data.aparFuncion,
                        desde: data.aparVigenciainicio.substring(
                            0,
                            data.aparVigenciainicio.indexOf('T')
                        ),
                        hasta: data.aparVigenciafin.substring(
                            0,
                            data.aparVigenciafin.indexOf('T')
                        ),
                        origenDatos: data.aparOigendatos,
                        referenciaModelo: data.aparReferenciamodelo,
                        tipoSalida: data.aparTiposalida,
                        requerido: data.aparObligatoriedad,
                    }
                    this.setState({
                        informacionConsulta,
                    })

                    const flujoConsulta = {
                        entradas: data.entradas,
                        salidas: data.salidas,
                    }
                    this.setState({
                        flujoConsulta,
                    })
                })
        }
        this.setState({
            consultaModal: !this.state.consultaModal,
        })
    }

    /**
     * Se ejecuta al momento de pulsar sobre el botón Guardar
     * @method
     * @async
     */

    guardar = async () => {
        console.log(this.state.informacion)
        console.log(this.state.flujo)
        if (
            typeof this.state.informacion === 'undefined' ||
            typeof this.state.flujo === 'undefined'
        ) {
            this.setState({
                titulo: '¡FALTA INFORMACIÓN!',
                texto: `No ha diligenciado la información básica y/o flujo datos.`,
            })
            //Elimina si existe un segundo botón
            this.botones.length === 2 ? this.botones.shift() : null
            //despliega modal
            this.setState({ mostrar: true })
            return false
        } else {
            const {
                descripcion,
                ambito,
                ambitoValor,
                unidadTiempo,
                tipo,
                tipoValor,
                desde,
                hasta,
                origenDatos,
                referenciaModelo,
                tipoSalida,
                requerido,
            } = this.state.informacion || []

            const informacion =
                (descripcion === '-1' ||
                    ambito === '-1' ||
                    ((ambito != 'Genérica' || ambito != '-1') &&
                        ambitoValor === '-1'),
                unidadTiempo === '-1' ||
                    tipo === '-1' ||
                    (tipo === 'Valor' && tipoValor === '') ||
                    ((tipo !== '-1' || tipo !== 'Valor') &&
                        tipoValor === '-1') ||
                    desde === '' ||
                    hasta === '' ||
                    origenDatos === '-1' ||
                    referenciaModelo === '-1' ||
                    tipoSalida === '-1')
            await this.setState({ mensaje: [] })
            if (informacion) {
                descripcion === '-1'
                    ? this.state.mensaje.push('Descripción')
                    : false
                ambito === '-1' ? this.state.mensaje.push('Ámbito') : false
                ;(ambito != 'Genérica' || ambito != '-1') &&
                ambitoValor === '-1'
                    ? this.state.mensaje.push('Ámbito Valor')
                    : false
                unidadTiempo === '-1'
                    ? this.state.mensaje.push('Unidad de Tiempo')
                    : false
                tipo === '-1' ? this.state.mensaje.push('Tipo') : false
                tipo === 'Valor' && tipoValor === ''
                    ? this.state.mensaje.push('Tipo Valor')
                    : false
                tipo !== '-1' && tipo !== 'Valor' && tipoValor === '-1'
                    ? this.state.mensaje.push('Tipo Valor')
                    : false
                desde === '' ? this.state.mensaje.push('Fecha Desde') : false
                hasta === '' ? this.state.mensaje.push('Fecha Hasta') : false
                origenDatos === '-1'
                    ? this.state.mensaje.push('Origen Datos')
                    : false
                referenciaModelo === '-1'
                    ? this.state.mensaje.push('Referencia Modelo')
                    : false
                tipoSalida === '-1'
                    ? this.state.mensaje.push('Tipo Salida')
                    : false
            }
            const { entradas, salidas } = this.state.flujo
            const flujo = entradas.length <= 0 || salidas.length <= 0
            await this.setState({ mensajeLista: [] })
            if (flujo) {
                entradas.length <= 0
                    ? this.state.mensajeLista.push('Lista Entradas')
                    : ''
                salidas.length <= 0
                    ? this.state.mensajeLista.push('Lista Salidas')
                    : ''
            }
            if (informacion || flujo) {
                //Modal
                const textoInformacion = informacion
                    ? `\nFalta escoger en información básica:\n ${this.state.mensaje.join(
                          ', '
                      )}`
                    : ''
                const textoFlujo = flujo
                    ? `\nFalta escoger en flujo:\n ${this.state.mensajeLista.join(
                          ', '
                      )}`
                    : ''
                this.setState({
                    titulo: '¡FALTA INFORMACIÓN!',
                    texto: `${textoInformacion}\n
                            ${textoFlujo}`,
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

            const datoGuardar = {
                aparDescripcion: descripcion,
                aparTipo: tipo,
                aparFuncion:
                    tipo !== 'Valor' ? Util.obtenerId(tipoValor) : null,
                aparAmbito: ambito,
                aparAmbitovalor:
                    ambito === 'Genérica' ? '' : Util.obtenerId(ambitoValor),
                aparTiempo: unidadTiempo,
                aparValor: tipo === 'Valor' ? tipoValor : '',
                aparVigenciainicio: desde,
                aparVigenciafin: hasta,
                aparObligatoriedad: requerido ? 'S' : 'N',
                aparOigendatos:
                    origenDatos === 'Parámetros'
                        ? 'P'
                        : origenDatos === 'Reglas'
                        ? 'R'
                        : 'PR',
                aparTiposalida:
                    tipoSalida === 'Valor Único'
                        ? 'U'
                        : tipoSalida === 'Valor Múltiple'
                        ? 'M'
                        : tipoSalida === 'No aplica'
                        ? 'NA'
                        : '',
                aparReferenciamodelo: Util.obtenerId(referenciaModelo),
                entradas: this.state.flujo.entradas,
                salidas: this.state.flujo.salidas,
            }
        }
    }

    /**
     * Se ejecuta al momento de pulsar en  'aceptar' del modal, desplegado en la función 'guardar'.
     * Y solo ocurre al validar los campos necesarios para registrar o actualizar la información
     * @method
     */

    guardarModal = () => {
        const {
            codigoUnidad,
            descripcion,
            ambito,
            ambitoValor,
            unidadTiempo,
            tipo,
            tipoValor,
            desde,
            hasta,
            origenDatos,
            referenciaModelo,
            tipoSalida,
            requerido,
        } = this.state.informacion

        const datoGuardar = {
            aparDescripcion: descripcion,
            aparTipo: tipo,
            aparFuncion: tipo !== 'Valor' ? Util.obtenerId(tipoValor) : null,
            aparAmbito: ambito,
            aparAmbitovalor:
                ambito === 'Genérica' ? '' : Util.obtenerId(ambitoValor),
            aparTiempo: unidadTiempo,
            aparValor: tipo === 'Valor' ? tipoValor : '',
            aparVigenciainicio: desde,
            aparVigenciafin: hasta,
            aparObligatoriedad: requerido ? 'S' : 'N',
            aparOigendatos:
                origenDatos === 'Parámetros'
                    ? 'P'
                    : origenDatos === 'Reglas'
                    ? 'R'
                    : 'PR',
            aparTiposalida:
                tipoSalida === 'Valor Único'
                    ? 'U'
                    : tipoSalida === 'Valor Múltiple'
                    ? 'M'
                    : tipoSalida === 'No aplica'
                    ? 'NA'
                    : '',
            aparReferenciamodelo: Util.obtenerId(referenciaModelo),
            entradas: this.state.flujo.entradas,
            salidas: this.state.flujo.salidas,
        }

        codigoUnidad !== ''
            ? (datoGuardar.aparIderegistro = codigoUnidad)
            : null,
            this.peticion.post({
                url:
                    codigoUnidad !== ''
                        ? URL.EDICIONPARAMETROS.ACTUALIZAR_PARAMETRO
                        : URL.EDICIONPARAMETROS.REGISTRAR_PARAMETRO,
                parametros: datoGuardar,
            })

        this.nuevo()
    }

    /**
     * Restablece los valores a las condiciones iniciales
     * @method
     */

    nuevo = () => {
        this.setState({
            limpieza: true,
            informacion:undefined,
            flujo:undefined
        })
    }

    //Arreglo para emplearlo en el componente botonera, con sus respectivas funciones

    funciones = [
        { texto: 'guardar', callback: this.guardar },
        { texto: 'consultar', callback: this.consultar },
        { texto: 'nuevo', callback: this.nuevo },
    ]

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
        const valor = this.state

        // eventos

        const onChange = (e) => this.setState({ [e.target.id]: e.target.value })

        return (
            <React.Fragment>
                <ConsultaParametros
                    mostrar={this.state.consultaModal}
                    cerrarModal={this.consultar}
                />
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />
                <h1>Empresa - Edición de Parámetros</h1>

                <Botonera funciones={this.funciones} />

                <div className="contenedor"></div>

                <div className="formulario">
                    <Informacion
                        value={this.state.informacionConsulta}
                        onChange={onChange}
                        limpieza={this.state.limpieza}
                    />
                    <Flujo
                        value={this.state.flujoConsulta}
                        onChange={onChange}
                        limpieza={this.state.limpieza}
                    />
                </div>

                <Captcha />
            </React.Fragment>
        )
    }
}

export { EdicionParametros as REdicionParametros }
