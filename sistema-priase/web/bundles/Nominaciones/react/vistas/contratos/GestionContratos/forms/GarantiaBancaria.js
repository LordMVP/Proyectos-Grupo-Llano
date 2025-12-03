import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Combo, Util, Fecha, TextoNumerico } from 'appfuture-react';
import { get as getProp } from 'object-path';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';

class GarantiaBancaria extends Component {

  state = {
    cantidadContratada: '',
  };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente.
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
    this.refrescarValorPrecioGarantia();
  }

  /**
   * Limpia y/o resetea los valores del state, lo que a su vez limpiará los valores en los campos de la interfaz.
   */
  limpiarFormulario = () => {
    this.setState({
      mostrarModalConsulta: false,
    });
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
   * Controla los cambios de los componentes de la interfaz y setea el objeto state con sus respectivos valores.
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
    let nuevoEstado = {};
    nuevoEstado[control.name] = control.value;
    let garantia = { ...this.props.garantia };
    if (!garantia.bancaria) {
      garantia.bancaria = {};
    }

    if (control.name == 'precioFinalGarantia') {
      if (control.value == '') {
        garantia.bancaria.precioFinalGarantia = 0;
        this.props.actualizarGarantia(garantia);
        return;
      }
      garantia.bancaria.precioFinalGarantia = control.value;
      this.props.actualizarGarantia(garantia);
      return;
    }

    garantia.bancaria[control.name] = (control.type === 'checkbox') ? control.checked : control.value;

    if (control.name == 'fechaTrm' && garantia.historico != null) {
      this.consultarTrmDia(control.value, garantia);
      return;
    }
    this.calcularPrecioGarantia(garantia)
  }

  /**
   * Método encargado de calcular el precio del calculo de la garantia
   */
  refrescarValorPrecioGarantia = () => {
    let garantia = { ...this.props.garantia };
    if (!garantia.bancaria) {
      garantia.bancaria = {};
    }
    this.calcularPrecioGarantia(garantia);
  };

  /**
   * Método encargado de obtener el valo
   * @param {Number} precio Precio del contrato
   * @param {Number} trm Valor de la trm
   */
  validarUnidadPrecio = (precio, trm) => {
    let unidad;
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    if (idUnidadMedida != "") {
      unidad = this.obtenerUnidad(idUnidadMedida);
    }
    const tipo = getProp(unidad, 'uniPropiedad.tipo', null);
    if (unidad && tipo === 'USD') {
      return precio = precio * trm;
    }
    return precio;
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
    if (!garantia.bancaria) {
      garantia.bancaria = {};
    }
    const tipoNegocio = getProp(this.props, 'cabecera.tipoNegocio', '');
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const valoresGarantia = getProp(this.props, 'valoresGarantia', {});
    let trm = getProp(this.props, 'cabecera.usaTRMTecho', 0) == 'S' ?
      Math.min(getProp(this.props, 'cabecera.trmTecho'), getProp(this.props, 'cabecera.trmDia', 0))
      : getProp(this.props, 'cabecera.trmDia', 0);
    if (garantia.trmGarantia) {
      trm = garantia.trmGarantia;
    }
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
        tramo.totalTramo = ((((cargos.trcaCargofijo / 365) * trm) + (parseFloat(cargos.cntrCargovariable) * trm) + (cargos.trcaCargoaoym / 365)) * valoresGarantia.valorFijoTransporte * cantidadContratadaDiaria);
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
      tramos[0].totalFinal = total;
      precioGarantia = parseFloat(precioGarantia.toFixed(7));
      total = parseFloat(total.toFixed(7));
      garantia.bancaria.precioGarantia = precioGarantia + total;
      if (tipoNegocio == 'V') {
        garantia.bancaria.precioFinalGarantia = precioGarantia + total;
      }
      if (tipoNegocio == 'C') {
        if (!garantia.bancaria.precioFinalGarantia) {
          garantia.bancaria.precioFinalGarantia = precioGarantia + total;
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
  obtenerTotalTramos = (tramos, precioGarantia, garantia) => {
    let puntosAsociados = this.obtenerListaAsociadoPorTramo(tramos);
    this.obtenerCantidadContratadaTramo(puntosAsociados, tramos, precioGarantia, garantia);
  };

  /**
   * Calculará el precio de garantia para el contrato de tipo transporte.
   * Además validará si existen o no los valores del tramo (valorCargoVariable, valorCargoFijo, valorCargoAOM)...
   * @param {Number} trm Valor de la trm
   * @return {number}
   */
  calcularPrecioGarantiaTransporte = (precioGarantia, garantia) => {
    const tramos = this.obtenerTramosSeleccionados();
    this.obtenerTotalTramos(tramos, precioGarantia, garantia);
  };

  /**
   * Obtiene la lista de rutas seleccionados.
   * @param {String} tipo Tipo de la ruta
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
   * Método encargado de obtener el total
   * @param {String} tipoRuta Tipo de la ruta
   * @returns {Integer}
   */
  obtenerTotalRutas = (tipoRuta, garantia) => {
    let unidad;
    let total = 0;
    let sumatoria = 0;
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const rutasSeleccionadas = this.obtenerRutasSeleccionadas(tipoRuta);
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    if (idUnidadMedida != "") {
      unidad = this.obtenerUnidad(idUnidadMedida);
    }
    const valoresGarantia = getProp(this.props, 'valoresGarantia', {});
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const tipo = getProp(unidad, 'uniPropiedad.tipo', null);
    rutasSeleccionadas.forEach(r => {
      let precio = r.cntuVlrunitario;
      let cantidadContratada = parseFloat(r.cntuValor);
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
      if (tipoCalculo.tipoCalculo == 'C') {
        precio = (r.valor) ? parseFloat(r.valor) : 0;
      }
      total += (cantidadContratada * precio * valoresGarantia.valorFijoConexionGnc);
    });
    if (unidad && tipo === 'USD') {
      const trmDia = (this.props.cabecera.trmDia ? this.props.cabecera.trmDia : 0);
      let trm = ((this.props.cabecera.trmTecho) ? this.props.cabecera.trmTecho : trmDia);
      if (garantia.trmGarantia) {
        trm = garantia.trmGarantia;
      }
      total = total * trm;
    }
    sumatoria = total;
    total = 0;
    return sumatoria;
  }

  /**
   * Calcula el precio de la garantia para el tipo de contrato GNC o Conexión.
   * @param {String} tipoRuta Tipo de la ruta
   * @return {number}
   */
  calcularPrecioGarantiaGNConexion = (tipoRuta, garantia) => {
    const precioGarantia = this.obtenerTotalRutas(tipoRuta, garantia);
    return precioGarantia;
  };

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
   * Método encargado de obtener el total de la garantia para los contratos de suministro
   * @returns {Integer}
   */
  obtenerTotalMedidores = (garantia) => {
    let unidad;
    let unidadCanasta;
    let tipo;
    let total = 0;
    let sumatoria = 0;
    let medidores = [...this.props.listas.medidores];
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    if (idUnidadMedida != "") {
      unidadCanasta = this.obtenerUnidad(idUnidadMedida);
    }
    const tipoCanasta = getProp(unidadCanasta, 'uniPropiedad.tipo', null);
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const medidoresSeleccionados = this.obtenerMedidoresSeleccionados();
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const valoresGarantia = getProp(this.props, 'valoresGarantia', {});
    medidoresSeleccionados.forEach(m => {
      let precio = 0;
      let cantidadContratada = m.mesuCapacidadmaxima;
      if (tipoCalculo.tipoCalculo == 'C') {
        let medidor = medidores.find(me => me.mesuIderegistro == m.mesuIderegistro);
        unidad = medidor.uniIdemedidaprecio;
        tipo = unidad.uniPropiedad.tipo;
      } else {
        unidad = m.uniIdemedidaprecio;
        tipo = unidad.uniPropiedad.tipo;
      }
      precio = parseFloat(m.mesuPrecio);
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
      if (tipoCalculo.tipoCalculo == 'C') {
        precio = (m.valor) ? parseFloat(m.valor) : 0;
        if (unidadCanasta && tipoCanasta === 'USD') {
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
      total += (precio * cantidadContratada);
    });
    total = total * valoresGarantia.valorFijoCobertura;
    sumatoria = total;
    total = 0;
    return sumatoria;
  }

  /**
   * Calculará el precio de garantia para contrato tipo suministro teniendo en cuenta si el usuario
   * ha seleccionado que se calculara de manera diaria o no diaria.
   * @return {Number}
   */
  calcularPrecioGarantiaSuministro = (garantia) => {
    let precioGarantia = this.obtenerTotalMedidores(garantia);
    return precioGarantia;
  };

  /**
   * Calculará el precio de la garantia para el tipo de contrato ATR.
   * @param {Number} valorTRM Trm de la fecha de negociación
   * @return {number}
   */
  calcularPrecioGarantiaATR = (valorTRM) => {
    let cantidadContratada = getProp(this.props, 'cabecera.cantidadContratada', 0);
    let precioContrato = getProp(this.props, 'cabecera.precioContrato', 0);
    const valoresGarantia = getProp(this.props, 'valoresGarantia', {});
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    if (tipoCalculo.tipoCalculo == 'C') {
      const intervalo = (tipoCalculo.canastaConsumoSuministro) ? tipoCalculo.canastaConsumoSuministro.canastaConRutas[0] : {};
      if (!intervalo || Object.keys(intervalo).length == 0) {
        return 0;
      }
      const sinListas = intervalo.rutas.find(sl => sl.idRangoSin);
      precioContrato = (sinListas.valor) ? parseFloat(sinListas.valor) : 0;
    }
    let precioContratoFinal = this.validarUnidadPrecio(precioContrato, valorTRM);
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
    const precioGarantia = (cantidadContratada * precioContratoFinal * valoresGarantia.valorFijoTransporte);
    return precioGarantia;
  };

  /**
   * Calculará el precio de la garantia para los tipos de contrato suministro gnv y arrendamiendo de skids.
   * @param {Number} valorTRM Trm de la fecha de negociación
   * @return {number}
   */
  calcularPrecioGarantiaGNV = (valorTRM) => {
    let unidad;
    let cantidadContratada = getProp(this.props, 'cabecera.cantidadContratada', 0);
    let precioContrato = getProp(this.props, 'cabecera.precioContrato', 0);
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const valoresGarantia = getProp(this.props, 'valoresGarantia', {});
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    if (tipoCalculo.tipoCalculo == 'C') {
      const intervalo = (tipoCalculo.canastaConsumoSuministro) ? tipoCalculo.canastaConsumoSuministro.canastaConRutas[0] : {};
      if (!intervalo || Object.keys(intervalo).length == 0) {
        return 0;
      }
      const sinListas = intervalo.rutas.find(sl => sl.idRangoSin);
      precioContrato = (sinListas.valor) ? parseFloat(sinListas.valor) : 0;
    }
    let precioContratoFinal = this.validarUnidadPrecio(precioContrato, valorTRM);
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
    const precioGarantia = (cantidadContratada * precioContratoFinal * valoresGarantia.valorFijoCobertura);
    return precioGarantia;
  };

  /**
   * Calcula el precio de la garantia.
   * @param {Object} garantia Datos de la garantia
   * @return {Number}
   */
  calcularPrecioGarantia = (garantia) => {
    if (!this.props.garantia.bancaria) {
      this.props.actualizarGarantia(garantia);
      return 0;
    }
    const { tipoContrato } = this.props.garantia.bancaria;
    const tiposContratoProps = this.props.tiposContrato;
    const { tiposContrato } = this.props.listas;
    const esTipoTransporte = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'T'));
    const esSuministro = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'S');
    const esGnc = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNC'));
    const esATR = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'));
    const esSkids = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'));
    const esGNVS = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'));
    const esConexion = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'CNX'));
    const tipoNegocio = getProp(this.props, 'cabecera.tipoNegocio', '');
    const tiposSinListas = tiposContrato.filter(t => t.seleccionado &&
      (getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'));
    let valorTRM = getProp(this.props, 'cabecera.usaTRMTecho', 0) == 'S' ?
      Math.min(getProp(this.props, 'cabecera.trmTecho'), getProp(this.props, 'cabecera.trmDia', 0))
      : getProp(this.props, 'cabecera.trmDia', 0);
    if (garantia.trmGarantia) {
      valorTRM = garantia.trmGarantia;
    }
    let precioGarantia = 0;
    if (esSuministro) {
      const totalMedidores = this.calcularPrecioGarantiaSuministro(garantia);
      precioGarantia += totalMedidores;
    }

    if (esGnc) {
      const TotalRutasGnc = this.calcularPrecioGarantiaGNConexion('G', garantia);
      precioGarantia += TotalRutasGnc;
    }

    if (esConexion) {
      const TotalRutasConexion = this.calcularPrecioGarantiaGNConexion('C', garantia);
      precioGarantia += TotalRutasConexion;
    }

    if (Util.validarArreglo(tiposSinListas)) {
      if (tiposSinListas.length > 1) {
        if (tipoContrato != null) {
          if (tipoContrato == tiposContratoProps.ATR.codigo) {
            const totalAtr = this.calcularPrecioGarantiaATR(valorTRM);
            precioGarantia += totalAtr;
          }
          if (tipoContrato == tiposContratoProps.GNV_SUMINISTRO.codigo || tipoContrato == tiposContratoProps.GNV.codigo) {
            const totalAtr = this.calcularPrecioGarantiaGNV(valorTRM);
            precioGarantia += totalAtr;
          }
        }
      } else {
        if (esATR) {
          const totalAtr = this.calcularPrecioGarantiaATR(valorTRM);
          precioGarantia += totalAtr;
        }
        if ((esGNVS || esSkids)) {
          const totalAtr = this.calcularPrecioGarantiaGNV(valorTRM);
          precioGarantia += totalAtr;
        }
      }
    }

    if (esTipoTransporte) {
      this.calcularPrecioGarantiaTransporte(precioGarantia, garantia);
    }

    if (isNaN(precioGarantia)) {
      precioGarantia = 0;
    }

    if (isNaN(precioGarantia) && tipoContrato == tiposContrato.TRANSPORTE.codigo) {
      return;
    }

    garantia.bancaria.precioGarantia = parseFloat(precioGarantia.toFixed(7));
    if (tipoNegocio == 'V') {
      garantia.bancaria.precioFinalGarantia = parseFloat(precioGarantia.toFixed(7));
    }
    if (tipoNegocio == 'C') {
      if (!garantia.bancaria.precioFinalGarantia) {
        garantia.bancaria.precioFinalGarantia = parseFloat(precioGarantia.toFixed(7));
      }
    }
    this.props.actualizarGarantia(garantia);

    return precioGarantia;
  };

  /**
   * Obtiene la lista de los tipos de contrato seleccionados por el usuario.
   * @return {Array}
   */
  obtenerListaTiposContratos = () => {
    const { tiposContrato } = this.props.listas;
    return tiposContrato.filter(t => t.seleccionado &&
      (getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'));
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
    const idUnidadMedidaPrecio = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    let unidadContratada = tramos[0].cargos.uniIdemedidavariable;
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
          </tr>
        </thead>
        <tbody>
          {tramos.map(tramo => {
            tramo.cargosSeleccionados = tramo.listaCargos.filter(lc => lc.seleccionado);
            return (
              <tr>
                <td>{(tramo.trmNombre) ? tramo.trmNombre : tramo.nombre}</td>
                <td>{(tramo.cantidadContratada) ? tramo.cantidadContratada + ' ' + unidadContratada.uniPropiedad.capacidad : 0}</td>
                <td>{tramo.cargosSeleccionados[0].trcaCargofijo}</td>
                <td>{tramo.cargosSeleccionados[0].cntrCargovariable}</td>
                <td>{tramo.cargosSeleccionados[0].trcaCargoaoym}</td>
              </tr>
            );
          })
          }
        </tbody>
      </table>
    );
  }

  /**
   * Método encargado de mostrar la tabla de rutas o medidores según sea el caso
   * @param {String} titulo Titulo de la primera columna de la tabla
   * @param {Object} lista Lista a recorrer ya sea medidores o rutas
   */
  renderTabla = (titulo, lista) => {
    let unidad, unidadPrecio;
    const rutas = [...this.props.listas.rutas];
    const medidores = [...this.props.listas.medidores];
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
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
          </tr>
        </thead>
        <tbody>
          {lista.map(ele => {
            let unidadRuta;
            let unidadMedidor;
            if (ele.cntuValor) {
              unidadRuta = this.obtenerUnidad(ele.uniIdemedida);
              if (typeof unidadRuta == 'undefined') {
                let ruta = rutas.find(ru => ru.uniIderegistro == ele.uniIderegistro);
                unidadRuta = this.obtenerUnidad(ruta.uniIdemedida);
              }
              ele.unidadRuta = unidadRuta;
            }
            if (ele.mesuCapacidadmaxima) {
              if (tipoCalculo.tipoCalculo == 'C') {
                let medidor = medidores.find(me => me.mesuIderegistro == ele.mesuIderegistro);
                unidadMedidor = medidor.uniIdemedida;
                ele.uniIdemedida = unidadMedidor;
              }
            }
            return (
              <tr>
                <td>{(ele.nombre) ? ele.nombre : (ele.uniNombre1) ? ele.uniNombre1 : ele.mesuNombre}</td>
                <td>{(typeof ele.valor != 'undefined') ?
                  ele.valor + ' ' + getProp(unidadPrecio, 'uniNombre1', '') :
                  (typeof ele.cntuVlrunitario != 'undefined') ?
                    ele.cntuVlrunitario + ' ' + getProp(unidadPrecio, 'uniNombre1', '') :
                    ele.mesuPrecio + ' ' + getProp(ele.uniIdemedidaprecio, 'uniNombre1', '')}</td>
                <td>{(ele.cntuValor) ? ele.cntuValor + ' ' + ele.unidadRuta.uniNombre1 : ele.mesuCapacidadmaxima + ' ' + ele.uniIdemedida.uniNombre1}</td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
    );
  }

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
   * Retornará el DOM del componente.
   * @return {string}
   */
  render() {
    const { tiposContrato } = this.props.listas;
    const esTipoTransporte = tiposContrato.find(t => t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'T'));
    const esSuministro = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'S');
    const usaRutas = tiposContrato.filter(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'CNX' || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNC'));
    let precio = 0;
    let trm = null;
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    const tiposSinListas = tiposContrato.filter(t => t.seleccionado &&
      (getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'));
    const activarTipoContrato = tiposContrato.filter(t => t.seleccionado &&
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
      const sinListas = intervalo.rutas.find(sl => sl.idRangoSin);
      if (typeof sinListas != 'undefined') {
        precio = (sinListas.valor) ? parseFloat(sinListas.valor) : 0;
      }
    }
    if (this.props.garantia.trmGarantia) {
      trm = this.props.garantia.trmGarantia;
    }
    return (
      <div>
        <div className='row col-12 poliza-contratos mt-5'>
          <Fecha
            label='Fecha Inicial Cobertura:'
            name='fechaInicial'
            fechaInicio={null}
            fechaFin={getProp(this.props, 'garantia.bancaria.fechaFin', '')}
            value={getProp(this.props, 'garantia.bancaria.fechaInicial', '')}
            fecha={getProp(this.props, 'garantia.bancaria.fechaInicial', '')}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha Fin Cobertura:'
            name='fechaFin'
            value={getProp(this.props, 'garantia.bancaria.fechaFin', '')}
            fechaInicio={getProp(this.props, 'garantia.bancaria.fechaInicial', '')}
            fechaFin={null}
            fecha={getProp(this.props, 'garantia.bancaria.fechaFin', '')}
            onChange={this.controlarCambio}
          />
          <Fecha
            label='Fecha TRM:'
            name='fechaTrm'
            value={getProp(this.props, 'garantia.bancaria.fechaTrm', '')}
            fecha={getProp(this.props, 'garantia.bancaria.fechaTrm', '')}
            onChange={this.controlarCambio}
          />
          {Util.validarArreglo(activarTipoContrato) &&
            <Combo
              key={Util.generarIdControl('tiposContratos')}
              opciones={this.obtenerListaTiposContratos()}
              propTexto='uniNombre1'
              propValor='uniPropiedad.tipocontrato'
              label='Tipo Contrato:'
              name='tipoContrato'
              value={getProp(this.props, 'garantia.bancaria.tipoContrato', '')}
              onChange={this.controlarCambio}
            />
          }
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
            label='Precio Garantía Ban:'
            value={getProp(this.props, 'garantia.bancaria.precioGarantia', '')}
            name='precioGarantia'
            extra={{ disabled: true }}
          />
          {getProp(this.props, 'garantia.bancaria.precioGarantia', '') != '' &&
            <TextoNumerico
              aceptaDecimales={true}
              aceptaNegativos={false}
              label='Precio Final de garantia:'
              cols={4}
              onChange={this.controlarCambio}
              value={getProp(this.props, 'garantia.bancaria.precioFinalGarantia', getProp(this.props, 'garantia.bancaria.precioGarantia'))}
              name='precioFinalGarantia'
              extra={{ disabled: desabilitar }}
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
          {Util.validarArreglo(usaRutas) &&
            this.renderCalculorutas()
          }
          {esSuministro &&
            this.renderCalculoMedidores()
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

/**
 * Se definen los tipos de dato de los prototipos que recibe el componente.
 */
GarantiaBancaria.propTypes = {
  mostrarAlerta: PropTypes.func,
  actualizarGarantia: PropTypes.func,
  garantia: PropTypes.object,
  tiposContrato: PropTypes.object
};

/**
 * Se exporta el componente.
 */
export { GarantiaBancaria };
