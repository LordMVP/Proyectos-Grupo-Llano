import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Contenedor } from 'appfuture-react';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import { RVistaListarEjecutivo } from '../index';
import datoGeneralServicio from '../../store/servicios/DatosGeneralesServicios';
import ejecutivoServicio from '../../store/servicios/EjecutivoServicios';

/**
 * Vista Principal del componente de Ejecutivo
 */
class IndexEjecutivo extends Component {
  constructor(props){
    super(props)
    this.state = {
    
    }

  }
  
  
  render() {
    return (
      <Contenedor>
        <br/>
        <RVistaListarEjecutivo />
      </Contenedor>
    );
  }
  /**
     * Método encargado de obtener los datos generales para el formulario de Ejecutivo
    */
   componentDidMount() {
    this.props.setOrigenComponente(MODULO.EJECUTIVOS);
    this.obtenerDatosGenerales();
  }

  /**
   * Método encargado de obtener los datos generales
   */
  obtenerDatosGenerales  = async () => {
    datoGeneralServicio.listarDatosGeneralesEje().then((responseDatoGeneral) => {      
      ejecutivoServicio.listarDatosEjecutivo().then((reponseDatoEjecutivo) => {
        var data = [];
        if (reponseDatoEjecutivo.data.codigoRespuesta == 200)
        {
          this.props.listarItem(responseDatoGeneral.data.data, reponseDatoEjecutivo.data.data);
        }else{
          this.props.listarItem(responseDatoGeneral.data.data, data);
        }
      });
    });
 
  }
  
}

IndexEjecutivo.propTypes = {
  history: PropTypes.object
};

const mapStateToProps = state => ({
  gestionCarteraState: state.gestioncartera
});

const mapDispatchToProps = dispatch => ({
  setOrigenComponente(origen){
      dispatch({
          type: ACCION.SET_ORIGEN_COMPONENTE,
          payload: origen
      })        
  },
  listarItem(dataGeneral, dataEjecutivos) {
    dispatch({
      type: ACCION.LISTAR_ITEM,
      payload: { "general": dataGeneral, "ejecutivos": dataEjecutivos }
    })

  }  
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexEjecutivo);
export { VistaRedux as RIndexVistaEjecutivo };