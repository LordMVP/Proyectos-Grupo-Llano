import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button, Accordion, Card, div, Alert } from 'react-bootstrap';
import { Contenedor } from 'appfuture-react';
import { RVistaFormExportarKactus } from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import exportaraKactus from '../../store/servicios/ExporarKactusServicios';


/**
 * Vista Principal del componente para enviar las comisiones al sistema Kactus
 */
class IndexExportarComisionKactus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showExcepcion:false,
      showMensajeLoader:false,
      showComponentes:false
    }

  }

  render() {
    const {showResultadosDN,showFormDN } = this.props.gestionCarteraState
    return (
      <Contenedor>
        <br />
        <h1>Carga a Sitema Kactus </h1>
        <div className="customHr">.</div>
       <RVistaFormExportarKactus/>
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Orientacion
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.KACTUS);
    this.obtenerDatosGenerales();
  }
  refreshPage() {
    window.location.reload();
  }

  /**
  * Método encargado de obtener los datos para la grilla de Orientacion
   */
  obtenerDatosGenerales = async () => {
    
   
    exportaraKactus.datosGeneralesExportarKactus().then((responseDatoGeneral) => { 
      var data = [];
      var inicia = "";
      var confirma = "";
      var descarta = "";
      
      if (responseDatoGeneral.data.codigoRespuesta == 200)
      {
        this.props.listarItem(responseDatoGeneral.data.data);
        
      }else{
        this.props.listarItem(data);
      }

  });

  }
}

IndexExportarComisionKactus.propTypes = {
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
  listarItem(dataExportarK) {
    dispatch({
      type: ACCION.LISTAR_ITEMEK,
      payload: {"maestroKactus": dataExportarK }
    })

  },
    //TODO eliminar los que no se usa
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
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexExportarComisionKactus);
export { VistaRedux as RIndexExportarComisionKactus };