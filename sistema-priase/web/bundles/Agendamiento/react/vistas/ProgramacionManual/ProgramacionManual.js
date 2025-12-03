import React, { Component } from 'react'
import { Captcha, Combo, Input, Tabla, Botonera } from 'appfuture-react'

import Pendientes from './subcomponentes/Pendientes'
import URL from '../../global/rutas_api'
import Peticion from '../Assets/util/peticion'
import axios from 'axios'
import { Util } from '../Assets/util/Util'
import Modal from '../Assets/componentes/Modal'
import AgendarDemanda from '../SolicitudAgendamiento/subcomponentes/AgendarDemanda'

/**
 *
 *
 * @class ProgramacionManual
 * @extends {Component}
 */
 const tipoSolicitante = [{ text: 'Propietario', value: 'Propietario' }, { text: 'Arrendatario', value: 'Arrendatario' }, { text: 'Otro', value: 'Otro' }];
 const reprogramacion =[{ text: 'Usuario', value: 'usuario' }, { text: 'OIA', value: 'oia' },{text: 'Proceso', value: 'proceso' }]
class ProgramacionManual extends Component {
    //inicialización de variables
   /**
     *Define estados iniciales
     * @memberof SolicitudAgendamiento
     */

    state = {
        lista: [],
        listaFinal: [],
        mostrar: false,
        limpiar: false,
        datosAdicionales:false,
        tipoSolicitante:tipoSolicitante,
        reprogramacion:reprogramacion,
        proceso: '-1',
        contratista: '-1',
        contratante: '-1',
        unidadResponsable: '-1',
        programacion: '',
        idCont: { idContratante: '-1', idContratista: '-1' },
        tipoAtencionJson:[],
        tituloModal:'',
        datosFormulario:false,
        datosModal:''
    }

    //Arreglo con los id y nombre de columnas para el componente Tabla
    columnas = [
        {
            Header: 'Programacion manual',

            columns: [
                { Header: 'Agenda', accessor: 'agenda' },
                { Header: 'Servicio', accessor: 'servicio' },
                { Header: 'Observaciones', accessor: 'observacion' },
                { Header: 'Cliente', accessor: 'cliente' },
                { Header: 'Direccion', accessor: 'direccion' },
                { Header: 'Municipio', accessor: 'municipio' },
                { Header: 'Telefono', accessor: 'telefono' },
                { Header: 'Cuadrilla', accessor: 'cuadrilla' },
                { Header: 'Fecha Prog.', accessor: 'fechaProg' },
                {
                    Header: 'Selección',
                    accessor: 'sigueIde',
                    Cell: (props) => (
                        <input
                            type="radio"
                            unchecked
                            name="disponibilidad"
                            onChange={(e) => this.asignar(e, props.index)}
                        />
                    ),
                },
            ],
        },
    ]

    /**
     *Asigna la fila seleccionada para procesarla más adelante
     *@method
     *@param {int} index - número de la fila
     */
    asignar = (e, index) => {
        this.setState({ listaFinal: this.state.lista[index] })
    }
    peticion = new Peticion(this)

    /**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */

    async componentDidMount() {
        await this.peticion.get({
            url: URL.PROGRAMACION_MANUAL.LISTAR_EMPRESAS_CONTRATANTES,
            config: ['empresaSevemp', 'empresaCod', 'empresaNom'],
            json: 'contratanteJson',
            value: 'contratante',
        })

        // await this.peticion.post({
        //         url: URL.PROGRAMACION_MANUAL.LISTAR_CONTRATISTAS,
        //         config: ['empresaCod', 'empresaNom'],
        //         json: 'contratistaJson',
        //         value: 'contratista',
        // })

        await axios.post(URL.SOLICITUD_AGENDAMIENTO.TIPO_ATENCION).then(respuesta => {
            if (respuesta.data.length > 0) {
                this.setState({
                    tipoAtencionJson: respuesta.data
                });
            }else{
                this.setState({
                    tipoAtencionJson: []
                });
            }
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
        switch (id) { 
            case 'contratante':
                this.setState({
                    idCont: {
                        idContratante: value,
                        idContratista: this.state.contratista,
                    },
                })
                if (value === '-1'){
                    this.setState({
                        contratanteJson:[],
                        contratistaJson:[]
                    })
                    return false
                }else{
                    var id_proceso = '0';
                    if (proceso.value  !== '-1') {
                        id_proceso = proceso.value.substring(0,4);
                    }
                    this.peticion
                    .post({
                        url: URL.PROGRAMACION_MANUAL.LISTAR_CONTRATISTAS,
                        parametros: {
                            empresaContratante: Util.obtenerId(value),
                            idproceso: id_proceso,
                        },
                        config: ['empresaCod', 'empresaNom'],
                        json: 'contratistaJson',
                        value: 'contratista',
                    })
                    
                } 
                
                break
            case 'contratista':
                this.setState({
                    idCont: {
                        idContratante: this.state.contratante,
                        idContratista: value,
                    },
                })
                if (value === '-1' || this.state.proceso === '-1') {
                    this.setState({
                        unidadResponsableJson: [],
                        unidadResponsable: '-1'
                    })
                    return false
                }
                this.peticion.post({
                    url: URL.PROGRAMACION_MANUAL.LISTAR_CUADRILLAS,
                    parametros: {
                        idContratista: Util.obtenerId(value, 0),
                        proceso: Util.obtenerId(this.state.proceso)
                    },
                    config: ['ureIderegistro', 'cuadrillaCod', 'cuadrillaNom'],
                    json: 'unidadResponsableJson',
                    value: 'unidadResponsable',
                })
                break

            case 'proceso':

                var id_proceso = '0';
                if (proceso.value  !== '-1') {
                    id_proceso = proceso.value.substring(0,4);
                }
                this.peticion.post({
                    url: URL.PROGRAMACION_MANUAL.LISTAR_CONTRATISTAS,
                    parametros: {
                        empresaContratante: Util.obtenerId(this.state.contratante),
                        proceso: id_proceso,
                    },
                    config: ['empresaCod', 'empresaNom'],
                    json: 'contratistaJson',
                    value: 'contratista',
                })

                break
            case 'lista':
                //restablecer valores
                this.setState({
                    listaFinal: [],
                })
                if (
                    (this.state.unidadResponsable !== '-1' ||
                        this.state.programacion !== '') &&
                    value.length > 0
                ) {
                    const lista = this.state.lista.map((fila) => {
                        ; (fila.cuadrilla =
                            this.state.unidadResponsable !== '-1'
                                ? this.state.unidadResponsable
                                : ''),
                            (fila.fechaProg =
                                this.state.programacion !== ''
                                    ? this.state.programacion
                                    : '')
                        return fila
                    })
                    await this.setState({ lista })
                }
                break
            case 'unidadResponsable':
                if (value !== '-1' && this.state.lista.length > 0) {
                    const lista = this.state.lista.map((fila) => {
                        fila.cuadrilla = value
                        return fila
                    })
                    this.setState({ lista })
                }
                break
            case 'programacion':
                if (value !== '-1' && this.state.lista.length > 0) {
                    const lista = this.state.lista.map((fila) => {
                        fila.fechaProg = value
                        return fila
                    })
                    this.setState({ lista })
                }
                break
        }
    }

    /**
     * Validar el formulario para guardar o registrar datos adicionales
     */
    validarFormulario=async()=>{
        if (
            this.state.listaFinal.length <= 0 ||
            this.state.programacion === '' ||
            this.state.unidadResponsable === '-1'
        ) {
            await this.setState({ mensaje: [] })
            this.state.listaFinal.length <= 0 ? this.state.mensaje.push('Lista programación Manual') : ''
            this.state.programacion === '' ? this.state.mensaje.push('Programación') : ''
            this.state.unidadResponsable === '-1' ? this.state.mensaje.push('Unidad Responsable') : ''

            this.setState({
                titulo: '¡FALTA INFORMACIÓN!',
                texto: `Falta escoger:\n ${this.state.mensaje.join(', ')}`,
            }) 
            this.botones.length === 2 ? this.botones.shift() : null            
            this.setState({ mostrar: true })
        }else{this.setState({ datosFormulario: true })}
    }

    /**
     * Se ejecuta al momento de pulsar sobre el botón Guardar
     * @method
     * @async
     */
    guardar = async() => {        
        await this.validarFormulario();
        if(this.state.datosFormulario==true){
            this.setState({
                titulo: '¡ENVIAR INFORMACIÓN!',
                texto: '¿Confirma Transacción?',
            })
            this.botones.length === 1
                ? this.botones.unshift({
                    texto: 'Aceptar',
                    callback: this.guardarModal,
                    index: 1,
                })
                : null
            this.setState({ mostrar: true })
        }
    }

    /**
     * Se ejecuta al momento de pulsar en  'aceptar' del modal, desplegado en la función 'guardar'.
     * Y solo ocurre al validar los campos necesarios para registrar o actualizar la información
     * @method
     */

    guardarModal = async() => {
        const listaFinal = this.state.listaFinal
        const datos = this.state.datosModal

        const tercero ={            
            documento:datos.cedulatercero,
            nombre:datos.nombretercero,
            telefono:datos.numerotercero,
            correo:datos.correotercero
        }
        const datoGuardar = {
            empresa:Util.obtenerId(this.state.contratante,0),
            empresaCodemp:Util.obtenerId(this.state.contratante,1),
            proceso: Util.obtenerId(listaFinal.proceso),
            suscripcion: listaFinal.suscripcion, 
            idSuscripcion: listaFinal.terIderegistro,
            unidadResponsable: Util.obtenerId(listaFinal.cuadrilla),
            fechaProgramacion: listaFinal.fechaProg,
            horaProgramacion:'',
            jornadaProgramacion:'',
            idActividad: listaFinal.sigueIde,
            duracion: listaFinal.duracion,
            idProcesoActividad: listaFinal.idprocesoactividad,
            tipoAgendamiento: 'M',
            direccion: listaFinal.direccion,
  //          actividad: listaFinal.actividad,
            email: datos != "" ? datos.correo : '',
            telefonoUno:  datos !=  "" ? datos.numero : '',
            nombre:  datos != "" ? datos.nombre : '',
            observaciones:  datos != "" ? datos.observacion : '',
            documento: datos != "" ? datos.cedula : '',
            telefonoDos: datos != "" ? datos.numero2 : '',
            observacionRp: datos != "" ? datos.observacionrp : '',
            tipoReprogramacion: datos != "" ? datos.reprogramacion : '-1',
            tipoSolicitante: datos != "" ? datos.solicitante : '',
            tipoAtencion: datos != "" ? datos.tipoAtencion : '',
            municipio: listaFinal.ciudadCod,
            datosTercero:tercero     
        }

        await axios.post(URL.PROGRAMACION_MANUAL.EDITAR_ACTIVIDADES_AGENDAMIENTO_MANUAL,datoGuardar).then((response) => {
            if(response.data.codigo>=1){
                this.nuevo();
            }
        });
    }

    /**
     * Restablece los valores a las condiciones iniciales
     * @method
     */

    nuevo = () => {
        //reiniciar variables
        this.setState({
            proceso: '-1',
            contratante: '-1',
            contratista: '-1',
            unidadResponsable: '-1',
            programacion: '-1',
            listaFinal: [],
            lista: [],
            mostrar: false,
            idCont: { idContratante: '-1', idContratista: '-1' },
            limpiar: true,
            datosFormulario:false,
            datosModal:''
        })
    }

    /**
     * Cierra el modal de la consulta
     * @method
     */

    cerrarModal = () => {}
    
    handleConsulta = (data) =>{
        this.setState({ datosAdicionales: !this.state.datosAdicionales })

        if(data != undefined){
            this.setState({datosModal:data})
            this.guardar()
        }        
    }

    /**
     * preparar datos para enviar al Modal
     */
    modalDatos =async() =>{        
        await this.validarFormulario();
        if(this.state.datosFormulario==true){           
            const listaFinal = this.state.listaFinal;

            this.setState({tituloModal:"Fecha: "+listaFinal.fechaProg+"	¦  Responsable: "+listaFinal.cuadrilla,reprogramar:this.state.lista[0].reprogramar})
            this.handleConsulta()
        }
    }

    validarURE = async() => {

        const datos = {
            idUnidad : Util.obtenerId(this.state.unidadResponsable) ,
            programacion : this.state.programacion
        }

        if ( this.state.programacion === "" || this.state.unidadResponsable === '-1') {

            await this.setState({ mensaje: [] })

            this.state.programacion = '' ? this.state.mensaje.push('Fecha de programación') : ''
            this.state.unidadResponsable = '-1' ? this.state.mensaje.push('Unidad responsable') : ''

            this.setState({
                titulo: '¡FALTA INFORMACIÓN!',
                texto: `Falta seleccionar :\n  ${this.state.mensaje.join(', ')}`,
            })

            this.setState({ mostrar: true })

        }else{
            await axios.post(URL.PROGRAMACION_MANUAL.VALIDAR_DISPONIBILIDAD_URE,datos).then((response) => {
                if(response.data.codigo>=1){
                    this.nuevo();
                }
            });
        }
        
    }

    //Arreglo para emplearlo en el componente Modal, con sus respectivas funciones

    botones = [{ texto: 'Cerrar', callback: this.cerrarModal, index: 2 }]

    //Arreglo para emplearlo en el componente botonera, con sus respectivas funciones

    funciones = [
        { texto: 'guardar', callback: this.guardar },
        { texto: 'nuevo', callback: this.nuevo },
    ]

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */

    render() {
        return (
            <React.Fragment>
                <AgendarDemanda
                    mensaje={this.state.tituloModal}
                    opcionesSolicitante={this.state.tipoSolicitante}        
                    reprogramacion={this.state.reprogramacion}    
                    reprogramar={this.state.reprogramar}    
                    mostrar={this.state.datosAdicionales}
                    error={this.state.error}
                    opcionesAtencion={this.state.tipoAtencionJson}
                    cerrarModal={this.handleConsulta}/>    

                <Modal
                    titulo={this.state.titulo}
                    texto={this.state.texto}
                    mostrar={this.state.mostrar}
                    ocultarAlerta={this.change}
                    botones={this.botones}
                />

                <h1>Empresa - Programación manual</h1>

                <Botonera funciones={this.funciones} />

                <div className="caja contenedor">
                    <Pendientes
                        contratanteJson={this.state.contratanteJson}
                        value={this.state.pendientes}
                        idCont={this.state.idCont}
                        limpiar={this.state.limpiar}
                        onChange={this.change}
                    />
                </div>
                <div className="caja contenedor">
                    <label className="tag">Programacion</label>

                    <div className="formulario">
                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="contratista"
                            label="contratista"
                            value={this.state.contratista}
                            opciones={this.state.contratistaJson}
                            onChange={this.change}
                        />

                        <Combo
                            propTexto="texto"
                            propValor="id"
                            id="unidadResponsable"
                            label="unidad responsable"
                            value={this.state.unidadResponsable}
                            opciones={this.state.unidadResponsableJson}
                            onChange={this.change}
                        />

                        <Input
                            id="programacion"
                            label="programacion"
                            type="datetime-local"
                            value={this.state.programacion}
                            onChange={this.change}
                        />

                        <div>
                            <button onClick={this.modalDatos}>Datos Adicionales</button>
                            {/* <button style={{'margin-left':'5px'}} onClick={this.validarURE}>Validar disponibilidad</button> */}
                        </div>
                        

                    </div>

                    <div className="contenedor">
                        <Tabla
                            datos={this.state.lista}
                            columnas={this.columnas}
                        />
                    </div>
                </div>

                <Captcha />
            </React.Fragment>
        )
    }
}
export { ProgramacionManual as RProgramacionManual }
