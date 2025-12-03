import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { get as getProp } from 'object-path';
import { actualizarCabeceraRevision, actualizarDispercion, actualizarFacturas, actualizarListasRevision, limpiarRevision } from '../../../../store/actions/RevisionFacturaAcciones';
import PropTypes from 'prop-types';
import { Botonera, Combo, VentanaModal, Util, Fecha, Input } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { RConsultaContratos } from '../../../contratos/ConsultaContratos'
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { formatearArray, limpiarJson, limpiarObjeto, TIPOS_UNIDADES_MEDIDA, } from '../../../../global/util_nominaciones';
import { CONCEPTOS_VALIDACION_FACTURA } from '../../../../global/constantes';
import { RDispercionConsumos } from './Componentes/DispercionConsumos';
import { FacturasComponent } from './Componentes/FacturasComponent';
import { RFacturasComponentConsulta } from './Componentes/FacturasComponentConsulta';
import { RDispercionConsumosConsulta } from './Componentes/DispercionConsumosConsulta'
import './GestionRevisionFacturas.scss';
import { toast } from 'react-toastify';
import ReactExport from "react-export-excel-fixed-xlsx";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const listaProcesos = [
  { texto: 'Revisión Factura', id: 'V' },
  { texto: 'Dispersión', id: 'DP' }
];

class RevisionFacturas extends Component {

  state = {
    //estados
    modalContratos: false,
    modalConsultaValidacion: false,
    modalFactura: false,
    modalDispersion: false
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.MONEDA })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.props.actualizarListasRevision({ listaUnidadesPrecio: respuesta.data.datos });
        }
      });
  };

  /**
   * @method
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    const cabecera = limpiarObjeto(this.props.cabecera);
    const facturas = limpiarObjeto(this.props.facturas);
    const dispercion = limpiarObjeto(this.props.dispercion);
    this.actualizarCabeceraRedux(cabecera);
    this.actualizarFacturaRedux(facturas);
    this.actualizarDispercionRedux(dispercion);
    this.props.actualizarListasRevision({
      listaPuntosAgregados: [],
      listaPuntosSalida: [],
      listaPuntosDispercion: []
    });
    this.setState({
      modalContratos: false,
      modalConsultaValidacion: false,
      modalFactura: false,
      modalDispersion: false
    });
  };

  /**
   * Método encargado de actualizar el objeto redux de la cabecera
   * @param {Object} nuevoCambio Cambio a realizar
   */
  actualizarCabeceraRedux = (nuevoCambio) => {
    this.props.actualizarCabeceraRevision({
      ...this.props.cabecera,
      ...nuevoCambio
    });
  };

  /**
   * Método encargado de actualizar el objeto redux de la disperción
   * @param {Object} nuevoCambio Cambio a realizar
   */
  actualizarDispercionRedux = (nuevoCambio) => {
    this.props.actualizarDispercion({
      ...this.props.dispercion,
      ...nuevoCambio
    });
  };

  /**
   * Método encargado de actualizar el objeto redux de las facturas
   * @param {Object} nuevoCambio Cambio a realizar
   */
  actualizarFacturaRedux = (nuevoCambio) => {
    this.props.actualizarFacturas({
      ...this.props.facturas,
      ...nuevoCambio
    });
  };

  /**
   * @method
   * Método encargado de obtener los datos de puntos de salida para el reporte
   * @returns {Array}
   */
  obtenerDataPuntosSalida = () => {
    const lista = [...this.props.listas.listaPuntosAgregados];
    let listaFinal = [];
    for (let index = 0; index < lista.length; index++) {
      const dato = lista[index];
      for (let jindex = 0; jindex < dato.detallesPuntoSalida.length; jindex++) {
        const detalle = dato.detallesPuntoSalida[jindex];
        if (detalle.rfpsTipo == 'PR') {
          listaFinal.push({
            punto: getProp(detalle.ptsaIderegistro, 'ptsaNombre'),
            rfpsCantcntdiaria: getProp(detalle, 'rfpsCantcntdiaria').toFixed(JSON.parse(detalle.cantcntdiaria.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCantnominada: getProp(detalle, 'rfpsCantnominada').toFixed(JSON.parse(detalle.cantnominada.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCarfijcalculado: getProp(detalle, 'rfpsCarfijcalculado').toFixed(JSON.parse(detalle.carfijcalculado.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCarvarcalculado: getProp(detalle, 'rfpsCarvarcalculado').toFixed(JSON.parse(detalle.carvarcalculado.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCaraoimcalculado: getProp(detalle, 'rfpsCaraoimcalculado').toFixed(JSON.parse(detalle.caraoimcalculado.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsBaseusd: getProp(detalle, 'rfpsBaseusd').toFixed(JSON.parse(detalle.baseusd.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCuofombusd: getProp(detalle, 'rfpsCuofombusd').toFixed(JSON.parse(detalle.cuofombusd.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCuofombpesos: getProp(detalle, 'rfpsCuofombpesos').toFixed(JSON.parse(detalle.cuofombpesos.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsBasepesos: getProp(detalle, 'rfpsBasepesos').toFixed(JSON.parse(detalle.basepesos.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCuofombusdpesos: getProp(detalle, 'rfpsCuofombusdpesos').toFixed(JSON.parse(detalle.cuofombusdpesos.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsBaseimpuestousd: getProp(detalle, 'rfpsBaseimpuestousd').toFixed(JSON.parse(detalle.baseimpuestousd.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsImptranpusd: getProp(detalle, 'rfpsImptranpusd').toFixed(JSON.parse(detalle.imptranpusd.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsImptranpesos: getProp(detalle, 'rfpsImptranpesos').toFixed(JSON.parse(detalle.imptranpesos.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsBaseimpuestopesos: getProp(detalle, 'rfpsBaseimpuestopesos').toFixed(JSON.parse(detalle.baseimpuestopesos.uniUnidad.uniPropiedad).decimalesVisualiza),
            ptsaIderegistro: detalle.ptsaIderegistro
          });
        }
      }
    }
    return listaFinal;
  }

  /**
   * @method
   * Método encargado de obtener los datos de puntos de salida para el reporte
   * @returns {Array}
   */
  obtenerDataDesvios = () => {
    const lista = [...this.props.listas.listaPuntosAgregados];
    let listaFinal = [];
    for (let index = 0; index < lista.length; index++) {
      const dato = lista[index];
      for (let jindex = 0; jindex < dato.detallesPuntoSalida.length; jindex++) {
        const detalle = dato.detallesPuntoSalida[jindex];
        if (detalle.rfpsTipo == 'DS') {
          listaFinal.push({
            punto: getProp(detalle.ptsaIderegistro, 'ptsaNombre'),
            puntoOrigen: getProp(detalle.desIderegistro.desvioPuntoSalida, 'ptsaPuntosalidaorigen.ptsaNombre', ''),
            rfpsCantnominada: getProp(detalle, 'rfpsCantnominada').toFixed(JSON.parse(detalle.cantnominada.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCarvarcalculado: getProp(detalle, 'rfpsCarvarcalculado').toFixed(JSON.parse(detalle.carvarcalculado.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsBaseusd: getProp(detalle, 'rfpsBaseusd').toFixed(JSON.parse(detalle.baseusd.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCuofombusd: getProp(detalle, 'rfpsCuofombusd').toFixed(JSON.parse(detalle.cuofombusd.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCuofombpesos: getProp(detalle, 'rfpsCuofombpesos').toFixed(JSON.parse(detalle.cuofombpesos.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsBasepesos: getProp(detalle, 'rfpsBasepesos').toFixed(JSON.parse(detalle.basepesos.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsCuofombusdpesos: getProp(detalle, 'rfpsCuofombusdpesos').toFixed(JSON.parse(detalle.cuofombusdpesos.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsBaseimpuestousd: getProp(detalle, 'rfpsBaseimpuestousd').toFixed(JSON.parse(detalle.baseimpuestousd.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsImptranpusd: getProp(detalle, 'rfpsImptranpusd').toFixed(JSON.parse(detalle.imptranpusd.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsImptranpesos: getProp(detalle, 'rfpsImptranpesos').toFixed(JSON.parse(detalle.imptranpesos.uniUnidad.uniPropiedad).decimalesVisualiza),
            rfpsBaseimpuestopesos: getProp(detalle, 'rfpsBaseimpuestopesos').toFixed(JSON.parse(detalle.baseimpuestopesos.uniUnidad.uniPropiedad).decimalesVisualiza),
          });
        }
      }
    }
    return listaFinal;
  }

  /**
   * @method
   * Método encargado de obtener los datos de tramos para el reporte
   * @returns {Array}
   */
  obtenerDataTramos = () => {
    const lista = [...this.props.listas.listaPuntosAgregados];
    let listaFinal = [];
    for (let index = 0; index < lista.length; index++) {
      const dato = lista[index];
      for (let jindex = 0; jindex < dato.detallesTramo.length; jindex++) {
        const datosTramo = dato.detallesTramo[jindex];
        listaFinal.push({
          tramo: getProp(datosTramo.cntrIderegistro, 'trcaIdetramocargo.trmIderegistro.trmNombre', ''),
          contrato: getProp(datosTramo.cntrIderegistro, 'cntIdecontrato.cntNumero', ''),
          cargoFijo: getProp(datosTramo.cntrIderegistro, 'trcaIdetramocargo.trcaCargofijo', ''),
          cargoVariable: getProp(datosTramo.cntrIderegistro, 'trcaIdetramocargo.trcaCargovariable', ''),
          cargoAom: getProp(datosTramo.cntrIderegistro, 'trcaIdetramocargo.trcaCargoaoym', ''),
          rftrCrfmensual: getProp(datosTramo, 'rftrCrfmensual', '').toFixed(JSON.parse(datosTramo.crfmensual.uniUnidad.uniPropiedad).decimalesVisualiza),
          rftrCraoimmensual: getProp(datosTramo, 'rftrCraoimmensual', '').toFixed(JSON.parse(datosTramo.craoimmensual.uniUnidad.uniPropiedad).decimalesVisualiza),
          rftrCrfdiario: getProp(datosTramo, 'rftrCrfdiario', '').toFixed(JSON.parse(datosTramo.crfdiario.uniUnidad.uniPropiedad).decimalesVisualiza),
          rftrCraoymdiario: getProp(datosTramo, 'rftrCraoymdiario', '').toFixed(JSON.parse(datosTramo.craoymdiario.uniUnidad.uniPropiedad).decimalesVisualiza)
        });
      }
    }
    return listaFinal;
  }

  /**
   * @method
   * Método encargado de obtener los datos de consolidación y validación para el reporte
   * @returns {Array}
   */
  obtenerDataConsolidacion = () => {
    const lista = [...this.props.listas.listaPuntosAgregados];
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    const listaFinal = this.procesarListaFinal(lista);
    return listaFinal;
  }

  /**
   * @method
   * Método encargado de generar el boton para descargar el reporte
   * @returns {Component}
   */
  generarReporteValidacion = () => {
    if (!Util.validarArreglo(getProp(this.props.listas, 'listaPuntosAgregados', []))) {
      return;
    }
    return (
      <ExcelFile element={<button className='btn btn-primary botonBotonera'>Generar Archivo</button>}>
        <ExcelSheet data={this.obtenerDataPuntosSalida} name="Resumen Puntos de Salida">
          <ExcelColumn label="Punto de Salida" value="punto" />
          <ExcelColumn label="Cantidad Contratada Diaria(KPC)" value="rfpsCantcntdiaria" />
          <ExcelColumn label="Cantidad Nominada Propia(KPC)" value="rfpsCantnominada" />
          <ExcelColumn label="Cargo Fijo Calculado" value="rfpsCarfijcalculado" />
          <ExcelColumn label="Cargo Variable Calculado" value="rfpsCarvarcalculado" />
          <ExcelColumn label="Cargo AO&M Calculado" value="rfpsCaraoimcalculado" />
          <ExcelColumn label="Base USD" value="rfpsBaseusd" />
          <ExcelColumn label="Cuota Fomento Base USD" value="rfpsCuofombusd" />
          <ExcelColumn label="Cuota Fomento en Pesos" value="rfpsCuofombpesos" />
          <ExcelColumn label="Base Pesos" value="rfpsBasepesos" />
          <ExcelColumn label="Cuota Fomento Base Pesos" value="rfpsCuofombusdpesos" />
          <ExcelColumn label="Base Impuesto USD" value="rfpsBaseimpuestousd" />
          <ExcelColumn label="Impuesto Transporte USD" value="rfpsImptranpusd" />
          <ExcelColumn label="Base Impuesto Pesos" value="rfpsBaseimpuestopesos" />
          <ExcelColumn label="Impuesto Transporte Pesos" value="rfpsImptranpesos" />
        </ExcelSheet>
        <ExcelSheet data={this.obtenerDataTramos} name="Resumen Tramos">
          <ExcelColumn label="Tramo" value="tramo" />
          <ExcelColumn label="Contrato" value="contrato" />
          <ExcelColumn label="Cargo Fijo(Usd/kpc)" value="cargoFijo" />
          <ExcelColumn label="Cargo Variable(Usd/kpc)" value="cargoVariable" />
          <ExcelColumn label="Cargo AO&M($/kpc)" value="cargoAom" />
          <ExcelColumn label="Cargo Fijo Mensual" value="rftrCrfmensual" />
          <ExcelColumn label="Cargo AO&M Mensual" value="rftrCraoimmensual" />
          <ExcelColumn label="Cargo Fijo Diario" value="rftrCrfdiario" />
          <ExcelColumn label="Cargo AO&M Diario" value="rftrCraoymdiario" />
        </ExcelSheet>
        <ExcelSheet data={this.obtenerDataDesvios} name="Resumen Desvios">
          <ExcelColumn label="Punto de Salida" value="punto" />
          <ExcelColumn label="Punto de Salida Origen" value="puntoOrigen" />
          <ExcelColumn label="Cantidad Nominada (KPC)" value="rfpsCantnominada" />
          <ExcelColumn label="Cargo Variable Calculado" value="rfpsCarvarcalculado" />
          <ExcelColumn label="Base USD" value="rfpsBaseusd" />
          <ExcelColumn label="Cuota Fomento Base USD" value="rfpsCuofombusd" />
          <ExcelColumn label="Cuota Fomento en Pesos" value="rfpsCuofombpesos" />
          <ExcelColumn label="Base Pesos" value="rfpsBasepesos" />
          <ExcelColumn label="Cuota Fomento Base Pesos" value="rfpsCuofombusdpesos" />
          <ExcelColumn label="Base Impuesto USD" value="rfpsBaseimpuestousd" />
          <ExcelColumn label="Impuesto Transporte USD" value="rfpsImptranpusd" />
          <ExcelColumn label="Base Impuesto Pesos" value="rfpsBaseimpuestopesos" />
          <ExcelColumn label="Impuesto Transporte Pesos" value="rfpsImptranpesos" />
        </ExcelSheet>
        <ExcelSheet data={this.obtenerDataConsolidacion} name="Consolidación Y Validación">
          <ExcelColumn label="Concepto" value="concepto" />
          <ExcelColumn label="Dolares" value="valorDolares" />
          <ExcelColumn label="Pesos" value="valorPesos" />
        </ExcelSheet>
      </ExcelFile>
    );
  }

  /**
   * @method
   * Método encargado de obtener la data los puntos de consumo para el reporte
   * @returns {Array}
   */
  obtenerDataPuntosConsumo = () => {
    const lista = [...this.props.listas.listaPuntosAgregados];
    let listaFinal = [];
    for (let index = 0; index < lista.length; index++) {
      const dato = lista[index];
      for (let jindex = 0; jindex < dato.detallesPuntoConsumo.length; jindex++) {
        const detalle = dato.detallesPuntoConsumo[jindex];
        listaFinal.push({
          punto: getProp(detalle.ptcIderegistro, 'ptcoNombre', ''),
          dcpcLectura: getProp(detalle, 'dcpcLectura').toFixed(JSON.parse(detalle.lectura.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcPorpunto: getProp(detalle, 'dcpcPorpunto').toFixed(JSON.parse(detalle.porpunto.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCntnommbtu: getProp(detalle, 'dcpcCntnommbtu').toFixed(JSON.parse(detalle.cntnommbtu.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCntnomkpc: getProp(detalle, 'dcpcCntnomkpc').toFixed(JSON.parse(detalle.cntnomkpc.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCntnommc: getProp(detalle, 'dcpcCntnommc').toFixed(JSON.parse(detalle.cntnommc.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcPorparpto: getProp(detalle, 'dcpcPorparpto').toFixed(JSON.parse(detalle.porparpto.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCarfijpto: getProp(detalle, 'dcpcCarfijpto').toFixed(JSON.parse(detalle.carfijpto.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCarvarpto: getProp(detalle, 'dcpcCarvarpto').toFixed(JSON.parse(detalle.carvarpto.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCaraoimpto: getProp(detalle, 'dcpcCaraoimpto').toFixed(JSON.parse(detalle.caraoimpto.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcImpttepto: getProp(detalle, 'dcpcImpttepto').toFixed(JSON.parse(detalle.impttepto.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCuofompto: getProp(detalle, 'dcpcCuofompto').toFixed(JSON.parse(detalle.cuofompto.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCarfijdmes: getProp(detalle, 'dcpcCarfijdmes').toFixed(JSON.parse(detalle.carfijdmes.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCarvarusdkpc: getProp(detalle, 'dcpcCarvarusdkpc').toFixed(JSON.parse(detalle.carvarusdkpc.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCaraoimkpcmes: getProp(detalle, 'dcpcCaraoimkpcmes').toFixed(JSON.parse(detalle.caraoimkpcmes.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcSubtotal: getProp(detalle, 'dcpcSubtotal').toFixed(JSON.parse(detalle.subtotal.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcTotcostrans: getProp(detalle, 'dcpcTotcostrans').toFixed(JSON.parse(detalle.totcostrans.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCosttekpc: getProp(detalle, 'dcpcCosttekpc').toFixed(JSON.parse(detalle.costtekpc.uniUnidad.uniPropiedad).decimalesVisualiza),
          dcpcCosttemc: getProp(detalle, 'dcpcCosttemc').toFixed(JSON.parse(detalle.costtemc.uniUnidad.uniPropiedad).decimalesVisualiza)
        });
      }
    }
    return listaFinal;
  };

  /**
   * @method
   * Método encargado de generar el boton para descargar el reporte
   * @returns {Component}
   */
  generarReporteDispercion = () => {
    if (!Util.validarArreglo(getProp(this.props.listas, 'listaPuntosAgregados', []))) {
      return;
    }
    return (
      <ExcelFile element={<button className='btn btn-primary botonBotonera'>Generar Archivo</button>}>
        <ExcelSheet data={getProp(this.props, 'listas.listaPuntosAgregados', [])} name="Resumen Puntos de Salida">
          <ExcelColumn label="Punto de Salida" value="punto" />
          <ExcelColumn label="Cantidad Contratada Diaria(KPC)" value="dcpsCancntkpc" />
          <ExcelColumn label="Cantidad Contrata Diaria(MBT)" value="dcpsCancntmbtu" />
          <ExcelColumn label="Cantidad Contrata Diaria(M3)" value="dcpsCancntmc" />
          <ExcelColumn label="Cantidad Nominada Propia(MBTU)" value="dcpsCannompropia" />
          <ExcelColumn label="Cantidad Nominada Terceros(MBTU)" value="dcpsCantnomterceros" />
          <ExcelColumn label="Cargo Fijo Calculado" value="rfpsCarfijcalculado" />
          <ExcelColumn label="Cargo Variable Calculado" value="rfpsCarvarcalculado" />
          <ExcelColumn label="Cargo AO&M Calculado" value="rfpsCaraoimcalculado" />
          <ExcelColumn label="Cuota Fomento Base USD" value="rfpsCuofombusd" />
          <ExcelColumn label="Cuota Fomento en Pesos" value="rfpsCuofombpesos" />
          <ExcelColumn label="Impuesto Transporte USD" value="rfpsImptranpusd" />
          <ExcelColumn label="Impuesto Transporte Pesos" value="rfpsImptranpesos" />
          <ExcelColumn label="TRM" value="dcpsTrm" />
          <ExcelColumn label="Poder Calorifico" value="dcpsPodercal" />
        </ExcelSheet>
        <ExcelSheet data={this.obtenerDataPuntosConsumo} name="Puntos de Consumo Propios">
          <ExcelColumn label="Punto de Consumo" value="punto" />
          <ExcelColumn label="Lectura Del Periodo (MBTU)" value="dcpcLectura" />
          <ExcelColumn label="Cantidad Nominada (KPC)" value="dcpcCntnomkpc" />
          <ExcelColumn label="Cantidad Nominada (MBTU)" value="dcpcCntnommbtu" />
          <ExcelColumn label="Cantidad Nominada (M3)" value="dcpcCntnommc" />
          <ExcelColumn label="Porcentaje Par Punto" value="dcpcPorpunto" />
          <ExcelColumn label="Cargo Fijo Punto" value="dcpcCarfijpto" />
          <ExcelColumn label="Cargo Variable Punto" value="dcpcCarvarpto" />
          <ExcelColumn label="Cargo AO&M Punto" value="dcpcCaraoimpto" />
          <ExcelColumn label="Impuesto Transporte Punto" value="dcpcImpttepto" />
          <ExcelColumn label="Cuota Fomento Punto" value="dcpcCuofompto" />
          <ExcelColumn label="Cargo Fijo (USD/kpc/mes)" value="dcpcCarfijdmes" />
          <ExcelColumn label="Cargo Variable (USD/kpc)" value="dcpcCarvarusdkpc" />
          <ExcelColumn label="Cargo AO&M($/kpc/MES)" value="dcpcCaraoimkpcmes" />
          <ExcelColumn label="Sub Total" value="dcpcSubtotal" />
          <ExcelColumn label="Total Costo Transporte" value="dcpcTotcostrans" />
          <ExcelColumn label="cop/kpc" value="dcpcCosttekpc" />
          <ExcelColumn label="cop/m3" value="dcpcCosttemc" />
        </ExcelSheet>
      </ExcelFile>
    );
  }

  /**
   * @method
   * Método encargado de buscar los conceptos en una lista
   * @param {Array} listaFinal Lista con los conceptos a buscar
   * @param {String} concepto Nombre del concepto
   */
  buscarConceptos = (listaFinal, concepto) => {
    return listaFinal.find(c => c.idConcepto == concepto);
  }

  /**
   * @method
   * Método encargado de obtener los totales para la consolidación
   * @param {Array} listaFinal Lista de conceptos
   * @returns {Object}
   */
  obtenerTotalesConsolidacion = (listaFinal) => {
    const servicioDolares = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.SERVICIO_TRANSPORTE_FIRME_DOLAR);
    const servicioPesos = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.SERVICIO_TRANSPORTE_FIRME_PESOS);
    const cuotaDolar = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.CUOTA_FOMENTO_BASE_USD);
    const cuotaPesos = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.CUOTA_FOMENTO_BASE_$);
    const impuestoDolar = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.IMPUESTO_TRANSPORTE_BASE_USD);
    const impuestoPesos = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.IMPUESTO_TRANSPORTE_BASE_$);
    const desvios = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.DESVIOS);
    const total = (servicioPesos.valorPesos + cuotaDolar.valorPesos + cuotaPesos.valorPesos +
      impuestoDolar.valorPesos + impuestoPesos.valorPesos +
      ((desvios.valorDolares + servicioDolares.valorDolares) * getProp(this.props, 'facturas.trmPeriodo')));
    const totalPorcentaje = (total * getProp(this.props.cabecera, 'contrato.cntPorcencomercial', 0));
    const listaTotales = [
      { titulo: 'Total', valor: total },
      { titulo: 'Porcentaje de Comercialización', valor: totalPorcentaje },
      { titulo: 'Valor en la Factura', valor: getProp(this.props, 'facturas.valorFactura') },
      { titulo: 'Diferencia', valor: (total + totalPorcentaje - parseFloat(getProp(this.props, 'facturas.valorFactura'))) },
    ];
    return listaTotales;
  }

  /**
   * @method
   * Método encargado de obtener la lista de consolidación y validación
   * @param {Array} lista Lista de puntos agregados
   * @returns {Array}
   */
  procesarListaFinal = (lista) => {
    let listaFinal = [];
    const totalesDesvios = this.obtenerTotalesPuntosSalida(lista, 'DS');
    const totalesPuntosSalida = this.obtenerTotalesPuntosSalida(lista, 'PR');
    const descuentos = getProp(this.props, 'facturas.descuento', 0);
    const unidadDescuento = getProp(this.props, 'listas.listaUnidadesPrecio', []).find(un => un.uniIderegistro == getProp(this.props, 'facturas.unidadDescuento', ''));
    listaFinal.push({
      concepto: 'Servicio Transporte en Firme Dolares',
      valorDolares: (totalesPuntosSalida.rfpsCarfijcalculado + totalesPuntosSalida.rfpsCarvarcalculado),
      valorPesos: '',
      idConcepto: CONCEPTOS_VALIDACION_FACTURA.SERVICIO_TRANSPORTE_FIRME_DOLAR
    });
    listaFinal.push({
      concepto: 'Servicio Transporte en Firme Pesos',
      valorDolares: '',
      valorPesos: totalesPuntosSalida.rfpsCaraoimcalculado,
      idConcepto: CONCEPTOS_VALIDACION_FACTURA.SERVICIO_TRANSPORTE_FIRME_PESOS
    });
    listaFinal.push({
      concepto: 'Cuota Fomento Base USD',
      valorDolares: (totalesPuntosSalida.rfpsCuofombusd + totalesDesvios.rfpsCuofombusd),
      valorPesos: (totalesDesvios.rfpsCuofombpesos + totalesPuntosSalida.rfpsCuofombpesos),
      idConcepto: CONCEPTOS_VALIDACION_FACTURA.CUOTA_FOMENTO_BASE_USD
    });
    listaFinal.push({
      concepto: 'Cuota Fomento Base $',
      valorDolares: '',
      valorPesos: (totalesDesvios.rfpsCuofombusdpesos + totalesPuntosSalida.rfpsCuofombusdpesos),
      idConcepto: CONCEPTOS_VALIDACION_FACTURA.CUOTA_FOMENTO_BASE_$
    });
    listaFinal.push({
      concepto: 'Impuesto Transporte Base USD',
      valorDolares: (totalesDesvios.rfpsImptranpusd + totalesPuntosSalida.rfpsImptranpusd),
      valorPesos: ((totalesDesvios.rfpsImptranpusd + totalesPuntosSalida.rfpsImptranpusd) * getProp(this.props, 'facturas.trmPeriodo')),
      idConcepto: CONCEPTOS_VALIDACION_FACTURA.IMPUESTO_TRANSPORTE_BASE_USD
    });
    listaFinal.push({
      concepto: 'Impuesto Transporte Base $ ',
      valorDolares: '',
      valorPesos: (totalesDesvios.rfpsImptranpesos + totalesPuntosSalida.rfpsImptranpesos),
      idConcepto: CONCEPTOS_VALIDACION_FACTURA.IMPUESTO_TRANSPORTE_BASE_$
    });
    listaFinal.push({
      concepto: 'Descuentos ',
      valorDolares: (typeof unidadDescuento != 'undefined' || unidadDescuento == null) ? 0 : unidadDescuento.uniUnidad.uniPropiedad.tipo == 'USD' ? (descuentos * getProp(this.props, 'facturas.trmPeriodo')) : 0,
      valorPesos: (typeof unidadDescuento != 'undefined' || unidadDescuento == null) ? 0 : unidadDescuento.uniUnidad.uniPropiedad.tipo == '$' ? (descuentos) : 0,
      idConcepto: CONCEPTOS_VALIDACION_FACTURA.DESCUENTOS
    });
    listaFinal.push({
      concepto: 'Desvios',
      valorDolares: totalesDesvios.rfpsCarvarcalculado,
      valorPesos: '',
      idConcepto: CONCEPTOS_VALIDACION_FACTURA.DESVIOS
    });
    return listaFinal;
  }

  /**
  * @method
  * Método encargado de obtener los totales de la tabla resumen puntos de salida
  * @param {Array} lista Lista de puntos de salida
  */
  obtenerTotalesPuntosSalida = (lista, tipo) => {
    const totales = {
      'rfpsCarfijcalculado': 0,
      'rfpsCarvarcalculado': 0,
      'rfpsCaraoimcalculado': 0,
      'rfpsBaseusd': 0,
      'rfpsCuofombusd': 0,
      'rfpsCuofombpesos': 0,
      'rfpsBasepesos': 0,
      'rfpsCuofombusdpesos': 0,
      'rfpsBaseimpuestousd': 0,
      'rfpsImptranpusd': 0,
      'rfpsImptranpesos': 0,
      'rfpsBaseimpuestopesos': 0
    }
    for (let index = 0; index < lista.length; index++) {
      const punto = lista[index];
      for (let jindex = 0; jindex < punto.detallesPuntoSalida.length; jindex++) {
        const detallePunto = punto.detallesPuntoSalida[jindex];
        if (detallePunto.rfpsTipo == tipo) {
          totales.rfpsCarfijcalculado += detallePunto.rfpsCarfijcalculado;
          totales.rfpsCarvarcalculado += detallePunto.rfpsCarvarcalculado;
          totales.rfpsCaraoimcalculado += detallePunto.rfpsCaraoimcalculado;
          totales.rfpsBaseusd += detallePunto.rfpsBaseusd;
          totales.rfpsCuofombusd += detallePunto.rfpsCuofombusd;
          totales.rfpsCuofombpesos += detallePunto.rfpsCuofombpesos;
          totales.rfpsBasepesos += detallePunto.rfpsBasepesos;
          totales.rfpsCuofombusdpesos += detallePunto.rfpsCuofombusdpesos;
          totales.rfpsBaseimpuestousd += detallePunto.rfpsBaseimpuestousd;
          totales.rfpsImptranpusd += detallePunto.rfpsImptranpusd;
          totales.rfpsImptranpesos += detallePunto.rfpsImptranpesos;
          totales.rfpsBaseimpuestopesos += detallePunto.rfpsBaseimpuestopesos;
        }
      }
    }
    return totales;
  };

  /**
    * @method
    * Método encargado de obtener los totales de la tabla resumen puntos de salida
    * @param {Array} lista Lista de puntos de salida
    */
  obtenerTotalesPuntosSalidaDispercion = (lista) => {
    const totales = {
      'rfpsCarfijcalculado': 0,
      'rfpsCarvarcalculado': 0,
      'rfpsCaraoimcalculado': 0,
      'rfpsCuofombusd': 0,
      'rfpsCuofombpesos': 0,
      'rfpsImptranpusd': 0,
      'rfpsImptranpesos': 0,
      'dcpsCancntkpc': 0,
      'dcpsCancntmbtu': 0,
      'dcpsCancntmc': 0,
      'dcpsCannompropia': 0,
      'dcpsCantnomterceros': 0
    }
    for (let index = 0; index < lista.length; index++) {
      const punto = lista[index];
      totales.dcpsCancntkpc += punto.detalle.dcpsCancntkpc;
      totales.dcpsCancntmbtu += punto.detalle.dcpsCancntmbtu;
      totales.dcpsCancntmc += punto.detalle.dcpsCancntmc;
      totales.dcpsCannompropia += punto.detalle.dcpsCannompropia;
      totales.dcpsCantnomterceros += punto.detalle.dcpsCantnomterceros;
      totales.rfpsCarfijcalculado += punto.rfpsCarfijcalculado;
      totales.rfpsCarvarcalculado += punto.rfpsCarvarcalculado;
      totales.rfpsCaraoimcalculado += punto.rfpsCaraoimcalculado;
      totales.rfpsCuofombusd += punto.rfpsCuofombusd;
      totales.rfpsCuofombpesos += punto.rfpsCuofombpesos;
      totales.rfpsImptranpusd += punto.rfpsImptranpusd;
      totales.rfpsImptranpesos += punto.rfpsImptranpesos;
    }
    return totales;
  };

  /**
    * @method
    * Método encargado de obtener los totales de la tabla resumen puntos de salida
    * @param {Array} lista Lista de puntos de salida
    */
  obtenerTotalesPuntosConsumo = (lista) => {
    const totales = {
      'dcpcCaraoimkpcmes': 0,
      'dcpcCaraoimpto': 0,
      'dcpcCarfijdmes': 0,
      'dcpcCarfijpto': 0,
      'dcpcCarvarpto': 0,
      'dcpcCarvarusdkpc': 0,
      'dcpcCntnomkpc': 0,
      'dcpcCntnommbtu': 0,
      'dcpcCntnommc': 0,
      'dcpcCosttekpc': 0,
      'dcpcCosttemc': 0,
      'dcpcCuofompto': 0,
      'dcpcImpttepto': 0,
      'dcpcLectura': 0,
      'dcpcPorparpto': 0,
      'dcpcPorpunto': 0,
      'dcpcSubtotal': 0,
      'dcpcTotcostrans': 0,
    }
    for (let index = 0; index < lista.length; index++) {
      const punto = lista[index];
      for (let index = 0; index < punto.detallesPuntoConsumo.length; index++) {
        const detalle = punto.detallesPuntoConsumo[index];
        totales.dcpcCaraoimkpcmes += detalle.dcpcCaraoimkpcmes;
        totales.dcpcCaraoimpto += detalle.dcpcCaraoimpto;
        totales.dcpcCarfijdmes += detalle.dcpcCarfijdmes;
        totales.dcpcCarfijpto += detalle.dcpcCarfijpto;
        totales.dcpcCarvarpto += detalle.dcpcCarvarpto;
        totales.dcpcCarvarusdkpc += detalle.dcpcCarvarusdkpc;
        totales.dcpcCntnomkpc += detalle.dcpcCntnomkpc;
        totales.dcpcCntnommc += detalle.dcpcCntnommc;
        totales.dcpcCntnommbtu += detalle.dcpcCntnommbtu;
        totales.dcpcCosttekpc += detalle.dcpcCosttekpc;
        totales.dcpcCosttemc += detalle.dcpcCosttemc;
        totales.dcpcCuofompto += detalle.dcpcCuofompto;
        totales.dcpcImpttepto += detalle.dcpcImpttepto;
        totales.dcpcLectura += detalle.dcpcLectura;
        totales.dcpcPorparpto += detalle.dcpcPorparpto;
        totales.dcpcPorpunto += detalle.dcpcPorpunto;
        totales.dcpcSubtotal += detalle.dcpcSubtotal;
        totales.dcpcTotcostrans += detalle.dcpcTotcostrans;
      }
    }
    return totales;
  };

  /**
   * @method
   * Método encargado de obtener el objeto de guardar
   * @returns {Object}
   */
  procesarObjetoGuardar = () => {
    const { cabecera, facturas } = this.props;
    const contrato = { ...limpiarJson(cabecera.contrato) };
    const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', [])];
    const listaFinal = this.procesarListaFinal(lista);
    const totalesConsolidacion = this.obtenerTotalesConsolidacion(listaFinal);
    const totalesDesvios = this.obtenerTotalesPuntosSalida(lista, 'DS');
    const servicioPesos = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.SERVICIO_TRANSPORTE_FIRME_PESOS);
    const totalesPuntosSalida = this.obtenerTotalesPuntosSalida(lista, 'DS');
    const unidadDescuento = getProp(this.props, 'listas.listaUnidadesPrecio', []).find(un => un.uniIderegistro == getProp(this.props, 'facturas.unidadDescuento', ''));
    let objeto = {
      detallesPuntoSalida: [],
      detallesTramo: [],
      cntIdecontrato: contrato,
      refaPeriodo: cabecera.periodo,
      refaNumfactura: facturas.numeroFactura,
      refaVlrfactura: facturas.valorFactura,
      refaTrmimpuesto: (facturas.trmTipo == 'TT') ? facturas.trmTrimestre : (facturas.trmTipo == 'TP') ? facturas.trmPeriodo : 0,
      refaTrmperiodo: facturas.trmPeriodo,
      refaComercializacion: getProp(cabecera, 'contrato.cntPorcencomercial'),
      refaDescuento: getProp(facturas, 'descuento', '') == '' ? 0 : getProp(facturas, 'descuento', ''),
      uniIdemedidadescuento: typeof unidadDescuento == 'undefined' ? null : unidadDescuento,
      refaVlrdesvios: totalesDesvios.rfpsCarvarcalculado,
      refaCuofompesos: totalesPuntosSalida.rfpsCuofombpesos,
      refaCuofomusd: totalesPuntosSalida.rfpsCuofombusd,
      refaCuofomusdcop: totalesPuntosSalida.rfpsCuofombusdpesos,
      refaImptranspesos: totalesPuntosSalida.rfpsImptranpesos,
      refaImptranusd: totalesPuntosSalida.rfpsImptranpusd,
      refaSubtotal: totalesConsolidacion[0].valor,
      refaVlrtranfir: servicioPesos.valorPesos,
      refaDiferencia: totalesConsolidacion[3].valor,
    }
    for (let index = 0; index < lista.length; index++) {
      const dato = lista[index];
      for (let pindex = 0; pindex < dato.detallesPuntoSalida.length; pindex++) {
        const detalle = dato.detallesPuntoSalida[pindex];
        objeto.detallesPuntoSalida.push({ ...limpiarJson(detalle) });
      }
      for (let tindex = 0; tindex < dato.detallesTramo.length; tindex++) {
        const tramo = dato.detallesTramo[index];
        objeto.detallesTramo.push({ ...limpiarJson(tramo) });
      }
    }
    return objeto;
  }

  /**
   * @method
   * Método encargado de validar los datos necesarios para guardar la validación
   * @returns {Object}
   */
  validarGuardarValidacion = () => {
    const { facturas, cabecera, listas } = this.props;
    if (cabecera.periodo == '') {
      toast.error('Debe seleccionar un periodo');
      return { respuesta: false };
    }

    if (cabecera.contrato == null) {
      toast.error('Debe seleccionar un contrato');
      return { respuesta: false };
    }

    if (getProp(facturas, 'numeroFactura', '') == '') {
      toast.error('Debe ingresar el número de la factura');
      return { respuesta: false };
    }

    if (getProp(facturas, 'valorFactura', '') == '') {
      toast.error('Debe ingresar el valor de la factura');
      return { respuesta: false };
    }

    if (getProp(facturas, 'trmTipo', '') == '') {
      toast.error('Debe seleccionar la trm que aplica');
      return { respuesta: false };
    }

    if (getProp(facturas, 'descuento', '') != '') {
      if (getProp(facturas, 'unidadDescuento', '') == '') {
        toast.error('Debe Seleccionar la unidad de medida para el descuento');
        return { respuesta: false };
      }
    }

    if (!Util.validarArreglo(getProp(listas, 'listaPuntosAgregados', []))) {
      toast.error('Debe agregar al menos un punto de salida');
      return { respuesta: false };
    }
    return { respuesta: true };
  }

  /**
   * @method
   * Método encargado de validar los datos necesarios para guardar la validación
   * @returns {Object}
   */
  validarGuardarDispercion = () => {
    const { listas } = this.props;
    if (!Util.validarArreglo(getProp(listas, 'listaPuntosAgregados', []))) {
      toast.error('Debe agregar al menos un punto de salida');
      return { respuesta: false };
    }
    return { respuesta: true };
  }

  /**
   * @method
   * Método encargado de formar el objeto para guardar la disperción
   * @returns {Object}
   */
  procesarObjetoGuardarDispercion = () => {
    const { listas, cabecera, dispercion } = this.props;
    const listaFinal = [];
    // for (let index = 0; index < listas.listaPuntosAgregados.length; index++) {
    //   const punto = listas.listaPuntosAgregados[index];
    //   listaFinal.push({ ...punto.detalle });
    // }
    return {
      cntIdecontrato: limpiarJson(cabecera.contrato),
      refaIderegistro: limpiarJson(dispercion.factura),
      detallesPuntoSalida: limpiarJson(listas.listaPuntosAgregados)
    }
  };

  /**
   * @method
   * Método encargado de guardar la validación de factura o la disperción
   * @param {String} proceso Proceso a realizar
   * @returns {Boolean}
   */
  guardar = (proceso) => {
    if (proceso == '') {
      toast.error('Debe seleccionar un proceso');
      return;
    }
    let objetoEnviar;
    if (proceso == 'V') {
      const validacion = this.validarGuardarValidacion();
      if (!validacion.respuesta) {
        return;
      }
      objetoEnviar = this.procesarObjetoGuardar();
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.GUARDAR, objetoEnviar)
        .then(respuesta => {
          if (respuesta.data.codigo > 0) {
            this.limpiarFormulario();
          }
        });
      return;
    }
    const validacion = this.validarGuardarDispercion();
    if (!validacion.respuesta) {
      return;
    }
    objetoEnviar = this.procesarObjetoGuardarDispercion();
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.DISPERCION.GUARDAR, objetoEnviar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  }

  /**
   * @method
   * Consulta los valores de la trm
   * @param {String} periodo Periodo seleccionado pro el usuario
   */
  consultarValoresTRM = (periodo) => {
    const peticiones = [
      axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_TRM, { periodo: periodo }),
      axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_TRM_TRIMESTRE, { periodo: periodo }),
    ];
    axios.all(peticiones)
      .then(axios.spread((trm, trmTrimestre) => {
        const datosAplicacion = {
          trmPeriodo: '',
          trmTrimestre: ''
        };
        if (trm.data.codigo > 0) {
          datosAplicacion.trmPeriodo = getProp(this.props.cabecera, 'contrato.cntUsatrmtecho', 'N') == 'S' ?
            Math.min(trm.data.datos, getProp(this.props.cabecera, 'contrato.cntTrmtecho')) :
            trm.data.datos;
        }
        if (trmTrimestre.data.codigo > 0) {
          datosAplicacion.trmTrimestre = trmTrimestre.data.datos;
        }
        this.actualizarFacturaRedux(datosAplicacion);
      }));
  };

  /**
   * @method
   * Consulta los valores de la trm
   * @param {String} periodo Periodo seleccionado pro el usuario
   */
  consultarTrmTrimestre = (periodo) => {
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_TRM_TRIMESTRE, { periodo: periodo })
      .then(respuesta => {
        this.actualizarFacturaRedux({ trmTrimestre: respuesta.data.datos });
      });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    if (getProp(this.props, 'cabecera.idRevision', '') != '' || getProp(this.props, 'dispercion.idRevision', '') != '') {
      return;
    }
    let change = {};
    const control = evento.target;
    if ((control.name == 'periodo' && getProp(this.props, 'cabecera.proceso', '') == 'V')) {
      this.consultarValoresTRM(control.value);
    }
    if (control.name == 'proceso') {
      this.limpiarFormulario();
    }
    change[control.name] = control.value;
    this.actualizarCabeceraRedux(change);
  };

  /**
   * @method
   * Método encargado de consultar los puntos de salida de un contrato
   * @param {Number} contrato Datos del contrato
   */
  consultarPuntoSalidaContrato = (contrato) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.CONSULTAR_PUNTOS_SALIDA, { contrato: { ...limpiarJson(contrato) }, periodo: this.props.cabecera.periodo })
      .then(respuesta => {
        this.props.actualizarListasRevision({ listaPuntosSalida: [...formatearArray(respuesta.data.datos)] });
      });
  }

  /**
   * @method
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} entidad Entidad seleccioanda
   */
  onSeleccionarContrato = (entidad) => {
    this.consultarPuntoSalidaContrato(entidad);
    this.actualizarCabeceraRedux({ contrato: entidad });
    this.setState({
      modalContratos: false
    });
  };

  /**
   * @method
   * Método encargado de abrir el modal de consultar contratos
   * @returns {Boolean}
   */
  abrirConsultaContratos = () => {
    if (getProp(this.props, 'cabecera.periodo', '') == '') {
      toast.error('Debe seleccionar un periodo');
      return;
    }
    this.setState({ modalContratos: true });
  };

  /**
   * @method
   * Método encargado de limpiar el contrato
   */
  limpiarContrato = () => {
    this.actualizarCabeceraRedux({ contrato: null });
    this.props.actualizarListasRevision({ listaPuntosSalida: [] });
  }

  /**
   * Método encargado de mostrar el componente selector de contratos
   * @returns {Object}
   */
  renderSelectorContrato = () => {
    let desabilitado = false;
    if (getProp(this.props, 'cabecera.idRevision', '') != '' || getProp(this.props, 'cabecera.proceso', '') == 'DP') {
      desabilitado = true;
    }
    const contrato = getProp(this.props, 'cabecera.contrato', null);
    const propsInput = {
      placeholder: 'Seleccione un contrato',
      className: 'form-control',
      onChange: this.controlarCambio,
      name: 'contrato',
      title: getProp(contrato, 'cntNumero', ''),
      value: getProp(contrato, 'cntNumero', ''),
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-4 form-group mt-1'>
        <label>Contrato:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary input-group-text" disabled={desabilitado} title='Limpiar Contrato' onClick={this.limpiarContrato}><i className='fa fa-fw fa-trash'></i></button>
            <button className="btn-primary btn-buscador input-group-text" disabled={desabilitado} title='Seleccionar contrato' onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method
   * Método encargado de abrir el modal de consulta de dispersión
   */
  abrirModalDispercion = () => {
    this.setState({ modalDispersion: true });
  }

  /**
   * @method
   * Método encargado de abrir el modal de consultar
   */
  abrirModalValidacion = () => {
    this.setState({ modalConsultaValidacion: true });
  }

  /**
   * @method
   * Método encargado de validar que modal debe abrir
   * @param {String} proceso Dispersión o Validación
   * @returns {Boolean}
   */
  validarProcesoConsultar = (proceso) => {
    if (proceso == '') {
      toast.error('Debe seleccionar un proceso');
      return;
    }

    if (proceso == 'V') {
      this.abrirModalValidacion();
      return;
    }
    this.abrirModalDispercion();
  }

  /**
   * @method
   * Método encargado de generar una botonera personalizada
   * @returns {JSX}
   */
  renderBotoneraPersonalizada = () => {
    let desabilitado = false;
    if (getProp(this.props, 'cabecera.idRevision', '') != '' || getProp(this.props, 'dispercion.idRevision', '') != '') {
      desabilitado = true;
    }
    const proceso = getProp(this.props, 'cabecera.proceso', '');
    if (desabilitado) {
      return (
        <div className='botoneraRevision'>
          <button className='btn btn-primary botonBotonera' onClick={() => { this.validarProcesoConsultar(proceso) }}>Consultar</button>
          {proceso == 'V' &&
            this.generarReporteValidacion()
          }
          {proceso == 'DP' &&
            this.generarReporteDispercion()
          }
          <button className='btn btn-primary botonBotonera' onClick={this.limpiarFormulario}>Limpiar</button>
        </div>
      )
    }
    return (
      <div className='botoneraRevision'>
        <button className='btn btn-primary botonBotonera' onClick={() => { this.guardar(proceso) }}>Guardar</button>
        <button className='btn btn-primary botonBotonera' onClick={() => { this.validarProcesoConsultar(proceso) }}>Consultar</button>
        {proceso == 'V' &&
          this.generarReporteValidacion()
        }
        {proceso == 'DP' &&
          this.generarReporteDispercion()
        }
        <button className='btn btn-primary botonBotonera' onClick={this.limpiarFormulario}>Limpiar</button>
      </div>
    )
  }

  /**
   * @method
   * Método encargado de obtener los detalles de la revisión de facturas
   * @param {Number} idRevision Identificador de la revisión
   */
  consultarDetalle = (idRevision) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.CONSULTAR_REVISION_DETALLE, { idRevision: idRevision })
      .then(respuesta => {
        const lista = [];
        lista.push({ ...respuesta.data.datos });
        this.props.actualizarListasRevision({ listaPuntosAgregados: lista });
      });
  }

  /**
   * @method
   * Método encargado de cargar los datos de la revisión de facturas seleccionada
   * @param {Object} entidad Objeto con la revision seleccionada
   */
  onSeleccionarEntidad = (entidad) => {
    const trmTipo = (entidad.refaTrmimpuesto == 0) ? 'NA' : entidad.refaTrmimpuesto == entidad.refaTrmperiodo ? 'TP' : 'TT'
    this.consultarTrmTrimestre(entidad.refaPeriodo);
    this.actualizarCabeceraRedux({
      periodo: entidad.refaPeriodo,
      contrato: entidad.cntIdecontrato,
      idRevision: entidad.refaIderegistro
    });
    this.actualizarFacturaRedux({
      numeroFactura: entidad.refaNumfactura,
      valorFactura: entidad.refaVlrfactura,
      descuento: entidad.refaDescuento,
      unidadDescuento: getProp(entidad.uniIdemedidadescuento, 'uniIderegistro', ''),
      trmPeriodo: entidad.refaTrmperiodo,
      trmTipo: trmTipo
    });
    this.consultarDetalle(entidad.refaIderegistro);
    this.setState({ modalConsultaValidacion: false });
  }

  /**
   * @method
   * Método encargado de limpiar la factura
   */
  limpiarFactura = () => {
    this.actualizarCabeceraRedux({ periodo: '', contrato: null });
    this.actualizarDispercionRedux({ factura: null });
    this.actualizarFacturaRedux({ trmPeriodo: '' });
  };

  /**
   * @method
   * Método encargado de abrir el modal de facturas
   */
  abrirConsultaFacturas = () => {
    this.setState({ modalFactura: true });
  }

  /**
   * @method
   * Método encargado de mostrar el componente selector de contratos
   * @returns {Object}
   */
  renderSelectorRevision = () => {
    let desabilitado = false;
    if (getProp(this.props, 'cabecera.idRevision', '') != '' || getProp(this.props, 'dispercion.idRevision', '') != '') {
      desabilitado = true;
    }
    let value = '';
    const factura = getProp(this.props, 'dispercion.factura', null);
    if (factura != null) {
      value = `Periodo: ${getProp(factura, 'refaPeriodo', '')} - Contrato: ${getProp(factura, 'cntIdecontrato.cntNumero', '')} - Número Factura ${getProp(factura, 'refaNumfactura', '')}`;
    }
    const propsInput = {
      placeholder: 'Seleccione una Revisión de Factura',
      className: 'form-control',
      name: 'factura',
      title: value,
      value: value,
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-6 form-group'>
        <label>Revisión Factura:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary input-group-text" disabled={desabilitado} title='Limpiar Factura' onClick={this.limpiarFactura}><i className='fa fa-fw fa-trash'></i></button>
            <button className="btn-primary btn-buscador input-group-text" disabled={desabilitado} title='Seleccionar Factura' onClick={this.abrirConsultaFacturas}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method
   * Método encargado de obtener los detalles de la revisión de facturas
   * @param {Number} idRevision Identificador de la revisión
   */
  consultarDetalleFactura = (idRevision) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.CONSULTAR_REVISION_DETALLE, { idRevision: idRevision })
      .then(respuesta => {
        const lista = [];
        for (let index = 0; index < respuesta.data.datos.detallesPuntoSalida.length; index++) {
          const punto = respuesta.data.datos.detallesPuntoSalida[index];
          if (punto.rfpsTipo == 'PR') {
            lista.push({ ...punto });
          }
        }
        this.props.actualizarListasRevision({ listaPuntosDispercion: lista });
      });
  }

  /**
   * @method
   * Método encargado de obtener los datos del detalle de la disperción
   * @param {Object} data Datos del detalle de la dispersion
   * @returns {Array}
   */
  procesarListaFinalDispercion = (data) => {
    let listaFinal = []
    for (let index = 0; index < data.detallesPuntoSalida.length; index++) {
      const detalleSalida = data.detallesPuntoSalida[index];
      for (let index = 0; index < data.refaIderegistro.detallesPuntoSalida.length; index++) {
        const facturaDetalleSalida = data.refaIderegistro.detallesPuntoSalida[index];
        if (facturaDetalleSalida.rfpsTipo == 'PR' && facturaDetalleSalida.ptsaIderegistro.ptsaIderegistro == detalleSalida.rfpsIderegistro.ptsaIderegistro.ptsaIderegistro) {
          listaFinal.push({ ...facturaDetalleSalida, ...detalleSalida, detalle: { ...detalleSalida } });
        }
      }
    }
    return listaFinal;
  };

  /**
   * @method
   * Método encargado de consultar el detalle de la dispersión
   * @param {Object} entidad DispersionSeleccionada
   */
  consultarDetalleDispersion = (entidad) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.DISPERCION.CONSULTAR_DETALLE, { idDispersion: entidad.dconIderegistro })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.actualizarDispercionRedux({
            factura: respuesta.data.datos.refaIderegistro,
            idRevision: entidad.dconIderegistro,
          });
          this.actualizarFacturaRedux({ trmPeriodo: respuesta.data.datos.refaIderegistro.refaTrmperiodo });
          this.props.actualizarListasRevision({ listaPuntosAgregados: this.procesarListaFinalDispercion(respuesta.data.datos) });
        }
      })
  }

  /**
   * @method
   * Método encargado de seleccionar la entidad de dispesión
   * @param {Object} entidad Entidad de dispersión
   */
  onSeleccionarDispercion = (entidad) => {
    this.consultarDetalleDispersion(entidad);
    this.setState({ modalDispersion: false });
  }

  /**
   * @method
   * Método encargado de seleccionar la entidad de factura
   * @param {Object} entidad Entidad de factura
   */
  onSeleccionarFactura = (entidad) => {
    this.consultarDetalleFactura(entidad.refaIderegistro);
    this.actualizarCabeceraRedux({
      periodo: entidad.refaPeriodo,
      contrato: entidad.cntIdecontrato,
    });
    this.actualizarFacturaRedux({ trmPeriodo: entidad.refaTrmperiodo });
    this.actualizarDispercionRedux({
      factura: entidad,
      idFactura: entidad.refaIderegistro
    });
    this.setState({ modalFactura: false });
  }

  /**
   * @method
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    let desabilitado = false;
    if (getProp(this.props, 'cabecera.idRevision', '') != '' || getProp(this.props, 'dispersion.idRevision', '') != '') {
      desabilitado = true;
    }
    return (
      <Fragment>
        {
          this.renderBotoneraPersonalizada()
        }
        <div className='conf-general row mt-5'>
          <Combo
            opciones={listaProcesos}
            propTexto='texto'
            propValor='id'
            label='Proceso:'
            name='proceso'
            value={getProp(this.props, 'cabecera.proceso', '')}
            onChange={this.controlarCambio}
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          {getProp(this.props, 'cabecera.proceso', '') == 'DP' &&
            this.renderSelectorRevision()
          }
          {getProp(this.props, 'cabecera.proceso', '') == 'DP' &&
            <Input
              label='Valor TRM:'
              value={getProp(this.props, 'facturas.trmPeriodo', '')}
              extra={{ disabled: true, readOnly: true }}
            />
          }
          {(getProp(this.props, 'cabecera.proceso', '') == 'V' || (getProp(this.props, 'cabecera.proceso', '') == '')) &&
            <Fragment>
              <Fecha
                label='Periodo:'
                name='periodo'
                fecha={getProp(this.props, 'cabecera.periodo', '')}
                sinDia={true}
                onChange={this.controlarCambio}
              />
              {this.renderSelectorContrato()}
            </Fragment>
          }

          {getProp(this.props, 'cabecera.proceso', '') === 'V' &&
            <FacturasComponent
              actualizarFacturaRedux={this.actualizarFacturaRedux}
              actualizarListasRevision={this.props.actualizarListasRevision}
              obtenerDataPuntosSalida={this.obtenerDataPuntosSalida}
            />
          }
          {getProp(this.props, 'cabecera.proceso', '') === 'DP' &&
            <RDispercionConsumos
              actualizarDispercionRedux={this.actualizarDispercionRedux}
              actualizarListasRevision={this.props.actualizarListasRevision}
              actualizarCabeceraRedux={this.actualizarCabeceraRedux}
              obtenerTotalesPuntosSalidaDispercion={this.obtenerTotalesPuntosSalidaDispercion}
              obtenerTotalesPuntosConsumo={this.obtenerTotalesPuntosConsumo}
            />
          }
        </div>
        <VentanaModal
          mostrar={this.state.modalContratos}
          titulo='Seleccionar Contrato'
          cerrarModal={() => this.setState({ modalContratos: false })}>
          <RConsultaContratos
            esModal
            seleccionarEntidad={this.onSeleccionarContrato}
            inhabilitarTercero={true}
            tiposContrato={['T']}
            estadosContrato={['A', 'F']}
            inhabilitarEstado={true}
            tiposContratoDisabled={true}
            tipoNegocio={'C'}
          />
        </VentanaModal>
        <VentanaModal
          mostrar={this.state.modalConsultaValidacion}
          titulo='Seleccionar Revisión de Factura'
          cerrarModal={() => this.setState({ modalConsultaValidacion: false })}>
          <RFacturasComponentConsulta
            esModal
            seleccionarEntidad={this.onSeleccionarEntidad}
          />
        </VentanaModal>
        <VentanaModal
          mostrar={this.state.modalFactura}
          titulo='Seleccionar Revisión de Factura'
          cerrarModal={() => this.setState({ modalFactura: false })}>
          <RFacturasComponentConsulta
            esModal
            seleccionarEntidad={this.onSeleccionarFactura}
          />
        </VentanaModal>
        <VentanaModal
          mostrar={this.state.modalDispersion}
          titulo='Seleccionar Dispersión'
          cerrarModal={() => this.setState({ modalDispersion: false })}>
          <RDispercionConsumosConsulta
            esModal
            seleccionarEntidad={this.onSeleccionarDispercion}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

RevisionFacturas.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  const revision = state.revision;
  const { cabecera, dispercion, facturas, listas } = revision;
  return { cabecera, dispercion, facturas, listas, revision };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
    actualizarCabeceraRevision,
    actualizarDispercion,
    actualizarFacturas,
    actualizarListasRevision,
    limpiarRevision
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(RevisionFacturas);

export { VistaRedux as RevisionFacturas };
