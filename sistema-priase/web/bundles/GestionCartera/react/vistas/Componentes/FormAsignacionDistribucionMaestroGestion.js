
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Accordion, Card, a , h4} from 'react-bootstrap';
import { ACCION } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import maestroGestionServicio from '../../store/servicios/MaestroGestionServicios';

/**
 *Vista Principal del componente de edición 
 */
class FormAsignacionDistribucionMaestroGestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionAsigDistribucionMG: this.props.gestionCarteraState.formEdicionAsigDistribucionMG,
            listaEjecutivos: []
        }
    }
    
    handleChange = async (event) => {
        const controlN = event.target.name;
        
        if (event.target.type == 'select-multiple') {
            let value = Array.from(event.target.selectedOptions, option => option.value);
            
            if(controlN == "eje_ejcutivos"){
                await this.setState({
                    formEdicionAsigDistribucionMG: {
                        ...this.state.formEdicionAsigDistribucionMG,
                        ejecutivos: value
                    }
                });
               
            }
            this.props.selecionarItem(this.state.formEdicionAsigDistribucionMG)
            return;
        }
        if (event.target.type == 'checkbox') {
            await this.setState({
                formEdicionAsigDistribucionMG: {
                    ...this.state.formEdicionAsigDistribucionMG,
                    [event.target.name]: event.target.checked,
                }
            });
            this.props.selecionarItem(this.state.formEdicionAsigDistribucionMG)
            return;
        }
        await this.setState({
            formEdicionAsigDistribucionMG: {
                ...this.state.formEdicionAsigDistribucionMG,
                [event.target.name]: event.target.value,
            }
        });
        if(controlN == "est_estrategia"){
            this.obtenerListaEjecutivos();
        }
        this.props.selecionarItem(this.state.formEdicionAsigDistribucionMG)
    }

    /**
     * Método encargado de obtener la lista de ejecutivos relacio¿nados a la clasiicación dpor medio d ela estrategia
     */
    obtenerListaEjecutivos = async () => {
        maestroGestionServicio.listaEjecutivosByEstrategia(this.state.formEdicionAsigDistribucionMG.est_estrategia).then((reponseDatoListaEjecutivos) => {
            
            if (reponseDatoListaEjecutivos.data.codigoRespuesta == 200) {
                this.props.cargarlistaItem(reponseDatoListaEjecutivos.data.data);
                /*this.setState({
                    listaEjecutivos: reponseDatoListaEjecutivos.data.data
                });*/ 

               // listaEjecutivo
            }
        });
    }

    
    guardarAsignacion = (accion) => {
        const { formEdicionAsigDistribucionMG, seleccionadosMG, contarEstadoRegConfirmMG } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaAsignacionMaestroGestion(formEdicionAsigDistribucionMG, seleccionadosMG, accion);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            
            var i=0;
            var contarConfirmados=0;
            if (contarEstadoRegConfirmMG.length>0)  {
                for(i=0;i<contarEstadoRegConfirmMG.length;i++)
                {
                    if(contarEstadoRegConfirmMG[i]!='A'){
                        contarConfirmados++;
                    }
                }
            }
            if(contarConfirmados>0){
                this.props.appState.alerta = { "titulo": "Información", "texto": "Hay 1 o más registros donde el estado del maestro no es 'A' " }
                this.props.mostrarAlerta();
                return false;
            }else{
                maestroGestionServicio.guardarAsignacionDistribucion(formEdicionAsigDistribucionMG, seleccionadosMG, accion).then((reponseDatoMG) => {
                
                    if (reponseDatoMG.data.codigoRespuesta == 200) {
                            this.props.appState.alerta = { "titulo": "Información", "texto": "Realizado con éxito" }
                            this.props.mostrarAlerta();
                    }
                    if (reponseDatoMG.data.codigoRespuesta == 400) {
                        this.props.appState.alerta = { "titulo": "Información", "texto":  reponseDatoMG.data.data}
                        this.props.mostrarAlerta();
                    }
                });
            }
           
            
        }//fin else validacion formulario
    }

    render() {
        const {  listaEstrategia, listaEjecutivo, showButtonsAsinacionMG } = this.props.gestionCarteraState
        const listEstrategia = listaEstrategia.map(item =>
            <option key={item.est_idregistro} value={item.est_idregistro}>{item.est_nombre}</option>
        );
      /*  const listEjecutivos = this.state.listaEjecutivos.map(item =>
            <option key={item.eje_idregistro} value={item.eje_idregistro}>{item.tercero.nomcompleto}</option>
        )
        */
        const listEjecutivos = listaEjecutivo.map(item =>
            <option key={item.eje_idregistro} value={item.eje_idregistro}>{item.tercero.nomcompleto}</option>
        )
        return (
            
            <Card className="panel panel-default">
                <Accordion.Toggle className="panel-heading" as={Card.Header} eventKey="3">
                    <h4 className="panel-title">
                        <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion"  aria-expanded="false" >
                        Asignación y Distribución
                            <span> </span>
                        </a>
                    </h4>
                </Accordion.Toggle>
                <Accordion.Collapse className="panel-collapse" eventKey="3">
                    <Card.Body>
                        <Row>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>Asignación por Estrategía</Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="mr-sm-2"
                                        id="est_estrategia"
                                        name="est_estrategia"
                                        custom
                                        onChange={this.handleChange}
                                        defaultValue={-5}
                                        value={this.state.formEdicionAsigDistribucionMG.est_estrategia}
                                    >
                                        <option value="-1">Seleccione Estrategía</option>
                                        {listEstrategia}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>Ejecutivos </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="eje_ejcutivos"
                                        name="eje_ejcutivos"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionAsigDistribucionMG.eje_ejcutivos}
                                    >
                                      {listEjecutivos}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            
                            
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Check type="checkbox" id="checkAD1" name="checkAD1" label="Evaluar Asignación Comuna" onChange={this.handleChange} />
                                    <Form.Check type="checkbox" id="checkAD2" name="checkAD2" label="Respetar Precendencia Asignación " onChange={this.handleChange} />
                                    <Form.Check type="checkbox" id="checkAD3" name="checkAD3" label="Solo Registros pendientes por Distribuir " onChange={this.handleChange} />
                                    
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>Tiempo de Precedencia Dias </Form.Label>
                                    <Form.Control type="number" name="cantidadDias" placeholder="Tiempo de Precedencia Dias " onChange={this.handleChange} value={this.state.formEdicionAsigDistribucionMG.cantidadDias || ""} />
                                </Form.Group>
                            </Col>
                        </Row>
                        {showButtonsAsinacionMG &&(<Row>
                        <Col xs={12}>
                            <Form.Group >
                                <Button variant="primary" value="A" onClick={() => this.guardarAsignacion("A")} >Generar Asignación</Button>{' '}
                                <Button variant="primary" onClick={() => this.guardarAsignacion("C")} >Confirmar Asignación</Button>{' '}
                                <Button variant="primary" onClick={() => this.guardarAsignacion("R")} >Revertir Asignación</Button>{' '}
                            </Form.Group>
                        </Col>
                    </Row>)}
                        
                    </Card.Body>
                </Accordion.Collapse>
            </Card>


                    
               
        );
    }
}
FormAsignacionDistribucionMaestroGestion.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});
const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_IADMG,
            payload: item
        })
    },
    cargarlistaItem(item) {
        dispatch({
            type: ACCION.LISTAR_EJECUTIVOS_ESTRATEGIA,
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
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormAsignacionDistribucionMaestroGestion);
export { VistaRedux as RVistaFormAsignacionDistribucionMaestroGestion };