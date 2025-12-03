import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, Combo, VentanaModal, Util, Fecha, TextoNumerico, Input } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../global/rutas_api';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import './CompensacionCuenta.scss';
import { RConsultaContratos } from '../../contratos/ConsultaContratos'
import { formatearArray, limpiarObjeto, limpiarJson } from '../../../global/util_nominaciones';
import { ESTADOS_COMPENSACION_CUENTA, ESTADOS_CRUCE } from '../../../global/constantes';
import { get as getProp } from 'object-path';
import { toast } from 'react-toastify';
import { Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';
import { RConsultarCompensacion } from './Componentes/ConsultarCompensacion';

/**
 * @class
 * Clase encargada de renderizar la vista de compesación cuenta balance
 */
class CompensacionCuenta extends Component {

  state = {
    periodo: '',
    puntoConsumo: '',
    contrato: null,
    tabActiva: 'cuenta',
    datosMedicion: null,
    tarifaParqueo: '',
    administracion: '',
    porcentajeCompensacion: '',
    idCompensacion: null,
    //listas
    listaPuntosConsumo: [],
    listaCuentaBalance: [],
    //estados
    modalContratos: false,
    modalConsulta: false,
    estadoCompensacion: ''
  };

  /**
   * @method
   * Método encargado de consultar los puntos de consumo iniciales para la cuenta balance
   * @param {Number} idContrato Identificador del contrato
   */
  consultarPuntosConsumoContrato = (idContrato, entidad = null) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTOS_BALANCE, { idContrato: idContrato })
      .then(respuesta => {
        if (entidad == null) {
          this.setState({ listaPuntosConsumo: [...formatearArray(respuesta.data.datos)] });
          return;
        }
        this.setState({
          listaPuntosConsumo: [...formatearArray(respuesta.data.datos)],
          modalConsulta: false,
          periodo: entidad.cmcbPeriodo,
          contrato: entidad.cntIderegistro,
          puntoConsumo: entidad.ptcIderegistro.ptcIderegistro,
          datosMedicion: entidad,
          tarifaParqueo: entidad.cmcbTarparqueo,
          administracion: entidad.cmcbPoradministracion,
          estadoCompensacion: entidad.ccbEstado,
          idCompensacion: entidad.cmcbIderegistro,
          porcentajeCompensacion: entidad.cmcbPorcompensacion
        }, this.consultarDatosPunto);
      });
  };

  /**
   * @method
   * Método encargado de ejecutar una acción al momentto de salir del componente
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  }

  /**
   * @method
   * Método encargado de limpiar todos los datos del componente
   */
  limpiarFormulario = () => {
    this.setState({
      periodo: '',
      puntoConsumo: '',
      estadoCompensacion: '',
      tarifaParqueo: '',
      administracion: '',
      tabActiva: 'cuenta',
      modalContratos: false,
      modalConsulta: false,
      contrato: null,
      datosMedicion: null,
      idCompensacion: null,
      porcentajeCompensacion: '',
      listaPuntosConsumo: [],
      listaCuentaBalance: [],
    });
  };

  /**
   * Método encargado de renderizar los botones del componente Botonera
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let botones = [];
    if (this.state.estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.APROBADO || this.state.estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.ANULADO) {
      botones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
      return botones;
    }
    botones.push({ texto: 'Guardar', callback: this.guardarEntidad });
    botones.push({ texto: 'Consultar', callback: this.consultarEntidad });
    if (this.state.estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.PENDIENTE) {
      botones.push({ texto: 'Aprobar', callback: () => { this.cambiarEstado(ESTADOS_COMPENSACION_CUENTA.APROBADO) } });
      botones.push({ texto: 'Anular', callback: () => { this.cambiarEstado(ESTADOS_COMPENSACION_CUENTA.ANULADO) } });
    }
    botones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });

    return botones;
  };

  /**
   * @method
   * Método encargado de abrir el modal de consulta de compensación
   */
  consultarEntidad = () => {
    this.setState({ modalConsulta: true });
  }

  /**
   * @method
   * Método encargado de cambiar el estado a la compensación
   * @param {String} estado Estado al que se cambiara la compensación
   */
  cambiarEstado = (estado) => {
    const { datosMedicion } = this.state;
    const objetoEnviar = {
      idCompensacion: datosMedicion.cmcbIderegistro,
      estado: estado
    }
    axios.post(RUTAS_API.COMPENSACION_CUENTA_BALANCE.ACTUALIZAR, objetoEnviar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  }

  /**
   * @method
   * Método encarado de formar el objeto para recalcular la cuenta balance
   * @returns {Object}
   */
  obtenerObjetoEnviar = () => {
    const { puntoSalida, puntoConsumo, fechaFin, fechaInicio, tipoCuenta } = this.state;
    return {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      id: (puntoSalida == '' || puntoSalida == '-1') ? puntoConsumo : puntoSalida,
      tipoCuenta: tipoCuenta
    }
  }

  /**
   * @method
   * Método encargado de validar el formulario para el metodo de guardar
   * @returns {Object}
   */
  validarFormulario = () => {
    const { contrato, periodo, puntoConsumo, tarifaParqueo, administracion, datosMedicion } = this.state;
    if (contrato == null) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar un contrato' } }
    }
    if (puntoConsumo == '-1' || puntoConsumo == '' || puntoConsumo == -1) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar un punto de consumo' } }
    }
    if (periodo == '') {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe ingresar el periodo' } }
    }

    if (tarifaParqueo == '') {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe ingresar la tarifa de parqueo' } }
    }

    if (administracion == '') {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe ingresar el porcentaje de administración' } }
    }

    if (Object.keys(datosMedicion).length == 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe realizar la liquidación de la compensación' } }
    }

    return { respuesta: true }
  };

  /**
   * Método encargado de guardar la cuenta balance
   * @returns {Boolean}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const entidadGuardar = { ...this.state.datosMedicion, cmcbIderegistro: this.state.idCompensacion };
    axios.post(RUTAS_API.COMPENSACION_CUENTA_BALANCE.GUARDAR, limpiarJson(entidadGuardar))
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * @method
   * Método encargado consultar la cuenta balance del punto de consumo
   * @param {Number} idPuntoConsumo Identificador del punto de consumo
   */
  consultarDatosPunto = (idPuntoConsumo = null, periodoChange = null, limpiar = null, actualizar = false) => {
    const { periodo } = this.state;
    if (idPuntoConsumo == null) {
      idPuntoConsumo = this.state.puntoConsumo;
    }
    const parametros = {
      fechaInicio: moment(periodoChange != null ? periodoChange : periodo, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD'),
      fechaFin: moment(periodoChange != null ? periodoChange : periodo, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD'),
      id: idPuntoConsumo,
      tipoCuenta: 'PC'
    }
    axios.post(RUTAS_API.CUENTA_BALANCE.CONSULTAR, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          let dataMedicion = { ...this.state.datosMedicion };
          if (limpiar != null) {
            limpiarObjeto(dataMedicion);
          }
          dataMedicion.totalMedicion = this.obtenerTotalMedicion(respuesta.data.datos);
          if (actualizar == true) {
            this.setState({
              listaCuentaBalance: respuesta.data.datos,
              datosMedicion: dataMedicion
            }, this.consultarTMGM);
            return;
          }

          this.setState({
            listaCuentaBalance: respuesta.data.datos,
            datosMedicion: dataMedicion
          });
        }
      });
  };

  /**
   * @method
   * Método encargado de consultar los valores de gm y tm
   * @param {Number} idPuntoConsumo Identificador del punto de consumo
   */
  consultarTMGM = (idPuntoConsumo = null, periodoChange = null) => {
    const { periodo } = this.state;
    if (idPuntoConsumo == null) {
      idPuntoConsumo = this.state.puntoConsumo;
    }
    axios.post(RUTAS_API.COMPENSACION_CUENTA_BALANCE.CONSULTAR_VALORES, { periodo: periodoChange == null ? periodo : periodoChange, idPuntoConsumo: idPuntoConsumo })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const dataMedicion = { ...this.state.datosMedicion };
          dataMedicion['cmcbVlrtm'] = getProp(respuesta.data.datos, 'GM', '');
          dataMedicion['cmcbVlrgm'] = getProp(respuesta.data.datos, 'TM', '');
          this.setState({ datosMedicion: { ...dataMedicion } });
        }
      });
  };


  /**
   * @method
   * Método encargado de consultar una compensación pendiente por punto de consumo
   * @param {Number} idPuntoConsumo Identificador del punto consumo
   */
  consultarCompensacion = (idPuntoConsumo) => {
    let parametros = {
      contrato: getProp(this.state.contrato, 'cntIderegistro', null),
      puntoConsumo: parseInt(idPuntoConsumo),
      periodo: '',
      estado: ESTADOS_CRUCE.PENDIENTE,
    }
    axios.post(RUTAS_API.COMPENSACION_CUENTA_BALANCE.CONSULTAR, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.cargarDatos(respuesta.data.datos[0]);
          return;
        }
        this.consultarDatosPunto(idPuntoConsumo, null, true, true);
      });
  };

  /**
   * Método encargado de controlar el cambio en los valores del state
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    const { estadoCompensacion } = this.state;
    if (estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.APROBADO || estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.ANULADO) {
      return;
    }
    let change = {};
    let control = evento.target;
    if (control.name == 'puntoConsumo' && control.value != '-1') {
      this.consultarCompensacion(control.value);
    }

    if (control.name == 'periodo' && control.value != '' && this.state.puntoConsumo != '') {
      this.consultarDatosPunto(this.state.puntoConsumo, control.value, true, true);
    }

    if (control.name == 'puntoConsumo' && control.value == '-1') {
      change.listaCuentaBalance = [];
      change.datosMedicion['cmcbVlrtm'] = '';
      change.datosMedicion['cmcbVlrgm'] = '';
    }

    if (control.name == 'cmcbVlrtm' || control.name == 'cmcbVlrgm') {
      const dataMedicion = { ...this.state.datosMedicion };
      dataMedicion[control.name] = control.value;
      this.setState({ datosMedicion: { ...dataMedicion } });
      return;
    }
    change[control.name] = control.value;
    this.setState(change);
  };

  /**
   * Método encargado de cerrar la ventana modal de consultar
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * @method
   * Método encargado de cargar los datos de la compensación seleccionada
   * @param {Object} entidad Datos de la compensación
   */
  cargarDatos = (entidad) => {
    this.consultarPuntosConsumoContrato(entidad.cntIderegistro.cntIderegistro, entidad);
  };

  /**
   * @method
   * Método encargado de consultar los puntos de consumo por contrato
   * @param {Number} idContrato Identificador del contrato seleccionado
   */
  consultarPuntosConsumo = (idContrato) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTOS_BALANCE, { idContrato: idContrato })
      .then(respuesta => {
        this.setState({ listaPuntosConsumo: [...formatearArray(respuesta.data.datos)] });
      });
  }

  /**
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} entidad Entidad seleccioanda
   */
  onSeleccionarContrato = (entidad) => {
    this.consultarPuntosConsumo(entidad.cntIderegistro);
    this.setState({
      contrato: entidad,
      modalContratos: false,
    });
  };

  /**
   * Método encargado de mostrar el calculo del balance del punto de consumo
   * @returns {JSX}
   */
  renderTablaBalance = () => {
    const { listaPuntosConsumo, listaCuentaBalance, puntoConsumo } = this.state;
    if (!Util.validarArreglo(listaCuentaBalance)) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    let puntoSeleccionado = listaPuntosConsumo.find(p => p.ptcIderegistro == puntoConsumo);
    if (typeof puntoSeleccionado == 'undefined' || puntoSeleccionado == null) {
      return;
    }
    const unidad = listaCuentaBalance[0].cuentaBalanceUnidad.uniIdemedida;
    return (
      <div className="table-responsive">
        <table className='table-normal table table-condensed table-bordered text-center'>
          <thead className='bg-dark text-white'>
            <tr>
              <th className='text-center' colSpan='11'>{puntoSeleccionado.ptcoNombre}</th>
            </tr>
            <tr>
              <th>Fecha</th>
              <th>Unidad de Medida</th>
              <th>Nominación</th>
              <th>Medición</th>
              <th>Desbalance Diario</th>
              <th>Desbalance Acumulado</th>
              <th>{`Nominación(${unidad.uniNombre1})`} </th>
              <th>{`Medición(${unidad.uniNombre1})`} </th>
              <th>{`Desbalance Diario(${unidad.uniNombre1})`} </th>
              <th>{`Desbalance Acumulado(${unidad.uniNombre1})`} </th>
              <th>Porcentaje de Variación</th>
            </tr>
          </thead>
          <tbody>
            {Util.validarArreglo(listaCuentaBalance) &&
              listaCuentaBalance.map((punto, index) => {
                return (
                  <tr key={punto.cuentaBalance.ctbFechagen}>
                    <td>{punto.cuentaBalance.ctbFechagen.substr(0, 10)}</td>
                    <td>{punto.cuentaBalance.uniIdemedida.uniNombre1}</td>
                    <td>{punto.cuentaBalance.ctbNominacion}</td>
                    <td>{punto.cuentaBalance.ctbLectura}</td>
                    <td>{punto.cuentaBalance.ctbDesbalance}</td>
                    <td>{punto.cuentaBalance.ctbDesacumulado}</td>
                    <td>{punto.cuentaBalanceUnidad.ctbNominacion}</td>
                    <td>{punto.cuentaBalanceUnidad.ctbLectura}</td>
                    <td>{punto.cuentaBalanceUnidad.ctbDesbalance}</td>
                    <td>{punto.cuentaBalanceUnidad.ctbDesacumulado}</td>
                    <td>{punto.cuentaBalance.ctbPordesviacion}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * @method
   * Método encargado de validar los datos obligatorios
   * @returns {Object}
   */
  validarFormularioGenerar = () => {
    // Ejemplo Validacion
    const { puntoConsumo, periodo, contrato, tarifaParqueo, administracion, porcentajeCompensacion } = this.state;
    if (contrato == null) {
      return { respuesta: false, mensaje: 'Debe seleccionar un contrato.' };
    }

    if (periodo == '') {
      return { respuesta: false, mensaje: 'Debe seleccionar un periodo.' };
    }

    if (puntoConsumo == '-1' || puntoConsumo == '' || puntoConsumo == -1) {
      return { respuesta: false, mensaje: 'Debe seleccionar un punto de consumo.' };
    }

    if (tarifaParqueo == '') {
      return { respuesta: false, mensaje: 'Debe ingresar una tarifa de parqueo' };
    }

    if (administracion == '') {
      return { respuesta: false, mensaje: 'Debe ingresar un porcentaje de administración' };
    }
    const administracionNumber = parseFloat(administracion);
    if (administracionNumber < 0 || administracionNumber > 1) {
      return { respuesta: false, mensaje: 'El porcentaje de administración debe estar entre 0 y 1.' };
    }
    const porcentajeCompensacionNumber = parseFloat(porcentajeCompensacion);
    if (porcentajeCompensacionNumber < 0 || porcentajeCompensacionNumber > 1) {
      return { respuesta: false, mensaje: 'El porcentaje de compensación debe estar entre 0 y 1.' };
    }
    return { respuesta: true };
  };

  /**
   * @method
   * Método encargado de construir el objeto para liquidar
   * @returns {Object}
   */
  contruirObjetoLiquidar = () => {
    const { periodo, puntoConsumo, listaPuntosConsumo, contrato, tarifaParqueo, administracion, porcentajeCompensacion, datosMedicion } = this.state;
    const punto = listaPuntosConsumo.find(p => p.ptcIderegistro == puntoConsumo);
    return {
      puntoConsumo: limpiarJson(punto),
      periodo: periodo,
      tarifaParqueo: tarifaParqueo,
      contrato: limpiarJson(contrato),
      porcentajeAdministracion: administracion,
      porcentajeCompensacion: porcentajeCompensacion,
      gm: datosMedicion.cmcbVlrgm,
      tm: datosMedicion.cmcbVlrtm,
    };
  }

  /**
   * @method
   * Método encargado de obtener el total de la medicion
   * @param {Array} listaCuenta Lista con la cuenta balance
   */
  obtenerTotalMedicion = (listaCuenta) => {
    let total = 0;
    for (let index = 0; index < listaCuenta.length; index++) {
      const datosCuenta = listaCuenta[index];
      total += datosCuenta.cuentaBalance.ctbLectura;
    }
    return total;
  }

  /**
   * @method
   * Método encargado de liquidar los conceptos de liquidación
   * @returns {Boolean}
   */
  liquidar = () => {
    const validar = this.validarFormularioGenerar();
    if (!validar.respuesta) {
      toast.error(validar.mensaje);
      return;
    }
    const objeto = this.contruirObjetoLiquidar();
    axios.post(RUTAS_API.COMPENSACION_CUENTA_BALANCE.LIQUIDAR, objeto)
      .then(respuesta => {
        let datosMedicion = respuesta.data.datos;
        datosMedicion.totalMedicion = this.obtenerTotalMedicion(this.state.listaCuentaBalance);
        this.setState({ datosMedicion: datosMedicion, estadoCompensacion: '' });
      });
  }

  /**
   * @method
   * Método encargado de mostrar el formulario de calculos de la compensación
   * @returns {JSX}
   */
  renderFormCompensacion = () => {
    const { estadoCompensacion } = this.state;
    let desabilitado = false;
    if (estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.APROBADO || estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.ANULADO) {
      desabilitado = true;
    }
    return (
      <div className='row mt-5'>
        <Fragment >
          <Input
            label='Total Medicion MBT:'
            value={getProp(this.state.datosMedicion, 'totalMedicion', '')}
            name='totalMedicion'
            extra={{ disabled: true, readOnly: true }}
          />
          <Input
            label='Desbalance en MBT:'
            value={getProp(this.state.datosMedicion, 'cmcbDesbalance', '')}
            name='cmcbDesbalance'
            extra={{ disabled: true, readOnly: true }}
          />
          <Input
            label='Desbalance en M3:'
            value={getProp(this.state.datosMedicion, 'cmcbDesbalancem3', '')}
            name='cmcbDesbalancem3'
            extra={{ disabled: true, readOnly: true }}
          />
          <Input
            label='%Desbalance:'
            value={getProp(this.state.datosMedicion, 'cmcbPordesbalance', '')}
            name='cmcbPordesbalance'
            extra={{ disabled: true, readOnly: true }}
          />
          <Input
            label='Cantidad a Compensar:'
            value={getProp(this.state.datosMedicion, 'cmcbCantidad', '')}
            name='cmcbCantidad'
            extra={{ disabled: true, readOnly: true }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Tarifa de Parqueo:'
            value={this.state.tarifaParqueo}
            onChange={this.controlarCambio}
            name='tarifaParqueo'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Porcentaje de Compensación(0-1):'
            value={this.state.porcentajeCompensacion}
            onChange={this.controlarCambio}
            name='porcentajeCompensacion'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='% Administracion (0-1):'
            value={this.state.administracion}
            onChange={this.controlarCambio}
            name='administracion'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <Input
            label='TRM:'
            value={getProp(this.state.datosMedicion, 'cmcbVlrtrm', '')}
            name='cmcbVlrtrm'
            extra={{ disabled: true, readOnly: true }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='GM:'
            value={getProp(this.state.datosMedicion, 'cmcbVlrgm', '')}
            name='cmcbVlrgm'
            onChange={this.controlarCambio}
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='TM:'
            value={getProp(this.state.datosMedicion, 'cmcbVlrtm', '')}
            onChange={this.controlarCambio}
            name='cmcbVlrtm'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <Input
            label='Valor de la Compensación:'
            value={getProp(this.state.datosMedicion, 'cmcbVlrcompensacion', '')}
            name='cmcbVlrcompensacion'
            extra={{ disabled: true, readOnly: true }}
          />

          <div className='grupo col-4'>
            <button disabled={desabilitado} className='btn btn-primary mt-2' onClick={this.liquidar}>Liquidar</button>
          </div>
        </Fragment>
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
   * Método encargado de limpiar el contrato
   */
  limpiarContrato = () => {
    this.setState({
      contrato: null,
      listaPuntosConsumo: [],
    });
  }

  /**
   * Método encargado de abrir el modal de consultar contratos
   * @returns {Boolean}
   */
  abrirConsultaContratos = () => {
    this.setState({ modalContratos: true });
  };

  /**
   * Método encargado de mostrar el componente selector de contratos
   * @returns {Object}
   */
  renderSelectorContrato = () => {
    const { estadoCompensacion } = this.state;
    let desabilitado = false;
    if (estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.APROBADO || estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.ANULADO) {
      desabilitado = true;;
    }
    const contrato = getProp(this.state, 'contrato', null);
    const propsInput = {
      placeholder: 'Seleccione un contrato',
      className: 'form-control',
      onChange: this.controlarCambio,
      name: 'contrato',
      title: `${getProp(contrato, 'cntNumero', '')}-${getProp(contrato, 'cntNumero', '')}`,
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
            <button disabled={desabilitado} className="btn-primary input-group-text" title='Limpiar Contrato' onClick={this.limpiarContrato}><i className='fa fa-fw fa-trash'></i></button>
            <button disabled={desabilitado} className="btn-primary btn-buscador input-group-text" title='Seleccionar contrato' onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * @method
   * Método encargado de mostrar renderizar el componente
   * @returns {JSX}
   */
  render() {
    const { estadoCompensacion } = this.state;
    let desabilitado = false;
    if (estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.APROBADO || estadoCompensacion == ESTADOS_COMPENSACION_CUENTA.ANULADO) {
      desabilitado = true;;
    }
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          {this.renderSelectorContrato()}
          <Fecha
            label="Periodo:"
            onChange={this.controlarCambio}
            name='periodo'
            fecha={this.state.periodo}
            sinDia={true}
          />
          <Combo
            opciones={this.state.listaPuntosConsumo}
            propTexto='ptcoNombre'
            propValor='ptcIderegistro'
            label='Puntos de consumo:'
            name='puntoConsumo'
            value={this.state.puntoConsumo}
            onChange={this.controlarCambio}
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
        </div>
        {(this.state.puntoConsumo != '-1' && this.state.puntoConsumo != '') &&
          <Tabs
            id="controlled-tab-example"
            activeKey={this.state.tabActiva}
            onSelect={(k) => this.controlarTab(k)}
            className='mt-5'
          >
            <Tab eventKey="cuenta" title="Cuenta Balance">
              {this.renderTablaBalance()}
            </Tab>
            <Tab eventKey="compensacion" title="Calculos de la Compensación">
              {this.renderFormCompensacion()}
            </Tab>
          </Tabs>
        }
        <VentanaModal
          mostrar={this.state.modalContratos}
          titulo='Seleccionar Contrato'
          cerrarModal={() => this.setState({ modalContratos: false })}>
          <RConsultaContratos
            esModal
            seleccionarEntidad={this.onSeleccionarContrato}
            inhabilitarTercero={true}
            estadosContrato={['A', 'F']}
            inhabilitarEstado={true}
            tipoNegocio={'V'}
          />
        </VentanaModal>
        <VentanaModal
          mostrar={this.state.modalConsulta}
          titulo='Seleccionar Compensación'
          cerrarModal={() => this.setState({ modalConsulta: false })}>
          <RConsultarCompensacion
            esModal
            seleccionarEntidad={this.cargarDatos}
          />
        </VentanaModal>
      </Fragment>
    );
  }
}

CompensacionCuenta.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CompensacionCuenta);

export { VistaRedux as RCompensacionCuenta };
