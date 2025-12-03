
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION } from '../../store/actions/TiposAcciones';

/**
 * componente formulario Restricción Financiación Condonación
 */
class FormRestriccionFinanciacion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion,
            showPorcentaje: false,
            showMonto: false
        }
        if (this.state.formEdicion.luspu_tipo == 0){
            this.state.showPorcentaje = true;
            this.state.showMonto = false;
        }

        if (this.state.formEdicion.luspu_tipo == 1){
            this.state.showPorcentaje = false;
            this.state.showMonto = true;
        }
        if (this.state.formEdicion.luspu_tipo == 2){
            this.state.showPorcentaje = true;
            this.state.showMonto = true;
        }
    }

    handleChange = async (event) => {
        const control = event.target.value;
        const controlN = event.target.name;
        await this.setState({
            formEdicion: {
                ...this.state.formEdicion,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicion)
        if(controlN === "luspu_tipo"){
            if(control === "0" || control === 0) {
                this.setState({showPorcentaje:true})
                this.setState({showMonto:false})
            }
            if(control === "1" || control === 1) {
                this.setState({showPorcentaje:false})
                this.setState({showMonto:true})
            }
            if(control === "2" || control === 2) {
                this.setState({showPorcentaje:true})
                this.setState({showMonto:true})
            }
            if(control === "-3" || control === -3) {
                this.setState({showPorcentaje:false})
                this.setState({showMonto:false})
            }
        }
    }

    render() {
        const { showFormEdicion, listaUsuarios, listaProgramasUnidad, formEdicion } = this.props.gestionCarteraState
        const listUsuarios = listaUsuarios.map(item =>
            <option key={item.usu_ideregistro} value={item.usu_ideregistro}>{item.usuario_nom}</option>
        );

        const listProgramasUnidad = listaProgramasUnidad.map(item =>
            <option key={item.prun_ideregistro} value={item.prun_ideregistro}>{item.uni_nombre1}</option>
        );
        return (
            <Fragment>
                <Row className="col-12">
                    <Col xs={6}>
                        <Form.Group >
                            <Form.Label>Usuario <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="usu_ideregistro"
                                name="usu_ideregistro"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.usu_ideregistro}
                                defaultValue={-2}
                            >
                                {listUsuarios}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                        <Form.Group >
                            <Form.Label>Proceso <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="prun_ideregistr"
                                name="prun_ideregistr"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.prun_ideregistr}
                                defaultValue={-1}
                            >
                                {listProgramasUnidad}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="col-12">
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Tipo Restricción <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="idTipo"
                                name="luspu_tipo"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.luspu_tipo}
                                defaultValue={-3}
                            >
                                <option value="-3">Seleccione Tipo</option>
                                <option value="0">Porcentaje</option>
                                <option value="1">Monto</option>
                                <option value="2">Ambos</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    {this.state.showPorcentaje && (<Col xs={4}>
                        <Form.Group >
                            <Form.Label>Porcentaje <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="number" required name="luspu_limiteporcentaje"
                                onChange={this.handleChange}
                                value={formEdicion.luspu_limiteporcentaje}
                                placeholder="Porcentaje" />
                        </Form.Group>
                    </Col>)}
                    {this.state.showMonto && (<Col xs={4}>
                        <Form.Group >
                            <Form.Label>Monto <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="number" required name="luspu_limitemonto"
                                onChange={this.handleChange}
                                value={formEdicion.luspu_limitemonto}
                                placeholder="Monto" />
                        </Form.Group>
                    </Col>)}
                </Row>
            </Fragment>
        );
    }
}
FormRestriccionFinanciacion.propTypes = {
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
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormRestriccionFinanciacion);
export { VistaRedux as RVistaFormRestriccionFinanciacion };