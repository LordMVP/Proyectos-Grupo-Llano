import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta, mostrarProgramaModal } from '../../../../store/actions/AplicacionAcciones';
import { limpiarJson, formatter } from '../../../../global/util_nominaciones';
import { ESTADOS_CRUCE } from '../../../../global/constantes';
import { Table } from 'react-bootstrap';
import './GestionLiquidacionFacturasSuministro.scss';
import { toast } from 'react-toastify';
import { get as getProp } from 'object-path';
import moment from 'moment';
import { RConsultaLiquidacionSuministro } from '../ConsultaLiquidacionSuministro';
import { RConsultaAgentesTerceros } from '../../agentesTerceros/ConsultaAgentesTerceros';
import { RConsultaContratos } from '../../../contratos/ConsultaContratos'

const listaTipoRenumeracion = [
   { texto: 'Plana', id: 'PL' },
   { texto: 'Ponderada', id: 'PD' },
];

const listaTiposMercado = [
   { texto: 'Regulado', id: 'REG' },
   { texto: 'No Regulado', id: 'NREG' },
   { texto: 'No Aplica', id: 'NA' },
];

const listaSino = [
   { texto: 'SI', id: 'S' },
   { texto: 'NO', id: 'N' },
];

class GestionLiquidacionSuministro extends Component {

   state = {
      // Datos de la entidad
      periodo: '',
      estado: '',
      estadoLiquidacion: '',
      tipoRenumeracion: '',
      tipoMercado: '',
      trmPeriodo: '',
      cruzaSaldo: '',
      idLiquidacion: -1,
      tercero: null,
      fechas: null,
      consolidacion: null,
      //Listas de la entidad
      detalleSeleccionado: [],
      contratosSeleccionados: [],
      detalles: [],
      contratosPadre: [],
      //Estados de la entidad
      mostrarModalConsulta: false,
      modalContratos: false,
      liquidado: false,
   };

   /**
    * @method
    * Método encargado de comprobar si el formulario ya cargo
    */
   componentDidMount() {
      const { state } = this.props.history && this.props.history.location;
      if (state && state.listaContratos) {
         this.setState({ contratosSeleccionados: state.listaContratos });
      }
   };

   /**
    * @method
    * Método encargado de limpiar los campos del formulario
    */
   limpiarFormulario = () => {
      this.setState({
         periodo: '',
         estado: '',
         estadoLiquidacion: '',
         tipoRenumeracion: '',
         tipoMercado: '',
         trmPeriodo: '',
         cruzaSaldo: '',
         liquidacionCertificada: '',
         idLiquidacion: -1,
         tercero: null,
         fechas: null,
         consolidacion: null,
         detalleSeleccionado: [],
         contratosSeleccionados: [],
         detalles: [],
         contratosPadre: [],
         mostrarModalConsulta: false,
         modalContratos: false,
         liquidado: false,
      });
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
    * Método encargado de generar los botones del formulario
    * @returns {Object}
    */
   obtenerFunciones = () => {
      let funciones = [];
      if (this.state.liquidado && this.state.estado != 'C') {
         funciones.push({ texto: 'Guardar', callback: this.guardarEntidad });
      }
      if (this.state.liquidado && this.state.estado == 'P') {
         funciones.push({ texto: 'Aprobar', callback: () => { this.cambiarEstado(ESTADOS_CRUCE.APROBADO) } });
         funciones.push({ texto: 'Certificar', callback: () => { this.cambiarEstado(ESTADOS_CRUCE.CERTIFICAR) } });

      }
      funciones.push({ texto: 'Consultar', callback: this.consultarEntidad });
      funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });

      return funciones;
   };

   /**
    * @method
    * Método encargado de cambiar el estado de una liquidación
    * @param {String} estado Estado al cual se actualizara la liquidación
    */
   cambiarEstado = (estado) => {
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA.ACTUALIZAR,
         {
            idLiquidacion: this.state.idLiquidacion,
            estado: estado
         })
         .then(respuesta => {
            if (respuesta.data.codigo > 0) {
               this.limpiarFormulario();
            }
         })
   }

   /**
    * @method
    * Método encargado de guardar los datos de la entidad
    * @returns {bool}
    */
   guardarEntidad = () => {
      const { contratosSeleccionados, tercero, detalles, consolidacion } = this.state;
      const validacionLiquidar = this.validarLiquidar();
      if (!validacionLiquidar.respuesta) {
         toast.error(validacionLiquidar.mensaje.mensaje);
         return;
      }
      const { totalFactura, saldoFavor, subtotalFirme, totalPrepago, negociacionDirecta, subasta } = consolidacion;
      let parametros = this.obtenerObjetoLiquidacion(contratosSeleccionados);
      parametros = {
         ...parametros,
         terIderegistro: { terIderegistro: tercero.terIderegistro },
         detalleVenta: limpiarJson(detalles),
         lqnsTotalndirecta: negociacionDirecta,
         lqnsTotalsubasta: subasta,
         lqnsSubtotalfirme: subtotalFirme,
         lqnsVlrsaldo: saldoFavor,
         lqnsTotalprepago: totalPrepago,
         lqnsTotalfactura: totalFactura,
      };
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA.GUARDAR, parametros)
         .then(respuesta => {
            if (respuesta.data.codigo > 0) {
               this.limpiarFormulario();
            }
         });
   };

   /**
    * @method
    * Método encargado de abrir la ventana modal del boton consulta
    */
   consultarEntidad = () => {
      this.setState({ mostrarModalConsulta: true });
   };

   /**
    * @method
    * Método encargado de consultar la trm del periodo
    * @param {String} periodo Periodo seleccionado
    */
   consultarTRMPeriodo = (periodo) => {
      axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_TRM, { periodo: periodo })
         .then((response) => {
            if (response.data.codigo > 0) {
               this.setState({ trmPeriodo: response.data.datos });
            }
         })
   }

   /**
    * @method
    * Método encargado de limpiar los valores del contrato padre al cambiar el tipo de renumeración
    * @param {Object} change Objeto para cambiar el state
    */
   limpiarValoresContratosPadre = (change) => {
      if (Util.validarArreglo(this.state.contratosPadre)) {
         const contratosLimpios = this.state.contratosPadre.map(contrato => {
            if (change['tipoRenumeracion'] == 'NA') {
               contrato.dlccRemregulado = 0;
               contrato.dlccRemnoregulado = 0;
            } else {
               contrato.dlccRemregulado = '';
               contrato.dlccRemnoregulado = '';

            }
            return contrato;
         });
         change.contratosPadre = contratosLimpios;
      }
   }

   /**
    * @method
    * Método encargado de controlar el cambio del valor de los campos del formulario
    * @param {Event} evento El evento que se ejecuta en el control de usuario
    */
   controlarCambio = (evento) => {
      const desabilitado = this.validarCertificado();
      if (desabilitado) {
         return;
      }
      let change = {};
      const { name, value } = evento.target;
      change[name] = value;
      if (name == 'periodo') {
         this.consultarTRMPeriodo(value);
         this.obtenerValorFecha(value);
         change.contratosPadre = [];
         change.contratosSeleccionados = [];
      }
      if (name == 'tipoRenumeracion') {
         this.limpiarValoresContratosPadre(change);
      }
      this.setState(change);
   };

   /**
    * @method
    * Método encargado de eliminar el contrato seleccionado
    * @param {Number} posicion Posicion a eliminar
    */
   eliminarContrato = (posicion) => {
      const desabilitado = this.validarCertificado();
      if (desabilitado) {
         return;
      }
      const lista = [...this.state.contratosSeleccionados];
      lista.splice(posicion, 1);
      this.setState({
         contratosSeleccionados: lista,
         contratosPadre: [],
         detalleSeleccionado: [],
         detalles: [],
         liquidado: false,
         consolidacion: null
      });
   };

   /**
    * @method
    * Método encargado de cerrar la ventana modal del boton consulta
    */
   abrirCerrarModal = () => {
      this.setState({
         mostrarModalConsulta: false
      });
   };

   /**
    * @method
    * Método encargado de controlar el cambio en la tabla de valores diarios
    * @param {Event} evento Evento ejecutado en el control de usuario
    */
   controlarCambioTabla = (evento) => {
      const contratos = [...this.state.contratosPadre];
      const control = evento.target;
      const { name, value } = control;
      if (name === 'NAM') {
         return;
      }
      const index = control.attributes['data-index'].value;
      contratos[index][name] = value;
      this.setState({ contratosPadre: contratos, liquidado: false });
   }

   /**
    * @method
    * Método encargado de validar el formulario para liquidar
    * @returns {Object}
    */
   validarLiquidar = () => {
      const { tipoRenumeracion, tipoMercado, periodo, cruzaSaldo, contratosPadre } = this.state;
      if (!tipoRenumeracion || tipoRenumeracion == '') {
         return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de renumeración.' } };
      }
      if (tipoRenumeracion == 'PL') {
         if (!tipoMercado || tipoMercado == '') {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de mercado.' } };
         }
      }

      if (!periodo || periodo == '') {
         return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el periodo a liquidar.' } };
      }

      if (!cruzaSaldo || cruzaSaldo == '') {
         return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar si se cruzaran saldos.' } };
      }
      if (!Util.validarArreglo(contratosPadre)) {
         return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe haber al menos 1 contrato padre' } };
      }

      for (let index = 0; index < contratosPadre.length; index++) {
         const contrato = contratosPadre[index];
         if ((tipoRenumeracion === 'PD') && (!contrato.dlccRemregulado || contrato.dlccRemregulado == '')) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el valor regulado para todos los contratos' } };
         }

         if (((tipoRenumeracion === 'PD') && (!contrato.dlccRemnoregulado || contrato.dlccRemnoregulado == ''))) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el valor no regulado para todos los contratos' } };
         }

         if (tipoRenumeracion === 'PL') {
            if (tipoMercado === 'REG' && (!contrato.dlccRemregulado || contrato.dlccRemregulado == '')) {
               return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el valor regulado para todos los contratos' } };
            }
            if (tipoMercado === 'NREG' && (!contrato.dlccRemnoregulado || contrato.dlccRemnoregulado == '')) {
               return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el valor no regulado para todos los contratos' } };
            }
         }
      }

      return { respuesta: true }
   };

   /**
    * @method
    * Método encargado de procesar los contratos de venta
    * @param {Array} Datos de los contratos venta despues de liquidar
    * @returns {Array}
    */
   procesarContratosVenta = (contratosVentaLiquidados) => {
      let lista = [];
      const contratosVentaSeleccionados = [...this.state.contratosSeleccionados];
      for (let index = 0; index < contratosVentaSeleccionados.length; index++) {
         const contrato = contratosVentaSeleccionados[index];
         for (let index = 0; index < contratosVentaLiquidados.length; index++) {
            const contratoLiquidado = contratosVentaLiquidados[index];
            if (contrato.cntIderegistro === contratoLiquidado.cntIderegistro.cntIderegistro) {
               lista = [...lista, { ...contrato, cantidadContratada: contratoLiquidado.cantidadContratada }];
            }
         }
      }
      return lista;
   };

   /**
    * @method
    * Método encargado de liquidar los contratos seleccionados
    * @returns {Boolean}
    */
   liquidar = () => {
      const { contratosSeleccionados } = this.state;
      const validacionLiquidar = this.validarLiquidar();
      if (!validacionLiquidar.respuesta) {
         toast.error(validacionLiquidar.mensaje.mensaje);
         return;
      }
      const parametros = this.obtenerObjetoLiquidacion(contratosSeleccionados);
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA.LIQUIDAR, parametros)
         .then(respuesta => {
            if (respuesta.data.codigo > 0) {
               const { contratosCompra, detalleVenta, consolidacion, contratosVenta } = respuesta.data.datos;
               this.setState({
                  contratosPadre: contratosCompra,
                  contratosSeleccionados: this.procesarContratosVenta(contratosVenta),
                  detalles: detalleVenta,
                  consolidacion: consolidacion,
                  liquidado: true
               });
            }
         });
   };

   /**
    * @method
    * Método encargado de mostrar el formulario para la remuneración
    * @returns {Object}
    */
   renderRemuneracion = () => {
      const desabilitado = this.validarCertificado();
      return (
         <Fragment>
            <Combo
               opciones={listaTipoRenumeracion}
               propTexto='texto'
               propValor='id'
               label='Tipo de Renumeración:'
               name='tipoRenumeracion'
               value={this.state.tipoRenumeracion}
               onChange={this.controlarCambio}
               cols={3}
               extra={{ disabled: desabilitado, readOnly: desabilitado }}
            />
            {this.state.tipoRenumeracion === 'PL' &&
               <Combo
                  propTexto='texto'
                  propValor='id'
                  opciones={listaTiposMercado}
                  label='Tipo de Mercado:'
                  name='tipoMercado'
                  value={this.state.tipoMercado}
                  onChange={this.controlarCambio}
                  cols={3}
                  extra={{ disabled: desabilitado, readOnly: desabilitado }}
               />
            }
            {this.state.tipoRenumeracion != '' &&
               <Combo
                  opciones={listaSino}
                  propTexto='texto'
                  propValor='id'
                  label='Cruzar Saldo:'
                  name='cruzaSaldo'
                  value={this.state.cruzaSaldo}
                  onChange={this.controlarCambio}
                  cols={3}
                  extra={{ disabled: desabilitado, readOnly: desabilitado }}
               />
            }
            <div className='form-group m-t-24'>
               <button className='btn btn-primary' disabled={desabilitado} onClick={this.liquidar}><i className='fa fa-fw fa-check'></i> Liquidar</button>
            </div>
         </Fragment>
      );
   };

   /**
    * @method
    * Método encargado de limpiar la tabla detalle
    */
   limpiarDetalle = () => {
      this.setState({ detalleSeleccionado: [] });
   }

   /**
    * @method
    * Método encargado de procesar la consolidación liquidada
    * @param {Object} consolidacion Consolidación generada
    * @returns {Array}
    */
   procesarConsolidacion = (consolidacion) => {
      let lista = [];
      const { remuneracion, saldoFavor, subtotalFirme, totalPrepago, negociacionDirecta, subasta } = consolidacion;
      lista = [...lista, { concepto: 'Costo Suministro', valor: negociacionDirecta }];
      lista = [...lista, { concepto: 'Costo Suministro SUVCP', valor: subasta }];
      lista = [...lista, { concepto: 'SUBTOTAL FIRME', valor: subtotalFirme }];
      lista = [...lista, { concepto: 'Remuneración Gestor Mercado', valor: remuneracion }];
      lista = [...lista, { concepto: 'Prepagos Efectuados en Agosto', valor: totalPrepago }];
      lista = [...lista, { concepto: 'Saldo a Favor - Anterior Mes', valor: saldoFavor }];
      return lista;
   };

   /**
    * @method
    * Método encargado de mostrar la tabla de consolidación y validación
    * @returns {JSX}
    */
   renderTablaConsolidacion = () => {
      const formato = formatter('es-co', 'COP');
      const { consolidacion } = this.state;
      if (consolidacion === null) {
         return;
      }
      const lista = this.procesarConsolidacion(consolidacion);
      return (
         <Fragment>
            <table className='table table-bordered mt-5'>
               <thead className='bg-dark text-white'>
                  <tr >
                     <th colSpan={2}>Total Liquidación </th>
                  </tr>
                  <tr>
                     <th>Concepto </th>
                     <th>Valor </th>
                  </tr>
               </thead>
               <tbody>
                  {lista.map((consolidacion) => {
                     return (
                        <tr key={consolidacion.concepto}>
                           <td>{consolidacion.concepto}</td>
                           <td>{formato.format(consolidacion.valor)}</td>
                        </tr>
                     )
                  })}
                  <tr>
                     <td>TOTAL FACTURA</td>
                     <td>{formato.format(consolidacion.totalFactura)}</td>
                  </tr>
               </tbody>
            </table>
         </Fragment>
      )
   };

   /**
    * @method
    * Método encargado de obtener los totales del detalle seleccionado
    * @param {Array} detalle Detalle del contrato seleccionado
    */
   obtenerTotalesDetalle = (detalle) => {
      const totales = {
         'dlcvVlrtotalNeg': 0,
         'dlcvVlrtotalSubasta': 0,
      }
      for (let index = 0; index < detalle.length; index++) {
         const contratoDetalle = detalle[index];
         if (contratoDetalle.dlcvTipcontrato == 'ND') {
            totales.dlcvVlrtotalNeg += contratoDetalle.dlcvVlrtotal;
            continue;
         }
         totales.dlcvVlrtotalSubasta += contratoDetalle.dlcvVlrtotal;
      }
      return totales;
   };

   /**
    * @method
    * Método encargado de mostrar la tabla del detalle del punto de salida
    * @returns {JSX}
    */
   renderTablaDetalle = () => {
      let lista = [...this.state.detalleSeleccionado];
      if (!Util.validarArreglo(lista)) {
         return;
      }
      const totales = this.obtenerTotalesDetalle(lista);
      return (
         <Fragment>
            <button className='btn btn-primary' onClick={this.limpiarDetalle}>Limpiar Detalle</button>
            <div className='table-responsive'>
               <table className='table-normal table table-condensed table-bordered text-center mt-5'>
                  <thead className='bg-dark text-white'>
                     <tr >
                        <th colSpan={9}>Detalle Liquidación </th>
                     </tr>
                     <tr>
                        <th>Fecha </th>
                        <th>Cantidad Neg. Directa </th>
                        <th>Unidad Medida </th>
                        <th>Cantidad Subasta </th>
                        <th>Unidad Medida </th>
                        <th>Valor Neg. Directa </th>
                        <th>Valor Subasta </th>
                        <th>Total Neg. Directa </th>
                        <th>Total Subasta </th>
                     </tr>
                  </thead>
                  <tbody>
                     <Fragment>
                        {lista.map((detalle, index) => {
                           return (
                              <tr key={detalle.dia}>
                                 <td>{detalle.dia}</td>
                                 <td>{(detalle.dlcvTipcontrato === 'ND') ? getProp(detalle, 'dlcvCantidad') : 0}</td>
                                 <td>{(detalle.dlcvTipcontrato === 'ND') ? getProp(detalle.uniIdemedidacnt, 'uniNombre1', '') : ''}</td>
                                 <td>{(detalle.dlcvTipcontrato != 'ND') ? getProp(detalle, 'dlcvCantidad') : 0}</td>
                                 <td>{(detalle.dlcvTipcontrato != 'ND') ? getProp(detalle.uniIdemedidacnt, 'uniNombre1', '') : ''}</td>
                                 <td>{(detalle.dlcvTipcontrato === 'ND') ? getProp(detalle, 'dlcvValorind') : 0}</td>
                                 <td>{(detalle.dlcvTipcontrato != 'ND') ? getProp(detalle, 'dlcvValorind') : 0}</td>
                                 <td>{(detalle.dlcvTipcontrato === 'ND') ? getProp(detalle, 'dlcvVlrtotal') : 0}</td>
                                 <td>{(detalle.dlcvTipcontrato != 'ND') ? getProp(detalle, 'dlcvVlrtotal') : 0}</td>
                              </tr>
                           );
                        })
                        }
                        <tr className='bg-success'>
                           <td className='text-center th-sub' colSpan='7'></td>
                           <td className='text-center th-sub'>{totales.dlcvVlrtotalNeg}</td>
                           <td className='text-center th-sub'>{totales.dlcvVlrtotalSubasta}</td>
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
    * Método encargado de mostrar la tabla de los contratos seleccionados
    * @returns {Array}
    */
   renderTablaContratosSeleccionados = () => {
      const desabilitado = this.validarCertificado();
      if (!Util.validarArreglo(this.state.contratosSeleccionados)) {
         return;
      }
      return (
         <Table responsive striped bordered hover>
            <thead className='bg-dark text-white mt-5'>
               <tr>
                  <th colSpan={10}>Contratos Cliente Seleccionados </th>
               </tr>
               <tr>
                  <th>Acciones</th>
                  <th>Número de Contrato</th>
                  <th>Clase de Contrato</th>
                  <th>Fuente de Distribución</th>
                  <th>Cant. Contratada</th>
                  <th>Fecha Negociación</th>
                  <th>Fecha Inicial</th>
                  <th>Fecha Final</th>
                  <th>TRM Negociación</th>
                  <th>TRM Último Día Periodo</th>
               </tr>
            </thead>
            <tbody>
               {
                  this.state.contratosSeleccionados.map((dato, index) => {
                     return (
                        <tr key={`contrato_${dato.cntIderegistro}`}>
                           <td>
                              <button
                                 className="btn-primary btn-buscador input-group-btn"
                                 title='Eliminar'
                                 disabled={desabilitado}
                                 onClick={() => {
                                    this.eliminarContrato(index)
                                 }}><i className='fa fa-fw fa-minus'></i>
                              </button>
                              <button
                                 className="btn-primary btn-buscador input-group-btn"
                                 title='Detalle'
                                 onClick={() => {
                                    this.verDetalle(dato.cntIderegistro)
                                 }}><i className='fa fa-fw fa-search'></i>
                              </button>
                           </td>
                           <td>{dato.cntNumero}</td>
                           <td>{getProp(dato.uniIdeclasecontrato, 'uniNombre1', '')}</td>
                           <td>{getProp(dato.uniIdefuente, 'uniNombre1', '')}</td>
                           <td>{getProp(dato, 'cantidadContratada.cantidad', '')}</td>
                           <td>{dato.cntFecnegocio}</td>
                           <td>{dato.cntFechainicio}</td>
                           <td>{dato.cntFechafin}</td>
                           <td>{(dato.cntUsatrmtecho == 'S') ?
                              Math.min(getProp(dato, 'cntTrmtecho'), getProp(dato, 'covlValor', 0))
                              : getProp(dato, 'covlValor', 0)}</td>
                           <td>{this.state.trmPeriodo}</td>
                        </tr>
                     )
                  })
               }
            </tbody>
         </Table>
      );
   };

   /**
    * @method
    * Método encargado de obtener los totales de la tabla contratos padre
    * @param {Array} contratosPadre Contratos padre consultados
    * @returns {Object}
    */
   obtenerTotalesContratosPadre = (contratosPadre) => {
      const totales = {
         dlccCantventand: 0,
         dlccCantventasub: 0,
         remuneracionCalculada: 0,
      };
      for (let index = 0; index < contratosPadre.length; index++) {
         const contrato = contratosPadre[index];
         totales.dlccCantventand += getProp(contrato, 'dlccCantventand', 0);
         totales.dlccCantventasub += getProp(contrato, 'dlccCantventasub', 0);
         totales.remuneracionCalculada += getProp(contrato, 'remuneracionCalculada', 0);
      }
      return totales;
   };

   /**
    * @method
    * Método encargado de mostrar la tabla de los contratos padre
    * @returns {Array}
    */
   renderTablaContratosPadre = () => {
      const desabilitado = this.validarCertificado();
      if (!Util.validarArreglo(this.state.contratosPadre)) {
         return;
      }
      const totales = this.obtenerTotalesContratosPadre(this.state.contratosPadre);
      const label = ((this.state.tipoRenumeracion === 'PL' && this.state.tipoMercado === 'REG') ? 'Remuneración Regulada' : (this.state.tipoRenumeracion === 'PL' && this.state.tipoMercado === 'NREG') ? 'Remuneración No Regulada' : 'Seleccione el tipo de mercado');
      const atributo = ((this.state.tipoRenumeracion === 'PL' && this.state.tipoMercado === 'REG') ? 'dlccRemregulado' : (this.state.tipoRenumeracion === 'PL' && this.state.tipoMercado === 'NREG') ? 'dlccRemnoregulado' : 'NAM');
      return (
         <div className='table-responsive'>
            <table className='table table-condensed table-bordered mt-5'>
               <thead className='bg-dark text-white'>
                  <tr>
                     <th colSpan={(this.state.tipoRenumeracion === 'PL' ? 9 : 11)}>Contratos Padre </th>
                  </tr>
                  <tr>
                     <th>Número de Contrato</th>
                     <th>Proveedor</th>
                     <th>Cantidad Regulado</th>
                     <th>Cantidad No Regulado</th>
                     <th>Ventas Neg. Directa</th>
                     <th>Ventas Subasta</th>
                     <th>Remuneración Calculada</th>
                     <th>Tarifa por mbtu</th>
                     {this.state.tipoRenumeracion === 'PL' &&
                        <th>{label} </th>
                     }
                     {this.state.tipoRenumeracion === 'PD' &&
                        <Fragment>
                           <th>Remuneración Preliminar</th>
                           <th>Remuneración Regulado</th>
                           <th>Remuneración No Regulado</th>
                        </Fragment>
                     }
                  </tr>
               </thead>
               <tbody>
                  {
                     this.state.contratosPadre.map((dato, index) => {
                        return (
                           <tr key={`contrato_${dato.cntIderegistro.cntIderegistro}`}>
                              <td>{dato.cntIderegistro.cntNumero}</td>
                              <td>{getProp(dato.cntIderegistro.terIdeagente, 'terNomcompleto', '')}</td>
                              <td>{getProp(dato, 'dlccCantcontregulado', '')}</td>
                              <td>{getProp(dato, 'dlccCantcontnoregulado', '')}</td>
                              <td>{getProp(dato, 'dlccCantventand', '')}</td>
                              <td>{getProp(dato, 'dlccCantventasub', '')}</td>
                              <td>{getProp(dato, 'dlccRemindividual', '')}</td>
                              <td>{getProp(dato, 'dlccTarifa', '')}</td>
                              {this.state.tipoRenumeracion === 'PD' &&
                                 <Fragment>
                                    <td>{getProp(dato, 'dlccRempreliminar', '')}</td>
                                    <td>
                                       <TextoNumerico
                                          aceptaDecimales={true}
                                          aceptaNegativos={false}
                                          cols={12}
                                          value={dato.dlccRemregulado}
                                          onChange={this.controlarCambioTabla}
                                          name='dlccRemregulado'
                                          extra={{ 'data-index': index, disabled: desabilitado, readOnly: desabilitado }}
                                       />
                                    </td>
                                    <td>
                                       <TextoNumerico
                                          aceptaDecimales={true}
                                          aceptaNegativos={false}
                                          cols={12}
                                          value={dato.dlccRemnoregulado}
                                          onChange={this.controlarCambioTabla}
                                          name='dlccRemnoregulado'
                                          extra={{ 'data-index': index, disabled: desabilitado, readOnly: desabilitado }}
                                       />
                                    </td>
                                 </Fragment>
                              }
                              {this.state.tipoRenumeracion === 'PL' &&
                                 <Fragment>
                                    <td>
                                       <td>
                                          <TextoNumerico
                                             aceptaDecimales={true}
                                             aceptaNegativos={false}
                                             cols={12}
                                             value={dato[atributo]}
                                             onChange={this.controlarCambioTabla}
                                             name={atributo}
                                             extra={{ 'data-index': index, disabled: desabilitado, readOnly: desabilitado }}
                                          />
                                       </td>
                                    </td>
                                 </Fragment>
                              }
                           </tr>
                        )
                     })
                  }
                  <tr className='bg-success'>
                     <td className='text-center th-sub' colSpan='4'>{' '}</td>
                     <td className='text-center th-sub'>{totales.dlccCantventand}</td>
                     <td className='text-center th-sub'>{totales.dlccCantventasub}</td>
                     <td className='text-center th-sub'>{totales.remuneracionCalculada}</td>
                     <td className='text-center th-sub' colSpan={this.state.tipoRenumeracion === 'PD' ? 4 : 2}>{' '}</td>
                  </tr>
               </tbody>
            </table>
         </div>
      );
   };

   /**
    * @method
    * Método encargado de consultar el detalle día a día del contrato seleccionado
    * @param {Number} idContrato Identificador del contrato
    */
   verDetalle = (idContrato) => {
      const { detalles } = this.state;
      if (!Util.validarArreglo(detalles)) {
         toast.error('Debe realizar la liquidación');
         return;
      }
      const detalleSeleccionado = detalles.filter(d => d.cntIderegistro.cntIderegistro === idContrato);
      this.setState({ detalleSeleccionado });
   };

   /**
    * @method
    * Método encargado de procesar los datos de la liquidacion seleccionada
    * @param {Object} entidad Datos de la entidad seleccionada
    */
   seleccionarEntidad = async (entidad) => {
      const { data } = await axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA.CONSULTAR_DETALLE, { idLiquidacion: entidad.lqnsIderegistro });
      if (data.codigo > 0) {
         let contratos = [];
         const { contratosVenta, contratosCompra, terIderegistro,
            lqnsPeriodo, lqnsEstado, lqnsTipomercado,
            lqnsTiporemuneracion, consolidacion, lqnsCruzasaldos,
            lqnsIderegistro, detalleVenta } = data.datos;
         for (let index = 0; index < contratosVenta.length; index++) {
            let contrato = { ...contratosVenta[index] };
            contrato = { ...contrato, ...contrato.cntIderegistro };
            const respuesta = await axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_TRM, { criterio: '', fecha: contrato.cntFecnegocio });
            contrato.covlValor = respuesta.data.datos.covlValor;
            const { data } = await axios.post(RUTAS_API.CONTRATOS.CONSULTAR_DETALLE_CONTRATO, { idContrato: contrato.cntIderegistro });
            contrato.uniIdeclasecontrato = data.datos.uniIdeclasecontrato;
            contrato.uniIdefuente = data.datos.uniIdefuente;
            contrato.cntTrmtecho = data.datos.cntTrmtecho;
            contrato.cntUsatrmtecho = data.datos.cntUsatrmtecho;
            contratos = [...contratos, contrato];
         }
         const estadoLiquidacion = (lqnsEstado == 'P') ? 'Pendiente' : (lqnsEstado == 'C') ? 'Certificado' : 'Aprobado';
         this.obtenerValorFecha(lqnsPeriodo);
         this.consultarTRMPeriodo(lqnsPeriodo);
         this.setState({
            mostrarModalConsulta: false,
            contratosSeleccionados: contratos,
            contratosPadre: contratosCompra,
            tercero: terIderegistro,
            periodo: lqnsPeriodo,
            estadoLiquidacion: estadoLiquidacion,
            tipoRenumeracion: lqnsTiporemuneracion,
            tipoMercado: lqnsTipomercado,
            consolidacion: consolidacion,
            estado: lqnsEstado,
            cruzaSaldo: lqnsCruzasaldos,
            idLiquidacion: lqnsIderegistro,
            liquidado: true,
            detalles: detalleVenta
         });
      }
   };

   /**
    * @method
    * Metodo encargado de obtener la fecha inicio y fin basado en el periodo seleccionado
    * @returns {String}
    */
   obtenerValorFecha = (periodo) => {
      if (periodo == '') {
         return;
      }
      const startOfMonth = moment(periodo).startOf('month').format('YYYY-MM-DD');
      const endOfMonth = moment(periodo).endOf('month').format('YYYY-MM-DD');
      const fechas = {
         fechaInicio: startOfMonth,
         fechaFin: endOfMonth
      }
      this.setState({ fechas: fechas });
   }

   /**
    * @method
    * Método encargado de limpiar los datos del campo selector terceros
    */
   limpiarAgenteTercero = () => {
      this.setState({ tercero: null });
   };

   /**
    * @method
    * Método encargado de actualizar el objeto redux con el tercero seleccionado
    * @param {Object} agente Tercero seleccionado
    */
   seleccionarAgente = (agente) => {
      this.setState({ tercero: { ...agente } });
   };

   /**
    * @method
    * Método encargado de cerrar el componente ventana modal de la consulta terceros
    */
   abrirConsultaTerceros = () => {
      const consultaAgentes = <RConsultaAgentesTerceros esModal seleccionarEntidad={this.seleccionarAgente} />;
      this.props.mostrarProgramaModal(consultaAgentes);
   };

   /**
    * @method
    * Método encargado de mostrar el campo selector de agentes tercero
    * @returns {JSX}
    */
   renderBuscadorTercero = () => {
      const desabilitado = this.validarCertificado();
      const tercero = getProp(this.state, 'tercero', '');
      const propsInput = {
         placeholder: 'Seleccione un agente',
         className: 'form-control',
         onChange: this.controlarCambio,
         name: 'tercero',
         title: getProp(tercero, 'terNomcompleto', ''),
         value: getProp(tercero, 'terNomcompleto', ''),
         type: 'text',
         disabled: true
      };
      return (
         <div className='col-3 form-group'>
            <label>Agente Tercero:</label>
            <div className="input-group mb-3">
               <input {...propsInput} />
               <div className="input-group-prepend">
                  <button className="btn-primary input-group-text" title='Limpiar Agente' disabled={desabilitado} onClick={this.limpiarAgenteTercero}><i className='fa fa-fw fa-trash'></i></button>
                  <button className="btn-primary btn-buscador input-group-text" title='Seleccionar Agente Tercero' disabled={desabilitado} onClick={this.abrirConsultaTerceros}><i className='fa fa-fw fa-check-square-o'></i></button>
               </div>
            </div>
         </div>
      );
   };

   /**
    * @method
    * Método encargado de limpiar los contratos seleccionados
    */
   limpiarContratos = () => {
      this.setState({
         contratosSeleccionados: [],
         contratosPadre: []
      });
   }

   /**
    * @method
    * Método encargado de abrir le modal de consultar
    * @returns {Boolean}
    */
   abrirConsultaContratos = () => {
      if (this.state.periodo == '') {
         toast.error('Debe seleccionar un periodo');
         return;
      }
      if (this.state.tercero == null) {
         toast.error('Debe seleccionar un tercero');
         return;
      }
      if (this.state.tipoRenumeracion === '' || this.state.tipoRenumeracion == '-1') {
         toast.error('Debe seleccionar el tipo de Renumeración');
         return;
      }
      this.setState({ modalContratos: true });
   };

   /**
    * @method
    * Método encargado de mostrar el componente selector de contratos
    * @returns {Object}
    */
   renderSelectorContrato = () => {
      const desabilitado = this.validarCertificado();
      const propsInput = {
         placeholder: 'Buscar Contratos',
         className: 'form-control',
         name: 'contrato',
         title: (Util.validarArreglo(this.state.contratosSeleccionados)) ? this.state.contratosSeleccionados.length + ' contratos seleccionados' : '',
         value: (Util.validarArreglo(this.state.contratosSeleccionados)) ? this.state.contratosSeleccionados.length + ' contratos seleccionados' : '',
         type: 'text',
         disabled: true
      };
      return (
         <div className='col-3 form-group mt-1'>
            <label>Contrato:</label>
            <div className="input-group mb-3">
               <input {...propsInput} />
               <div className="input-group-prepend">
                  <button className="btn-primary input-group-text" disabled={desabilitado} title='Limpiar Contrato' onClick={this.limpiarContratos}><i className='fa fa-fw fa-trash'></i></button>
                  <button className="btn-primary btn-buscador input-group-text" disabled={desabilitado} title='Seleccionar contrato' onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
               </div>
            </div>
         </div>
      );
   };

   /**
    * @method
    * Método encargado de consultar los contratos padre de los contratos seleccionado
    * @param {Array} contratos Contratos Seleccionados
    */
   /* consultarContratosPadre = (contratos) => {
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA.CONSULTAR_CONTRATOS_PADRE, {})
         .then(response => {
            if (response.data.codigo > 0) {
               this.setState({ contratosPadre: response.data.datos });
            }
         });
   }
 */
   /**
    * @method
    * Método encargado de obtener el objeto para liquidar
    * @param {Array} contratosSuministro Contratos Suministro seleccionados
    */
   obtenerObjetoLiquidacion = (contratosSuministro = []) => {
      const { idLiquidacion, periodo, tipoRenumeracion, contratosPadre, tipoMercado, cruzaSaldo } = this.state;
      const contratosVenta = contratosSuministro.map(contrato => {
         return {
            cntIderegistro: limpiarJson(contrato),
            dlcvVlrtrm: (contrato.cntUsatrmtecho == 'S') ?
               Math.min(getProp(contrato, 'cntTrmtecho'), getProp(contrato, 'covlValor', 0))
               : getProp(contrato, 'covlValor', 0),
         }
      });
      const contratosCompra = contratosPadre.map(contrato => {
         return {
            cntIderegistro: limpiarJson(contrato.cntIderegistro),
            dlccCantcontregulado: contrato.dlccCantcontregulado,
            dlccCantcontnoregulado: contrato.dlccCantcontnoregulado,
            dlccRemregulado: getProp(contrato, 'dlccRemregulado'),
            dlccRemnoregulado: getProp(contrato, 'dlccRemnoregulado'),
            unidadMedida: limpiarJson(contrato.unidadMedida),
            dlccCantventand: getProp(contrato, 'dlccCantventand'),
            dlccCantventasub: getProp(contrato, 'dlccCantventasub'),
            dlccRemindividual: getProp(contrato, 'dlccRemindividual'),
            dlccTarifa: getProp(contrato, 'dlccTarifa'),
         }
      });
      const parametros = {
         lqnsIderegistro: idLiquidacion,
         contratosVenta: contratosVenta,
         lqnsPeriodo: periodo,
         lqnsTiporemuneracion: tipoRenumeracion,
         contratosCompra: !Util.validarArreglo(contratosCompra) ? [] : contratosCompra,
         lqnsTipomercado: tipoMercado,
         lqnsCruzasaldos: cruzaSaldo
      };
      return parametros;
   };

   /**
    * @method
    * Método encargado de validar si la liquidación esta en estado certificado
    * @returns {Boolean}
    */
   validarCertificado = () => {
      let desabilitado = false;
      if (this.state.estado == 'C') {
         desabilitado = true;
      }
      return desabilitado;
   }

   /**
    * @method
    * Método encargado agregar los contratos de suministro seleccionados
    * @param {Object} contratosSuministro Contratos de suministro seleccionados por el usuario
    */
   onSeleccionarContratos = async (contratosSuministro) => {
      let contratosPadre = [];
      for (let index = 0; index < contratosSuministro.length; index++) {
         const contrato = contratosSuministro[index];
         const respuesta = await axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_TRM, { criterio: '', fecha: contrato.cntFecnegocio });
         contrato.covlValor = respuesta.data.datos.covlValor;
         const { data } = await axios.post(RUTAS_API.CONTRATOS.CONSULTAR_DETALLE_CONTRATO, { idContrato: contrato.cntIderegistro });
         contrato.uniIdeclasecontrato = data.datos.uniIdeclasecontrato;
         contrato.uniIdefuente = data.datos.uniIdefuente;
         contrato.cntTrmtecho = data.datos.cntTrmtecho;
         contrato.cntUsatrmtecho = data.datos.cntUsatrmtecho;
      }
      const parametros = this.obtenerObjetoLiquidacion(contratosSuministro);
      const { data } = await axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_SUMINISTRO_NEGOCIACION_DIRECTA.CONSULTAR_CONTRATOS_PADRE, parametros);
      if (data.codigo < 0) {
         this.setState({
            modalContratos: false
         });
      }
      contratosPadre = data.datos.contratosCompra;
      this.setState({
         modalContratos: false,
         contratosSeleccionados: [...contratosSuministro],
         contratosPadre: contratosPadre
      });
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
               {this.renderBuscadorTercero()}
               <Fecha
                  label='Periodo'
                  name='periodo'
                  fecha={this.state.periodo}
                  onChange={this.controlarCambio}
                  sinDia={true}
                  cols={3}
               />
               <Fecha
                  label='Fecha Inicial'
                  name='fechaInicio'
                  fecha={getProp(this.state.fechas, 'fechaInicio', '')}
                  cols={3}
               />
               <Fecha
                  label='Fecha Final'
                  name='fechaFin'
                  fecha={getProp(this.state.fechas, 'fechaFin', '')}
                  cols={3}
               />
               {this.renderSelectorContrato()}
               <Input
                  label='Estado Liquidación:'
                  value={this.state.estadoLiquidacion}
                  name='estadoLiquidacion'
                  extra={{ disabled: true, readOnly: true }}
                  cols={3}
               />
               {this.renderRemuneracion()}
            </div>
            {this.state.contratosSeleccionados.length > 0 &&
               this.renderTablaContratosSeleccionados()
            }
            {this.state.contratosPadre.length > 0 &&
               this.renderTablaContratosPadre()
            }
            {Util.validarArreglo(this.state.detalleSeleccionado) &&
               this.renderTablaDetalle()
            }
            {this.state.consolidacion != null &&
               this.renderTablaConsolidacion()
            }
            <VentanaModal
               mostrar={this.state.modalContratos}
               titulo='Seleccionar Contrato'
               cerrarModal={() => this.setState({ modalContratos: false })}>
               <RConsultaContratos
                  esModal
                  seleccionMultiple
                  seleccionarEntidades={this.onSeleccionarContratos}
                  tiposContrato={['S']}
                  estadosContrato={['A', 'F']}
                  inhabilitarTercero={true}
                  tipoNegocio={'V'}
                  inhabilitarEstado={true}
                  tiposContratoDisabled={true}
                  periodoSeleccionado={this.state.periodo}
                  nombreAgente={getProp(this.state.tercero, 'terNomcompleto', '')}
                  inhabilitarAgente={true}
               />
            </VentanaModal>

            <VentanaModal
               mostrar={this.state.mostrarModalConsulta}
               titulo='Consultar Liquidación'
               cerrarModal={this.abrirCerrarModal}>
               <RConsultaLiquidacionSuministro
                  esModal
                  seleccionarEntidad={this.seleccionarEntidad}
               />
            </VentanaModal>
         </Fragment>
      );
   };
}

GestionLiquidacionSuministro.propTypes = {
   history: PropTypes.object,
   mostrarAlerta: PropTypes.func,
   mostrarProgramaModal: PropTypes.func,
};

const mapStateToProps = state => {
   return {};
};

const mapDispatchToProps = dispatch => {
   return bindActionCreators({
      mostrarAlerta,
      mostrarProgramaModal
   }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionLiquidacionSuministro);

export { VistaRedux as RGestionLiquidacionSuministro };
