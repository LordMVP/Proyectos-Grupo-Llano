import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import tComisionalDetalle from '../../store/servicios/TablaComisionalServicios';
import { ACCION } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';

/**
 * Componente para listar detalle tabla comisional valor unitario
 */
class DetalleTablaComisionalValor extends Component {

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
        dataField: 'tcomd_valorunitario',
        text: 'Valor Unitario',
        sort: true
    },  {
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
        tComisionalDetalle.eliminarDatosTComisionalDetalle(item).then((reponseTComisionalDetalle) => {
            tComisionalDetalle.listarDatosTComisionalDetalle(item.tcomidregistro, item.fun_funcionmcomision).then((reponseTComisionalDetalle) => {
                if (reponseTComisionalDetalle.data.codigoRespuesta == 200) {
                    this.props.setDataDetalle(reponseTComisionalDetalle.data.data)
                } else {
                    this.props.setDataDetalle([])
                }
            });
        });
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

    agregarItem = () => {
        const { formEdicion } = this.props.gestionCarteraState
        const validacion = validaFormulario.validaFormTComValor(formEdicion);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            tComisionalDetalle.guardarDatosTComisionalDetalle(formEdicion).then((reponseDatoTComisionalDetalle) => {
                tComisionalDetalle.listarDatosTComisionalDetalle(formEdicion.tcom_idregistro, formEdicion.fun_funcionmcomision).then((reponseDatoTComisionalDetalle) => {
                    if (reponseDatoTComisionalDetalle.data.codigoRespuesta == 200) {
                        this.props.setDataDetalle(reponseDatoTComisionalDetalle.data.data)
                    } else {
                        this.props.setDataDetalle([])
                    }
                });
            });
        }
    }

    render() {
        const { formEdicion, dataDetalle, showButtonGuardar } = this.props.gestionCarteraState
        return (
            <Fragment>
                <Row className="elemento-center">
                    <Col xs={3}>
                        <Form.Group >
                            <Form.Label>Valor Unitario <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="number" required name="tcomd_valorunitario" onChange={this.handleChange} value={formEdicion.tcomd_valorunitario} placeholder="Valor Unitario"  />              
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
                    <BootstrapTable bootstrap4 wrapperClasses="table-responsive" rowClasses="text-nowrap" striped bordered hover keyField='tcomd_idregistro' data={dataDetalle} columns={this.state.columnas} pagination={paginationFactory()} filter={filterFactory()} filterPosition="top" noDataIndication="No hay registros disponible" />
                </Row>
            </Fragment>
        );
    }
}

DetalleTablaComisionalValor.propTypes = {
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
            payload: "Listar items detalle tabla comisión valor unitario"
        })

    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
});

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(DetalleTablaComisionalValor);
export { VistaRedux as RVistaDetalleTablaComisionalValor };