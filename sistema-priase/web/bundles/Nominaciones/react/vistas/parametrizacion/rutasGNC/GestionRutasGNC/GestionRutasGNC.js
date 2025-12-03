import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';

import { RConsultaRutasGNC } from '../ConsultaRutasGNC';

const tiposRuta = [
  { valor: 'G', texto: 'GNC' },
  { valor: 'C', texto: 'Conexión' },
];
class GestionRutasGNC extends Component {

  state = {
    mostrarModalConsulta: false,

    idRuta: null,
    nombreRuta: '',
    tipoRuta: ''
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  };

  /**
   * Método encargado de limpiar el formulario editar al momento de salir
   */
  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  };

  /**
   * Método encargado de limpiar los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      mostrarModalConsulta: false,
      idRuta: null,
      nombreRuta: '',
      tipoRuta: ''
    });
  };

  /**
   * Método encargado de limpiar el formulario al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  };

  /**
   * Método encargado de generar los botones del formulario
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
	 * @returns {Object}
   */
  validarFormulario = () => {
    const {
      nombreRuta,
      tipoRuta
    } = this.state;
    if (!Util.validarStringsRequeridos([nombreRuta]) || tipoRuta === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Todos los datos son requeridos.' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de guardar los datos de la entidad
	 * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const { idRuta, nombreRuta, tipoRuta } = this.state;
    const strTipoRuta = JSON.stringify({ tipo: tipoRuta });
    const entidadGuardar = {
      uniIderegistro: idRuta,
      uniNombre1: nombreRuta,
      uniPropiedad: strTipoRuta
    }

    axios.post(RUTAS_API.CONFIGURACION.RUTAS_GNC.GUARDAR_RUTAS_GNC, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventada modal del botón de consulta
   */
  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de cerrar la ventada modal del botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de llenar el formulario con la ruta GNC seleccionada
   * @param {Object} entidad Datos de la ruta seleccionada
   */
  cargarDatos = (entidad) => {
    let tipoRuta = entidad.uniPropiedad;
    tipoRuta = tipoRuta === null || tipoRuta.length <= 0 ? '' : JSON.parse(tipoRuta).tipo;
    this.setState({
      mostrarModalConsulta: false,

      idRuta: entidad.uniIderegistro,
      nombreRuta: entidad.uniNombre1,
      tipoRuta: tipoRuta
    });
  };

  /**
  * Método encargado de mostrar el formulario
  * @returns {Object}
  */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />

        <div className='conf-general row mt-5'>
          <Input
            label='Nombre Ruta:'
            value={this.state.nombreRuta}
            onChange={this.controlarCambio}
            name='nombreRuta'
          />
          <Combo
            opciones={tiposRuta}
            propTexto='texto'
            propValor='valor'
            label='Tipo Ruta:'
            name='tipoRuta'
            value={this.state.tipoRuta}
            onChange={this.controlarCambio}
          />
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Consulta de Rutas GNC'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaRutasGNC esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionRutasGNC.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionRutasGNC);

export { VistaRedux as RGestionRutasGNC };
