import * as React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import homoApi from '../../api/Homologacion';

interface IProps{
    //agregarTarea:(tarea :ITareas)=>void;
    //lista:IAutor[];
    //eliminar: (id:number)=>void; 
    value?:any,
    buscarMetodo:(e:any)=>void,
    limpiarMetodo:()=>void
    //cambioValor:(value: React.ChangeEvent<HTMLSelectElement>)=>void;
}

class Busqueda extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            value:'',
            vistaLista:false,
            busqueda:{
                suscripcion:'',
                tercero:'',
                documento:'',
                empresa:0,
                ubicacion:0,
                estrato:0,
                direccion:'',
                medidor:0,
                codigo:0,
                proyecto:0,
                barrio:0,
                idSuscrpcion:'',
                tipouso:0,
                catastral:0,
                ciclo:0,
                ruta:0,
                estado:'A'
            },
            proyectos:[],
            barrios:[],
            ciclos:[],
            rutas:[],
            encabezadoLista:['Codigo','Identificacion','Nombres','Direccion','Catastral','Estrato','Ciclo','Clase','Fecha'],
            listaResultado:[]
        };
        //this.cambioValor=this.cambioValor.bind(this);
    }

     cargarProyectos=async()=>
    {
        try
         {
        let api:homoApi =new homoApi();
        let tmp=await api.listaProyectos();
        this.setState({
            proyectos:tmp.data
        })
        }catch(e){
            console.log('error que sale '+e);
        }
    }

    cargarCiclos=async()=>
    {
        try
        {
            let api:homoApi =new homoApi();
            let tmp=await api.listaCiclos();
            this.setState({
                ciclos:tmp.data
            })
        }catch(e){
            console.log('error que sale '+e);
        }
    }

    componentDidMount() 
    {
        this.cargarProyectos();
        this.cargarCiclos();
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
        //let proyectoTmp=this.state.proyectos[value]
        let proyectoTmp=this.state.proyectos.find(e=> e.proyecto_ideregistro===parseInt(value));
        let api:homoApi =new homoApi();
        let barrTmp=await api.listaBarrios(proyectoTmp.proyecto_cod);
        await this.setState({
            busqueda:{
                ...this.state.busqueda,[name]:proyectoTmp.proyecto_ideregistro,barrio:0
            },
            barrios:barrTmp.data
        })

        //console.log(this.state);
        
    }

    async cambioValor3(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        //let cicTmp=this.state.ciclos[value]
        let cicTmp=this.state.ciclos.find(e=>e.cic_ideregistro===parseInt(value))
        let api:homoApi =new homoApi();
        let rutTmp=await api.listaRutas(cicTmp.cic_ideregistro);
        //console.log(barrTmp.data);
        //console.log('desde input '+value + ' '+name );
        await this.setState({
            busqueda:{
                ...this.state.busqueda,[name]:cicTmp.cic_ideregistro,ruta:0
            },
            rutas:rutTmp.data
        })

        //console.log(this.state);
        
    }

    buscar=async()=>
    {
        this.props.buscarMetodo(this.state.busqueda);
    }

    limpiar=()=>
    {
       this.props.limpiarMetodo();
    }

    editarHomo=(e:any)=>
    {
        console.log(e);
    }
    

    render()
    {
        return(
            <div>
                        <Container>
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label >Suscripcion</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='suscripcion' value={this.state.busqueda.suscripcion} type='text' placeholder="Suscripcion"/>
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label >Tercero</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='tercero' value={this.state.busqueda.tercero} type='text' placeholder=""/>
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Documento</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='documento' value={this.state.busqueda.documento} type='text' placeholder=""/>
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Empresa Alterna</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='empresa' value={this.state.busqueda.empresa} >
                                                    <option value="--" key="0"></option>
                                                    <option value="LLanogas" key="1">LLanogas</option>
                                                    <option value="Emsa" key="2">Emsa</option>
                                                </select>  
                                        </div> 
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label>Ubicacion</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='ubicacion' value={this.state.busqueda.ubicacion}>
                                                    <option value="--" key="0"></option>
                                                    <option value="Rural" key="1">Rural</option>
                                                    <option value="Urbana" key="2">Urbana</option>
                                                </select>  
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Estrato</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='estrato' value={this.state.busqueda.estrato}>
                                                    <option value="--" key="0"></option>
                                                    <option value="1" key="1">1</option>
                                                    <option value="2" key="2">2</option>
                                            </select>  
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label >Direccion</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='direccion' value={this.state.busqueda.direccion} type='text' placeholder=""/>
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label >Medidor de Gas</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='medidor' value={this.state.busqueda.medidor} type='text' placeholder=""/>
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label >Codigo</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='codigo' value={this.state.busqueda.codigo} type='text' placeholder=""/>
                                        </div> 
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label>Municipio</label>
                                            <select onChange={e=>this.cambioValor2(e)} className="form-control" name='proyecto' value={this.state.busqueda.proyecto}>
                                            <option value="--" key="0"></option>
                                                    {this.state.proyectos.map((e : any, key : number) => {
                                                        return <option key={key} value={e.proyecto_ideregistro}>{e.proyecto_nom}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Barrio</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='barrio' value={this.state.busqueda.barrio}>
                                                    <option value="--" key="0"></option> 
                                                    {this.state.barrios.map((e : any, key : number) => {
                                                        return <option key={key} value={e.barrio_ideregistro}>{e.barrio_nom}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label >id Suscrpcion</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='idSuscrpcion' value={this.state.busqueda.idSuscripcion} type='text' placeholder=""/>
                                        </div> 
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <label >Numero Catastral</label>
                                            <input className="form-control" onChange={e=>this.cambioValor(e)} name='catastral' value={this.state.busqueda.catastral} type='text' placeholder=""/>
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Tipo de uso</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='tipouso' value={this.state.busqueda.tipouso} >
                                                    <option value="--" key="0"></option>
                                                    <option value="1" key="1">1</option>
                                                    <option value="2" key="2">2</option>
                                            </select>  
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Ciclo</label>
                                            <select onChange={e=>this.cambioValor3(e)} className="form-control" name='ciclo' value={this.state.busqueda.ciclo} >
                                                    <option value="--" key="0"></option>
                                                    {this.state.ciclos.map((e : any, key : number) => {
                                                        return <option key={key} value={e.cic_ideregistro}>{e.cic_nombre}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Ruta</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='ruta' value={this.state.busqueda.ruta}>
                                                    <option value="--" key="0"></option>
                                                    {this.state.rutas.map((e : any, key : number) => {
                                                        return <option key={key} value={e.rut_ideregistro}>{e.rut_nombre}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <label>Estado</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='estado' value={this.state.busqueda.estado} >
                                                    <option value="--" key="0"></option>
                                                    <option value="1" key="1">1</option>
                                                    <option value="2" key="2">2</option>
                                            </select>  
                                        </div> 
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group">         
                                            <Button variant="primary" onClick={this.buscar}>Buscar</Button>    
                                        </div>    
                                    </Col>
                                    <Col>
                                        <div className="form-group">                
                                            <Button variant="primary" onClick={this.limpiar}>Limpiar</Button>    
                                        </div>    
                                    </Col>
                                </Row>
                        </Container>                        
            </div>
        );
    }
}

export default Busqueda;