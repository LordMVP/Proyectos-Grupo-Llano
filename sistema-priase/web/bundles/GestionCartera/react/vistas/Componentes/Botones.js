import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Button, Row, Col } from 'react-bootstrap';
import { MODULO, ACCION } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import { MENSAJES_GESTION_CARTERA } from '../../global/constantes';
import orientacionServicio from '../../store/servicios/OrientacionServicios';
import clasificacionServicio from '../../store/servicios/ClasificacionServicios';
import estadoCarteraServicio from '../../store/servicios/EstadoCarteraServicios';
import edadCarteraServicio from '../../store/servicios/EdadCarteraServicios';
import estrategiaServicio from '../../store/servicios/EstrategiaServicios';
import condonacionServicio from '../../store/servicios/CondonacionServicios';
import nVisitaServicio from '../../store/servicios/NovedadVisitaServicios';
import mGestion from '../../store/servicios/MetasGestionServicios';
import tComisional from '../../store/servicios/TablaComisionalServicios';
import ejecutivoServicio from '../../store/servicios/EjecutivoServicios';
import vglobalServicio from '../../store/servicios/VariablesGlobalesServicios';

/**
 *componente sección de botones
 */
class Botones extends Component {

    guardarItem = () => {
        const { origenComponente, formEdicion, condicion, clasificaciones, data } = this.props.gestionCarteraState
        const validacion = validaFormulario.validaFormulariosPrincipales(formEdicion, condicion, origenComponente, clasificaciones, data);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {

            if (origenComponente == MODULO.ORIENTACION) {
                orientacionServicio.guardarDatosOrientacion(formEdicion, condicion).then((reponseDatoOrientacion) => {
                    orientacionServicio.listarDatosOrientacion().then((reponseDatoOrientacion) => {
                        if (reponseDatoOrientacion.data.codigoRespuesta == 200) {
                            this.props.cargarData(reponseDatoOrientacion.data.data)
                        }
                    });
                });
            }
            if (origenComponente == MODULO.CLASIFICACION) {
                clasificacionServicio.guardarDatosClasificacion(formEdicion, condicion).then((reponseDatoClasificacion) => {
                    clasificacionServicio.listarDatosClasificacion().then((reponseDatoClasificacion) => {
                        if (reponseDatoClasificacion.data.codigoRespuesta == 200) {
                            this.props.cargarData(reponseDatoClasificacion.data.data)
                        }
                    });
                });
            }
            if (origenComponente == MODULO.ESTADO_CARTERA) {
                estadoCarteraServicio.guardarDatosEstadoCartera(formEdicion, condicion).then((reponseDatoestadoCartera) => {
                    estadoCarteraServicio.listarDatosEstadoCartera().then((reponseDatoestadoCartera) => {
                        if (reponseDatoestadoCartera.data.codigoRespuesta == 200) {
                            this.props.cargarData(reponseDatoestadoCartera.data.data)
                        }
                    });
                });
            }
            if (origenComponente == MODULO.EDAD_CARTERA) {
                edadCarteraServicio.guardarDatosEdadCartera(formEdicion).then((reponseDatoedadCartera) => {
                    edadCarteraServicio.listarDatosEdadCartera().then((reponseDatoedadCartera) => {
                        if (reponseDatoedadCartera.data.codigoRespuesta == 200) {
                            this.props.cargarData(reponseDatoedadCartera.data.data)
                        }
                    });
                });
            }
            if (origenComponente == MODULO.ESTRATEGIA) {
                estrategiaServicio.guardarDatosEstrategia(formEdicion, condicion, clasificaciones).then((reponseDatoestrategia) => {
                    estrategiaServicio.listarDatosEstrategia().then((reponseDatoestrategia) => {
                        if (reponseDatoestrategia.data.codigoRespuesta == 200) {
                            this.props.cargarData(reponseDatoestrategia.data.data)
                        }
                    });
                });
            }
            if (origenComponente == MODULO.RESTRICCION_FINANCIACION) {
                condonacionServicio.guardarDatosCondonacion(formEdicion).then((reponseDatoCondonacionGuardar) => {
                    if (reponseDatoCondonacionGuardar.data.codigoRespuesta == 409) {
                        this.props.appState.alerta = { "titulo": "Información", "texto": MENSAJES_GESTION_CARTERA.MSN_DUPLICIDAD_RESTRICCION_FINANCIACION }
                        this.props.mostrarAlerta();
                    } else {
                        condonacionServicio.listarDatosCondonacion().then((reponseDatocondonacion) => {
                            if (reponseDatocondonacion.data.codigoRespuesta == 200) {
                                this.props.cargarData(reponseDatocondonacion.data.data)
                            }

                        });
                    }
                });
            }

            if (origenComponente == MODULO.NOVEDAD_VISITA) {
                nVisitaServicio.guardarDatosNVisita(formEdicion).then((reponseDatonVisita) => {
                    this.props.selecionarItem(reponseDatonVisita.data.data)
                    nVisitaServicio.listarDatosNVisita().then((reponseDatonVisita) => {
                        if (reponseDatonVisita.data.codigoRespuesta == 200) {
                            this.props.cargarData(reponseDatonVisita.data.data)
                        }
                    });
                });
            }

            if (origenComponente == MODULO.META_GESTION) {
                mGestion.guardarDatosMGestion(formEdicion, condicion).then((reponseDatoMGestion) => {
                    this.props.selecionarItem(reponseDatoMGestion.data.data)
                    mGestion.listarDatosMGestionDetalle(reponseDatoMGestion.data.data.mege_idregistro, reponseDatoMGestion.data.data.fun_funcionlmeta).then((reponseDatomdGestion) => {
                        if (reponseDatomdGestion.data.codigoRespuesta == 200) {
                            this.props.setDataDetalle(reponseDatomdGestion.data.data)
                        }else{
                            this.props.setDataDetalle([])
                        }
                    });
                    mGestion.listarDatosMGestion().then((reponseDatoMGestion) => {
                        if (reponseDatoMGestion.data.codigoRespuesta == 200) {
                            this.props.cargarData(reponseDatoMGestion.data.data)
                        }
                    });
                    
                });
            }

            if (origenComponente == MODULO.TABLA_COMISIONAL) {
                tComisional.guardarDatosTComisional(formEdicion, condicion).then((reponseDatoTComisional) => {
                    this.props.selecionarItem(reponseDatoTComisional.data.data)
                    tComisional.listarDatosTComisionalDetalle(reponseDatoTComisional.data.data.tcom_idregistro,reponseDatoTComisional.data.data.fun_funcionmcomision).then((reponseTComisionalDetalle) => {
                        if (reponseTComisionalDetalle.data.codigoRespuesta == 200) {
                            this.props.setDataDetalle(reponseTComisionalDetalle.data.data)
                        } else {
                            this.props.setDataDetalle([])
                        }
                    });
                    tComisional.listarDatosTComisional().then((reponseDatoTComisional) => {
                        if (reponseDatoTComisional.data.codigoRespuesta == 200) {
                            this.props.cargarData(reponseDatoTComisional.data.data)
                        }
                    });
                });
            }

            if (origenComponente == MODULO.EJECUTIVOS) {
                ejecutivoServicio.guardarDatosEjecutivo(formEdicion).then((reponseDatoEjecutivo) => {
                    if (reponseDatoEjecutivo.data.codigoRespuesta === 409) {
                        this.props.appState.alerta = { "titulo": "Información", "texto": MENSAJES_GESTION_CARTERA.MSN_DUPLICIDAD_EJECUTIVO }
                        this.props.mostrarAlerta();
                    }
                    if (reponseDatoEjecutivo.data.codigoRespuesta != 409) {
                        ejecutivoServicio.listarDatosEjecutivo().then((reponseDatoEjecutivo) => {
                            
                            if (reponseDatoEjecutivo.data.codigoRespuesta == 200) {
                                this.props.cargarData(reponseDatoEjecutivo.data.data)
                            }
                            
                        });
                    }
                });
            }
            if (origenComponente == MODULO.VARIABLES_GLOBALES) {
                vglobalServicio.guardarDatosVGlobales(formEdicion).then((reponseDatoVGlobal) => {
                    vglobalServicio.listarDatosVGlobales().then((reponseDatoVGlobal) => {
                        if (reponseDatoVGlobal.data.codigoRespuesta == 200) {
                            this.props.cargarData(reponseDatoVGlobal.data.data)
                        }
                    });
                });
            }
        }//fin else validacion formulario
    }

    limpiarCondicion = () => {
        this.props.limpiarCondicion("")
    }

    render() {
        const { showButtonGuardar, origenComponente } = this.props.gestionCarteraState
        var isShowButtonLimpiar = false;
        if(origenComponente != MODULO.EDAD_CARTERA
        && origenComponente != MODULO.RESTRICCION_FINANCIACION
        && origenComponente != MODULO.NOVEDAD_VISITA
        && origenComponente != MODULO.EJECUTIVOS
        && origenComponente != MODULO.VARIABLES_GLOBALES)
        isShowButtonLimpiar = true;
        return (
            <div>
                <Fragment>
                    <Row>
                        <Col xs={12}>
                            {showButtonGuardar && (<div className="innerLine btn-space"><Button variant="primary" onClick={this.guardarItem} >Guardar</Button></div>)}
                            <div className="innerLine"><Button variant="primary" onClick={this.props.setShowFormEdicion}>Volver</Button>{' '}
                            {isShowButtonLimpiar && (<div className="innerLine">    <Button variant="primary" onClick={this.limpiarCondicion}>Limpiar Condición</Button></div>)}
                            </div>
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}
Botones.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    setShowFormEdicion() {
        dispatch({
            type: ACCION.SET_FORM_EDICION,
            payload: ""
        }),
        dispatch({
            type: ACCION.SET_SHOW_CONSTANTE,
            payload: false
        }),
        dispatch({
            type: ACCION.SET_SHOW_ATRIBUTO,
            payload: false
        }),
        dispatch({
            type: ACCION.SET_SHOW_CALCULADO,
            payload: false
        })

    },
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM,
            payload: item
        })
    },
    setDataDetalle(data) {
        dispatch({
            type: ACCION.SET_DATA_DETALLE,
            payload: data
        })
    },
    cargarData(data) {
        dispatch({
            type: ACCION.CARGAR_DATA,
            payload: data
        })

    },

    limpiarCondicion(value) {

        dispatch({
            type: ACCION.LIMPIAR_CONDICION,
            payload: value
        })

    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },

});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(Botones);
export { VistaRedux as RVistaBotones };