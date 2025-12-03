import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Botonera, Util } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../global/rutas_api';

// Util y Constantes
import { CLASES_UNIDADES } from '../../../global/constantes';
import { parsearJSONUniPropiedad, esObjetoVacio, formatearArray, limpiarDatosHistorico, TIPOS_UNIDADES_MEDIDA, limpiarJson } from '../../../global/util_nominaciones';

// REDUX
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';

import { mostrarAlerta, mostrarProgramaModal } from '../../../store/actions/AplicacionAcciones';
import { actualizarCabeceraContrato, actualizarListaContratos, actualizarTipoCalculoContrato, actualizarDocumentosContrato, actualizarGarantia, limpiarContrato } from '../../../store/actions/ContratosAcciones';

// VISTAS
import { RCabeceraContrato } from './forms/CabeceraContrato';
import { RCalculoPrecioContrato } from './CalculoPrecioContrato/CalculoPrecioContrato';
import { RGestionDocumentos } from './forms/GestionDocumentos';
import { RSeleccionTipoGarantia } from './forms/SeleccionTipoGarantia';
import { get as getProp } from 'object-path';
import { SelectorPuntosSalida } from '../../utils/SelectorPuntosSalida';
import moment from 'moment';

import './GestionContratos.scss';
import RUTAS_VISTA from '../../../global/rutas_vista';
import { ABREVIATURAS_CONTRATO } from '../../../global/constantes';
import { toast } from 'react-toastify';

const VISTAS = [
  { id: 0, titulo: 'Cabecera del Contrato', componente: 'obtenerCabeceraContrato' },
  { id: 1, titulo: 'Tipo de Cálculo de Precio', componente: 'obtenerTipoCalculoPrecio' },
  { id: 2, titulo: 'Selección Garantias', componente: 'obtenerSeleccionTipoGarantias' },
  { id: 3, titulo: 'Gestión de Documentos', componente: 'obtenerGestionDocumentos' },
];

const TIPOS_GARANTIA = {
  BANCARIA: 'GB',
  PREPAGO: 'PR',
  POLIZA: 'PO'
};

const TIPOS_CACULO_PRECIO = {
  NINGUNO: 'N',
  TRAMOS: 'T',
  CANASTA: 'C'
};

const TIPOS_CANASTA = {
  HORARIA: "H",
  CONSUMO: "C",
  DUPLEX: "A",
};

class GestionContratos extends Component {
  refPuntosSalida = null;
  state = {
    mostrarModalConsulta: false,
    //navegador
    programaActual: 1,
    // Estado de la aplicacion
    tiposDeUso: null,
    tiposMercado: null,
    tiposContrato: null,
    fuentesDistribucion: null,
    topGrupal: null,
    tiposModalidadContrato: null,
    clasesContrato: null,
    puntosSalida: null,
    unidadesMedida: null,
    listaTramos: null,
    listaArchivos: [],
    // Datos de cada formulario
    cabecera: null,
    //navegador
    programaActual: 0,
    idContratoTemporal: null,
    idContrato: null,

  };

  /**
   * Método encargado de obtener el historico de la garantia
   * @param {Number} idContrato Identificador del contrato
   */
  obtenerHistorico = (idContrato) => {
    axios.post(RUTAS_API.CONTRATOS.CONSULTAR_HISTORICO_GARANTIA, { idContrato: idContrato })
      .then(respuesta => {
        let garantia = { ...this.props.garantia };
        garantia.historico = respuesta.data.datos;
        this.props.actualizarGarantia(garantia);
      });
  }

  /**
   * Verifica si se está consultando un contrato y ejecuta la consulta correspondiente para obtener los datos.
   * @returns {Boolean}
   */
  consultarContrato = () => {
    const { idContrato } = this.state;
    if (!idContrato) {
      return;
    }
    this.obtenerHistorico(idContrato);
    axios.post(RUTAS_API.CONTRATOS.CONSULTAR_DETALLE_CONTRATO, { idContrato: idContrato })
      .then((respuesta) => {
        if (respuesta.data.codigo > 0) {
          let listaPuntos = [];
          if (Util.validarArreglo(respuesta.data.datos.listaPuntoSalida)) {
            for (let index = 0; index < respuesta.data.datos.listaPuntoSalida.length; index++) {
              const punto = { ...respuesta.data.datos.listaPuntoSalida[index] };
              listaPuntos.push({ ...punto })
            }
          }
          this.mostrarObjeto(respuesta.data.datos, listaPuntos);
        } else {
          this.props.mostrarAlerta('Error', 'No se encontró el contrato');
        }
      });
  };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    this.cargarDatosAplicacion(this.consultarContrato);
  }

  /**
   * Cargará la información principal del módulo, en este caso consultará las listas necesariaas y demás información que necesite del servidor para empezar.
   * @param {Function} callback Funcion a ejecutar
   */
  cargarDatosAplicacion = (callback) => {
    const obj = sessionStorage.getItem('contratos');
    if (obj) {
      const json = JSON.parse(obj);
      this.props.actualizarListaContratos(json.listas);
      (typeof callback === 'function') && callback();
      return;
    }
    let fechaActual = moment().format('YYYY-MM-DD');
    const params = { criterio: '' };
    const peticiones = [
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPO_USO_CONTRATO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPO_MERCADO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPO_CONTRATO }),
      axios.post(RUTAS_API.CONFIGURACION.FUENTES_DISTRIBUCION.CONSULTAR_FUENTES_DISTRIBUCION, { ...params }),
      axios.post(RUTAS_API.PARAMETRIZACION.TOP_GRUPAL.CONSULTAR_TOPS_GRUPAL, { ...params }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPOS_MODALIDAD_CONTRATO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.CLASE_CONTRATO }),
      axios.post(RUTAS_API.PARAMETRIZACION.PUNTOS_SALIDA.CONSULTAR_PUNTOS_SALIDA, { ...params }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.UNIDAD_MEDIDA }),
      axios.post(RUTAS_API.PARAMETRIZACION.TRAMOS.CONSULTAR_TRAMOS, { ...params }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.RUTA_GNC_CONEXION }),
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_MEDIDOR_SUMINISTRO.CONSULTAR),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { ...params, idClase: CLASES_UNIDADES.TIPO_ARCHIVO_DOCUMENTO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_TRM, { criterio: '', fecha: fechaActual }),
      axios.post(RUTAS_API.PARAMETRIZACION.CONSULTAR_HORARIO_ACTIVIDAD, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.MONEDA }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.CANTIDAD }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.PRECIO_CAPACIDAD }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.UNIDAD_MEDIDA }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { idClase: CLASES_UNIDADES.TIPO_GARANTIA }),
      axios.post(RUTAS_API.CONTRATOS.CONSULTAR_CONSTATE)
    ];

    axios.all(peticiones)
      .then(
        axios.spread((tiposUso, tiposMercado, tiposContrato, fuentesDistribucion, topGrupal,
          tiposModalidadContrato, clasesContrato, puntosSalida, unidadesMedida, listaTramos,
          rutasGNC, medidores, documentos, trmdia, horarioActividad, monedas, cantidad, precioCapacidad, unidadesTipoUnidad, tiposGarantias, constantesContrato) => {
          this.props.actualizarListaContratos({
            consultasTerminadas: true,
            tiposGarantias: formatearArray(parsearJSONUniPropiedad(tiposGarantias.data.datos)),
            tiposDeUso: formatearArray(parsearJSONUniPropiedad(tiposUso.data.datos)),
            tiposMercado: formatearArray(parsearJSONUniPropiedad(tiposMercado.data.datos)),
            tiposContrato: formatearArray((parsearJSONUniPropiedad(tiposContrato.data.datos))),
            fuentesDistribucion: formatearArray(parsearJSONUniPropiedad(fuentesDistribucion.data.datos)),
            topGrupal: formatearArray(topGrupal.data.datos),
            tiposModalidadContrato: formatearArray(parsearJSONUniPropiedad(tiposModalidadContrato.data.datos)),
            clasesContrato: formatearArray(parsearJSONUniPropiedad(clasesContrato.data.datos)),
            puntosSalida: formatearArray(puntosSalida.data.datos),
            unidadesMedida: formatearArray(parsearJSONUniPropiedad(unidadesMedida.data.datos)),
            listaTramos: formatearArray(listaTramos.data.datos),
            rutasGNC: formatearArray(parsearJSONUniPropiedad(rutasGNC.data.datos)),
            rutas: formatearArray(parsearJSONUniPropiedad(rutasGNC.data.datos)),
            medidores: formatearArray(medidores.data.datos),
            listaTiposDocumentos: formatearArray(documentos.data.datos),
            monedas: formatearArray(monedas.data.datos),
            cantidad: formatearArray(cantidad.data.datos),
            unidadesTipoUnidad: formatearArray(unidadesTipoUnidad.data.datos),
            precioCapacidad: formatearArray(precioCapacidad.data.datos),
            constantesContrato: formatearArray(constantesContrato.data.datos)
          });
          if (Util.validarArreglo(constantesContrato.data.datos)) {
            const variables = constantesContrato.data.datos;
            const valorFijoCobertura = variables.find(v => v.conAbreviatura == ABREVIATURAS_CONTRATO.VALOR_FIJO_COBERTURA);
            const valorFijoConexionGnc = variables.find(v => v.conAbreviatura == ABREVIATURAS_CONTRATO.VALOR_FIJO_CONEXIONGNC);
            const valorFijoTransporte = variables.find(v => v.conAbreviatura == ABREVIATURAS_CONTRATO.VALOR_FIJO_TRANSPORTE);
            const valorVariableTransporte = variables.find(v => v.conAbreviatura == ABREVIATURAS_CONTRATO.VALOR_VARIABLE_TRANSPORTE);
            let valoresGarantia = {
              valorFijoCobertura: valorFijoCobertura.conValor,
              valorFijoConexionGnc: valorFijoConexionGnc.conValor,
              valorFijoTransporte: valorFijoTransporte.conValor,
              valorVariableTransporte: valorVariableTransporte.conValor
            };
            this.props.actualizarCabeceraContrato({ valoresGarantia: valoresGarantia });
          }
          this.props.actualizarCabeceraContrato({ trmDia: (trmdia.data.codigo > 0) ? trmdia.data.datos.covlValor : 0, idTrm: (trmdia.data.codigo > 0) ? trmdia.data.datos.covlIderegistro : null });
          this.props.actualizarTipoCalculoContrato({ tipoCalculo: 'N' });
          if (horarioActividad.data.codigo > 0) {
            const actividad = horarioActividad.data.datos;
            this.mostrarAlertaActividad(actividad[0]);
          }
          (typeof callback === 'function') && callback();
        }), (err) => {
          console.log(err);
        }
      );
  };

  /**
   * Setea la actividad y una bandera en true para mostrar una alerta que indicará
   * al usuario el tipo de actividad que pertenece al horario en el que
   * accede a la interfaz.
   * @param {Object} actividad Datos de la actividad
   */
  mostrarAlertaActividad = (actividad) => {
    if (actividad) {
      this.setState({ mostrarAlertaActividad: true, actividad: actividad });
    } else {
      this.setState({ mostrarAlertaActividad: false });
    }
  };

  /**
   * Actualizará algunos atributos del state para limpiar los datos temporales que se guardan en este.
   */
  limpiarFormulario = () => {
    const trmDia = getProp(this.props, 'cabecera.trmDia', 0);
    this.props.limpiarContrato();
    this.resetearListas();
    this.props.actualizarCabeceraContrato({ trmDia: trmDia });
    limpiarDatosHistorico(RUTAS_VISTA.GESTION_CONTRATOS.url, this.props);
    location.reload();
  };

  /**
   * Actualizará algunos atributos del state para limpiar los datos temporales que se guardan en este.
   */
  limpiarFormularioSinRecargar = () => {
    const trmDia = getProp(this.props, 'cabecera.trmDia', 0);
    this.props.limpiarContrato();
    this.resetearListas();
    this.props.actualizarCabeceraContrato({ trmDia: trmDia });
    limpiarDatosHistorico(RUTAS_VISTA.GESTION_CONTRATOS.url, this.props);
  };

  /**
   * Método encargado de limpiar las listas
   * @param {Array} lista Lista a limpiar
   * @returns {Array}
   */
  resetearLista = (lista) => {
    if (!Util.validarArreglo(lista)) {
      return [];
    }
    return lista.map(item => {
      item.seleccionado = false;
      return item;
    })
  };

  /**
   * Método encargado de actualizar el objeto redux para la cabecera del contrato
   * @param {Object} nuevoCambio Cambio a realizar en la cabecera
   */
  actualizarCabeceraRedux = (nuevoCambio) => {
    this.props.actualizarCabeceraContrato({
      ...this.props.cabecera,
      ...nuevoCambio
    });
  };

  /**
   * Quitará los atributos seleccionado a false.
   */
  resetearListas = () => {
    const { tiposContrato, listaTramos, puntosSalida, rutas, medidores } = this.props.listas;
    let listaTramosFinal = getProp(this.props, 'listas.listaTramosFinal', []);
    listaTramosFinal = this.resetearLista(listaTramosFinal);
    const nuevosTiposContrato = this.resetearLista(tiposContrato);
    const nuevosListaTramos = this.resetearLista(listaTramos);
    const nuevosPuntosSalida = this.resetearLista(puntosSalida);
    const nuevosRutas = this.resetearLista(rutas);
    const nuevosMedidores = this.resetearLista(medidores);
    const listasActuales = this.props.listas;
    this.props.actualizarListaContratos({
      ...listasActuales,
      consultasTerminadas: true,
      tiposContrato: [...nuevosTiposContrato],
      listaTramos: [...nuevosListaTramos],
      puntosSalida: [...nuevosPuntosSalida],
      rutas: [...nuevosRutas],
      medidores: [...nuevosMedidores],
      listaTramosFinal: [...listaTramosFinal]
    })
  };

  /**
   * Método encargado de ejecutar acciones al desmontar el componente
   */
  componentWillUnmount() {
    this.limpiarFormularioSinRecargar();
  }

  /**
   * Obtiene un arreglo con objetos que construirán los botones de la interfaz.
   * @return {array}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Valdia el formulario.
   * @return {object}
   */
  validarFormulario = () => {
    const { cabecera, tipoCalculo, garantia, documentos } = this.props;

    if (!cabecera.tipoUso || cabecera.tipoUso == '' || cabecera.tipoUso == '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de uso de la cabecera' } };
    }

    if (cabecera.tipoNegocio && cabecera.tipoNegocio == 'C' && (!cabecera.tipoMercado || cabecera.tipoMercado == '' || cabecera.tipoMercado == '-1')) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de mercado' } };
   }

   if(!cabecera.periodoCantidadContratada || cabecera.periodoCantidadContratada === ''){
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar periodo de la cantidad contratada' } };
    }

    if (tipoCalculo.tipoCalculo == 'N') {
      if (isNaN(cabecera.porcentajeComercializacion) || cabecera.porcentajeComercializacion < 0 || cabecera.porcentajeComercializacion > 100) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el porcentaje de comercialización.' } };
      }
    }

    if (!cabecera.unidadMedidaPrecio || cabecera.unidadMedidaPrecio == '' || cabecera.unidadMedidaPrecio == '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la unidad de medida en el calculo del precio' } };
    }

    if (!cabecera.agenteTercero) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tercero.' } };
    }

    if (!documentos || !Util.validarArreglo(documentos.adjuntos)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Complete la subida de los documentos.' } };
    }

    if (!garantia || typeof garantia == 'undefined' || Object.keys(garantia).length == 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un tipo de garantia' } };
    }

    let validarGarantia;
    switch (garantia.tipoGarantia) {
      case TIPOS_GARANTIA.BANCARIA:
        validarGarantia = garantia.bancaria;
        break;
      case TIPOS_GARANTIA.PREPAGO:
        validarGarantia = garantia.prepago;
        break;
      case TIPOS_GARANTIA.POLIZA:
        validarGarantia = garantia.poliza;
        break;
      default:
        validarGarantia = 0;
        break;
    }

    const tiposSinListas = this.props.listas.tiposContrato.filter(t => t.seleccionado &&
      (getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'));
    const esSkids = this.props.listas.tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'));
    if (Util.validarArreglo(tiposSinListas)) {
      if (tipoCalculo.tipoCalculo == 'N') {
        if (!cabecera.precioContrato || cabecera.precioContrato == '' || cabecera.precioContrato == '-1') {
          return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un valor unitario en el calculo del precio' } };
        }
      }
    }

    if (esSkids && (!cabecera.aporteGNV || cabecera.aporteGNV == '' || cabecera.aporteGNV == '-1')) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar si aplica aportes GNV' } };
    }

    if (validarGarantia != 0) {
      if (!validarGarantia.fechaInicial || validarGarantia.fechaInicial == '') {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha inicial para la garantia' } };
      }
      if (!validarGarantia.fechaFin || validarGarantia.fechaFin == '') {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una fecha fin para la garantia' } };
      }
      if (garantia.tipoGarantia == TIPOS_GARANTIA.POLIZA) {
        if (!validarGarantia.expidePoliza || validarGarantia.expidePoliza == '') {
          return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar una empresa para la garantia' } };
        }
        if (Util.validarArreglo(tiposSinListas) && tiposSinListas.length > 1) {
          if (!validarGarantia.tipoContrato || validarGarantia.tipoContrato == '' || validarGarantia.tipoContrato == '-1') {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de calculo de la garantia' } };
          }
        }
      }

      if (garantia.tipoGarantia == TIPOS_GARANTIA.BANCARIA) {
        if (Util.validarArreglo(tiposSinListas) && tiposSinListas.length > 1) {
          if (!validarGarantia.tipoContrato || validarGarantia.tipoContrato == '' || validarGarantia.tipoContrato == '-1') {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de calculo de la garantia' } };
          }
        }
      }
    }
    //Validamos las rutas...
    const tiposContrato = this.props.listas.tiposContrato.filter(tipoContrato => (tipoContrato.seleccionado && tipoContrato.uniPropiedad && tipoContrato.uniPropiedad.tipocontrato == 'CNX') || (tipoContrato.seleccionado && tipoContrato.uniPropiedad && tipoContrato.uniPropiedad.tipocontrato == 'GNC'));

    if (Util.validarArreglo(tiposContrato)) {
      const rutasSeleccionadas = this.props.listas.rutasGNC.filter(ruta => ruta.seleccionado);
      if (!Util.validarArreglo(rutasSeleccionadas)) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar como mínimo una ruta.' } };
      }
    }
    const transporte = this.props.listas.tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'T');
    const suministro = this.props.listas.tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'S');
    if ((transporte || suministro) && !(cabecera.claseContrato || cabecera.claseContrato == '' || cabecera.claseContrato == '-1')) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar la clase del contrato' } };
    }
    if (transporte) {
      const listaFinal = this.obtenerTramosFinal();
      let tramosSeleccionados = listaFinal.filter(tramo => tramo.seleccionado);
      if (!Util.validarArreglo(tramosSeleccionados)) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar como mínimo un tramo.' } };
      }
      if (tramosSeleccionados.length != listaFinal.length) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar todos los tramos.' } };
      }
    }
    if (tipoCalculo.tipoCalculo == 'C') {
      if (!tipoCalculo.canastaConsumoSuministro.tipoLiquidacion || tipoCalculo.canastaConsumoSuministro.tipoLiquidacion == '' || tipoCalculo.canastaConsumoSuministro.tipoLiquidacion == '-1') {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de liquidación' } };
      }
      if (!Util.validarArreglo(tipoCalculo.canastaConsumoSuministro.canastaConRutas)) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe generar los intervalos de canasta' } };
      }
      for (let index = 0; index < tipoCalculo.canastaConsumoSuministro.canastaConRutas.length; index++) {
        const rango = tipoCalculo.canastaConsumoSuministro.canastaConRutas[index];
        if (!rango.porcentaje || rango.porcentaje == '' || rango.porcentaje > 100 || rango.porcentaje < 0 || isNaN(rango.porcentaje)) {
          return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un porcentaje para todos los rangos de la canasta' } };
        }
        for (let index = 0; index < rango.rutas.length; index++) {
          const elemento = rango.rutas[index];
          if (!elemento.trmIderegistro) {
            if (!elemento.valor || elemento.valor == '' || isNaN(elemento.valor)) {
              return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un valor para todos los elementos de la canasta' } };
            }
          }
          if (elemento.trmIderegistro) {
            if (!elemento.cargos.cntrCargovariable || elemento.cargos.cntrCargovariable == '' || isNaN(elemento.cargos.cntrCargovariable)) {
              return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el valor del cargo para todos los elementos de la canasta' } };
            }
          }
        }
      }
    }

    return { respuesta: true };
  };

  /**
   * Obtiene la lista de documentos para registrar.
   * @return {array}
   */
  obtenerListaDocumentos = () => {
    const listaDocumentos = [...this.props.documentos.adjuntos];
    return listaDocumentos.map((f) => {
      return {
        cntdNombre: f.nombre,
        uniIdetipodocumento: {
          uniIderegistro: f.tipoDocumento
        },
        cntdFechainicio: f.fechaInicio,
        cntdFechafinal: f.fechaFin,
        cntdFechaexpedicion: f.fechaExpedicion,
        cntdIdearchivo: f.id
      };
    });
  };

  /**
   * Método encargado de obtener los tramos seleccionados
   * @returns {Array}
   */
  obtenerTramosSeleccionadosDetalle = () => {
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    if (tipoCalculo && tipoCalculo.tipoCalculo == 'C') {
      const intervalo = (tipoCalculo.canastaConsumoSuministro) ? tipoCalculo.canastaConsumoSuministro.canastaConRutas[0] : {};
      const tramos = intervalo.rutas.filter(t => t.trmIderegistro);
      return tramos;
    }
    return getProp(this.props.listas, 'listaTramosFinal', []).filter(t => t.seleccionado);
  };

  /**
   * Método encargado de obtener los tramos dependiendo de los puntos de salida seleccionados
   * @returns {Array}
   */
  obtenerTramosFinal = () => {
    let lista = [];
    const tramos = getProp(this.props, 'listas.listaTramos', []);
    const puntosSalida = getProp(this.props, 'listas.puntosSalida', []).filter(p => p.seleccionado);
    if (!Util.validarArreglo(puntosSalida)) {
      return;
    }
    puntosSalida.forEach(punto => {
      punto.listaTramos.forEach(tramo => {
        let tramoPush = tramos.find(tramoFinal => tramoFinal.trmIderegistro == tramo.trmIderegistro.trmIderegistro);
        if (!Util.validarArreglo(lista)) {
          lista.push(tramoPush);
          return;
        }
        let existente = lista.find(exis => exis.trmIderegistro == tramo.trmIderegistro.trmIderegistro);
        if (existente) {
          return;
        }
        lista.push(tramoPush);
      });
    });
    return lista;
  }

  /**
   * Método encargado de asignar la cantidad contratada a cada tramo dependiendo de los puntos de salida
   * @param {Array} puntosAsociados Puntos asociados por tramo
   * @param {Array} tramos Lista de tramos seleccionados
   */
  obtenerCantidadContratadaTramo = (puntosAsociados, tramos) => {
    for (const idTramo in puntosAsociados) {
      const puntosAsociadosFor = puntosAsociados[idTramo];
      tramos.forEach(tramo => {
        if (tramo.trmIderegistro == idTramo) {
          if (puntosAsociadosFor.length == 1) {
            tramo.cantidadContratada = puntosAsociadosFor[0].cntsCantidadcontratadaCalculo;
            return;
          }
          tramo.cantidadContratada = puntosAsociadosFor.reduce((a, b) => a + b.cntsCantidadcontratadaCalculo, 0);
        }
      });
    }
  }

  /**
   * Método encargado de crear grupos de puntos de consumo por tramo
   * @param {Array} tramos Tramos seleccionados
   * @returns {Array}
   */
  obtenerListaAsociadoPorTramo = (tramos) => {
    const puntosSalida = getProp(this.props.listas, 'puntosSalida', []).filter(p => p.seleccionado);;
    let gruposTramo = {};
    tramos.forEach((tramo) => {
      puntosSalida.forEach(ps => {
        let puntoAsociado = ps.listaTramos.find(pst => pst.trmIderegistro.trmIderegistro == tramo.trmIderegistro);
        let idTramo = tramo.trmIderegistro;
        if (!gruposTramo[idTramo]) {
          gruposTramo[idTramo] = [];
        }
        if (puntoAsociado) {
          gruposTramo[idTramo].push(ps);
        }
      });
    });
    return gruposTramo;
  };

  /**
   * Método encargado de obtener el detalle de la garantia Gnc o Conexión
   * @returns {Array}
   */
  obtenerDetalleGarantiaTransporte = () => {
    let listaDetalle = [];
    let cargos;
    const tramos = this.obtenerTramosFinal();
    const valoresGarantia = getProp(this.props, 'cabecera.valoresGarantia');
    const numeroDias = getProp(this.props.garantia, 'prepago.numeroDiasPrepago');
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    let trm = (getProp(this.props, 'cabecera.usaTRMTecho') == 'S') ?
      getProp(this.props, 'cabecera.trmTecho', 0) : getProp(this.props, 'cabecera.trmDia', 0);
    if (this.props.garantia.trmGarantia) {
      trm = this.props.garantia.trmGarantia;
    }
    let puntosAsociados = this.obtenerListaAsociadoPorTramo(tramos);
    this.obtenerCantidadContratadaTramo(puntosAsociados, tramos);
    let cantidadContradaTotal = 0;
    let cantidadContratada = 0;
    let precioCargoFijo = 0;
    let precioCargoVariable = 0;
    let precioCargoAom = 0;
    let unidadMedidaAom;
    let unidadMedidaFijo;
    let unidadMedidaVariable;
    let total = 0;
    tramos.forEach(tramo => {
      cargos = tramo.listaCargos.find(lc => lc.seleccionado);
      cantidadContratada = tramo.cantidadContrata;
      switch (periodoCantidadContratada) {
        case 'D':
          cantidadContratada = (tramo.cantidadContratada / 1);
          break;
        case 'S':
          cantidadContratada = (tramo.cantidadContratada / 7);
          break;
        case 'M':
          cantidadContratada = (tramo.cantidadContratada / 30);
          break;
        case 'A':
          cantidadContratada = (tramo.cantidadContratada / 365);
          break;
        default:
          break;
      }
      cantidadContradaTotal += parseFloat(cantidadContratada);
      precioCargoFijo += parseFloat(cargos.trcaCargofijo);
      unidadMedidaFijo = cargos.uniIdemedidafijo.uniIderegistro;
      precioCargoVariable = parseFloat(cargos.cntrCargovariable);
      unidadMedidaVariable = cargos.uniIdemedidavariable.uniIderegistro;
      precioCargoAom = parseFloat(cargos.trcaCargoaoym);
      unidadMedidaAom = cargos.uniIdemedidaoym.uniIderegistro;
      if (this.props.garantia.tipoGarantia == 'PR') {
        total += (((cargos.trcaCargofijo / 365) * trm) + (cargos.cntrCargovariable * trm) + (cargos.trcaCargoaoym / 365) +
          ((((cargos.trcaCargofijo / 365) * trm) + (cargos.cntrCargovariable * trm)) * valoresGarantia.valorVariableTransporte)) * cantidadContratada * numeroDias;
      } else {
        total += ((((cargos.trcaCargofijo / 365) * trm) + (cargos.cntrCargovariable * trm) + (cargos.trcaCargoaoym / 365)) * valoresGarantia.valorFijoTransporte * cantidadContratada);
      }
    });
    let idRegistroDetalle = null;
    let detalle;
    let detalleTramos;
    switch (this.props.garantia.tipoGarantia) {
      case 'PR':
        detalle = getProp(this.props.garantia.prepago, 'detalle', []);
        if (!Util.validarArreglo(detalle)) {
          break;
        }
        detalleTramos = detalle.find(d => d.dtgcTipo == 'T');
        if (!detalleTramos) {
          break;
        }
        idRegistroDetalle = detalleTramos.dtgcIderegistro;
        break;
      case 'GB':
        detalle = getProp(this.props.garantia.bancaria, 'detalle', []);
        if (!Util.validarArreglo(detalle)) {
          break;
        }
        detalleTramos = detalle.find(d => d.dtgcTipo == 'T');
        if (!detalleTramos) {
          break;
        }
        idRegistroDetalle = detalleTramos.dtgcIderegistro;
        break;
      case 'PO':
        detalle = getProp(this.props.garantia.poliza, 'detalle', []);
        if (!Util.validarArreglo(detalle)) {
          break;
        }
        detalleTramos = detalle.find(d => d.dtgcTipo == 'T');
        if (!detalleTramos) {
          break;
        }
        idRegistroDetalle = detalleTramos.dtgcIderegistro;
        break;
      default:
        break;
    }
    listaDetalle.push({
      dtgcIderegistro: idRegistroDetalle,
      dtgcCancontratada: cantidadContradaTotal,
      uniIdemedidacnt: {
        uniIderegistro: this.props.cabecera.unidadMedida
      },
      dtgcCarvariable: precioCargoVariable,
      uniIdemedidacarvar: {
        uniIderegistro: unidadMedidaVariable
      },
      dtgcCarfijo: precioCargoFijo,
      uniIdemedidacarfij: {
        uniIderegistro: unidadMedidaFijo
      },
      dtgcCaraoym: precioCargoAom,
      uniIdemedidacaraoym: {
        uniIderegistro: unidadMedidaAom
      },
      dtgcValgarantia: total,
      dtgcTipo: 'T'
    });
    return listaDetalle;
  };

  /**
   * Obtiene el objeto de la unidad seleccionada por id.
   * @param {Number} idUnidad Identificador de la unidad de medida
   * @return {object}
   */
  obtenerUnidad = (idUnidad) => {
    let unidadMedida = this.props.listas.unidadesMedida.find(unidad => unidad.uniIderegistro == idUnidad);
    return unidadMedida;
  };

  /**
   * Obtiene la lista de rutas seleccionados.
   * @returns {Array}
   */
  obtenerRutasSeleccionadas = (tipo = null) => {
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    if (tipoCalculo && tipoCalculo.tipoCalculo == 'C') {
      const intervalo = (tipoCalculo.canastaConsumoSuministro) ? tipoCalculo.canastaConsumoSuministro.canastaConRutas[0] : {};
      const rutas = intervalo.rutas.filter(r => r.uniIderegistro);
      if (tipo == null) {
        return rutas.map(r => {
          r.valor = (r.valor) ? parseFloat(r.valor) : 0;
          return r;
        });
      }
    }
    if (tipo == null) {
      return this.props.listas.rutas.filter(r => r.seleccionado).map(r => {
        r.cntuVlrunitario = (r.cntuVlrunitario) ? r.cntuVlrunitario : 0;
        return r;
      });
    }
  };

  /**
   * Método encargado de obtener el detalle de la garantia Gnc o Conexión
   * @returns {Array}
   */
  obtenerDetalleGarantiaGNConexion = () => {
    let unidad;
    let listaDetalle = [];
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    if (idUnidadMedida != "") {
      unidad = this.obtenerUnidad(idUnidadMedida);
    }
    const tipo = getProp(unidad, 'uniPropiedad.tipo', null);
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const valoresGarantia = getProp(this.props, 'cabecera.valoresGarantia', '');
    const numeroDias = getProp(this.props.garantia, 'prepago.numeroDiasPrepago', 0);
    let trm = (getProp(this.props, 'cabecera.usaTRMTecho') == 'S') ?
      getProp(this.props, 'cabecera.trmTecho', 0) : getProp(this.props, 'cabecera.trmDia', 0);
    if (this.props.garantia.trmGarantia) {
      trm = this.props.garantia.trmGarantia;
    }
    const rutas = this.obtenerRutasSeleccionadas();
    let cantidadContradaTotal = 0;
    let cantidadContratada = 0;
    let precioTotal = 0;
    let precio = 0;
    let total = 0;
    rutas.forEach(r => {
      cantidadContratada = r.cntuValor;
      switch (periodoCantidadContratada) {
        case 'D':
          cantidadContratada = (cantidadContratada / 1);
          break;
        case 'S':
          cantidadContratada = (cantidadContratada / 7);
          break;
        case 'M':
          cantidadContratada = (cantidadContratada / 30);
          break;
        case 'A':
          cantidadContratada = (cantidadContratada / 365);
          break;
        default:
          break;
      }
      cantidadContradaTotal += cantidadContratada;
      precio = parseFloat(r.cntuVlrunitario);
      if (tipoCalculo.tipoCalculo == 'C') {
        precio = (r.valor) ? parseFloat(r.valor) : 0;
      }
      precioTotal += precio;
      if (this.props.garantia.tipoGarantia == 'PR') {
        total += (cantidadContratada * precio * numeroDias * trm);
      } else {
        total += (cantidadContratada * precio * valoresGarantia.valorFijoConexionGnc);
      }
    });
    if (unidad && tipo === 'USD') {
      precioTotal = precioTotal * trm;
      if (this.props.garantia.tipoGarantia == 'GB' || this.props.garantia.tipoGarantia == 'PO') {
        total = total + trm;
      }
    }
    let idRegistroDetalle = null;
    let detalle;
    let detalleRutas;
    switch (this.props.garantia.tipoGarantia) {
      case 'PR':
        detalle = getProp(this.props.garantia.prepago, 'detalle', []);
        if (!Util.validarArreglo(detalle)) {
          break;
        }
        detalleRutas = detalle.find(d => d.dtgcTipo == 'R');
        if (!detalleRutas) {
          break;
        }
        idRegistroDetalle = detalleRutas.dtgcIderegistro;
        break;
      case 'GB':
        detalle = getProp(this.props.garantia.bancaria, 'detalle', []);
        if (!Util.validarArreglo(detalle)) {
          break;
        }
        detalleRutas = detalle.find(d => d.dtgcTipo == 'R');
        if (!detalleRutas) {
          break;
        }
        idRegistroDetalle = detalleRutas.dtgcIderegistro;
        break;
      case 'PO':
        detalle = getProp(this.props.garantia.poliza, 'detalle', []);
        if (!Util.validarArreglo(detalle)) {
          break;
        }
        detalleRutas = detalle.find(d => d.dtgcTipo == 'R');
        if (!detalleRutas) {
          break;
        }
        idRegistroDetalle = detalleRutas.dtgcIderegistro;
        break;
      default:
        break;
    }
    listaDetalle.push({
      dtgcIderegistro: idRegistroDetalle,
      dtgcCancontratada: cantidadContradaTotal,
      uniIdemedidacnt: {
        uniIderegistro: this.props.cabecera.unidadMedida
      },
      dtgcCarvariable: precioTotal,
      uniIdemedidacarvar: {
        uniIderegistro: this.props.cabecera.unidadMedidaPrecio
      },
      dtgcValgarantia: total,
      dtgcTipo: 'R'
    });
    return listaDetalle;
  }

  /**
   * Obtiene la lista de medidores seleccioandos.
   * @returns {Array}
   */
  obtenerMedidoresSeleccionados = () => {
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    if (tipoCalculo && tipoCalculo.tipoCalculo == 'C') {
      const intervalo = (tipoCalculo.canastaConsumoSuministro) ? tipoCalculo.canastaConsumoSuministro.canastaConRutas[0] : {};
      const medidores = intervalo.rutas.filter(m => m.mesuIderegistro);
      return medidores;
    }
    return this.props.listas.medidores.filter(m => m.seleccionado);
  };

  /**
   * Método encargado de obtener el detalle de la garantia suministro
   * @returns {Array}
   */
  obtenerDetalleGarantiaSuministro = () => {
    let unidad;
    let listaDetalle = [];
    let total = 0;
    const valoresGarantia = getProp(this.props, 'cabecera.valoresGarantia');
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const numeroDias = getProp(this.props.garantia, 'prepago.numeroDiasPrepago');
    let trm = (getProp(this.props, 'cabecera.usaTRMTecho') == 'S') ?
      getProp(this.props, 'cabecera.trmTecho', 0) : getProp(this.props, 'cabecera.trmDia', 0);
    if (this.props.garantia.trmGarantia) {
      trm = this.props.garantia.trmGarantia;
    }
    if (idUnidadMedida != "") {
      unidad = this.obtenerUnidad(idUnidadMedida);
    }
    const tipo = getProp(unidad, 'uniPropiedad.tipo', null);
    const medidores = this.obtenerMedidoresSeleccionados();
    let cantidadContradaTotal = 0;
    let cantidadContratada = 0;
    let precioTotal = 0;
    let precio = 0;
    medidores.forEach(m => {
      cantidadContratada = m.mesuCapacidadmaxima;
      switch (periodoCantidadContratada) {
        case 'D':
          cantidadContratada += (cantidadContradaTotal / 1);
          break;
        case 'S':
          cantidadContratada += (cantidadContradaTotal / 7);
          break;
        case 'M':
          cantidadContratada += (cantidadContradaTotal / 30);
          break;
        case 'A':
          cantidadContratada += (cantidadContradaTotal / 365);
          break;
        default:
          break;
      }
      cantidadContradaTotal += cantidadContratada;
      precio = parseFloat(m.mesuPrecio);
      if (tipoCalculo.tipoCalculo == 'C') {
        precio = (m.valor) ? parseFloat(m.valor) : 0;
      }
      precioTotal += precio;
      if (this.props.garantia.tipoGarantia == 'PR') {
        total += (cantidadContratada * precio * numeroDias * trm);
      } else {
        total += (cantidadContratada * precio);
      }
    });
    if (this.props.garantia.tipoGarantia == 'GB' || this.props.garantia.tipoGarantia == 'PO') {
      total = total * valoresGarantia.valorFijoCobertura;
    }
    if (unidad && tipo === 'USD') {
      precioTotal = precioTotal * trm;
      if (this.props.garantia.tipoGarantia == 'GB' || this.props.garantia.tipoGarantia == 'PO') {
        total = total + trm;
      }
    }
    let idRegistroDetalle = null;
    let detalle;
    let detalleMedidores;
    switch (this.props.garantia.tipoGarantia) {
      case 'PR':
        detalle = getProp(this.props.garantia.prepago, 'detalle', []);
        if (!Util.validarArreglo(detalle)) {
          break;
        }
        detalleMedidores = detalle.find(d => d.dtgcTipo == 'M');
        if (!detalleMedidores) {
          break;
        }
        idRegistroDetalle = detalleMedidores.dtgcIderegistro;
        break;
      case 'GB':
        detalle = getProp(this.props.garantia.bancaria, 'detalle', []);
        if (!Util.validarArreglo(detalle)) {
          break;
        }
        detalleMedidores = detalle.find(d => d.dtgcTipo == 'M');
        if (!detalleMedidores) {
          break;
        }
        idRegistroDetalle = detalleMedidores.dtgcIderegistro;
        break;
      case 'PO':
        detalle = getProp(this.props.garantia.poliza, 'detalle', []);
        if (!Util.validarArreglo(detalle)) {
          break;
        }
        detalleMedidores = detalle.find(d => d.dtgcTipo == 'M');
        if (!detalleMedidores) {
          break;
        }
        idRegistroDetalle = detalleMedidores.dtgcIderegistro;
        break;
      default:
        break;
    }
    listaDetalle.push({
      dtgcIderegistro: idRegistroDetalle,
      dtgcCancontratada: cantidadContradaTotal,
      uniIdemedidacnt: {
        uniIderegistro: this.props.cabecera.unidadMedida
      },
      dtgcCarvariable: precioTotal,
      uniIdemedidacarvar: {
        uniIderegistro: this.props.cabecera.unidadMedidaPrecio
      },
      dtgcValgarantia: total,
      dtgcTipo: 'M'
    });
    return listaDetalle;
  }

  /**
   * Método encargado de obtener los detalles de la garantia
   * @param {Object} garantia Datos de la garantia
   * @param {Object} tipoGarantia Tipo de garantia seleccionada
   */
  obtenerDetalleGarantia = (garantia, tipoGarantia) => {
    if ((tipoGarantia != 'PR' && tipoGarantia != 'GB' && tipoGarantia != 'PO')) {
      return [];
    }
    const { tiposContrato } = this.props.listas;
    const esTipoTransporte = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'T'));
    const esSuministro = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'S');
    const esGnc = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNC'));
    const esConexion = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'CNX'));
    let listaFinal = [];
    if (esSuministro) {
      listaFinal.push(...this.obtenerDetalleGarantiaSuministro());
    }
    if (esGnc || esConexion) {
      listaFinal.push(...this.obtenerDetalleGarantiaGNConexion());
    }

    if (esTipoTransporte) {
      listaFinal.push(...this.obtenerDetalleGarantiaTransporte());
    }

    return listaFinal;
  };

  /**
   * Obtiene el objeto garantia teniendo en cuenta el tipo...
   * @return {object}
   */
  obtenerGarantia = () => {
    //Tener en cuenta que hay tres tipos de garantia.
    let { garantia, cabecera } = this.props;
    const tipoGarantia = garantia.tipoGarantia;
    let idTrmGarantia = null;
    if (garantia.idTrmGarantia) {
      idTrmGarantia = garantia.idTrmGarantia;
    }
    let trm = (getProp(this.props, 'cabecera.usaTRMTecho') == 'S') ?
      getProp(this.props, 'cabecera.trmTecho', 0) : getProp(this.props, 'cabecera.trmDia', 0);
    if (garantia.trmGarantia) {
      trm = garantia.trmGarantia;
    }
    switch (tipoGarantia) {
      case TIPOS_GARANTIA.BANCARIA:
        garantia = garantia.bancaria;
        break;
      case TIPOS_GARANTIA.PREPAGO:
        garantia = garantia.prepago;
        break;
      case TIPOS_GARANTIA.POLIZA:
        garantia = garantia.poliza;
        break;
    }

    const objetoGarantia = {
      cntgIderegistro: (garantia.cntgIderegistro) ? garantia.cntgIderegistro : null,
      cntgTipo: tipoGarantia,
      cntgFechainicio: garantia.fechaInicial,
      cntgFechafin: garantia.fechaFin,
      cntgPorcentaje: garantia.porcentajeComercializacion,
      cntgNumerodias: garantia.numeroDiasPrepago,
      cntgEmpresaexpide: garantia.expidePoliza,
      cntgTipocontrato: garantia.tipoContrato,
      cntgVlrtrm: trm,
      cntgValorcontrato: cabecera.precioContrato,
      cntgTipprepago: garantia.tipoPrepago,
      cntgVlrgarantia: garantia.precioGarantia,
      cntgVlrfinal: (garantia.precioFinalGarantia || garantia.precioFinalGarantia == 0) ? parseFloat(garantia.precioFinalGarantia) : garantia.precioGarantia,
      detalles: this.obtenerDetalleGarantia(garantia, tipoGarantia),
      cntgFechatrm: garantia.fechaTrm
    };
    return objetoGarantia;
  };

  /**
   * Obtiene el objeto de garantía usando el objeto contrato que viene del registro.
   * @return {Object}
   */
  obtenerGarantiaContrato = (contrato) => {
    if (!contrato.garantia) {
      return { tipoGarantia: contrato.cntTipogarantia };
    }
    let garantia = {
      tipoGarantia: contrato.cntTipogarantia,
      trmGarantia: contrato.garantia.cntgVlrtrm
    };
    let tipoGarantia = null;
    switch (garantia.tipoGarantia) {
      case TIPOS_GARANTIA.BANCARIA:
        tipoGarantia = 'bancaria';
        break;
      case TIPOS_GARANTIA.PREPAGO:
        tipoGarantia = 'prepago';
        break;
      case TIPOS_GARANTIA.POLIZA:
        tipoGarantia = 'poliza';
        break;
    };
    let fechaIni = contrato.garantia.cntgFechainicio;
    fechaIni = moment(fechaIni);
    fechaIni = moment(fechaIni).format("YYYY-MM-DD");
    let fechaFin = contrato.garantia.cntgFechafin;
    fechaFin = moment(fechaFin);
    fechaFin = moment(fechaFin).format("YYYY-MM-DD");
    garantia[tipoGarantia] = {
      precioContrato: contrato.garantia.cntgValorcontrato,
      precioGarantia: contrato.garantia.cntgVlrgarantia,
      fechaInicial: fechaIni,
      fechaFin: fechaFin,
      porcentajeComercializacion: contrato.garantia.cntgPorcentaje,
      numeroDiasPrepago: contrato.garantia.cntgNumerodias,
      tipoPrepago: contrato.garantia.cntgTipprepago,
      expidePoliza: contrato.garantia.cntgEmpresaexpide,
      tipoContrato: contrato.garantia.cntgTipocontrato,
      valorCruceCuentas: contrato.garantia.cruce,
      cntgEstadoreg: contrato.garantia.cntgEstadoreg,
      detalle: contrato.garantia.detalles,
      cntIdecontrato: contrato.garantia.cntIdecontrato,
      cntgVlrtrm: contrato.garantia.cntgVlrtrm,
      cntgIderegistro: contrato.garantia.cntgIderegistro,
      precioFinalGarantia: contrato.garantia.cntgVlrfinal,
      usaPorcentajeContrato: (contrato.cntPorcencomercial > 0) ? true : false,
      fechaTrm: contrato.garantia.cntgFechatrm
    };
    return garantia;
  };

  /**
   * Obtiene la lista de contratos seleccionados...
   * @return {array}
   */
  obtenerListaTipos = () => {
    const { tiposContrato } = this.props.listas;
    return tiposContrato.filter(tipo => tipo.seleccionado).map((tipo) => {
      return {
        uniIdetipocontrato: {
          uniIderegistro: tipo.uniIderegistro
        }
      };
    });
  };

  /**
   * Obtiene la lista de tramos que ha seleccionado el usuario para realizar las operaciones respectivas del contrato.
   * @return {array}
   */
  obtenerListaGlobalTramos = () => {
    const { listaTramosFinal, listaTramos } = this.props.listas;
    if (!Util.validarArreglo(listaTramosFinal)) {
      const listaFiltradaTramos = listaTramos.filter(t => t.seleccionado);
      if (!Util.validarArreglo(listaFiltradaTramos)) {
        return [];
      }
      return listaTramos.filter(tramo => tramo.seleccionado).map((tramo) => {
        return {
          trcaIdetramocargo: {
            trcaIderegistro: (tramo.listaCargos.find(cargo => cargo.seleccionado)).trcaIderegistro
          },
          cntrCargovariable: parseFloat((tramo.listaCargos.find(cargo => cargo.seleccionado)).cntrCargovariable),

        }
      });
    }
    return listaTramosFinal.filter(tramo => tramo.seleccionado).map((tramo) => {
      return {
        trcaIdetramocargo: {
          trcaIderegistro: (tramo.listaCargos.find(cargo => cargo.seleccionado)).trcaIderegistro
        },
        cntrCargovariable: parseFloat((tramo.listaCargos.find(cargo => cargo.seleccionado)).cntrCargovariable),
      }
    });
  };

  /**
   * Obtiene la lista de puntos de salida que ha seleccionado el usuario.
   * @return {array}
  */
  obtenerPuntosSalida = () => {
    const { puntosSalida } = this.props.listas;
    return puntosSalida.filter(p => p.seleccionado).map((puntoSalida) => {
      return {
        ptsaIdesalida: {
          ptsaIderegistro: puntoSalida.ptsaIderegistro,
        },
        cntsCantidadcontratada: puntoSalida.cntsCantidadcontratada,
        cntsPresionentrada: getProp(this.props, 'cabecera.tipoNegocio', '') == 'C' ? puntoSalida.cntsPresionentrada : null,
        uniIdemedidacantidad: { uniIderegistro: puntoSalida.uniIdemedidacantidad },
        uniIdmedidapresion: getProp(this.props, 'cabecera.tipoNegocio', '') == 'C' ? { uniIderegistro: puntoSalida.uniIdmedidapresion } : null
      }
    });
  };

  /**
   * Obtiene la lista de rutas que ha seleccionado el usuario para realizar las operaciones respectivas del contrato.
   * @return {array}
   */
  obtenerListaRutas = () => {
    const { rutas } = this.props.listas;
    return rutas.filter(ruta => ruta.seleccionado).map((ruta) => {
      if (ruta.seleccionado) {
        return {
          uniIderutagnc: {
            uniIderegistro: ruta.uniIderegistro
          },
          uniIdemedida: {
            uniIderegistro: ruta.uniIdemedida
          },
          cntuValor: ruta.cntuValor,
          cntuVlrunitario: ruta.cntuVlrunitario,
          uniIdmedidavlr: {
            uniIderegistro: this.props.cabecera.unidadMedidaPrecio
          }
        }
      }
    });
  };

  /**
   * Obtiene la lista de medidores...
   * @return {array}
   */
  obtenerListaMedidores = () => {
    const { medidores } = this.props.listas;
    return medidores.filter(medidor => medidor.seleccionado).map((medidor) => {
      if (medidor.seleccionado) {
        return {
          mesuIderegistro: medidor.mesuIderegistro,
          mesuPrecio: parseFloat(medidor.mesuPrecio),
          uniIdemedidaprecio: {
            uniIderegistro: this.props.cabecera.unidadMedidaPrecio
          },
          mesuCapacidadmaxima: medidor.mesuCapacidadmaxima,
          uniIdemedida: {
            uniIderegistro: this.props.cabecera.unidadMedida
          }
        };
      }
    });
  };

  /**
   * Verifica la selección actual del usuario es canasta consumo suministro y devuelve los rangos que haya parametrizado el usuario.
   * @param {Object} canasta Datos de la canasta
   */
  obtenerListaCanastaConsumoSuministro = (canasta) => {
    let listaCanasta = [];
    //Verificamos si hay tarifas consumo.
    if (canasta.canastaConsumoSuministro) {
      let listaRangos = canasta.canastaConsumoSuministro.canastaConRutas;
      listaCanasta = listaRangos.map((rango) => {
        return {
          cncTipo: TIPOS_CANASTA.CONSUMO,
          cncValorinicial: rango.rango.inicio,
          cncValorfinal: rango.rango.fin,
          cncPorcentaje: rango.porcentaje,
          cncIderegistro: rango.cncIderegistro,
          detalles: this.obtenerListaValores(rango),
        };
      });
    }
    return listaCanasta;
  };

  /**
   * Obtiene la lista de canasta cuando el tipo de servicio es suministro...
   * @param {Object} canasta Datos de la canasta
   * @return {Array}
   */
  obtenerListaCanastaSuministro = (canasta) => {
    return this.obtenerListaCanastaConsumoSuministro(canasta);
  };

  /**
   * Recibe la lista de valores(rutas) y retorna el arreglo en el formato que se debe enviar para guardar.
   * @param {Object} rango Datos del rango
   * @returns {Array}
   */
  obtenerListaValores = (rango) => {
    let listaValores = [];
    for (let index = 0; index < rango.rutas.length; index++) {
      const element = rango.rutas[index];
      listaValores.push({
        cncvIderegistro: (element.cncvIderegistro) ? element.cncvIderegistro : null,
        cncvValor: (element.valor) ? parseFloat(element.valor) : element.cargos.cntrCargovariable,
        uniIdemedida: {
          uniIderegistro: this.props.cabecera.unidadMedida
        },
        uniIderuta: {
          uniIderegistro: (element.uniIderegistro) ? element.uniIderegistro : null
        },
        trcaIdetramocargo: {
          trcaIderegistro: (element.trmIderegistro) ? element.cargos.trcaIderegistro : null,
          trmIderegistro: {
            trmIderegistro: (element.trmIderegistro) ? element.trmIderegistro : null
          }
        },
        mesuIderegistro: {
          mesuIderegistro: (element.mesuIderegistro) ? element.mesuIderegistro : null
        }
      })
    }
    return listaValores;
  };

  /**
   * Obtiene los rangos que se registraron para la canasta tarifaria.
   * @return {Array}
   */
  obtenerCanastaTarifaria = () => {
    const { tipoCalculo } = this.props;
    //Valida si el tipo de calculo seleccionado no es canasta para retornar nulo.
    if (tipoCalculo.tipoCalculo !== TIPOS_CACULO_PRECIO.CANASTA) {
      return null;
    }
    return this.obtenerListaCanastaSuministro(tipoCalculo);
  };

  /**
   * Obtener clase de contrato.
   * @return {Number}
   */
  obtenerClaseContrato = () => {
    const tiposContratoSeleccionados = this.obtenerTiposContratoSeleccionados();
    if (tiposContratoSeleccionados.findIndex(tc => (tc.uniPropiedad) && ((tc.uniPropiedad.tipocontrato === 'T') || tc.uniPropiedad.tipocontrato === 'S')) >= 0) {
      const claseContrato = getProp(this.props, 'cabecera.claseContrato', null);
      if (!claseContrato) {
        return null;
      }
      return {
        uniIderegistro: claseContrato
      };
    } else {
      return null;
    }
  };

  /**
   * Método encargado de consultar la TRM para la fecha seleccionada
   * @param {String} fecha Fecha seleccionada
   */
  consultarTrmDia = async (fecha) => {
    let nuevoCambio = {};
    axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_TRM, { criterio: '', fecha: fecha })
      .then(respuesta => {
        nuevoCambio.trmDia = (respuesta.data.codigo > 0) ? respuesta.data.datos.covlValor : 0;
        nuevoCambio.idTrm = (respuesta.data.codigo > 0) ? respuesta.data.datos.covlIderegistro : null;
        this.props.actualizarCabeceraContrato(nuevoCambio);
      });
  };

  /**
   * Obtiene la cabecera del contrato.
   * @param {Object} contrato Datos del contrato
   * @return {Object}
   */
  obtenerCabeceraDelContrato = (contrato) => {
    return {
      idContrato: contrato.cntIderegistro,
      versionContrato: contrato.cntVersion,
      numeroContrato: contrato.cntNumero,
      capacidadC2: contrato.cntCapacidad,
      unidadMedidaC2: contrato.uniIdemedidacapacidad,
      agenteTercero: {
        terIderegistro: contrato.terIdeagente.terIderegistro,
        terNomcompleto: contrato.terIdeagente.terNomcompleto,
      },
      tercero: contrato.terIdeagente.terNomcompleto,
      tipoNegocio: contrato.cntTiponegocio,
      tipoUso: (contrato.uniIdetipouso) ? contrato.uniIdetipouso.uniIderegistro : null,
      tipoMercado: (contrato.uniIdetipomercado) ? contrato.uniIdetipomercado.uniIderegistro : null,
      claseContrato: getProp(contrato, 'uniIdeclasecontrato.uniIderegistro', null),
      fechaInicio: contrato.cntFechainicio,
      fechaFin: contrato.cntFechafin,
      fechaNegociacion: contrato.cntFecnegocio,
      fuenteDistribucion: (contrato.uniIdefuente) ? contrato.uniIdefuente.uniIderegistro : null,
      takeOrPay: (contrato.cntTakeorpay === 'S') ? 'true' : 'false',
      topGrupal: (contrato.tpgIdetopgrupal) ? contrato.tpgIdetopgrupal.tpgIderegistro : null,
      firmeza: (contrato.cntFirmeza),
      tipoCalculo: {
        tipoCalculo: contrato.cntTipoprecio
      },
      precioContrato: contrato.cntPrecio,
      unidadMedida: getProp(contrato, 'uniIdemedidacontratada.uniIderegistro', null),
      unidadMedidaPrecio: getProp(contrato, 'uniIdemedidaprecio.uniIderegistro', null),
      precioContratoPesos: contrato.cntPreciopesos,
      valorPesos: contrato.cntPreciopesos,
      porcentajeComercializacion: (contrato.cntPorcencomercial == null) ? 0 : contrato.cntPorcencomercial,
      modalidadContrato: contrato.uniIdemodalidadcontrato.uniIderegistro,
      codigoGestor: contrato.cntCodigogestor,
      cantidadContratada: contrato.cntCantidadcontratada,
      periodoCantidadContratada: contrato.cntPeriodo,
      tipoGarantia: contrato.cntTipogarantia,
      aporteGNV: contrato.cntAportegnv,
      valorGNV: contrato.cntValoraportegnv,
      usaTRMTecho: contrato.cntUsatrmtecho,
      trmTecho: contrato.cntTrmtecho,
      estadoContrato: contrato.uniIdeestado.uniPropiedad.estado,
    };
  };

  /**
   * Obtendrá los datos de la canasta seleccionada.
   * @param {Object} contrato Datos del contrato
   * @return {Object}
   */
  obtenerTipoCalculoContrato = (contrato) => {
    let tipoCalculo = {
      tipoCalculo: contrato.cntTipocalculoprecio,
      tipoServicio: contrato.cntTiposervicio,
    };
    const listaCanasta = contrato.listaCanastaTarifaria;
    if (!Util.validarArreglo(listaCanasta)) {
      return tipoCalculo;
    }
    tipoCalculo.canastaConsumoSuministro = this.obtenerTarifaConsumo(listaCanasta);
    tipoCalculo.canastaConsumoSuministro.tipoLiquidacion = contrato.cntLiquidacioncanasta;
    return tipoCalculo;
  };

  /**
   * Obtiene la lista de documentos del contrato...
   * @param {Object} contrato Datos del contrato
   * @return {Array}
   */
  obtenerDocumentoContrato = (contrato) => {
    if (!Array.isArray(contrato.listaDocumentos)) {
      return [];
    }
    return contrato.listaDocumentos.map(documento => {
      return {
        archivo: { name: documento.cntdNombre },
        fechaExpedicion: documento.cntdFechaexpedicion,
        fechaFin: documento.cntdFechafinal,
        fechaInicio: documento.cntdFechainicio,
        id: documento.cntdIdearchivo,
        nombre: documento.cntdNombre,
        tipo: documento.cntdIde,
        tipoDocumento: documento.uniIdetipodocumento
      };
    });
  };

  /**
   * Obtiene la lista de tarifas de consumo.
   * @param {Array} listaCanasta Lista de canastas
   * @return {Array}
   */
  obtenerTarifaConsumo = (listaCanasta) => {
    const listaConRutas = this.obtenerTarifaHorariaConRutasConsumo(listaCanasta);
    return {
      canastaConRutas: listaConRutas,
      intervalos: listaConRutas.length
    }
  };

  /**
   * Método encargado de obtener las listas de cada rango de la canasta
   * @param {Object} item Valores del rango
   */
  obtenerValoresCanasta = (item) => {
    let { rutas, medidores, listaTramos } = this.props.listas;
    let nombre = '';
    let listaFinal = [];
    for (let index = 0; index < item.listaValores.length; index++) {
      const valor = item.listaValores[index];
      let medidor = medidores.find(m => m.mesuIderegistro == valor.mesuIderegistro);
      let ruta = rutas.find(r => r.uniIderegistro == valor.uniIderuta);
      let tramo = listaTramos.find(t => t.trmIderegistro == valor.trmIderegistro);
      if (medidor) {
        nombre = medidor.mesuNombre + ' ' + 'Medidor';
        listaFinal.push({
          cncIdecanasta: valor.cncIdecanasta,
          cncvIderegistro: valor.cncvIderegistro,
          mesuIderegistro: valor.mesuIderegistro,
          mesuCapacidadmaxima: medidor.mesuCapacidadmaxima,
          seleccionado: true,
          idMedidorRango: Util.generarIdControl('idMedidorRango_'),
          valor: valor.cncvValor,
          nombre: nombre,
          uniPropiedad: medidor.uniPropiedad
        });
        continue;
      }
      if (ruta) {
        nombre = ruta.uniNombre1 + ' ' + 'Ruta';
        listaFinal.push({
          cncIdecanasta: valor.cncIdecanasta,
          cncvIderegistro: valor.cncvIderegistro,
          idRutaRango: Util.generarIdControl('idRutaControl'),
          uniIderegistro: valor.uniIderuta,
          cntuValor: ruta.cntuValor,
          seleccionado: true,
          valor: valor.cncvValor,
          nombre: nombre,
          uniPropiedad: ruta.uniPropiedad
        });
        continue;
      }
      if (tramo) {
        let cargos = tramo.listaCargos.find(lc => lc.seleccionado);
        cargos.cntrCargovariable = valor.cncvValor;
        nombre = tramo.trmNombre + ' ' + 'Tramo';
        listaFinal.push({
          cncIdecanasta: valor.cncIdecanasta,
          cncvIderegistro: valor.cncvIderegistro,
          idTramoRango: Util.generarIdControl('idTramoRango_'),
          trmIderegistro: valor.trmIderegistro,
          seleccionado: true,
          nombre: nombre,
          listaCargos: tramo.listaCargos,
          cargos: { ...cargos },
        });
        continue;
      }
      listaFinal.push({
        cncIdecanasta: valor.cncIdecanasta,
        cncvIderegistro: valor.cncvIderegistro,
        idRangoSin: Util.generarIdControl('idRangoSin_'),
        seleccionado: true,
        valor: valor.cncvValor,
        nombre: 'Valores skids ATR o GNCV'
      });
    }
    return listaFinal;
  }

  /**
  * Obtiene la lista de items de tarifas horarias con rutas.
  * @param {Array} listaCanasta Lista de canastas
  * @return {Array}
  */
  obtenerTarifaHorariaConRutasConsumo = (listaCanasta) => {
    return listaCanasta.map(item => {
      return {
        idIntervaloSinRuta: Util.generarIdControl('CanastaConRuta_'),
        idRangoConRuta: Util.generarIdControl('idRangoConRuta'),
        porcentaje: item.cncPorcentaje,
        valor: item.listaValores[0].cncvValor,
        rango: {
          inicio: item.cncValorinicial,
          fin: item.cncValorfinal,
        },
        cncIderegistro: item.cncIderegistro,
        rutas: this.obtenerValoresCanasta(item)
      };
    });
  };

  /**
   * Método encargado de obtener los tramos dada una ruta y una lista
   * @param {Number} idRuta Identificador de la ruta
   * @param {Array} listaValores Valores de la canasta
   */
  obtenerTramosPorRuta = (idRuta, listaValores) => {
    return listaValores.filter(valor => valor.uniIderuta === idRuta).map(valor => {
      if (valor.uniIderuta === idRuta) {
        //Buscamos el tramo...
        let tramo = this.obtenerTramo(valor.trmIderegistro);
        if (tramo) {
          tramo.idTramoRango = Util.generarIdControl('idTramoRango');
          tramo.unidadMedida = valor.uniIdemedida;
          tramo.valorPorcentaje = valor.cncvPorcentaje;
          return tramo;
        }
      }
    });
  };

  /**
   * Obtiene la lista de items de tarifas horarias sin rutas.
   * @param {Array} listaValores Valores de la canasta
   * @return {array}
   */
  obtenerTarifaHorariasSinRutas = (listaCanasta) => {
    return listaCanasta.filter((item) => {
      if (item.cncTipo === TIPOS_CANASTA.HORARIA && !item.cntUsaruta) {
        return item;
      }
    }).map(item => {
      return {
        horaFin: item.cncHorafin,
        idRangoSinRuta: Util.generarIdControl('canastaSinRuta_'),
        rango: {
          horaInicio: item.cncHorainicio, horaFin: item.cncHorafin
        },
        ultimaHora: item.cncHorafin,
        unidadMedida: item.listaValores[0].uniIdemedida,
        porcentajeRango: item.listaValores[0].cncvPorcentaje,
        valorRango: item.listaValores[0].cncvValor
      };
    });
  };

  /**
   * Obtiene un tramo...
   * @param {Number} idTramo Identificador del tramo
   * @return {object}
   */
  obtenerTramo = (idTramo) => {
    if ((typeof idTramo === 'string') || (typeof idTramo === 'number')) {
      const i = this.props.listas.listaTramos.findIndex(t => t.trmIderegistro == idTramo);
      const tramo = (i >= 0) ? this.props.listas.listaTramos[i] : null;
      return tramo;
    }
    return null;
  };

  /**
  * Obtiene el valor cargo de un tramo.
  * @param {Object} tramo Datos del tramo
  * @param {String} tipo Tipo del cargo
  * @return {number}
  */
  obtenerValorCargo = (tramo, tipo) => {
    if (!tramo) {
      return -1;
    }

    //Verificamos el cargo seleccionado...
    if (typeof tramo === 'string' || typeof tramo === 'number') {
      tramo = this.props.listas.listaTramos.find(t => t.trmIderegistro == tramo);
    }

    if (!Util.validarArreglo(tramo.listaCargos)) {
      return -1;
    }

    var cargoSeleccionado = tramo.listaCargos.find(cargo => cargo.seleccionado);
    switch (tipo) {
      case 'V':
        return cargoSeleccionado.cntrCargovariable;
      case 'F':
        return cargoSeleccionado.trcaCargofijo;
      case 'A':
        return cargoSeleccionado.trcaCargoaoym;
    }
  };

  /**
   * Obtiene la lista de tramos seleccionados.
   * @return {array}
   */
  obtenerTramosSeleccionados = () => {
    return this.props.listas.listaTramos.filter((t) => {
      if (t.seleccionado) { t.idTramo = Util.generarIdControl('rangoTramo'); return t; }
    });
  };

  /**
   * Calcula el precio del contrato entre otros valores necesarios para garantias.
   * @return {Object}
   */
  calcularPrecioContrato = () => {
    const tramosSeleccionados = this.obtenerTramosSeleccionados();
    if (tramosSeleccionados.length == 0) {
      return;
    }
    let valores = {
      precioContrato: 0,
      valorCargos: {
        variable: 0,
        fijo: 0,
        aom: 0
      }
    };
    for (let i = 0; i < tramosSeleccionados.length; i++) {
      const tramo = tramosSeleccionados[i];
      let valorVariable = tramo.cargoVariable ? tramo.cargoVariable : this.obtenerValorCargo(tramo, 'V');
      let ValorFijo = this.obtenerValorCargo(tramo, 'F');
      let valorAOM = this.obtenerValorCargo(tramo, 'A');
      valores.valorCargos.variable += valorVariable;
      valores.valorCargos.fijo += ValorFijo;
      valores.valorCargos.aom += valorAOM;
      valores.precioContrato += (valorVariable + ValorFijo + valorAOM);
    }

    this.actualizarCabeceraRedux({ precioContratoTramo: valores.precioContrato, valorCargos: valores.valorCargos });
  };

  /**
   * Busca las unidades de medida para los puntos de salida seleccionados y los fija...
   * @param {Array} listaPuntoSalida Lista de los puntos de salida seleccionado
   */
  parsearUnidadesMedidaPuntosSalida = (listaPuntosSalida) => {
    return listaPuntosSalida.map(p => {
      if (p.seleccionado == true) {
        p.uniIdemedidacantidad = p.uniIdemedidacantidad
      }
      return p;
    });
  };

  /**
     * Método encargado de obtener la sumatoria de la cantidad contratada de medidores
     * @param {Object} tipoContrato Tipo de contrato seleccionado
     */
  obtenerSumaMedidores = (tipoContrato) => {
    let suma = 0;
    const unidad = this.props.listas.cantidad.find(c => c.uniIderegistro == this.props.cabecera.unidadMedida);
    const nombre = (unidad) ? unidad.uniNombre1 : '';
    const { medidores } = this.props.listas;
    let estadoPeticiones = true;
    for (let i = 0; i < medidores.length; i++) {
      if (!medidores[i].seleccionado) {
        continue;
      }
      if (!isNaN(medidores[i].mesuCapacidadmaximaCalculo)) {
        suma += parseFloat(medidores[i].mesuCapacidadmaximaCalculo);
        continue;
      }
      estadoPeticiones = false;
      break;
    }
    if (estadoPeticiones == false) {
      return;
    }
    const indexSuministro = this.props.cabecera.listaCantidad ?
      this.props.cabecera.listaCantidad.findIndex(lista => lista.tipoContrato == getProp(tipoContrato, 'uniPropiedad.tipocontrato', null)) : -1;
    if (indexSuministro >= 0) {
      let lista = [...this.props.cabecera.listaCantidad];
      lista[indexSuministro].cantidadContratada = suma;
      this.props.actualizarCabeceraContrato({
        listaCantidad: lista
      });
      return;
    }
    this.props.actualizarCabeceraContrato({
      listaCantidad: [...this.props.cabecera.listaCantidad,
      {
        tipoContrato: getProp(tipoContrato, 'uniPropiedad.tipocontrato', null),
        cantidadContratada: suma,
        unidadMedida: nombre,
        nombre: getProp(tipoContrato, 'uniNombre1', null)
      }]
    });
  }

  /**
   * Método encargado de invocar al conversor de unidades
   * @param {Object} medidor Punto de salida al cual se le realizara la conversion
   * @param {String} tipoContrato Tipo de contrato seleccionado
   */
  convertirMedidor = (medidor, tipoContrato) => {
    let valor = 0;
    axios.post(RUTAS_API.PARAMETRIZACION.CONVERSOR.CONVERTIR,
      { idUnidadOrigen: medidor.uniIdemedida.uniIderegistro, idUnidadDestino: this.props.cabecera.unidadMedida, valor: parseFloat(medidor.mesuCapacidadmaxima) })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          valor = respuesta.data.datos;
        }
        medidor.mesuCapacidadmaximaCalculo = valor;
        this.obtenerSumaMedidores(tipoContrato);
      });
  }

  /**
   * Método encargado de obtener el total de los medidores
   * @param {Object} tipoContrato Tipo de contrato seleccionado
   * @returns {Float}
   */
  obtenerTotalMedidores = (tipoContrato) => {
    const { medidores } = this.props.listas;
    let suma = 0;
    if (!Util.validarArreglo(medidores)) {
      return;
    }
    for (let index = 0; index < medidores.length; index++) {
      const medidor = medidores[index];
      if (medidor.seleccionado) {
        this.convertirMedidor(medidor, tipoContrato);
      }
    }

    return suma;
  }

  /**
   * Método encargado de obtener la sumatoria de la cantidad contratada por rutas gnc o conexión
   * @param {Object} tipoContrato Tipo de contrato seleccionado
   */
  obtenerSumaRutas = (tipoContrato) => {
    let suma = 0;
    const unidad = this.props.listas.cantidad.find(c => c.uniIderegistro == this.props.cabecera.unidadMedida);
    const nombre = (unidad) ? unidad.uniNombre1 : '';
    const { rutas } = this.props.listas;
    let estadoPeticiones = true;
    for (let i = 0; i < rutas.length; i++) {
      if (!rutas[i].seleccionado) {
        continue;
      }
      if (!isNaN(rutas[i].cntuValorCalculo)) {
        suma += parseFloat(rutas[i].cntuValorCalculo);
        continue;
      }
      estadoPeticiones = false;
      break;
    }
    if (estadoPeticiones == false) {
      return;
    }
    const index = this.props.cabecera.listaCantidad ?
      this.props.cabecera.listaCantidad.findIndex(lista => lista.tipoContrato == getProp(tipoContrato, 'uniPropiedad.tipocontrato', null)) : -1;
    if (index >= 0) {
      let lista = [...this.props.cabecera.listaCantidad];
      lista[index].cantidadContratada = suma;
      this.props.actualizarCabeceraContrato({
        listaCantidad: lista
      });
      return;
    }
    this.props.actualizarCabeceraContrato({
      listaCantidad: [...this.props.cabecera.listaCantidad,
      {
        tipoContrato: getProp(tipoContrato, 'uniPropiedad.tipocontrato', null),
        cantidadContratada: suma,
        unidadMedida: nombre,
        nombre: getProp(tipoContrato, 'uniNombre1', null)
      }]
    });
  }

  /**
   *
   * @param {Object} ruta
   * @param {String} tipoContrato
   */
  convertirRutas = (ruta, tipoContrato) => {
    let valor = 0;
    axios.post(RUTAS_API.PARAMETRIZACION.CONVERSOR.CONVERTIR,
      { idUnidadOrigen: ruta.uniIdemedida, idUnidadDestino: this.props.cabecera.unidadMedida, valor: parseFloat(ruta.cntuValor) })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          valor = respuesta.data.datos
        }
        ruta.cntuValorCalculo = valor;
        this.obtenerSumaRutas(tipoContrato);
      });
  }

  /**
   * Método encargado de obtener el total de las rutas segun el tipo de contrato
   * @param {String} tipo Tipo de las rutas
   * @returns {Float}
   */
  obtenerTotalRutas = (tipoContrato, tipo = null) => {
    const { rutas } = this.props.listas;
    let suma = 0;
    let listaFiltrada = rutas.filter(r => r.seleccionado && r.uniPropiedad.tipo === tipo);
    if (!Util.validarArreglo(listaFiltrada)) {
      return;
    }
    for (let index = 0; index < listaFiltrada.length; index++) {
      const ruta = listaFiltrada[index];
      if (ruta.seleccionado) {
        this.convertirRutas(ruta, tipoContrato);
      }
    }
    return suma;
  }

  /**
   * Método encargado de obtener la cantidad contratada por puntos de salida seleccionado
   * @param {Object} tipoContrato Tipo de contrato seleccionado
   */
  obtenerSumaPuntosSalida = (tipoContrato, listaPuntoSalida) => {
    let suma = 0;
    const unidad = this.props.listas.cantidad.find(c => c.uniIderegistro == this.props.cabecera.unidadMedida);
    const nombre = (unidad) ? unidad.uniNombre1 : '';
    const { puntosSalida } = this.props.listas;
    let estadoPeticiones = true;
    if (Util.validarArreglo(listaPuntoSalida)) {
      for (let i = 0; i < listaPuntoSalida.length; i++) {
        if (!listaPuntoSalida[i].seleccionado) {
          continue;
        }
        if (!isNaN(listaPuntoSalida[i].cntsCantidadcontratadaCalculo)) {
          suma += parseFloat(listaPuntoSalida[i].cntsCantidadcontratadaCalculo);
          continue;
        }
        estadoPeticiones = false;
        break;
      }
    } else {
      for (let i = 0; i < puntosSalida.length; i++) {
        if (!puntosSalida[i].seleccionado) {
          continue;
        }
        if (!isNaN(puntosSalida[i].cntsCantidadcontratadaCalculo)) {
          suma += parseFloat(puntosSalida[i].cntsCantidadcontratadaCalculo);
          continue;
        }
        estadoPeticiones = false;
        break;
      }
    }

    if (estadoPeticiones == false) {
      return;
    }
    const indexTransporte = this.props.cabecera.listaCantidad ?
      this.props.cabecera.listaCantidad.findIndex(lista => lista.tipoContrato == getProp(tipoContrato, 'uniPropiedad.tipocontrato', null)) : -1;
    if (indexTransporte >= 0) {
      let lista = [...this.props.cabecera.listaCantidad];
      lista[indexTransporte].cantidadContratada = suma;
      if (Util.validarArreglo(listaPuntoSalida)) {
        this.props.actualizarListaContratos({
          puntosSalida: listaPuntoSalida
        });
      }
      this.props.actualizarCabeceraContrato({
        listaCantidad: lista,
      });
      return;
    }
    this.props.actualizarCabeceraContrato({
      listaCantidad: [...this.props.cabecera.listaCantidad,
      {
        tipoContrato: getProp(tipoContrato, 'uniPropiedad.tipocontrato', null),
        cantidadContratada: suma,
        unidadMedida: nombre,
        nombre: getProp(tipoContrato, 'uniNombre1', null)
      }]
    });
    if (Util.validarArreglo(listaPuntoSalida)) {
      this.props.actualizarListaContratos({
        puntosSalida: listaPuntoSalida
      });
    }
  }

  /**
   * Método encargado de invocar al conversor de unidades
   * @param {Object} punto Punto de salida al cual se le realizara la conversion
   * @param {String} tipoContrato Tipo de contrato seleccionado
   */
  convertir = (punto, tipoContrato, listaPuntoSalida) => {
    let valor = 0;
    axios.post(RUTAS_API.PARAMETRIZACION.CONVERSOR.CONVERTIR,
      { idUnidadOrigen: punto.uniIdemedidacantidad, idUnidadDestino: this.props.cabecera.unidadMedida, valor: parseFloat(punto.cntsCantidadcontratada) })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          valor = respuesta.data.datos;
        }
        punto.cntsCantidadcontratadaCalculo = valor;
        this.obtenerSumaPuntosSalida(tipoContrato, listaPuntoSalida);
      });
  }

  /**
   * Método encargado de obtener la suma de las cantidades contradas de los puntos de salida
   * @param {Object} tipoContrato Tipo de contrato seleccionado
   * @returns {Float}
   */
  obtenerTotalPuntosSalida = (tipoContrato, listaPuntoSalida) => {
    const { puntosSalida } = this.props.listas;
    if (!Util.validarArreglo(puntosSalida)) {
      return;
    }
    if (Util.validarArreglo(listaPuntoSalida)) {
      for (let index = 0; index < listaPuntoSalida.length; index++) {
        const punto = listaPuntoSalida[index];
        if (punto.seleccionado) {
          this.convertir(punto, tipoContrato, listaPuntoSalida);
        }
      }
    } else {
      for (let index = 0; index < puntosSalida.length; index++) {
        const punto = puntosSalida[index];
        if (punto.seleccionado) {
          this.convertir(punto, tipoContrato);
        }
      }
    }

  }

  /**
   * Método encargado de obtener la lista de cantidades contratadas
   * @returns {Array}
   */
  obtenerLista = (listaPuntoSalida) => {
    const { tiposContrato, cantidad } = this.props.listas;
    const unidad = cantidad.find(c => c.uniIderegistro == this.props.cabecera.unidadMedida);
    const nombre = (unidad) ? unidad.uniNombre1 : '';
    const tiposSeleccionados = tiposContrato.filter(t => t.seleccionado);
    const listaCantidad = [];
    tiposSeleccionados.forEach(t => {
      const repetido = listaCantidad.filter(r =>
        getProp(r, 'tipoContrato', null) == 'GNV'
        || getProp(r, 'tipoContrato', null) == 'ATR'
        || getProp(r, 'tipoContrato', null) == 'GNCV');
      if (repetido.length == 0) {
        const tipo = tiposSeleccionados.filter(r =>
          getProp(t, 'uniPropiedad.tipocontrato', null) == 'GNV'
          || getProp(t, 'uniPropiedad.tipocontrato', null) == 'ATR'
          || getProp(t, 'uniPropiedad.tipocontrato', null) == 'GNCV');
        if (tipo.length > 0) {
          if (this.props.cabecera.cantidadContratada >= 0) {
            listaCantidad.push({
              cantidadContratada: this.props.cabecera.cantidadContratada,
              unidadMedida: nombre,
              tipoContrato: getProp(t, 'uniPropiedad.tipocontrato', null),
              nombre: getProp(t, 'uniNombre1', null)
            });
          }
        }
      }
      if (getProp(t, 'uniPropiedad.tipocontrato', null) == 'S') {
        this.obtenerTotalMedidores(t);
      }
      if (getProp(t, 'uniPropiedad.tipocontrato', null) == 'T') {
        this.obtenerTotalPuntosSalida(t, listaPuntoSalida);
      }
      if (getProp(t, 'uniPropiedad.tipocontrato', null) == 'CNX') {
        this.obtenerTotalRutas(t, 'C',);
      }
      if (getProp(t, 'uniPropiedad.tipocontrato', null) == 'GNC') {
        this.obtenerTotalRutas(t, 'G',);
      }
    });
    return listaCantidad;
  }

  /**
   * Mostrará el contrato en el formulario.
   * @param {Object} contrato Datos del contrato
   */
  mostrarObjeto = async (contrato, listaPuntos) => {
    let cabecera = this.obtenerCabeceraDelContrato(contrato);
    let puntosSalidaEnviar = [...listaPuntos];
    const garantia = this.obtenerGarantiaContrato(contrato);
    const documentos = this.obtenerDocumentoContrato(contrato);
    this.props.actualizarCabeceraContrato(cabecera);
    this.props.actualizarGarantia(garantia);
    this.props.actualizarDocumentosContrato({ adjuntos: documentos });
    await this.props.actualizarListaContratos({
      tiposContrato: Util.validarArreglo(contrato.listaTipos) ? [...contrato.listaTipos] : [],
      listaTramos: Util.validarArreglo(contrato.listaTramos) ? [...contrato.listaTramos] : [],
      puntosSalida: Util.validarArreglo(contrato.listaPuntoSalida) ? [...contrato.listaPuntoSalida] : [],
      rutas: Util.validarArreglo(contrato.listaRutas) ? [...contrato.listaRutas] : [],
      rutasGNC: Util.validarArreglo(contrato.listaRutas) ? [...contrato.listaRutas] : [],
      medidores: Util.validarArreglo(contrato.listaMedidores) ? [...contrato.listaMedidores] : []
    });
    const listaCantidad = await this.obtenerLista(puntosSalidaEnviar);
    cabecera.listaCantidad = listaCantidad;
    this.props.actualizarCabeceraContrato(cabecera);
    if (this.refPuntosSalida) {
      this.refPuntosSalida.actualizarPuntosSalida();
    }
    if (this.validarRequeridosPrograma()) {
      this.consultarTrmDia(contrato.cntFecnegocio);
    }
    const tipoCalculo = this.obtenerTipoCalculoContrato(contrato);
    this.props.actualizarTipoCalculoContrato(tipoCalculo);
    this.calcularPrecioContrato();
  };

  /**
   * Obtiene el objeto que se va a guardar..
   * @returns {Boolean}
   */
  obtenerEntidadGuardar = () => {
    const { cabecera, tipoCalculo } = this.props;
    let garantia = this.props.garantia;

    const tipoGarantia = garantia.tipoGarantia;
    const tiposContratosSelecccionados = getProp(this.props, 'listas.tiposContrato').filter(tipoContrato => tipoContrato.seleccionado);
    if (Util.validarArreglo(tiposContratosSelecccionados)) {
      const s = tiposContratosSelecccionados.find(tipoContrato => tipoContrato.uniPropiedad.tipocontrato === 'S');
      if (s != null) {
        const medidores = this.props.listas.medidores.filter(m => m.seleccionado);
        if (!Util.validarArreglo(medidores)) {
          toast.error('Debe seleccionar al menos un medidor');
          return null;
        }
      }
    }
    switch (tipoGarantia) {
      case TIPOS_GARANTIA.BANCARIA:
        garantia = garantia.bancaria;
        break;
      case TIPOS_GARANTIA.PREPAGO:
        garantia = garantia.prepago;
        break;
      case TIPOS_GARANTIA.POLIZA:
        garantia = garantia.poliza;
        break;
    }
    const entidadGuardar = {
      cntCapacidad: cabecera.capacidadC2,
      uniIdemedidacapacidad: {
        uniIderegistro: (cabecera.unidadMedidaC2) ? cabecera.unidadMedidaC2 : null
      },
      cntNumero: cabecera.numeroContrato,
      terIdeagente: {
        terIderegistro: cabecera.agenteTercero.terIderegistro
      },
      cntTiponegocio: cabecera.tipoNegocio,
      uniIdetipouso: {
        uniIderegistro: cabecera.tipoUso
      },
      uniIdetipomercado: (cabecera.tipoMercado) ? {
        uniIderegistro: cabecera.tipoMercado
      } : null,
      uniIdeclasecontrato: this.obtenerClaseContrato(),
      cntFechainicio: cabecera.fechaInicio,
      cntFechafin: cabecera.fechaFin,
      cntFecnegocio: cabecera.fechaNegociacion,
      uniIdefuente: (cabecera.fuenteDistribucion > 0) ? {
        uniIderegistro: cabecera.fuenteDistribucion
      } : null,
      cntTakeorpay: (cabecera.takeOrPay === 'true') ? 'S' : 'N',
      tpgIdetopgrupal: (cabecera.topGrupal) ? {
        tpgIderegistro: (cabecera.topGrupal == '-1') ? null : cabecera.topGrupal
      } : null,
      cntFirmeza: cabecera.firmeza,
      cntTipoprecio: tipoCalculo.tipoCalculo,
      cntPrecio: cabecera.precioContrato,
      uniIdemedidaprecio: {
        uniIderegistro: getProp(cabecera, 'unidadMedidaPrecio', null)
      },
      cntPreciopesos: cabecera.precioContrato,
      cntPorcencomercial: cabecera.porcentajeComercializacion,
      uniIdemodalidadcontrato: {
        uniIderegistro: (cabecera.modalidadContrato) ? cabecera.modalidadContrato : null
      },
      cntCodigogestor: cabecera.codigoGestor,
      cntCantidadcontratada: cabecera.cantidadContratada,
      uniIdemedidacontratada: {
        uniIderegistro: cabecera.unidadMedida
      },
      covlIdetrminicial: {
        covlIderegistro: cabecera.idTrm
      },
      cntVersion: 1,
      cntPeriodo: cabecera.periodoCantidadContratada,
      cntTipocalculoprecio: tipoCalculo.tipoCalculo,
      cntTiposervicio: tipoCalculo.tipoServicio,
      cntTipogarantia: tipoGarantia,
      cntAportegnv: cabecera.aporteGNV,//Crear campo...
      cntUsatrmtecho: cabecera.usaTRMTecho,
      cntTrmtecho: cabecera.trmTecho,
      cntValoraportegnv: cabecera.valorAporteGNV,
      cntLiquidacioncanasta: (tipoCalculo.tipoCalculo == 'C') ? tipoCalculo.canastaConsumoSuministro.tipoLiquidacion : '',//Craer campo...
      garantia: this.obtenerGarantia(), //Verificar con Leo el tema de los dos campos que no conocía para el back. Verificar si la selección de tipo de contrato es múltiple.
      listaDocumentos: this.obtenerListaDocumentos(),
      listaTipos: this.obtenerListaTipos(),
      listaTramos: this.obtenerListaGlobalTramos(),
      listaPuntosSalida: this.obtenerPuntosSalida(),
      listaRutas: this.obtenerListaRutas(), //Verificar y agregar módulo selección rutas si es neceario.
      listaMedidores: this.obtenerListaMedidores(),//Verificar y agregar módulo si es necario.
      listaCanastaTarifaria: this.obtenerCanastaTarifaria()
    };

    return limpiarJson(entidadGuardar);
  };

  /**
   * @method
   * Método encargado de mostrar la alerta para guardar el cruce
   * @param {String} estado Estado al que se cambiara el cruce
   */
  mostrarAlertaConfirmar = () => {
    this.props.mostrarAlerta('Confirmar', 'Se guardo correctamente el contrato', [
      { clase: 'btn btn-primary', callback: this.limpiarFormulario, texto: 'Aceptar' },
    ]);
  }

  /**
   * Método encargado de eliminar el medidor por idRegistro
   * @param {Number} idMedidor Identificador del medidor.
   */
  eliminarMedidoresGuardar = (idMedidor) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_MEDIDOR_SUMINISTRO.ELIMINAR, { idMedidor: idMedidor });
  }

  /**
   * Envia la información al servidor para guardar el contrato.
   * @returns {Boolean}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    const listaMedidores = getProp(this.props, 'listas.medidoresEliminados', []);
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    let entidadGuardar = this.obtenerEntidadGuardar();
    if (entidadGuardar == null) {
      return;
    }
    if (this.props.cabecera.idContrato) {
      entidadGuardar.cntIderegistro = this.props.cabecera.idContrato;
      entidadGuardar.cntVersion = this.props.cabecera.versionContrato;
    }

    if (Util.validarArreglo(listaMedidores)) {
      for (let index = 0; index < listaMedidores.length; index++) {
        const medidor = listaMedidores[index];
        this.eliminarMedidoresGuardar(medidor.mesuIderegistro);
      }
    }

    //Enviamos el objeto para guardar...
    axios.post(RUTAS_API.CONTRATOS.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.mostrarAlertaConfirmar();
        }
      });
  };

  /**
   * Método encargado de redireccionar a la interfaz de consulta de contratos
   */
  consultarEntidad = () => {
    this.props.history.push({
      pathname: RUTAS_VISTA.CONSULTA_CONTRATOS.url,
      state: {
        interfazGestion: RUTAS_VISTA.GESTION_CONTRATOS.url,
      }
    });
  };

  /**
   * Método encargado de cargar los datos de un componente externo
   * @param {Object} entidad Datos componente externo
   */
  cargarDatos = (entidad) => {
    this.setState({
      mostrarModalConsulta: false,
      idContrato: entidad.cntIderegistro
    });
  };

  /**
   * Método encargado de validar las consultas requeridas para el cargue del programa
   * @returns {Boolean}
   */
  validarRequeridosPrograma = () => {
    return getProp(this.props, 'listas.consultasTerminadas', false);
  };

  /**
   * Método encargado de renderizar el componente Cabecera del contrato
   * @returns {Component}
   */
  obtenerCabeceraContrato = () => {
    return (
      <RCabeceraContrato
        mostrarProgramaModal={this.props.mostrarProgramaModal}
        trmDia={0}
        editandoContrato={false}
        mostrarAlerta={this.props.mostrarAlerta}
      />
    );
  };

  /**
   * Método encargado de renderizar el componente Calculo del precio
   * @returns {Component}
   */
  obtenerTipoCalculoPrecio = () => {
    return <RCalculoPrecioContrato />;
  };

  /**
   * Método encargado de renderizar el componente Gestion de Documentos
   * @returns {Component}
   */
  obtenerGestionDocumentos = () => {
    return <RGestionDocumentos />;
  };

  /**
   * Método encargado de renderizar el componente Seleccion de garantia
   * @returns {Component}
   */
  obtenerSeleccionTipoGarantias = () => {
    return <RSeleccionTipoGarantia
      tiposGarantia={TIPOS_GARANTIA}
    />;
  };

  /**
   * Obtiene la lista de los tipos de contratos seleccionados por el usuario.
   * @return {array}
   */
  obtenerTiposContratoSeleccionados = () => {
    const listaTiposContrato = getProp(this.props, 'listas.tiposContrato', []);
    const tiposContratoSeleccionados = listaTiposContrato.filter(tipoContrato => tipoContrato.seleccionado);
    return tiposContratoSeleccionados;
  };

  /**
   * Método encargado de cargar el componente en el navegador
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  cargarVista = (evento) => {
    this.setState({ programaActual: evento.target.value });
  };

  /**
   * Método encargado de realizar la navegación entre las diferentes pestañas
   * @param {Event} evento Evento ejecutado en el control de usuario
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
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    if (!this.validarRequeridosPrograma()) {
      return (<div className="text-center">Cargando los datos del programa, esto puede tardar un momento...</div>);
    }
    return (
      <div className='contratos'>
        {this.state.mostrarAlertaActividad && (
          <div className='alerta-actividad'>
            <div className='header'>
              <a onClick={() => this.mostrarAlertaActividad(false)} className='close' >&times;</a>
              <label>{this.state.actividad.uniIdeactividad.uniNombre1}</label>
            </div>
            <div className='body'>
              <span className='icon'><i className='fa fa-fw fa-clock-o'></i></span>
              <span className='detalle'>{`${this.state.actividad.actHorainicio} - ${this.state.actividad.actHorafinal}`}</span>
            </div>
          </div>
        )}
        <Botonera funciones={this.obtenerFunciones()} />
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
      </div>
    );
  }
}

GestionContratos.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func,
  mostrarProgramaModal: PropTypes.func,
  actualizarCabeceraContrato: PropTypes.func
};

const mapStateToProps = state => {
  const contratos = state.contratos;
  const { cabecera, documentos, garantia, tipoCalculo, listas } = contratos;
  return { cabecera, documentos, garantia, tipoCalculo, listas, contratos };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
    mostrarProgramaModal,
    actualizarCabeceraContrato,
    actualizarListaContratos,
    actualizarDocumentosContrato,
    actualizarGarantia,
    actualizarTipoCalculoContrato,
    limpiarContrato
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionContratos);

export { VistaRedux as RGestionContratos };
