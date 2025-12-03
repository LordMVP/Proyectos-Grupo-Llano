import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { get as getProp } from 'object-path';
import PropTypes from 'prop-types';
import { Input, Combo, Tabla, VentanaModal, Util, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../../global/rutas_api';
import { Tabs, Tab, Table } from 'react-bootstrap';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { formatearArray, limpiarJson, formatter } from '../../../../../global/util_nominaciones';
import { CONCEPTOS_VALIDACION_FACTURA } from '../../../../../global/constantes';
import '../GestionRevisionFacturas.scss';
import { toast } from 'react-toastify';

const listaImpuesto = [
  { texto: 'No Aplica', id: 'NA' },
  { texto: 'TRM Trimestre', id: 'TT' },
  { texto: 'TRM Ultimo Día del Periodo', id: 'TP' },
];

class FacturasComponent extends Component {

  state = {
    // Datos de la entidad
    listaDetalle: []
  };

  /**
   * @method
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.props.actualizarListasRevision({ listaPuntosAgregados: [] });
    this.setState({
      listaDetalle: []
    });
  };

  /**
   * @method
   * Método encargado de ejecutar acciones cuando se desmonta el componente
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  }
  /**
   * @method
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    if (getProp(this.props, 'cabecera.idRevision', '') != '') {
      return;
    }
    let change = {};
    change[evento.target.name] = evento.target.value;
    if (evento.target.name != 'puntoSalida') {
      this.setState({ listaDetalle: [] });
      this.props.actualizarListasRevision({ listaPuntosAgregados: [] });
    }
    this.props.actualizarFacturaRedux(change);
  };


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
    let { descuento, unidadDescuento, trmPeriodo } = this.props.facturas;
    const servicioDolares = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.SERVICIO_TRANSPORTE_FIRME_DOLAR);
    const servicioPesos = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.SERVICIO_TRANSPORTE_FIRME_PESOS);
    const cuotaDolar = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.CUOTA_FOMENTO_BASE_USD);
    const cuotaPesos = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.CUOTA_FOMENTO_BASE_$);
    const impuestoDolar = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.IMPUESTO_TRANSPORTE_BASE_USD);
    const impuestoPesos = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.IMPUESTO_TRANSPORTE_BASE_$);
    const desvios = this.buscarConceptos(listaFinal, CONCEPTOS_VALIDACION_FACTURA.DESVIOS);
    let total = (servicioPesos.valorPesos + cuotaDolar.valorPesos + cuotaPesos.valorPesos +
      impuestoDolar.valorPesos + impuestoPesos.valorPesos +
      ((desvios.valorDolares + servicioDolares.valorDolares) * getProp(this.props, 'facturas.trmPeriodo')));
    if (unidadDescuento && unidadDescuento != '' && typeof unidadDescuento != 'undefined') {
      const unidad = this.props.listas.listaUnidadesPrecio.find(u => u.uniIderegistro == unidadDescuento);
      descuento = unidad.uniNombre1 == 'USD' ? (descuento * trmPeriodo) : descuento
    }
    if (descuento != '') {
      total = total - descuento;
    }
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
      valorPesos: (totalesDesvios.rfpsCuofombusdpesos + totalesPuntosSalida.rfpsCuofombusdpesos),
      idConcepto: CONCEPTOS_VALIDACION_FACTURA.CUOTA_FOMENTO_BASE_USD
    });
    listaFinal.push({
      concepto: 'Cuota Fomento Base $',
      valorPesos: (totalesDesvios.rfpsCuofombpesos + totalesPuntosSalida.rfpsCuofombpesos),
      valorDolares: '',
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
      valorDolares: (typeof unidadDescuento == 'undefined' || unidadDescuento == null) ? 0 : unidadDescuento.uniNombre1 == 'USD' ? descuentos : 0,
      valorPesos: (typeof unidadDescuento == 'undefined' || unidadDescuento == null) ? 0 : unidadDescuento.uniNombre1 == 'USD' ? (descuentos * getProp(this.props, 'facturas.trmPeriodo')) : descuentos,
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
   * Método encargado de mostrar la tabla de consolidación y validación
   * @returns {JSX}
   */
  renderTablaConsolidacionValidacion = () => {
    const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', [])];
    const formato = formatter('es-co', 'COP');
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    const listaFinal = this.procesarListaFinal(lista);
    const totales = this.obtenerTotalesConsolidacion(listaFinal);
    return (
      <Fragment>
        <table className='table table-bordered mt-5'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Concepto </th>
              <th>Dolares </th>
              <th>Pesos </th>
            </tr>
          </thead>
          <tbody>
            {listaFinal.map((valores, index) => {
              return (
                <tr key={valores.concepto}>
                  <td>{valores.concepto}</td>
                  <td>{valores.valorDolares}</td>
                  <td>{formato.format(valores.valorPesos)}</td>
                </tr>
              )
            })}
            {totales.map((total, index) => {
              return (
                <tr key={total.titulo}>
                  <td>{total.titulo}</td>
                  <td>{''}</td>
                  <td>{formato.format(total.valor)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Fragment>
    )
  };

  /**
  * @method
  * Método encargado de mostrar la tabla con los puntos de salida agregados
  * @returns {Array}
  */
  renderTablaResumenDesvios = () => {
    const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', [])];
    if (!Util.validarArreglo(lista)) {
      return;
    }
    const totales = this.obtenerTotalesPuntosSalida(lista, 'DS');
    return (
      <Table responsive striped bordered hover>
        <thead className='bg-dark text-white'>
          <tr>
            <th>Punto de Salida </th>
            <th>Punto de Salida  Origen</th>
            <th>Cantidad Nominada (KPC) </th>
            <th>Cargo Variable Calculado </th>
            <th>Base USD </th>
            <th>Cuota de Fomento base USD </th>
            <th>Cuota de Fomento en Pesos </th>
            <th>Base Pesos </th>
            <th>Cuota de Fomento Base Pesos </th>
            <th>Base Impuesto USD </th>
            <th>Impuesto tranp USD </th>
            <th>Base Impuesto Pesos </th>
            <th>Impuesto tranp Pesos </th>
          </tr>
        </thead>
        <tbody>
          <Fragment>
            {lista.map((dato, index) => {
              return (
                <Fragment>
                  {dato.detallesPuntoSalida.map((detalle, index) => {
                    if (detalle.rfpsTipo == 'DS') {
                      return (
                        <tr key={index}>
                          <td>{getProp(detalle.ptsaIderegistro, 'ptsaNombre')}</td>
                          <td>{getProp(detalle.desIderegistro.desvioPuntoSalida, 'ptsaPuntosalidaorigen.ptsaNombre', '')}</td>
                          <td>{getProp(detalle, 'rfpsCantnominada').toFixed(JSON.parse(detalle.cantnominada.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCarvarcalculado').toFixed(JSON.parse(detalle.carvarcalculado.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsBaseusd').toFixed(JSON.parse(detalle.baseusd.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCuofombusd').toFixed(JSON.parse(detalle.cuofombusd.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCuofombusdpesos').toFixed(JSON.parse(detalle.cuofombusdpesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsBasepesos').toFixed(JSON.parse(detalle.basepesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCuofombpesos').toFixed(JSON.parse(detalle.cuofombpesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsBaseimpuestousd').toFixed(JSON.parse(detalle.baseimpuestousd.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsImptranpusd').toFixed(JSON.parse(detalle.imptranpusd.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsBaseimpuestopesos').toFixed(JSON.parse(detalle.baseimpuestopesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsImptranpesos').toFixed(JSON.parse(detalle.imptranpesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        </tr>
                      )
                    }
                  })
                  }
                </Fragment>
              );
            })
            }
            <tr className='bg-success'>
              <td className='text-center th-sub' colSpan='3'>Totales</td>
              <td className='text-center th-sub'>{totales.rfpsCarvarcalculado}</td>
              <td className='text-center th-sub'>{totales.rfpsBaseusd}</td>
              <td className='text-center th-sub'>{totales.rfpsCuofombusd}</td>
              <td className='text-center th-sub'>{totales.rfpsCuofombusdpesos}</td>
              <td className='text-center th-sub'>{totales.rfpsBasepesos}</td>
              <td className='text-center th-sub'>{totales.rfpsCuofombpesos}</td>
              <td className='text-center th-sub'>{totales.rfpsBaseimpuestousd}</td>
              <td className='text-center th-sub'>{totales.rfpsImptranpusd}</td>
              <td className='text-center th-sub'>{totales.rfpsBaseimpuestopesos}</td>
              <td className='text-center th-sub'>{totales.rfpsImptranpesos}</td>
            </tr>
          </Fragment>
        </tbody>
      </Table>
    );
  };

  /**
   * @method
   * Método encargado de mostrar la tabla con los tramos de los puntos de salida agregados
   * @returns {Array}
   */
  renderTablaTramos = () => {
    const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', [])];
    if (!Util.validarArreglo(lista) && getProp(this.props, 'facturas.tabActiva', '') != 'tramos') {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    return (
      <Fragment>
        <table className='table table-bordered mt-5'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Tramo </th>
              <th>Contrato </th>
              <th>Cargo Fijo(USD/KPC) </th>
              <th>Cargo Variable(USD/KPC)</th>
              <th>Cargo AO&M($/KPC) </th>
              <th>Cargo Fijo Mensual </th>
              <th>Cargo AO&M Mensual </th>
              <th>Cargo Fijo Diario </th>
              <th>Cargo AO&M Diario </th>
            </tr>
          </thead>
          <tbody>
            <Fragment>
              {lista.map((dato, index) => {
                return (
                  <Fragment>
                    {dato.detallesTramo.map((datosTramo, index) => {
                      return (
                        <tr key={getProp(datosTramo.cntrIderegistro, 'cntrIderegistro')}>
                          <td>{getProp(datosTramo.cntrIderegistro, 'trcaIdetramocargo.trmIderegistro.trmNombre', '')}</td>
                          <td>{getProp(datosTramo.cntrIderegistro, 'cntIdecontrato.cntNumero', '')}</td>
                          <td>{getProp(datosTramo.cntrIderegistro, 'trcaIdetramocargo.trcaCargofijo', '')}</td>
                          <td>{getProp(datosTramo.cntrIderegistro, 'cntrCargovariable', '')}</td>
                          <td>{getProp(datosTramo.cntrIderegistro, 'trcaIdetramocargo.trcaCargoaoym', '')}</td>
                          <td>{getProp(datosTramo, 'rftrCrfmensual', '').toFixed(JSON.parse(datosTramo.crfmensual.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(datosTramo, 'rftrCraoimmensual', '').toFixed(JSON.parse(datosTramo.craoimmensual.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(datosTramo, 'rftrCrfdiario', '').toFixed(JSON.parse(datosTramo.crfdiario.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(datosTramo, 'rftrCraoymdiario', '').toFixed(JSON.parse(datosTramo.craoymdiario.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        </tr>
                      );
                    })}
                  </Fragment>
                )
              })
              }
            </Fragment>
          </tbody>
        </table>
      </Fragment>
    );
  };

  /**
   * @method
   * Método encargado de limpiar la tabla de detalle
   */
  limpiarDetalle = () => {
    this.setState({ listaDetalle: [] });
  }

  /**
  * @method
  * Método encargado de procesar los totales para desvios
  * @param {Object} detalle Datos del detalle en un día
  * @param {Array} totales Totales a procesar
  */
  procesarTotalesDesvios = (detalle, totales) => {
    for (let jindex = 0; jindex < detalle.desvios.length; jindex++) {
      const desvio = detalle.desvios[jindex];
      if (desvio.aplica != false) {
        totales[jindex] = (typeof totales[jindex] == 'undefined') ? 0 : totales[jindex];
        totales[jindex] += desvio.valor;
      }
    }
  }

  /**
   * @method
   * Método encargado de obtener los totales de por desvio
   * @param {Array} lista Lista del detalle
   * @returns {Array}
   */
  obtenerTotalesDesvios = (lista) => {
    let totales = [];
    for (let index = 0; index < lista.length; index++) {
      const detalle = lista[index];
      this.procesarTotalesDesvios(detalle, totales);
    }
    return totales;
  }

  /**
   * @method
   * Método encargado de procesar la lista de desvios
   * @param {Arra} lista Lista del detalle
   * @param {Number} numDesvios Número maximo de desvios en un día
   */
  procesarListaDetalle = (lista, numDesvios) => {
    let nuevo = [];
    for (let index = 0; index < lista.length; index++) {
      const detalle = lista[index];
      const desviosDetalle = JSON.parse(detalle.desvios);
      for (let index = 0; index < numDesvios.length; index++) {
        if (desviosDetalle.length == 0) {
          nuevo[index] = { id: '', valor: '', aplica: false };
          continue;
        }
        const desvioExistente = numDesvios[index];
        const validarDesvio = desviosDetalle.findIndex(des => des.id == desvioExistente.id);
        if (validarDesvio >= 0) {
          if (nuevo.length == 0 && index == 0) {
            nuevo[index] = { id: desvioExistente.id, valor: desvioExistente.valor, aplica: true, nombre: desvioExistente.nombre };
          }
          if (nuevo.length == 0 && index != 0) {
            nuevo[0] = { id: '', valor: '', aplica: true, nombre: '' };
          }
          if (index != validarDesvio) {
            nuevo[index] = { id: desvioExistente.id, valor: desvioExistente.valor, aplica: true, nombre: desvioExistente.nombre };
          }
        }
      }
      detalle.desvios = nuevo;
      nuevo = [];
    }
  }

  /**
   * @method
   * Método encargado de obtener el encabezado de la tabla detalle
   * @param {Array} lista Lista del detalle
   * @returns {Array}
   */
  obtenerEncabezado = (lista) => {
    const encabezado = [];
    let ids = [];
    for (let index = 0; index < lista.length; index++) {
      const detalle = lista[index];
      const desviosDetalle = JSON.parse(detalle.desvios);
      for (let index = 0; index < desviosDetalle.length; index++) {
        const desvioDetalle = desviosDetalle[index];
        if (ids.length == 0) {
          ids = [...ids, { id: desvioDetalle.id, nombre: desvioDetalle.nombre, valor: desvioDetalle.valor, unidad: desvioDetalle.unidad }];
          continue;
        }
        const existe = ids.findIndex(ele => ele.id == desvioDetalle.id);
        if (existe < 0) {
          ids = [...ids, { id: desvioDetalle.id, nombre: desvioDetalle.nombre, valor: desvioDetalle.valor, unidad: desvioDetalle.unidad }];
        }
      }
    }
    for (let index = 0; index < ids.length; index++) {
      const { nombre, unidad } = ids[index];
      encabezado.push({ titulo: `Cantidad Nominada Desvio ${nombre}(${unidad})`, id: index });
    }
    this.procesarListaDetalle(lista, ids)
    return encabezado;
  }

  /**
   * @method
   * Método encargado de mostrar la tabla del detalle del punto de salida
   * @returns {JSX}
   */
  renderTablaDetalle = () => {
    let lista = [...this.state.listaDetalle];
    if (!Util.validarArreglo(lista) || getProp(this.props, 'facturas.tabActiva', '') != 'puntoSalida') {
      return;
    }
    const encabezado = this.obtenerEncabezado(lista);
    const totalesDesvio = this.obtenerTotalesDesvios(lista);
    return (
      <Fragment>
        <button className='btn btn-primary' onClick={this.limpiarDetalle}>Limpiar Detalle</button>

        <div className='table-responsive'>
          <table className='table-normal table table-condensed table-bordered text-center mt-5'>
            <thead className='bg-dark text-white'>
              <tr>
                <th>Día </th>
                <th>Punto de Salida </th>
                <th>Cantidad Contrata Diaria(KPC) </th>
                <th>Cantidad Nominada Propia(KPC) </th>
                {encabezado.map(cb => { return (<th>{cb.titulo}</th>) })}
              </tr>
            </thead>
            <tbody>
              <Fragment>
                {lista.map((detalle, index) => {
                  return (
                    <tr key={detalle.dia}>
                      <td>{detalle.dia}</td>
                      <td>{detalle.puntoSalida.ptsaNombre}</td>
                      <td>{detalle.cantContratada}</td>
                      <td>{detalle.cantNominadaPropia}</td>
                      {detalle.desvios.map((desvio, index) => {
                        return (
                          <td>{desvio.valor}</td>
                        )
                      })}
                    </tr>
                  );
                })
                }
                <tr className='bg-success'>
                  <td className='text-center th-sub' colSpan='4'>Totales del Periodo</td>
                  {totalesDesvio.map(valor => {
                    return (
                      <td className='text-center th-sub'>{valor}</td>
                    )
                  })}
                </tr>
              </Fragment>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  };

  /**
   * @method
   * Método encargado de consultar el detalle de un punto de salida
   * @param {Number} punto Identificador del punto de salida
   */
  consultarDetalle = (punto) => {
    let puntoFinal = { ...limpiarJson(punto) };
    const objeto = {
      puntoSalida: puntoFinal,
      contrato: { ...limpiarJson(this.props.cabecera.contrato) },
      periodo: this.props.cabecera.periodo
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.CONSULTAR_DETALLE, objeto)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaDetalle: [...respuesta.data.datos] });
        }
      });
  }

  /**
   * @method
   * Método encargado de eliminar un punto de consumo de la lista
   * @param {Number} posicion Posición en el arreglo
   */
  eliminarPunto = (posicion) => {
    const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', [])];
    lista.splice(posicion, 1);
    this.props.actualizarListasRevision({ listaPuntosAgregados: lista });
    this.props.actualizarFacturaRedux({ tabActiva: '' });
    this.limpiarDetalle();
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
   * Método encargado de mostrar la tabla con los puntos de salida agregados
   * @returns {Array}
   */
  renderTablaResumenPuntosSalida = () => {
    let desabilitado = false;
    if (getProp(this.props, 'cabecera.idRevision', '') != '') {
      desabilitado = true;
    }
    const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', [])];
    if (!Util.validarArreglo(getProp(this.props, 'listas.listaPuntosSalida', [])) && getProp(this.props, 'cabecera.idRevision', '') == '') {
      this.props.actualizarListasRevision({ listaPuntosAgregados: [] });
    }
    if (!Util.validarArreglo(lista) || getProp(this.props, 'facturas.tabActiva', '') != 'puntoSalida') {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    const totales = this.obtenerTotalesPuntosSalida(lista, 'PR');
    return (
      <Table responsive striped bordered hover>
        <thead className='bg-dark text-white'>
          <tr>
            <th>Acción </th>
            <th>Punto de Salida </th>
            <th>Cantidad Contrata Diaria(KPC) </th>
            <th>Cantidad Nominada Propia(KPC) </th>
            <th>Cargo Fijo Calculado </th>
            <th>Cargo Variable Calculado </th>
            <th>Cargo AO&M Calculado </th>
            <th>Base USD </th>
            <th>Cuota de Fomento base USD </th>
            <th>Cuota de Fomento en Pesos </th>
            <th>Base Pesos </th>
            <th>Cuota de Fomento Base Pesos </th>
            <th>Base Impuesto USD </th>
            <th>Impuesto tranp USD </th>
            <th>Impuesto tranp Pesos </th>
            <th>Base Impuesto Pesos </th>
          </tr>
        </thead>
        <tbody>
          <Fragment>
            {lista.map((dato, index) => {
              return (
                <Fragment>
                  {dato.detallesPuntoSalida.map(detalle => {
                    if (detalle.rfpsTipo == 'PR') {
                      return (
                        <tr key={detalle.ptsaIderegistro.ptsaIderegistro}>
                          <td>
                            <button
                              className="btn-primary btn-buscador input-group-btn"
                              title='Eliminar'
                              disabled={desabilitado}
                              onClick={() => {
                                this.eliminarPunto(index)
                              }}><i className='fa fa-fw fa-minus'></i>
                            </button>
                            <button
                              className="btn-primary btn-buscador input-group-btn"
                              title='Detalle'
                              onClick={() => {
                                this.consultarDetalle(detalle.ptsaIderegistro)
                              }}><i className='fa fa-fw fa-search'></i>
                            </button>
                          </td>
                          <td>{getProp(detalle.ptsaIderegistro, 'ptsaNombre')}</td>
                          <td>{getProp(detalle, 'rfpsCantcntdiaria').toFixed(JSON.parse(detalle.cantcntdiaria.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCantnominada').toFixed(JSON.parse(detalle.cantnominada.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCarfijcalculado').toFixed(JSON.parse(detalle.carfijcalculado.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCarvarcalculado').toFixed(JSON.parse(detalle.carvarcalculado.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCaraoimcalculado').toFixed(JSON.parse(detalle.caraoimcalculado.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsBaseusd').toFixed(JSON.parse(detalle.baseusd.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCuofombusd').toFixed(JSON.parse(detalle.cuofombusd.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCuofombusdpesos').toFixed(JSON.parse(detalle.cuofombusdpesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsBasepesos').toFixed(JSON.parse(detalle.basepesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsCuofombpesos').toFixed(JSON.parse(detalle.cuofombpesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsBaseimpuestousd').toFixed(JSON.parse(detalle.baseimpuestousd.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsImptranpusd').toFixed(JSON.parse(detalle.imptranpusd.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsImptranpesos').toFixed(JSON.parse(detalle.imptranpesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                          <td>{getProp(detalle, 'rfpsBaseimpuestopesos').toFixed(JSON.parse(detalle.baseimpuestopesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        </tr>
                      )
                    }
                  })
                  }
                </Fragment>
              );
            })
            }
            <tr className='bg-success'>
              <td className='text-center th-sub' colSpan='3'>Totales</td>
              <td className='text-center th-sub'>{totales.rfpsCarfijcalculado}</td>
              <td className='text-center th-sub'>{totales.rfpsCarvarcalculado}</td>
              <td className='text-center th-sub'>{totales.rfpsCaraoimcalculado}</td>
              <td className='text-center th-sub'>{totales.rfpsBaseusd}</td>
              <td className='text-center th-sub'>{totales.rfpsCuofombusd}</td>
              <td className='text-center th-sub'>{totales.rfpsCuofombusdpesos}</td>
              <td className='text-center th-sub'>{totales.rfpsBasepesos}</td>
              <td className='text-center th-sub'>{totales.rfpsCuofombpesos}</td>
              <td className='text-center th-sub'>{totales.rfpsBaseimpuestousd}</td>
              <td className='text-center th-sub'>{totales.rfpsImptranpusd}</td>
              <td className='text-center th-sub'>{totales.rfpsImptranpesos}</td>
              <td className='text-center th-sub'>{totales.rfpsBaseimpuestopesos}</td>
              <td className='text-center th-sub'>{'///'}</td>
            </tr>
          </Fragment>
        </tbody>
      </Table>
    );
  };

  /**
   * @method
   * Método encargado de validar los puntos agregados
   * @param {number} idPunto Identificador del punto de salida que se quiere agregar
   */
  validarPuntoRepetido = (idPunto) => {
    const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', [])];
    const index = lista.findIndex(p => p.puntoSalida.ptsaIderegistro == idPunto);
    return index >= 0;
  };

  /**
   * @method
   * Método encargado de validar los datos necesarios para realizar el calculo
   */
  validarDatosCalcular = () => {
    const { facturas, cabecera } = this.props;
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

    if (getProp(facturas, 'puntoSalida', '') == '' || getProp(facturas, 'puntoSalida', '') == '-1' || getProp(facturas, 'puntoSalida', '') == -1) {
      toast.error('Debe seleccionar un punto de salida');
      return { respuesta: false };
    }

    return { respuesta: true };
  };

  /**
   * @method
   * Método encargado de agregar el punto de salida seleccionado a la lista
   * @returns {Boolean}
   */
  agregarSeleccionado = () => {
    const { cabecera, facturas } = this.props;
    const validar = this.validarDatosCalcular();
    if (!validar.respuesta) {
      return;
    }
    if (this.validarPuntoRepetido(getProp(facturas, 'puntoSalida', ''))) {
      toast.error('El punto que esta intentado agregar ya se encuentra en la lista');
      return;
    }
    const contrato = { ...limpiarJson(cabecera.contrato) };
    const puntoSalida = { ...limpiarJson(getProp(this.props, 'listas.listaPuntosSalida', []).find(p => p.ptsaIderegistro == facturas.puntoSalida)) };
    const objetoEnviar = {
      periodo: cabecera.periodo,
      numeroFactura: facturas.numeroFactura,
      valorFactura: facturas.valorFactura,
      trmImpuesto: (facturas.trmTipo == 'TT') ? facturas.trmTrimestre : (facturas.trmTipo == 'TP') ? facturas.trmPeriodo : 0,
      trmPeriodo: facturas.trmPeriodo,
      porcentajeComercializacion: getProp(cabecera, 'contrato.cntPorcencomercial'),
      contrato: contrato,
      puntoSalida: puntoSalida
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.CALCULAR, objetoEnviar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const data = { ...respuesta.data.datos, puntoSalida: puntoSalida }
          const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', []), data];
          this.props.actualizarListasRevision({ listaPuntosAgregados: lista });
          this.props.actualizarFacturaRedux({ tabActiva: 'puntoSalida' });
        }
      });
  };

  /**
   * Método encargado de mostrar el selector para puntos de salida
   * @returns {Object}
   */
  renderSelector = () => {
    let desabilitado = false;
    if (getProp(this.props, 'cabecera.idRevision', '') != '') {
      desabilitado = true;
    }
    return (
      <div className="grupo input-group mb-3 mt-5">
        <Combo
          opciones={getProp(this.props, 'listas.listaPuntosSalida', [])}
          propTexto='ptsaNombre'
          propValor='ptsaIderegistro'
          label='Punto de Salida:'
          value={getProp(this.props, 'facturas.puntoSalida', '')}
          onChange={this.controlarCambio}
          name='puntoSalida'
          extra={{ disabled: desabilitado, readOnly: desabilitado }}
        />
        <button
          className="btnSuma"
          title='Agregar'
          disabled={desabilitado}
          onClick={this.agregarSeleccionado}><i className='fa fa-fw fa-plus'></i></button>
      </div>
    );
  }

  /**
   * @method
   * Método encargado de controlar el cambio de tabs
   * @param {String} tab Nombre del tab nuevo
   */
  controlarTab = (tab) => {
    this.props.actualizarFacturaRedux({ tabActiva: tab });
    this.limpiarDetalle();
  }

  /**
   * @method
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    let desabilitado = false;
    if (getProp(this.props, 'cabecera.idRevision', '') != '') {
      desabilitado = true;
    }
    return (
      <Fragment>
        <div className='conf-general row mt-5'>
          <TextoNumerico
            aceptaDecimales={false}
            aceptaNegativos={false}
            label='Número de Factura'
            value={getProp(this.props, 'facturas.numeroFactura', '')}
            onChange={this.controlarCambio}
            name='numeroFactura'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Valor Factura'
            value={getProp(this.props, 'facturas.valorFactura', '')}
            onChange={this.controlarCambio}
            name='valorFactura'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Descuento'
            value={getProp(this.props, 'facturas.descuento', '')}
            onChange={this.controlarCambio}
            name='descuento'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <Combo
            opciones={getProp(this.props, 'listas.listaUnidadesPrecio', [])}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Unidad de Medida descuento:'
            name='unidadDescuento'
            value={getProp(this.props, 'facturas.unidadDescuento', '')}
            onChange={this.controlarCambio}
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <Input
            label='Valor TRM:'
            value={getProp(this.props, 'facturas.trmPeriodo', '')}
            extra={{ disabled: true, readOnly: true }}
          />
          <Input
            label='TRM Promedio Trimestre:'
            value={getProp(this.props, 'facturas.trmTrimestre')}
            extra={{ disabled: true, readOnly: true }}
          />
          <Input
            label='% Comercialización:'
            value={getProp(this.props.cabecera, 'contrato.cntPorcencomercial')}
            extra={{ disabled: true, readOnly: true }}
          />
          <Combo
            opciones={listaImpuesto}
            propTexto='texto'
            propValor='id'
            label='TRM Impuesto:'
            value={getProp(this.props, 'facturas.trmTipo', '')}
            name='trmTipo'
            onChange={this.controlarCambio}
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          {
            this.renderSelector()
          }
        </div>
        {Util.validarArreglo(getProp(this.props, 'listas.listaPuntosAgregados', [])) &&
          <Tabs
            id="controlled-tab-example"
            activeKey={getProp(this.props, 'facturas.tabActiva', '')}
            onSelect={(k) => this.controlarTab(k)}
            className='mt-5 row col-12'
          >
            <Tab eventKey="puntoSalida" title="Resumen Punto de Salida">
            </Tab>
            <Tab eventKey="tramos" title="Resumen Tramos">
              <div className='row col-12'>
                {this.renderTablaTramos()}
              </div>
            </Tab>
            <Tab eventKey="desvios" title="Resumen Desvios">
            </Tab>
            <Tab eventKey="consolidacion" title="Consolidación y Validación">
              <div className="contenidoTab">
                {this.renderTablaConsolidacionValidacion()}
              </div>
            </Tab>
          </Tabs>
        }
        {getProp(this.props, 'facturas.tabActiva', '') == 'puntoSalida' &&
          <Fragment>
            {this.renderTablaResumenPuntosSalida()}
            {this.renderTablaDetalle()}
          </Fragment>
        }
        {getProp(this.props, 'facturas.tabActiva', '') == 'desvios' &&
          <Fragment>
            {this.renderTablaResumenDesvios()}
          </Fragment>
        }
      </Fragment>
    );
  };
}

FacturasComponent.propTypes = {
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
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(FacturasComponent);

export { VistaRedux as FacturasComponent };
