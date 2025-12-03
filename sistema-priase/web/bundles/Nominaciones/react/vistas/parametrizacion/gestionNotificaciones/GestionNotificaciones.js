import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../global/rutas_api';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';

// import { RConsultaNotificaciones } from '../ConsultaNotificaciones';
import './GestionNotificaciones.scss';

const SECCIONES = {
  PRINCIPAL: 'PRINCIPAL',
  DETALLE_NOTIFICACION: 'DETALLE_NOTIFICACION'
};

class GestionNotificaciones extends Component {

  state = {
    mostrarModalConsulta: false,
    seccion: SECCIONES.PRINCIPAL
  };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente
   */
  componentDidMount() {
    this.consultarNotificaciones();
  }

  /**
   * Método encargado de consultar las notificaciones por usuario
   */
  consultarNotificaciones = () => {
    axios.post(RUTAS_API.ALERTAS.CONSULTAR_NOTIFICACIONES_USUARIO)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaNotificaciones: respuesta.data.datos });
        }
      });
  };

  /**
   * Método encargado de ejecutar acciones al desmontar el componente
   */
  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  }

  /**
   * Método encargado de limpiar los datos del formulario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      mostrarModalConsulta: false,
    });
  };

  /**
   * Método encargado de ejecutar acciones al desmontar el componente
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  }

  /**
   * Método encargado de redireccionar a la interfaz anterior
   */
  volver = () => {
    this.props.history.push({
      pathname: this.state.interfazGestion,
    });
  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de mostrar los detalles de una notificacion
   * @param {Object} notificacion Notificación a la cual se le mostrara el detalle
   * @returns {Boolean}
   */
  verDetallesNotificacion = (notificacion) => {
    if (notificacion.altnLeido == 'S') {
      this.setState({
        seccion: SECCIONES.DETALLE_NOTIFICACION,
        notifiacionActual: notificacion,
      });
      return;
    }
    notificacion.altnLeido = 'S';
    axios.post(RUTAS_API.ALERTAS.ACTUALIZAR_ESTADO_NOTIFICACION, notificacion)
    this.setState({
      seccion: SECCIONES.DETALLE_NOTIFICACION,
      notifiacionActual: notificacion,
    });

  };

  /**
   * Método encargado de parsear la fecha formato YYYY/MM/DD
   * @returns {String}
   */
  parsearFecha = (fecha) => {
    const date = new Date(fecha);
    let dia = date.getDate();
    let mes = date.getMonth();
    let anio = date.getFullYear();
    if (dia < 10) {
      dia = '0' + dia;
    }
    if (mes < 10) {
      mes = '0' + mes;
    }
    return `${anio}/${mes}/${dia}`;
  };

  /**
   * Método encargado de mostrar el formulario principal de notificaciones
   * @returns {Object}
   */
  renderTablaListaNotificaciones = () => {
    if (!Util.validarArreglo(this.state.listaNotificaciones)) {
      return null;
    }
    return (
      <Fragment>
        <div className='col-12'>
          <h2 className='text-dark'><i className='fa fa-fw fa-bell'></i> Notificaciones <span className='badge badge-primary'>{this.state.listaNotificaciones.length}</span></h2>
        </div>
        <div className='col-12'>
          <table className='table table-condensed table-hover table-bordered'>
            <thead className='bg-dark color-white'>
              <tr>
                <th>Mensaje</th>
                <th># Registros</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {Util.validarArreglo(this.state.listaNotificaciones) && this.state.listaNotificaciones.map(notificacion => {
                return (
                  <tr key={Util.generarIdControl(notificacion.altnIderegistro)} className={`cursor-pointer ${notificacion.altnLeido == 'S' ? 'tr-read' : 'tr-unread'}`} onClick={() => { this.verDetallesNotificacion(notificacion) }}>
                    <td>{notificacion.altnMensaje}</td>
                    <td>{JSON.parse(notificacion.altnRegistros).length}</td>
                    <td>{this.parsearFecha(notificacion.altnFecha)}</td>
                  </tr>
                )
              })}
              {Util.validarArreglo(this.state.listaNotificaciones)}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  };

  /**
   * Método encargado de volver al menú principal de notificaciones
   */
  volverAListaPrincipal = () => {
    this.setState({
      seccion: SECCIONES.PRINCIPAL,
      notifiacionActual: null,
    });
  };

  /**
   * Método encargado de mostrar el formulario detalle de notificación
   * @returns {JSX}
   */
  renderDetallesNotificacion = () => {
    if (!this.state.notifiacionActual) {
      return null;
    }
    let altnRegistros = this.state.notifiacionActual.altnRegistros;
    if (typeof altnRegistros === 'string') {
      altnRegistros = JSON.parse(altnRegistros);
    }
    return (
      <Fragment>
        <div className='col-12'>
          <h2 className='text-dark'>Detalles Notificación</h2>
        </div>
        <div className='col-12'>
          <table className='table table-hover table-condensed table-striped table-bordered'>
            <thead>
              <tr>
                <th>Id Registro</th>
                <th>Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {
                Util.validarArreglo(altnRegistros) && altnRegistros.map(notificacion => {
                  return (
                    <tr key={Util.generarIdControl(notificacion.idRegistro)}>
                      <td>{notificacion.idRegistro}</td>
                      <td>{notificacion.mensaje}</td>
                      <td>{this.parsearFecha(notificacion.fecha)}</td>
                    </tr>
                  );
                })
              }
              {
                !Util.validarArreglo(altnRegistros) && (
                  <tr>
                    <td colSpan={3}><i className='fa fa-fw fa-warning'></i> No hay registros.</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
        <div className='col-12'>
          <button className='btn btn-default' onClick={this.volverAListaPrincipal}>Volver</button>
        </div>
      </Fragment>
    );
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <div className='conf-general row mt-5'>
          {this.state.seccion === SECCIONES.PRINCIPAL && this.renderTablaListaNotificaciones()}
          {this.state.seccion === SECCIONES.DETALLE_NOTIFICACION && this.renderDetallesNotificacion()}
        </div>
      </Fragment>
    );
  }
}

GestionNotificaciones.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionNotificaciones);

export { VistaRedux as RGestionNotificaciones };
