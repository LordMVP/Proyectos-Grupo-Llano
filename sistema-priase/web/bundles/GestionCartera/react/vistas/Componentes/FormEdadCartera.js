import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RVistaBotones } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';

/**
 * Vista Principal del componente de edición edad cartera
 */
class FormEdadCartera extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion
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
        const { showFormEdicion, formEdicion } = this.props.gestionCarteraState
        const { listaEstados, listaUnidadControlEstaCartera } = this.props.gestionCarteraState
        const listEstados = listaEstados.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );

        const listUnidadControlEstaCartera = listaUnidadControlEstaCartera.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        return (
            <Fragment>
                <Row className="col-12">
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Unidad de Tiempo </Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="uni_unidadutiempo"
                                name="uni_unidadutiempo"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.uni_unidadutiempo}
                                defaultValue={-2}
                            >
                                {listUnidadControlEstaCartera}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={8}>
                        <Form.Label className="text-center">Rango de Tiempo <span className="obligatorio">*</span></Form.Label>
                        <Form.Group as={Row} >
                            <Form.Label column sm="2">Desde</Form.Label>
                            <Col sm="4">
                                <Form.Control type="number" required name="edcar_rangodesde" onChange={this.handleChange} value={formEdicion.edcar_rangodesde} placeholder="Desde" />
                            </Col>

                            <Form.Label column sm="2">Hasta</Form.Label>
                            <Col sm="4">
                                <Form.Control type="number" required name="edcar_rangohasta" onChange={this.handleChange} value={formEdicion.edcar_rangohasta} placeholder="Hasta" />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="col-12">
                    <Col xs={4}>
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
                    <Col xs={8}>

                        <Form.Label>Descripción <span className="obligatorio">*</span></Form.Label>
                        <Form.Control type="text" name="edcar_descripcion" onChange={this.handleChange} value={formEdicion.edcar_descripcion} placeholder="Descripción" />
                    </Col>
                </Row>

                <RVistaBotones />
            </Fragment>
        );
    }
}
FormEdadCartera.propTypes = {
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
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormEdadCartera);
export { VistaRedux as RVistaFormEdadCartera };