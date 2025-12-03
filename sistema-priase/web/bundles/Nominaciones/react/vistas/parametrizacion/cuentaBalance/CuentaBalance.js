import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Botonera, Combo, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../global/rutas_api';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';
import './CuentaBalance.scss';
import { RConsultaContratos } from '../../contratos/ConsultaContratos'
import { formatearArray, TIPOS_UNIDADES_MEDIDA } from '../../../global/util_nominaciones';
import { get as getProp } from 'object-path';
import { toast } from 'react-toastify';
import { Tabs, Tab } from 'react-bootstrap'
import moment from 'moment';
const PUNTO_SALIDA = 'PS';
const PUNTO_CONSUMO = 'PC';

const tiposCuenta = [
  { texto: 'Puntos de Consumo', id: 'PC' },
  { texto: 'Puntos de Salida', id: 'PS' },
]

/**
 * @class
 * Clase encargada de renderizar la vista de cuenta balance
 */
class CuentaBalance extends Component {

  state = {
    tipoCuenta: '',
    fechaInicio: '',
    fechaFin: '',
    puntoConsumo: '',
    puntoSalida: '',
    puntoSalidaObjeto: {},
    contrato: null,
    tabActiva: 'cuenta',
    //listas
    listaPuntosSalida: [],
    listaPuntosConsumo: [],
    listaCuentaBalance: [],
    listaCuentaBalanceCREG: [],
    listaPuntosConsumoBalance: [],
    listaUnidadesMedida: [],
    //estados
    mostrarModalConsulta: false,
    modalContratos: false,
  };

  /**
   * Método encargado de ejecutar acciones al cargar el componente
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    let peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTOS_BALANCE, { idContrato: null }),
      axios.post(RUTAS_API.PARAMETRIZACION.PUNTOS_SALIDA.CONSULTAR_PUNTOS_SALIDA, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.CANTIDAD })
    ]
    axios.all(peticiones)
      .then(axios.spread((puntosConsumo, puntosSalida, unidadesCapacidad) => {
        const datosAplicacion = {
          listaPuntosSalida: [],
          listaUnidadesMedida: [],
          listaPuntosConsumo: [],
        };
        if (puntosConsumo.data.codigo > 0) {
          datosAplicacion.listaPuntosConsumo = formatearArray(puntosConsumo.data.datos);
        }
        if (puntosSalida.data.codigo > 0) {
          datosAplicacion.listaPuntosSalida = formatearArray(puntosSalida.data.datos);
        }
        if (unidadesCapacidad.data.codigo > 0) {
          datosAplicacion.listaUnidadesMedida = formatearArray(unidadesCapacidad.data.datos);
        }

        this.setState({ ...datosAplicacion });
      }));
  }

  /**
   * Méetodo encargado de consultar los puntos de consumo iniciales para la cuenta balance
   */
  consultarPuntosConsumoInicial = (idContrato = null) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PUNTOS_CONSUMO.CONSULTAR_PUNTOS_BALANCE, { idContrato: idContrato })
      .then(respuesta => {
        this.setState({ listaPuntosConsumo: [...formatearArray(respuesta.data.datos)] });
      });
  };

  /**
   * Método encargado de ejecutar una acción al momentto de salir del componente
   */
  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
    this.limpiarFormulario();
  }

  /**
   * Método encargado de limpiar todos los datos del componente
   */
  limpiarFormulario = () => {
    this.setState({
      tipoCuenta: '',
      fechaInicio: '',
      fechaFin: '',
      puntoConsumo: '',
      puntoSalida: '',
      contrato: null,
      puntoSalidaObjeto: null,
      tabActiva: 'cuenta',
      //listas
      listaCuentaBalance: [],
      listaCuentaBalanceCREG: [],
      listaPuntosConsumoBalance: [],
      //estados
      mostrarModalConsulta: false,
      modalContratos: false,
    }, this.consultarPuntosConsumoInicial());
  };

  /**
   * Método encargado de renderizar los botones del componente Botonera
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let botones = [
      { texto: 'Generar', callback: this.generarCuenta },
      { texto: 'Limpiar', callback: this.limpiarFormulario },
      { texto: 'Consultar', callback: this.consultarEntidad }
    ];
    if (this.state.tipoCuenta == PUNTO_SALIDA) {
      botones.push({ texto: 'Guardar', callback: this.guardarEntidad });
    }
    return botones;
  };

  /**
   * @method
   * Método encargado de validar los datos obligatorios
   * @returns {Object}
   */
  validarFormularioGenerar = () => {
    // Ejemplo Validacion
    const { tipoCuenta, puntoSalida, puntoConsumo, fechaFin, fechaInicio } = this.state;
    if (tipoCuenta == '-1' || tipoCuenta == '' || tipoCuenta == -1) {
      return { respuesta: false, mensaje: 'Debe seleccionar el tipo de cuenta' };
    }

    if (fechaInicio == '') {
      return { respuesta: false, mensaje: 'Debe seleccionar una fecha inicio.' };
    }

    if (fechaFin == '') {
      return { respuesta: false, mensaje: 'Debe seleccionar una fecha fin.' };
    }

    if ((tipoCuenta == PUNTO_CONSUMO && (puntoConsumo == '-1' || puntoConsumo == '' || puntoConsumo == -1))) {
      return { respuesta: false, mensaje: 'Debe seleccionar un punto de consumo.' };
    }

    if ((tipoCuenta == PUNTO_SALIDA && (puntoSalida == '-1' || puntoSalida == '' || puntoSalida == -1))) {
      return { respuesta: false, mensaje: 'Debe seleccionar un punto de salida.' };
    }
    return { respuesta: true };
  };

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
   * Método encargado de generar la cuenta balance para un punto de consumo o de salida
   * @returns {boolean}
   */
  generarCuenta = () => {
    const { tipoCuenta } = this.state;
    const validacion = this.validarFormularioGenerar();
    if (!validacion.respuesta) {
      toast.error(validacion.mensaje);
      return;
    }
    const objetoEnviar = this.obtenerObjetoEnviar();
    axios.post(RUTAS_API.CUENTA_BALANCE.RECALCULAR, objetoEnviar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          if (tipoCuenta == PUNTO_CONSUMO) {
            this.setState({ listaPuntosConsumoBalance: respuesta.data.datos });
            return;
          }
          if (tipoCuenta == PUNTO_SALIDA) {
            this.setState({
              listaCuentaBalance: respuesta.data.datos,
              listaCuentaBalanceCREG: (respuesta.data.datos[0].cuentaCreg) ? respuesta.data.datos : [],
            });
          }
        }
      });
  }

  /**
   * @method
   * Método encargado de obtener el objeto para guardar la cuenta balance para los puntos creg 114
   * @returns {Array}
   */
  obtenerObjetoGuardar = () => {
    const { listaCuentaBalanceCREG } = this.state;
    const listaFinal = listaCuentaBalanceCREG.map(cuenta => {
      return {
        ctbcIderegistro: cuenta.cuentaCreg.ctbcIderegistro,
        ctbcFirtransing: cuenta.cuentaCreg.ctbcFirtransing,
        uniIdemedidafiring: {
          uniIderegistro: cuenta.cuentaCreg.uniIdemedidafiring.uniIderegistro
        }
      }
    })
    return listaFinal;
  }

  /**
   * @method
   * Método encargado de validar el formulario para el metodo de guardar
   * @returns {Object}
   */
  validarFormulario = () => {
    const { listaCuentaBalanceCREG } = this.state;
    if (!Util.validarArreglo(listaCuentaBalanceCREG)) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar un punto con cuenta creg 114' } };
    }

    for (let index = 0; index < listaCuentaBalanceCREG.length; index++) {
      const cuenta = listaCuentaBalanceCREG[index];
      if (!(index == (listaCuentaBalanceCREG.length - 1))) {
        continue;
      }
      if (!cuenta.cuentaCreg.ctbcFirtransing || cuenta.cuentaCreg.ctbcFirtransing == '') {
        return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe ingresar una firmeza para el punto' } }
      }
      if (!cuenta.cuentaCreg.uniIdemedidafiring.uniIderegistro || cuenta.cuentaCreg.uniIdemedidafiring.uniIderegistro == '' || cuenta.cuentaCreg.uniIdemedidafiring.uniIderegistro == '-1') {
        return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe ingresar una unidad de medida para el punto' } }
      }
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
    const entidadGuardar = this.obtenerObjetoGuardar();
    axios.post(RUTAS_API.CUENTA_BALANCE.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * @method
   * Método encargado de abrir la ventana modal de consultar
   * @returns {Boolean}
   */
  consultarEntidad = () => {
    const { tipoCuenta } = this.state;
    const validacion = this.validarFormularioGenerar();
    if (!validacion.respuesta) {
      toast.error(validacion.mensaje);
      return;
    }
    const objetoConsultar = this.obtenerObjetoEnviar();
    axios.post(RUTAS_API.CUENTA_BALANCE.CONSULTAR, objetoConsultar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          if (tipoCuenta == PUNTO_CONSUMO) {
            this.setState({ listaPuntosConsumoBalance: respuesta.data.datos });
            return;
          }
          if (tipoCuenta == PUNTO_SALIDA) {
            this.setState({
              listaCuentaBalance: respuesta.data.datos,
              listaCuentaBalanceCREG: (respuesta.data.datos[0].cuentaCreg) ? respuesta.data.datos : [],
            });
          }
        }
      });
  };

  /**
   * Método encargado de controlar el cambio en los valores del state
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    let control = evento.target;
    if (control.name == 'tipoCuenta') {
      if (control.value == 'PC') {
        change.puntoSalida = '';
        change.puntoSalidaObjeto = {};
      }
      if (control.value == 'PS') {
        change.puntoConsumo = '';
        change.contrato = null;
        change.puntoSalidaObjeto = this.state.listaPuntosSalida.find(p => p.ptsaIderegistros == control.value);
      }
    }
    change.listaCuentaBalanceCREG = [];
    change.listaCuentaBalance = [];
    change.listaPuntosConsumoBalance = [];
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
   * Método encargado de abrir el modal de consultar contratos
   * @returns {Boolean}
   */
  abrirConsultaContratos = () => {
    this.setState({ modalContratos: true });
  };

  /**
   * Método encargado de limpiar el contrato
   */
  limpiarContrato = () => {
    this.setState({
      contrato: null,
    }, this.consultarPuntosConsumoInicial());
  }

  /**
   * Método encargado de mostrar el componente selector de contratos
   * @returns {Object}
   */
  renderSelectorContrato = () => {
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
      <div className='col-4 form-group mt-1'>
        <label>Contrato:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary input-group-text" title='Limpiar Contrato' onClick={this.limpiarContrato}><i className='fa fa-fw fa-trash'></i></button>
            <button className="btn-primary btn-buscador input-group-text" title='Seleccionar contrato' onClick={this.abrirConsultaContratos}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Método encargado de cargar los datos de la entidad en la variable contrato
   * @param {Object} entidad Entidad seleccioanda
   */
  onSeleccionarContrato = (entidad) => {
    this.consultarPuntosConsumoInicial(entidad.cntIderegistro);
    this.setState({
      contrato: entidad,
      modalContratos: false,
      puntoSalida: '',
      puntoConsumo: '',
      puntoSalidaObjeto: {},
      listaCuentaBalance: [],
      listaPuntosConsumoBalance: [],
      listaCuentaBalanceCREG: []
    });
  };

  /**
   * Método encargado de mostrar el calculo del balance del punto de salida
   * @returns {JSX}
   */
  renderTablaBalanceSalida = () => {
    const { listaPuntosSalida, listaCuentaBalance, puntoSalida } = this.state;
    let puntoSeleccionado = listaPuntosSalida.find(p => p.ptsaIderegistro == puntoSalida);
    if (!Util.validarArreglo(listaCuentaBalance)) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    return (
      <table className='table-normal table table-condensed table-bordered text-center'>
        <thead className='bg-dark text-white'>
          <tr>
            <th colSpan='7'>{puntoSeleccionado.ptsaNombre}</th>
          </tr>
          <tr>
            <th>Fecha</th>
            <th>Unidad de Medida</th>
            <th>Nominación</th>
            <th>Medición</th>
            <th>Desbalance Diario</th>
            <th>Desbalance Acumulado</th>
            <th>Porcentaje de Variación</th>
          </tr>
        </thead>
        <tbody>
          {Util.validarArreglo(listaCuentaBalance) &&
            listaCuentaBalance.map((cuenta, index) => {
              return (
                <tr key={index}>
                  <td>{cuenta.ctbFechagen.substr(0, 10)}</td>
                  <td>{cuenta.uniIdemedida.uniNombre1}</td>
                  <td>{cuenta.ctbNominacion}</td>
                  <td>{cuenta.ctbLectura}</td>
                  <td>{cuenta.ctbDesbalance}</td>
                  <td>{cuenta.ctbDesacumulado}</td>
                  <td>{cuenta.ctbPordesviacion}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  };

  /**
   * Método encargado de controlar el cambio del Componente TablaCreg114
   * @param {Number} index Posición a modificar
   * @param {Object} puntoNuevo Datos nuevos
   */
  controlarCambioTabla = (event) => {
    const control = event.target;
    let listaPuntos = [...this.state.listaCuentaBalanceCREG];
    const index = control.attributes['data-index'].value;
    let puntoNuevo = { ...listaPuntos[index] };
    if (control.name == 'uniIderegistro') {
      puntoNuevo.cuentaCreg.uniIdemedidafiring[control.name] = control.value;
    }
    if (control.name == 'ctbcFirtransing') {
      puntoNuevo.cuentaCreg[control.name] = control.value;
    }
    listaPuntos[index] = { ...puntoNuevo };
    this.setState({ listaCuentaBalanceCREG: listaPuntos });
  }

  /**
   * @method
   * Método encargado de consultar los datos del punto de consumo en su nueva unidad de medida
   * @param {Object} datosPunto Datos del punto a modificar
   */
  consultarNuevosDatosPunto = (datosPunto) => {
    const { tipoCuenta, fechaFin, fechaInicio } = this.state;
    let id;
    const idUnidad = datosPunto.unidadNueva;
    let objetoRecalculo = {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      tipoCuenta: tipoCuenta,
      idUnidad: idUnidad
    }
    if (datosPunto.cuentaBalanceUnidad != null) {
      id = datosPunto.cuentaBalanceUnidad.ptcIderegistro.ptcIderegistro;
    }
    if (datosPunto.cuentaBalanceUnidad == null) {
      id = datosPunto.cuentaBalance.ptcIderegistro.ptcIderegistro;
    }
    objetoRecalculo.id = id;
    axios.post(RUTAS_API.CUENTA_BALANCE.RECALCULAR, objetoRecalculo)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaPuntosConsumoBalance: respuesta.data.datos });
        }
      });
  }

  /**
   * @method
   * Método encargado de controlar el cambio de la unidad de medida en la tabla de puntos de consumo
   */
  controlarCambioTablaPuntos = (event) => {
    const index = event.target.attributes['data-index'].value;
    let punto = { ...this.state.listaPuntosConsumoBalance[index] };
    punto.unidadNueva = event.target.value;
    this.consultarNuevosDatosPunto(punto);
  }

  /**
   * Método encargado de mostrar la tabla del balance de un punto de consumo en especifico
   * @returns {JSX}
   */
  renderTablaPuntosConsumo = () => {
    const { listaPuntosConsumoBalance, puntoConsumo, listaPuntosConsumo } = this.state;
    let puntoSeleccionado = listaPuntosConsumo.find(p => p.ptcIderegistro == puntoConsumo);
    if (typeof puntoSeleccionado == 'undefined') {
      return;
    }
    if (listaPuntosConsumoBalance[0].cuentaBalanceUnidad != null) {
      const unidad = listaPuntosConsumoBalance[0].cuentaBalanceUnidad.uniIdemedida;
      return (
        <div class="table-responsive">
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
              {Util.validarArreglo(listaPuntosConsumoBalance) &&
                listaPuntosConsumoBalance.map((punto, index) => {
                  return (
                    <tr>
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
    }
    return (
      <div class="table-responsive">
        <table className='table table-normal table-condensed table-bordered text-center'>
          <thead className='bg-dark text-white'>
            <tr>
              <th colSpan='11'>{puntoSeleccionado.ptcoNombre}</th>
            </tr>
            <tr>
              <th>Fecha</th>
              <th>Unidad de Medida</th>
              <th>Nominación</th>
              <th>Medición</th>
              <th>Desbalance Diario</th>
              <th>Desbalance Acumulado</th>
              <th>Porcentaje de Variación</th>
            </tr>
          </thead>
          <tbody>
            {Util.validarArreglo(listaPuntosConsumoBalance) &&
              listaPuntosConsumoBalance.map((punto, index) => {
                return (
                  <tr>
                    <td>{punto.cuentaBalance.ctbFechagen.substr(0, 10)}</td>
                    <td>{punto.cuentaBalance.uniIdemedida.uniNombre1}</td>
                    <td>{punto.cuentaBalance.ctbNominacion}</td>
                    <td>{punto.cuentaBalance.ctbLectura}</td>
                    <td>{punto.cuentaBalance.ctbDesbalance}</td>
                    <td>{punto.cuentaBalance.ctbDesacumulado}</td>
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
   * Método encargado de renderizar la tabla de puntos de salida para puntos creg 114
   * @returns {JSX}
   */
  renderTablaCreg = () => {
    const { listaPuntosSalida, listaCuentaBalanceCREG, puntoSalida, listaUnidadesMedida } = this.state;
    let puntoSeleccionado = listaPuntosSalida.find(p => p.ptsaIderegistro == puntoSalida);
    let desabilitado = true;
    const fechaActual = moment();
    let diferencia;
    if (!Util.validarArreglo(this.state.listaCuentaBalanceCREG)) {
      return (<div className='text-center'>No se ha realizado el cálculo</div>);
    }
    return (
      <div className='table-responsive'>
        <table className='table table-condensed table-bordered text-center'>
          <thead className='bg-dark text-white'>
            <tr>
              <th colSpan='8' className='text-center'>{puntoSeleccionado.ptsaNombre}</th>
            </tr>
            <tr>
              <th>Fecha</th>
              <th>Unidad de Medida</th>
              <th>Desbalance Acumulado</th>
              <th>Firmeza Transportador</th>
              <th>Unidad de Medida Firmeza</th>
              <th>Total Firmeza</th>
              <th>Desvios</th>
              <th>Porcentaje de Desviación</th>
            </tr>
          </thead>
          <tbody>
            {Util.validarArreglo(listaCuentaBalanceCREG) &&
              listaCuentaBalanceCREG.map((punto, index) => {
                desabilitado = true;
                diferencia = fechaActual.diff(punto.cuentaCreg.ctbcFechagen, 'days');
                if (diferencia == 1) {
                  desabilitado = false;
                }
                return (
                  <tr>
                    <td>{punto.cuentaCreg.ctbcFechagen.substr(0, 10)}</td>
                    <td>{punto.cuentaCreg.uniIdemedida.uniNombre1}</td>
                    <td>{punto.cuentaCreg.ctbcDesacumulado}</td>
                    <td>
                      <TextoNumerico
                        aceptaDecimales={true}
                        aceptaNegativos={false}
                        cols={12}
                        value={punto.cuentaCreg.ctbcFirtransing}
                        onChange={this.controlarCambioTabla}
                        name='ctbcFirtransing'
                        extra={{ 'data-index': index, disabled: desabilitado, readOnly: desabilitado }}
                      />
                    </td>
                    <td>
                      <Combo
                        opciones={listaUnidadesMedida}
                        propTexto='uniNombre1'
                        propValor='uniIderegistro'
                        name='uniIderegistro'
                        value={punto.cuentaCreg.uniIdemedidafiring.uniIderegistro}
                        onChange={this.controlarCambioTabla}
                        extra={{ 'data-index': index, disabled: desabilitado, readOnly: desabilitado }}
                        cols={12}
                      />
                    </td>
                    <td>{punto.cuentaCreg.ctbcFirmezatrans}</td>
                    <td>{'0'}</td>
                    <td>{punto.cuentaCreg.ctbcPordesviacion}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  }

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
   * Método encargado de mostrar renderizar el componente
   * @returns {JSX}
   */
  render() {
    return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <Botonera funciones={this.obtenerFunciones()} />
        </div>
        <div className='conf-general row mt-5'>
          <Combo
            opciones={tiposCuenta}
            propTexto='texto'
            propValor='id'
            label='Tipo de Cuenta:'
            name='tipoCuenta'
            value={this.state.tipoCuenta}
            onChange={this.controlarCambio}
          />
          <Fecha
            label="Fecha Inicio:"
            onChange={this.controlarCambio}
            name='fechaInicio'
            fechaInicio={null}
            fechaFin={this.state.fechaFin}
            fecha={this.state.fechaInicio}
          />
          <Fecha
            label="Fecha Fin:"
            onChange={this.controlarCambio}
            name='fechaFin'
            fechaFin={null}
            fecha={this.state.fechaFin}
          />
          {this.state.tipoCuenta == PUNTO_SALIDA &&
            <Combo
              opciones={this.state.listaPuntosSalida}
              propTexto='ptsaNombre'
              propValor='ptsaIderegistro'
              label='Puntos de Salida:'
              name='puntoSalida'
              className='mt-1'
              value={this.state.puntoSalida}
              onChange={this.controlarCambio}
            />
          }
          {this.state.tipoCuenta == PUNTO_CONSUMO &&
            <Fragment>
              {this.renderSelectorContrato()}
              <Combo
                opciones={this.state.listaPuntosConsumo}
                propTexto='ptcoNombre'
                propValor='ptcIderegistro'
                label='Puntos de consumo:'
                name='puntoConsumo'
                value={this.state.puntoConsumo}
                className='mt-1'
                onChange={this.controlarCambio}
              />
            </Fragment>
          }
        </div>
        {(this.state.tipoCuenta == PUNTO_SALIDA && Util.validarArreglo(this.state.listaCuentaBalance)) &&
          <Tabs
            id="controlled-tab-example"
            activeKey={this.state.tabActiva}
            onSelect={(k) => this.controlarTab(k)}
            className='mt-5'
          >
            <Tab eventKey="cuenta" title="Cuenta Balance">
              {this.renderTablaBalanceSalida()}
            </Tab>
            {(Util.validarArreglo(this.state.listaCuentaBalanceCREG)) &&
              <Tab eventKey="cuentaCreg" title="Cuenta Balance Creg">
                {this.renderTablaCreg()}
              </Tab>
            }
          </Tabs>
        }
        {(this.state.tipoCuenta == PUNTO_CONSUMO && Util.validarArreglo(this.state.listaPuntosConsumoBalance)) &&
          this.renderTablaPuntosConsumo()
        }
        <VentanaModal
          mostrar={this.state.modalContratos}
          titulo='Seleccionar Contrato'
          cerrarModal={() => this.setState({ modalContratos: false })}>
          <RConsultaContratos
            esModal
            seleccionarEntidad={this.onSeleccionarContrato}
            inhabilitarTercero={true}
            tipoNegocio={'V'}
          />
        </VentanaModal>
      </Fragment>
    );
  }
}

CuentaBalance.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CuentaBalance);

export { VistaRedux as RCuentaBalance };
