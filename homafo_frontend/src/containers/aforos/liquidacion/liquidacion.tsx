import React, { Component } from 'react'
import { Form, Col, Button, ButtonToolbar, Table, Alert, Spinner ,  Card , Row} from 'react-bootstrap'
import {TconsultarLiquidacion} from '../../../../src/models/types/aforos/LiquidacionConsultar'
import * as API from '../../../api/aforos/select'
import * as API2 from '../../../api/aforos/aforosLiquidacion'
import '../../../assets/liquidacion.css'
import ModalCargando from '../../../components/utils/ModalCargando/ModalCargando';
import homoApi from '../../../api/homologaciones/Homologacion';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import JasperBridgeModel from '../../../models/JasperBridgeModel';
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import usuarioApi from '../../../api/homologaciones/UsuariosApi';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import reportesApi from '../../../api/homologaciones/ReportesApi';
import Alerta from '../../../components/utils/AlertaComponent/AlertaComponent';

///validar permisos
import PARAMETROS from '../../../data/constantes';
import SesionApi from '../../../api/common/SesionApi';
import UtilsFunction from '../../../components/utils/UtilsFunction';


const sesionApi = new SesionApi();

type changeEventElement = React.ChangeEvent<HTMLInputElement>;
type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;


type LiquidacionState = {
    loading: boolean,

    suscripcion: string;
    idMultiusuario:string;
    idAforo:string;
    idSuscripcion: string;

    conceptoAforo: string;
    conceptoAforoList: [];
    idTipoAforo:string;
    tipoAforoList:[],
    showAlert:boolean;
    preLiquidarStatus:boolean;
    ConfirmarLiquidacionStatus:boolean;
    reporteStatus:boolean;
    variantAlert:[string];
    messageAlert:string;
    errorMessage:string;
    liquidacionList:[];
    tipoAforo:string;
    mensaje:string;
    estado:string;
    TableidSuscripcion:string,
    TableidMultiusuario:string;
    TableidAforo:string;
    TabletipoAforo:string;
    Tableestado:string;
    Tablemensaje:string;
    tableConceptoAforo:string;
    TableidTipoAforo:string;
    claseSusAforoList:[];
    idClaseAforo:string;
    cargando:boolean;
    aforadores:[],
    terceros:[],
    terceroSeleccion:any,
    cargandoTercero:boolean,
    busqueda:{
        idAforo:'',
        fechaInicio:'',
        fechaFinal:'',
        pqrs:'',
        pcodigo:'',
        terCliente:'',
        terAforador:''
    },
    idUsuario:number,
    idEmpresa:number,
    password:string,
    usuNombre:string,
    configuracion:any,
    alerta:{
        variante:string,
        estado:boolean,
        valor:string
    },
    effectivePermissions:any,
    permissions: []
};
//interface ISelects {
// selects: {

//     tiposAforo: [],
//     frecuenciaRecoleccion: [],
//     Barrio: [],
//     conceptoAforo: [],
//     tecnicoAforador: [],
//     Estado :[],
//     tipoUso:[]
// }
//};


class Liquidacion extends Component<{ selects: any, actions: any }, LiquidacionState> {

    constructor(props) {

        super(props)
        this.state = {
            loading: false,
            idTipoAforo: "",
            tipoAforoList:[],
            conceptoAforo: "",
            conceptoAforoList: [],
            suscripcion: "",
            idMultiusuario:"",
            idSuscripcion:"",
            idAforo:"",
            showAlert: false,
            variantAlert: ['light'],
            errorMessage:"",
            liquidacionList:[],
            messageAlert:"",
            preLiquidarStatus:true,
            reporteStatus:true,
            ConfirmarLiquidacionStatus:true,
            tipoAforo:"",
            mensaje:"",
            estado:"",
            TableidSuscripcion:"",
            TableidMultiusuario:"",
            TableidAforo:"",
            TabletipoAforo:"",
            Tableestado:"",
            Tablemensaje:"",
            tableConceptoAforo:"",
            TableidTipoAforo:"",
            claseSusAforoList:[],
            idClaseAforo:"",
            cargando:false,
            aforadores:[],
            terceros:[],
            terceroSeleccion:[],
            cargandoTercero:false,
            busqueda:{
                idAforo:'',
                fechaInicio:'',
                fechaFinal:'',
                pqrs:'',
                pcodigo:'',
                terCliente:'',
                terAforador:''
            },
            idUsuario:0,
            idEmpresa:0,
            password:'',
            usuNombre:'',
            configuracion:{},
            alerta:{
                variante:'',
                estado:false,
                valor:''
            },
            effectivePermissions:{EDIT:false,VIEW:false,CREATE:false,SAVE:false,DELETE:false,QUERY:false},
            permissions: [],
}
        
    } //end constructor

    fetchSelects():void{
        API.getTiposAforo()
        .then( response => {
            console.log("response taforos:",response)
             
                this.setState({ tipoAforoList:response}) 
                // console.log("state taforos:",this.state.tipoAforoList)

        }).catch(error => { console.log(error); this.setState({errorMessage:error})})

        API.getConceptoAforo("idTipoAforo")
        .then( response => {
            console.log("response taforos:",response)
             
                this.setState({ conceptoAforoList:response.data}) 
                // console.log("state taforos:",this.state.conceptoAforoList)

        }).catch(error => { console.log(error); this.setState({errorMessage:error})})

        API.getClaseSusAforo()
        .then( response => {
            console.log("response claseAforo:",response)
             
                this.setState({ claseSusAforoList:response}) 

        }).catch(error => { console.log(error); this.setState({errorMessage:error})})

        API.getTecnicoAforador()
        .then( response => {
            console.log("response tecnicos aforadores:",response.data)
             
                this.setState({ aforadores:response.data}) 

        }).catch(error => { console.log(error); this.setState({errorMessage:error})})

    }
    async componentDidMount() {
        this.fetchSelects();
        this.cargarDatosReportes();
        this.cargarParametros();
        await sesionApi.loadPermisos(PARAMETROS.AFORO_LIQUIDACION.PROGRAMA_ID).then(response => {
            this.setState({ permissions: response.data });
        })
        await this.cargarPermisos();
    }//end didmount

    cargarPermisos=async()=>
    {
      let effectivePermission = UtilsFunction.getEffectivePermissions(this.state.permissions,'AFORO_LIQUIDACION');    
      await this.setState({effectivePermissions:effectivePermission});
    }

    cargarDatosReportes=async()=>
    {
        let usuApi:usuarioApi=new usuarioApi();
        let tmp=await usuApi.datosReportes(this.state.idUsuario);
        let resultado=tmp.data[0];
        this.setState({
            password:resultado.passwd,
            idUsuario:resultado.usu_ideregistro,
            idEmpresa:resultado.idEmpresa,
            usuNombre:resultado.usuario_nom
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

    handleChange = (event: changeEventElement) => {
        this.setState({ [event.target.name]: event.target.value } as any)
        // if(event.target.name==="tipoAforo"){ API.getConceptoAforo(event.target.value).then(response=>{
            //if(response.success===true){
        //     this.setstate({conceptoaforo:response.data})}   
    // }
        // })  

        
    };
    activateliquidacionStatus=(estado)=>{
        console.log("estado--->",estado)
        const pendiente="P"
        const preliquidado="PL"
        const liquidado="L"
        if(estado===pendiente){
            
            console.log("pedniente if--->",estado)
            this.setState({ preLiquidarStatus:false,reporteStatus:false}) 
        }
        if(estado===preliquidado){
            this.setState({ ConfirmarLiquidacionStatus:false,reporteStatus:false}) 
            
        }
        if(estado===liquidado){
            this.setState({ preLiquidarStatus:true,ConfirmarLiquidacionStatus:false,reporteStatus:false}) 

        }

    }
    clearInterface=()=>{
        this.setState({ preLiquidarStatus:true,ConfirmarLiquidacionStatus:true,reporteStatus:true}) 
        this.setState({ 
            ConfirmarLiquidacionStatus:true,reporteStatus:true,
            estado:"",mensaje:"",idAforo:"",
            Tableestado:"",
            Tablemensaje:"",
            TabletipoAforo:"",
            TableidAforo:"",
            TableidSuscripcion:""}
        ) 
    }
    // liquidacionProcess=(response)=>{}

    _handleKeyDownSearch=(e:KeyboardEvent) => {
        if (e.key === 'Enter') {

            this.setState({ loading: true, cargando:true });
            console.log('que estado tiene cargando ',this.state.cargando);
            const dataFlush:TconsultarLiquidacion = {
                idConcepto: parseInt(this.state.conceptoAforo) || 0,
                idMultiusuario:parseInt(this.state.idMultiusuario) || 0,
                idSuscripcion:parseInt(this.state.suscripcion) || 0,
                idAforo:parseInt(this.state.idAforo) || 0,
                idTipoAforo:parseInt(this.state.idTipoAforo) || 0,
                tipoAforo:"",
                mensaje:"",
                estado:"",
                idClaseAforo: parseInt(this.state.idClaseAforo) || 0
            }
            console.log("dataflush send",dataFlush)
            
        
        API2.GetConsultarliquidacionesAforos(dataFlush).then( response => {
            
            this.clearInterface();
             if(response.success===true){
                //  this.setState({estado:"",mensaje:"",idAforo:"", ConfirmarLiquidacionStatus:true,reporteStatus:true}) 
                 this.setState(
                     {Tableestado:response.data.estado,
                        Tablemensaje:response.data.mensaje,
                        TabletipoAforo:response.data.tipoAforo,
                        TableidAforo:response.data.idAforo,
                        TableidSuscripcion:response.data.idSuscripcion},
                     ()=>{ this.activateliquidacionStatus(this.state.Tableestado);}
                    )
                 this.alertInformation(['success'],'Resultado de la Busqueda Exitosa...');
                }else{ 
                    this.alertInformation(['warning'],"Error No se Encontraron Resultados...");
                    this.clearInterface();
                }
                
            }).catch(error => { this.setState({ ConfirmarLiquidacionStatus:true,reporteStatus:true})
                this.alertInformation(['warning'],"Error"); console.log(error); this.setState({errorMessage:error})})
        }

        this.setState({ cargando:false });
    }
    alertInformation=(variant:[string],message:string)=>{
        this.setState({
            showAlert: true,
            variantAlert:variant,
            messageAlert: message
        },() => { window.setTimeout(() => { this.setState({ showAlert: false ,variantAlert:['light'],messageAlert:""}) }, 4000) });
    }
    _handlePreliquidar=()=>{
        this.setState({ cargando:true });
        const dataFlush:TconsultarLiquidacion = {
            idConcepto: parseInt(this.state.tableConceptoAforo) || 0,
            idMultiusuario:parseInt(this.state.TableidMultiusuario) || 0,
            idSuscripcion:parseInt(this.state.TableidSuscripcion) || 0,
            idAforo:parseInt(this.state.TableidAforo) || 0,
            idTipoAforo:parseInt(this.state.TableidTipoAforo) || 0,
            tipoAforo:(this.state.TableidTipoAforo) ,
            mensaje:(this.state.Tablemensaje) ,
            estado:(this.state.Tablemensaje) ,
            idClaseAforo: parseInt(this.state.idClaseAforo) || 0
        }
        console.log("preliquidar data-->",dataFlush)
        API2.GetPreLiquidar(dataFlush).then( response => {
        //API2.GetPreLiquidar({idAforo:40}).then( response => {

            if(response.success===true){
               //  this.setState({estado:"",mensaje:"",idAforo:"", ConfirmarLiquidacionStatus:true,reporteStatus:true}) 
                this.setState(
                    {Tableestado:response.data.estado,
                       Tablemensaje:response.data.mensaje,
                       TabletipoAforo:response.data.tipoAforo,
                       TableidAforo:response.data.idAforo,
                       TableidSuscripcion:response.data.idSuscripcion},
                    ()=>{ this.activateliquidacionStatus(this.state.Tableestado);}
                   )
                this.alertInformation(['success'],response.message);
               }else{
                this.alertInformation(['info'],response.message);  
                
                }
               
           }).catch(error => { this.setState({ ConfirmarLiquidacionStatus:true,reporteStatus:true})
           this.clearInterface(); this.alertInformation(['warning'],"Error");  this.setState({errorMessage:error})
        })
        this.setState({ cargando:false });
    }
    _handleReporte=()=>{
        //API.GetReporteLiquidacion()
    //  ver html {hidden=false} reporte o descargar reporte
    }
    _handleLiquidarSus=()=>{
        this.setState({ cargando:true });
        const dataFlush:TconsultarLiquidacion = {
            idConcepto: parseInt(this.state.tableConceptoAforo) || 0,
            idMultiusuario:parseInt(this.state.TableidMultiusuario) || 0,
            idSuscripcion:parseInt(this.state.TableidSuscripcion) || 0,
            idAforo:parseInt(this.state.TableidAforo) || 0,
            idTipoAforo:parseInt(this.state.TableidTipoAforo) || 0,
            tipoAforo:(this.state.TableidTipoAforo) ,
            mensaje:(this.state.Tablemensaje) ,
            estado:(this.state.Tablemensaje),
            idClaseAforo: parseInt(this.state.idClaseAforo) || 0 
        }
        console.log("preliquidar data-->",dataFlush)
        // API2.GetPreLiquidar(dataFlush).then( response => {
        API2.PostLiquidar(dataFlush).then( response => {

            if(response.success===true){
               //  this.setState({estado:"",mensaje:"",idAforo:"", ConfirmarLiquidacionStatus:true,reporteStatus:true}) 
                this.setState(
                    {Tableestado:response.data.estado,
                       Tablemensaje:response.data.mensaje,
                       TabletipoAforo:response.data.tipoAforo,
                       TableidAforo:response.data.idAforo,
                       TableidSuscripcion:response.data.idSuscripcion},
                    ()=>{ this.activateliquidacionStatus(this.state.Tableestado);}
                   )
                this.alertInformation(['success'],response.message);
               }else{
                this.alertInformation(['info'],response.message);  
                
                }
               
           }).catch(error => { this.setState({ ConfirmarLiquidacionStatus:true,reporteStatus:true})
           this.clearInterface(); this.alertInformation(['warning'],"Error");  this.setState({errorMessage:error})
        })
        this.setState({ cargando:false });
        
     }

     mostrarCargando = (): any => {
        if (this.state.cargando) {
            return (
                <ModalCargando estado={this.state.cargando}></ModalCargando>
            )
        }
    }

    async cambioValorBusqueda(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        
        await this.setState({
            busqueda:{
                ...this.state.busqueda,[name]:value
            }
        })
        
    }

    cambioValorTercero=(e:any)=>
    {
        ///console.log(e);
        if(e[0]!==undefined)
        {
            this.setState({
                busqueda:{
                    ...this.state.busqueda,terCliente:e[0].ter_ideregistro 
                },
                terceroSeleccion:[e[0]]
            })
        }
        else
        {
            this.setState({
                terceroSeleccion:[]
            })
        }
    }

    buscarTercero=async(e:any)=>
    {
        let api:homoApi =new homoApi();
        await this.setState({
            cargandoTercero:true
        })
        let tmp=await api.buscarNombreTercero(e);
        await this.setState({
            terceros:tmp.data,
            cargandoTercero:false
        })
    }

    llamarAlerta = (tmp1: string, tmp2: string) => {
        this.setState({
            alerta: {
                ...this.state.alerta, estado: true, variante: tmp1, valor: tmp2
            }
        })
        setTimeout(() => {
            this.setState({
                alerta: {
                    ...this.state.alerta, estado: false, variante: '', valor: ''
                }
            })
        }, 3000);
    }

    mostrarAlerta = (): any => {
        if (this.state.alerta.estado) {
            return (
                <Alerta informacion={this.state.alerta}></Alerta>
            )
        }
    }

    generarReporteDetalle=async()=>
    {
        try
        {
                let basico:basicoDefault=new basicoDefault();
                let api:reportesApi =new reportesApi();
                let condiciones=' ';
                let subCondiciones=' ';
                let nombreReporte='detalle_aforo';
                this.setState({
                    cargando:true
                })
                if(this.state.busqueda.idAforo.length>0)
                {
                    condiciones=condiciones+' AND afo.afo_ideregistro='+this.state.busqueda.idAforo;
                }
                if(this.state.busqueda.pcodigo.length>0)
                {
                    condiciones=condiciones+ ' AND dsus.dsus_pcodigo='+`'`+this.state.busqueda.pcodigo+`'`;
                }
                if(this.state.busqueda.pqrs.length>0)
                {
                    condiciones=condiciones+' AND afo.afo_numpqr='+this.state.busqueda.pqrs;
                }
                if(this.state.busqueda.terAforador.length>0)
                {
                    condiciones=condiciones+' AND afo.ter_aforador='+this.state.busqueda.terAforador;
                }
                if(this.state.busqueda.terCliente.length>0)
                {
                    condiciones=condiciones+' AND dsus.ter_ideregistro='+this.state.busqueda.terCliente;
                }

                ///sub
                if(this.state.busqueda.fechaInicio.length>0 && this.state.busqueda.fechaFinal.length>0)
                {
                    subCondiciones=subCondiciones+ ' AND dmaf.dmaf_fechavisita::DATE BETWEEN'+`'`+ this.state.busqueda.fechaInicio +`'`+ ' AND ' +`'`+ this.state.busqueda.fechaFinal+`'`;
                }

                let parametros={PR_STR_FECHA1:this.state.busqueda.fechaInicio,PR_STR_FECHA2:this.state.busqueda.fechaFinal,PR_STR_CONDICIONES:condiciones,PR_STR_SUB_CONDICIONES:subCondiciones,PR_STR_USUARIO:this.state.usuNombre,PR_INT_EMPRESA:this.state.idEmpresa,PR_STR_ROOT_PATH:basico.buscarParametro('url_reportes',this.state.configuracion).replace(/['"]+/g, '')};
                let modelo:JasperBridgeModel=new JasperBridgeModel(basico.buscarParametro('jdni_reportes',this.state.configuracion).replace(/['"]+/g, ''),'pdf',basico.buscarParametro('url_reportes',this.state.configuracion).replace(/['"]+/g, '')+nombreReporte+'.jrxml',this.state.idUsuario.toString(),this.state.password,parametros);
                let resultado=await api.generarDetalleAforo(modelo,basico.buscarParametro('url_api_reportes',this.state.configuracion).replace(/['"]+/g, ''));
                console.log('que envie ',parametros);

                let base64str=resultado.content;
                console.log('que llego del reporte ',resultado);
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
                if(blob.size<1000)
                {
                    this.llamarAlerta('warning', 'No hay Informacion para mostrar... ');
                }
                else
                {
                    var link=document.createElement('a');
                    link.href=window.URL.createObjectURL(blob);
                    link.download=nombreReporte+".pdf";
                    link.click();
                }
        }catch(e){
            this.setState({
                cargando:false
            })
            this.llamarAlerta('warning', 'No hay Informacion para mostrar... ');
        }


    }

    generarReporteLiquidacion=async()=>
    {
        try
        {
                let basico:basicoDefault=new basicoDefault();
                let api:reportesApi =new reportesApi();
                let condiciones=' ';
                let subCondiciones=' ';
                let nombreReporte='liquidacion_aforo';
                this.setState({
                    cargando:true
                })
                if(this.state.busqueda.idAforo.length>0)
                {
                    condiciones=condiciones+' AND afo.hafo_ideregistro='+this.state.busqueda.idAforo;
                }
                if(this.state.busqueda.pcodigo.length>0)
                {
                    condiciones=condiciones+ ' AND dsus.dsus_pcodigo='+`'`+this.state.busqueda.pcodigo+`'`;
                }
                if(this.state.busqueda.pqrs.length>0)
                {
                    condiciones=condiciones+' AND afo.hafo_numpqr='+this.state.busqueda.pqrs;
                }
                if(this.state.busqueda.terAforador.length>0)
                {
                    condiciones=condiciones+' AND afo.ter_aforador='+this.state.busqueda.terAforador;
                }
                if(this.state.busqueda.terCliente.length>0)
                {
                    condiciones=condiciones+' AND dsus.ter_ideregistro='+this.state.busqueda.terCliente;
                }

                let parametros={PR_STR_FECHA1:this.state.busqueda.fechaInicio,PR_STR_FECHA2:this.state.busqueda.fechaFinal,PR_STR_CONDICIONES:condiciones,PR_STR_SUB_CONDICIONES:subCondiciones,PR_STR_USUARIO:this.state.usuNombre,PR_INT_EMPRESA:this.state.idEmpresa,PR_STR_ROOT_PATH:basico.buscarParametro('url_reportes',this.state.configuracion).replace(/['"]+/g, '')};
                let modelo:JasperBridgeModel=new JasperBridgeModel(basico.buscarParametro('jdni_reportes',this.state.configuracion).replace(/['"]+/g, ''),'pdf',basico.buscarParametro('url_reportes',this.state.configuracion).replace(/['"]+/g, '')+nombreReporte+'.jrxml',this.state.idUsuario.toString(),this.state.password,parametros);
                let resultado=await api.generarDetalleAforo(modelo,basico.buscarParametro('url_api_reportes',this.state.configuracion).replace(/['"]+/g, ''));

                let base64str=resultado.content;
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
                if(blob.size<1000)
                {
                    this.llamarAlerta('warning', 'No hay Informacion para mostrar... ');
                }
                else
                {
                    var link=document.createElement('a');
                    link.href=window.URL.createObjectURL(blob);
                    link.download=nombreReporte+".pdf";
                    link.click();
                }
        }catch(e){
            this.setState({
                cargando:false
            })
            this.llamarAlerta('warning', 'No hay Informacion para mostrar... ');
        }
    }

    render() {

        const {
            preLiquidarStatus,
            suscripcion,
            idAforo,
            idMultiusuario,
            
            idTipoAforo,
            conceptoAforo,
            
            showAlert,messageAlert,
            ConfirmarLiquidacionStatus,
             idClaseAforo
        } = this.state
        

        return (
            <div>
                {this.mostrarCargando()}
                <hr/>
                <br/>
                <Card>
                    <Card.Header>Proceso de Liquidacion</Card.Header>
                    <Card.Body>
                        <Form className="mb-2"  >
                        <Form.Row>
                                <Form.Group md="3" as={Col} controlId="formGridState2">
                                    <Form.Label>Clase Aforo</Form.Label>
                                    <Form.Control as="select" name="idClaseAforo" value={idClaseAforo} onChange={this.handleChange} required>
                                        <option value="">-------</option>
                                        {
                                        this.state.claseSusAforoList.map((t: any, i: number) => {
                                            return <option key={i} value={t.id}> {t.object}</option>
                                        })
                                    } 
                                        </Form.Control>
                                </Form.Group>
                                <Form.Group md="3" as={Col} controlId="formGridState2">
                                    <Form.Label>Tipo Aforo</Form.Label>
                                    <Form.Control as="select" name="idTipoAforo" value={idTipoAforo} onChange={this.handleChange} required>
                                        <option value="">-------</option>
                                        {
                                        this.state.tipoAforoList.map((t: any, i: number) => {
                                            return <option key={i} value={t.id}> {t.object}</option>
                                        })
                                    } 
                                        </Form.Control>
                                </Form.Group>
                                    <Form.Group md="3" as={Col} controlId="formGridState2">
                                    <Form.Label  hidden={true}>Concepto Aforo</Form.Label>
                                    <Form.Control as="select" name="conceptoAforo" value={conceptoAforo} onChange={this.handleChange} required hidden={true}>
                                    <option value="">-------</option>
                                        {
                                        this.state.conceptoAforoList.map((t: any) => {
                                            return <option key={t.id} value={t.id}> {t.object}</option>
                                        })
                                        } 
                                        </Form.Control>
                                        </Form.Group>
                        </Form.Row>
                        
                        
                        <Form.Row>
                                <Form.Group md="3" as={Col} controlId="formGrid">
                                    <Form.Label>Suscripción </Form.Label>
                                    <Form.Control placeholder="Suscripcion" autoFocus name="suscripcion" value={suscripcion} onKeyDown={this._handleKeyDownSearch} onChange={this.handleChange} />
                                </Form.Group>
                                <Form.Group md="3" as={Col} controlId="formGri33">
                                    <Form.Label>Id Multiusuario</Form.Label>
                                    <Form.Control placeholder="Codigo Suscripcion" name="idMultiusuario" value={idMultiusuario} onKeyDown={this._handleKeyDownSearch} onChange={this.handleChange} />
                                </Form.Group>
                                <Form.Group md="3" as={Col} controlId="formGrid41">
                                    <Form.Label>Id Aforo</Form.Label>
                                    <Form.Control placeholder="Numero Aforo" name="idAforo" value={idAforo} onKeyDown={this._handleKeyDownSearch} onChange={this.handleChange}  />
                                </Form.Group>
                            </Form.Row>
                            <hr></hr>

                        </Form>
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
                            
                            <ButtonToolbar className="justify-content-center" style={{marginBottom:"30px"}}>
                                <Button variant="dark" className="mr-5" onClick={this._handlePreliquidar} disabled={preLiquidarStatus===false && !this.state.effectivePermissions?.CREATE===false ? false : true}>
                                <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                hidden={preLiquidarStatus}
                                />
                                    PreLiquidar</Button>
                                <Button variant="success" className="mr-5" onClick={this._handleLiquidarSus} disabled={ConfirmarLiquidacionStatus===false && !this.state.effectivePermissions?.CREATE===false ? false :true}> 
                                <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                hidden={ConfirmarLiquidacionStatus}
                                />
                                Confirmar Liquidación</Button>
                            </ButtonToolbar>
                        
                        <Table striped bordered hover responsive >
                                <thead className="tabla-header" style={{textAlign:"center"}}>
                                    <tr >
                                    <th >Suscripción</th>
                                    <th >ID Aforo</th>
                                    <th >Tipo Aforo</th>
                                    <th >Estado</th>
                                    <th >Mensaje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td  style={{textAlign:"center"}} >{this.state.TableidSuscripcion}</td>
                                        <td style={{textAlign:"center"}} >{this.state.TableidAforo}</td>
                                        <td style={{textAlign:"center"}} >{this.state.TabletipoAforo}</td>
                                        <td style={{textAlign:"center"}} >{this.state.Tableestado}</td>
                                        <td style={{textAlign:"center"}} >{this.state.Tablemensaje}</td>
                                                
                                    </tr>
                                
                                
                            
                                </tbody>
                        </Table>
                    </Card.Body>    
                </Card>
                <hr/>
                <br/>
                    <Card>
                        {this.mostrarAlerta()}
                        <Card.Header>
                            Reportes Liquidacion
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <div className="form-group">
                                        <label >Id Aforo</label>
                                        <input className="form-control" onChange={e=>this.cambioValorBusqueda(e)} name='idAforo' value={this.state.busqueda.idAforo} type='number' placeholder=""/>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-group">
                                        <label >Codigo Suscripcion</label>
                                        <input className="form-control" onChange={e=>this.cambioValorBusqueda(e)} name='pcodigo' value={this.state.busqueda.pcodigo} type='text' placeholder=""/>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="form-group">
                                        <label >Fecha Inicial</label>
                                        <input className="form-control" onChange={e=>this.cambioValorBusqueda(e)} name='fechaInicio' value={this.state.busqueda.fechaInicio} type='date' placeholder=""/>
                                    </div>
                                </Col>    
                                <Col>    
                                    <div className="form-group">
                                        <label >Fecha Final</label>
                                        <input className="form-control" onChange={e=>this.cambioValorBusqueda(e)} name='fechaFinal' value={this.state.busqueda.fechaFinal} type='date' placeholder=""/>
                                    </div>
                                </Col>
                            </Row> 
                            <Row>
                                <Col>
                                        <div className="form-group">
                                            <label >PQRS</label>
                                            <input className="form-control" onChange={e=>this.cambioValorBusqueda(e)} name='pqrs' value={this.state.busqueda.pqrs} type='text' placeholder=""/>
                                        </div>
                                </Col>         
                                <Col>
                                        <div className="form-group">
                                                                    <label>Tercero</label>
                                                                    <AsyncTypeahead
                                                                        id="basic-typeahead-single"
                                                                        labelKey="ter_nomcompleto"
                                                                        onChange={e=>this.cambioValorTercero(e)}
                                                                        options={this.state.terceros}
                                                                        placeholder="Elegir tercero..."
                                                                        selected={this.state.terceroSeleccion}
                                                                        minLength={3}
                                                                        isLoading={this.state.cargandoTercero}
                                                                        onSearch={this.buscarTercero}
                                                                        />  
                                        </div> 
                                </Col>
                                <Col>
                                        <div className="form-group">
                                                                    <label>Aforador</label>
                                                                    <select onChange={e=>this.cambioValorBusqueda(e)} className="form-control" name='terAforador' value={this.state.busqueda.terAforador} >
                                                                    <option> </option> 
                                                                        {
                                                                           this.state.aforadores.map((t: any, i: number) => {
                                                                                return <option key={i} value={t.id}> {t.object}</option>
                                                                            }
                                                                            )
                                                                        }
                                                                    </select>  
                                        </div> 
                                </Col>
                            </Row> 
                            <Row>
                                    <Col>
                                        <div className="form-group">
                                            <br></br>                
                                            <Button disabled={!this.state.effectivePermissions?.VIEW} variant="primary" onClick={this.generarReporteDetalle}>Detallado</Button>       
                                        </div>
                                    </Col>    
                                    <Col>
                                        <div className="form-group">
                                            <br></br>                
                                            <Button disabled={!this.state.effectivePermissions?.VIEW} variant="primary" onClick={this.generarReporteLiquidacion}>Liquidacion</Button>       
                                        </div>
                                    </Col>
                            </Row>                                                
                        </Card.Body>
                    </Card>              

            </div >
        )
    }
}

export default (Liquidacion)