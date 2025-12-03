import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { get as getProp } from 'object-path';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, VentanaModal, Util, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { CLASES_UNIDADES } from '../../../../global/constantes';
import { formatearArray, TIPOS_UNIDADES_MEDIDA, TIPOS_VARIABLES } from '../../../../global/util_nominaciones';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { RConsultaMedidor } from '../ConsultaMedidor';
import { RConsultaPuntosConsumo } from '../ConsultaPuntosConsumo';
import { RConsultaProyecto } from '../ConsultaProyecto';
import { RConsultaContratoSuministro } from '../ConsultaContratoSuministro';
import { RConsultaContratoTransporte } from '../ConsultaContratoTransporte';
import './GestionPuntosConsumo.scss';
import { toast } from 'react-toastify'

const listaSiNo = [
  { id: 'S', nombre: 'Sí' },
  { id: 'N', nombre: 'No' }
];

const listaTipoConsumo = [
  { id: 'C', nombre: 'Calculada' },
  { id: 'I', nombre: 'Ingresada' }
]


const ESTADO_ACTIVO = 'A';
const CALCULADA = 'C';
const SI = 'S';

class GestionPuntosConsumo extends Component {

  state = {
    // Datos de la entidad
    idPuntoConsumo: null,
    nombre: '',
    puntoDeSalida: '',
    capacidadNominacion: '',
    propio: '',
    unidadMedida: '',
    resoCreg07: '',
    resoCreg08: '',
    pronosticoAtomatico: '',
    valorCalculada: '',
    formulaIndicePerdidas: '',
    formulaGasificacion: '',
    formulaNominacion: '',
    porcentajeParticipacion: '',
    contrato: '',
    indicePerdidas: '',
    tipoDeConsumo: '',
    idAnteTransportador: '',
    calculada: '',
    tipoLectura: '',
    cuentaBalance: '',
    unidadMedidaCuentaBalance: '',
    //Listas de la aplicación
    listaUnidadMedida: [],
    listaPuntosDeSalida: [],
    listaContratos: [],
    listaTipoDeConsumo: [],
    medidoresSeleccionados: [],
    proyectosBarriosVeredasSeleccionados: [],
    contratosSuministroSeleccionados: [],
    contratosTransporteSeleccionados: [],
    variablesL: [],
    variablesN: [],
    variablesI: [],
    variablesG: [],
    datosConsultados: [],
    listaHorarios: [],
    listaEliminar: [],
    // Estado de la aplicacion
    mostrarModalConsulta: false,
    mostrarModalMedidor: false,
    mostrarModalProyecto: false,
    mostrarModalContratoSuministro: false,
    mostrarModalContratoTransporte: false,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    this.cargarDatosListaHorarios();
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }

    const peticiones = [
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { idClase: CLASES_UNIDADES.ESTADOS_CONTRATO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { criterio: '', idClase: CLASES_UNIDADES.TIPO_CONSUMO }),
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTO_SALIDA, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', 'categoria': TIPOS_UNIDADES_MEDIDA.CANTIDAD }),
      axios.post(RUTAS_API.VARIABLES.CONSULTAR_VARIABLES_TIPO, { criterio: '', 'categoria': TIPOS_VARIABLES.VARIABLES_PUNTO_LECTURA }),
      axios.post(RUTAS_API.VARIABLES.CONSULTAR_VARIABLES_TIPO, { criterio: '', 'categoria': TIPOS_VARIABLES.VARIABLES_PUNTO_NOMINACION }),
      axios.post(RUTAS_API.VARIABLES.CONSULTAR_VARIABLES_TIPO, { criterio: '', 'categoria': TIPOS_VARIABLES.VARIABLES_PUNTO_INDICE }),
      axios.post(RUTAS_API.VARIABLES.CONSULTAR_VARIABLES_TIPO, { criterio: '', 'categoria': TIPOS_VARIABLES.VARIABLES_PUNTO_GASIFICACION }),
    ];
    axios.all(peticiones)

      .then(axios.spread((estados, consumos, puntosSalida, unidadesMedida, variablesL, variablesN, variablesI, variablesG) => {
        const datosAplicacion = {
          listaEstados: [],
          listaTipoDeConsumo: [],
          listaPuntosDeSalida: [],
          listaContratos: [],
          listaUnidadMedida: [],
          variablesL: [],
          variablesN: [],
          variablesI: [],
          variablesG: [],
        };
        if (estados.data.codigo > 0) {
          datosAplicacion.listaEstados = formatearArray(estados.data.datos);
        }
        if (consumos.data.codigo > 0) {
          datosAplicacion.listaTipoDeConsumo = formatearArray(consumos.data.datos);
        }
        if (puntosSalida.data.codigo > 0) {
          datosAplicacion.listaPuntosDeSalida = formatearArray(puntosSalida.data.datos);
        }
        if (unidadesMedida.data.codigo > 0) {
          datosAplicacion.listaUnidadMedida = formatearArray(unidadesMedida.data.datos);
        }
        if (variablesL.data.codigo > 0) {
          datosAplicacion.variablesL = formatearArray(variablesL.data.datos);
        }
        if (variablesN.data.codigo > 0) {
          datosAplicacion.variablesN = formatearArray(variablesN.data.datos);
        }
        if (variablesI.data.codigo > 0) {
          datosAplicacion.variablesI = formatearArray(variablesI.data.datos);
        }
        if (variablesG.data.codigo > 0) {
          datosAplicacion.variablesG = formatearArray(variablesG.data.datos);
        }
        this.setState({ ...datosAplicacion }, this.consultarContratos);
      }));
  };

  /**
   * Consulta los contratos...
   */
  consultarContratos = () => {
    const idEstado = this.obtenerIdEstado(ESTADO_ACTIVO);
    axios.post(RUTAS_API.CONTRATOS.CONSULTAR_CONTRATOS, { criterio: '', tipoNegocio: 'V', estadosContrato: idEstado })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaContratos: this.armarObjeto(respuesta.data.datos) });
        }
      });
  };

  /**
   * Método encargado de armar un objeto con los contratos
   * @param {Object} contratos Datos de los contratos consultados
   * @returns {Object}
   */
  armarObjeto = (contratos) => {
    const lista = contratos.map((dato) => {
      return {
        titulo: `${dato.cntNumero}-${dato.terIdeagente.terNomcompleto}`,
        cntIderegistro: dato.cntIderegistro
      }
    });
    return lista;
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.limpiarDatosHorarios();
    this.setState({
      // Datos de la entidad
      nombre: '',
      puntoDeSalida: '-1',
      capacidadNominacion: '',
      propio: '',
      unidadMedida: '-1',
      resoCreg07: '-1',
      resoCreg08: '-1',
      pronosticoAtomatico: '-1',
      valorCalculada: '',
      porcentajeParticipacion: '',
      terceroCliente: null,
      indicePerdidas: '-1',
      tipoDeConsumo: '-1',
      idAnteTransportador: '',
      idPuntoConsumo: null,
      contrato: '',
      formulaIndicePerdidas: '',
      formulaGasificacion: '',
      formulaNominacion: '',
      tipoLectura: '',
      cuentaBalance: '',
      unidadMedidaCuentaBalance: '',
      //Listas de la aplicación
      medidoresSeleccionados: [],
      proyectosBarriosVeredasSeleccionados: [],
      contratosSuministroSeleccionados: [],
      contratosTransporteSeleccionados: [],
      listaEliminar: [],
      // Estado de la aplicacion
      mostrarModalMedidor: false,
      mostrarModalProyecto: false,
      mostrarModalContratoSuministro: false,
      mostrarModalContratoTransporte: false,
    });
  };

  /**
   * Obtiene el id específico del estado contrato finalizado.
   * @return {number}
   */
  obtenerIdEstado = (codigoEstado) => {
    const { listaEstados } = this.state;
    if (!Util.validarArreglo(listaEstados)) {
      this.props.mostrarAlerta('Error de configuración', 'No hay estados configurados.');
      return -1;
    }
    const estado = listaEstados.filter(e => (JSON.parse(e.uniPropiedad).estado == codigoEstado));
    if (!Util.validarArreglo(estado)) {
      return 0;
    }
    return estado[0].uniIderegistro;
  };

  /**
   * Método encargado de limpiar la lista de horarios
   */
  limpiarDatosHorarios = () => {
    let listaHorarios = [...this.state.listaHorarios];
    for (let index = 0; index < listaHorarios.length; index++) {
      listaHorarios[index].porcentaje = '';
    }
    this.setState({
      listaHorarios: listaHorarios
    });
  };

  /**
   * Método encargado de llenar la lista de horarios al cargar la interfaz
   */
  cargarDatosListaHorarios = () => {
    let listaHorarios = [...this.state.listaHorarios];
    for (let index = 0; index < 24; index++) {
      listaHorarios.push({
        hora: `hora ${index}`,
        porcentaje: '',
        horaInicial: index < 10 ? `0${index}:00:00` : `${index}:00:00`,
        horaFinal: index < 10 ? `0${index}:59:59` : `${index}:59:59`,
      });
    }
    this.setState({
      listaHorarios: listaHorarios
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
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar que se ingresen todos los porcentajes
   * @returns {Object}
   */
  validarPorcentajeHorario = () => {
    const { listaHorarios } = this.state;
    let contador = 0;
    for (let index = 0; index < listaHorarios.length; index++) {
      const horario = listaHorarios[index];
      if (typeof horario.porcentaje === 'string' && horario.porcentaje.trim() === '') {
        return { respuesta: false, mensaje: { titulo: `Debe ingresar el porcentaje para la hora el horario ${horario.horaInicial}-${horario.horaFinal}` } }
      }

      if (isNaN(horario.porcentaje)) {
        return { respuesta: false, mensaje: { titulo: `El porcentaje para el horario ${horario.horaInicial}-${horario.horaFinal} debe ser un valor númerico` } }
      }

      if (horario.porcentaje < 0 || horario.porcentaje > 100) {
        return { respuesta: false, mensaje: { titulo: `El porcentaje ingresado no puede ser menor a 0 ni mayor a 100 y la sumatoria de porcentajes no puede ser mayor a 100` } }
      }
      contador += parseInt(horario.porcentaje);
      if (contador > 100) {
        return { respuesta: false, mensaje: { titulo: `La suma de los porcentajes no puede ser mayor al 100%` } }
      }

    }
    return { respuesta: true };
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { nombre, puntoDeSalida, capacidadNominacion,
      propio, unidadMedida, resoCreg07, resoCreg08,
      pronosticoAtomatico, porcentajeParticipacion,
      indicePerdidas,
      contrato, medidoresSeleccionados, tipoDeConsumo,
      valorCalculada, idAnteTransportador, formulaGasificacion,
      formulaIndicePerdidas,
      formulaNominacion, listaTipoDeConsumo,
      cuentaBalance, unidadMedidaCuentaBalance } = this.state;
    const tipoSeleccionado = listaTipoDeConsumo.find(c => c.uniIderegistro == tipoDeConsumo);
    if (nombre.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un nombre' } };
    }

    if (puntoDeSalida === '-1' || puntoDeSalida === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un punto de salida' } };
    }

    if (tipoDeConsumo === '' || tipoDeConsumo === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tipo de consumo' } };
    }

    if (propio === '-1' || propio === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar si es propio o no' } };
    }

    if (propio === 'N') {
      if (contrato === '' || contrato === '-1') {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tercero' } };
      }
    }

    if (valorCalculada <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fórmula de lectura.' } };
    }

    if (formulaNominacion <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fórmula para la nominación.' } };
    }

    if (cuentaBalance === '-1' || cuentaBalance === '' || cuentaBalance === -1) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar si el punto aplica cuenta balance ' } };
    }

    if (cuentaBalance == 'S') {
      if (unidadMedidaCuentaBalance === '-1' || unidadMedidaCuentaBalance === '' || unidadMedidaCuentaBalance === -1) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar la unidad de medida de la cuenta balance ' } };

      }
    }

    if (pronosticoAtomatico === '-1' || pronosticoAtomatico === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar el pronostico automatico' } };
    }

    if (resoCreg07 === '-1' || resoCreg07 === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar si aplica la resolucion 0702016' } };
    }

    if (resoCreg08 === '-1' || resoCreg08 === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar si aplica la resolucion 0882016' } };
    }


    if (toString(capacidadNominacion).trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una capacidad máxima de nominación' } };
    }

    if (capacidadNominacion <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La capacidad máxima debe ser positiva y diferente de 0' } };
    }

    if (isNaN(capacidadNominacion)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'La capacidad máxima debe ser un valor númerico' } };
    }

    if (indicePerdidas === '' || indicePerdidas === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe especificar el indice de perdidas' } };
    }

    if (indicePerdidas === 'S') {
      if (formulaGasificacion <= 0) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fórmula para la gasificación' } };
      }
      if (formulaIndicePerdidas <= 0) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fórmula para la el índice de pérdidas' } };
      }
    }

    if (unidadMedida === '-1' || unidadMedida === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad de medida' } };
    }

    if (porcentajeParticipacion === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el porcentaje de paricipación' } };
    }

    if (idAnteTransportador.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar la identificación ante el transportador' } };
    }

    if (isNaN(porcentajeParticipacion)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El porcentaje de participación debe ser un valor númerico' } };
    }

    if (isNaN(porcentajeParticipacion) || parseInt(porcentajeParticipacion) > 100) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El porcentaje de participación no puede superar el 100%' } };
    }

    if (isNaN(porcentajeParticipacion) || parseInt(porcentajeParticipacion) < 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El porcentaje de participación no puede ser menor al 0%' } };
    }

    if (tipoSeleccionado && tipoSeleccionado.listaPropiedades.medidores == SI) {
      if (!Util.validarArreglo(medidoresSeleccionados)) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un medidor' } };
      }
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de abrir la ventana modal del boton de consultar
   */
  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  /**
   * Método encargado de abrir la ventana modal del boton consultar
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Obtiene la fórmulade la variable seleccionada.
   * @param {number} idVariable Identificador de la variable
   * @return {string}
   */
  obtenerVariable = (idVariable) => {
    const variable = this.state.variables.find(v => {
      if (v.uniUnidad && v.uniUnidad.uniIderegistro == idVariable) {
        return v;
      }
    });
    if (variable) {
      const json = variable.conFormula;
      const obj = JSON.parse(json);
      if (Array.isArray(obj)) {
        obj.push({ idVariable: idVariable });
      } else {
        obj.idVariable = idVariable;
      }
      return JSON.stringify(obj);
    }
    return null;
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    const validarPorcentaje = this.validarPorcentajeHorario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    if (!validarPorcentaje.respuesta) {
      this.props.mostrarAlerta(validarPorcentaje.mensaje.titulo, validarPorcentaje.mensaje.mensaje);
      return false;
    }
    const { nombre,
      puntoDeSalida,
      capacidadNominacion,
      propio,
      unidadMedida,
      resoCreg07,
      resoCreg08,
      pronosticoAtomatico,
      porcentajeParticipacion,
      indicePerdidas,
      tipoDeConsumo,
      idAnteTransportador,
      idPuntoConsumo,
      tipoPuntoEspecial,
      puntoEspecial,
      valorCalculada,
      formulaGasificacion,
      formulaIndicePerdidas,
      formulaNominacion,
      tipoLectura,
      cuentaBalance,
      unidadMedidaCuentaBalance
    } = this.state;

    const entidadGuardar = {
      'puntoConsumo': {
        'cntIdetercero': (this.state.contrato > 0) ? { cntIderegistro: this.state.contrato } : null,
        'ptcIderegistro': idPuntoConsumo,
        'ptcoNombre': nombre,
        'uniIdetipoconsumo': {
          'uniIderegistro': tipoDeConsumo
        },
        'ptsaIdesalida': {
          'ptsaIderegistro': puntoDeSalida
        },
        'ptcTipolectura': CALCULADA,
        'conIdeformula': (valorCalculada) ? { uniConcepto: valorCalculada } : null,
        'conIdegasificacion': (formulaGasificacion) ? { uniConcepto: formulaGasificacion } : null,
        'conIdenominar': (formulaNominacion) ? { uniConcepto: formulaNominacion } : null,
        'conIdeindperdidas': (formulaIndicePerdidas) ? { uniConcepto: formulaIndicePerdidas } : null,
        'ptcAutopronostico': pronosticoAtomatico,
        'ptcCreg070': resoCreg07,
        'ptcCreg088': resoCreg08,
        'ptcoPropio': propio,
        'ptcMaxnominacion': parseFloat(capacidadNominacion),
        'ptcoCalindice': indicePerdidas,
        'uniIdemedidanomin': {
          'uniIderegistro': unidadMedida
        },
        'ptcPorcenmercado': parseFloat(porcentajeParticipacion),
        'ptcoCodigogestor': idAnteTransportador,
        'ptcVersion': '1',
        'ptcPuntoespecial': puntoEspecial,
        'ptcTipopuntoespecial': (puntoEspecial === 'S') ? tipoPuntoEspecial : '',
        'ptcTipolectura': tipoLectura,
        'ptcAplbalance': cuentaBalance,
        'uniIdemedbalance': (cuentaBalance == 'S') ? {
          'uniIderegistro': unidadMedidaCuentaBalance
        } : null
      },
      'horarios': this.obtenerHorarios(),
      'contratos': this.obtenerContratos(),
      'medidores': this.obtenerMedidores(),
      'ubicaciones': this.obtenerProyectosBarriosVeredas(),
    };

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   * @returns {bool}
   */
  controlarCambio = (evento) => {
    let change = {};
    const { name, value } = evento.target;
    if (name === 'indicePerdidas') {
      if (value === 'N') {
        this.setState({
          indicePerdidas: value,
          formulaGasificacion: '',
          formulaIndicePerdidas: '',
        });
        return;
      }
    }
    if (name === 'tipoDeConsumo') {
      const { medidoresSeleccionados } = this.state;
      if (medidoresSeleccionados.length > 0) {
        toast.info('Se han limpiado los medidores de suministro');
      }
      this.setState({
        tipoDeConsumo: value,
        medidoresSeleccionados: [],
      });
      return;
    }
    change[evento.target.name] = evento.target.value;
    this.setState(change);
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambioPropio = (evento) => {
    let { contrato } = this.state;
    const { value, name } = evento.target;
    if (name === 'propio') {
      if (value === 'S') {
        contrato = null
      }
    }
    this.setState({ propio: value, contrato: contrato });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   * @param {number} index Posición que se esta modificando
   */
  controlarCambioPorcentaje = (evento, index) => {
    let listaHorarios = [...this.state.listaHorarios];
    listaHorarios[index].porcentaje = evento.target.value;
    this.setState({ listaHorarios });
  };

  /**
   * Método encargado de abrir la ventana modal de la consulta de medidores
   * @returns {Boolean}
   */
  abrirModalMedidor = () => {
    const { tipoDeConsumo, contratosSuministroSeleccionados } = this.state;
    if (!tipoDeConsumo || tipoDeConsumo == '') {
      this.props.mostrarAlerta('Error', 'Debe seleccionar un tipo de consumo.');
      return;
    }
    if (!Util.validarArreglo(contratosSuministroSeleccionados)) {
      this.props.mostrarAlerta('Error', 'Debe seleccionar como mínimo un contrato.');
      return;
    }
    this.setState({
      mostrarModalMedidor: true
    });
  };

  /**
   * Método encargado de abrir la ventana modal de la consulta de proyectos y barrios
   */
  abrirModalProyecto = () => {
    this.setState({
      mostrarModalProyecto: true
    });
  };

  /**
   * Método encargado de abrir la ventana modal de la consulta de contratos de suministro
   */
  abrirModalContratoSuministro = () => {
    this.setState({
      mostrarModalContratoSuministro: true
    });
  };

  /**
   * Método encargado de abrir la ventana modal de la consulta de contratos de transporte
   */
  abrirModalContratoTransporte = () => {
    this.setState({
      mostrarModalContratoTransporte: true
    });
  };

  /**
   * Método encargado agregar los medidores seleccionados
   * @param {Object} medidores Medidores seleccionados por el usuario
   */
  onSeleccionarMedidor = (medidores) => {
    this.setState({
      mostrarModalMedidor: false,
      medidoresSeleccionados: [...medidores]
    });
  };

  /**
   * Método encargado agregar los proyectos y barrios seleccionados
   * @param {Object} proyectosBarriosVeredas Proyectos y barrios seleccionados por el usuario
   */
  onSeleccionarProyectoBarrioVereda = (proyectosBarriosVeredas) => {
    let listaBarrios = this.state.proyectosBarriosVeredasSeleccionados;
    proyectosBarriosVeredas.map(b => {
      const existe = listaBarrios.find(p => p.ideRegistro == b.ideRegistro);
      if (!existe) {
        b.accion = 'INSERTAR';
        listaBarrios.push(b);
      }
    });
    this.setState({
      mostrarModalProyecto: false,
      proyectosBarriosVeredasSeleccionados: listaBarrios
    });
  };

  /**
   * Método encargado agregar los contratos de suministro seleccionados
   * @param {Object} contratosSuministro Contratos de suministro seleccionados por el usuario
   */
  onSeleccionarContratosSuministro = (contratosSuministro) => {
    this.setState({
      mostrarModalContratoSuministro: false,
      contratosSuministroSeleccionados: [...contratosSuministro]
    });
  };

  /**
   * Método encargado agregar los contratos de transporte seleccionados
   * @param {Object} contratosTransporte Contratos de transporte seleccionados por el usuario
   */
  onSeleccionarContratosTransporte = (contratosTransporte) => {
    this.setState({
      mostrarModalContratoTransporte: false,
      contratosTransporteSeleccionados: [...contratosTransporte]
    });
  };

  /**
   * Método encargado de generar un objeto con los identificadores de los medidores seleccionados
   * @returns {Object}
   */
  obtenerMedidores = () => {
    const listaMedidores = this.state.medidoresSeleccionados.map(a => {
      return {
        mesuIdemedidor: { mesuIderegistro: a.mesuIderegistro },
        ptcsIderegistro: a.ptcsIderegistro,
      };
    });
    return listaMedidores;
  };

  /**
   * Método encargado de generar un objeto con el nombre, identificador, tipo e información de los proyectos y barrios seleccionados
   * @returns {Object}
   */
  obtenerProyectosBarriosVeredas = () => {
    let listaFinal = [];
    const listaProyectosEliminados = [...this.state.listaEliminar];
    const listaProyectosBarriosVeredas = [...this.state.proyectosBarriosVeredasSeleccionados];
    if (Util.validarArreglo(listaProyectosEliminados)) {
      listaFinal = listaProyectosEliminados.concat(listaProyectosBarriosVeredas)
    } else {
      listaFinal = listaProyectosBarriosVeredas.concat(listaProyectosEliminados);
    }
    return listaFinal.map(a => {
      return {
        nombre: a.nombre,
        ideRegistro: a.ideRegistro,
        tipo: a.tipo,
        info: a.info,
        accion: a.accion
      };
    });
  };

  /**
   * Método encargado de generar un objeto con el identificador y el tipo del contrato de suministro
   * @returns {Object}
   */
  obtenerContratrosSuministro = () => {
    const { contratosSuministroSeleccionados } = this.state;
    if (contratosSuministroSeleccionados === []) {
      return [];
    }
    const listaContratosSuministro = contratosSuministroSeleccionados.map(dato => {
      return {
        cntIdecontrato: {
          cntIderegistro: dato.cntIderegistro,
        },
        ptccTipo: "S",
      }
    });
    return listaContratosSuministro;
  };

  /**
   * Método encargado de generar un objeto con el identificador y el tipo del contrato de transporte
   * @returns {Object}
   */
  obtenerContratrosTransporte = () => {
    const { contratosTransporteSeleccionados } = this.state;
    if (contratosTransporteSeleccionados === []) {
      return [];
    }
    const listaContratosTransporte = contratosTransporteSeleccionados.map(dato => {
      return {
        cntIdecontrato: {
          cntIderegistro: dato.cntIderegistro,
        },
        ptccTipo: "T",
      }
    });
    return listaContratosTransporte;
  };

  /**
   * Método encargado de generar un arreglo arreglo con los contratos de suministro y de transporte
   * @returns {Array}
   */
  obtenerContratos = () => {
    const { listaContratos } = this.state;
    // const contratoSeleccionado = listaContratos.find(p => p.cntIderegistro == contrato);
    const listaContratosSuministro = this.obtenerContratrosSuministro();
    const listaContratosTransporte = this.obtenerContratrosTransporte();
    let listaContratosFinal = listaContratosSuministro.concat(listaContratosTransporte);
    if (listaContratos === []) {
      return [];
    }
    return listaContratosFinal;
  };

  /**
   * Método encargado de generar un objeto con los intervalos ingresados por el usuario
   * @returns {Object}
   */
  obtenerHorarios = () => {
    const { listaHorarios } = this.state;
    const objeto = listaHorarios.map((dato, index) => {
      return {
        ptchHorainicio: dato.horaInicial,
        ptchHorafin: dato.horaFinal,
        ptchPorcentaje: parseInt(dato.porcentaje)
      }
    });
    return objeto;
  };

  /**
  * Método encargado de eliminar el medidor seleccionado
  * @param {number} posicion Posición del proyecto barrio o vereda que se desea eliminar
  */
  eliminarMedidor = (posicion) => {
    const lista = [...this.state.medidoresSeleccionados];
    lista.splice(posicion, 1);
    this.setState({ medidoresSeleccionados: lista });
  };

  /**
   * Método encargado de mostrar los medidores seleccionados
   * @returns {Array}
   */
  renderBodyMedidor = () => {
    return this.state.medidoresSeleccionados.map((a, index) => (
      <tr key={a.mesuIderegistro}>
        <td>{a.mesuNombre}</td>
        <td><button className='btnEliminar' onClick={() => {
          this.eliminarMedidor(index)
        }}>X</button>
        </td>
      </tr>
    ));
  };

  /**
  * Método encargado de eliminar el proyecto, barrio o vereda seleccionado
  * @param {number} posicion Posición del proyecto, barrio o vereda que se desea eliminar
  */
  eliminarProyecto = (posicion) => {
    const { listaEliminar } = this.state;
    const lista = [...this.state.proyectosBarriosVeredasSeleccionados];
    const municipio = { ...lista[posicion] };
    if (municipio.accion == 'GUARDADO') {
      lista.splice(posicion, 1);
      municipio.accion = 'ELIMINAR'
      listaEliminar.push(municipio);
    }
    if (municipio.accion == 'INSERTAR') {
      lista.splice(posicion, 1);
    }
    this.setState({ proyectosBarriosVeredasSeleccionados: lista });
  };

  /**
   * Método encargado de mostrar los datos de los proyectos y barrios seleccionados
   * @returns {Array}
   */
  renderBodyProyectosBarriosVeredas = () => {
    return this.state.proyectosBarriosVeredasSeleccionados
      .filter(p => p.accion != 'ELIMINAR')
      .map((a, index) => {
        return (
          <tr key={a.ideRegistro}>
            <td>{a.nombre}</td>
            <td>{a.tipo}</td>
            <td><button className='btnEliminar' onClick={() => {
              this.eliminarProyecto(index)
            }}>X</button>
            </td>
          </tr>
        )
      });
  };

  /**
  * Método encargado de eliminar el contrato de suministro seleccionado
  * @param {number} posicion Posición del contrato de suministro que se desea eliminar
  */
  eliminarContratoSuministro = (posicion) => {
    const lista = [...this.state.contratosSuministroSeleccionados];
    lista.splice(posicion, 1);
    this.setState({ contratosSuministroSeleccionados: lista });
  };

  /**
   * Método encargado de mostrar los datos de los contratos de suministro seleccionados
   * @returns {Array}
   */
  renderBodyContratoSuministro = () => {
    return this.state.contratosSuministroSeleccionados.map((a, index) => (
      <tr key={a.cntIderegistro}>
        <td>{a.terIdeagente.terNomcompleto}</td>
        <td>{a.cntNumero}</td>
        <td><button className='btnEliminar' onClick={() => {
          this.eliminarContratoSuministro(index)
        }}>X</button>
        </td>
      </tr>
    ));
  };

  /**
   * Método encargado de eliminar el contrato de transporte seleccionado
   * @param {number} posicion Posición del contrato de transporte que se desea eliminar
   */
  eliminarContratoTransporte = (posicion) => {
    const lista = [...this.state.contratosTransporteSeleccionados];
    lista.splice(posicion, 1);
    this.setState({ contratosTransporteSeleccionados: lista });
  };

  /**
   * Método encargado de mostrar los datos de los contratos de transporte seleccionados
   * @returns {Array}
   */
  renderBodyContratoTransporte = () => {
    return this.state.contratosTransporteSeleccionados.map((a, index) => (
      <tr key={a.cntIderegistro}>
        <td>{a.terIdeagente.terNomcompleto}</td>
        <td>{a.cntNumero}</td>
        <td><button className='btnEliminar' onClick={() => {
          this.eliminarContratoTransporte(index)
        }}>X</button>
        </td>
      </tr>
    ));
  };

  /**
   * Método encargado de obtener los contratos de suministro
   * @param {Object} contratos Contratos pertenecientes al punto de consumo consultado
   * @returns {Object}
   */
  obtenerDatosContratoSuministro = (contratos) => {
    let lista = [];
    const contratosSuministro = contratos.filter(p => p.ptccTipo == 'S' && p.cntIdecontrato.cntTiponegocio == 'C');
    for (let index = 0; index < contratosSuministro.length; index++) {
      const contrato = contratosSuministro[index];
      lista.push(contrato.cntIdecontrato);
    }
    return lista;
  };

  /**
   * Método encargado de obtener los horarios del punto seleccionado
   * @param {Object} horarios Horarios pertenecientes al punto de consumo consultado
   * @returns {Object}
   */
  obtenerHorariosConsulta = (horarios) => {
    return horarios.map((dato, index) => (
      {
        hora: `hora ${index}`,
        porcentaje: dato.ptchPorcentaje,
        horaInicial: dato.ptchHorainicio,
        horaFinal: dato.ptchHorafin,
      }
    ));
  };

  /**
   * Método encargado de obtener los contratos de suministro
   * @param {Object} contratos Contratos pertenecientes al punto de consumo consultado
   * @returns {Object}
   */
  obtenerDatosContratoTransporte = (contratos) => {
    let lista = [];
    const contratosSuministro = contratos.filter(p => p.ptccTipo == 'T' && p.cntIdecontrato.cntTiponegocio == 'C');
    for (let index = 0; index < contratosSuministro.length; index++) {
      const contrato = contratosSuministro[index];
      lista.push(contrato.cntIdecontrato);
    }
    return lista;
  };

  /**
   * Método encargado de obtener los contratos de suministro
   * @param {Object} contratos Contratos pertenecientes al punto de consumo consultado
   * @returns {Object}
   */
  obtenerDatosContratoVentas = (contratos) => {
    const contratoVenta = contratos.filter(p => p.ptccTipo == 'T' && p.cntIdecontrato.cntTiponegocio == 'V');
    if (Util.validarArreglo(contratoVenta)) {
      const contrato = contratoVenta[0];
      return contrato.cntIdecontrato.cntIderegistro
    }
    this.props.mostrarAlerta('Error', 'Por favor compruebe si el contrato es de Transporte y el tipo de negocio es Venta.');
  }


  /**
   * Método encargado de obtener los medidores
   * @param {Object} medidores Medidores pertenecientes al punto de consumo consultado
   * @returns {Object}
   */
  obtenerDatosMedidores = (medidores) => {
    return medidores.map(dato => (
      {
        mesuIderegistro: dato.mesuIdemedidor.mesuIderegistro,
        ptcsIderegistro: dato.ptcsIderegistro,
        mesuNombre: dato.mesuIdemedidor.mesuNombre,
      }
    ));
  };

  /**
   * Método encargado de obtener las ubicaciones
   * @param {Object} ubicaciones Proyectos, barrios y veredas pertenecientes al punto de consumo consultado
   * @returns {Object}
   */
  obtenerDatosUbicacion = (ubicaciones) => {
    if (!Util.validarArreglo(ubicaciones)) {
      return [];
    }
    return ubicaciones.map(dato => (
      {
        nombre: (dato.barrio.barrioNom) ? dato.barrio.barrioNom : dato.proyecto.proyectoNom,
        ideRegistro: (dato.barrio.barrioNom) ? dato.barrio.barrioIderegistro : dato.proyecto.proyectoIderegistro,
        tipo: (dato.barrio.barrioNom) ? "BARRIO" : "PROYECTO",
        accion: 'GUARDADO' //Actualmente guardado.
      }
    ));

  };

  /**
   * Método encargado de consultar los datos del punto de consumo seleccionado
   * @param entidad Datos del punto de consumo seleccionado
   */
  consultarDatosPunto = (entidad) => {
    let { datosConsultados } = this.state;
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTOS_CONSUMO_PARTICULAR, { idPuntoConsumo: entidad.ptcIderegistro })
      .then(respuesta => {
        datosConsultados = respuesta.data.datos;
        this.setState({
          mostrarModalConsulta: false,
          idPuntoConsumo: entidad.ptcIderegistro,
          tipoLectura: (!entidad.ptcTipolectura) ? '-1' : entidad.ptcTipolectura,
          puntoDeSalida: entidad.ptsaIdesalida.ptsaIderegistro,
          nombre: entidad.ptcoNombre,
          tipoDeConsumo: entidad.uniIdetipoconsumo.uniIderegistro,
          idAnteTransportador: entidad.ptcoCodigogestor,
          porcentajeParticipacion: entidad.ptcPorcenmercado,
          unidadMedida: entidad.uniIdemedidanomin.uniIderegistro,
          indicePerdidas: entidad.ptcoCalindice,
          capacidadNominacion: entidad.ptcMaxnominacion,
          propio: entidad.ptcoPropio,
          resoCreg08: entidad.ptcCreg088,
          resoCreg07: entidad.ptcCreg070,
          valorCalculada: entidad.conIdeformula.uniConcepto,
          formulaGasificacion: entidad.conIdegasificacion.uniConcepto,
          formulaIndicePerdidas: entidad.conIdeindperdidas.uniConcepto,
          formulaNominacion: entidad.conIdenominar.uniConcepto,
          pronosticoAtomatico: entidad.ptcAutopronostico,
          cuentaBalance: entidad.ptcAplbalance,
          unidadMedidaCuentaBalance: (Object.keys(entidad.uniIdemedbalance).length > 0) ? entidad.uniIdemedbalance.uniIderegistro : '',
          contrato: getProp(entidad, 'cntIdetercero.cntIderegistro', null),
          listaHorarios: this.obtenerHorariosConsulta(datosConsultados.horarios),
          contratosSuministroSeleccionados: this.obtenerDatosContratoSuministro(datosConsultados.contratos),
          contratosTransporteSeleccionados: this.obtenerDatosContratoTransporte(datosConsultados.contratos),
          proyectosBarriosVeredasSeleccionados: this.obtenerDatosUbicacion(datosConsultados.proyectos),
          medidoresSeleccionados: this.obtenerDatosMedidores(datosConsultados.medidores),
        });
      });
  };

  /**
   * Método encargado de mostrar los porcentajes por hora
   * @returns {Object}
   */
  renderHorarios = () => {
    return (
      <Fragment>
        <div className='col-12 mt-5 pt-3'>
          <h1 className='text-center'>Porcentajes de consumo diario</h1>
        </div>
        {
          this.state.listaHorarios.map((dato, index) => {
            return (
              <div className='col-3 mt-5' key={dato.hora}>
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={false}
                  label={`${dato.horaInicial}-${dato.horaFinal}`}
                  onChange={(evento) => {
                    this.controlarCambioPorcentaje(evento, index)
                  }}
                  value={dato.porcentaje}
                  name='horario'
                  id='horario'
                />
              </div>
            );
          })
        }
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
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <Input
            label='Nombre del Punto De Consumo:'
            value={this.state.nombre}
            onChange={this.controlarCambio}
            name='nombre'
          />
          <Combo
            opciones={listaTipoConsumo}
            propTexto='nombre'
            propValor='id'
            label='Tipo de Lectura:'
            name='tipoLectura'
            value={this.state.tipoLectura}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaPuntosDeSalida}
            propTexto='ptsaNombre'
            propValor='ptsaIderegistro'
            label='Punto de salida:'
            name='puntoDeSalida'
            value={this.state.puntoDeSalida}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.listaTipoDeConsumo}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo de Consumo:'
            name='tipoDeConsumo'
            value={this.state.tipoDeConsumo}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={listaSiNo}
            propTexto='nombre'
            propValor='id'
            label='Propio'
            name='propio'
            value={this.state.propio}
            onChange={this.controlarCambioPropio}
          />
          {this.state.propio === 'N' &&
            <Combo
              opciones={this.state.listaContratos}
              propTexto='titulo'
              propValor='cntIderegistro'
              label='Tercero Contrato:'
              name='contrato'
              value={this.state.contrato}
              onChange={this.controlarCambio}
            />
          }
          <Combo
            opciones={this.state.variablesL}
            propTexto='uniUnidad.uniNombre1'
            propValor='uniUnidad.uniIderegistro'
            label='Fórmula Lectura:'
            name='valorCalculada'
            value={this.state.valorCalculada}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={this.state.variablesN}
            propTexto='uniUnidad.uniNombre1'
            propValor='uniUnidad.uniIderegistro'
            label='Fórmula Nominación:'
            name='formulaNominacion'
            value={this.state.formulaNominacion}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={listaSiNo}
            propTexto='nombre'
            propValor='id'
            label='Aplica Cuenta Balance:'
            name='cuentaBalance'
            value={this.state.cuentaBalance}
            onChange={this.controlarCambio}
          />
          {this.state.cuentaBalance == 'S' &&
            <Combo
              opciones={this.state.listaUnidadMedida}
              propTexto='uniNombre1'
              propValor='uniIderegistro'
              label='Unidad de Medida Cuenta Balance:'
              name='unidadMedidaCuentaBalance'
              value={this.state.unidadMedidaCuentaBalance}
              onChange={this.controlarCambio}
            />
          }
        </div>
        <div className='conf-general row mt-8'>
          <Combo
            opciones={listaSiNo}
            propTexto='nombre'
            propValor='id'
            label='Pronóstico Automático'
            name='pronosticoAtomatico'
            value={this.state.pronosticoAtomatico}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={listaSiNo}
            propTexto='nombre'
            propValor='id'
            label='Reso Creg 0702016'
            name='resoCreg07'
            value={this.state.resoCreg07}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={listaSiNo}
            propTexto='nombre'
            propValor='id'
            label='Reso Creg 0882016'
            name='resoCreg08'
            value={this.state.resoCreg08}
            onChange={this.controlarCambio}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Capacidad Máxima de Nominación:'
            value={this.state.capacidadNominacion}
            onChange={this.controlarCambio}
            name='capacidadNominacion'
          />
          <Combo
            opciones={this.state.listaUnidadMedida}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Unidad de medida:'
            name='unidadMedida'
            value={this.state.unidadMedida}
            onChange={this.controlarCambio}
          />
          <Combo
            opciones={listaSiNo}
            propTexto='nombre'
            propValor='id'
            label='Calcula Índice de Pérdidas'
            name='indicePerdidas'
            value={this.state.indicePerdidas}
            onChange={this.controlarCambio}
          />
          {this.state.indicePerdidas === 'S' &&
            <Combo
              opciones={this.state.variablesI}
              propTexto='uniUnidad.uniNombre1'
              propValor='uniUnidad.uniIderegistro'
              label='Fórmula Índice de Pérdidas:'
              name='formulaIndicePerdidas'
              value={this.state.formulaIndicePerdidas}
              onChange={this.controlarCambio}
              cols={4}
            />
          }
          {this.state.indicePerdidas === 'S' &&
            <Combo
              opciones={this.state.variablesG}
              propTexto='uniUnidad.uniNombre1'
              propValor='uniUnidad.uniIderegistro'
              label='Fórmula Gasificación:'
              name='formulaGasificacion'
              value={this.state.formulaGasificacion}
              onChange={this.controlarCambio}
              cols={4}
            />
          }
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Porcentaje De Participación En El Mercado:'
            value={this.state.porcentajeParticipacion}
            onChange={this.controlarCambio}
            name='porcentajeParticipacion'
          />
          <Input
            label='Identificación ante el Transportador:'
            value={this.state.idAnteTransportador}
            onChange={this.controlarCambio}
            name='idAnteTransportador'
          />
        </div>
        <div className='row mt-2'>
          <div className='col-6'>
            <p><b>Contrato Suministro Proveedor {this.state.contratosSuministroSeleccionados.length > 0 ? ` (${this.state.contratosSuministroSeleccionados.length})` : ''}</b></p>
            <button className='btn btn-primary' onClick={this.abrirModalContratoSuministro}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.contratosSuministroSeleccionados.length > 0 &&
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Tercero</th>
                      <th>Numero de Contrato</th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderBodyContratoSuministro()}
                  </tbody>
                </table>
              }
            </div>
          </div>
          <div className='col-6'>
            <p><b>Medidor De Suministro {this.state.medidoresSeleccionados.length > 0 ? ` (${this.state.medidoresSeleccionados.length})` : ''}</b></p>
            <button className='btn btn-primary' onClick={this.abrirModalMedidor}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.medidoresSeleccionados.length > 0 &&
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Medidor</th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderBodyMedidor()}
                  </tbody>
                </table>
              }
            </div>
          </div>
        </div>
        <div className='row mt-2'>
          <div className='col-6'>
            <p><b>Proyectos y Barrios/Veredas {this.state.proyectosBarriosVeredasSeleccionados.length > 0 ? ` (${this.state.proyectosBarriosVeredasSeleccionados.length})` : ''}</b></p>
            <button className='btn btn-primary' onClick={this.abrirModalProyecto}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.proyectosBarriosVeredasSeleccionados.length > 0 &&
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Proyecto/Barrio/Vereda</th>
                      <th>Tipo</th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderBodyProyectosBarriosVeredas()}
                  </tbody>
                </table>
              }
            </div>
          </div>
          <div className='col-6'>
            <p><b>Contrato Transporte Proveedor {this.state.contratosTransporteSeleccionados.length > 0 ? ` (${this.state.contratosTransporteSeleccionados.length})` : ''}</b></p>
            <button className='btn btn-primary' onClick={this.abrirModalContratoTransporte}>Seleccionar</button>
            <div className='pt-3'>
              {this.state.contratosTransporteSeleccionados.length > 0 &&
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Tercero</th>
                      <th>Número de Contrato</th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderBodyContratoTransporte()}
                  </tbody>
                </table>
              }
            </div>
          </div>
          {
            this.renderHorarios()
          }
        </div>

        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Consulta de Puntos de Consumo'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaPuntosConsumo esModal seleccionarEntidad={this.consultarDatosPunto} />
        </VentanaModal>

        <VentanaModal
          mostrar={this.state.mostrarModalMedidor}
          titulo='Seleccionar Medidores'
          cerrarModal={() => this.setState({ mostrarModalMedidor: false })}>
          <RConsultaMedidor
            esModal
            seleccionMultiple
            sinCriterio={true}
            entidadesSeleccionadas={this.state.medidoresSeleccionados}
            seleccionarEntidades={this.onSeleccionarMedidor}
            listaContratos={this.state.contratosSuministroSeleccionados}
            idTipoConsumo={this.state.tipoDeConsumo}
            listaTipoDeConsumo={this.state.listaTipoDeConsumo}
            mostrarAlerta={this.props.mostrarAlerta}
          />
        </VentanaModal>

        <VentanaModal
          mostrar={this.state.mostrarModalProyecto}
          titulo='Seleccionar proyecto, barrio o vereda'
          cerrarModal={() => this.setState({ mostrarModalProyecto: false })}>
          <RConsultaProyecto
            esModal
            seleccionMultiple
            entidadesSeleccionadas={this.state.proyectosBarriosVeredasSeleccionados}
            seleccionarEntidades={this.onSeleccionarProyectoBarrioVereda}
            mostrarAlerta={this.props.mostrarAlerta}
          />
        </VentanaModal>

        <VentanaModal
          mostrar={this.state.mostrarModalContratoSuministro}
          titulo='Seleccionar contrato de suministro'
          cerrarModal={() => this.setState({ mostrarModalContratoSuministro: false })}>
          <RConsultaContratoSuministro
            esModal
            seleccionMultiple
            entidadesSeleccionadas={this.state.contratosSuministroSeleccionados}
            seleccionarEntidades={this.onSeleccionarContratosSuministro}
            mostrarAlerta={this.props.mostrarAlerta}
          />
        </VentanaModal>

        <VentanaModal
          mostrar={this.state.mostrarModalContratoTransporte}
          titulo='Seleccionar contrato de transporte'
          cerrarModal={() => this.setState({ mostrarModalContratoTransporte: false })}>
          <RConsultaContratoTransporte
            esModal
            seleccionMultiple
            entidadesSeleccionadas={this.state.contratosTransporteSeleccionados}
            seleccionarEntidades={this.onSeleccionarContratosTransporte}
            mostrarAlerta={this.props.mostrarAlerta}
          />
        </VentanaModal>

      </Fragment>
    );
  };
}

GestionPuntosConsumo.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionPuntosConsumo);

export { VistaRedux as RGestionPuntosConsumo };
