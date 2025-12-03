
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import deterioroNiff from '../../store/servicios/DeterioroNiffServicios'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
/**
 *Vista footer del componente para Inicializar Gestión
 */
class FormConsultaDeterioro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionDN: this.props.gestionCarteraState.formEdicionDN,
        }
    }
    
    handleChange = async (event) => {

        if (event.target.type == 'select-multiple') {
            let value = Array.from(event.target.selectedOptions, option => option.value);
            const controlN = event.target.name;
            if(controlN == "per_ideregistro"){
                await this.setState({
                    formEdicionDN: {
                        ...this.state.formEdicionDN,
                        per_ideregistro: value
                    }
                });
            }
            if(controlN == "tipo_deterioro"){
                await this.setState({
                    formEdicionDN: {
                        ...this.state.formEdicionDN,
                        tipo_deterioro: value
                    }
                });
            }
            this.props.selecionarItem(this.state.formEdicionDN);
            
            
            return;
        }
        await this.setState({
            formEdicionDN: {
                ...this.state.formEdicionDN,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicionDN)

    }

    consultarDeterioro = () => {
        const { formEdicionDN } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaFormConsultaDeterioro(formEdicionDN);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            //TODO enviar al back
            
                   
            deterioroNiff.consultaDeterioro(formEdicionDN).then((responseDatoIniciar) => { 
                 
                if(responseDatoIniciar.data.codigoRespuesta===200){
                    this.props.setData(responseDatoIniciar.data.data.gestionFacturaNiffResumenDto);
                }
               
                if (responseDatoIniciar.data.codigoRespuesta === 400) {
                    //this.props.appState.alerta = { "titulo": "Información", "texto":  responseDatoIniciar.data.data}
                    //this.props.mostrarAlerta();
                    //this.props.setShowMsnLoader(false);
                    //alert(responseDatoIniciar.data.data);
                    confirmAlert({
                        title: 'Información',
                        message: responseDatoIniciar.data.data,
                        buttons: [
                            {
                              label: 'Cerrar',
                             // onClick: () => alert('Click No')
                            }
                          ]
                      });
                    setTimeout(function(){ window.location.reload();},5000);
                   
                 
                }
                
            });
          
        }//fin else validacion formulario
    }

    submitConsultar = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.consultarDeterioro()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };

     

    render() {
        const {listaPeriodoDN } = this.props.gestionCarteraState
   
        const listPeriodoDN = listaPeriodoDN.map(item =>
            <option key={item.per_ideregistro} value={item.per_ideregistro}>{item.per_nombre}</option>
        )
        return (
            <div>
                <Fragment>
                
                    <Row>
                        <Col xs={4}>
                            <Form.Group >
                                <Form.Label>Ciclo Periodo Consultar<span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    multiple
                                    className="mr-sm-2"
                                    id="per_ideregistro"
                                    name="per_ideregistro"
                                    custom
                                    onChange={this.handleChange}
                                   // value={this.state.formEdicionIG.per_ideregistro}
                                >
                                    {listPeriodoDN}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Tipo Deterioro<span className="obligatorio">*</span></Form.Label>
                                    <Form.Control
                                        as="select"
                                        multiple
                                        className="mr-sm-2"
                                        id="tipo_deterioro"
                                        name="tipo_deterioro"
                                        custom
                                        onChange={this.handleChange}
                                       // value={this.state.formEdicionInfoBasicaMG.estr_estadoaltoriesgo}
                                    >
                                        
                                        <option value="1">Deterioro menor 360 </option>
                                        <option value="2">Deterioro 100%</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        <Col xs={4}>
                            <Form.Group >
                                 <Form.Label className="blancoLabel col-12"> </Form.Label>
                                <Button className="col-12" variant="primary" onClick={() => this.submitConsultar()} >Consultar</Button>{' '}
                             </Form.Group>
                        </Col>
                    </Row>
                    
                </Fragment>
            </div>
        );
    }
}
FormConsultaDeterioro.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_DN,
            payload: item
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
    setData(item) {
        dispatch({
            type: ACCION.SET_DATAREPORTES_DN,
            payload: item
        })
    },
    
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormConsultaDeterioro);
export { VistaRedux as RVistaFormConsultaDeterioro};