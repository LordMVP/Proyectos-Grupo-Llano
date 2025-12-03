
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION } from '../../store/actions/TiposAcciones';

/**
 *Vista Principal del componente de edición 
 */
class FormEdicion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion,
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
        const {  listaEstados } = this.props.gestionCarteraState
        const listEstados = listaEstados.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        return (
            <div>
                <Fragment>
                    <Row>
                        <Col xs={4}>
                            <Form.Group >
                                <Form.Label>Código <span className="obligatorio">*</span></Form.Label>
                                <Form.Control type="number" required name="codigoInterno" placeholder="Código" onChange={this.handleChange} value={this.state.formEdicion.codigoInterno || ""} />
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group >
                                <Form.Label>Nombre <span className="obligatorio">*</span></Form.Label>
                                <Form.Control type="text" name="nombre" placeholder="Nombre" onChange={this.handleChange} value={this.state.formEdicion.nombre || ""} />
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Label>Descripción <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="text" name="descripcion" placeholder="Descripción" onChange={this.handleChange} value={this.state.formEdicion.descripcion || ""} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <Form.Group >
                                <Form.Label>Estado <span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="idEstado"
                                    name="idEstado"
                                    custom
                                    defaultValue={-1}
                                    onChange={this.handleChange}
                                    value={this.state.formEdicion.idEstado}
                                >
                                    {listEstados}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={8}>
                            <Form.Group >
                                <Form.Label>Observación <span className="obligatorio">*</span></Form.Label>
                                <Form.Control as="textarea" rows={2} name="observacion" placeholder="Observación" onChange={this.handleChange} value={this.state.formEdicion.observacion || ""} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}
FormEdicion.propTypes = {
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
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormEdicion);
export { VistaRedux as RVistaFormEdicion };