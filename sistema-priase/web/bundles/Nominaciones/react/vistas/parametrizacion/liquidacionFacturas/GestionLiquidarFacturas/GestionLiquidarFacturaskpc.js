import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import axios from 'axios';
import PropTypes from 'prop-types';
import RUTAS_API from '../../../../global/rutas_api';
import { Input, Botonera, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import { bindActionCreators } from 'redux';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { RConsultaSaldos } from '../ConsultarSaldos';
import { RConsultaContratos } from '../../../contratos/ConsultaContratos';
import { get as getProp } from 'object-path';
import { Tabs, Tab, Table } from 'react-bootstrap';
import { limpiarJson, formatter } from '../../../../global/util_nominaciones';
import { toast } from 'react-toastify';
import moment from 'moment';
import './GestionLiquidarFacturas.scss';
import { RConsultaLiquidacionTransporte } from '../ConsultaLiquidacionTransporte';

class GestionLiquidarFacturas extends Component {

   state = {
      periodo: '',
      ajusTarifario: '',
      estado: '',
      estadoLiquidacion: '',
      tabActiva: '',
      trmPeriodo: '',
      dias: '',
      saldoContra: '',
      impuesto: '',
      tipo: '',
      saldoFavor: 0,
      contrato: null,
      idLiquidacion: null,
      consolidacion: null,
      saldos: [],
      listaDetalle: [],
      // Estado de la aplicacion
      modalContratos: false,
      modalSaldos: false,
      mostrarModalConsulta: false,
      liquidado: false,
   };

   /**
    * @method
    * Método encargado ejecutar una acción cuando se elimina el componente.
    */
   componentWillUnmount() {
      this.limpiarFormulario();
   };

   /**
    * @method
    * Método encargado de limpiar los campos del formulario.
    */
   limpiarFormulario = () => {
      this.setState({
         periodo: '',
         ajusTarifario: '',
         estado: '',
         tabActiva: '',
         trmPeriodo: '',
         dias: '',
         saldoContra: '',
         estadoLiquidacion: '',
         impuesto: '',
         tipo: '',
         saldoFavor: 0,
         saldos: [],
         listaDetalle: [],
         contrato: null,
         idLiquidacion: null,
         consolidacion: null,
         // Estado de la aplicacion
         modalContratos: false,
         modalSaldos: false,
         liquidado: false,
         mostrarModalConsulta: false,
      });
   };

   /**
    * @method
    * Método encargado de generar los botones del formulario.
    * @returns {Object}
    */
   obtenerFunciones = () => {
      const { liquidado, estado } = this.state;
      let funciones = [];
      if (liquidado) {
         funciones = [...funciones, { texto: 'Guardar', callback: this.guardarEntidad }];
      }
      if ((liquidado && estado == 'P')) {
         funciones = [...funciones, { texto: 'Aprobar', callback: this.aprobar }];
      }
      if (!this.obtenerDesabilitado()) {
         funciones = [...funciones, { texto: 'Consultar Saldos', callback: this.consultarSaldos }];

      }
      funciones = [...funciones,
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }];
      return funciones;
   };

   /**
    * @method
    * Método encargado de aprobar la liquidación
    */
   aprobar = () => {
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_TRANSPORTE_KPC.APROBAR, { idLiquidacion: this.state.idLiquidacion })
         .then(({ data }) => {
            if (data.codigo > 0) {
               this.limpiarFormulario();
            }
         })
   }

   /**
    * @method
    * Método encargado de abrir el modal para consultar los saldos
    * @returns {Boolean}
    */
   consultarSaldos = () => {
      if (this.state.contrato == null) {
         toast.error('Debe seleccionar un contrato');
         return;
      }
      this.setState({ modalSaldos: true });
   }

   /**
    * @method
    * Método encargado de consultar la liquidacion.
    * @returns {bool}
    */
   consultarEntidad = async () => {
      this.setState({ mostrarModalConsulta: true });
   };

   /**
    * @method
    * Método encargado de inhabilitar o desabilitar los campos dependiendo del estado
    * @returns {Boolean}
    */
   obtenerDesabilitado = () => {
      const { estado, tipo } = this.state;
      if (estado === 'A' && tipo === 'RL') {
         return true;
      }
      return false;
   }

   /**
    * @method
    * Método encargado de consultar el detalle de la liquidación y setearlo.
    * @param {Object} entidad Liquidación seleccionada
    * @returns {boolean}
    */
   onSeleccionarEntidad = async (entidad) => {
      const { data } = await axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_TRANSPORTE_KPC.CONSULTAR_DETALLE_LIQUIDACION, { idLiquidacion: entidad.idLiquidacion });
      if (data.codigo > 0) {
         const { estado, contrato, periodo, numeroDias, idLiquidacion, trm, saldoContra, ajusteTarifario, tipo } = entidad;
         const { detalles, saldoFavor, porcentajeImpuesto, recaudos } = data.datos;
         this.setState({
            mostrarModalConsulta: false,
            estado: estado,
            estadoLiquidacion: (estado === 'P') ? 'Pendiente' : 'Aprobado',
            contrato: limpiarJson(contrato),
            periodo: periodo,
            dias: numeroDias,
            idLiquidacion: idLiquidacion,
            trmPeriodo: trm,
            saldoContra: saldoContra,
            saldoFavor: saldoFavor,
            ajusTarifario: ajusteTarifario,
            liquidado: (estado == 'A' && tipo == 'RL') ? false : true,
            listaDetalle: detalles,
            consolidacion: data.datos,
            impuesto: porcentajeImpuesto,
            tipo: tipo,
            saldos: recaudos
         });
      }
   };

   /**
    * @method
    * Método encargado de guardar los datos de la entidad.
    * @returns {bool}
    */
   guardarEntidad = () => {
      const validacion = this.validarFormularioLiquidacion();
      if (!validacion.respuesta) {
         this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
         return false;
      }
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_TRANSPORTE_KPC.GUARDAR, limpiarJson(this.state.consolidacion))
         .then(respuesta => {
            if (respuesta.data.codigo > 0) {
               this.limpiarFormulario();
            }
         });
   };

   /**
    * @method
    * Método encargado de obtener la diferencia de días el periodo
    * @param {String} periodo Periodo seleccionado
    */
   obtenerDias = (periodo) => {
      if (periodo == '') {
         return;
      }
      const startOfMonth = moment(periodo).startOf('month');
      const endOfMonth = moment(periodo).endOf('month');
      const diferencia = (endOfMonth.diff(startOfMonth, 'days')) + 1;
      return diferencia;
   }

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
         });
   }

   /**
    * @method
    * Método encargado de controlar el cambio del valor de los campos del formulario.
    * @param {Event} evento El evento que se ejecuta en el control de usuario.
    */
   controlarCambio = (evento) => {
      if (this.obtenerDesabilitado()) {
         return;
      }
      let change = {};
      const { name, value } = evento.target;
      if (name === 'periodo') {
         this.consultarTRMPeriodo(value);
         const dias = this.obtenerDias();
         change.dias = dias;
         change.contrato = null;
         change.listaDetalle = [];
      }
      change[name] = value;
      change.liquidado = false;
      this.setState(change);
   };

   /**
    * @method
    * Método encargado de botener la lista de consolidacion
    * @param {Object} consolidación Datos de la liqudación
    */
   procesarConsolidacion = (consolidacion) => {
      const formato = formatter('es-co', 'COP');
      const formatoDolar = formatter('en-us', 'USD');
      const { cargoFijo, cargoVariable, cargoAoym,
         impuestoUsd, impuestoPesos, subtotal, total,
         comercializacion, saldoContra, totalFactura, saldoFavor, ajusteTarifario, totalPrepago } = consolidacion;
      let listaConsolidado = [];
      listaConsolidado = [...listaConsolidado, { concepto: 'Cargo Fijo (USD)', valor: formatoDolar.format(cargoFijo) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Cargo Variable(USD)', valor: formatoDolar.format(cargoVariable) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Cargo AO&M (COP$)', valor: formato.format(cargoAoym) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Cuota Fomento e Imp. Transporte(USD)', valor: formatoDolar.format(impuestoUsd) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Cuota Fomento e Imp. Transporte(COP)', valor: formato.format(impuestoPesos) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Sub Total', valor: formato.format(subtotal) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Comercializacion', valor: formato.format(comercializacion) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Total Liquidación', valor: formato.format(total) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Ajuste Tarifario Transportador', valor: formato.format(ajusteTarifario) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Prepagos', valor: formato.format(totalPrepago) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Saldos a Favor', valor: formato.format(saldoFavor) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Saldos en Contra', valor: formato.format(saldoContra) }];
      listaConsolidado = [...listaConsolidado, { concepto: 'Total Factura', valor: formato.format(totalFactura) }];
      return listaConsolidado;
   };

   /**
    * @method
    * Método encargado de mostrar la lista detalle de la cantidad contratada del contrato seleccionado
    * @returns {JSX}
    */
   renderConsolidacion = () => {
      const { consolidacion } = this.state;
      if (consolidacion == null) {
         return;
      }
      const lista = this.procesarConsolidacion(consolidacion);
      return (
         <table className='table table-bordered mt-5'>
            <thead className='bg-dark text-white'>
               <tr>
                  <th>Cargos Calculados</th>
                  <th>Firme</th>
               </tr>
            </thead>
            <tbody>
               {
                  lista.map((dato, index) => {
                     return (
                        <tr key={dato.concepto}>
                           <td>{dato.concepto}</td>
                           <td>{dato.valor}</td>
                        </tr>
                     )
                  })
               }
            </tbody>
         </table>
      )
   };

   /**
    * @method
    * Método encargado de obtener los totales en la lista de detalles
    * @param {Array} lista Lista de detalles
    * @returns {Object}
    */
   obtenerTotalesTramos = (lista) => {
      const totales = {
         cantidadContratadaDiaria: 0,
         cantidadContratadaMensual: 0,
         cantidadNominada: 0,
      }
      for (let index = 0; index < lista.length; index++) {
         const detalle = lista[index];
         totales.cantidadContratadaDiaria += detalle.cantidadContratadaDiaria;
         totales.cantidadContratadaMensual += detalle.cantidadContratadaMensual;
         totales.cantidadNominada += detalle.cantidadNominada;
      }
      return totales;
   };

   /**
    * @method
    * Método encargado de generar la tabla de cargos.
    * @returns {Object}
    */
   renderTablaTramos = () => {
      const { consolidacion } = this.state;
      if (consolidacion == null) {
         return;
      }
      const lista = [...consolidacion.detallesTramo];
      const totales = this.obtenerTotalesTramos(lista);
      return (
         <div className='table-responsive'>
            <table className='table-normal table table-condensed table-bordered text-center mt-5'>
               <thead className='bg-dark text-white mt-5'>
                  <tr>
                     <th>Tramo</th>
                     <th>Cargo Fijo Anual(USD/kpc)</th>
                     <th>Cargo Variable(USD/kpc)</th>
                     <th>{'Cargo AO&M Anual($/kpc)'}</th>
                     <th>Cargo Fijo Mensual(USD/kpc)</th>
                     <th>{'Cargo AO&M Mensual($/kpc)'}</th>
                     <th>Cantidad Contratada Diaria(KPC)</th>
                     <th>Cantidad Contratada Mensual(KPC)</th>
                     <th>Cantidad Nominada(KPC)</th>
                  </tr>
               </thead>
               <tbody>
                  {lista.map((dato, index) => {
                     return (
                        <tr key={getProp(dato.tramoCargo, 'trmIderegistro.trmNombre', '')}>
                           <td>{getProp(dato.tramoCargo, 'trmIderegistro.trmNombre', '')}</td>
                           <td>{dato.cargoFijo}</td>
                           <td>{dato.cargoVariable}</td>
                           <td>{dato.cargoAoym}</td>
                           <td>{dato.cargoFijoMensual}</td>
                           <td>{dato.cargoAoymMensual}</td>
                           <td>{dato.cantidadContratadaDiaria}</td>
                           <td>{dato.cantidadContratadaMensual}</td>
                           <td>{dato.cantidadNominada}</td>
                        </tr>
                     )
                  })}
                  <tr>
                     <td colSpan={6}>Totales</td>
                     <td>{totales.cantidadContratadaDiaria}</td>
                     <td>{totales.cantidadContratadaMensual}</td>
                     <td>{totales.cantidadNominada}</td>
                  </tr>
               </tbody>
            </table>
         </div>
      );
   };

   /**
    * @method
    * Método encargado de controlar el cambio en los valores de la tabla
    * @param {Event} event Evento ejecutado en el control de usuario
    */
   controlarCambioTabla = (event) => {
      if (this.obtenerDesabilitado()) {
         return;
      }
      let lista = [...this.state.listaDetalle];
      const { name, value, attributes } = event.target;
      const index = attributes['data-index'].value;
      lista[index][name] = value;
      this.setState({ listaDetalle: lista, liquidado: false });
   }

   /**
    * @method
    * Método encargado de obtener los totales en la lista de detalles
    * @param {Array} lista Lista de detalles
    * @returns {Object}
    */
   obtenerTotalesDetalle = (lista) => {
      const totales = {
         cantidadNominadaMbtu: 0,
         cantidadNominadaKpc: 0,
         capacidadRestar: 0,
         nominacionFinal: 0,
         cantidadContratadaMbtu: 0,
         cantidadContratadaKpc: 0,
         poderCalorifico: 0,
         cantidadSuperior: 0
      }
      for (let index = 0; index < lista.length; index++) {
         const detalle = lista[index];
         totales.cantidadNominadaMbtu += detalle.cantidadNominadaMbtu;
         totales.cantidadNominadaKpc += detalle.cantidadNominadaKpc;
         totales.capacidadRestar += (detalle.capacidadRestar == null) ? (dato.cantidadNominadaKpc - dato.cantidadEvento) : (detalle.capacidadRestar == '') ? 0 : parseFloat(detalle.capacidadRestar);
         totales.nominacionFinal += ((detalle.cantidadContratadaKpc * (getProp(this.state, 'contrato.cntFirmeza', 0) / 100)) - (getProp(detalle, 'capacidadRestar', 0)));
         totales.cantidadContratadaMbtu += detalle.cantidadContratadaMbtu;
         totales.cantidadContratadaKpc += detalle.cantidadContratadaKpc;
         totales.poderCalorifico += detalle.poderCalorifico;
         totales.cantidadSuperior += (detalle.cantidadNominadaKpc > detalle.cantidadContratadaKpc) ?
            (detalle.cantidadNominadaKpc - detalle.cantidadContratadaKpc) < 0 ? 0 : detalle.cantidadNominadaKpc - detalle.cantidadContratadaKpc : 0;
      }
      return totales;
   };

   /**
    * @method
    * Método encargado de generar la tabla de los contratos para cruce.
    * @returns {Object}
    */
   renderTablaDetalle = () => {
      let lista = [...this.state.listaDetalle];
      if (!Util.validarArreglo(lista)) {
         return;
      }
      const desabilitado = this.obtenerDesabilitado();
      const totales = this.obtenerTotalesDetalle(lista);
      return (
         <Table id="detalle" responsive striped bordered hover>
            <thead className='bg-dark text-white mt-5'>
               <tr>
                  <th>Fecha</th>
                  <th>Tramo</th>
                  <th>Nominación en MBTU</th>
                  <th>Nominación en KPC</th>
                  <th>Capacidad a Restar(KPC)</th>
                  <th>Capacidad Contratada Firme(KPC)</th>
                  <th>Capacidad Contratada (MBTU)</th>
                  <th>Capacidad Contratada (KPC)</th>
                  <th>Poder Calorifico</th>
                  <th>Cantidad Superior a la Contratada (KPC)</th>
                  <th>Novedad</th>
               </tr>
            </thead>
            <tbody>
               {
                  lista.map((dato, index) => {
                     return (
                        <tr key={`id_${Util.generarIdControl(index)}`}>
                           <td>{dato.fecha}</td>
                           <td>{dato.nombreTramo}</td>
                           <td>{dato.cantidadNominadaMbtu}</td>
                           <td>{dato.cantidadNominadaKpc}</td>
                           <td>{<TextoNumerico
                              aceptaDecimales={true}
                              aceptaNegativos={false}
                              cols={12}
                                 value={(dato.capacidadRestar == null) ? (dato.cantidadNominadaKpc - dato.cantidadEvento) : dato.capacidadRestar}
                              //value={dato.capacidadRestar}
                              onChange={this.controlarCambioTabla}
                              name='capacidadRestar'
                              extra={{ 'data-index': index }}
                           />}</td>
                           <td>{((dato.cantidadContratadaKpc * (getProp(this.state, 'contrato.cntFirmeza', 0) / 100)) - (getProp(dato, 'capacidadRestar', 0)))}</td>
                           <td>{dato.cantidadContratadaMbtu}</td>
                           <td>{dato.cantidadContratadaKpc}</td>
                           <td>{dato.poderCalorifico}</td>
                           <td>{(dato.cantidadNominadaKpc > dato.cantidadContratadaKpc) ?
                              (dato.cantidadNominadaKpc - dato.cantidadContratadaKpc) < 0 ? 0 : dato.cantidadNominadaKpc - dato.cantidadContratadaKpc : 0}</td>
                           <td>{(dato.tieneEvento) ? 'Evento Eximente' : 'Normal'}</td>
                        </tr>
                     )
                  })
               }
               <tr className='bg-success'>
                  <td className='text-center th-sub' colSpan='2'>Totales</td>
                  <td className='text-center th-sub'>{totales.cantidadNominadaMbtu}</td>
                  <td className='text-center th-sub'>{totales.cantidadNominadaKpc}</td>
                  <td className='text-center th-sub'>{totales.capacidadRestar}</td>
                  <td className='text-center th-sub'>{totales.nominacionFinal}</td>
                  <td className='text-center th-sub'>{totales.cantidadContratadaMbtu}</td>
                  <td className='text-center th-sub'>{totales.cantidadContratadaKpc}</td>
                  <td className='text-center th-sub'>{totales.poderCalorifico}</td>
                  <td className='text-center th-sub'>{totales.cantidadSuperior}</td>
                  <td className='text-center th-sub'>{'///'}</td>
               </tr>
            </tbody>
         </Table>
      );
   };

   /**
    * @method
    * Método encargado de setear los saldos seleccionados
    * @param {Array} saldos Saldos seleccionados
    */
   onSeleccionarSaldos = (saldos) => {
      const saldoFavor = saldos.reduce((acc, obj) => acc + obj.rccVlrsdo, 0);
      this.setState({
         saldos: saldos,
         saldoFavor: saldoFavor,
         modalSaldos: false,
         consolidacion: null,
         liquidado: false,
      });
   }

   /**
    * @method
    * Método encargado de validar los datos necesarios para liquidar.
    * @returns {Object}
    */
   validarFormularioLiquidacion = () => {
      const { periodo, contrato, ajusTarifario, saldoContra, impuesto } = this.state;
      console.log(ajusTarifario);
      if (periodo == '') {
         return { respuesta: false, mensaje: 'Debe seleccionar un periodo' };
      }

      if (contrato == null) {
         return { respuesta: false, mensaje: 'Debe seleccionar un contrato' };
      }

      if (ajusTarifario === '') {
         return { respuesta: false, mensaje: 'Debe ingresar un ajuste tarifario' };
      }

      if (saldoContra === '') {
         return { respuesta: false, mensaje: 'Debe ingresar los saldos en contra' };
      }

      if (impuesto == '' || parseFloat(impuesto) < 0 || parseFloat(impuesto) > 1) {
         return { respuesta: false, mensaje: 'El porcentaje de impuesto ingresado debe estar entre 0 y 1' };
      }

      return { respuesta: true };
   };

   /**
    * @method
    * Método encargado de obtener el objeto para poder realizar la liquidación.
    * @returns {Object}
    */
   obtenerObjetoLiquidar = () => {
      const { periodo, contrato, listaDetalle, ajusTarifario, saldoContra, saldoFavor, dias, trmPeriodo, saldos, impuesto, idLiquidacion } = this.state;
      const detalles = listaDetalle.map(d => {
         return { ...d, capacidadRestar: (!d.capacidadRestar) ? 0 : d.capacidadRestar }
      });
      const parametros = {
         numeroDias: dias,
         contrato: limpiarJson(contrato),
         periodo: periodo,
         trm: trmPeriodo,
         ajusteTarifario: ajusTarifario,
         saldoFavor: saldoFavor,
         saldoContra: saldoContra,
         recaudos: saldos,
         detalles: detalles,
         porcentajeImpuesto: impuesto,
         idLiquidacion: idLiquidacion
      };
      return parametros;
   }

   /**
    * @method
    * Método encargado de liquidar el contrato de transporte seleccionado
    * @returns {Boolean}
    */
   liquidar = () => {
      const validacion = this.validarFormularioLiquidacion();
      if (!validacion.respuesta) {
         toast.error(validacion.mensaje);
         return;
      }
      const parametros = this.obtenerObjetoLiquidar();
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_TRANSPORTE_KPC.LIQUIDAR, parametros)
         .then(({ data }) => {
            if (data.codigo > 0) {
               this.setState({
                  consolidacion: data.datos,
                  liquidado: true,
                  idLiquidacion: data.datos.idLiquidacion,
                  estado: '',
                  saldoFavor: data.datos.saldoFavor,
               });
            }
         });
   }

   /**
    * @method
    * Método encargado de cargar los datos de la entidad en la variable contrato
    * @param {Object} entidad Entidad seleccioanda
    */
   onSeleccionarContrato = async (entidad) => {
      const { periodo } = this.state;
      const { data } = await axios.post(RUTAS_API.CONTRATOS.CONSULTAR_DETALLE_CONTRATO, { idContrato: entidad.cntIderegistro });
      const { data: respuesta } = await axios.post(RUTAS_API.PARAMETRIZACION.GESTION_LIQUIDACION_FACTURAS_TRANSPORTE_KPC.CONSULTAR_DETALLES, { idContrato: entidad.cntIderegistro, periodo: periodo });
      const contrato = { ...entidad, uniIdemodalidadcontrato: data.datos.uniIdemodalidadcontrato };
      const trmPeriodo = (contrato.cntUsatrmtecho == 'S') ?
         Math.min(getProp(contrato, 'cntTrmtecho'), getProp(this.state, 'trmPeriodo', 0)) :
         getProp(this.state, 'trmPeriodo', 0);
      const { numeroDias, detalles } = respuesta.datos;
      const dias = (contrato.uniIdemodalidadcontrato.uniNombre1 == 'Firme') ? this.obtenerDias(periodo) : numeroDias;
      this.setState({
         modalContratos: false,
         contrato: contrato,
         trmPeriodo: trmPeriodo,
         dias: dias,
         listaDetalle: detalles
      });
   };

   /**
    * @method
    * Método encargado de abrir el modal de consultar contratos
    * @returns {Boolean}
    */
   abrirConsultaContratos = () => {
      if (this.state.periodo == '') {
         toast.error('Debe seleccionar un periodo')
         return;
      }
      this.setState({ modalContratos: true });
   };

   /**
    * @method
    * Método encargado de limpiar el contrato
    */
   limpiarContrato = () => {
      this.setState({ contrato: null });
   }

   /**
    * @method
    * Método encargado de mostrar el componente selector de contratos
    * @returns {Object}
    */
   renderSelectorContrato = () => {
      const desabilitado = this.obtenerDesabilitado();
      const contrato = getProp(this.state, 'contrato', null);
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
         <div className='col-3 form-group mt-1'>
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
    * Método encargado de controlar el cambio de tabs
    * @param {String} tab Nombre del tab nuevo
    */
   controlarTab = (tab) => {
      this.setState({ tabActiva: tab });
   }

   /**
    * @method
    * Método encargado de mostrar el formulario.
    * @returns {Object}
    */
   render() {
      const desabilitado = this.obtenerDesabilitado();
      return (
         <Fragment>
            <Botonera funciones={this.obtenerFunciones()} />
            <div className='conf-general row mt-5'>
               <Fecha
                  label='Periodo'
                  name='periodo'
                  fecha={this.state.periodo}
                  onChange={this.controlarCambio}
                  sinDia={true}
                  cols={3}
                  extra={{ disabled: desabilitado, readOnly: desabilitado }}
               />
               {this.renderSelectorContrato()}
               <Input
                  label='Fecha Inicial'
                  value={getProp(this.state, 'contrato.cntFechainicio', '')}
                  extra={{ disabled: true, readOnly: true }}
                  cols={3}
               />
               <Input
                  label='Fecha Final'
                  value={getProp(this.state, 'contrato.cntFechafin', '')}
                  extra={{ disabled: true, readOnly: true }}
                  cols={3}
               />
               <Input
                  label='Estado Liquidación'
                  value={getProp(this.state, 'estadoLiquidacion', '')}
                  extra={{ disabled: true, readOnly: true }}
                  cols={3}
               />
               <Input
                  label='TRM'
                  value={getProp(this.state, 'trmPeriodo', '')}
                  extra={{ disabled: true, readOnly: true }}
                  cols={3}
               />
               <Input
                  label='Número de Días a Liquidar'
                  value={getProp(this.state, 'dias', '')}
                  extra={{ disabled: true, readOnly: true }}
                  cols={3}
               />
               <Input
                  label='Modalidad Contrato'
                  value={getProp(this.state.contrato, 'uniIdemodalidadcontrato.uniNombre1', '')}
                  extra={{ disabled: true, readOnly: true }}
                  cols={3}
               />
               <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={true}
                  label='Ajuste Tarifario Transportador:'
                  cols={3}
                  value={this.state.ajusTarifario}
                  onChange={this.controlarCambio}
                  name='ajusTarifario'
                  cols={3}
                  extra={{ disabled: desabilitado, readOnly: desabilitado }}
               />
               <Input
                  label='% Comercialización'
                  value={getProp(this.state, 'contrato.cntPorcencomercial', '')}
                  extra={{ disabled: true, readOnly: true }}
                  cols={3}
               />
               <Input
                  label='Saldos a Favor'
                  value={getProp(this.state, 'saldoFavor', '')}
                  extra={{ disabled: true, readOnly: true }}
                  cols={3}
               />
               <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={true}
                  label='Saldos en Contra:'
                  cols={3}
                  value={this.state.saldoContra}
                  onChange={this.controlarCambio}
                  extra={{ disabled: desabilitado, readOnly: desabilitado }}
                  name='saldoContra'
               />
               <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={false}
                  label='% Impuesto (0-1):'
                  cols={3}
                  value={this.state.impuesto}
                  onChange={this.controlarCambio}
                  extra={{ disabled: desabilitado, readOnly: desabilitado }}
                  name='impuesto'
                  cols={3}
               />
            </div>
            <div className='row flexCentrado'>
               <button onClick={this.liquidar} disabled={desabilitado} className='btn btn-primary col-3' >{(this.state.estado === 'A' ? 'Re liquidar' : 'Liquidar')}</button>
            </div>
            <Tabs
               id="controlled-tab-example"
               activeKey={getProp(this.state, 'tabActiva', '')}
               onSelect={(k) => this.controlarTab(k)}
               className='mt-5 row col-12'
            >
               <Tab eventKey="detalle" title="Detalle">
               </Tab>
               <Tab eventKey="liquidacion" title="Liquidación">
               </Tab>
            </Tabs>
            {getProp(this.state, 'tabActiva', '') == 'detalle' &&
               <Fragment>
                  {this.renderTablaDetalle()}
               </Fragment>
            }
            {getProp(this.state, 'tabActiva', '') == 'liquidacion' &&
               <Fragment>
                  {this.renderTablaTramos()}
                  {this.renderConsolidacion()}
               </Fragment>
            }
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
                  tipoNegocio={'V'}
               />
            </VentanaModal>
            <VentanaModal
               mostrar={this.state.modalSaldos}
               titulo='Seleccionar Saldos'
               cerrarModal={() => this.setState({ modalSaldos: false })}>
               <RConsultaSaldos
                  esModal
                  seleccionMultiple
                  seleccionarEntidades={this.onSeleccionarSaldos}
                  idContrato={getProp(this.state, 'contrato.cntIderegistro')}
                  idTercero={getProp(this.state, 'contrato.terIdeagente.terIderegistro')}
               />
            </VentanaModal>
            <VentanaModal
               mostrar={this.state.mostrarModalConsulta}
               titulo='Consultar Liquidación'
               cerrarModal={() => { this.setState({ mostrarModalConsulta: false }) }}>
               <RConsultaLiquidacionTransporte
                  esModal
                  seleccionarEntidad={this.onSeleccionarEntidad}
               />
            </VentanaModal>
         </Fragment>
      );
   };
}

GestionLiquidarFacturas.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionLiquidarFacturas);

export { VistaRedux as RGestionLiquidarFacturas };
