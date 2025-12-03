
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Accordion, Card, a , h4} from 'react-bootstrap';
import { ACCION } from '../../store/actions/TiposAcciones';

/**
 *Vista Principal del componente de edición 
 */
class FormInformacionGestionMaestroGestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionInfoGestionMG: this.props.gestionCarteraState.formEdicionInfoGestionMG,
        }
    }

    componentDidUpdate(prevProps) { 
        // Uso tipico (no olvides de comparar las props): 
        if (this.props.gestionCarteraState.formEdicionInfoGestionMG !== prevProps.gestionCarteraState.formEdicionInfoGestionMG) { 
            this.setState({
                formEdicionInfoGestionMG:this.props.gestionCarteraState.formEdicionInfoGestionMG
            })
        } 
    }
    
    handleChange = async (event) => {
        if (event.target.type == 'select-multiple') {
            let value = Array.from(event.target.selectedOptions, option => option.value);
            const controlN = event.target.name;
            if(controlN == "estg_estadogestiones"){
                await this.setState({
                    formEdicionInfoGestionMG: {
                        ...this.state.formEdicionInfoGestionMG,
                        estadogestiones: value
                    }
                });
            }
            if(controlN == "esta_estadoasignaciones"){
                await this.setState({
                    formEdicionInfoGestionMG: {
                        ...this.state.formEdicionInfoGestionMG,
                        estadoasignaciones: value
                    }
                });
            }
            if(controlN == "cla_clasificaciones"){
                await this.setState({
                    formEdicionInfoGestionMG: {
                        ...this.state.formEdicionInfoGestionMG,
                        clasificaciones: value
                    }
                });
            }
            if(controlN == "edcar_edadcarteras"){
                await this.setState({
                    formEdicionInfoGestionMG: {
                        ...this.state.formEdicionInfoGestionMG,
                        edadcarteras: value
                    }
                });
            }
            if(controlN == "eje_ejecutivos"){
                await this.setState({
                    formEdicionInfoGestionMG: {
                        ...this.state.formEdicionInfoGestionMG,
                        ejecutivos: value
                    }
                });
            }
            if(controlN == "ori_orientaciones"){
                await this.setState({
                    formEdicionInfoGestionMG: {
                        ...this.state.formEdicionInfoGestionMG,
                        orientaciones: value
                    }
                });
            }
            if(controlN == "est_estrategias"){
                await this.setState({
                    formEdicionInfoGestionMG: {
                        ...this.state.formEdicionInfoGestionMG,
                        estrategias: value
                    }
                });
            }
            
            this.props.selecionarItem(this.state.formEdicionInfoGestionMG)
            return;
        }
        await this.setState({
            formEdicionInfoGestionMG: {
                ...this.state.formEdicionInfoGestionMG,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicionInfoGestionMG)
    }

    render() {
        const {  listaUnidadEstadoGestionCartera,listaClasificacion,listaOrientacion,listaEdadCartera,listaEstrategia,listaEjecutivo } = this.props.gestionCarteraState
        
        const listUnidadEstadoGestionCartera = listaUnidadEstadoGestionCartera.map(item =>
            <option key={item.uni_ideregistro} value={item.uninombre}>{item.uninombre}</option>
        );
        const listClasificacion = listaClasificacion.map(item =>
            <option key={item.cla_idregistro} value={item.cla_idregistro}>{item.cla_nombre}</option>
        );
        const listOrientacion = listaOrientacion.map(item =>
            <option key={item.ori_idregistro} value={item.ori_idregistro}>{item.ori_nombre}</option>
        );
        const listEdadCartera = listaEdadCartera.map(item =>
            <option key={item.edcar_idregistro} value={item.edcar_idregistro}>{item.edcar_descripcion}</option>
        );
        const listEstrategia = listaEstrategia.map(item =>
            <option key={item.est_idregistro} value={item.est_idregistro}>{item.est_nombre}</option>
        );
        const listEjecutivo = listaEjecutivo.map(item =>
            <option key={item.eje_idregistro} value={item.eje_idregistro}>{item.tercero.nomcompleto}</option>
        );
        return (
            
            <Card className="panel panel-default">
                <Accordion.Toggle className="panel-heading" as={Card.Header} eventKey="1">
                    <h4 className="panel-title">
                        <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion"  aria-expanded="false" >
                        Información Gestión
                            <span> </span>
                        </a>
                    </h4>
                </Accordion.Toggle>
                <Accordion.Collapse className="panel-collapse" eventKey="1">
                    <Card.Body>
                        <Row>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>Estado Gestión </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="estg_estadogestiones"
                                        name="estg_estadogestiones"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoGestionMG.estadogestiones || []}
                                    >
                                      {listUnidadEstadoGestionCartera}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>Estado Asignación </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="esta_estadoasignaciones"
                                        name="esta_estadoasignaciones"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoGestionMG.estadoasignaciones || []}
                                    >
                                    <option value="A">A - Asignado </option>
                                    <option value="C">C - Confirmado</option>
                                    <option value="R">R - Reversado</option>  
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                            <Form.Group >
                                    <Form.Label>Cobro Jurídico  </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="mr-sm-2"
                                        id="cobj_cobrojuridico"
                                        name="cobj_cobrojuridico"
                                        custom
                                        defaultValue={-4}
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoGestionMG.cobj_cobrojuridico}
                                    >
                                        <option value="-4">Seleccione Cobro Jurídico</option>
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>Financiado  </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="mr-sm-2"
                                        id="fin_financiado"
                                        name="fin_financiado"
                                        custom
                                        defaultValue={-5}
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoGestionMG.fin_financiado}
                                    >
                                        <option value="-5">Seleccione Financiado</option>
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Total deuda pendiente por pagar </Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Form.Group as={Row} >
                                    <Form.Label column sm="1">Desde</Form.Label>
                                    <Col sm="5">
                                        <Form.Control type="number" placeholder="Desde" name="mges_deudadesde" onChange={this.handleChange} value={this.state.formEdicionInfoGestionMG.mges_deudadesde || ""}/>
                                    </Col>

                                    <Form.Label column sm="1">Hasta</Form.Label>
                                    <Col sm="5">
                                        <Form.Control type="number" placeholder="Hasta" name="mges_deudahasta" onChange={this.handleChange} value={this.state.formEdicionInfoGestionMG.mges_deudahasta || ""}/>
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Cantidad Facturas Vencidas </Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Form.Group as={Row} >
                                    <Form.Label column sm="1">Desde</Form.Label>
                                    <Col sm="5">
                                        <Form.Control type="number" placeholder="Desde" name="mges_factvencidadesde" onChange={this.handleChange} value={this.state.formEdicionInfoGestionMG.mges_factvencidadesde || ""}/>
                                    </Col>

                                    <Form.Label column sm="1">Hasta</Form.Label>
                                    <Col sm="5">
                                        <Form.Control type="number" placeholder="Hasta" name="mges_factvencidahasta" onChange={this.handleChange} value={this.state.formEdicionInfoGestionMG.mges_factvencidahasta || ""}/>
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Clasificación </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="cla_clasificaciones"
                                        name="cla_clasificaciones"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoGestionMG.clasificaciones || []}
                                    >
                                      {listClasificacion}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Edad Cartera </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="edcar_edadcarteras"
                                        name="edcar_edadcarteras"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoGestionMG.edadcarteras || []}
                                    >
                                        {listEdadCartera}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Ejecutivo  </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="eje_ejecutivos"
                                        name="eje_ejecutivos"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoGestionMG.ejecutivos || []}
                                    >
                                       {listEjecutivo}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row> 
                        <Row>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>Orientación </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="ori_orientaciones"
                                        name="ori_orientaciones"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoGestionMG.orientaciones || []}
                                    >
                                      {listOrientacion}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>Estrategía </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="est_estrategias"
                                        name="est_estrategias"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoGestionMG.estrategias || []}
                                    >
                                        {listEstrategia}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row> 
                    </Card.Body>
                </Accordion.Collapse>
            </Card>


                    
               
        );
    }
}
FormInformacionGestionMaestroGestion.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});
const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_IGMG,
            payload: item
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormInformacionGestionMaestroGestion);
export { VistaRedux as RVistaFormInformacionGestionMaestroGestion };