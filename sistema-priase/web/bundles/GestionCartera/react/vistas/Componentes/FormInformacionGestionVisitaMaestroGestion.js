
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Accordion, Card, a , h4} from 'react-bootstrap';
import { ACCION } from '../../store/actions/TiposAcciones';

/**
 *Vista Principal del componente de edición 
 */
class FormInformacionGestionVisitaMaestroGestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionInfoGestionVisitaMG: this.props.gestionCarteraState.formEdicionInfoGestionVisitaMG,
        }
    }
    componentDidUpdate(prevProps) { 
         // Uso tipico (no olvides de comparar las props): 
        if (this.props.gestionCarteraState.formEdicionInfoGestionVisitaMG !== prevProps.gestionCarteraState.formEdicionInfoGestionVisitaMG) { 
            this.setState({
                formEdicionInfoGestionVisitaMG:this.props.gestionCarteraState.formEdicionInfoGestionVisitaMG
            })
        } 
    }
    handleChange = async (event) => {
        if (event.target.type == 'select-multiple') {
            let value = Array.from(event.target.selectedOptions, option => option.value);
            const controlN = event.target.name;
            if(controlN == "nvis_novedadesvisitas"){
                await this.setState({
                    formEdicionInfoGestionVisitaMG: {
                        ...this.state.formEdicionInfoGestionVisitaMG,
                        novedadvisitas: value
                    }
                });
            }
            
            
            this.props.selecionarItem(this.state.formEdicionInfoGestionVisitaMG)
            return;
        }
        await this.setState({
            formEdicionInfoGestionVisitaMG: {
                ...this.state.formEdicionInfoGestionVisitaMG,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicionInfoGestionVisitaMG)
    }

    render() {
        const {  listaNovedadVisita } = this.props.gestionCarteraState
        const listNovedadVisita = listaNovedadVisita.map(item =>
            <option key={item.nvis_idregistro} value={item.nvis_idregistro}>{item.nvis_nombre}</option>
        );
        return (
            
            <Card className="panel panel-default">
                <Accordion.Toggle className="panel-heading" as={Card.Header} eventKey="2">
                    <h4 className="panel-title">
                        <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion"  aria-expanded="false" >
                        Información Gestión Visita
                            <span> </span>
                        </a>
                    </h4>
                </Accordion.Toggle>
                <Accordion.Collapse className="panel-collapse" eventKey="2">
                    <Card.Body>
                        <Row>
                            <Col xs={3}>
                                <Form.Group >
                                    <Form.Label>Novedad Visita </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="nvis_idregistro"
                                        name="nvis_novedadesvisitas"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoGestionVisitaMG.novedadvisitas || []}
                                    >
                                      {listNovedadVisita}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Label>Cantidad Visitas </Form.Label><br/>
                                <Form.Group as={Row} >
                                    <Col sm="6">
                                        <Form.Label >Desde</Form.Label>
                                        <Form.Control type="number" placeholder="Desde" name="mges_cvisitadesde" onChange={this.handleChange} value={this.state.formEdicionInfoGestionVisitaMG.mges_cvisitadesde || ""}/>
                                    </Col>
                                    <Col sm="6">
                                        <Form.Label >Hasta</Form.Label>
                                        <Form.Control type="number" placeholder="Hasta" name="mges_cvisitahasta" onChange={this.handleChange} value={this.state.formEdicionInfoGestionVisitaMG.mges_cvisitahasta || ""}/>
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col xs={5}>
                                <Form.Label>Fecha Visitas </Form.Label><br/>
                                <Form.Group as={Row} >
                                    <Col sm="6">
                                        <Form.Label >Desde</Form.Label>
                                        <Form.Control type="date" placeholder="Desde" name="mges_fvisitadesde" onChange={this.handleChange} value={this.state.formEdicionInfoGestionVisitaMG.mges_fvisitadesde || ""}/>
                                    </Col>
                                    <Col sm="6">
                                        <Form.Label>Hasta</Form.Label>
                                        <Form.Control type="date" placeholder="Hasta" name="mges_fvisitahasta" onChange={this.handleChange} value={this.state.formEdicionInfoGestionVisitaMG.mges_fvisitahasta || ""}/>
                                    </Col>
                                </Form.Group>
                            </Col>
                            
                        </Row>
                        
                    </Card.Body>
                </Accordion.Collapse>
            </Card>


                    
               
        );
    }
}
FormInformacionGestionVisitaMaestroGestion.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});
const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_IGVMG,
            payload: item
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormInformacionGestionVisitaMaestroGestion);
export { VistaRedux as RVistaFormInformacionGestionVisitaMaestroGestion };