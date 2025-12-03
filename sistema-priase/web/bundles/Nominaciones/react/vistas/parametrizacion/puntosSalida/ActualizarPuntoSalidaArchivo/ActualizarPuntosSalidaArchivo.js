import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { Botonera, Combo } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import './ActualizarPuntosSalidaArchivo.scss';
import { formatearArray } from '../../../../global/util_nominaciones'

class ActualizarPuntosSalidaArchivo extends Component {

  inputFileRef = null;

  state = {
    listaPuntosSalida: [],
    puntoSalida: '',
    separador: '-1',
    cabecera: '-1'
  };

  /**
   * Método encargado de comprobar si el componente ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }

    axios.post(RUTAS_API.PARAMETRIZACION.PUNTOS_SALIDA.CONSULTAR_PUNTOS_SALIDA, { criterio: '' })
      .then(respuesta => {
        if (respuesta.data.codigo >= 0) {
          this.setState({ listaPuntosSalida: formatearArray(respuesta.data.datos) });
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
   * Valida el formulario y sube el archivo plano al servidor, junto con el separador y la cabecera
   * @returns {bool}
   */
  onSubirArchivo = () => {
    if (!this.validarFormulario()) {
      return false;
    }
    const { puntoSalida } = this.state;
    const configuracion = { headers: { 'Content-Type': 'multipart/form-data' } };
    const data = new FormData();
    data.append('lecturaBE', this.inputFileRef.files[0]);
    data.append('idpuntoSalida', puntoSalida);
    data.append('separador', this.state.separador);
    data.append('cabecera', this.state.cabecera.toUpperCase());

    axios.post(RUTAS_API.PARAMETRIZACION.PUNTOS_SALIDA.ACTUALIZAR_PUNTO, data, configuracion)
      .then((respuesta) => {
        if (respuesta.data.codigo < 0) {
          this.mostrarError(respuesta.data.datos);
          return;
        }
        this.limpiarFormulario();
      });
  };

  /**
   * Método encargado de validar las variables del formulario
	 * @returns {Object}
   */
  validarFormulario = () => {
    const { puntoSalida } = this.state;
    if (this.inputFileRef.files.length === 0) {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar un archivo para continuar');
      return false;
    }

    if (puntoSalida <= 0) {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar un punto de salida');
      return false;
    }

    return true;
  };

  /**
   * Método encargado de mostrar los errores al subir el archivo
   */
  mostrarError = (errores) => {
    let strMensaje = errores.map((err, index) => (<li key={index}>{`Línea ${err.linea}: ${err.mensaje}`}</li>));
    let mensaje = (
      <Fragment>
        <span>{`Ocurrieron uno o varios errores al subir el archivo, verifique el archivo e intente nuevamente.`}</span>
        <ul className='container mt-2 pl-5'>{strMensaje}</ul>
      </Fragment>
    );
    this.props.mostrarAlerta('Error', mensaje);
  };

  /**
   * Método encargado de limpiar los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = () => {
    this.setState({
      puntoSalida: '-1',
      separador: '-1',
      cabecera: '-1'
    });
    this.inputFileRef.value = '';
    this.inputFileRef.files = null;
  };

  /**
   * Método encargado de generar los botones del formulario
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Subir Archivo', callback: this.onSubirArchivo },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de mostrar el formulario
	 * @returns {Object}
   */
  render() {
    return (
      <div className='registro-masivo-tramo'>
        <div className="d-flex justify-content-center mt-3">
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        <div className="row mt-4">
          <div className='form-group col-4'>
            <label htmlFor='txtArchivoRutas'>Archivo de punto de salida:</label>
            <input id='txtArchivoRutas' ref={ref => this.inputFileRef = ref} type="file" accept=".csv" />
          </div>
          <Combo
            opciones={[{ id: ';', texto: '(;) Punto y Coma' }, { id: ',', texto: '(,) Coma' }, , { id: '|', texto: '(|) Pipe' }]}
            propTexto='texto'
            propValor='id'
            label='Separador:'
            value={this.state.separador}
            onChange={this.controlarCambio}
            name="separador"
          />

          <Combo
            opciones={[{ id: 'S', texto: 'Sí' }, { id: 'N', texto: 'No' }]}
            propTexto='texto'
            propValor='id'
            label='El archivo tiene Cabecera:'
            value={this.state.cabecera}
            onChange={this.controlarCambio}
            name="cabecera"
          />
          <Combo
            opciones={this.state.listaPuntosSalida}
            propTexto='ptsaNombre'
            propValor='ptsaIderegistro'
            label='Punto de salida:'
            name='puntoSalida'
            value={this.state.puntoSalida}
            onChange={this.controlarCambio}
          />
          <div className='mt-3 d-flex justify-content-center registro-masivo-tramo__ejemplo'>
            <div>
              <p>Cabecera de Ejemplo del Archivo</p>
              <pre>
                (fecha(YYYY-MM-DD),totalNodoEntrada,asignacionNodoSalida,balanceDiario,balanceAcumulado,totalMedidoKPC,HHV)
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

ActualizarPuntosSalidaArchivo.propTypes = {
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ mostrarAlerta }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(ActualizarPuntosSalidaArchivo);

export { VistaRedux as RActualizarPuntosSalidaArchivo };
