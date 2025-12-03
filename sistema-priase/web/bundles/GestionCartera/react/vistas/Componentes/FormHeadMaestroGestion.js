
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import maestroGestionServicio from '../../store/servicios/MaestroGestionServicios';
/**
 *Vista Principal del componente de edición 
 */
class FormHeadMaestroGestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionMG: this.props.gestionCarteraState.formEdicionMG,
            listaFiltro: []
            
        }
        this.obtenerListaFiltros();
    }
    
    handleChange = async (event) => {
        await this.setState({
            formEdicionMG: {
                ...this.state.formEdicionMG,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicionMG)
    }

    guardarItem = () => {
        const { origenComponente, formEdicionMG, formEdicionInfoBasicaMG,  formEdicionInfoGestionMG, formEdicionInfoGestionVisitaMG } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaFormMaestroGestion(formEdicionMG, formEdicionInfoBasicaMG, formEdicionInfoGestionMG, formEdicionInfoGestionVisitaMG);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {

            if (origenComponente == MODULO.MAESTRO_GESTION) {
                maestroGestionServicio.guardarDatosMaestroGestion(formEdicionMG, formEdicionInfoBasicaMG, formEdicionInfoGestionMG, formEdicionInfoGestionVisitaMG).then((reponseDatoMG) => {
                    /*orientacionServicio.listarDatosOrientacion().then((reponseDatoMG) => {
                        if (reponseDatoOrientacion.data.codigoRespuesta == 200) {
                            this.props.cargarData(reponseDatoOrientacion.data.data)
                        }
                    });*/

                    this.obtenerListaFiltros();
                    this.props.limpiarFormItem();
                    this.setState({
                        formEdicionMG:{
                            "mges_filtroprivado":"-1",
                            "mges_idregistro":"-2"
                        },
                        
                    });
                });
            }
            
        
            

            
        }//fin else validacion formulario
    }

    /**Método encargado de obtener la lista de los filtros creados */
    obtenerListaFiltros = async () => {
        maestroGestionServicio.listarDatosFiltros().then((reponseDatoListaMG) => {
            if (reponseDatoListaMG.data.codigoRespuesta == 200) {
                this.setState({
                    listaFiltro: reponseDatoListaMG.data.data
                }); 
            }
        });
    } 
    /**Método encargado de obtener los datos del filtro seleccionado */
   obtenerFiltro = async () => {
    const { formEdicionMG } = this.props.gestionCarteraState
    const validacion = validaFormulario.validaBusquedaMaestroGestion(formEdicionMG);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {

            await maestroGestionServicio.buscarFiltro(formEdicionMG.mges_idregistro).then((reponseDatoFiltro) => {
                
                if (reponseDatoFiltro.data.codigoRespuesta != 404)
                {
                    this.props.selecionarFiltoItem(reponseDatoFiltro.data.data);
                    this.setState({
                        formEdicionMG:reponseDatoFiltro.data.data.filtro
                    });
                    
                }
            });
            
        }//fin else validacion formulario
    
    }

    render() {
        
        const listaFiltroM = this.state.listaFiltro.map(item =>
            <option key={item.mges_idregistro} value={item.mges_idregistro}>{item.mges_descripcion}</option>
        )
        return (
            <div>
                <Fragment>
                    <h1>Filtros</h1>
                    <div className="customHr">.</div>
                    <br />
                    <Row>
                        <Col xs={5}>
                            <Form.Label>Descripción Filtro <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="text" name="mges_descripcion" placeholder="Descripción" onChange={this.handleChange} value={this.state.formEdicionMG.mges_descripcion || ""}/>
                        </Col>
                        <Col xs={5}>
                            <Form.Group >
                                <Form.Label>Tipo Filtro <span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="mges_filtroprivado"
                                    name="mges_filtroprivado"
                                    custom
                                    onChange={this.handleChange}
                                    defaultValue={-1}
                                    value={this.state.formEdicionMG.mges_filtroprivado}
                                >
                                    <option value="-1">Seleccione Tipo Filtro</option>
                                    <option value="false">Público</option>
                                    <option value="true">Privado</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Group >
                                <Form.Label className="blancoLabel">Guardar Filtro </Form.Label>
                                <div>
                                    <Button className="col-sm-12" variant="primary" onClick={this.guardarItem} >Guardar Filtro</Button>{' '}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                    <Col xs={10}>
                            <Form.Group >
                                <Form.Label>Selección Filtros <span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="mges_idregistro"
                                    name="mges_idregistro"
                                    custom
                                    defaultValue={-2}
                                    onChange={this.handleChange}
                                    value={this.state.formEdicionMG.mges_idregistro}
                                >
                                    <option value="-2"> Seleccione Filtro</option>
                                    {listaFiltroM}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Group >
                                <Form.Label className="blancoLabel">botón Buscar Filtro </Form.Label>
                                <div>
                                    <Button className="col-sm-12" variant="primary" onClick={this.obtenerFiltro} >Buscar Filtro</Button>{' '}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}
FormHeadMaestroGestion.propTypes = {
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
    limpiarFormItem() {
        dispatch({
            type: ACCION.SET_LIMPIAR_FORMMG
        })
    },
    selecionarFiltoItem(item) {
        const items={
            filtro:item.filtro,
            informacionBasica:item.informacionBasica,
            informacionGestion:item.informacionGestion,
            informacionGestionVisita:item.informacionGestionVisita
        }
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_FILTROSMG,
            payload: items
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormHeadMaestroGestion);
export { VistaRedux as RVistaFormHeadMaestroGestion };