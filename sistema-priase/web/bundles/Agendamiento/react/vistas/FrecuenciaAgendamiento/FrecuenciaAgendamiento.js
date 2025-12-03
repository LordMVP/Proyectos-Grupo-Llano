import React, { Component } from 'react'
//Componentes líbrería appfuture-react
import { Botonera, Captcha, Combo, Input, Interruptor } from 'appfuture-react'
import axios from 'axios'

//valores fijos combobox
import * as defaultOptions from './defaultOptions'
/*URL y la clase Petición para el manejo de axios por POST y GET*/

import URL from '../../global/rutas_api'
import Peticion from '../Assets/util/peticion'
//Carga funciones
import { Util } from '../Assets/util/Util'
//Componentes Modal y Autocompletado
import Modal from '../Assets/componentes/Modal'
import Autocompletado from '../Assets/componentes/Autocompletado'

import Horario from './subcomponentes/Horario'
import ConsultaFrecuencia from './subcomponentes/ConsultaFrecuencia'


/**
 *
 *
 * @class FrecuenciaAgendamiento
 * @extends {Component}
 */
class FrecuenciaAgendamiento extends Component {
    //inicialización de variables
   /**
     *Define estados iniciales
     * @memberof FrecuenciaAgendamiento
     */
    state = {
        lista: [],
        listaHorario: [],
        mostrar: false,
        consultaModal: false,
        cacIderegistro: '',

        // defecto
        proceso: '-1',
        agenda: '-1',
        descripcion: '',
        frecuencia: '-1',
        valorFrecuencia: '',
        horaInicio: '-1',
        horaFin: '-1',
        validarCalendario: false,
        horario: [],
    }

    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */

    async componentDidMount() {
        const res = await this.peticion.get({
            url: URL.FRECUENCIA_AGENDAMIENTO.PROCESO,
            config: ['uniProceso', 'prcDescripcion'],
            json: 'procesoJson',
            value: 'proceso',
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
        this.setState({ [id]: value })
        if (id === 'proceso') {
            await this.peticion.post({
                url:
                    URL.FRECUENCIA_AGENDAMIENTO.LISTAR_CONFIGURACION_AGENDAMIENTO,
                parametros: {
                    proceso: Util.obtenerId(value),
                },
                config: ['cagIderegistro', 'cagDescripcion'],
                json: 'agendaJson',
                value: 'agenda',
            })
        }
        if (id === 'validarCalendario') {
            this.setState({ validarCalendario: !this.state.validarCalendario })
        }
    }

    /**
     * Se ejecuta al momento de pulsar sobre el botón Guardar
     * @method
     * @async
     */

    guardar = async () => {
        if (
            this.state.proceso === '-1' ||
            this.state.agenda === '-1' ||
            this.state.descripcion === '' ||
            this.state.frecuencia === '-1' ||
            this.state.valorFrecuencia === '' ||
            this.state.horaInicio === '-1' ||
            this.state.horaFin === '-1' ||
            this.state.horaInicio === this.state.horaFin ||
            this.state.horario.length <= 0
        ) {
            await this.setState({ mensaje: [] })
            this.state.proceso === '-1'
                ? this.state.mensaje.push('Proceso')
                : ''
            this.state.agenda === '-1'
                ? this.state.mensaje.push('Conf Agenda')
                : ''
            this.state.descripcion === ''
                ? this.state.mensaje.push('Descripción')
                : ''
            this.state.frecuencia === '-1'
                ? this.state.mensaje.push('Frecuencia')
                : ''
            this.state.valorFrecuencia === ''
                ? this.state.mensaje.push('Valor Frecuencia')
                : ''
            this.state.horaInicio === '-1'
                ? this.state.mensaje.push('Hora Inicio')
                : ''
            this.state.horaFin === '-1'
                ? this.state.mensaje.push('Hora Fin')
                : ''
            this.state.horario.length <= 0
                ? this.state.mensaje.push('Días hábiles')
                : ''
            this.state.horaInicio === this.state.horaFin
                ? this.state.mensaje.push(
                      'Horario Inicio y Fin deben ser diferentes'
                  )
                : ''

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
     */

    guardarModal = () => {
        let fecha = new Date()
        const mes =
            fecha.getUTCMonth() + 1 > 9
                ? fecha.getUTCMonth() + 1
                : '0' + (fecha.getUTCMonth() + 1)
        const dia =
            fecha.getDate() > 9 ? fecha.getDate() : '0' + fecha.getDate()
        fecha = `${fecha.getUTCFullYear()}-${mes}-${dia}`

        let dataGuardar = {
            uniProceso: {
                uniProceso: Util.obtenerId(this.state.proceso),
            },
            cagIdregistro: {
                cagIderegistro: Util.obtenerId(this.state.agenda),
            },
            cacFrecuencia: this.state.frecuencia,
            cacValfrecuencia: this.state.valorFrecuencia,
            cacValcahabil: this.state.validarCalendario ? 'A' : 'I',
            cacHorhabilinicio: `${fecha}T${this.state.horaInicio}`,
            cacHorahablfin: `${fecha}T${this.state.horaFin}`,
            cacLunes: this.state.horario.lunes ? '1' : '0',
            cacMartes: this.state.horario.martes ? '1' : '0',
            cacMiercoles: this.state.horario.miercoles ? '1' : '0',
            cacJueves: this.state.horario.jueves ? '1' : '0',
            cacViernes: this.state.horario.viernes ? '1' : '0',
            cacSabado: this.state.horario.sabado ? '1' : '0',
            cacDomingo: this.state.horario.domingo ? '1' : '0',
            cacDescripcion: this.state.descripcion,
        }
        this.state.cacIderegistro !== ''
            ? (dataGuardar.cacIderegistro = this.state.cacIderegistro)
            : null
        this.peticion.post({
            url:
                this.state.cacIderegistro !== ''
                    ? URL.FRECUENCIA_AGENDAMIENTO
                          .ACTUALIZAR_FRECUENCIA_AGENDAMIENTO
                    : URL.FRECUENCIA_AGENDAMIENTO
                          .REGISTRAR_FRECUENCIA_AGENDAMIENTO,
            parametros: dataGuardar,
        })

        //reiniciar estados
        this.setState({
            cacIderegistro: '',
            proceso: '-1',
            agenda: '-1',
            descripcion: '',
            frecuencia: '-1',
            valorFrecuencia: '',
            horaInicio: '-1',
            horaFin: '-1',
            validarCalendario: false,
            horario: [],
            listaHorario: {
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false,
            },
        })
    }


    /**
     * Despliega el modal para realizar la consulta
     * @method
     */

    consultar = () => {
        this.setState({
            consultaModal: !this.state.consultaModal,
        })
    }

    /**
     *
     *Consulta filtrando información, previa selección de varios campos para listarlos en una tabla
     *@method
     *@param {Array} lista -
     */
    handleConsulta = (lista = '') => {
        this.setState({ consultaModal: !this.state.consultaModal })

        if (lista.hasOwnProperty('id')) {
            axios
                .post(
                    URL.FRECUENCIA_AGENDAMIENTO
                        .CONSULTA_FRECUENCIA_AGENDAMIENTO_ID,
                    {
                        id: lista.id,
                    }
                )
                .then((json) => {
                    return json.data
                })
                .then((data) => {
                    let horaInicio = data.cacHorhabilinicio.substring(
                        data.cacHorhabilinicio.indexOf('T') + 1,
                        data.cacHorhabilinicio.length
                    )
                    let horaFin = data.cacHorahablfin.substring(
                        data.cacHorahablfin.indexOf('T') + 1,
                        data.cacHorahablfin.length
                    )

                    this.setState({
                        cacIderegistro: lista.id,
                        horaInicio,
                        horaFin,
                        descripcion: data.cacDescripcion,
                        valorFrecuencia: data.cacValfrecuencia,
                        validarCalendario:
                            data.cacValcahabil == 'A' ? true : false,
                    })
                    let proceso = this.state.procesoJson.filter(
                        (fila) =>
                            Util.obtenerId(fila.texto) ==
                            data.uniProceso.uniProceso
                    )
                    proceso = Util.limpiarDato(proceso)
                    let frecuencia = defaultOptions.opcionesfrecuencia.filter(
                        (fila) => fila.texto == data.cacFrecuencia
                    )
                    frecuencia = Util.limpiarDato(frecuencia)
                    this.setState(
                        {
                            proceso,
                            frecuencia,
                        },
                        () => {
                            this.change({
                                target: { id: 'proceso', value: proceso },
                            }).then((e) => {
                                let agendaId = this.state.agendaJson.filter(
                                    (fila) =>
                                        Util.obtenerId(fila.texto) ==
                                        data.cagIdregistro.cagIderegistro
                                )
                                agendaId = Util.limpiarDato(agendaId)
                                this.setState({
                                    agenda: agendaId,
                                })
                            })
                        }
                    )

                    let listaHorario = {
                        lunes: data.cacLunes == '1' ? true : false,
                        martes: data.cacMartes == '1' ? true : false,
                        miercoles: data.cacMiercoles == '1' ? true : false,
                        jueves: data.cacJueves == '1' ? true : false,
                        viernes: data.cacViernes == '1' ? true : false,
                        sabado: data.cacSabado == '1' ? true : false,
                        domingo: data.cacDomingo == '1' ? true : false,
                    }
                    this.setState({
                        listaHorario,
                        horario: listaHorario,
                    })
                })
        }
    }

    /**
     * Restablece los valores a las condiciones iniciales
     * @method
     */

    nuevo = () => {
        this.setState({
            proceso: '-1',
            agenda: '-1',
            descripcion: '',
            frecuencia: '-1',
            valorFrecuencia: '',
            horaInicio: '-1',
            horaFin: '-1',
            validarCalendario: false,
            horario: [],
            listaHorario: {
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false,
            },
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
        return (
            <React.Fragment>
                <h1>Empresa - Configuración Frecuencia Agendamiento</h1>

                <Botonera funciones={this.funciones} />
                <ConsultaFrecuencia
                    opcionesAgenda={this.state.agendaJson}
                    opcionesProceso={this.state.procesoJson}
                    opcionesFrecuencia={defaultOptions.opcionesfrecuencia}
                    mostrar={this.state.consultaModal}
                    cerrarModal={this.handleConsulta}
                />
                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />

                <div class="caja contenedor">
                    <label class="tag">agendamiento</label>

                    <div class="formulario">
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="proceso"
                            label="proceso"
                            opciones={this.state.procesoJson}
                            value={this.state.proceso}
                            onChange={this.change}
                        />
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="agenda"
                            label="Conf Agenda"
                            opciones={this.state.agendaJson}
                            value={this.state.agenda}
                            onChange={this.change}
                        />

                        <Input
                            id="descripcion"
                            label="Descripción"
                            value={this.state.descripcion}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="frecuencia"
                            label="frecuencia"
                            opciones={defaultOptions.opcionesfrecuencia}
                            value={this.state.frecuencia}
                            onChange={this.change}
                        />

                        <Input
                            id="valorFrecuencia"
                            type="number"
                            label="valor Frecuencia"
                            value={this.state.valorFrecuencia}
                            onChange={this.change}
                        />

                        <Input
                            id="horaInicio"
                            label="Hora inicio"
                            type="time"
                            value={this.state.horaInicio}
                            onChange={this.change}
                        />

                        <Input
                            id="horaFin"
                            label="fin"
                            type="time"
                            value={this.state.horaFin}
                            onChange={this.change}
                        />

                        <Interruptor
                            id="validarCalendario"
                            label="válida calendario hábil"
                            value={this.state.validarCalendario}
                            onChange={this.change}
                        />
                    </div>

                    <Horario
                        value={this.state.listaHorario}
                        onChange={this.change}
                    />
                </div>

                <Captcha />
            </React.Fragment>
        )
    }
}

export { FrecuenciaAgendamiento as RFrecuenciaAgendamiento }
