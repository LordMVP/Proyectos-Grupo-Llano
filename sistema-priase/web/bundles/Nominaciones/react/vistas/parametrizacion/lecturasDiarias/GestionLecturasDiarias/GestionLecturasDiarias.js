import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import { formatearArray, limpiarJson, TIPOS_UNIDADES_MEDIDA } from '../../../../global/util_nominaciones';
import { PROGRAMAS, CLASES_UNIDADES } from '../../../../global/constantes';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import moment from 'moment';
import { toast } from 'react-toastify'

import './GestionLecturasDiarias.scss';

const listaCertificado = [
  { valor: 'S', texto: 'Certificado' },
  { valor: 'N', texto: 'No Certificado' }
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

const opciones = [
  { id: 'M', nombre: 'Manual' },
  { id: 'A', nombre: 'Archivo' },
  { id: 'C', nombre: 'Consulta' },
];

const TIPO_LECTURA = "I";
const CERTIFICADO = 'S';

class GestionLecturasDiarias extends Component {
  inputFileRef = null;
  state = {

    // Datos de la entidad
    listaPuntosConsumo: [],
    listaPuntosSeleccionados: [],
    listaLecturas: [],
    listaUnidadMedida: [],
    listaLecturasCertificar: [],
    tipo: '',
    puntoConsumo: '',
    lectura: '',
    fecha: '',
    fechaInicio: '',
    fechaFin: '',
    // Datos subir archivo
    separador: '-1',
    cabecera: '-1',
    lectura: '',
    checkeados: false
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTOS_CONSUMO_LECTURA, { criterio: '', tipoLectura: TIPO_LECTURA }),
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
   * Método encargado de limpiar los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      cabecera: '-1',
      separador: '-1',
      fecha: ' ',
      puntoConsumo: '',
      listaLecturas: [],
      fechaInicio: '',
      fechaFin: '',
      listaLecturasCertificar: [],
      checkeados: false
    });
    this.inputFileRef.value = '';
    this.inputFileRef.files = null;
  };

  /**
   * Método encargado de limpiar los campos del formulario de guardar lecturas manual
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormularioManual = (evento) => {
    this.setState({
      // Datos de la entidad
      cabecera: '-1',
      separador: '-1',
      fecha: ' ',
      puntoConsumo: '',
      listaLecturas: [],
      fechaInicio: '',
      fechaFin: '',
      listaLecturasCertificar: [],
      checkeados: false
    });
    this.inputFileRef.value = '';
    this.inputFileRef.files = null;
  };

  /**
   * @method
   * Método encargado de limpiar los campos del formulario de guardar lecturas manual
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarManual = (evento) => {
    this.setState({
      // Datos de la entidad
      puntoConsumo: '',
      fechaInicio: '',
      fechaFin: '',
      listaLecturasCertificar: [],
      checkeados: false
    });
  };

  /**
   * Método encargado de mostrar los errores al subir el archivo
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
   * Método encargado de guardar el adjunto de lecturas
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

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_DIARIAS.GUARDAR_MASIVO, data, configuracion)
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
   * Método encargado de generar los botones del formulario guardar manual",
   * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormularioManual }
    ];
  };

  /**
   * @method
   * Método encargado de generar los botones del formulario guardar manual",
   * @returns {Object}
   */
  obtenerFuncionesManual = () => {
    return [
      { texto: 'Actualizar', callback: this.actualizarLecturas },
      { texto: 'Consultar', callback: this.consultarLecturas },
      { texto: 'Limpiar', callback: this.limpiarManual }
    ];
  };

  construirListaLecturas = () => {
    const { listaLecturasCertificar } = this.state;
    const listaFinal = [];
    for (let index = 0; index < listaLecturasCertificar.length; index++) {
      const lectura = listaLecturasCertificar[index];
      if (lectura.seleccionado) {
        listaFinal.push(limpiarJson({ ...lectura, lcdCerticado: 'S' }));
      }
    }
    return listaFinal;
  }

  /**
   * @method
   * Método encargado de actualizar las lecturas seleccionadas
   * @returns {Boolean}
   */
  actualizarLecturas = () => {
    const lista = this.construirListaLecturas();
    if (!Util.validarArreglo(lista)) {
      toast.error('Debe seleccionar al menos una lectura');
      return;
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_DIARIAS.CERTIFICAR_LECTURAS, lista)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarManual()
        }
      });
  }

  /**
   * @method
   * Método encargado de validar el formulario para consultar
   * @returns {Object}
   */
  validarFormulariConsulta = () => {
    const { puntoConsumo, fechaFin, fechaInicio } = this.state;
    if (fechaInicio == '') {
      return { respuesta: false, mensaje: 'Debe seleccionar una fecha inicio' };
    }

    if (fechaFin == '') {
      return { respuesta: false, mensaje: 'Debe seleccionar una fecha fin' };
    }

    if (puntoConsumo == '' || puntoConsumo == '-1') {
      return { respuesta: false, mensaje: 'Debe seleccionar un punto de consumo' };
    }
    return { respuesta: true };
  }

  /**
   * @method
   * Método encargado de consultar las lecturas en el rango seleccionado
   * @returns {Boolean}
   */
  consultarLecturas = () => {
    const { puntoConsumo, fechaFin, fechaInicio } = this.state;
    const validacion = this.validarFormulariConsulta();
    if (!validacion.respuesta) {
      toast.error(validacion.mensaje);
      return;
    }
    const objeto = {
      idPuntoConsumo: puntoConsumo,
      fechaFin: fechaFin,
      fechaInicio: fechaInicio
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_DIARIAS.CONSULTAR_LECTURAS_RANGO, objeto)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const lista = [...respuesta.data.datos];
          lista.forEach(lectura => {
            if (lectura.lcdCerticado == 'S') {
              lectura.seleccionadoNoEnviar = true;
            }
          });
          this.setState({ listaLecturasCertificar: lista });
        }
      });
  }

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
   * Método encargado de validar los campos de la tabla lecturas
   * @returns {bool}
   */
  validarTablaLecturas = () => {
    const { fecha } = this.state;
    const momentInicio = moment(fecha);
    for (let i = 0; i < this.state.listaLecturas.length; i++) {
      const lectura = this.state.listaLecturas[i];
      if (!lectura.lcdLectura || lectura.lcdLectura === '') {
        this.props.mostrarAlerta('Datos incompletos', 'Debe ingresar una lectura para el punto de consumo: ' + lectura.nombrePunto);
        return false;
      }

      if (!lectura.uniIdemedida.uniIderegistro || lectura.uniIdemedida.uniIderegistro === '' || lectura.uniIdemedida.uniIderegistro === '-1') {
        this.props.mostrarAlerta('Datos incompletos', 'Debe seleccionar una unidad de medida para el punto de consumo: ' + lectura.nombrePunto);
        return false;
      }

      if (!lectura.tempCertificado || lectura.tempCertificado === '' || lectura.tempCertificado === '-1') {
        this.props.mostrarAlerta('Datos incompletos', 'Debe especificar si el punto de consumo ' + lectura.nombrePunto + ' se encuentra certificado o no');
        return false;
      }

      const momentFin = moment();
      let diferencia = momentFin.diff(momentInicio, 'months', true);
      if (diferencia >= 2) {
        this.props.mostrarAlerta('Error', 'No se pueden actualizar lecturas pasados 30 días o más ');
        return false;
      }
    };
    return true;
  };

  /**
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
   * Método encargado de validar las variables del formulario",
   * @returns {Object}
   */
  validarFormulario = () => {
    // Validaciones
    const { fecha, listaLecturas } = this.state;
    const fechaDate = new Date(fecha);
    const fechaActual = new Date();
    if (fecha.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha' } };
    }

    if (!Util.validarArreglo(listaLecturas)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos un punto de consumo' } };
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
    const { fecha, listaLecturas } = this.state;
    let fechaSeleccionada = {
      "fechaLectura": fecha
    };
    const valores = listaLecturas.map((dato, index) => (
      {
        "ptcIdepuntoconsumo": {
          "ptcIderegistro": dato.ptcIdepuntoconsumo.ptcIderegistro
        },
        "lcdLectura": dato.lcdLectura,
        "uniIdemedida": {
          "uniIderegistro": dato.uniIdemedida.uniIderegistro
        },
        'lcdCerticado': (dato.lcdCerticado === 'S') ? dato.lcdCerticado : dato.tempCertificado
      }
    ));
    fechaSeleccionada.listaValores = valores;
    return fechaSeleccionada;
  };

  /**
   * Método encargado de guardar los datos de la entidad,
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    const validacionTablaLecturas = this.validarTablaLecturas();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    if (!validacionTablaLecturas) {
      return false;
    }

    const entidadGuardar = this.obtenerValores();
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_DIARIAS.GUARDAR_MANUAL, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormularioManual();
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
  * Método encargado de controlar el cambio al seleccionar una nueva fecha
  * @param {number} index Posición que se esta modificando
  * @param {Event} evento El evento que se ejecuta en el control de usuario.
  */
  controlarCambioFecha = (evento) => {
    let change = {};
    change = evento.target.value;
    this.setState({ fecha: change, listaLecturas: [] });
  };

  /**
   * Método encargado de controlar el cambio al ingresar nuevas lecturas
   * @param {number} index Posición que se esta modificando
   * @param {Event} evento El evento que se ejecuta en el control de usuario.
   */
  controlarCambioLectura = (index, evento) => {
    const lecturas = [...this.state.listaLecturas]
    lecturas[index].lcdLectura = evento.target.value;
    this.setState({ lecturas: this.state.listaLecturas });
  };

  /**
   * Método encargado de controlar el cambio al seleccionar nuevas unidades de medida
   * @param {number} index Posición que se esta modificando
   * @param {Event} evento El evento que se ejecuta en el control de usuario.
   */
  controlarCambioValorUnidadMedida = (index, evento) => {
    const lecturas = [...this.state.listaLecturas]
    lecturas[index].uniIdemedida.uniIderegistro = evento.target.value;
    this.setState({ lecturas: this.state.listaLecturas });
  };

  /**
   * Método encargado de controlar el cambio al cambiar el estado de la lectura
   * @param {number} index Posición que se esta modificando
   * @param {Event} evento El evento que se ejecuta en el control de usuario.
   */
  controlarCambioEstadoCertificacion = (index, evento) => {
    const lecturas = [...this.state.listaLecturas];
    lecturas[index].tempCertificado = evento.target.value;
    this.setState({ lecturas: this.state.listaLecturas });
  };

  /**
   * Método encargado de eliminar el punto de consumo seleccionado
   * @param {number} posicion Posición del punto de consumo que se desea eliminar
   */
  eliminarPuntoConsumo = (posicion) => {
    const lista = [...this.state.listaLecturas];
    lista.splice(posicion, 1);
    this.setState({ listaLecturas: lista });
  };

  /**
   * Método encargado de mostrar la tabla de lecturas
   * @returns {Object}
   */
  renderTabla = () => {
    return (
      <div className='col-12'>
        <table className='table table-striped mt25 nolabel'>
          <thead>
            <tr>
              <th>Punto De Consumo</th>
              <th>Lectura</th>
              <th>Unidad Medida</th>
              <th>Certificación</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.listaLecturas.map((dato, index) => {
                return (
                  <tr key={"lectura_" + dato.ptcIdepuntoconsumo.ptcIderegistro}>
                    <td>{dato.nombrePunto}</td>
                    <td>
                      <Input
                        value={dato.lcdLectura}
                        cols={12}
                        onChange={(evento) => {
                          this.controlarCambioLectura(index, evento);
                        }}
                        name='lectura'
                        extra={{ disabled: (dato.lcdCerticado === CERTIFICADO) ? true : false }}
                      />
                    </td>
                    <td>
                      <Combo
                        opciones={this.state.listaUnidadMedida}
                        propTexto='uniNombre1'
                        propValor='uniIderegistro'
                        cols={12}
                        name='unidadMedida'
                        value={dato.uniIdemedida.uniIderegistro}
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
                    <td>
                      <button className='btnEliminar' disabled={(dato.lcdCerticado === CERTIFICADO) ? true : false} onClick={() => {
                        this.eliminarPuntoConsumo(index)
                      }}>X</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  };

  /**
   * Método para validar que no hayan lecturas repetidas
   * @returns {bool}
   */
  validarListaLecturas = () => {
    const index = this.state.listaLecturas.findIndex(p => p.ptcIdepuntoconsumo.ptcIderegistro == this.state.puntoConsumo);
    return index >= 0;
  };

  /**
   * Método encargado de consultar las lecturas del punto de consumo seleccionado
   * @returns {bool}
   */
  agregarListaSeleccionados = () => {
    const { fecha, puntoConsumo } = this.state;
    const fechaDate = new Date(fecha);
    const fechaActual = new Date();
    if (!Util.validarArreglo(this.state.listaPuntosConsumo)) {
      return;
    }

    if (puntoConsumo === '' || puntoConsumo === '-1') {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar un punto de consumo')
      return;
    }

    if (this.validarListaLecturas()) {
      this.props.mostrarAlerta('Error', 'El punto de consumo ya se encuentra en la lista');
      return;
    }

    if (fecha.trim() === '') {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar una fecha');
      return;
    }

    if (fechaDate > fechaActual) {
      this.props.mostrarAlerta('Atención', 'La fecha seleccionada no puede ser mayor a la fecha actual');
      return;
    }

    const puntoConsumoSeleccionado = this.state.listaPuntosConsumo.find(p => this.state.puntoConsumo == p.ptcIderegistro);
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LECTURAS_DIARIAS.CONSULTAR_LECTURAS_DIARIAS, { criterio: puntoConsumoSeleccionado.ptcoCodigogestor, fecha: fecha })
      .then((respuesta) => {
        let { listaLecturas } = this.state;
        if (respuesta.data.codigo > 0) {
          let lista = respuesta.data.datos;
          for (let index = 0; index < lista.length; index++) {
            const puntoConsultado = lista[index];
            puntoConsultado.nombrePunto = puntoConsumoSeleccionado.ptcoNombre;
            puntoConsultado.tempCertificado = puntoConsultado.lcdCerticado;
            listaLecturas.push(puntoConsultado);
          };
        }

        if (respuesta.data.codigo === 0) {
          listaLecturas.push(
            {
              lcdLectura: '0',
              uniIdemedida: { uniIderegistro: '-1' },
              tempCertificado: '-1',
              ptcIdepuntoconsumo: { ptcIderegistro: puntoConsumoSeleccionado.ptcIderegistro },
              nombrePunto: puntoConsumoSeleccionado.ptcoNombre
            }
          );
        }
        this.setState({ listaLecturas: listaLecturas });
      });
  };

  /**
   * Método encargado de mostrar el formulario para guardar lecturas manualmente
   * @returns {Object}
   */
  renderManual = () => {
    return (
      <div className='conf-general row mt-5'>
        <Botonera className='mb-5' funciones={this.obtenerFunciones()} />
        <Fecha
          label="Fecha:"
          onChange={this.controlarCambioFecha}
          name='fecha'
          fecha={this.state.fecha}
        />
        <Combo
          opciones={this.state.listaPuntosConsumo}
          propTexto='ptcoNombre'
          propValor='ptcIderegistro'
          label='Puntos de consumo'
          value={this.state.puntoConsumo}
          onChange={this.controlarCambio}
          name="puntoConsumo"
        />
        <div className='form-group'>
          <button className='btn btn-primary m-t-24' onClick={this.agregarListaSeleccionados}>Agregar</button>
        </div>
        {this.renderTabla()}
      </div>
    )
  };

  /**
   * Método encargado de mostrar el formulario para guardar lecturas por medio de un adjunto
   * @returns {Object}
   */
  renderMasivo = () => {
    return (
      <div className='conf-general row mt-5'>
        <Botonera funciones={this.obtenerFuncionesMasivo()} />
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
                identificador ante el transportador, fecha(YYYY-MM-DD), lectura [ El separador de los valores decimales es un punto "." (0.00)], unidadMedida(Unidad Ejemplo: M3), certificado (S/N)
            </span>
            </div>
          </div>
        </div>
      </div>
    )
  };

  /**
   * @method
   * Método encargado de certificar la lectura leccionada
   * @param {Number} posicion Posición a certificar
   * @param {Boolean} marcarTodos Atributo para verificar si va a certiicar todas las lecturas
   */
  certificar = (posicion = null, marcarTodos = false) => {
    const lista = [...this.state.listaLecturasCertificar];
    let estado = false;
    let contador = 0;
    if (marcarTodos == true) {
      lista.forEach(lectura => {
        if (lectura.lcdCerticado != 'S') {
          lectura.seleccionado = (typeof lectura.seleccionado == 'undefined') ? true : !lectura.seleccionado;
        }
        if (lectura.lcdCerticado == 'S') {
          contador++
        }
      });
      if (contador == lista.length) {
        estado = true;
      }
      this.setState({ listaLecturasCertificar: lista, checkeados: (estado == true) ? false : !this.state.checkeados });
      return;
    }
    if (lista[posicion].lcdCerticado == 'S') {
      return;
    }
    lista[posicion].seleccionado = (typeof lista[posicion].seleccionado == 'undefined') ? true : !lista[posicion].seleccionado;
    this.setState({ listaLecturasCertificar: lista });
  }

  /**
   * @method
   * Método encargado de mostrar el campo para certificar las lecturas
   * @returns {JSX}
   */
  renderCertificar = (props) => {
    let checked = props.row._original.seleccionado;
    if (props.row._original.seleccionadoNoEnviar) {
      return 'Certificado';
    }
    return (
      <label><input checked={checked || false} type="checkbox" onChange={() => { this.certificar(props.index) }} name='check' /> Seleccionar</label>
    )
  }

  /**
   * @method
   * Método encargado de mostrar las columnas de la tabla consulta
   * @returns {Array}
   */
  obtenerColumnas = () => {
    return [
      {
        Header: 'Lecturas',
        columns: [
          { Header: 'Fecha', accessor: 'lcdFechalectura' },
          { Header: 'Cantidad', accessor: 'lcdLectura' },
          { Header: 'Unidad Medida', accessor: 'uniIdemedida.uniNombre1' },
          {
            Header: () => (
              <label><input type="checkbox" checked={this.state.checkeados} onChange={() => { this.certificar(null, true) }} name='check' /> Certificar</label>
            ),
            accesor: 'seleccionado',
            Cell: (props) => (this.renderCertificar(props, this)),
          },
        ],
      },
    ]
  }

  /**
   * @method
   * Método encargado de mostrar la tabla para certificar las lecturas
   * @returns {Component}
   */
  renderTablaCertificar = () => {
    if (!Util.validarArreglo(this.state.listaLecturasCertificar)) {
      return <div className='text-center '>Sin resultados</div>;
    }

    return (
      <Tabla
        datos={this.state.listaLecturasCertificar}
        columnas={this.obtenerColumnas()}
        className='mt-5'
      />
    );
  };

  /**
   * @method
   * Método encargado de consultar las lecturas para certificación
   * @returns {Object}
   */
  renderConsulta = () => {
    return (
      <Fragment>
        <Botonera className='mb-5' funciones={this.obtenerFuncionesManual()} />
        <Fecha
          label="Fecha Inicio:"
          onChange={this.controlarCambio}
          name='fechaInicio'
          fecha={this.state.fechaInicio}
        />
        <Fecha
          label="Fecha Fin:"
          onChange={this.controlarCambio}
          name='fechaFin'
          fecha={this.state.fechaFin}
        />
        <Combo
          opciones={this.state.listaPuntosConsumo}
          propTexto='ptcoNombre'
          propValor='ptcIderegistro'
          label='Puntos de consumo'
          value={this.state.puntoConsumo}
          onChange={this.controlarCambio}
          name="puntoConsumo"
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
        <div className='conf-general row mt-5'>
          <Combo
            opciones={opciones}
            propTexto='nombre'
            propValor='id'
            label='Tipo:'
            name='tipo'
            value={this.state.tipo}
            onChange={this.controlarCambio}
          />
          {
            this.state.tipo === 'M' &&
            this.renderManual()
          }
          {
            this.state.tipo === 'A' &&
            this.renderMasivo()
          }
          {
            this.state.tipo === 'C' &&
            this.renderConsulta()
          }
        </div>
        {
          this.state.tipo === 'C' &&
          this.renderTablaCertificar()
        }

      </Fragment>
    );
  };
}

GestionLecturasDiarias.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionLecturasDiarias);

export { VistaRedux as RGestionLecturasDiarias };
