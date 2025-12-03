import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Contenedor } from 'appfuture-react';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import { RVistaListarVariableGlobal } from '../index';
import datoGeneralServicio from '../../store/servicios/DatosGeneralesServicios';
import vglobalServicio from '../../store/servicios/VariablesGlobalesServicios';

/**
 * Vista Principal del componente de Variables globales
 */
class IndexVariableGlobal extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      
    }
  }

  render() {
    return (
      <Contenedor>
         <RVistaListarVariableGlobal />
      </Contenedor>
    );
  }
  /**
     * Método encargado de cargar la lista en la tabla cuando se monte el componente
     */
    componentDidMount() {
      this.props.setOrigenComponente(MODULO.VARIABLES_GLOBALES);
      this.obtenerDatosGenerales();
    }

  /**
   * Método encargado de obtener los datos generales para el formulario de variable global
   */
  obtenerDatosGenerales  = async () => {
    
    datoGeneralServicio.listarDatosGeneralesVG().then((responseDatoGeneral) => {      
      vglobalServicio.listarDatosVGlobales().then((reponseDatoVGlobales) => {
        var data = [];
        if (reponseDatoVGlobales.data.codigoRespuesta == 200)
        {
          this.props.listarItem(responseDatoGeneral.data.data, reponseDatoVGlobales.data.data);
        }else{
          this.props.listarItem(responseDatoGeneral.data.data, data);
        }
      });
    });
  }
}

IndexVariableGlobal.propTypes = {
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
  listarItem(dataGeneral, dataVglobales) {
    dispatch({
      type: ACCION.LISTAR_ITEM,
      payload: { "general": dataGeneral, "variablesGlobales": dataVglobales }
    })

  }  
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexVariableGlobal);
export { VistaRedux as RIndexVistaVariableGlobal };