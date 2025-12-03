import React, { Suspense } from 'react';
import ModalCargando from '../../../components/utils/ModalCargando/ModalCargando';
import Alerta from '../../../components/utils/AlertaComponent/AlertaComponent';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import homoApi from '../../../api/homologaciones/Homologacion';
import reportesApi from '../../../api/homologaciones/ReportesApi';
import JasperBridgeModel from '../../../models/JasperBridgeModel';
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import usuarioApi from '../../../api/homologaciones/UsuariosApi';
//import apiHomoTmp  from 'api/homologaciones/ApiHomoTmp';
import PARAMETROS from '../../../data/constantes';
import SesionApi from '../../../api/common/SesionApi';
import UtilsFunction from '../../../components/utils/UtilsFunction';

const sesionApi = new SesionApi();
interface IProps {
    //agregarTarea:(tarea :ITareas)=>void;
    //lista:IAutor[];
    //eliminar: (id:number)=>void; 
    value?: any,
    //cambioValor:(value: React.ChangeEvent<HTMLSelectElement>)=>void;
}

class GeneracionCartas extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state={
            value:'',
            alerta:{
                variante:'',
                estado:false,
                valor:''
            },
            cargando:false,
            busqueda:{
                fecha1:'',
                fecha2:'',
                tipo:0,
                pcodigo:'',
                ciclo:0,
                empresa:0,
                empresaGC:0,
                empresaPrimaria:0,
                empresaSecundaria:0
            },
            configuracion:{},
            seleccionPcodigo:false,
            ciclos:[],
            listaEmpresas:[],
            idUsuario:0,
            idEmpresa:0,
            password:'',
            effectivePermissions:{EDIT:false,VIEW:false,CREATE:false,SAVE:false,DELETE:false,QUERY:false},
            permissions: [],
            listaTipoCartas:[],
            listaTipoDocumentoCartas:[],
            empresasConjuntas: [
                { id: 299, nombre: 'Emsa', valor: 'EMSA' },
                { id: 322, nombre: 'Gas', valor: 'GAS' }
            ]
        };
    }

    async componentDidMount() 
    {
        await this.cargarDatosSesion();
        await this.cargarCiclos();
        await this.cargarParametros();
        await this.cargarDatosReportes();
        await this.cargarEmpresas();
        await sesionApi.loadPermisos(PARAMETROS.GENERAR_CARTAS.PROGRAMA_ID).then(response => {
            this.setState({ permissions: response.data });
        })
        await this.cargarPermisos();
    }

    cargarPermisos=async()=>
    {
      let effectivePermission = UtilsFunction.getEffectivePermissions(this.state.permissions,'GENERAR_CARTAS');    
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
            idEmpresa:resultado.idEmpresa
        })
    }

    cargarParametros=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let basico:basicoDefault=new basicoDefault();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            configuracion:tmp.data
        })
        let listaTmp=basico.buscarParametro('tipos_generacion_cartas',this.state.configuracion);
        let listaTmp2=basico.buscarParametro('tipos_documentos_generacion_cartas',this.state.configuracion);
        if(listaTmp.length>0)
        {
            await this.setState({
                listaTipoCartas:JSON.parse(listaTmp),
                listaTipoDocumentoCartas:JSON.parse(listaTmp2)
            })
        }
    }

    cargarDatosSesion=async()=>
    {
       let basico:basicoDefault=new basicoDefault();
       let resultado=basico.extraerInfoToken(localStorage.getItem('token')); 
        await this.setState({
            idUsuario:resultado.idUsuario,
            idEmpresa:resultado.idEmpresa,
            busqueda:{
                ...this.state.busqueda,empresa:resultado.idEmpresa
            }
        })
    }

    cargarCiclos=async()=>
    {
        try
        {
            let api:homoApi =new homoApi();
            let tmp=await api.listaCiclos(this.state.idEmpresa);
            this.setState({
                ciclos:tmp.data
            })
        }catch(e){
            console.log('error que sale '+e);
        }
    }

    cargarEmpresas=async()=>{
        try{
            let api:homoApi = new homoApi();
        let tmp = await api.listaEmpresas()
        this.setState({
            listaEmpresas:tmp.data
        })
        }catch(e){
            console.log(e)
        }
    }

    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        
        // Si se cambia la empresa primaria, establecer automáticamente la secundaria
        if(name === 'empresaPrimaria') {
            const empresaSecundaria = value === '299' ? '322' : '299'; // Si es Emsa (299), secundaria es Gas (322) y viceversa
            await this.setState({
                busqueda:{
                    ...this.state.busqueda,
                    [name]: value,
                    empresaSecundaria: empresaSecundaria
                }
            });
        } else {
            await this.setState({
                busqueda:{
                    ...this.state.busqueda,[name]:value
                }
            });
        }               
    }

    async cambioValor2(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        console.log(e);
        await this.setState({
            seleccionPcodigo:!this.state.seleccionPcodigo
        })
        if(!this.state.seleccionPcodigo)
        {
            this.setState({
                busqueda:{
                    ...this.state.busqueda,pcodigo:''
                }
            })
        }
        
    }


    generarPlano=async()=>
    {
        try
        {            
                let api:reportesApi =new reportesApi();
                let basico:basicoDefault=new basicoDefault();
                let condiciones=' ';
                if(this.state.busqueda.pcodigo.length>0)
                {
                    condiciones=condiciones+` AND dd.dsus_pcodigo ='`+this.state.busqueda.pcodigo+`'`;
                }
                if(this.state.busqueda.ciclo>0)
                {
                    condiciones=condiciones+' AND cic.cic_ideregistro='+this.state.busqueda.ciclo;
                }
                debugger;
                let parametros={PR_STR_FECHA_INI:this.state.busqueda.fecha1,PR_STR_FECHA_FIN:this.state.busqueda.fecha2,PR_STR_CONDICIONES:condiciones,PR_INT_EMPRESA_PRIMARIA:parseInt(this.state.busqueda.empresaPrimaria),PR_INT_EMPRESA_SECUNDARIA:parseInt(this.state.busqueda.empresaSecundaria)};
                let modelo:JasperBridgeModel=new JasperBridgeModel(basico.buscarParametro('jdni_reportes',this.state.configuracion).replace(/['"]+/g, ''),'csv',basico.buscarParametro('url_reportes',this.state.configuracion).replace(/['"]+/g, '')+
                this.state.listaTipoDocumentoCartas.filter((i:any)=>{
                    return i.valor===parseInt(this.state.busqueda.tipo)
                })[0].documento+'.jrxml',this.state.idUsuario.toString(),this.state.password,parametros);
                //let modelo:JasperBridgeModel=new JasperBridgeModel(basico.buscarParametro('jdni_reportes',this.state.configuracion),'csv',basico.buscarParametro('url_reportes',this.state.configuracion)+'Actual&Homo/PS2-93_solo_aseo.jrxml','1518','caffffbc7a93247cb25f75cb46114262',parametros);
                this.setState({
                    cargando:true
                })
                let resultado=await api.generarArchivoPlano(modelo,basico.buscarParametro('url_api_reportes',this.state.configuracion).replace(/['"]+/g, ''));
                let base64str=resultado.content;
                //let base64str=resultado.data.content;   ///axios react
                //let resultado=await api.generarArchivoPlano({fecha1:this.state.busqueda.fecha1,fecha2:this.state.busqueda.fecha2,tipo:this.state.busqueda.tipo,pcodigo:this.state.busqueda.pcodigo,ciclo:this.state.busqueda.ciclo,empresa:this.state.idEmpresa});
                //let base64str=resultado.data.statusText;
                this.setState({
                    cargando:false
                })
                // decode base64 string, remove space for IE compatibility
                var binary = atob(base64str.replace(/\s/g, ''));
                var len = binary.length;
                var buffer = new ArrayBuffer(len);
                var view = new Uint8Array(buffer);
                for (var i = 0; i < len; i++) {
                    view[i] = binary.charCodeAt(i);
                }          
                var blob = new Blob( [view], { type: "application/csv" });
                
                    var link=document.createElement('a');
                    link.href=window.URL.createObjectURL(blob);
                    link.download="ArchivoPlano.csv";
                    link.click(); 
                     
        }catch(e){
            this.setState({
                cargando:false
            })
            this.llamarAlerta('warning', 'No hay Informacion para mostrar... ');
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

    mostrarAlerta = (): any => {
        if (this.state.alerta.estado) {
            return (
                <Alerta informacion={this.state.alerta}></Alerta>
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

    render()
    {
        return(
            <div>
                <Suspense fallback={<div>Cargando...</div>}>
                    <div className="row">
                        <div className="d-flex p-2 bd-highlight">
                            <h2>Generacion Cartas Bienvenida</h2>
                        </div>
                        <div className="col-12">
                            {this.mostrarAlerta()}
                            {this.mostrarCargando()}
                        </div>
                    </div>
                    <div className="row">
                        <Container>
                            <Card>
                                <Card.Header>
                                    <h5>Filtros</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label >Desde</label>
                                                <input className="form-control" onChange={e=>this.cambioValor(e)} name='fecha1' value={this.state.busqueda.fecha1} type='date' placeholder=""/>
                                            </div> 
                                        </Col>
                                        <Col>
                                            <div className="form-group">
                                                <label >Hasta</label>
                                                <input className="form-control" onChange={e=>this.cambioValor(e)} name='fecha2' value={this.state.busqueda.fecha2} type='date' placeholder=""/>
                                            </div> 
                                        </Col>
                                    </Row>
                                    <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label>Tipo de Carta</label>
                                                    <select onChange={e=>this.cambioValor(e)} className="form-control" name='tipo' value={this.state.busqueda.tipo}>
                                                            <option value="--" key="0"></option>
                                                            {this.state.listaTipoCartas.map((e : any, key : number) => {
                                                                return <option key={key} value={e.valor}>{e.nombre}</option>;
                                                            })}
                                                    </select>    
                                                </div> 
                                            </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={4}>
                                            <div className="form-group">
                                                <label>Seleccionar Suscripcion</label>
                                                <input className="form-control" checked={this.state.seleccionPcodigo} onChange={e=>this.cambioValor2(e)} name='seleccionPcodigo' value={this.state.seleccionPcodigo} type='checkbox' placeholder=""/>
                                            </div>
                                        </Col>
                                        <Col sm={8}>
                                            <div className="form-group">
                                                <label>Suscripcion</label>
                                                <input className="form-control" disabled={!this.state.seleccionPcodigo} onChange={e=>this.cambioValor(e)} name='pcodigo' value={this.state.busqueda.pcodigo} type='text' placeholder="Suscripcion..."/>
                                            </div>
                                        </Col>
                                    </Row>
                                    {parseInt(this.state.busqueda.tipo) === 2 && (
                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label>Empresa Primaria</label>
                                                    <select onChange={e=>this.cambioValor(e)} className="form-control" name='empresaPrimaria' value={this.state.busqueda.empresaPrimaria}>
                                                        <option value="0" key="0">Seleccione...</option>
                                                        {this.state.empresasConjuntas.map((e : any, key : number) => {
                                                            return <option key={key} value={e.id}>{e.nombre}</option>;
                                                        })}
                                                    </select>  
                                                </div> 
                                            </Col>
                                            <Col>
                                                <div className="form-group">
                                                    <label>Empresa Secundaria</label>
                                                    <select disabled className="form-control" name='empresaSecundaria' value={this.state.busqueda.empresaSecundaria}>
                                                        <option value="0" key="0">Automática</option>
                                                        {this.state.empresasConjuntas.map((e : any, key : number) => {
                                                            return <option key={key} value={e.id}>{e.nombre}</option>;
                                                        })}
                                                    </select>  
                                                </div> 
                                            </Col>
                                        </Row>
                                    )}
                                    <Row>
                                        <Col>
                                            <div className="form-group">                
                                                <Button variant="primary" disabled={this.state.busqueda.fecha1.length>0 && this.state.busqueda.fecha2.length>0 && this.state.effectivePermissions.EDIT ? false : true} onClick={this.generarPlano}>Generar Archivo Plano</Button>    
                                            </div>    
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Container>
                    </div>
                </Suspense>    
            </div>
        )
    }
}

export default GeneracionCartas;