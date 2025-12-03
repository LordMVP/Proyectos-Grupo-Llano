
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RVistaDetalleNovedadVisita } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';

/**
 *  componente formulario novedad visita
 */
class FormNovedadVisita extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion
        }

    }

    componentDidUpdate(nextProps) {

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
        const { showFormEdicion, formEdicion } = this.props.gestionCarteraState
        const { listaEstados } = this.props.gestionCarteraState
        var isShowFormDetail = false;
        if(formEdicion.hasOwnProperty("nvis_idregistro")) isShowFormDetail = true;

        const listEstados = listaEstados.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        return (
            <Fragment>
                <Row className="col-12">
                    <Col xs={3}>
                        <Form.Group >
                            <Form.Label>Código <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="number" required name="nvis_codigointerno" onChange={this.handleChange} value={formEdicion.nvis_codigointerno} placeholder="Código" />
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group >
                            <Form.Label>Nombre <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="text" required name="nvis_nombre" onChange={this.handleChange} value={formEdicion.nvis_nombre} placeholder="Nombre" />
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group >
                            <Form.Label>Estado <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="uni_unidadestado"
                                name="uni_unidadestado"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.uni_unidadestado}
                                defaultValue={-1}

                            >
                                {listEstados}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group >
                            <Form.Label>Recursos </Form.Label>
                            <Form.Control type="text" required readOnly name="recursos" value={formEdicion.recursos} placeholder="Recursos" />
                        </Form.Group>
                    </Col>
                </Row>
                {isShowFormDetail && (<div>
                    <RVistaDetalleNovedadVisita /><br />
                </div>)}
            </Fragment>
        );
    }
}
FormNovedadVisita.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM,
            payload: item
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormNovedadVisita);
export { VistaRedux as RVistaFormNovedadVisita };