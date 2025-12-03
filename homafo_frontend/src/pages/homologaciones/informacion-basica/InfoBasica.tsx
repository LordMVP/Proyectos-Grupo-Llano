import * as React from 'react';
import { Container, Row, Col , Button , ListGroup , Card } from 'react-bootstrap';
import uniApi from '../../../api/homologaciones/UniUnidad';
import departApi from '../../../api/homologaciones/Departamentos';
import homoApi from '../../../api/homologaciones/Homologacion';

interface IProps{
    //eliminar: (id:number)=>void; 
    value?:any,
    informacion?:any,
    guardarInfoBasica:(e:any)=>void
   
}

class InfoBasica extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            value:'',
            basico:{
                terDocumento:'',
                terNomcompleto:'',
                naturaleza:0,
                direccion:'',
                barrio:0,
                sector:0,
                departamento:0,
                proyecto:0,
                catastralAntes:'',
                castastralNuevo:'',
                matriculaInmobiliaria:'',
                ubicacion:'',
                actividadEconomica:0,
                longitud:'',
                latitud:'',
                correos:[],
                dsusIderegistr:0
            },
            correoTmp:'',
            tipoTelTmp:'',
            numeroTelTmp:'',
            clasificacionTmp:'',
            clasificacionTmp2:'',            
            listaNaturaleza:[],
            departamentos:[],
            proyectos:[],
            barrios:[],
            ubicacionLista:[],
            actividadesComerciales:[],
            clasificacionVivienda:[],
            clasificacionTercero:[]
        };
    }

    componentDidMount() 
    {
      this.cargarDefecto();
    }

    cargarDefecto=async()=>
    {
        try
        {
            
            let api:uniApi =new uniApi();
            let apiHomo:homoApi =new homoApi();
            
            let api2:departApi=new departApi();
            
            let tmp=await api.datosUnidades(5,317);
            let tmp2=await api2.listaDepartamentos();
            let tmp3=await api.datosUnidades(102,317);
            let tmp4=await api.datosUnidades(26,317);
            let tmp5=await api.datosUnidades(105,317);
            let tmp6=await api.datosUnidades(22,317);
            let tmp7=await apiHomo.listaProyectosDepart(this.props.informacion.departamento,317);
            let tmp8=await apiHomo.listaBarrios(this.props.informacion.proyectoCod);
            //console.log(tmp8.data);
            this.setState({
                
                listaNaturaleza:tmp.data,
                departamentos:tmp2.data,
                ubicacionLista:tmp3.data,
                actividadesComerciales:tmp4.data,
                clasificacionVivienda:tmp5.data,
                clasificacionTercero:tmp6.data,
                proyectos:tmp7.data,
                barrios:tmp8.data,                
                basico:this.props.informacion
            })
        }catch(e){
            console.log(e);
        }
        //console.log(this.state.basico);
    }

    guardar=()=>
    {
        //console.log(this.state.basico);
        this.props.guardarInfoBasica(this.state.basico);
    }

    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        //console.log('desde input '+value + ' '+name );
        await this.setState({
            basico:{
                ...this.state.basico,[name]:value
            }
        })
        
    }

    async cambioValor2(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        try
        {
            //let proyectoTmp=this.state.proyectos[value]
            let departTmp=this.state.departamentos.find(e=> e.departamento_ideregistro===parseInt(value));
            let api:homoApi =new homoApi();
            let proyectosTmp=await api.listaProyectosDepart(departTmp.departamento_ideregistro,317);
            await this.setState({
                basico:{
                    ...this.state.basico,[name]:departTmp.departamento_ideregistro,proyecto:0,barrio:0
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

    async cambioValor3(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        try
        {
            //let proyectoTmp=this.state.proyectos[value]
            let proyectoTmp=this.state.proyectos.find(e=> e.proyecto_ideregistro===parseInt(value));
            let api:homoApi =new homoApi();
            let barrTmp=await api.listaBarrios(proyectoTmp.proyecto_cod);
            await this.setState({
                basico:{
                    ...this.state.basico,[name]:proyectoTmp.proyecto_ideregistro,barrio:0
                },
                barrios:barrTmp.data
            })
        }catch(e){
            console.log('error que sale '+e);
            await this.setState({
                basico:{
                    ...this.state.basico,[name]:0,barrio:0
                },
                barrios:[]
            })
        }

        //console.log(this.state);
        
    }

    render()
    {
        return(
            <div>
                     <Container>
                        <Row>
                                <Col>
                                    <div className="form-group">
                                        <label >Documento Tercero</label>
                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='terDocumento' value={this.state.basico.terDocumento} type='text' placeholder=""/>
                                    </div> 
                                </Col>
                                <Col>
                                    <div className="form-group">
                                        <label >Terceros Nombres/Apellidos</label>
                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='terNomcompleto' value={this.state.basico.terNomcompleto} type='text' placeholder=""/>
                                    </div> 
                                </Col>
                                <Col>
                                        <div className="form-group">
                                            <label>Naturaleza</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='naturaleza' value={this.state.basico.naturaleza}>
                                                    <option value="--" key="0"></option>
                                                    {this.state.listaNaturaleza.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                    })}
                                            </select>    
                                        </div> 
                                    </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="form-group">
                                            <label>departamento</label>
                                            <select onChange={e=>this.cambioValor2(e)} className="form-control" name='departamento' value={this.state.basico.departamento}>
                                            <option value="0" key="0"></option>
                                                    {this.state.departamentos.map((e : any, key : number) => {
                                                        return <option key={key} value={e.departamento_ideregistro}>{e.departamento_nom}</option>;
                                                    })}
                                                </select>  
                                </div> 
                            </Col>
                            <Col>
                                        <div className="form-group">
                                            <label>Municipio</label>
                                            <select onChange={e=>this.cambioValor3(e)} className="form-control" name='proyecto' value={this.state.basico.proyecto}>
                                            <option value="0" key="0"></option>
                                                    {this.state.proyectos.map((e : any, key : number) => {
                                                        return <option key={key} value={e.proyecto_ideregistro}>{e.proyecto_nom}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                            </Col>
                            <Col>
                                        <div className="form-group">
                                            <label>Barrio</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='barrio' value={this.state.basico.barrio}>
                                            <option value="0" key="0"></option>
                                                    {this.state.barrios.map((e : any, key : number) => {
                                                        return <option key={key} value={e.barrio_ideregistro}>{e.barrio_nom}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                            </Col>
                            <Col>
                                        <div className="form-group">
                                            <label>Sector</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='sector' value={this.state.basico.sector}>
                                            <option value="0" key="0"></option>
                                                    {this.state.proyectos.map((e : any, key : number) => {
                                                        return <option key={key} value={e.proyecto_ideregistro}>{e.proyecto_nom}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                            </Col>
                            <Col>
                                    <div className="form-group">
                                        <label >Direccion</label>
                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='direccion' value={this.state.basico.direccion} type='text' placeholder=""/>
                                    </div> 
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                    <div className="form-group">
                                        <label >Catastral Antiguo (20 Caracteres)</label>
                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='catastralAntes' value={this.state.basico.catastralAntes} type='text' placeholder=""/>
                                    </div> 
                            </Col>
                            <Col>
                                    <div className="form-group">
                                        <label >Catastral Nuevo (30 caracteres)</label>
                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='catastralNuevo' value={this.state.basico.catastralNuevo} type='text' placeholder=""/>
                                    </div> 
                            </Col>
                            <Col>
                                    <div className="form-group">
                                        <label >Independencia</label>
                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='independencia' value={this.state.basico.independencia} type='text' placeholder=""/>
                                    </div> 
                            </Col>
                            <Col>
                                    <div className="form-group">
                                        <label >Matricula Inmobiliaria</label>
                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='matriculaInmobiliaria' value={this.state.basico.matriculaInmobiliaria} type='text' placeholder=""/>
                                    </div> 
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                        <div className="form-group">
                                            <label>Ubicacion</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='ubicacion' value={this.state.basico.ubicacion}>
                                                    <option value="--" key="0"></option>
                                                    {this.state.ubicacionLista.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_nombre1}>{e.uni_nombre1}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                            </Col>
                            <Col>
                                        <div className="form-group">
                                            <label>Actividad Comercial</label>
                                            <select onChange={e=>this.cambioValor(e)} className="form-control" name='actividadComercial' value={this.state.basico.actividadComercial}>
                                                    <option value="--" key="0"></option>
                                                    {this.state.actividadesComerciales.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                            </Col>
                            <Col>
                                    <div className="form-group">
                                        <label >Longitud</label>
                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='longitud' value={this.state.basico.longitud} type='text' placeholder=""/>
                                    </div> 
                            </Col>
                            <Col>
                                    <div className="form-group">
                                        <label >Latitud</label>
                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='latitud' value={this.state.basico.latitud} type='text' placeholder=""/>
                                    </div> 
                            </Col>
                        </Row>
                        <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label >Correo</label>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <input className="form-control" onChange={e=>this.cambioValor(e)} name='direccion' value={this.state.basico.correoTmp} type='text' placeholder=""/>
                                            </div>                                         
                                        </Col>
                                        <Col>
                                            <div className="form-group">    
                                                <Button variant="success">+</Button>
                                            </div> 
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                                <div className="form-group">
                                                    <ListGroup>
                                                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                                                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                                                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                                    </ListGroup>
                                                </div>  
                                        </Col>
                                    </Row>                                         
                                </Col>
                                <Col>
                                        <Row>
                                            <Col>
                                                <div className="form-group">
                                                    <label >Tipo Telefono</label>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="form-group">
                                                    <label >Numero</label>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="form-group">
                                                    <label ></label>
                                                </div>
                                            </Col>
                                        </Row>            
                                        <Row>
                                            <Col>
                                                    <div className="form-group">
                                                        <select onChange={e=>this.cambioValor3(e)} className="form-control" name='barrio' value={this.state.tipoTelTmp}>
                                                        <option value="0" key="0"></option>
                                                        <option value="Movil" key="1">Movil</option>
                                                        <option value="Fijo" key="2">Fijo</option>
                                                        </select>  
                                                    </div>
                                            </Col>
                                            <Col>
                                                    <div className="form-group">
                                                        <input className="form-control" onChange={e=>this.cambioValor(e)} name='direccion' value={this.state.numeroTelTmp} type='text' placeholder=""/>
                                                    </div>
                                            </Col>
                                            <Col>
                                                    <div className="form-group">
                                                        <Button variant="success">+</Button>
                                                    </div>    
                                            </Col>
                                        </Row>
                                        <Row>
                                                <Col>
                                                        <div className="form-group">
                                                            <ListGroup>
                                                                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                                                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                                                <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                                                                <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                                                                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                                            </ListGroup>
                                                        </div>  
                                                </Col>     
                                        </Row>     
                                </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="form-group">                   
                                    <Card>
                                        <Card.Header>Clasificacion Vivienda</Card.Header>
                                        <Card.Body>
                                        <Card.Text>
                                            <Row>
                                                <Col sm={8}>
                                                    <div className="form-group">
                                                    <select onChange={e=>this.cambioValor(e)} className="form-control" name='ubicacion' value={this.state.clasificacionTmp}>
                                                    <option value="--" key="0"></option>
                                                    {this.state.clasificacionVivienda.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                    })}
                                                </select>  
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="form-group">
                                                            <Button variant="success">+</Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={8}>
                                                    <div className="form-group">
                                                            <ListGroup>
                                                                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                                                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                                                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                                                                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                                                                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                                            </ListGroup>
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                        <div className="form-group">
                                                            <Button variant="danger">-</Button>
                                                        </div>
                                                </Col>    
                                            </Row>
                                        </Card.Text>
                                        </Card.Body>
                                    </Card>  
                                </div>       
                            </Col>
                            <Col>
                                <div className="form-group">                   
                                    <Card>
                                        <Card.Header>Clasificacion Tercero</Card.Header>
                                        <Card.Body>
                                        <Card.Text>
                                            <Row>
                                                <Col sm={8}>
                                                    <div className="form-group">
                                                    <select onChange={e=>this.cambioValor(e)} className="form-control" name='ubicacion' value={this.state.clasificacionTmp2}>
                                                    <option value="--" key="0"></option>
                                                    {this.state.clasificacionTercero.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                    })}
                                                </select>  
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="form-group">
                                                            <Button variant="success">+</Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={8}>
                                                    <div className="form-group">
                                                            <ListGroup>
                                                                        <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                                                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                                                        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                                                                        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                                                                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                                                            </ListGroup>
                                                    </div>
                                                </Col>
                                                <Col sm={4}>
                                                        <div className="form-group">
                                                            <Button variant="danger">-</Button>
                                                        </div>
                                                </Col>    
                                            </Row>
                                        </Card.Text>
                                        </Card.Body>
                                    </Card>  
                                </div>       
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="form-group">                
                                    <Button variant="primary" onClick={this.guardar}>Guardar</Button>       
                                </div>
                            </Col>
                        </Row>
                     </Container>  
            </div>
        );
    }
}

export default InfoBasica;