import * as React from 'react';
import { Alert, Row, Col, Container } from 'react-bootstrap';

interface IProps{
    //agregarTarea:(tarea :ITareas)=>void;
    //lista:IAutor[];
    //eliminar: (id:number)=>void; 
    informacion:any,
}

class Alerta extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            variante:'',
            estado:false,
            valor:''
        };
    }

    componentDidMount() 
    {
        this.setState({
            variante:this.props.informacion.variante,
            estado:this.props.informacion.estado,
            valor:this.props.informacion.valor
        })
        //console.log(this.state);
    }

    cerrarVentana=()=>
    {
        this.setState({
            estado:false
        })
    }

    render()
    {
        return(
            <div>
                <Container>
                    <Row>
                        <Col>
                                <Alert variant={this.state.variante} show={this.state.estado} onClose={this.cerrarVentana} dismissible>
                                            <p>{this.state.valor}</p>
                                </Alert>
                        </Col>
                    </Row>
                </Container>
                            
            </div>
        );
    }
}

export default Alerta;