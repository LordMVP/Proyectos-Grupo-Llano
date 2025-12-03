import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import RUTAS_API from '../../../../global/rutas_api';
// REDUX
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { get as getProp, get } from 'object-path';
import { actualizarCabeceraContrato, actualizarListaContratos, actualizarTipoCalculoContrato } from '../../../../store/actions/ContratosAcciones';

// UI
import Modal from 'react-bootstrap4-modal';
import { Combo, Input, Fecha, TextoNumerico, VentanaModal, Util } from 'appfuture-react';
import { RConsultaAgentesTerceros } from '../../../index';
import { RGestionMedidoresSuministro } from '../../../parametrizacion/medidorSuministro/GestionMedidorSuministro/GestionMedidorSuministro';
import { SelectorRutas } from '../../../utils/SelectorRutas';
import { SelectorPuntosSalida } from '../../../utils/SelectorPuntosSalida';
// Util
import moment from 'moment';
import { preciseDiff as obteDate } from 'moment-precise-range-plugin';

import { validarOR, parsearJSON, esperar, formatearArray } from '../../../../global/util_nominaciones';

import './CabeceraContrato.scss';
import axios from 'axios';
import { toast } from 'react-toastify';

// TODO: Cargar de la BD
const tiposNegocio = [
  { id: 'C', tipo: 'Compra' },
  { id: 'V', tipo: 'Venta' }
];

const listaAporteGNV = [
  { valor: 'S', texto: 'Sí' },
  { valor: 'N', texto: 'No' },
];

const opcionesTRMTecho = [
  { id: 'S', texto: 'Sí' },
  { id: 'N', texto: 'No' }
];

const periodosCantidadContratada = [
  { id: 'D', texto: 'Diaria' },
  { id: 'S', texto: 'Semanal' },
  { id: 'M', texto: 'Mensual' },
  { id: 'A', texto: 'Anual' }
];

class CabeceraContrato extends Component {

  state = {
    // Aplicacion
    mostrarTiposContrato: false,
    mostrarPuntosSalida: false,
    mostrarRutas: false,
    mostrarModalMedidores: false,
    mostrarModalRutas: false,
    mostrarModalMedidoresAgregar: false,
    listaCantidad: [],

    /// Objetos
    agenteTercero: null,
    tiposContrato: this.props.tiposContrato,
    puntosSalida: this.props.puntosSalida
  };

  /**
   * Método encargado de consultar la TRM para la fecha seleccionada
   * @param {String} fecha Fecha seleccionada
   */
  consultarTrmDia = (fecha) => {
    axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_TRM, { criterio: '', fecha: fecha })
      .then(respuesta => {
        this.props.actualizarCabeceraContrato({ trmDia: (respuesta.data.codigo > 0) ? respuesta.data.datos.covlValor : 0, idTrm: (respuesta.data.codigo > 0) ? respuesta.data.datos.covlIderegistro : null });
      })
  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = async (evento) => {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    let desbilidadActivo = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }

    if (desabilitar) {
      return;
    }
    const control = evento.target;
    let nuevoEstado = {};
    nuevoEstado[control.name] = control.value;

    // Espacio para validaciones de controles
    if (control.name === 'takeOrPay' && control.value === 'false') {
      nuevoEstado.topGrupal = '-1';
    }

    if (control.name === 'fechaNegociacion') {
      this.consultarTrmDia(control.value);
    }

    if (control.name === 'usaTRMTecho' && this.state.trmTecho !== '') {
      nuevoEstado.trmTecho = getProp(this.props, 'cabecera.trmDia', '0');
    }

    if (control.name === 'firmeza' || control.name === 'modalidadContrato') {
      const valorFirmeza = (control.name === 'firmeza') ? control.value : '';
      const valores = this.obtenerValoresFirmeza(valorFirmeza);
      this.actualizarCabeceraRedux({ firmeza: valores.firmeza });
    }

    // Actualizar el estado
    // this.setState(nuevoEstado);
    await this.props.actualizarCabeceraContrato(nuevoEstado);

    if (control.name === 'cantidadContratada') {
      this.verificarCantidadContratada('SINGLE');
    }

    if (control.name === 'unidadMedida') {
      this.verificarCantidadContratada();
    }
  };

  /**
   * Método encargado de actualizar el objeto redux de la cabecera
   * @param {Object} nuevoCambio Cambio a realizar
   */
  actualizarCabeceraRedux = (nuevoCambio) => {
    this.props.actualizarCabeceraContrato({
      ...this.props.cabecera,
      ...nuevoCambio
    });
  };

  /**
   * Método encargado de obtener los tipos de contrato seleccionado
   * @returns {Array}
   */
  obtenerTiposContratoSeleccionados = () => {
    return this.props.listas.tiposContrato.filter(t => t.seleccionado)
      .map(t => {
        return {
          uniIderegistro: t.uniIderegistro,
          tipocontrato: getProp(t, 'uniPropiedad.tipocontrato', null)
        }
      });
  };

  /**
   * Método encargado de actualizar el objeto redux con el tercero seleccionado
   * @param {Object} agente Tercero seleccionado
   */
  seleccionarAgente = (agente) => {
    this.actualizarCabeceraRedux({
      agenteTercero: { ...agente },
      tercero: agente.terNomcompleto
    });
  };

  /**
   * Método encargado de cerrar el componente ventana modal de la consulta terceros
   */
  abrirConsultaTerceros = () => {
    const consultaAgentes = <RConsultaAgentesTerceros esModal seleccionarEntidad={this.seleccionarAgente} />;
    this.props.mostrarProgramaModal(consultaAgentes);
  };

  /**
   * Método encargado de limpiar los datos del campo selector terceros
   */
  limpiarAgenteTercero = () => {
    this.actualizarCabeceraRedux({
      agenteTercero: null,
      tercero: ''
    });
  };

  /**
   * Máetodo encargado de mostrar el campo selector de agentes tercero
   * @returns {JSX}
   */
  renderBuscadorTercero = () => {
    const tercero = getProp(this.props, 'cabecera.tercero', '');
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    let desabilitarActivo = false;
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    const propsInput = {
      placeholder: 'Seleccione un agente',
      className: 'form-control',
      onChange: this.controlarCambio,
      name: 'tercero',
      title: tercero,
      value: tercero,
      type: 'text',
      disabled: true
    };
    return (
      <div className='col-6 form-group'>
        <label>Agente Tercero:</label>
        <div className="input-group mb-3">
          <input {...propsInput} />
          <div className="input-group-prepend">
            <button className="btn-primary input-group-text" title='Limpiar Agente' onClick={this.limpiarAgenteTercero} disabled={(desabilitar || desabilitarActivo == true)}><i className='fa fa-fw fa-trash'></i></button>
            <button className="btn-primary btn-buscador input-group-text" title='Seleccionar Agente Tercero' onClick={this.abrirConsultaTerceros} disabled={(desabilitar || desabilitarActivo == true)}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Calcula la duración del contrato y devuelve un valor string más legible e informativo para el usuario con el formato: {# días # meses, # años}.
   * @return {String}
   */
  obtenerDuracionContrato = () => {
    const fechaInicio = getProp(this.props, 'cabecera.fechaInicio', '');
    const fechaFin = getProp(this.props, 'cabecera.fechaFin', '');
    if (!fechaInicio || !fechaFin) {
      return '';
    }
    const momentInicio = moment(fechaInicio);
    const momentFin = moment(fechaFin);
    let diferencia = moment.preciseDiff(momentInicio, momentFin, true);
    return `${diferencia.days}${(diferencia.days == 1) ? 'Día' : 'Días'} - ${diferencia.months}${(diferencia.months == 1) ? 'Mes' : 'Meses'} - ${diferencia.years}${(diferencia.years == 1) ? 'Año' : 'Años'}`;
  };

  /**
   * Renderiza el componente selector de tipos de contrato.
   * @returns {JSX}
   */
  renderBuscadorTiposContrato = () => {
    const textoTiposContrato = '';
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    let desabilitarActivo = false;
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    const tiposSeleccionados = this.props.listas.tiposContrato.reduce((total, tipo) => { return total + (tipo.seleccionado ? 1 : 0) }, 0);
    const placeholder = `(${tiposSeleccionados}) seleccionados`;
    return (
      <div className='col-3 form-group'>
        <label>Tipos de Contrato:</label>
        <div className="input-group mb-3">
          <input value={textoTiposContrato} disabled={true} type="text" className="form-control" placeholder={placeholder} />
          <div className="input-group-prepend">
            <button
              className="btn-primary btn-buscador input-group-btn"
              title='Seleccionar Tipos de Contrato'
              disabled={(desabilitar || desabilitarActivo == true)}
              onClick={() => this.setState({ mostrarTiposContrato: true })}><i className='fa fa-fw fa-check-square-o'></i></button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Obtiene la lista de clases de contrato para cada tipo de contrato seleccionado dependiendo de la configuración de las clases de contrato.
   * @return {Array}
   */
  obtenerClasesContrato = () => {
    const { clasesContrato } = this.props.listas;
    let clasesContratoFiltradas = [];
    const tiposContratoSeleccionados = this.obtenerTiposdeContratoSeleccionados();
    const tipoNegocio = getProp(this.props, 'cabecera.tipoNegocio', null);
    clasesContratoFiltradas = clasesContrato.filter(claseContrato => {
      let lista = [];
      if (tipoNegocio === 'C') {
        const tiposCompra = claseContrato.uniPropiedad.tipocontratocompra ? claseContrato.uniPropiedad.tipocontratocompra : '';
        lista = tiposContratoSeleccionados.filter(tipoContrato => {
          if (tipoContrato.seleccionado && tipoContrato.uniPropiedad && tipoContrato.uniPropiedad.tipocontrato) {
            if (tiposCompra.search(tipoContrato.uniPropiedad.tipocontrato) >= 0) {
              return tipoContrato;
            }
          }
        });
      } else if (tipoNegocio === 'V') {
        const tiposVenta = claseContrato.uniPropiedad.tipocontratoventa ? claseContrato.uniPropiedad.tipocontratoventa : '';
        lista = tiposContratoSeleccionados.filter(tipoContrato => {
          if (tipoContrato.seleccionado && tipoContrato.uniPropiedad && tipoContrato.uniPropiedad.tipocontrato) {
            if (tiposVenta.search(tipoContrato.uniPropiedad.tipocontrato) >= 0) {
              return tipoContrato;
            }
          }
        });
      }
      if (lista.length) {
        return claseContrato;
      }
    });
    return clasesContratoFiltradas;
  };

  /**
   * Obtiene la lista de los contratos seleccionados por el usuario.
   * @return {Array}
   */
  obtenerTiposdeContratoSeleccionados = () => {
    return getProp(this.props, 'listas.tiposContrato').filter(tipoContrato => tipoContrato.seleccionado);
  };

  /**
   * Renderiza el componente clases de contrato (combo) teniendo en cuenta las condiciones del caso de uso.
   * @returns {Component}
   */
  renderClasesContrato = () => {
    const tiposContratoSeleccionados = this.obtenerTiposdeContratoSeleccionados();
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    let desabilitarActivo = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    if (tiposContratoSeleccionados.findIndex(tc => (tc.uniPropiedad) && ((tc.uniPropiedad.tipocontrato === 'T') || tc.uniPropiedad.tipocontrato === 'S')) < 0) {
      return null;
    }
    const clasesContratoFiltradas = this.obtenerClasesContrato();
    return (
      <Combo
        opciones={clasesContratoFiltradas}
        cols={3}
        propTexto='uniNombre1'
        propValor='uniIderegistro'
        label='Clase de Contrato:'
        name='claseContrato'
        value={getProp(this.props, 'cabecera.claseContrato', '')}
        onChange={this.controlarCambio}
        extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
      />
    );
  };

  /**
   * Renderiza el componente (combo) para seleccionar la fuente de distribución teniendo en cuenta las condiciones del caso de uso.
   * @returns {Component}
   */
  renderFuentesDistribucion = () => {
    const { listas, cabecera } = this.props;
    // Si el Tipo de Contrato es de Suministro o GNV Suministro: habilitar Fuente o el pozo de donde se provee el gas
    const tiposContratoValidos = ['S', 'GNCV']
    const tiposContratosSelecccionados = listas.tiposContrato.filter(
      t => t.seleccionado && (validarOR(getProp(t, 'uniPropiedad.tipocontrato', null), tiposContratoValidos))
    );
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    let desabilitarActivo = false;
    if (estadoContrato == 'F', estadoContrato == 'L') {
      desabilitar = true;
    }
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    let deshabilitado = true;
    let opciones = [];
    if (tiposContratosSelecccionados && tiposContratosSelecccionados.length > 0) {
      deshabilitado = false;
      opciones = listas.fuentesDistribucion;
    }

    return (
      <Combo
        opciones={opciones}
        cols={3}
        propTexto='uniNombre1'
        propValor='uniIderegistro'
        label='Fuente de Distribución:'
        name='fuenteDistribucion'
        value={getProp(this.props, 'cabecera.fuenteDistribucion', '')}
        onChange={this.controlarCambio}
        extra={{ disabled: (deshabilitado || desabilitar == true || desabilitarActivo == true) }}
      />
    );
  };

  /**
   * Método encargado de validar el campo take or pay
   * @returns {Array}
   */
  validarEstadoTakeOrPay = () => {
    const variables = {};
    const claseContrato = getProp(this.props, 'cabecera.claseContrato', '');
    const takeOrPay = getProp(this.props, 'cabecera.takeOrPay', 'false');
    const { tiposContrato } = this.props.listas;
    const esGnvSuministro = tiposContrato.findIndex(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV');
    const esSuministro = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'S');
    const tieneTakeOrPay = this.props.listas.clasesContrato.find(c => {
      const v = c.uniIderegistro == claseContrato && c.uniPropiedad.takeorpay;
      if (v) {
        return c;
      }
    });
    const esSuministroIndustrialNoRegualada = esSuministro && claseContrato != '-1' && tieneTakeOrPay;
    const habilitar = (esGnvSuministro >= 0 || esSuministroIndustrialNoRegualada);
    /*
    Se valida si se cumplen las condiciones para takeOrPay, en caso de que la opción estuviera en true y
    el usuario cambiara a un tipo de contrato que no cumple la propiedad pasa a NO.
    Nota: Se pone timeout para que no se ejecute la actualización del estado en el render, ya que generaría un bucle infinito
    */
    variables.habilitar = habilitar;
    variables.takeOrPay = takeOrPay;
    variables.topGrupal = '-1';

    if (!habilitar && takeOrPay) {
      variables.takeOrPay = false;
      variables.topGrupal = '-1';
    }
    return variables;
  };

  /**
   * Renderiza el componente (combo) para seleccionar el Take Or Pay teniendo en cuenta las condiciones del caso de uso.
   * @returns {JSX}
   */
  renderTakeOrPay = () => {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    let desabilitarActivo = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    const variables = this.validarEstadoTakeOrPay();
    return (
      <Fragment>
        <Combo
          opciones={[{ valor: true, texto: 'Sí' }, { valor: false, texto: 'No' }]}
          cols={3}
          propTexto='texto'
          propValor='valor'
          label='Take or Pay:'
          name='takeOrPay'
          value={variables.takeOrPay}
          onChange={this.controlarCambio}
          mostrarOpcionPorDefecto={false}
          extra={{ disabled: (!variables.habilitar || desabilitar == true || desabilitarActivo == true) }}
        />

        <Combo
          opciones={this.props.listas.topGrupal}
          cols={3}
          propTexto='tpgNombre'
          propValor='tpgIderegistro'
          label='Top Grupal:'
          name='topGrupal'
          value={getProp(this.props, 'cabecera.topGrupal', '')}
          onChange={this.controlarCambio}
          extra={{ disabled: (variables.takeOrPay != 'true' || desabilitar == true || desabilitarActivo == true) }}
        />
      </Fragment>
    );
  };

  /**
   * Rendereiza el componente (selector) para seleccionar la modalidade de contrato...
   * @returns {Component}
   */
  renderModalidadesContrato = () => {
    const { tiposModalidadContrato } = this.props.listas;
    let modalidades = [...tiposModalidadContrato];
    const tiposContratoSeleccionados = this.obtenerTiposContratoSeleccionados();

    for (let i = modalidades.length - 1; i >= 0; i--) {
      const modalidad = modalidades[i];
      const tipoContratoModalidad = getProp(modalidad, 'uniPropiedad.tipocontrato', null);

      // Opción de Compra de Gas || Opción de Compra de Gas contra Exportaciones: Sólo cuando se seleccione en el tipo de contrato Suministro
      const esOpcionCompra = tipoContratoModalidad === 'S';
      const noEsSuministro = tiposContratoSeleccionados.findIndex(t => t.tipocontrato === 'S') === -1;
      if (esOpcionCompra && noEsSuministro) {
        modalidades.splice(i, 1);
        continue;
      }

      //Opción de Compra de transporte: Sólo cuando se seleccione en el tipo de contrato Transporte
      const esCompraTrans = tipoContratoModalidad === 'T';
      const noEsTransporte = tiposContratoSeleccionados.findIndex(t => t.tipocontrato === 'T') === -1;
      if (esCompraTrans && noEsTransporte) {
        modalidades.splice(i, 1);
        continue;
      }

    }
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    let desabilitarActivo = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    return (
      <Combo
        opciones={modalidades}
        cols={3}
        propTexto='uniNombre1'
        propValor='uniIderegistro'
        label='Modalidad Contrato:'
        name='modalidadContrato'
        value={getProp(this.props, 'cabecera.modalidadContrato', '')}
        onChange={this.controlarCambio}
        extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
      />
    )
  };

  /**
   * Método encargado obtener los valores de firmeza y controlas su visibilidad
   * @param {String} valorFirmeza Valor asignado a la firmeza
   */
  obtenerValoresFirmeza = (valorFirmeza = '') => {
    const tiposModalidadContrato = getProp(this.props, 'listas.tiposModalidadContrato', []);
    const clasesContrato = getProp(this.props, 'listas.clasesContrato', []);
    const modalidadContrato = getProp(this.props, 'cabecera.modalidadContrato', '');
    const claseContrato = getProp(this.props, 'cabecera.claseContrato', '');
    let firmeza = (valorFirmeza != '') ? valorFirmeza : getProp(this.props, 'cabecera.firmeza', '');
    let deshabilitado = true;

    // // Verifica si la modalidad seleccionada usa contrato
    const usaFirmeza = tiposModalidadContrato.find(m =>
      m.uniIderegistro == modalidadContrato && getProp(m, 'uniPropiedad.usafirmeza', false)
    );

    // Verifica si la clase de contrato seleccionada es de clase C: C1, C2, CF95
    const claseC = clasesContrato.find(c =>
      c.uniIderegistro == claseContrato && getProp(c, 'uniPropiedad.clasec', false)
    );

    if (usaFirmeza && !claseC) {
      deshabilitado = false;
      firmeza = '';
    }

    let porcentajeFirmeza = 0;
    // Si la clase de contrato es clase C, asigna la firmeza y deshabilita la caja de texto
    if (!!claseC) {
      porcentajeFirmeza = getProp(claseC, 'uniPropiedad.firmeza', 0);
      deshabilitado = true;
      firmeza = porcentajeFirmeza;
    }

    //Actualiza el estado...
    const listaModalidades = getProp(this.props, 'listas.tiposModalidadContrato', []);
    let modalidadSeleccionada = listaModalidades.filter(modalidad => modalidad.uniIderegistro == modalidadContrato);
    if (modalidadSeleccionada != null && modalidadSeleccionada.length > 0) {
      modalidadSeleccionada = modalidadSeleccionada[0];
      if (modalidadSeleccionada.uniPropiedad.modalidad == 'FRM' || modalidadSeleccionada.uniPropiedad.modalidad == 'FRMC') {
        deshabilitado = (claseC && firmeza > 0);
      } else {
        firmeza = '';
      }
    }
    if (!claseC && deshabilitado) {
      firmeza = '';
    }
    return { deshabilitado: deshabilitado, firmeza: firmeza };
  };


  /**
   * Renderiza el campo firmeza teneiendo en cuenta algunas condiciones del caso de uso.
   * @returns {Component}
   */
  renderFirmeza = () => {
    const valores = this.obtenerValoresFirmeza();
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    let desabilitarActivo = false;
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    return (
      <TextoNumerico
        aceptaDecimales={false}
        aceptaNegativos={false}
        cols={3}
        label='% Firmeza:'
        value={valores.firmeza}
        onChange={this.controlarCambio}
        name='firmeza'
        disabled={valores.deshabilitado}
        extra={{ disabled: (valores.deshabilitado || desabilitar == true || desabilitarActivo == true) }}
      />
    );
  };

  /**
   * Obtiene la lista de rutas seleccionadas por el usuario.
   * @return {Array}
   */
  obtenerRutasSeleccionadas = () => {
    return this.props.listas.rutas.filter(r => r.seleccionado);
  };

  /**
   * Actualiza la lista rutas del objeto Redux.
   * @param {Array} rutas Rutas a actualizar
   */
  actualizarRutas = async (rutas) => {
    let sumatoria = 0;
    rutas.forEach(ruta => {
      if (ruta.seleccionado) {
        sumatoria += (ruta.cntuValor) ? parseFloat(ruta.cntuValor) : 0;
      }
    });
    await this.props.actualizarListaContratos({ rutasGNC: [...rutas], rutas: [...rutas] });
    this.verificarCantidadContratada();
  };

  /**
   * Renderiza el botón para selecionar las rutas teniendo en cuenta las condiciones necesarias...
   * @returns {JSX}
   */
  renderRutas = () => {
    //Verificamos si el contrato es de tipo GNC o Conexión.
    const { tiposContrato } = this.props.listas;
    const esGNCoConexion = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', false) === 'CNX' || getProp(t, 'uniPropiedad.tipocontrato', false) === 'GNC'));
    if (!esGNCoConexion) {
      return null;
    }
    const rutasSeleccionadas = this.obtenerRutasSeleccionadas();
    const placeholder = `(${rutasSeleccionadas.length}) seleccionadas`;
    return (
      <div className='col-md-12 mt-3'>
        <div className='card'>
          <div className='card-header'>
            <h3>Rutas</h3>
          </div>
          <div className='card-body'>
            <div className='col-12 form-group'>
              <SelectorRutas
                titulo='Rutas:'
                propTexto='uniNombre1'
                propValor='uniIderegistro'
                seleccionarItem={this.actualizarRutas}
                unidadesMedida={getProp(this.props, 'listas.cantidad')}
                mostrarAlerta={this.props.mostrarAlerta}
                tiposContrato={getProp(this.props, 'listas.tiposContrato')}
                lista={getProp(this.props, 'listas.rutasGNC', [])}
                unidadMedida={getProp(this.props.cabecera, 'unidadMedida', '')}
                estadoContrato={getProp(this.props, 'cabecera.estadoContrato', '')}
              />
            </div>
            {this.obtenerRutasSeleccionadas().length > 0 && (
              <div className='col-12 form-group'>
                <table className='table table-hover table-striped table-condensed labels-hidden'>
                  <thead>
                    <tr>
                      <th>Ruta</th>
                      <th>Valor</th>
                      <th>Unidad de medida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      rutasSeleccionadas.map(r => {
                        return (
                          <tr key={r.uniIderegistro}>
                            <td>{r.uniNombre1}</td>
                            <td>
                              <Input
                                label=''
                                value={r.cntuValor}
                                onChange={this.controlarCambioRutas}
                                name='cntuValor'
                                extra={{ 'data-idruta': r.uniIderegistro }}
                              />
                            </td>
                            <td>
                              <Combo
                                opciones={this.props.listas.cantidad}
                                propTexto='uniNombre1'
                                propValor='uniIderegistro'
                                label=''
                                name='uniIdemedida'
                                value={r.uniIdemedida}
                                onChange={this.controlarCambioRutas}
                                extra={{ 'data-idruta': r.uniIderegistro }}
                              />
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div >
    );
  };

  /**
   * Obtiene la lista de medidores seleccioandos.
   */
  obtenerMedidoresSeleccionados = () => {
    return this.props.listas.medidores.filter(m => m.seleccionado);
  };

  /**
   * Controla los cambios de los controles de la tabla medidores.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioMedidores = (evento) => {
    const nombrePropiedad = evento.target.name;
    const valor = evento.target.value;
    const medidores = [...this.props.listas.medidores];
    const idMedidor = parseInt(evento.target.attributes['data-idmedidor'].value);
    const index = medidores.findIndex(m => m.mesuIderegistro === idMedidor);
    medidores[index][nombrePropiedad] = valor;
    this.actualizarListaContratos({ medidores: [...medidores] });
  };

  /**
   * Controla los cambios de los controles de la tabla rutas.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioRutas = (evento) => {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (desabilitarE) {
      return;
    }
    const nombrePropiedad = evento.target.name;
    const valor = evento.target.value;
    const rutas = [...this.props.listas.rutas];
    const idRuta = parseInt(evento.target.attributes['data-idruta'].value);
    const index = rutas.findIndex(r => r.uniIderegistro === idRuta);
    rutas[index][nombrePropiedad] = valor;
    this.actualizarListaContratos({ rutas: [...rutas] });
  };

  /**
   * Actualiza las listas de contratos y verifica la cantidad contratada.
   * @param {Object} cambio Datos al cambiar
   */
  actualizarListaContratos = async (cambio) => {
    await this.props.actualizarListaContratos(cambio);
    this.verificarCantidadContratada();
  };

  /**
   * Método encargado de verificar la cantidad contratada
   * @param {String} tipo Tipo de verificación
   */
  verificarCantidadContratada = async (tipo = null) => {
    if (tipo == 'SINGLE') {
      let listaCantidad = getProp(this.props.cabecera, 'listaCantidad', []).length > 0 ? this.props.cabecera.listaCantidad : [];
      const unidad = this.props.listas.cantidad.find(c => c.uniIderegistro == this.props.cabecera.unidadMedida);
      const nombre = (unidad) ? unidad.uniNombre1 : '';
      const tiposSeleccionados = this.props.listas.tiposContrato.filter(t => t.seleccionado);
      tiposSeleccionados.forEach(t => {
        const repetido = listaCantidad.filter(r =>
          getProp(r, 'tipoContrato', null) == 'GNV'
          || getProp(r, 'tipoContrato', null) == 'ATR'
          || getProp(r, 'tipoContrato', null) == 'GNCV');
        if (repetido.length == 0) {
          const tipo = tiposSeleccionados.filter(w =>
            getProp(w, 'uniPropiedad.tipocontrato', null) == 'GNV'
            || getProp(w, 'uniPropiedad.tipocontrato', null) == 'ATR'
            || getProp(w, 'uniPropiedad.tipocontrato', null) == 'GNCV');
          if (tipo.length > 0) {
            tipo.forEach((tip, index) => {
              if (tip.uniPropiedad.tipocontrato == t.uniPropiedad.tipocontrato) {
                listaCantidad.push({
                  cantidadContratada: parseFloat(this.props.cabecera.cantidadContratada),
                  unidadMedida: nombre,
                  tipoContrato: getProp(t, 'uniPropiedad.tipocontrato', null),
                  nombre: getProp(t, 'uniNombre1', null)
                });
              }
            });
          }
        }
        if (repetido.length > 0) {
          for (let index = 0; index < listaCantidad.length; index++) {
            const lista = listaCantidad[index];
            if (lista.tipoContrato == repetido[0].tipoContrato) {
              listaCantidad[index].cantidadContratada = parseFloat(this.props.cabecera.cantidadContratada);
            }
          }
        }
      });
      this.props.actualizarCabeceraContrato({ listaCantidad: listaCantidad });
      return;
    }
    const listaCantidad = await this.obtenerLista();
    await this.props.actualizarCabeceraContrato({ listaCantidad: listaCantidad });
  }

  /**
   * Método encargado de actualizar los medidores
   * @param {Object} entidadGuardar Datos
   */
  onGuardar = (entidadGuardar) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_MEDIDOR_SUMINISTRO.CONSULTAR)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const index = respuesta.data.datos.findIndex(m => m.mesuNombre == entidadGuardar.mesuNombre);
          let medidor = respuesta.data.datos[index];
          medidor.seleccionado = true;
          let medidores = [...this.props.listas.medidores];
          medidores.push(medidor);
          this.actualizarListaContratos({
            medidores: formatearArray(medidores)
          });
          this.setState({ mostrarModalMedidoresAgregar: false });
        }
      });
  };

  /**
   * Método encargado de eliminar los medidores
   * @param {Event} event Evento ejecutado en el control de usuario
   */
  eliminarMedidor = (idMedidor) => {
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    let listaMedidoresEliminados = getProp(this.props, 'listas.medidoresEliminados', []);
    let medidores = this.props.listas.medidores;
    const index = medidores.findIndex(m => m.mesuIderegistro == idMedidor);
    const medidor = { ...medidores[index] };
    listaMedidoresEliminados.push(medidor);
    medidores.splice(index, 1);
    this.actualizarListaContratos({
      medidores: formatearArray(medidores),
      medidoresEliminados: listaMedidoresEliminados
    });
    if (tipoCalculo.tipoCalculo == 'C') {
      if (!tipoCalculo.canastaConsumoSuministro) {
        tipoCalculo.canastaConsumoSuministro = {};
      }
      tipoCalculo.canastaConsumoSuministro.canastaConRutas = [];
      this.props.actualizarTipoCalculoContrato({ canastaConsumoSuministro: { ...tipoCalculo.canastaConsumoSuministro } });
    }
  }

  /**
   * Método encargado de mostrar la alerta para confirmar la eliminación del medidor
   * @param {Integer} idMedidor Identificador del medidor
   */
  renderAlerta = (idMedidor) => {
    return (this.props.mostrarAlerta('Confirmar', 'Se eliminara el medidor, ¿Desea continuar?', [
      { clase: 'btn btn-primary', callback: () => { this.eliminarMedidor(idMedidor) }, texto: 'Sí' },
      { clase: 'btn btn-default', texto: 'No' },
    ]));
  }

  /**
   * Método encargado de abrir la ventana modal de medidores
   */
  mostrarModalMedidoresConsultar = () => {
    if (getProp(this.props.cabecera, 'unidadMedida', '') == '') {
      toast.error('Debe seleccionar una unidad de medida para la cantidad contratada');
      return;
    }
    this.setState({ mostrarModalMedidores: true })
  }

  /**
   * Método encargado de abrir la ventana modal de medidores
   */
  mostrarModalMedidoresAgregar = () => {
    if (getProp(this.props.cabecera, 'unidadMedida', '') == '') {
      toast.error('Debe seleccionar una unidad de medida para la cantidad contratada');
      return;
    }
    this.setState({ mostrarModalMedidoresAgregar: true })
  }

  /**
  * Renderiza el selector de medidores...
  * @returns {JSX}
  */
  renderMedidoresSuministro = () => {
    const { tiposContrato } = this.props.listas;
    const esSuministro = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'S');
    if (!esSuministro) {
      return null;
    }
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    let desabilitarActivo = false;
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    const medidoresSeleccionados = this.obtenerMedidoresSeleccionados();
    const placeholder = `(${medidoresSeleccionados.length}) seleccionados`;
    return (
      <div className='col-12'>
        <div className='card'>
          <div className='card-header'>
            <h3>Medidores suministro</h3>
          </div>
          <div className='card-body'>
            <div className='col-3 form-group'>
              <label>Medidores suministro:</label>
              <div className="input-group mb-3">
                <input value='' disabled={true} type="text" className="form-control" placeholder={placeholder} />
                <div className="input-group-prepend">
                  <button
                    className="btn-primary btn-buscador input-group-btn"
                    title='Seleccionar medidores suministro'
                    disabled={(desabilitar || desabilitarActivo == true)}
                    onClick={() => this.mostrarModalMedidoresConsultar()}><i className='fa fa-fw fa-check-square-o'></i></button>
                  <button
                    className="btn-primary btn-buscador input-group-btn"
                    title='Agregar medidores suministro'
                    disabled={(desabilitar || desabilitarActivo == true)}
                    onClick={() => this.mostrarModalMedidoresAgregar()}><i className='fa fa-fw fa-plus'></i></button>
                </div>
              </div>
            </div>
            {
              medidoresSeleccionados.length > 0 && (
                <div className='col-12'>
                  <table className='table table-hover table-striped table-condensed labels-hidden'>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Capacidad</th>
                        <th>Unidad medida</th>
                        <th>Accion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        medidoresSeleccionados.map(m => {
                          return (
                            <tr key={m.mesuIderegistro}>
                              <td>{m.mesuNombre}</td>
                              <td>{m.mesuCapacidadmaxima}</td>
                              <td>{getProp(m, 'uniIdemedida.uniNombre1', 'Indefinido')}</td>
                              <td>
                                <button
                                  className="btn-primary btn-buscador input-group-btn"
                                  title='Eliminar medidor'
                                  disabled={(desabilitar || desabilitarActivo == true)}
                                  onClick={() => {
                                    this.renderAlerta(m.mesuIderegistro)
                                  }}><i className='fa fa-fw fa-minus'></i>
                                </button>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renderiza el apartado para configurar la cantidad contratada...
   * @returns {JSX}
   */
  renderCantidadContratada = () => {
    //this.props.editandoContrato
    const { clasesContrato, unidadesMedida, cantidad, tiposContrato } = this.props.listas;
    const esTipoTransporte = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'T');
    const claseContrato = getProp(this.props, 'cabecera.claseContrato', '');
    const cantidadContratada = getProp(this.props, 'cabecera.cantidadContratada', '');
    const unidadMedida = getProp(this.props, 'cabecera.unidadMedida', '');
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', '');
    const editandoContrato = getProp(this.props, 'editandoContrato', false);
    let deshabilitado = editandoContrato;
    const tiposSinListas = tiposContrato.filter(t => t.seleccionado &&
      (getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'));
    const esClaseC2 = clasesContrato.find(c =>
      c.uniIderegistro == claseContrato && getProp(c, 'uniPropiedad.clasecontrato', false) === 'C2'
    );

    if (esClaseC2) {
      deshabilitado = false;
    }
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    let desabilitarActivo = false;
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    return (
      <div className='col-12'>
        <div className='card mb-3'>
          <div className='card-header'>
            <h3>Registro de Cantidad Contratada</h3>
          </div>
          <div className='card-body'>
            <div className="row">
              <TextoNumerico
                aceptaDecimales={true}
                aceptaNegativos={false}
                label='Cant. Contratada:'
                cols={3}
                value={cantidadContratada}
                onChange={this.controlarCambio}
                name='cantidadContratada'
                extra={{ disabled: (getProp(this.props, 'cabecera.cantidadContratadaDisabled', 0) || desabilitar || !Util.validarArreglo(tiposSinListas)) }}
              />
              <Combo
                opciones={cantidad}
                cols={3}
                propTexto='uniNombre1'
                propValor='uniIderegistro'
                label='Unidad de Medida:'
                name='unidadMedida'
                value={unidadMedida}
                onChange={this.controlarCambio}
                extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
              />
              <Combo
                opciones={periodosCantidadContratada}
                cols={3}
                propTexto='texto'
                propValor='id'
                label='Periodo:'
                name='periodoCantidadContratada'
                value={periodoCantidadContratada}
                onChange={this.controlarCambio}
                extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
              />
              {esTipoTransporte &&
                this.renderPuntosSalida()
              }

            </div>

            {
              esClaseC2 &&
              <div className='row'>
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={false}
                  label='Capacidad:'
                  cols={3}
                  value={getProp(this.props, 'cabecera.capacidadC2', null)}
                  onChange={this.controlarCambio}
                  name='capacidadC2'
                  disabled={editandoContrato}
                  extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
                />

                <Combo
                  opciones={cantidad}
                  cols={3}
                  propTexto='uniNombre1'
                  propValor='uniIderegistro'
                  label='Und. de Medida:'
                  name='unidadMedidaC2'
                  value={getProp(this.props, 'cabecera.unidadMedidaC2', null)}
                  onChange={this.controlarCambio}
                  extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
                />
              </div>
            }
            {
              this.renderTablaCantidadContratada()
            }
          </div>
        </div>
      </div>
    );
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
  obtenerSumaRutas = (tipoContrato, tipo) => {
    let suma = 0;
    const unidad = this.props.listas.cantidad.find(c => c.uniIderegistro == this.props.cabecera.unidadMedida);
    const nombre = (unidad) ? unidad.uniNombre1 : '';
    const { rutas } = this.props.listas;
    let listaFiltrada = rutas.filter(r => r.seleccionado && r.uniPropiedad.tipo === tipo);
    let estadoPeticiones = true;
    for (let i = 0; i < listaFiltrada.length; i++) {
      if (!listaFiltrada[i].seleccionado) {
        continue;
      }
      if (!isNaN(listaFiltrada[i].cntuValorCalculo)) {
        suma += parseFloat(listaFiltrada[i].cntuValorCalculo);
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
   * Método encargado de convertir las rutas a la unidad de medida de la cabecera
   * @param {Object} ruta Datos de la ruta
   * @param {String} tipoContrato Tipo de contrato seleccionado
   */
  convertirRutas = (ruta, tipoContrato, tipo) => {
    let valor = 0;
    axios.post(RUTAS_API.PARAMETRIZACION.CONVERSOR.CONVERTIR,
      { idUnidadOrigen: ruta.uniIdemedida, idUnidadDestino: this.props.cabecera.unidadMedida, valor: parseFloat(ruta.cntuValor) })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          valor = respuesta.data.datos
        }
        ruta.cntuValorCalculo = valor;
        this.obtenerSumaRutas(tipoContrato, tipo);
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
        this.convertirRutas(ruta, tipoContrato, tipo);
      }
    }
    return suma;
  }

  /**
   * Método encargado de obtener la cantidad contratada por puntos de salida seleccionado
   * @param {Object} tipoContrato Tipo de contrato seleccionado
   */
  obtenerSumaPuntosSalida = (tipoContrato) => {
    let suma = 0;
    const unidad = this.props.listas.cantidad.find(c => c.uniIderegistro == this.props.cabecera.unidadMedida);
    const nombre = (unidad) ? unidad.uniNombre1 : '';
    const { puntosSalida } = this.props.listas;
    let estadoPeticiones = true;
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
    if (estadoPeticiones == false) {
      return;
    }
    const indexTransporte = this.props.cabecera.listaCantidad ?
      this.props.cabecera.listaCantidad.findIndex(lista => lista.tipoContrato == getProp(tipoContrato, 'uniPropiedad.tipocontrato', null)) : -1;
    if (indexTransporte >= 0) {
      let lista = [...this.props.cabecera.listaCantidad];
      lista[indexTransporte].cantidadContratada = suma;
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
   * @param {Object} punto Punto de salida al cual se le realizara la conversion
   * @param {String} tipoContrato Tipo de contrato seleccionado
   */
  convertir = (punto, tipoContrato) => {
    let valor = 0;
    axios.post(RUTAS_API.PARAMETRIZACION.CONVERSOR.CONVERTIR,
      { idUnidadOrigen: punto.uniIdemedidacantidad, idUnidadDestino: this.props.cabecera.unidadMedida, valor: parseFloat(punto.cntsCantidadcontratada) })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          valor = respuesta.data.datos;
        }
        punto.cntsCantidadcontratadaCalculo = valor;
        this.obtenerSumaPuntosSalida(tipoContrato);
      });
  }

  /**
   * Método encargado de obtener la suma de las cantidades contradas de los puntos de salida
   * @param {Object} tipoContrato Tipo de contrato seleccionado
   * @returns {Float}
   */
  obtenerTotalPuntosSalida = (tipoContrato) => {
    const { puntosSalida } = this.props.listas;
    if (!Util.validarArreglo(puntosSalida)) {
      return;
    }
    for (let index = 0; index < puntosSalida.length; index++) {
      const punto = puntosSalida[index];
      if (punto.seleccionado) {
        this.convertir(punto, tipoContrato);
      }
    }
  }

  /**
   * Método encargado de obtener la lista de cantidades contratadas
   * @returns {Array}
   */
  obtenerLista = () => {
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
        this.obtenerTotalPuntosSalida(t);
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
   * Método encargado de mostrar la tabla con las cantidades contradas
   * @returns {Object}
   */
  renderTablaCantidadContratada = () => {
    const lista = getProp(this.props.cabecera, 'listaCantidad', []);
    const listaCantidad = lista.length > 0 ? [...this.props.cabecera.listaCantidad] : [];
    if (listaCantidad.length == 0) {
      return null;
    }

    return (
      <table className='table table-striped mt-5'>
        <thead>
          <tr>
            <th>Tipo de Contrato</th>
            <th>Cantidad Contratada</th>
            <th>Unidad de medida</th>
          </tr>
        </thead>
        <tbody>
          {listaCantidad.map((c, index) => {
            return (
              <tr key={index}>
                <td>{c.nombre}</td>
                <td>{c.cantidadContratada}</td>
                <td>{c.unidadMedida}</td>
              </tr>
            );
          })
          }
          <tr>
            <td>Total</td>
            <td>{this.obtenerTotal(listaCantidad)}</td>
            <td>{listaCantidad[0].unidadMedida}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  /**
     * Método encargado de obtener el total
     * @returns {Integer}
     */
  obtenerTotal = (listaCantidad) => {
    let total = 0;
    if (listaCantidad.length == 0) {
      return 0;
    }
    listaCantidad.forEach(m => {
      total = parseFloat(total + m.cantidadContratada);
    });
    return total;
  }

  /**
   * Renderiza el modal para seleccionar los medidores...
   * @returns {JSX}
   */
  renderModalMedidores = () => {
    return (
      <Modal visible={this.state.mostrarModalMedidores}>
        <div className="modal-header">
          <h4 className="modal-title"><b>Medidores de Suministro</b></h4>
        </div>
        <div className="modal-body">
          <div>
            <p>Seleccione los Medidores de Suministro</p>
            {
              this.props.listas.medidores.map(m => {
                return (
                  <div key={`puntosalida_${m.mesuIderegistro}`}>
                    <label>
                      <input type="checkbox" value={m.mesuIderegistro} checked={m.seleccionado || false} onChange={this.seleccionarMedidor} />
                      <span> {m.mesuNombre}</span>
                    </label>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="modal-footer">
          <button className='btn btn-primary' onClick={() => { this.setState({ mostrarModalMedidores: false }) }}>Aceptar</button>
        </div>
      </Modal>
    );
  };

  /**
   * Renderiza el modal para seleccionar las rutas ...
   * @returns {JSX}
   */
  renderModalRutas = () => {
    return (
      <Modal visible={this.state.mostrarRutas}>
        <div className="modal-header">
          <h4 className="modal-title"><b>Seleccionar rutas</b></h4>
        </div>
        <div className="modal-body">
          <div>
            <p>Seleccione las rutas</p>
            {
              this.props.listas.rutas.map(r => {
                return (
                  <div key={`rutas_${r.uniIderegistro}`}>
                    <label>
                      <input type="checkbox" value={r.uniIderegistro} checked={r.seleccionado || false} onChange={this.seleccionarRuta} />
                      <span> {r.uniNombre1}</span>
                    </label>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="modal-footer">
          <button className='btn btn-primary' onClick={() => { this.setState({ mostrarTiposContrato: false }) }}>Aceptar</button>
        </div>
      </Modal>
    );
  };

  /**
   * Renderiza el modal para seleccionar los tipos de contrato
   * @returns {JSX}
   */
  renderModalTiposContrato = () => {
    return (
      <Modal visible={this.state.mostrarTiposContrato}>
        <div className="modal-header">
          <h4 className="modal-title"><b>Tipos de Contrato</b></h4>
        </div>
        <div className="modal-body">
          <div>
            <p>Seleccione los Tipos de Contrato</p>
            {
              this.props.listas.tiposContrato.map(t => {
                return (
                  <div key={`tcontrato_${t.uniIderegistro}`}>
                    <label>
                      <input type="checkbox" value={t.uniIderegistro} checked={t.seleccionado || false} onChange={this.seleccionarTipoContrato} data-codigo={t.uniPropiedad.codigo} />
                      <span> {t.uniNombre1}</span>
                    </label>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="modal-footer">
          <button className='btn btn-primary' onClick={() => { this.setState({ mostrarTiposContrato: false }) }}>Aceptar</button>
        </div>
      </Modal>
    );
  };

  /**
   * Método encargado de controlar el cambio del tipo de contrato
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  seleccionarTipoContrato = (event) => {
    const tipos = [...this.props.listas.tiposContrato];
    const idTipoContrato = parseInt(event.target.value);
    const codigo = event.target.attributes['data-codigo'].value;
    const index = tipos.findIndex(t => t.uniIderegistro === idTipoContrato);
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    tipos[index].seleccionado = event.target.checked;
    if (tipoCalculo.tipoCalculo == 'C') {
      if (!tipoCalculo.canastaConsumoSuministro) {
        tipoCalculo.canastaConsumoSuministro = {}
      }
      tipoCalculo.canastaConsumoSuministro.canastaConRutas = [];
      this.props.actualizarTipoCalculoContrato({ canastaConsumoSuministro: { ...tipoCalculo.canastaConsumoSuministro } });
    }
    this.actualizarListaContratos({ tiposContrato: [...tipos] });
    if (codigo == 'G' && event.target.checked == false) {
      this.actualizarCabeceraRedux({ topGrupal: '-1', takeOrPay: 'false' });
      const listaFiltrada = this.props.listas.medidores.filter(m => m.seleccionado == true);
      this.actualizarListaContratos({
        medidores: listaFiltrada.length > 0 ? this.props.listas.medidores.map(m => {
          m.seleccionado = false
          return m;
        }) : this.props.listas.medidores
      });
    }
    if (codigo == 'T' && event.target.checked == false) {
      const listaFiltrada = this.props.listas.listaTramos.filter(t => t.seleccionado == true);
      const listaPuntos = this.props.listas.puntosSalida.filter(p => p.seleccionado == true);
      this.actualizarListaContratos({
        listaTramos: listaFiltrada.length > 0 ? this.props.listas.listaTramos.map(t => {
          t.seleccionado = false
          return t;
        }) : this.props.listas.listaTramos,
        puntosSalida: listaPuntos.length > 0 ? this.props.listas.puntosSalida.map(p => {
          p.seleccionado = false
          return p;
        }) : this.props.listas.puntosSalida,
        listaTramosFinal: []
      });
    }
    if (codigo == 'CNX' || codigo == 'GNC' && event.target.checked == false) {
      const listaFiltrada = this.props.listas.rutas.filter(r => r.seleccionado == true);
      this.actualizarListaContratos({
        rutas: listaFiltrada.length > 0 ? this.props.listas.rutas.map(r => {
          r.seleccionado = false
          return r;
        }) : this.props.listas.rutas
      });
    }
  };

  /**
   * Renderiza el modal para seleccionar puntos de salida...
   * @returns {JSX}
   */
  renderModalPuntosSalida = () => {
    return (
      <Modal visible={this.state.mostrarPuntosSalida}>
        <div className="modal-header">
          <h4 className="modal-title"><b>Puntos de Salida</b></h4>
        </div>
        <div className="modal-body">
          <div>
            <p>Seleccione los Puntos de Salida</p>
            {
              this.props.listas.puntosSalida.map(t => {
                return (
                  <div key={`puntosalida_${t.ptsaIderegistro}`}>
                    <label>
                      <input type="checkbox" value={t.ptsaIderegistro} checked={t.seleccionado || false} onChange={this.seleccionarPuntosSalida} />
                      <span> {t.ptsaNombre}</span>
                    </label>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="modal-footer">
          <button className='btn btn-primary' onClick={() => { this.setState({ mostrarPuntosSalida: false }) }}>Aceptar</button>
        </div>
      </Modal>
    );
  };

  /**
   * Obtiene la sumatoria de la capacidad de los puntos de salida seleccionados por el usuario.
   * @return {number}
   */
  obtenerSumatoriaPuntosSalida = () => {
    let sum = 0;
    const puntosSalida = this.props.listas.puntosSalida;
    for (let i = 0; i < puntosSalida.length; i++) {
      const puntoSalida = puntosSalida[i];
      if (puntoSalida.seleccionado) {
        sum += puntoSalida.pstaCapacidad;
      }
    }
    return sum;
  };

  /**
   * Recive el evento click de los selectores de puntos de salida y setea un atributo llamado seleccionado = true, en el punto de salida específico.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  seleccionarPuntosSalida = async (event) => {
    const puntos = [...this.props.listas.puntosSalida];
    const idPuntoSalida = parseInt(event.target.value);
    const index = puntos.findIndex(t => t.ptsaIderegistro === idPuntoSalida);
    puntos[index].seleccionado = event.target.checked;
    await this.actualizarListaContratos({ puntosSalida: [...puntos], listaTramosFinal: [] });
  };

  /**
   * Actualiza la propiedad de la lista puntos de salida del objeto Redux.
   * @param {Array} puntosSalida Puntos de salida seleccionados
   * @return {array}
   */
  actualizarPuntosSalida = async (puntosSalida) => {
    let cantidadContratada = 0;
    puntosSalida.forEach(ps => {
      if (ps.seleccionado) {
        cantidadContratada += ps.cntsCantidadcontratada > 0 ? parseFloat(ps.cntsCantidadcontratada) : ps.pstaCapacidad;
      }
    });
    //this.props.actualizarCabeceraContrato({ cantidadContratada: cantidadContratada });
    await this.props.actualizarListaContratos({ puntosSalida: [...puntosSalida] });
    this.verificarCantidadContratada();
  };

  /**
   * Recibe el evento change  de los selectores de medidores y setea un atributo llamado seleccionado = true, en el medidor específico.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  seleccionarMedidor = async (event) => {
    const medidores = [...this.props.listas.medidores];
    const idMedidor = parseInt(event.target.value);
    const index = medidores.findIndex(t => t.mesuIderegistro === idMedidor);
    medidores[index].seleccionado = event.target.checked;
    await this.actualizarListaContratos({ medidores: [...medidores] });
  };

  /**
   * Recibe el evento change de los selectores de las rutas y setea un atributo llamado seleccionado = true, en el medidor específico.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  seleccionarRuta = async (event) => {
    const rutas = [...this.props.listas.rutas]
    const idRuta = parseInt(event.target.value);
    const index = rutas.findIndex(r => r.uniIderegistro === idRuta);
    rutas[index].seleccionado = event.target.checked;
    await this.actualizarListaContratos({ rutas: [...rutas] });
  };

  /**
   * Renderiza el modal para seleccionar rutas...
   * @returns {JSX}
   */
  renderModalRutas = () => {
    return (
      <Modal visible={this.state.mostrarModalRutas}>
        <div className="modal-header">
          <h4 className="modal-title"><b>Rutas</b></h4>
        </div>
        <div className="modal-body">
          <div>
            <p>Seleccione las rutas</p>
            {
              this.props.listas.rutas.map(r => {
                return (
                  <div key={`rutas_${r.uniIderegistro}`}>
                    <label>
                      <input type="checkbox" value={r.uniIderegistro} checked={r.seleccionado || false} onChange={this.seleccionarRuta} />
                      <span> {r.uniNombre1}</span>
                    </label>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="modal-footer">
          <button className='btn btn-primary' onClick={() => { this.setState({ mostrarModalRutas: false }) }}>Aceptar</button>
        </div>
      </Modal>
    );
  };

  /**
   * Método encargado de mostrar el formulario aportes GNV
   * @returns {JSX}
   */
  renderAportesGNV = () => {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    let desabilitarActivo = false;
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    const { tiposContrato } = this.props.listas;
    const esGNV = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV');
    if (!esGNV) {
      return null;
    }
    return (
      <Fragment>
        <Combo
          opciones={listaAporteGNV}
          propTexto='texto'
          propValor='valor'
          label='Aporte GNV:'
          name='aporteGNV'
          value={getProp(this.props, 'cabecera.aporteGNV', null)}
          onChange={this.controlarCambio}
          extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
        />

        {
          (getProp(this.props, 'cabecera.aporteGNV', 'N') === 'S') && (
            <TextoNumerico
              aceptaDecimales={true}
              aceptaNegativos={false}
              label='Valor GNV:'
              cols={3}
              value={getProp(this.props, 'cabecera.valorGNV', '')}
              onChange={this.controlarCambio}
              name='valorGNV'
              extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
            />
          )
        }
      </Fragment>
    );
  };

  /**
     * Obtiene la lista de los tipos de contratos seleccionados por el usuario.
     * @return {array}
     */
  obtenerTiposContratoSeleccionadosPuntos = () => {
    const listaTiposContrato = getProp(this.props, 'listas.tiposContrato', []);
    const tiposContratoSeleccionados = listaTiposContrato.filter(tipoContrato => tipoContrato.seleccionado);
    return tiposContratoSeleccionados;
  };

  /**
   * Renderiza el botón para seleccionar los puntos de salida teºniendo en cuenta las condiciones necesarias...
   * @returns {Component}
   */
  renderPuntosSalida = () => {
    //Validar si el tipo de transporte seleccionado es Transporte...
    const tiposContratoSeleccionados = this.obtenerTiposContratoSeleccionadosPuntos();
    if (tiposContratoSeleccionados.findIndex(tc => (tc.uniPropiedad) && (tc.uniPropiedad.tipocontrato === 'T')) < 0) {
      return null;
    }
    const puntosSalida = getProp(this.props, 'listas.puntosSalida', []);
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    if (desabilitar == true) {
      return null;
    }
    return (
      <SelectorPuntosSalida
        titulo='Puntos de Salida:'
        propTexto='ptsaNombre'
        propValor='ptsaIderegistro'
        seleccionarItem={this.actualizarPuntosSalida}
        mostrarAlerta={this.props.mostrarAlerta}
        unidadesMedida={this.props.listas.cantidad}
        unidadesMedidaPresion={this.props.listas.unidadesTipoUnidad}
        ref={ref => this.refPuntosSalida = ref}
        lista={puntosSalida}
        tipoContrato={getProp(this.props, 'cabecera.tipoNegocio', '')}
        unidadMedida={getProp(this.props.cabecera, 'unidadMedida', '')}
      />
    );
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    const { cabecera, listas } = this.props;
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitar = false;
    let desabilitarActivo = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitar = true;
    }
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    return (
      <div className='row col-12 cabecera-contrato'>

        <Combo
          opciones={tiposNegocio}
          propTexto='tipo'
          propValor='id'
          label='Tipo de Negocio:'
          name='tipoNegocio'
          value={getProp(this.props, 'cabecera.tipoNegocio', '')}
          onChange={this.controlarCambio}
          cols={3}
          extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
        />
        {this.renderBuscadorTercero()}
        <Input
          label='No. Contrato:'
          cols={3}
          value={getProp(this.props, 'cabecera.numeroContrato', '')}
          onChange={this.controlarCambio}
          name='numeroContrato'
          extra={
            { disabled: (getProp(this.props, 'cabecera.tipoNegocio', '') !== 'C' || desabilitar || desabilitarActivo == true), readOnly: desabilitar }
          }
        />

        <Fecha
          label="Fecha Negociación:"
          cols={3}
          onChange={this.controlarCambio}
          name='fechaNegociacion'
          fecha={getProp(this.props, 'cabecera.fechaNegociacion', '')}
          disabled={desabilitar}
          extra={{ disabled: (desabilitar || desabilitarActivo == true), readOnly: desabilitar }}
        />

        <Fecha
          label="Fecha Inicio:"
          cols={3}
          onChange={this.controlarCambio}
          name='fechaInicio'
          fechaInicio={null}
          fechaFin={getProp(this.props, 'cabecera.fechaFin', '')}
          fecha={getProp(this.props, 'cabecera.fechaInicio', '')}
          disabled={desabilitar}
          extra={{ disabled: desabilitar, readOnly: desabilitar }}
        />

        <Fecha
          label="Fecha Fin:"
          cols={3}
          onChange={this.controlarCambio}
          name='fechaFin'
          fechaInicio={getProp(this.props, 'cabecera.fechaInicio', '')}
          fechaFin={null}
          fecha={getProp(this.props, 'cabecera.fechaFin', '')}
          disabled={desabilitar}
          extra={{ disabled: desabilitar }}
        />

        <Input
          label='Duración:'
          cols={3}
          value={this.obtenerDuracionContrato()}
          onChange={this.controlarCambio}
          name='duracionContrato'
          extra={{ disabled: true }}
        />

        <Combo
          opciones={listas.tiposDeUso}
          propTexto='uniNombre1'
          cols={3}
          propValor='uniIderegistro'
          label='Tipo de Uso:'
          name='tipoUso'
          value={getProp(this.props, 'cabecera.tipoUso', '')}
          onChange={this.controlarCambio}
          extra={{ disabled: (desabilitar || (desabilitarActivo == true && getProp(this.props, 'cabecera.tipoNegocio') == 'C')) }}
        />

        {
          getProp(this.props, 'cabecera.tipoNegocio', '') === 'C' &&
          <Combo
            opciones={listas.tiposMercado}
            cols={3}
            propTexto='uniNombre1'
            propValor='uniIderegistro'
            label='Tipo de Mercado:'
            name='tipoMercado'
            value={getProp(this.props, 'cabecera.tipoMercado', '')}
            onChange={this.controlarCambio}
            extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
          />
        }

        {this.renderBuscadorTiposContrato()}

        {this.renderClasesContrato()}

        {this.renderFuentesDistribucion()}

        {this.renderTakeOrPay()}

        {this.renderModalidadesContrato()}

        {this.renderFirmeza()}

        <Input
          label='TRM del día de Negociación:'
          value={getProp(this.props, 'cabecera.trmDia', '')}
          extra={{ disabled: true }}
          cols={3}
        />

        <Combo
          opciones={opcionesTRMTecho}
          cols={3}
          propTexto='texto'
          propValor='id'
          label='Usa TRM Techo:'
          name='usaTRMTecho'
          value={getProp(this.props, 'cabecera.usaTRMTecho', 'N')}
          onChange={this.controlarCambio}
          extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
        />

        <TextoNumerico
          aceptaDecimales={true}
          aceptaNegativos={false}
          label='TRM Techo:'
          cols={3}
          value={getProp(this.props, 'cabecera.usaTRMTecho', false) ? getProp(this.props, 'cabecera.trmTecho', '') : ''}
          onChange={this.controlarCambio}
          name='trmTecho'
          extra={{ disabled: (getProp(this.props, 'cabecera.usaTRMTecho', 'N') === 'N' || desabilitar == true || desabilitarActivo == true) }}
        />

        {this.renderCantidadContratada()}

        <Input
          label='Cód. Gestor:'
          value={getProp(this.props, 'cabecera.codigoGestor', '')}
          name='codigoGestor'
          onChange={this.controlarCambio}
          extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
        />
        {this.renderAportesGNV()}

        {this.renderMedidoresSuministro()}
        {this.renderRutas()}

        {this.renderModalMedidores()}
        {this.renderModalRutas()}

        {this.renderModalTiposContrato()}

        {this.renderModalPuntosSalida()}

        <VentanaModal
          mostrar={this.state.mostrarModalMedidoresAgregar}
          titulo='Consultar medidores de suministro'
          cerrarModal={() => this.setState({ mostrarModalMedidoresAgregar: false })}>
          <RGestionMedidoresSuministro
            onGuardar={this.onGuardar}
            history={this.props.history}
            listaPrecioCapacidad={this.props.listas.precioCapacidad}
          />
        </VentanaModal>

      </div>
    );
  }

}

CabeceraContrato.propTypes = {
  history: PropTypes.object,
  mostrarProgramaModal: PropTypes.func,
  trmDia: PropTypes.number,
  editandoContrato: PropTypes.bool,

  // Redux
  actualizarCabeceraContrato: PropTypes.func,
  actualizarListaContratos: PropTypes.func
};

CabeceraContrato.defaultProps = {
  editandoContrato: false,
};

const mapStateToProps = state => {
  const { cabecera, listas, tipoCalculo } = state.contratos;
  return { cabecera, listas, tipoCalculo };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actualizarCabeceraContrato,
    actualizarListaContratos,
    actualizarTipoCalculoContrato
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CabeceraContrato);

export { VistaRedux as RCabeceraContrato };
