import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { get as getProp } from 'object-path';
import PropTypes from 'prop-types';
import { Combo, Util, VentanaModal } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../../global/rutas_api';
import { Table } from 'react-bootstrap';
import { mostrarAlerta } from '../../../../../store/actions/AplicacionAcciones';
import { RFacturasComponentConsulta } from './FacturasComponentConsulta';
import { formatearArray, limpiarJson } from '../../../../../global/util_nominaciones';
import '../GestionRevisionFacturas.scss';
import { toast } from 'react-toastify'

class DispercionConsumos extends Component {

  state = {};

  /**
   * @method
   * Método encargado de realizar acciones al momento de limpiar el formulario
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  }

  /**
   * @method
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.props.actualizarListasRevision({ listaPuntosAgregados: [] });
  };

  /**
   * @method
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.props.actualizarDispercionRedux(change);
  };

  /**
   * @method
   * Método encargado de eliminar un punto de consumo de la lista
   * @param {Number} posicion Posición en el arreglo
   */
  eliminarPunto = (posicion) => {
    const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', [])];
    lista.splice(posicion, 1);
    this.props.actualizarListasRevision({ listaPuntosAgregados: lista });
  }

  /**
   * @method
   * Método encargado de mostrar la tabla con los puntos de salida agregados
   * @returns {Array}
   */
  renderTablaPuntosAgregados = () => {
    const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', [])];
    if (!Util.validarArreglo(lista)) {
      return;
    }
    let desabilitado = false;
    if (getProp(this.props, 'dispercion.idRevision', '') != '') {
      desabilitado = true;
    }
    const totales = this.props.obtenerTotalesPuntosSalidaDispercion(lista);
    return (
      <Table responsive striped bordered hover>
        <thead className='bg-dark text-white'>
          <tr>
            <th>Acciones </th>
            <th>Punto de Salida </th>
            <th>Cantidad Contrata Periodo(KPC) </th>
            <th>Cantidad Contrata Periodo(MBT) </th>
            <th>Cantidad Contrata Periodo(M3) </th>
            <th>Cantidad Nominada Propia(MBTU) </th>
            <th>Cantidad Nominada Terceros(MBTU) </th>
            <th>Cargo Fijo Calculado </th>
            <th>Cargo Variable Calculado </th>
            <th>Cargo AO&M Calculado </th>
            <th>Cuota de Fomento base USD </th>
            <th>Cuota de Fomento base Pesos </th>
            <th>Impuesto tranp USD </th>
            <th>Impuesto tranp pesos </th>
            <th>TRM </th>
            <th>Poder Calorifico </th>
          </tr>
        </thead>
        <tbody>
          <Fragment>
            {lista.map((dato, index) => {
              return (
                <Fragment>
                  <tr key={dato.ptsaIderegistro.ptsaIderegistro}>
                    <td>
                      <button
                        className="btn-primary btn-buscador input-group-btn"
                        title='Eliminar'
                        disabled={desabilitado}
                        onClick={() => {
                          this.eliminarPunto(index)
                        }}><i className='fa fa-fw fa-minus'></i>
                      </button>
                    </td>
                    <td>{getProp(dato.ptsaIderegistro, 'ptsaNombre')}</td>
                    <td>{getProp(dato.detalle, 'dcpsCancntkpc').toFixed(JSON.parse(dato.detalle.cancntkpc.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato.detalle, 'dcpsCancntmbtu').toFixed(JSON.parse(dato.detalle.cancntmbtu.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato.detalle, 'dcpsCancntmc').toFixed(JSON.parse(dato.detalle.cancntmc.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato.detalle, 'dcpsCannompropia').toFixed(JSON.parse(dato.detalle.cannompropia.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato.detalle, 'dcpsCantnomterceros').toFixed(JSON.parse(dato.detalle.cantnomterceros.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato, 'rfpsCarfijcalculado').toFixed(JSON.parse(dato.carfijcalculado.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato, 'rfpsCarvarcalculado').toFixed(JSON.parse(dato.carvarcalculado.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato, 'rfpsCaraoimcalculado').toFixed(JSON.parse(dato.caraoimcalculado.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato, 'rfpsCuofombusd').toFixed(JSON.parse(dato.cuofombusd.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato, 'rfpsCuofombpesos').toFixed(JSON.parse(dato.cuofombpesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato, 'rfpsImptranpusd').toFixed(JSON.parse(dato.imptranpusd.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato, 'rfpsImptranpesos').toFixed(JSON.parse(dato.imptranpesos.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                    <td>{getProp(dato.detalle, 'dcpsTrm', '')}</td>
                    <td>{getProp(dato.detalle, 'dcpsPodercal', '')}</td>
                  </tr>
                </Fragment>
              );
            })
            }
            <tr className='bg-success'>
              <td className='text-center th-sub'>{'///'}</td>
              <td className='text-center th-sub'>Totales</td>
              <td className='text-center th-sub'>{totales.dcpsCancntkpc}</td>
              <td className='text-center th-sub'>{totales.dcpsCancntmbtu}</td>
              <td className='text-center th-sub'>{totales.dcpsCancntmc}</td>
              <td className='text-center th-sub'>{totales.dcpsCannompropia}</td>
              <td className='text-center th-sub'>{totales.dcpsCantnomterceros}</td>
              <td className='text-center th-sub'>{totales.rfpsCarfijcalculado}</td>
              <td className='text-center th-sub'>{totales.rfpsCarvarcalculado}</td>
              <td className='text-center th-sub'>{totales.rfpsCaraoimcalculado}</td>
              <td className='text-center th-sub'>{totales.rfpsCuofombusd}</td>
              <td className='text-center th-sub'>{totales.rfpsCuofombpesos}</td>
              <td className='text-center th-sub'>{totales.rfpsImptranpusd}</td>
              <td className='text-center th-sub'>{totales.rfpsImptranpesos}</td>
              <td className='text-center th-sub'>{'///'}</td>
              <td className='text-center th-sub'>{'///'}</td>
            </tr>
          </Fragment>
        </tbody>
      </Table>
    );
  };

  /**
   * @method
   * Método encargado de mostrar la tabla con los puntos de consumo propios
   * @returns {Array}
   */
  renderTablaPuntosPropios = () => {
    const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', [])];
    if (!Util.validarArreglo(lista)) {
      return;
    }
    const totales = this.props.obtenerTotalesPuntosConsumo(lista);
    return (
      <Table responsive striped bordered hover>
        <thead className='bg-dark text-white'>
          <tr>
            <th colSpan='19'>Puntos de Consumo Propios</th>
          </tr>
          <tr>
            <th>Puntos de Consumo </th>
            <th>Lectura del Periodo(MBTU) </th>
            <th>Porcentaje del Punto </th>
            <th>Cantidad Nominada(MBTU) </th>
            <th>Cantidad Nominada(KPC) </th>
            <th>Cantidad Nominada(M3) </th>
            <th>Porcentaje Par Punto </th>
            <th>Cargo Fijo Punto </th>
            <th>Cargo Variable Punto </th>
            <th>Cargo AO&M Punto </th>
            <th>Impto tte Punto </th>
            <th>Cuota de Fomento Punto </th>
            <th>Cargo Fijo(USD/kpc/mes) </th>
            <th>Cargo Variable(USD/kpc) </th>
            <th>Cargo AO&M ($/kpc/mes) </th>
            <th>Sub Total </th>
            <th>Total Costo Transporte </th>
            <th>Cop/kpc </th>
            <th>Cop/m3 </th>
          </tr>
        </thead>
        <tbody>
          <Fragment>
            {lista.map((dato, index) => {
              return (
                <Fragment>
                  {dato.detallesPuntoConsumo.map(detalle => {
                    return (
                      <tr key={getProp(detalle.ptcIderegistro, 'ptcoNombre', '')}>
                        <td>{getProp(detalle.ptcIderegistro, 'ptcoNombre', '')}</td>
                        <td>{getProp(detalle, 'dcpcLectura').toFixed(JSON.parse(detalle.lectura.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcPorpunto').toFixed(JSON.parse(detalle.porpunto.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCntnommbtu').toFixed(JSON.parse(detalle.cntnommbtu.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCntnomkpc').toFixed(JSON.parse(detalle.cntnomkpc.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCntnommc').toFixed(JSON.parse(detalle.cntnommc.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcPorparpto').toFixed(JSON.parse(detalle.porparpto.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCarfijpto').toFixed(JSON.parse(detalle.carfijpto.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCarvarpto').toFixed(JSON.parse(detalle.carvarpto.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCaraoimpto').toFixed(JSON.parse(detalle.caraoimpto.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcImpttepto').toFixed(JSON.parse(detalle.impttepto.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCuofompto').toFixed(JSON.parse(detalle.cuofompto.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCarfijdmes').toFixed(JSON.parse(detalle.carfijdmes.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCarvarusdkpc').toFixed(JSON.parse(detalle.carvarusdkpc.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCaraoimkpcmes').toFixed(JSON.parse(detalle.caraoimkpcmes.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcSubtotal').toFixed(JSON.parse(detalle.subtotal.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcTotcostrans').toFixed(JSON.parse(detalle.totcostrans.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCosttekpc').toFixed(JSON.parse(detalle.costtekpc.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                        <td>{getProp(detalle, 'dcpcCosttemc').toFixed(JSON.parse(detalle.costtemc.uniUnidad.uniPropiedad).decimalesVisualiza)}</td>
                      </tr>
                    )
                  })
                  }
                </Fragment>
              );
            })
            }
            <tr className='bg-success'>
              <td className='text-center th-sub'>Totales</td>
              <td className='text-center th-sub'>{totales.dcpcLectura}</td>
              <td className='text-center th-sub'>{totales.dcpcPorpunto}</td>
              <td className='text-center th-sub'>{totales.dcpcCntnommbtu}</td>
              <td className='text-center th-sub'>{totales.dcpcCntnomkpc}</td>
              <td className='text-center th-sub'>{totales.dcpcCntnommc}</td>
              <td className='text-center th-sub'>{totales.dcpcPorparpto}</td>
              <td className='text-center th-sub'>{totales.dcpcCarfijpto}</td>
              <td className='text-center th-sub'>{totales.dcpcCarvarpto}</td>
              <td className='text-center th-sub'>{totales.dcpcCaraoimpto}</td>
              <td className='text-center th-sub'>{totales.dcpcImpttepto}</td>
              <td className='text-center th-sub'>{totales.dcpcCuofompto}</td>
              <td className='text-center th-sub'>{totales.dcpcCarfijdmes}</td>
              <td className='text-center th-sub'>{totales.dcpcCarvarusdkpc}</td>
              <td className='text-center th-sub'>{totales.dcpcCaraoimkpcmes}</td>
              <td className='text-center th-sub'>{totales.dcpcSubtotal}</td>
              <td className='text-center th-sub'>{totales.dcpcTotcostrans}</td>
              <td className='text-center th-sub'>{totales.dcpcCosttekpc}</td>
              <td className='text-center th-sub'>{totales.dcpcCosttemc}</td>
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
    const index = lista.findIndex(p => p.ptsaIderegistro.ptsaIderegistro == idPunto);
    return index >= 0;
  };

  /**
   * @method
   * Método encargado de validar los datos necesarios para realizar el calculo
   * @returns {Object}
   */
  validarDatosCalcular = () => {
    const { dispercion, cabecera } = this.props;
    if (cabecera.periodo == '') {
      toast.error('Debe seleccionar un periodo');
      return { respuesta: false };
    }

    if (cabecera.contrato == null) {
      toast.error('Debe seleccionar un contrato');
      return { respuesta: false };
    }

    if (getProp(dispercion, 'puntoSalida', '') == '' || getProp(dispercion, 'puntoSalida', '') == '-1' || getProp(dispercion, 'puntoSalida', '') == -1) {
      toast.error('Debe seleccionar un punto de salida');
      return { respuesta: false };
    }

    return { respuesta: true };
  };

  /**
   * @method
   * Método encargado de agregar el punto de salida seleccionado a la lista
   * @returns {bool}
   */
  agregarSeleccionado = () => {
    const { cabecera, dispercion, facturas } = this.props;
    const validar = this.validarDatosCalcular();
    if (!validar.respuesta) {
      return;
    }
    if (this.validarPuntoRepetido(getProp(dispercion, 'puntoSalida', ''))) {
      toast.error('El punto que esta intentado agregar ya se encuentra en la lista');
      return;
    }
    const contrato = { ...limpiarJson(cabecera.contrato) };
    const puntoSalida = { ...limpiarJson(getProp(this.props, 'listas.listaPuntosDispercion', []).find(p => p.ptsaIderegistro.ptsaIderegistro == dispercion.puntoSalida)) };
    const objetoEnviar = {
      periodo: cabecera.periodo,
      contrato: contrato,
      puntoSalida: puntoSalida.ptsaIderegistro,
      trmPeriodo: getProp(facturas, 'trmPeriodo', ''),
      idRevision: getProp(dispercion, 'idFactura', '')
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_REVISION_FACTURAS.DISPERCION.CALCULAR, objetoEnviar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const data = { ...respuesta.data.datos, ...puntoSalida, ...respuesta.data.datos.detallesPuntoSalida[0],punto:puntoSalida.ptsaIderegistro.ptsaNombre };
          data.detalle = { ...data.detallesPuntoSalida[0] };
          const lista = [...getProp(this.props, 'listas.listaPuntosAgregados', []), data];
          this.props.actualizarListasRevision({ listaPuntosAgregados: lista });
        }
      });
  };

  /**
   * @method
   * Método encargado de mostrar el selector para puntos de salida
   * @returns {Object}
   */
  renderSelector = () => {
    let desabilitado = false;
    if (getProp(this.props, 'dispercion.idRevision', '') != '') {
      desabilitado = true;
    }
    return (
      <div className="grupo input-group mb-3 mt-1">
        <Combo
          opciones={getProp(this.props, 'listas.listaPuntosDispercion', [])}
          propTexto='ptsaIderegistro.ptsaNombre'
          propValor='ptsaIderegistro.ptsaIderegistro'
          label='Punto de Salida:'
          value={getProp(this.props, 'dispercion.puntoSalida', '')}
          onChange={this.controlarCambio}
          cols={4}
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
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        {this.renderSelector()}
        {this.renderTablaPuntosAgregados()}
        {this.renderTablaPuntosPropios()}
      </Fragment>
    );
  };
}

DispercionConsumos.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(DispercionConsumos);

export { VistaRedux as RDispercionConsumos };
