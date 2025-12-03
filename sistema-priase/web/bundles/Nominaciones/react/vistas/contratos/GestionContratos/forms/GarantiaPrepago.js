import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, TextoNumerico, Combo, Fecha, Util, Tabla, typeOf } from 'appfuture-react';
import { get as getProp } from 'object-path';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import moment from 'moment';

const TIPOS_PREPAGO = {
  DIARIO: { codigo: 'D', valor: 1 },
  SEMANAL: { codigo: 'S', valor: 7 },
  QUINCENAL: { codigo: 'Q', valor: 15 },
  MENSUAL: { codigo: 'M', valor: 30 },
  ANUAL: { codigo: 'A', valor: 365 },
};

const listaTipoPrepago = [
  { texto: 'Diario', valor: TIPOS_PREPAGO.DIARIO.codigo },
  { texto: 'Semanal', valor: TIPOS_PREPAGO.SEMANAL.codigo },
  { texto: 'Quincenal', valor: TIPOS_PREPAGO.QUINCENAL.codigo },
  { texto: 'Mensual', valor: TIPOS_PREPAGO.MENSUAL.codigo },
  { texto: 'Anual', valor: TIPOS_PREPAGO.ANUAL.codigo },
];

class GarantiaPrepago extends Component {

  state = {

  };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente
   */
  componentDidMount() {
    const estadoContrato = getProp(this.props, 'estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (desabilitarE) {
      return;
    }
    let garantia = { ...this.props.garantia };
    if (!garantia.prepago) {
      garantia.prepago = {};
    }
    const otrosParametros = this.calcularNumeroDias(getProp(this.props, 'garantia.prepago.numeroDiasPrepago', 0));
    garantia.prepago = { ...garantia.prepago, ...otrosParametros };
    this.calcularPrecioGarantia(garantia);
  }

  /**
   * Obtiene la lista de medidores seleccioandos.
   * @returns {Array}
   */
  obtenerMedidoresSeleccionados = () => {
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    if (tipoCalculo && tipoCalculo.tipoCalculo == 'C') {
      const intervalo = (tipoCalculo.canastaConsumoSuministro) ? tipoCalculo.canastaConsumoSuministro.canastaConRutas[0] : {};
      if (!intervalo || Object.keys(intervalo).length == 0) {
        return [];
      }
      const medidores = intervalo.rutas.filter(m => m.mesuIderegistro);
      return medidores;
    }
    return this.props.listas.medidores.filter(m => m.seleccionado);
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
   * Método encargado de calcular el precio del calculo de la garantia
   */
  refrescarValorPrecioGarantia = () => {
    let garantia = { ...this.props.garantia };
    if (!garantia.prepago) {
      garantia.prepago = {};
    }
    this.calcularPrecioGarantia(garantia);
  };

  /**
   * Método encargado de actualizar el objeto redux de garantia
   * @param {Object} cambio Cambio a realizar en la garantia
   */
  actualizarObjetoGarantia = (cambio) => {
    let garantia = { ...this.props.garantia };
    if (!garantia.prepago) {
      garantia.prepago = { ...cambio };
    }
    garantia.prepago = { ...garantia.prepago, ...cambio };
    this.calcularPrecioGarantia(garantia);
  };

  /**
   * Método encargado de calcular el número de días del prepago
   * @param {Object} valor Valor que se le asignara
   * @param {String} nombrePropiedad Propiedad a actualizar en el redux
   */
  calcularNumeroDias = (valor, nombrePropiedad = 'tipoPrepago') => {
    if (nombrePropiedad != 'tipoPrepago') {
      return;
    }
    for (const key in TIPOS_PREPAGO) {
      if (TIPOS_PREPAGO.hasOwnProperty(key)) {
        const dato = TIPOS_PREPAGO[key];
        if (dato.codigo == valor || dato.valor == valor) {
          return { tipoPrepago: dato.codigo };
        }
      }
    }
    return {};
  };

  /**
   * Método encargado de consultar la TRM para la fecha seleccionada
   * @param {String} fecha Fecha seleccionada
   */
  consultarTrmDia = (fecha, garantia) => {
    axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_TRM, { criterio: '', fecha: fecha })
      .then(respuesta => {
        garantia.trmGarantia = (respuesta.data.codigo > 0) ? respuesta.data.datos.covlValor : 0;
        garantia.idTrmGarantia = (respuesta.data.codigo > 0) ? respuesta.data.datos.covlIderegistro : null;
        this.calcularPrecioGarantia(garantia);
      })
  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    const estadoContrato = getProp(this.props, 'estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (desabilitarE) {
      return;
    }
    const control = evento.target;
    console.log("controlname->"+control.name);
    let nuevoEstado = {};
    nuevoEstado[control.name] = control.value;
    let garantia = { ...this.props.garantia };
    if (!garantia.prepago) {
      garantia.prepago = {};
    }
    let otrosParametros = this.calcularNumeroDias(control.value, control.name);
    if (control.name == 'fechaFin') {
      otrosParametros = this.obtenerDuracionPrepago(control.value);
    }
    if (control.name == 'tipoContrato') {
      if (control.value == '-1') {
        otrosParametros = { ...otrosParametros, valorFinalGarantia: 0, numeroDiasPrepago: 0, fechaInicial: '', fechaFin: '' };
      }
    }

    if (control.name == 'precioFinalGarantia') {
      if (control.value == '') {
        garantia.prepago.precioFinalGarantia = 0;
        this.props.actualizarGarantia(garantia);
        return;
      }
      garantia.prepago.precioFinalGarantia = control.value;
      this.props.actualizarGarantia(garantia);
      return;
    }

    garantia.prepago = { ...garantia.prepago, ...otrosParametros };
    garantia.prepago[control.name] = (control.type === 'checkbox') ? control.checked : control.value;
    if (control.name == 'fechaTrm') {
      this.consultarTrmDia(control.value, garantia);
      return;
    }
    this.calcularPrecioGarantia(garantia);
  };

  /**
   * Actualizará la cabecera del objeto Redux.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  actualizarCabeceraRedux = async (evento) => {
    const input = evento.target;
    let cambio = new Object();
    cambio[input.name] = input.value;
    await this.props.actualizarCabecera(cambio);
    let garantia = { ...this.props.garantia };
    if (!garantia.prepago) {
      garantia.prepago = {};
    }
    this.calcularPrecioGarantia(garantia);
  };

  /**
   * Método encargado de recorrer la lista designada para hacer el calculo
   * @param {Array} lista Lista a recorrer
   */
  recorrerLista = (lista) => {
    let total = 0;
    for (let index = 0; index < lista.length; index++) {
      const element = lista[index];
      total += this.calcularValorPolizaMedidor(element);
    }
    return this.obtenerTotalPoliza(lista);
  }

  /**
   * Calculará el precio de garantia para contrato tipo suministro teniendo en cuenta si el usuario
   * ha seleccionado que se calculara de manera diaria o no diaria.
   * @param {Object} garantia Datos de la garantia
   * @return {Number}
   */
  calcularPrecioGarantiaSuministro = (garantia) => {
    let total = 0;
    let lista = this.obtenerMedidoresSeleccionados();
    if (!Util.validarArreglo(lista)) {
      return 0;
    }
    let unidad;
    let tipo;
    let unidadCabecera;
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    if (idUnidadMedida != "") {
      unidadCabecera = this.obtenerUnidad(idUnidadMedida);
    }
    const tipoCabecera = getProp(unidadCabecera, 'uniPropiedad.tipo', null);
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const numeroDias = (garantia.prepago.numeroDiasPrepago) ? garantia.prepago.numeroDiasPrepago : 0;
    let medidores = [...this.props.listas.medidores];
    const trm = (getProp(this.props, 'cabecera.usaTRMTecho') == 'S') ?
      getProp(this.props, 'cabecera.trmTecho', 0) : getProp(this.props, 'cabecera.trmDia', 0);
    lista.forEach(elemento => {
      if (tipoCalculo.tipoCalculo == 'C') {
        let medidor = medidores.find(me => me.mesuIderegistro == elemento.mesuIderegistro);
        unidad = medidor.uniIdemedidaprecio;
        tipo = unidad.uniPropiedad.tipo;
      } else {
        unidad = elemento.uniIdemedidaprecio;
        tipo = unidad.uniPropiedad.tipo;
      }
      let precio = 0;
      let cantidadContratada = (elemento.cntuValor) ? elemento.cntuValor : elemento.mesuCapacidadmaxima;
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
      precio = (elemento.cntuVlrunitario) ? parseFloat(elemento.cntuVlrunitario) : parseFloat(elemento.mesuPrecio);
      if (tipoCalculo.tipoCalculo == 'C') {
        precio = (elemento.valor) ? parseFloat(elemento.valor) : 0;
        if (unidadCabecera && tipoCabecera === 'USD') {
          let trm = getProp(this.props, 'cabecera.usaTRMTecho', 0) == 'S' ?
            Math.min(getProp(this.props, 'cabecera.trmTecho'), getProp(this.props, 'cabecera.trmDia', 0))
            : getProp(this.props, 'cabecera.trmDia', 0);
          if (garantia.trmGarantia) {
            trm = garantia.trmGarantia;
          }
          precio = precio * trm;
        }
      } else {
        if (unidad && tipo === 'USD') {
          let trm = getProp(this.props, 'cabecera.usaTRMTecho', 0) == 'S' ?
            Math.min(getProp(this.props, 'cabecera.trmTecho'), getProp(this.props, 'cabecera.trmDia', 0))
            : getProp(this.props, 'cabecera.trmDia', 0);
          if (garantia.trmGarantia) {
            trm = garantia.trmGarantia;
          }
          precio = precio * trm;
        }
      }
      elemento.total = (cantidadContratada * precio * numeroDias);
      total += (cantidadContratada * precio * numeroDias);
    });
    lista[0].valorFinal = total;
    return lista[0].valorFinal;
  };

  /**
    * Método encargado de obtener los tramos seleccionados
    * @returns {Array}
    */
  obtenerPuntosSalidaSeleccionados = () => {
    return this.props.listas.puntosSalida.filter(p => p.seleccionado);
  };

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
   * Método encargado de obtener la sumatoria de tramos
   */
  obtenerSumatoriaTramos = (precioGarantia, garantia) => {
    const numeroDias = (garantia.prepago.numeroDiasPrepago) ? garantia.prepago.numeroDiasPrepago : 0;
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const valoresGarantia = getProp(this.props, 'valoresGarantia', '');
    const tipoNegocio = getProp(this.props, 'cabecera.tipoNegocio', '');
    let trm = getProp(this.props, 'cabecera.usaTRMTecho', 0) == 'S' ?
      Math.min(getProp(this.props, 'cabecera.trmTecho'), getProp(this.props, 'cabecera.trmDia', 0))
      : getProp(this.props, 'cabecera.trmDia', 0);
    if (garantia.trmGarantia) {
      trm = garantia.trmGarantia;
    }
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    let porcentajeComercializacion = getProp(this.props, 'cabecera.porcentajeComercializacion', 0);
    let cargos;
    let total = 0;
    let cantidadContratadaDiaria = 0;
    let estadoPeticiones = true;
    const tramos = this.obtenerTramosSeleccionados();
    for (let index = 0; index < tramos.length; index++) {
      const tramo = tramos[index];
      cantidadContratadaDiaria = tramo.cantidadContratada;
      if (!isNaN(cantidadContratadaDiaria)) {
        switch (periodoCantidadContratada) {
          case 'D':
            cantidadContratadaDiaria = (tramo.cantidadContratada / 1);
            break;
          case 'S':
            cantidadContratadaDiaria = (tramo.cantidadContratada / 7);
            break;
          case 'M':
            cantidadContratadaDiaria = (tramo.cantidadContratada / 30);
            break;
          case 'A':
            cantidadContratadaDiaria = (tramo.cantidadContratada / 365);
            break;
          default:
            break;
        }
        cargos = tramo.cargos;
        tramo.totalTramo = (((cargos.trcaCargofijo / 365) * trm) + (parseFloat(cargos.cntrCargovariable) * trm) + (cargos.trcaCargoaoym / 365) +
          ((((cargos.trcaCargofijo / 365) * trm) + (parseFloat(cargos.cntrCargovariable) * trm)) * valoresGarantia.valorVariableTransporte)) * cantidadContratadaDiaria * numeroDias;
        total += tramo.totalTramo;
        continue;
      }
      estadoPeticiones = false;
      break;
    }
    if (estadoPeticiones == false) {
      return;
    }
    if (!isNaN(total)) {
      let porcentajeComercializacionFinal = 0;
      tramos[0].totalFinal = total;
      precioGarantia = parseFloat(precioGarantia.toFixed(7));
      total = parseFloat(total.toFixed(7));
      let totalFinal = precioGarantia + total;
      if (tipoCalculo.tipoCalculo == 'C') {
        let intervaloCalculo = tipoCalculo.canastaConsumoSuministro.canastaConRutas;
        if (Util.validarArreglo(intervaloCalculo)) {
          intervaloCalculo = tipoCalculo.canastaConsumoSuministro.canastaConRutas[0];
          let porcentaje = parseInt(intervaloCalculo.porcentaje);
          if (!isNaN(porcentaje)) {
            porcentajeComercializacionFinal = totalFinal * (porcentaje / 100);
            totalFinal = totalFinal + porcentajeComercializacionFinal;
          }
        }
      } else {
        if (porcentajeComercializacion != 0) {
          porcentajeComercializacion = parseInt(porcentajeComercializacion);
          porcentajeComercializacionFinal = totalFinal * (porcentajeComercializacion / 100);
          totalFinal = totalFinal + porcentajeComercializacionFinal;
        }
      }
      garantia.prepago.precioGarantia = totalFinal;
      if (tipoNegocio == 'V') {
        garantia.prepago.precioFinalGarantia = totalFinal;
      }
      if (tipoNegocio == 'C') {
        if (!garantia.prepago.precioFinalGarantia) {
          garantia.prepago.precioFinalGarantia = totalFinal;
        }
      }

      this.props.actualizarGarantia(garantia);
    }
    this.renderCalculoTramos();
  }

  /**
   * Método encargado de invocar al conversor de unidades
   * @param {Object} tramo Tramo al cual se le asignara el valor convertido
   * @param {String} valor Valor a convertir
   */
  convertir = (tramo, valor, precioGarantia, unidadFinal, garantia) => {
    const unidadContratada = getProp(this.props, 'cabecera.unidadMedida', '');
    axios.post(RUTAS_API.PARAMETRIZACION.CONVERSOR.CONVERTIR,
      { idUnidadOrigen: unidadContratada, idUnidadDestino: unidadFinal.uniIderegistro, valor: parseFloat(valor) })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          valor = respuesta.data.datos;
        }
        tramo.cantidadContratada = valor;
        this.obtenerSumatoriaTramos(precioGarantia, garantia);
      });
  }

  /**
   * Método encargado de recorrer los tramos para obtener la cantidad contratada
   * @param {Array} tramos Tramos seleccionados
   * @param {Array} puntosAsociadosFor Puntos asociados a cada tramo
   * @param {Integer} idTramo Identificador del tramo asociado
   */
  recorrerTramos = (tramos, puntosAsociadosFor, idTramo, precioGarantia, garantia) => {
    let listaCapacidad = getProp(this.props, 'listas.cantidad');
    tramos.forEach(tramo => {
      const unidadMedidaTramo = tramo.cargos.uniIdemedidavariable;
      let unidadCapacidad = unidadMedidaTramo.uniPropiedad.capacidad;
      const unidadFinal = listaCapacidad.find(lc => JSON.parse(lc.uniPropiedad).tipo == unidadCapacidad);
      if (tramo.trmIderegistro == idTramo) {
        if (puntosAsociadosFor.length == 1) {
          this.convertir(tramo, puntosAsociadosFor[0].cntsCantidadcontratadaCalculo, precioGarantia, unidadFinal, garantia);
          return;
        }
        this.convertir(tramo, puntosAsociadosFor.reduce((a, b) => a + b.cntsCantidadcontratadaCalculo, 0), precioGarantia, unidadFinal, garantia);
      }
    });
  }

  /**
   * Método encargado de asignar la cantidad contratada a cada tramo dependiendo de los puntos de salida
   * @param {Array} puntosAsociados Puntos asociados por tramo
   * @param {Array} tramos Lista de tramos seleccionados
   */
  obtenerCantidadContratadaTramo = (puntosAsociados, tramos, precioGarantia, garantia) => {
    for (const idTramo in puntosAsociados) {
      const puntosAsociadosFor = puntosAsociados[idTramo];
      this.recorrerTramos(tramos, puntosAsociadosFor, idTramo, precioGarantia, garantia);
    }
  }

  /**
   * Método encargado de obtener el calculo por tramos
   * @param {Array} tramos Lista de tramos seleccionados
   * @param {Number} cantidadContratada Cantidad contratada de los puntos de salida
   */
  obtenerTotalTramosConvertir = (tramos, precioGarantia, garantia) => {
    let puntosAsociados = this.obtenerListaAsociadoPorTramo(tramos);
    this.obtenerCantidadContratadaTramo(puntosAsociados, tramos, precioGarantia, garantia);
  };

  /**
   * Calculará el precio de garantia para el contrato de tipo transporte.
   * Además validará si existen o no los valores del tramo (valorCargoVariable, valorCargoFijo, valorCargoAOM)...
   * @param {Object} garantia Datos de la garantia.
   * @return {number}
   */
  calcularPrecioGarantiaTransporte = (garantia, precioGarantia) => {
    const lista = this.obtenerTramosSeleccionados();
    if (!Util.validarArreglo(lista)) {
      return 0;
    }
    this.obtenerTotalTramosConvertir(lista, precioGarantia, garantia);
  };

  /**
   * Calcula el precio de la garantia para tipo de contrato conexión.
   * @param {Object} garantia Datos de la garantia.
   * @param {String} tipo Tipo de rutas.
   * @return {Number}
   */
  calcularPrecioGarantiaGNConexion = (garantia, tipo) => {
    const lista = this.obtenerRutasSeleccionadas(tipo);
    if (!Util.validarArreglo(lista)) {
      return 0;
    }
    let total = 0;
    let unidad;
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const numeroDias = (garantia.prepago.numeroDiasPrepago) ? garantia.prepago.numeroDiasPrepago : 0;
    let trm = getProp(this.props, 'cabecera.usaTRMTecho', 0) == 'S' ?
      Math.min(getProp(this.props, 'cabecera.trmTecho'), getProp(this.props, 'cabecera.trmDia', 0))
      : getProp(this.props, 'cabecera.trmDia', 0);
    if (garantia.trmGarantia) {
      trm = garantia.trmGarantia;
    }
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    if (idUnidadMedida != "") {
      unidad = this.obtenerUnidad(idUnidadMedida);
    }
    const tipoU = getProp(unidad, 'uniPropiedad.tipo', null);
    lista.forEach(elemento => {
      let precio = 0;
      let cantidadContratada = (elemento.cntuValor) ? elemento.cntuValor : elemento.mesuCapacidadmaxima;
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
      precio = (elemento.cntuVlrunitario) ? parseFloat(elemento.cntuVlrunitario) : parseFloat(elemento.mesuPrecio);
      if (tipoCalculo.tipoCalculo == 'C') {
        precio = (elemento.valor) ? parseFloat(elemento.valor) : 0;
      }
      if (unidad && tipoU === 'USD') {
        precio = precio * trm;
      }
      elemento.total = (cantidadContratada * precio * numeroDias);
      total += (cantidadContratada * precio * numeroDias);
    });
    lista[0].valorFinal = total;
    return lista[0].valorFinal;
  };

  /**
   * Calculará el precio de la garantía.
   * @param {Object} garantia Datos de la garantia
   * @return {number}
   */
  calcularPrecioGarantia = (garantia) => {
    if (!this.props.garantia.prepago) {
      this.props.actualizarGarantia(garantia);
      return 0;
    }
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const { tiposContrato } = this.props.listas;
    const tipoNegocio = getProp(this.props, 'cabecera.tipoNegocio', '');
    const esTipoTransporte = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'T'));
    const esSuministro = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'S');
    const esGnc = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNC'));
    const esConexion = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'CNX'));
    let porcentajeComercializacion = getProp(this.props, 'cabecera.porcentajeComercializacion', 0);
    const tiposSinListas = tiposContrato.filter(t => t.seleccionado &&
      (getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'));
    let precioGarantia = 0;
    let porcentajeComercializacionFinal = 0;
    if (esSuministro) {
      const totalMedidores = this.calcularPrecioGarantiaSuministro(garantia);
      precioGarantia += totalMedidores;
    }
    if (esGnc) {
      const TotalRutasGnc = this.calcularPrecioGarantiaGNConexion(garantia, 'G');
      precioGarantia += TotalRutasGnc;
    }

    if (esConexion) {
      const TotalRutasConexion = this.calcularPrecioGarantiaGNConexion(garantia, 'C');
      precioGarantia += TotalRutasConexion;
    }

    if (Util.validarArreglo(tiposSinListas)) {
      const totalNoAplica = this.obtenerValorFinal(garantia);
      precioGarantia += totalNoAplica;
    }

    if (tipoCalculo.tipoCalculo == 'C' && !esTipoTransporte) {
      let intervaloCalculo = tipoCalculo.canastaConsumoSuministro.canastaConRutas;
      if (Util.validarArreglo(intervaloCalculo)) {
        intervaloCalculo = tipoCalculo.canastaConsumoSuministro.canastaConRutas[0];
        let porcentaje = parseInt(intervaloCalculo.porcentaje);
        if (!isNaN(porcentaje)) {
          porcentajeComercializacionFinal = precioGarantia * (porcentaje / 100);
          precioGarantia = precioGarantia + porcentajeComercializacionFinal;
        }
      }
    }
    if (!esTipoTransporte) {
      if (porcentajeComercializacion != 0) {
        porcentajeComercializacion = parseInt(porcentajeComercializacion);
        porcentajeComercializacionFinal = precioGarantia * (porcentajeComercializacion / 100);
        precioGarantia = precioGarantia + porcentajeComercializacionFinal;
      }
    }

    if (esTipoTransporte) {
      this.calcularPrecioGarantiaTransporte(garantia, precioGarantia);
    }

    if (isNaN(precioGarantia)) {
      precioGarantia = 0;
    }

    garantia.prepago.precioGarantia = parseFloat(precioGarantia.toFixed(7));
    if (tipoNegocio == 'V') {
      garantia.prepago.precioFinalGarantia = parseFloat(precioGarantia.toFixed(7));
    }
    if (tipoNegocio == 'C') {
      if (!garantia.prepago.precioFinalGarantia) {
        garantia.prepago.precioFinalGarantia = parseFloat(precioGarantia.toFixed(7))
      }
    }
    this.props.actualizarGarantia(garantia);

    return precioGarantia;
  };

  /**
   * Calcula el número de días para el prepago formato: {# días # meses, # años}
   * @param {String} fechaFin Fecha fin del prepago
   * @return {String}
   */
  obtenerDuracionPrepago = (fechaFin) => {
    const fechaInicio = getProp(this.props, 'garantia.prepago.fechaInicial', '');
    if (!fechaInicio || fechaInicio == '') {
      return '';
    }
    const momentInicio = moment(fechaInicio);
    const momentFin = moment(fechaFin);
    let diferencia = momentFin.diff(momentInicio, 'days');
    diferencia = (diferencia + 1);
    const cambio = { numeroDiasPrepago: diferencia };
    return cambio;
  }

  /**
   * Obtiene la lista de los tipos de contrato seleccionados por el usuario.
   * @returns {Array}
   */
  obtenerListaTiposContratos = () => {
    const { tiposContrato } = this.props.listas;
    return tiposContrato.filter(tipoContrato => tipoContrato.seleccionado);
  };

  /**
   * Método encargado de obtener el historico de la garantia
   */
  obtenerHistorico = () => {
    const idContrato = getProp(this.props, 'cabecera.idContrato', '');
    axios.post(RUTAS_API.CONTRATOS.CONSULTAR_HISTORICO_GARANTIA, { idContrato: idContrato })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          let garantia = { ...this.props.garantia };
          if (!garantia.prepago) {
            garantia.prepago = {};
          }
          if (!garantia.prepago.historico) {
            garantia.prepago = { ...garantia.prepago, historico: respuesta.data.datos };
          } else {
            garantia.prepago.historico = respuesta.data.datos;
          }
          this.props.actualizarGarantia(garantia);
        }
      });
  }

  /**
   * Método encargado de obtener el nombre de la garantia para el historico
   * @param {String} tipoGarantia Codigo del tipo de garantia
   * @returns {String}
   */
  obtenerTipoGarantia = (tipoGarantia) => {
    switch (tipoGarantia) {
      case 'PR':
        return 'Prepago'
      case 'GB':
        return 'Garantia Bancaria'
      case 'PO':
        return 'Poliza'
    }
  }

  /**
   * Método encargado de mostrar el formulario para ver el historico
   * @returns {Object}
   */
  renderHistorico = () => {
    const listaHistorico = getProp(this.props.garantia, 'prepago.historico', []);
    return (
      <Fragment>
        <button
          className='btn btn-success'
          onClick={this.obtenerHistorico}
        >
          Historico
        </button>
        {Util.validarArreglo(listaHistorico) &&
          <table className='table table-striped'>
            <thead>
              <tr>
                <th colSpan='4'>Historico</th>
              </tr>
              <tr>
                <th>Tipo de Garantía</th>
                <th>Fecha Inicial de Cobertura</th>
                <th>Fecha Final de Cobertura</th>
                <th>Valor Total de la Garantia</th>
              </tr>
            </thead>
            <tbody>
              {listaHistorico.map(h => {
                return (
                  <tr>
                    <td>{this.obtenerTipoGarantia(h.cntgTipo)}</td>
                    <td>{h.cntgFechainicio}</td>
                    <td>{h.cntgFechafin}</td>
                    <td>{h.cntgVlrfinal}</td>
                  </tr>
                )
              })
              }
            </tbody>
          </table>
        }
      </Fragment>
    );
  }

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
   * Método encargado de mostrar la tabla de rutas o medidores según sea el caso
   * @param {String} titulo Titulo de la primera columna de la tabla
   * @param {Object} lista Lista a recorrer ya sea medidores o rutas
   */
  renderTabla = (titulo, lista) => {
    let unidad, unidadPrecio;
    const idUnidadMedidaContratada = getProp(this.props, 'cabecera.unidadMedida', '');
    const idUnidadMedidaPrecio = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    if (idUnidadMedidaPrecio != "") {
      unidadPrecio = this.obtenerUnidad(idUnidadMedidaPrecio);
    }
    if (idUnidadMedidaContratada != "") {
      unidad = this.obtenerUnidad(idUnidadMedidaContratada);
    }
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>{titulo}</th>
            <th>Valor Unitario</th>
            <th>Cantidad Contratada</th>
            <th>Valor de la Poliza en Pesos</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(ele => {
            return (
              <tr>
                <td>{(ele.uniNombre1) ? ele.uniNombre1 : (ele.mesuNombre) ? ele.mesuNombre : ele.nombre}</td>
                <td>{(typeof ele.valor != 'undefined') ? ele.valor + ' ' + getProp(unidadPrecio, 'uniNombre1', '') : (typeof ele.cntuVlrunitario != 'undefined') ? ele.cntuVlrunitario + ' ' + getProp(unidadPrecio, 'uniNombre1', '') : ele.mesuPrecio + ' ' + getProp(ele.uniIdemedidaprecio, 'uniNombre1', '')}</td>
                <td>{(ele.cntuValor) ? ele.cntuValor + ' ' + unidad.uniNombre1 : ele.mesuCapacidadmaxima + ' ' + unidad.uniNombre1}</td>
                <td>{this.calcularValorPolizaMedidor(ele)}</td>
              </tr>
            )
          })
          }
          <tr>
            <td colSpan='3'>Total</td>
            <td>{this.obtenerTotalPoliza(lista)}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  /**
   * Método encargado de obtener el valor final de la poliza
   * @param {Array} lista Lista de medidores o rutas
   */
  obtenerTotalPoliza = (lista) => {
    let valorFinal = 0;
    lista.forEach(ele => {
      valorFinal = valorFinal + ele.total;
    });
    lista[0].valorFinal = valorFinal;
    return lista[0].valorFinal;
  }

  /**
   * Método encargado de obtener el valor en pesos de la poliza por medidor o ruta
   * @param {Object} elemento Datos del medidor o la ruta
   */
  calcularValorPolizaMedidor = (elemento) => {
    let total = 0;
    let precio = 0;
    let unidad;
    let garantia = { ...this.props.garantia };
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    let trm = (getProp(this.props, 'cabecera.usaTRMTecho') == 'S') ?
      getProp(this.props, 'cabecera.trmTecho', 0) : getProp(this.props, 'cabecera.trmDia', 0);
    if (garantia.trmGarantia) {
      trm = garantia.trmGarantia;
    }
    if (idUnidadMedida != "") {
      unidad = this.obtenerUnidad(idUnidadMedida);
    }
    const tipoU = getProp(unidad, 'uniPropiedad.tipo', null);
    let cantidadContratada = (elemento.cntuValor) ? elemento.cntuValor : elemento.mesuCapacidadmaxima;
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
    precio = (elemento.cntuVlrunitario) ? parseFloat(elemento.cntuVlrunitario) : parseFloat(elemento.mesuPrecio);
    if (tipoCalculo.tipoCalculo == 'C') {
      precio = parseFloat(elemento.valor);
    }
    if (elemento.uniIderegistro) {
      if (unidad && tipoU === 'USD') {
        precio = precio * trm;
      }
    }
    if (elemento.mesuIderegistro && tipoCalculo.tipoCalculo == 'C') {
      if (unidad && tipoU === 'USD') {
        precio = precio * trm;
      }
    }
    if (elemento.mesuIderegistro && tipoCalculo.tipoCalculo == 'N') {
      let unidadMedidor = elemento.uniIdemedidaprecio;
      let tipoUnidadMedidor = unidadMedidor.uniPropiedad.tipo;
      if (unidadMedidor && tipoUnidadMedidor === 'USD') {
        precio = precio * trm;
      }
    }
    const numeroDías = getProp(garantia, 'prepago.numeroDiasPrepago', 0);
    total = (cantidadContratada * precio * numeroDías);
    elemento.total = total;
    return elemento.total;
  };

  /**
   * Método encargado de realizar el calculo de las garantias por medidores
   * @returns {Object}
   */
  renderCalculoMedidores = () => {
    const medidores = this.obtenerMedidoresSeleccionados();
    if (!Util.validarArreglo(medidores)) {
      return;
    }
    return (
      this.renderTabla('Medidor', medidores)
    );
  }

  /**
   * Obtiene la lista de rutas seleccionados.
   * @returns {Array}
   */
  obtenerRutasSeleccionadas = (tipo = null) => {
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    if (tipoCalculo && tipoCalculo.tipoCalculo == 'C') {
      const intervalo = (tipoCalculo.canastaConsumoSuministro) ? tipoCalculo.canastaConsumoSuministro.canastaConRutas[0] : {};
      if (!intervalo || Object.keys(intervalo).length == 0) {
        return [];
      }
      const rutas = intervalo.rutas.filter(r => r.uniIderegistro);
      if (tipo == null) {
        return rutas.map(r => {
          r.valor = (r.valor) ? parseFloat(r.valor) : 0;
          return r;
        });
      }
      return rutas.filter(r => r.uniPropiedad.tipo === tipo).map(r => {
        r.valor = (r.valor) ? parseFloat(r.valor) : 0;
        return r;
      });
    }
    if (tipo == null) {
      return this.props.listas.rutas.filter(r => r.seleccionado).map(r => {
        r.cntuVlrunitario = (r.cntuVlrunitario) ? r.cntuVlrunitario : 0;
        return r;
      });
    }
    return this.props.listas.rutas.filter(r => r.seleccionado && r.uniPropiedad.tipo === tipo).map(r => {
      r.cntuVlrunitario = (r.cntuVlrunitario) ? r.cntuVlrunitario : 0;
      return r;
    });
  };

  /**
   * Método encargado de realizar el calculo de las garantias por rutas
   * @returns {Object}
   */
  renderCalculorutas = () => {
    const rutas = this.obtenerRutasSeleccionadas();
    if (!Util.validarArreglo(rutas)) {
      return;
    }
    return (
      this.renderTabla('Ruta', rutas)
    );
  }

  /**
   * Método encargado de obtener los tramos seleccionados
   * @returns {Array}
   */
  obtenerTramosSeleccionados = () => {
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    if (tipoCalculo && tipoCalculo.tipoCalculo == 'C') {
      const intervalo = (tipoCalculo.canastaConsumoSuministro) ? tipoCalculo.canastaConsumoSuministro.canastaConRutas[0] : {};
      if (!intervalo || Object.keys(intervalo).length == 0) {
        return [];
      }
      const tramos = intervalo.rutas.filter(t => t.trmIderegistro);
      return tramos;
    }
    return getProp(this.props.listas, 'listaTramosFinal', []).filter(t => t.seleccionado).map(t => {
      let cargos = t.listaCargos.find(lc => lc.seleccionado);
      t.cargos = cargos;
      return t;
    });
  };

  /**
   * Método encargado de realizar el calculo de las garantias por tramos
   * @returns {Object}
   */
  renderCalculoTramos = () => {
    const tramos = this.obtenerTramosSeleccionados();
    if (!Util.validarArreglo(tramos)) {
      return;
    }
    let unidadPrecio;
    let unidadContratada = tramos[0].cargos.uniIdemedidavariable;
    const idUnidadMedidaPrecio = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    if (idUnidadMedidaPrecio != "") {
      unidadPrecio = this.obtenerUnidad(idUnidadMedidaPrecio);
    }
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Tramo</th>
            <th>Cantidad Contratada</th>
            <th>Cargo Fijo</th>
            <th>Cargo Variable</th>
            <th>Cargo AOM</th>
            {<th>Valor de la Poliza en Pesos</th>}
          </tr>
        </thead>
        <tbody>
          {tramos.map(tramo => {
            return (
              <tr>
                <td>{(tramo.trmNombre) ? tramo.trmNombre : tramo.nombre}</td>
                <td>{(tramo.cantidadContratada) ? tramo.cantidadContratada + ' ' + unidadContratada.uniPropiedad.capacidad : 0}</td>
                <td>{tramo.cargos.trcaCargofijo}</td>
                <td>{tramo.cargos.cntrCargovariable}</td>
                <td>{tramo.cargos.trcaCargoaoym}</td>
                <td>{(tramo.totalTramo) ? tramo.totalTramo : 0}</td>
              </tr>
            );
          })
          }
          <tr>
            <td colSpan='5'>Total</td>
            <td>{(tramos[0].totalFinal) ? tramos[0].totalFinal : 0}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  /**
   * Método encargado de obtener el valor final para garantias prepago sin medidores tramos o rutas
   * @param {Object} garantia Datos de la garantia
   * @returns {Number}
   */
  obtenerValorFinal = (garantia) => {
    let unidad;
    let cantidadContratada = parseFloat(getProp(this.props, 'cabecera.cantidadContratada', 0));
    let precioContrato = parseFloat(getProp(this.props, 'cabecera.precioContrato', 0));
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    let trm = getProp(this.props, 'cabecera.usaTRMTecho', 0) == 'S' ?
      Math.min(getProp(this.props, 'cabecera.trmTecho'), getProp(this.props, 'cabecera.trmDia', 0))
      : getProp(this.props, 'cabecera.trmDia', 0);
    if (garantia.trmGarantia) {
      trm = garantia.trmGarantia;
    }
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    if (idUnidadMedida != "") {
      unidad = this.obtenerUnidad(idUnidadMedida);
    }
    const tipo = getProp(unidad, 'uniPropiedad.tipo', null);
    const numeroDias = (garantia.prepago.numeroDiasPrepago) ? garantia.prepago.numeroDiasPrepago : 0;
    let total = 0;
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
    if (tipoCalculo && tipoCalculo.tipoCalculo == 'C') {
      const intervalo = (tipoCalculo.canastaConsumoSuministro) ? tipoCalculo.canastaConsumoSuministro.canastaConRutas[0] : {};
      if (!intervalo || Object.keys(intervalo).length == 0) {
        return 0;
      }
      const sinListas = intervalo.rutas.find(sl => sl.idRangoSin);
      let precio = (sinListas.valor) ? parseFloat(sinListas.valor) : 0;
      if (unidad && tipo === 'USD') {
        precio = precio * trm;
      }
      total = (cantidadContratada * precio * numeroDias);
      return total;
    }
    if (unidad && tipo === 'USD') {
      precioContrato = precioContrato * trm;
    }
    total = (cantidadContratada * precioContrato * numeroDias);
    return total;
  };

  /**
   *Retornará el DOM del componente. cambio trm
   * @return {string}
   */
  render() {
    const { tiposContrato } = this.props.listas;
    const esTipoTransporte = tiposContrato.find(t => t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'T'));
    const esSuministro = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'S');
    const usaRutas = tiposContrato.filter(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'CNX' || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNC'));
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    let precio = 0;
    let trm = null;
    let porcentajeCanasta = 0;
    const tiposSinListas = tiposContrato.filter(t => t.seleccionado &&
      (getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'));
    let desabilitar = false;
    const tipoNegocio = getProp(this.props, 'cabecera.tipoNegocio', '');
    if (!tipoNegocio || tipoNegocio == 'V' || tipoNegocio == '-1') {
      desabilitar = true;
    }
    if (tipoCalculo && tipoCalculo.tipoCalculo == 'C') {
      const intervalo = (tipoCalculo.canastaConsumoSuministro) ? tipoCalculo.canastaConsumoSuministro.canastaConRutas[0] : {};
      if (!intervalo || Object.keys(intervalo).length == 0) {
        return 0;
      }
      porcentajeCanasta = intervalo.porcentaje;
      if (porcentajeCanasta == '' || typeof porcentajeCanasta == 'undefined' || porcentajeCanasta == null) {
        porcentajeCanasta = 0;
      }
      const sinListas = intervalo.rutas.find(sl => sl.idRangoSin);
      if (typeof sinListas != 'undefined') {
        precio = (sinListas.valor) ? parseFloat(sinListas.valor) : 0;
      }
    }
    if (this.props.garantia.trmGarantia) {
      trm = this.props.garantia.trmGarantia;
    }
    return (
      <div className='row col-12'>
        <div className='row col-12 poliza-contratos mt-5'>
          <Fecha
            label='Fecha Inicial Cobertura:'
            name='fechaInicial'
            value={getProp(this.props, 'garantia.prepago.fechaInicial', '')}
            fecha={getProp(this.props, 'garantia.prepago.fechaInicial', '')}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha Fin Cobertura:'
            name='fechaFin'
            value={getProp(this.props, 'garantia.prepago.fechaFin', '')}
            fecha={getProp(this.props, 'garantia.prepago.fechaFin', '')}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha TRM:'
            name='fechaTrm'
            value={getProp(this.props, 'garantia.prepago.fechaTrm', '')}
            fecha={getProp(this.props, 'garantia.prepago.fechaTrm', '')}
            onChange={this.controlarCambio}
          />
          <TextoNumerico
            aceptaDecimales={false}
            aceptaNegativos={false}
            label='Cantidad de Días:'
            name='numeroDiasPrepago'
            value={getProp(this.props, 'garantia.prepago.numeroDiasPrepago', '0')}
            onChange={this.controlarCambio}
            extra={{ disabled: true }}
          />
          <Combo
            opciones={listaTipoPrepago}
            propTexto='texto'
            propValor='valor'
            label='Tipo de Prepago:'
            name='tipoPrepago'
            value={getProp(this.props, 'garantia.prepago.tipoPrepago', '')}
            onChange={this.controlarCambio}
          />
          {Util.validarArreglo(tiposSinListas) &&
            <Fragment>
              <Input
                label='Cantidad contratada:'
                value={getProp(this.props, 'cabecera.cantidadContratada', '0')}
                onChange={this.controlarCambio}
                name='cantidadContratada'
                extra={{ disabled: true }}
              />
              {(tipoCalculo && tipoCalculo.tipoCalculo == 'C') &&
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={false}
                  label='Precio contrato:'
                  cols={4}
                  value={precio}
                  extra={{ disabled: true }}
                  name='precioContrato'
                />
              }
              {(tipoCalculo && tipoCalculo.tipoCalculo == 'N') &&
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={false}
                  label='Precio contrato:'
                  cols={4}
                  value={getProp(this.props, 'cabecera.precioContrato')}
                  extra={{ disabled: true }}
                  name='precioContrato'
                />
              }

            </Fragment>
          }
          <Input
            label='Precio Prepago:'
            value={getProp(this.props, 'garantia.prepago.precioGarantia', '')}
            onChange={this.controlarCambio}
            name='precioGarantia'
            extra={{ disabled: true }}
          />
          {getProp(this.props, 'garantia.prepago.precioGarantia', '') != '' &&
            <TextoNumerico
              aceptaDecimales={true}
              aceptaNegativos={false}
              label='Precio Final de garantia:'
              cols={4}
              onChange={this.controlarCambio}
              value={getProp(this.props, 'garantia.prepago.precioFinalGarantia', getProp(this.props, 'garantia.prepago.precioGarantia'))}
              name='precioFinalGarantia'
              extra={{ disabled: desabilitar }}
            />
          }
          {(tipoCalculo && tipoCalculo.tipoCalculo == 'C') &&
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='% Comercialización:'
              cols={4}
              value={porcentajeCanasta}
              name='porcentajeComercializacion'
              extra={{ disabled: true }}
            />
          }
          {(tipoCalculo && tipoCalculo.tipoCalculo == 'N') &&
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='% Comercialización:'
              cols={4}
              value={getProp(this.props, 'cabecera.porcentajeComercializacion', 0)}
              name='porcentajeComercializacion'
              extra={{ disabled: true }}
            />
          }

          <Input
            label='TRM:'
            value={(trm != null) ? trm :
              (getProp(this.props, 'cabecera.usaTRMTecho') == 'S') ?
                getProp(this.props, 'cabecera.trmTecho', 0) : getProp(this.props, 'cabecera.trmDia', 0)}
            name='trmGNC'
            extra={{ disabled: true }}
          />
          {esSuministro &&
            this.renderCalculoMedidores()
          }
          {Util.validarArreglo(usaRutas) &&
            this.renderCalculorutas()
          }
          {esTipoTransporte &&
            this.renderCalculoTramos()
          }
          {getProp(this.props, 'cabecera.idContrato', '') != '' &&
            this.renderHistorico()
          }
        </div>
      </div>
    );
  }

}

GarantiaPrepago.propTypes = {
  mostrarAlerta: PropTypes.func,
  actualizarGarantia: PropTypes.func,
  garantia: PropTypes.object,
  tipoCalculo: PropTypes.object,
  tiposContrato: PropTypes.object,
  actualizarCabecera: PropTypes.func
};

export { GarantiaPrepago };
