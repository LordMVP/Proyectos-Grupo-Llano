import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button,Accordion, Card, div, Alert, Row, Col } from 'react-bootstrap';
import { Contenedor } from 'appfuture-react';
import {RVistaFormConsolidacionMeta, RVistaListResultadosConsolidacionMetas,
   RVistaFormMensajeEspera, RVistaListExcepcionesConsolidacionMetas} from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datosGenerales from '../../store/servicios/CumplimientoMetasServicios';


/**
 * Vista Principal del componente de Liquidar Comisiones
 */
class IndexConsolidacionMetas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showExcepcion:false,
      showResultados:false,
      showForm:true,
      showMensajeLoader:false,
      showComponentes:false//iniciar en false

    }

  }

  render() {
    const { showFormMeta, showMensajeLoaderMeta, showResultadosMeta } = this.props.gestionCarteraState
    
    return (
      <Contenedor>
        <br />
          <h1>Consolidación Metas Cumplimiento</h1>
          <div className="customHr">.</div>
          <br />
          {this.state.showComponentes &&(
        <div>
          {showMensajeLoaderMeta &&
          (<div>
              <Form.Group >
              {/*<Button  variant="primary" onClick={this.refreshPage} >Refrescar</Button>{' '}*/}
              </Form.Group> <br /><RVistaFormMensajeEspera/>
            </div>)}
            <div>
              {showFormMeta &&(<RVistaFormConsolidacionMeta/>)}
              <br/><br/><br/>
              
              {showResultadosMeta && showFormMeta &&(<RVistaListResultadosConsolidacionMetas/>)}
              {this.state.showExcepcion && (<RVistaListExcepcionesConsolidacionMetas/>)}
            </div>
            
        </div>)}
        
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Orientacion
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.CONSOLIDAR_METAS);
    this.obtenerDatosGenerales();
  }

  refreshPage() {
    window.location.reload();
  }
  /**
  * Método encargado de obtener los datos para liquidación de comisiones
   */
  obtenerDatosGenerales = async () => {
    
    datosGenerales.datosGeneralesConsolidarMetas([],"-1").then((responseDatoGeneral) => { 
      var data = [];
      var consolidar="";
      var recalcular="";
      var cerrarperiodo="";
      var confirmar="";
      var hayresultados=false;
      //var acceso="";
      
      if (responseDatoGeneral.data.codigoRespuesta == 200)
      {

       this.props.listarItem(responseDatoGeneral.data.data);
       //TODO, quitar la siguiente linea de prueba.
      // responseDatoGeneral.data.data.totalProcesosActivos=2;
       if(responseDatoGeneral.data.data.totalProcesosActivos>0){
        
         this.props.setShowForm(false);
         this.props.setShowMsnLoader(true);
         //TODO Activar, ya es funcional
         setTimeout(function(){ window.location.reload() }, 40000);
       }
       if(responseDatoGeneral.data.data.existExcepcionComision && responseDatoGeneral.data.data.totalProcesosActivos==0){
         
         this.setState({
           showExcepcion:responseDatoGeneral.data.data.existExcepcionComision,
         });
         this.props.setShowMsnLoader(false);
       }
       if(responseDatoGeneral.data.data.listCumplimientoMetasConsolidado!=null && responseDatoGeneral.data.data.listCumplimientoMetasConsolidado.length>0 && responseDatoGeneral.data.data.listExcepcionesCumplimientoMetas == null && responseDatoGeneral.data.data.totalProcesosActivos==0){
      //if(responseDatoGeneral.data.data.listExcepcionesCumplimientoMetas == null && responseDatoGeneral.data.data.totalProcesosActivos==0){
         
         this.props.setShowResultados(true);
         this.props.setShowMsnLoader(false);
         this.props.setShowButtons();


        if(responseDatoGeneral.data.data.listProgramaUnidad.length>0 ){
           
           responseDatoGeneral.data.data.listProgramaUnidad.map(function(a) {
             console.log('dentro del map meta cumplimiento');
             if(a.prg_nombre==="LCRLIQUIDM"){
               recalcular = "LCRLIQUIDM"
             }
             if(a.prg_nombre==="LCRCIERRPM"){
               cerrarperiodo = "LCRCIERRPM"
             }
             if(a.prg_nombre==="LCCCONSM"){
               confirmar = "LCCCONSM"
             }
           });
          
           if(recalcular==="LCRLIQUIDM")
             this.props.setShowButtonRecalcular();
               
           if(cerrarperiodo==="LCRCIERRPM")
             this.props.setShowButtonCerrarPeriodo();
          
           if(confirmar==="LCCCONSM")
             this.props.setShowButtonConfirmar();
          
           }
       }

       if(responseDatoGeneral.data.data.listProgramaUnidad.length>0 ){
         responseDatoGeneral.data.data.listProgramaUnidad.map(function(a) {
           console.log('denrro del map');
           if(a.prg_nombre==="LCLIQUIDAM"){
             consolidar = "LCLIQUIDAM";
           }
          
         });
       }

       if(consolidar==="LCLIQUIDAM"){
        this.props.setShowButtonConsolidar();
       }
         
       
         //para poder mostrar los componentes correctos de forma que no queden en el render y no se perciba la transición
       this.setState({
         showComponentes:true
       });
        
      }else{
        this.props.listarItem(data);
      }

    });
    
  }//fin obtener datos
}

IndexConsolidacionMetas.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => ({
  gestionCarteraState: state.gestioncartera
});


const mapDispatchToProps = dispatch => ({
  
  setOrigenComponente(origen) {
    dispatch({
      type: ACCION.SET_ORIGEN_COMPONENTE,
      payload: origen
    })
  },
  setShowButtons() {
    dispatch({
        type: ACCION.SET_BUTTONS_META
    })
  },
  setShowButtonConsolidar() {
    dispatch({
        type: ACCION.SET_BUTTON_CONSOLIDARMETA
    })
  },
  setShowButtonRecalcular() {
    dispatch({
        type: ACCION.SET_BUTTON_RECALCULARMETA
    })
  },
  setShowButtonConfirmar() {
    dispatch({
        type: ACCION.SET_BUTTON_CONFIRMARMETA
    })
  },
  /*setShowButtonExportar() {
    dispatch({
        type: ACCION.SET_BUTTON_EXPORTARLC
    })
  },*/
  setShowButtonCerrarPeriodo() {
    dispatch({
        type: ACCION.SET_BUTTON_CERRARPERIODOMETA
    })
  },
 /* setShowButtonsLiquidacion() {
    dispatch({
        type: ACCION.SET_BUTTONS_LIQUIDACION
    })
  },*/
  setExistResults() {
    dispatch({
        type: ACCION.SET_EXIST_RESULTMETA
    })
  },
  listarItem(data) {
    dispatch({
      type: ACCION.LISTAR_ITEMMETA,
      payload: { "meta": data }
    })

  },
  setShowMsnLoader(flag) {
    dispatch({
        type: ACCION.SET_SHOW_MENSAJELOADERMETA,
        payload: flag
    })
  },
  setShowForm(flag) {
    dispatch({
        type: ACCION.SET_SHOW_FORMMETA,
        payload: flag
    })
  },
  setShowResultados(flag) {
    dispatch({
        type: ACCION.SET_SHOW_RESULTADOSMETA,
        payload: flag
    })
  },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexConsolidacionMetas);
export { VistaRedux as RIndexVistaConsolidacionMetas };