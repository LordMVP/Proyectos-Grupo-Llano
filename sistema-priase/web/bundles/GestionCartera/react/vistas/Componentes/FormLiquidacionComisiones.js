
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import gestionComisionServicio from '../../store/servicios/LiquidarComisionServicios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
/**
 *Vista footer del componente para iniciar proceso para liquidar comisiones
 */
class FormLiquidacionComisiones extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionLC: this.props.gestionCarteraState.formEdicionLC,
            flag:0
        }
        
    }
    
    handleChange = async (event) => {
      console.log(event.target.attributes)
        if (event.target.type == 'select-multiple') {
            let value = Array.from(event.target.selectedOptions, option => option.value); 
            if(event.target.value === "all")
            {
                let flagb=0;
                let opciones = event.target.options;
                //if(opciones[opciones.length].selected === true) flag=1;
                for (let i = 0; i < opciones.length; i++) {
                    if(this.state.flag==0){
                        flagb=1;
                        opciones[i].selected = true;
                    } else{
                        flagb=0;
                        opciones[i].selected = false;
                    }
                    
                   
                } 
                /*for (let i = 0; i < opciones.length; i++) {
                    
                    opciones[i].selected = true
                }  */
                value = Array.from(event.target.selectedOptions, option => option.value); 
                await this.setState({
                    formEdicionLC: {
                        ...this.state.formEdicionLC,
                        ejecutivos: value
                    },
                    flag: flagb
                }); 
            }else{
                await this.setState({
                    formEdicionLC: {
                        ...this.state.formEdicionLC,
                        ejecutivos: value
                    }
                }); 
            }
        }else{
            await this.setState({
                formEdicionLC: {
                    ...this.state.formEdicionLC,
                    [event.target.name]: event.target.value,
                }
            });
        }
        
        this.props.selecionarItem(this.state.formEdicionLC)
    }

    iniciarLiquidacion = () => {
      
            const { formEdicionLC} = this.props.gestionCarteraState
            const validacion = validaFormulario.validaFormIniciarLiquidacion(formEdicionLC);
            if (!validacion.respuesta) {
                this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
                this.props.mostrarAlerta();
                return false;
            } else {
                this.props.setShowMsnLoader(true);
                this.props.setShowForm(false);
            gestionComisionServicio.iniciarLiquidacion(formEdicionLC.mliq_periodo).then((responseDatoIniciar) => { 
                    if (responseDatoIniciar.data.codigoRespuesta === 400) {
                    
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
    consultarLiquidacion = () => {
        
        const { formEdicionLC } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaFormConsultaLC(formEdicionLC);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
           gestionComisionServicio.consultarLiquidacionbyEjecutivos(formEdicionLC).then((responseDato) => { 
                var data = [];
                if (responseDato.data.codigoRespuesta == 200)
                {
                    this.props.listarItem(responseDato.data.data);
                }
            });
            
        }//fin else validacion formulario
    }
    recalcularLiquidacion = () => {
        
        const { formEdicionLC, seleccionadosEjelistLC } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaFormRecalcularLC(formEdicionLC,seleccionadosEjelistLC);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
           gestionComisionServicio.recalcularLiquidacionComision(seleccionadosEjelistLC, formEdicionLC).then((responseDato) => { 
                if (responseDato.data.codigoRespuesta == 200) {
                        
                    gestionComisionServicio.datosGeneralesLiquidarComision([],"-1").then((responseDatoGeneral) => { 
                        var data = [];
                        if (responseDatoGeneral.data.codigoRespuesta == 200)
                        {
                        this.props.listarItem(responseDatoGeneral.data.data);
                        }else{
                        this.props.listarItem(data);
                        }
                        window.location.reload();
                    });
                    
                }
                if (responseDato.data.codigoRespuesta === 400) {
                    
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
                    //setTimeout(function(){ window.location.reload();},5000);
                
                
                }
            });
            
        }//fin else validacion formulario
    }
    confirmarLiquidacion = () => {
        
        const { seleccionadosLC } = this.props.gestionCarteraState
        const validacion = validaFormulario.validaFormConfirmarLC(seleccionadosLC);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
           
          
           gestionComisionServicio.confirmarLiquidacionComision('', seleccionadosLC).then((responseDato) => { 
                
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
            
        }//fin else validacion formulario
    }

    cerrarPeriodo = () => {
        gestionComisionServicio.confirmarLiquidacionComision('C',[]).then((responseDato) => { 
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
    
    submitLiquidar = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.iniciarLiquidacion()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };

      submitConsultar = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.consultarLiquidacion()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };

      submitRecalcular = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.recalcularLiquidacion()
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
              onClick: () => this.confirmarLiquidacion()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };

      submitcerrarPeriodo = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.cerrarPeriodo()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };
      
    render() {
        const {listaPeriodoLC, listaCicloLC, listaEjecutivosLC, showButtonsLC, showButtonLiquidarLC, showButtonRecalcularLC, showButtonExportarLC,showButtonCerraPeriodoLC } = this.props.gestionCarteraState
        
        const listCicloLC = listaCicloLC.map(item =>
            <option key={item.cic_ideregistro} value={item.cic_ideregistro}>{item.cic_nombre}</option>
        )
        const listPeriodoLC = listaPeriodoLC.map(item =>
            <option key={item.per_ideregistro} value={item.per_ideregistro}>{item.per_nombre}</option>
        )
        const listEjecutivoLC = listaEjecutivosLC.map(item =>
            <option key={item.eje_idregistro} value={item.eje_idregistro}>{item.tercero.nomcompleto}</option>
        )
        return (
            <div>
                <Fragment>
                    <Row>
                       <Col xs={4}>
                            <Form.Group >
                                <Form.Label>Ciclo Control <span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="mliq_ciclo"
                                    name="mliq_ciclo"
                                    custom
                                    onChange={this.handleChange}
                                    defaultValue={-1}
                                    value={this.state.formEdicionLC.mliq_ciclo}
                                >
                                    <option value="-1">Seleccione Tipo Ciclo</option>
                                    {listCicloLC}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group >
                                <Form.Label>Periodo <span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="mliq_periodo"
                                    name="mliq_periodo"
                                    custom
                                    
                                    onChange={this.handleChange}
                                    defaultValue={-2}
                                    value={this.state.formEdicionLC.mliq_periodo}
                                >
                                    <option value="-2">Seleccione Periodo</option>
                                    {listPeriodoLC}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group >
                                <Form.Label>Personas Liquidadas <span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="eje_ejecutivos"
                                    name="eje_ejecutivos"
                                    multiple
                                    custom
                                    
                                    onChange={this.handleChange}
                                    value={this.state.formEdicionLC.eje_ejecutivos}
                                >   
                                    {listEjecutivoLC}
                                    <option value="all">TODOS</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                       
                    </Row>
                   
                    <Row >
                        {showButtonLiquidarLC &&(
                            <Col xs={1} >
                                <Button  variant="primary" onClick={() => this.submitLiquidar()} >Liquidar</Button>{' '}
                            </Col>
                        )}
                        <Col xs={1} className="ml-1 mr-2">
                            <Button variant="primary" onClick={() => this.submitConsultar()} >Consultar</Button>{' '}
                        </Col>
                        
                        {showButtonsLC && showButtonRecalcularLC &&(
                            <Col xs={1}  className="ml-3 mr-3">
                                <Button variant="primary"  onClick={() => this.submitRecalcular()} >Recalcular</Button>{' '}
                            </Col> 
                        )}
                        {showButtonsLC && (<Col xs={1}  className="ml-2 mr-3">
                                <Button  variant="primary" onClick={() => this.submitConfirmar()} >Confirmar</Button>{' '}
                            </Col>
                        )}
                         {showButtonsLC && showButtonCerraPeriodoLC &&(<Col xs={2}  className="ml-2">
                                <Button variant="primary" onClick={() => this.submitcerrarPeriodo()} >Cerrar Periodo Liquidación Comisiones</Button>{' '}
                            </Col>
                        )}
                    </Row>
                </Fragment>
            </div>
        );
    }
}
FormLiquidacionComisiones.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
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
    setShowMsnLoader(flag) {
    dispatch({
        type: ACCION.SET_SHOW_MENSAJELOADERLCOM,
        payload: flag
    })
    },
    setShowForm(flag) {
    dispatch({
        type: ACCION.SET_SHOW_FORMLCOM,
        payload: flag
    })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormLiquidacionComisiones);
export { VistaRedux as RVistaFormLiquidacionComisiones };