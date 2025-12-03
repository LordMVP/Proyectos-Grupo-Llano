
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import deterioroNiff from '../../store/servicios/DeterioroNiffServicios'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


/**
 *Vista del componente para comparar DeterioroNIff
 */
class FormCompararDeterioro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionDN: this.props.gestionCarteraState.formEdicionDN,
        }
    }
    
    handleChange = async (event) => {
        if (event.target.type == 'select-multiple') {
            let value = Array.from(event.target.selectedOptions, option => option.value);
            const controlN = event.target.name;
            if(controlN == "tipo_deterioro"){
                await this.setState({
                    formEdicionDN: {
                        ...this.state.formEdicionDN,
                        tipo_deterioro: value
                    }
                });
            }
            this.props.selecionarItem(this.state.formEdicionDN);
            
            
            return;
        }
        await this.setState({
            formEdicionDN: {
                ...this.state.formEdicionDN,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicionDN)
    }

    compararDeterioro = () => {
        const { formEdicionDN } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaFormCompararDeterioro(formEdicionDN);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            
                 
            deterioroNiff.compararacionDeterioro(formEdicionDN).then((responseDatoIniciar) => { 
                
                if(responseDatoIniciar.data.codigoRespuesta===200){
                    this.props.setData(responseDatoIniciar.data.data.gestionFacturaNiffResumenDto);
                }
               
                if (responseDatoIniciar.data.codigoRespuesta === 400) {
                    //this.props.appState.alerta = { "titulo": "Información", "texto":  responseDatoIniciar.data.data}
                    //this.props.mostrarAlerta();
                    //this.props.setShowMsnLoader(false);
                    //alert(responseDatoIniciar.data.data);
                    confirmAlert({
                        title: 'Información',
                        message: responseDatoIniciar.data.data,
                        buttons: [
                            {
                              label: 'Cerrar',
                             // onClick: () => alert('Click No')
                            }
                          ]
                      });
                    setTimeout(function(){ window.location.reload();},5000);
                   
                 
                }
                
            });
          
        }//fin else validacion formulario
    }

    submitComparar = () => {
        confirmAlert({
          title: 'Confirmación',
          message: '¿Está seguro de realizar esta acción?',
          buttons: [
            {
              label: 'Aceptar',
              onClick: () => this.compararDeterioro()
            },
            {
              label: 'Cancelar',
             // onClick: () => alert('Click No')
            }
          ]
        });
      };

     

    render() {
        const {listaPeriodoDN } = this.props.gestionCarteraState
   
        const listPeriodoDN = listaPeriodoDN.map(item =>
            <option key={item.per_ideregistro} value={item.per_ideregistro}>{item.per_nombre}</option>
        );
        
        return (
            <div>
                <Fragment>
                
                    <Row>
                        <Col xs={3}>
                            <Form.Group >
                                <Form.Label>Ciclo Periodo Consultar A <span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="per_ideregistroA"
                                    name="per_ideregistroA"
                                    custom
                                    onChange={this.handleChange}
                                    defaultValue={-1}
                                   // value={this.state.formEdicionIG.per_ideregistro}
                                >
                                     <option value="-1">Seleccione Periodo A</option>
                                     {listPeriodoDN}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={3}>
                            <Form.Group >
                                <Form.Label>Ciclo Periodo Consultar B<span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="per_ideregistroB"
                                    name="per_ideregistroB"
                                    custom
                                    onChange={this.handleChange}
                                    defaultValue={-2}
                                   // value={this.state.formEdicionIG.per_ideregistro}
                                >
                                    <option value="-2">Seleccione Periodo B</option>
                                    {listPeriodoDN}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={3}>
                                <Form.Group >
                                    <Form.Label>Tipo Deterioro<span className="obligatorio">*</span> </Form.Label>
                                    <Form.Control
                                        as="select"
                                        multiple
                                        className="mr-sm-2 size-selectopc"
                                        id="tipo_deterioro"
                                        name="tipo_deterioro"
                                        custom
                                        onChange={this.handleChange}
                                       // value={this.state.formEdicionInfoBasicaMG.estr_estadoaltoriesgo}
                                    >
                                        <option value="1">Deterioro menor 360 </option>
                                        <option value="2">Deterioro 100%</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        <Col xs={3}>
                            <Form.Group >
                                 <Form.Label className="blancoLabel col-12"> </Form.Label>
                                <Button className="col-12" variant="primary" onClick={() => this.submitComparar()} >Consultar</Button>{' '}
                             </Form.Group>
                        </Col>
                    </Row>
                    
                </Fragment>
            </div>
        );
    }
}
FormCompararDeterioro.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_DN,
            payload: item
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
    setData(item) {
        dispatch({
            type: ACCION.SET_DATAREPORTES_DN,
            payload: item
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormCompararDeterioro);
export { VistaRedux as RVistaFormCompararDeterioro};