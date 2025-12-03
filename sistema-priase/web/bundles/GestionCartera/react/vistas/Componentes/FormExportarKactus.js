
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import exportaraKactus from '../../store/servicios/ExporarKactusServicios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {RVistaListResultadosExportarKactus} from '../index'
/**
 *Vista footer del componente para Inicializar Gestión
 */
class FormExportarKactus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionEK: this.props.gestionCarteraState.formEdicionEK,
        }
    }
    
    handleChange = async (event) => {
        await this.setState({
            formEdicionEK: {
                ...this.state.formEdicionEK,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicionEK)
    }

    consultarComisiones = () => {
        const { formEdicionEK } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaFormIniciarGestion(formEdicionEK);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            //TODO enviar al back 
            this.props.setShowMsnLoader(true);
            this.props.setShowForm(false);
                   
             exportaraKactus.consultarComisiones(formEdicionEK.per_ideregistro).then((responseDatoIniciar) => { 
                
                if(responseDatoIniciar.data.codigoRespuesta===200){
                    this.props.listarItem(responseDatoIniciar.data.data);
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
              onClick: () => this.consultarComisiones()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };

      submitExportar = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.enviarKactus()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };
      
      enviarKactus = () => {
       
        //TODO enviar al back
        const { seleccionadosEK, formEdicionEK } = this.props.gestionCarteraState;
        var flagestado = false;
        const validacion = validaFormulario.validaGenerarIvr(seleccionadosEK);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            
            var i;
            for(i=0; i<seleccionadosEK.length; i++)
                {
                    if(seleccionadosEK[i]["estado"]==='EXPORTADO'){
                        flagestado = true;
                    }
            }
            
            if(!flagestado){
                
                exportaraKactus.envioKactus(seleccionadosEK).then((responseDato) => { 
                    if(responseDato.data.codigoRespuesta===200){
                        exportaraKactus.consultarComisiones(formEdicionEK.per_ideregistro).then((responseDatoIniciar) => { 
                
                            if(responseDatoIniciar.data.codigoRespuesta===200){
                                this.props.listarItem(responseDatoIniciar.data.data);
                                this.props.limpiarFormItem();
                            }
                            
                        });
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
            }else{
                
                this.props.appState.alerta = { "titulo": "Información", "texto": "Hay registros con estado Exportado por favor verifiquelos" }
                this.props.mostrarAlerta();
              
            }//fin else
        
            
    }//fin else
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
        const {listaPeriodoEK, listaCicloEK } = this.props.gestionCarteraState
        const listCicloEK = listaCicloEK.map(item =>
            <option key={item.cic_ideregistro} value={item.cic_ideregistro}>{item.cic_nombre}</option>
        )
        const listPeriodoEK = listaPeriodoEK.map(item =>
            <option key={item.per_ideregistro} value={item.per_ideregistro}>{item.per_nombre}</option>
        )
        return (
            <div>
                <Fragment>
                
                    <Row>
                       <Col xs={6}>
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
                                    //value={this.state.formEdicionEK.cic_ideregistro}
                                >
                                    <option value="-1">Seleccione Tipo Ciclo</option>
                                    {listCicloEK}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={6}>
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
                                   // value={this.state.formEdicionEK.per_ideregistro}
                                >
                                    <option value="-2">Seleccione Periodo</option>
                                    {listPeriodoEK}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        
                    </Row>
                   <Row>
                        <Col xs={3}>
                            <Form.Group >
                                <Button className="col-sm-12" variant="primary" onClick={this.submitConsultar} >Consultar</Button>{' '}
                            </Form.Group>
                        </Col>
                      <Col xs={3}>
                            <Form.Group >
                                <Button className="col-sm-12" variant="primary" onClick={this.submitExportar} >Exportar a Kactus</Button>{' '}
                            </Form.Group>
                        </Col>
                    </Row>
                    <br/>
                    <RVistaListResultadosExportarKactus/>
                </Fragment>
            </div>
        );
    }
}
FormExportarKactus.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    listarItem(item) {
        dispatch({
            type: ACCION.LISTAR_DATOSEK,
            payload: item
        })
    },
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_EK,
            payload: item
        })
    },
    limpiarFormItem() {
        dispatch({
            type: ACCION.SET_LIMPIAR_SELECCIONADOSEK
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
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormExportarKactus);
export { VistaRedux as RVistaFormExportarKactus };