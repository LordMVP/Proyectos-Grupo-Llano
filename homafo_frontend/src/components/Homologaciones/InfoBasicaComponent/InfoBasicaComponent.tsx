import * as React from 'react';
import { Container, Row, Col , Button , ListGroup , Card } from 'react-bootstrap';
import uniApi from '../../../api/homologaciones/UniUnidad';
import departApi from '../../../api/homologaciones/Departamentos';
import homoApi from '../../../api/homologaciones/Homologacion';
import ClteClaTerceroModel from '../../../models/ClteClaTerceroModel';
import sectorApi from '../../../api/homologaciones/SecSector';
import ModalGuardar from '../../../components/utils/ModalGuardar/ModalGuardar';
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';

// Importar los nuevos componentes
import InformacionPersonal from './InformacionPersonal';
import InformacionUbicacion from './InformacionUbicacion';
import InformacionCatastral from './InformacionCatastral';
import InformacionContacto from './InformacionContacto';

interface IProps{
    //eliminar: (id:number)=>void; 
    value?:any,
    informacion?:any,
    guardarInfoBasica:(e:any)=>void,
    validacionVista:[]
    guardarAction?:any,
    validacionEstado:[],
    permisos?:any
   
}

class InfoBasicaComponent extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            value:'',
            estadoModal:false,
            basico:{
                terDocumento:'',
                terNomcompleto:'',
                naturaleza:0,
                direccion:'',
                barrio:0,
                sector:0,
                departamento:0,
                proyecto:0,
                complementoPropiedad:0,
                catastralAntes:'',
                castastralNuevo:'',
                independencia:'',
                matriculaInmobiliaria:'',
                ubicacion:0,
                actividadComercial:0,
                longitud:'',
                latitud:'',
                correos:[],
                dsusIderegistr:0,
                terIderegistro:0,
                clasiTerceroLista:[],
                contactoTerceroLista:[],
                clasificacionVivienda:[],
                idUsuario:0,
                tipoDocumento:''
            },
            correoTmp:0,
            correoValorTmp:'',
            telefonoTmp:0,
            telefonoValorTmp:'',
            tipoTelTmp:'',
            numeroTelTmp:'',
            clasificacionTmp:0,
            clasificacionTmp2:0,            
            listaNaturaleza:[],
            departamentos:[],
            proyectos:[],
            barrios:[],
            barrioSeleccion:[],
            ubicacionLista:[],
            actividadesComerciales:[],
            clasificacionViviendaUnidades:[],
            clasificacionTercero:[],
            contactoTerceroUnidades:[],
            estadoItemClasi:0,
            estadoItemClasi2:0,
            listaSectores:[],
            listaComplementoPropiedad:[],
            login:{
                idEmpresa:0,
                idUsuario:0
            },
            parametros:{},
            estadoItemCorreo:'',
            estadoItemTel:'',
        };
    }

    async componentDidMount() 
    {
      await this.cargarDatosSesion();
      await this.cargarParametros();
      await this.cargarDefecto();
      console.log('que tiene permisos ',this.props.permisos);
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
            var _ = require('lodash');
            let basico:basicoDefault=new basicoDefault();
            let api:uniApi =new uniApi();
            let apiHomo:homoApi =new homoApi();
            let apiSector:sectorApi= new sectorApi();
            
            let api2:departApi=new departApi();
            let tmp=await api.datosUnidades(parseInt(basico.buscarParametro('clase_tipo_tercero',this.state.parametros)),this.state.login.idEmpresa);
            let tmp2=await api2.listaDepartamentos();
            let tmp3=await api.datosUnidades(parseInt(basico.buscarParametro('clase_tipo_ubicacion',this.state.parametros)),this.state.login.idEmpresa);
            let tmp4=await api.datosUnidades(parseInt(basico.buscarParametro('clase_actividad_economica',this.state.parametros)),this.state.login.idEmpresa);
            let tmp5=await api.datosUnidades(parseInt(basico.buscarParametro('clase_clasificacion_vivienda',this.state.parametros)),this.state.login.idEmpresa);
            let tmp6=await api.datosUnidades(parseInt(basico.buscarParametro('clase_tercero_aprovechadores',this.state.parametros)),this.state.login.idEmpresa);
            let tmp7=await apiHomo.listaProyectosDepart(this.props.informacion.departamento,this.state.login.idEmpresa);
            let tmp8=await apiHomo.listaBarriosNativo(this.props.informacion.proyectoCod);
            //let tmp8=await apiHomo.listaBarrioNativo(this.props.informacion.proyectoCod,tmp7.data[0].proyecto_codemp);
            let tmp9=await api.datosUnidades(parseInt(basico.buscarParametro('clase_clasificacion_contacto',this.state.parametros)),this.state.login.idEmpresa);
            let tmp10=await apiSector.listaSectores();
            let tmp11=await apiHomo.complementoPropiedad(this.props.informacion.proyecto,this.props.informacion.barrio);
            //Barrio error
            const selectedBarrio = tmp8.data.find(e=>e.barrio_ideregistro===this.props.informacion.barrio);
            const barrioSeleccionArray = selectedBarrio ? [selectedBarrio] : [];
            await this.setState({                
                listaNaturaleza:tmp.data,
                departamentos:tmp2.data,
                ubicacionLista:tmp3.data,
                actividadesComerciales: _.sortBy(tmp4.data,'uni_nombre1'),
                clasificacionViviendaUnidades:tmp5.data,
                clasificacionTercero:tmp6.data,
                proyectos:tmp7.data,
                barrios:tmp8.data,  
                contactoTerceroUnidades:tmp9.data,              
                basico:this.props.informacion,
                barrioSeleccion:barrioSeleccionArray,
                listaSectores:tmp10.data,
                listaComplementoPropiedad:tmp11.data,
            })
        }catch(e){
            console.log(e);
        }
    }

    guardar=async()=>
    {
        //console.log(this.state.basico);
        try {
            await this.props.guardarInfoBasica(this.state.basico);
        } catch(e) {
            console.log('Error al guardar:', e);
        } finally {
            // Siempre cerrar el modal, haya éxito o error
            this.setState({estadoModal:false});
        }
    }

    cambioValorGeneral = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    {
        const {value, name}=e.target;
        try
        { 
            await this.setState({
                [name]:value
            })  
        }catch(e){
            console.log('error que sale '+e);
        }
        
    }

    cambioValor = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    {
        const {value, name}=e.target;
        //console.log('desde input '+value + ' '+name );
        await this.setState({
            basico:{
                ...this.state.basico,[name]:value
            }
        })
        
    }

    cambioValorContactoTercero = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    {
        const {value, name}=e.target;
        try
        { 
            await this.setState({
                [name]:parseInt(value)
            })  
        }catch(e){
            console.log('error que sale '+e);
        }
        
    }

    cambioValor2 = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    {
        const {value, name}=e.target;
        try
        {
            //let proyectoTmp=this.state.proyectos[value]
            //let departTmp=this.state.departamentos.find(e=> e.departamento_ideregistro===parseInt(value));
            let api:homoApi =new homoApi();
            //let proyectosTmp=await api.listaProyectosDepart(departTmp.departamento_ideregistro);
            let proyectosTmp=await api.listaProyectosDepart(parseInt(value),this.state.login.idEmpresa);
            await this.setState({
                basico:{
                    //...this.state.basico,[name]:departTmp.departamento_ideregistro,proyecto:0,barrio:0
                    ...this.state.basico,[name]:parseInt(value),proyecto:0,barrio:0
                },
                proyectos:proyectosTmp.data,
                barrios:[]
            })
        }catch(e){
            console.log('error que sale '+e);
            await this.setState({
                basico:{
                    ...this.state.basico,[name]:0,proyecto:0
                },
                proyectos:[],
                barrios:[]
            })
        }

        //console.log(this.state);
        
    }

    cambioValor3 = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    {
        const {value, name}=e.target;
        try
        {
            //let proyectoTmp=this.state.proyectos[value]
            let proyectoTmp=this.state.proyectos.find(e=> e.proyecto_ideregistro===parseInt(value));
            let api:homoApi =new homoApi();
            let barrTmp=await api.listaBarrios(proyectoTmp.proyecto_cod);
            //let barrTmp=await api.listaBarrioNativo(proyectoTmp.proyecto_cod,this.state.proyectos[0].proyecto_codemp);
            await this.setState({
                basico:{
                    ...this.state.basico,[name]:proyectoTmp.proyecto_ideregistro,barrio:0
                },
                barrios:barrTmp.data,
                barrioSeleccion:[]
            })
        }catch(e){
            console.log('error que sale '+e);
            await this.setState({
                basico:{
                    ...this.state.basico,[name]:0,barrio:0
                },
                barrios:[],
                barrioSeleccion:[]
            })
        }

        //console.log(this.state);
        
    }

    cambioValorBarrio=async(e:any)=>
    {
        //console.log(e);
        if(e[0]!==undefined)
        {

            let apiHomo:homoApi =new homoApi();
            const complemento= await apiHomo.complementoPropiedad(this.state.proyectos[0].proyecto_ideregistro,e[0].barrio_ideregistro);
            this.setState({
                basico:{
                    ...this.state.basico,barrio:e[0].barrio_ideregistro
                },
                barrioSeleccion:[e[0]],
                listaComplementoPropiedad:complemento.data
            })
        }
        else
        {
            this.setState({
                barrioSeleccion:[]
            })
        }
    }

    cambioValorClasificacion = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    {
        const {value, name}=e.target;
        try
        { 
            await this.setState({
                [name]:parseInt(value)
            })  
        }catch(e){
            console.log('error que sale '+e);
        }
        
    }

    agregarClasificacionVivienda=async()=>
    {
        //console.log(this.props)
        let valorTmp=this.state.clasificacionViviendaUnidades.find(e=> e.uni_ideregistro===this.state.clasificacionTmp);
        let buscar=this.state.basico.clasificacionVivienda.find(e=>e.uni_ideregistro===this.state.clasificacionTmp);
        
        if(buscar===undefined)
        {
            await this.setState({
                basico:{
                    ...this.state.basico,clasificacionVivienda:[...this.state.basico.clasificacionVivienda,{uni_ideregistro:valorTmp.uni_ideregistro,uni_nombre1:valorTmp.uni_nombre1}]
                },
            })
        }
        await this.setState({
            clasificacionTmp:0
        })
    }

    agregarClasificacion=async()=>
    {
        
        ///buscar el elemento en la lista
        let valorTmp=this.state.clasificacionTercero.find(e=> e.uni_ideregistro===this.state.clasificacionTmp2);
        let modelo1:ClteClaTerceroModel =new ClteClaTerceroModel(0,valorTmp.uni_ideregistro,valorTmp.uni_nombre1,valorTmp.uni_orden,valorTmp.uni_codigo1,this.state.basico.terIderegistro);
        ///ver si ya esta en la lista
        let buscar=this.state.basico.clasiTerceroLista.find(e=> e.uni_ideregistro===this.state.clasificacionTmp2);
        try{
            if(buscar===undefined)
            {
                await this.setState({
                    basico:{
                        ...this.state.basico,clasiTerceroLista:[...this.state.basico.clasiTerceroLista,modelo1]
                    },
                    clasificacionTmp2:0,
                    estadoItemClasi2:0
                })
            }
            else{
                if(buscar.clte_ideregistr<0)
                {
                    ///filtrar para agregar positivo
                    let arrayFiltro = this.state.basico.clasiTerceroLista.filter(item => item.uni_ideregistro !== this.state.clasificacionTmp2);
                    let modelo2:ClteClaTerceroModel =new ClteClaTerceroModel(Math.abs(buscar.clte_ideregistr),buscar.uni_ideregistro,buscar.uni_nombre1,buscar.uni_orden,buscar.uni_codigo1,buscar.ter_ideregistro);
                    arrayFiltro.push(modelo2);
                    await this.setState({
                    basico:{
                        ...this.state.basico,clasiTerceroLista:arrayFiltro
                    },
                    clasificacionTmp2:0,
                    estadoItemClasi2:0
                }) 
                }
                else
                {
                        this.setState({
                            clasificacionTmp2:0,
                            estadoItemClasi2:0
                        })
                }
            }
        }catch(e){
            console.log('error que sale '+e);
            
        }
    }

    agregarContactoTercero=async(e:any)=>
    {
        if(e==='EMAIL')
        {
            let valorTmp=this.state.contactoTerceroUnidades.find(e=> e.uni_ideregistro===this.state.correoTmp);
            let nuevo={cont_ideregistro:0,ter_ideregistro:this.state.basico.terIderegistro,uni_ideregistro:this.state.correoTmp,cont_valor:this.state.correoValorTmp,uni_nombre1:valorTmp.uni_nombre1,uni_codigo1:valorTmp.uni_codigo1};
                await this.setState({
                    basico:{
                        ...this.state.basico,contactoTerceroLista:[...this.state.basico.contactoTerceroLista,nuevo]
                    },
                    correoTmp:0,
                    correoValorTmp:''
                })  
        }
        else
        {
            let valorTmp=this.state.contactoTerceroUnidades.find(e=> e.uni_ideregistro===this.state.telefonoTmp);
            let nuevo={cont_ideregistro:0,ter_ideregistro:this.state.basico.terIderegistro,uni_ideregistro:this.state.telefonoTmp,cont_valor:this.state.telefonoValorTmp,uni_nombre1:valorTmp.uni_nombre1,uni_codigo1:valorTmp.uni_codigo1};
                await this.setState({
                    basico:{
                        ...this.state.basico,contactoTerceroLista:[...this.state.basico.contactoTerceroLista,nuevo]
                    },
                    telefonoTmp:0,
                    telefonoValorTmp:''
                }) 
        }
       
    }

    eliminarClasificacion=async()=>
    {
        let arrayFiltro = this.state.basico.clasiTerceroLista.filter(item => item.uni_ideregistro !== this.state.estadoItemClasi2);        
        let valorTmp=this.state.basico.clasiTerceroLista.find(e=> e.uni_ideregistro===this.state.estadoItemClasi2);
        if(valorTmp.clte_ideregistr>0)
        {
            let tmp={clte_ideregistr:valorTmp.clte_ideregistr*-1,uni_ideregistro:valorTmp.uni_ideregistro,uni_nombre1:valorTmp.uni_nombre1,uni_orden:valorTmp.uni_orden,uni_codigo1:valorTmp.uni_codigo1,ter_ideregistro:valorTmp.ter_ideregistro};
            arrayFiltro.push(tmp);   
        }
        await this.setState({
            basico:{
                ...this.state.basico,clasiTerceroLista:arrayFiltro
            },
            estadoItemClasi2:0
        })
    }

    eliminarClasificacionVivienda=async()=>
    {
        let arrayFiltro = this.state.basico.clasificacionVivienda.filter(item => item.uni_ideregistro !== this.state.estadoItemClasi);  
        await this.setState({
            basico:{
                ...this.state.basico,clasificacionVivienda:arrayFiltro
            },
            estadoItemClasi:0
        })
    }

    seleccionItemClasificacion=(e:any)=>
    {
        this.setState({
            estadoItemClasi:e
        })
    }

    seleccionItemClasificacion2=(e:any)=>
    {
        this.setState({
            estadoItemClasi2:e
        })
    }

    seleccionItemContacto=async(e:any)=>
    {
        let busqueda=this.state.basico.contactoTerceroLista.filter(item => item.cont_valor === e);
        let resultado=busqueda[0];
        if(resultado !=null )
        {
            await this.setState({
                estadoItemCorreo:e
            })
        }
        /*
        if(resultado !=null && resultado.cont_ideregistro===0)
        {
            await this.setState({
                estadoItemCorreo:e
            })
        }
        else
        {
            await this.setState({
                estadoItemCorreo:''
            })
        }
        */
    }

    eliminarNuevoCorreo=async()=>
    {
        let arrayFiltro = this.state.basico.contactoTerceroLista.filter(item => item.cont_valor !== this.state.estadoItemCorreo);
        let busqueda=this.state.basico.contactoTerceroLista.filter(item => item.cont_valor === this.state.estadoItemCorreo);  
        if(busqueda[0].cont_ideregistro>0)
        {
            busqueda[0].cont_ideregistro=busqueda[0].cont_ideregistro*-1;
            arrayFiltro.push(busqueda[0]);
        }
        //console.log('que tiene el contacto ',busqueda[0]);
        await this.setState({
            basico:{
                ...this.state.basico,contactoTerceroLista:arrayFiltro
            },
            estadoItemCorreo:''
        })
    }

    seleccionItemContacto2=async(e:any)=>
    {
        let busqueda=this.state.basico.contactoTerceroLista.filter(item => item.cont_valor === e);
        let resultado=busqueda[0];
        if(resultado !=null)
        //if(resultado !=null && resultado.cont_ideregistro===0)
        {
            await this.setState({
                estadoItemTel:e
            })
        }
        else
        {
            await this.setState({
                estadoItemTel:''
            })
        }
    }

    eliminarNuevoCorreo2=async()=>
    {
        let arrayFiltro = this.state.basico.contactoTerceroLista.filter(item => item.cont_valor !== this.state.estadoItemTel); 
        let busqueda=this.state.basico.contactoTerceroLista.filter(item => item.cont_valor === this.state.estadoItemTel);  
        if(busqueda[0].cont_ideregistro>0)
        {
            busqueda[0].cont_ideregistro=busqueda[0].cont_ideregistro*-1;
            arrayFiltro.push(busqueda[0]);
        } 
        await this.setState({
            basico:{
                ...this.state.basico,contactoTerceroLista:arrayFiltro
            },
            estadoItemTel:''
        })
    }

    permisoVista=(e)=>
    {
        //let array=JSON.parse(this.state.vistaColumnas);
        let estado=true;
        if(this.props.validacionVista.length>0)
        {
            
           estado=false;
           let array:any=this.props.validacionVista;
           for (let tmp in array)
           {
               let valor=array[tmp];
               if(valor.columna===e)
               {
                    estado=valor.valor;
               }
           }
           
        }
        //console.log('que le llego a e',e);
        //console.log('que le llego a array',this.state.vistaColumnas);
        //console.log('que hay en parametros ',this.state.parametros);
        return estado;
    }

    permisoEstado=(e)=>
    {
        let estado=false;
        if(this.props.validacionEstado.length>0)
        {
            
           estado=false;
           let array:any=this.props.validacionEstado;
           for (let tmp in array)
           {
               let valor=array[tmp];
               if(valor.columna===e)
               {
                    estado=valor.valor;
               }
           }
           
        }
        return estado;
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

    render()
    {
        return(
            <div>
                {this.mostrarModal()}
                <Container>
                    <InformacionPersonal
                        basico={this.state.basico}
                        listaNaturaleza={this.state.listaNaturaleza}
                        permisoVista={this.permisoVista}
                        permisoEstado={this.permisoEstado}
                        cambioValor={this.cambioValor}
                    />

                    <InformacionUbicacion
                        basico={this.state.basico}
                        departamentos={this.state.departamentos}
                        proyectos={this.state.proyectos}
                        barrios={this.state.barrios}
                        barrioSeleccion={this.state.barrioSeleccion}
                        listaComplementoPropiedad={this.state.listaComplementoPropiedad}
                        permisoVista={this.permisoVista}
                        permisoEstado={this.permisoEstado}
                        cambioValor={this.cambioValor}
                        cambioValor2={this.cambioValor2}
                        cambioValor3={this.cambioValor3}
                        cambioValorBarrio={this.cambioValorBarrio}
                    />

                    <InformacionCatastral
                        basico={this.state.basico}
                        ubicacionLista={this.state.ubicacionLista}
                        actividadesComerciales={this.state.actividadesComerciales}
                        permisoVista={this.permisoVista}
                        permisoEstado={this.permisoEstado}
                        cambioValor={this.cambioValor}
                    />
                    {this.permisoVista('col-telefono') &&
                    (<InformacionContacto
                        basico={this.state.basico}
                        correoTmp={this.state.correoTmp}
                        correoValorTmp={this.state.correoValorTmp}
                        telefonoTmp={this.state.telefonoTmp}
                        telefonoValorTmp={this.state.telefonoValorTmp}
                        estadoItemCorreo={this.state.estadoItemCorreo}
                        estadoItemTel={this.state.estadoItemTel}
                        contactoTerceroUnidades={this.state.contactoTerceroUnidades}
                        permisoVista={this.permisoVista}
                        permisoEstado={this.permisoEstado}
                        cambioValorGeneral={this.cambioValorGeneral}
                        cambioValorContactoTercero={this.cambioValorContactoTercero}
                        agregarContactoTercero={this.agregarContactoTercero}
                        eliminarNuevoCorreo={this.eliminarNuevoCorreo}
                        eliminarNuevoCorreo2={this.eliminarNuevoCorreo2}
                        seleccionItemContacto={this.seleccionItemContacto}
                        seleccionItemContacto2={this.seleccionItemContacto2}
                    />)}
                    <Row>
                        <Col style={{ display: this.permisoVista('col-clasificacionVivienda') ? "block" : "none" }}>
                            <div className="form-group" style={{display:'none'}}>                   
                                <Card>
                                    <Card.Header>Clasificacion Vivienda</Card.Header>
                                    <Card.Body>
                                    
                                        <Row>
                                            <Col xs={8}>
                                                <div className="form-group">
                                                <select disabled={this.permisoEstado('col-clasificacionVivienda')} onChange={e=>this.cambioValorClasificacion(e)} className="form-control" name='clasificacionTmp' value={this.state.clasificacionTmp}>
                                                <option value="--" key="0"></option>
                                                {this.state.clasificacionViviendaUnidades.map((e : any, key : number) => {
                                                    return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                })}
                                            </select>  
                                                </div>
                                            </Col>
                                            <Col xs={1}>
                                                <div className="form-group">
                                                        <Button variant="success" size="sm" onClick={this.agregarClasificacionVivienda} disabled={this.state.clasificacionTmp===0 ? true : false}>+</Button>
                                                </div>
                                            </Col>
                                            <Col xs={1} className="justify-content-sm-start">
                                                    <div className="form-group">
                                                        <Button variant="danger" size="sm" onClick={this.eliminarClasificacionVivienda} disabled={this.state.estadoItemClasi==0 ? true : false}>-</Button>
                                                    </div>
                                            </Col>   
                                        </Row>
                                        <Row className="justify-content-md-start small">
                                            <Col>
                                                <div className="form-group">
                                                         <ListGroup as="ul">
                                                            {this.state.basico.clasificacionVivienda.map((e : any) => {
                                                                    console.log(e)
                                                                    return  <ListGroup.Item key={e.uni_ideregistro} as="li" style={{cursor:'pointer'}} onClick={()=>this.seleccionItemClasificacion(e.uni_ideregistro)} active={e.uni_ideregistro===this.state.estadoItemClasi ? true : false}>{e.uni_nombre1}</ListGroup.Item> ;
                                                            })}                                       
                                                        </ListGroup>
                                                </div>
                                            </Col> 
                                        </Row>                                        
                                    </Card.Body>
                                </Card>  
                            </div>       
                        </Col>
                        <Col style={{ display: this.permisoVista('col-clasificacionTercero') ? "block" : "none" }}>
                            <div className="form-group" style={{display:'none'}}>                   
                                <Card>
                                    <Card.Header>Clasificacion Tercero</Card.Header>
                                    <Card.Body>
                                   
                                        <Row>
                                            <Col xs={8}>
                                                <div className="form-group">
                                                <select disabled={this.permisoEstado('col-clasificacionTercero')} onChange={e=>this.cambioValorClasificacion(e)} className="form-control" name='clasificacionTmp2' value={this.state.clasificacionTmp2}>
                                                <option value="--" key="0"></option>
                                                {this.state.clasificacionTercero.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                })}
                                            </select>  
                                                </div>
                                            </Col>
                                            <Col xs={1}>
                                                <div className="form-group">
                                                        <Button variant="success" size="sm" onClick={this.agregarClasificacion} disabled={this.state.clasificacionTmp2===0 ? true : false}>+</Button>
                                                </div>
                                            </Col>
                                            <Col xs={1}>
                                                    <div className="form-group">
                                                        <Button variant="danger" size="sm" onClick={this.eliminarClasificacion} disabled={this.state.estadoItemClasi2==0 ? true : false}>-</Button>
                                                    </div>
                                            </Col>    
                                        </Row>
                                        <Row className="justify-content-lg-start small">
                                            <Col>
                                                <div className="form-group">
                                                        <ListGroup as="ul">
                                                            {this.state.basico.clasiTerceroLista.map((e : any) => {
                                                                if(e.clte_ideregistr>=0)
                                                                    return  <ListGroup.Item key={e.uni_ideregistro} as="li" style={{cursor:'pointer'}} onClick={()=>this.seleccionItemClasificacion2(e.uni_ideregistro)} active={e.uni_ideregistro===this.state.estadoItemClasi2 ? true : false}>{e.uni_nombre1}</ListGroup.Item> ;
                                                                else
                                                                    return
                                                            })}                                       
                                                        </ListGroup>
                                                </div>
                                            </Col>
                                        </Row>
                                   
                                    </Card.Body>
                                </Card>  
                            </div>       
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ display: this.props.guardarAction===undefined ? "block" : "none" }}>
                            <div className="form-group">                
                                <Button disabled={!this.props.permisos?.EDIT} variant="primary" onClick={()=>this.setState({estadoModal:true})}>Guardar</Button>       
                            </div>
                        </Col>
                    </Row>
                </Container>  
            </div>
        );
    }
}

export default InfoBasicaComponent;