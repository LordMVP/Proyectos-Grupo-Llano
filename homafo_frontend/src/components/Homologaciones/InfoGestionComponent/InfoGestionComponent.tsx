import React from 'react';
import { Container, Row, Col , Button , ListGroup , Form , InputGroup , Modal } from 'react-bootstrap';
//import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import paginationFactory from "react-bootstrap-table2-paginator";
import uniApi from '../../../api/homologaciones/UniUnidad';
import SesionApi from '../../../api/homologaciones/SesionApi';
import ArchivosApi from '../../../api/homologaciones/ArchivosApi';
import ModalGuardar from '../../../components/utils/ModalGuardar/ModalGuardar';
import ModalCargando from '../../../components/utils/ModalCargando/ModalCargando';
import homoApi from '../../../api/homologaciones/Homologacion';
import usuarioApi from '../../../api/homologaciones/UsuariosApi';
import { Typeahead } from 'react-bootstrap-typeahead';
//import RNImageToPdf from 'react-native-image-to-pdf';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import Alerta from '../../../components/utils/AlertaComponent/AlertaComponent';
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import GestionTablaModel from '../../../models/GestionTablaModel';
import BootstrapTable from "react-bootstrap-table-next";

interface IProps {
    value?: any,
    informacion?:any,
    guardarInfoGestion:(e:any)=>void,
    permisos?:any
}

class InfoGestionComponent extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state={
            value:'',
            estado:0,
            login:{
                usuario:'',//'jepoveda',
                contrasena:'',//'be958ab28f9200a407f51eab14dfc867',
                idEmpresa:322,//322,
                idUsuario:0
            },
            gestion:{
                fecha1:'',
                observaciones:'',
                visita:0,
                liquidacion:0,
                colaborador:0,
                archivos:[],
                dsus_ideregistr:0,
                dsus_pcodigo:'',
                parametros:[],
                usu_ideregistro:0,
                reclamo_numpqr:'',
                visitas:{}
            },
            busqueda:{
                desde:'',
                hasta:'',
                visita:0,
                liquidacion:0,
                colaborador:0,
                dsus_ideregistro:0
            },
            archivosTmp:[],
            listaNovedadVisita:[],
            listaNovedadLiquidacion:[],
            listaColaborador:[],
            estadoModalArchivo:false,
            imagenVer:null,
            busquedaGestion:[],
            busquedaAdjuntos:[],
            imagenVerAdjunto:null,
            estadoModal:false,
            cargando:false,
            usuarioSeleccion:[],
            reclamoSeleccion:[],
            listaReclamos:[],
            parametros:{},
            alerta:{
                variante:'',
                estado:false,
                valor:''
            },
            datosTabla:[],
            liquidacionSeleccion:[],
            visitaSeleccion:[],
            liquidacionBusSeleccion:[],
            visitaBusSeleccion:[],
            estadoDetallePqrs:false,
            listaNovedadesRadicado:[],
            listaCuadrillas:[],
            visitaspqrsNovedad:[],
            visitaspqrsCuadrilla:[],
            listaNovedadesReporte:[],
            visitasTmp:{
                fecha:'',
                novedad:'',
                cuadrilla:'',
                observaciones:'',
                reclamo_numpqr:'',
                novReporte:''
            },
            columnasTabla:[
                {
                    dataField: "gact_ideregistro",
                    text: "ID",
                    sort: true,
                    align: 'center',
                    hidden: true,
                    headerAlign: 'center',
                  },
                {
                dataField: "gact_fecgestion",
                text: "Fecha",
                align: 'center',
                headerAlign: 'center',
              },
              {
                dataField: "uni_vista",
                text: "Nov. Visita",
                align: 'center',
                headerAlign: 'center',
              },
              {
                dataField: "uni_liquidacion",
                text: "Nov. Liquidacion",
                align: 'center',
                headerAlign: 'center',
              },
              {
                dataField: "usuario_nom",
                text: "Colaborador",
                align: 'center',
                headerAlign: 'center',
              },
              {
                dataField: "reclamo_numpqr",
                text: "N° PQRS",
                align: 'center',
                headerAlign: 'center',
              },
              {
                dataField: "gact_observaciones",
                text: "Observaciones",
                align: 'center',
                headerAlign: 'center',
              },
              {
                dataField: "novedad_rep",
                text: "Novedad",
                align: 'center',
                headerAlign: 'center'
              },
              {
                dataField: "adjuntos",
                text: "Adjuntos",
                align: 'center',
                headerAlign: 'center',
                formatter: (rowContent, row) => {
                    return (    
                        <Button variant="success" key={rowContent} onClick={this.seleccion.bind(this,row)}>Adjuntos</Button>
                    )
                  }
              }
            ]
        };
        //this.formatoBotton=this.formatoBotton.bind(this);
    }

    async componentDidMount() {
        await this.cargarDatosSesion();
        await this.cargarParametros();
        await this.cargarDefecto();
        await this.autocompletarUnidades(this.state.listaNovedadVisita, 'listaNovedadVisita');
        await this.autocompletarUnidades(this.state.listaNovedadLiquidacion, 'listaNovedadLiquidacion');
    }

    cargarDatosSesion=async()=>
    {
       let basico:basicoDefault=new basicoDefault();
       let resultado=basico.extraerInfoToken(localStorage.getItem('token')); 
        await this.setState({
            idUsuario:resultado.idUsuario,
            idEmpresa:resultado.idEmpresa,
            login:{
                ...this.state.login,idEmpresa:resultado.idEmpresa,idUsuario:resultado.idUsuario
            },
            gestion:{
                ...this.state.gestion,usu_ideregistro:resultado.idUsuario
            },
        })
    }

    cargarDefecto=async()=>
    {
        try
        {
            let api:uniApi =new uniApi();
            let usuApi:usuarioApi=new usuarioApi();
            let apiHomo:homoApi =new homoApi();
            let tmpVisita=await api.datosUnidades(parseInt(this.buscarParametro('clase_novedad_visita')),this.state.login.idEmpresa);
            let tmpLiquidacion=await api.datosUnidades(parseInt(this.buscarParametro('clase_novedad_liquidacion')),this.state.login.idEmpresa);
            let tmpUsu=await usuApi.listaUsuarios();
            let tmpreclamos=await apiHomo.informacionReclamos(this.props.informacion.dsus_ideregistr,this.state.login.idEmpresa);
            let tmp6=await apiHomo.listaNovedadesRadicado();
            let tmp7=await apiHomo.listaCuadrillas();
            let tmp8=await apiHomo.listaNovedadesReporte();
            var d = new Date();
            await this.setState({
                listaNovedadVisita:tmpVisita.data.filter(item => item.uni_estado === 'A'),
                listaNovedadLiquidacion:tmpLiquidacion.data.filter(item => item.uni_estado === 'A'),
                gestion:this.props.informacion,
                listaColaborador:tmpUsu.data,
                listaReclamos:tmpreclamos.data,
                busqueda:{
                    ...this.state.busqueda,dsus_ideregistro:this.props.informacion.dsus_ideregistr
                },
                listaNovedadesRadicado:tmp6.data,
                listaCuadrillas:tmp7.data,
                listaNovedadesReporte:tmp8.data,
                visitasTmp:{
                    ...this.state.visitasTmp,fecha:new Date().getFullYear()+'-'+((d.getMonth()+1)<10 ? ('0'+(d.getMonth()+1)) : d.getMonth()+1) +'-'+d.getDate()
                }
            })

        }catch(e){console.log(e)}
    }

    cargarParametros=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            parametros:tmp.data
        })
    }

    buscarParametro=(llave)=>
    {
        let resultado='';
        for(var indice in this.state.parametros)
        {
            
            let tmp=this.state.parametros[indice];
            let tmp2=tmp[llave];
            if(tmp2!=undefined)
            {
                resultado=tmp2;
            }
        }
        return resultado;
    }

    autocompletarUnidades=async(lista:any,nombreLista:string)=>
    {
        for(var indice in lista )
        {
            lista[indice].uni_nombre1=lista[indice].uni_codigo1+' - '+lista[indice].uni_nombre1;
        }
        await this.setState({
            [nombreLista]:lista
        })

    }

    async cambioValor(e: any)
    {
        const {value, name}=e.target;
        await this.setState({
            gestion:{
                ...this.state.gestion,[name]:value
            }
        })
        if(name==='fecha1')
        {
            await this.setState({
                visitasTmp:{
                    ...this.state.visitasTmp,'fecha':value
                }
            })  
        }
    }

    async cambioValorBusqueda(e: any)
    {
        const {value, name}=e.target;
        await this.setState({
            busqueda:{
                ...this.state.busqueda,[name]:value,dsus_ideregistro:this.state.gestion.dsus_ideregistr
            }
        })
        
    }

    cambioValorVisitaBus=(e:any)=>
    {
        if(e[0]!==undefined)
        {
            this.setState({
                busqueda:{
                    ...this.state.busqueda,visita:e[0].uni_ideregistro,
                    dsus_ideregistro:this.state.gestion.dsus_ideregistr
                },
                visitaBusSeleccion:[e[0]]
            })
        }
        else
        {
            this.setState({
                visitaBusSeleccion:[]
            })
        }
    }

    cambioValorLiquidacionBus=(e:any)=>
    {
        if(e[0]!==undefined)
        {
            this.setState({
                busqueda:{
                    ...this.state.busqueda,liquidacion:e[0].uni_ideregistro,
                    dsus_ideregistro:this.state.gestion.dsus_ideregistr
                },
                liquidacionBusSeleccion:[e[0]]
            })
        }
        else
        {
            this.setState({
                liquidacionBusSeleccion:[]
            })
        }
    }

    cambioFile=async(e:any)=>
    {
        let tmp = e.target.files;
        //let tmp = e.target.files[0];
        //console.log('que archuivos tengo...');
        let archivosArray = Array.prototype.slice.call(tmp);
        //console.log(archivosArray);
        if(this.validarArchivosCarga(archivosArray)>0)
        {
            //alert('error al cargar archivos, esta incumpliendo algunos de los requisitos...');
            this.llamarAlerta('warning', 'error al cargar archivos, esta incumpliendo algunos de los requisitos...');
        }
        else
        {
            await this.setState({ 
                archivosTmp: [...this.state.archivosTmp, ...archivosArray]
            });
        }        
        /*        
        await this.setState({
            gestion:{
                ...this.state.gestion,archivos:this.state.archivosTmp
            }
        })
        */
    }

    validarArchivosCarga=(e)=>
    {
        let cuenta=0;
        let tamano=0;
        let tipo=0;
        let total=0;
        for(var indice in e)
        {
            if(e[indice].size/(1024*1024) > parseInt(this.buscarParametro('tamano_documento_adjuntar_MB')))
            {
                tamano=tamano+1;
            }
            if(JSON.parse(this.buscarParametro('tipo_documento_adjuntar')).indexOf(e[indice].type)<0)
            {
                tipo=tipo+1;
            }
        }
        if(e.length+this.state.archivosTmp.length>parseInt(this.buscarParametro('cantidad_documentos_adjuntar')))
        {
            cuenta=cuenta+1;
        }

        if(cuenta>0 || tamano>0 || tipo>0)
        {
            total=1;
        }
        return total;
    }

    async removerArchivo(f:any) {
        await this.setState({ archivosTmp: this.state.archivosTmp.filter(x => x !== f) });
        /*
        await this.setState({
            gestion:{
                ...this.state.gestion,archivos:this.state.archivosTmp
            }
        })
        */ 
    }

    cambioValorUsuarios=(e:any)=>
    {
        if(e[0]!==undefined)
        {
            this.setState({
                busqueda:{
                    ...this.state.busqueda,colaborador:e[0].usu_ideregistro,dsus_ideregistro:this.state.gestion.dsus_ideregistr
                },
                usuarioSeleccion:[e[0]]
            })
        }
        else
        {
            this.setState({
                usuarioSeleccion:[]
            })
        }
    }

    cambioValorReclamo=(e:any)=>
    {
        if(e[0]!==undefined)
        {
            this.setState({
                gestion:{
                    ...this.state.gestion,reclamo_numpqr:e[0].reclamo_numpqr
                },
                reclamoSeleccion:[e[0]]
            })
        }
        else
        {
            this.setState({
                reclamoSeleccion:[]
            })
        }
    }

    cambioValorVisita=(e:any)=>
    {
        if(e[0]!==undefined)
        {
            this.setState({
                gestion:{
                    ...this.state.gestion,visita:e[0].uni_ideregistro
                },
                visitaSeleccion:[e[0]]
            })
        }
        else
        {
            this.setState({
                visitaSeleccion:[]
            })
        }
    }

    cambioValorLiquidacion=(e:any)=>
    {
        if(e[0]!==undefined)
        {
            this.setState({
                gestion:{
                    ...this.state.gestion,liquidacion:e[0].uni_ideregistro
                },
                liquidacionSeleccion:[e[0]]
            })
        }
        else
        {
            this.setState({
                liquidacionSeleccion:[]
            })
        }
    }

    cambioValorVisitasPqrs=async(e:any)=>
    {
        const {value, name}=e.target;
        await this.setState({
            visitasTmp:{
                ...this.state.visitasTmp,[name]:value
            },
            gestion:{
                ...this.state.gestion,visitas:this.state.visitasTmp
            }
        })
    }

    cambioValorVisitasPqrs2=(id:string,seleccion:string,e:any)=>
    {
        
        if(e[0]!==undefined)
        {
            this.setState({
                visitasTmp:{
                    ...this.state.visitasTmp,[id]:e[0].codigo
                },
                [seleccion]:[e[0]],
                gestion:{
                    ...this.state.gestion,visitas:this.state.visitasTmp
                }
            })
        }
        else
        {
            this.setState({
                [seleccion]:[]
            })
        }
        
    }

    verImagen=(e:any)=>
    {
        //console.log(e);
        this.setState({
            imagenVer: URL.createObjectURL(e)
        })
    }

    adjuntarImagenes=async()=>
    {
        this.setState({
            cargando:true
        })
        let sesionApi:SesionApi=new SesionApi();
        let archivosApi:ArchivosApi=new ArchivosApi();
        let tmp=await sesionApi.registrar(this.state.login);
        let login=tmp.data;
        for(var indice in this.state.archivosTmp)
        {            
            const data = new FormData();
            data.append('archivo', this.state.archivosTmp[indice]);
            data.append('token', login.statusText);
            let ingreso= await archivosApi.cargarArchivo(data);                       
            this.setState({
                gestion:{
                    ...this.state.gestion,archivos:[...this.state.gestion.archivos,ingreso.data.idAz]
                }

            })        
        }
        this.setState({
            cargando:false
        })
    }

    guardar=async()=>
    {
       await this.adjuntarImagenes();
       await this.setState({
        visitasTmp:{
            ...this.state.visitasTmp,observaciones:this.state.gestion.observaciones,reclamo_numpqr:this.state.gestion.reclamo_numpqr
        },  
        estadoModal:false
       })
       if(this.state.gestion.reclamo_numpqr.length>0)
       {
            await this.setState({
                gestion:{
                    ...this.state.gestion,visitas:this.state.visitasTmp
                }
            })
       }
       await this.props.guardarInfoGestion(this.state.gestion);
    }

    validarGuardar=()=>
    {
        if(this.state.gestion.fecha1.length===0 || this.state.gestion.visita===0 || this.state.gestion.liquiacion===0 || this.state.gestion.observaciones.length===0 || !this.props.permisos || this.validarGuardarDetalles())
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    validarGuardarDetalles=()=>
    {
        if(this.state.gestion.reclamo_numpqr.length>0 && this.state.visitasTmp.novedad.length===0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    buscar=async()=>
    {
        //console.log('que tiene busqueda ',this.state.busqueda);
        await this.setState({
            datosTabla:[],
            cargando:true
        })
        let apiHomo:homoApi =new homoApi();
        let tmp=await apiHomo.buscarGestion(this.state.busqueda);
        await this.setState({
            busquedaGestion:tmp.data,
            cargando:false
        })
        for(let item in this.state.busquedaGestion)
        {
            let modelo1:GestionTablaModel=new GestionTablaModel(this.state.busquedaGestion[item].gact_fecgestion,this.state.busquedaGestion[item].uni_vista,this.state.busquedaGestion[item].uni_liquidacion,this.state.busquedaGestion[item].usuario_nom,this.state.busquedaGestion[item].reclamo_numpqr,this.state.busquedaGestion[item].gact_observaciones,this.state.busquedaGestion[item].gact_ideregistro,this.state.busquedaGestion[item].novedad_rep);
            await this.setState({
                datosTabla:[...this.state.datosTabla,modelo1]
            })
        }
        console.log('datos tabla ',this.state.datosTabla);
    }

    buscarArchivos=async(e:any)=>
    {
        let base64Paths:String[] = [];
        let sesionApi:SesionApi=new SesionApi();
        let archivosApi:ArchivosApi=new ArchivosApi();
        let tmp=await sesionApi.registrar(this.state.login);
        let login=tmp.data;
        for(var indice in e.archivos)
        {
            let buscar= await archivosApi.buscarArchivo({idArchivo:e.archivos[indice],token:login.statusText});
            let datos=buscar.data.datos;
            base64Paths.push('data:'+datos.tipo+';base64,'+datos.contenido);
        }

        let opciones = {
            imagePaths: base64Paths,
            name:'Adjuntos'
        };
        return opciones;
    }

    generarPdf=async(e:any)=>
    {
        let sesionApi:SesionApi=new SesionApi();
        let archivosApi:ArchivosApi=new ArchivosApi();
        let tmp=await sesionApi.registrar(this.state.login);
        let login=tmp.data;
        let tmp2=await archivosApi.generarPdf({gactIderegistro:e.gact_ideregistro,token:login.statusText});
        let pdf=tmp2.data;
        if(pdf.statusCode===200)
        {
        ///descargar
        var binary = atob(pdf.statusText.replace(/\s/g, ''));
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
              
        var blob = new Blob( [view], { type: "application/pdf" }); 
        
        var link=document.createElement('a');
       link.href=window.URL.createObjectURL(blob);
       link.download="Adjuntos.pdf";
       link.click();

        }
        if(pdf.statusCode===400)
        {
            //alert(pdf.statusText);
            this.llamarAlerta('warning', pdf.statusText);
        }
        if(pdf.statusCode===500)
        {
            //alert('Error generacion PDF, consulta con el Area de Tecnologia...');
            this.llamarAlerta('danger', 'Error generacion PDF, consulta con el Area de Tecnologia...');
        }
        

    }

    seleccion=async(e:any)=>
    {      
        try
        {
            await this.setState({
                cargando:true
            })            
            await this.generarPdf(e);
            await this.setState({
                cargando:false
            })
        }catch(e){
            console.log('estoy en error '+e);
            this.setState({
                cargando:false
            })
        }
        
    }

    llamarAlerta = (tmp1: string, tmp2: string) => {
        this.setState({
            alerta: {
                ...this.state.basico, estado: true, variante: tmp1, valor: tmp2
            }
        })
        setTimeout(() => {
            this.setState({
                alerta: {
                    ...this.state.basico, estado: false, variante: '', valor: ''
                }
            })
        }, 3000);
    }

    formatoBotton=( cell:any,row:any)=>
    {
        return <Button variant="success" key={cell} onClick={this.seleccion.bind(this,row)}>Adjuntos</Button>;
    }

    mostrarModal=(): any=>
    {
        if(this.state.estadoModal)
        {
            return(
                <ModalGuardar guardar={this.guardar} cerrar={()=>this.setState({estadoModal:false})}/>
            )
        }
    }

    mostrarCargando = (): any => {
        if (this.state.cargando) {
            return (
                <ModalCargando estado={this.state.cargando}></ModalCargando>
            )
        }
    }

    mostrarAlerta = (): any => {
        if (this.state.alerta.estado) {
            return (
                <Alerta informacion={this.state.alerta}></Alerta>
            )
        }
    }

    detallesPqrs=()=>
    {
        console.log('di ver...');
        this.setState({
            estadoDetallePqrs:true
        })
    }

    mostrarDetallePqrs=(): any=>
    {
            return(
                <div>
                    <Modal show={this.state.estadoDetallePqrs} onHide={()=>{this.setState({estadoDetallePqrs:false})}}>
                        <Modal.Header closeButton>
                        <Modal.Title>Detalle Visita</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col>
                                        <div className="form-group">
                                                    <label >Fecha</label>
                                                    <input className="form-control" disabled={true} onChange={e=>this.cambioValorVisitasPqrs(e)} name='fecha' value={this.state.visitasTmp.fecha} type='date' placeholder=""/>
                                        </div>
                                </Col>
                            </Row>    
                            <Row>
                                <Col>
                                    <div className="form-group">
                                                <label >Novedad</label>                                                
                                                <Typeahead
                                                            id="basic-typeahead-novRadi"
                                                            labelKey="nombreCompleto"
                                                            onChange={e=>this.cambioValorVisitasPqrs2('novedad','visitaspqrsNovedad',e)}
                                                            options={this.state.listaNovedadesRadicado}
                                                            placeholder="Elegir Novedad..."
                                                            selected={this.state.visitaspqrsNovedad}
                                                            name='pqrsNov'
                                                            />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="form-group">
                                        <label>Novedad Reporte</label>
                                        <select onChange={e=>this.cambioValorVisitasPqrs(e)} className="form-control" name='novReporte' value={this.state.visitasTmp.novReporte}>
                                                                <option value="--" key="0"></option>
                                                                {this.state.listaNovedadesReporte.map((e : any, key : number) => {
                                                                return <option key={key} value={e.codigo}>{e.codigo} - {e.nombre}</option>;
                                                                })}
                                                </select>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="form-group">
                                                <label >Cuadrilla</label>                                                
                                                <Typeahead
                                                            id="basic-typeahead-cuaRadi"
                                                            labelKey="nombreCompleto"
                                                            onChange={e=>this.cambioValorVisitasPqrs2('cuadrilla','visitaspqrsCuadrilla',e)}
                                                            options={this.state.listaCuadrillas}
                                                            placeholder="Elegir Novedad..."
                                                            selected={this.state.visitaspqrsCuadrilla}
                                                            name='pqrsCua'
                                                            />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="form-group">
                                            <label >Observaciones</label>
                                            <textarea className="form-control" disabled={true} onChange={e=>this.cambioValor(e)} name='observaciones' value={this.state.gestion.observaciones} rows={3} placeholder=""/>            
                                    </div>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={()=>{this.setState({estadoDetallePqrs:false})}}>
                            Cerrar
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )
    }

    renderEstado = (): any => {
        switch (this.state.estado)
        {
            case 0:
                return (
                    <div>
                        {this.mostrarAlerta()}
                        {this.mostrarModal()}
                        {this.mostrarCargando()}
                        {this.mostrarDetallePqrs()}
                <Container>
                    <Row>
                        <Col>
                                <div className="form-group">
                                            <label >Fecha</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='fecha1' value={this.state.gestion.fecha1} type='date' placeholder=""/>
                                </div>
                        </Col>
                        <Col>
                                <div className="form-group">
                                            <label >Novedad de Visita</label>
                                            <Typeahead
                                                            id="basic-typeahead-visita"
                                                            labelKey="uni_nombre1"
                                                            onChange={e=>this.cambioValorVisita(e)}
                                                            options={this.state.listaNovedadVisita}
                                                            placeholder="Elegir Novedad Visita..."
                                                            selected={this.state.visitaSeleccion}
                                                            />
                                </div>
                        </Col>
                    </Row>
                    <Row>    
                        <Col>
                                <div className="form-group">
                                            <label >Novedad Liquidacion</label>
                                            <Typeahead
                                                            id="basic-typeahead-liquidacion"
                                                            labelKey="uni_nombre1"
                                                            onChange={e=>this.cambioValorLiquidacion(e)}
                                                            options={this.state.listaNovedadLiquidacion}
                                                            placeholder="Elegir Novedad Liquidacion..."
                                                            selected={this.state.liquidacionSeleccion}
                                                            />
                                </div>
                        </Col>
                        <Col>
                            
                                            <div className="form-group">
                                                        <label >PQRS {this.state.gestion.reclamo_numpqr.length>0 ? <label style={{color: 'Teal'}}> (Debe Diligenciar detalles para Guardar la gestion...)</label> : null }</label>
                                                        <InputGroup >
                                                                <Typeahead
                                                                    id="basic-typeahead-single"
                                                                    labelKey="reclamo_numpqr"
                                                                    onChange={e=>this.cambioValorReclamo(e)}
                                                                    options={this.state.listaReclamos}
                                                                    placeholder="Elegir PQRS..."
                                                                    selected={this.state.reclamoSeleccion}
                                                                    />
                                                                <InputGroup.Append>
                                                                    <Button disabled={this.state.gestion.reclamo_numpqr.length>0 ? false : true} onClick={this.detallesPqrs} variant="outline-info">Detalles</Button>
                                                                </InputGroup.Append> 
                                                        </InputGroup>
                                            </div>                                           
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                                <div className="form-group">
                                        <label >Observaciones</label>
                                        <textarea className="form-control" onChange={e=>this.cambioValor(e)} name='observaciones' value={this.state.gestion.observaciones} rows={3} placeholder=""/>            
                                </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                                <div className="form-group">
                                                <label >Cant Max Archivos {this.buscarParametro('cantidad_documentos_adjuntar')} -Tam Max Archivo MB {this.buscarParametro('tamano_documento_adjuntar_MB')}</label>        
                                            <Form.File label="Cargar Archivos" data-browse="Buscar" multiple onChange={this.cambioFile} custom/>
                                </div>
                        </Col>
                        <Col sm={6}>
                                <div className="form-group">
                                    <ListGroup>
                                    {this.state.archivosTmp.map(x => 
                                           <ListGroup.Item  as="li">
                                               <Row>
                                                   <Col md={6}>
                                                        {x.name}
                                                   </Col>
                                                   <Col md={2}>
                                                        <Button variant="outline-primary" onClick={()=>this.verImagen(x)}>Ver</Button>
                                                   </Col>
                                                   <Col md={2}>
                                                        <Button variant="outline-danger" onClick={this.removerArchivo.bind(this, x)}>Eliminar</Button>
                                                   </Col>
                                               </Row>                                                                            
                                           </ListGroup.Item>
                                            )}
                                    </ListGroup>
                                </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                                <div className="form-group">
                                        <img style={{ width: "100%" }} src={this.state.imagenVer} />
                                </div>
                                <div>
                                {this.state.imagenVer && (<div className="form-group" style={{ textAlign: "center" }}><Button variant="outline-warning" onClick={()=>this.setState({imagenVer:null})}>Cerrar</Button>
                                    </div>
                                    )}
                                </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                                <div className="form-group">
                                    <Button variant="primary" onClick={()=>this.setState({estadoModal:true})} disabled={this.validarGuardar()}>Guardar</Button>
                                </div>
                        </Col>
                        <Col>
                                <div className="form-group">
                                        <Button variant="primary" onClick={()=>this.setState({estado:1})}>Consultar</Button>
                                </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            )
            case 1:
                return(
                    <div>
                        {this.mostrarAlerta()}
                        {this.mostrarCargando()}
                        <Container>
                            <Row>
                                    <Col>
                                            <div className="form-group">
                                                        <label >Desde</label>
                                                        <input className="form-control" onChange={e=>this.cambioValorBusqueda(e)} name='desde' value={this.state.busqueda.desde} type='date' placeholder=""/>
                                            </div>
                                    </Col>
                                    <Col>
                                            <div className="form-group">
                                                        <label >Hasta</label>
                                                        <input className="form-control" onChange={e=>this.cambioValorBusqueda(e)} name='hasta' value={this.state.busqueda.hasta} type='date' placeholder=""/>
                                            </div>
                                    </Col>        
                                    <Col>
                                            <div className="form-group">
                                                        <label >Novedad de Visita</label>
                                                        <Typeahead
                                                            id="basic-typeahead-visita"
                                                            labelKey="uni_nombre1"
                                                            onChange={e=>this.cambioValorVisitaBus(e)}
                                                            options={this.state.listaNovedadVisita}
                                                            placeholder="Elegir Novedad Visita..."
                                                            selected={this.state.visitaBusSeleccion}
                                                            />
                                            </div>
                                    </Col>
                                    <Col>
                                            <div className="form-group">
                                                        <label >Novedad Liquidacion</label>
                                                        <Typeahead
                                                            id="basic-typeahead-liquidacion"
                                                            labelKey="uni_nombre1"
                                                            onChange={e=>this.cambioValorLiquidacionBus(e)}
                                                            options={this.state.listaNovedadLiquidacion}
                                                            placeholder="Elegir Novedad Liquidacion..."
                                                            selected={this.state.liquidacionBusSeleccion}
                                                            />
                                            </div>
                                    </Col>
                            </Row>
                            <Row>
                                    <Col>
                                            <div className="form-group">
                                                        <label >Colaborador</label>
                                                        <Typeahead
                                                            id="basic-typeahead-single"
                                                            labelKey="usuario_nom"
                                                            onChange={e=>this.cambioValorUsuarios(e)}
                                                            options={this.state.listaColaborador}
                                                            placeholder="Elegir Colaborador..."
                                                            selected={this.state.usuarioSeleccion}
                                                            />
                                            </div>
                                    </Col>
                            </Row>
                            <Row>
                                    <Col>
                                        <div className="form-group">
                                                <label ></label>
                                                <Button variant="primary" onClick={this.buscar}>Buscar</Button>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                                <label ></label>
                                                <Button variant="primary" onClick={()=>this.setState({estado:0})}>Regresar</Button>
                                        </div>
                                    </Col>
                            </Row>
                            <Row>
                                <Col>
                                        <div className="table-responsive">
                                        <BootstrapTable data={this.state.datosTabla} keyField='gact_fecgestion' columns={ this.state.columnasTabla }
                                        bootstrap4
                                        striped={true}
                                        hover={true}
                                        pagination={paginationFactory({})}
                                        data-mobile-responsive="true"
                                        wrapperClasses="table"
                                        noDataIndication="No Hay Informacion..."
                                        />                             
                                        </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                )
        }
    }

    render() {
        return(
            <div>
                {this.renderEstado()}
            </div>
        )
    }
}
export default InfoGestionComponent;



