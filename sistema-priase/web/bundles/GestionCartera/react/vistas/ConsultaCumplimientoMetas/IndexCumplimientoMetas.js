import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Form, Button,Accordion, Card, div, Alert, Row, Col } from 'react-bootstrap';
import { Contenedor } from 'appfuture-react';
import {RVistaFormConsultaCumplimientoMetas, RVistaListResultadosConsolidacionMetas} from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datosGenerales from '../../store/servicios/CumplimientoMetasServicios';


/**
 * Vista Principal del componente consukta
 */
class IndexCumplimientoMetas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showExcepcion:false,
      showResultados:false,
      showForm:true,
      showMensajeLoader:false,
      showComponentes:true//iniciar en false

    }

  }

  render() {
    const { showFormMeta, showMensajeLoaderMeta, showResultadosMeta } = this.props.gestionCarteraState
    
    return (
      <Contenedor>
        <br />
          <h1>Consulta Metas Cumplimiento</h1>
          <div className="customHr">.</div>
          <br />
          <RVistaFormConsultaCumplimientoMetas/>
          <br />
          <RVistaListResultadosConsolidacionMetas/>
        
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Orientacion
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.CUMPLIMIENTO_METAS_);
    this.obtenerDatosGenerales();
  }

  /**
  * Método encargado de obtener los datos para liquidación de comisiones
   */
  obtenerDatosGenerales = async () => {
    
    datosGenerales.datosGeneralesConsultarHistoricos().then((responseDatoGeneral) => { 
      var data = [];
      
      if (responseDatoGeneral.data.codigoRespuesta == 200)
      {
        this.props.listarItem(responseDatoGeneral.data.data);
        
      }else{
        this.props.listarItem(data);
      }

  });
  }//fin obtener datos
}

IndexCumplimientoMetas.propTypes = {
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
      type: ACCION.LISTAR_ITEM_HISTORICO,
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
  setShowResultadoTotales(flag) {
    dispatch({
        type: ACCION.SET_SHOW_RESULTADOSMETA,
        payload: flag
    })
  },
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexCumplimientoMetas);
export { VistaRedux as RIndexVistaCumplimientoMetas };