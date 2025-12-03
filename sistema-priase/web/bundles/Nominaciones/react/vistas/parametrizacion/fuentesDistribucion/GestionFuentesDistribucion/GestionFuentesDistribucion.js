import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, VentanaModal } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';

import { RConsultaFuentesDistribucion } from '../ConsultaFuentesDistribucion';
import './GestionFuentesDistribucion.scss';

const tiposFuentes = [
  { id: 'S', nombre: 'Suministro' },
  { id: 'T', nombre: 'Transporte' }
];

class GestionFuentesDistribucion extends Component {

  state = {

    // Datos de la entidad
    idFuente: null,
    nombreFuente: '',
    codigoGestor: '',
    tipoFuente: '-1',

    // Estado de la aplicacion
    mostrarModalConsulta: false

  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  }

  /**
   * Método encargado de limpiar el formulario editar al momento de salir
   */
  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  }

  /**
   * Método encargado de limpiar los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      idFuente: null,
      nombreFuente: '',
      codigoGestor: '',
      tipoFuente: '-1',

      // Estado de la aplicacion
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de limpiar el formulario al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  }

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
    const { nombreFuente, tipoFuente, codigoGestor } = this.state;

    if (nombreFuente.trim().length === 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe digitar un nombre de Fuente de Distribución.' } };
    }

    if (tipoFuente === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tipo de fuente de distribución.' } };
    }

    if (tipoFuente === 'S' && codigoGestor.trim().length === 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe digitar un Código o Identificación Plataforma.' } };
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

    const entidadGuardar = {
      uniIderegistro: this.state.idFuente,
      uniNombre1: this.state.nombreFuente.trim(),
      uniPropiedad: JSON.stringify({
        tipo: this.state.tipoFuente,
        codigo: this.state.codigoGestor.trim()
      })
    }

    axios.post(RUTAS_API.CONFIGURACION.FUENTES_DISTRIBUCION.GUARDAR_FUENTES_DISTRIBUCION, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventana modal del boton de consulta
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
   * Método encargado de cerrar la ventana modal del botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de llenar el formulario con la fuente de distribución seleccionada
   */
  cargarDatos = (entidad) => {
    const propiedad = entidad.uniPropiedad;
    this.setState({
      mostrarModalConsulta: false,
      // Cargar datos de la entidad
      idFuente: entidad.uniIderegistro,
      nombreFuente: entidad.uniNombre1,
      codigoGestor: propiedad.codigo || '',
      tipoFuente: propiedad.tipo,
    });
  };

  /**
   * Método encargado de mostrar el formulario
	 * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>

        <div className='conf-general row mt-5'>
          <Input
            label='Nombre:'
            value={this.state.nombreFuente}
            onChange={this.controlarCambio}
            name='nombreFuente'
          />

          <Combo
            opciones={tiposFuentes}
            propTexto='nombre'
            propValor='id'
            label='Tipo de Fuente:'
            name='tipoFuente'
            value={this.state.tipoFuente}
            onChange={this.controlarCambio}
          />

          <Input
            label='Código Plataforma:'
            value={this.state.codigoGestor}
            onChange={this.controlarCambio}
            name='codigoGestor'
          />
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Consultar Fuentes de Distribución'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaFuentesDistribucion esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>
      </Fragment>
    );
  }
}

GestionFuentesDistribucion.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionFuentesDistribucion);

export { VistaRedux as RGestionFuentesDistribucion };
