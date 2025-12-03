
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RVistaDetalleMetasGestion, RVistaDetalleMetasGestionRango } from '../index';
import { ACCION } from '../../store/actions/TiposAcciones';
import mGestionServicio from '../../store/servicios/MetasGestionServicios';

/**
 * componente formulario Metas de Gestión
 */
class FormMetasGestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion,
            isShowFormDetailV: false,
            isShowFormDetailR: false
        }
        if (this.state.formEdicion.fun_funcionlmeta == 203){
            this.state.isShowFormDetailV = false;
            this.state.isShowFormDetailR = true;
        }

        if (this.state.formEdicion.fun_funcionlmeta == 204){
            this.state.isShowFormDetailV = true;
            this.state.isShowFormDetailR = false;
        }
       
    }


    handleChange = async (event) => {
        const controlN = event.target.name;
        const control = event.target.value;
        await this.setState({
            formEdicion: {
                ...this.state.formEdicion,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicion)
        if (controlN == "fun_funcionlmeta"){
            mGestionServicio.listarDatosMGestionDetalle(this.state.formEdicion.mege_idregistro, this.state.formEdicion.fun_funcionlmeta).then((reponseDatomGestion) => {
                if (reponseDatomGestion.data.codigoRespuesta == 200) {
                    this.props.setDataDetalle(reponseDatomGestion.data.data)
                }else{
                    this.props.setDataDetalle([])
                }
            });
            if(control === "203") {
                this.setState({isShowFormDetailR:true})
                this.setState({isShowFormDetailV:false})
            }
            if(control === "204"){
                this.setState({isShowFormDetailR:false})
                this.setState({isShowFormDetailV:true})
            } 

        }
        
        if (controlN == "uni_unidadutiempo")
            this.props.setDataPeriodo(this.state.formEdicion.uni_unidadutiempo)

    }

    render() {
        const { showFormEdicion, formEdicion } = this.props.gestionCarteraState
        const { listaEstados, listaUnidadControlMetasGestion, listaUnidadConceptoMetas, listaFuncionBaseMeta, listaFuncionMeta, listaPeriodosFiltrados } = this.props.gestionCarteraState
        
        const listEstados = listaEstados.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );

        const listUnidadControlMetasGestion = listaUnidadControlMetasGestion.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        const listPeriodos = listaPeriodosFiltrados.map(item =>
            <option key={item.per_ideregistro} value={item.per_ideregistro}>{item.per_nombre}</option>
        );
        const listUnidadConceptoMetas = listaUnidadConceptoMetas.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        const listFuncionBaseMeta = listaFuncionBaseMeta.map(item =>
            <option key={item.fun_idregistro} value={item.fun_idregistro}>{item.fun_descripcion}</option>
        );
        const listFuncionMeta = listaFuncionMeta.map(item =>
            <option key={item.fun_idregistro} value={item.fun_idregistro}>{item.fun_descripcion}</option>
        ); 

        var isShowFormDetail = false;
        if(formEdicion.hasOwnProperty("mege_idregistro")) isShowFormDetail = true;

        return (
            <Fragment>
                <Row className="col-12">
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Código <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="number" required name="mege_codigointerno" placeholder="Código" onChange={this.handleChange} value={formEdicion.mege_codigointerno} />
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Label>Descripción <span className="obligatorio">*</span></Form.Label>
                        <Form.Control type="text" name="mege_descripcion" placeholder="Descripción" onChange={this.handleChange} value={formEdicion.mege_descripcion} />
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
                            <Form.Label >Concepto para Evaluar Cumplimiento Meta <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="uni_unidadcmeta"
                                name="uni_unidadcmeta"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.uni_unidadcmeta}
                                defaultValue={-3}
                            >
                                {listUnidadConceptoMetas}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Unidad de Tiempo <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="uni_unidadutiempo"
                                name="uni_unidadutiempo"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.uni_unidadutiempo}
                                defaultValue={-4}
                            >
                                {listUnidadControlMetasGestion}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Ciclo Control <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="uni_unidadccontrol"
                                name="uni_unidadccontrol"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.uni_unidadccontrol}
                                defaultValue={-2}
                            >
                                {listPeriodos}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="col-12">
                    <Col xs={6}>
                        <Form.Group >
                            <Form.Label>Método para Cálculo Base Meta<span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="fun_funcionbmeta"
                                name="fun_funcionbmeta"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.fun_funcionbmeta}
                                defaultValue={-5}
                            >
                                {listFuncionBaseMeta}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={6}>
                    <Form.Group >
                            <Form.Label>Método para Cálculo Meta<span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="fun_funcionlmeta"
                                name="fun_funcionlmeta"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.fun_funcionlmeta}
                                defaultValue={-6}
                            >
                                {listFuncionMeta}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                {isShowFormDetail &&(<div>
                    {this.state.isShowFormDetailV && (<div>
                        <RVistaDetalleMetasGestion/>
                        </div>)}
                    {this.state.isShowFormDetailR && (<div>
                        <RVistaDetalleMetasGestionRango/>
                        </div> )}
               </div>)}
            </Fragment>
        );
    }
}
FormMetasGestion.propTypes = {
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
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormMetasGestion);
export { VistaRedux as RVistaFormMetasGestion };