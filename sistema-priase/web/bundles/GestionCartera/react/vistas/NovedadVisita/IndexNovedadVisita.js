import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Contenedor } from 'appfuture-react';
import { RVistaListarNovedadVisita } from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datoGeneralServicio from '../../store/servicios/DatosGeneralesServicios';
import nVisitaServicio from '../../store/servicios/NovedadVisitaServicios';
//import boot from 'react-bootstrap';

/**
 * Vista Principal del componente de novedad visita
 */
class IndexNovedadVisita extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }

  }
  
  render() {
    return (
      <Contenedor>
        <br/>
        <RVistaListarNovedadVisita />
      </Contenedor>
    );
  }
  /**
     * Método encargado de obtener los datos generales para el formulario de novedad visita
    */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.NOVEDAD_VISITA);
    this.obtenerDatosGenerales();
  }
  /**
  * Método encargado de obtener los datos para la grilla de novedad visita
   */
  obtenerDatosGenerales = async () => {
    datoGeneralServicio.listarDatosGenerales().then((responseDatoGeneral) => {      
      nVisitaServicio.listarDatosNVisita().then((reponseDatoNVisita) => {
        var data = [];
        if (reponseDatoNVisita.data.codigoRespuesta == 200)
        {
          this.props.listarItem(responseDatoGeneral.data.data, reponseDatoNVisita.data.data);
        }else{
          this.props.listarItem(responseDatoGeneral.data.data, data);
        }
      });
    });
  }
}

IndexNovedadVisita.propTypes = {
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
  listarItem(dataGeneral, dataNovedadVisita) {
    dispatch({
      type: ACCION.LISTAR_ITEM,
      payload: { "general": dataGeneral, "novedadVisita": dataNovedadVisita }
    })

  }  
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexNovedadVisita);
export { VistaRedux as RIndexNovedadVisita };