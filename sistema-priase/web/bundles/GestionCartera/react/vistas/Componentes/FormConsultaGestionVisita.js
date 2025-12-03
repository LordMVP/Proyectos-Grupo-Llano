
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';
import { RVistaFormRecursosComplementariosGV} from '../index';
import validaFormulario from '../Utils/ValidacionHelper';
import GestionVisitaServicio from '../../store/servicios/GestionVisitaServicios';
import moment from 'moment';
/**
 *Formulario de consulta para Gestión Visita componente para Maestro Gestión
 */
class FormConsultaGestionVisita extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columnas: this.columnas
        }
    }
    columnas = [ {
        dataField: 'gvisr_valor',
        text: 'Información Ingresada',
        sort: true
    }];

    VolverLista = () => {
        this.props.setShowListaGestionVisita();
        this.props.setShowFormConsultaGestionVisita();
    }

    render() {
        const { formEdicionInfoGestionVisitaMG, dataRecursos } = this.props.gestionCarteraState
        return (
            <div>
                <Fragment>
                    <h1>Consulta Gestión Visita</h1>
                    <div className="customHr">.</div>
                    <br />
                    <Row>
                        <Col xs={12}>
                            <Form.Group >
                                <Button  variant="primary" onClick={this.VolverLista} >Volver a la Lista de Gestión</Button>{' '}
                            </Form.Group>
                        </Col>
                       
                    </Row>
                    <Row><br/></Row>
                    <Row>
                        <Col sm="6">
                            <Form.Label ><strong>Fecha Visita</strong> </Form.Label>
                           <p>{formEdicionInfoGestionVisitaMG.gvis_fechavisita || ""}</p>
                        </Col>
                        <Col xs={6}>
                            <Form.Group >
                                <Form.Label><strong>Novedad Visita</strong></Form.Label>
                                <p>{formEdicionInfoGestionVisitaMG.nvis_novedad}</p>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="6">
                            <Form.Label ><strong>Colaborador</strong> </Form.Label>
                           <p>{formEdicionInfoGestionVisitaMG.eje_nombre || ""}</p>
                        </Col>
                        <Col sm="6">
                            <Form.Label><strong>Acta No.</strong></Form.Label>
                            <p>{formEdicionInfoGestionVisitaMG.gvis_numeroradicado || ""}</p>
                        </Col>
                    </Row>
                    <Row><br/></Row>
                    <Row>
                        <Col sm="12">
                            <Form.Label ><strong>Observación</strong></Form.Label>
                            <p>{formEdicionInfoGestionVisitaMG.gvis_observacion || ""} </p>
                        </Col>
                    </Row>
                    <Row><br/></Row>
                    <h1>Recursos</h1>
                    <div className="customHr">.</div>
                    <br />
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='gvisr_idregistro' data={dataRecursos} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                    <Row><br/></Row>
                    
                </Fragment>
            </div>
        );
    }
}
FormConsultaGestionVisita.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_GV,
            payload: item
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
    setShowFormGestionVisita() {
        dispatch({
            type: ACCION.SET_SHOW_GESTIONVISITA
        })
    },
    setShowListaGestionVisita() {
        dispatch({
            type: ACCION.SET_SHOW_LISTAGNVISITA
        })
    },
    setShowFormConsultaGestionVisita() {
        dispatch({
            type: ACCION.SET_SHOW_FORMCONSULTAGNVISITA
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormConsultaGestionVisita);
export { VistaRedux as RVistaFormConsultaGestionVisita };