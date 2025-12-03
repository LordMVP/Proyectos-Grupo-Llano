import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';
import { formatearArray } from '../../../../global/util_nominaciones';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { CLASES_UNIDADES } from '../../../../global/constantes';

import { RConsultaMercadosRelevantes } from '../ConsultaMercadosRelevantes';
import './GestionMercadosRelevantes.scss';

class GestionMercadosRelevantes extends Component {

  state = {
    mostrarModalConsulta: false,

    idMercado: null,
    codigoMercadoCreg: '',
    nombreMercado: '',
    codigoDane: '',
    codigoMunicipioCreg: '',
    codigoMercado: '',
    tipoInyeccion: '',
    consultasTerminadas: false,
    tiposInyeccion: []
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }

    axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { criterio: '', idClase: CLASES_UNIDADES.TIPO_INYECCION })
      .then(respuesta => {
        if (respuesta.data.codigo >= 0) {
          this.setState({ tiposInyeccion: formatearArray(respuesta.data.datos), consultasTerminadas: true })
        }
      });
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

      idMercado: null,
      codigoMercadoCreg: '',
      nombreMercado: '',
      codigoDane: '',
      codigoMunicipioCreg: '',
      codigoMercado: '',
      tipoInyeccion: ''
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
    const {
      codigoMercadoCreg,
      nombreMercado,
      codigoDane,
      codigoMunicipioCreg,
      codigoMercado,
      tipoInyeccion
    } = this.state;

    const requeridos = [
      codigoMercadoCreg,
      nombreMercado,
      codigoDane,
      codigoMunicipioCreg,
      codigoMercado,
      tipoInyeccion
    ];

    if (!Util.validarStringsRequeridos(requeridos)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Todos los datos son requeridos.' } };
    }

    if (tipoInyeccion === '-1') {
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

    const {
      idMercado,
      codigoMercadoCreg,
      nombreMercado,
      codigoDane,
      codigoMunicipioCreg,
      codigoMercado,
      tipoInyeccion
    } = this.state;

    const entidadGuardar = {
      merIderegistro: idMercado,
      merCodrelevante: codigoMercado,
      merNombre: nombreMercado,
      merCoddane: codigoDane,
      merCodmunicreg: codigoMunicipioCreg,
      merCodcreg: codigoMercadoCreg,
      uniIdetipoinyeccion: {
        uniIderegistro: tipoInyeccion
      }
    }

    axios.post(RUTAS_API.PARAMETRIZACION.MERCADOS_RELEVANTES.GUARDAR_MERCADOS_RELEVANTES, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventanda modal del boton de consulta
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
   * Método encargado de abrir la ventana modal del botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de llenar el formulario con los datos seleccionados
   * @param {Object} entidad Datos del mercado relevante seleccionado
   */
  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,

      idMercado: entidad.merIderegistro,
      codigoMercado: entidad.merCodrelevante,
      nombreMercado: entidad.merNombre,
      codigoDane: entidad.merCoddane,
      codigoMunicipioCreg: entidad.merCodmunicreg,
      codigoMercadoCreg: entidad.merCodcreg,
      tipoInyeccion: entidad.uniIdetipoinyeccion.uniIderegistro
    });
  };

  /**
   * Método encargado de mostrar el formulario
	 * @returns {Object}
   */
  render() {
    if (!this.state.consultasTerminadas) {
      return (<p className='text-center'>Cargando...</p>);
    }

    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />

        <div className='conf-general row mt-5'>

          <Input
            label='Código de Mercado (CREG):'
            value={this.state.codigoMercadoCreg}
            onChange={this.controlarCambio}
            name='codigoMercadoCreg'
          />

          <Input
            label='Nombre Mercado:'
            value={this.state.nombreMercado}
            onChange={this.controlarCambio}
            name='nombreMercado'
          />

          <Input
            label='Código DANE:'
            value={this.state.codigoDane}
            onChange={this.controlarCambio}
            name='codigoDane'
          />

          <Input
            label='Código Mercado Tarifas:'
            value={this.state.codigoMunicipioCreg}
            onChange={this.controlarCambio}
            name='codigoMunicipioCreg'
          />

          <Input
            label='Código Mercado Relevante:'
            value={this.state.codigoMercado}
            onChange={this.controlarCambio}
            name='codigoMercado'
          />

          <Combo
            opciones={this.state.tiposInyeccion}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo Inyección:'
            name='tipoInyeccion'
            value={this.state.tipoInyeccion}
            onChange={this.controlarCambio}
          />

        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Consultar Mercados Relevantes'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaMercadosRelevantes esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionMercadosRelevantes.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionMercadosRelevantes);

export { VistaRedux as RGestionMercadosRelevantes };
