import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import { formatearArray, TIPOS_UNIDADES_MEDIDA } from '../../../../global/util_nominaciones';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import './GestionIngresoCompresiones.scss';
import { RConsultaCompresiones } from '../ConsultaCompresiones'
import moment from 'moment';

class GestionIngresoCompresiones extends Component {

  state = {
    // Datos de la entidad
    listaPuntosCompresion: [],
    listaMunicipios: [],
    listaUnidadMedida: [],
    puntoCompresion: '',
    municipio: '',
    cantidadComprimida: '',
    unidadMedida: '',
    fecha: '',
    idCompresion: null,
    estado: false,
    consultasTerminadas: false,
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
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_INGRESO_COMPRESIONES.CONSULTAR_PUNTO_COMPRESION),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.CANTIDAD }),
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_INGRESO_COMPRESIONES.CONSULTAR_COMPRESIONES_FECHA, { fechacompresion: '2019-05-10' }),
    ];
    axios.all(peticiones)
      .then(axios.spread((puntosCompresion, unidadesMedida) => {
        const datosAplicacion = {
          listaPuntosCompresion: [],
          listaUnidadMedida: [],
          consultasTerminadas: true
        };
        if (puntosCompresion.data.codigo > 0) {
          const data = formatearArray(puntosCompresion.data.datos);
          datosAplicacion.listaPuntosCompresion = this.ordenarArreglo(data);
        }
        if (unidadesMedida.data.codigo > 0) {
          datosAplicacion.listaUnidadMedida = formatearArray(unidadesMedida.data.datos);
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado de ordenar el arreglo por nombre
   * @returns {Object}
   */
  ordenarArreglo = (puntosCompresion) => {
    puntosCompresion.sort((a, b) => {
      if (a.ptcoNombre.toLowerCase() < b.ptcoNombre.toLowerCase()) { return -1; }
      if (a.ptcoNombre.toLowerCase() > b.ptcoNombre.toLowerCase()) { return 1; }
      return 0;
    });
    return puntosCompresion;
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
      puntoCompresion: '',
      municipio: '',
      cantidadComprimida: '',
      unidadMedida: '',
      fecha: ' ',
      idCompresion: null,
      estado: false,
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
    // Ejemplo Validacion
    const { puntoCompresion, municipio, fecha, cantidadComprimida, unidadMedida, idCompresion } = this.state;
    const fechaActual = new Date();
    const fechaSeleccionada = Date.parse(fecha);
    if (puntoCompresion === '-1' || puntoCompresion === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un punto de compresón' } };
    }

    if (municipio === '-1' || municipio === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un municipio' } };
    }

    if (fecha.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha' } };
    }
    if (idCompresion === null) {
      if (fechaSeleccionada > fechaActual) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La fecha seleccionada no puede ser mayor a la del día' } };
      }
    }

    if (cantidadComprimida.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una cantidad comprimida' } };
    }

    if (cantidadComprimida < 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La cantidad comprimida solo permite valores positivos' } };
    }

    if (isNaN(cantidadComprimida)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La cantidad comprimida solo permite valores númericos' } };
    }

    if (unidadMedida === '-1' || unidadMedida === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad de medida' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const { municipio, fecha, cantidadComprimida, unidadMedida, puntoCompresion, idCompresion, listaPuntosCompresion } = this.state;
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const entidadGuardar = {
      'ptcmIderegistro': idCompresion,
      'ptcuIdepuntoubicacion': {
        'ptcuIderegistro': municipio
      },
      'ptcmFechacompresion': fecha,
      'ptcmCantidad': cantidadComprimida,
      'uniIdemedida': {
        'uniIderegistro': unidadMedida
      }
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_INGRESO_COMPRESIONES.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventana modal del boton consulta
   */
  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  /**
   * Método encargado de convertir la fecha al formayo YYYY/MM/DD
   * @param {number} fecha Fecha seleccionada
   */
  obtenerFecha = (fecha) => {
    const fechaADevolver = moment(fecha).format('YYYY-MM-DD');
    return fechaADevolver;
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    this.controlarCambioPuntoCompresion(name, value);
    this.setState(change);
  };

  /**
   * Método encargado de validar si se esta cambiando el valor del punto de compresión
   * @param {string} name Propiedad nombre
   * @param {string} value Valor seleccionado
   */
  controlarCambioPuntoCompresion = (name, value) => {
    if (name == 'puntoCompresion') {
      this.consultarMunicipios(value);
    }
  };

  /**
  * Método encargado de consultar los municipios de el punto de compron seleccionado
  * @param {string} value Identificador del punto de compresión selecnado
  * @returns {bool}
  */
  consultarMunicipios = (value) => {
    const puntoCompresion = value;
    if (puntoCompresion === '' || puntoCompresion === '-1') {
      this.setState({ listaMunicipios: [] });
      return;
    }

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_INGRESO_COMPRESIONES.CONSULTAR_MUNICIPIO, { ptcidepuntoconsumo: puntoCompresion })
      .then((respuesta) => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaMunicipios: respuesta.data.datos });
        }
      });
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
    this.consultarMunicipios(entidad.puntoCompresion.ptcuIdepuntoubicacion.idepuntoconsumo.ptcIderegistro);
    this.setState({
      mostrarModalConsulta: false,
      idCompresion: entidad.puntoCompresion.ptcmIderegistro,
      puntoCompresion: entidad.puntoCompresion.ptcuIdepuntoubicacion.idepuntoconsumo.ptcIderegistro,
      municipio: entidad.puntoCompresion.ptcuIdepuntoubicacion.ptcuIderegistro,
      fecha: this.obtenerFecha(entidad.puntoCompresion.ptcmFechacompresion),
      cantidadComprimida: entidad.puntoCompresion.ptcmCantidad,
      unidadMedida: entidad.puntoCompresion.uniIdemedida.uniIderegistro,
      estado: true,
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
          <Combo
            opciones={this.state.listaPuntosCompresion}
            propTexto='ptcoNombre'
            propValor='ptcIderegistro'
            label='Puntos de Compresión:'
            name='puntoCompresion'
            extra={{ disabled: this.state.estado, readOnly: this.state.estado }}
            value={this.state.puntoCompresion}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaMunicipios}
            propTexto='proyecto.proyectoNom'
            propValor='ptcuIderegistro'
            label='Municipios:'
            name='municipio'
            extra={{ disabled: this.state.estado, readOnly: this.state.estado }}
            value={this.state.municipio}
            onChange={this.controlarCambio}
          />
          <Fecha
            label="Fecha:"
            onChange={this.controlarCambio}
            name='fecha'
            fecha={this.state.fecha}
            extra={{ disabled: this.state.estado, readOnly: this.state.estado }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Cantidad Comprimida:'
            value={this.state.cantidadComprimida}
            onChange={this.controlarCambio}
            name='cantidadComprimida'
          />
          <Combo
            opciones={this.state.listaUnidadMedida}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Unidad de Medida:'
            name='unidadMedida'
            value={this.state.unidadMedida}
            className={this.state.estado}
            onChange={this.controlarCambio}
          />
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo={'Consultar Compresiones'}
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaCompresiones esModal seleccionarEntidad={this.cargarDatos} />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionIngresoCompresiones.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionIngresoCompresiones);

export { VistaRedux as RGestionIngresoCompresiones };
