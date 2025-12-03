import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, Combo, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { formatearArray, TIPOS_UNIDADES_MEDIDA } from '../../../../global/util_nominaciones';
import './GestionProyeccionConsumos.scss';

const listaTipoDeUso = [
  { id: 'R', nombre: 'Regulado' },
  { id: 'NR', nombre: 'No Regulado' }
];

const separadores = [
  { id: ';', texto: '(;) Punto y Coma' },
  { id: ',', texto: '(,) Coma' },
  { id: '|', texto: '(|) Pipe' }
];

const listaSiNo = [
  { id: 'S', texto: 'Sí' },
  { id: 'N', texto: 'No' }
];

class GestionProyeccionConsumos extends Component {

  inputFileRef = null;
  state = {
    // Datos de la entidad
    tipoUso: '',
    puntoConsumo: '',
    fecha: '',
    cantidadProyectada: '',
    unidadMedida: '',
    separador: '',
    cabecera: '',
    listaPuntosConsumo: [],
    listaUnidadMedida: [],
    //Estado de la aplicacion
    masivo: false,
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
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTOS_CONSUMO, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.CANTIDAD }),
    ];

    axios.all(peticiones)

      .then(axios.spread((puntosConsumo, unidadesMedida) => {
        const datosAplicacion = {
          listaPuntosConsumo: [],
          listaUnidadMedida: [],
        };

        if (puntosConsumo.data.codigo > 0) {
          datosAplicacion.listaPuntosConsumo = formatearArray(puntosConsumo.data.datos);
        }

        if (unidadesMedida.data.codigo > 0) {
          datosAplicacion.listaUnidadMedida = formatearArray(unidadesMedida.data.datos);
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * @method
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      // Datos de la entidad
      tipoUso: '',
      puntoConsumo: '',
      fecha: ' ',
      cantidadProyectada: '',
      unidadMedida: '',
      separador: '',
      cabecera: '',
    });
    if (this.inputFileRef != null) {
      this.inputFileRef.value = '';
      this.inputFileRef.files = null;
    }
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
    const { masivo } = this.state;
    let funciones = [
      { texto: (masivo) ? 'Subir' : 'Guardar', callback: (masivo) ? this.onSubirArchivo : this.guardarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario },
      { texto: (masivo) ? 'Manual' : 'Ingreso Masivo', callback: this.cambiarFormulario }
    ];
    return funciones;
  };

  /**
   * @method
   * Método encargado de cambiar entre formularios
   */
  cambiarFormulario = () => {
    this.limpiarFormulario();
    this.setState({ masivo: !this.state.masivo });
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    //Variables
    const { tipoUso, puntoConsumo, fecha, cantidadProyectada, unidadMedida } = this.state;
    //Validaciones
    if (tipoUso === '' || tipoUso === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tipo de uso.' } };
    }

    if (puntoConsumo === '' || puntoConsumo === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un punto de consumo.' } };
    }

    if (cantidadProyectada.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una cantidad proyectada.' } };
    }

    if (cantidadProyectada < 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La cantidad proyectada solo admite valores positivos' } };
    }

    if (isNaN(cantidadProyectada)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La cantidad proyectada solo admite valores númericos' } };
    }

    if (unidadMedida === '' || unidadMedida === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad de medida.' } };
    }

    if (fecha.trim() === '' || fecha.trim() === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha.' } };
    }

    return { respuesta: true };
  };

  /**
   * @method
   * Método encargado de validar los campos del formulario de guardar masivo
   * @returns {bool}
   */
  validarFormularioMasivo = () => {
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

    return { respuesta: true };
  };

  /**
   * @method
   * Método encargado de mostrar los errores al subir el archivo
   * @param {Array} errores Errores ocurridos al momento de subir el archivo
   */
  mostrarError = (errores) => {
    let strMensaje = errores.map((err, index) => (<li key={index}>{`Línea ${err.linea}: ${err.mensaje}`}</li>));
    let mensaje = (
      <Fragment>
        <span>{`Ocurrieron uno o varios errores al subir el archivo, verifique el archivo e intente nuevamente.`}</span>
        <ul className='mt-2 pl-5'>{strMensaje}</ul>
      </Fragment>
    );
    this.props.mostrarAlerta('Error', mensaje);
  };

  /**
   * @method
   * Método encargado de guardar el adjunto de proyección
   * @returns {bool}
   */
  onSubirArchivo = () => {
    if (!this.validarFormularioMasivo()) {
      return false;
    }

    const configuracion = { headers: { 'Content-Type': 'multipart/form-data' } };
    const data = new FormData();
    data.append('archivo', this.inputFileRef.files[0]);
    data.append('separador', this.state.separador);
    data.append('cabecera', this.state.cabecera.toUpperCase());

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PROYECCION_CONSUMOS.GUARDAR_MASIVO, data, configuracion)
      .then((respuesta) => {
        if (respuesta.data.codigo < 0) {
          this.mostrarError(respuesta.data.datos);
          return;
        }

        if (respuesta.data.codigo > 0) {
          this.props.mostrarAlerta('Proceso satisfactorio', 'Registro insertado satisfactoriamente.');
          this.limpiarFormulario();
        }
      });
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
    const { puntoConsumo, fecha, cantidadProyectada, unidadMedida, tipoUso } = this.state;
    const entidadGuardar = {
      'otcTipo': tipoUso,
      'ptcIdepuntoconsumo': { 'ptcIderegistro': puntoConsumo },
      'otcCantidad': cantidadProyectada,
      'otcFechaproyeccion': fecha,
      'uniIdemedidad': { 'uniIderegistro': unidadMedida },
      'otcClase': "PYC"
    }

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PROYECCION_CONSUMOS.GUARDAR, entidadGuardar)
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
   * @method
   * Método encargado de obtener el formulario para subir proyecciones masivo
   * @returns {JSX}
   */
  renderFormularioMasivo = () => {
    return (
      <Fragment>
        <div className="row mt-4">
          <div className='form-group col-4'>
            <label htmlFor='txtArchivoRutas'>Archivo de Proyección:</label>
            <input id='txtArchivoRutas' ref={ref => this.inputFileRef = ref} type="file" accept=".csv" />
          </div>

          <Combo
            opciones={separadores}
            propTexto='texto'
            propValor='id'
            label='Separador:'
            value={this.state.separador}
            onChange={this.controlarCambio}
            name="separador"
          />

          <Combo
            opciones={listaSiNo}
            propTexto='texto'
            propValor='id'
            label='El archivo tiene Cabecera:'
            value={this.state.cabecera}
            onChange={this.controlarCambio}
            name="cabecera"
          />

          <div className='mt-3 col-12'>
            <div className='justify-content-center gestion-lecturas-diarias__ejemplo'>
              <p>Cabecera de Ejemplo del Archivo</p>
              <span className='codes-content text-center'>
                codigo_gestor, fecha(YYYY-MM-DD), valor [ El separador de los valores decimales es un punto "." (0.00)], unidadMedida(Unidad Ejemplo: M3), tipo de uso Regulado o No Regulado(R,NR)
            </span>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  /**
   * @method
   * Método encargado de obtener el formulario manual
   * @returns {JSX}
   */
  renderFormularioManual = () => {
    return (
      <Fragment>
        <Combo
          opciones={listaTipoDeUso}
          propTexto='nombre'
          propValor='id'
          label='Tipos de Uso:'
          name='tipoUso'
          value={this.state.tipoUso}
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
          label="Fecha:"
          onChange={this.controlarCambio}
          name='fecha'
          fecha={this.state.fecha}
        />
        <TextoNumerico
          aceptaDecimales={false}
          aceptaNegativos={false}
          label='Cantidad Proyectada:'
          value={this.state.cantidadProyectada}
          onChange={this.controlarCambio}
          name='cantidadProyectada'
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
      </Fragment>
    )
  }

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          {!this.state.masivo ?
            this.renderFormularioManual() :
            this.renderFormularioMasivo()
          }
        </div>

      </Fragment>
    );
  };
}

GestionProyeccionConsumos.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionProyeccionConsumos);

export { VistaRedux as RGestionProyeccionConsumos };
