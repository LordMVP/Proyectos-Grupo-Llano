import React, { Suspense } from 'react'
import { Row, Col, Card , Accordion , Button, Badge} from 'react-bootstrap';
import Lista from '../../components/Table/TableFormato';
import Busqueda from '../../components/Homologaciones/Busqueda';


import homoApi from '../../api/Homologacion';

interface IProps{
    //agregarTarea:(tarea :ITareas)=>void;
    //lista:IAutor[];
    //eliminar: (id:number)=>void; 
    value?:any,
    //cambioValor:(value: React.ChangeEvent<HTMLSelectElement>)=>void;
}

class Actualizacion extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            value:'',
            vistaLista:false,
            vistaEditar:false,
            encabezadoLista:['Codigo','Identificacion','Nombres','Direccion','Catastral','Estrato','Ciclo','Clase','Fecha'],
            listaResultado:[],
            menuEditar:['+','+','+','+']
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

    componentDidMount() 
    {
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

    buscar=async(e:any)=>
    {
       let api:homoApi =new homoApi();
        let tmp=await api.listaBusquedaRuta(e.ruta);
        await this.setState({
            listaResultado:tmp.data,
            vistaLista:true,//!this.state.vistaLista
            vistaEditar:false
        })
    }

    limpiar=()=>
    {
        this.setState({
            vistaLista:false,
            vistaEditar:false
        })
    }

    editarHomo=(e:any)=>
    {
        console.log(e);
        this.setState({
            vistaLista:false,
            vistaEditar:true
        })
    }
    
    cambioAcordeon=(e:any)=>
    {
        let tmp =this.state.menuEditar[e]==='+' ? '-' : '+';
        let tmpArray=this.state.menuEditar;
        tmpArray[e]=tmp;
        this.setState({
            menuEditar:tmpArray
        })
    }

    render()
    {
        return(
            <div>
                <Suspense fallback={<div>Cargando...</div>}>
                        <h2>Actualizacion y Homologacion</h2>
                        <div className="form-group">
                            <Busqueda buscarMetodo={this.buscar}  limpiarMetodo={this.limpiar}/>
                        </div>
                        <div style={{ display: this.state.vistaLista ? "block" : "none" }} className="form-group">
                                 <Card className="mb-5">
                                    <h2>Resultado Busqueda</h2>
                                    <Row>
                                        <Col>
                                            <Lista encabezado={this.state.encabezadoLista} datos={this.state.listaResultado} editar={this.editarHomo}></Lista>                                               
                                        </Col>
                                    </Row>             
                                </Card>                 
                        </div>
                        <div style={{ display: this.state.vistaEditar ? "block" : "none" }} className="form-group">
                                <Accordion >
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={() =>this.cambioAcordeon(0)}>
                                                    {
                                                    this.state.menuEditar[0]==='+'? <p style={{fontWeight: "bold", color: 'black'}}><Badge variant="primary">+</Badge> Informacion Basica</p> 
                                                    : <p style={{fontWeight: "bold", color: 'black'}}><Badge variant="primary"> - </Badge> Informacion Basica</p> 
                                                    }
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>Hello! I'm the body</Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="1" onClick={() =>this.cambioAcordeon(1)}>
                                                    {
                                                        this.state.menuEditar[1]==='+'? <p style={{fontWeight: "bold", color: 'black'}}><Badge variant="primary">+</Badge> Informacion Suscripcion</p> 
                                                        : <p style={{fontWeight: "bold", color: 'black'}}><Badge variant="primary"> - </Badge> Informacion Suscripcion</p> 
                                                    }
                                                    
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                                 <Card.Body>Hello! I'm another body</Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="2" onClick={() =>this.cambioAcordeon(2)}>
                                                    {
                                                        this.state.menuEditar[2]==='+'? <p style={{fontWeight: "bold", color: 'black'}}><Badge variant="primary">+</Badge> Informacion Homologacion</p>
                                                        : <p style={{fontWeight: "bold", color: 'black'}}><Badge variant="primary"> - </Badge> Informacion Homologacion</p>
                                                    }
                                                        
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="2">
                                                <Card.Body>Hello! I'm another body</Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="3" onClick={() =>this.cambioAcordeon(3)}>
                                                    {
                                                        this.state.menuEditar[3]==='+'? <p style={{fontWeight: "bold", color: 'black'}}><Badge variant="primary">+</Badge> Informacion Gestion Actualizacion</p> 
                                                        : <p style={{fontWeight: "bold", color: 'black'}}><Badge variant="primary"> - </Badge> Informacion Gestion Actualizacion</p> 
                                                    }
                                                    
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="3">
                                                <Card.Body>Hello! I'm another body</Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                </Accordion>
                        </div>          
                </Suspense>        
            </div>
        );
    }
}

export default Actualizacion;