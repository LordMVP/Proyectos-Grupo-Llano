
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION } from '../../store/actions/TiposAcciones';
/**
 * componente formulario Restricción VAriables globales
 */
class FormVariableGlobal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion
            
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
        if(controlN === "uni_unimcarga"){
            
            if(control === "3545") {
                this.props.setShowAtributo(true);
                this.props.setShowConstante(false);
                this.props.setShowCalculado(false);
            }
            if(control === "3546"){
                this.props.setShowAtributo(false);
                this.props.setShowConstante(true);
                this.props.setShowCalculado(false);
            } 
            if(control === "3547"){
                this.props.setShowAtributo(false);
                this.props.setShowConstante(false);
                this.props.setShowCalculado(true);
            } 
            if(control === "-6"){
                this.props.setShowAtributo(false);
                this.props.setShowConstante(false);
                this.props.setShowCalculado(false);
            } 
        }
        if (controlN == "uni_tipometodo"){
            
            if(control === "3922") this.props.setDataOrigen("M")
            if(control === "3923") this.props.setDataOrigen("S")
            this.props.selecionarItem(this.state.formEdicion)
        }
            
    }

   

    render() {
        const { showFormEdicion, formEdicion, isShowAtributo, isShowConstante, isShowCalculado} = this.props.gestionCarteraState
        const { listaEstados, listaUnidadMetodoCarga, listaUnidadTipoDato,listaFuncionOrigenFiltrados, listaUnidadAtributoMaestro, listaUnidadCalculoGestion, listaUnidadMetodoBackend} = this.props.gestionCarteraState
        
        const listEstados = listaEstados.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );

        const listUnidadTipoDato = listaUnidadTipoDato.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        const listUnidadAtributoMaestro = listaUnidadAtributoMaestro.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        //TODO quitar lineas comentadas
        /*const listUnidadCalculoGestion = listaUnidadCalculoGestion.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );*/
        const listFuncionOrigen = listaFuncionOrigenFiltrados.map(item =>
            <option key={item.fun_idregistro} value={item.fun_idregistro}>{item.fun_nombre}</option>
        );
        const listUnidadMetodoBackend = listaUnidadMetodoBackend.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        /*const listUnidadProcedimientoGestion = listaUnidadProcedimientoGestion.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );*/
        const listUnidadMetodoCarga = listaUnidadMetodoCarga.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        
        return (
            <Fragment>
                <Row>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Variable Descripción <span className="obligatorio">*</span></Form.Label>
                                    <Form.Control type="text" name="vglo_descripcion" placeholder="Variable Descripción" onChange={this.handleChange}  value={formEdicion.vglo_descripcion || ""}/>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Tipo Dato Salida <span className="obligatorio">*</span></Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="mr-sm-2"
                                        id="uni_tipodato"
                                        name="uni_tipodato"
                                        custom
                                        onChange={this.handleChange}
                                        value={formEdicion.uni_tipodato}
                                        defaultValue={-7}
                                       
                                    >
                                       {listUnidadTipoDato} 
                                    </Form.Control>
                                </Form.Group>
                            </Col>
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
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Metodo Carga <span className="obligatorio">*</span></Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="mr-sm-2"
                                        id="uni_unimcarga"
                                        name="uni_unimcarga"
                                        custom
                                        defaultValue={-6}
                                        onChange={this.handleChange}
                                        value={formEdicion.uni_unimcarga}
                                        
                                    >
                                      {listUnidadMetodoCarga}  
                                       
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        
                            {isShowAtributo && (<div className="row col">
                                <Col xs={6}>
                                    <Form.Group >
                                        <Form.Label className="blancoLabel" >atrmaestrocartera</Form.Label>
                                        <Form.Control
                                            as="select"
                                            className="mr-sm-2"
                                            id="uni_atrmaestrocartera"
                                            name="uni_atrmaestrocartera"
                                            custom
                                            onChange={this.handleChange}
                                            value={formEdicion.uni_atrmaestrocartera}
                                            defaultValue={-2}
                                        > 
                                          {listUnidadAtributoMaestro}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </div>)}
                            {isShowConstante && (<div className="row col">
                                <Col xs={6}>
                                    <Form.Group >
                                        <Form.Label className="blancoLabel" >valorconstante</Form.Label>
                                        <Form.Control type="text" name="vglo_valorconstante" placeholder="Valor constante" onChange={this.handleChange} value={formEdicion.vglo_valorconstante || ""} />
                                    </Form.Group>
                                </Col>
                            </div>)}
                            {isShowCalculado && (<div className="row col">
                                <Col xs={6}>
                                    <Form.Group >
                                        <Form.Label className="blancoLabel" >tipometodo</Form.Label>
                                        <Form.Control
                                            as="select"
                                            className="mr-sm-2"
                                            id="uni_tipometodo"
                                            name="uni_tipometodo"
                                            custom
                                            onChange={this.handleChange}
                                            value={formEdicion.uni_tipometodo}
                                            defaultValue={-3}
                                        >
                                           {listUnidadMetodoBackend} 
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group >
                                        <Form.Label className="blancoLabel" >origenmetodo</Form.Label>
                                        <Form.Control
                                            as="select"
                                            className="mr-sm-2"
                                            id="fun_funcionorigen"
                                            name="fun_funcionorigen"
                                            custom
                                            onChange={this.handleChange}
                                            value={formEdicion.fun_funcionorigen}
                                            defaultValue={-8}
                                        >
                                            {listFuncionOrigen}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </div>)}
                        </Row>
            </Fragment>
        );
    }
}
FormVariableGlobal.propTypes = {
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
    setShowAtributo(data) {
        dispatch({
            type: ACCION.SET_SHOW_ATRIBUTO,
            payload: data
        })
    },
    setShowConstante(data) {
        dispatch({
            type: ACCION.SET_SHOW_CONSTANTE,
            payload: data
        })
    },
    setShowCalculado(data) {
        dispatch({
            type: ACCION.SET_SHOW_CALCULADO,
            payload: data
        })
    },
    setDataOrigen(data) {
        dispatch({
            type: ACCION.SET_DATA_ORIGEN,
            payload: data
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormVariableGlobal);
export { VistaRedux as RVistaFormVariableGlobal };