
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import reactDom from 'react-dom/server';
import { render } from "react-dom";
import parse, {
    convertNodeToElement,
    processNodes
  } from 'html-react-parser';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import GestionVisitaServicio from '../../store/servicios/GestionVisitaServicios';
import { parsearJSON } from '../../global/util_nominaciones';
/**
 *Formulario recursos complementarios componente para registrar gestión visita desde maestro de gestión
 */
class FormRecursosComplementariosGV extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionGVRecursos: this.props.gestionCarteraState.formEdicionGVRecursos,
            selectedFile: null,
            requeridos: null
        }
        //this.transform=this.transform.bind(this)
    }
    
    componentDidUpdate(prevProps) { 
        // Uso tipico (no olvides de comparar las props): 
        if (this.props.gestionCarteraState.formEdicionGVRecursos !== prevProps.gestionCarteraState.formEdicionGVRecursos) { 
            this.setState({
                formEdicionGVRecursos:this.props.gestionCarteraState.formEdicionGVRecursos
            });
        } 
    }

    handleChange = async (event) => {
        
        await this.setState({
            formEdicionGVRecursos: {
                ...this.state.formEdicionGVRecursos,
                [event.target.name]: event.target.value,
            }
        });

       
        
        this.props.selecionarItem(this.state.formEdicionGVRecursos)
    }

    handleFileChange = async (event) => {
        
        const { formEdicionGVisita } = this.props.gestionCarteraState
      
        const validacion = validaFormulario.validaFormGestionVisita(formEdicionGVisita);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            event.target.value = null;
            this.props.mostrarAlerta();
            return false;
        } else {
            console.log(event.target.files[0]);
            
            this.setState({ selectedFile: event.target.files[0] });
            const formData = new FormData();
            console.log(this.state.selectedFile);
            // Update the formData object
            formData.append(
                "archivo",
                event.target.files[0]
        
            );
            // Details of the uploaded file
            console.log(this.state.selectedFile);
            //axios.post("api/uploadfile", formData);
            GestionVisitaServicio.guardarDatosArchivo(formEdicionGVisita, formData).then((reponseDatoMG) => {
                
                    if (reponseDatoMG.data.codigoRespuesta == 200) {
                        
                        this.props.setIdRegistroGVItem(reponseDatoMG.data.data.gvis_idregistro);
                    }
                
            });
        }
        
       
    }
    
   
    render() {
         ///const htmlString = '<label class="form-label"> Prueba 2 </label> <input class="obligatorio" type="text"  name="text0" id="prueba" data-label="labelprueba"/> <br/><label class="form-label"> Prueba 2 </label> <input class="obligatorio" type="text"  name="text1" id="prueba2" data-label="labelprueba"/><br/><label class="form-label"> Prueba file </label> <input  type="file"  name="file0" id="arch"/> <br/><label class="form-label"> Prueba fecha </label> <input class="form-control" type="date"  name="date0" id="date1"/> '
         const { htmlString } = this.props.gestionCarteraState
         var htmlString1;
         if(htmlString===null) htmlString1='<br/>';
         else htmlString1=htmlString;
         
        return (
            <div>
                <Fragment>
                    <h1>Recursos Complementarios</h1>
                    <div className="customHr">.</div>
                    <br />
                    
                    {parse(htmlString1, {
                    replace: domNode => {
                        console.dir(domNode, { depth: null });
                        console.log('verificacion');
                     
                        if (domNode.attribs && domNode.attribs.type === 'text') {
                            console.log('entra al if');
                          
                           // console.log(domNode.attribs);
                            return (
                            <Form.Control className={domNode.attribs.class} type={domNode.attribs.type} name={domNode.attribs.name} id={domNode.attribs.id} placeholder={domNode.attribs.name}  onChange={this.handleChange} />)
                           
                        }
                        if (domNode.attribs && domNode.attribs.type === 'date') {
                            console.log('entra al if date');
                           // console.log(domNode.attribs);
                          
                            return (
                            <Form.Control className={domNode.attribs.class} type={domNode.attribs.type} name={domNode.attribs.name} id={domNode.attribs.id}  onChange={this.handleChange}/>)
                           
                        }

                        if (domNode.attribs && domNode.attribs.type === 'file') {
                            console.log('entra al if file');
                           // console.log(domNode.attribs);
                            return (
                            <Form.File className={domNode.attribs.class} type={domNode.attribs.type} name={domNode.attribs.name} id={domNode.attribs.id}  onChange={this.handleFileChange} />)
                           
                        }
                        
                    }
                    })}
             
                    
                    <br/>
                </Fragment>
            </div>
        );
    }
}
FormRecursosComplementariosGV.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_GVR,
            payload: item
        })
    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
    listarItem(dataMaestroGestion) {
        dispatch({
          type: ACCION.LISTAR_ITEMMG,
          payload: {"maestroGestion": dataMaestroGestion }
        })
    
      },
    setIdRegistroGVItem(item) {
        dispatch({
            type: ACCION.SET_IDREGISTROGV,
            payload: item
        })
    },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormRecursosComplementariosGV);
export { VistaRedux as RVistaFormRecursosComplementariosGV };