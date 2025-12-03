
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RVistaDetalleTablaComisionalValor, RVistaDetalleTablaComisionalRango } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';
import tComisionalDetalle from '../../store/servicios/TablaComisionalServicios';

/**
 * componente formulario tabla comisional
 */
class FormTablaComisional extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion,
            isShowFormDetailV: false,
            isShowFormDetailR: false
        }
        if (this.state.formEdicion.fun_funcionmcomision == 205){
            this.state.isShowFormDetailV = false;
            this.state.isShowFormDetailR = true;
        }

        if (this.state.formEdicion.fun_funcionmcomision == 206){
            this.state.isShowFormDetailV = true;
            this.state.isShowFormDetailR = false;
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
        
        if(controlN === "fun_funcionmcomision"){
            tComisionalDetalle.listarDatosTComisionalDetalle(this.state.formEdicion.tcom_idregistro,this.state.formEdicion.fun_funcionmcomision).then((reponseTComisionalDetalle) => {
                if (reponseTComisionalDetalle.data.codigoRespuesta == 200) {
                    this.props.setDataDetalle(reponseTComisionalDetalle.data.data)
                } else {
                    this.props.setDataDetalle([])
                }
            });
            if(control === "205") {
                this.setState({isShowFormDetailR:true})
                this.setState({isShowFormDetailV:false})
            }
            if(control === "206"){
                this.setState({isShowFormDetailR:false})
                this.setState({isShowFormDetailV:true})
            } 
        }
    }

    render() {
        const { showFormEdicion, formEdicion } = this.props.gestionCarteraState
        const { listaEstados, listaUnidadConceptoMetas, listaFuncionBaseComision, listaFuncionComision } = this.props.gestionCarteraState
        
        const listEstados = listaEstados.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );

        const listUnidadConceptoMetas = listaUnidadConceptoMetas.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        const listFuncionBaseComision = listaFuncionBaseComision.map(item =>
            <option key={item.fun_idregistro} value={item.fun_idregistro}>{item.fun_descripcion}</option>
        );
        const listFuncionComision = listaFuncionComision.map(item =>
            <option key={item.fun_idregistro} value={item.fun_idregistro}>{item.fun_descripcion}</option>
        ); 
        var isShowFormDetail = false;
        if(formEdicion.hasOwnProperty("tcom_idregistro")) isShowFormDetail = true;
        return (
            <Fragment>
                <Row className="col-12">
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Código <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="number" required name="tcom_codigointerno" placeholder="Código" onChange={this.handleChange} value={formEdicion.tcom_codigointerno} />
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Label>Descripción <span className="obligatorio">*</span></Form.Label>
                        <Form.Control type="text" required name="tcom_descripcion" placeholder="Descripción" onChange={this.handleChange} value={formEdicion.tcom_descripcion}/>
                        <Form.Control type="hidden"  name="tcom_idregistro" onChange={this.handleChange} value={formEdicion.tcom_idregistro}/>
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
                <Row className="col-12">
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label >Concepto que Genera Comisión <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="uni_unidadgcomision"
                                name="uni_unidadgcomision"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.uni_unidadgcomision}
                                defaultValue={-3}
                            >
                                 {listUnidadConceptoMetas}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Método para Cálculo Base Comisión<span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="fun_funcionbcomision"
                                name="fun_funcionbcomision"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.fun_funcionbcomision}
                                defaultValue={-4}
                            >
                              {listFuncionBaseComision}   
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Método para Cálculo Comisión<span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="fun_funcionmcomision"
                                name="fun_funcionmcomision"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.fun_funcionmcomision}
                                defaultValue={-5}
                            >
                                 {listFuncionComision}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
               {isShowFormDetail &&(<div>
                    {this.state.isShowFormDetailV && (<div>
                        <RVistaDetalleTablaComisionalValor/>
                        </div>)}
                    {this.state.isShowFormDetailR && (<div>
                        <RVistaDetalleTablaComisionalRango/>
                        </div> )}
               </div>)}
                
            </Fragment>
        );
    }
}
FormTablaComisional.propTypes = {
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
    setDataDetalle(data) {
        dispatch({
            type: ACCION.SET_DATA_DETALLE,
            payload: data
        })
    },
    setDataPeriodo(id) {
        dispatch({
            type: ACCION.SET_DATA_PERIODO,
            payload: id
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormTablaComisional);
export { VistaRedux as RVistaFormTablaComisional };