
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import cumplimientoMetasServicio from '../../store/servicios/CumplimientoMetasServicios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
/**
 *Vista footer del componente para iniciar proceso para liquidar comisiones
 */
class FormConsolidacionMeta extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionCM: this.props.gestionCarteraState.formEdicionCM,
            flag:0
        }
        
    }
    
    handleChange = async (event) => {
      console.log(event.target.attributes)
      
      const controlN = event.target.name;
        if (event.target.type == 'select-multiple') {
            let value = Array.from(event.target.selectedOptions, option => option.value); 
            if(controlN == "id_periodo"){
                await this.setState({
                    formEdicionCM: {
                        ...this.state.formEdicionCM,
                        periodos: value
                    }
                });
            }

            if(controlN == "eje_ejecutivos")
            {
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
                        formEdicionCM: {
                            ...this.state.formEdicionCM,
                            ejecutivos: value
                        },
                        flag: flagb
                    }); 
                }else{
                    await this.setState({
                        formEdicionCM: {
                            ...this.state.formEdicionCM,
                            ejecutivos: value
                        }
                    }); 
                }
            }
            this.props.selecionarItem(this.state.formEdicionCM)
        }else{
            await this.setState({
                formEdicionCM: {
                    ...this.state.formEdicionCM,
                    [event.target.name]: event.target.value,
                }
            });
        }
        
        this.props.selecionarItem(this.state.formEdicionCM)
    }

    iniciarConsolidacion = () => {
      
            const { formEdicionCM} = this.props.gestionCarteraState
            const validacion = validaFormulario.validaFormConsolidarMetas(formEdicionCM);
            if (!validacion.respuesta) {
                this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
                this.props.mostrarAlerta();
                return false;
            } else {
                this.props.setShowMsnLoader(true);
                this.props.setShowForm(false);
                cumplimientoMetasServicio.inicioConsolidacion(formEdicionCM.periodos).then((responseDatoIniciar) => { 
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
                    if (responseDatoIniciar.data.codigoRespuesta == 200)
                    {
                        setTimeout(function(){ window.location.reload();},5000);
                    }
                  
                });
                
            }//fin else validacion formulario
        
    }
    consultarMeta = () => {
        
        const { formEdicionCM } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaFormConsolidarMetas(formEdicionCM);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            
            cumplimientoMetasServicio.datosGeneralesConsulta(1, 0, formEdicionCM.periodos,formEdicionCM.ejecutivos).then((responseDato) => { 
                var data = [];
                 
                if (responseDato.data.codigoRespuesta == 200)
                {
                    this.props.listarItem(responseDato.data.data);
                   
                }
            });
            
        }//fin else validacion formulario
    }
    recalcularMeta = () => {
        
        const { formEdicionCM, seleccionadosEjelistLC } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaFormConsolidarMetas(formEdicionCM);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            this.props.setShowMsnLoader(true);
            this.props.setShowForm(false);
            cumplimientoMetasServicio.recalcularMetas(formEdicionCM.periodos).then((responseDato) => { 
               
                if (responseDato.data.codigoRespuesta == 200)
                {
                    setTimeout(function(){ window.location.reload();},5000);
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
                    setTimeout(function(){ window.location.reload();},5000);
                
                
                }
            });
            
        }//fin else validacion formulario
    }
    confirmarMeta = () => {
        
        const { seleccionadosLC } = this.props.gestionCarteraState
        /*const validacion = validaFormulario.validaFormConfirmarLC(seleccionadosLC);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {*/
           
          
            cumplimientoMetasServicio.cambioEstado('M','A','G-R').then((responseDato) => { 
                
            if (responseDato.data.codigoRespuesta == 200) {
                    
                cumplimientoMetasServicio.datosGeneralesConsolidarMetas([],"-1").then((responseDatoGeneral) => { 
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
            
       // }//fin else validacion formulario
    }

    cerrarPeriodo = () => {
        
        cumplimientoMetasServicio.cambioEstado('C','H','A-A').then((responseDato) => { 
            
            if (responseDato.data.codigoRespuesta === 400) {
                    
                confirmAlert({
                    title: 'Información',
                    message: "El periodo no se puede cerrar, hay registros sin confirmar para el periodo consolidado.",
                    buttons: [
                        {
                        label: 'Cerrar',
                        // onClick: () => alert('Click No')
                        }
                    ]
                });
            
            }
            if (responseDato.data.codigoRespuesta == 200) {
                    
                cumplimientoMetasServicio.datosGenerales([],"-1").then((responseDatoGeneral) => { 
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
    
    submitConsolidar = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.iniciarConsolidacion()
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
              onClick: () => this.consultarMeta()
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
              onClick: () => this.recalcularMeta()
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
              onClick: () => this.confirmarMeta()
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
       
        const {listaPeriodoMetas, listaEjecutivosMetas, showButtonsMeta, showResultadosMeta, showButtonConsolidarMeta, showButtonRecalcularMeta, showButtonConfirmaMeta,showButtonCerraPeriodoMeta } = this.props.gestionCarteraState
        
        const listPeriodoMetas = listaPeriodoMetas.map(item =>
            <option key={item.id} value={item.idmeta+"-"+item.idPeriodo}>{item.descripcion}</option>
        )
       
        const listEjecutivosMetas = listaEjecutivosMetas.map(item =>
            <option key={item.idejecutivo} value={item.idejecutivo}>{item.nombreejecutivo}</option>
        )
        return (
            <div>
                <Fragment>
                    <Row>
                       <Col xs={6}>
                            <Form.Group >
                                <Form.Label>Meta Gestión<span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="id_periodo"
                                    name="id_periodo"
                                    multiple
                                    custom
                                    onChange={this.handleChange}
                                    value={this.state.formEdicionCM.id_periodo}
                                >
                                    
                                    {listPeriodoMetas}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        
                        <Col xs={6}>
                            <Form.Group >
                                <Form.Label>Ejecutivo <span className="obligatorio"></span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="eje_ejecutivos"
                                    name="eje_ejecutivos"
                                    multiple
                                    custom
                                    
                                    onChange={this.handleChange}
                                    value={this.state.formEdicionCM.eje_ejecutivos}
                                >   
                                    {listEjecutivosMetas}
                                    <option value="all">TODOS</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                       
                    </Row>
                   
                    <Row >
                        {showButtonConsolidarMeta && !showResultadosMeta  && !showButtonsMeta && (
                            <Col xs={1} >
                            <Button  variant="primary" onClick={() => this.submitConsolidar()} >Consolidar Metas</Button>{' '}
                        </Col>
                        )}
                        
                        {showResultadosMeta && showButtonsMeta  &&(<Col xs={1} className="ml-1 mr-2">
                                <Button variant="primary" onClick={() => this.submitConsultar()} >Consultar</Button>{' '}
                            </Col>
                         )}
                        {showResultadosMeta && showButtonsMeta && showButtonRecalcularMeta &&(
                            <Col xs={1}  className="ml-3 mr-3">
                                <Button variant="primary"  onClick={() => this.submitRecalcular()} >Recalcular</Button>{' '}
                            </Col> 
                        )}
                        {showResultadosMeta && showButtonsMeta && showButtonConfirmaMeta && (<Col xs={1}  className="ml-2 mr-3">
                                <Button  variant="primary" onClick={() => this.submitConfirmar()} >Confirmar</Button>{' '}
                            </Col>
                        )}
                        {showResultadosMeta && showButtonsMeta && showButtonCerraPeriodoMeta &&(<Col xs={2}  className="ml-2">
                                <Button variant="primary" onClick={() => this.submitcerrarPeriodo()} >Cerrar Periodo Metas de Gestión</Button>{' '}
                            </Col>
                        )}
                    </Row>
                </Fragment>
            </div>
        );
    }
}
FormConsolidacionMeta.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_META,
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
          type: ACCION.LISTAR_CONSULTAMETA,
          payload: { "meta": dataGestion }
        })
    
      },
    setShowMsnLoader(flag) {
    dispatch({
        type: ACCION.SET_SHOW_MENSAJELOADERMETA,
        payload: flag
    })
    },
    setShowForm(flag) {
    dispatch({
        type: ACCION.SET_SHOW_FORMMETA,
        payload: flag
    })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormConsolidacionMeta);
export { VistaRedux as RVistaFormConsolidacionMeta };