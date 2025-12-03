import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Fecha, TextoNumerico, Util } from 'appfuture-react';
import { SelectorMultiple } from '../../../utils/SelectorMultiple';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { actualizarValidarCalculoPerdidas } from '../../../../store/actions/CalculoPerdidasAcciones';
import './GestionCalculoIndicePerdidas.scss';
import { RProcesoValidar } from './forms/ProcesoValidar';
import { get as getProp } from 'object-path';

const CODIGOS_PROCESOS = {
  LECTURAS: 'L',
  FACTURAS: 'F',
  PERDIDAS_GASIFICACION: 'P',
  INDICE_PERDIDAS_CONSUMO: 'IP',
  INDICE_PERDIDAS_EMPRESA: 'IE',
  CRED_240: 'C',
  LECTURAS_ESPECIALES: 'LE'
};

const listaProcesos = [
  { texto: 'Lecturas', valor: CODIGOS_PROCESOS.LECTURAS },
  { texto: 'Facturas', valor: CODIGOS_PROCESOS.FACTURAS },
  { texto: 'Pérdidas y Gasificación', valor: CODIGOS_PROCESOS.PERDIDAS_GASIFICACION },
  { texto: 'Índice de pérdidas por punto de consumo', valor: CODIGOS_PROCESOS.INDICE_PERDIDAS_CONSUMO },
  { texto: 'Índice de pérdidas por empresa', valor: CODIGOS_PROCESOS.INDICE_PERDIDAS_EMPRESA },
  { texto: 'Lecturas Especiales', valor: CODIGOS_PROCESOS.LECTURAS_ESPECIALES },
  { texto: 'Creg240', valor: CODIGOS_PROCESOS.CRED_240 },
];

const listaIndicePerdida = [
  { texto: 'Por Punto', valor: 'P' },
  { texto: 'Para la Empresa', valor: 'E' },
];

const listaFactorIndice = [
  { texto: 'Factor Máximo', valor: 'FM' },
  { texto: 'Indice de Perdidas Aplicable', valor: 'PA' },
];

const listaOpcionesLecturas = [
  { texto: 'VillaVicencio y Porfia', valor: 'VP' },
  { texto: 'Granada Y Fuente de Oro', valor: 'GF' },
  { texto: 'Granada GNV', valor: 'G' },
  { texto: 'Otros Puntos de Consumo', valor: 'OP' },
];

let listaAnios = [
  { texto: 'Año', valor: '' },
];

let listaMes = [
  { texto: 'Mes', valor: '' },
  { texto: 'Enero', valor: '01' },
  { texto: 'Febrero', valor: '02', controlBisiesto: true },
  { texto: 'Marzo', valor: '03' },
  { texto: 'Abril', valor: '04' },
  { texto: 'Mayo', valor: '05' },
  { texto: 'Junio', valor: '06' },
  { texto: 'Julio', valor: '07' },
  { texto: 'Agosto', valor: '08' },
  { texto: 'Septiembre', valor: '09' },
  { texto: 'Octubre', valor: '10' },
  { texto: 'Noviembre', valor: '11' },
  { texto: 'Diciembre', valor: '12' },
];

class GestionCalculoIndicePerdidas extends Component {

  state = {
    // Datos de la entidad
    listaPuntosConsumo: [],
    puntoConsumo: '',
    periodo: '',
    proceso: '',
    tipoValidacion: '',
    fechaInicio: '',
    fechaFin: '',
    tipoIndicePerdidas: '',
    factorIndice: '',

  };

  refProcesoValidar = null;

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    this.obtenerPuntosConsumo();
    this.obtenerAnios();
  };

  /**
   * Método encargado de obtener una lista de años
   */
  obtenerAnios = () => {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const anioInicial = anioActual - 100;
    for (let i = anioActual; i > anioInicial; i--) {
      listaAnios.push({ texto: i, valor: i });
    }
  };

  /**
   * Obtiene la lista de los puntos de consumo.
   */
  obtenerPuntosConsumo = () => {
    let url = RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_PUNTOS_CONSUMO;
    axios.post(url, { criterio: '', indicePerdida: 'S' })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const datos = respuesta.data.datos;
          this.setState({ listaPuntosConsumo: datos });
        }
      });
  };

  /**
   * Método encargado de limpiar los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
    });
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
    return [
      { texto: 'Consultar', callback: this.consultar },
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de consultar lecturas
   */
  consultar = () => {
    this.consultarLecturas();
    // if (this.refProcesoValidar && this.state.proceso === 'V') {
    //   this.refProcesoValidar.getWrappedInstance().consultarLecturas();
    // } else if (this.state.proceso === 'L') {
    //   this.consultarLecturaPuntosConsumoEspeciales();
    // }
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    // Ejemplo Validacion
    if (false) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un cargo de tipo AO&M para poder continuar.' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const entidadGuardar = {
      // Asignar datos de la entidad
    }

    // Reemplazar con ruta del Endpoint para guardar
    axios.post(RUTAS_API.XXXXXX, entidadGuardar)
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
    const valor = evento.target.value;
    change[evento.target.name] = valor;
    let callback = null;
    if (evento.target.name === 'periodo' || evento.target.name === 'proceso') {
      if (evento.target.name === 'periodo') {
        if (valor && valor.trim() != '') {
          change['mes'] = valor.split('-')[1];
          change['anio'] = valor.split('-')[0];
        }
      }
      if (evento.target.name === 'proceso') {
        change['datos'] = [];
      }
      if (this.refProcesoValidar != null && (this.state.proceso == 'V' || (evento.target.name === 'proceso' && evento.target.value === 'V'))) {
        // callback = this.refProcesoValidar.getWrappedInstance().consultarLecturas;
      } else if ((evento.target.name === 'proceso' && evento.target.value === 'L') || this.state.proceso === 'L') {
        // callback = this.consultarLecturaPuntosConsumoEspeciales;
      }
    }
    this.setState(change);
  };

  /**
   *Método encargado de agregar el punto de consumo seleccionado a la tabla
   */
  agregarSeleccionado = () => {

  };

  /**
   * Método encargado de mostrar la tabla para el calculo de indice de perdidas por punto
   * @returns {}
   */
  renderTablaPunto = () => {
    return (
      <table>
        <thead>
          <th>Punto de Consumo</th>
          <th>Periodo</th>
          <th>Total Compras M3 Regulado</th>
          <th>Total Compras M3 No Regulado</th>
          <th>Total Ventas M3</th>
          <th>Indice Perdidas</th>
        </thead>
        <tbody>
          {
            this.state.listaPuntosSeleccionados.map((dato, index) => {
              return (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de mostrar la tabla para el calculo de indice de perdidas por empresa
   * @returns {}
   */
  renderTablaEmpresa = () => {
    return (
      <table>
        <thead>
          <th>Punto de Consumo</th>
          <th>Periodo</th>
          <th>Empresa</th>
          <th>Total Compras M3</th>
          <th>Total Ventas M3</th>
          <th>Indice Perdidas</th>
        </thead>
        <tbody>
          {
            this.state.listaPuntosSeleccionados.map((dato, index) => {
              return (
                <tr>
                  <td>dato.x</td>
                  <td>dato.x</td>
                  <td>dato.x</td>
                  <td>dato.x</td>
                  <td>dato.x</td>
                  <td>dato.x</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de calcular el indice de perdidas ya sea por punto o por empresa
   */
  calcularIndicePerdidas = () => {

  };

  /**
   * Método encargado de mostar el formulario para el proceso indice de perdidas
   * @returns {Object}
   */
  renderProcesoIndicePerdidas = () => {
    return (
      <div className='conf-general row mt-5'>
        <Combo
          opciones={listaIndicePerdida}
          propTexto='texto'
          propValor='valor'
          label='Validar Información:'
          name='tipoIndicePerdidas'
          value={this.state.tipoIndicePerdidas}
          onChange={this.controlarCambio}
        />
        <Fecha
          label='Periodo:'
          name='periodo'
          fecha={this.state.periodo}
          onChange={this.controlarCambio}
        />
        <button className='btn btn-primary' onClick={this.calcularIndicePerdidas}>Calcular</button>
        {this.state.tipoIndicePerdidas === 'P' &&
          this.renderTablaPunto()
        }
        {this.state.tipoIndicePerdidas === 'E' &&
          this.renderTablaEmpresa()
        }
      </div>
    );
  };

  /**
   * Método encargado de calcular el factor máximo o las perdidas aplicables
   */
  calcularCreg240 = () => {

  };

  /**
   * Método encargado de mostar el formulario para el proceso indice de perdidas
   * @returns {Object}
   */
  renderProcesoCreg240 = () => {
    return (
      <div className='conf-general row mt-5'>
        <Fecha
          label='Periodo:'
          name='periodo'
          fecha={this.state.periodo}
          onChange={this.controlarCambio}
        />
        <Combo
          opciones={listaFactorIndice}
          propTexto='texto'
          propValor='valor'
          label='Factor o Indice:'
          name='factorIndice'
          value={this.state.factorIndice}
          onChange={this.controlarCambio}
        />
        <button className='btn btn-primary' onClick={this.calcularCreg240}>Calcular</button>
      </div>
    );
  };

  /**
   * Método encargado de generar el reporte del proceso lecturas diarias
   * @returns {boolean}
   */
  generarReporteLecturas = () => {
    this.props.mostrarAlerta('NO DISPONIBLE', 'Módulo no disponible');
  };

  consultarLecturaPuntosConsumoEspeciales = () => {
    const { proceso, fechaInicio, fechaFin } = this.state;
    if (!proceso) {
      return;
    }
    if (!fechaInicio) {
      return;
    }
    if (!fechaFin) {
      return;
    }
    //Consultamos los puntos de consumo especiales...
    axios.post(RUTAS_API.CALCULO_INDICE_PERDIDAS.CALCULAR_PUNTOS_ESPECIALES, {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    }).then(respuesta => {
      console.log(respuesta);
    });
  };

  /**
   * Método encargado de mostrar el formulario para el proceso de calculo de lecturas
   * @returns {Object}
   */
  renderProcesoLecturas = () => {
    const { proceso } = this.state;
    return (
      <Fragment>
        {(
          proceso == CODIGOS_PROCESOS.LECTURAS
          || proceso == CODIGOS_PROCESOS.FACTURAS
          || proceso == CODIGOS_PROCESOS.PERDIDAS_GASIFICACION
          || proceso == CODIGOS_PROCESOS.INDICE_PERDIDAS_CONSUMO
          || proceso == CODIGOS_PROCESOS.LECTURAS_ESPECIALES
        ) && this.renderSelectorPuntosConsumo()
        }
        {
          (proceso == CODIGOS_PROCESOS.LECTURAS || proceso == CODIGOS_PROCESOS.PERDIDAS_GASIFICACION) && (
            <Fragment>
              <Fecha
                label='Fecha Inicio:'
                name='fechaInicio'
                fecha={this.state.fechaInicio}
                onChange={this.controlarCambio}
              />
              <Fecha
                label='Fecha Fin:'
                name='fechaFin'
                fecha={this.state.fechaFin}
                onChange={this.controlarCambio}
              />
            </Fragment>
          )
        }
        {this.construirTablas()}
        {Util.validarArreglo(this.state.listaEspeciales) && (
          <div className='col-12'>
            <table className='table table-hover table-bordered table-striped table-condensed'>
              <thead>
                <tr>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.listaEspeciales.map(item => {

                  })
                }
              </tbody>
            </table>
          </div>
        )}
      </Fragment>
    );
  };

  /**
   * Obtiene la lista de puntos de consumo.
   * @return {array}
   */
  obtenerListaPuntosConsumo = () => {
    const listaPuntosConsumo = getProp(this.state, 'listaPuntosConsumo', []);
    return listaPuntosConsumo.filter(p => p.seleccionado).map(p => {
      return p.ptcIderegistro
    });
  };

  /**
   * Valida si se han seleccionado los campos necesarios para consultar las lecturas...
   * @return {boolean}
   */
  validarParaConsulta = () => {
    const puntosConsumo = this.obtenerListaPuntosConsumo();
    const { anio, mes, proceso, fechaInicio, fechaFin } = this.state;
    if ((proceso === CODIGOS_PROCESOS.INDICE_PERDIDAS_EMPRESA) || (proceso == CODIGOS_PROCESOS.LECTURAS_ESPECIALES)) {
      if ((parseInt(anio) < 0 || parseInt(mes) < 0)) {
        return false;
      } else {
        return true;
      }
    }
    // if ((proceso === CODIGOS_PROCESOS.LECTURAS_ESPECIALES)) {
    //   if ((fechaInicio && fechaInicio.trim() != '') || (fechaInicio && fechaInicio.trim() != '')) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }
    if (((puntosConsumo == '') || parseInt(anio) < 0 || parseInt(mes) < 0)) {
      return false;
    }
    return true;
  };

  /**
  * Consulta los valores para validar las lecturas.
  * @returns {Boolean}
  */
  consultarLecturas = () => {
    const tipoValidacion = this.state.proceso;
    if (!this.validarParaConsulta()) {
      return;
    }
    let url = null;
    const obj = {
      puntosConsumo: this.obtenerListaPuntosConsumo(),
      mes: this.state.mes,
      anio: this.state.anio,
      fechaInicio: this.state.fechaInicio,
      fechaFin: this.state.fechaFin
    };

    switch (tipoValidacion) {
      case CODIGOS_PROCESOS.LECTURAS:
        url = RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_VALIDAR_LECTURAS;
        break;
      case CODIGOS_PROCESOS.FACTURAS:
        url = RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_VALIDACION_FACTURA;
        break;
      case CODIGOS_PROCESOS.PERDIDAS_GASIFICACION:
        url = RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_GASIFICACIONES;
        break;
      case CODIGOS_PROCESOS.INDICE_PERDIDAS_CONSUMO:
        url = RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_INDICE_PERDIDAS_CONSUMO;
        break;
      case CODIGOS_PROCESOS.INDICE_PERDIDAS_EMPRESA:
        url = RUTAS_API.CALCULO_INDICE_PERDIDAS.CONSULTAR_INDICE_PERDIDAS_EMPRESA;
        break;
      case CODIGOS_PROCESOS.LECTURAS_ESPECIALES:
        url = RUTAS_API.CALCULO_INDICE_PERDIDAS.CALCULAR_PUNTOS_ESPECIALES
        break;
    }
    axios.post(url, obj).then(
      respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ datos: respuesta.data.datos });
        }
      }
    );
  };

  /**
   * Método encargado de configurar la tabla para que sea generica
   * @param {Array} datos Datos de la tabla a mostrar
   */
  obtenerConfigurarTabla = (datos) => {
    var registro = { idPunto: -1, cantidad: 0 };
    var listaRegistros = [];
    for (var i = 0; i < datos.length; i++) {
      var info = datos[i];
      var idPunto = info.ptcIdepuntoconsumo.ptcIderegistro;
      if (idPunto != registro.idPunto && registro.idPunto != -1) {
        listaRegistros.push({ ...registro });
        registro.cantidad = 0;
      }
      registro.idPunto = idPunto;
      registro.cantidad++;
    }
    listaRegistros.push({ ...registro });
    return listaRegistros;
  };

  /**
   * Calcula el total de consumo.
   * @return {number}
   */
  calcularTotal = (datos) => {
    let cantidad = 0;
    datos.forEach(punto => {
      cantidad += punto.inpfConsumo;
    });
    return cantidad;
  };


  /**
   * Método encargado de mostrar la tabla para validar las facturas
   * @param {Array} datos Datos de facturas
   * @returns {JSX}
   */
  renderTablaFacturas = (datos) => {
    const listaRegistros = this.obtenerConfigurarTabla(datos);
    var idPunto = -1;
    var cantidad = -1;

    if (!Util.validarArreglo(datos)) {
      return '';
    }
    return (
      <div className='col-12'>
        <h1 className='titulo-tabla'>Validar para Facturación</h1>
        <table className='table table-condensed table-striped'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Punto de Consumo</th>
              <th>Periodo</th>
              <th>Uso</th>
              <th>Cantidad de Usuarios</th>
              <th>Consumo M3</th>
              <th>Promedio Consumo por Usuario</th>
              <th>Total Ventas</th>
            </tr>
          </thead>
          <tbody>
            {
              datos.map((info, indexLista) => {
                const idPuntoConsumo = info.ptcIdepuntoconsumo.ptcIderegistro;
                return (
                  <tr key={indexLista}>
                    {
                      (idPunto != idPuntoConsumo) && (() => {
                        cantidad = listaRegistros.find(item => item.idPunto == idPuntoConsumo).cantidad;
                        return <td rowSpan={cantidad}>{info.ptcIdepuntoconsumo.ptcoNombre}</td>
                      })()
                    }
                    {
                      (() => {
                        return (
                          <Fragment>
                            <td>{this.state.periodo}</td>
                            <td>{getProp(info, 'uniIdetipouso.uniNombre1', 0)}</td>
                            <td>{getProp(info, 'inpfCantusuario', 0)}</td>
                            <td>{getProp(info, 'inpfConsumo', 0)}</td>
                            <td>{getProp(info, 'inpfPromediousuario', 0)}</td>
                          </Fragment>)
                      })()
                    }
                    {
                      (idPunto != idPuntoConsumo) && (() => {
                        idPunto = idPuntoConsumo;
                        return (
                          <td rowSpan={cantidad}>{this.calcularTotal(datos)}</td>
                        )
                      })()
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Método encargado de mostrar la tabla para validar las perdidas
   * @param {Array} datos Datos de perdidas
   * @returns {JSX}
   */
  renderTablaPerdidas = (datos) => {
    if (!Util.validarArreglo(datos)) {
      return '';
    }
    return (
      <div className='col-12'>
        <h1 className='titulo-tabla'>Validar para Perdidas y Gasificaciones</h1>
        <table className='table table-condensed table-striped'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Punto de Consumo</th>
              <th>Periodo</th>
              <th>Cantidad Perdidas Menores M3</th>
              <th>Cantidad Perdidas Mayores M3</th>
              <th>Cantidad Gasificaciones M3</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {
              datos.map((dato, index) => {
                return (
                  <tr key={index}>
                    <td>{getProp(dato, 'punto.ptcoNombre', 'Indefinido')}</td>
                    <td>{this.obtenerPeriodo()}</td>
                    <td>{getProp(dato, 'perdidaMenor', '0')}</td>
                    <td>{getProp(dato, 'periddaMayor', '0')}</td>
                    <td>{getProp(dato, 'gasificacion', '0')}</td>
                    <td>{getProp(dato, 'total', '0')}</td>
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
   * Método encargado de mostrar la tabla de perdidas de consumo
   * @param {Array} datos Datos de perdidas de consumo
   * @returns {JSX}
   */
  renderTablaIndicePerdidasConsumo = (datos) => {
    return (
      <div className='col-12'>
        <h1 className='titulo-tabla'>Índice pérdidas por punto de consumo</h1>
        <table className='table table-condensed table-striped table-bordered'>
          <thead className='text-white bg-dark'>
            <tr>
              <th>Punto de consumo</th>
              <th>Periodo Mes/Año</th>
              <th>Total Compras m3 Regulado</th>
              <th>Total Compras m3 No Regulado</th>
              <th>Total ventas m3</th>
              <th>Índice Perdidas</th>
            </tr>
          </thead>
          <tbody>
            {
              datos.map((dato, index) => {
                return (
                  <tr key={Util.generarIdControl(index)}>
                    <td>{getProp(dato, 'ptcIdepuntoconsumo.ptcoNombre', '')}</td>
                    <td>{this.state.periodo}</td>
                    <td>{getProp(dato, 'inppTotalcompreg', '0')}</td>
                    <td>{getProp(dato, 'inppTotalcompnoreg', '0')}</td>
                    <td>{getProp(dato, 'inppTotalventas', '0')}</td>
                    <td>{getProp(dato, 'inppIndperdida', '0')}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  };

  /**
   * Método encargado de mostrar la tabla de indice de perdidas por empresa
   * @param {Array} datos Datos de indice de perdidas
   * @returns {JSX}
   */
  renderTablaIndicePerdidasEmpresa = (datos) => {
    return (
      <div className='col-12'>
        <h1 className='titulo-tabla'>Índice pérdidas por empresa</h1>
        <table className='table table-condensed table-striped table-bordered'>
          <thead className='text-white bg-dark'>
            <tr>
              <th>Periodo</th>
              <th>Indice Perdida</th>
              <th>Total Compras</th>
              <th>Total Ventas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{getProp(datos, 'periodo', '')}</td>
              <td>{getProp(datos, 'indicePerdida', '')}</td>
              <td>{getProp(datos, 'totalCompras', '')}</td>
              <td>{getProp(datos, 'totalVentas', '')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  };

  /**
   * Método encargado de mostrar la tabla de lecturas especiales
   * @param {Array} datos Datos de lecturas
   * @returns {JSX}
   */
  renderTablaLecturasEspeciales = (datos) => {
    return (
      <div className='col-12'>
        <h1 className='titulo-tabla'>Índice pérdidas por empresa</h1>
        <table className='table table-condensed table-striped table-bordered'>
          <thead className='text-white bg-dark'>
            <tr>
              <th>Punto de Consumo</th>
              <th>Periodo</th>
              <th>Total Ventas</th>
              <th>Porcentaje Participación</th>
              <th>Total Compras</th>
            </tr>
          </thead>
          <tbody>
            {
              datos.map((dato, index) => {
                return (
                  <tr key={Util.generarIdControl(index)}>
                    <td>{dato.ptcIdepuntoconsumo.ptcoNombre}</td>
                    <td>{dato.inpePeriodo}</td>
                    <td>{dato.inpeVentas}</td>
                    <td>{dato.inpePorcentaje}</td>
                    <td>{dato.inpeCompras}</td>
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
   * Método encargado de construir la tabla dependiendo del proceso
   * @returns {JSX}
   */
  construirTablas = () => {
    let datos = getProp(this.state, 'datos', []);
    const proceso = getProp(this.state, 'proceso', '');
    if (!Util.validarArreglo(datos) && proceso != CODIGOS_PROCESOS.INDICE_PERDIDAS_EMPRESA) {
      return '';
    } else if (!(typeof datos === 'object' && !Array.isArray(datos)) && CODIGOS_PROCESOS.INDICE_PERDIDAS_EMPRESA == proceso) {
      return '';
    }
    return (
      <Fragment>
        {
          proceso === CODIGOS_PROCESOS.LECTURAS && this.renderTablaLecturas(datos)
        }
        {
          proceso === CODIGOS_PROCESOS.FACTURAS && this.renderTablaFacturas(datos)
        }
        {
          proceso === CODIGOS_PROCESOS.PERDIDAS_GASIFICACION && this.renderTablaPerdidas(datos)
        }
        {
          proceso === CODIGOS_PROCESOS.INDICE_PERDIDAS_CONSUMO && this.renderTablaIndicePerdidasConsumo(datos)
        }
        {
          proceso === CODIGOS_PROCESOS.INDICE_PERDIDAS_EMPRESA && this.renderTablaIndicePerdidasEmpresa(datos)
        }
        {
          proceso === CODIGOS_PROCESOS.LECTURAS_ESPECIALES && this.renderTablaLecturasEspeciales(datos)
        }
      </Fragment>
    );
  };

  /**
   * Busca un punto de consumo por id y obtiene el nombre del punto de consumo.
   * @return {string}
   */
  obtenerNombrePuntoConsumo = (idPuntoConsumo) => {
    const listaPuntosConsumo = getProp(this.state, 'listaPuntosConsumo', []);
    const puntoConsumo = listaPuntosConsumo.find(p => p.ptcIderegistro === idPuntoConsumo);
    return puntoConsumo.ptcoNombre;
  };

  /**
   * Obtiene la fecha del periodo.
   * @return {string}
  */
  obtenerPeriodo = () => {
    return `${this.state.fechaInicio} - ${this.state.fechaFin}`;
  };

  /**
   * Método encargado de mostrar la tabla para validar las lecturas
   * @param {Array} datos Datos de lecturas
   * @returns {JSX}
   */
  renderTablaLecturas = (datos) => {
    if (!Util.validarArreglo(datos)) {
      return '';
    }
    return (
      <div className='col-12'>
        <h1 className='titulo-tabla'>Validar para Lecturas</h1>
        <table className='table table-condensed table-striped'>
          <thead className='bg-dark text-white'>
            <tr>
              <th>Punto de Consumo</th>
              <th>Periodo</th>
              <th>Cantidad Nominada MBTU</th>
              <th>Lectura Consumo Preliminar MBTU</th>
              <th>Lectura Certificada MBTU</th>
              <th>Lectura Certificada M3</th>
              <th>Compras</th>
            </tr>
          </thead>
          <tbody>
            {
              datos.map((dato, index) => {
                return (
                  <tr key={index}>
                    <td>{this.obtenerNombrePuntoConsumo(dato.puntoConsumo.ptcIderegistro)}</td>
                    <td>{this.obtenerPeriodo()}</td>
                    <td>{dato.cantidadNominada}</td>
                    <td>{dato.consumoPreliminar}</td>
                    <td>{dato.lecturaCertificadaMBTU}</td>
                    <td>{dato.lecturaCertificadaM3}</td>
                    <td>0</td>
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
   * Método encargado de mostar el formulario para el proceso validar
   * @returns {Object}
   */
  renderProcesoValidar = () => {
    // return (
    //   <RProcesoValidar
    //     listaPuntosConsumo={this.state.listaPuntosConsumo}
    //     seleccionarItem={this.seleccionarPuntoConsumo}
    //     anio={this.state.anio}
    //     mes={this.state.mes}
    //     actualizarValidarCalculoPerdidas={this.props.actualizarValidarCalculoPerdidas}
    //     ref={ref => this.refProcesoValidar = ref}
    //   />
    // );
  };

  /**
   * Método encargado controlar la seleccion de puntos de consumo del componente SelectorMultiple
   * @param {Event} event Evento ejecutado en el control de usuario
   */
  seleccionarPuntoConsumo = (event) => {
    const listaPuntosConsumo = [...this.state.listaPuntosConsumo];
    const idPuntoConsumo = parseInt(event.target.value);
    const index = listaPuntosConsumo.findIndex(t => t.ptcIderegistro === idPuntoConsumo);
    listaPuntosConsumo[index].seleccionado = event.target.checked;
    this.setState({ listaPuntosConsumo: [...listaPuntosConsumo] });
    //this.props.actualizarListaContratos({ medidores: [...medidores] });
  };

  /**
   * Renderiza el selector de puntos de consumo.
   * @returns {Component}
   */
  renderSelectorPuntosConsumo = () => {
    return (
      <SelectorMultiple
        titulo='Puntos de Consumo'
        propTexto='ptcoNombre'
        propValor='ptcIderegistro'
        seleccionarItem={this.seleccionarPuntoConsumo}
        lista={getProp(this.state, 'listaPuntosConsumo', [])}
        cols={4}
      />
    );
  };

  /**
   * Método encargado de mostrar el formulario
   * @returns {Object}
   */
  render() {
    const proceso = this.state.proceso;
    return (
      <Fragment>
        <Botonera funciones={this.obtenerFunciones()} />

        <div className='conf-general row mt-5'>
          <Combo
            opciones={listaProcesos}
            propTexto='texto'
            propValor='valor'
            label='Procesos:'
            name='proceso'
            value={this.state.proceso}
            onChange={this.controlarCambio}
          />
          {
            (proceso != CODIGOS_PROCESOS.LECTURAS && proceso != CODIGOS_PROCESOS.PERDIDAS_GASIFICACION) && (
              <Fecha
                label='Periodo:'
                name='periodo'
                fecha={this.state.periodo}
                sinDia={true}
                onChange={this.controlarCambio}
              />
            )
          }
          {
            (
              proceso === CODIGOS_PROCESOS.LECTURAS
              || proceso === CODIGOS_PROCESOS.FACTURAS
              || proceso == CODIGOS_PROCESOS.PERDIDAS_GASIFICACION
              || proceso == CODIGOS_PROCESOS.INDICE_PERDIDAS_EMPRESA
              || proceso == CODIGOS_PROCESOS.INDICE_PERDIDAS_CONSUMO
              || proceso == CODIGOS_PROCESOS.LECTURAS_ESPECIALES
            )
            && this.renderProcesoLecturas()
          }
        </div>
        {/* {this.state.proceso === 'IP' &&
          this.renderProcesoIndicePerdidas()
        } */}
        {this.state.proceso === 'C' &&
          this.renderProcesoCreg240()
        }

      </Fragment>
    );
  };
}

GestionCalculoIndicePerdidas.propTypes = {
  history: PropTypes.object,
  mostrarAlerta: PropTypes.func
};

const mapStateToProps = state => {
  return state.calculoPerdidas;
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    mostrarAlerta,
    actualizarValidarCalculoPerdidas
  }, dispatch);
};

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionCalculoIndicePerdidas);

export { VistaRedux as RGestionCalculoIndicePerdidas };
