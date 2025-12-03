import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { mostrarCargador, ocultarAlerta, ocultarProgramaModal } from './store/actions/AplicacionAcciones';
import { Cargador, Util, VentanaModal } from 'appfuture-react';
import Modal from 'react-bootstrap4-modal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './hoc/layout/Layout';
import axios from 'axios';

import RUTAS_VISTA from './global/rutas_vista';
import RUTAS_API from './global/rutas_api';

import config from './config';

import menu_temporal from './hoc/layout/menu_temporal';

class App extends Component {

  peticionesActivas = 0;
  programaActual = null;

  state = {
    opcionesMenu: [],
    sesion: null
  };

  constructor(props) {
    super(props);
    const contexto = this;
    const { mostrarCargador } = props;

    axios.interceptors.request.use(axiosConfig => {
      if (this.programaActual) {
        const idPrograma = this.programaActual.prgIderegistro.prgIderegistro;
        axiosConfig.headers.idPrograma = idPrograma;
        if (!axiosConfig.data) {
          axiosConfig.data = {};
        }
        axiosConfig.data.idPrograma = idPrograma;
      }
      axiosConfig.baseURL = 'api/';
      this.peticionesActivas++;
      // TO DO: Verificar que axiosConfig.configuracion exista cuando se guardan contratos temporales
      const cargadorSegundoPlano = true; // (axiosConfig.configuracion && axiosConfig.configuracion.segundoPlano);
      mostrarCargador(cargadorSegundoPlano);

      return axiosConfig;
    }, (error) => {
      mostrarCargador(false);
      return Promise.reject(error);
    });

    axios.interceptors.response.use((response) => {
      contexto.reducirPeticionesActivas();
      // TODO: Verificar cómo se pueden evitar los toast de acuerdo a la configuración de axios
      contexto.mostrarToast(response);
      if (response.codigo < 0) {
        throw Promise.reject(response);
      }
      return response;
    }, (error) => {
      contexto.reducirPeticionesActivas();
      return Promise.reject(error);
    });

    this.consultarSesion();
  }


  consultarSesion = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_MENU.OBTENER_SESION, { criterio: '' })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ sesion: respuesta.data.datos });
        }
      });
  };

  componentDidMount() {
    if (config.cargarMenuReal) {
      axios(RUTAS_API.MENU.CONSULTAR_MENU, null)
        .then(respuesta => {
          if (respuesta.data.codigo > 0) {
            this.setState({ opcionesMenu: respuesta.data.datos });
          }
        });
      return;
    }
    this.setState({ opcionesMenu: menu_temporal });
  }

  reducirPeticionesActivas = () => {
    this.peticionesActivas--;
    if (this.peticionesActivas <= 0) {
      this.peticionesActivas = 0;
      this.props.mostrarCargador(false);
    }
  };

  mostrarToast = (respuesta) => {
    const opciones = {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    };

    const data = respuesta.data;

    if (!data.mensaje) return;

    if (data.codigo == -522) {
      return;
    }

    if (data.codigo > 0) {
      toast.success(data.mensaje, opciones);
    }

    else if (data.codigo < 0) {
      toast.error(data.mensaje, opciones);
    }

    else {
      toast.info(data.mensaje, opciones);
    }
  };

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

  // Recibe un objeto con las propiedades clase, texto y callback
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

  obtenerInformacionComponente = (componente) => {
    let titulo = 'Permisos insuficientes';
    let permitido = false;

    for (const key in RUTAS_VISTA) {
      const wrap = RUTAS_VISTA[key].componente.WrappedComponent;
      if (wrap && componente && componente.type && componente.type.WrappedComponent) {
        if (wrap.name === componente.type.WrappedComponent.name) {
          const ruta = RUTAS_VISTA[key].url.substring(1);
          const index = this.props.programas.findIndex(p => p.prgIderegistro.prgLocaliza.endsWith(ruta));
          if (index !== -1) {
            permitido = true;
            titulo = this.props.programas[index].opcNombre;
            return { titulo, permitido };
          }
        }
      }
    }
    return { titulo, permitido };
  };

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

  obtenerRouter = (programa) => {
    const prgLocaliza = programa.prgIderegistro.prgLocaliza;
    const ruta = prgLocaliza.substring(prgLocaliza.lastIndexOf('/'));
    for (const llave in RUTAS_VISTA) {
      const vista = RUTAS_VISTA[llave];
      if (vista.url === ruta) {
        return (
          <Route
            path={ruta}
            component={vista.componente}
            key={programa.opcIderegistro}
            titulo={programa.opcNombre}
            exact
          />
        );
      }
    }
  };

  crearListaRouters = (lista, programas) => {
    lista.forEach(a => {
      if (a.prgIderegistro && a.prgIderegistro.prgLocaliza) {
        programas.push(this.obtenerRouter(a));
      }

      if (a.menuItem) {
        this.crearListaRouters(a.menuItem, programas);
      }
    });
  };

  obtenerProgramasPermitidos = () => {
    let programas = [];
    this.crearListaRouters(this.state.opcionesMenu, programas);
    return programas;
  };

  obtenerTituloPrograma = () => {
    const ruta = this.props.location.pathname.substring(1);
    const { programas } = this.props;
    if (ruta === '' || !Util.validarArreglo(programas)) {
      return '';
    }
    const index = programas.findIndex(p => p.prgIderegistro.prgLocaliza.endsWith(ruta));
    if (index === -1) {
      // Programa no encontrado, revisar si esto llega a acorrir
      console.log('Acceso a programa no reconocido en el menú', { ruta });
      return '';
    }

    this.programaActual = { ...programas[index] };
    return programas[index].opcNombre;
  };

  renderLayout = () => {
    if (!Util.validarArreglo(this.state.opcionesMenu) || !this.state.sesion) {
      return null;
    }

    let rutas = null;
    if (this.props.esAutenticado) {
      rutas = (
        <Switch>
          <Route path={RUTAS_VISTA.RAIZ.url} exact component={RUTAS_VISTA.RAIZ.componente} titulo='Index' />
          {this.obtenerProgramasPermitidos()}
          <Route component={RUTAS_VISTA.VISTA_NO_PERMITIDA.componente} />
        </Switch>
      );
    }

    return (
      <Layout menu={this.state.opcionesMenu} tituloPrograma={this.obtenerTituloPrograma()} sesion={this.state.sesion}>
        {rutas}
      </Layout>
    );
  };

  render() {
    return (
      <div>
        <Cargador visible={this.props.appCargando} />
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
