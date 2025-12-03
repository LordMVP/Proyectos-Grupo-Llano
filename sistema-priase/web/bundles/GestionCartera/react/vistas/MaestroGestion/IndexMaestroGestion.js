import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { Accordion, Card, div } from 'react-bootstrap';
import { Contenedor } from 'appfuture-react';
import { RVistaFormHeadMaestroGestion, RVistaFormInformacionBasicaMaestroGestion, 
  RVistaFormInformacionGestionMaestroGestion, RVistaFormInformacionGestionVisitaMaestroGestion, 
  RVistaFormAsignacionDistribucionMaestroGestion, RVistaFormFooterMaestroGestion,
  RVistaFormGestionVisita } from '../index';
import { ACCION, MODULO } from '../../store/actions/TiposAcciones';
import datoGeneralMG from '../../store/servicios/MaestroGestionServicios'
//import orientacionServicio from '../../store/servicios/OrientacionServicios'
//import boot from 'react-bootstrap';

/**
 * Vista Principal del componente de Maestro Gestión Filtros
 */
class IndexMaestroGestion extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }

  }

  render() {
    const { showMaestroGestion, showGestionVisitas } = this.props.gestionCarteraState
    return (
      <Contenedor>
        <br />
        {showMaestroGestion &&(
        <div>
          <RVistaFormHeadMaestroGestion />
          <Accordion className="panel-group" id="accordion" defaultActiveKey="-1">
            <RVistaFormInformacionBasicaMaestroGestion />
            <RVistaFormInformacionGestionMaestroGestion />  
            <RVistaFormInformacionGestionVisitaMaestroGestion/>
            <RVistaFormAsignacionDistribucionMaestroGestion/>
            <RVistaFormFooterMaestroGestion/>
          </Accordion>
        </div>)}
        {showGestionVisitas &&(<RVistaFormGestionVisita/>)}
          <br />
        
      </Contenedor>
    );
  }
  /**
  * Método encargado de obtener los datos generales para el formulario de Orientacion
  */
  componentDidMount() {
    this.props.setOrigenComponente(MODULO.MAESTRO_GESTION);
    this.obtenerDatosGenerales();
  }

  /**
  * Método encargado de obtener los datos para la grilla de Orientacion
   */
  obtenerDatosGenerales = async () => {
    
    datoGeneralMG.datosGeneralesMaestroGestion().then((responseDatoGeneral) => {      
        var data = [];
        var acceso = "";
        if (responseDatoGeneral.data.codigoRespuesta == 200)
        {
          
          this.props.listarItem(responseDatoGeneral.data.data);
          if(responseDatoGeneral.data.data.listProgramaUnidad.length>0 ){

            responseDatoGeneral.data.data.listProgramaUnidad.map(function(a) {
              if(a.prg_nombre==="ACCILIMGESCA"){
                acceso = "ACCILIMGESCA";
              }
              
            });
              
            if(acceso==="ACCILIMGESCA")
                this.props.setShowButtonsAsignacionMG();
           
          }//fin if listProgramaUnidad
        }else{
          this.props.listarItem(data);
        }
 
    });
  }
}

IndexMaestroGestion.propTypes = {
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
  listarItem(dataMaestroGestion) {
    dispatch({
      type: ACCION.LISTAR_ITEMMG,
      payload: {"maestroGestion": dataMaestroGestion }
    })

  },
  setShowButtonsAsignacionMG() {
    dispatch({
        type: ACCION.SET_BUTTONS_ASIGNACIONMG
    })
  },

});
const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndexMaestroGestion);
export { VistaRedux as RIndexVistaMaestroGestion };