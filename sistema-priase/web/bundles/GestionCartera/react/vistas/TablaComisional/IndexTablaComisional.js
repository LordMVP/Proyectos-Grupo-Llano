import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Contenedor } from 'appfuture-react';
import { RVistaListarTablaComisional } from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datoGeneralServicio from '../../store/servicios/DatosGeneralesServicios'
import tComisionalServicio from '../../store/servicios/TablaComisionalServicios'

//import boot from 'react-bootstrap';

/**
 * Vista Principal del componente de tabla comisional
 */
class IndexTablaComisional extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }

  }

  render() {
    return (
      <Contenedor>
        <br />
        <RVistaListarTablaComisional />
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de tabla comisional
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.TABLA_COMISIONAL);
    this.obtenerDatosGenerales();
  }

  /**
  * Método encargado de obtener los datos para la grilla de tabla comisional
   */
  obtenerDatosGenerales = async () => {
    datoGeneralServicio.listarDatosGenerales().then((responseDatoGeneral) => {      
      tComisionalServicio.listarDatosTComisional().then((reponseDatoTComisional) => {
        var data = [];
        if (reponseDatoTComisional.data.codigoRespuesta == 200)
        {
          this.props.listarItem(responseDatoGeneral.data.data, reponseDatoTComisional.data.data);
        }else{
          this.props.listarItem(responseDatoGeneral.data.data, data);
        }
      });
    });
  }
}

IndexTablaComisional.propTypes = {
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
  listarItem(dataGeneral, dataTablaComisional) {
    dispatch({
      type: ACCION.LISTAR_ITEM,
      payload: { "general": dataGeneral, "tablaComisional": dataTablaComisional }
    })

  }
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexTablaComisional);
export { VistaRedux as RIndexVistaTablaComisional };