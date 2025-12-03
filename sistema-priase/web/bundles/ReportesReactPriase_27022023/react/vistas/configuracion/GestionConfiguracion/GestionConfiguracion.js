import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { RConsultaConfiguracion } from '../ConsultaConfiguracion';
import { Input, Combo, Botonera, VentanaModal, Util } from 'appfuture-react';
import {
  consultarConfiguraciones,
  consultarConfiguracionesTipo,
  consultarTiposConfiguraciones
} from '../../../store/actions/ConfiguracionAcciones';

import { mostrarAlerta, ocultarAlerta } from '../../../store/actions/AplicacionAcciones';
import RUTAS_API from '../../../global/rutas_api';
import '../GestionConfiguracion/GestionConfiguracion.scss';

class GestionConfiguracion extends Component {

  state = {
    idRegistro: null,
    configuracion: -1,
    nombre: '',
    codigo: '',
    mostrarModal: false,
    inhabilitado: false
  };

  /**
   * Método encargado de ejecutar una o varias acciones al momento de cargar la interfaz.
   */
  componentDidMount() {
    if (!Util.validarArreglo(this.props.tiposConfiguracion)) {
      this.props.consultarTiposConfiguraciones();
    }
    const { state } = this.props.history && this.props.history.location;
    if (state && state.configuracionEditar) {
      this.onSeleccionarConfiguracion(state.configuracionEditar);
    }
  }

  /**
   * Método encargado de controlar el cambio en el valor de los campos del formulario.
   * @param {Event} evento Evento ejecutado en el control de usuario.
   */
  controlarCambio = (evento) => {
    const nombrePropiedad = evento.target.name;
    const valorPropiedad = evento.target.value;
    const cambio = {};
    cambio[nombrePropiedad] = valorPropiedad;
    this.setState(cambio);
  };

  /**
   * Método encargado de guardar la entidad.
   * @returns {bool}
   */
  guardarConfiguracion = () => {
    const { codigo, nombre, configuracion } = this.state;
    if (configuracion === -1) {
      this.props.mostrarAlerta('Información Incompleta', 'Debe seleccionar un tipo de configuración.');
      return;
    }
    if (!Util.validarStringsRequeridos([nombre])) {
      this.props.mostrarAlerta('Información Incompleta', 'El nombre es obligatorio');
      return;
    }
    const params = {
      'uniIderegistro': this.state.idRegistro,
      'uniNombre1': nombre,
      'estIderegistro': {
        'estIderegistro': configuracion
      },
      uniPropiedad: JSON.stringify({
        codigo: this.state.codigo
      })
    };
    const contexto = this;
    axios.post(RUTAS_API.CONFIGURACION.REGISTRAR, params)
      .then(respuesta => {
        if (respuesta.data.codigo < 0) {
          return;
        }
        contexto.limpiarFormulario();
      })
      .catch(error => {
        console.log(error);
      });
  };

  /**
   * Método encargado de abrir la ventana modal para consultar la configuración básica.
   */
  consultarConfiguraciones = () => {
    this.setState({
      mostrarModal: true
    });
  };

  /**
   * Método encargado de limpiar los campos del formulario.
   */
  limpiarFormulario = (evento) => {
    this.setState({
      configuracion: -1,
      nombre: '',
      codigo: '',
      idRegistro: '',
      inhabilitado: false
    });
    this.limpiarEstadoRouter();
  };

  /**
   * Método encargado de limpiar los props.
   */
  limpiarEstadoRouter = () => {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.configuracionEditar) {
      this.props.history.replace({ ...this.props.history.location, configuracionEditar: null });
    }
  };

  /**
   * Método encargado de limpiar los campos del formulario al momento de cambiar de interfaz.
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  }

  /**
   * Método encargado de mostrar los botones del componente Botonera.
   * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarConfiguracion },
      { texto: 'Consultar', callback: this.consultarConfiguraciones },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de cerrar la ventana modal para consultar la configuración básica.
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModal: false
    });
  };

  /**
   * Método encargado de cargar los datos de la configuración que se desea modificar.
   */
  onSeleccionarConfiguracion = (configuracion) => {
    const uniPropiedad = configuracion.uniPropiedad;
    const codigo = (!uniPropiedad) ? '' : JSON.parse(uniPropiedad).codigo || '';
    this.setState({
      mostrarModal: false,
      configuracion: configuracion.estIderegistro.estIderegistro,
      nombre: configuracion.uniNombre1,
      codigo: codigo,
      idRegistro: configuracion.uniIderegistro,
      inhabilitado: true
    });
  };

  /**
   * Método encargado de mostrar los campos de la interfaz
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className="conf-general row mt-5">
          <Combo
            opciones={this.props.tiposConfiguracion}
            propTexto='estNombre'
            propValor='estIderegistro'
            label='Tipo de Configuración:'
            value={this.state.configuracion}
            cols={4}
            name='configuracion'
            onChange={this.controlarCambio}
            extra={{ disabled: this.state.inhabilitado }}
          />
          <Input
            label='Nombre:'
            cols={4}
            placeholder='Nombre Configuración'
            value={this.state.nombre}
            name='nombre'
            onChange={this.controlarCambio}
          />
          <Input
            label='Código:'
            cols={4}
            placeholder='Código Configuración'
            value={this.state.codigo}
            name='codigo'
            onChange={this.controlarCambio}
          />
        </div>
        <VentanaModal
          mostrar={this.state.mostrarModal}
          titulo={'Consulta de Configuraciones'}
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaConfiguracion esModal seleccionarConfiguracion={this.onSeleccionarConfiguracion} />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionConfiguracion.propTypes = {
  history: PropTypes.object,
  configuracion: PropTypes.object,
  tiposConfiguracion: PropTypes.array,
  consultarConfiguraciones: PropTypes.func,
  consultarConfiguracionesTipo: PropTypes.func,
  consultarTiposConfiguraciones: PropTypes.func,
  mostrarAlerta: PropTypes.func,
  ocultarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return {
    configuracion: state.configuracion.data,
    error: state.configuracion.error,
    tiposConfiguracion: state.configuracion.tiposConfiguracion || []
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    consultarConfiguraciones,
    consultarConfiguracionesTipo,
    consultarTiposConfiguraciones,
    mostrarAlerta,
    ocultarAlerta
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionConfiguracion);

export { VistaRedux as RGestionConfiguracion };
