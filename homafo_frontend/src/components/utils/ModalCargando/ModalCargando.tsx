import * as React from 'react';
import { Modal, Row, Col} from 'react-bootstrap';
import Loader from "react-loader-spinner";

interface IProps{
    estado:boolean
    //titulo:string,
    //accionBoton:()=>void,
    //estilo?:string
    //cambioValor:(value: React.ChangeEvent<HTMLSelectElement>)=>void;
    //datos:[]
}

class ModalCargando extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            value:'',
            estado:true
        };
    }

    componentDidMount() 
    {
        
    }

    render()
    {
        return(
            <div>
                    <Modal show={this.state.estado} centered>
                        <Modal.Body>Procesando...</Modal.Body>
                        <Modal.Footer>
                            <Row>
                                <Col>
                                        <div>
                                            <Loader type="ThreeDots" color="#4A90E2" height={100} width={100} />                                    
                                        </div>
                                </Col>                                
                            </Row>    
                        </Modal.Footer>
                    </Modal>
            </div>
        );
    }

}
export default ModalCargando;