import * as React from 'react';
import {Button , Modal} from 'react-bootstrap';

interface IProps{
    cerrar:()=>void,
    informacion?:any
    //titulo:string,
    //accionBoton:()=>void,
    //estilo?:string
    //cambioValor:(value: React.ChangeEvent<HTMLSelectElement>)=>void;
    //datos:[]
}

class ModalArchivo extends React.Component<IProps,any>
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

    cambioModal=()=>
    {
        this.setState({
            estado:false
        })
        this.props.cerrar();
    }

    render()
    {
        return(
            <div className="form-group">
                    <Modal show={this.state.estado} onHide={this.cambioModal}>
                        <Modal.Header closeButton>
                        <Modal.Title>Dialogo Confirmación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Confirma guardar la información?</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.cambioModal}>
                            CERRAR
                        </Button>
                        </Modal.Footer>
                    </Modal>
            </div>
        );
    }

}
export default ModalArchivo;