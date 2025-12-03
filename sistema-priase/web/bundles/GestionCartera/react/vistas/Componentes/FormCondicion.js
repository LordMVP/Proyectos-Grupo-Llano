import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION } from '../../store/actions/TiposAcciones';
import validaFormulario from '../Utils/ValidacionHelper';
import VariableGlobalServicio from '../../store/servicios/VariablesGlobalesServicios';
import parse, {
    convertNodeToElement,
    processNodes
  } from 'html-react-parser';
/**
 *componente sección de condiciones
 */
class FormCondicion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicion: this.props.gestionCarteraState.formEdicion,
            tipoInput: ""
        }

    }
    adicionarCondicion = () => {
        const validacion = validaFormulario.validaFormCondiciones(this.state.formCondicion);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {

            if(this.state.tipoInput === 3571){
                const isValid = /^(\d+\.{1}\d{2})$/;
               
                let cantidad =this.state.formCondicion.valor;
                if (!isValid.test(cantidad)) {
                    this.props.appState.alerta = { "titulo": "Información", "texto": "Formato no válido, solo números decimales" }
                    this.props.mostrarAlerta();
                    return false;
                } else {
                    console.log('Validación superada: ', cantidad);
                }
            }

            if(this.state.tipoInput === 3568){
                const isValid = /^(\d+)$/;
               
                let cantidad =this.state.formCondicion.valor;
                if (!isValid.test(cantidad)) {
                    this.props.appState.alerta = { "titulo": "Información", "texto": "Formato no válido, solo números enteros" }
                    this.props.mostrarAlerta();
                    return false;
                } else {
                    console.log('Validación superada: ', cantidad);
                }
            }
            
           
            var valor="";
            if(this.state.tipoInput === 3569 || this.state.tipoInput === 3570){
                if(this.state.formCondicion.valor!=undefined)
                    valor = "'"+this.state.formCondicion.valor+"'";
            }else{
                valor = this.state.formCondicion.valor;
            }

            var newCondicion = this.props.gestionCarteraState.condicion + " " +
            (this.state.formCondicion.inicio!=undefined?this.state.formCondicion.inicio:"") + " " +
            (this.state.formCondicion.vglo_variable!=undefined?this.state.formCondicion.vglo_variable:"") + " " +
            this.cambiarCondicional(this.state.formCondicion.uni_unidadcondicion) + " " +
            (valor) + " " +
            (this.state.formCondicion.fin!=undefined?this.state.formCondicion.fin:"") + " " +
            (this.state.formCondicion.operador!=undefined?this.state.formCondicion.operador:""); 
            this.props.setFormCondicion(newCondicion)
        }
    }

    cambiarCondicional = (condicion) =>{
        var simbolo = "";
        if (condicion == "CONDMAYOR") simbolo = ">";
        if (condicion == "CONDMAYOIGU") simbolo = ">=";
        if (condicion == "CONDMENOR") simbolo = "<";
        if (condicion == "CONDMENOIGU") simbolo = "<=";
        if (condicion == "CONDDISTIN") simbolo = "!=";
        if (condicion == "CONDIGUAL") simbolo = "=";

        return simbolo;
    }

    handleChange = async (event) => {
        const controlN = event.target.name;
        
        if(controlN == "vglo_variable"){
            VariableGlobalServicio.BuscarVariable(event.target.value).then((reponseDato) => {
                
                if (reponseDato.data.codigoRespuesta == 200) {
                    this.props.setHtml(reponseDato.data.data.html);
                    this.setState({
                        tipoInput: reponseDato.data.data.uni_tipodato
                    });
                }
            });  
        }
        await this.setState({
            formCondicion: {
                ...this.state.formCondicion,
                [event.target.name]: event.target.value,
            }
        });
    }

    render() {
        const { listaVariablesGlobales, listaCondicionales } = this.props.gestionCarteraState
        const listVariablesGlobales = listaVariablesGlobales.map(item =>
            <option key={item.vglo_idregistro} value={item.vglo_descripcion}>{item.vglo_descripcion}</option>
        );
        const listCondicionales = listaCondicionales.map(item =>
            <option key={item.uni_ideregistro} value={item.unicodigo1}>{item.uninombre}</option>
        );
        const { htmlInput } = this.props.gestionCarteraState;
       
        var htmlString1;
      
        if(htmlInput===null) htmlString1='<br/>';
        else htmlString1=htmlInput;
        return (
            <div>
                <Fragment>
                    <Row className="col-12">
                        <Col xs={1}>
                            <Form.Group >
                                <Form.Label className="blancoLabel">abre</Form.Label>
                                <Form.Control as="select" name="inicio" value={this.state.inicio} custom onChange={this.handleChange}>
                                    <option value=" "> </option>
                                    <option value="(">(</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Group >
                                <Form.Label>Variable a Evaluar </Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="vglo_id"
                                    name="vglo_variable"
                                    custom
                                    value={this.state.vglo_variable} 
                                    onChange={this.handleChange}
                                    defaultValue={"Seleccione Variable Global"}
                                >
                                    {listVariablesGlobales}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Label>Condicional </Form.Label>
                            <Form.Control
                                as="select"
                                className="mr-sm-2"
                                id="Uni_unidadid"
                                name="uni_unidadcondicion"
                                custom
                                value={this.state.uni_unidadcondicion} 
                                onChange={this.handleChange}
                                defaultValue={"Seleccione Concepto"}
                            >
                                {listCondicionales}
                            </Form.Control>
                        </Col>
                        <Col xs={2}>
                            <Form.Group >
                                <Form.Label>Valor </Form.Label>
                                {parse(htmlString1, {
                                    replace: domNode => {
                                        
                                        console.dir(domNode, { depth: null });
                                        console.log('verificacioninput');
                                    
                                        if (domNode.attribs && domNode.attribs.type === 'text') {
                                            console.log('entra al if text');
                                            // console.log(domNode.attribs);
                                            return (
                                                <Form.Control className={domNode.attribs.class} type={domNode.attribs.type} name={domNode.attribs.name}  placeholder={domNode.attribs.name}  onChange={this.handleChange} />)
                                            
                                        }
                                        if (domNode.attribs && domNode.attribs.type === 'date') {
                                            console.log('entra al if date');
                                            // console.log(domNode.attribs);
                                            return (
                                            <Form.Control className={domNode.attribs.class} type={domNode.attribs.type} name={domNode.attribs.name}   onChange={this.handleChange}/>)
                                        
                                        }

                                        if (domNode.attribs && domNode.attribs.type === 'entero') {
                                            console.log('entra al if number');
                                            // console.log(domNode.attribs);
                                            return (
                                            <Form.Control className={domNode.attribs.class} type="number" name={domNode.attribs.name} min="0" placeholder="entero" onChange={this.handleChange}/>)
                                        
                                        }

                                        if (domNode.attribs && domNode.attribs.type === 'decimal') {
                                            console.log('entra al if number');
                                            // console.log(domNode.attribs);
                                            return (
                                            <Form.Control className={domNode.attribs.class} type="number" name={domNode.attribs.name} min="0" placeholder="decimal" onChange={this.handleChange}/>)
                                        
                                        }

                                        if (domNode.attribs && domNode.attribs.type === 'select') {
                                            console.log('entra al if select');
                                        // console.log(domNode.attribs);
                                            return (
                                                <Form.Control as="select" name={domNode.attribs.name}  custom onChange={this.handleChange}>
                                                <option value="-1"></option>
                                                <option value="true">SI</option>
                                                <option value="false">NO</option>
                                            </Form.Control>
                                           )
                                        
                                        }
                                        
                                    }
                                    })}

                               
                            </Form.Group>
                        </Col>
                        <Col xs={1}>
                            <Form.Group >
                                <Form.Label className="blancoLabel" >cierra</Form.Label>
                                <Form.Control as="select" name="fin" custom value={this.state.fin} custom onChange={this.handleChange}>
                                    <option></option>
                                    <option>)</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Group >
                                <Form.Label>Operador Lógico </Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="operador"
                                    name="operador"
                                    custom
                                    value={this.state.operador} 
                                    onChange={this.handleChange}
                                    defaultValue={-1}
                                >
                                    <option></option>
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                    <option value=" ">TERMINA</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Label className="blancoLabel">botón  </Form.Label>
                            <Button variant="primary" onClick={this.adicionarCondicion}>Adicionar Condición</Button>{' '}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Form.Group >
                                <Form.Label></Form.Label>
                                <Form.Control as="textarea" rows={3} name="condicion" readOnly value={this.props.gestionCarteraState.condicion || ""} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Fragment>
            </div>
        );
    }
}
FormCondicion.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});
const mapDispatchToProps = dispatch => ({
    setFormCondicion(value) {

        dispatch({
            type: ACCION.SET_FORM_CONDICION,
            payload: value
        })

    },
    mostrarAlerta() {
        dispatch({
            type: ACCION.MOSTRAR_ALERTA,
            payload: {}
        })
    },
    setHtml(item) {
        dispatch({
            type: ACCION.SET_HTML_CONDICION,
            payload: item
        })
    },

});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormCondicion);
export { VistaRedux as RVistaFormCondicion };