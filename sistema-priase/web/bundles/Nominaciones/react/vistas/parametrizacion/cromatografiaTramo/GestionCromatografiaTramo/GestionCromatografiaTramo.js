import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, Combo, Fecha, Util, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { SelectorMultiple } from '../../../utils/SelectorMultiple';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import './GestionCromatografiaTramo.scss';
import { obtenerDatosRespuesta } from '../../../../global/util_nominaciones'
import { get as getProp } from 'object-path';
import moment from 'moment';

const tipoCromatografia = [
  { id: 'CR', nombre: 'Cromatografia Real' },
  { id: 'CI', nombre: 'Cromatografia Ideal' },
  { id: 'VL', nombre: 'Volumen' }
];

const listaSiNo = [
  { id: 'S', texto: 'Sí' },
  { id: 'N', texto: 'No' }
];

const separadores = [
  { id: ';', texto: '(;) Punto y Coma' },
  { id: ',', texto: '(,) Coma' },
  { id: '|', texto: '(|) Pipe' }
];

const listaTipo = [
  { id: 'M', nombre: 'Manual' },
  { id: 'A', nombre: 'Archivo' },
];

class GestionCromatografiaTramo extends Component {
  inputFileRef = null;
  state = {
    // Datos de la entidad
    tramo: '',
    cromatografia: '',
    tipoCarga: '',
    fecha: '',
    listaTramo: [],
    compuestos: [],
    listaCromatografiaTramo: [],
    listaErrores: [],
    // Datos subir archivo
    separador: '-1',
    cabecera: '-1',
    listaUnidades: [],
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
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CROMATOGRAFIA_TRAMO.CONSULTAR_TRAMOS, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CROMATOGRAFIA_TRAMO.CONSULTAR_COMPUESTOS, { criterio: '' }),
    ];

    axios.all(peticiones)
      .then(axios.spread((tramos, compuestos) => {
        const datosAplicacion = {
          listaTramo: [],
          compuestos: [],
        };
        if (tramos.data.codigo > 0) {
          datosAplicacion.listaTramo = tramos.data.datos;
        }
        if (compuestos.data.codigo > 0) {
          datosAplicacion.compuestos = compuestos.data.datos;
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      // Datos de la entidad
      tramo: '',
      cromatografia: '-1',
      tipoCarga: '-1',
      fecha: '',
      listaCromatografiaTramo: [],
      listaErrores: [],
    });
    this.limpiarCompuestos();
    this.inputFileRef.value = '';
    this.inputFileRef.files = null;
  };

  /**
   * Método encargado de limpiar los compuestos seleciconados
   */
  limpiarCompuestos = () => {
    const { compuestos } = this.state;
    compuestos.map(compuesto => {
      compuesto.seleccionado = false;
    });
    this.setState({ ...compuestos });
  };

  /**
   * Método encargado de obtener botones del formulario de guardar masivo
   * @returns {Object}
   */
  obtenerFuncionesMasivo = () => {
    return [
      { texto: 'Subir Archivo', callback: this.onSubirArchivo },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
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
   * Método encargado de validar los valores de la tabla compuestos
   * @return {bool}
   */
  validarTablaCompuestos = () => {
    const listaCompuestos = this.state.compuestos.filter(c => c.seleccionado);
    for (let i = 0; i < listaCompuestos.length; i++) {
      const compuesto = listaCompuestos[i];
      if (!compuesto.conValor || compuesto.conValor === '') {
        this.props.mostrarAlerta('Datos incompletos', 'Debe ingresar un valor para el compuesto: ' + compuesto.conNombre);
        return false;
      }

      if (compuesto.conValor < 0 || compuesto.conValor > 100) {
        this.props.mostrarAlerta('Datos incompletos', 'El porcentaje del compuesto debe ser un valor entre 0 y 100 para el compuesto: ' + compuesto.conNombre);
        return false;
      }

      if (isNaN(compuesto.conValor)) {
        this.props.mostrarAlerta('Datos incompletos', 'El porcentaje del compuesto debe ser númerico para el compuesto: ' + compuesto.conNombre);
        return false;
      }

    };
    return true;
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    // Validaciones
    const { cromatografia, tramo, compuestos, fecha } = this.state;
    if (cromatografia === '' || cromatografia === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tipo de cromatografia.' } };
    }

    if (fecha === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha' } };
    }

    if (tramo === '' || tramo === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tramo.' } };
    }

    if (!Util.validarArreglo(compuestos)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe parametrizar al menos un compuesto' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de validar los campos del formulario de guardar masivo
   * @returns {bool}
   */
  validarFormularioMasivo = () => {
    const { cromatografia } = this.state;
    if (this.inputFileRef.files.length === 0) {
      return { respuesta: false, mensaje: { titulo: 'Atención', mensaje: 'Debe seleccionar un archivo para continuar.' } };
    }
    if (cromatografia === '-1' || cromatografia === '') {
      return { respuesta: false, mensaje: { titulo: 'Atención', mensaje: 'Debe seleccionar el tipo de cromatografia.' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de generar un JSON con los valores ingresados
   * @returns {Object}
   */
  obtenerValores = () => {
    const { tramo, cromatografia, fecha } = this.state;
    let tramoSeleccionado = {
      "trmTramo": { "trmIderegistro": tramo }
    };
    const valores = this.state.compuestos.filter(c => c.seleccionado).map((dato, index) => (
      {
        "uniIdeconcepto": { "uniConcepto": dato.uniConcepto },
        "uniIdemedida": { "uniIderegistro": parseInt(dato.listaUniUnidad[0].uniIderegistro) },
        "trcoValor": parseFloat(dato.conValor),
        "trcoTipo": cromatografia,
        "trcoFecha": fecha
      }
    ));

    tramoSeleccionado.listaValores = valores;
    return tramoSeleccionado;
  };

  /**
   * Método encargado de mostrar los errores al subir el archivo
   * @param {Object} errores Errores arrojados al momento de subir el archivo
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
   * Método encargado de guardar el adjunto de cromatografía
   * @returns {bool}
   */
  onSubirArchivo = () => {
    const validarArchivo = this.validarFormularioMasivo();
    if (!validarArchivo.respuesta) {
      this.props.mostrarAlerta(validarArchivo.mensaje.titulo, validarArchivo.mensaje.mensaje);
      return false;
    }

    const configuracion = { headers: { 'Content-Type': 'multipart/form-data' } };
    const data = new FormData();
    data.append('cromatografiaMasivo', this.inputFileRef.files[0]);
    data.append('tipoCromatografia', this.state.cromatografia);
    data.append('separador', this.state.separador);
    data.append('cabecera', this.state.cabecera);
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CROMATOGRAFIA_TRAMO.GUARDAR_MASIVO, data, configuracion)
      .then((respuesta) => {
        if (respuesta.data.codigo < 0) {
          // this.mostrarError(respuesta.data.datos);
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
    const validarTablaCompuestos = this.validarTablaCompuestos();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    if (!validarTablaCompuestos) {
      return false;
    }
    const entidadGuardar = this.obtenerValores();
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CROMATOGRAFIA_TRAMO.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario",
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const nombrePropiedad = evento.target.name;
    const valor = evento.target.value;
    change[nombrePropiedad] = valor;
    this.setState(change, this.controlarCromatografia)
  };

  /**
   * Método encargado de consultar la cromatografía de un tramo
   */
  controlarCromatografia = () => {
    const { cromatografia, tramo, fecha } = this.state;
    if (cromatografia === '' || cromatografia === '-1') {
      return;
    }
    if (tramo === '' || tramo === '-1') {
      return;
    }
    if (fecha === '' || fecha === '-1') {
      return;
    }

    const object = {
      idTramo: tramo,
      tipo: cromatografia,
      fecha: fecha
    };
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CROMATOGRAFIA_TRAMO.CONSULTAR_CROMATOGRAFIA, object)
      .then(respuesta => {
        this.limpiarCompuestos();
        const data = obtenerDatosRespuesta(respuesta);
        this.setState({ listaCromatografiaTramo: data }, this.asignarDatos);
      });
  };

  /**
   * Método encargado de controlar el cambio al ingresar nuevos valores a los compuestos
   * @param {number} index Posición que se esta modificando
   * @param {Event} evento El evento que se ejecuta en el control de usuario.
   */
  controlarCambioValorCompuesto = (index, evento) => {
    const compuestos = [...this.state.compuestos];
    compuestos[index].conValor = evento.target.value;
    this.setState({ compuestos });
  };

  /**
   * Método encargado de generar los datos de la tabla de compuestos
   * @return {Array}
   */
  renderBody = () => {
    return this.state.compuestos.map((dato, index) => (
      (
        dato.seleccionado && (
          <tr key={dato.uniConcepto}>
            <td>{dato.conNombre}</td>
            <td><TextoNumerico
              aceptaDecimales={true}
              aceptaNegativos={false}
              value={dato.conValor}
              onChange={(evento) => {
                this.controlarCambioValorCompuesto(index, evento);
              }}
              name='valor'
            /></td>
            <td><Combo
              opciones={dato.listaUniUnidad}
              propTexto='uniNombre1'
              propValor='uniIderegistro'
              name='unidadMedida'
              value={dato.listaUniUnidad[0].uniIderegistro}
              mostrarOpcionPorDefecto={false}
            /></td>
            <td>{moment(dato.trcoFechavalor).format('YYYY-MM-DD')}</td>
          </tr>
        )
      )
    ));
  };

  /**
   * Metodo encargado de procesar la lista de compuestos del tramo en la lista de compuestos
   * @param {Array} compuestos Lista de compuestos
   * @param {Object} compuesto Compuesto a comparar
   * @param {Object} posicion Posición el en arreglo
   */
  procesarDetalleCompuesto = (compuesto, compuestos, posicion) => {
    const { listaCromatografiaTramo } = this.state;
    for (let indexc = 0; indexc < listaCromatografiaTramo.length; indexc++) {
      const compuestoTramo = listaCromatografiaTramo[indexc];
      if (compuesto.uniConcepto == compuestoTramo.uniIdeconcepto.uniConcepto) {
        if (!Util.validarArreglo(compuesto.listaUniUnidad)) {
          continue;
        }
        compuestos[posicion].seleccionado = true;
        compuestos[posicion].conValor = compuestoTramo.trcoValor;
        let fecha = moment(compuestoTramo.trcoFechavalor).format('YYYY-MM-DD');
        compuestos[posicion].trcoFechavalor = fecha;
      }
    }
  }

  /**
   * Método encargado de asignar los datos consultados para un tramo a los componentes
   */
  asignarDatos = () => {
    const { compuestos } = this.state;
    for (let index = 0; index < compuestos.length; index++) {
      const compuesto = compuestos[index];
      this.procesarDetalleCompuesto(compuesto, compuestos, index);
    }
    this.setState({ compuestos: [...compuestos] });
  }

  /**
   * Método encargado de mostrar el formulario para guardar cromatografia por medio de un adjunto
   * @returns {Object}
   */
  renderArchivo = () => {
    return (
      <Fragment>
        <div className='row'>
          <Botonera funciones={this.obtenerFuncionesMasivo()} />
        </div>
        <div className='gestion-lecturas-diarias'>
          <div className="row mt-4">
            <div className='form-group col-4'>
              <label htmlFor='txtArchivoRutas'>Archivo de Cromatografia:</label>
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

            <div className='col-12'>
              <div className='mt-3 d-flex justify-content-center gestion-lecturas-diarias__ejemplo'>
                <div>
                  <p>Cabecera de Ejemplo del Archivo</p>
                  <pre>
                    Fecha(AAAA-MM-DD), Tramo (Código transportador), Compuesto(Alias en variables), Valor, Medida (Código de la unidad de medida en la configuración básica)
            </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  /**
   * Método encargado de controlar la selcción de compuestos
   * @param {Event} evento Evento ejecutado en el control de usuario.
   */
  seleccionarItem = (evento) => {
    const compuestos = this.state.compuestos;
    const value = evento.target.value;
    const index = compuestos.findIndex(c => c.uniConcepto == value);
    compuestos[index].seleccionado = evento.target.checked;
    this.setState({ compuestos: compuestos });
  };

  /**
   * Método encargado de filtrar los compuestos con unidad de medida
   * @param {Array} compuestos Lista de compuestos
   * @returns {Array}
   */
  procesarCompuestos = (compuestos) => {
    if (!Array.isArray(compuestos)) {
      return [];
    }
    return compuestos.filter((compuesto) => {
      const unidad = getProp(compuesto.listaUniUnidad[0], 'uniIderegistro', '');
      if (unidad || unidad != '') {
        return compuesto;
      }
    });
  };

  /**
   * Método encargado de mostrar el formulario para registrar cromatografía manual
   * @returns {Object}
   */
  renderManual() {
    return (
      <Fragment>
        <div className='conf-general row mt-5'>
          <Botonera funciones={this.obtenerFunciones()} />
          <Combo
            opciones={this.state.listaTramo}
            propTexto='trmNombre'
            propValor='trmIderegistro'
            label='Tramos:'
            name='tramo'
            value={this.state.tramo}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha:'
            name='fecha'
            fecha={this.state.fecha}
            onChange={this.controlarCambio}
          />
          <div className='col-md-12 mt-5'>
            <div className='content-control row'>
              <SelectorMultiple
                titulo='Componentes:'
                propTexto='conAlias'
                propValor='uniConcepto'
                lista={this.procesarCompuestos(this.state.compuestos)}
                seleccionarItem={this.seleccionarItem}
              />
            </div>
          </div>
        </div>
        {Util.validarArreglo(this.state.compuestos) && (
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>Componente</th>
                <th>Valor</th>
                <th>Unidad Medida</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        )}
      </Fragment>
    );
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <div className='cromatografia row mt-5'>
          <Combo
            opciones={listaTipo}
            propTexto='nombre'
            propValor='id'
            label='Tipo de Cargue:'
            name='tipoCarga'
            value={this.state.tipoCarga}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={tipoCromatografia}
            propTexto='nombre'
            propValor='id'
            textoPorDefecto='Seleccione una Opción'
            label='Cromatografia:'
            name='cromatografia'
            value={this.state.cromatografia}
            onChange={this.controlarCambio}
          />
        </div>
        {this.state.tipoCarga === 'M' &&
          this.renderManual()
        }

        {this.state.tipoCarga === 'A' &&
          this.renderArchivo()
        }
      </Fragment>
    );
  };
}

GestionCromatografiaTramo.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionCromatografiaTramo);

export { VistaRedux as RGestionCromatografiaTramo };
