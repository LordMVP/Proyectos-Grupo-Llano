
import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Accordion, Card} from 'react-bootstrap';
import Select from 'react-select-me';
import { ACCION } from '../../store/actions/TiposAcciones';
import 'react-select-me/lib/ReactSelectMe.css';
import validaFormulario from '../Utils/ValidacionHelper';
import maestroGestionServicio from '../../store/servicios/MaestroGestionServicios';

/**
 *Vista Principal del componente de edición 
 */
class FormInformacionBasicaMaestroGestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionInfoBasicaMG: this.props.gestionCarteraState.formEdicionInfoBasicaMG,
            listaCiudad: [],
            listaBarrio: [],
            listBarrios: [],
        }
    }
    componentDidUpdate(prevProps) { 
        // Uso tipico (no olvides de comparar las props): 
        if (this.props.gestionCarteraState.formEdicionInfoBasicaMG !== prevProps.gestionCarteraState.formEdicionInfoBasicaMG) { 
            this.setState({
                formEdicionInfoBasicaMG:this.props.gestionCarteraState.formEdicionInfoBasicaMG
            });
            if(this.props.gestionCarteraState.formEdicionInfoBasicaMG.departamentos!=undefined && this.props.gestionCarteraState.formEdicionInfoBasicaMG.departamentos.length>0){
                if (this.props.gestionCarteraState.formEdicionInfoBasicaMG.departamentos !== prevProps.gestionCarteraState.formEdicionInfoBasicaMG.departamentos) { 
                    this.obtenerListaCiudades(1);
                }
                
            }
               
            
        } 
    }
    onChange = async (value) => {
        await this.setState({  
            formEdicionInfoBasicaMG: {
            ...this.state.formEdicionInfoBasicaMG,
            barrios: value
            } 
        });
        this.props.selecionarItem(this.state.formEdicionInfoBasicaMG);
    }

    onSearch = async (searchString) => {
        //const {listaBarrio} = this.props.gestionCarteraState.formEdicionInfoBasicaMG;
        await this.setState({
            listBarrios: this.state.listaBarrio.filter(o => o.label.indexOf(searchString.toUpperCase()) > -1)
        });
      }
    handleChange = async (event) => {
        if (event.target.type == 'select-multiple') {
            let value = Array.from(event.target.selectedOptions, option => option.value);
            const controlN = event.target.name;
            if(controlN == "tip_tipousos"){
                await this.setState({
                    formEdicionInfoBasicaMG: {
                        ...this.state.formEdicionInfoBasicaMG,
                        tipousos: value
                    }
                });
            }
            if(controlN == "hom_homologaciones"){
                await this.setState({
                    formEdicionInfoBasicaMG: {
                        ...this.state.formEdicionInfoBasicaMG,
                        homologaciones: value
                    }
                });
            }
            if(controlN == "est_estratos"){
                await this.setState({
                    formEdicionInfoBasicaMG: {
                        ...this.state.formEdicionInfoBasicaMG,
                        estratos: value
                    }
                });
            }
            if(controlN == "ests_estadossuscripciones"){
                await this.setState({
                    formEdicionInfoBasicaMG: {
                        ...this.state.formEdicionInfoBasicaMG,
                        estadosuscripciones: value
                    }
                });
            }
            if(controlN == "estm_estadomaestros"){
                await this.setState({
                    formEdicionInfoBasicaMG: {
                        ...this.state.formEdicionInfoBasicaMG,
                        estadomaestros: value
                    }
                });
            }
            if(controlN == "ubi_ubicaciones"){
                await this.setState({
                    formEdicionInfoBasicaMG: {
                        ...this.state.formEdicionInfoBasicaMG,
                        ubicaciones: value
                    }
                });
            }
            
            if(controlN == "dep_departamentos"){
                await this.setState({
                    formEdicionInfoBasicaMG: {
                        ...this.state.formEdicionInfoBasicaMG,
                        departamentos: value
                    }
                });
                if (this.state.formEdicionInfoBasicaMG.departamentos!=undefined  && this.state.formEdicionInfoBasicaMG.departamentos.length > 0 ) {
                    this.obtenerListaCiudades(0);
                } 
            }
            if(controlN == "ciu_ciudades"){
                await this.setState({
                    formEdicionInfoBasicaMG: {
                        ...this.state.formEdicionInfoBasicaMG,
                        ciudades: value
                    }
                });
                if (this.state.formEdicionInfoBasicaMG.ciudades!=undefined  && this.state.formEdicionInfoBasicaMG.ciudades.length > 0 ) {
                    this.obtenerListaBarrios();
                }
            }
            if(controlN == "bar_barrios"){
                await this.setState({
                    formEdicionInfoBasicaMG: {
                        ...this.state.formEdicionInfoBasicaMG,
                        barrios: value
                    }
                });
            }
            if(controlN == "com_comunas"){
                await this.setState({
                    formEdicionInfoBasicaMG: {
                        ...this.state.formEdicionInfoBasicaMG,
                        comunas: value
                    }
                });
            }
            this.props.selecionarItem(this.state.formEdicionInfoBasicaMG);
            
            
            return;
        }
        await this.setState({
            formEdicionInfoBasicaMG: {
                ...this.state.formEdicionInfoBasicaMG,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicionInfoBasicaMG)
    }

    /**
     * Método encargado de obtener la lista de las ciudades filtrada por departamentos
     * parameter item 0 para información del estado local 1 para información del reducer.
     */
    obtenerListaCiudades = async (item) => {
        const { formEdicionInfoBasicaMG } = this.props.gestionCarteraState
        if(item===0) {
            maestroGestionServicio.listaCiudadesByDepartamento(this.state.formEdicionInfoBasicaMG).then((reponseDatoListaCiudad) => {
            
                if (reponseDatoListaCiudad.data.codigoRespuesta == 200) {
                    this.setState({
                        listaCiudad: reponseDatoListaCiudad.data.data
                    }); 
                }
            });  
        }else{
            maestroGestionServicio.listaCiudadesByDepartamento(formEdicionInfoBasicaMG).then((reponseDatoListaCiudad) => {
                
                if (reponseDatoListaCiudad.data.codigoRespuesta == 200) {
                    this.setState({
                        listaCiudad: reponseDatoListaCiudad.data.data
                    }); 
                }
            });
        }
    }
    /**
     * Método encargado de obtener la lista de las ciudades filtrada por departamentos
     */
    obtenerListaBarrios = async () => {
        maestroGestionServicio.listaBarriosByCiudades(this.state.formEdicionInfoBasicaMG).then((reponseDatoListaBarrio) => {
            if (reponseDatoListaBarrio.data.codigoRespuesta == 200) {
                this.setState({
                    listaBarrio: reponseDatoListaBarrio.data.data,
                    listBarrios: reponseDatoListaBarrio.data.data
                }); 
            }
        });
    }

    BuscarItem = () => {
        var condicion = "";
        const { formEdicionInfoBasicaMG } = this.props.gestionCarteraState
        const validacion = validaFormulario.validaBusquedaTerceroMG(formEdicionInfoBasicaMG);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            /*and dd.dsus_ideregistr = 496077 and dd.dsus_pcodigo  ='050534115502'
                and tt.ter_documento = '800185295'*/
            if (formEdicionInfoBasicaMG.dsus_ideregistr != "" && formEdicionInfoBasicaMG.dsus_ideregistr != undefined )  {
                condicion = condicion + " and dd.dsus_ideregistr = " + formEdicionInfoBasicaMG.dsus_ideregistr;
            }
            if (formEdicionInfoBasicaMG.dsus_pcodigo != "" && formEdicionInfoBasicaMG.dsus_pcodigo != undefined)  {
                condicion = condicion + " and dd.dsus_pcodigo  = '" + formEdicionInfoBasicaMG.dsus_pcodigo + "'";
            }
            if (formEdicionInfoBasicaMG.ter_idregistro != "" && formEdicionInfoBasicaMG.ter_idregistro != undefined)  {
                condicion = condicion + " and tt.ter_documento = '" + formEdicionInfoBasicaMG.ter_idregistro + "'";
            }
            maestroGestionServicio.ejecutarBusquedaTercero(condicion).then((reponseDato) => {
                
                if (reponseDato.data.codigoRespuesta == 200) {
                    let obj;
                    obj={'mges_nombrecliente':reponseDato.data.data.listTercero[0].nomcompleto}
                    console.log(reponseDato.data.data.listTercero[0].nomcompleto)
                    this.setState({
                        formEdicionInfoBasicaMG:obj
                    }); 
                    
                }
            });
        }
       
    }

    render() {
        const { formEdicionInfoBasica, listaUnidadTipoUso,listaUnidadEstadoSuscripcion, listaUnidadTipoUbicacion, listaDepartamento, listaComunas, listaUnidadEstrato, listaUnidadClaseHomolagada } = this.props.gestionCarteraState
        const listUnidadTipoUso = listaUnidadTipoUso.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        const listUnidadEstadoSuscripcion = listaUnidadEstadoSuscripcion.map(item =>
            <option key={item.unicodigo1} value={item.unicodigo1}>{item.uninombre}</option>
        );
        const listUnidadTipoUbicacion = listaUnidadTipoUbicacion.map(item =>
            <option key={item.codigoAlternativo} value={item.codigoAlternativo}>{item.uninombre}</option>
        );
        const listDepartamento = listaDepartamento.map(item =>
            <option key={item.departamento_ideregistro} value={item.departamento_ideregistro}>{item.departamento_nom}</option>
        );
        const listComunas = listaComunas.map(item =>
            <option key={item.sec_ideregistro} value={item.sec_ideregistro}>{item.sec_nombre}</option>
        );
        const listUnidadClaseHomolagada = listaUnidadClaseHomolagada.map(item =>
            <option key={item.unicodigo1} value={item.unicodigo1}>{item.uninombre}</option>
        );
        const listUnidadEstrato = listaUnidadEstrato.map(item =>
            <option key={item.unicodigo1} value={item.unicodigo1}>{item.uninombre}</option>
        );
        const listCiudades = this.state.listaCiudad.map(item =>
            <option key={item.ciudad_cod} value={item.ciudad_cod}>{item.ciudad_nom}</option>
        )
        const listBarrios1 = this.state.listaBarrio.map(item =>
            <option key={item.value} value={item.value}>{item.label}</option>
        )
        
        return (
                
                <Card className="panel panel-default">
                <Accordion.Toggle className="panel-heading" as={Card.Header} eventKey="0" >
                    <h4 className="panel-title">
                        <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Información Básica
                            <span> </span>
                        </a>
                    </h4>
                </Accordion.Toggle>
                <Accordion.Collapse className="panel-collapse" eventKey="0">
                    <Card.Body>

                        <Row>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Id Suscripción  </Form.Label>
                                    <Form.Control type="text" name="dsus_ideregistr" placeholder="Id Suscripción" onChange={this.handleChange} value={this.state.formEdicionInfoBasicaMG.dsus_ideregistr || ""} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Código Cliente </Form.Label>
                                    <Form.Control type="text" name="dsus_pcodigo" placeholder="Código Cliente"  onChange={this.handleChange} value={this.state.formEdicionInfoBasicaMG.dsus_pcodigo || ""}/>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group >
                                    <Form.Label>Documento Cliente </Form.Label>
                                    <Form.Control type="text" name="ter_idregistro" placeholder="Documento Cliente" onChange={this.handleChange} value={this.state.formEdicionInfoBasicaMG.ter_idregistro || ""}/>
                                </Form.Group>
                            </Col>
                            <Col xs={1}>
                                <Form.Label className="blancoLabel">botón </Form.Label>
                                <Button variant="primary" onClick={this.BuscarItem} >Buscar</Button>{' '}
                            </Col>
                        </Row> 
                        <Row>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Nombres </Form.Label>
                                    <Form.Control type="text" name="mges_nombrecliente" placeholder="Nombres"  onChange={this.handleChange} value={this.state.formEdicionInfoBasicaMG.mges_nombrecliente || ""}/>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Fecha Homologación Desde </Form.Label>
                                    <Form.Control type="date" id="fechaHomDesde" name="mges_fechomdesde" onChange={this.handleChange} value={this.state.formEdicionInfoBasicaMG.mges_fechomdesde || ""}/>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Fecha Homologación Hasta </Form.Label>
                                    <Form.Control type="date" id="fechaHomHasta" name="mges_fechomhasta"  onChange={this.handleChange} value={this.state.formEdicionInfoBasicaMG.mges_fechomhasta || ""}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Tipo Uso </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="tip_tipousos"
                                        name="tip_tipousos"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoBasicaMG.tipousos || []}
                                    >
                                      {listUnidadTipoUso}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Homologación </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="hom_homologaciones"
                                        name="hom_homologaciones"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoBasicaMG.homologaciones || []}
                                    >
                                       {listUnidadClaseHomolagada} 
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Estrato  </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="est_estratos"
                                        name="est_estratos"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoBasicaMG.estratos || [] }
                                    >
                                       {listUnidadEstrato}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>      
                        <Row>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Estado Suscripción </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="ests_estadossuscripciones"
                                        name="ests_estadossuscripciones"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoBasicaMG.estadosuscripciones || []}
                                    >
                                        {listUnidadEstadoSuscripcion}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Estado Maestro </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="estm_estadomaestros"
                                        name="estm_estadomaestros"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoBasicaMG.estadomaestros || []}
                                    >
                                    <option value="A">A - Activo </option>
                                    <option value="G">G - Temporal sin confirmar</option>
                                    <option value="H">H - Histórico</option>   
                                    <option value="E">E - Eliminado</option>  
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Ubicación   </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="ubi_ubicaciones"
                                        name="ubi_ubicaciones"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoBasicaMG.ubicaciones || []}
                                    >
                                       {listUnidadTipoUbicacion}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row> 
                        
                        <Row>
                            <Col xs={4}>
                                <Form.Group >
                                    <Form.Label>Zona Alto Riesgo </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="mr-sm-2"
                                        id="estr_estadoaltoriesgo"
                                        name="estr_estadoaltoriesgo"
                                        custom
                                        defaultValue={-3}
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoBasicaMG.estr_estadoaltoriesgo}
                                    >
                                        <option value="-3">Seleccione Zona</option>
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={8}>
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control type="text" name="dire_direccion" placeholder="Dirección" onChange={this.handleChange} value={this.state.formEdicionInfoBasicaMG.dire_direccion || ""}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <Form.Group >
                                    <Form.Label>Departamento </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="dep_departamentos"
                                        name="dep_departamentos"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoBasicaMG.departamentos || []}
                                    >
                                      {listDepartamento}
                                    </Form.Control>
                                </Form.Group>
                            </Col>  
                            <Col xs={3}>
                                <Form.Group >
                                    <Form.Label>Municipio </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="ciu_ciudades"
                                        name="ciu_ciudades"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoBasicaMG.ciudades || []}
                                    >
                                        {listCiudades}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group >
                                    <Form.Label>Barrio </Form.Label>
                                    <Select
                                        multiple
                                        searchable
                                        placeholder="Seleccione o use buscador"
                                        options={this.state.listBarrios}
                                        value={this.state.formEdicionInfoBasicaMG.barrios || []}
                                        onSearch={this.onSearch}
                                        onChange={this.onChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group >
                                    <Form.Label>Sector Comuna </Form.Label>
                                    <Form.Control as="select" multiple
                                        className="mr-sm-2"
                                        id="com_comunas"
                                        name="com_comunas"
                                        custom
                                        onChange={this.handleChange}
                                        value={this.state.formEdicionInfoBasicaMG.comunas || []}
                                    >
                                       {listComunas}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row> 
                    </Card.Body>
                </Accordion.Collapse>
            </Card>


                    
               
        );
    }
}
FormInformacionBasicaMaestroGestion.propTypes = {
    history: PropTypes.object
};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});
const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_IBMG,
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
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormInformacionBasicaMaestroGestion);
export { VistaRedux as RVistaFormInformacionBasicaMaestroGestion };