import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Accordion, Card, div, Alert } from 'react-bootstrap';
import { Contenedor } from 'appfuture-react';
import { RVistaFormCompararDeterioro, RVistaListComparacionDeterioro} from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import deterioroNiff from '../../store/servicios/DeterioroNiffServicios';


/**
 * Vista Principal del componente de Inicializar Deterioro NIFF 
 */
class IndexCompararDeterioro extends Component {
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
        <h1>Comparar Deterioro </h1>
        <div className="customHr">.</div>
        <br /><RVistaFormCompararDeterioro/>
        <br /><RVistaListComparacionDeterioro/>
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Orientacion
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.COMPARAR_DETERIORO);
    this.obtenerDatosGenerales();
  }
  refreshPage() {
    window.location.reload();
  }

  /**
  * Método encargado de obtener los datos para la grilla de Orientacion
   */
  obtenerDatosGenerales = async () => {
    
    deterioroNiff.datosGeneralesIniciarDeterioro().then((responseDatoGeneral) => { 
      var data = [];
      var inicia = "";
      var confirma = "";
      var descarta = "";
      
      if (responseDatoGeneral.data.codigoRespuesta == 200)
      {
        this.props.listarItem(responseDatoGeneral.data.data);
        //TODO, quitar la siguiente linea de prueba.
        
      }else{
        this.props.listarItem(data);
      }

  });

  }
}

IndexCompararDeterioro.propTypes = {
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
      type: ACCION.LISTAR_ITEM_CONSULTARDN,
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
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexCompararDeterioro);
export { VistaRedux as RIndexCompararDeterioro };