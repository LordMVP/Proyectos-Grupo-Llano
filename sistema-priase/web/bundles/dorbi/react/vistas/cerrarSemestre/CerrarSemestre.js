import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha } from 'appfuture-react';
import axios from 'axios';
import { formatearArray } from '../../global/util_nominaciones';
import RUTAS_API from '../../global/rutas_api';
import { mostrarAlerta } from '../../store/actions/AplicacionAcciones';
import './CerrarSemestre.scss';

class GestionCerrarSemestre extends Component {

  state = {
    // Datos de la entidad
    regimen: '',
    semestre: '',
    listaRegimen: [],
    listaSemestre: []
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    this.consultarRegimen();
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
  };

  /**
   * Método encargado de consultar los regimenes tarifarios.
   */
  consultarRegimen = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.CONSULTAR_REGIMEN_TARIFARIO, { criterio: '' })
      .then(respuesta => {
        this.setState({ listaRegimen: respuesta.data.datos });
      });
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      regimen: '',
      semestre: '',
      listaSemestre: [],
    });
  };

  /**
   * Método encargado de limpiar los datos del formulario al momento de cambiar de interfaz.
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
      { texto: 'Cerrar Semestre', callback: this.cerrarSemestre },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { regimen, semestre } = this.state;
    if (regimen <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un régimen tarifario.' } };
    }
    if (semestre <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un semestre.' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  cerrarSemestre = () => {
    const { regimen, semestre } = this.state;
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const parametros = {
      idRegimen: regimen,
      idPeriodo: semestre
    }

    axios.post(RUTAS_API.CALCULO_TARIFAS.CERRAR_SEMESTRE.CERRAR_PERIODO_SEMESTRAL, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    let { name, value } = evento.target;
    change[name] = value;
    if (name == 'regimen') {
      this.consultarPeriodos(value);
    }
    this.setState(change);
  };

  /**
   * Método encargado de consultar los periodos semestrales por régimen tarifario
   * @param {Number} idRegimen Identificador del régimen tarifario.
   * @returns {boolean}
   */
  consultarPeriodos = async (idRegimen) => {
    if (idRegimen == '' || idRegimen == null) {
      this.setState({ listaSemestre: [] });
      return;
    }
    const respuesta = await axios.post(RUTAS_API.PARAMETRIZACION.CARGAR_PERIODOS.CONSULTAR_PERIODOS_SEMESTRALES_REGIMEN, { idRegimen: idRegimen });
    if (respuesta.data.codigo > 0) {
      this.setState({ listaSemestre: formatearArray(this.construirObjetoPeriodos(respuesta.data.datos)) });
    }
  };

  /**
   * Método encargado de contruir un objeto con los periodos consultados.
   * @param {Object} periodos Datos de los periodos consultados.
   * @returns {Object}
   */
  construirObjetoPeriodos = (periodos) => {
    let anio;
    const lista = periodos.map((dato) => {
      anio = new Date(dato.perIdepadre.perFecinicial).getFullYear();
      return {
        idRegistro: dato.perIdepadre.perIderegistro,
        titulo: `${dato.perIdepadre.perNombre}-${anio}`
      }
    });
    return lista;
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
          <Combo
            opciones={this.state.listaRegimen}
            propTexto='rgtaNombre'
            propValor='rgtaIderegistro'
            label='Régimen Tarifario'
            name='regimen'
            value={this.state.regimen}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaSemestre}
            propTexto='titulo'
            propValor='idRegistro'
            label='Semestre:'
            name='semestre'
            value={this.state.semestre}
            onChange={this.controlarCambio}
          />
        </div>
      </Fragment>
    );
  };
}

GestionCerrarSemestre.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionCerrarSemestre);

export { VistaRedux as RGestionCerrarSemestre };
