import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';

import './GestionInformacionOperativa.scss';

class GestionInformacionOperativa extends Component {

  state = {
    // Datos de la entidad
    listaSeleccionados: [],
    listaContratos: [],
    listaOpciones: [],
    fechaIniEvento: '',
    fechaFinEvento: '',
    campo: '',
    campoSeleccionado: '',
    // Estado de la aplicacion
    mostrarModalConsulta: false,
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
   * Método encargado ejecutar una acción cuando se elimina el componente
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
      // Datos de la entidad
      listaSeleccionados: [],
      fechaIniEvento: '',
      fechaFinEvento: '',
      campo: '',
      campoSeleccionado: '',
      // Estado de la aplicacion
      mostrarModalConsulta: false,
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
      { texto: 'Generar Archivo CSV', callback: this.generarArchivo },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    // Ejemplo Validacion
    if (false) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un cargo de tipo AO&M para poder continuar.' } };
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
      // Asignar datos de la entidad
    }

    // Reemplazar con ruta del Endpoint para guardar
    axios.post(RUTAS_API.XXXXXX, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   *
   */
  generarArchivo = () => {

  };

  /**
   * Método encargado de abrir la ventana modal del boton consulta
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
   * Método encargado de cerrar la ventana modal del boton consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de cargar los datos de la ventana modal de consulta
   * @param {Object} entidad Datos seleccionados de la consulta
   */
  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,
      // Cargar datos de la entidad
      // ...
    });
  };

  /**
   * Método encargado de obtener un arreglo con la diferencia de campos
   * @param {Object} listaCamposConsulta Campos del reporte seleccionado
   */
  diferenciaCampos = (listaCamposConsulta) => {
    const { listaOpciones } = this.state;
    for (let index = 0; index < listaCamposConsulta.camposseleccionados.length; index++) {
      const campoSeleccionado = listaCamposConsulta.camposseleccionados[index];
      for (let e = 0; e < listaOpciones.camposseleccionados.length; e++) {
        const opciones = listaOpciones.camposseleccionados[e];
        if (campoSeleccionado.valor == opciones.valor) {
          listaOpciones.camposseleccionados.splice(e, 1);
        }
      }
    }
    this.setState({ listaOpciones: listaOpciones });
  };

  /**
   * Método encargado de agregar todos los campos a la lista de seleccionados
   * @returns {bool}
   */
  agregarTodos = () => {
    let { listaSeleccionados, listaOpciones } = this.state;
    const length = listaOpciones.camposseleccionados.length;
    const camposseleccionados = [];
    if (!Util.validarArreglo(listaOpciones.camposseleccionados)) {
      return false
    }
    for (var i = 0; i < length; i++) {
      listaSeleccionados.push({
        alias: listaOpciones.camposseleccionados[i].alias,
        valor: listaOpciones.camposseleccionados[i].valor,
        secuencia: listaOpciones.camposseleccionados[i].secuencia,
      });
    }
    this.setState({ listaSeleccionados: listaSeleccionados, listaOpciones: { camposseleccionados } });
  };

  /**
   * Método encargado de agregar el campo seleccionado a la lista de seleccionados
   * @returns {bool}
   */
  agregarCampo = () => {
    let { listaSeleccionados, listaOpciones, campo } = this.state;
    const valorCampoSeleccionado = listaOpciones.camposseleccionados.find(p => campo == p.valor);
    const indexSeleccionado = listaSeleccionados.findIndex(p => campo == p.valor);
    const index = listaOpciones.camposseleccionados.findIndex(p => campo == p.valor);
    if (campo === '' || campo === '-1') {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar un campo primero');
      return false
    }
    if (indexSeleccionado >= 0) {
      this.props.mostrarAlerta('Alerta', 'El campo seleccionado ya se encuentra en la lista');
      return false
    }
    listaSeleccionados.push({
      alias: valorCampoSeleccionado.alias,
      valor: campo,
      secuencia: valorCampoSeleccionado.secuencia
    });
    listaOpciones.camposseleccionados.splice(index, 1);
    this.setState({ listaSeleccionados: listaSeleccionados, listaOpciones: listaOpciones, campoSeleccionado: '', campo: '' });
  };

  /**
   * Método encargado de quitar de la el campo seleccionado
   * @returns {bool}
   */
  quitarCampo = () => {
    let { listaSeleccionados, listaOpciones, campoSeleccionado } = this.state;
    const valorCampoSeleccionado = listaSeleccionados.find(p => campoSeleccionado == p.valor);
    const indexSeleccionado = listaOpciones.camposseleccionados.findIndex(p => campoSeleccionado == p.valor);
    const index = listaSeleccionados.findIndex(p => campoSeleccionado == p.valor);
    if (!Util.validarArreglo(listaSeleccionados)) {
      this.props.mostrarAlerta('Atención', 'Primero debe agregar un campo');
      return false
    }
    if (campoSeleccionado === '' || campoSeleccionado === '-1') {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar un campo primero');
      return false
    }
    if (indexSeleccionado >= 0) {
      this.props.mostrarAlerta('Alerta', 'El campo seleccionado ya se encuentra en la lista');
      return false
    }
    listaOpciones.camposseleccionados.push({
      alias: valorCampoSeleccionado.alias,
      valor: campoSeleccionado,
      secuencia: valorCampoSeleccionado.secuencia,
    });
    listaSeleccionados.splice(index, 1);
    this.setState({ listaSeleccionados: listaSeleccionados, listaOpciones: listaOpciones, campoSeleccionado: '', campo: '' });
  };

  /**
   * Método encargado de eliminar todos los campos a la lista de seleccionados
   * @returns {bool}
   */
  quitarTodos = () => {
    let { listaSeleccionados, listaOpciones } = this.state;
    if (!Util.validarArreglo(listaSeleccionados)) {
      return false
    }
    for (var i = 0; i < listaSeleccionados.length; i++) {
      listaOpciones.camposseleccionados.push({
        alias: listaSeleccionados[i].alias,
        valor: listaSeleccionados[i].valor,
        secuencia: listaSeleccionados[i].secuencia,
      });
    }
    this.setState({ listaSeleccionados: [], listaOpciones: listaOpciones });
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
          <Fecha
            label='Fecha inicial del evento:'
            name='fechaIniEvento'
            fecha={this.state.fechaIniEvento}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha inicial del evento:'
            name='fechaIniEvento'
            fecha={this.state.fechaIniEvento}
            onChange={this.controlarCambio}
          />
        </div>
        <div className='conf-general row mt-5'>
          <Combo
            opciones={this.state.listaOpciones.camposseleccionados}
            propTexto='alias'
            propValor='valor'
            label='Campos del Contrato'
            onChange={this.controlarCambio}
            size={12}
            value={this.state.campo}
            name='campo'
          />

          <div className='col-2 mt-20 divBotones'>
            <div className='col-2'>
              <button className='btn btn-primary botones' onClick={this.agregarTodos}>Agregar Todos</button>
              <button className='btn btn-primary botones' onClick={this.agregarCampo}>Agregar Campo</button>
              <button className='btn btn-primary botones' onClick={this.quitarTodos}>Quitar Todos</button>
              <button className='btn btn-primary botones' onClick={this.quitarCampo}>Quitar Campo</button>
            </div>
          </div>
          <Combo
            opciones={this.state.listaSeleccionados}
            propTexto='alias'
            propValor='valor'
            label='Campos Seleccionados'
            onChange={this.controlarCambio}
            size={12}
            value={this.state.campoSeleccionado}
            name='campoSeleccionado'
          />
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo=''
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaInformacionOperativa esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>
      </Fragment >
    );
  };
}

GestionInformacionOperativa.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionInformacionOperativa);

export { VistaRedux as RGestionInformacionOperativa };
