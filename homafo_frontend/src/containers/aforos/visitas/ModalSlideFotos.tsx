
import {TconceptosList} from '../../../models/types/aforos/ConceptosList'   //import first
import  * as API from '../../../api/aforos/aforosVisitas'
import React, { Component } from 'react'
import { Button, Modal, Container, Row, Col , Carousel , Spinner , ListGroup } from 'react-bootstrap'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { currentDate } from '../../../utils/Dates';
import Cargando from '../../../components/utils/Cargando';
//import SlideFotos from '../../../components/utils/SlideFotos/SlideFotos'
type changeEventElement = React.ChangeEvent<HTMLInputElement>;
// interface Iprops{
//     data?:[];
//     children?:ReactNode;
//     showModalConceptos?:boolean;
//     handleModalConceptosClose?:()=>void;
//     handleModalConceptosSave?:(x:any)=>void;
// }


export default class ModalSlideFotos extends Component <{showModalConceptos,handleModalConceptosClose,data,idVisita,fechaEjecucion,observaciones,dia,semana},{}>  {
    state={
        visitaList:[], //maybe should be a props |||| props.data[]  become in itemList
        idVisita:"",
        observaciones:"",
        observfotosListaciones:[] as Array<any>,
        fechaEjecucion:currentDate(),
        addConcepto:"",
        addconceptoSelected:[] as Array<TconceptosList>,
        conceptosList:[] as Array<TconceptosList>,
        addCantidad:"",
        addPeso:"",
        semana:"",
        fotosList:[] as Array<any>,
        dia:"",
        addObservaciones:"",
        itemsList:[],
        listaImagenes:[],
        mensajeImagenes:'',
        estadoBusqueda:false,
        listaObservaciones:[],
    }
    componentWillReceiveProps(prevProps){
        console.log('estoy en preProvs...');
        // if(prevProps[name]!==this.props[name])
        
        this.setState({itemsList:this.props.data})
        if(prevProps.fechaEjecucion===""){

            this.setState({fechaEjecucion:currentDate()})
        }else{
            this.setState({fechaEjecucion:prevProps.fechaEjecucion})
            
        }
        this.setState({observaciones:prevProps.observaciones})
        this.setState({semana:prevProps.semana})
        this.setState({dia:prevProps.dia})
        this.setState({idVisita:prevProps.idVisita},()=>{
  
        if(prevProps.showModalConceptos)
        {
            this.fetchData(); 
        }    
        else
        {
            this.setState({
                listaImagenes:[],
                listaObservaciones:[]
            })
        }  
        })
        
    }
    componentDidMount(){
        // this.fetchData()
    }
    fetchData=async()=>{
        let data=""
        await this.setState({
            estadoBusqueda:true,
            mensajeImagenes:''
        })
        if(!this.state.idVisita ){
         data ="0"

        }else{
            //console.log("this.state.idVisita else ",this.state.idVisita)
            data =this.state.idVisita
            await API.getFotosVisitas(data).then(response => {
            
                 if(response.success===true){
                //  if(response){
                    // this.setState({ fotosList: response })  
                    this.setState({
                         fotosList: response.data , listaObservaciones:JSON.parse(response.message) },()=>console.log("array fotos:",this.state.fotosList))
                    //console.log('que tiene el response ',response);
                    return response;
                } } //end if
                ).catch(error => { return Promise.reject(error.status); }); //end .catch-consolidado
        }
        let arrayTmp:any=[];
        for(let tmp in this.state.fotosList)
        {
           let valor= this.state.fotosList[tmp].datos;
           let convertir=await fetch(`data:${valor.tipo};base64,${valor.contenido}`);
           let blob=await convertir.blob();
           arrayTmp.push({'valor':URL.createObjectURL(blob),'id':valor.id});
           //arrayTmp.push(URL.createObjectURL(blob));
        }
        await this.setState({
            listaImagenes:arrayTmp,
            estadoBusqueda:false
        })
        if(this.state.listaImagenes.length===0)
        {
            this.setState({
                mensajeImagenes:"NO HAY IMAGENES ..."
            })
        }

        }
        
    

    handleChange = (event: changeEventElement) => this.setState({ [event.target.name]: event.target.value } as any)
    
    handleModalConceptosClose=()=>{}

    buscando=():any=>
    {
        if(this.state.estadoBusqueda)
        {
            return(
                      <h3><Spinner animation="border" variant="primary" />BUSCANDO...</h3>                                        
            ) 
        }
        else
            return
    }

render(){
const {}=this.state
        
        return (
            <>
    <Modal 
    size="lg" 
    aria-labelledby="contained-modal-title-vcenter" 
    animation={false} show={this.props.showModalConceptos} 
    onHide={this.props.handleModalConceptosClose} 
    dialogClassName="modal-detalle"
    centered >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div>
                                Fotos de la Visita  :{this.props.idVisita}, <strong>Dia </strong> {this.state.dia}  <strong>Semana </strong> {this.props.semana}
                                </div> 
                            <div>{this.props.children}</div>
                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Cargando/>
                                            <Container>
                                            <Row >
                                                    <Col  style={{display: 'flex', justifyContent: 'center'}}>
                                                        <h3>{this.state.mensajeImagenes}</h3>
                                                        {this.buscando()}                                                        
                                                        <Carousel>
                                                                { this.state.listaImagenes.map(function (url:any){
                                                                                        return (
                                                                                            <Carousel.Item>
                                                                                                    <img src={url.valor} alt="" style={{height:"500px",width:"700px"}} />
                                                                                                    <Carousel.Caption>
                                                                                                        <h3 style={{color:'green'}}>ID {url.id}</h3>
                                                                                                    </Carousel.Caption>
                                                                                            </Carousel.Item>
                                                                                        );
                                                                                    })}                                                                                
                                                        </Carousel>
                                                    
                                                    </Col>
                                                
                                        </Row>
                                        <Row>
                                            <Col>
                                                <label>Observaciones</label>
                                                <ListGroup>
                                                    {this.state.listaObservaciones.map((e : any) => {
                                                    return <ListGroup.Item>Id : {e.id} - {e.observaciones}</ListGroup.Item>;
                                                    })}
                                                </ListGroup>
                                            </Col>
                                        </Row>  
                                               
                                            </Container>
                            </Modal.Body>
                             <Modal.Footer>
                                <Button onClick={this.props.handleModalConceptosClose}>Cerrar</Button>
                          </Modal.Footer>
                     </Modal>
    </>
  );
}
}

// ModalDetalles.defaultProps = {
//     data:[{tipo_recipiente: '',dimensiones: '',cantidad_recipientes: '',equivalencia: '',total: ''}],
//     observaciones:"",
// };
