import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico, Fecha } from 'appfuture-react';
import axios from 'axios';
import { formatearArray } from '../../../../global/util_nominaciones';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { CLASES_UNIDADES } from '../../../../global/constantes';
import './GestionDevolucionAlSistema.scss';

class GestionDevolucionAlSistema extends Component {

  state = {
    // Datos de la entidad
    valorADevolver: '',
    fecha: '',
    puntoDeSalida: '',
    listaPuntoSalida: [],
    listaUnidadMedida: [],
    unidadMedida: '',
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
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_DEVOLUCION_SISTEMA.CONSULTAR_PUNTOS_SALIDA, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_DEVOLUCION_SISTEMA.CONSULTAR_UNIDAD_MEDIDA, { criterio: '', idClase: CLASES_UNIDADES.UNIDAD_MEDIDA }),
    ];
    axios.all(peticiones)

      .then(axios.spread((puntosSalida, unidadesMedida) => {
        const datosAplicacion = {
          listaPuntoSalida: [],
          listaUnidadMedida: [],
        };
        if (puntosSalida.data.codigo >= 0) {
          datosAplicacion.listaPuntoSalida = formatearArray(puntosSalida.data.datos);
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
      valorADevolver: '',
      fecha: ' ',
      puntoDeSalida: '',
      unidadMedida: '',
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
    //Validaciones
    const { valorADevolver, fecha, puntoDeSalida, unidadMedida } = this.state;

    if (puntoDeSalida === '-1' || puntoDeSalida === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un punto de salida' } };
    }

    if (valorADevolver.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar la cantidad a devolver' } };
    }

    if (isNaN(valorADevolver)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La cantidad a devolver debe de ser un número' } };
    }

    if (valorADevolver < 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La cantidad a devolver debe de un número positivo' } };
    }

    if (fecha.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una fecha' } };
    }

    if (unidadMedida === '' || unidadMedida === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una unidad de medida' } };
    }

    return { respuesta: true };
  };

  /**
   * Metodo encargado de convertir la fecha ingresada a número
   * @param {string} fechaIngresada fecha ingresada por el usuario
   * @returns {number}
   */
  obtenerFecha = (fechaIngresada) => {
    let fecha = Date.parse((fechaIngresada));
    return fecha;
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
    const { valorADevolver, puntoDeSalida, unidadMedida, fecha } = this.state;
    const entidadGuardar = {
      "degaValor": parseInt(valorADevolver),
      "degaFechadevolucion": this.obtenerFecha(fecha),
      "ptsaIdepuntosalida": {
        "ptsaIderegistro": puntoDeSalida
      },
      "uniIdemedida": {
        "uniIderegistro": parseInt(unidadMedida)
      },
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_DEVOLUCION_SISTEMA.GUARDAR, entidadGuardar)
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
            opciones={this.state.listaPuntoSalida}
            propTexto='ptsaNombre'
            propValor='ptsaIderegistro'
            label='Puntos de Salida:'
            name='puntoDeSalida'
            value={this.state.puntoDeSalida}
            onChange={this.controlarCambio}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Cantidad a devolver:'
            value={this.state.valorADevolver}
            onChange={this.controlarCambio}
            name='valorADevolver'
          />
          <Fecha
            label='Fecha:'
            name='fecha'
            fecha={this.state.fecha}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaUnidadMedida}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Unidades de Medida:'
            name='unidadMedida'
            value={this.state.unidadMedida}
            onChange={this.controlarCambio}
          />
        </div>
      </Fragment>
    );
  };
}

GestionDevolucionAlSistema.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionDevolucionAlSistema);

export { VistaRedux as RGestionDevolucionAlSistema };
