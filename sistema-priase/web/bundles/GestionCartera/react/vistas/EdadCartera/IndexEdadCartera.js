import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Contenedor } from 'appfuture-react';
import { RVistaListarEdadCartera } from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datoGeneralServicio from '../../store/servicios/DatosGeneralesServicios';
import edadCarteraServicio from '../../store/servicios/EdadCarteraServicios';

//import boot from 'react-bootstrap';

/**
 * Vista Principal del componente de Edad Cartera
 */
class IndexEdadCartera extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }

  }

  render() {
    return (
      <Contenedor>
        <br />
        <RVistaListarEdadCartera />
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Edad Cartera
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.EDAD_CARTERA);
    this.obtenerDatosGenerales();
  }

  /**
  * Método encargado de obtener los datos para la grilla de Edad Cartera
   */
  obtenerDatosGenerales = async () => {
    datoGeneralServicio.listarDatosGenerales().then((responseDatoGeneral) => {      
      edadCarteraServicio.listarDatosEdadCartera().then((reponseDatoEdadCartera) => {
        var data = [];
        if (reponseDatoEdadCartera.data.codigoRespuesta == 200)
        {
          this.props.listarItem(responseDatoGeneral.data.data, reponseDatoEdadCartera.data.data);
        }else{
          this.props.listarItem(responseDatoGeneral.data.data, data);
        }
      });
    });
  }
}

IndexEdadCartera.propTypes = {
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
  listarItem(dataGeneral, dataEdadCartera) {
    dispatch({
      type: ACCION.LISTAR_ITEM,
      payload: { "general": dataGeneral, "edadCartera": dataEdadCartera }
    })

  }
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexEdadCartera);
export { VistaRedux as RIndexVistaEdadCartera };