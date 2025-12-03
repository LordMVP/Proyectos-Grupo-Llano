
import React, { Component } from 'react'
import {  Button,Form, Col, Modal, Alert, Tabs,Tab ,Row   } from 'react-bootstrap'
import * as API from '../../../api/aforos/aforosVisitas'
import '../../../assets/aforosVisitas.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import ModalConceptosVisitas from './ModalConceptosVisitas'
import ModalCargarFotos from './ModalCargarFotos'
import ModalSlideFotos from './ModalSlideFotos'
import {Tvisitas} from '../../../../src/models/types/aforos/AforosVisitas'
import { AiFillFilePdf } from "react-icons/ai"
import { RiFolderUploadFill  } from "react-icons/ri"
import { IoMdPhotos  } from "react-icons/io"
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import usuarioApi from '../../../api/homologaciones/UsuariosApi';
import reportesApi from '../../../api/homologaciones/ReportesApi';
import JasperBridgeModel from '../../../models/JasperBridgeModel';
import VisitasApi from '../../../api/aforos//VisitasApi';
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import ModalCargando from '../../../components/utils/ModalCargando/ModalCargando';

///validar permisos
import PARAMETROS from '../../../data/constantes';
import SesionApi from '../../../api/common/SesionApi';
import UtilsFunction from '../../../components/utils/UtilsFunction';


const sesionApi = new SesionApi();

type  changeEventElement = React.ChangeEvent<HTMLInputElement>;


class RegistroVisitas extends Component <{history }> {


    state = {
        loading: false,
         AforoVisitasList:[{id:0,estado:"P",fechaVisita:"",fechaProgramacion:"",semana:"",diaSemanaFechaProgramacion:"",consecutivo:0,fechaEjecucion:"",peso:"",volumen:"", equivalenciaConcepto:"",detalles:[]}],
        dataRegistrar:{visitado:false,id:0,fechaVisita:"",fechaProgramacion:"",semana:"",fechaEjecucion:"",peso:"",volumen:""},
        visitasRegistradasList:[{id:0,fechaVisita:"",fechaProgramacion:"",semana:"",fechaEjecucion:"",peso:"",volumen:"",conceptoList:[{
            id: 0,
            object: ""
        }]}], //visitado:false
        // visitasRegistradasList:[],
        // ListEdit:[],
        visitasTramitadasList:[] as Array<any>,
        visitasCanceladasList:[] as Array<any>,
        visitasRegistradasListHD:[] as Array<any>,
        registrarConcepto:"",
        registrarConceptoTypeHead:[],
        registrarFechaProgramacion:"",
        registrarFechaVisita:"",
        registrarSemana:"",
        registrarDiaSemanaFechaProgramacion:"",
        registrarConsecutivo:"",
        registrarFechaEjecucion:"",
        registrarPeso:"",
        registrarVolumen:"",
        registrarId:0,
        registrarUsu:0,
        positionRegistrar:0,
        dataSend: [],
        search: true,
        registroButton:false,
        idAforo:"",
        claseSuscripcion:"",
        idTipoAforo:"",
        tipoAforo:"",
        visitasHead:[{id:0,estado:"P",fechaVisita:"",fechaProgramacion:"",semana:"",consecutivo:0,fechaEjecucion:"",peso:"",volumen:"", equivalenciaConcepto:""}],
        ShowModalConceptos:false,
        ShowModalCargarArchivos:false,
        ShowModalSlideFotos:false,
        showModal: false,
        variantAlert:['light'],
        showAlert:false,
        StatusGenerarVisita:true,
        messageAlert:"",
        showModalSave:false,
        detalleSeleccionado:[],
        fechaEjecucionSeleccionada:"",
        semanaSeleccionada:"",
        diaSeleccionada:"",
        diaConsecutivo:"",
        idSeleccionado:"",
        observacionSeleccionada:"",
        archivosList:[] ,
        configuracion:{}, 
        idUsuario:0,
        idEmpresa:0,
        password:'',
        effectivePermissions:{EDIT:false,VIEW:false,CREATE:false,SAVE:false,DELETE:false,QUERY:false},
        permissions: [], 
        permisosTercero:true,
        terAforador:0,  
        estadoTab:0,
        fechaProgramacionGeneral:'',
        numPqrs:'',
        cargando:false,
        fechaMafvFin:'',
        //JLMENDOZA
        codSuscripcion:'',
        idSuscripcion:0,
        
    }
    async componentDidMount() {
        await this.callDataApi(); 
        // this.callSelectsApi();
        await this.cargarParametros();
        await this.cargarDatosReportes();
        await sesionApi.loadPermisos(PARAMETROS.AFORO_VISITAS.PROGRAMA_ID).then(response => {
            this.setState({ permissions: response.data });
        })
        await this.cargarPermisos();
        await this.cargarTerceroVisista();
        //console.log('lista 1 ',this.state.AforoVisitasList);
        //console.log('lista 2 ',this.state.visitasTramitadasList);
        //console.log('que tiene permisos ',this.state.permisosTercero);
    }

    cargarTerceroVisista=async()=>
    {
        let usuApi:usuarioApi=new usuarioApi();
        let tmpTer=await usuApi.terceroUsuario(this.state.terAforador);
        let resultado=tmpTer.data[0];
        if(resultado!== undefined)
        {
            this.setState({
                permisosTercero:false
            })
        }
       //console.log('que tiene tercero aforador... ', resultado);
    }

    cargarPermisos=async()=>
    {
      let effectivePermission = UtilsFunction.getEffectivePermissions(this.state.permissions,'AFORO_VISITAS');    
      await this.setState({effectivePermissions:effectivePermission});
    }

    cargarDatosReportes=async()=>
    {
        let usuApi:usuarioApi=new usuarioApi();
        let tmp=await usuApi.datosReportes(0);
        let resultado=tmp.data[0];
        this.setState({
            password:resultado.passwd,
            idUsuario:resultado.usu_ideregistro,
            idEmpresa:resultado.idEmpresa
        })
    }

    cargarParametros=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            configuracion:tmp.data
        })
    }

    changeAccordionStatus = (e: any):void => {
        const { name } = e.target
        this.setState( (updater:any) => ({ [name]: !updater[name] }))
    }
    setRegistrarRow=(mainListVisitas:Tvisitas)=>{
        const {positionRegistrar}=this.state
        //console.log("entro a registrar fila",mainListVisitas)
        if(mainListVisitas.length){
            this.setState({AforoVisitasList:mainListVisitas})
            this.setState({visitasHead:mainListVisitas[0]})  //alternative head
            this.setState({dataRegistrar:mainListVisitas[positionRegistrar],
                registrarFechaProgramacion:mainListVisitas[positionRegistrar].fechaProgramacion,
                registrarFechaVisita:mainListVisitas[positionRegistrar].fechaVisita,
                registrarSemana:mainListVisitas[positionRegistrar].semana,
                registrarDiaSemanaFechaProgramacion:mainListVisitas[positionRegistrar].diaSemanaFechaProgramacion,
                registrarConsecutivo:mainListVisitas[positionRegistrar].consecutivo,
                registrarFechaEjecucion:mainListVisitas[positionRegistrar].fechaEjecucion,
                registrarPeso:mainListVisitas[positionRegistrar].peso,
                registrarId:mainListVisitas[positionRegistrar].id,
                registrarUsu:mainListVisitas[positionRegistrar].usuIderegistro
            });
                 }

    }
    callDataApi():void{
        //const numAforoToedit = window.location.pathname.split("/")[9];
        let paths = window.location.pathname.split('/');
        const numAforoToedit=paths[paths.length-1];
        const data ={numAforo:numAforoToedit}
        //console.log('que numero de aforo llega ',numAforoToedit);        
        API.GetAforoVisitasEdit(data).then((response) => { 
            if(response.success===true){
                let mainListVisitas =response.data.visitasRegistradas || []
                console.log("que tiene response ----+++-->",response)
                if(mainListVisitas.length){
                //console.log("get viene databind response:::::",response)
                this.setState({idAforo:response.data.numAforo,tipoAforo:response.data.tipoAforo,
                    idTipoAforo:response.data.idTipoAforo,
                    claseSuscripcion:response.data.claseSuscripcion,
                    terAforador: response.data.terAforador,fechaProgramacionGeneral:response.data.afoFecha,
                    fechaMafvFin:response.data.mafvFin,numPqrs:response.data.numPqrs,codSuscripcion:response.data.codSuscripcion,
                    idSuscripcion:response.data.idSuscripcion
                })
                
                this.setRegistrarRow(mainListVisitas)

                }else{ 
                    this.setState({idAforo:response.data.numAforo,StatusGenerarVisita:false,
                        tipoAforo:response.data.tipoAforo,
                        idTipoAforo:response.data.idTipoAforo,
                        claseSuscripcion:response.data.claseSuscripcion,
                        terAforador: response.data.terAforador,fechaProgramacionGeneral:response.data.afoFecha,
                        fechaMafvFin:response.data.mafvFin,numPqrs:response.data.numPqrs,codSuscripcion:response.data.codSuscripcion,
                        idSuscripcion:response.data.idSuscripcion})
                    //this.onGenerarVisitas()
            }
                
            }else{
                this.alertInformation(true,['info'],response.message )

            }//else success true
        }  //end.then-generalvisitasedit
        ).catch(err => { 
            if(!!err.isAxiosError && !err.response){console.log("error404")}
            this.alertInformation(true,['danger'],"Error Conexion,Refresca la pagina" )
            return Promise.reject(err); 
        }); //end catch.getaforos

        //console.log('que lleva data ', data);
        API.getAforoVisitasTramitadas(data).then((response) => { 
            if(response.success===true){
                const visitasTramitadas =response.data.visitasRegistradas
                console.log("get viene databind tramitadas:::::",response)
                this.setState({visitasTramitadasList:visitasTramitadas})
            }
                

            //console.log("tramitadas---->",response)
            return response
        }).catch(err => { 
            
            // if(!!err.isAxiosError && !err.response){console.log("error404")}
            this.alertInformation(true,['danger'],"Error Conexion,Refresca la pagina" )
            return Promise.reject(err); 
        }); 
        API.getAforoVisitasCanceladas(data).then((response) => { 
            if(response.success===true){
                const visitasTramitadas =response.data.visitasRegistradas
                console.log("get viene databind tramitadas:::::",response)
                this.setState({visitasCanceladasList:visitasTramitadas})
            }
                

            //console.log("tramitadas---->",response)
            return response
        }).catch(err => { 
            
            // if(!!err.isAxiosError && !err.response){console.log("error404")}
            this.alertInformation(true,['danger'],"Error Conexion,Refresca la pagina" )
            return Promise.reject(err); 
        }); 


    }//end call data

    
    onGenerarVisitas=()=>{
        const numAforo = this.state.idAforo
        const data={numAforo:numAforo}
        API.getGenerarVisitas(data).then((response) => { 
            //console.log('que llego de response ',response);
            if(response.success===true){
                let mainListVisitas =response.data.visitasRegistradas
                this.setRegistrarRow(mainListVisitas)
            }else{
                this.alertInformation(true,['info'],response.data.message )
            }//else success true
        }  //end.then-getaforos
        ).catch(err => { 
            this.alertInformation(true,['danger'],"Error Conexion,Refresca la pagina" )
            return Promise.reject(err); 
        }); //end catch.getaforos 

    }

    handleChange = (event: changeEventElement)=> this.setState({ [event.target.name]: event.target.value } as any);
    alertInformation=(showAlert:boolean,variantAlert:[string],messageAlert:string)=>{
        this.setState({
            showAlert: showAlert,
            variantAlert: variantAlert,
            messageAlert: messageAlert
        },() => { window.setTimeout(() => { this.setState({ showAlert: false,variantAlert:['light'],messageAlert:"" }) }, 6000) });} 
     
    onChangeRegisterHeader =()=>{
                let dataPopped= this.state.AforoVisitasList
                dataPopped.shift();
                this.setState({AforoVisitasList:dataPopped})
        if(this.state.AforoVisitasList.length>0){
           const {positionRegistrar} =this.state
            const data =this.state.AforoVisitasList
            this.setState({dataRegistrar:data[positionRegistrar]})
            this.setState({registrarFechaProgramacion:data[positionRegistrar].fechaProgramacion})
            this.setState({registrarFechaVisita:data[positionRegistrar].fechaVisita})
            this.setState({registrarSemana:data[positionRegistrar].semana})
            this.setState({registrarDiaSemanaFechaProgramacion:data[positionRegistrar].diaSemanaFechaProgramacion})
            this.setState({registrarConsecutivo:data[positionRegistrar].consecutivo}) //volumen
            this.setState({registrarFechaEjecucion:data[positionRegistrar].fechaEjecucion})
            this.setState({registrarPeso:data[positionRegistrar].peso})
            this.setState({registrarId:data[positionRegistrar].id})
        }else{
            this.alertInformation(true,['info'],"Listado de visitas terminadas")
            //console.log("no hay mas elementos:::::")
            this.setState({registrarConcepto:"",registrarFechaVisita:"",registrarFechaProgramacion:"",registrarPeso:"",registrarFechaEjecucion:"",registrarSemana:"",registrarConsecutivo:"",registrarVolumen:""})
            this.setState({registrarId:""},()=>{console.log("onChangeRegisterHeader state:::::",this.state)})
        }
       //console.log("onChangeRegisterHeader visitasRegistradasListHD::::::::::::",this.state.visitasRegistradasListHD)
        } 
    onSubmit=()=>{ 
    this.setState({showModalSave:true})
    }
    handleModalSaveClose=():void=> {
        
        this.setState({ showModalSave: false })
    }
    handleModalSave=():void=> {
        const visitas =this.state.visitasRegistradasList.filter(item=>item.id !== 0);
        //console.log("visitas",visitas)
        this.setState({ visitasRegistradasList: visitas })
        this.setState({ showModalSave: false })
        const a =this.state.visitasRegistradasListHD
        const b =this.state.visitasTramitadasList
        const totalEdit = a.concat(b)
        const dataSend={
            numAforo:this.state.idAforo,
            idTipoAforo:this.state.idTipoAforo,
            claseSuscripcion:this.state.claseSuscripcion,
            visitasRegistradas:totalEdit,
            tipoAforo:this.state.tipoAforo}
        //console.log("visitas to send",dataSend)
        JSON.stringify(dataSend, null, 4);
        API.UpdateAforosVisitasEdit(dataSend)
        .then(response => { 
            //console.log(response);
            if(response.data.success===true){
                this.alertInformation(true,['success'],response.data.message )
                return response 
            }else{
                this.alertInformation(true,['warning'],response.data.message )
                return response 
            }
        }).catch(error => { this.alertInformation(true,['danger'],"Error Conexión" ); return Promise.reject(error); }); //end catch.getaforos


    }
    onSubmitEdit=(i:number)=>{
    console.log("submidedit visita row",i)
    //console.log("state this  ",this.state)
    }
    clearModalConceptos=()=>{
        this.setState({detalleSeleccionado:[]})
        this.setState({fechaEjecucionSeleccionada:""})
        this.setState({observacionSeleccionada:""})
        this.setState({semanaSeleccionada:""})
        this.setState({diaSeleccionada:""})
        this.setState({diaConsecutivo:""})

    }
    onEditarVisita=async(idVisita,consecutivo,tipo)=>{
        console.log("visita to edit id---->",idVisita)
        this.setState({idSeleccionado:idVisita,diaConsecutivo:consecutivo})

        let totalVisitasTramitadas ;
        if(tipo==='C') totalVisitasTramitadas= this.state.visitasCanceladasList.concat(this.state.visitasRegistradasListHD);
        else totalVisitasTramitadas=this.state.visitasTramitadasList.concat(this.state.visitasRegistradasListHD);

        //const totalVisitasTramitadas = this.state.visitasTramitadasList.concat(this.state.visitasRegistradasListHD);
         
        totalVisitasTramitadas.map((item)=>{
            if (item.id === idVisita) {
                this.setState({detalleSeleccionado:item.detalles})
                this.setState({observacionSeleccionada:item.observaciones})
                this.setState({semanaSeleccionada:item.semana})
                this.setState({diaSeleccionada:item.diaSemanaFechaProgramacion})
                this.setState({fechaEjecucionSeleccionada:item.fechaEjecucion},()=>{this.setState({ShowModalConceptos:true})})
                //console.log('que tiene la lista vieja ',item.detalles);
                return item
            } else {
                return item
            }
        }) 
        ///starcorp
        let visitaApi:VisitasApi=new VisitasApi();
        let tmp=await visitaApi.buscarConceptos(idVisita);
        
        await this.setState({
            detalleSeleccionado:tmp.data.listaConceptosDetalles,
            observacionSeleccionada:tmp.data.observacionesDmaf,
            fechaEjecucionSeleccionada:tmp.data.fechaDmaf
        })
        
        //console.log('que tiena la lista ',tmp.data.observacionesDmaf);
        //console.log('termine de buscar conceptos...',tmp.data);

    }
    onCargarFotosVisita=async(idVisita)=>{
        console.log('visita')
        console.log(idVisita)
        this.setState({idSeleccionado:idVisita})
        
        // Cargar datos frescos desde el servidor
        let visitaApi:VisitasApi=new VisitasApi();
        let tmp=await visitaApi.buscarConceptos(idVisita);
        
        await this.setState({
            detalleSeleccionado:tmp.data.listaConceptosDetalles,
            observacionSeleccionada:tmp.data.observacionesDmaf,
            fechaEjecucionSeleccionada:tmp.data.fechaDmaf,
            ShowModalCargarArchivos:true
        })
        
        // Obtener semana y día desde las listas locales
        const totalVisitasTramitadas = this.state.visitasTramitadasList.concat(this.state.visitasRegistradasListHD);
        const visitaEncontrada = totalVisitasTramitadas.find(item => item.id === idVisita);
        
        if (visitaEncontrada) {
            await this.setState({
                semanaSeleccionada: visitaEncontrada.semana,
                diaSeleccionada: visitaEncontrada.diaSemanaFechaProgramacion
            });
        }
        
        console.log('que tiene tercero //////////si es true es desabilitado...  ',this.state.permisosTercero);
        console.log('que tiene geenral //////////si es true tiene permiso ',this.state.effectivePermissions?.EDIT );
    }
    onDownloadPdfVisita=async(idVisita)=>{
        //console.log('que ide llego '+idVisita);

        let api:reportesApi =new reportesApi();
        let basico:basicoDefault=new basicoDefault();

        let parametros={PR_INT_VISITA:idVisita,PR_STR_ROOT_PATH:basico.buscarParametro('url_reportes',this.state.configuracion).replace(/['"]+/g, '')};
                let modelo:JasperBridgeModel=new JasperBridgeModel(basico.buscarParametro('jdni_reportes',this.state.configuracion).replace(/['"]+/g, ''),'pdf',basico.buscarParametro('url_reportes',this.state.configuracion).replace(/['"]+/g, '')+'acta_visita_aforo.jrxml',this.state.idUsuario.toString(),this.state.password,parametros);
                let resultado=await api.generarCartas(modelo,basico.buscarParametro('url_api_reportes',this.state.configuracion).replace(/['"]+/g, ''));
                //let base64str=resultado.data.content;  //axios react
                let base64str=resultado.content;
                //console.log('que llego del reporte ',resultado);
                // decode base64 string, remove space for IE compatibility
                var binary = atob(base64str.replace(/\s/g, ''));
                var len = binary.length;
                var buffer = new ArrayBuffer(len);
                var view = new Uint8Array(buffer);
                for (var i = 0; i < len; i++) {
                    view[i] = binary.charCodeAt(i);
                }
                
                this.setState({
                    cargando:false
                }) 

                // create the blob object with content-type "application/pdf"               
                var blob = new Blob( [view], { type: "application/pdf" });
                
                    var link=document.createElement('a');
                    link.href=window.URL.createObjectURL(blob);
                    link.download='visita'+idVisita+".pdf";
                    link.click();

        /*
        this.setState({idSeleccionado:idVisita})
        const totalVisitasTramitadas = this.state.visitasTramitadasList.concat(this.state.visitasRegistradasListHD);
        totalVisitasTramitadas.map((item)=>{
            if (item.id === idVisita) {
                this.setState({detalleSeleccionado:item.detalles})
                this.setState({observacionSeleccionada:item.observaciones})
                this.setState({semanaSeleccionada:item.semana})
                this.setState({diaSeleccionada:item.diaSemanaFechaProgramacion})
                this.setState({fechaEjecucionSeleccionada:item.fechaEjecucion},()=>{this.setState({ShowModalCargarArchivos:false})})
                return item
            } else {
                return item
            }
            
        }) 
        */
        //API.getReporteVisita(this.state.detalleSeleccionado,idVisita).then((response)=>{ 
            // if(response.success===true)
    // }).catch((err)=>{})
    }
    onVerSlideFotosVisita=async(idVisita,tipo)=>{
        this.setState({idSeleccionado:idVisita})
        let totalVisitasTramitadas ;
        if(tipo==='C') totalVisitasTramitadas= this.state.visitasCanceladasList.concat(this.state.visitasRegistradasListHD);
        else totalVisitasTramitadas=this.state.visitasTramitadasList.concat(this.state.visitasRegistradasListHD);
        
        // Cargar datos frescos desde el servidor
        let visitaApi:VisitasApi=new VisitasApi();
        let tmp=await visitaApi.buscarConceptos(idVisita);
        
        await this.setState({
            detalleSeleccionado:tmp.data.listaConceptosDetalles,
            observacionSeleccionada:tmp.data.observacionesDmaf,
            fechaEjecucionSeleccionada:tmp.data.fechaDmaf,
            ShowModalSlideFotos:true
        })
        
        // Obtener semana y día desde las listas locales
        const visitaEncontrada = totalVisitasTramitadas.find(item => item.id === idVisita);
        
        if (visitaEncontrada) {
            await this.setState({
                semanaSeleccionada: visitaEncontrada.semana,
                diaSeleccionada: visitaEncontrada.diaSemanaFechaProgramacion
            });
        }
    }

        onGoRegistrar=(idVisita,consecutivo)=>{
        console.log("idvisista a registrar" + idVisita +" Dia" + consecutivo  )
        console.log(this.state.detalleSeleccionado)
        
        this.clearModalConceptos()

         this.setState({semanaSeleccionada:this.state.registrarSemana})
         this.setState({diaSeleccionada:this.state.registrarDiaSemanaFechaProgramacion})
        this.setState({idSeleccionado:idVisita},()=>{
        this.setState({ShowModalConceptos:true})
        this.setState({diaConsecutivo:consecutivo})
        })
        

    }
    handleModalConceptosClose=()=>{
        this.clearModalConceptos();
        this.setState({ShowModalConceptos:false})
    };
    handleModalCargarArchivosClose=()=>{
        this.clearModalConceptos();
        this.setState({ShowModalCargarArchivos:false})
        this.setState({ShowModalSlideFotos:false})
    };
    onInsertarDetalles=(visitasRegistradasListhd,idVisita,detallesList,fechaEjecucion,observaciones)=>{
        const newDetalle= visitasRegistradasListhd.map((item)=>{
            if (item.id === idVisita) {
                 item.detalles=detallesList
                 item.observaciones=observaciones
                 item.estado="T"
                item.fechaEjecucion=fechaEjecucion
                return item
              } else {
                return item;
              }
             
         })
         //console.log("this.state.visitasRegistradasListHD ",this.state.visitasRegistradasListHD)
        //  debugger
         this.setState({visitasRegistradasListHD:newDetalle})
    }
    uploadFiles=async(fileObj:any,tipoArchivo,idVisita)=> {
        const fdata = new FormData()
        const files = fileObj
        for (var index = 0; index < files.length; ++index) {
            fdata.append('files[]',files[index])
            //console.log("files[index]---->",files[index]);
        }
        //console.log("files.files files.files",files)
        
        //fdata.append('files',files)
        //console.log("this.fileObj this.fileObj",this.state.fileObj)
        // const {file.idVisita,idAforo,} =this.state
        // const data={idVisita:this.state.idVisita,token:user.token,}
        // let data={idDetalle:this.state.idVisita ,uniTipoAdjunto:this.state.tipoArchivo,:""} 
        
        
        ///nuevo starcorp
        let arrayTmp:any=Array.prototype.slice.call(files[0]);
        //fdata.append('fileList',arrayTmp[0])
        for(let key of Object.keys(arrayTmp)) {
            if (key !== 'length') {
                fdata.append('fileList', arrayTmp[key]);
            }
          }
        //fdata.append('vaaDTO', vaaDTO )
        //let archivosApi:ArchivosApi=new ArchivosApi();

        
        fdata.append('idDetalle',idVisita )
        fdata.append('uniTipoAdjunto',tipoArchivo)
        fdata.append('observaciones',"")
        //let ingreso= await archivosApi.cargarArchivosVisita(fdata); 
        //console.log('que llego ',ingreso.data);        
        this.setState({message:"Subiendo..."})
        this.alertInformation(true,['info'],"Subiendo");
        API.postArchivosVisitas(fdata).then((response)=>{

            console.log("Alert:",response)
            if(response.success===true){
                this.setState({message:"Se ha subido con exito!!"})
                this.alertInformation(true,['info'],response.message);
                console.log("Cargado Correctamente")
            }


        }).catch((err)=>{
            console.log("err postarchivos",err)
            this.setState({message:err})
            this.alertInformation(true,['info'],"Error conexión!");
        })
        this.setState({
            tipoArchivo:'',
            observaciones:'',
            fileObj:[],
            fileArray:[]
            
        })
        this.alertInformation(false,['light'],"");
        //this.props.handleModalConceptosSave(1);
    }
    handleModalConceptosSave=async(detallesList:any,idVisita,fechaEjecucion,observaciones,fileObj:any,tipoArchivo)=>
    {
        this.setState({
            ShowModalConceptos:false,archivosList:detallesList,
            cargando:true
        })
        /*
        const { AforoVisitasList,visitasRegistradasListHD } = this.state;
        let aforosVisitas=AforoVisitasList

         const visitasRegistradashd=visitasRegistradasListHD
         const visitaToRegistrar =aforosVisitas.filter(item=>item.id===idVisita)
         const NewvisitasRegistradasList ={...this.state.visitasRegistradasListHD,visitaToRegistrar};
          const x=visitasRegistradashd.concat(NewvisitasRegistradasList.visitaToRegistrar) 
          this.setState({visitasRegistradasListHD:x},()=>{
              let visitasRegistradasListhd =this.state.visitasRegistradasListHD
              this.onInsertarDetalles(visitasRegistradasListhd,idVisita,detallesList,fechaEjecucion,observaciones)
            
            
          })
        */
       /*
        if(this.state.registrarId===idVisita){
            //visita viene por edicion no cambia el head registro
            this.onChangeRegisterHeader()
        }
        */

                        ///////////starcorp///////////
        let crud=await this.crudConceptosGeneral(detallesList,idVisita,fechaEjecucion,observaciones);

        let visitaApi:VisitasApi=new VisitasApi();
        let listaDmaf=await visitaApi.ListaDmafEstado(this.state.idAforo);
        let resultado=listaDmaf.data;
        
        await this.setState({
            AforoVisitasList:resultado.data.visitasRegistradas,
            visitasTramitadasList:resultado.data.visitasRegistradas2,
        })

        await this.setState({
            ShowModalCargarArchivos:false,
            ShowModalSlideFotos:false,
            cargando:false,
        })
        if(crud.statusCode===200)
        {
            this.uploadFiles(fileObj,tipoArchivo,idVisita)
            this.alertInformation(true,['success'],'Exito en la Transaccion...' );
        }
        else
        {
            this.alertInformation(true,['danger'],'Error, verificar con el area de Tecnologia...' );
        }

        //console.log('tamitadas ',resultado);
        
    };

    crudConceptosGeneral=async(detallesList:any,idVisita,fechaEjecucion,observaciones)=>
    {
        let valores={listaConceptosDetalles:detallesList,dmafIderegistro:idVisita,fechaDmaf:fechaEjecucion,observacionesDmaf:observaciones};
        let visitaApi:VisitasApi=new VisitasApi();
        let tmp=await visitaApi.crudConceptosDmaf(valores);
        let resultado=tmp.data;
        return resultado;
    }

    handleModalCerrar=(e:any)=>
    {
        //console.log('que llego de modal '+e);
        this.setState({ShowModalConceptos:false,ShowModalCargarArchivos:false,ShowModalSlideFotos:false})
        if(e>0)
        {
            this.alertInformation(true,['info'],'Se Realizo La Operacion Solicitada...' )
        }
        
    }

    cambioTabEstado=async(e:any)=>
    {
        if(e==='home')
        {
            await this.setState({
                estadoTab:0
            })
        }
        else
        {
            await this.setState({
                estadoTab:1
            })
        }
    }

    mostrarCargando = (): any => {
        if (this.state.cargando) {
            return (
                <ModalCargando estado={this.state.cargando}></ModalCargando>
            )
        }
    }

    validarFechcaFin=()=>
    {
        ////return true si esta vencido...
        let fechaUno=new Date();
        let fechaDos=new Date(this.state.fechaMafvFin);
        let resultado = fechaUno.getTime() > fechaDos.getTime();
        console.log('que tiene resultado ',resultado);
       // return resultado;
        return false;
    }

    ////////////informacion permisos///////////////
    //si permisosTercero es true , es porque esta deshabilitado
    // this.state.effectivePermissions?.EDIT es true es por que tiene permisos
    
    render():JSX.Element {
        const {showModalSave,showAlert,messageAlert, idAforo,tipoAforo,claseSuscripcion,registroButton,fechaProgramacionGeneral,numPqrs,codSuscripcion,idSuscripcion}=this.state;
        const columnasTablaPendientes=[
            {
                dataField: "id",
                text: "ID Visita",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  }
              },
              {
                dataField: "fechaProgramacion",
                text: "Fecha Programación",
                align: 'center',
                headerAlign: 'center',
                hidden:true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  }
              },
              {
                dataField: "fechaVisita",
                text: "Fecha Visita",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', }
              },
              {
                dataField: "diaSemanaFechaProgramacion",
                text: "Dia",
                align: 'center',
                headerAlign: 'center',
                //hidden: this.state.estadoTab===0 ? false : true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  }
              },
              {
                dataField: "semana",
                text: "Semana",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  }
              },
              {
                dataField: "consecutivo",
                text: "Num Visita",
                align: 'center',
                headerAlign: 'center',
                //hidden: this.state.estadoTab===0 ? false : true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  }
              },
              {
                dataField: "Acciones",
                text: "Acciones",
                align: 'center',
                headerAlign: 'center',
                hidden:this.state.estadoTab===0 ? false : true,
                formatter: (cell, row, rowIndex) => {
                    if(row.id===Math.min(...this.state.AforoVisitasList.map(e => e.id)) && row.id>0)
                    {
                        return (
                            <Row>   
                            <Col> 
                        <Button disabled={this.validarFechcaFin()} variant="primary" type="submit" key={cell-rowIndex} onClick={()=>this.onGoRegistrar(row.id,row.consecutivo)}>Registrar</Button>
                        </Col>
                        </Row>
                        
                        )
                    }
                    else
                    {
                        return (
                            <p></p>
                        )
                    }
                  },
                  headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  /*width: '100px'*/ }
              },
        ];
        const columnasTablaTramitadas=[
            {
                dataField: "id",
                text: "ID Visita",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', },
                sort: true,
                footer:"TOTAL"
              },
              {
                dataField: "consecutivo",
                text: "N° Visita",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', },
                sort: true,
                footer:""
              },
              {
                dataField: "fechaProgramacion",
                text: "Fecha Programación",
                align: 'center',
                headerAlign: 'center',
                hidden:true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  },
                footer:""
              },
              {
                dataField: "fechaVisita",
                text: "Fecha Visita",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  },
                footer:""
              },
              {
                dataField: "semana",
                text: "Semana",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  },
                footer:""
              },
              {
                dataField: "fechaEjecucion",
                text: "Fecha Ejecucion",
                align: 'center',
                headerAlign: 'center',
                //hidden: true,//this.state.estadoTab===1 ? false : true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff'},
                footer:""
              },
              {
                /**[JLMENDOZA] */  
                dataField:"detalles",
                formatter:(k)=><span>{k.reduce((a,b)=>({volumen:a.volumen + b.volumen})).volumen}</span>,
                text:"Volumen",
                align:'center',
                headerAlign:'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff'},
                footerAlign:'center',
                footer:r=>{return (r.reduce((a,i)=>{ return a + i.reduce((a,i)=>{return a + i.volumen},0)},0))?.toFixed(6)}
              },
              {
                /**[JLMENDOZA] */  
                dataField:"detalles",
                formatter:k=>{ return (k.reduce((a,i)=>{ return (a + (i.peso as number))},0)) },
                text:"Peso",
                align:'center',
                headerAlign:'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff'},
                footerAlign:'center',
                footer:r=>{return (r.reduce((a,i)=>{ return a + i.reduce((a,i)=>{return a + i.peso},0)},0))?.toFixed(6)}
             },
              {
                dataField: "Editar",
                text: "Editar",
                align: 'center',
                headerAlign: 'center',
                //hidden:true,// this.state.estadoTab===1 ? false : true,
                formatter: (cell, row, rowIndex) => {
                        return (    
                        <Button disabled={this.validarFechcaFin()} variant="success" key={cell-rowIndex} onClick={()=>{this.onEditarVisita(row.id,row.consecutivo,'T')}} >Editar </Button> 
                        )
                  },
                  headerStyle: { backgroundColor: '#6c757d', color: '#ffffff'}
              },
              {
                dataField: "Acciones",
                text: "Acciones",
                align: 'center',
                headerAlign: 'center',
                //hidden: this.state.estadoTab===1 ? false : true,
                formatter: (cell, row, rowIndex) => {                   
                        return (                           
                            <Row>
                                    <Col>
                                        <Button variant="primary" key={cell-rowIndex} onClick={()=>this.onDownloadPdfVisita(row.id)} >Reporte<AiFillFilePdf/></Button>
                                    </Col>
                                    {false ? (<Col>
                                        <Button variant="info" key={cell-rowIndex}  onClick={()=>this.onCargarFotosVisita(row.id)} >Cargar<RiFolderUploadFill/></Button>
                                    </Col>):""}
                                    <Col>
                                        <Button variant="secondary" key={cell-rowIndex}  onClick={()=>this.onVerSlideFotosVisita(row.id,'T')} >Ver<IoMdPhotos/></Button>
                                    </Col>
                            </Row>
                           
                        )
                  },
                  headerStyle: { backgroundColor: '#6c757d', color: '#ffffff'/*,  width: '150px'*/}
              },
        ];

        const columnasTablaCanceladas=[
            {
                dataField: "id",
                text: "ID Visita",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', },
                sort: true,
                footer:"TOTAL"
              },
              {
                dataField: "consecutivo",
                text: "N° Visita",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff', },
                sort: true,
                footer:""
              },
              {
                dataField: "fechaProgramacion",
                text: "Fecha Programación",
                align: 'center',
                headerAlign: 'center',
                hidden:true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  },
                footer:""
              },
              {
                dataField: "fechaVisita",
                text: "Fecha Visita",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  },
                footer:""
              },
              {
                dataField: "semana",
                text: "Semana",
                align: 'center',
                headerAlign: 'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff',  },
                footer:""
              },
              {
                dataField: "fechaEjecucion",
                text: "Fecha Ejecucion",
                align: 'center',
                headerAlign: 'center',
                //hidden: true,//this.state.estadoTab===1 ? false : true,
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff'},
                footer:""
              },
              /*{
                /**[JLMENDOZA] 
                dataField:"detalles",
                formatter:(k)=><span>{k.reduce((a,b)=>({volumen:a.volumen + b.volumen})).volumen}</span>,
                text:"Volumen",
                align:'center',
                headerAlign:'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff'},
                footerAlign:'center',
                footer:r=>{return (r.reduce((a,i)=>{ return a + i.reduce((a,i)=>{return a + i.volumen},0)},0))?.toFixed(6)}
              },
              {
                /**[JLMENDOZA]  
                dataField:"detalles",
                formatter:k=>{ return (k.reduce((a,i)=>{ return (a + (i.peso as number))},0)) },
                text:"Peso",
                align:'center',
                headerAlign:'center',
                headerStyle: { backgroundColor: '#6c757d', color: '#ffffff'},
                footerAlign:'center',
                footer:r=>{return (r.reduce((a,i)=>{ return a + i.reduce((a,i)=>{return a + i.peso},0)},0))?.toFixed(6)}
             },*/
              {
                dataField: "Editar",
                text: "Editar",
                align: 'center',
                headerAlign: 'center',
                //hidden:true,// this.state.estadoTab===1 ? false : true,
                formatter: (cell, row, rowIndex) => {
                        return (    
                        <Button disabled={this.validarFechcaFin()} variant="success" key={cell-rowIndex} onClick={()=>{this.onEditarVisita(row.id,row.consecutivo,'C')}} >Editar </Button> 
                        )
                  },
                  headerStyle: { backgroundColor: '#6c757d', color: '#ffffff'}
              },
              {
                dataField: "Acciones",
                text: "Acciones",
                align: 'center',
                headerAlign: 'center',
                //hidden: this.state.estadoTab===1 ? false : true,
                formatter: (cell, row, rowIndex) => {                   
                        return (                           
                            <Row>
                                    <Col>
                                        <Button variant="primary" key={cell-rowIndex} onClick={()=>this.onDownloadPdfVisita(row.id)} >Reporte<AiFillFilePdf/></Button>
                                    </Col>
                                    {false ? (<Col>
                                        <Button variant="info" key={cell-rowIndex}  onClick={()=>this.onCargarFotosVisita(row.id)} >Cargar<RiFolderUploadFill/></Button>
                                    </Col>):""}
                                    <Col>
                                        <Button variant="secondary" key={cell-rowIndex}  onClick={()=>this.onVerSlideFotosVisita(row.id,'C')} >Ver<IoMdPhotos/></Button>
                                    </Col>
                            </Row>
                           
                        )
                  },
                  headerStyle: { backgroundColor: '#6c757d', color: '#ffffff'/*,  width: '150px'*/}
              },
        ];

        return (
              <div>
                  <hr/><br/>
                  <div></div>
                  {this.mostrarCargando()}
                  <Form className="mb-2" onSubmit={this.onSubmit}>
                           <Form.Row>
                               <Form.Group as={Col} controlId="dformGrid3" md="3">
                                   <Form.Label>Id Aforo</Form.Label>
                                   <Form.Control name="idAforo" value={idAforo} onChange={this.handleChange}   disabled />
                               </Form.Group>
                               <Form.Group as={Col} controlId="naformGrid32" md="3">
                                   <Form.Label>Tipo Aforo</Form.Label>
                                   <Form.Control  placeholder="" name="tipoAforo" value={tipoAforo} onChange={this.handleChange}  disabled />
                                   {/* <option></option> as="select" */}
                               </Form.Group>
                                <Form.Group as={Col} controlId="naformGrid32" md="3">
                                   <Form.Label>Clase Suscripcion</Form.Label>
                                   <Form.Control  placeholder="" name="claseSuscripcion" value={claseSuscripcion} onChange={this.handleChange}  disabled />
                                   {/* <option></option> as="select" */}
                               </Form.Group>
                               <Form.Group as={Col} controlId="naformGrid32" md="3">
                                   <Form.Label>Fecha Programacion</Form.Label>
                                   <Form.Control  placeholder="" name="claseSuscripcion" value={fechaProgramacionGeneral} onChange={this.handleChange}  disabled />
                                   {/* <option></option> as="select" */}
                               </Form.Group>
                               <Form.Group as={Col} controlId="naformGrid32" md="3">
                                   <Form.Label>Radicado Pqrs</Form.Label>
                                   <Form.Control  placeholder="" name="radicadoPqrs" value={numPqrs} onChange={this.handleChange}  disabled />
                                   {/* <option></option> as="select" */}
                               </Form.Group>
                               <Form.Group as={Col} controlId="naformGrid32" md="3">
                                   <Form.Label>IdSuscripcion</Form.Label>
                                   <Form.Control  placeholder="" name="idSuscripcion" value={idSuscripcion} onChange={this.handleChange}  disabled />
                                   {/* <option></option> as="select" */}
                               </Form.Group>
                               <Form.Group as={Col} controlId="naformGrid32" md="3">
                                   <Form.Label>Codigo Bioagricola</Form.Label>
                                   <Form.Control  placeholder="" name="codSuscripcion" value={codSuscripcion} onChange={this.handleChange}  disabled />
                                   {console.log("estados:",this.state)}
                               </Form.Group>
                               <Form.Group as={Col} controlId="naformGrid3t2" md="3">
                               <Button variant="primary" style={{margin: "10px",marginTop: "33px"}}   onClick={() => {this.props.history.goBack() }}  > Regresar al Listado</Button>
                               </Form.Group>
                           </Form.Row>
                           </Form>
                           
                            
                            <br/>
                            {this.state.variantAlert.map((t: any, i: number) => {
                                    return <Alert
                                            key={i}
                                            variant={t}
                                            transition={true}
                                            show={showAlert}
                                            >{messageAlert} 
                                            </Alert>
                                            })
                                }
                    <Button 
                    variant="primary" 
                    className="mr-5 " 
                    name="registroButton" 
                    onClick={this.changeAccordionStatus}> 
                    {registroButton ? '--':'+' }</Button> 
                    <strong>Registro visitas</strong><br />
                    {registroButton && <div><br />
                <h4>Registro de Aforos por Visita</h4>
                <br />
                <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" onSelect={(e)=>{this.cambioTabEstado(e)}}>
                        <Tab eventKey="home" title="Pendientes">
                                <div className="table-responsive">
                                                                <BootstrapTable data={this.state.AforoVisitasList} keyField='gact_fecgestion' columns={ columnasTablaPendientes }
                                                                bootstrap4
                                                                striped={true}
                                                                hover={true}
                                                                pagination={paginationFactory({})}
                                                                data-mobile-responsive="true"
                                                                wrapperClasses="table"
                                                                noDataIndication="No Hay Informacion..."
                                                                tabIndexCell
                                                                defaultSorted={[{dataField: 'id',order: 'desc'}]}
                                                                />                             
                                </div>        
                            
                        
                        </Tab>
                            <Tab eventKey="registradas" title="Tramitadas">
                                    <div className="table-responsive">
                                                                <BootstrapTable data={this.state.visitasTramitadasList} keyField='gact_fecgestion' columns={ columnasTablaTramitadas }
                                                                bootstrap4
                                                                striped={true}
                                                                hover={true}
                                                                pagination={paginationFactory({})}
                                                                data-mobile-responsive="true"
                                                                wrapperClasses="table"
                                                                noDataIndication="No Hay Informacion..."
                                                                defaultSorted={[{dataField: 'id',order: 'desc'}]}
                                                                />                             
                                    </div> 
                            </Tab>
                            <Tab eventKey="suspendidas" title="Canceladas">
                                    <div className="table-responsive">
                                                                <BootstrapTable data={this.state.visitasCanceladasList} keyField='gact_fecgestion' columns={ columnasTablaCanceladas }
                                                                bootstrap4
                                                                striped={true}
                                                                hover={true}
                                                                pagination={paginationFactory({})}
                                                                data-mobile-responsive="true"
                                                                wrapperClasses="table"
                                                                noDataIndication="No Hay Informacion..."
                                                                defaultSorted={[{dataField: 'id',order: 'desc'}]}
                                                                />                             
                                    </div> 
                            </Tab>
                            
                    </Tabs> 
                 </div>}

                 <Modal show={showModalSave} onHide={this.handleModalSaveClose} centered animation={false} >
                    <Modal.Header closeButton>
                        <Modal.Title> N° Aforo: {idAforo} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Desea guardar la información?
                        {!this.state.effectivePermissions?.EDIT ? <p>No tiene permisos para Guardar...</p> : null}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleModalSaveClose} >
                            No
                    </Button>
                        <Button disabled={!this.state.effectivePermissions?.EDIT} variant="primary" onClick={this.handleModalSave} >
                            Si
                    </Button>
                    </Modal.Footer>
                </Modal>
                 <ModalConceptosVisitas
                 data={this.state.detalleSeleccionado}
                idVisita={this.state.idSeleccionado}
                fechaEjecucion={this.state.fechaEjecucionSeleccionada}
                observaciones={this.state.observacionSeleccionada}
                dia={this.state.diaSeleccionada}
                consecutivo={this.state.diaConsecutivo}
                estado={this.state.claseSuscripcion}
                semana={this.state.semanaSeleccionada}
                 showModalConceptos={this.state.ShowModalConceptos}
                 handleModalConceptosClose={this.handleModalConceptosClose}
                handleModalConceptosSave={this.handleModalConceptosSave}
                permisos={this.state.permisosTercero}
                permisosGeneral={!this.state.effectivePermissions?.EDIT}
                /> 
               < ModalCargarFotos
                key={`cargar-${this.state.idSeleccionado}`}
                idVisita={this.state.idSeleccionado}
                fechaEjecucion={this.state.fechaEjecucionSeleccionada}
                idAforo={this.state.idAforo}
                showModalConceptos={this.state.ShowModalCargarArchivos}
                handleModalConceptosClose={this.handleModalCargarArchivosClose}
                handleModalConceptosSave={this.handleModalCerrar}
                permisos={this.state.permisosTercero}
                permisosGeneral={!this.state.effectivePermissions?.EDIT}
               
               ></ModalCargarFotos>

               < ModalSlideFotos
               key={`slide-${this.state.idSeleccionado}`}
               dia={this.state.diaSeleccionada}
               semana={this.state.semanaSeleccionada}
                data={this.state.detalleSeleccionado}
                idVisita={this.state.idSeleccionado}
                fechaEjecucion={this.state.fechaEjecucionSeleccionada}
                observaciones={this.state.observacionSeleccionada}
                 showModalConceptos={this.state.ShowModalSlideFotos}
                 handleModalConceptosClose={this.handleModalCargarArchivosClose}
               
               ></ModalSlideFotos>

              </div> 
            
        )
    }
}

export default (RegistroVisitas)