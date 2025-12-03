import * as React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import homoApi from '../../../api/homologaciones/Homologacion';
import uniApi from '../../../api/homologaciones/UniUnidad';
import EmpresasApi from '../../../api/homologaciones/Empresas';
import { Typeahead, AsyncTypeahead } from 'react-bootstrap-typeahead';
import basicoDefault from '../../../api/homologaciones/BasicoDefault';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import PARAMETROS from '../../../data/constantes';
//import { PageableRequest } from '../../../models/dto/Pagination';

interface IProps {
    //agregarTarea:(tarea :ITareas)=>void;
    //lista:IAutor[];
    //eliminar: (id:number)=>void; 
    value?: any,
    buscarMetodo: (e: any) => void,
    limpiarMetodo: () => void,
    listar:()=>void,
    nombreBoton:String
    //cambioValor:(value: React.ChangeEvent<HTMLSelectElement>)=>void;
}
//const defaultPageable: PageableRequest = { 'page': 0, 'size': 5, 'sort': null };
class BusquedaComponent extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);  
        this.state={
            value:'',
            vistaLista:false,
            defecto:{},
            busqueda:{
                dsus9dsus_pcodigo:'',
                //ter9ñter_nomcompleto:'',
                ter9ter_ideregistro:0,
                ter9ter_documento:'',
                pro9uni_tipovivienda:0,
                dsus9pro_catestrato:'',
                //pro9pro_direccion:'',
                pro9ñpro_direccion:'',
                proyecto9proyecto_ideregistro:0,
                dsus9uni_barrio:0,
                dsus9uni_tipusosuscr:'',
                pro9pro_numcatastral:'',
                cic9cic_ideregistro:0,
                rut9rut_ideregistro:0,
                pro9pro_numcatastralnacional:'',
                dsus9dsus_estado:'',
                ///empresa alterna
                empresa:0,
                proidepropieda:'',
                dsusIderegistr:Number,
                dsusPcodigo:'',
                empresaSession:0,
                dsus9dsus_ideregistr:Number,
                dsus8dsus_fecinicio:Date,
                dsus9dsus_fecinicio:Date
            },
            proyectos:[],
            estratos:[],
            tiposUso:[],
            barrios:[],
            ciclos:[],
            rutas:[],
            ubicacionLista:[],
            empresasAlternas:[],
            listaEstados:[],
            encabezadoLista:['Codigo','Identificacion','Nombres','Direccion','Catastral','Estrato','Ciclo','Clase','Fecha'],
            listaResultado:[],
            barrioSeleccion:[],
            terceros:[],
            terceroSeleccion:[],
            cargandoTercero:false,
            login:{
                idEmpresa:0,
                idUsuario:0
            },
        };
        //this.cambioValor=this.cambioValor.bind(this);
    }

     cargarProyectos=async()=>
    {
        try
         {
        let api:homoApi =new homoApi();
        let tmp=await api.listaProyectos(this.state.busqueda.empresaSession);
        this.setState({
            proyectos:tmp.data
        })
        }catch(e){
            console.log('error que sale '+e);
        }
    }

    cargarUnidades=async()=>
    {
        try
        {
                let basico:basicoDefault=new basicoDefault();
                let api:uniApi =new uniApi();
                let tmp=await api.datosUnidades(parseInt(basico.buscarParametro('clase_estrato',this.state.parametros)),0);
                let tmp2=await api.datosUnidades(parseInt(basico.buscarParametro('clase_tipo_uso',this.state.parametros)),0);
                let tmp3=await api.datosUnidades(parseInt(basico.buscarParametro('clase_tipo_ubicacion',this.state.parametros)),0);
                let tmp4=await api.datosUnidades(parseInt(basico.buscarParametro('clase_estados_suscripcion',this.state.parametros)),0);
                this.setState({
                    estratos:tmp.data,
                    tiposUso:tmp2.data,
                    ubicacionLista:tmp3.data,
                    listaEstados:tmp4.data
                })
        }catch(e){
            console.log('error que sale Busqueda '+e);
        }
    }

    cargarCiclos=async()=>
    {
        try
        {
            let api:homoApi =new homoApi();
            let tmp=await api.listaCiclos(this.state.busqueda.empresaSession);
            this.setState({
                ciclos:tmp.data
            })
        }catch(e){
            console.log('error que sale '+e);
        }
    }

    cargarEmpresas=async()=>
    {
        try
        {
            let api:EmpresasApi =new EmpresasApi();
            let tmp=await api.empresasAlternas(this.state.busqueda.empresaSession);
            this.setState({
                empresasAlternas:tmp.data
            })
        }catch(e){
            console.log('error que sale '+e);
        }
    }


    async componentDidMount() 
    {
        await this.cargarDatosSesion();
        await this.cargarParametros();
        await this.cargarProyectos();
        await this.cargarCiclos();
        await this.cargarUnidades();
        await this.cargarEmpresas();
        await this.setState({
            defecto:this.state.busqueda
        })
    }

    cargarDatosSesion=async()=>
    {
       try
       {
        let basico:basicoDefault=new basicoDefault();
        let resultado=basico.extraerInfoToken(localStorage.getItem('token')); 
         await this.setState({
             login:{
                 ...this.state.login,idEmpresa:resultado.idEmpresa,idUsuario:resultado.idUsuario
             },
             busqueda:{
                 ...this.state.busqueda,empresaSession:resultado.idEmpresa
             }
         })
       }catch(e){console.log('mensaje de error '+e)} 
    }

    cargarParametros=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            parametros:tmp.data
        })
    }
    
    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        //console.log('desde input '+value + ' '+name );
        await this.setState({
            busqueda:{
                ...this.state.busqueda,[name]:value
            }
        })
    }

    async cambioValor2(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        try
        {
            //let proyectoTmp=this.state.proyectos[value]
            let proyectoTmp=this.state.proyectos.find(e=> e.proyecto_ideregistro===parseInt(value));
            let api:homoApi =new homoApi();
            let barrTmp=await api.listaBarrios(proyectoTmp.proyecto_cod);
            await this.setState({
                busqueda:{
                    ...this.state.busqueda,[name]:proyectoTmp.proyecto_ideregistro,dsus9uni_barrio:0
                },
                barrios:barrTmp.data
            })
        }catch(e){
            console.log('error que sale '+e);
            await this.setState({
                busqueda:{
                    ...this.state.busqueda,[name]:0,dsus9uni_barrio:0
                },
                barrios:[]
            })
        }

        //console.log(this.state);
        
    }

    async cambioValor3(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        try
        {
                //let cicTmp=this.state.ciclos[value]
                //let cicTmp=this.state.ciclos.find(e=>e.cic_ideregistro===parseInt(value))
                let api:homoApi =new homoApi();
                //let rutTmp=await api.listaRutas(cicTmp.cic_ideregistro);
                let rutTmp=await api.listaRutas(parseInt(value));
                //console.log(barrTmp.data);
                //console.log('desde input '+value + ' '+name );
                await this.setState({
                    busqueda:{
                        //...this.state.busqueda,[name]:cicTmp.cic_ideregistro,rut9rut_ideregistro:0
                        ...this.state.busqueda,[name]:parseInt(value),rut9rut_ideregistro:0
                    },
                    rutas:rutTmp.data
                })
        }catch(e){
            console.log('error que sale '+e);
            await this.setState({
                busqueda:{
                    ...this.state.busqueda,[name]:0,rut9rut_ideregistro:0
                },
                rutas:[]
            })
        }

        //console.log(this.state);
        
    }

    async cambioValorProyecto(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        try
        {
            //let proyectoTmp=this.state.proyectos[value]
            let proyectoTmp=this.state.proyectos.find(e=> e.proyecto_ideregistro===parseInt(value));
            let api:homoApi =new homoApi();
            let barrTmp=await api.listaBarrios(proyectoTmp.proyecto_cod);
            await this.setState({
                busqueda:{
                    ...this.state.busqueda,[name]:proyectoTmp.proyecto_ideregistro,dsus9uni_barrio:0
                },
                barrios:barrTmp.data,
                barrioSeleccion:[]
            })
        }catch(e){
            console.log('error que sale '+e);
            await this.setState({
                busqueda:{
                    ...this.state.busqueda,[name]:0,dsus9uni_barrio:0
                },
                barrios:[],
                barrioSeleccion:[]
            })
        }

        //console.log(this.state);
        
    }

    cambioValorBarrio=(e:any)=>
    {
        //console.log(e);
        if(e[0]!==undefined)
        {
            this.setState({
                busqueda:{
                    ...this.state.busqueda,dsus9uni_barrio:e[0].barrio_ideregistro 
                },
                barrioSeleccion:[e[0]]
            })
        }
        else
        {
            this.setState({
                barrioSeleccion:[]
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

    cambioValorTercero=(e:any)=>
    {
        console.log(e);
        if(e[0]!==undefined)
        {
            this.setState({
                busqueda:{
                    ...this.state.busqueda,ter9ter_ideregistro:e[0].ter_ideregistro 
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

    resetBusqueda=async()=>
    {
        await this.setState({
            busqueda:this.state.defecto
            /*
            busqueda:{
                ...this.state.busqueda,suscripcion:null,ter9ter_nomcompleto:'',ter9ter_documento:null,empresa:null,
                ubicacion:null,pro9pro_catestrato:null,pro9pro_direccion:null,pro9pro_idepropieda:null,codigo:null,
                proyecyo9proyecto_ideregistro:0,dsus9uni_barrio:null,dsus9sus_ideregistro:null,dsus9uni_tipusosuscr:null,
                pro9pro_numcatastral:null,cic9cic_ideregistro:null,rut9rut_ideregistro:null,estado:null
            }
            */
        })
    }

    buscar=async()=>
    {
        this.props.buscarMetodo(this.state.busqueda);
    }

    limpiar=async()=>
    {
       await this.props.limpiarMetodo();
       await this.resetBusqueda();
       //console.log(this.state.busqueda);
    }

    listar=async()=>
    {
        await this.props.listar();
    }

    editarHomo=(e:any)=>
    {
        console.log(e);
    }

    camposEmpresaAlterna=(): any=>
    {
        if(parseInt(this.state.busqueda.empresa)===322)
        {
            return (
                <Row>
                        <Col>
                                        <div className="form-group">
                                            <label >Medidor de Gas</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='proidepropieda' value={this.state.busqueda.proidepropieda} type='text' placeholder=""/>
                                        </div> 
                        </Col>
                        <Col>
                                        <div className="form-group">
                                            <label >Codigo</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='dsusPcodigo' value={this.state.busqueda.dsusPcodigo} type='text' placeholder=""/>
                                        </div> 
                        </Col>
                        <Col>
                                        <div className="form-group">
                                            <label >id Suscripcion</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='dsusIderegistr' value={this.state.busqueda.dsusIderegistr} type='number' placeholder=""/>
                                        </div> 
                        </Col>
                </Row>
            )
        }
        if(parseInt(this.state.busqueda.empresa)===299)
        {
            return(
                <Row>
                    <Col>
                                        <div className="form-group">
                                            <label >Medidor EMSA</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='proidepropieda' value={this.state.busqueda.proidepropieda} type='text' placeholder=""/>
                                        </div> 
                    </Col>
                    <Col>
                                        <div className="form-group">
                                            <label >Codigo Cliente EMSA</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='dsusPcodigo' value={this.state.busqueda.dsusPcodigo} type='text' placeholder=""/>
                                        </div> 
                        </Col>

                </Row>
            )
        }
        if((parseInt(this.state.busqueda.empresa)!=322 || parseInt(this.state.busqueda.empresa)!=299) && parseInt(this.state.busqueda.empresa)>0)//if(parseInt(this.state.busqueda.empresa)===300)
        {
            return(
                <Row>
                    <Col>
                                        <div className="form-group">
                                            <label >Codigo Propiedad</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='proidepropieda' value={this.state.busqueda.proidepropieda} type='text' placeholder=""/>
                                        </div> 
                    </Col>
                    <Col>
                                        <div className="form-group">
                                            <label >Id Suscripcion</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='dsusIderegistr' value={this.state.busqueda.dsusIderegistr} type='number' placeholder=""/>
                                        </div> 
                        </Col>

                </Row>
            )
        }
        else
        {
            return
        }
    }

    render()
    {
        return(
            <div>
                                <Row>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label >Código Anterior</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='dsus9dsus_pcodigo' value={this.state.busqueda.dsus9dsus_pcodigo} type='text' placeholder="Suscripcion"/>
                                        </div> 
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label >ID Suscripcion</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='dsus9dsus_ideregistr' value={this.state.busqueda.dsus9dsus_ideregistr} type='number' placeholder="ID Suscripcion"/>
                                        </div> 
                                    </Col>                                    
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label>Documento</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='ter9ter_documento' value={this.state.busqueda.ter9ter_documento} type='text' placeholder=""/>
                                        </div> 
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label>Empresa Alterna</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='empresa' value={this.state.busqueda.empresa} >
                                                    <option value={0} key="0"></option>
                                                    {this.state.empresasAlternas.map((e : any, key : number) => {
                                                        return <option key={key} value={e.empresa_sevemp}>{e.empresa_nom}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                                    </Col>
                                </Row>
                                {this.camposEmpresaAlterna()}                                    
                                <Row>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label >Tercero</label>                                           
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
                                    </Col >
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={4}>
                                        <div className="form-group">
                                            <label>Ubicacion</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='pro9uni_tipovivienda' value={this.state.busqueda.pro9uni_tipovivienda}>
                                                    <option value="--" key="0"></option>
                                                    {this.state.ubicacionLista.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={4}>
                                        <div className="form-group">
                                            <label>Estrato</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='dsus9pro_catestrato' value={this.state.busqueda.pro9pro_catestrato}>
                                                    <option value="--" key="0"></option>
                                                    {this.state.estratos.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_codigo1}>{e.uni_nombre1}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                                    </Col>                                                                      
                                </Row>
                                <Row>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={12}>
                                        <div className="form-group">
                                            <label >Direccion</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='pro9ñpro_direccion' value={this.state.busqueda.pro9ñpro_direccion} type='text' placeholder=""/>
                                        </div> 
                                    </Col> 
                                </Row>
                                <Row>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={6}>
                                        <div className="form-group">
                                            <label>Municipio</label>
                                            <select onChange={e=>this.cambioValorProyecto(e)} className="form-control" name='proyecto9proyecto_ideregistro' value={this.state.proyecto9proyecto_ideregistro}>
                                            <option value="0" key="0"></option>
                                                    {this.state.proyectos.map((e : any, key : number) => {
                                                        return <option key={key} value={e.proyecto_ideregistro}>{e.proyecto_nom}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={6}>
                                        <div className="form-group">
                                            <label>Barrio</label>
                                            <Typeahead
                                                id="basic-typeahead-single"
                                                labelKey="barrio_nom"
                                                onChange={e=>this.cambioValorBarrio(e)}
                                                options={this.state.barrios}
                                                placeholder="Elegir barrio..."
                                                selected={this.state.barrioSeleccion}
                                                />                                            
                                        </div> 
                                    </Col>                                    
                                </Row>
                                <Row>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label >Numero Catastral</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='pro9pro_numcatastral' value={this.state.busqueda.pro9pro_numcatastral} type='text' placeholder=""/>
                                        </div> 
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label>Tipo de uso</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='dsus9uni_tipusosuscr' value={this.state.busqueda.dsus9uni_tipusosuscr} >
                                                    <option value="--" key="0"></option>
                                                    {this.state.tiposUso.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label>Ciclo</label>
                                            <select onChange={e=>this.cambioValor3(e)} className="form-control" name='cic9cic_ideregistro' value={this.state.busqueda.cic9cic_ideregistro} >
                                                    <option value="" key="0"></option>
                                                    {this.state.ciclos.map((e : any, key : number) => {
                                                        return <option key={key} value={e.cic_ideregistro}>{e.cic_nombre}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label>Ruta</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='rut9rut_ideregistro' value={this.state.busqueda.rut9rut_ideregistro}>
                                                    <option value="--" key="0"></option>
                                                    {this.state.rutas.map((e : any, key : number) => {
                                                        return <option key={key} value={e.rut_ideregistro}>{e.rut_nombre}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label >Numero Catastral Internacional</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='pro9pro_numcatastralnacional' value={this.state.busqueda.pro9pro_numcatastralnacional} type='text' placeholder=""/>
                                        </div> 
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">
                                            <label>Estado</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='dsus9dsus_estado' value={this.state.busqueda.dsus9dsus_estado} >
                                                    <option value="--" key="0"></option>
                                                    {this.state.listaEstados.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_codigo1}>{e.uni_nombre1}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                    <div className="form-group">
                                        <label htmlFor="vigencia-desde">Desde</label>
                                        <input id="vigencia-desde"
                                        className="form-control"
                                        name="dsus8dsus_fecinicio"
                                        type="date"
                                        onChange={(e)=>this.cambioValor(e)}
                                        />
                                        <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-calendar" />
                                        </span>
                                    </div>
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                    <div className="form-group">
                                        <label htmlFor="vigencia-hasta">Hasta</label>
                                        <input id="vigencia-hasta"
                                        className="form-control"
                                        name="dsus9dsus_fecinicio"
                                        type="date"
                                        onChange={(e)=>this.cambioValor(e)}                
                                        />
                                        <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-calendar" />
                                        </span>
                                    </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">         
                                                <Button variant="primary" onClick={this.buscar}>{this.props.nombreBoton}</Button>    
                                        </div>    
                                    </Col>
                                    <Col xs={PARAMETROS.RESPONSIVE.XS} md={PARAMETROS.RESPONSIVE.MD}>
                                        <div className="form-group">                
                                            <Button variant="primary" onClick={this.limpiar}>Limpiar</Button>    
                                        </div>    
                                    </Col>
                                </Row>                        
            </div>
        );
    }
}

export default BusquedaComponent;