import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import { RConsultaPrepago } from '../ConsultaPrepagos';
import RUTAS_API from '../../../../global/rutas_api';
import { formatearArray, limpiarJson } from '../../../../global/util_nominaciones';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';

import './GestionRegistroPagoPrepago.scss';
import RUTAS_VISTA from '../../../../global/rutas_vista';
import { CLASES_UNIDADES } from '../../../../global/constantes';
import { get as getProp } from 'object-path';

const ESTADO_ACTIVO = 'A';

const listaOpciones = [
  { texto: 'Si', valor: 'S' },
  { texto: 'No', valor: 'N' },
]

class GestionRegistroPagoPrepago extends Component {
  state = {
    // Datos de la entidad
    agente: '',
    fechaInicio: '',
    fechaFin: '',
    mesServicio: '',
    valorPrepago: '',
    valoresPagados: '',
    otrosValores: '',
    saldoFavor: '',
    cruzaSaldo: '',
    saldoInicial: '',
    garantia: null,
    fecha: '',
    contrato: '',
    idTercero: '',
    saldo: '',
    valorPago: '',
    idRecaudo: null,
    tipoUso: '',
    nombreAdjunto: '',
    listaContratos: [],
    listaAdjuntos: [],
    // Estado de la aplicacion
    mostrarModalConsulta: false,
    consultaPrepago: false

  };

  /**
   * @method
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }

    this.consultarListaEstados((listaEstados) => {
      this.setState({
        listaEstados: listaEstados.data.datos,
      });
    });
  };

  /**
   * @method
   * Consulta la lista de los estados...
   */
  consultarListaEstados = (callback) => {
    const peticiones = [
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_ESTADOS, { criterio: '', idClase: CLASES_UNIDADES.ESTADOS_CONTRATO }),
    ];
    axios.all(peticiones)
      .then(
        axios.spread((listaEstados) => {
          callback(listaEstados);
        })
      );
  };

  /**
   * @method
   * Método encargado ejecutar una acción cuando se elimina el componente
   */
  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  };

  /**
   * @method
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let funciones = [{ texto: 'Buscar Contrato', callback: this.buscarContrato }];
    if (!this.state.consultaPrepago) {
      funciones.push({ texto: 'Guardar', callback: this.guardarEntidad });
    }
    funciones.push(
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario });
    return funciones;
  };

  /**
   * @method
   * Método encargado de cargar los datos de un componente externo
   * @param {Object} entidad Datos componente externo
   */
  cargarDatos = (entidad) => {
    this.asignarDatosContrato(entidad);
  };

  /**
   * @method
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.props.history.replace({ entidadEditar: null });
    this.setState({
      // Datos de la entidad
      agente: '',
      fechaInicio: '',
      fechaFin: '',
      mesServicio: ' ',
      valorPrepago: '',
      valoresPagados: '',
      otrosValores: '',
      saldoFavor: '',
      cruzaSaldo: '',
      saldoInicial: '',
      garantia: null,
      idContrato: '',
      idTercero: '',
      fecha: ' ',
      saldo: '',
      valorPago: '',
      tipoUso: '',
      nombreAdjunto: '',
      listaAdjuntos: [],
      // Estado de la aplicacion
      mostrarModalConsulta: false,
      consultaPrepago: false,
    });
  };

  /**
   * Método encargado de consultar el anticipo al momento de guardar
   */
  consultarDatos = () => {
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PAGO_PREPAGO.CONSULTAR_CONTRATOS),
    ];
    axios.all(peticiones)
      .then(axios.spread((anticipo, contratos) => {
        const datosAplicacion = {
          listaContratos: [],
        };
        if (contratos.data.codigo > 0) {
          datosAplicacion.listaContratos = formatearArray(contratos.data.datos);
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * @method
   * Método encargado de limpiar el formulario al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  };

  /**
   * @method
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { fecha, cruzaSaldo, idContrato, valorPago, listaAdjuntos } = this.state;
    //Validaciones
    if (!idContrato) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un contrato.' } };
    }

    if (fecha.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la fecha.' } };
    }

    if (cruzaSaldo === '' || cruzaSaldo === '-1' || cruzaSaldo === -1) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar si cruza o no saldo.' } };
    }

    if (valorPago.toString().trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el valor pago' } };
    }

    if (isNaN(valorPago)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El valor pago solo puede ser un número' } };
    }

    if (parseFloat(valorPago) < 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El valor no puede ser menor a 0' } };
    }

    if (parseFloat(valorPago) > 0) {
      if (!Util.validarArreglo(listaAdjuntos)) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe adjuntar el soporte de pago' } };
      }
    }

    return { respuesta: true };
  };

  /**
   * @method
   * Método encargado de generar un string con el los valores de los archivos adjuntos
   * @returns {string}
   */
  obtenerAdjuntos = () => {
    if (!Util.validarArreglo(this.state.listaAdjuntos)) {
      return '[]';
    }
    return JSON.stringify(this.state.listaAdjuntos);
  };

  /**
   * @method
   * Método encargado de generar el objeto para guardar
   * @returns {Object}
   */
  obtenerDatos = () => {
    const { fecha, mesServicio, valorPago, idRecaudo, garantia, contrato, idTercero, cruzaSaldo } = this.state;
    const objetoDevolver = {
      rccFecharecaudo: fecha,
      rccValor: valorPago,
      rccIderegistro: idRecaudo,
      rccSoporte: this.obtenerAdjuntos(),
      rccPeriodo: mesServicio,
      cruzar: cruzaSaldo,
      terIderegistro: {
        terIderegistro: idTercero
      },
      contrato: limpiarJson(contrato),
      garantia: limpiarJson(garantia)
    };
    return objetoDevolver;
  };

  /**
   * Método encargado de convertir la fecha ingresada a Date
   * @param {string} fecha fecha seleccionada por el usuario
   * @returns {String}
   */
  parsearFechaServidor = (fecha) => {
    fecha = new Date(fecha);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    return anio + '-' + ((mes < 9) ? '0' + mes : mes) + '-' + ((dia < 9) ? '0' + dia : dia);
  };

  /**
   * @method
   * Método encargado de guardar los datos de la entidad
   * @param {String} proceso Proceso a ejecutar
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const entidadGuardar = this.obtenerDatos();
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PAGO_PREPAGO.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.props.mostrarAlerta('Correcto', (this.state.consultaPrepago) ? 'Se anuló el pago con número: ' : 'Se registró el pago con número: ' + respuesta.data.datos);
          this.limpiarFormulario();
        }
      });
  };

  /**
   * @method
   * Método encargado de abrir la ventana modal del botón de consulta
   */
  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  /**
   * @method
   * Método encargado de calcular el nuevo saldo cuando se selecciona cruce
   */
  calcularValorSaldoInicialSinCruce = () => {
    const { valorPrepago, valoresPagados } = this.state;
    const saldoInicial = (valorPrepago - valoresPagados);
    this.setState({ saldoInicial: saldoInicial }, this.calcularSaldo);
  };

  /**
   * @method
   * Método encargado de calcular el nuevo saldo cuando se selecciona sin cruce
   */
  calcularValorSaldoInicial = () => {
    const { valorPrepago, valoresPagados, saldoFavor, otrosValores } = this.state;
    const saldoInicial = (valorPrepago - valoresPagados - saldoFavor + otrosValores);
    this.setState({ saldoInicial: saldoInicial }, this.calcularSaldo);
  };

  /**
   * @method
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    if (this.state.idRecaudo != null) {
      return;
    }
    const { name, value } = evento.target;
    if (name == 'cruzaSaldo' && value == 'S') {
      this.calcularValorSaldoInicial();
    }
    if (name == 'cruzaSaldo' && value == 'N') {
      this.calcularValorSaldoInicialSinCruce();
    }
    change[name] = value;
    this.setState({ [name]: value }, this.calcularSaldo);
  };

  /**
   * @method
   * Método encargado de limpiar los datos del formulario
   */
  limpiarDatosContrato = () => {
    this.setState({
      saldo: '',
      valorPrepago: '',
      fechaInicio: '',
      fechaFin: '',
      tipoUso: '',
      agente: '',
      idContrato: null,
      contrato: null,
      garantia: '',
      saldoInicial: '',
      valoresPagados: '',
      idTercero: '',
      consultaPrepago: false,
      idRecaudo: null,
    });
  };

  /**
   * @method
   * Método encargadode consultrar los datos de un contrato por identificador
   * @param {Object} entidad Datos del contrato
   */
  consultarContrato = (entidad) => {
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PAGO_PREPAGO.CONSULTAR_CONTRATOS, { idContrato: entidad.cntIderegistro }),
      axios.post(RUTAS_API.CONTRATOS.CONSULTAR_DETALLE_CONTRATO, { idContrato: entidad.cntIderegistro }),
    ];

    axios.all(peticiones)
      .then(axios.spread((valores, detalle) => {
        const datosAplicacion = {
          listaTramo: [],
          fechaInicio: '',
          fechaFin: '',
          agente: entidad.terIdeagente.terNomcompleto,
          idTercero: entidad.terIdeagente.terIderegistro,
          idContrato: entidad.cntIderegistro,
          contrato: entidad,
          valorPrepago: '',
          valoresPagados: '',
          mesServicio: '',
          otrosValores: '',
          saldoFavor: '',
          tipoUso: entidad.uniIdetipouso.uniNombre1,
          consultaPrepago: false,
          saldo: '',
          garantia: ''
        };
        if (valores.data.codigo > 0) {
          const valoresGarantia = valores.data.datos;
          datosAplicacion.valorPrepago = valoresGarantia.valorGarantia;
          datosAplicacion.valoresPagados = valoresGarantia.valorPagado;
          datosAplicacion.otrosValores = valoresGarantia.valorDeudado;
          datosAplicacion.saldoFavor = valoresGarantia.saldoFavor;
          datosAplicacion.saldoInicial = (valoresGarantia.valorGarantia - valoresGarantia.valorPagado);
          datosAplicacion.saldo = datosAplicacion.saldoInicial;
        } else {
          this.limpiarDatosContrato();
        }
        if (detalle.data.codigo > 0) {
          const garantia = detalle.data.datos.garantia;
          datosAplicacion.fechaInicio = garantia.cntgFechainicio;
          datosAplicacion.fechaFin = garantia.cntgFechafin;
          datosAplicacion.mesServicio = garantia.cntgFechainicio.substr(0, 7);
          datosAplicacion.garantia = garantia;
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * @method
   * Método encargado de traer los datos requeridos del contrato seleccionado
   * @param {number} idContrato Identificador del contrato seleccionado
   * @returns {Boolean}
   */
  asignarDatosContrato = (entidad) => {
    if (!entidad) {
      this.limpiarDatosContrato();
      return;
    }
    this.consultarContrato(entidad);
  };

  /**
   * @method
   * Método encargado de abrir el selector de archivos
   */
  abrirSelectorArchivo = () => {
    this.selectorArchivo.click();
  };

  /**
   * @method
   * Método encargado de subir el archivo adjunto
   * @param {Array} adjunto Contiene los datos del adjunto seleccionado
   * @returns {bool}
   */
  subirArchivo = (adjunto) => {
    const lista = [...this.state.listaAdjuntos];
    if (lista.length > 0) {
      this.props.mostrarAlerta('Error', 'Solo puede adjuntar un archivo');
      return;
    }
    const data = new FormData();
    data.append('archivo[]', adjunto);
    const configuracion = { headers: { 'Content-Type': 'multipart/form-data' } };
    axios.post(RUTAS_API.GLOBAL.SUBIR_ARCHIVOS, data, configuracion)
      .then((respuesta) => {
        this.procesarArchivo(respuesta.data.datos);
      });
  };

  /**
   * @method
   * Método encargado de agregar el adjunto seleccionado a una lista
   * @param {Array} adjunto Contiene los datos del adjunto seleccionado
   */
  procesarArchivo = (adjunto) => {
    adjunto = adjunto[0];
    let { listaAdjuntos } = this.state;
    listaAdjuntos.push(adjunto);
    this.setState({ listaAdjuntos: listaAdjuntos, nombreAdjunto: adjunto.nombreOriginal });
  };

  /**
   * @method
   * Método encargado de controlar el cambio al seleccionar un adjunto
   * @param {Event} evento El evento que se ejecuta en el control de usuario.
   * @returns {bool}
   */
  controlarCambioArchivo = (evento) => {
    if (evento.target.files.length === 0) {
      return;
    }
    const adjunto = evento.target.files[0];
    this.subirArchivo(adjunto);
  };

  /**
   * @method
   * Método encargado de cerrar la ventana modal del botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({ mostrarModalConsulta: false });
  };

  /**
   * @method
   * Obtiene el id específico del estado contrato finalizado.
   * @return {number}
   */
  obtenerIdEstado = (codigoEstado) => {
    const { listaEstados } = this.state;
    if (!Util.validarArreglo(listaEstados)) {
      return 0;
    }
    const estado = listaEstados.filter(e => (JSON.parse(e.uniPropiedad).estado == codigoEstado));
    if (!Array.isArray(estado)) {
      return 0;
    }
    return JSON.parse(estado[0].uniPropiedad).estado;
  };


  /**
   * @method
   * Redireccionará al módulo de la consulta de contratos.
   * @returns {Boolean}
   */
  buscarContrato = () => {
    const estado = this.obtenerIdEstado(ESTADO_ACTIVO);
    if (estado === 0) {
      this.props.mostrarAlerta('Error de Configuración', 'Debe configurar los estados del programa para poder ejecutar la petición solicitada');
      return;
    }
    this.props.history.push({
      pathname: RUTAS_VISTA.CONSULTA_CONTRATOS.url,
      state: {
        interfazGestion: RUTAS_VISTA.GESTION_PAGO_PREPAGO.url,
        estadosContrato: [estado],
        tipoGarantia: 'PR',
        inhabilitarEstado: true,
      }
    });
  };

  /**
   * @method
   * Método encargado de calcular el saldo
   * @returns {Number}
   */
  calcularSaldo = () => {
    const { saldoInicial, valorPago } = this.state;
    if (valorPago == '') {
      this.setState({ saldo: saldoInicial });
      return;
    }
    const saldo = (saldoInicial - parseFloat(valorPago));
    this.setState({ saldo: saldo });
  };

  /**
   * @method
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Input
            label='Agente:'
            value={this.state.agente}
            extra={{ disabled: true, readOnly: true }}
            name='agente'
            onChange={this.controlarCambio}
            cols={3}
          />
          <Fecha
            label="Fecha Inicio:"
            name='fechaInicio'
            formato='YYYY/MM/dd'
            fecha={this.state.fechaInicio}
            extra={{ disabled: true }}
            cols={3}
          />
          <Fecha
            label="Fecha Fin:"
            name='fechaFin'
            formato='YYYY/MM/dd'
            fecha={this.state.fechaFin}
            extra={{ disabled: true }}
            cols={3}
          />
          <Fecha
            label="Mes de Servicio"
            name='mesServicio'
            fecha={this.state.mesServicio}
            sinDia={true}
            extra={{ disabled: this.state.consultaPrepago }}
            cols={3}
          />
          <TextoNumerico
            aceptaDecimales={false}
            aceptaNegativos={false}
            label='Valor Prepago:'
            value={this.state.valorPrepago}
            extra={{ disabled: true, readOnly: true }}
            name='valorPrepago'
            cols={3}
          />
          <Input
            label='Valores Pagados:'
            value={this.state.valoresPagados}
            extra={{ disabled: true, readOnly: true }}
            name='valoresPagados'
            cols={3}
          />
          <Input
            label='Otros Valores Adeudados:'
            value={this.state.otrosValores}
            extra={{ disabled: true, readOnly: true }}
            name='otrosValores'
            cols={3}
          />
          <Input
            label='Saldo a Favor:'
            value={this.state.saldoFavor}
            extra={{ disabled: true, readOnly: true }}
            name='saldoFavor'
            cols={3}
          />
          <Input
            label='Tipo de uso:'
            value={this.state.tipoUso}
            extra={{ disabled: true, readOnly: true }}
            name='tipoUso'
            cols={3}
          />
          <Combo
            opciones={listaOpciones}
            propTexto='texto'
            propValor='valor'
            label='Cruzar Saldos:'
            name='cruzaSaldo'
            value={this.state.cruzaSaldo}
            onChange={this.controlarCambio}
            extra={{ disabled: this.state.consultaPrepago }}
            cols={3}
          />
          <Input
            label='Saldo Inicial:'
            value={this.state.saldoInicial}
            name='saldoInicial'
            extra={{ disabled: true, readOnly: true }}
            cols={3}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Valor Pago:'
            value={this.state.valorPago}
            onChange={this.controlarCambio}
            name='valorPago'
            extra={{ disabled: this.state.consultaPrepago }}
            cols={3}
          />
          <TextoNumerico
            aceptaDecimales={false}
            aceptaNegativos={false}
            label={`Saldo`}
            value={this.state.saldo}
            name='saldo'
            extra={{ disabled: true, readOnly: true }}
            cols={3}
          />
          <Fecha
            label="Fecha:"
            name='fecha'
            formato='YYYY/MM/dd'
            fecha={this.state.fecha}
            onChange={this.controlarCambio}
            extra={{ disabled: this.state.consultaPrepago }}
            cols={3}
          />
        </div>
        <div className='card col-8'>
          <div className='card-header bg-dark text-white row'>
            <h5>Adjuntar documento</h5>
          </div>
          <div className='card-body row'>
            <div className='form-group col-12'>
              <div className='input-group'>
                <input type="text"
                  className='form-control'
                  disabled={true}
                  name='nombreAdjunto'
                  value={this.state.nombreAdjunto}
                />
                <div className='input-group-btn'>
                  <button className='btn btn-primary'
                    onClick={this.abrirSelectorArchivo}
                    disabled={this.state.consultaPrepago}
                  ><i className='fa fa-fw fa-paperclip'></i> Seleccionar Archivo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type='file'
          id='selectorArchivo'
          accept='application/pdf'
          ref={ref => (this.selectorArchivo = ref)}
          className='contratos-adjunto hidden'
          onChange={this.controlarCambioArchivo}
        />
        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo={'Consultar Prepagos'}
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaPrepago esModal />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionRegistroPagoPrepago.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionRegistroPagoPrepago);

export { VistaRedux as RGestionRegistroPagoPrepago };
