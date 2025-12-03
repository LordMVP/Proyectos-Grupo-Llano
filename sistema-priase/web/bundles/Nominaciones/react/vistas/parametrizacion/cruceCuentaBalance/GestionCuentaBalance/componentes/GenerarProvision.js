import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, VentanaModal, Util, Fecha, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../../global/rutas_api';
import { formatearArray } from '../../../../../global/util_nominaciones';
import { ESTADOS_CRUCE } from '../../../../../global/constantes';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { get as getProp } from 'object-path';
import '../GestionCuentaBalance.scss';
import { toast } from 'react-toastify';
import { RConsultarProvision } from './ConsultarProvision'


const listaImpuesto = [
  { texto: 'No Aplica', id: 'NA' },
  { texto: 'TRM Trimestre', id: 'TT' },
  { texto: 'TRM Ultimo Día del Periodo', id: 'TP' },
];

class GenerarProvision extends Component {

  state = {
    // Datos de la entidad
    tarifaUSD: '',
    tarifaKPC: '',
    trm: '',
    puntoNegativo: '',
    porcentajeFomento: '',
    porcentajeImpuesto: '',
    trmPeriodo: '',
    trmImpuesto: '',
    trmTrimestre: '',
    periodo: this.props.periodo,
    idProvision: null,
    //Listas
    listaPuntosNegativos: formatearArray(this.props.listaPuntosNegativos),
    //Estados
    estadoProvision: '',
    modalConsultar: false,
  };

  /**
   * @method
   * Consulta las listas necesarias para usar la interfaz...
   */
  consultarValoresTRM = () => {
    const peticiones = [
      axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_TRM, { periodo: this.props.periodo }),
      axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_TRM_TRIMESTRE, { periodo: this.props.periodo }),
    ];
    axios.all(peticiones)
      .then(axios.spread((trm, trmTrimestre) => {
        const datosAplicacion = {
          trmPeriodo: '',
          trmTrimestre: ''
        };
        if (trm.data.codigo > 0) {
          datosAplicacion.trmPeriodo = trm.data.datos;
        }
        if (trmTrimestre.data.codigo > 0) {
          datosAplicacion.trmTrimestre = trmTrimestre.data.datos;
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * @method
   * Método encargado de verificar si hay una provisión en estado guardado
   * @returns {Boolean}
   */
  consultarPuntosDisponibles = () => {
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_PUNTOS_SALIDA_PROVISION, { ccbIderegistro: this.props.idCruce })
      .then(respuesta => {
        let lista = [];
        if (respuesta.data.codigo > 0) {
          lista = respuesta.data.datos.map(data => {
            return {
              ...data,
              puntoSalida: data.ptsaIderegistro
            };
          });
        }
        this.setState({ listaPuntosNegativos: formatearArray(lista) }, this.consultarProvisionGuardada);
      });
  }

  /**
   * @method
   * Método encargado de consultar la trm trimestre
   * @returns {Boolean}
   */
  consultarTrmTrimestre = () => {
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_TRM_TRIMESTRE, { periodo: this.props.periodo })
      .then(respuesta => {
        this.setState({ trmTrimestre: respuesta.data.datos });
      });
  }

  /**
   * @method
   * Método encargado de verificar si hay una provisión en estado guardado
   * @returns {Boolean}
   */
  consultarProvisionGuardada = () => {
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_PROVISION, { ccbIderegistro: this.props.idCruce })
      .then(respuesta => {
        let contador = 0;
        if (respuesta.data.codigo == 0) {
          this.consultarValoresTRM();
          return;
        }
        for (let index = 0; index < respuesta.data.datos.length; index++) {
          const provision = respuesta.data.datos[index];
          if (provision.pcvEstado == ESTADOS_CRUCE.PENDIENTE) {
            this.procesarData(provision);
            contador++;
          }
        }
        if (contador == 0) {
          this.consultarValoresTRM();
        }
      });
  }

  /**
   * @method
   * Método encargado de procesar los datos de provisión
   * @param {Object} datos Datos consultados de la provisión
   */
  procesarData = (datos, procesarPuntos = false) => {
    const { listaPuntosNegativos } = this.state;
    let lista = [];
    if (procesarPuntos == true && datos.pcvEstado != 'P') {
      lista = datos.listaDetalles.map(detalle => {
        return {
          ...detalle,
          puntoSalida: detalle.dccbIderegistro.ptsaIderegistro,
          seleccionadoProv: true
        };
      });
    } else {
      lista = listaPuntosNegativos.map(punto => {
        for (let index = 0; index < datos.listaDetalles.length; index++) {
          const detalle = datos.listaDetalles[index];
          if (punto.ptsaIderegistro.ptsaIderegistro == detalle.dccbIderegistro.ptsaIderegistro.ptsaIderegistro) {
            punto.aplica = true;
            for (const key in detalle) {
              if (detalle.hasOwnProperty(key)) {
                const element = detalle[key];
                if (key == 'dccbIderegistro') {
                  continue;
                }
                punto[key] = element;
              }
            }
          }
        }
        return {
          ...punto,
          puntoSalida: punto.ptsaIderegistro,
          seleccionadoProv: punto.aplica == true ? true : false
        };
      });
    }

    const valorComboTrm = datos.pvcTrmimpuesto == 0 ? 'NA' : datos.pvcTrmimpuesto == datos.pvcVlrtr ? 'TP' : 'TT';
    if (valorComboTrm == 'TT') {
      this.consultarTrmTrimestre();
    }
    this.setState({
      estadoProvision: datos.pcvEstado,
      tarifaUSD: datos.pvcTarifausd,
      tarifaKPC: datos.pvcTarifapesos,
      porcentajeFomento: datos.pvcPorfomento,
      porcentajeImpuesto: datos.pvcPorimpuesto,
      trmImpuesto: datos.pvcTrmimpuesto,
      trmPeriodo: datos.pvcVlrtrm,
      trm: valorComboTrm,
      listaPuntosNegativos: lista,
      idProvision: datos.pvcIderegistro
    });
  }

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    this.consultarPuntosDisponibles();

  };

  /**
   * Método encargado de limpiar el formulario al momento de cambiar de interfaz
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  };

  /**
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    let botones = [];
    if (this.state.estadoProvision == ESTADOS_CRUCE.PENDIENTE || this.state.estadoProvision == '') {
      botones.push({ texto: 'Guardar', callback: this.guardarEntidad });
    }
    if (this.state.estadoProvision == ESTADOS_CRUCE.PENDIENTE) {
      botones.push({ texto: 'Aprobar', callback: () => { this.cambiarEstado(ESTADOS_CRUCE.APROBADO) } });
      botones.push({ texto: 'Rechazar', callback: () => { this.cambiarEstado(ESTADOS_CRUCE.RECHAZADO) } });
    }
    if (this.state.estadoProvision == '' || this.state.estadoProvision == ESTADOS_CRUCE.RECHAZADO || this.state.estadoProvision == ESTADOS_CRUCE.APROBADO) {
      botones.push({ texto: 'Consultar', callback: this.consultarProvision });
    }
    botones.push({ texto: 'Cancelar', callback: this.actualizarProvision });
    return botones;
  };

  /**
   * @method
   * Método encargado de abrir la ventana modal de consulta de provisió88n
   */
  consultarProvision = () => {
    this.setState({ modalConsultar: true });
  };

  /**
   * @method
   * Método encargado de cambiar de estado a la provisión
   * @param {String} estado Estado al cual se cambiara la provision
   */
  cambiarEstado = (estado) => {
    const { idProvision } = this.state;
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CAMBIAR_ESTADO, { estado: estado, idProvision: idProvision })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      })
  };

  /**
   * @method
   * Método encargado de cambiar el estado del formulario
   */
  actualizarProvision = () => {
    this.props.actualizarProvision({ provision: false });
  }

  /**
   * @method
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      puntoNegativo: '-1',
      tarifaKPC: '',
      tarifaUSD: '',
      trm: '-1',
      provision: false,
      trmPeriodo: '',
      trmTrimestre: '',
      porcentajeFomento: '',
      porcentajeImpuesto: '',
      trmImpuesto: '',
      listaPuntosNegativos: [],
      idProvision: null,
      modalConsultar: false,
      estadoProvision: ''
    });
  };

  /**
   * @method
   * Método encargado de generar un objeto para guardar el cruce o cruces
   * @returns {Object}
   */
  obtenerObjetoGuardar = () => {
    const { listaPuntosNegativos, idProvision, porcentajeFomento, porcentajeImpuesto, trmImpuesto, trmPeriodo, tarifaKPC, tarifaUSD } = this.state;
    const totales = listaPuntosNegativos[0];
    const objetoGuardar = {
      pvcIderegistro: idProvision,
      ccbIderegistro: this.props.idCruce,
      pvcTarifausd: tarifaUSD,
      pvcTarifapesos: tarifaKPC,
      pvcVlrtrm: trmPeriodo,
      pvcTrmimpuesto: trmImpuesto,
      pvcPorfomento: porcentajeFomento,
      pvcPorimpuesto: porcentajeImpuesto,
      pvcCargousd: totales.totalPvcCargousd,
      pvcCargopesos: totales.totalPvcCargopesos,
      pvcCuofomusd: totales.totalPvcCuofomusd,
      pvcCuofomusdcop: totales.totalPvcCuofomusdcop,
      pvcCuofompesos: totales.totalPvcCuofompesos,
      pvcImptteusd: totales.totalPvcImptteusdu,
      pvcImptteusdcop: totales.totalPvcImptteusdcop,
      pvcImpttepesos: totales.totalPvcImpttepesos,
      pvcSubservicio: totales.totalPvcSubservicio,
      pvcTotservicio: totales.totalPvcTotservicio,
    };
    objetoGuardar.listaDetalles = listaPuntosNegativos.filter(p => p.seleccionadoProv).map(punto => {
      return {
        dccbIderegistro: {
          dccbIderegistro: punto.dccbIderegistro
        },
        cantidadKpc: punto.cantidadKpc,
        cantidadMbtu: punto.cantidadMbtu,
        pvcCargopesos: punto.pvcCargopesos,
        pvcCargousd: punto.pvcCargousd,
        pvcCuofompesos: punto.pvcCuofompesos,
        pvcCuofomusd: punto.pvcCuofomusd,
        pvcCuofomusdcop: punto.pvcCuofomusdcop,
        pvcImpttepesos: punto.pvcImpttepesos,
        pvcImptteusd: punto.pvcImptteusd,
        pvcImptteusdcop: punto.pvcImptteusdcop,
        pvcSubservicio: punto.pvcSubservicio,
        pvcTotservicio: punto.pvcTotservicio,
      }
    });
    return objetoGuardar;
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const { listaPuntosNegativos } = this.state;
    const validacion = this.validarCampos();
    if (!validacion.respuesta) {
      toast.error(validacion.mensaje.mensaje);
      return false;
    }

    if (!Util.validarArreglo(listaPuntosNegativos.filter(p => p.seleccionadoProv))) {
      toast.error('Debe agregar al menos un punto negativo');
      return false;
    }

    const entidadGuardar = this.obtenerObjetoGuardar();
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.GUARDAR_PROVISION, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const control = evento.target;
    if (control.name == 'trm' && control.value != '-1') {
      change.trmImpuesto = control.value == 'NA' ? 0 : control.value == 'TT' ? this.state.trmTrimestre : this.state.trmPeriodo;
    }
    if (control.name == 'trm' && control.value == '-1') {
      change.trmImpuesto = '';
    }
    if (control.name != 'puntoNegativo') {
      change.listaPuntosNegativos = this.state.listaPuntosNegativos.map(punto => {
        punto.seleccionadoProv = false;
        return punto;
      });
      change.estadoProvision = '';
    }
    change[control.name] = control.value;
    this.setState(change);
  };

  /**
   * @method
   * Método encargado de quitar los puntos de salida negativos
   * @param {Event} identificador Identificador del punto de salida
   */
  cambiarEstadoPunto = (identificador) => {
    const lista = [...this.state.listaPuntosNegativos];
    const index = lista.findIndex(p => p.puntoSalida.ptsaIderegistro == identificador);
    const punto = { ...lista[index] };
    punto.seleccionadoProv = false;
    lista[index] = { ...punto };
    this.setState({ listaPuntosNegativos: lista });
  }

  /**
   * Método encargado de obtener el total dependiendo del tipo
   * @param {Array} lista Lista de puntos de consumo
   * @param {String} tipo Identificador de el calculo
   */
  obtenerTotal = (lista, tipo) => {
    let total = 0;
    switch (tipo) {
      case 'cantidadMbtu':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'cantidadMbtu', 0));
        }
        lista[0].totalCantidadMbtu = total;
        break;
      case 'cantidadKpc':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'cantidadKpc', 0));
        }
        lista[0].totalCantidadKpc = total;
        break;
      case 'pvcCargousd':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'pvcCargousd', 0));
        }
        lista[0].totalPvcCargousd = total;
        break;
      case 'pvcCargopesos':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'pvcCargopesos', 0));
        }
        lista[0].totalPvcCargopesos = total;
        break;
      case 'pvcCuofomusd':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'pvcCuofomusd', 0));
        }
        lista[0].totalPvcCuofomusd = total;
        break;
      case 'pvcCuofomusdcop':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'pvcCuofomusdcop', 0));
        }
        lista[0].totalPvcCuofomusdcop = total;
        break;
      case 'pvcCuofompesos':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'pvcCuofompesos', 0));
        }
        lista[0].totalPvcCuofompesos = total;
        break;
      case 'pvcImptteusd':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'pvcImptteusd', 0));
        }
        lista[0].totalPvcImptteusdu = total;
        break;
      case 'pvcImptteusdcop':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'pvcImptteusdcop', 0));
        }
        lista[0].totalPvcImptteusdcop = total;
        break;
      case 'pvcImpttepesos':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'pvcImpttepesos', 0));
        }
        lista[0].totalPvcImpttepesos = total;
        break;
      case 'pvcSubservicio':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'pvcSubservicio', 0));
        }
        lista[0].totalPvcSubservicio = total;
        break;
      case 'pvcTotservicio':
        for (let index = 0; index < lista.length; index++) {
          const element = lista[index];
          total += parseFloat(getProp(element, 'pvcTotservicio', 0));
        }
        lista[0].totalPvcTotservicio = total;
        break;
      default:
        break;
    }
    return total;
  };

  /**
   * Método encargado de mostrar la tabla con los tramos y puntos negativos agregados
   * @returns {Object}
   */
  renderTablaNegativos = () => {
    const { listaPuntosNegativos } = this.state
    let desabilitado = false;
    if (this.state.estadoProvision == ESTADOS_CRUCE.RECHAZADO || this.state.estadoProvision == ESTADOS_CRUCE.APROBADO) {
      desabilitado = true;
    }
    let lista = listaPuntosNegativos.filter(p => p.seleccionadoProv == true);
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha Agregado ningun punto</div>);
    }
    return (
      <Fragment>
        <div className='table-responsive'>
          <table className='table table-bordered mt-10 text-center'>
            <thead className='bg-dark text-white'>
              <tr>
                <th>Punto de Salida</th>
                <th>Cant. MBTU</th>
                <th>Cant. KPC</th>
                <th>Cargo USD</th>
                <th>Cargo Pesos</th>
                <th>Cuota Fomento USD</th>
                <th>Cuo Fom USD Pesos</th>
                <th>Cuota Fomento Pesos</th>
                <th>Impuesto tte USD</th>
                <th>Imp. tte USD Pesos</th>
                <th>Impuesto tte Pesos</th>
                <th>Sub Total Servicio</th>
                <th>Total Servicio</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              <Fragment>
                {
                  lista.map((dato, index) => {
                    return (
                      <tr key={dato.puntoSalida.ptsaIderegistro}>
                        <td>{getProp(dato, 'puntoSalida.ptsaNombre', '')}</td>
                        <td>{getProp(dato, 'cantidadMbtu', '')}</td>
                        <td>{getProp(dato, 'cantidadKpc', '')}</td>
                        <td>{getProp(dato, 'pvcCargousd', '')}</td>
                        <td>{getProp(dato, 'pvcCargopesos', '')}</td>
                        <td>{getProp(dato, 'pvcCuofomusd', '')}</td>
                        <td>{getProp(dato, 'pvcCuofomusdcop', '')}</td>
                        <td>{getProp(dato, 'pvcCuofompesos', '')}</td>
                        <td>{getProp(dato, 'pvcImptteusd', '')}</td>
                        <td>{getProp(dato, 'pvcImptteusdcop', '')}</td>
                        <td>{getProp(dato, 'pvcImpttepesos', '')}</td>
                        <td>{getProp(dato, 'pvcSubservicio', '')}</td>
                        <td>{getProp(dato, 'pvcTotservicio', '')}</td>
                        <td>
                          <button className='btn-primary btn-buscador input-group-text' disabled={desabilitado} onClick={() => {
                            this.cambiarEstadoPunto(dato.puntoSalida.ptsaIderegistro)
                          }}><i className="fa fa-fw fa-minus"></i></button>
                        </td>
                      </tr>
                    );
                  })
                }
                <tr className='bg-success'>
                  <td className='text-center th-sub'>Total Contratado</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'cantidadMbtu')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'cantidadKpc')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'pvcCargousd')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'pvcCargopesos')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'pvcCuofomusd')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'pvcCuofomusdcop')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'pvcCuofompesos')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'pvcImptteusd')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'pvcImptteusdcop')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'pvcImpttepesos')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'pvcSubservicio')}</td>
                  <td className='text-center th-sub'>{this.obtenerTotal(lista, 'pvcTotservicio')}</td>
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
   * Método encargado de hacer las validaciones para agregar puntos negativos
   * @returns {Object}
   */
  validarPuntosNegativos = () => {
    const { puntoNegativo, listaPuntosNegativos } = this.state;
    if (puntoNegativo == '' || puntoNegativo == '-1') {
      return { respuesta: false, mensaje: 'Debe selecionar un punto negativo' };
    }
    const index = listaPuntosNegativos.findIndex(p => (p.puntoSalida.ptsaIderegistro == puntoNegativo && p.seleccionadoProv));
    if (index >= 0) {
      return { respuesta: false, mensaje: 'El punto seleccionado ya se encuentra en la lista' };
    }
    return { respuesta: true };
  }

  /**
   * @method
   * Método encargado de hacer las validaciones para agregar puntos negativos
   * @returns {Object}
   */
  validarCampos = () => {
    const { tarifaKPC, tarifaUSD, trm, porcentajeFomento, porcentajeImpuesto } = this.state;
    const fomento = parseInt(porcentajeFomento);
    const impuesto = parseInt(porcentajeImpuesto);
    if (tarifaKPC == '') {
      return { respuesta: false, mensaje: 'Debe ingresar la tarifa KPC' };
    }
    if (tarifaUSD == '') {
      return { respuesta: false, mensaje: 'Debe ingresar la tarifa USD' };
    }
    if (trm == '' || trm == '-1') {
      return { respuesta: false, mensaje: 'Debe selecionar la trm a aplicar' };
    }

    if (porcentajeFomento == '') {
      return { respuesta: false, mensaje: 'Debe ingresar el porcentaje de fomento' };
    }

    if (porcentajeImpuesto == '') {
      return { respuesta: false, mensaje: 'Debe ingresar el porcentaje de impuesto' };
    }

    if (fomento > 1 || fomento < 0) {
      return { respuesta: false, mensaje: 'El porcentaje de fomento debe estar entre 0 y 1' };
    }

    if (impuesto > 1 || impuesto < 0) {
      return { respuesta: false, mensaje: 'El porcentaje de impuesto debe estar entre 0 y 1' };
    }

    return { respuesta: true };
  }

  /**
   * @method
   * Método encargado de obtener el objeto para calcular el punto negativo
   * @returns {Object}
   */
  obtenerObjetoCalcular = () => {
    const { tarifaKPC, tarifaUSD, trmImpuesto, trmPeriodo, trmTrimestre, puntoNegativo, porcentajeFomento, porcentajeImpuesto, listaPuntosNegativos } = this.state;
    const detalle = listaPuntosNegativos.find(p => p.puntoSalida.ptsaIderegistro == puntoNegativo);
    let procesarDetalle = JSON.stringify(detalle);
    procesarDetalle = procesarDetalle.replace(/\[\]/g, 'null');
    procesarDetalle = procesarDetalle.replace(/\{\}/g, 'null');
    procesarDetalle = JSON.parse(procesarDetalle);
    const objeto = {
      tarifaUsdKpc: tarifaUSD,
      tarifaPesosKpc: tarifaKPC,
      trmUltimoDiaPeriodo: trmPeriodo,
      trmTrimestre: trmTrimestre,
      trmImpuesto: trmImpuesto,
      porcentajeImpuesto: porcentajeImpuesto,
      porcentajeFomento: porcentajeFomento,
      periodo: this.props.periodo,
      detalleCruce: procesarDetalle
    };
    return objeto;
  };

  /**
   * @method
   * Método encargado de agregar el punto negativo a la lista
   * @returns {Boolean}
   */
  agregarPuntoNegativo = () => {
    const { puntoNegativo } = this.state;
    const lista = [...this.state.listaPuntosNegativos];
    const validarPuntos = this.validarPuntosNegativos();
    const validarCampos = this.validarCampos();
    if (!validarPuntos.respuesta) {
      toast.error(validarPuntos.mensaje);
      return;
    }
    if (!validarCampos.respuesta) {
      toast.error(validarCampos.mensaje);
      return;
    }
    const index = lista.findIndex(p => p.puntoSalida.ptsaIderegistro == puntoNegativo);
    const objetoAgregar = this.obtenerObjetoCalcular();
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CALCULAR_PUNTO_PROVISION, objetoAgregar)
      .then(respuesta => {
        const data = respuesta.data.datos;
        if (respuesta.data.codigo > 0) {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const puntoCalculo = respuesta.data.datos[key];
              lista[index][key] = puntoCalculo;
            }
          }
          lista[index].seleccionadoProv = true;
          this.setState({ listaPuntosNegativos: [...lista], estadoProvision: '' });
        }
      });
  };

  /**
   * Método encargado de mostrar el selector para medidores o puntos de salida
   * @returns {Object}
   */
  renderSelector = () => {
    let desabilitado = false;
    if (this.state.estadoProvision == ESTADOS_CRUCE.RECHAZADO || this.state.estadoProvision == ESTADOS_CRUCE.APROBADO) {
      desabilitado = true;
    }
    return (
      <div className="grupo input-group mb-3 mt-5">
        <Combo
          opciones={this.state.listaPuntosNegativos}
          propTexto='puntoSalida.ptsaNombre'
          propValor='puntoSalida.ptsaIderegistro'
          label='Puntos de Salida Negativos:'
          name='puntoNegativo'
          value={this.state.puntoNegativo}
          onChange={this.controlarCambio}
          extra={{ disabled: desabilitado, readOnly: desabilitado }}
        />
        <button
          className="btnSuma"
          title='Agregar'
          disabled={desabilitado}
          onClick={() => this.agregarPuntoNegativo()}><i className='fa fa-fw fa-plus'></i></button>
      </div>
    );
  }

  /**
   * @method
   * Método encargado de cerrar la ventana del boton de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      modalConsultar: false
    });
  };

  /**
   * @method
   * Método encargado de cargar los datos de la provision seleccionada
   * @param {Object} entidad Provision Seleccionada
   */
  seleccionarProvision = (entidad) => {
    axios.post(RUTAS_API.CRUCE_CUENTA_BALANCE.CONSULTAR_PUNTOS_SALIDA_PROVISION, { ccbIderegistro: this.props.idCruce })
      .then(respuesta => {
        let lista = [];
        if (respuesta.data.codigo > 0) {
          lista = respuesta.data.datos.map(data => {
            return {
              ...data,
              puntoSalida: data.ptsaIderegistro
            };
          });
        }
        this.setState({ listaPuntosNegativos: formatearArray(lista), modalConsultar: false }, () => { this.procesarData(entidad, true) });
      });

  }

  /**
   * @method
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    let desabilitado = false;
    if (this.state.estadoProvision == ESTADOS_CRUCE.RECHAZADO || this.state.estadoProvision == ESTADOS_CRUCE.APROBADO) {
      desabilitado = true;
    }
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />
        <div className='conf-general row mt-5'>
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Tarifa USD/KPC:'
            cols={4}
            value={this.state.tarifaUSD}
            onChange={this.controlarCambio}
            name='tarifaUSD'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Tarifa $/kpc:'
            cols={4}
            value={this.state.tarifaKPC}
            onChange={this.controlarCambio}
            name='tarifaKPC'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <Combo
            opciones={listaImpuesto}
            propTexto='texto'
            propValor='id'
            label='TRM Impuesto:'
            name='trm'
            cols={4}
            value={this.state.trm}
            onChange={this.controlarCambio}
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <Input
            label='TRM Ult Día Periodo:'
            value={this.state.trmPeriodo}
            name='trmPeriodo'
            extra={{ disabled: true, readOnly: true }}
          />
          <Input
            label='TRM Trimestre:'
            value={this.state.trmTrimestre}
            name='trmTrimestre'
            extra={{ disabled: true, readOnly: true }}
          />
          <Input
            label='TRM Impuesto:'
            value={this.state.trmImpuesto}
            name='trmImpuesto'
            extra={{ disabled: true, readOnly: true }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Porcentaje Impuesto (0-1):'
            cols={3}
            value={this.state.porcentajeImpuesto}
            onChange={this.controlarCambio}
            name='porcentajeImpuesto'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          <TextoNumerico
            aceptaDecimales={true}
            aceptaNegativos={false}
            label='Porcentaje Fomento (0-1):'
            cols={3}
            value={this.state.porcentajeFomento}
            onChange={this.controlarCambio}
            name='porcentajeFomento'
            extra={{ disabled: desabilitado, readOnly: desabilitado }}
          />
          {
            this.renderSelector()
          }
          {this.state.listaPuntosNegativos.filter(p => p.seleccionadoProv).length > 0 &&
            this.renderTablaNegativos()
          }
        </div>
        <VentanaModal
          mostrar={this.state.modalConsultar}
          titulo='Provisiones'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultarProvision
            esModal
            idCruce={this.props.idCruce}
            seleccionarEntidad={this.seleccionarProvision}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

GenerarProvision.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func,
  periodo: PropTypes.string,
  idCruce: PropTypes.number,
  listaPuntosNegativos: PropTypes.array,
  actualizarProvision: PropTypes.func
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GenerarProvision);

export { VistaRedux as RGenerarProvision };
