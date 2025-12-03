import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Contenedor } from 'appfuture-react';
import { RVistaListarEstrategia } from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datoGeneralServicio from '../../store/servicios/DatosGeneralesServicios';
import estrategiaServicio from '../../store/servicios/EstrategiaServicios';

//import boot from 'react-bootstrap';

/**
 * Vista Principal del componente de Estrategia
 */
class IndexEstrategia extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }

  }

  render() {
    return (
      <Contenedor>
        <br />
        <RVistaListarEstrategia />
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Estrategia
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.ESTRATEGIA);
    this.obtenerDatosGenerales();
  }

  /**
  * Método encargado de obtener los datos para la grilla de Estrategia
   */
  obtenerDatosGenerales = async () => {
    datoGeneralServicio.listarDatosGenerales().then((responseDatoGeneral) => {      
      estrategiaServicio.listarDatosEstrategia().then((reponseDatoEstrategia) => {
        var data = [];
        if (reponseDatoEstrategia.data.codigoRespuesta == 200)
        {
          this.props.listarItem(responseDatoGeneral.data.data, reponseDatoEstrategia.data.data);
        }else{
          this.props.listarItem(responseDatoGeneral.data.data, data);
        }
      });
    });
  }
}

IndexEstrategia.propTypes = {
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
  listarItem(dataGeneral, dataEstrategia) {
    dispatch({
      type: ACCION.LISTAR_ITEM,
      payload: { "general": dataGeneral, "estrategia": dataEstrategia }
    })

  }
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexEstrategia);
export { VistaRedux as RIndexVistaEstrategia };