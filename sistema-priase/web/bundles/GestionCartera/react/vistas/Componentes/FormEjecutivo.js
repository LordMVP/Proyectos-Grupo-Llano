
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { MENSAJES_GESTION_CARTERA } from '../../global/constantes';
import ejecutivoServicio from '../../store/servicios/EjecutivoServicios'
import { ACCION } from '../../store/actions/TiposAcciones';
/**
 * componente formulario Ejecutivo
 */
class FormEjecutivo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion
        }

    }

    handleChange = async (event) => {
        if (event.target.type == 'select-multiple') {
            let value = Array.from(event.target.selectedOptions, option => option.value);
            const controlN = event.target.name;
            if(controlN == "uni_ideregistroComuna"){
                await this.setState({
                    formEdicion: {
                        ...this.state.formEdicion,
                        sectores: value,
                    }
                });
            }
            if(controlN == "tcom_idregistro"){
                await this.setState({
                    formEdicion: {
                        ...this.state.formEdicion,
                        tcom_idregistroArray: value
                    }
                });
            }
            if(controlN == "mges_idregistro"){
                await this.setState({
                    formEdicion: {
                        ...this.state.formEdicion,
                        mges_idregistroArray: value
                    }
                });
            }
            this.props.selecionarItem(this.state.formEdicion)
            return;
        }
        await this.setState({
            formEdicion: {
                ...this.state.formEdicion,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicion)
    }

    /**
    * Método encargado de obtener los datos de los terceros
    */
   obtenerDatosTerceros = async () => {

        await ejecutivoServicio.listarDatosTercero(this.state.formEdicion.documento).then((reponseDatoTercero) => {
        if (reponseDatoTercero.data.codigoRespuesta != 404)
        {
             this.setState({
                formEdicion: {
                    ...this.state.formEdicion,
                    nomcompleto: reponseDatoTercero.data.data.nomcompleto,
                    documento: reponseDatoTercero.data.data.documento,
                    ter_idregistro: reponseDatoTercero.data.data.ter_ideregistro
                }
            });
          
        }else{
            this.setState({
                formEdicion: {
                    ...this.state.formEdicion,
                    nomcompleto: '',
                    documento: '',
                    ter_idregistro: '',
                }
            });
            this.props.appState.alerta = { "titulo": "Información", "texto": MENSAJES_GESTION_CARTERA.MSN_BUSQUEDA_TERCERO }
            this.props.mostrarAlerta();
            
        }
        this.props.selecionarItem(this.state.formEdicion)
      });

    
}


    render() {
        const { showFormEdicion,  formEdicion } = this.props.gestionCarteraState
        const { listaEstados, listaEtapasGestion, listaTiposEjecutivos, listaTablaComisional, listaMetaGestion, listaComunas} = this.props.gestionCarteraState

        const listEstados = listaEstados.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        const listEtapasGestion = listaEtapasGestion.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        const listTiposEjecutivos = listaTiposEjecutivos.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        const listTablaComisional = listaTablaComisional.map(item =>
            <option key={item.tcom_idregistro} value={item.tcom_idregistro}>{item.tcom_descripcion}</option>
        );
        const listMetaGestion = listaMetaGestion.map(item =>
            <option key={item.mege_idregistro} value={item.mege_idregistro}>{item.mege_descripcion}</option>
        );
        const listComunas = listaComunas.map(item =>
            <option key={item.sec_ideregistro} value={item.sec_ideregistro}>{item.sec_nombre}</option>
        );   
        
        return (
            <Fragment>
                <Row>
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Identificación Ejecutivo <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="text" name="documento" placeholder="Identificación Ejecutivo" onChange={this.handleChange} value={formEdicion.documento || ""} />
                        </Form.Group>
                    </Col>
                    <Col xs={4}>
                        <Form.Group >
                            <Form.Label>Nombres <span className="obligatorio">*</span></Form.Label>
                            <Form.Control type="text" name="nomcompleto" placeholder="Nombres" readOnly onChange={this.handleChange} value={formEdicion.nomcompleto || ""} />
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Form.Label className="blancoLabel col-sm-12"></Form.Label>
                        <Button variant="primary" onClick={this.obtenerDatosTerceros}>Buscar</Button>{' '}
                    </Col>
                </Row>
                <Row>
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
                            <Form.Label>Clasificación <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="uni_unidadclasificacion"
                                name="uni_unidadclasificacion"
                                custom
                                onChange={this.handleChange}
                                defaultValue={-3}
                                value={formEdicion.uni_unidadclasificacion}
                            >
                                {listTiposEjecutivos}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group >
                            <Form.Label>Tipo Gestión <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="uni_unidadestadotgestion"
                                name="uni_unidadestadotgestion"
                                custom
                                onChange={this.handleChange}
                                defaultValue={-2}
                                value={formEdicion.uni_unidadestadotgestion}
                            >
                                {listEtapasGestion}
                            </Form.Control>
                        </Form.Group>

                    </Col>
                    <Col xs={3}>
                        <Form.Group >
                            <Form.Label>Sector Comuna <span className="obligatorio">*</span></Form.Label>
                            <Form.Control as="select" multiple
                                className="mr-sm-2"
                                id="uni_ideregistroComuna"
                                name="uni_ideregistroComuna"
                                custom
                                value={formEdicion.sectores}
                                onChange={this.handleChange}
                            >
                                {listComunas}
                            </Form.Control>
                        </Form.Group>

                    </Col>
                </Row>
                <Row>
                    <Col xs={3}>
                        <Form.Group >
                            <Form.Label>Fecha Ingreso <span className="obligatorio">*</span></Form.Label>
                            <input type="date" onChange={this.handleChange} id="fechaIngreso" name="eje_fechaingreso" value={formEdicion.eje_fechaingreso || ""} />
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group >
                            <Form.Label>Fecha Vencimiento <span className="obligatorio">*</span></Form.Label>
                            <input type="date" onChange={this.handleChange} id="fechaVencimiento" name="eje_fechavencimiento" value={formEdicion.eje_fechavencimiento || ""} />
                        </Form.Group>
                    </Col>
                    <Col xs={3}>
                        <Form.Group>
                            <Form.Label>Tabla Comisional <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select" multiple
                                className="mr-sm-2"
                                id="tcom_idregistro"
                                name="tcom_idregistro"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.tcom_idregistroArray}
                            >
                                {listTablaComisional}
                            </Form.Control>
                        </Form.Group>

                    </Col>
                    <Col xs={3}>
                        <Form.Group >
                            <Form.Label>Tabla de Metas <span className="obligatorio">*</span></Form.Label>
                            <Form.Control
                                as="select" multiple
                                className="mr-sm-2"
                                id="mges_idregistro"
                                name="mges_idregistro"
                                custom
                                onChange={this.handleChange}
                                value={formEdicion.mges_idregistroArray}
                            >
                                {listMetaGestion}
                            </Form.Control>
                        </Form.Group>

                    </Col>
                </Row>
            </Fragment>
        );
    }
}
FormEjecutivo.propTypes = {
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
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormEjecutivo);
export { VistaRedux as RVistaFormEjecutivo };