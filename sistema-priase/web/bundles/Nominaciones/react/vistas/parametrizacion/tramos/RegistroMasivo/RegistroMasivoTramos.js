import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { Botonera, Combo } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import './RegistroMasivoTramos.scss';


class RegistroMasivoTramos extends Component {

  inputFileRef = null;

  state = {
    separador: '-1',
    cabecera: '-1'
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
   * @returns {Boolean}
   */
  onSubirArchivo = () => {
    if (!this.validarFormulario()) {
      return false;
    }

    const configuracion = { headers: { 'Content-Type': 'multipart/form-data' } };
    const data = new FormData();
    data.append('archivo', this.inputFileRef.files[0]);
    data.append('separador', this.state.separador);
    data.append('cabecera', this.state.cabecera.toUpperCase());

    axios.post(RUTAS_API.PARAMETRIZACION.TRAMOS.SUBIR_ARCHIVO_TRAMOS_MASIVO, data, configuracion)
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
    if (this.inputFileRef.files.length === 0) {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar un archivo para continuar');
      return false;
    }

    if (this.state.separador === '-1') {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar un separador de archivo para continuar');
      return false;
    }

    if (this.state.cabecera === '-1') {
      this.props.mostrarAlerta('Atención', 'Debe indicar si el archivo tiene cabecera para continuar');
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
      cabecera: '-1',
      separador: '-1'
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
            <label htmlFor='txtArchivoRutas'>Archivo de Tramos:</label>
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

          <div className='mt-3 d-flex justify-content-center registro-masivo-tramo__ejemplo'>
            <div>
              <p>Cabecera de Ejemplo del Archivo</p>
              <pre>
                tiporegistro(Encabezado = E),nombre,codigogestor
                <br />
                tiporegistro(Detalle = D),valorFijo,unidadmedidavalorfijo,valorvariable,unidadmedidavariable,valorao&m,unidadmedidaao&m,%fijo,%variable"
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  };

}

RegistroMasivoTramos.propTypes = {
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ mostrarAlerta }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(RegistroMasivoTramos);

export { VistaRedux as RRegistroMasivoTramos };
