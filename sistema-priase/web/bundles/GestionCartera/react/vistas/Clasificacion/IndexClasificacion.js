import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Contenedor } from 'appfuture-react';
import { RVistaListarClasificacion } from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datoGeneralServicio from '../../store/servicios/DatosGeneralesServicios';
import clasificacionServicio from '../../store/servicios/ClasificacionServicios';

//import boot from 'react-bootstrap';

/**
 * Vista Principal del componente de Clasificación
 */
class IndexClasificacion extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }

  }
  
  render() {
    return (
      <Contenedor>
        <br/>
        <RVistaListarClasificacion />
      </Contenedor>
    );
  }
  /**
     * Método encargado de obtener los datos generales para el formulario de clasificación
    */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.CLASIFICACION);
    this.obtenerDatosGenerales();
  }
  /**
  * Método encargado de obtener los datos para la grilla de Clasificación
   */
  obtenerDatosGenerales = async () => {
    datoGeneralServicio.listarDatosGenerales().then((responseDatoGeneral) => {      
      clasificacionServicio.listarDatosClasificacion().then((reponseDatoClasificacion) => {
        var data = [];
        if (reponseDatoClasificacion.data.codigoRespuesta == 200)
        {
          this.props.listarItem(responseDatoGeneral.data.data, reponseDatoClasificacion.data.data);
        }else{
          this.props.listarItem(responseDatoGeneral.data.data, data);
        }
      });
    });
  }

}

IndexClasificacion.propTypes = {
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
  listarItem(dataGeneral, dataClasificacion) {
    dispatch({
      type: ACCION.LISTAR_ITEM,
      payload: { "general": dataGeneral, "clasificacion": dataClasificacion }
    })

  }   
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexClasificacion);
export { VistaRedux as RIndexVistaClasificacion };