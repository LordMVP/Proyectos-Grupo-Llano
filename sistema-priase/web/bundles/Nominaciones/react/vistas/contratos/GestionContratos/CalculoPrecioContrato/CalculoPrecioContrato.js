import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// REDUX
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { actualizarCabeceraContrato, actualizarListaContratos, actualizarTipoCalculoContrato } from '../../../../store/actions/ContratosAcciones';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';

// UI
import Modal from 'react-bootstrap4-modal';
import { Input, Combo, Util, TextoNumerico } from 'appfuture-react';

// Util
import { get as getProp } from 'object-path';

import './CalculoPrecioContrato.scss';
import { CanastaConsumoSuministro } from './CanastaTarifariaSuministro/CanastaConsumoSuministro';
import { SelectorTramos } from '../../../utils/SelectorTramos';

const tiposServicio = [
  { texto: 'Suministro', valor: 'S' },
  { texto: 'Transporte', valor: 'T' }
];

class CalculoPrecioContrato extends Component {

  state = {
    mostrarModalTramos: false,
    tipoCalculo: 'N',
    unidadMedida: '',
    precioContrato: '',
    precioContrato: 0,
    totalMedidores: 0,
  };

  /**
   * Limpia el formulario específico haciendo limpieza total de la propiedad del objeto global redux.
   */
  limpiarFormulario = (evento) => {
    this.actualizarTipoCalculoRedux({});
  };

  /**
   * Método encargado de ejecutar acciones al momento de cargar el componente
   */
  componentDidMount() {
    const valorPesos = this.calcularPrecioEnPesos({ name: 'precioContrato', value: this.props.cabecera.precioContrato });
    this.actualizarCabeceraRedux({ valorPesos: valorPesos });
    this.obtenerTramosFinal();
  };

  /**
   * Calcula el precio en  pesos, si la unidad del valor actual seleccionado es dolares (USD).
   * @param {Event} target Evento ejecutado en el control de usuario
   */
  calcularPrecioEnPesos = (target) => {
    if (target.name === 'unidadMedidaPrecio' || target.name === 'precioContrato') {
      const idUnidadMedida = (target.name === 'unidadMedidaPrecio') ? target.value : this.props.cabecera.unidadMedidaPrecio;
      const unidadMedidaActual = this.obtenerUnidad(idUnidadMedida);
      let precioContrato = (target.name === 'precioContrato') ? target.value : this.props.cabecera.precioContrato;
      const tipo = getProp(unidadMedidaActual, 'uniPropiedad.tipo', null);
      if (unidadMedidaActual && tipo === 'USD') {
        if (isNaN(precioContrato)) {
          return;
        }
        const trmDia = (this.props.cabecera.trmDia ? this.props.cabecera.trmDia : 0);
        const trmTecho = ((this.props.cabecera.trmTecho) ? this.props.cabecera.trmTecho : trmDia);
        const valorPesos = trmTecho * precioContrato;
        return valorPesos;
      } else {
        if (target.name === 'precioContrato') {
          return target.value;
        } else if (target.name === 'unidadMedidaPrecio') {
          return this.props.cabecera.precioContrato;
        }
        return this.props.cabecera.valorPesos;
      }
    }
    return this.props.cabecera.valorPesos;
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
   * Controla los cambios de los componentes y los guarda en el objeto redux global.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const target = evento.target;
    change[target.name] = target.type === 'checkbox' ? target.checked : target.value;
    const valorPesos = this.calcularPrecioEnPesos(target);
    change.valorPesos = valorPesos;
    const tipoCalculo = getProp(this.props, 'tipoCalculo', {});
    if (target.value == 'N') {
      if (!tipoCalculo.canastaConsumoSuministro) {
        tipoCalculo.canastaConsumoSuministro = {}
      }
      tipoCalculo.canastaConsumoSuministro.canastaConRutas = [];
      tipoCalculo.canastaConsumoSuministro.intervalos = 0;
      tipoCalculo.canastaConsumoSuministro.tipoLiquidacion = '';
      this.props.actualizarTipoCalculoContrato({ canastaConsumoSuministro: { ...tipoCalculo.canastaConsumoSuministro } });
    }
    if (target.name === 'precioContrato' || target.name == 'porcentajeComercializacion' || target.name == 'unidadMedidaPrecio') {
      change[target.name] = target.value >= 0 ? (target.value) : 0;
      this.actualizarCabeceraRedux(change);
      return;
    }
    this.actualizarTipoCalculoRedux(change);
  };


  /**
   * Controla los cambios de los componentes y los guarda en la lista de tramos selecionados.
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambioTramo = (evento) => {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (desabilitarE) {
      return;
    }
    const control = evento.target;
    const valor = control.value;
    const nombrePropiedad = control.name;
    const idTramo = control.attributes['data-target'].value;
    const nuevosTramos = [...this.props.listas.listaTramosFinal];
    const indexTramo = nuevosTramos.findIndex(a => a.trmIderegistro == idTramo);
    nuevosTramos[indexTramo].cargos[nombrePropiedad] = valor;
    this.props.actualizarListaContratos({ listaTramosFinal: nuevosTramos });
    this.calcularPrecioContrato();
  };

  /**
   * Actualiza la propiedad tipoCalculo en el objeto global redux de contratos.
   * @param {Object} nuevoCambio Cambio a realizar
   */
  actualizarTipoCalculoRedux = (nuevoCambio) => {
    this.props.actualizarTipoCalculoContrato({
      ...getProp(this.props, 'tipoCalculo', {}),
      ...nuevoCambio
    })
  };

  /**
   * Actualiza el objeto cabecera el objeto global redux de contratos.
   * @param {Object} nuevoCambio Cambio a realizar
   */
  actualizarCabeceraRedux = (nuevoCambio) => {
    this.props.actualizarCabeceraContrato({
      ...getProp(this.props, 'cabecera', {}),
      ...nuevoCambio
    });
  };

  /**
   * Obtiene la lista de tipos calculo.
   * @return {Array}
   */
  obtenerListaTiposCalculo = () => {
    const tiposContrato = this.props.listas.tiposContrato || [];
    let opciones = [];
    const tiposContratoSeleccionados = tiposContrato.filter(t => t.seleccionado);
    const usaCanasta = tiposContratoSeleccionados.findIndex(t => getProp(t, 'uniPropiedad.tipocanasta', null)) !== -1;
    opciones.push({ texto: 'Ninguna de las Anteriores', valor: 'N' });
    if (usaCanasta) {
      opciones.push({ texto: 'Canasta', valor: 'C' });
    }
    if (opciones.filter(opcion => opcion.valor === getProp(this.props, 'tipoCalculo.tipoCalculo', null)).length === 0) {
      this.props.actualizarTipoCalculoContrato({ tipoCalculo: opciones[0].valor });
    }
    return opciones;
  };

  /**
   * Realizará la conversión de dólares a pesos evaluando si la unidad de medida es dólares...
   * @returns {Number}
   */
  convertirPrecioContrato = () => {
    const { precioContrato, trmDia, unidadMedida } = getProp(this.props, 'cabecera', {});
    //Obtener la lista y de ella la unidad de me dida para verificar el uniPropiedad.tipo...
    const valor = precioContrato * trmDia;
    return valor;
  };

  /**
   * Actualiza el objeto cabecera el objeto global redux de contratos.
   * @param {Object} tramos Tramos a actualizar en la cabecera
   */
  actualizarTramos = (tramos) => {
    tramos.forEach(tramo => {
      let cargos = tramo.listaCargos.find(lc => lc.seleccionado);
      cargos.cntrCargovariable = cargos.trcaCargovariable;
      tramo.cargos = cargos;
    });
    this.props.actualizarListaContratos({ listaTramosFinal: [...tramos] });
    this.calcularPrecioContrato();
  };

  /**
   * Método encargado de obtener los tramos dependiendo de los puntos de salida seleccionados
   * @returns {Array}
   */
  obtenerTramosFinal = () => {
    let lista = [];
    const tramos = getProp(this.props, 'listas.listaTramos', []);
    const puntosSalida = getProp(this.props, 'listas.puntosSalida', []).filter(p => p.seleccionado);
    if (!Util.validarArreglo(puntosSalida)) {
      return;
    }
    puntosSalida.forEach(punto => {
      punto.listaTramos.forEach(tramo => {
        let tramoPush = tramos.find(tramoFinal => tramoFinal.trmIderegistro == tramo.trmIderegistro.trmIderegistro);
        if (!Util.validarArreglo(lista)) {
          lista.push(tramoPush);
          return;
        }
        let existente = lista.find(exis => exis.trmIderegistro == tramo.trmIderegistro.trmIderegistro);
        if (existente) {
          return;
        }
        lista.push(tramoPush);
      });
    });
    this.setState({ listaTramosFinal: lista });
    this.props.actualizarListaContratos({ listaTramosFinal: lista });
  }

  /**
   * Método encargado de validar los tramos de los cargos
   * @param {Object} tramo Datos del tramo
   */
  validarTramo = (tramo) => {
    if (!Array.isArray(tramo.listaCargos) || tramo.listaCargos.length === 0) {
      this.props.mostrarAlerta('Atención', 'El tramo seleccionado no tiene cargos configurados.');
      return false;
    }

    return true;
  };

  /**
   * Obtiene la lista de los tramos seleccionados por el usuario.
   * @return {Array}
   */
  obtenerTramosSeleccionados = () => {
    let tramos = getProp(this.props, 'listas.listaTramosFinal', []);
    if (!Util.validarArreglo(tramos)) {
      return [];
    }
    let listaFiltrada = getProp(this.props, 'listas.listaTramosFinal', []).filter(t => t.seleccionado);
    if (!Util.validarArreglo(listaFiltrada)) {
      return [];
    }
    return tramos.filter((t) => {
      if (t.seleccionado) { t.idTramo = Util.generarIdControl('rangoTramo'); return t; }
    });
  };

  /**
    * Obtiene el valor cargo de un tramo.
    * @param {Object} tramo Datos del tramo
    * @param {String} tipo Tipo del cargo
    * @return {Number}
    */
  obtenerValorCargo = (tramo, tipo) => {
    //Verificamos el cargo seleccionado...
    if (!Util.validarArreglo(tramo.listaCargos)) {
      return -1;
    }
    var cargoSeleccionado = tramo.listaCargos.find(cargo => cargo.seleccionado);
    if (!cargoSeleccionado) {
      return 0;
    }
    switch (tipo) {
      case 'V':
        return cargoSeleccionado.cntrCargovariable;
      case 'F':
        return cargoSeleccionado.trcaCargofijo;
      case 'A':
        return cargoSeleccionado.trcaCargoaoym;
    }
  };

  /**
   * Renderiza la tabla con los tramos seleccionados.
   * @return {Component}
   */
  renderTablaTramosSeleccionados = () => {
    const listaTramosSeleccionados = this.obtenerTramosSeleccionados();
    if (listaTramosSeleccionados.length == 0) {
      return null;
    }
    return (
      <table className='table table-hover table-striped table-condensed labels-hidden mt-5'>
        <thead>
          <tr>
            <th>Tramo</th>
            <th>C. Variable</th>
            <th>C. Fijo</th>
            <th>C. AO&M</th>
          </tr>
        </thead>
        <tbody>
          {
            listaTramosSeleccionados.map(t => {
              let cargos = t.listaCargos.find(lc => lc.seleccionado);
              t.cargos = cargos;
              return (
                <tr key={t.trmIderegistro}>
                  <td>{t.trmNombre}</td>
                  <td>
                    <Input
                      value={cargos.cntrCargovariable}
                      onChange={this.controlarCambioTramo}
                      extra={{ 'data-target': t.trmIderegistro }}
                      name='cntrCargovariable'
                    />
                  </td>
                  <td>{this.obtenerValorCargo(t, 'F')}</td>
                  <td>{this.obtenerValorCargo(t, 'A')}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Calcula el precio del contrato y actualiza el Redux (objeto cabecera).
   */
  calcularPrecioContrato = () => {
    const tramosSeleccionados = this.obtenerTramosSeleccionados();
    let valores = {
      precioContrato: 0,
      valorCargos: {
        variable: 0,
        fijo: 0,
        aom: 0
      }
    };
    for (let i = 0; i < tramosSeleccionados.length; i++) {
      const tramo = tramosSeleccionados[i];
      let valorVariable = tramo.cargoVariable > 0 ? parseFloat(tramo.cargoVariable) : this.obtenerValorCargo(tramo, 'V');
      let ValorFijo = this.obtenerValorCargo(tramo, 'F');
      let valorAOM = this.obtenerValorCargo(tramo, 'A');
      valores.valorCargos.variable += valorVariable;
      valores.valorCargos.fijo += ValorFijo;
      valores.valorCargos.aom += valorAOM;
      valores.precioContrato += (valorVariable + ValorFijo + valorAOM);
    }

    this.actualizarCabeceraRedux({ precioContratoTramo: valores.precioContrato, valorCargos: valores.valorCargos });
  };

  /**
   * Obtiene los tipos de contrato...
   * @returns {Array}
   */
  obtenerTiposServicio = () => {
    const tiposContratoSeleccionados = this.props.listas.tiposContrato.filter(t => {
      if (t.seleccionado && getProp(t, 'uniPropiedad.tipocanasta', null)) {
        return t;
      }
    });
    const tiposServicio = [];
    for (let i = 0; i < tiposContratoSeleccionados.length; i++) {
      const tipoContrato = tiposContratoSeleccionados[i];
      const tiposContrato = getProp(tipoContrato, 'uniPropiedad.tipocanasta', '').split(',');
      if (tiposContrato.length) {
        tiposContrato.filter(tipoContratoFiltro => {
          this.props.listas.tiposContrato.find(tipoContratoBusqueda => {
            const codigoTipoContrato = getProp(tipoContratoBusqueda, 'uniPropiedad.tipocontrato', '');
            if (codigoTipoContrato.trim() == (tipoContratoFiltro.trim())) {
              //Verificamos si no existe un tipo contrato con el mismo tipo de contrato.
              const index = tiposServicio.findIndex(tipoServicio => getProp(tipoServicio, 'uniPropiedad.tipocontrato', '') == codigoTipoContrato);
              if (index < 0) {
                tiposServicio.push(tipoContratoBusqueda);
              }
            }
          });
        });
      }
    }
    return tiposServicio;
  };

  /**
   * Obtiene la lista de medidores seleccionados.
   * @returns {Array}
   */
  obtenerMedidoresSeleccionados = () => {
    return this.props.listas.medidores.filter(m => m.seleccionado);
  };

  /**
   * Obtiene la lista de rutas seleccionados.
   * @returns {Array}
   */
  obtenerRutasSeleccionadas = () => {
    return this.props.listas.rutas.filter(r => r.seleccionado).map(r => {
      r.cntuVlrunitario = (r.cntuVlrunitario) ? r.cntuVlrunitario : 0;
      return r;
    });
  };

  /**
   * Metodo encargado de cambiar el valor unitario del medidor
   * @param {Event} event Evento ejecutado en el control de usuario
   */
  controlarCambioMedidor = (event) => {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (desabilitarE) {
      return;
    }
    const control = event.target;
    const medidores = [...this.props.listas.medidores];
    const idMedidor = parseInt(control.attributes['data-id'].value);
    const index = medidores.findIndex(t => t.mesuIderegistro === idMedidor);
    if (control.value == "") {
      medidores[index][control.name] = control.value;
      this.props.actualizarListaContratos({ medidores: [...medidores] });
      return;
    }
    medidores[index][control.name] = control.value;
    this.props.actualizarListaContratos({ medidores: [...medidores] });
  }

  /**
   * Metodo encargado de cambiar el valor unitario de la ruta
   * @param {Event} event Evento ejecutado en el control de usuario
   */
  controlarCambioRutas = (event) => {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (desabilitarE) {
      return;
    }
    const control = event.target;
    const rutas = [...this.props.listas.rutas];
    const idRuta = parseInt(control.attributes['data-id'].value);
    const index = rutas.findIndex(t => t.uniIderegistro === idRuta);
    if (control.value == "") {
      rutas[index][control.name] = control.value;
      this.props.actualizarListaContratos({ rutas: [...rutas], rutasGNC: [...rutas] });
      return;
    }
    rutas[index][control.name] = control.value;
    this.props.actualizarListaContratos({ rutas: [...rutas], rutasGNC: [...rutas] });
  }

  /**
   * Método encargado de obtener el total por medidor
   * @returns {Integer}
   */
  obtenerTotalMedidor = () => {
    let unidad;
    let tipo;
    let total = 0;
    let sumatoria = 0;
    let precio;
    const medidoresSeleccionados = this.obtenerMedidoresSeleccionados();
    medidoresSeleccionados.forEach(m => {
      precio = m.mesuPrecio;
      unidad = m.uniIdemedidaprecio;
      tipo = unidad.uniPropiedad.tipo;
      if (isNaN(precio)) {
        precio = 0;
      }
      if (unidad && tipo === 'USD') {
        const trmDia = (getProp(this.props, 'cabecera.trmDia') ? this.props.cabecera.trmDia : 0);
        const trm = (getProp(this.props, 'cabecera.trmTecho') ? this.props.cabecera.trmTecho : trmDia);
        precio = precio * trm;
      }
      total = (total + parseFloat(precio));
    });

    sumatoria = total;
    total = 0;
    return sumatoria;
  }

  /**
   * Método encargado de obtener el total
   * @returns {Integer}
   */
  obtenerTotalRuta = () => {
    let unidad;
    let total = 0;
    let sumatoria = 0;
    const rutasSeleccionadas = this.obtenerRutasSeleccionadas();
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    if (idUnidadMedida != "") {
      unidad = this.obtenerUnidad(idUnidadMedida);
    }
    const tipo = getProp(unidad, 'uniPropiedad.tipo', null);
    rutasSeleccionadas.forEach(r => {
      let precio = r.cntuVlrunitario;
      if (isNaN(precio)) {
        precio = 0;
      }
      total = (total + parseFloat(precio));
    });
    if (unidad && tipo === 'USD') {
      const trmDia = (getProp(this.props, 'cabecera.trmDia') ? this.props.cabecera.trmDia : 0);
      const trm = (getProp(this.props, 'cabecera.trmTecho') ? this.props.cabecera.trmTecho : trmDia);
      total = total * trm;
    }
    sumatoria = total;
    total = 0;
    return sumatoria;
  }

  /**
   * Método encargado de mostrar la tabla con rutas para el calculo del precio
   * @returns {Object}
   */
  renderTablaRutas = () => {
    const rutasSeleccionadas = this.obtenerRutasSeleccionadas();
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    let unidad;
    if (idUnidadMedida != "") {
      unidad = this.obtenerUnidad(idUnidadMedida);
    }
    return (
      rutasSeleccionadas.length > 0 && (
        <table className='table table-hover table-striped table-condensed labels-hidden mt-5'>
          <thead>
            <tr>
              <th colSpan='3' style={{ 'textAlign': 'center' }}>Rutas</th>
            </tr>
            <tr>
              <th>Nombre</th>
              <th>Valor Unitario</th>
              {idUnidadMedida != "" &&
                <th>Unidad medida</th>
              }
            </tr>
          </thead>
          <tbody>
            {
              rutasSeleccionadas.map(r => {
                return (
                  <tr key={r.uniIderegistro}>
                    <td>{r.uniNombre1}</td>
                    <td>{
                      <TextoNumerico
                        aceptaDecimales={true}
                        aceptaNegativos={false}
                        cols={12}
                        value={r.cntuVlrunitario}
                        onChange={this.controlarCambioRutas}
                        name='cntuVlrunitario'
                        extra={{ "data-id": r.uniIderegistro }}
                      />
                    }
                    </td>
                    {idUnidadMedida != "" &&
                      <td>{unidad.uniNombre1}</td>
                    }
                  </tr>
                )
              })
            }
            <tr>
              <td>Total</td>
              <td colSpan='2'>{this.obtenerTotalRuta()}</td>
            </tr>
          </tbody>
        </table>
      )
    );
  }

  /**
   * Método encargado de mostrar la tabla de medidores para el calculo del precio
   * @returns {Object}
   */
  renderTablaMedidores = () => {
    const medidoresSeleccionados = this.obtenerMedidoresSeleccionados();
    const idUnidadMedida = getProp(this.props, 'cabecera.unidadMedidaPrecio', '');
    return (
      medidoresSeleccionados.length > 0 && (
        <table className='table table-hover table-striped table-condensed labels-hidden mt-5'>
          <thead>
            <tr>
              <th colSpan='3' style={{ 'textAlign': 'center' }}>Medidores</th>
            </tr>
            <tr>
              <th>Nombre</th>
              <th>Valor Unitario</th>
              <th>Unidad medida</th>
            </tr>
          </thead>
          <tbody>
            {
              medidoresSeleccionados.map(m => {
                return (
                  <tr key={m.mesuIderegistro}>
                    <td>{m.mesuNombre}</td>
                    <td>{
                      <TextoNumerico
                        aceptaDecimales={true}
                        aceptaNegativos={false}
                        cols={12}
                        value={m.mesuPrecio}
                        onChange={this.controlarCambioMedidor}
                        name='mesuPrecio'
                        extra={{ "data-id": m.mesuIderegistro }}
                      />
                    }
                    </td>
                    <td>{m.uniIdemedidaprecio.uniNombre1}</td>
                  </tr>
                )
              })
            }
            <tr>
              <td>Total</td>
              <td colSpan='2'>{this.obtenerTotalMedidor()}</td>
            </tr>
          </tbody>
        </table>
      )
    );
  };

  /**
   * Renderiza el formulario dependiendo el tipo de calculo seleccionado.
   * @return {Component}
   */
  renderPorTipoCalculo = () => {
    const estadoContrato = getProp(this.props, 'cabecera.estadoContrato', '');
    let desabilitarE = false;
    let desabilitarActivo = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (estadoContrato == 'A') {
      desabilitarActivo = true;
    }
    let desabilitar = true;
    const { tiposContrato } = this.props.listas;
    const esTipoTransporte = tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'T'));
    const esSuministro = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'S');
    const usaRutas = tiposContrato.filter(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'CNX' || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNC'));
    const tiposSinListas = tiposContrato.filter(t => t.seleccionado &&
      (getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'));
    if (Util.validarArreglo(tiposSinListas)) {
      desabilitar = false;
    }
    switch (getProp(this.props, 'tipoCalculo.tipoCalculo', '')) {
      case 'C':
        return;
      default:
        return (
          <div className='col-12 row mt-3'>
            {(esTipoTransporte && Util.validarArreglo(getProp(this.props, 'listas.listaTramosFinal', []))) &&
              <Fragment>
                <SelectorTramos
                  titulo='Tramos:'
                  propTexto='trmNombre'
                  propValor='trmIderegistro'
                  seleccionarItem={this.actualizarTramos}
                  actualizarTramosRedux={this.props.actualizarListaContratos}
                  mostrarAlerta={this.props.mostrarAlerta}
                  lista={getProp(this.props, 'listas.listaTramosFinal', [])}
                  listas={this.props.listas}
                  estadoContrato={getProp(this.props, 'cabecera.estadoContrato', '')}
                />
              </Fragment>
            }
            <TextoNumerico
              aceptaDecimales={true}
              aceptaNegativos={false}
              label='Valor unitario contrato x:'
              cols={4}
              value={getProp(this.props, 'cabecera.precioContrato', '')}
              onChange={this.controlarCambio}
              name='precioContrato'
              extra={{ disabled: (desabilitar || desabilitarE) }}
            />
            <Combo
              cols={3}
              opciones={this.props.listas.monedas}
              propTexto='uniNombre1'
              propValor='uniIderegistro'
              label='Und. Medida:'
              name='unidadMedidaPrecio'
              value={getProp(this.props, 'cabecera.unidadMedidaPrecio', '')}
              onChange={this.controlarCambio}
              extra={{ disabled: (desabilitarE || desabilitarActivo == true) }}
            />
            <TextoNumerico
              aceptaDecimales={true}
              aceptaNegativos={false}
              label='Valor en pesos:'
              cols={3}
              value={getProp(this.props, 'cabecera.valorPesos', 0)}
              onChange={this.controlarCambio}
              name='valorPesos'
              extra={{ disabled: true }}
            />
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='% Comercialización:'
              cols={2}
              value={getProp(this.props, 'cabecera.porcentajeComercializacion', '')}
              onChange={this.controlarCambio}
              name='porcentajeComercializacion'
              extra={{ disabled: (desabilitarE || desabilitarActivo == true) }}
            />
            {esSuministro &&
              this.renderTablaMedidores()
            }
            {Util.validarArreglo(usaRutas) &&
              this.renderTablaRutas()
            }
            {esTipoTransporte &&
              <div className='col-12 form-group'>
                {this.renderTablaTramosSeleccionados()}
              </div>
            }
          </div>
        );
    }
  };

  /**
   * Renderiza el formulario de canasta.
   * @return {Component}
   */
  renderFormularioCanasta = () => {
    // const { tipoCalculo, tarifaConsumo, tarifaHoraria, tipoServicio } = getProp(this.props, 'tipoCalculo', {});
    // Si el tipo de cálculo es diferente de Canasta o no se ha seleccionado ningún tipo de canasta, no mostrar nada
    const tipoCalculo = getProp(this.props, 'tipoCalculo.tipoCalculo', '');
    if (tipoCalculo !== 'C') {
      return null;
    }
    let formConsumo = null;
    if (tipoCalculo == 'C') {
      formConsumo = (
        <CanastaConsumoSuministro
          canastaConsumoSuministro={this.props.tipoCalculo.canastaConsumoSuministro}
          actualizarTipoCalculoContrato={this.props.actualizarTipoCalculoContrato}
          actualizarListaContratos={this.props.actualizarListaContratos}
          actualizarCabeceraContrato={this.props.actualizarCabeceraContrato}
          listaUnidadesMedida={this.props.listas.monedas}
          rutasGNC={this.props.listas.rutasGNC}
          mostrarAlerta={this.props.mostrarAlerta}
          listaTiposContrato={this.props.listas.tiposContrato}
          cabecera={this.props.cabecera}
          actualizarCabeceraRedux={this.actualizarCabeceraRedux}
          listaTramos={getProp(this.props, 'listas.listaTramosFinal', [])}
          valorUnidad={getProp(this.props, 'cabecera.unidadMedidaPrecio', '')}
          medidores={this.props.listas.medidores}
          listas={this.props.listas}
          estadoContrato={getProp(this.props, 'cabecera.estadoContrato', '')}
        />
      );
    }

    return (
      <Fragment>
        {formConsumo}
      </Fragment>
    )
  };

  /**
   * Render principal...
   * @return {Component}
   */
  render() {
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
      <div className='row mt-5 calculo-contrato'>
        <Combo
          opciones={this.obtenerListaTiposCalculo()}
          propTexto='texto'
          propValor='valor'
          mostrarOpcionPorDefecto={false}
          label='Tipo de cálculo precio:'
          cols={3}
          name='tipoCalculo'
          value={getProp(this.props, 'tipoCalculo.tipoCalculo', '')}
          onChange={this.controlarCambio}
          extra={{ disabled: (desabilitar || desabilitarActivo == true) }}
        />

        {this.renderPorTipoCalculo()}
        {this.renderFormularioCanasta()}
      </div>
    );
  }
}

CalculoPrecioContrato.propTypes = {
  cabecera: PropTypes.object,
  listas: PropTypes.object,
  actualizarCabeceraContrato: PropTypes.func,
  actualizarListaContratos: PropTypes.func,
  actualizarTipoCalculoContrato: PropTypes.func,
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  const { cabecera, listas, tipoCalculo } = state.contratos;
  return { cabecera, listas, tipoCalculo };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actualizarCabeceraContrato,
    actualizarListaContratos,
    actualizarTipoCalculoContrato,
    mostrarAlerta
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(CalculoPrecioContrato);

export { VistaRedux as RCalculoPrecioContrato };
