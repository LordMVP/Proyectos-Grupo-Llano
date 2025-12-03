
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import iniciarGestionServicio from '../../store/servicios/InicializarGestionServicios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
/**
 *Vista footer del componente para Inicializar Gestión
 */
class FormInicializacionGestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionIG: this.props.gestionCarteraState.formEdicionIG,
        }
    }
    
    handleChange = async (event) => {
        await this.setState({
            formEdicionIG: {
                ...this.state.formEdicionIG,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicionIG)
    }

    iniciarGestion = () => {
        const { formEdicionIG } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaFormIniciarGestion(formEdicionIG);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            //TODO enviar al back
            this.props.setShowMsnLoader(true);
            this.props.setShowForm(false);
                   
             iniciarGestionServicio.iniciarGestion(formEdicionIG.per_ideregistro).then((responseDatoIniciar) => { 
                
                if(responseDatoIniciar.data.codigoRespuesta===200){
                    
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

    submitInicial = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.iniciarGestion()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };

      submitConfirmar = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.accionCP()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };

      submitDescartar = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.accionDP()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };
      
    accionCP = () => {
       
        //TODO enviar al back
        iniciarGestionServicio.cambioEstadoGestion('C','G','A').then((responseDato) => { 
            
            if(responseDato.data.codigoRespuesta===200){
                window.location.reload();
            }
            if(responseDato.data.codigoRespuesta===400){
                // alert(responseDato.data.data);
                 confirmAlert({
                  title: 'Información',
                  message: responseDato.data.data,
                  buttons: [
                      {
                        label: 'Cerrar',
                       // onClick: () => alert('Click No')
                      }
                    ]
                });
              }
        });
    }

    accionDP = () => {
        //TODO enviar al back
        iniciarGestionServicio.cambioEstadoGestion('E','G','E').then((responseDato) => { 
            if(responseDato.data.codigoRespuesta===200){
                window.location.reload();
            }
            if(responseDato.data.codigoRespuesta===400){
              // alert(responseDato.data.data);
               confirmAlert({
                title: 'Información',
                message: responseDato.data.data,
                buttons: [
                    {
                      label: 'Cerrar',
                     // onClick: () => alert('Click No')
                    }
                  ]
              });
            }
        });
    }

    render() {
        const {listaPeriodoIG, listaCicloIG, showButtonsIG,showButtonIniciaGestion,showButtonConfirmaIG,showButtonDescartarIG,showFormIG } = this.props.gestionCarteraState
        const listCicloIG = listaCicloIG.map(item =>
            <option key={item.cic_ideregistro} value={item.cic_ideregistro}>{item.cic_nombre}</option>
        )
        const listPeriodoIG = listaPeriodoIG.map(item =>
            <option key={item.per_ideregistro} value={item.per_ideregistro}>{item.per_nombre}</option>
        )
        return (
            <div>
                <Fragment>
                {showFormIG &&( 
                    <Row>
                       <Col xs={4}>
                            <Form.Group >
                                <Form.Label>Ciclo Control <span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="cic_ideregistro"
                                    name="cic_ideregistro"
                                    custom
                                    onChange={this.handleChange}
                                    defaultValue={-1}
                                    value={this.state.formEdicionIG.cic_ideregistro}
                                >
                                    <option value="-1">Seleccione Tipo Ciclo</option>
                                    {listCicloIG}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group >
                                <Form.Label>Periodo <span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="per_ideregistro"
                                    name="per_ideregistro"
                                    custom
                                    onChange={this.handleChange}
                                    defaultValue={-2}
                                    value={this.state.formEdicionIG.per_ideregistro}
                                >
                                    <option value="-2">Seleccione Periodo</option>
                                    {listPeriodoIG}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        {showButtonIniciaGestion &&(<Col xs={4}>
                            <Form.Group >
                                 <Form.Label className="blancoLabel">Botón Inicialización Proceso </Form.Label>
                                <Button className="col-12" variant="primary" onClick={() => this.submitInicial()} >Iniciar Proceso</Button>{' '}
                             </Form.Group>
                        </Col>)}
                    </Row>)}
                    {showButtonsIG &&(<Row>
                        {showButtonConfirmaIG &&(<Col xs={4}>
                            <Form.Group >
                                <Button className="col-sm-12" variant="primary" onClick={this.submitConfirmar} >Confirmar Proceso</Button>{' '}
                            </Form.Group>
                        </Col>)}
                        {showButtonDescartarIG &&(<Col xs={4}>
                            <Form.Group >
                                <Button className="col-sm-12" variant="primary" onClick={this.submitDescartar} >Descartar Proceso</Button>{' '}
                            </Form.Group>
                        </Col>)}
                    </Row>)}
                    
                </Fragment>
            </div>
        );
    }
}
FormInicializacionGestion.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_IG,
            payload: item
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
    setShowMsnLoader(flag) {
        dispatch({
            type: ACCION.SET_SHOW_MENSAJELOADER,
            payload: flag
        })
      },
      setShowForm(flag) {
        dispatch({
            type: ACCION.SET_SHOW_FORMIG,
            payload: flag
        })
      },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormInicializacionGestion);
export { VistaRedux as RVistaFormInicializacionGestion };