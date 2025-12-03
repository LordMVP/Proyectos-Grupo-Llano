import React, { Suspense } from 'react'
import { Row, Col, Card, Accordion , Button , ListGroup , Container } from 'react-bootstrap';
import BusquedaComponent from '../../../components/Homologaciones/BusquedaComponent/BusquedaComponent';
import InfoBasicaComponent from '../../../components/Homologaciones/InfoBasicaComponent/InfoBasicaComponent';
import Alerta from '../../../components/utils/AlertaComponent/AlertaComponent';
import homoApi from '../../../api/homologaciones/Homologacion';
import CardAccordionBasic from '../../../components/utils/CardAccordionBasic/CardAccordionBasic';
//import TableFormatoBootstrap from '../../../components/utils/TableFormatoBootstrap/TableFormatoBootstrap';
import InfoSuscripcionComponent from '../../../components/Homologaciones/InfoSuscripcionComponent/InfoSuscripcionComponent';
import InfoHomologacionComponent from '../../../components/Homologaciones/InfoHomologacionComponent/InfoHomologacionComponent';
import InfoGestionComponent from '../../../components/Homologaciones/InfoGestionComponent/InfoGestionComponent';
import { trackPromise } from "react-promise-tracker";
import Cargando from '../../../components/utils/Cargando';
import ModalCargando from '../../../components/utils/ModalCargando/ModalCargando';
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import uniApi from '../../../api/homologaciones/UniUnidad';
//import { MobileView } from "react-device-detect";
import PARAMETROS from '../../../data/constantes';
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
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

class ActualizacionRapida extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state={
            value:'',
            estado:0,
            //vistaLista:false,
            //vistaEditar:false,
            encabezadoLista:['Codigo','Identificacion','Nombres','Direccion','Catastral','Estrato','Ciclo','Clase','Fecha'],
            listaResultado:[],
            menuEditar:['+','+','+','+'],
            estadoBusqueda: 0,
            basico:{primero:'nada'},
            suscripcion:{},
            homologacion:{},
            gestion:{},
            alerta:{
                variante:'',
                estado:false,
                valor:''
            },
            seleccionBusqueda:{},
            login:{
                idEmpresa:0,
                idUsuario:0
            },
            estadoLista:[],
            barrios:[],
            dsusIderegistro:Number,
            vistaColumnasBasica:[],
            vistaColumnasSuscripcion:[],
            estadoColumnasBasica:[],
            estadoColumnasSuscripcion:[],
            programaId:0,
            effectivePermissions:{EDIT:false,VIEW:false,CREATE:false,SAVE:false,DELETE:false,QUERY:false},
            permissions: [],
            valoresBusqueda:{},
            columnasTablaBusqueda:[
                {
                    dataField: "Editar",
                    text: "Editar",
                    align: 'center',
                    formatter: (rowContent, row) => {
                        return (    
                            <Button variant="success" key={rowContent} onClick={this.seleccion.bind(this,row)}>Editar</Button>
                        )
                      }
                },
                {
                    dataField: "Codigo",
                    text: "Codigo",
                    align: 'center',
                    sort: true
                },
                {
                    dataField: "Identificacion",
                    text: "Identificacion",
                    align: 'center',
                    sort: true,
                },
                {
                    dataField: "Nombres",
                    text: "Nombres",
                    align: 'center',
                    sort: true
                },
                {
                    dataField: "Direccion",
                    text: "Direccion",
                    align: 'center',
                    sort: true
                },
                {
                    dataField: "Catastral",
                    text: "Catastral",
                    align: 'center',
                    sort: true
                },
                {
                    dataField: "Estrato",
                    text: "Estrato",
                    align: 'center',
                    sort: true
                },
                {
                    dataField: "Ciclo",
                    text: "Ciclo",
                    align: 'center',
                    sort: true
                },
                {
                    dataField: "Clase",
                    text: "Clase",
                    align: 'center',
                    sort: true
                },
                {
                    dataField: "Fecha",
                    text: "Fecha",
                    align: 'center',
                    sort: true
                }
            ]
        };
    }

    cargarProyectos = async () => {
        try {
            let api: homoApi = new homoApi();
            let tmp = await api.listaProyectos(this.state.login.idEmpresa);
            this.setState({
                proyectos: tmp.data
            })
        } catch (e) {
            console.log('error que sale ' + e);
        }
    }

    async componentDidMount()
    {
        await this.cargarDatosSesion();
        await this.cargarParametros();
        await this.cargarDefecto();
        await sesionApi.loadPermisos(PARAMETROS.ACTUALIZACIONES_RAPIDA.PROGRAMA_ID).then(response => {
            this.setState({ permissions: response.data });
        })
        await this.cargarPermisos();
    }

    cargarPermisos=async()=>
    {
      let effectivePermission = UtilsFunction.getEffectivePermissions(this.state.permissions,'ACTUALIZACIONES_RAPIDA');    
      await this.setState({effectivePermissions:effectivePermission});
    }

    cargarDatosSesion=async()=>
    {
       let basico:basicoDefault=new basicoDefault();
       let resultado=basico.extraerInfoToken(localStorage.getItem('token')); 
        await this.setState({
            login:{
                ...this.state.login,idEmpresa:resultado.idEmpresa,idUsuario:resultado.idUsuario
            },
            basico:{
                ...this.state.basico,idUsuario:resultado.idUsuario
            }
        })
    }

    cargarParametros=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            parametros:tmp.data
        })
    }

    cargarDefecto=async()=>
    {
        try
        {
            let basico:basicoDefault=new basicoDefault();
            let api:uniApi =new uniApi();
            let apiHomo:homoApi =new homoApi();
            let tmpEstados=await api.datosUnidades(parseInt(basico.buscarParametro('clase_estados_suscripcion',this.state.parametros)),this.state.login.idEmpresa);
            let tmp8=await apiHomo.listaBarriosNativo(this.state.basico.proyectoCod);
            await this.setState({
                estadoLista:tmpEstados.data,
                barrios:tmp8.data,
                vistaColumnasBasica:JSON.parse(basico.buscarParametro('vista_actualizacion_rapida_basica',this.state.parametros)),
                vistaColumnasSuscripcion:JSON.parse(basico.buscarParametro('vista_actualizacion_rapida_suscripcion',this.state.parametros)),
                estadoColumnasBasica:JSON.parse(basico.buscarParametro('edicion_actualizacion_rapida_basica',this.state.parametros)),
                estadoColumnasSuscripcion:JSON.parse(basico.buscarParametro('edicion_actualizacion_rapida_suscripcion',this.state.parametros)),
                programaId:parseInt(basico.buscarParametro('programa_estados_suscripcion_app',this.state.parametros)),
            })
        }catch(e){console.log('esntre en error '+e);}
    }

    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
        const { value, name } = e.target;
        //console.log('desde input '+value + ' '+name );
        await this.setState({
            busqueda: {
                ...this.state.busqueda, [name]: value
            }
        })

    }

    buscar = async (e: any) => {
        this.setState({
            valoresBusqueda:e,
            cargando:true
        })
        let api: homoApi = new homoApi();
        let tmp:any = await trackPromise(api.listaBusquedaGeneral(e));
        if(tmp.data.length===1)
        {
            let dsus=tmp.data[0];
            await this.setState({
                listaResultado: tmp.data,  
            })
            this.editarHomo(dsus)
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
        }
    }

    regresarLista=async()=>
    {
        let api: homoApi = new homoApi();
        let tmp:any = await trackPromise(api.listaBusquedaGeneral(this.state.valoresBusqueda));
        await this.setState({
            listaResultado: tmp.data,
            estado: 1,
            cargando:false
            //!this.state.vistaLista
            //vistaEditar:false           
        })
    }

    limpiar = () => {
        this.setState({
            estado: 0,
            //vistaLista:false,
            //vistaEditar:false,
            estadoBusqueda: this.state.estadoBusqueda + 1
        })
    }

    listar= () =>
    {
        this.setState({
            estado: 1
        })
    }

    editarHomo = async (e: any) => {
        this.setState({
            cargando:true
        })
        //console.log(e);
        let api: homoApi = new homoApi();
        let tmp = await api.informacionBasica(e.Dsuscripcion);
        let tmp2=await api.informacionSuscripcion(e.Dsuscripcion);
        let tmp3=await api.informacionHomologacion(e.Dsuscripcion);
        let tmp4=await api.informacionGestion(e.Dsuscripcion);
        await this.setState({
            //vistaLista:false,
            //vistaEditar:true,
            seleccionBusqueda:e,
            basico: tmp.data[0],
            suscripcion:tmp2.data[0],
            homologacion:tmp3.data[0],
            gestion:tmp4.data[0],
            dsusIderegistro:e.Dsuscripcion,
            estado: 2,
            cargando:false
        })
        await this.cargarDefecto();
    }

    cambioAcordeon = (e: any) => {
        let tmp = this.state.menuEditar[e] === '+' ? '-' : '+';
        let tmpArray = this.state.menuEditar;
        tmpArray[e] = tmp;
        this.setState({
            menuEditar: tmpArray
        })
    }

    guardarBasico = async (e: any) => {
        try {
            this.setState({
                cargando:true
            })
            //console.log(e);
            let api: homoApi = new homoApi();
            let tmp = await api.guardarInfobasica(e);
            let resultado = tmp.data;
            if (resultado.statusCode === 200) {
                this.llamarAlerta('success', 'Transaccion Exitosa...');
                await this.setState({
                    estado:1
                })
            }
            else {
                this.llamarAlerta('danger', 'Error Transaccion, Comunicarse con el Area de Tecnologia...');
            }
            //let tmpBasico = await api.informacionBasica(this.state.dsusIderegistro);
            await this.recargarContenido(this.state.dsusIderegistro);
            await this.setState({
                //estado: 0,
                //estadoBusqueda: this.state.estadoBusqueda + 1,
                //basico: tmpBasico.data[0],
                estado: 2,
                cargando:false
            })
        } catch (e) {
            console.log(e);
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

    guardarSuscripcion=async(e:any)=>
    {
        try {
            this.setState({
                cargando:true
            })    
        //console.log(e);
        let api: homoApi = new homoApi();
        let tmp=await api.guardarInfoSuscripcion(e);
        let resultado = tmp.data;
        if (resultado.statusCode === 200) {
            this.llamarAlerta('success', 'Transaccion Exitosa...');
            await this.setState({
                estado:1
            })
        }
        else {
            this.llamarAlerta('danger', 'Error Transaccion, Comunicarse con el Area de Tecnologia...');
        }
        //let tmpSuscrip=await api.informacionSuscripcion(this.state.dsusIderegistro);
        await this.recargarContenido(this.state.dsusIderegistro);
        await this.setState({
            //estado:0,
            //estadoBusqueda: this.state.estadoBusqueda + 1,
            //suscripcion:tmpSuscrip.data[0],
            estado:2,
            cargando:false 
        })
        } catch (e) {
            console.log(e);
        }
    }

    guardarHomologacion=async(e:any)=>
    {
        try {
            this.setState({
                cargando:true
            })
            //console.log(e);
            let api: homoApi = new homoApi();
            let tmp = await api.guardarInfoHomologacion(e);
            let resultado = tmp.data;
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
    }

    guardarGestion=async(e:any)=>
    {
        try {
            this.setState({
                cargando:true
            })
            console.log(e);
            let api: homoApi = new homoApi();
            let tmp = await api.guardarGestion(e);
            let resultado = tmp.data;
            if (resultado.statusCode === 200) {
                this.llamarAlerta('success', 'Transaccion Exitosa...');
                await this.setState({
                    estado:1
                })
            }
            else {
                this.llamarAlerta('danger', 'Error Transaccion, Comunicarse con el Area de Tecnologia...');
            }
            //let tmpGestion=await api.informacionGestion(this.state.dsusIderegistro);
            await this.recargarContenido(this.state.dsusIderegistro);
            await this.setState({
                //estado: 0,
                //estadoBusqueda: this.state.estadoBusqueda + 1,
                //gestion:tmpGestion.data[0],
                estado:2,
                cargando:false
            })
        } catch (e) {
            console.log(e);
        }
    }

    seleccion=(e:any)=>
    {
        this.editarHomo(e);
    }

    recargarContenido=async(e:any)=>
    {
        let api: homoApi = new homoApi();
        let tmp = await api.informacionBasica(e);
        let tmp2=await api.informacionSuscripcion(e);
        let tmp3=await api.informacionHomologacion(e);
        let tmp4=await api.informacionGestion(e);
        await this.setState({
            //vistaLista:false,
            //vistaEditar:true,
            //seleccionBusqueda:e,
            basico: tmp.data[0],
            suscripcion:tmp2.data[0],
            homologacion:tmp3.data[0],
            gestion:tmp4.data[0],
            dsusIderegistro:e,
            estado: 2,
            cargando:false
        })
        await this.cargarDefecto();
    }

    mostrarLista=(): any=>
    {
        if(this.state.estado>1)
        {
            return(
                <div>
                    <Row>
                        <Col>
                            <div className="form-group">
                                    <Button variant="primary" onClick={this.regresarLista}>Regresar al Listado</Button>
                                </div>                                
                        </Col>                        
                    </Row>                        
                </div>
                
            )            
        }
        else
            return

    }

    mostrarBusqueda=():any=>
    {
        if(this.state.estado<2)
        {
            return(
                <div>
                    <Row>
                        <Col>
                            <div className="form-group">
                            <ListGroup>  
                                <BusquedaComponent nombreBoton='Buscar Rapido' buscarMetodo={this.buscar} limpiarMetodo={this.limpiar} key={this.state.estadoBusqueda} listar={this.listar}/>
                            </ListGroup>
                            </div>                                
                        </Col>                        
                    </Row>                        
                </div>
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

    renderEstado = (): any => {
        switch (this.state.estado) {
            case 0:
                return (
                    <div></div>
                )
            case 1:
                return (
                    <Row>
                        <Col >
                            <div className="table-responsive">
                                <Card>
                                    <Card.Title>
                                        Resultado Busqueda
                                    </Card.Title>
                                    <Card.Body>                                  
                                                    <BootstrapTable
                                                    data-mobile-responsive="true"
                                                    wrapperClasses="table"
                                                    columns={this.state.columnasTablaBusqueda}
                                                    data={this.state.listaResultado} 
                                                    striped={true}
                                                    hover={true}
                                                    pagination={paginationFactory({})}
                                                    keyField={'Codigo'}
                                                    noDataIndication="No Hay Informacion..."/>          
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                )
            case 2:
                return (
                    <Row>
                        <Col>
                            <Card>
                                <Card.Title>Informacion de la suscripcion</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    <Container>
                                            <Row>
                                                <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                                    <div className="form-group">
                                                        <label>Suscripcion</label>
                                                        <input className="form-control" value={this.state.gestion.dsus_pcodigo} type='text' placeholder="" disabled={true}/>
                                                    </div>
                                                </Col>
                                                <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                                    <div className="form-group">
                                                        <label>ID Suscripcion</label>
                                                        <input className="form-control" value={this.state.basico.dsusIderegistr} type='text' placeholder="" disabled={true}/>
                                                    </div>
                                                </Col>
                                                <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                                    <div className="form-group">
                                                        <label>Nombre Suscriptor</label>
                                                        <input className="form-control" value={this.state.basico.terNomcompleto} type='text' placeholder="" disabled={true}/>
                                                    </div>
                                                </Col>                                                
                                            </Row>
                                            <Row>
                                                <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                                    <div className="form-group">
                                                        <label>Direccion</label>
                                                        <input className="form-control" value={this.state.basico.direccion} type='text' placeholder="" disabled={true}/>
                                                    </div>
                                                </Col>
                                                <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                                    <div className="form-group">
                                                        <label>Estado Suscripcion</label>
                                                        <select className="form-control" name='dsus_estado' value={this.state.suscripcion.dsus_estado} disabled={true}>
                                                            <option value="--" key="0"></option>
                                                            {this.state.estadoLista.map((e : any, key : number) => {
                                                                return <option key={key} value={e.uni_codigo1}>{e.uni_nombre1}</option>;
                                                            })}
                                                    </select>    
                                                    </div>
                                                </Col>
                                                <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                                    <div className="form-group">
                                                        <label>Fecha Creacion</label>
                                                        <input className="form-control" value={this.state.suscripcion.dsus_fecinicio} type='text' placeholder="" disabled={true}/>
                                                    </div>
                                                </Col>                                                
                                            </Row>
                                            <Row>
                                                <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD} >
                                                    <div className="form-group">
                                                        <label>Numero de Medidor</label>
                                                        <input className="form-control" value={this.state.basico.proIdepropieda} type='text' placeholder="" disabled={true}/>
                                                    </div>
                                                </Col>
                                                <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD} >
                                                    <div className="form-group">
                                                        <label>Fecha Modificacion</label>
                                                        <input className="form-control" value={this.state.suscripcion.dsus_fecexpira} type='text' placeholder="" disabled={true}/>
                                                    </div>
                                                </Col>
                                                <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD} >
                                                    <div>
                                                            <label>Barrio</label>
                                                            <select className="form-control" value={this.state.basico.barrio} disabled={true}>
                                                            <option value="--" key="0"></option>
                                                            {this.state.barrios.map((e : any, key : number) => {
                                                                return <option key={key} value={e.barrio_ideregistro}>{e.barrio_nom}</option>;
                                                            })}
                                                    </select> 
                                                    </div>
                                                </Col>
                                            </Row>
                                    </Container>
                                </Card.Subtitle>
                                <Card.Body>
                                    <Accordion>
                                        <CardAccordionBasic eventKey="1" title="Informacion basica">
                                            <InfoBasicaComponent permisos={this.state.effectivePermissions} validacionEstado={this.state.estadoColumnasBasica} validacionVista={this.state.vistaColumnasBasica} informacion={this.state.basico} guardarInfoBasica={this.guardarBasico}></InfoBasicaComponent>
                                        </CardAccordionBasic>
                                        <CardAccordionBasic eventKey="2" title="Informacion Suscripcion">
                                                <InfoSuscripcionComponent permisos={this.state.effectivePermissions} validacionEstado={this.state.estadoColumnasSuscripcion} validacionVista={this.state.vistaColumnasSuscripcion} informacion={this.state.suscripcion} guardarInfoSuscripcion={this.guardarSuscripcion} programaId={this.state.programaId}></InfoSuscripcionComponent>
                                        </CardAccordionBasic>
                                        <CardAccordionBasic eventKey="3" title="Informacion Homologacion">
                                                <InfoHomologacionComponent permisos={this.state.effectivePermissions} informacion={this.state.homologacion} informacionAuxiliar={this.state.seleccionBusqueda} guardarInfoHomologacion={this.guardarHomologacion}></InfoHomologacionComponent>
                                        </CardAccordionBasic>
                                        <CardAccordionBasic eventKey="4" title="Informacion Gestion Actualizacion">
                                                <InfoGestionComponent permisos={this.state.effectivePermissions} informacion={this.state.gestion} guardarInfoGestion={this.guardarGestion}></InfoGestionComponent>
                                        </CardAccordionBasic>
                                    </Accordion>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )

        }
    }

    render() {
        return (
            <div>                
                        <Suspense fallback={<div>Cargando...</div>}>
                            <div className="row">
                                <div className="d-flex p-2 bd-highlight">
                                    <h2>Actualización por APP Homologacion</h2>
                                </div>
                                <div className="col-12">
                                    {this.mostrarAlerta()}
                                    {this.mostrarCargando()}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    
                                        {this.mostrarBusqueda()}
                                    
                                </div>
                            </div>
                            <div className="row">
                                    <div className="col-12">
                                    {this.mostrarLista()}                               
                                    </div>   
                                </div>
                            <div className="row">
                                <div className="col-12"> 
                                    
                                        {this.renderEstado()}                                             
                                                                                                   
                                    
                                    <Cargando/>
                                </div>
                            </div>
                        </Suspense>
            </div>
        );
    }
}

export default ActualizacionRapida;