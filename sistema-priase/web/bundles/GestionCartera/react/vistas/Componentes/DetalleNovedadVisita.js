import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import nVisitaServicio from '../../store/servicios/NovedadVisitaServicios';
import { ACCION } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';

/**
 * Componente para listar detalle novedad visita
 */
class DetalleNovedadVisita extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion,
            showButtonGuardar: this.props.gestionCarteraState.showButtonGuardar,
            dataDetalle: [],
            columnas: this.columnas
        }
    }
    columnas = [{
        dataField: 'nvir_idregistro',
        text: 'Recurso',
        sort: true
    }, {
        dataField: 'estadoTipoRecurso.uninombre',
        text: 'Tipo Recurso',
        sort: true
    }, {
        dataField: 'nvir_descripcion',
        text: 'Descripción',
        sort: true
    }, {
        dataField: 'nvir_esobligatorio',
        text: 'Obligatorio',
        sort: true,
        formatter: (cellContent, row) => {
            if (row.nvir_esobligatorio) {
                return (
                   <p>Si</p>
                );
            }
            else {
                return (
                    <p>No</p>
                );
            }
        }
    }, {
        dataField: 'df1',
        isDummyField: true,
        text: 'Acción',
        formatter: (cellContent, row) => {
            if(this.state.showButtonGuardar)
            {  
                return (
                    <Button onClick={() => this.seleccionarItem(row)} variant="primary">Eliminar</Button>
                );
           }

        }
    },];

    seleccionarItem = (item) => {

        nVisitaServicio.eliminarDatosNVisitaRecurso(item).then((reponseDatonVisita) => {
            nVisitaServicio.listarDatosNVisitaRecurso(item.nvisidregistro).then((reponseDatonVisita) => {
                if (reponseDatonVisita.data.codigoRespuesta == 200) {
                    this.props.setDataDetalle(reponseDatonVisita.data.data)
                } else {
                    this.props.setDataDetalle([])
                }
            });
        });
    }

    agregarItem = () => {
        const { formEdicion } = this.props.gestionCarteraState
        const validacion = validaFormulario.validaFormNovedadVisita(formEdicion);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            nVisitaServicio.guardarDatosNVisitaRecurso(formEdicion).then((reponseDatonVisita) => {
                nVisitaServicio.listarDatosNVisitaRecurso(formEdicion.nvis_idregistro).then((reponseDatonVisita) => {
                    if (reponseDatonVisita.data.codigoRespuesta == 200) {
                        this.props.setDataDetalle(reponseDatonVisita.data.data)
                    } else {
                        this.props.setDataDetalle([])
                    }
                });
            });
        }
    }

    handleChange = async (event) => {
        await this.setState({
            formEdicion: {
                ...this.state.formEdicion,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicion)
    }

    render() {
        const { formEdicion, dataDetalle, showButtonGuardar } = this.props.gestionCarteraState
        const { listaUnidadTipoRecurso } = this.props.gestionCarteraState
        const listUnidadTipoRecurso = listaUnidadTipoRecurso.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        return (
            <Fragment>
                <Row className="col-12">
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Descripción <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="text" required name="nvir_descripcion" onChange={this.handleChange} value={formEdicion.nvir_descripcion} placeholder="Descripción" />
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Tipo Recurso <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="uni_unidadtrecurso"
                                name="uni_unidadtrecurso"
                                custom
                                value={formEdicion.uni_unidadtrecurso}
                                onChange={this.handleChange}
                                defaultValue={"Seleccione Tipo Recurso"}
                                
                            >
                                {listUnidadTipoRecurso}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group className="text-center">
                            <Form.Label>Obligatorio <span className="obligatorio">*</span></Form.Label>
                            <Row className="radio-center">
                                <Form.Check inline type="radio" label="SI" name="nvir_esobligatorio" id="nvir_esobligatorio" onChange={this.handleChange} value={true} />
                                <Form.Check inline type="radio" label="NO" name="nvir_esobligatorio" id="nvir_esobligatorio" onChange={this.handleChange} value={false} />
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Group >
                            <Form.Label className="blancoLabel">botón adicionar </Form.Label>
                            {showButtonGuardar && (<div><Button variant="primary" onClick={this.agregarItem}>Adicionar</Button>{' '}
                            </div>)}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="col-12">
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='nvir_idregistro' data={dataDetalle} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </Row>
            </Fragment>
        );
    }
}

DetalleNovedadVisita.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
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

    NuevoItem(item) {
        dispatch({
            type: ACCION.NUEVO_ITEM,
            payload: {}
        }),
            dispatch({
                type: ACCION.SET_FORM_EDICION,
                payload: ""
            })
    },

    setShowFormEdicion(condicion) {
        dispatch({
            type: ACCION.SET_FORM_EDICION,
            payload: condicion
        })


    },

    setBotonGuardar(estado) {
        var accion = true;
        if (estado == "I") accion = false
        dispatch({
            type: ACCION.SET_BUTTON_GUARDAR,
            payload: accion
        })
    },

    listarItem() {
        dispatch({
            type: ACCION.LISTAR_ITEM,
            payload: "Listar items detalle novedad visita"
        })

    },

    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(DetalleNovedadVisita);
export { VistaRedux as RVistaDetalleNovedadVisita };