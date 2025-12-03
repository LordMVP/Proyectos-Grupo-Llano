import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Util, TextoNumerico, Fecha } from 'appfuture-react';
import axios from 'axios';
import { formatearArray, TIPOS_UNIDADES_MEDIDA } from '../../../../global/util_nominaciones';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import './GestionLecturasContratos.scss';

const listaCertificado = [
  { valor: 'S', texto: 'Certificado' },
  { valor: 'N', texto: 'No Certificado' }
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

const CERTIFICADO = 'S';

class GestionLecturasContratos extends Component {
  inputFileRef = null;
  state = {
    // Datos de la entidad
    listaContratos: [],
    listaRutas: [],
    listaUnidadMedida: [],
    contrato: '',
    fecha: '',
    fechaInicio: '',
    fechaFin: '',
    tipoUso: '',
    agente: '',
    separador: '',
    cabecera: '',
    consultasTerminadas: false,
    masivo: false
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
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_CONTRATOS.CONSULTAR_CONTRATO, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.CANTIDAD }),
    ];

    axios.all(peticiones)
      .then(axios.spread((contratos, unidadesMedida) => {
        const datosAplicacion = {
          listaContratos: [],
          listaUnidadMedida: [],
        };
        if (contratos.data.codigo >= 0) {
          datosAplicacion.listaContratos = formatearArray(contratos.data.datos).length > 0 ? contratos.data.datos.map(c => {
            c.texto = c.cntNumero + '--' + c.terIdeagente.terNombre;
            return c;
          })
            : [];
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
      contrato: '',
      fecha: ' ',
      listaRutas: [],
      fechaInicio: '',
      fechaFin: '',
      tipoUso: '',
      agente: '',
      separador: '',
      cabecera: '',
    });
    if (this.inputFileRef != null) {
      this.inputFileRef.value = '';
      this.inputFileRef.files = null;
    }
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
    return [
      { texto: (masivo) ? 'Subir' : 'Guardar', callback: (masivo) ? this.onSubirArchivo : this.guardarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario },
      { texto: (masivo) ? 'Manual' : 'Ingreso Masivo', callback: this.cambiarFormulario }
    ];
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

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_CONTRATOS.GENERAR_MASIVO, data, configuracion)
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
   * @method
   * Método encargado de cambiar entre formularios
   */
  cambiarFormulario = () => {
    this.limpiarFormulario();
    this.setState({ masivo: !this.state.masivo });
  };

  /**
   * Método encargado de validar los datos de la tabla ruta
   * @returns {bool}
   */
  validarValorRuta = () => {
    const rutasValidar = this.state.listaRutas.filter(dato => dato.lcdCerticado != CERTIFICADO);
    for (let i = 0; i < rutasValidar.length; i++) {
      const ruta = rutasValidar[i];
      if (!ruta.lcdLectura || ruta.lcdLectura === '') {
        this.props.mostrarAlerta('Datos incompletos', 'Debe ingresar una lectura para la ruta: ' + ruta.uniIderuta.uniNombre1);
        return false;
      }

      if (!ruta.uniIdemedida.uniIderegistro || ruta.uniIdemedida.uniIderegistro === '' || ruta.uniIdemedida.uniIderegistro === '-1') {
        this.props.mostrarAlerta('Datos incompletos', 'Debe seleccionar una unidad de medida para la ruta: ' + ruta.uniIderuta.uniNombre1);
        return false;
      }

      if (!ruta.tempCertificado || ruta.tempCertificado === '' || ruta.tempCertificado === '-1') {
        this.props.mostrarAlerta('Datos incompletos', 'Debe especificar si la ruta ' + ruta.uniIderuta.uniNombre1 + ' se encuentra certificada o no');
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
    //Validaciones
    const { contrato, fecha } = this.state;
    const fechaDate = new Date(fecha);
    const fechaActual = new Date();
    if (contrato === '' || contrato === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un contrato' } };
    }

    if (fecha.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha' } };
    }

    if (fechaDate > fechaActual) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La fecha seleccionada no puede ser mayor a la fecha actual' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de generar un JSON con los valores ingresados
   * @returns {Object}
   */
  obtenerValores = () => {
    const { contrato, fecha } = this.state;
    let datos = {
      'fechaLectura': fecha,
      'cntContrato': { 'cntIderegistro': contrato },
    };
    const valores = this.state.listaRutas.filter(dato => dato.lcdCerticado != CERTIFICADO).map(dato => (
      {
        'uniIderuta': { 'uniIderegistro': dato.uniIderuta.uniIderegistro },
        'lcdLectura': parseInt(dato.lcdLectura),
        'uniIdemedida': { 'uniIderegistro': dato.uniIdemedida.uniIderegistro },
        'lcdCerticado': dato.tempCertificado,
      }
    ));

    datos.listaValores = valores;
    return datos;
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    const validarValor = this.validarValorRuta();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    if (!validarValor) {
      return false;
    }

    const entidadGuardar = this.obtenerValores();

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_CONTRATOS.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de consultar las rutas del contrato seleccionado
   * @param {number} idContratoSeleccionado contrato seleccionado por el usuario
   * @param {string} fecha Fecha seleccionada por el usuario
   * @returns {bool}
   */
  consultarRuta = (idContratoSeleccionado, fecha) => {
    const fechaDate = Date.parse(fecha);
    const fechaActual = new Date();
    if (idContratoSeleccionado === '-1') {
      return false
    }
    if (fecha.trim() === '') {
      return false;
    }
    if (fechaDate > Date.parse(this.state.fechaFin)) {
      this.props.mostrarAlerta('Atención', 'La fecha seleccionada no puede ser mayor a la fecha final del contrato');
      return false;
    }

    if (fechaDate < Date.parse(this.state.fechaInicio)) {
      this.props.mostrarAlerta('Atención', 'La fecha seleccionada no puede ser menor a la fecha inicial del contrato');
      return false;
    }

    if (fechaDate > Date.parse(fechaActual)) {
      this.props.mostrarAlerta('Atención', 'La fecha seleccionada no puede ser mayor a la fecha actual');
      return false;
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_CONTRATOS.CONSULTAR_RUTAS_CONTRATOS, { idContrato: idContratoSeleccionado, fecha: fecha })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaRutas: respuesta.data.datos });
        }
      });
  };

  /**
   * Método encargado de consultar los datos del contrato seleccionado
   * @param {number} idContrato contrato seleccionado por el usuario
   * @returns {bool}
   */
  consultarDatosContrato = (idContrato) => {
    if (!Util.validarArreglo(this.state.listaContratos)) {
      return;
    }
    if (idContrato === '-1') {
      this.setState({
        fechaInicio: '',
        fechaFin: '',
        tipoUso: '',
        agente: '',
        listaRutas: [],
      });
      return false
    }
    const contrato = this.state.listaContratos.find(p => idContrato == p.cntIderegistro);
    this.setState({
      fechaInicio: contrato.cntFechainicio,
      fechaFin: contrato.cntFechafin,
      tipoUso: contrato.uniIdetipouso.uniNombre1,
      agente: contrato.terIdeagente.terNomcompleto,
    });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    const { contrato } = this.state;
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    if (!this.state.masivo) {
      this.consultarRuta(contrato, value);
    }
    this.setState(change);
  };

  /**
   * Método encargado de controlar el cambio al momento de seleccionar un contrato
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambioContrato = (evento) => {
    const { fecha } = this.state;
    let change = {};
    const { name, value } = evento.target;
    change[name] = value;
    this.consultarRuta(value, fecha);
    this.consultarDatosContrato(value);
    this.setState(change);
  };

  /**
   * Método encargado de controlar el cambio al ingresar nuevas lecturas
   * @param {number} index Posición que se esta modificando
   * @param {Event} evento El evento que se ejecuta en el control de usuario.
   */
  controlarCambioValorLectura = (index, evento) => {
    const listaRutas = [...this.state.listaRutas];
    listaRutas[index].lcdLectura = evento.target.value;
    this.setState({ listaRutas });
  };

  /**
   * Método encargado de controlar el cambio al seleccionar nuevas unidades de medida
   * @param {number} index Posición que se esta modificando
   * @param {Event} evento El evento que se ejecuta en el control de usuario.
   */
  controlarCambioValorUnidadMedida = (index, evento) => {
    const listaRutas = [...this.state.listaRutas];
    listaRutas[index].uniIdemedida.uniIderegistro = evento.target.value;
    this.setState({ listaRutas });
  };

  /**
   * Método encargado de controlar el cambio al cambiar el estado de la lectura
   * @param {number} index Posición que se esta modificando
   * @param {Event} evento El evento que se ejecuta en el control de usuario.
   */
  controlarCambioEstadoCertificacion = (index, evento) => {
    const listaRutas = [...this.state.listaRutas];
    listaRutas[index].tempCertificado = evento.target.value;
    this.setState({ listaRutas });
  };

  /**
   * Método encargado de generar los datos de la tabla de rutas
   * @return {Array}
   */
  renderBodyTabla = () => {
    return this.state.listaRutas.map((dato, index) => {
      if (!dato.tempCertificado && dato.lcdCerticado == 'N') {
        dato.tempCertificado = dato.lcdCerticado;
      }
      return (
        <tr key={dato.uniIderuta.uniIderegistro}>
          <td>{dato.uniIderuta.uniNombre1}</td>
          <td>
            <TextoNumerico
              aceptaDecimales={true}
              aceptaNegativos={false}
              value={dato.lcdLectura}
              cols={12}
              onChange={(evento) => {
                this.controlarCambioValorLectura(index, evento);
              }}
              name='lectura'
              extra={{ disabled: (dato.lcdCerticado === CERTIFICADO) ? true : false }}
            /></td>
          <td>
            <Combo
              opciones={this.state.listaUnidadMedida}
              propTexto='uniNombre1'
              propValor='uniIderegistro'
              name='unidadMedida'
              value={dato.uniIdemedida.uniIderegistro}
              cols={12}
              onChange={(evento) => {
                this.controlarCambioValorUnidadMedida(index, evento);
              }}
              extra={{ disabled: (dato.lcdCerticado === CERTIFICADO) ? true : false }}
            />
          </td>
          <td>
            <Combo
              opciones={listaCertificado}
              propTexto='texto'
              propValor='valor'
              name='certificado'
              cols={12}
              value={(dato.lcdCerticado === CERTIFICADO) ? dato.lcdCerticado : dato.tempCertificado}
              onChange={(evento) => {
                this.controlarCambioEstadoCertificacion(index, evento);
              }}
              extra={{ disabled: (dato.lcdCerticado === CERTIFICADO) ? true : false }}
            />
          </td>
        </tr>
      )
    });
  };

  renderFormularioManual = () => {
    return (
      <Fragment>
        <Combo
          opciones={this.state.listaContratos}
          propTexto='texto'
          propValor='cntIderegistro'
          label='Contratos:'
          name='contrato'
          value={this.state.contrato}
          onChange={this.controlarCambioContrato}
        />
        <Input
          label='Agente:'
          value={this.state.agente}
          extra={{ disabled: true, readOnly: true }}
          name='agente'
        />
        <Input
          label='Tipo de uso:'
          value={this.state.tipoUso}
          extra={{ disabled: true, readOnly: true }}
          name='tipoUso'
        />
        <Input
          label='Fecha inicio:'
          value={this.state.fechaInicio}
          extra={{ disabled: true, readOnly: true }}
          name='fechaInicio'
        />
        <Input
          label='Fecha fin:'
          value={this.state.fechaFin}
          extra={{ disabled: true, readOnly: true }}
          name='fechaFin'
        />
        <Fecha
          label='Fecha:'
          name='fecha'
          fecha={this.state.fecha}
          onChange={this.controlarCambio}
        />
        {this.state.listaRutas.length > 0 &&
          <div className='conf-general row mt28 gestion-lecturas-contratos'>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <th>Ruta GNC</th>
                  <th>Lectura Consumo</th>
                  <th>Unidad Medida</th>
                  <th>Certificado</th>
                </tr>
              </thead>
              <tbody>
                {this.renderBodyTabla()}
              </tbody>
            </table>
          </div>
        }
      </Fragment>
    )
  }

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
            <label htmlFor='txtArchivoRutas'>Archivo de lecturas:</label>
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
                contrato(Número), ruta(Codigo Interno), fecha(AAAA-MM-DD), cantidad, unidadMedida(M3/MBTU), certificado (S/N)
            </span>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

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
          {!this.state.masivo ?
            this.renderFormularioManual() :
            this.renderFormularioMasivo()
          }
        </div>
      </Fragment>
    );
  };
}

GestionLecturasContratos.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionLecturasContratos);

export { VistaRedux as RGestionLecturasContratos };
