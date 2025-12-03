import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { get as getProp } from 'object-path';
import { Input, Botonera, Combo, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import './GestionCalculoNominacion.scss';
import { formatearArray, TIPOS_UNIDADES_MEDIDA } from '../../../../global/util_nominaciones';
import { ESTADOS_NOMINACIONES } from '../../../../global/constantes';
import { toast } from 'react-toastify'

const VISTAS = [
  { id: 0, titulo: 'Nominación Puntos Consumo', componente: 'obtenerNominacion' },
  { id: 1, titulo: 'Desvios Activos', componente: 'obtenerDesvios' },
  { id: 2, titulo: 'Contratos Suministro', componente: 'obtenerContratosSuministro' },
  { id: 3, titulo: 'Contratos Transporte', componente: 'obtenerContratosTransporte' },
  { id: 4, titulo: 'Nominación de Transporte', componente: 'obtenerNominacionTransporte' },
  { id: 5, titulo: 'Nominación de Suministro', componente: 'obtenerNominacionSuministro' },
]

class CalculoNominacion extends Component {

  state = {
    // Datos de la entidad
    fechaNominar: '',
    unidadMedidaNominacionSuministro: '',
    unidadMedidaNominacionTransporte: '',
    estadoNominacion: '',
    // Lista Aplicación
    listaUnidadCantidad: [],
    listaDesvios: [],
    listaCalculo: [],
    listaContratos: [],
    listaContratosSuministro: [],
    listaContratosTransporte: [],
    listaUnidadSuministro: [],
    totalData: {},
    // Estado de la aplicacion
    estadoDesvios: ESTADOS_NOMINACIONES.NO_CALCULO,
    mostrarModalConsulta: false,
    // Programa Actual
    programaActual: 0,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    this.consultarListas();
  };

  /**
   * Método encargado de mostrar los errores al momento de consultar la unidad de medida de suministro
   * @param {Array} errores Lista de errores
   */
  mostrarError = (errores) => {
    let strMensaje = errores.map((err, index) => (<li key={index}>{`Unidad de Medida ${err.nombre}: ${err.medidores}`}</li>));
    let mensaje = (
      <Fragment>
        <span>{`Medidores con unidades de medida inconsistentes.`}</span>
        <ul className='container mt-2 pl-5'>{strMensaje}</ul>
      </Fragment>
    );
    this.props.mostrarAlerta('Error', mensaje);
  };

  /**
   * @method
   * Consulta las listas necesarias para usar la interfaz...
   */
  consultarListas = () => {
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.CANTIDAD }),
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CALCULO_NOMINACION.UNIDADES_SUMINISTRO, { criterio: '' }),
    ];
    axios.all(peticiones)
      .then(axios.spread((unidadesCantidad, medidoresSuministro) => {
        const datosAplicacion = {
          listaUnidadCantidad: [],
        };
        if (unidadesCantidad.data.codigo > 0) {
          datosAplicacion.listaUnidadCantidad = formatearArray(unidadesCantidad.data.datos);
        }
        if (medidoresSuministro.data.codigo > 0 && medidoresSuministro.data.datos.length == 1) {
          datosAplicacion.listaUnidadSuministro = formatearArray(medidoresSuministro.data.datos);
        }
        if (medidoresSuministro.data.codigo > 0 && medidoresSuministro.data.datos.length > 1) {
          this.mostrarError(medidoresSuministro.data.datos);
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
      fechaNominar: '',
      estadoNominacion: '',
      unidadMedidaNominacionSuministro: '',
      unidadMedidaNominacionTransporte: '',
      //Listas
      listaDesvios: [],
      listaCalculo: [],
      listaContratos: [],
      listaContratosSuministro: [],
      listaContratosTransporte: [],
      listaNominacionSuministro: [],
      listaNominacionTransporte: [],
      totalData: {},
      // Estado de la aplicacion
      estadoDesvios: ESTADOS_NOMINACIONES.NO_CALCULO,
      mostrarModalConsulta: false,
      estado: true,
      // Programa Actual
      programaActual: 0,
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
    const { estadoNominacion } = this.state;
    let botones = [];
    if (estadoNominacion == ESTADOS_NOMINACIONES.CERRADO) {
      botones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
      return botones;
    }
    if (estadoNominacion == ESTADOS_NOMINACIONES.GUARDADO) {
      botones.push({ texto: 'Aprobar', callback: this.aprobarNominacion });
    }
    if (estadoNominacion != ESTADOS_NOMINACIONES.APROBADO) {
      botones.push({ texto: 'Nominar', callback: this.generarNominacion });
    }
    if (estadoNominacion == ESTADOS_NOMINACIONES.APROBADO) {
      botones.push({ texto: 'Renominar', callback: this.generarNominacion });
    }
    botones.push({ texto: 'Guardar', callback: this.guardarEntidad });
    botones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return botones;
  };

  /**
   * Método encargado de validar el campo de nominación en la tabla de puntos seleccionados.
   * @returns {bool}
   */
  validarTablas = () => {
    const { listaContratosSuministro, listaContratosTransporte } = this.state;
    //Validar Contratos Suministro
    for (let index = 0; index < listaContratosSuministro.length; index++) {
      const contrato = listaContratosSuministro[index];
      if (contrato.nominacionFinal.cantidad === '') {
        toast.error('Debe ingresar una nominación final para el medidor ' + contrato.medidor.mesuNombre)
        return false;
      }
      if (contrato.nominacionFinal.cantidad > contrato.cantidadMaximaNominar.cantidad) {
        toast.error('La cantidad de nominación para el medidor ' + contrato.medidor.mesuNombre + ' No puede ser mayor a la cantidad máxima a nominar')
        return false;
      }
    };
    //Validar Contratos Transporte
    for (let index = 0; index < listaContratosTransporte.length; index++) {
      const contrato = listaContratosTransporte[index];
      if (contrato.nominacionFinal.cantidad === '') {
        toast.error('Debe ingresar una nominación final para el punto ' + contrato.puntoSalida.puntoSalida.ptsaNombre)
        return false;
      }
      if (contrato.nominacionFinal.cantidad > contrato.puntoSalida.cantidadMaximaNominar.cantidad) {
        toast.error('La cantidad de nominación para el punto ' + contrato.puntoSalida.puntoSalida.ptsaNombre + ' No puede ser mayor a la cantidad máxima a nominar')
        return false;
      }
    }
    return true;
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { listaCalculo } = this.state;
    if (!Util.validarArreglo(listaCalculo)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe realizar el calculo de al menos 1 punto.' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormularioNominar = () => {
    const { fechaNominar, unidadMedidaNominacionSuministro, unidadMedidaNominacionTransporte } = this.state;
    if (!fechaNominar || fechaNominar == '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha para nominar' } };
    }
    if (!unidadMedidaNominacionSuministro || unidadMedidaNominacionSuministro == '' || unidadMedidaNominacionSuministro == '-1' || unidadMedidaNominacionSuministro == -1) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad de medida para la nominación de suministro' } };
    }
    if (!unidadMedidaNominacionTransporte || unidadMedidaNominacionTransporte == '' || unidadMedidaNominacionTransporte == '-1' || unidadMedidaNominacionTransporte == -1) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad de medida para la nominación de transporte' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de aprobar la nominación generada
   */
  aprobarNominacion = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CALCULO_NOMINACION.APROBAR_NOMINACION, { fecha: this.state.fechaNominar })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de obtener el objeto para guardar la nominación
   * @returns {Object}
   */
  obtenerObjetoGuardar = () => {
    let { totalData, listaContratosSuministro, listaContratosTransporte } = this.state;
    totalData.listaContratosSuministro = listaContratosSuministro;
    totalData.listaContratosTransporte = listaContratosTransporte;
    return totalData;
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    const validarTablas = this.validarTablas();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    if (!validarTablas) {
      return false;
    }
    let entidadGuardar = this.obtenerObjetoGuardar();
    let objeto = JSON.stringify(entidadGuardar);
    objeto = objeto.replace(/\[\]/g, 'null');
    objeto = objeto.replace(/\{\}/g, 'null');
    objeto = JSON.parse(objeto);
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CALCULO_NOMINACION.GUARDAR, objeto)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de obtener el objeto para enviar a la petición de nominar
   * @returns {Object}
   */
  obtenerObjetoNominar = () => {
    const { fechaNominar, unidadMedidaNominacionTransporte, unidadMedidaNominacionSuministro } = this.state;
    let objetoNominar = {
      fecha: fechaNominar,
      idUnidadSuministro: unidadMedidaNominacionSuministro,
      idUnidadTransporte: unidadMedidaNominacionTransporte
    }
    return objetoNominar;
  };

  /**
   * Método encargado de formar un objeto con las listas correspondientes
   * @param {Object} data Datos de la nominación
   */
  obtenerListasNominar = (data) => {
    let dataApp = {
      listaDesvios: (Util.validarArreglo(data.listaDesvios)) ? data.listaDesvios : [],
      listaCalculo: (Util.validarArreglo(data.listaPuntoConsumo)) ? data.listaPuntoConsumo : [],
      listaContratosSuministro: (Util.validarArreglo(data.listaContratosSuministro)) ? data.listaContratosSuministro : [],
      listaContratosTransporte: (Util.validarArreglo(data.listaContratosTransporte)) ? data.listaContratosTransporte : [],
      listaNominacionSuministro: (Util.validarArreglo(data.listaContratosSuministro)) ? data.listaContratosSuministro : [],
      listaNominacionTransporte: (Util.validarArreglo(data.listaContratosTransporte)) ? data.listaContratosTransporte : [],
      estadoDesvios: (Util.validarArreglo(data.listaDesvios)) ? '' : ESTADOS_NOMINACIONES.SIN_RESULTADOS_DESVIO,
      totalData: { ...data }
    }
    return dataApp;
  }

  /**
   * Método encargado de generar la nominación para la fecha dada
   * @returns {Boolean}
   */
  generarNominacion = () => {
    const validacion = this.validarFormularioNominar();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const entidadNominar = this.obtenerObjetoNominar();
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CALCULO_NOMINACION.PROCESAR_NOMINACION, entidadNominar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const data = this.obtenerListasNominar(respuesta.data.datos);
          data.estadoNominacion = data.totalData.estado;
          this.setState({ ...data });
        }
      });
  }

  /**
   * Método encargado de consultar si hay nominación en una fecha
   * @param {String} fecha Fecha a nominar
   * @returns {Object}
   */
  consultarExistente = (fecha, name) => {
    let data = {};
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_CALCULO_NOMINACION.CONSULTAR_EXISTENTE, { fecha: fecha })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          data = this.obtenerListasNominar(respuesta.data.datos);
          data[name] = fecha;
          data.estadoNominacion = data.totalData.estado;
          data.unidadMedidaNominacionSuministro = data.totalData.unidadSuministro.uniIderegistro;
          data.unidadMedidaNominacionTransporte = data.totalData.unidadTransporte.uniIderegistro;
          this.setState({ ...data });
          return;
        }
        data[name] = fecha;
        data.estadoNominacion = '';
        this.limpiarListas(data);
      });
  };

  /**
   * Método encargado de limpiar las listas cuando cambie un campo del formulario
   * @param {Object} data Datos a limpiar y a setear
   */
  limpiarListas = (data) => {
    data.listaDesvios = [];
    data.listaCalculo = [];
    data.listaContratosTransporte = [];
    data.listaContratosSuministro = [];
    data.listaNominacionSuministro = [];
    data.listaNominacionTransporte = [];
    this.setState(data);
  }

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    if (this.state.estadoNominacion == ESTADOS_NOMINACIONES.CERRADO) {
      return;
    }
    let change = {};
    let { name, value } = evento.target;
    change[name] = value;
    if (name == 'fechaNominar') {
      this.consultarExistente(value, name);
      return;
    }
    this.limpiarListas(change);
  };

  /**
   * Método encargado de cerrar la ventana modal del boton consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false,
    });
  };

  /**
   * Método encargado de llevar el control de las pestañas.
   * @param {Event} evento Evento ejecutado en el control de usuario.
   */
  navegar = (evento) => {
    const tipo = evento.target.name;
    const programaActual = parseInt(this.state.programaActual);
    const incremento = tipo === 'btn-anterior' ? -1 : 1;
    const nuevoIndice = programaActual + incremento;
    if (VISTAS[nuevoIndice]) {
      this.setState({ programaActual: nuevoIndice });
    }
  };

  /**
   * Método encargado de obtener el total dependiendo del tipo
   * @param {Array} lista Lista de puntos de consumo
   * @param {String} tipo Identificador de el calculo
   */
  obtenerTotalNominacionSuministro = (lista, tipo) => {
    let total = 0;
    switch (tipo) {
      case 'nominacionSuministro':
        for (let index = 0; index < lista.length; index++) {
          const contrato = lista[index];
          for (let jindex = 0; jindex < contrato.listaPuntosConsumo.length; jindex++) {
            const punto = contrato.listaPuntosConsumo[jindex];
            total += parseFloat(getProp(punto.nominacionSuministro, 'cantidad', 0));
          }
        }
        break;
      case 'desvioRecibeSuministro':
        for (let index = 0; index < lista.length; index++) {
          const contrato = lista[index];
          for (let jindex = 0; jindex < contrato.listaPuntosConsumo.length; jindex++) {
            const punto = contrato.listaPuntosConsumo[jindex];
            total += parseFloat(getProp(punto.desvioRecibeSuministro, 'cantidad', 0));
          }
        }
        break;
      default:
        break;
    }
    return total;
  };

  /**
   * Método encargado de renderizar la tabla de la nominación transporte
   * @returns {JSX}
   */
  renderTablaNominacionSuministro = () => {
    const { listaUnidadCantidad, unidadMedidaNominacionSuministro, totalData } = this.state;
    let lista = this.state.listaNominacionSuministro;
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    let unidadSuministro = listaUnidadCantidad.find(u => u.uniIderegistro == unidadMedidaNominacionSuministro);
    if (typeof unidadSuministro == 'undefined') {
      unidadSuministro = totalData.unidadSuministro;
    }
    return (
      <div className='table-responsive'>
        <table className='table table-bordered mt-10'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Número de Contrato</th>
              <th>Medidor </th>
              <th>Firmeza </th>
              <th>Mercado </th>
              <th>{'Cantidad Contratada Medidor(' + unidadSuministro.uniNombre1 + ')'}</th>
              <th>Punto de consumo</th>
              <th>{'Capacidad Max(' + unidadSuministro.uniNombre1 + ')'}</th>
              <th>{'Cantidad Nominación(' + unidadSuministro.uniNombre1 + ')'}</th>
              <th>Capacidad Asignada</th>
              <th>Capacidad Asignada Desvio</th>
            </tr>
          </thead>
          <tbody>
            {
              <Fragment>
                {
                  lista.map((dato, index) => {
                    return (
                      <Fragment>
                        {
                          Util.validarArreglo(dato.listaPuntosConsumo) && dato.listaPuntosConsumo.map((punto, indexPunto) => {
                            return (
                              <tr key={indexPunto}>
                                <td>{getProp(dato, 'contrato.cntNumero', '')}</td>
                                <td>{getProp(dato, 'medidor.mesuNombre', '')}</td>
                                <td>{getProp(dato, 'contrato.cntFirmeza', '')}</td>
                                <td>{getProp(dato.contrato, 'uniIdetipomercado.uniNombre1', '')}</td>
                                <td>{getProp(dato, 'medidor.mesuCapacidadmaxima', '')}</td>
                                <td>{getProp(punto.puntoConsumo, 'ptcoNombre', '')}</td>
                                <td>{getProp(punto.capacidadSuministro, 'cantidad', '')}</td>
                                <td>{getProp(punto.cantidadNominada, 'cantidad', '')}</td>
                                <td>{getProp(punto.nominacionSuministro, 'cantidad', '')}</td>
                                <td>{getProp(punto.desvioRecibeSuministro, 'cantidad', '')}</td>
                              </tr>
                            );
                          })
                        }
                      </Fragment>
                    );
                  })
                }
                <tr className='bg-success'>
                  <td className='text-center th-sub' colSpan='8'>Totales</td>
                  <td className='text-center th-sub'>{this.obtenerTotalNominacionSuministro(lista, 'nominacionSuministro')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalNominacionSuministro(lista, 'desvioRecibeSuministro')}</td>
                </tr>
              </Fragment>
            }
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la tabla con la nominación de Suministro
   * @returns {JSX}
   */
  obtenerNominacionSuministro = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaNominacionSuministro()}
        </div>
      </div>
    );
  };

  /**
   * Método encargado de obtener el total dependiendo del tipo
   * @param {Array} lista Lista de puntos de consumo
   * @param {String} tipo Identificador de el calculo
   */
  obtenerTotalNominacionTransporte = (lista, tipo) => {
    let total = 0;
    switch (tipo) {
      case 'nominacionTransporte':
        for (let index = 0; index < lista.length; index++) {
          const contrato = lista[index];
          for (let jindex = 0; jindex < contrato.listaPuntosConsumo.length; jindex++) {
            const punto = contrato.listaPuntosConsumo[jindex];
            total += parseFloat(getProp(punto.nominacionTransporte, 'cantidad', 0));
          }
        }
        break;
      case 'desvioRecibeTransporte':
        for (let index = 0; index < lista.length; index++) {
          const contrato = lista[index];
          for (let jindex = 0; jindex < contrato.listaPuntosConsumo.length; jindex++) {
            const punto = contrato.listaPuntosConsumo[jindex];
            total += parseFloat(getProp(punto.desvioRecibeTransporte, 'cantidad', 0));
          }
        }
        break;
      case 'desvioEnviaTransporte':
        for (let index = 0; index < lista.length; index++) {
          const contrato = lista[index];
          for (let jindex = 0; jindex < contrato.listaPuntosConsumo.length; jindex++) {
            const punto = contrato.listaPuntosConsumo[jindex];
            total += parseFloat(getProp(punto.desvioEnviaTransporte, 'cantidad', 0));
          }
        }
        break;
      default:
        break;
    }
    return total;
  };

  /**
   * Método encargado de renderizar la tabla de la nominación transporte
   * @returns {JSX}
   */
  renderTablaNominacionTransporte = () => {
    const { listaUnidadCantidad, unidadMedidaNominacionTransporte, totalData } = this.state;
    let lista = this.state.listaNominacionTransporte;
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    let unidadTransporte = listaUnidadCantidad.find(u => u.uniIderegistro == unidadMedidaNominacionTransporte);
    if (typeof unidadSuministro == 'undefined') {
      unidadTransporte = totalData.unidadTransporte;
    }
    return (
      <div className='table-responsive'>
        <table className='table table-bordered mt-10 text-center'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Número de Contrato</th>
              <th>Punto de Salida </th>
              <th>Firmeza </th>
              <th>Mercado </th>
              <th>{'Cantidad Contratada Punto(' + unidadTransporte.uniNombre1 + ')'} </th>
              <th>Punto de consumo</th>
              <th>{'Capacidad Max(' + unidadTransporte.uniNombre1 + ')'}</th>
              <th>{'Cantidad Nominación(' + unidadTransporte.uniNombre1 + ')'}</th>
              <th>Capacidad Asignada</th>
              <th>Capacidad Asignada Desvio Destino</th>
              <th>Capacidad Asignada Desvio Origen</th>
            </tr>
          </thead>
          <tbody>
            {
              <Fragment>
                {
                  lista.map((dato, index) => {
                    return (
                      <Fragment>
                        {
                          Util.validarArreglo(dato.listaPuntosConsumo) && dato.listaPuntosConsumo.map((punto, indexPunto) => {
                            return (
                              <tr key={indexPunto}>
                                <td>{getProp(dato.contrato, 'cntNumero', '')}</td>
                                <td>{getProp(dato.puntoSalida, 'puntoSalida.ptsaNombre', '')}</td>
                                <td>{getProp(dato.contrato, 'cntFirmeza', '')}</td>
                                <td>{getProp(dato.contrato, 'uniIdetipomercado.uniNombre1', '')}</td>
                                <td>{getProp(dato.cantidadContratada, 'cantidad', '')}</td>
                                <td>{getProp(punto.puntoConsumo, 'ptcoNombre', '')}</td>
                                <td>{getProp(punto.capacidadTransporte, 'cantidad', '')}</td>
                                <td>{getProp(punto.cantidadNominadaTransporte, 'cantidad', '')}</td>
                                <td>{getProp(punto.nominacionTransporte, 'cantidad', '')}</td>
                                <td>{getProp(punto.desvioRecibeTransporte, 'cantidad', '')}</td>
                                <td>{getProp(punto.desvioEnviaTransporte, 'cantidad', '')}</td>
                              </tr>
                            );
                          })
                        }
                      </Fragment>
                    );
                  })
                }
                <tr className='bg-success'>
                  <td className='text-center th-sub' colSpan='8'>Totales</td>
                  <td className='text-center th-sub'>{this.obtenerTotalNominacionTransporte(lista, 'nominacionTransporte')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalNominacionTransporte(lista, 'desvioRecibeTransporte')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalNominacionTransporte(lista, 'desvioEnviaTransporte')}</td>
                </tr>
              </Fragment>
            }
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la tabla con la nominación de transporte
   * @returns {JSX}
   */
  obtenerNominacionTransporte = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaNominacionTransporte()}
        </div>
      </div>
    );
  };

  /**
   * Método encargado de cargar el titulo de las vistas.+
   * @param {Event} evento Evento ejecutado en el control de usuario.
   */
  cargarVista = (evento) => {
    this.setState({ programaActual: evento.target.value });
  };

  /**
   * Método encargado de mostrar la tabla con los puntos seleccionados
   * @returns {Arrat}
   */
  obtenerDesvios = () => {
    if (!Util.validarArreglo(this.state.listaDesvios) && this.state.estadoDesvios == ESTADOS_NOMINACIONES.NO_CALCULO) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    if (!Util.validarArreglo(this.state.listaDesvios) && this.state.estadoDesvios == ESTADOS_NOMINACIONES.SIN_RESULTADOS_DESVIO) {
      return (<div className='text-center'>No se encontrarón desvios</div>);
    }
    return (
      <div className='table-responsive'>
        <table className='table table-bordered mt-10'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Contrato</th>
              <th>Salida Origen </th>
              <th>Salida Destino </th>
              <th>Consumo Origen </th>
              <th>Consumo Destino </th>
              <th>Capacidad</th>
              <th>Unidad de Medida</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.listaDesvios.sort((a, b) =>
                a.desvioPuntosSalida.ptsaPuntosalidadestino.ptsaNombre.localeCompare(b.desvioPuntosSalida.ptsaPuntosalidadestino.ptsaNombre)
              ).map((elemento, index) => {
                return (
                  <tr key={(getProp(elemento.desvio, 'desIderegistro', ''))}>
                    <td>{getProp(elemento.desvioContrato, 'cntIdecontrato.cntNumero', '')}</td>
                    <td>{getProp(elemento.desvioPuntosSalida.ptsaPuntosalidaorigen, 'ptsaNombre', '')}</td>
                    <td>{getProp(elemento.desvioPuntosSalida.ptsaPuntosalidadestino, 'ptsaNombre', '')}</td>
                    <td>{getProp(elemento.desvio.ptcIdepuntoinicial, 'ptcoNombre', '')}</td>
                    <td>{getProp(elemento.desvio.ptcIdepuntofinal, 'ptcoNombre', '')}</td>
                    <td>{getProp(elemento.desvio, 'desCapacidadmaxima', '')}</td>
                    <td>{getProp(elemento.desvio.uniIdemedida, 'uniNombre1', '')}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la tabla con los contratos de transporte
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioTablaTransporte = (evento) => {
    if (this.state.estadoNominacion == ESTADOS_NOMINACIONES.CERRADO) {
      return;
    }
    const { name, value } = evento.target;
    const index = evento.target.attributes['data-index'].value;
    let listaContratos = [...this.state.listaContratosTransporte];
    listaContratos[index].nominacionFinal[name] = value;
    this.setState({ listaContratosTransporte: listaContratos });
  }

  /**
   * Método encargado de obtener el total dependiendo del tipo
   * @param {Array} lista Lista de puntos de consumo
   * @param {String} tipo Identificador de el calculo
   */
  obtenerTotalContratosTransporte = (lista, tipo) => {
    let total = 0;
    switch (tipo) {
      case 'cantidadContratada':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.cantidadContratada, 'cantidad', 0));
        }
        break;
      case 'cantidadMaximaNominar':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.puntoSalida.cantidadMaximaNominar, 'cantidad', 0));
        }
        break;
      case 'cantidadCreg008':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.puntoSalida.cantidadCreg008, 'cantidad', 0));
        }
        break;
      case 'desbalance':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.puntoSalida.desbalance, 'cantidad', 0));
        }
        break;
      case 'nominacionSugerida':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.nominacionSugerida, 'cantidad', 0));
        }
        break;
      case 'nominacionFinal':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.nominacionFinal, 'cantidad', 0));
        }
        break;
      default:
        return getProp(lista[0].puntoSalida.cantidadMaximaNominar, 'unidadMedida.uniNombre1', '')
    }
    return total;
  };

  /**
   * Método encargado de mostrar la tabla con contratos transporte
   * @returns {JSX}
   */
  renderTablaContratosTransporte = () => {
    const lista = this.state.listaContratosTransporte;
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    let desabilitar = false;
    if (this.state.estadoNominacion == ESTADOS_NOMINACIONES.CERRADO) {
      desabilitar = true;
    }
    return (
      <div className='table-responsive'>
        <table className='table table-bordered mt-10'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Número de contrato</th>
              <th>Firmeza </th>
              <th>Mercado </th>
              <th>Punto Salida </th>
              <th>Cantidad Contratada </th>
              <th>Cantidad Máxima a nominar</th>
              <th>Unidad de Medida</th>
              <th>Cantidad Creg008</th>
              <th>Desbalanace</th>
              <th>Nominación Sugerida</th>
              <th>Nominación Final</th>
            </tr>
          </thead>
          <tbody>
            {
              <Fragment>
                {
                  lista.map((contrato, index) => {
                    return (
                      <tr key={index}>
                        <td>{getProp(contrato.contrato, 'cntNumero', '')}</td>
                        <td>{getProp(contrato.contrato, 'cntFirmeza', '')}</td>
                        <td>{getProp(contrato.contrato, 'uniIdetipomercado.uniNombre1', '')}</td>
                        <td>{getProp(contrato.puntoSalida.puntoSalida, 'ptsaNombre', '')}</td>
                        <td>{getProp(contrato.cantidadContratada, 'cantidad', '')}</td>
                        <td>{getProp(contrato.cantidadMaximaNominar, 'cantidad', '')}</td>
                        <td>{getProp(contrato.cantidadMaximaNominar, 'unidadMedida.uniNombre1', '')}</td>
                        <td>{getProp(contrato.puntoSalida.cantidadCreg008, 'cantidad', '')}</td>
                        <td>{getProp(contrato.puntoSalida.desbalance, 'cantidad', 0)}</td>
                        <td>{getProp(contrato.nominacionSugerida, 'cantidad', '')}</td>
                        <td>
                          <TextoNumerico
                            aceptaDecimales={false}
                            aceptaNegativos={false}
                            cols={12}
                            value={getProp(contrato.nominacionFinal, 'cantidad')}
                            onChange={this.controlarCambioTablaTransporte}
                            name='cantidad'
                            extra={{ 'data-index': index, disabled: desabilitar, readOnly: desabilitar }}
                          />
                        </td>
                      </tr>
                    );
                  })
                }
                <tr className='bg-success'>
                  <td className='text-center th-sub' colSpan='4'>Total Contratado</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosTransporte(lista, 'cantidadContratada')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosTransporte(lista, 'cantidadMaximaNominar')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosTransporte(lista, '')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosTransporte(lista, 'cantidadCreg008')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosTransporte(lista, 'desbalance')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosTransporte(lista, 'nominacionSugerida')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosTransporte(lista, 'nominacionFinal')}</td>
                </tr>
              </Fragment>
            }
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de obtener la tabla de contratos suministro
   * @returns {JSX}
   */
  obtenerContratosTransporte = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaContratosTransporte()}
        </div>
      </div>
    );
  };

  /**
   * Método encargado de controlar el cambio de la nominación final de los contratos de suministro
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioTabla = (evento) => {
    if (this.state.estadoNominacion == ESTADOS_NOMINACIONES.CERRADO) {
      return;
    }
    const { name, value } = evento.target;
    const index = evento.target.attributes['data-index'].value;
    let listaContratos = [...this.state.listaContratosSuministro];
    listaContratos[index].nominacionFinal[name] = value;
    this.setState({ listaContratosSuministro: listaContratos });
  }

  /**
   * Método encargado de obtener el total dependiendo del tipo
   * @param {Array} lista Lista de puntos de consumo
   * @param {String} tipo Identificador de el calculo
   */
  obtenerTotalContratosSuministro = (lista, tipo) => {
    let total = 0;
    switch (tipo) {
      case 'mesuCapacidadmaxima':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.medidor, 'mesuCapacidadmaxima', 0));
        }
        break;
      case 'cantidadMaximaNominar':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.cantidadMaximaNominar, 'cantidad', 0));
        }
        break;
      case 'nominacionSugerida':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.nominacionSugerida, 'cantidad', 0));
        }
        break;
      case 'nominacionFinal':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.nominacionFinal, 'cantidad', 0));
        }
        break;
      default:
        return getProp(lista[0].cantidadMaximaNominar, 'unidadMedida.uniNombre1', '')
    }
    return total;
  };

  /**
   * Método encargado de mostrar la tabla con contratos suministro
   * @returns {JSX}
   */
  renderTablaContratosSuministro = () => {
    const lista = this.state.listaContratosSuministro;
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    let desabilitar = false;
    if (this.state.estadoNominacion == ESTADOS_NOMINACIONES.CERRADO) {
      desabilitar = true;
    }
    return (
      <div className='table-responsive'>
        <table className='table table-bordered mt-10'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Número de contrato</th>
              <th>Firmeza </th>
              <th>Mercado </th>
              <th>Medidor de Suministro </th>
              <th>Tipo de Consumo</th>
              <th>Cantidad Contratada </th>
              <th>Cantidad Máxima a nominar</th>
              <th>Unidad de Medida</th>
              <th>Nominación Sugerida</th>
              <th>Nominación Final</th>
            </tr>
          </thead>
          <tbody>
            {
              <Fragment>
                {
                  lista.map((contrato, index) => {
                    return (
                      <tr key={contrato.medidor.mesuIderegistro}>
                        <td>{getProp(contrato.contrato, 'cntNumero', '')}</td>
                        <td>{getProp(contrato.contrato, 'cntFirmeza', '')}</td>
                        <td>{getProp(contrato.contrato, 'uniIdetipomercado.uniNombre1', '')}</td>
                        <td>{getProp(contrato.medidor, 'mesuNombre', '')}</td>
                        <td>{getProp(contrato.medidor, 'uniIdetipoconsumo.uniNombre1', '')}</td>
                        <td>{getProp(contrato.medidor, 'mesuCapacidadmaxima', '')}</td>
                        <td>{getProp(contrato.cantidadMaximaNominar, 'cantidad', '')}</td>
                        <td>{getProp(contrato.cantidadMaximaNominar, 'unidadMedida.uniNombre1', '')}</td>
                        <td>{getProp(contrato.nominacionSugerida, 'cantidad', '')}</td>
                        <td>
                          <TextoNumerico
                            aceptaDecimales={false}
                            aceptaNegativos={false}
                            cols={12}
                            value={getProp(contrato.nominacionFinal, 'cantidad')}
                            onChange={this.controlarCambioTabla}
                            name='cantidad'
                            extra={{ 'data-index': index, disabled: desabilitar, readOnly: desabilitar }}
                          />
                        </td>
                      </tr>
                    );
                  })
                }
                <tr className='bg-success'>
                  <td className='text-center th-sub' colSpan='5'>Total Contratado</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosSuministro(lista, 'mesuCapacidadmaxima')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosSuministro(lista, 'cantidadMaximaNominar')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosSuministro(lista, '')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosSuministro(lista, 'nominacionSugerida')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalContratosSuministro(lista, 'nominacionFinal')}</td>
                </tr>
              </Fragment>
            }
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de obtener la tabla de contratos suministro
   * @returns {JSX}
   */
  obtenerContratosSuministro = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaContratosSuministro()}
        </div>
      </div>
    );
  };

  /**
   * Método encargado de obtener el total dependiendo del tipo
   * @param {Array} lista Lista de puntos de consumo
   * @param {String} tipo Identificador de el calculo
   */
  obtenerTotalNominacion = (lista, tipo) => {
    let total = 0;
    switch (tipo) {
      case 'nominacionTransporte':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.nominacionTransporte, 'cantidad', 0));
        }
        break;
      case 'nominacionSuministro':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.nominacionSuministro, 'cantidad', 0));
        }
        break;
      case 'faltanteSuministro':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.faltanteSuministro, 'cantidad', 0));
        }
        break;
      case 'faltanteTransporte':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element.faltanteTransporte, 'cantidad', 0));
        }
        break;
      default:
        break;
    }
    return total;
  };

  /**
   * Método encargado de mostrar la tabla de nominación de puntos de consumo
   * @returns {JSX}
   */
  renderTablaCalculo = () => {
    const { listaUnidadCantidad, unidadMedidaNominacionSuministro, unidadMedidaNominacionTransporte, totalData } = this.state;
    const lista = this.state.listaCalculo;
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    let unidadSuministro = listaUnidadCantidad.find(u => u.uniIderegistro == unidadMedidaNominacionSuministro);
    let unidadTransporte = listaUnidadCantidad.find(u => u.uniIderegistro == unidadMedidaNominacionTransporte);
    if (typeof unidadSuministro == 'undefined') {
      unidadSuministro = totalData.unidadSuministro;
    }
    if (typeof unidadTransporte == 'undefined') {
      unidadTransporte = totalData.unidadTransporte;
    }
    return (
      <div className='table-responsive'>
        <table className='table table-bordered mt-10 text-center'>
          <thead className='bg-dark text-white'>
            <tr>
              <th scope="col" className='text-center'>Punto Consumo</th>
              <th scope="col" className='text-center'>Capacidad Máxima</th>
              <th scope="col" className='text-center'>Unidad de Medida</th>
              <th scope="col" className='text-center'>Tipo de Consumo</th>
              <th scope="col" className='text-center'>Cantidad Nominada</th>
              <th scope="col" className='text-center'>Excedentes</th>
              <th scope="col" className='text-center'>Tipo(I- Ingresado / P-Pronostico)</th>
              <th scope="col" className='text-center'>{'Nominación de Suministro(' + unidadSuministro.uniNombre1 + ')'}</th>
              <th scope="col" className='text-center'>{'Nominación de Transporte(' + unidadTransporte.uniNombre1 + ')'}</th>
              <th scope="col" className='text-center'>{'Faltantes de Suministro(' + unidadSuministro.uniNombre1 + ')'}</th>
              <th scope="col" className='text-center'>{'Faltantes de Transporte(' + unidadTransporte.uniNombre1 + ')'}</th>
            </tr>
          </thead>
          <tbody>
            {(Util.validarArreglo(lista)) &&
              <Fragment>
                {
                  lista.sort((a, b) => a.puntoConsumo.ptcoNombre.localeCompare(b.puntoConsumo.ptcoNombre)).map(ele => {
                    return (
                      <tr key={getProp(ele.puntoConsumo, 'ptcIderegistro', '')}>
                        <td>{getProp(ele.puntoConsumo, 'ptcoNombre', '')}</td>
                        <td>{getProp(ele.puntoConsumo, 'ptcMaxnominacion', '')}</td>
                        <td>{getProp(ele.puntoConsumo.uniIdemedidanomin, 'uniNombre1', '')}</td>
                        <td>{getProp(ele.puntoConsumo.uniIdetipoconsumo, 'uniNombre1', '')}</td>
                        <td>{getProp(ele.cantidadNominada, 'cantidad', '')}</td>
                        <td>{getProp(ele.excedentes, 'cantidad', '')}</td>
                        <td>{(getProp(ele.puntoConsumo, 'ptcAutopronostico', '') == 'S') ? 'Pronostico' : 'Ingresada'}</td>
                        <td>{(getProp(ele.nominacionSuministro, 'cantidad', 0) + this.obtenerTotalDesvios(ele, 'S'))}</td>
                        <td>{(getProp(ele.nominacionTransporte, 'cantidad', 0) + this.obtenerTotalDesvios(ele, 'T'))}</td>
                        <td>{(getProp(ele.faltanteSuministro, 'cantidad', 0) - this.obtenerTotalDesvios(ele, 'S'))}</td>
                        <td>{(getProp(ele.faltanteTransporte, 'cantidad', 0) - this.obtenerTotalDesvios(ele, 'T'))}</td>
                      </tr>
                    )
                  })
                }
                <tr className='bg-success'>
                  <td className='text-center th-sub' colSpan='7'>Total</td>
                  <td className='text-center th-sub'>{this.obtenerTotalNominacion(lista, 'nominacionSuministro')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalNominacion(lista, 'nominacionTransporte')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalNominacion(lista, 'faltanteSuministro')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotalNominacion(lista, 'faltanteTransporte')}</td>
                </tr>
              </Fragment>
            }
          </tbody>
        </table>
      </div>
    )
  };

  /**
   * @method
   * Método encargado de obtener la sumatoria del total de desvios utilizados para el punto
   * @param {Object} punto Lista de desvios del punto de consumo
   * @returns {Number}
   */
  obtenerTotalDesvios = (punto, tipo) => {
    let total = 0;
    let listaRecorrer;
    if ((tipo == 'S' && Util.validarArreglo(punto.listaDesviosSuministro))) {
      listaRecorrer = punto.listaDesviosSuministro.filter(des => des.tipo == 'R');
      for (let index = 0; index < listaRecorrer.length; index++) {
        const desvio = listaRecorrer[index];
        total = total + desvio.utilizada.cantidad;
      }
      return total;
    }
    if ((tipo == 'T' && Util.validarArreglo(punto.listaDesviosTransporte))) {
      listaRecorrer = punto.listaDesviosTransporte.filter(des => des.tipo == 'R');
      for (let index = 0; index < listaRecorrer.length; index++) {
        const desvio = listaRecorrer[index];
        total = total + desvio.utilizada.cantidad;
      }
    }
    return total;
  }

  /**
   * Método encargado de retornar la vista de nominación.
   * @returns {Object}
   */
  obtenerNominacion = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaCalculo()}
        </div>
      </div>
    );
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    let desabilitar = false;
    if (this.state.estadoNominacion == ESTADOS_NOMINACIONES.CERRADO) {
      desabilitar = true;
    }
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Fecha
            label='Fecha a Nominar:'
            name='fechaNominar'
            fecha={this.state.fechaNominar}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaUnidadSuministro}
            propTexto='nombre'
            propValor='idMedida'
            label='Unidad de medida Nominación Suministro:'
            name='unidadMedidaNominacionSuministro'
            value={this.state.unidadMedidaNominacionSuministro}
            onChange={this.controlarCambio}
            extra={{ disabled: desabilitar, readOnly: desabilitar }}
          />
          <Combo
            opciones={this.state.listaUnidadCantidad}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Unidad de medida Nominación Transporte:'
            name='unidadMedidaNominacionTransporte'
            value={this.state.unidadMedidaNominacionTransporte}
            onChange={this.controlarCambio}
            extra={{ disabled: desabilitar, readOnly: desabilitar }}
          />
        </div>
        <div className='contratos__navegador'>
          <div className='contratos__navegador__cabecera'>
            <div className='colum btn-content'>
              {this.state.programaActual > 0 && (
                <button className='contratos__navegador__cabecera-btn' name='btn-anterior' onClick={this.navegar}>Anterior</button>
              )}
            </div>
            <div className='colum select-content'>
              <select name="programaActual" className='contratos__navegador__cabecera-select' onChange={this.cargarVista} value={this.state.programaActual}>
                {VISTAS.map(p => (<option key={p.id} value={p.id}>{p.titulo}</option>))}
              </select>
            </div>
            <div className='colum btn-content'>
              {(this.state.programaActual < (VISTAS.length - 1)) && (
                <button className='contratos__navegador__cabecera-btn' name='btn-siguiente' onClick={this.navegar}>Siguiente</button>
              )}
            </div>
          </div>
          <div className="contratos__fragmento">
            {this[VISTAS[parseInt(this.state.programaActual)].componente]()}
          </div>
        </div>
      </Fragment>
    );
  };
}

CalculoNominacion.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CalculoNominacion);

export { VistaRedux as RCalculoNominacion };
