
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
//import maestroGestionServicio from '../../store/servicios/MaestroGestionServicios';
/**
 *Vista mesnaje de espera componente para procesos
 */

class FormMensajeEspera extends Component {
    constructor(props) {
        super(props)
        this.state = {
           
        }
        
    }
    
   
    render() {
        const { origenComponente, cantidadProcesos } = this.props.gestionCarteraState
        
        /*const listaFiltroM = this.state.listaFiltro.map(item =>
            <option key={item.mges_idregistro} value={item.mges_idregistro}>{item.mges_descripcion}</option>
        )*/
        return (
            <div>
                <Fragment>
                    <Row>
                       <Col xs={12}>
                            <Form.Group >
                                <Alert variant="info">
                                    <Alert.Heading>¡Atento!</Alert.Heading>
                                    <p className="text-center">
                                        En estos momentos el proceso se está ejecutando, una vez finalice se mostrarán los resultados.<br/>
                                        Puede tardar en culminar, por favor ingrese más tarde a la pantalla.
                                    </p>
                                    <hr />
                                    <p className="mb-0">
                                        Número de registros procesados:  {cantidadProcesos}
                                    </p>
                                </Alert>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                       <Col xs={12}>
                            <Form.Group >
                                <div className="loader">Loading...</div>
                            </Form.Group>
                        </Col>
                    </Row>
                    
                </Fragment>
            </div>
        );
    }
}
FormMensajeEspera.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_MG,
            payload: item
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormMensajeEspera);
export { VistaRedux as RVistaFormMensajeEspera };