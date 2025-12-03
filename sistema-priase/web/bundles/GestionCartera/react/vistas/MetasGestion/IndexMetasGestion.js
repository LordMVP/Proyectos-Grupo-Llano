import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Contenedor } from 'appfuture-react';
import { RVistaListarMetasGestion } from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datoGeneralServicio from '../../store/servicios/DatosGeneralesServicios'
import mGestionServicio from '../../store/servicios/MetasGestionServicios'

//import boot from 'react-bootstrap';

/**
 * Vista Principal del componente de Meta de Gestión
 */
class IndexMetasGestion extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }

  }

  render() {
    return (
      <Contenedor>
        <br />
        <RVistaListarMetasGestion />
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Metas de Gestión
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.META_GESTION);
    this.obtenerDatosGenerales();
  }

  /**
  * Método encargado de obtener los datos para la grilla de Metas de Gestión
   */
  obtenerDatosGenerales = async () => {
    datoGeneralServicio.listarDatosGenerales().then((responseDatoGeneral) => {  
      mGestionServicio.listarDatosMGestion().then((reponseDatoMetaGestion) => {
        var data = [];
        if (reponseDatoMetaGestion.data.codigoRespuesta == 200)
        {
          this.props.listarItem(responseDatoGeneral.data.data, reponseDatoMetaGestion.data.data);
        }else{
          this.props.listarItem(responseDatoGeneral.data.data, data);
        }
      });
    });
  }
}

IndexMetasGestion.propTypes = {
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
  listarItem(dataGeneral, dataMetasGestion) {
    dispatch({
      type: ACCION.LISTAR_ITEM,
      payload: { "general": dataGeneral, "metasGestion": dataMetasGestion }
    })

  }
});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexMetasGestion);
export { VistaRedux as RIndexVistaMetasGestion  };