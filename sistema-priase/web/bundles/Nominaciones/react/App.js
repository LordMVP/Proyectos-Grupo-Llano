import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { mostrarCargador, ocultarAlerta, ocultarProgramaModal } from './store/actions/AplicacionAcciones';
import { Cargador, Util, VentanaModal } from 'appfuture-react';
import { MenuLayout } from './hoc/MenuLayout';
import Modal from 'react-bootstrap4-modal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

import RUTAS_VISTA from './global/rutas_vista';
import RUTAS_API from './global/rutas_api';

import config from './config';
import { RGestionLogin } from './vistas/login/GestionLogin';

class App extends Component {

  peticionesActivas = 0;
  programaActual = null;

  state = {
    opcionesMenu: [],
    sesion: null,
    listaEmpresas: [],
  };

  constructor(props) {
    super(props);
    const contexto = this;
    const { mostrarCargador } = props;

    const token = getToken();
    axios.interceptors.request.use(
      (axiosConfig) => {
        const tokenConsultaConfiguracion = token;
        axiosConfig.headers["Authorization"] = tokenConsultaConfiguracion;
        axiosConfig.headers["Access-Control-Allow-Origin"] = "*";
        axiosConfig.headers["Access-Control-Allow-Headers"] = "*";
        axiosConfig.headers["Access-Control-Allow-Credentials"] = "true";
        axiosConfig.headers["Access-Control-Allow-Methods"] = "*";
        axiosConfig.headers["Access-Control-Max-Age"] = "1209600";
        axiosConfig.headers.token = "123";
        axiosConfig.headers.route_url_origin = window.location.href;
        if (this.programaActual) {
          const idPrograma = this.programaActual.prgIderegistro.prgIderegistro;
          axiosConfig.headers.idPrograma = idPrograma;
          if (!axiosConfig.data) {
            axiosConfig.data = {};
          }
          axiosConfig.data.idPrograma = idPrograma;
        }
        axiosConfig.baseURL = URL_AXIOS;
        this.peticionesActivas++;
        // TO DO: Verificar que axiosConfig.configuracion exista cuando se guardan contratos temporales
        const cargadorSegundoPlano = true; // (axiosConfig.configuracion && axiosConfig.configuracion.segundoPlano);
        mostrarCargador(cargadorSegundoPlano);

        return axiosConfig;
      },
      (error) => {
        mostrarCargador(false);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        contexto.reducirPeticionesActivas();
        // TODO: Verificar cómo se pueden evitar los toast de acuerdo a la configuración de axios
        contexto.mostrarToast(response);
        if (response.codigo < 0) {
          throw Promise.reject(response);
        }
        return response;
      },
      (error) => {
        contexto.reducirPeticionesActivas();
        return Promise.reject(error);
      }
    );
    this.ejecutarTransacciones();
  }
  /**
   * Ejecutar transacciones...
   */
  ejecutarTransacciones = () => {
    if (location.pathname.search('login') >= 0) {
      return;
    }
    this.consultarSesion();
    this.consultarNotificaciones();
  };

  /**
   * Método encargado de consultar las notificaciones de los terceros
   */
  consultarNotificaciones = () => {
    axios.post(RUTAS_API.ALERTAS.CONSULTAR_NOTIFICACIONES_USUARIO)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.mostrarAlertaNotificacion(true, respuesta.data.datos);
        }
      });
  };

  /**
  * Consulta la sesión actual...
  */
  consultarSesion = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_MENU.OBTENER_SESION, { criterio: '' })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ sesion: respuesta.data.datos });
        }
      });
  };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente
   * @param {Boolean}
   */
  componentDidMount() {
    if (config.cargarMenuReal && location.pathname.search('login') < 0) {
      axios(RUTAS_API.MENU.CONSULTAR_MENU, null)
        .then(respuesta => {
          if (respuesta.data.codigo > 0) {
            const datos = respuesta.data.datos;
            this.setState({ opcionesMenu: datos });
          }
        });
      return;
    }
    this.setState({ opcionesMenu: [] });
  }

  reducirPeticionesActivas = () => {
    this.peticionesActivas--;
    if (this.peticionesActivas <= 0) {
      this.peticionesActivas = 0;
      this.props.mostrarCargador(false);
    }
  };

  /**
   * Métoodo encargado de controlar el pop up generico para las peticiones ejecutadas
   * @param {Object} respuesta Respuesta generica de back
   */
  mostrarToast = (respuesta) => {
    const opciones = {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    };

    const data = respuesta.data;
    const url = window.location.href;
    if (data.error || data.codigo === undefined) {
      toast.error('Ocurrió un error inesperado, intente de nuevo más tarde.', opciones);
      return;
    }

    if (data.codigo < 0) {
      toast.error(data.mensaje, opciones);
      if (data.codigo == -2) {
        const tipoUsuario = localStorage.getItem('tipoUsuario');
        if (tipoUsuario && tipoUsuario === 'EXTERNO') {
          location.href = '/achagua/sistema/web/app.php/nominaciones/login';
          return;
        }
        location.href = '/achagua/index.html';
      }
      return;
    }

    if (data.codigo === 0) {
      toast.info(data.mensaje, opciones);
      return;
    }

    if (data.codigo == 2) {
      toast.success(data.mensaje, opciones);
      return;
    }

    if (url == 'http://localhost/achagua/sistema/web/app.php/nominaciones/gestion_contratos') {
      return;
    }

    if (data.codigo > 0) {
      if (!Util.validarArreglo(data.datos)) {
        toast.success(data.mensaje, opciones);
      }
      return;
    }
  };

  /**
   * Método encargado de renderizar el pop up en todos los programas
   * @returns {JSX}
   */
  renderToast = () => {
    return (
      <ToastContainer
        position="top-right"
        autoClose={4500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    );
  };

  /**
   * Método encargado de mostrar los botones del componente modal
   * @param {Object} botoenes Objeto con los botones
   */
  renderBotones = botones => {
    const contexto = this;
    if (!Util.validarArreglo(botones)) {
      return (
        <button type="button" className='btn btn-primary' onClick={() => contexto.props.ocultarAlerta()}>
          Aceptar
        </button>
      );
    }
    return botones.map((btn, index) => {
      let callback = this.props.ocultarAlerta;
      if (btn.callback) {
        callback = () => {
          contexto.props.ocultarAlerta();
          btn.callback();
        };
      }

      if (!btn.clase) {
        btn.clase = 'btn-default';
      }

      return (
        <button type="button" key={index} className={`btn ${btn.clase}`} onClick={callback}>
          {btn.texto}
        </button>
      );
    });

  };

  renderAlerta = () => {
    const { titulo, texto, botones, mostrar } = this.props.alerta;
    return (
      <Modal visible={mostrar}>
        <div className="modal-header">
          <h4 className="modal-title"><b>{titulo}</b></h4>
        </div>
        <div className="modal-body">
          <div>{texto}</div>
        </div>
        <div className="modal-footer">
          {this.renderBotones(botones)}
        </div>
      </Modal>
    );
  };

  /**
  * Buscará un programa por ruta.
  * @param {array} lista
  * @param {string} ruta
  * @return {object} programa
  */
  obtenerPrograma = (lista, ruta) => {
    if (!Util.validarArreglo(lista)) {
      return null;
    }
    let programa = '';
    this.buscarPrograma(lista, ruta, (p) => {
      programa = p;
    });
    return programa;
  };

  /**
   * Buscará un programa por ruta y al finalizar si lo encuentra ejecutará un callback.
   * @param {array}
   * @param {string} ruta
   * @param {function} callback
   */
  buscarPrograma = (lista, ruta, callback) => {
    lista.filter(p => {
      if ((p.prgIderegistro.prgLocaliza) && p.prgIderegistro.prgLocaliza.endsWith(ruta)) {
        if (typeof callback === 'function') {
          callback(p);
        }
      } else if (p.menuItem) {
        this.buscarPrograma(p.menuItem, ruta, callback);
      }
    });
  };

  /**
   * Obtiene la información de un componente especifico verificando si existe en la lista de rutas vista.
   * @return {object}
   */
  obtenerInformacionComponente = (componente) => {
    let titulo = 'Permisos insuficientes';
    let permitido = false;

    for (const key in RUTAS_VISTA) {
      const wrap = RUTAS_VISTA[key].componente.WrappedComponent;
      if (wrap && componente && componente.type && componente.type.WrappedComponent) {
        if (wrap.name === componente.type.WrappedComponent.name) {
          const ruta = RUTAS_VISTA[key].url.substring(1);
          const programa = this.obtenerPrograma(this.state.opcionesMenu, ruta);
          if (programa !== -1 && programa) {
            permitido = true;
            titulo = programa.opcNombre;
            return { titulo, permitido };
          }
        }
      }
    }
    return { titulo, permitido };
  };

  /**
   * Método encargado de renderizar el componente modal
   * @returns {Component}
   */
  renderProgramaModal = () => {
    if (!this.props.programaModal) {
      return null;
    }

    const { callbackCierre, componente, mostrar } = this.props.programaModal;
    const infoComponente = this.obtenerInformacionComponente(componente);

    let componenteRenderizar = componente;
    if (!infoComponente.permitido) {
      componenteRenderizar = (<div className='text-center mt-5'>Usted no tiene permisos para acceder a este programa o funcionalidad.</div>);
    }
    const callbackCerrarModal = () => {
      if (callbackCierre && typeof callbackCierre === 'function') {
        // Si no se pasa la función de callback para el cierre del modal, se hace una función mock
        callbackCerrarModal();
      }
      this.props.ocultarProgramaModal();
    };

    return (
      <VentanaModal
        mostrar={mostrar}
        titulo={infoComponente.titulo}
        cerrarModal={callbackCerrarModal}
      >
        {componenteRenderizar}
      </VentanaModal>
    )
  };

  /**
   * Renderiza el componente Login.
   * @returns {JSX}
   */
  renderLogin = () => {
    return (
      <Fragment>
        <RGestionLogin />
        {this.renderAlerta()}
        {this.renderToast()}
      </Fragment>
    );
  };




  /**
   * Método encargado de mostrar el layour del componente menú
   * @returns {Component}
   */
  renderLayout = () => {
    if (!Util.validarArreglo(this.state.opcionesMenu) || !this.state.sesion) {
      return null;
    }

    return (<MenuLayout
      titulo='Index'
      rutasVista={RUTAS_VISTA}
      opcionesMenu={this.state.opcionesMenu}
      sesion={this.state.sesion}
      actualizarProgramas={this.props.actualizarProgramas}
    />);
  };

  /**
   * Método encargado de controlar el pop up de alertas
   * @param {Boolean} estado Estado de la alerta (activo/inactivo)
   * @param {Array} datos Alertas generadas
   */
  mostrarAlertaNotificacion = (estado, datos = null) => {
    this.setState({
      mostrarAlertaNotificacion: estado,
      alerta: datos,
    });
  };

  /**
   * Método encargado de redireccionar a la interfaz de detalle de notificación
   */
  verDetallesNotificaciones = () => {
    this.props.history.push({
      pathname: RUTAS_VISTA.GESTION_NOTIFICACIONES.url,
    });
  };

  /**
   * Método encargado de mostrar el pop up de la notificación
   * @returns {JSX}
   */
  renderNotificacion = () => {
    if (!this.state.mostrarAlertaNotificacion) {
      return null;
    }
    return (
      <div className='alerta-actividad'>
        <div className='header'>
          <a onClick={() => this.mostrarAlertaNotificacion(false)} className='close' >&times;</a>
          <label>{`+${this.state.alerta.length} ${this.state.alerta.length > 1 ? 'Notificaciones' : 'Notificación'}`}</label>
        </div>
        <div className='body' onClick={this.verDetallesNotificaciones}>
          <span className='icon'><i className='fa fa-fw fa-bell'></i></span>
          <span className='detalle'>{`Tiene ${this.state.alerta.length} ${this.state.alerta.length > 1 ? 'notificaciones' : 'notificación'}.`}</span>
        </div>
      </div>
    );
  };

  /**
   * Método de react encargado de mostrar los elementos JSX que se quieran mostrar
   * @returns {JSX}
   */
  render() {
    if (location.pathname.indexOf('login') >= 0) {
      return (
        <Fragment>
          {this.renderLogin()}
          <Cargador visible={this.props.appCargando} />
        </Fragment>
      );
    }

    return (
      <div>
        <Cargador visible={this.props.appCargando} />
        {this.renderNotificacion()}
        {this.renderToast()}
        {this.renderAlerta()}
        {this.renderProgramaModal()}
        {this.renderLayout()}
      </div>
    );
  }

}

App.propTypes = {
  esAutenticado: PropTypes.bool,
  mostrarCargador: PropTypes.func,
  ocultarAlerta: PropTypes.func,
  ocultarProgramaModal: PropTypes.func,
  appCargando: PropTypes.bool,
  alerta: PropTypes.object,
  programaModal: PropTypes.object,
  programas: PropTypes.array
};

const mapStateToProps = state => {
  return {
    esAutenticado: true,
    appCargando: !!state.app.appCargando,
    alerta: state.app.alerta,
    programaModal: state.app.programaModal || null,
    programas: state.app.programas || []
  };
};

const mapDispatchToProps = dispatch => bindActionCreators(
  { mostrarCargador, ocultarAlerta, ocultarProgramaModal }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
