import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Contenedor } from 'appfuture-react';
import { RVistaListarEstadoCartera } from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datoGeneralServicio from '../../store/servicios/DatosGeneralesServicios';
import estadoCarteraServicio from '../../store/servicios/EstadoCarteraServicios';
//import boot from 'react-bootstrap';

/**
 * Vista Principal del componente de estado cartera
 */
class IndexEstadoCartera extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }

  }
  
  render() {
    return (
      <Contenedor>
        <br/>
        <RVistaListarEstadoCartera />
      </Contenedor>
    );
  }
  /**
     * Método encargado de obtener los datos generales para el formulario de estado cartera
    */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.ESTADO_CARTERA);
    this.obtenerDatosGenerales();
  }
  /**
  * Método encargado de obtener los datos para la grilla de Estado cartera
   */
  obtenerDatosGenerales = async () => {
    datoGeneralServicio.listarDatosGenerales().then((responseDatoGeneral) => {      
      estadoCarteraServicio.listarDatosEstadoCartera().then((reponseDatoEstadoCartera) => {
        var data = [];
        if (reponseDatoEstadoCartera.data.codigoRespuesta == 200)
        {
          this.props.listarItem(responseDatoGeneral.data.data, reponseDatoEstadoCartera.data.data);
        }else{
          this.props.listarItem(responseDatoGeneral.data.data, data);
        }
      });
    });
  }
}

IndexEstadoCartera.propTypes = {
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
  listarItem(dataGeneral, dataEstadoCartera) {
    dispatch({
      type: ACCION.LISTAR_ITEM,
      payload: { "general": dataGeneral, "estadoCartera": dataEstadoCartera }
    })

  }  
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexEstadoCartera);
export { VistaRedux as RIndexVistaEstadoCartera };