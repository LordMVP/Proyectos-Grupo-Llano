
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import cumplimientoMetasServicio from '../../store/servicios/CumplimientoMetasServicios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
/**
 *Vista footer del componente para iniciar proceso para liquidar comisiones
 */
class FormConsultaCumplimientoMetas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionCCM: this.props.gestionCarteraState.formEdicionCCM,
            flag:0
        }
        
    }
    
    handleChange = async (event) => {
        console.log(event.target.attributes)
        
        const controlN = event.target.name;
          if (event.target.type == 'select-multiple') {
              let value = Array.from(event.target.selectedOptions, option => option.value); 
              if(controlN == "id_meta"){
                  await this.setState({
                      formEdicionCM: {
                          ...this.state.formEdicionCM,
                          metas: value
                      }
                  });
              }
  
              if(controlN == "eje_ejecutivos")
              {
                  if(event.target.value === "all")
                  {
                      let flagb=0;
                      let opciones = event.target.options;
                      //if(opciones[opciones.length].selected === true) flag=1;
                      for (let i = 0; i < opciones.length; i++) {
                          if(this.state.flag==0){
                              flagb=1;
                              opciones[i].selected = true;
                          } else{
                              flagb=0;
                              opciones[i].selected = false;
                          }
                          
                      
                      } 
                      /*for (let i = 0; i < opciones.length; i++) {
                          
                          opciones[i].selected = true
                      }  */
                      value = Array.from(event.target.selectedOptions, option => option.value); 
                      await this.setState({
                          formEdicionCM: {
                              ...this.state.formEdicionCM,
                              ejecutivos: value
                          },
                          flag: flagb
                      }); 
                  }else{
                      await this.setState({
                          formEdicionCM: {
                              ...this.state.formEdicionCM,
                              ejecutivos: value
                          }
                      }); 
                  }
              }
              this.props.selecionarItem(this.state.formEdicionCM)
          }else{
              await this.setState({
                  formEdicionCM: {
                      ...this.state.formEdicionCM,
                      [event.target.name]: event.target.value,
                  }
              });
          }
          
          this.props.selecionarItem(this.state.formEdicionCM)
      }

    
      consultar = () => {
        
        const { formEdicionCCM } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaFormConsultaMH(formEdicionCCM);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            cumplimientoMetasServicio.ConsultaHistoricos(formEdicionCCM,1,0).then((responseDato) => { 
                var data = [];
                if (responseDato.data.codigoRespuesta == 200)
                {
                    this.props.listarItem(responseDato.data.data);
                }
            });
            
        }//fin else validacion formulario
    }
    
   
      
    render() {
        const {listaEjecutivosMH, listaPeriodoMHDesde, listaPeriodoMHHasta, listaMetasHistorico } = this.props.gestionCarteraState
        
        const listEjecutivosMH = listaEjecutivosMH.map(item =>
            <option key={item.idejecutivo} value={item.idejecutivo}>{item.nombreejecutivo}</option>
        )
        const listPeriodoMHDesde = listaPeriodoMHDesde.map(item =>
            <option key={item.per_ideregistro} value={item.per_ideregistro}>{item.per_nombre}</option>
        )
        const listPeriodoMHHasta = listaPeriodoMHHasta.map(item =>
            <option key={item.per_ideregistro} value={item.per_ideregistro}>{item.per_nombre}</option>
        )
        const listMetasHistorico = listaMetasHistorico.map(item =>
            <option key={item.mege_descripcion} value={item.mege_idregistro}>{item.mege_descripcion}</option>
        )
        return (
            <div>
                <Fragment>
                    <Row>
                       <Col xs={6}>
                            <Form.Group >
                                <Form.Label>Meta Gestión<span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="id_meta"
                                    name="id_meta"
                                    multiple
                                    custom
                                    onChange={this.handleChange}
                                    value={this.state.formEdicionCCM.mliq_ciclo}
                                >
                                   {listMetasHistorico}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        
                        <Col xs={6}>
                            <Form.Group >
                                <Form.Label>Ejecutivo <span className="obligatorio"></span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="eje_ejecutivos"
                                    name="eje_ejecutivos"
                                    multiple
                                    custom
                                    onChange={this.handleChange}
                                    value={this.state.formEdicionCCM.eje_ejecutivos}
                                >   
                                    {listEjecutivosMH}
                                    <option value="all">TODOS</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                       
                    </Row>
                    <Row>
                       <Col xs={6}>
                            <Form.Group >
                                <Form.Label>Periodo Desde<span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="per_desde"
                                    name="per_desde"
                                    custom
                                    onChange={this.handleChange}
                                    value={this.state.formEdicionCCM.per_desde}
                                >
                                    {listPeriodoMHDesde}
                                    <option value="-1">Seleccione</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        
                        <Col xs={6}>
                            <Form.Group >
                                <Form.Label>Periodo Hasta <span className="obligatorio">*</span></Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="per_hasta"
                                    name="per_hasta"
                                    custom
                                    onChange={this.handleChange}
                                    value={this.state.formEdicionCCM.per_hasta}
                                >   
                                    {listPeriodoMHHasta}
                                    <option value="-1">Seleccione</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                       
                    </Row>
                    <Row >
                        <Col xs={1} >
                            <Button variant="primary" onClick={() => this.consultar()} >Consultar</Button>{' '}
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}
FormConsultaCumplimientoMetas.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_CONSULTAMETA,
            payload: item
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
    listarItem(dataGestion) {
        dispatch({
          type: ACCION.LISTAR_CONSULTAMETA,
          payload: { "meta": dataGestion }
        })
    
      },
  
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormConsultaCumplimientoMetas);
export { VistaRedux as RVistaFormConsultaCumplimientoMetas };