import * as React from 'react';
import {Button , Col, Card, Accordion , Row,Container} from 'react-bootstrap';
//import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { TableHeaderColumn} from 'react-bootstrap-table';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import CardAccordionBasic from '../../../components/utils/CardAccordionBasic/CardAccordionBasic';
import homoApi from '../../../api/homologaciones/Homologacion';
import { trackPromise } from "react-promise-tracker";
import Cargando from '../../../components/utils/Cargando';
import uniApi from '../../../api/homologaciones/UniUnidad';
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import EmpresasApi from "../../../api/homologaciones/Empresas";
import { toast } from 'react-toastify';
//import ModalGuardar from "../../../components/utils/ModalGuardar/ModalGuardar";
import ModalInfoSuscripcion from '../ModalGuardar/ModalInfoSuscripcion';
import TableFormatoBootstrapExport from '../../../components/utils/TableFormatoBootstrapExport/TableFormatoBootstrapExport';
import { Suspense } from 'react'

interface IProps{
    valorkey:any,
    datos:any[],
    editar:(value : any)=>void,
    encabezado:string[],
    datosLogin:{},
    datosParametros:{}
}

interface SuscripcionOpr{
    susIderegistro:number,
    terDocumento:string,
    empIderegistro:number,
    barrioNom:string,
    tipoLiquidacion:number,
    tipoUso:number,
    estrato:number
}

interface HomologacionInf{
    nuevoConvenio?:number,
    nombreNuevoConvenio?:string,
    nuevoTercero?:number,
    usuario?:number,
    empresaHomologa?:number,
    periodoHomologa?:number,
    dsusHomologa?:number,
    dsusHomologador?:number,
    empresaHomologador?:number,
    pcodigoHomologador?:string,
    suscripcion1?:number,
    suscripcion2?:number,
    consumo?:string,
    consumomap?:[],
    medidor?:string,
    observaciones?:string,
    deshomologacion?:boolean

}

class TableCruceHomologacion extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            valorSeleccion:{},
            value:'',
            paginador:[],
            estadoDetalle:false,
            seleccionDatos:{},
            encabezadoLista:['Codigo','Identificacion','Nombres','Direccion','Catastral','Estrato','Ciclo','Clase','Fecha'],
            listaResultado:[],
            busqueda:[],
            expanded: [],
            listaEstados:[],
            login:{},
            parametros:{},
            columnasTabla:[                
                {
                    dataField: "Editar",
                    text: "Editar",
                    align: 'center',
                    formatter: (rowContent, row) => {
                        return (    
                            <Button variant="success" key={rowContent} onClick={this.seleccion.bind(this,row)}>Editar</Button>
                        )
                      },
                      headerAlign: 'center',
                      hidden:true  
                },                
                {
                    dataField: "Codigo",
                    text: "Codigo",
                    sort: true,
                    align: 'center',
                    headerAlign: 'center'
                    //hidden: true
                  },
                  {
                    dataField: "Identificacion",
                    text: "Identificacion",
                    sort: true,
                    align: 'center',
                    headerAlign: 'center'
                    //hidden: true
                  },
                  {
                    dataField: "Nombres",
                    text: "Nombres",
                    sort: true,
                    align: 'center',
                    headerAlign: 'center'
                    //hidden: true
                  },
                  {
                    dataField: "Direccion",
                    text: "Direccion",
                    sort: true,
                    align: 'center',
                    headerAlign: 'center'
                    //hidden: true
                  },
                  {
                    dataField: "Convenio",
                    text: "Convenio",
                    sort: true,
                    align: 'center',
                    headerAlign: 'center'
                    //hidden: true
                  },
                  {
                    dataField: "Barrio",
                    text: "Barrio",
                    sort: true,
                    align: 'center',
                    headerAlign: 'center'
                    //hidden: true
                  },
                  {
                    dataField: "Clase",
                    text: "Tipo Uso",
                    sort: true,
                    align: 'center',
                    headerAlign: 'center'
                    //hidden: true
                  },
                  {
                    dataField: "Catastral",
                    text: "Catastral",
                    sort: true,
                    align: 'center',
                    headerAlign: 'center'
                    //hidden: true
                  },
                  {
                    dataField: "Ciclo",
                    text: "Ciclo",
                    sort: true,
                    align: 'center',
                    headerAlign: 'center'
                    //hidden: true
                  },
                  /*                  
                  {
                    dataField: "Ver",
                    text: "Ver",
                    align: 'center',
                    headerAlign: 'center',
                    formatter: (rowContent, row) => {
                        return (    
                            <Button variant="primary" key={rowContent} onClick={ this.seleccion2.bind(this,row)} >Ver</Button>
                        )
                      }
                }
                */
            ],
            estadoModal:false,
            liquidaciones:[],
            tipoUso:[],
            estratos:[]
        };
        this.getEncabezado=this.getEncabezado.bind(this);
        this.formatoBotton=this.formatoBotton.bind(this);
        this.formatoBottonVer=this.formatoBottonVer.bind(this);
    }

    async componentDidMount() 
    {
        await this.setState({
            login:this.props.datosLogin,
            parametros:this.props.datosParametros
        })
        await this.buscarExport();
        await this.getEncabezado();
        await this.getValores();
        await this.cargarDatosInfoSuscripcion();
    }

    buscarExport = async ()=>{
        //let api: homoApi = new homoApi();
        /*let tmp:any = await trackPromise(api.buscarCruceInformacion({catastral:fila.Catastral,tercero:fila.Identificacion,direccion:fila.Direccion,empresa:this.state.login.idEmpresa,dsusIderegistro:fila.Dsuscripcion}));
        //console.log('Buscando los datos para exportar ',tmp.data);
        if(tmp.data.length===1)
        {
            let dsus=tmp.data[0];
            await this.setState({
                listaResultado: tmp.data,  
            })
            //this.editarHomo(dsus)
        }
        else
        {
            await this.setState({
                listaResultado: tmp.data,
                estado: 1,
                cargando:false
                //!this.state.vistaLista
                //vistaEditar:false           
            })
        }*/
            await this.setState({
                listaResultado: this.props.datos,  
            })
            
    }

    formatoBotton( cell:any,row:any)
    {
        console.log(cell);
        return <Button variant="success" key={cell} onClick={ this.seleccion.bind(this,row)}>Editar</Button>;
    }

    formatoBottonVer( cell:any,row:any)
    {
        console.log(cell);
        return <Button variant="primary" onClick={ this.seleccion2.bind(this,row)} >Ver</Button>;
    }

    formatoGeneral(cell:any)
    {  
        return cell.tipDescripcion;
    }

    formatoGeneral2(cell:any)
    {
        let resultado='';
        for(let tmp in cell)
        {
            if(typeof cell[tmp] === 'string')
            {
                resultado=cell[tmp];
            }
        }
        return resultado;
        
        
    }

    seleccion(e:any)
    {
        //this.props.editar(e);
        console.log(e);
        this.props.editar(e);
    }

    async seleccion2(e:any)
    {
        //this.props.editar(e);
        console.log(e);
        /*
        let api: homoApi = new homoApi();
        let tmp:any = await trackPromise(api.buscarCruceInformacion({catastral:e.Catastral,tercero:e.Identificacion,direccion:e.Direccion,empresa:this.state.login.idEmpresa}));
        this.setState({
            seleccionDatos:e,
            busqueda:tmp.data,
            estadoDetalle:true,
            expandible:false
        })
        */
    }

    actualizarSeleccion=async(pcodigo)=>
    {        
        let fila=this.props.datos.find(item=> item.Codigo===pcodigo);
        //console.log(fila.Codigo);
        //console.log('que tiene fila ',fila);
        let api: homoApi = new homoApi();
        let tmp:any = await trackPromise(api.buscarCruceInformacion({catastral:fila.Catastral,tercero:fila.Identificacion,direccion:fila.Direccion,empresa:this.state.login.idEmpresa,dsusIderegistro:fila.Dsuscripcion}));
        this.setState({
            seleccionDatos:fila,
            busqueda:tmp.data,
            estadoDetalle:true,
            expandible:false
        })
    }

    actualizarSeleccion2=async(objeto)=>
    {        
        //console.log(fila.Codigo);
        //console.log('que tiene fila ',fila);
        console.log("llegando Objeto",objeto)
        let api: homoApi = new homoApi();
        let tmp:any = await trackPromise(api.buscarCruceInformacion({catastral:objeto.Catastral,tercero:objeto.Identificacion,direccion:objeto.Direccion,empresa:this.state.login.idEmpresa,dsusIderegistro:objeto.Dsuscripcion,empresaAlt:objeto.EmpIderegistro ? objeto.EmpIderegistro : 317}));
        this.setState({
            seleccionDatos:objeto,
            busqueda:tmp.data,
            estadoDetalle:true,
            expandible:false
        })
        console.log('que tiene busqueda ',this.state.busqueda);
    }

    getEncabezado()
    {
        var encabezado = this.props.encabezado;
        return encabezado.map((row : any, index : number)=>{
            var tmp=row;
            var tmp2=tmp.lastIndexOf(".");
            if(tmp2>0)
            {
                let nombre1=row.substring(0, tmp2);
                return <TableHeaderColumn key={index} dataAlign="center"  dataField={nombre1} dataFormat={this.formatoGeneral2} dataSort={true} >
                    {nombre1}
                    </TableHeaderColumn>
            }
            else
            {
            return <TableHeaderColumn key={index} dataAlign="center" dataField={row} dataSort={true}>
                    {row}
                    </TableHeaderColumn>
            }        
        })
    }

    getValores=async()=>
    {
        let basico:basicoDefault=new basicoDefault();
        let api:uniApi =new uniApi();
        let tmp4=await api.datosUnidades(parseInt(basico.buscarParametro('clase_estados_suscripcion',this.state.parametros)),this.state.login.idEmpresa);
        this.setState({
            listaEstados:tmp4.data
        })
    }

    cargarDatosInfoSuscripcion = async()=>{
        let basico:basicoDefault=new basicoDefault();
        let api:uniApi =new uniApi();
        let apiHomo:homoApi =new homoApi();

        let tmpLiquidaciones=await apiHomo.listaLiquidaciones(this.state.login.idEmpresa);
        let tmpTipoUso=await api.datosUnidades(basico.buscarParametro('clase_tipo_uso',this.state.parametros),this.state.login.idEmpresa);
        let tmpEstratos=await api.datosUnidades(parseInt(basico.buscarParametro('clase_estrato',this.state.parametros)),this.state.login.idEmpresa);

        if(tmpLiquidaciones.data.length > 0 ){
            this.setState({
                liquidaciones:tmpLiquidaciones.data
            })
        }

        if(tmpTipoUso.data.length > 0 ){
            this.setState({
                tipoUso:tmpTipoUso.data
            })
        }

        if(tmpEstratos.data.length > 0 ){
            this.setState({
                estratos:tmpEstratos.data
            })
        }
    }
    getSuscripcionHomologa= async (homologador:any,homologa:any,estado:any)=>{
        let tmpConvenio=[]
        let tmpEmpresa=[{}]
        let hom:HomologacionInf = { 
            consumo:JSON.stringify(homologador.consumos),
            deshomologacion:true,
            dsusHomologa:homologa.Dsuscripcion,
            dsusHomologador:homologador.dsus_ideregistr,
            medidor:homologador.pro_idepropieda,
            nuevoTercero:homologador.ter_documento,
            observaciones:"",
            pcodigoHomologador:homologador.dsus_pcodigo,
            periodoHomologa:0,
            suscripcion1:homologa.Suscripcion,
            suscripcion2:homologador.sus_ideregistro     
        }
        let apiEmpresa: EmpresasApi = new EmpresasApi();
        let tmp = await apiEmpresa.empresasAlternasHomologable(this.state.login.idEmpresa);

        let tmp5=await apiEmpresa.convenios(this.state.login.idEmpresa);
        if(tmp5.data.length > 0){
            tmpConvenio=tmp5.data.filter((f:any)=>{
                return f.cnre_nombre==homologador.cnre_nombre 
            })
            hom.nuevoConvenio=tmpConvenio[0]?.["cnre_ideregistr"]
            hom.nombreNuevoConvenio=tmpConvenio[0]?.["cnre_nombre"]
        }
        if(homologa.EmpIderegistro==317){
            hom.deshomologacion=false
        }

        if(tmp.data.length > 0) {
            tmpEmpresa=tmp.data.filter((f:any)=>{return f.empresa_nom == homologador.empresa_nom})
            hom.empresaHomologador=tmpEmpresa[0]?.["empresa_sevemp"]
        }

        
        let api: homoApi = new homoApi();
        let tmpPost = await api.guardarInfoHomologacion(hom).then(()=>{
            this.expandirColumna().then(()=>{
                this.actualizarSeleccion2(this.state.seleccionDatos).then(()=>{
                    this.setState({estadoModal:false})
                })
            })
            return tmpPost
        });
        let resultado = tmpPost.data;
        
        console.log("Enviando Info",resultado)
        console.log("empresa",tmp)
        console.log("convenios",tmp5)

        
        console.log("el hom",hom)
        console.log("funcion capaturado",homologador)
        console.log("homologa",homologa)
        console.log("this state",estado)
    }

    /*guardarHomologacion=async(e:any)=>
    {
        try {
            this.setState({
                cargando:true
            })
            //console.log(e);
            let api: homoApi = new homoApi();
            let tmp = await api.guardarInfoHomologacion(e);
            let resultado = tmp.data;
            //console.log('que le llego al back ',e);
            //console.log('que llego de la homologacion ',resultado);
            if (resultado.statusCode === 200) {
                this.llamarAlerta('success', 'Transaccion Exitosa...');
                await this.setState({
                    estado:1
                })
            }
            else {
                this.llamarAlerta('danger', 'Error Transaccion, Comunicarse con el Area de Tecnologia...');
            }
            //let tmpHomo=await api.informacionHomologacion(this.state.dsusIderegistro);
            await this.recargarContenido(this.state.dsusIderegistro);
            await this.setState({
                //estado: 0,
                //estadoBusqueda: this.state.estadoBusqueda + 1,
                //homologacion:tmpHomo.data[0],
                estado:2,
                cargando:false
            })
        } catch (e) {
            console.log(e);
        }
    }*/

    mostarModalClick=()=>{
        this.setState({
            estadoModal:true
        })
    }

    crearSuscripcion= async (s : any, x : any)=>{
        let api: homoApi = new homoApi();
        let sus:SuscripcionOpr={
            susIderegistro:s.Suscripcion,
            terDocumento:s.Identificacion,
            empIderegistro:s.EmpIderegistro,
            barrioNom:s.Barrio,
            tipoLiquidacion:x.tipoLiquidacion,
            tipoUso:x.tipoUso,
            estrato:x.estrato
        }
        let response = await api.crearSuscripcion(sus)
        if(response.data.objeto==null){
            toast.warning(response.data.mensaje, {
                position: toast.POSITION.BOTTOM_RIGHT,
           className: 'foo-bar'
           })

        }else{
            toast.success(response.data.mensaje, {
                position: toast.POSITION.BOTTOM_RIGHT,
           className: 'foo-bar'
           })
        }

    }

    enviarSuscripcion=(e)=>{
       //esperar  this.crearSuscripcion(this.state.seleccionDatos,e) y luego this.expandirColumna(); y luego this.actualizarSeleccion2(this.state.seleccionDatos); y this.setState({estadoModal:false}) 
         this.crearSuscripcion(this.state.seleccionDatos,e).then(()=>{
            this.expandirColumna().then(()=>{
                this.actualizarSeleccion2(this.state.seleccionDatos).then(()=>{
                    this.setState({estadoModal:false})
                })
            })
        })
    }

    mostrarModal = (): any => {
          return (
            /*<ModalGuardar
              guardar={()=>{this.crearSuscripcion(this.state.seleccionDatos)}}
              cerrar={() => this.setState({ estadoModal: false })}
            />*/
            <ModalInfoSuscripcion estado={true} 
            cerrar={()=>this.setState({estadoModal:false})} liquidaciones={this.state.liquidaciones} 
            tipoUso={this.state.tipoUso} estratos={this.state.estratos} guardar={this.enviarSuscripcion}/>
          );

      };


    cargarDetalle=(e):any=>
    {          console.log(e!=null ? 'cargue' : 'cargue');
            return(
                <div>
                    {this.state.estadoModal && this.mostrarModal()}
                    <Row>
                        <Col>
                            <div className="form-group">
                            <Card>
                                <Card.Header>
                                 <Button
                                 variant='success' size='sm' onClick={this.mostarModalClick}>Crear Nueva Suscripcion Suscriptor <i className="fa fa-plus ml-1" aria-hidden="true"></i></Button>                                    
                                </Card.Header>
                                    
                                    <Card.Body>
                                        <Accordion>
                                                <Cargando/>
                                                {this.state.busqueda.map((e : any, key : number) => {
                                                        return <CardAccordionBasic eventKey={key+1} title={e.ter_nomcompleto+' - '+e.empresa_nom}>
                                                            <h2>Información de la Suscripción Aseo</h2>
                                                            <Row>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Suscripcion</label>
                                                                            <input className="form-control" disabled={true} name='pcodigo' value={this.state.seleccionDatos.Codigo} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Direccion</label>
                                                                            <input className="form-control" disabled={true} name='direccion' value={this.state.seleccionDatos.Direccion} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Barrio</label>
                                                                            <input className="form-control" disabled={true} name='barrio' value={this.state.seleccionDatos.Barrio} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Estado</label>
                                                                            <select className="form-control" disabled={true} value={this.state.seleccionDatos.Estado} >
                                                                                    <option value="--" key="0"></option>
                                                                                    {this.state.listaEstados.map((e : any, key : number) => {
                                                                                        return <option key={key} value={e.uni_codigo1}>{e.uni_nombre1}</option>;
                                                                                    })}
                                                                            </select>                                               
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Fecha Creacion</label>
                                                                            <input className="form-control" disabled={true} name='inicio' value={new Intl.DateTimeFormat("es").format(new Date(this.state.seleccionDatos.Fecha))} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Fecha Actualizacion</label>
                                                                            <input className="form-control" disabled={true} name='final' value={new Intl.DateTimeFormat("es").format(new Date(this.state.seleccionDatos.FechaExpira))} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>    
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Empresa Alterna</label>
                                                                            <input className="form-control" disabled={true} name='alterna' value={this.state.seleccionDatos.Alterna} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Convenio</label>
                                                                            <input className="form-control" disabled={true} name='convenio2' value={e.Alterna==this.state.seleccionDatos.Alterna ? this.state.seleccionDatos.Convenio : e.cnre_nombre } type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Medidor</label>
                                                                            <input className="form-control" disabled={true} name='convenio' value={this.state.seleccionDatos.Medidor} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                            </Row>
                                                        <h2>Suscripcion a Homologar</h2>
                                                            <Row>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Empresa Alterna</label>
                                                                            <input className="form-control" disabled={true} name='alterna2' value={e.Alterna} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Convenio Homologacion</label>
                                                                            <input className="form-control" disabled={true} name='convenio2' value={e.Alterna==this.state.seleccionDatos.Alterna ? e.cnre_nombre : this.state.seleccionDatos.Convenio} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Ciclo</label>
                                                                            <input className="form-control" disabled={true} name='convenio2' value={e.cic_nombre} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                            </Row>
                                                            <Row> 
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Id Suscripcion</label>
                                                                            <input className="form-control" disabled={true} name='convenio2' value={e.dsus_ideregistr} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>   
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Suscripcion</label>
                                                                            <input className="form-control" disabled={true} name='pcodigo2' value={e.dsus_pcodigo} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Medidor</label>
                                                                            <input className="form-control" disabled={true} name='medidor2' value={e.pro_idepropieda} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Estrato</label>
                                                                            <input className="form-control" disabled={true} name='convenio2' value={e.pro_catestrato} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>    
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Consumo Gas</label>
                                                                            <input className="form-control" disabled={true} name='consumo2' value={e.consumos[0]} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Tercero</label>
                                                                            <input className="form-control" disabled={true} name='tercero2' value={e.ter_documento} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Numero Catastral</label>
                                                                            <input className="form-control" disabled={true} name='catastral2' value={e.pro_numcatastral} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Direccion</label>
                                                                            <input className="form-control" disabled={true} name='direccion2' value={e.pro_direccion} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                                <Col>
                                                                        <div className="form-group">
                                                                            <label >Tipo Uso</label>
                                                                            <input className="form-control" disabled={true} name='direccion2' value={e.uni_nombre1} type='text' placeholder=""/>
                                                                        </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    <Button variant="outline-primary" size="lg" onClick={()=>{this.getSuscripcionHomologa(e,this.state.seleccionDatos,this.state)}}>Homologar</Button>
                                                                </Col>
                                                            </Row>
                                                        </CardAccordionBasic>
                                                })} 
                                        </Accordion>
                                    </Card.Body>
                            </Card>
                            </div>                                
                        </Col>                        
                    </Row>                        
                </div>
            )
    }

    cargarDetalle2=():any=>
    {
        this.setState({
            expandible:true
        })
        return(
            null
        )
    }

    handleExpand=async(rowKey, isExpand)=> {
        //this.expandedRows[rowKey] = isExpand;
        console.log('que seleccione...',rowKey);
        console.log('que seleccione2...'+isExpand);
        if(isExpand)
        {
            await this.setState({
                busqueda:[]
            })
            this.actualizarSeleccion(rowKey);
        }
        else
        {
           await this.setState({
                busqueda:[]
            })
        }
      }

      handleExpand2=(rowKey, isExpand, rowIndex, e)=> {
        try
        {
            //console.log('que seleccione...',rowKey);
            console.log('que seleccione2...'+isExpand);
            console.log('que seleccione2 rowIndex...'+rowIndex);
            console.log("selecciono",rowKey);
            console.log('que seleccione2 e...',e);        
            if(isExpand)
            {    
                this.expandirColumna();      
                this.actualizarSeleccion2(rowKey);
            }
        }catch(e){console.log('el error que sale ',e);}
      }
      
      expandirColumna=async()=>
      { 
        let tmp=await (1+1); ////se debe hacer un llamado await antes de actualizar el estado, si no se hace, la vista del Expand no funciona, verificar por que...
        console.log(tmp);
        await this.setState({
            busqueda:[]
        })      
      }

    render()
    {
        /*
        const tableOptions = {
            expandBy: "column",
            onExpand: this.handleExpand,
            onlyOneExpanding: true,
          };

          const expandColumnOptions = {
            //expandColumnVisible: true
          };
         */
          const expandRow = {   
            renderer: row => (
                <div>
                    {this.cargarDetalle(row)}
                </div>
            ),
            //expandBy: "column",
            onExpand: this.handleExpand2,
            onlyOneExpanding: true,
            showExpandColumn: true,
            expandColumnPosition: 'right'
          };
          
        
        return(
            <div>
                <Row className="small">
                        <Col>
                            <Card className="mb-5">
                                <Card.Title>
                                    Resultado Busqueda
                                </Card.Title>
                                <Card.Body>
                                <Suspense fallback={<h1>Cargando Informacion ...</h1>}>
                                    <Container fluid>
                                        <Row>
                                            <Col>
                                                <TableFormatoBootstrapExport valorkey="Codigo" encabezado={this.state.encabezadoLista} datos={this.state.listaResultado} editar={()=>{console.log('THIS',this)}}></TableFormatoBootstrapExport>
                                            </Col> 
                                        </Row> 
                                    </Container>
                                </Suspense>    
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                <BootstrapTable data={this.props.datos} keyField={this.props.valorkey} columns={ this.state.columnasTabla }
                                            expandRow={ expandRow }
                                            //options={tableOptions} expandColumnOptions={expandColumnOptions} expandableRow={() => true} expandComponent={this.cargarDetalle}
                                            bootstrap4
                                            striped={true}
                                            hover={true}
                                            pagination={paginationFactory({})}
                                            data-mobile-responsive="true"
                                            wrapperClasses="table"
                                            noDataIndication="No Hay Informacion..."
                                            />  
            </div>
        );
    }

}

export default TableCruceHomologacion;
