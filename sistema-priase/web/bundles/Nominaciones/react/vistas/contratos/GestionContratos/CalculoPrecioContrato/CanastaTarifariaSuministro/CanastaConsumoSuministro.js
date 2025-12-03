import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Input, TextoNumerico, Combo, Util } from 'appfuture-react';

// Util
import { get as getProp, get } from 'object-path';
import Modal from 'react-bootstrap4-modal';

import './CanastaHorariaSuministro.scss';
import { SuministroConRuta } from './SuministroConRutas';
import { SelectorTramos } from '../../../../utils/SelectorTramos';

const tiposLiquidacion = [
  { texto: 'Volumen Marginal', valor: 'V' },
  { texto: 'Rango Total', valor: 'R' }
];

class CanastaConsumoSuministro extends Component {

  state = {
    horaFin: '',
    valor: '',
    unidadMedida: '',
    nombreUnidadMedida: '',
    porcentaje: '',
    idRangoSinRuta: null,
    idRangoConRuta: null,
    mostrarRutas: false,
  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  actualizarState = (evento) => {
    let cambio = {};
    const target = evento.target;
    cambio[target.name] = target.value;
    this.setState(cambio);
  };

  /**
   * Método encargado de controlar el cambio de los componentes
   * @param {Event} evento Evento ejecutado en el control de usuario
   */
  controlarCambio = (evento) => {
    let cambio = {};
    const target = evento.target;
    cambio[target.name] = target.value;
    if (target.name === 'unidadMedida') {
      cambio['nombreUnidadMedida'] = target.text;
    }
    if (target.name === 'unidadMedidaPrecio') {
      cambio['unidadMedidaPrecio'] = target.value;
      this.actualizarCabeceraRedux(cambio);
      return;
    }
    this.actualizarEstadoRedux(cambio);
  };

  /**
   * Método encargado de actualizar el objeto redux
   * @param {Event} cambio Cambio a realizar
   */
  actualizarEstadoRedux = (cambio) => {
    this.props.actualizarTipoCalculoContrato({ canastaConsumoSuministro: { ...this.props.canastaConsumoSuministro, ...cambio } });
  };

  /**
   * Método encargado de validar los campos del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { unidadMedida, valor, porcentaje, horaFin } = this.state;

    if (unidadMedida === '' || unidadMedida === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una unidad de medida.' } };
    }

    if (valor.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el valor.' } };
    }

    if (this.validarNumero(porcentaje) && porcentaje > 100) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar un porcentaje válido menor o igual 100%.' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de validar que un valor sea un número
   * @param {Number} numero Valor del número
   * @returns {Boolean}
   */
  validarNumero = (numero) => {
    return !/^([0-9.])*$/.test(numero);
  };

  /**
   * Método encargado de mostrar el formulario con rutas
   * @returns {Component}
   */
  renderFormularioConRutas = () => {
    const { canastaConsumoSuministro, actualizarTipoCalculoContrato, actualizarListaContratos, listaUnidadesMedida, mostrarAlerta, rutasGNC, actualizarCabeceraRedux, valorUnidad } = this.props;
    const { intervalos, canastaConRutas } = this.props.canastaConsumoSuministro;
    console.log('INTERVALOS: ' + intervalos, 'Canasta: ' + this.props.canastaConsumoSuministro);
    return (
      <SuministroConRuta
        canastaConsumoSuministro={canastaConsumoSuministro}
        actualizarTipoCalculoContrato={actualizarTipoCalculoContrato}
        actualizarListaContratos={actualizarListaContratos}
        actualizarCabeceraRedux={actualizarCabeceraRedux}
        listaUnidadesMedida={listaUnidadesMedida}
        mostrarAlerta={mostrarAlerta}
        rutasGNC={rutasGNC}
        intervalos={1}
        valorUnidad={valorUnidad}
        estadoContrato={getProp(this.props, 'estadoContrato', '')}
      />
    );
  };

  /**
   * Genera los intervalos...
   * @returns {Boolean}
   */
  generarIntervalos = () => {
    const estadoContrato = getProp(this.props, 'estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    if (desabilitarE) {
      return;
    }
    const { intervalos, canastaSinRutas, canastaConRutas } = this.props.canastaConsumoSuministro;
    const { listaTramos, listas } = this.props;
    const esTipoTransporte = listas.tiposContrato.find(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'T'));
    const tiposSinListas = listas.tiposContrato.filter(t => t.seleccionado &&
      (getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'
        || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'));
    const listaCantidad = getProp(this.props, 'cabecera.listaCantidad', []);
    if (!Util.validarArreglo(listaCantidad)) {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar una cantidad contratada en la cabecera del contrato');
      return;
    }

    if (Util.validarArreglo(tiposSinListas)) {
      const cantidadContratada = getProp(this.props, 'cabecera.cantidadContratada');
      if (!cantidadContratada || cantidadContratada == null || isNaN(cantidadContratada)) {
        this.props.mostrarAlerta('Atención', 'Debe ingresar la cantidad contratada en la cabecera del contrato');
        return;
      }
    }

    if (esTipoTransporte) {
      const listaTramosSeleccionados = listaTramos.filter(t => t.seleccionado);
      if (listaTramosSeleccionados.length != listaTramos.length) {
        this.props.mostrarAlerta('Atención', 'Debe seleccionar todos los tramos');
        return;
      }
    }

    if (intervalos === '' || intervalos <= 0) {
      this.props.mostrarAlerta('Atención', 'Debe agregar una cantidad de intervalos mayor a 0');
      return;
    }

    if ((Util.validarArreglo(canastaSinRutas)) || (Util.validarArreglo(canastaConRutas))) {
      // Mostrar mensaje indicando que se van a borrar los intervalos existentes
      const botones = [
        { texto: 'Cancelar', clase: 'btn-danger' },
        { texto: 'Aceptar', clase: 'btn-primary', callback: this.crearArregloIntervalos }
      ];
      this.props.mostrarAlerta('Atención', 'Se eliminarán los intervalos actuales, ¿Desea continuar?', botones);
      return;
    }

    this.crearArregloIntervalos();
  };

  /**
   * Método encargado de controlar el cambio en el componente selector de rutas
   * @param {Event} event Evento ejecutado en el control de usuario
   */
  seleccionarRuta = (event) => {
    const rutas = [...this.props.rutasGNC];
    const idRuta = parseInt(event.target.value);
    const index = rutas.findIndex(t => t.uniIderegistro === idRuta);
    rutas[index].seleccionado = event.target.checked;
    this.props.actualizarListaContratos({ rutasGNC: [...rutas] });
    // this.actualizarRutasEnRangos();
  };

  /**
   * Método encargado de mostrar el modal de rutas
   * @returns {JSX}
   */
  renderModalRutas = () => {
    return (
      <Modal visible={this.state.mostrarRutas}>
        <div className="modal-header">
          <h4 className="modal-title"><b>Rutas</b></h4>
        </div>
        <div className="modal-body">
          <div>
            <p>Seleccione las Rutas</p>
            {
              this.props.rutasGNC.map(r => {
                return (
                  <div key={`ruta_${r.uniIderegistro}`}>
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
          <button className='btn btn-primary' onClick={() => { this.setState({ mostrarRutas: false }) }}>Aceptar</button>
        </div>
      </Modal>
    );
  };

  /**
   * Método encargado de obtener las rutas seleccionadas
   * @returns {Array}
   */
  obtenerRutasSeleccionadas = () => {
    const rutas = this.props.rutasGNC.filter((ruta) => {
      if (ruta.seleccionado) {
        ruta.idRutaRango = Util.generarIdControl('idRutaRango_');
        return ruta;
      }
    });
    return [...rutas];
  }

  /**
   * Método encargado de obtener las listas a mostrar en la canasta
   * @returns {Array}
   */
  obtenerListas = (rangoInicial) => {
    const { tiposContrato } = this.props.listas;
    let listaFinal = [];
    const esSuministro = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'S');
    const esGnc = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNC');
    const esTransporte = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'T');
    const esConexion = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'CNX');
    const otros = tiposContrato.filter(t => t.seleccionado && (getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNCV'
      || getProp(t, 'uniPropiedad.tipocontrato', null) === 'ATR'
      || getProp(t, 'uniPropiedad.tipocontrato', null) === 'GNV'));
    if (esSuministro) {
      const medidores = getProp(this.props.listas, 'medidores', []).filter(m => m.seleccionado);
      medidores.forEach(m => {
        m.nombre = m.mesuNombre + ' ' + 'Medidor';
        m.idMedidorRango = Util.generarIdControl('idMedidorRango_') + rangoInicial;
      });
      listaFinal.push(...medidores);
    }

    if ((esGnc || esConexion)) {
      const rutas = getProp(this.props.listas, 'rutas', []).filter(r => r.seleccionado);
      rutas.forEach(r => {
        r.nombre = r.uniNombre1 + ' ' + 'Ruta';
        r.idRutaRango = Util.generarIdControl('idRutaRango_') + rangoInicial;
      });
      listaFinal.push(...rutas);
    }

    if (esTransporte) {
      let lista = [];
      let listaTramos = (this.props.listas.listaTramosFinal) ? [...this.props.listas.listaTramosFinal] : [];
      listaTramos = listaTramos.filter(t => t.seleccionado);
      let cargos;
      for (let index = 0; index < listaTramos.length; index++) {
        const tramo = { ...listaTramos[index] };
        lista.push(tramo);
      }
      lista.forEach(t => {
        let tramo = { ...t };
        cargos = { ...tramo.listaCargos.find(lc => lc.seleccionado) };
        t.cargos = { ...cargos };
        t.nombre = tramo.trmNombre + ' ' + 'Tramo';
        t.idTramoRango = Util.generarIdControl('idTramoRango_') + rangoInicial;
      });
      listaFinal.push(...lista);
    }

    if (Util.validarArreglo(otros)) {
      listaFinal.push({ nombre: '', valor: 0, porcentaje: 0, idRangoSin: Util.generarIdControl('idRangoSin_') + rangoInicial });
    }

    return listaFinal;
  };

  /**
   * Crea el arreglo de intervalos que se mostrará en el panel...
   * @returns {Boolean}
   */
  crearArregloIntervalos = () => {
    const cantidadDecimales = 7;
    const { intervalos } = this.props.canastaConsumoSuministro;
    const listaCantidad = getProp(this.props, 'cabecera.listaCantidad', []);
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', []);
    let cantidadContratada = 0;
    if (!Util.validarArreglo(listaCantidad)) {
      return 0;
    }
    listaCantidad.forEach(m => {
      cantidadContratada = parseFloat(cantidadContratada + m.cantidadContratada);
    });
    switch (periodoCantidadContratada) {
      case 'D':
        cantidadContratada = (cantidadContratada / 1) * 30;
        break;
      case 'S':
        cantidadContratada = (cantidadContratada / 7) * 30;
        break;
      case 'M':
        cantidadContratada = (cantidadContratada / 30) * 30;
        break;
      case 'A':
        cantidadContratada = (cantidadContratada / 365) * 30;
        break;
      default:
        break;
    }
    cantidadContratada = parseFloat(cantidadContratada.toFixed(cantidadDecimales));
    let cantidadRango = cantidadContratada / parseInt(intervalos);
    cantidadRango = parseFloat(cantidadRango.toFixed(cantidadDecimales));
    let nuevaCanastaConRutas = [];
    let rangoInicial = 0;
    let valorRango = 0;
    for (let i = 0; i < intervalos; i++) {
      valorRango += cantidadRango;
      valorRango = parseFloat(valorRango.toFixed(cantidadDecimales));
      if (i == (intervalos - 1)) {
        nuevaCanastaConRutas.push({ idRangoConRuta: Util.generarIdControl('idRangoConRuta_'), idIntervaloSinRuta: Util.generarIdControl('conruta'), rango: { inicio: rangoInicial, fin: 999999 }, valor: 0, porcentaje: 0, rutas: this.obtenerListas(rangoInicial) });
        continue;
      }
      nuevaCanastaConRutas.push({ idRangoConRuta: Util.generarIdControl('idRangoConRuta_'), idIntervaloSinRuta: Util.generarIdControl('conruta'), rango: { inicio: rangoInicial, fin: valorRango }, valor: 0, porcentaje: 0, rutas: this.obtenerListas(rangoInicial) });
      rangoInicial = valorRango + 1;
      rangoInicial = parseFloat(rangoInicial.toFixed(cantidadDecimales));
    }
    this.actualizarEstadoRedux({ canastaConRutas: nuevaCanastaConRutas });
    return;
  };

  /**
   * Método encargado de validar que formulario mostrar
   * @returns {JSX}
   */
  renderTablaIntervalos = () => {
    return this.renderFormularioConRutas();
  };

  /**
   * Método encargado de validar el tipo de contrato
   * @returns {String}
   */
  validarTipoContrato = () => {
    const tiposContrato = this.props.listaTiposContrato;
    const tipos = tiposContrato.filter(tipoContrato => {
      const esConexion = tipoContrato.seleccionado && tipoContrato.uniPropiedad && tipoContrato.uniPropiedad.tipocontrato === 'CNX';
      const esGNC = tipoContrato.seleccionado && tipoContrato.uniPropiedad && tipoContrato.uniPropiedad.tipocontrato === 'GNC';
      if (esConexion || esGNC) {
        return tipoContrato;
      }
    });
    const res = (tipos.length === 0);
    const estado = res ? 'N' : 'S';
    const estadoActual = getProp(this.props, 'canastaConsumoSuministro.usaRutasGNC', null);
    if (estado != estadoActual) {
      this.actualizarEstadoRedux({ usaRutasGNC: estado });
    }
    return res;
  };

  /**
   * Método encargado de obtener la cantidad contratada total
   * @returns {Number}
   */
  obtenerCantidadContratada = () => {
    const listaCantidad = getProp(this.props, 'cabecera.listaCantidad', []);
    const periodoCantidadContratada = getProp(this.props, 'cabecera.periodoCantidadContratada', []);
    let total = 0;
    if (!Util.validarArreglo(listaCantidad)) {
      return 0;
    }
    listaCantidad.forEach(m => {
      total = parseFloat(total + m.cantidadContratada);
    });
    switch (periodoCantidadContratada) {
      case 'D':
        total = (total / 1) * 30;
        break;
      case 'S':
        total = (total / 7) * 30;
        break;
      case 'M':
        total = (total / 30) * 30;
        break;
      case 'A':
        total = (total / 365) * 30;
        break;
      default:
        break;
    }
    return total;
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
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    const estadoContrato = getProp(this.props, 'estadoContrato', '');
    let desabilitarE = false;
    if (estadoContrato == 'F' || estadoContrato == 'L') {
      desabilitarE = true;
    }
    const { tiposContrato } = this.props.listas;
    const esTipoTransporte = tiposContrato.find(t => t.seleccionado && getProp(t, 'uniPropiedad.tipocontrato', null) === 'T');
    return (
      <div className='canasta-horaria container'>
        <div className='mt-3 card box-shadow'>
          <div className='card-header'>Canasta Tarifa Consumo</div>
          <div className='card-body'>
            <div>
              <h3 className='font-weight-bold text-center'>Rangos de Consumo</h3>
            </div>
            <div className='row mt-2'>
              {esTipoTransporte &&
                <SelectorTramos
                  titulo='Tramos:'
                  propTexto='trmNombre'
                  propValor='trmIderegistro'
                  seleccionarItem={this.actualizarTramos}
                  mostrarAlerta={this.props.mostrarAlerta}
                  lista={this.props.listaTramos}
                />
              }
              <Combo
                cols={3}
                opciones={this.props.listas.monedas}
                propTexto='uniNombre1'
                propValor='uniIderegistro'
                label='Und. Medida:'
                name='unidadMedidaPrecio'
                value={getProp(this.props, 'cabecera.unidadMedidaPrecio', '')}
                onChange={this.controlarCambio}
                extra={{ disabled: desabilitarE }}
              />
              <Combo
                opciones={tiposLiquidacion}
                propTexto='texto'
                propValor='valor'
                label='Tipo de Liquidación:'
                name='tipoLiquidacion'
                value={getProp(this.props, 'canastaConsumoSuministro.tipoLiquidacion', '-1')}
                onChange={this.controlarCambio}
                cols={3}
                extra={{ disabled: desabilitarE }}
              />
              <Input
                label='Cant. Contratada Mensual:'
                value={this.obtenerCantidadContratada()}
                name='cantidadContratada'
                extra={{ disabled: true, readOnly: true }}
                disabled={true}
                cols={2}
              />
              <TextoNumerico
                aceptaDecimales={false}
                aceptaNegativos={false}
                label='No. Intervalos:'
                cols={2}
                value={getProp(this.props, 'canastaConsumoSuministro.intervalos', '0')}
                onChange={this.controlarCambio}
                name='intervalos'
                extra={{ disabled: desabilitarE }}
              />
              <div>
                <button className="btn btn-primary mt-4" onClick={this.generarIntervalos}>Generar Intervalos</button>
              </div>
            </div>
            {this.renderTablaIntervalos()}
          </div>
        </div>
      </div>
    );
  }
}

CanastaConsumoSuministro.propTypes = {
  mostrarAlerta: PropTypes.func,
  listaUnidadesMedida: PropTypes.array,
  rutasGNC: PropTypes.array,
  actualizarTipoCalculoContrato: PropTypes.func,
  actualizarListaContratos: PropTypes.func,
  canastaConsumoSuministro: PropTypes.object,
  cabecera: PropTypes.object,
  actualizarCabeceraRedux: PropTypes.func,
};

CanastaConsumoSuministro.defaultProps = {
  canastaConsumoSuministro: {}
};

export { CanastaConsumoSuministro };
