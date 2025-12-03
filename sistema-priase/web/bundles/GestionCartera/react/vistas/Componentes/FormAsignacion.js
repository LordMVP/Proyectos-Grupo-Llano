import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION } from '../../store/actions/TiposAcciones';

/**
 *componente sección de asignación
 */
class FormAsignacion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion
        }
    }

    handleChange = async (event) => {
        if (event.target.type == 'select-multiple') {
            let value = Array.from(event.target.selectedOptions, option => option.value);
            await this.setState({
                formEdicion: {
                    ...this.state.formEdicion,
                    clasificaciones: value,
                }
            });
            this.props.setFormAsginacion(value)
        }
    }

    render() {
        const { listaUnidadClasificacion } = this.props.gestionCarteraState
        const listClasificacion = listaUnidadClasificacion.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        return (
            <div>
                <Fragment>
                    <Row>
                        <Col xs={4}>
                            <Form.Group >
                                <Form.Label>Asignación <span className="obligatorio">*</span></Form.Label>
                                <Form.Control as="select" 
                                    multiple
                                    className="mr-sm-2"
                                    id="estc_idregistro"
                                    name="estc_idregistro"
                                    custom
                                    value={this.state.formEdicion.clasificaciones}
                                    onChange={this.handleChange}
                                >
                                    {listClasificacion}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}
FormAsignacion.propTypes = {
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
    setFormAsginacion(value) {

        dispatch({
            type: ACCION.SET_FORM_ASIGNACION,
            payload: value
        })

    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormAsignacion);
export { VistaRedux as RVistaFormAsignacion };