import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form,Button, Row, Modal, Alert } from 'react-bootstrap';
import { ACCION } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import gestionComisionServicio from '../../store/servicios/LiquidarComisionServicios';

/**
 *componente para modal con los conceptos de detalle de maestro gestión
 */
class FormModalAbonoLC extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionLC: this.props.gestionCarteraState.formEdicionLC,
            hideModal:false,
            showMensajeError:false
        }
    }
   
    handleClose = () => {
        this.props.setModalAbono();
        this.setState({
            showMensajeError:false
          });
    };
    
    handlehidde = () => {
        
    };
    
    handleChange = async (event) => {
        
        const { formEdicionLC } = this.props.gestionCarteraState;
        const controlN = event.target.name;
        const control = event.target.value;

        const formItem = {};
        formItem.mliq_idregistro = formEdicionLC.mliq_idregistro;
        formItem.mliq_valorbono = event.target.value
        this.props.selecionarItem(formItem)
   
    }

    guardar = () => {
        const { formEdicionLC } = this.props.gestionCarteraState;
        this.setState({
            showMensajeError:false
          });
          
        const validacion = validaFormulario.validaFormAbonoLC(formEdicionLC);
        if (!validacion.respuesta) {
            this.setState({
                showMensajeError:true
              });
            return false;
        } else {
           gestionComisionServicio.guardarAbono(formEdicionLC).then((responseDato) => { 
                
            if (responseDato.data.codigoRespuesta == 200) {
                    
                    gestionComisionServicio.datosGeneralesLiquidarComision([],"-1").then((responseDatoGeneral) => { 
                        var data = [];
                        if (responseDatoGeneral.data.codigoRespuesta == 200)
                        {
                          this.props.listarItem(responseDatoGeneral.data.data);
                        }else{
                          this.props.listarItem(data);
                        }
                  
                    });
                }
            });
            
        }
        
    }

    render() {
        const { showModalAbonoLC } = this.props.gestionCarteraState
        
        return (
            <div>
                <Fragment>
                    <Modal show={showModalAbonoLC} onHide={this.handlehidde }
                     aria-labelledby="contained-modal-title-vcenter"
                     centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Agregar Abono</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        {this.state.showMensajeError &&(
                            <Form.Group >
                                <Alert variant="danger">
                                    <p>Diligenciar valor abono</p>
                                </Alert>
                            </Form.Group>
                        )}
                            <Form.Group >
                                <Form.Label>Abono: </Form.Label>
                                <Form.Control type="number"  name="mliq_valorbono" onChange={this.handleChange}  placeholder="Abono"/>           
                            </Form.Group>
                            </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={this.guardar}>Guardar</Button>
                            <Button variant="secondary" onClick={this.handleClose}>Cerrar</Button>
                        </Modal.Footer>
                    </Modal>
                </Fragment>
            </div>
        );
    }
}
FormModalAbonoLC.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});
const mapDispatchToProps = dispatch => ({
    setModalAbono() {
        dispatch({
            type: ACCION.SET_MODALABONO_LC
        })
    },
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_LC,
            payload: item
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
    listarItem(dataGestion) {
        dispatch({
          type: ACCION.LISTAR_ITEMLC,
          payload: { "maestroGestion": dataGestion }
        })
    
      },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormModalAbonoLC);
export { VistaRedux as RVistaFormModalAbonoLC };