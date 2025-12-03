import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button,Accordion, Card, div, Alert, Row, Col } from 'react-bootstrap';
import { Contenedor } from 'appfuture-react';
import { RVistaFormLiquidacionComisiones, RVistaListResultadosLiquidacionComisiones,
   RVistaFormMensajeEspera, RVistaListExcepcionesLiquidacionComisiones} from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datosGeneralesLC from '../../store/servicios/LiquidarComisionServicios';


/**
 * Vista Principal del componente de Liquidar Comisiones
 */
class IndexLiquidacionComisiones extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showExcepcion:false,
      showResultados:false,
      showForm:true,
      showMensajeLoader:false,
      showComponentes:false

    }

  }

  render() {
    const { showFormLCom, showMensajeLoaderLCom, showResultadosLCom } = this.props.gestionCarteraState
    
    return (
      <Contenedor>
        <br />
          <h1>Liquidación Comisiones</h1>
          <div className="customHr">.</div>
          <br />
       {this.state.showComponentes &&(
        <div>
          {showMensajeLoaderLCom &&
          (<div>
              <Form.Group >
              <Button  variant="primary" onClick={this.refreshPage} >Refrescar</Button>{' '}
              </Form.Group> <br /><RVistaFormMensajeEspera/>
            </div>)}
            <div>
              {showFormLCom &&(<RVistaFormLiquidacionComisiones/>)}
              <br/><br/><br/>
              {showResultadosLCom && showFormLCom &&(<RVistaListResultadosLiquidacionComisiones/>)}
              {this.state.showExcepcion && (<RVistaListExcepcionesLiquidacionComisiones/>)}
            </div>
            
        </div>)}
        
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Orientacion
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.LIQUIDACION_COMISIONES);
    this.obtenerDatosGenerales();
  }

  refreshPage() {
    window.location.reload();
  }
  /**
  * Método encargado de obtener los datos para liquidación de comisiones
   */
  obtenerDatosGenerales = async () => {
    
    datosGeneralesLC.datosGeneralesLiquidarComision([],"-1").then((responseDatoGeneral) => { 
      var data = [];
      var liquidar="";
      var recalcular="";
      var cerrarperiodo="";
      var editarabono="";
      //var acceso="";
      if (responseDatoGeneral.data.codigoRespuesta == 200)
      {
        this.props.listarItem(responseDatoGeneral.data.data);
        //TODO, quitar la siguiente linea de prueba.
        //responseDatoGeneral.data.data.totalProcesosActivos=2;
        if(responseDatoGeneral.data.data.totalProcesosActivos>0){
          /*this.setState({
            showMensajeLoader:true, 
            showForm:false
          });*/
          this.props.setShowForm(false);
          this.props.setShowMsnLoader(true);
        }
        if(responseDatoGeneral.data.data.existExcepcionComision && responseDatoGeneral.data.data.totalProcesosActivos==0){
          this.setState({
            showExcepcion:responseDatoGeneral.data.data.existExcepcionComision,
          });
          this.props.setShowMsnLoader(false);
        }
        if(responseDatoGeneral.data.data.listMaestroComision!=null && responseDatoGeneral.data.data.listMaestroComision.length>0 && responseDatoGeneral.data.data.listExcepcionGestionComision == null && responseDatoGeneral.data.data.totalProcesosActivos==0){
          /*this.setState({
            showResultados:true
          });*/
          this.props.setShowResultadoTotales(true);
          this.props.setShowMsnLoader(false);
          this.props.setShowButtons();
          this.props.setExistResults(); 

          datosGeneralesLC.eliminarVacios().then((reponseDatoListaMG) => {
            
          });
          
          if(responseDatoGeneral.data.data.listProgramaUnidad.length>0 ){
            
            responseDatoGeneral.data.data.listProgramaUnidad.map(function(a) {
              console.log('denrro del map');
              if(a.prg_nombre==="RCLIQUIDAR"){
                recalcular = "RCLIQUIDAR"
              }
              if(a.prg_nombre==="CPLIQUIDAR"){
                cerrarperiodo = "CPLIQUIDAR"
              }
              if(a.prg_nombre==="EBLIQUIDAR"){
                editarabono = "EBLIQUIDAR"
              }
            });
           
            if(recalcular==="RCLIQUIDAR")
              this.props.setShowButtonRecalcularLC();
                
             if(cerrarperiodo==="CPLIQUIDAR")
              this.props.setShowButtonCerrarPeriodoLC();
            if(editarabono==="EBLIQUIDAR")
                this.props.setShowButtonEditarAbonoLC();

            //TODO boton exportar no hace parte de sprint3 y falta para btn confirmar
            //this.props.setShowButtonExportarLC();
            }
        }

        if(responseDatoGeneral.data.data.listProgramaUnidad.length>0 ){
          responseDatoGeneral.data.data.listProgramaUnidad.map(function(a) {
            console.log('denrro del map');
            if(a.prg_nombre==="LCLIQUIDAR"){
              liquidar = "LCLIQUIDAR";
            }
           /* if(a.prg_nombre==="ACCILIMGESCA"){
              acceso = "ACCILIMGESCA";
            }*/
          });
        }
        if(liquidar==="LCLIQUIDAR")
          this.props.setShowButtonLiquidarLC();
        
        //if(acceso==="ACCILIMGESCA")
         // this.props.setShowButtonsLiquidacion();
       
          //para poder mostrar los componentes correctos de forma que no queden en el render y no se perciba la transición
        this.setState({
          showComponentes:true
        });
      }else{
        this.props.listarItem(data);
      }

  });
  }
}

IndexLiquidacionComisiones.propTypes = {
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
        type: ACCION.SET_BUTTONS_LC
    })
  },
  setShowButtonLiquidarLC() {
    dispatch({
        type: ACCION.SET_BUTTON_LIQUIDARLC
    })
  },
  setShowButtonRecalcularLC() {
    dispatch({
        type: ACCION.SET_BUTTON_RECALCULARLC
    })
  },
  setShowButtonExportarLC() {
    dispatch({
        type: ACCION.SET_BUTTON_EXPORTARLC
    })
  },
  setShowButtonCerrarPeriodoLC() {
    dispatch({
        type: ACCION.SET_BUTTON_CERRARPERIDOLC
    })
  },
  setShowButtonEditarAbonoLC() {
    dispatch({
        type: ACCION.SET_BUTTON_EDITARABONOLC
    })
  },
 /* setShowButtonsLiquidacion() {
    dispatch({
        type: ACCION.SET_BUTTONS_LIQUIDACION
    })
  },*/
  setExistResults() {
    dispatch({
        type: ACCION.SET_EXIST_RESULTLC
    })
  },
  listarItem(dataGestion) {
    dispatch({
      type: ACCION.LISTAR_ITEMLC,
      payload: { "maestroGestion": dataGestion }
    })

  },
  setShowMsnLoader(flag) {
    dispatch({
        type: ACCION.SET_SHOW_MENSAJELOADERLCOM,
        payload: flag
    })
  },
  setShowForm(flag) {
    dispatch({
        type: ACCION.SET_SHOW_FORMLCOM,
        payload: flag
    })
  },
  setShowResultadoTotales(flag) {
    dispatch({
        type: ACCION.SET_SHOW_RESULTADOSLCOM,
        payload: flag
    })
  },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexLiquidacionComisiones);
export { VistaRedux as RIndexVistaLiquidacionComisiones };