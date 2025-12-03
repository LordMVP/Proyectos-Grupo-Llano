class DetalleCalendarioVista extends Component {


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
                    console.log("lista las actividades " , JSON.stringify(listaActividad));

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
    console.log("entra consultar agendamiento");
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
            console.log(busquedaListaActividad, "test ---");
            console.log("p1" + Util.obtenerId(value));
            console.log("p2" + this.state.listaActividad);
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
            console.log(this);
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

}