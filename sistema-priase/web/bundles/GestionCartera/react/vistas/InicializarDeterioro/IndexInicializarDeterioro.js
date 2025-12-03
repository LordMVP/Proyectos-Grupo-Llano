import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Accordion, Card, div, Alert } from 'react-bootstrap';
import { Contenedor } from 'appfuture-react';
import { RVistaFormInicializacionDeterioro, RVistaFormMensajeEspera,  RVistaListResultadosDeterioro, RVistaListExcepcionesInicioDeterioro} from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import deterioroNiff from '../../store/servicios/DeterioroNiffServicios'


/**
 * Vista Principal del componente de Inicializar Deterioro NIFF
 */
class IndexInicializarDeterioro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showExcepcion:false,
      showMensajeLoader:false,
      showComponentes:false
    }

  }

  render() {
    const {showMensajeLoader,showResultadosDN,showFormDN } = this.props.gestionCarteraState
    return (
      <Contenedor>
        <br />
        <h1>Inicio de Deterioro </h1>
        <div className="customHr">.</div>
       
          {this.state.showComponentes &&(<div>
            {showMensajeLoader &&(<div><Form.Group >
                <Button  variant="primary" onClick={this.refreshPage} >Refrescar</Button>{' '}
                </Form.Group><br /><RVistaFormMensajeEspera/>
             </div>)}
            {showFormDN &&(<RVistaFormInicializacionDeterioro/>)}
            {showResultadosDN && showFormDN &&(<RVistaListResultadosDeterioro/>)}
            {this.state.showExcepcion && (<RVistaListExcepcionesInicioDeterioro/>)}
          
          </div>)}
          </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Orientacion
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.INICIALIZAR_DETERIORO);
    this.obtenerDatosGenerales();
  }
  refreshPage() {
    window.location.reload();
  }

  /**
  * Método encargado de obtener los datos para la grilla de Orientacion
   */
  obtenerDatosGenerales = async () => {
    
   
    deterioroNiff.consultarInicializacionDeterioro().then((responseDatoGeneral) => { 
      var data = [];
      var inicia = "";
      var confirma = "";
      var descarta = "";
      
      if (responseDatoGeneral.data.codigoRespuesta == 200)
      {
        this.props.listarItem(responseDatoGeneral.data.data);
        //TODO, quitar la siguiente linea de prueba.
        //responseDatoGeneral.data.data.totalProcesosActivos=1;
        //responseDatoGeneral.data.data.existExcepcionNiff =  true;
        if(responseDatoGeneral.data.data.totalProcesosActivos>0){
          this.props.setShowForm(false);
          this.props.setShowMsnLoader(true);
        }
        if(responseDatoGeneral.data.data.existExcepcionNiff && responseDatoGeneral.data.data.totalProcesosActivos==0){
          this.setState({
            showExcepcion:responseDatoGeneral.data.data.existExcepcionNiff,
          });
          this.props.setShowMsnLoader(false);
        }
        
        if(responseDatoGeneral.data.data.gestionFacturaNiffResumenDto.listGestionFacturaNiffDto!=null && responseDatoGeneral.data.data.gestionFacturaNiffResumenDto.listGestionFacturaNiffDto.length>0 && responseDatoGeneral.data.data.gestionFacturaNiffResumenDto.listGestionFacturaNiffDto[0].niff_ideregistr > 0 && responseDatoGeneral.data.data.listExcepcionGestionFacturaNiff == null && responseDatoGeneral.data.data.totalProcesosActivos==0){
          this.props.setShowResultadoTotales(true);
          this.props.setShowMsnLoader(false);
          this.props.setShowButtons();  
          
        if(responseDatoGeneral.data.data.listProgramaUnidad.length>0 ){

          responseDatoGeneral.data.data.listProgramaUnidad.map(function(a) {
            if(a.prg_nombre==="CPNIFF"){
              confirma = "CPNIFF";
            }
            if(a.prg_nombre==="DPNIFF"){
              descarta = "DPNIFF";
            }
            
        });
            
          if(confirma==="CPNIFF")
              this.props.setShowButtonConfirmarIG();
          if(descarta==="DPNIFF")
              this.props.setShowButtonDescartarIG();

          }//fin if listProgramaUnidad
          
        }//fin if del listado resumen
        
        if(responseDatoGeneral.data.data.listProgramaUnidad.length>0 ){
            responseDatoGeneral.data.data.listProgramaUnidad.map(function(a) {
            if(a.prg_nombre==="IPINICIANIFF"){
              inicia = "IPINICIANIFF";
            }
          });
        }
        if(inicia==="IPINICIANIFF")
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

IndexInicializarDeterioro.propTypes = {
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
  listarItem(data) {
    dispatch({
      type: ACCION.LISTAR_ITEMDN,
      payload: {"gestionNiff": data }
    })

  },
  setShowButtons() {
    dispatch({
        type: ACCION.SET_BUTTONS_DN
    })
  },
  setShowButtonIniciarIG() {
    dispatch({
        type: ACCION.SET_BUTTON_INICIADN
    })
  },
  setShowButtonConfirmarIG() {
    dispatch({
        type: ACCION.SET_BUTTON_CONFIRMADN
    })
  },
  setShowButtonDescartarIG() {
    dispatch({
        type: ACCION.SET_BUTTON_DESCARTARDN
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
        type: ACCION.SET_SHOW_RESULTADOSDN,
        payload: flag
    })
  },
  setShowForm(flag) {
    dispatch({
        type: ACCION.SET_SHOW_FORMDN,
        payload: flag
    })
  },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexInicializarDeterioro);
export { VistaRedux as RIndexInicializarDeterioro };