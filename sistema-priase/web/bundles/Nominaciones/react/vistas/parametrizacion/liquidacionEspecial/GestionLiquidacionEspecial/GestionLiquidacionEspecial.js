import { Botonera, Fecha, TextoNumerico, Util, VentanaModal } from 'appfuture-react';
import axios from 'axios';
import { get as getProp } from 'object-path';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import RUTAS_API from '../../../../global/rutas_api';
import RUTAS_VISTA from '../../../../global/rutas_vista';
import { limpiarHistorico, obtenerDatosRespuesta } from '../../../../global/util_nominaciones';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { CLASES_UNIDADES, CONCEPTOS_CUSIANA } from '../../../../global/constantes';
import { RConsultaLiquidacionEspecial } from '../ConsultaLiquidacionEspecial';
import './GestionLiquidacionEspecial.scss';

const ESTADO_FINALIZADO = 'F';
const ESTADO_ACTIVO = 'A';

class GestionLiquidacionEspecial extends Component {

   state = {
      // Datos de la entidad
      periodoInicial: '',
      periodoFinal: '',
      contrato: null,
      detalleContrato: [],
      listaEstados: [],
      // Estado de la aplicacion
      mostrarModalConsulta: false,
      mostrarTabla: false,
      editar: false
   };

   /**
    * Método encargado de comprobar si el formulario ya cargo
    */
   componentDidMount() {
      const { state } = this.props.history && this.props.history.location;
      if (state && state.entidadEditar) {
         const contrato = state.entidadEditar;
         this.setState({ contrato: contrato });
      }
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_ESTADOS, { criterio: '', idClase: CLASES_UNIDADES.ESTADOS_CONTRATO })
         .then(respuesta => {
            if (respuesta.data.codigo > 0) {
               this.setState({ listaEstados: respuesta.data.datos });
            }
         });
   };

   /**
    * Método encargado ejecutar una acción cuando se elimina el componente
    */
   componentWillUnmount() {
      this.props.history.replace({ entidadEditar: null });
   };

   /**
    * Método encargado de limpiar los campos del formulario
    * @param {Event} evento El evento que se ejecuta en el control de usuario
    */
   limpiarFormulario = (evento) => {
      this.setState({
         // Datos de la entidad
         periodoInicial: '',
         periodoFinal: '',
         contrato: null,
         detalleContrato: [],
         // Estado de la aplicacion
         mostrarModalConsulta: false,
         mostrarTabla: false,
         editar: false
      });
      limpiarHistorico(this.props);
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
      const funciones = [
         { texto: 'Liquidar', callback: this.consultarDetalle },
         // { texto: 'Reliquidar', callback: this.reLiquidar },
         { texto: 'Consultar', callback: this.consultarEntidad },
         { texto: 'Limpiar', callback: this.limpiarFormulario }
      ];
      if (!this.state.editar) {
         funciones.push({ texto: 'Guardar', callback: this.guardar });
      }
      return funciones;
   };

   /**
    * Método encargado de procesar la factura para realizar la validación de las variables porcentaje
    * @param {factura} factura Factura a liquidar
    * @param {string} tipo Tipo de acción que se validara
    * @returns {Object}
    */
   procesarValidarDetalle = (factura, tipo = '') => {
      for (let index = 0; index < factura.listaFacDetalle.length; index++) {
         let diaDetalle = factura.listaFacDetalle[index];
         diaDetalle = diaDetalle[0];
         const cusianaFirmezagnv = diaDetalle.find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.CUSIANA_FIRMEZA_GNV.abreviatura) >= 0);
         const cusianaFirmezareg = diaDetalle.find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.CUSIANA_FIRMEZA_REG.abreviatura) >= 0);
         const llanogasFirmezagnv = diaDetalle.find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.LLANOGAS_FIRMEZA_GNV.abreviatura) >= 0);
         const llanogasFirmezareg = diaDetalle.find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.LLANOGAS_FIRMEZA_REG.abreviatura) >= 0);
         if (!cusianaFirmezagnv.fatdValortotal || cusianaFirmezagnv.fatdValortotal == '') {
            return { respuesta: false, mensaje: 'El porcentaje de la variable: ' + cusianaFirmezagnv.conIdeconcepto.conNombre + ' no puede ser vacio' };
         }
         if (!llanogasFirmezagnv.fatdValortotal || llanogasFirmezagnv.fatdValortotal == '') {
            return { respuesta: false, mensaje: 'El porcentaje de la variable: ' + llanogasFirmezagnv.conIdeconcepto.conNombre + ' no puede ser vacio' };
         }
         if (!cusianaFirmezareg.fatdValortotal || cusianaFirmezareg.fatdValortotal == '') {
            return { respuesta: false, mensaje: 'El porcentaje de la variable: ' + cusianaFirmezareg.conIdeconcepto.conNombre + ' no puede ser vacio' };
         }
         if (!llanogasFirmezareg.fatdValortotal || llanogasFirmezareg.fatdValortotal == '') {
            return { respuesta: false, mensaje: 'El porcentaje de la variable: ' + llanogasFirmezareg.conIdeconcepto.conNombre + ' no puede ser vacio' };
         }
         if ((parseFloat(cusianaFirmezagnv.fatdValortotal) + parseFloat(llanogasFirmezagnv.fatdValortotal)) != 100) {
            return { respuesta: false, mensaje: 'La suma de los porcentajes de firmeza gnv debe ser del 100%' };
         }
         if ((parseFloat(cusianaFirmezareg.fatdValortotal) + parseFloat(llanogasFirmezareg.fatdValortotal)) != 100) {
            return { respuesta: false, mensaje: 'La suma de los porcentajes de firmeza regulada debe ser del 100%' };
         }
         if (tipo == '') {
            if (typeof cusianaFirmezagnv.fatdValortotal == 'string' || typeof cusianaFirmezareg.fatdValortotal == 'string' ||
               typeof llanogasFirmezagnv.fatdValortotal == 'string' || typeof llanogasFirmezareg.fatdValortotal == 'string') {
               return { respuesta: false, mensaje: 'Debe hacer la reliquidación antes de guardar' };
            }
         }
      }
      return { respuesta: true };
   }

   /**
    * Método encargado de validar la reliquidación
    * @param {string} tipo Tipo de acción que se validara
    * @returns {object}
    */
   validarReliquidar = (tipo = '') => {
      const { detalleContrato } = this.state;
      for (let index = 0; index < detalleContrato.length; index++) {
         const factura = detalleContrato[index];
         return this.procesarValidarDetalle(factura, tipo);
      }
   };

   /**
    * Método encargado de guardar la liquidación
    * @returns {boolean}
    */
   guardar = () => {
      const { periodoFinal, periodoInicial, contrato, detalleContrato } = this.state;
      const validacion = this.validarFormularioDetalle('GUARDAR');
      //  const validacionTabla = this.validarReliquidar();
      if (!validacion.respuesta) {
         toast.error(validacion.mensaje);
         return;
      }
      //  if (!validacionTabla.respuesta) {
      //    toast.error(validacionTabla.mensaje);
      //    return;
      //  }
      const objeto = {
         fechaInicio: periodoInicial,
         fechaFin: periodoFinal,
         idContratoVenta: contrato.cntIderegistro,
         listaFacturas: detalleContrato
      };
      axios.post(RUTAS_API.PARAMETRIZACION.LIQUIDACION_CUSIANA.GUARDAR, objeto)
         .then(respuesta => {
            if (respuesta.data.codigo > 0) {
               this.limpiarFormulario();
            }
         });
   };

   /**
    * Obtiene el id específico del estado contrato finalizado.
    * @return {number}
    */
   obtenerIdEstado = (codigoEstado) => {
      const { listaEstados } = this.state;
      if (!Util.validarArreglo(listaEstados)) {
         toast.error('Error de configuración, no hay estados configurados.');
         return;
      }
      const estado = listaEstados.find(e => (JSON.parse(e.uniPropiedad).estado == codigoEstado));
      if (estado == null) {
         toast.error('Error de configuración el codigo de estado ' + codigoEstado + ' no se encuentra parametrizado');
         return;
      }
      return estado.uniIderegistro;
   };

   /**
    * Método encargado de redireccionar a la interfaz de consulta de contratos
    * @returns {boolean}
    */
   consultarContrato = () => {
      const estadoActivo = this.obtenerIdEstado(ESTADO_ACTIVO);
      const estadoFinalizado = this.obtenerIdEstado(ESTADO_FINALIZADO);
      if (estadoActivo == null || estadoFinalizado == null) {
         return;
      }
      this.props.history.push({
         pathname: RUTAS_VISTA.CONSULTA_CONTRATOS.url,
         state: {
            interfazGestion: RUTAS_VISTA.GESTION_LIQUIDACION_ESPECIAL_SUMINISTRO.url,
            estadosContrato: [estadoActivo, estadoFinalizado],
            tipoAgente: 'V',
            tiposContrato: ['S'],
            inhabilitarTercero: true,
            inhabilitarEstado: true,
            tiposContratoDisabled: true,
         }
      });
   };

   /**
    * Método encargado de procesar el detalle
    * @param {Object} factura Factura a procesar
    * @param {Array} listaPorcentaje Lista de variables tipo porcentaje
    */
   procesarDetalle = (factura, listaPorcentaje) => {
      factura.listaFacDetalle.map((detalle) => {
         const cusianaFirmezagnv = detalle[0].find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.CUSIANA_FIRMEZA_GNV.abreviatura) >= 0);
         const cusianaFirmezareg = detalle[0].find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.CUSIANA_FIRMEZA_REG.abreviatura) >= 0);
         const llanogasFirmezagnv = detalle[0].find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.LLANOGAS_FIRMEZA_GNV.abreviatura) >= 0);
         const llanogasFirmezareg = detalle[0].find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.LLANOGAS_FIRMEZA_REG.abreviatura) >= 0);
         listaPorcentaje.push(cusianaFirmezagnv, cusianaFirmezareg, llanogasFirmezagnv, llanogasFirmezareg);
         factura.listaDetalle = listaPorcentaje;
      });
   }
   /**
    * Método encargado de construir un objeto con los datos necesarios para reliquidar
    * @returns {Array}
    */
   obtenerObjetoReliquidar = () => {
      const detalleContrato = { ...this.state.detalleContrato };
      let listaPorcentaje = [];
      const facturas = detalleContrato.listaFacDetalle.map((detalle, index) => {
         const cusianaFirmezagnv = detalle[0].find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.CUSIANA_FIRMEZA_GNV.abreviatura) >= 0);
         const cusianaFirmezareg = detalle[0].find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.CUSIANA_FIRMEZA_REG.abreviatura) >= 0);
         const llanogasFirmezagnv = detalle[0].find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.LLANOGAS_FIRMEZA_GNV.abreviatura) >= 0);
         const llanogasFirmezareg = detalle[0].find(facd => facd.conIdeconcepto.conAbreviatura.search(CONCEPTOS_CUSIANA.LLANOGAS_FIRMEZA_REG.abreviatura) >= 0);
         listaPorcentaje.push(cusianaFirmezagnv, cusianaFirmezareg, llanogasFirmezagnv, llanogasFirmezareg);
         // factura.listaDetalle = listaPorcentaje;
      });
      detalleContrato.listaDetalle = listaPorcentaje;
      return detalleContrato.listaDetalle;
   };

   /**
    * Método encargado de guardar los datos de la entidad
    * @returns {bool}
    */
   reLiquidar = () => {
      const { periodoFinal, periodoInicial, contrato } = this.state;
      const validacion = this.validarFormularioDetalle('RELIQUIDAR');
      //  const validacionTabla = this.validarReliquidar('RELIQUIDAR');
      if (!validacion.respuesta) {
         toast.error(validacion.mensaje);
         return false;
      }
      //  if (!validacionTabla.respuesta) {
      //    toast.error(validacionTabla.mensaje);
      //    return false;
      //  }
      const objetoReliquidar = {
         fechaInicio: periodoInicial,
         fechaFin: periodoFinal,
         idContratoVenta: getProp(contrato, 'cntIderegistro'),
         listaFacturas: this.obtenerObjetoReliquidar()
      }

      axios.post(RUTAS_API.PARAMETRIZACION.LIQUIDACION_CUSIANA.RELIQUIDAR, objetoReliquidar)
         .then(respuesta => {
            if (respuesta.data.codigo > 0) {
               const data = obtenerDatosRespuesta(respuesta);
               this.setState({
                  detalleContrato: data,
                  mostrarTabla: false
               }, this.construirObjeto);
            }
         });
   };

   /**
    * Método encargado de validar las variables del formulario de consultar detalle
    * @param {string} tipo Tipo de acción a validar
    * @returns {Object}
    */
   validarFormularioDetalle = (tipo = '') => {
      const { periodoFinal, periodoInicial, contrato, detalleContrato } = this.state;
      if (contrato == null) {
         return { respuesta: false, mensaje: 'Debe seleccionar un contrato.' };
      }

      if (periodoInicial == '') {
         return { respuesta: false, mensaje: 'Debe seleccionar la fecha inicial' };
      }

      if (periodoFinal == '') {
         return { respuesta: false, mensaje: 'Debe seleccionar la fecha final.' };
      }

      if (periodoInicial > periodoFinal) {
         return { respuesta: false, mensaje: 'La fecha inicial no puede ser superior a la final.' };
      }

      if (tipo != '') {
         if (detalleContrato.length == 0) {
            return { respuesta: false, mensaje: 'Debe haber datos de liquidación para realizar la reliquidación' };
         }
      }
      if (tipo == 'GUARDAR') {
         if (detalleContrato.length == 0) {
            return { respuesta: false, mensaje: 'Debe haber datos de liquidación para guardar' };
         }
      }
      return { respuesta: true };
   };

   /**
    * Método encargado de consultar el detalle
    * @returns {boolean}
    */
   consultarDetalle = () => {
      const { periodoFinal, periodoInicial, contrato } = this.state;
      const validarDetalle = this.validarFormularioDetalle();
      if (!validarDetalle.respuesta) {
         toast.error(validarDetalle.mensaje);
         return;
      }
      const objeto = {
         fechaInicio: periodoInicial,
         fechaFin: periodoFinal,
         idContratoVenta: contrato.cntIderegistro
      };
      axios.post(RUTAS_API.PARAMETRIZACION.LIQUIDACION_CUSIANA.LIQUIDAR, objeto)
         .then(respuesta => {
            const data = obtenerDatosRespuesta(respuesta);
            this.setState({
               detalleContrato: data,
            }, this.construirObjeto);
         });
   };

   /**
    * Método encargado de abrir la ventana modal del boton consulta
    * @returns {Boolean}
    */
   consultarEntidad = () => {
      if (this.state.contrato == null) {
         toast.error('Debe seleccionar un contrato');
         return;
      }
      this.setState({
         mostrarModalConsulta: true,
         mostrarTabla: false,
         detalleContrato: {}
      });
   };

   /**
    * Método encargado de controlar el cambio del valor de los campos del formulario
    * @param {Event} evento El evento que se ejecuta en el control de usuario
    */
   controlarCambio = (evento) => {
      let change = {};
      change[evento.target.name] = evento.target.value;
      this.setState(change);
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
    * Método encargado de obtener el valor firme para el día dependiendo del medidor
    * @param {Object} medidor Punto de consumo al que se le obtendra la nominación
    * @param {String} fecha Fecha a comparar
    */
   obtenerPorcentajeFirmeza = (medidor, fecha, tipo = '') => {
      let valorDia = medidor.listaCantidad.find(l => l.fecha == fecha);
      if (valorDia == null) {
         return 0;
      }
      if (tipo == LLANOGAS) {
         const total = (100 - valorDia.porcentajeFirmeza);
         return total;
      }
      return valorDia.porcentajeFirmeza;
   };

   /**
     * Método encargado de obtener el valor firme para el día dependiendo del medidor
     * @param {Event} evento Evento ejecutado en el control de usuario
     * @param {String} concepto Variable a validar
     */
   controlarCambioTabla = (evento, concepto) => {
      const { detalleContrato } = this.state;
      const control = evento.target;
      const indexDetalle = control.attributes['data-indexdetalle'].value;
      const index = control.attributes['data-index'].value;
      const conceptoDetalle = detalleContrato[index].listaFacDetalle[indexDetalle][0].find(facd => facd.conIdeconcepto.conAbreviatura.search(concepto.abreviatura) >= 0);
      const indexDetalleFac = detalleContrato[index].listaFacDetalle[indexDetalle][0].findIndex(facd => facd.conIdeconcepto.conAbreviatura.search(concepto.abreviatura) >= 0);
      if (control.value > 100 || control.value < 0) {
         return;
      }
      conceptoDetalle.fatdValortotal = control.value;
      detalleContrato[index].listaFacDetalle[indexDetalle][0][indexDetalleFac] = conceptoDetalle;
      this.setState({ detalleContrato: detalleContrato });
   };

   /**
    * Método encargado de buscar el concepto por abreviatura
    * @param {Object} fechaDetalle Fecha de un día de liquidación
    * @param {String} concepto Abreviatura que se desea buscar
    * @param {string} tipo Tipo de variable
    * @returns {Number}
    */
   buscarConceptoAbreviatura = (fechaDetalle, concepto, tipo = '') => {
      const conceptoDetalle = fechaDetalle[0].find(facd => facd.conIdeconcepto.conAbreviatura.search(concepto.abreviatura) >= 0);
      if (conceptoDetalle == null) {
         return 'No se encontro el concepto: ' + concepto.nombre;
      };
      if (conceptoDetalle.conIdeconcepto.conAbreviatura == CONCEPTOS_CUSIANA.TRM.abreviatura) {
         return conceptoDetalle.fatdFechaliquida;
      }
      if (tipo == 'PORCENTAJE') {
         return conceptoDetalle.fatdValortotal;
      }
      const numeroDecimales = JSON.parse(conceptoDetalle.conIdeconcepto.uniUnidad.uniPropiedad).decimalesVisualiza;
      return conceptoDetalle.fatdValortotal.toFixed(numeroDecimales);
   }

   /**
    * Método encargado construir un objeto filtrando por fecha de liquidación
    * @param {String} tipo Tipo del registro
    */
   construirObjeto = async (tipo = '') => {
      let { detalleContrato } = this.state;
      if (detalleContrato.length == 0) {
         return;
      }
      let gruposFecha = {};
      if (tipo != '') {
         detalleContrato.listaDetalle.filter(fac => {
            const fecha = fac.fatdFechaliquida;
            //Creamos los grupos por fecha.
            if (!gruposFecha[fecha]) {
               gruposFecha[fecha] = [];
            }
            //Insertamos en el grupo por fecha.
            gruposFecha[fecha].push(fac);
         });
         detalleContrato.listaFacDetalle = [];
         for (const fecha in gruposFecha) {
            const grupoFecha = gruposFecha[fecha];
            detalleContrato.listaFacDetalle.push([grupoFecha])
         }
         gruposFecha = {};
         await this.setState({ detalleContrato: detalleContrato, mostrarTabla: true });
         return;
      }
      for (let index = 0; index < detalleContrato.length; index++) {
         const contrato = detalleContrato[index];
         contrato.listaDetalle.filter(fac => {
            const fecha = fac.fatdFechaliquida;
            //Creamos los grupos por fecha.
            if (!gruposFecha[fecha]) {
               gruposFecha[fecha] = [];
            }
            //Insertamos en el grupo por fecha.
            gruposFecha[fecha].push(fac);
         });
         detalleContrato[index].listaFacDetalle = [];
         for (const fecha in gruposFecha) {
            const grupoFecha = gruposFecha[fecha];
            detalleContrato[index].listaFacDetalle.push([grupoFecha])
         }
         gruposFecha = {};
      }
      await this.setState({ detalleContrato: detalleContrato, mostrarTabla: true });
   };

   /**
    * Método encargado de mostrar la tabla con el contrato a liquidar seleccionado
    * @returns {Array}
    */
   renderTablaDetalle = () => {
      const { detalleContrato } = this.state;
      const boolDetalle = Array.isArray(detalleContrato);
      if (Util.validarArreglo(detalleContrato)) {
         if (!Util.validarArreglo(detalleContrato[0].listaFacDetalle)) {
            return;
         }
      }
      const bool = (Object.entries(detalleContrato) === 0 && detalleContrato.constructor === Object);
      return (
         <div className='table-responsive'>
            <table className='table table-bordered mt-5'>
               <thead className='bg-dark text-white'>
                  <tr>
                     <th colSpan={16} className='text-center'>Lista Detalle</th>
                  </tr>
                  <tr>
                     <th className='text-center'>Día de gas</th>
                     <th className='text-center'>Nominado Mercado Regulado</th>
                     <th className='text-center'>Nominado Mercado GNV</th>
                     <th className='text-center'>Total Nominado</th>
                     <th className='text-center'>Excedentes Cusianagas Regulado </th>
                     <th className='text-center'>Excedentes Cusianagas GNV </th>
                     <th className='text-center'>Total Factura Cusiana GNV</th>
                     <th className='text-center'>Total Factura Cusiana Regulado</th>
                  </tr>
               </thead>
               {boolDetalle == true &&
                  <tbody>
                     {
                        detalleContrato.map((dato, index) => {
                           return (
                              <Fragment key={index}>
                                 {dato.listaFacDetalle.map((detalle, indexDetalle) => {
                                    return (
                                       <tr key={"fecha_" + indexDetalle}>
                                          <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.TRM)}</td>
                                          <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_NOMINACION_REG)}</td>
                                          <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_NOMINACION_GNV)}</td>
                                          <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_TOTAL_NOMINADO)}</td>
                                          <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_EXCEDENTE_ASUME_REG)}</td>
                                          <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_EXCEDENTE_ASUME_GNV)}</td>
                                          <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_TOTAL_DIA_USD_GNV)}</td>
                                          <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_TOTAL_DIA_USD_REG)}</td>
                                       </tr>
                                    )
                                 })
                                 }
                                 <tr>
                                    <td>{'TOTAL MBTU'}</td>
                                    <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_NOMINACION_REG, index)}</td>
                                    <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_NOMINACION_GNV, index)}</td>
                                    <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_TOTAL_NOMINADO, index)}</td>
                                    <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_EXCEDENTE_ASUME_REG, index)}</td>
                                    <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_EXCEDENTE_ASUME_GNV, index)}</td>
                                    <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_TOTAL_DIA_USD_GNV, index)}</td>
                                    <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_TOTAL_DIA_USD_REG, index)}</td>

                                 </tr>
                              </Fragment>
                           )
                        })
                     }
                  </tbody>
               }
               {boolDetalle == false &&
                  <tbody>
                     {!bool &&
                        detalleContrato.listaFacDetalle.map((detalle, indexDetalle) => {
                           return (
                              <tr key={"fecha_" + indexDetalle}>
                                 <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.TRM)}</td>
                                 <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_NOMINACION_REG)}</td>
                                 <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_NOMINACION_GNV)}</td>
                                 <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_TOTAL_NOMINADO)}</td>
                                 <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_EXCEDENTE_ASUME_REG)}</td>
                                 <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_EXCEDENTE_ASUME_GNV)}</td>
                                 <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_TOTAL_DIA_USD_GNV)}</td>
                                 <td>{this.buscarConceptoAbreviatura(detalle, CONCEPTOS_CUSIANA.CUSIANA_TOTAL_DIA_USD_REG)}</td>
                              </tr>
                           )
                        })
                     }
                     <tr>
                        <td>{'TOTAL MBTU'}</td>
                        <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_NOMINACION_REG)}</td>
                        <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_NOMINACION_GNV)}</td>
                        <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_TOTAL_NOMINADO)}</td>
                        <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_EXCEDENTE_ASUME_REG)}</td>
                        <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_EXCEDENTE_ASUME_GNV)}</td>
                        <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_TOTAL_DIA_USD_GNV)}</td>
                        <td>{this.obtenerTotalFactura(CONCEPTOS_CUSIANA.CUSIANA_TOTAL_DIA_USD_REG)}</td>
                     </tr>
                  </tbody>
               }
            </table>
         </div >
      );
   };

   /**
    * Método encargado de obtener el total de la factura por contrato
    * @param {Object} concepto Concepto a buscar
    * @param {String} tipo Tipo de concepto
    */
   obtenerTotalFactura = (concepto, index = null, tipo = '') => {
      const { detalleContrato } = this.state;
      let conceptoDetalle = [];
      if (!Util.validarArreglo(detalleContrato)) {
         conceptoDetalle = detalleContrato.listaDetalle.filter(facd => facd.conIdeconcepto.conAbreviatura.search(concepto.abreviatura) >= 0);
      } else {
         conceptoDetalle = detalleContrato[index].listaDetalle.filter(facd => facd.conIdeconcepto.conAbreviatura.search(concepto.abreviatura) >= 0);
      }
      if (!Util.validarArreglo(conceptoDetalle)) {
         return 'No se encontro el concepto: ' + concepto.nombre;
      };
      if (tipo == 'PORCENTAJE') {
         return conceptoDetalle.reduce((a, b) => a + b.fatdValortotal, 0);
      }
      const numeroDecimales = JSON.parse(conceptoDetalle[0].conIdeconcepto.uniUnidad.uniPropiedad).decimalesVisualiza;
      const valorADevolver = conceptoDetalle.map(item => item.fatdValortotal).reduce((a, b) => a + b, 0);
      return valorADevolver.toFixed(numeroDecimales);
   };

   /**
    * Obtiene los tipos de contrato de las propiedades que recibe de la tabla.
    * @param {Array} listaTipos Lista de tipos del contrato
    * @return {string}
    */
   obtenerTiposContrato = (listaTipos) => {
      if (!Array.isArray(listaTipos) || listaTipos.length == 0) {
         return 'Indefinido';
      }
      return listaTipos.map(tipo => {
         return tipo.uniIdetipocontrato.uniNombre1;
      }).join(',');
   };

   /**
    * Método encargado de mostrar la tabla con los contratos de venta
    * @returns {Array}
    */
   renderTablaContratos = () => {
      const { detalleContrato } = this.state;
      return (
         <table className='table table-bordered mt-5'>
            <thead className='bg-dark text-white'>
               <tr>
                  <th className='text-center'>Tercero</th>
                  <th className='text-center'>Contrato</th>
                  <th className='text-center'>Tipos de Contrato</th>
                  <th className='text-center'>Fecha Inicial Facturacion</th>
                  <th className='text-center'>Fecha Fin Facturacion</th>
               </tr>
            </thead>
            <tbody>
               {
                  detalleContrato.map((dato, index) => {
                     return (
                        <tr key={"contrato_" + dato.cntIdecontrato.cntIderegistro}>
                           <td>{getProp(dato.cntIdecontrato.terIdeagente, 'terNomcompleto', '')}</td>
                           <td>{getProp(dato.cntIdecontrato, 'cntNumero', '')}</td>
                           <td>{this.obtenerTiposContrato(getProp(dato.cntIdecontrato, 'listaTipos', []))}</td>
                           <td>{getProp(dato, 'fatFechafin', '')}</td>
                           <td>{getProp(dato, 'fatFechainicio', '')}</td>
                        </tr>
                     );
                  })
               }
            </tbody>
         </table>
      );
   };

   /**
    * Método encargado de controlar la selección de la liquidación
    * @param {Object} entidad Liquidación seleccionada
    */
   seleccionarEntidad = (entidad) => {
      axios.post(RUTAS_API.PARAMETRIZACION.LIQUIDACION_CUSIANA.CONSULTAR_DETALLE, { idfactura: entidad.fatIderegistro })
         .then(async respuesta => {
            const data = obtenerDatosRespuesta(respuesta);
            await this.setState({
               detalleContrato: data,
               mostrarModalConsulta: false,
               editar: true
            });
            this.construirObjeto('DETALLE');
         });
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
               <div className='form-group col-4'>
                  <label>Contrato:</label>
                  <div className='input-group'>
                     <input
                        type="text"
                        disabled={true}
                        className='form-control'
                        onChange={this.controlarCambio}
                        name='contrato'
                        placeholder='Seleccionar contrato'
                        value={`${getProp(this.state.contrato, 'terIdeagente.terNomcompleto', '')} # ${getProp(this.state.contrato, 'cntNumero', '')}`}
                     />
                     <div className='input-group-btn'>
                        <button className='btn btn-primary' onClick={this.consultarContrato}><i className='fa fa-fw fa-search'></i></button>
                     </div>
                  </div>
               </div>
               <Fecha
                  label='Fecha Inicial'
                  name='periodoInicial'
                  fecha={this.state.periodoInicial}
                  fechaInicio={null}
                  onChange={this.controlarCambio}
               />
               <Fecha
                  label='Fecha Final'
                  name='periodoFinal'
                  fecha={this.state.periodoFinal}
                  fechaFin={null}
                  onChange={this.controlarCambio}
               />
               {this.state.detalleContrato.length > 0 &&
                  this.renderTablaContratos()
               }
               {this.state.mostrarTabla &&
                  this.renderTablaDetalle()
               }
            </div>

            <VentanaModal
               mostrar={this.state.mostrarModalConsulta}
               titulo='Consultar Liquidación'
               cerrarModal={this.abrirCerrarModal}>
               <RConsultaLiquidacionEspecial
                  esModal
                  seleccionarEntidad={this.seleccionarEntidad}
                  idContrato={getProp(this.state.contrato, 'cntIderegistro', '')}
                  numeroContrato={getProp(this.state.contrato, 'cntNumero', '')}
                  tercero={getProp(this.state.contrato, 'terIdeagente', '')}
               />
            </VentanaModal>
         </Fragment>
      );
   };
}

GestionLiquidacionEspecial.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionLiquidacionEspecial);

export { VistaRedux as RGestionLiquidacionEspecial };
