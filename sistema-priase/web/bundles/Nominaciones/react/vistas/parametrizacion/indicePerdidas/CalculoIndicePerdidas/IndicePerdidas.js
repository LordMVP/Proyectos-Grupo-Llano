import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { get as getProp } from 'object-path';
import { Botonera, Util, Fecha } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { toast } from 'react-toastify';
import './IndicePerdidas.scss';
import { ESTADOS_INDICE_PERDIDAS } from '../../../../global/constantes';
import { formatearArray } from '../../../../global/util_nominaciones';

const VISTAS = [
  { id: 0, titulo: 'Puntos de Salida', componente: 'obtenerPuntosSalida' },
  { id: 1, titulo: 'Puntos de Consumo no Regulado', componente: 'obtenerPuntosNoRegulado' },
  { id: 2, titulo: 'Puntos de Consumo Regulado', componente: 'obtenerPuntosRegulados' },
  { id: 3, titulo: 'Otros Consumos', componente: 'obtenerOtrosConsumos' },
  { id: 4, titulo: 'Índice de Pérdidas Puntos', componente: 'obtenerIndicePerdidasPuntos' },
  { id: 5, titulo: 'Índice de Pérdidas Mercados', componente: 'obtenerIndicePerdidasMercados' },
];

class IndicePerdidas extends Component {

  state = {
    // Datos de la entidad
    periodo: '',
    listaPuntosSalida: [],
    listaPuntosNoRegulados: [],
    listaPuntosRegulados: [],
    listaOtrosConsumos: [],
    listaIndicePerdidasPuntos: [],
    listaIndicePerdidasMercados: [],
    totalData: {},
    // Estado de la aplicacion
    mostrarModalConsulta: false,
    estadoIndice: '',
    // Programa Actual
    programaActual: 0,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    this.consultarListas();
  };

  /**
   * Consulta las listas necesarias para usar la interfaz...
   */
  consultarListas = () => {
    const peticiones = [
      axios.post(RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_PUNTOS_SALIDA)
    ];
    axios.all(peticiones)
      .then(axios.spread((puntosSalida) => {
        const datosAplicacion = {
          listaPuntosSalida: [],
        };
        if (puntosSalida.data.codigo > 0) {
          datosAplicacion.listaPuntosSalida = formatearArray(puntosSalida.data.datos);
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      // Datos de la entidad
      periodo: '',
      listaPuntosNoRegulados: [],
      listaPuntosRegulados: [],
      listaOtrosConsumos: [],
      listaIndicePerdidasPuntos: [],
      listaIndicePerdidasMercados: [],
      totalData: {},
      // Estado de la aplicacion
      mostrarModalConsulta: false,
      estadoIndice: '',
      // Programa Actual
      programaActual: 0,
    }, this.consultarListas());

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
    const { estadoIndice } = this.state;
    let botones = [];
    if (estadoIndice != ESTADOS_INDICE_PERDIDAS.APROBADO) {
      botones.push({ texto: 'Generar', callback: this.generarIndice });
    }
    if (estadoIndice == ESTADOS_INDICE_PERDIDAS.GENERADO) {
      botones.push({ texto: 'Aprobar', callback: this.aprobarIndice });
    }
    botones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    return botones;
  };

  /**
   * Método encargado de aprobar el índice de pérdidas generado
   * @returns {Boolean}
   */
  aprobarIndice = () => {
    if (Object.keys(this.state.totalData).length == 0) {
      this.props.mostrarAlerta('Datos incompletos', 'Debe generar un índice de pérdidas ');
      return;
    }
    axios.post(RUTAS_API.CALCULO_INDICE_PERDIDAS.APROBAR_INDICE, { periodo: this.state.periodo })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { totalData } = this.state;
    if (Object.keys(totalData).length == 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe generar la información de indice de perdidas' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormularioGenerar = () => {
    const { periodo, totalData } = this.state;
    if (!periodo || periodo == '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un periodo' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de validar las fechas en la pestaña de puntos de salida.
   * @returns {bool}
   */
  validarTabla = () => {
    for (let index = 0; index < this.state.listaPuntosSalida.length; index++) {
      const punto = this.state.listaPuntosSalida[index];
      if (!punto.psipFecinicial || punto.psipFecinicial == '') {
        return { respuesta: false, mensaje: 'Debe seleccionar una fecha inicial para el punto: ' + (getProp(punto, 'ptsaNombre', '') != '' ? getProp(punto, 'ptsaNombre', '') : getProp(punto.puntoSalida, 'ptsaNombre', '')) };
      }
      if (!punto.psipFecinicial || punto.psipFecinicial == '') {
        return { respuesta: false, mensaje: 'Debe seleccionar una fecha fin para el punto: ' + (getProp(punto, 'ptsaNombre', '') != '' ? getProp(punto, 'ptsaNombre', '') : getProp(punto.puntoSalida, 'ptsaNombre', '')) };
      }
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de obtener el objeto para guardar la nominación
   * @returns {Object}
   */
  obtenerObjetoGuardar = () => {
    let { totalData, listaPuntosSalida } = this.state;
    totalData.listaPuntosSalida = listaPuntosSalida;
    return totalData;
  };

  /**
   * Método encargado de obtener el objeto para enviar a la petición de generar índice de pérdidas
   * @returns {Object}
   */
  obtenerObjetoIndice = () => {
    const { periodo, listaPuntosSalida } = this.state;
    let objetoIndice = {
      periodo: periodo,
    }
    objetoIndice.listaPuntosSalida = listaPuntosSalida.map(punto => {
      return {
        puntoSalida: {
          ptsaIderegistro: (getProp(punto.ptsaIderegistro, 'ptsaIderegistro', '') != '') ?
            getProp(punto.ptsaIderegistro, 'ptsaIderegistro', '') :
            getProp(punto, 'ptsaIderegistro', '')
        },
        fechaInicio: punto.psipFecinicial,
        fechaFin: punto.psipFecfinal
      }
    });
    return objetoIndice;
  };

  /**
   * @method
   * Método encargado de construir una lista nueva con los puntos regulados para poder usar el componente Tabla
   * @param {Array} listaPuntosConsumoRegulado Lista de puntos de consumo regulados
   * @returns {Array}
   */
  construirListaPuntosRegulados = (listaPuntosConsumoRegulado) => {
    let listaFinal = [];
    for (let index = 0; index < listaPuntosConsumoRegulado.length; index++) {
      const punto = listaPuntosConsumoRegulado[index];
      punto.listaLecturasFacturacion.forEach(puntoNuevo => {
        listaFinal.push(puntoNuevo);
      });
    }
    return listaFinal;
  }

  /**
   * Método encargado de formar un objeto con las listas correspondientes
   * @param {Object} data Datos del índice de pérdidas generado
   */
  obtenerListasIndice = (data) => {
    let dataApp = {
      listaPuntosSalida: [...data.listaPuntoSalida],
      listaPuntosNoRegulados: (Util.validarArreglo(data.listaPuntoSalida)) ? [...data.listaPuntoSalida] : [],
      listaPuntosRegulados: (Util.validarArreglo(data.listaPuntoSalida)) ? [...data.listaPuntoSalida] : [],
      listaOtrosConsumos: (Util.validarArreglo(data.listaPuntoSalida)) ? [...data.listaPuntoSalida] : [],
      listaIndicePerdidasPuntos: (Util.validarArreglo(data.listaPuntoIndice)) ? data.listaPuntoIndice : [],
      listaIndicePerdidasMercados: (Util.validarArreglo(data.listaMercados)) ? data.listaMercados : [],
      totalData: { ...data },
      estadoIndice: data.inpeEstado
    }
    return dataApp;
  }

  /**
   * Método encargado de procesar los errores
   * @param {Object} errores Objeto con errores al procesar
   */
  procesarErrores = (errores) => {
    let listaFinal = [];
    for (const key in errores) {
      if (errores.hasOwnProperty(key)) {
        const fechas = errores[key];
        listaFinal.push({
          puntoSalida: key,
          fechas: fechas.join()
        });
      }
    }
    return listaFinal;
  }

  /**
   * Método encargado de mostrar los errores al momento de consultar la unidad de medida de suministro
   * @param {Array} errores Lista de errores
   */
  mostrarError = (errores) => {
    let erroresProcesados = this.procesarErrores(errores.datos);
    let strMensaje = erroresProcesados.map((err, index) => (<li key={index}>{`Punto de ${errores.codigo == ESTADOS_INDICE_PERDIDAS.ERROR_PUNTOS_CONSUMO ? 'Consumo ' : 'Salida '} ${err.puntoSalida}: ${err.fechas}`}</li>));
    let mensaje = (
      <Fragment>
        <span>{`${(strMensaje.length == 1) ? 'Punto' : 'Puntos'} de ${errores.codigo == ESTADOS_INDICE_PERDIDAS.ERROR_PUNTOS_CONSUMO ? 'Consumo ' : 'Salida '} con lecturas no certificadas.`}</span>
        <ul className='container mt-2 pl-5'>{strMensaje}</ul>
      </Fragment>
    );
    this.props.mostrarAlerta(errores.mensaje, mensaje);
  };

  /**
   * Método encargado de generar la nominación para la fecha dada
   * @returns {Boolean}
   */
  generarIndice = () => {
    const validacion = this.validarFormularioGenerar();
    const validar = this.validarTabla();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    if (!validar.respuesta) {
      toast.error(validar.mensaje);
      return;
    }
    const entidadIndice = this.obtenerObjetoIndice();
    axios.post(RUTAS_API.CALCULO_INDICE_PERDIDAS.PROCESAR_INDICE, entidadIndice)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const data = this.obtenerListasIndice(respuesta.data.datos);
          this.setState({ ...data });
          return;
        }
        if (respuesta.data.codigo == ESTADOS_INDICE_PERDIDAS.ERROR_PUNTOS_CONSUMO || respuesta.data.codigo == ESTADOS_INDICE_PERDIDAS.ERROR_PUNTOS_SALIDA) {
          this.mostrarError(respuesta.data);
          return;
        }
      });
  }

  /**
   * Método encargado de consultar si hay índice de perdidas en un periodo
   * @param {String} periodo Fecha a generar el índice de pérdidas
   * @returns {Object}
   */
  consultarExistente = (periodo, nombre) => {
    let data = {};
    axios.post(RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_INDICE_PERDIDAS, { periodo: periodo })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          data = this.obtenerListasIndice(respuesta.data.datos);
          data[nombre] = periodo;
          this.setState({ ...data })
          return;
        }
        data[nombre] = periodo;
        data.estadoIndice = '';
        this.limpiarListas(data);
      });
  };

  /**
   * Método encargado de limpiar las listas cuando cambie un campo del formulario
   * @param {Object} data Datos a limpiar y a setear
   */
  limpiarListas = (data) => {
    data.listaPuntosNoRegulados = [];
    data.listaPuntosRegulados = [];
    data.listaOtrosConsumos = [];
    data.listaIndicePerdidasPuntos = [];
    data.listaIndicePerdidasMercados = [];
    this.setState(data);
  }

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    if (this.state.estadoIndice == ESTADOS_INDICE_PERDIDAS.APROBADO) {
      return;
    }
    let change = {};
    let { name, value } = evento.target;
    change[name] = value;
    if (name == 'periodo') {
      this.consultarExistente(value, name);
      return;
    }
    this.limpiarListas(change);
  };

  /**
   * Método encargado de renderizar la tabla de la nominación transporte
   * @returns {JSX}
   */
  renderTablaIndicePerdidasMercados = () => {
    if (!Util.validarArreglo(this.state.listaIndicePerdidasMercados)) {
      return (<div className='text-center'>No se ha generado el índice de pérdidas</div>);
    }
    return (
      <div>
        <table className='table table-striped mt-10'>
          <thead className='bg-dark bg-white'>
            <tr>
              <th>Código Tarifas </th>
              <th>Mercados </th>
              <th>Total Compras</th>
              <th>Total Ventas</th>
              <th>Índice de Pérdidas </th>
              <th>Factor Máximo </th>
              <th>Índice Aplicable </th>
            </tr>
          </thead>
          <tbody>
            <Fragment>
              {
                this.state.listaIndicePerdidasMercados.map((mercado, index) => {
                  return (
                    <tr key={index}>
                      <td>{getProp(mercado.merIderegistro, 'merCodcreg', '')}</td>
                      <td>{getProp(mercado.merIderegistro, 'merNombre', '')}</td>
                      <td>{getProp(mercado, 'mripCompras', '')}</td>
                      <td>{getProp(mercado, 'mripVentas', '')}</td>
                      <td>{getProp(mercado, 'mripPorcentaje', '')}</td>
                      <td>{getProp(mercado, 'mripFacmaximo', '')}</td>
                      <td>{getProp(mercado, 'mripIndaplicables', '')}</td>
                    </tr>
                  );
                })
              }
            </Fragment>
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la tabla con la nominación de Suministro
   * @returns {JSX}
   */
  obtenerIndicePerdidasMercados = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaIndicePerdidasMercados()}
        </div>
      </div>
    );
  };

  /**
   * @method
   * Método encargado de obtener el total para el indice de perdidas de empresas
   * @param {String} tipo Identificador para el switch
   * @returns {Number}
   */
  obtenerTotalesIndicePerdidas = (tipo) => {
    let totales = { totalCompras: 0, totalVentas: 0 };
    for (let index = 0; index < this.state.listaIndicePerdidasPuntos.length; index++) {
      const punto = this.state.listaIndicePerdidasPuntos[index];
      totales.totalCompras += parseFloat(getProp(punto, 'ipptCompras', 0));
      totales.totalVentas += (parseFloat(getProp(punto, 'ipptVentasnreg', 0)) + parseFloat(getProp(punto, 'ipptVentasreg', 0)));
    }
    switch (tipo) {
      case 'compras':
        return totales.totalCompras;
      case 'ventas':
        return totales.totalVentas;
      case 'indice':
        if (totales.totalCompras == 0) {
          return 0;
        }
        return (totales.totalCompras - totales.totalVentas) / totales.totalCompras;
    }
  };

  /**
   * Método encargado de renderizar la tabla de la nominación transporte
   * @returns {JSX}
   */
  renderTablaIndicePerdidasPuntos = () => {
    const { listaPuntosSalida } = this.state;
    const lista = [...this.state.listaIndicePerdidasPuntos];
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha generado el índice de pérdidas</div>);
    }
    return (
      <div>
        <table className='table table-bordered mt-10'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Punto de Salida </th>
              <th>Punto de Consumo </th>
              <th>Total Compras </th>
              <th>Total Ventas </th>
              <th>Indice de Perdidas </th>
            </tr>
          </thead>
          <tbody>
            <Fragment>
              {
                lista.map((elemento, index) => {
                  let punto = listaPuntosSalida.find(p => getProp(p.ptsaIderegistro, 'ptsaIderegistro', '') == getProp(elemento.ptcIderegistro, 'ptsaIdesalida.ptsaIderegistro', ''));
                  return (
                    <tr key={getProp(elemento.inpeIderegistro, 'inpeIderegistro', '')}>
                      <td>{getProp(punto.ptsaIderegistro, 'ptsaNombre', '')}</td>
                      <td>{getProp(elemento.ptcIderegistro, 'ptcoNombre', '')}</td>
                      <td>{getProp(elemento, 'ipptCompras', 0)}</td>
                      <td>{(getProp(elemento, 'ipptVentasnreg', 0) + getProp(elemento, 'ipptVentasreg', 0))}</td>
                      <td>{getProp(elemento, 'ipptPorcentaje', 0)}</td>
                    </tr>
                  );
                })
              }
              <tr>
                <td colSpan='2'>Total Empresa</td>
                <td>{this.obtenerTotalesIndicePerdidas('compras')}</td>
                <td>{this.obtenerTotalesIndicePerdidas('ventas')}</td>
                <td>{this.obtenerTotalesIndicePerdidas('indice')}</td>
              </tr>
            </Fragment>
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la tabla con la nominación de transporte
   * @returns {JSX}
   */
  obtenerIndicePerdidasPuntos = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaIndicePerdidasPuntos()}
        </div>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la tabla con contratos transporte
   * @returns {JSX}
   */
  renderTablaOtrosConsumos = () => {
    const lista = [...this.state.listaOtrosConsumos];
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha generado el índice de pérdidas</div>);
    }
    return (
      <div>
        <table className='table table-bordered mt-10'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Nombre Punto</th>
              <th>Tipo de Consumo </th>
              <th>Unidad de Medida </th>
              <th>Cantidad Consumida </th>
            </tr>
          </thead>
          <tbody>
            <Fragment>
              {
                lista.map((punto, index) => {
                  return (
                    <Fragment>
                      {
                        Util.validarArreglo(punto.listaOtrosConsumos) &&
                        punto.listaOtrosConsumos.map((otrosC, indexC) => {
                          return (
                            <tr key={getProp(otrosC, 'ocipTipo', '')}>
                              <td>{getProp(otrosC.ptcIderegistro, 'ptcoNombre', '')}</td>
                              <td>{getProp(otrosC, 'ocipTipo', '')}</td>
                              <td>{'M3'}</td>
                              <td>{getProp(otrosC, 'ocipTotlecmc', '')}</td>
                            </tr>
                          );
                        })
                      }
                    </Fragment>
                  );
                })
              }
            </Fragment>
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de obtener la tabla de contratos suministro
   * @returns {JSX}
   */
  obtenerOtrosConsumos = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaOtrosConsumos()}
        </div>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la tabla con contratos suministro
   * @returns {JSX}
   */
  renderTablaPuntosRegulados = () => {
    const lista = [... this.state.listaPuntosRegulados];
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha generado el índice de pérdidas</div>);
    }
    return (
      <div>
        <table className='table table-bordered mt-10'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Nombre Punto</th>
              <th>Tipo de Uso </th>
              <th>Identificador Tipo de Uso </th>
              <th>Total Consumo M3 </th>
              <th>Total Usuarios</th>
            </tr>
          </thead>
          <tbody>
            <Fragment>
              {
                lista.map((punto, index) => {
                  return (
                    <Fragment>
                      {
                        Util.validarArreglo(punto.listaFacturacion) &&
                        punto.listaFacturacion.map((facDato, indexDato) => {
                          return (
                            <tr key={getProp(facDato.ifipIderegistro)}>
                              <td>{getProp(facDato.ptcIderegistro, 'ptcoNombre', '')}</td>
                              <td>{getProp(facDato.uniTipuso, 'uniNombre1', '')}</td>
                              <td>{getProp(facDato.uniTipuso, 'uniIderegistro', '')}</td>
                              <td>{getProp(facDato, 'ifipTotlconsumo', '')}</td>
                              <td>{getProp(facDato, 'ifipTotusuarios', '')}</td>
                            </tr>
                          );
                        })
                      }
                    </Fragment>
                  )
                })
              }
            </Fragment>
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de obtener la tabla de contratos suministro
   * @returns {JSX}
   */
  obtenerPuntosRegulados = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaPuntosRegulados()}
        </div>
      </div>
    );
  };

  /**
  * Método encargado de mostrar la tabla con los puntos seleccionados
  * @returns {Arrat}
  */
  renderTablaPuntosNoRegulados = () => {
    const lista = [... this.state.listaPuntosNoRegulados];
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha generado el índice de pérdidas</div>);
    }
    return (
      <div>
        <table className='table table-bordered mt-10'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Punto de Salida</th>
              <th>Punto de Consumo </th>
              <th>Tipo de uso Punto Consumo </th>
              <th>Lectura M3 </th>
              <th>Lectura MBTU </th>
              <th>Nominación</th>
            </tr>
          </thead>
          <tbody>
            <Fragment>
              {
                lista.map((elemento, index) => {
                  return (
                    <Fragment>
                      {
                        Util.validarArreglo(elemento.listaPuntosConsumoDiferenteRegulado) &&
                        elemento.listaPuntosConsumoDiferenteRegulado.map((puntoC, indexPuntoC) => {
                          return (
                            <tr key={getProp(puntoC.ptcIderegistro, 'ptcIderegistro', '')}>
                              <td>{getProp(elemento.ptsaIderegistro, 'ptsaNombre', '')}</td>
                              <td>{getProp(puntoC.ptcIderegistro, 'ptcoNombre', '')}</td>
                              <td>{getProp(puntoC.ptcIderegistro, 'uniIdetipoconsumo.uniNombre1', '')}</td>
                              <td>{getProp(puntoC, 'pcipTotlecmc', '')}</td>
                              <td>{getProp(puntoC, 'pcipTotlecmbtu', '')}</td>
                              <td>{getProp(puntoC, 'pcipTotnom', '')}</td>
                            </tr>
                          );
                        })
                      }
                    </Fragment>
                  )

                })
              }
            </Fragment>
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de obtener la tabla de contratos suministro
   * @returns {JSX}
   */
  obtenerPuntosNoRegulado = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaPuntosNoRegulados()}
        </div>
      </div>
    );
  };

  /**
   * Método encargado de controlar el cambio de la nominación final de los contratos de suministro
   * @param {Event} evento Evento ejecutado en el control de usuario
   * @param {Event} index Posición que se modifica
   */
  controlarCambioTabla = (evento, index) => {
    if (this.state.estadoIndice == ESTADOS_INDICE_PERDIDAS.APROBADO) {
      return;
    }
    const { name, value } = evento.target;
    let listaPuntos = [...this.state.listaPuntosSalida];
    listaPuntos[index][name] = value;
    this.setState({ listaPuntosSalida: listaPuntos });
  }

  /**
   * Método encargado de mostrar la tabla de nominación de puntos de consumo
   * @returns {JSX}
   */
  renderTablaPuntosSalida = () => {
    const lista = [...this.state.listaPuntosSalida];
    if (!Util.validarArreglo(lista)) {
      return (<div className='text-center'>No se ha realizado el calculo</div>);
    }
    return (
      <table className='table table-bordered text-center'>
        <thead className='bg-dark text-white'>
          <tr>
            <th scope="col" className='text-center'>Punto de Salida</th>
            <th scope="col" className='text-center'>Fecha Inicio</th>
            <th scope="col" className='text-center'>Fecha Fin</th>
            <th scope="col" className='text-center'>Lectura M3</th>
            <th scope="col" className='text-center'>Unidad de Medida</th>
            <th scope="col" className='text-center'>Lectura MBTU</th>
            <th scope="col" className='text-center'>Unidad de Medida</th>
          </tr>
        </thead>
        <tbody>
          {(Util.validarArreglo(lista)) &&
            <Fragment>
              {
                lista.map((ele, index) => {
                  return (
                    <tr key={(getProp(ele.ptsaIderegistro, 'ptsaIderegistro', '') != '') ?
                      getProp(ele.ptsaIderegistro, 'ptsaIderegistro', '') :
                      getProp(ele, 'ptsaIderegistro', '')
                    }>
                      <td>{(getProp(ele, 'ptsaNombre', '') != '' ? getProp(ele, 'ptsaNombre', '') : getProp(ele.ptsaIderegistro, 'ptsaNombre', ''))}</td>
                      <td>
                        <Fecha
                          name='psipFecinicial'
                          fecha={ele.psipFecinicial}
                          onChange={(evento) => {
                            this.controlarCambioTabla(evento, index)
                          }}
                          cols={12}
                        />
                      </td>
                      <td>
                        <Fecha
                          name='psipFecfinal'
                          fecha={ele.psipFecfinal}
                          onChange={(evento) => {
                            this.controlarCambioTabla(evento, index)
                          }}
                          cols={12}
                        />
                      </td>
                      <td>{getProp(ele, 'psipTotlecturamc', '')}</td>
                      <td>{'M3'}</td>
                      <td>{getProp(ele, 'psipTotlecturambtu', '')}</td>
                      <td>{'MBTU'}</td>
                    </tr>
                  )
                })
              }
            </Fragment>
          }
        </tbody>
      </table>
    )
  };

  /**
   * Método encargado de retornar la vista de nominación.
   * @returns {Object}
   */
  obtenerPuntosSalida = () => {
    return (
      <div className='row'>
        <div className='col-12'>
          {this.renderTablaPuntosSalida()}
        </div>
      </div>
    );
  };

  /**
   * Método encargado de llevar el control de las pestañas.
   * @param {Event} evento Evento ejecutado en el control de usuario.
   */
  navegar = (evento) => {
    const tipo = evento.target.name;
    const programaActual = parseInt(this.state.programaActual);
    const incremento = tipo === 'btn-anterior' ? -1 : 1;
    const nuevoIndice = programaActual + incremento;
    if (VISTAS[nuevoIndice]) {
      this.setState({ programaActual: nuevoIndice });
    }
  };

  /**
   * Método encargado de cargar el titulo de las vistas.+
   * @param {Event} evento Evento ejecutado en el control de usuario.
   */
  cargarVista = (evento) => {
    this.setState({ programaActual: evento.target.value });
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
          <Fecha
            label='Perido:'
            name='periodo'
            fecha={this.state.periodo}
            onChange={this.controlarCambio}
            cols={6}
            sinDia={true}
          />
        </div>
        <div className='contratos__navegador'>
          <div className='contratos__navegador__cabecera'>
            <div className='colum btn-content'>
              {this.state.programaActual > 0 && (
                <button className='contratos__navegador__cabecera-btn' name='btn-anterior' onClick={this.navegar}>Anterior</button>
              )}
            </div>
            <div className='colum select-content'>
              <select name="programaActual" className='contratos__navegador__cabecera-select' onChange={this.cargarVista} value={this.state.programaActual}>
                {VISTAS.map(p => (<option key={p.id} value={p.id}>{p.titulo}</option>))}
              </select>
            </div>
            <div className='colum btn-content'>
              {(this.state.programaActual < (VISTAS.length - 1)) && (
                <button className='contratos__navegador__cabecera-btn' name='btn-siguiente' onClick={this.navegar}>Siguiente</button>
              )}
            </div>
          </div>
          <div className="contratos__fragmento">
            {this[VISTAS[parseInt(this.state.programaActual)].componente]()}
          </div>
        </div>
      </Fragment>
    );
  };
}

IndicePerdidas.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(IndicePerdidas);

export { VistaRedux as RIndicePerdidas };
