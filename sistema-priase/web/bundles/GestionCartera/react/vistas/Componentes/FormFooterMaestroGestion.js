
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import { RVistaListVistaIncialMG, RVistaListVistaConsolidadaClienteMG, 
    RVistaListVistaCompletaMG} from '../index';
import validaFormulario from '../Utils/ValidacionHelper';
import maestroGestionServicio from '../../store/servicios/MaestroGestionServicios';
/**
 *Vista footer del componente para maestro gestión 
 */
class FormFooterMaestroGestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formEdicionFooterMG: this.props.gestionCarteraState.formEdicionFooterMG,
            showVistas:false,
            showVistaInicial:false,
            showVistaCompleta:false,
            showVistaConsolidada:false,
        }
        
    }
    
    handleChange = async (event) => {
        await this.setState({
            formEdicionFooterMG: {
                ...this.state.formEdicionFooterMG,
                [event.target.name]: event.target.value,
            }
        });
        this.props.selecionarItem(this.state.formEdicionFooterMG)
    }

    ejecutarFiltro= () => {
        const {formEdicionMG, formEdicionFooterMG, showDetalleMG, showModalConceptoMG } = this.props.gestionCarteraState
        
        const validacion = validaFormulario.validaEjecutarFiltro(formEdicionMG, formEdicionFooterMG);
        if (!validacion.respuesta) {
            this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
            this.props.mostrarAlerta();
            return false;
        } else {
            
            
           maestroGestionServicio.ejecutarFiltro(formEdicionMG.mges_idregistro, formEdicionFooterMG.mges_vista).then((reponseDatoMG) => {
                if (reponseDatoMG.data.codigoRespuesta == 200) {
                    this.props.listarItem(reponseDatoMG.data.data);
                    this.props.setNuevosSeleccionadosItem([]);
                    if(formEdicionFooterMG.mges_vista==="1"){
                        this.setState({
                            showVistas:true,
                            showVistaInicial:true,
                            showVistaCompleta:false,
                            showVistaConsolidada:false
                          });
                    }
                    if(formEdicionFooterMG.mges_vista==="2"){
                        this.setState({
                            showVistas:true,
                            showVistaCompleta:true,
                            showVistaInicial:false,
                            showVistaConsolidada:false
                          });
                    }
                    if(formEdicionFooterMG.mges_vista==="3"){
                        this.setState({
                            showVistas:true,
                            showVistaConsolidada:true,
                            showVistaInicial:false,
                            showVistaCompleta:false
                          });
                        if(showDetalleMG)  this.props.setShowDetalle();//para la lista
                        if(showModalConceptoMG)  this.props.setDataDetalle();//para el modal
                    }
                    
                }
            });
            
            }//fin else validacion formulario
             
        }

        handleCartas = () => {
            
            const {formEdicionFooterMG, seleccionadosMG, listaUnidadTipoCarta, contarAsignadosMG, contarEstadoRegConfirmMG } = this.props.gestionCarteraState;

            const validacion = validaFormulario.validaGenerarCarta(formEdicionFooterMG,seleccionadosMG);
            if (!validacion.respuesta) {
                this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
                this.props.mostrarAlerta();
                return false;
            } else {
                var i=0;
                var contar=0;
                if (contarAsignadosMG.length>0)  {
                    for(i=0;i<contarAsignadosMG.length;i++)
                    {
                        if(contarAsignadosMG[i]===null){
                            contar++;
                        }
                    }
                }
                
                var contarConfirmados=0;
                if (contarEstadoRegConfirmMG.length>0)  {
                    for(i=0;i<contarEstadoRegConfirmMG.length;i++)
                    {
                        if(contarEstadoRegConfirmMG[i]!='A'){
                            contarConfirmados++;
                        }
                    }
                }
                if(contar>0){
                    this.props.appState.alerta = { "titulo": "Información", "texto": "Hay 1 o más registros sin ejecutivo asignado, por favor verifíquelos." }
                    this.props.mostrarAlerta();
                    return false;
                }else if(contarConfirmados>0){
                    this.props.appState.alerta = { "titulo": "Información", "texto": "Hay 1 o más registros donde el estado del maestro no es 'A' " }
                    this.props.mostrarAlerta();
                    return false;
                }else{
                   
                    maestroGestionServicio.generarCartas(seleccionadosMG,formEdicionFooterMG.mges_carta).then((reponseDatoMG) => {
                        
                        if (reponseDatoMG.status== 200) {
                            const type = reponseDatoMG.headers['content-type'];
                            const url = reponseDatoMG.headers['urlCarta']
                            const blob = new Blob([reponseDatoMG.data], { type: type, encoding: 'UTF-8' })
                            const link = document.createElement('a')
                            link.href = window.URL.createObjectURL(blob)
                            link.download = 'carta.xlsx'
                            link.click();

                            
                            let datanew = listaUnidadTipoCarta.filter(function(item){
                                return item.uni_ideregistro == formEdicionFooterMG.mges_carta;
                            }).map(function({unipropiedad}){
                                return {unipropiedad};
                            });
                            //console.log('datanew',datanew);
                            
                            let dataUrl= JSON.parse(datanew[0]['unipropiedad']);
                            //console.log('dataUrl......',  dataUrl);
                            //console.log('url_plantilla_azdigital......',  dataUrl.url_plantilla_azdigital);
                            //console.log('this is:', formEdicionFooterMG.mges_carta);
                            var NewText = dataUrl.url_plantilla_azdigital.replace("/documentos_gestioncartera/", "");
                            //console.log('NewText is:', NewText);
                            var URLdoc = '../..'+dataUrl.url_plantilla_azdigital+'.docx';
                            //location.href = URLdoc+'.docx';
                            const linkdoc = document.createElement('a')
                            linkdoc.href = URLdoc
                            linkdoc.download = dataUrl.url_plantilla_azdigital;//+'.docx'
                            linkdoc.click();
                            //var URLactual = window.location;
                            //console.log('ubiactual', URLactual);
                        }
                    });
                    
                    

                }
                
            }//fin validate
           
            
        }
        
        handleIvr= () => {
            
            const {seleccionadosMG,contarAsignadosMG,contarEstadoRegConfirmMG } = this.props.gestionCarteraState;
            const validacion = validaFormulario.validaGenerarIvr(seleccionadosMG);
            if (!validacion.respuesta) {
                this.props.appState.alerta = { "titulo": validacion.mensaje.titulo, "texto": validacion.mensaje.mensaje }
                this.props.mostrarAlerta();
                return false;
            } else {
                var i=0;
                var contar=0;
                if (contarAsignadosMG.length>0)  {
                    for(i=0;i<contarAsignadosMG.length;i++)
                    {
                        if(contarAsignadosMG[i]===null){
                            contar++;
                        }
                    }
                }
                var contarConfirmados=0;
                if (contarEstadoRegConfirmMG.length>0)  {
                    for(i=0;i<contarEstadoRegConfirmMG.length;i++)
                    {
                        if(contarEstadoRegConfirmMG[i]!='A'){
                            contarConfirmados++;
                        }
                    }
                }
                if(contar>0){
                    this.props.appState.alerta = { "titulo": "Información", "texto": "Hay 1 o más registros sin ejecutivo asignado, por favor verifíquelos." }
                    this.props.mostrarAlerta();
                    return false;
                }else if(contarConfirmados>0){
                    this.props.appState.alerta = { "titulo": "Información", "texto": "Hay 1 o más registros donde el estado del maestro no es 'A' " }
                    this.props.mostrarAlerta();
                    return false;
                }else{
                    
                    maestroGestionServicio.generarIvr(seleccionadosMG).then((reponseDatoMG) => {
                        
                        if (reponseDatoMG.data.codigoRespuesta == 200) {
                            //llamar nuevo servicio para generer excel
                            
                                maestroGestionServicio.generarExcelIVR(reponseDatoMG.data.data).then((reponseDato) => {
                                    
                                    if (reponseDato.status== 200) {
                                        const type = reponseDato.headers['content-type'];
                                        const blob = new Blob([reponseDato.data], { type: type, encoding: 'UTF-8' })
                                        const link = document.createElement('a')
                                        link.href = window.URL.createObjectURL(blob)
                                        link.download = 'Registros_IVR.xlsx'
                                        link.click();
                    
                                    }
                                }); 
                            
                                  
                        }else if(reponseDatoMG.data.codigoRespuesta == 400){
                            this.props.appState.alerta = { "titulo": "Información", "texto": reponseDatoMG.data.data }
                            this.props.mostrarAlerta();
                            return false;
                        }
                        
                        
                    });
                }
            }//fin validate
        }

    render() {
        
        const { listaUnidadExportar, listaUnidadTipoCarta } = this.props.gestionCarteraState
        const listUnidadExportar = listaUnidadExportar.map(item =>
            <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
        );
        
         
       
       /* const listUnidadTipoCarta = listaUnidadTipoCarta.map(item =>
            {
                let dataUrl= JSON.parse(item.unipropiedad);
                return <option key={item.uni_ideregistro} value={dataUrl.url_plantilla_azdigital}>{item.uninombre}</option>
            });*/
            const listUnidadTipoCarta = listaUnidadTipoCarta.map(item =>
                <option key={item.uni_ideregistro} value={item.uni_ideregistro}>{item.uninombre}</option>
            );
        return (
            <div>
                <Fragment>
                    <Row>
                       <Col xs={4}>
                            <Form.Group >
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="mges_vista"
                                    name="mges_vista"
                                    custom
                                    onChange={this.handleChange}
                                    defaultValue={-6}
                                    value={this.state.formEdicionFooterMG.mges_vista}
                                >
                                    <option value="-6">Seleccione Vista</option>
                                    <option value="1">Vista Inicial</option>
                                    <option value="2">Vista Completa</option>
                                    <option value="3">Vista Consolidada Cliente</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group >
                                <Button className="col-sm-12" variant="primary" onClick={this.ejecutarFiltro} >Ejecutar Filtro</Button>{' '}
                             </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <Form.Group >
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    id="mges_carta"
                                    name="mges_carta"
                                    custom
                                    onChange={this.handleChange}
                                    defaultValue={-8}
                                    value={this.state.formEdicionFooterMG.uni_ideregistro}
                                >
                                    <option value="-8">Seleccione Tipo Carta</option>
                                    {listUnidadTipoCarta}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group >
                                <Button className="col-sm-12" variant="primary" onClick={this.handleCartas} >Generación Cartas Masivas</Button>{' '}
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group >
                                <Button className="col-sm-12" variant="primary" onClick={this.handleIvr} >Generar IVR</Button>{' '}
                            </Form.Group>
                        </Col>
                    </Row>
                </Fragment>
                {this.state.showVistas &&(
                <div className="relative-parent">
                    {this.state.showVistaInicial &&(<RVistaListVistaIncialMG/>)}
                    {this.state.showVistaCompleta &&(<RVistaListVistaCompletaMG/>)}
                    {this.state.showVistaConsolidada && (<RVistaListVistaConsolidadaClienteMG/>)}
                </div>)}
              
            </div>
        );
    }
}
FormFooterMaestroGestion.propTypes = {
    history: PropTypes.object

};

const mapStateToProps = state => ({
    gestionCarteraState: state.gestioncartera,
    appState: state.app
});

const mapDispatchToProps = dispatch => ({
    listarItem(dataMaestroGestion) {
        dispatch({
            type: ACCION.LISTAR_VISTAS,
            payload: {"maestroGestion": dataMaestroGestion }
        })

    },
    setShowDetalle() {
        dispatch({
            type: ACCION.SET_DETALLE_MC
        })
    },
    setDataDetalle(data) {
        dispatch({
            type: ACCION.SET_MODALCONCEPTO_MC,
            payload: data
        })
    },
    selecionarItem(item) {
        dispatch({
            type: ACCION.SELECCIONAR_ITEM_FOOTERMG,
            payload: item
        })
    },
    setNuevosSeleccionadosItem(item) {
        dispatch({
            type: ACCION.SET_NEWSELECCIONADOSLISTA_MG,
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
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FormFooterMaestroGestion);
export { VistaRedux as RVistaFormFooterMaestroGestion };