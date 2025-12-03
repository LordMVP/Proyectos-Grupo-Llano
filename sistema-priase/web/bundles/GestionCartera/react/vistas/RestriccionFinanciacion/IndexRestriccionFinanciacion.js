import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Contenedor } from 'appfuture-react';
import { RVistaListarRestriccionFinanciacion } from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datoGeneralServicio from '../../store/servicios/DatosGeneralesServicios';
import condonacionServicio from '../../store/servicios/CondonacionServicios';

//import boot from 'react-bootstrap';

/**
 * Vista Principal del componente de Restricción financiación condonación
 */
class IndexRestriccionFinanciacion extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }

  }

  render() {
    return (
      <Contenedor>
        <br />
        <RVistaListarRestriccionFinanciacion />
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de restricción Financiacion
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.RESTRICCION_FINANCIACION);
    this.obtenerDatosGenerales();
  }

  /**
  * Método encargado de obtener los datos para la grilla de restricción Financiacion
   */
  obtenerDatosGenerales = async () => {
    datoGeneralServicio.listarDatosGenerales().then((responseDatoGeneral) => {      
      condonacionServicio.listarDatosCondonacion().then((reponseDatoCondonacion) => {
        var data = [];
        if (reponseDatoCondonacion.data.codigoRespuesta == 200)
        {
          this.props.listarItem(responseDatoGeneral.data.data, reponseDatoCondonacion.data.data);
        }else{
          this.props.listarItem(responseDatoGeneral.data.data, data);
        }
      });
    });
  }
}

IndexRestriccionFinanciacion.propTypes = {
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
  listarItem(dataGeneral, dataRestriccionFinanciacion) {
    dispatch({
      type: ACCION.LISTAR_ITEM,
      payload: { "general": dataGeneral, "restriccionFinanciacion": dataRestriccionFinanciacion }
    })

  }
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexRestriccionFinanciacion);
export { VistaRedux as RIndexVistaRestriccionFinanciacion };