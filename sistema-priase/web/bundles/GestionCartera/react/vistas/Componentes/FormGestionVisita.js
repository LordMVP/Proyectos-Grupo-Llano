
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import { RVistaFormRecursosComplementariosGV, RVistaListGestionVisita,RVistaFormConsultaGestionVisita} from '../index';
import validaFormulario from '../Utils/ValidacionHelper';
import GestionVisitaServicio from '../../store/servicios/GestionVisitaServicios';
import moment from 'moment';
/**
 *Formulario Gestión Visita componente para Maestro Gestión registrar gestión
 */
class FormGestionVisita extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionGVisita: this.props.gestionCarteraState.formEdicionGVisita,
            listText:[],
            showComponentes:true,
            showFormRecursos:false
           
        }
        
    }
    
    handleChange = async (event) => {
        const controlN = event.target.name;
        if(controlN == "nvis_idregistro"){
            GestionVisitaServicio.BuscarRecurso(event.target.value).then((reponseDato) => {
            
                if (reponseDato.data.codigoRespuesta == 200) {
                    this.props.setHtml(reponseDato.data.data);
                    this.setState({
                        showFormRecursos:true
                    });
                    
                }
            });  
        }
        await this.setState({
            formEdicionGVisita: {
                ...this.state.formEdicionGVisita,
                [event.target.name]: event.target.value,
            }
        });
       

       
        this.props.selecionarItem(this.state.formEdicionGVisita)
    }

    //funcion para validar los recursos de acuerdo a la clase.
    validate(){
        
        //var validation = document.getElementById(formRecursos).querySelector(".requerido");
        var validation = document.getElementsByClassName("requerido");
        var flag = false;
        for(var j = 0 ; j<validation.length; j++ ){ 
            
            
            if(validation[j].className === "requerido form-file"){
                console.log(validation[0].children[0].files.length);
                //val = validation[0].children[0].files.length;
                if(validation[0].children[0].files.length===0){
                    validation[j].style.backgroundColor = '#FF0000'; 
                    flag = true;
                }else{
                    validation[j].style.backgroundColor = '#FFFFFF'; 
                }
            }
            
            if(validation[j].className === "requerido form-control"){
                if(validation[j].value === "" || validation[j].value === "none"){
                    validation[j].style.backgroundColor = '#FF0000'; 
                    flag = true;
                }  else{
                    validation[j].style.backgroundColor = '#FFFFFF'; 
                } 
            }
        }
        return flag;
    
       //return false;
    }

    guardarItem = async() => {
        
        const { formEdicionGVisita, formEdicionGVRecursos } = this.props.gestionCarteraState
        await this.setState({ 
            listText: [] 
        });
        const validacion = validaFormulario.validaFormGestionVisita(formEdicionGVisita);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
                const validacionRecursos= this.validate();

                if(validacionRecursos){
                    this.props.appState.alerta = { "titulo": "Datos incompletos", "texto": "Hay campos de los recursos que son obligatorios, por favor diligenciarlos." }
                    this.props.mostrarAlerta();
                    return false;
                }
                else{
                     //formEdicionGVisita
                const object = formEdicionGVRecursos; 
                
                var i=0;  
                var j=0;  
               
                for (const property in object) {   
                    console.log(`${property}: ${object[property]}`); 
                    i=parseInt(`${property}`.slice(-1));
                    if(`${property}`==='text'+i){
                       // listText `${object[property]}`
                        
                       //this.setState({ listText: this.state.listText.concat(`${object[property]}`) })
                        await this.setState({ 
                            listText: [...this.state.listText,`${object[property]}`] 
                       });
                     
                       
                    }
                    if(`${property}`==='date'+i){
                        await this.setState({ 
                            listText: [...this.state.listText,`${object[property]}`] 
                       });
                       //j++;
                    }
                    i++;
                }
                
                GestionVisitaServicio.guardarDatos(formEdicionGVisita, this.state.listText).then((reponseDatoMG) => {
                   
                        this.props.setLimpiarFormRecursosGV();
                        if (reponseDatoMG.data.codigoRespuesta == 200) {
                            
                            this.props.setIdRegistroGVItem(reponseDatoMG.data.data.gvis_idregistro);
                        }
                });
            }//fin else validacion formulario recursos
               
            
       }//fin else validacion formulario
    }
    componentDidUpdate(prevProps) { 
        // Uso tipico (no olvides de comparar las props): 
        if (this.props.gestionCarteraState.formEdicionGVisita !== prevProps.gestionCarteraState.formEdicionGVisita) { 
            this.setState({
                formEdicionGVisita:this.props.gestionCarteraState.formEdicionGVisita
            });
        } 
    }
    VolverForm = () => {
        const { formEdicionGVisita } = this.props.gestionCarteraState;
        
        if(formEdicionGVisita.gvis_idregistro!=undefined){
            if(formEdicionGVisita.gvis_idregistro!= "" && formEdicionGVisita.gvis_idregistro!= " "){
                GestionVisitaServicio.eliminarRegistros(formEdicionGVisita.gvis_idregistro).then((reponseDatoMG) => {
                    if (reponseDatoMG.data.codigoRespuesta == 200) {
                        
                        this.props.setIdRegistroGVItem("");
                    }
                });
            }
            
        }
       
        this.props.setShowFormGestionVisita();
        this.props.setShowFormFiltros();
        this.setState({
            showFormRecursos:false
        });
    }

    ConsultarLista = () => {
        
        const { formEdicionGVisita } = this.props.gestionCarteraState;
        
        if(formEdicionGVisita.gvis_idregistro!=undefined){
            if(formEdicionGVisita.gvis_idregistro!= "" && formEdicionGVisita.gvis_idregistro!= " "){
                GestionVisitaServicio.eliminarRegistros(formEdicionGVisita.gvis_idregistro).then((reponseDatoMG) => {
                    if (reponseDatoMG.data.codigoRespuesta == 200) {
                        
                        this.props.setIdRegistroGVItem("");
                    }
                });
            }
            
        }
        GestionVisitaServicio.listarGestionVistasbyMaestro(formEdicionGVisita.mgef_ideregistro).then((reponseDatoGV) => {
            if (reponseDatoGV.data.codigoRespuesta == 200) {
                this.props.listarItem(reponseDatoGV.data.data);
                
            }
        });
        this.props.setShowFormGNVisita();
        this.props.setShowListaGestionVisita();
        this.setState({
            showFormRecursos:false
        });
        this.props.setLimpiarIdRegistroGV();

        document.getElementById("nvis_idregistro").value="-2";
        
    }
    
    render() {
        const { listaNovedadVisita, showListaGVisita, showFormConsultaGVista, showFormGVista, diasHolguraGestionVisita, showButtonsAsinacionMG, showButtonGuardarR} = this.props.gestionCarteraState
        const listNovedadVisita = listaNovedadVisita.map(item =>
            <option key={item.nvis_idregistro} value={item.nvis_idregistro}>{item.nvis_nombre}</option>
        )
        return (
            
                <Fragment>
                    {showFormGVista &&(
                    <div>
                        <h1>Registro Gestión Visita</h1>
                        <div className="customHr">.</div>
                        <br />
                        <Form  >
                        <Row>
                        <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>Fecha Actual </Form.Label>
                                    <Form.Control type="text" name="fec_actual" readOnly value={moment().format("DD/MM/YYYY hh:mm:ss")} />
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group >
                                    <Form.Label>Novedad Visita <span className="obligatorio">*</span></Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="mr-sm-2"
                                        id="nvis_idregistro"
                                        name="nvis_idregistro"
                                        custom
                                        onChange={this.handleChange}
                                        defaultValue={-2}
                                       
                                    >
                                        <option value="-2">Seleccione Novedad</option>
                                        {listNovedadVisita}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="6">
                                <Form.Label >Fecha Visita <span className="obligatorio">*</span></Form.Label>
                                <Form.Control type="date" placeholder="Fecha Visita" name="gvis_fechavisita" min={moment().subtract(diasHolguraGestionVisita, 'days').format("YYYY-MM-DD")} max={moment().format("YYYY-MM-DD")} onChange={this.handleChange} />
                            </Col>
                            <Col sm="6">
                                <Form.Label>Acta No.</Form.Label>
                                <Form.Control type="text" placeholder="Acta No." name="gvis_numeroradicado" onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <Form.Label >Observación <span className="obligatorio">*</span></Form.Label>
                                <Form.Control as="textarea" rows={2} name="gvis_observacion" placeholder="Observación" onChange={this.handleChange}  />
                            </Col>
                        </Row>
                        <Row><br/></Row>
                        {this.state.showFormRecursos &&(<RVistaFormRecursosComplementariosGV/>
                        )}
                        <Row><br/></Row>
                        <Row>
                            
                            <Col xs={1}>
                                <Form.Group >
                                    {showButtonGuardarR && showButtonsAsinacionMG &&(<div><Button  variant="primary" onClick={this.guardarItem} >Guardar</Button>{' '}
                                    </div>)}
                                </Form.Group>
                            </Col>
                            <Col xs={1}>
                                <Form.Group >
                                <div><Button  variant="primary" onClick={this.ConsultarLista} >Consultar</Button>{' '}</div>
                                    
                                </Form.Group>
                            </Col>
                            <Col xs={1}>
                                <Form.Group >
                                <div className="btn-recursos-esp "><Button  variant="primary" onClick={this.VolverForm} >Volver</Button>{' '}</div>
                                    
                                </Form.Group>
                            </Col>
                        
                        </Row>
                        </Form>
                    </div>)}
                    { showFormConsultaGVista &&(<RVistaFormConsultaGestionVisita/>)}
                    { showListaGVisita && (<RVistaListGestionVisita/>)}
                </Fragment>
        
        );
    }
}
FormGestionVisita.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_GV,
            payload: item
        })
    },
    listarItem(dataGestionVisitas) {
        dispatch({
            type: ACCION.LISTAR_GESTION_VISITA,
            payload: {"gestionvisitas": dataGestionVisitas }
        })

    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
    setShowFormGestionVisita() {
        dispatch({
            type: ACCION.SET_SHOW_GESTIONVISITA
        })
    },
    setShowFormFiltros() {
        dispatch({
            type: ACCION.SET_SHOW_MAESTROGESTION
        })
    },
    setShowListaGestionVisita() {
        dispatch({
            type: ACCION.SET_SHOW_LISTAGNVISITA
        })
    },
    setShowFormConsultaGestionVisita() {
        dispatch({
            type: ACCION.SET_SHOW_FORMCONSULTAGNVISITA
        })
    },
    setShowFormGNVisita() {
        dispatch({
            type: ACCION.SET_SHOW_FORMGNVISITA
        })
    },
    setHtml(item) {
        dispatch({
            type: ACCION.SET_HTML_RECURSOS,
            payload: item
        })
    },
    setLimpiarFormRecursosGV() {
        dispatch({
            type: ACCION.LIMPIAR_FORM_RECURSOGV
        })
    },
    setIdRegistroGVItem(item) {
        dispatch({
            type: ACCION.SET_IDREGISTROGV,
            payload: item
        })
    },
    setLimpiarIdRegistroGV() {
        dispatch({
            type: ACCION.SET_LIMPIAR_IDREGISTROGV
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormGestionVisita);
export { VistaRedux as RVistaFormGestionVisita };