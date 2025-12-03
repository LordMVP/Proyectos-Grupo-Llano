import React, { Component,Fragment } from 'react'
import { Botonera, Captcha, Combo, Input, Tabla } from 'appfuture-react'
import connect from 'react-redux/es/connect/connect'
import { bindActionCreators } from 'redux'
import axios from 'axios'
//Rutas entre la vista Solicitud Agendamiento y Symfony-SolicitudAgendamientoController
import URL from '../../global/rutas_api'
//LLamado de la petición por POST o GET empleando AXIOS
import Peticion from '../Assets/util/peticion'
//Carga funciones
import { Util } from '../Assets/util/Util'
//Usar componente modal
import Modal from '../Assets/componentes/Modal'
import Calendario from './Calendario'
import AgendarDemanda from './subcomponentes/AgendarDemanda'

const tipoSolicitante = [{ text: 'Propietario', value: 'Propietario' }, { text: 'Arrendatario', value: 'Arrendatario' }, { text: 'Otro', value: 'Otro' }];
const jornada =[{ text: 'Mañana', value: 'mañana' }, { text: 'Tarde', value: 'tarde' }]
const reprogramacion =[{ text: 'Usuario', value: 'usuario' }, { text: 'OIA', value: 'oia' },{text: 'Proceso', value: 'proceso' }]

/**
 *
 *
 * @class SolicitudAgendamiento
 * @extends {Component}
 */
class SolicitudAgendamiento extends Component {
    /**
     *Define estados iniciales
     * @memberof SolicitudAgendamiento
     */
    state = {
        timer: false,
        actividadJson: [],
        actividad: '-1',
        listaDisponibilidad: [],
        listaAgendamiento:[],        
        referencia: '',       
        dataUsuario:'',
        diaAgendar:'',
        idcalendario:'',
        consultaModal: false,
        mensaje:'',
        disponibilidad:'',
        tipoSolicitante:tipoSolicitante,
        reprogramacion:reprogramacion,
        jornadaJson:jornada,
        jornadaid:'-1',
        reprogramar:false,
        tipoAtencionJson:[],
        error:false
    }

    peticion = new Peticion(this)
    
    //Consulta cuando se recarga la  pagina
    async componentDidMount() {  
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
        });
    }


    /**
     *Detecta el cambio de estado, al digitar en el campo de texto
     *@method
     *@param {Object} e - Adjudicado a un campo de texto
     */
    onBlur = (e) => {
        var currentTarget = e.currentTarget
        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {  
                this.setState({actividad:'-1'})      
                this.peticion
                    .post({
                        url: URL.SOLICITUD_AGENDAMIENTO.LISTAR_ACTIVIDADES,
                        parametros: { idSuscripcion: this.state.referencia },
                        config: ['idactividad', 'descripcionactividad'],
                        json: 'actividadJson',
                        value: 'actividad',
                    })
                    .then((data) => {
                        this.setState({ listaActividad: data });
                        this.consultarAgendamiento(); 
                        this.setState({listaDisponibilidad:[]})
                    })   
                    
                    //Consultar datos del suscriptor
                    axios.post(URL.SOLICITUD_AGENDAMIENTO.DATOS_SUSCRIPTOR, 
                        {idSuscripcion: this.state.referencia})
                    .then(respuesta => {
                        const data = respuesta.data;
                        this.setState({dataUsuario:data})
                        this.setState({
                            direccion:data.clienteCoddir,
                            nombre:data.clienteNomsus,
                            suscriptor:data.clienteCodsus+'   Estado Prisma: '+data.estado+'   Morosidad: '+data.morosidad+' días',
                            telefono:data.clienteCodtel,
                            medidor:data.numeroMedidor,
                            fechas:'Fecha Minima: '+data.fechaMinima.replace('T05:00:00.000+0000','')+' Fecha Maxima: '+data.fechaMaxima.replace('T05:00:00.000+0000','')
                        })     
                    });    
            }
        }, 0)
    }

    /**
     * Consultar el agendamiento por  suscriptor
     */
    consultarAgendamiento = async () =>{    
        await this.peticion
                    .post({
                        url: URL.SOLICITUD_AGENDAMIENTO.LISTAR_AGENDAMIENTO,
                        parametros: { 
                                    suscripcion: this.state.referencia,
                                    empresa:this.state.listaActividad[0].camposreferencia.sigueCodemp
                                    }
                    })
                    .then((data) => {
                        this.setState({listaAgendamiento:data})
                        if(this.state.listaAgendamiento.length > 0){
                            const filtrarLista = this.state.listaAgendamiento;                        
                            let cadena = filtrarLista.map((fila) => {                           
                                return(
                                `Suscriptor: ${Util.obtenerId(fila.suscriptor)} ` +
                                `Fecha Programacion: ${Util.obtenerId(fila.fechaProgramacion)} ` +
                                `Cuadrilla: ${Util.obtenerId(fila.cuadrilla)} ` +
                                `Actividad: ${Util.obtenerId(fila.actividad)} ` +
                                `Usuario: ${Util.obtenerId(fila.usuario)} `                                      
                                )
                            })
                            
                            this.setState({
                                titulo: '¡AGENDAMIENTO! Ya se encuentra agendamiento:',
                                texto: `${cadena}`,
                            })                   
                            this.setState({ mostrar: true,reprogramar:true })

                        }else{this.setState({reprogramar:false})}
                    })  
         
    }

    /**
     *Asigna la fila seleccionada para procesarla más adelante
     *@method
     *@param {int} index - número de la fila
     */
    asignar = (index) => {
        this.setState({ listaDisponibilidad: this.state.lista[index] })
    }


    /**
     * Cambia el valor del estado asociado a cada componente
     * @method
     * @async
     * @param {int} id al nombre del estado que se desea modificar
     * @param {(int|string)} value del componente correspondiente al dato
     * que se visualizará en el componente
     */

    change = async ({ target: { id, value,idc } }) => {
        this.setState({ [id]: value })
        const  data = this.state.dataUsuario
        if (id === 'actividad' && value !=='-1') {
            if(data.estado ==='E'){
                this.setState({
                    titulo: '¡NO AGENDAR!',
                    texto: `El estado del usuario no permite Agendar`,
                })             
                this.setState({ mostrar: true })
            }
            else{                
                let busquedaListaActividad = this.state.listaActividad.filter(
                    (fila) => fila.idprocesoactividad == Util.obtenerId(value)
                )
                busquedaListaActividad = busquedaListaActividad[0]           
                let data = this.state.dataUsuario
            
                await axios.post(                   
                    URL.SOLICITUD_AGENDAMIENTO.LISTAR_FECHAS,
                    {
                        suscripcion: busquedaListaActividad.idsuscripcion, 
                        idActividad: Util.obtenerId(value),
                        idMunicipio: data.municipio,
                        idSector:data.sector,
                        idProceso: busquedaListaActividad.idproceso    
                    },
                )
                .then(respuesta => {
                    const data = respuesta.data;                    
                    const disponibilidad = data[0].chaFecha
                    this.setState({idcalendario:data[0].chaIdregistro})
                    
                    if (data!=='') {                        
                            this.setState({ listaCalendario: respuesta.data })
                    } else {     
                        this.setState({ listaCalendario: [] })                   
                        this.setState({
                            titulo: '¡SIN DISPONIBILIDAD!',
                            texto: `Por el momento no hay Fechas disponibilidad`,
                        })             
                        this.setState({ mostrar: true })
                    }
                })
            }    
        }else if (id === 'fecha' && value !=='-1') {
            const fecha = value
            let dia = fecha[0]+'-'+(fecha[1]+1)+'-'+fecha[2]
            

            //Validar si el dia se  puede  consultar.
            const dias = this.state.calendario;
            const isDia = dias.some(function(val, i) {
                if (JSON.stringify(val) === JSON.stringify(value)) {
                  return true; // break
                }
            });

            if(isDia){            
                //Preparar informacion para  consultar            
                let listaActividad = this.state.listaActividad.filter(
                    (fila) => fila.idprocesoactividad == Util.obtenerId(this.state.actividad)
                )
                listaActividad = listaActividad[0]     
                const datos = {
                    actividad: listaActividad.duracion,
                    calendario:this.state.idcalendario===undefined?'-1':this.state.idcalendario,
                    fecha:dia,
                    proceso:listaActividad.idproceso,
                    jornada:this.state.jornadaid === '-1'? null:this.state.jornadaid,
                    suscriptor:listaActividad.idsuscripcion
                }

                //Consultar disponibilidad de 1 dia.
                await axios.post(URL.SOLICITUD_AGENDAMIENTO.CONSULTAR_DISPONIBILIDAD_DEMANDA,datos)
                .then(respuesta => {                
                    if(respuesta.data.length>0){
                        this.setState({listaDisponibilidad:respuesta.data,diaAgendar:fecha[0]+'/'+(fecha[1]+1)+'/'+fecha[2]})
                        //this.setState({diaAgendar:fecha[0]+'/'+(fecha[1]+1)+'/'+fecha[2]})
                    }else{
                        this.setState({listaDisponibilidad:[]})
                        this.setState({
                            titulo: '¡SIN DISPONIBILIDAD!',
                            texto: `No se encontraron URE Disponibles`,
                        })             
                        this.setState({ mostrar: true })
                    }                              
                })
            }
        }
        else if(id === 'jornada' && value !=='-1'){
            this.setState({jornadaid:value})
        }else if(id==='calendario' && idc !== undefined){
            this.setState({idcalendario:idc})
            this.setState({listaDisponibilidad:[]})             
        }
    }

    
    /**
     * Despliega el modal para realizar la consulta
     * @method
     */

    handleConsulta = (data) =>{
        this.setState({ consultaModal: !this.state.consultaModal })

        if(data != undefined){
            this.guardar(data)
        }        
    }
    /**
     * Se ejecuta al momento de pulsar sobre el botón Guardar
     * @method
     * @async
     */

    guardar = async (data) => {
      
        let busquedaListaActividad = this.state.listaActividad.filter(
            (fila) =>
                fila.idprocesoactividad ==
                Util.obtenerId(this.state.actividad)
        )

        const {
            suscripcion,
            idsuscripcion,
            idproceso,
            descripcionactividad,
            idactividad,
            idprocesoactividad,
            camposreferencia,
            tablareferencia,
            duracion,
        } = busquedaListaActividad[0]
        
        const {
            unidadresponsable,
            fechadisponbie,
            horadisponible,
            jornada,
        } = this.state.disponibilidad

        let campos = {
            sigue_ide: camposreferencia.sigueIde,
            sigue_codemp: camposreferencia.sigueCodemp,
        }

        const tercero ={            
            documento:data.cedulatercero,
            nombre:data.nombretercero,
            telefono:data.numerotercero,
            correo:data.correotercero
        }

        const datoFinal = {
                proceso: Util.obtenerId(idproceso),
                suscripcion: suscripcion,
                idSuscripcion: idsuscripcion,
                unidadResponsable: unidadresponsable,
                fechaProgramacion: fechadisponbie,
                horaProgramacion: horadisponible,
                jornadaProgramacion:this.state.jornadaid,
                idActividad: camposreferencia.sigueIde,
                empresa: camposreferencia.sigueEmpSeven,
                empresaCodemp:camposreferencia.sigueCodemp,
                duracion: duracion,
                idProcesoActividad: idprocesoactividad,
                tipoAgendamiento: 'D',
                email: data.correo,
                direccion: this.state.dataUsuario.clienteCoddir,
                telefonoUno:data.numero,
                nombre: data.nombre,
                observaciones: data.observacion,
                documento:data.cedula,
                tipoSolicitante:data.solicitante,
                telefonoDos:data.numero2,
                tipoReprogramacion:data.reprogramacion,
                observacionRp:data.observacionrp,
                tipoAtencion:data.tipoAtencion,
                municipio:'',
                datosTercero:tercero
        }


        await axios.post(URL.SOLICITUD_AGENDAMIENTO.EDITAR_ACTIVIDAD,datoFinal).then((res) => {
            if(res.data.codigo>=1){
                this.setState({
                    actividad: '-1',
                    listaDisponibilidad: [],
                    listaActividad: [],
                    listaAgendamiento:[],
                    lista: [],
                    actividadJson:[],
                    referencia: '',
                    disponibilidad:'',
                    dataUsuario:'',
                    diaAgendar:'',
                    idcalendario:'',            
                    mensaje:'',
                    disponibilidad:'',
                    direccion:'',
                    nombre:'',
                    suscriptor:'',
                    telefono:'',
                    medidor:'',
                    fechas:'',
                    jornadaid:'-1',
                    reprogramar:false,
                    error:false
                })
            }else{
                this.setState({error:true})
            }
        })

    }

    agendar =(evento) =>{
        const control = evento.target;        
        const horadisponible = control.attributes['data-index'].value;
        const unidadresponsable = control.attributes['data-ure'].value;
        const nombre = control.attributes['data-name'].value;
        const jornada = control.attributes['data-jornada'].value;
        const fechadisponbie = this.state.fecha[0]+'-'+(this.state.fecha[1]+1)+'-'+this.state.fecha[2]

        this.setState({disponibilidad:{ unidadresponsable,
            fechadisponbie,
            horadisponible,
            jornada}})
        this.setState({mensaje:"Fecha: "+this.state.diaAgendar+" "+horadisponible+"	¦  Responsable: "+unidadresponsable+" - "+nombre})
        this.handleConsulta()
    }

    /**
     * Restablece los valores a las condiciones iniciales
     * @method
     */

    nuevo = () => {
        this.setState({
            actividad: '-1',
            actividadJson:[],
            listaDisponibilidad: [],
            listaActividad: [],
            listaAgendamiento:[],
            referencia: '',
            observacion: '',
            correo: '',
            numero: '',
            nombre: '',
            cedula:'',
            solicitante:'-1',
            numero2: '',
            reprogramar:false,
            error:false
        })
    }

    //Arreglo para emplearlo en el componente botonera, con sus respectivas funciones

    funciones = [
        { texto: 'guardar', callback: this.guardar },
        { texto: 'nuevo', callback: this.nuevo },
    ]

    renderTablaDisponibilidad=()=>{
        const lista = this.state.listaDisponibilidad;
        if (lista.length ===0) {
            return null;
        }

        return (
            <div className='table-responsive'>
              <table className='table table-hover table-condensed table-striped table-bordered'>
                <thead className='bg-dark text-white'>
                  <tr>
                    <th>Codigo</th>
                    <th>Cuadrilla</th>      
                    <th>Fecha {this.state.diaAgendar}</th>                                                  
                  </tr>
                </thead>
                <tbody>
                  {
                    lista.map((elemento, index) => {           
                        let listaHoras = elemento.disponibilidad         
                      return (
                        <Fragment>
                          <tr key={elemento.unidadresponsable}>
                            <td>{elemento.unidadresponsable}</td>
                            <td>{elemento.unidadresponsablenom}</td>                            
                            {
                              listaHoras.map((hora, index) => {                              
                                return <td key={index}><button className='btn btn-primary btn-xs' onClick={this.agendar} data-index={hora.horadisponible}  data-ure={elemento.unidadresponsable} data-name={elemento.unidadresponsablenom} data-jornada={hora.jornada}>{hora.horadisponible}</button></td>;                                
                              })
                            }                           
                          </tr>                      
                        </Fragment>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
        );
    }
        

    /**
     *Renderiza la vista 
     * @return {JSX} componente - returna vista jsx 
     */
    render() {
        return (
            <React.Fragment>
                <AgendarDemanda
                    mensaje={this.state.mensaje}
                    opcionesSolicitante={this.state.tipoSolicitante}        
                    reprogramacion={this.state.reprogramacion}    
                    reprogramar={this.state.reprogramar}    
                    mostrar={this.state.consultaModal}
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

                <h1>Empresa - Solicitud agendamiento por demanda</h1>        

                <div className="contenedor caja formulario">
                    <label className="tag">Información Ruta</label>
                    <div tabIndex="1" onBlur={this.onBlur}>
                        <Input
                            id="referencia"
                            label="Referencia Cliente:"
                            value={this.state.referencia}
                            onChange={this.change}
                        />
                    </div>
                    <Combo
                        propTexto="texto"
                        propValor="id"
                        id="actividad"
                        label="Actividades:"
                        value={this.state.actividad}
                        opciones={this.state.actividadJson}
                        onChange={this.change}
                    />                    
                </div>

                <div className="contenedor caja formulario">
                    <label className="tag">Datos Suscriptor</label>                        
                        <Input
                            id="suscriptor"
                            label="suscriptor"
                            value={this.state.suscriptor}
                            extra={{ disabled: true }}
                        />

                        <Input
                            id="nombre"
                            label="nombre"
                            value={this.state.nombre}
                            extra={{ disabled: true }}
                        />

                        <Input
                            id="direccion"
                            label="direccion"
                            value={this.state.direccion}
                            extra={{ disabled: true }}
                        />

                        <Input
                            id="telefono"
                            label="Telefono"
                            value={this.state.telefono}
                            extra={{ disabled: true }}
                        />    
                        <Input
                            id="medidor"
                            label="medidor"
                            value={this.state.medidor}
                            extra={{ disabled: true }}
                        />

                        <Input
                            id="fechas"
                            label="fechas rp"
                            value={this.state.fechas}
                            extra={{ disabled: true }}
                        />                                          
                </div> 

                <div className="contenedor caja formulario">
                    <label className="tag">Información disponibilidad</label>           
                    <div className="formulario alineado">
                        <div className="columna">
                            <Calendario
                                lista={this.state.listaCalendario}
                                value={this.state.calendario}
                                onChange={this.change}
                                limpieza={this.state.limpieza}                                
                                consultarCalendario={this.state.consultarCalendario}
                            />
                        </div>
                        <Combo
                            propTexto="text"
                            propValor="value"   
                            id="jornada"
                            label="Jornada:"
                            value={this.state.jornadaid}
                            opciones={this.state.jornadaJson}
                            onChange={this.change}
                        />                           
                    </div>
                </div>
                <div className='row mt-5'>
                    <div className='col-12'>
                    {this.renderTablaDisponibilidad()}
                    </div>
                </div>

                {/* <Captcha /> */}
            </React.Fragment>
        )
    }
}

SolicitudAgendamiento.propTypes = {}

const mapStateToProps =
    //inicialización de variables

    (state) => {
        return {}
    }

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
}

const VistaRedux = connect(
    mapStateToProps,
    mapDispatchToProps
)(SolicitudAgendamiento)

export { VistaRedux as RSolicitudAgendamiento }
