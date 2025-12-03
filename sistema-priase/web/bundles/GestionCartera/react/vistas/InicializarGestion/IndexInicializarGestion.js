import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Accordion, Card, div, Alert } from 'react-bootstrap';
import { Contenedor } from 'appfuture-react';
import { RVistaFormInicializacionGestion, RVistaFormMensajeEspera,  RVistaListResultadosInicioGestion, RVistaListExcepcionesInicioGestion} from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datosGeneralesIG from '../../store/servicios/InicializarGestionServicios'
//import boot from 'react-bootstrap';

/**
 * Vista Principal del componente de Inicializar Gestión
 */
class IndexInicializarGestion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showExcepcion:false,
      showMensajeLoader:false,
      showComponentes:false
    }

  }

  render() {
    const {showMensajeLoader,showResultadosIG,showFormIG } = this.props.gestionCarteraState
    return (
      <Contenedor>
        <br />
        <h1>Inicializar Gestión</h1>
        <div className="customHr">.</div>
        <br />
          {this.state.showComponentes &&(<div>
            {showMensajeLoader &&(<div><Form.Group >
                <Button  variant="primary" onClick={this.refreshPage} >Refrescar</Button>{' '}
                </Form.Group><br /><RVistaFormMensajeEspera/>
             </div>)}
            {showFormIG &&(<RVistaFormInicializacionGestion/>)}
            {showResultadosIG && showFormIG &&(<RVistaListResultadosInicioGestion/>)}
            {this.state.showExcepcion && (<RVistaListExcepcionesInicioGestion/>)}
          
          </div>)}
          </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Orientacion
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.INICIALIZAR_GESTION);
    this.obtenerDatosGenerales();
  }
  refreshPage() {
    window.location.reload();
  }

  /**
  * Método encargado de obtener los datos para la grilla de Orientacion
   */
  obtenerDatosGenerales = async () => {
    
   
    datosGeneralesIG.datosGeneralesIniciarGestion().then((responseDatoGeneral) => { 
      var data = [];
      var inicia = "";
      var confirma = "";
      var descarta = "";
      
      if (responseDatoGeneral.data.codigoRespuesta == 200)
      {
        this.props.listarItem(responseDatoGeneral.data.data);
        //TODO, quitar la siguiente linea de prueba.
        //responseDatoGeneral.data.data.totalProcesosActivos=0;
        if(responseDatoGeneral.data.data.totalProcesosActivos>0){
          this.props.setShowForm(false);
          this.props.setShowMsnLoader(true);
        }
        if(responseDatoGeneral.data.data.existExcepcionMestroGestion && responseDatoGeneral.data.data.totalProcesosActivos==0){
          this.setState({
            showExcepcion:responseDatoGeneral.data.data.existExcepcionMestroGestion,
          });
          this.props.setShowMsnLoader(false);
        }
        if(responseDatoGeneral.data.data.listMaestroGestionTotal.length>0 && responseDatoGeneral.data.data.listMaestroGestionTotal[0].cantidadFactura > 0 && responseDatoGeneral.data.data.listExcepcionMaestroGestion == null && responseDatoGeneral.data.data.totalProcesosActivos==0){
          this.props.setShowResultadoTotales(true);
          this.props.setShowMsnLoader(false);
          this.props.setShowButtons();  
          
        if(responseDatoGeneral.data.data.listProgramaUnidad.length>0 ){

          responseDatoGeneral.data.data.listProgramaUnidad.map(function(a) {
            if(a.prg_nombre==="IGCONFIRMA"){
              confirma = "IGCONFIRMA";
            }
            if(a.prg_nombre==="IGDESCARTAR"){
              descarta = "IGDESCARTAR";
            }
            
        });
            
          if(confirma==="IGCONFIRMA")
              this.props.setShowButtonConfirmarIG();
          if(descarta==="IGDESCARTAR")
              this.props.setShowButtonDescartarIG();

          }//fin if listProgramaUnidad
          
        }
        
        if(responseDatoGeneral.data.data.listProgramaUnidad.length>0 ){
            responseDatoGeneral.data.data.listProgramaUnidad.map(function(a) {
            if(a.prg_nombre==="IPINICAGESTION"){
              inicia = "IPINICAGESTION";
            }
          });
        }
        if(inicia==="IPINICAGESTION")
          this.props.setShowButtonIniciarIG();
        
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

IndexInicializarGestion.propTypes = {
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
  listarItem(dataMaestroGestion) {
    dispatch({
      type: ACCION.LISTAR_ITEMIG,
      payload: {"maestroGestion": dataMaestroGestion }
    })

  },
  setShowButtons() {
    dispatch({
        type: ACCION.SET_BUTTONS_IG
    })
  },
  setShowButtonIniciarIG() {
    dispatch({
        type: ACCION.SET_BUTTON_INICIAGESTION
    })
  },
  setShowButtonConfirmarIG() {
    dispatch({
        type: ACCION.SET_BUTTON_CONFIRMAIG
    })
  },
  setShowButtonDescartarIG() {
    dispatch({
        type: ACCION.SET_BUTTON_DESCARTARIG
    })
  },
  setShowMsnLoader(flag) {
    dispatch({
        type: ACCION.SET_SHOW_MENSAJELOADER,
        payload: flag
    })
  },
  setShowResultadoTotales(flag) {
    dispatch({
        type: ACCION.SET_SHOW_RESULTADOSIG,
        payload: flag
    })
  },
  setShowForm(flag) {
    dispatch({
        type: ACCION.SET_SHOW_FORMIG,
        payload: flag
    })
  },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexInicializarGestion);
export { VistaRedux as RIndexVistaInicializarGestion };