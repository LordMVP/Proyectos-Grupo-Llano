import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico, Fecha } from 'appfuture-react';
import axios from 'axios';
import { formatearArray, TIPOS_UNIDADES_MEDIDA } from '../../../../global/util_nominaciones';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import './GestionOtrosConsumos.scss';

const listaOtrosConsumos = [
  { id: 'PM', nombre: 'Perdidas Menores' },
  { id: 'PY', nombre: 'Perdidas Mayores' },
  { id: 'VG', nombre: 'Volumen de Gas de la Gasificación' }
];

class GestionOtrosConsumos extends Component {

  state = {
    // Datos de la entidad
    listaPuntosConsumo: [],
    listaUnidadMedida: [],
    otroConsumo: '',
    cantidad: '',
    unidadMedida: '',
    fecha: '',
    puntoConsumo: '',
    consultasTerminadas: false,
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
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_OTROS_CONSUMO.CONSULTAR_PUNTOS_CONSUMO, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.CANTIDAD }),
    ];

    axios.all(peticiones)

      .then(axios.spread((puntosConsumo, unidadesMedida) => {
        const datosAplicacion = {
          listaPuntosConsumo: [],
          listaUnidadMedida: [],
        };

        if (puntosConsumo.data.codigo >= 0) {
          datosAplicacion.listaPuntosConsumo = formatearArray(puntosConsumo.data.datos);
        }

        if (unidadesMedida.data.codigo >= 0) {
          datosAplicacion.listaUnidadMedida = formatearArray(unidadesMedida.data.datos);
        }
        this.setState({ ...datosAplicacion, consultasTerminadas: true });
      }));
  };

  /**
   * Método encargado de limpiar los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      otroConsumo: '',
      cantidad: '',
      unidadMedida: '',
      fecha: ' ',
      puntoConsumo: '',

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
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar las variables del formulario
	 * @returns {Object}
   */
  validarFormulario = () => {
    // Validaciones
    const { otroConsumo, cantidad, unidadMedida, fecha, puntoConsumo } = this.state;
    if (otroConsumo === '-1' || otroConsumo === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un valor de otro consumo' } };
    }

    if (fecha.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha' } };
    }

    if (cantidad.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una cantidad' } };
    }

    if (isNaN(cantidad)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La cantidad ingresada solo puede ser un valor númerico' } };
    }

    if (cantidad < 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La cantidad ingresada solo puede ser un valor positivo' } };
    }

    if (unidadMedida === '-1' || unidadMedida === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad medida' } };
    }

    if (puntoConsumo === '-1' || puntoConsumo === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un punto de consumo.' } };
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

    const { otroConsumo, puntoConsumo, fecha, cantidad, unidadMedida } = this.state;

    const entidadGuardar = {
      'otcTipo': otroConsumo,
      'ptcIdepuntoconsumo': { 'ptcIderegistro': puntoConsumo },
      'otcCantidad': cantidad,
      'otcFechaconsumo': fecha,
      'uniIdemedidad': { 'uniIderegistro': unidadMedida },
      'otcClase': 'OTC',
    }

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_OTROS_CONSUMO.GUARDAR, entidadGuardar)
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
    change[evento.target.name] = evento.target.value;
    this.setState(change);
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
            opciones={listaOtrosConsumos}
            propTexto='nombre'
            propValor='id'
            label='Otros Consumos:'
            name='otroConsumo'
            value={this.state.otroConsumo}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaPuntosConsumo}
            propTexto='ptcoNombre'
            propValor='ptcIderegistro'
            label='Puntos De Consumo:'
            name='puntoConsumo'
            value={this.state.puntoConsumo}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha:'
            name='fecha'
            fecha={this.state.fecha}
            onChange={this.controlarCambio}
          />
        </div>
        <div className='conf-general row mt-5'>
          <TextoNumerico
            aceptaDecimales={false}
            aceptaNegativos={false}
            label='Cantidad:'
            value={this.state.cantidad}
            onChange={this.controlarCambio}
            name='cantidad'
          />
          <Combo
            opciones={this.state.listaUnidadMedida}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Unidad de Medida:'
            name='unidadMedida'
            value={this.state.unidadMedida}
            onChange={this.controlarCambio}
          />
        </div>
      </Fragment>
    );
  };
}

GestionOtrosConsumos.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionOtrosConsumos);

export { VistaRedux as RGestionOtrosConsumos };
