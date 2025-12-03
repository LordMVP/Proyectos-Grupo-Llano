import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import './GestionAprovacionCuentaBalance.scss';
import { RConsultaPuntos } from '../ConsultaPuntos';
const listaEstados = [
  { texto: 'Pendiente', id: 'P' },
  { texto: 'Aprobado', id: 'A' },
  { texto: 'Rechazado', id: 'I' },
];

class GestionAprovacionCuentaBalance extends Component {

  state = {
    // Datos de la entidad
    listaPuntosSalida: [],
    listaPuntosSalidaNegativos: [],
    listaPuntosSalidaAgregados: [],
    listaPuntosSalidaNegativosAgregados: [],
    puntoSalida: '',
    puntoSalidaNegativo: '',
    mostrarModalConsulta: false,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    const peticiones = [
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_APROBACION_CUENTA_BALANCE.CONSULTAR_PUNTOS_POSITIVOS_PENDIENTES),
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_APROBACION_CUENTA_BALANCE.CONSULTAR_PUNTOS_NEGATIVOS_PENDIENTES),
    ];
    axios.all(peticiones)
      .then(axios.spread((puntosPositivos, puntosNegativos) => {
        const datosAplicacion = {
          listaPuntosSalida: [],
          listaPuntosSalidaNegativos: [],
        };
        if (puntosPositivos.data.codigo > 0) {
          datosAplicacion.listaPuntosSalida = this.construirObjetoPositivos(puntosPositivos.data.datos);
        }
        if (puntosNegativos.data.codigo > 0) {
          datosAplicacion.listaPuntosSalidaNegativos = this.construirObjetoNegativos(puntosNegativos.data.datos);
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado de construir un objeto con los puntos positivos consultados
   * @param {Object} listaPuntosPositivos Puntos positivos consultados
   * @returns {Object}
   */
  construirObjetoPositivos = (listaPuntosPositivos) => {
    const lista = listaPuntosPositivos.map((dato, index) => {
      return {
        ctbIderegistro: dato.ctbIderegistro,
        ctbDescripcion: dato.ctbDescripcion,
        cntIdecontrato: dato.cntIdecontrato,
        ctbNuevosaldo: dato.ctbNuevosaldo,
        ctbFechacruce: dato.ctbFechacruce,
        ctbSaldonegativo: dato.ctbSaldonegativo,
        ctbSaldopositivo: dato.ctbSaldopositivo,
        ctbEstado: dato.ctbEstado,
        ctbFecha: dato.ctbFecha,
        empIderegistro: dato.empIderegistro,
        ptsaIdenegativo: {
          ptsaIderegistro: dato.ptsaIdenegativo.ptsaIderegistro
        },
        pstaCodigobeo: dato.ptsaIdepositivo.pstaCodigobeo,
        ptsaNombre: dato.ptsaIdepositivo.ptsaNombre,
        ptsaTipocalorifico: dato.ptsaIdepositivo.ptsaTipocalorifico,
        ptsaIderegistro: dato.ptsaIdepositivo.ptsaIderegistro,
        uniIdemedida: {
          uniIderegistro: dato.uniIdemedida.uniIderegistro
        },
        titulo: `${dato.ptsaIdepositivo.ptsaNombre}-${dato.ctbFechacruce}`,
      };
    });
    return lista;
  };

  /**
   * Método encargado de cerrar la ventana modal de botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false,
    });
  };

  /**
   * Método encargado de construir un objeto con los puntos negativos consultados
   * @param {Object} listaPuntosNegativos Puntos negativos consultados
   * @returns {Object}
   */
  construirObjetoNegativos = (listaPuntosNegativos) => {
    const lista = listaPuntosNegativos.map((dato, index) => {
      return {
        ctbIderegistro: dato.ctbIderegistro,
        ctbDescripcion: dato.ctbDescripcion,
        cntIdecontrato: dato.cntIdecontrato,
        ctbNuevosaldo: dato.ctbNuevosaldo,
        ctbFechacruce: dato.ctbFechacruce,
        ctbSaldonegativo: dato.ctbSaldonegativo,
        ctbSaldopositivo: dato.ctbSaldopositivo,
        ctbEstado: dato.ctbEstado,
        ctbFecha: dato.ctbFecha,
        empIderegistro: dato.empIderegistro,
        ptsaIdepositivo: {
          ptsaIderegistro: dato.ptsaIdepositivo.ptsaIderegistro
        },
        pstaCodigobeo: dato.ptsaIdenegativo.pstaCodigobeo,
        ptsaNombre: dato.ptsaIdenegativo.ptsaNombre,
        ptsaTipocalorifico: dato.ptsaIdenegativo.ptsaTipocalorifico,
        ptsaIderegistro: dato.ptsaIdenegativo.ptsaIderegistro,
        uniIdemedida: {
          uniIderegistro: dato.uniIdemedida.uniIderegistro
        },
        uniIdetipomercado: {
          uniIderegistro: dato.ptsaIdenegativo.uniIdetipomercado.uniIderegistro
        },
        titulo: `${dato.ptsaIdenegativo.ptsaNombre}-${dato.ctbFechacruce}`,
      };
    });
    return lista;
  };

  /**
   * Método encargado de limpiar los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      listaPuntosSalidaAgregados: [],
      listaPuntosSalidaNegativosAgregados: [],
      puntoSalida: '-1',
      puntoSalidaNegativo: '-1',
      mostrarModalConsulta: false,
    });
  };

  /**
   * Método encargado de limpiar el formulario al momento de salir de la interfaz
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
      { texto: 'Generar Archivo', callback: this.generarArchivo },
      { texto: 'Consultar', callback: this.consultarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de abrir la ventana modal del botón de consulta
   */
  consultarEntidad = () => {
    this.setState({
      mostrarModalConsulta: true,
    });
  };

  /**
   * Método encargado de generar el archivo de provision
   * @returns {bool}
   */
  generarArchivo = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_APROBACION_CUENTA_BALANCE.REPORTE_PROVISION)
      .then(respuesta => {
        if (respuesta.data.codigo < 0) {
          return false;
        }
        let a = document.createElement('a');
        a.href = 'data:' + { type: "Content-Type: application/vnd.ms-excel" } + ';base64,' + respuesta.data.datos;
        a.download = "Archivo Provisión.csv";
        a.target = '_blank';
        a.click();
      });
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {bool}
   */
  validarFormulario = () => {
    //Variables
    const { listaPuntosSalidaAgregados, listaPuntosSalidaNegativosAgregados } = this.state;
    // Validaciones
    if (!Util.validarArreglo(listaPuntosSalidaAgregados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un punto de salida pendiente.' } };
    }

    if (!Util.validarArreglo(listaPuntosSalidaNegativosAgregados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar al menos un punto de salida negativo.' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de consultar los puntos de salida positivos despues de cambiar el estado
   */
  consultarPuntosPositivos = () => {
    let { listaPuntosSalida } = this.state;
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_APROBACION_CUENTA_BALANCE.CONSULTAR_PUNTOS_POSITIVOS_PENDIENTES)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          listaPuntosSalida = this.construirObjetoPositivos(respuesta.data.datos);
        }
        if (respuesta.data.codigo <= 0) {
          listaPuntosSalida = [];
        }
        this.setState({
          listaPuntosSalida: listaPuntosSalida,
        });
      });
  };

  /**
   * Método encargado de construir el objeto para realizar el calculo
   * @param {Object} datos Datos del punto de salida seleccionado para el calculo
   */
  obtenerObjetoCalcular = (datos) => {
    let objeto = {
      ctbIderegistro: datos.ctbIderegistro,
      cntIdecontrato: {
        cntIderegistro: datos.cntIdecontrato.cntIderegistro
      },
      ptsaIdepositivo: {
        ptsaIderegistro: datos.ptsaIdepositivo.ptsaIderegistro
      },
      ptsaIdenegativo: {
        ptsaIderegistro: datos.ptsaIderegistro,
      },
      uniIdemedida: {
        uniIderegistro: datos.uniIdemedida.uniIderegistro
      },
    };
    return objeto;
  };

  /**
   * Método encargado de realizar los calculos para los valores ingresados en la tabla de puntos negativos
   * @param {number} posicion Posición del punto negativo en la lista
   */
  calcular = (posicion) => {
    const listaPuntosSalidaNegativosAgregados = [...this.state.listaPuntosSalidaNegativosAgregados];
    const datos = listaPuntosSalidaNegativosAgregados[posicion];
    const objetoCalcular = this.obtenerObjetoCalcular(datos);
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_APROBACION_CUENTA_BALANCE.CALCULO, objetoCalcular)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          listaPuntosSalidaNegativosAgregados[posicion].calculoTotal = respuesta.data.datos.prcbTotalservicio;
          listaPuntosSalidaNegativosAgregados[posicion].tarifaUSD = respuesta.data.datos.uniIdetarifausdkpc.conValor;
          listaPuntosSalidaNegativosAgregados[posicion].tmrImpuesto = respuesta.data.datos.prcbTrmimpuesto;
          listaPuntosSalidaNegativosAgregados[posicion].tarifa = respuesta.data.datos.uniIdetarifapesoskpc.conValor;
          this.setState({
            listaPuntosSalidaNegativosAgregados: listaPuntosSalidaNegativosAgregados
          });
        }
      });
  };

  /**
   * Método encargado de validar que no se agreguen puntos repetidos
   * @returns {number}
   */
  validarRepetidoNegativo = (idPunto) => {
    const lista = [...this.state.listaPuntosSalidaNegativosAgregados];
    const index = lista.findIndex(p => idPunto == p.ptsaIderegistro);
    return index >= 0;
  };

  /**
   * Método encargado de agregar el punto negativo a la tabla
   * @returns {bool}
   */
  agregarSeleccionadoNegativo = () => {
    const { puntoSalidaNegativo, listaPuntosSalidaNegativos } = this.state;
    let { listaPuntosSalidaNegativosAgregados } = this.state;
    if (!Util.validarArreglo(listaPuntosSalidaNegativos)) {
      return false;
    }
    if (puntoSalidaNegativo <= 0) {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar el punto que desea agregar');
      return false;
    }
    if (this.validarRepetidoNegativo(puntoSalidaNegativo)) {
      this.props.mostrarAlerta('Atención', 'Este punto ya se encuentra agregado en la lista');
      return false;
    }
    const datos = listaPuntosSalidaNegativos.find(p => puntoSalidaNegativo == p.ptsaIderegistro);
    listaPuntosSalidaNegativosAgregados.push(datos);
    this.setState({
      listaPuntosSalidaNegativosAgregados: listaPuntosSalidaNegativosAgregados,
      puntoSalidaNegativo: ''
    });

  };

  /**
   * Método encargado de validar que no se agreguen puntos repetidos
   * @returns {number}
   */
  validarRepetidoPositivo = (idPunto) => {
    const lista = [...this.state.listaPuntosSalidaAgregados];
    const index = lista.findIndex(p => idPunto == p.ptsaIderegistro);
    return index >= 0;
  };

  /**
   * Método encargado de agregar el punto pendiente a la tabla
   * @returns {bool}
   */
  agregarSeleccionado = () => {
    const { puntoSalida, listaPuntosSalida } = this.state;
    let { listaPuntosSalidaAgregados } = this.state;
    if (!Util.validarArreglo(listaPuntosSalida)) {
      return false;
    }
    if (this.validarRepetidoPositivo(puntoSalida)) {
      this.props.mostrarAlerta('Atención', 'Este punto ya se encuentra agregado en la lista');
      return false;
    }
    if (puntoSalida <= 0) {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar el punto que desea agregar');
      return false;
    }
    const datos = listaPuntosSalida.find(p => puntoSalida == p.ptsaIderegistro);
    listaPuntosSalidaAgregados.push(datos);
    this.setState({ listaPuntosSalidaAgregados: listaPuntosSalidaAgregados, puntoSalida: '' });
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
   * Método encargado de eliminar de la lista el punto de salida positivo
   * @param {number} posicion Posición del punto de salida en la lista
   */
  eliminarPunto = (posicion) => {
    const listaPuntosSalidaAgregados = this.state.listaPuntosSalidaAgregados;
    listaPuntosSalidaAgregados.splice(posicion, 1);
    this.setState(listaPuntosSalidaAgregados);
  };

  /**
   * Método encargado de eliminar de la lista el punto de salida positivo
   * @param {number} posicion Posición del punto de salida en la lista
   */
  eliminarPuntoNegativo = (posicion) => {
    const listaPuntosSalidaNegativosAgregados = this.state.listaPuntosSalidaNegativosAgregados;
    listaPuntosSalidaNegativosAgregados.splice(posicion, 1);
    this.setState(listaPuntosSalidaNegativosAgregados);
  };

  /**
   * Método encargado de controlar el cambio del valor del estado del punto positivo
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   * @param {number} posicion Posición del punto que se le cambiara el estado
   */
  controlarCambioEstado = (evento, posicion) => {
    let listaPuntosSalidaAgregados = [...this.state.listaPuntosSalidaAgregados];
    listaPuntosSalidaAgregados[posicion].ctbEstado = evento.target.value;
    const dato = listaPuntosSalidaAgregados[posicion];
    this.setState({ listaPuntosSalidaAgregados: listaPuntosSalidaAgregados });
    this.cambiarEstado(dato);
  };

  /**
   * Método encargado de construir el objeto para realizar el cambio de estado
   * @param {Object} datos Datos del punto de salida seleccionado para el cambio de estado
   */
  obtenerObjetoEstado = (datos) => {
    let objeto = {
      ctbIderegistro: datos.ctbIderegistro,
      cntIdecontrato: {
        cntIderegistro: datos.cntIdecontrato.cntIderegistro
      },
      ptsaIdepositivo: {
        ptsaIderegistro: datos.ptsaIderegistro
      },
      uniIdemedida: {
        uniIderegistro: datos.uniIdemedida.uniIderegistro
      },
      ctbEstado: datos.ctbEstado,
      ctbFechacruce: datos.ctbFechacruce,
    };
    return objeto;
  };

  /**
   * Método encargado de cambiar el estado del punto en la base de datos
   * @param {Object} datos Datos del punto de salida al cual se le esta modificando el estado
   */
  cambiarEstado = (datos) => {
    const objeto = this.obtenerObjetoEstado(datos);
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_APROBACION_CUENTA_BALANCE.ACTUALIZAR_PUNTO, objeto)
      .then(respuesta => {
        if (respuesta.data.codigo > 0)
          this.consultarPuntosPositivos();
      });
  };

  /**
   * Método encargado de mostrar la tabla de los puntos pendientes agregados
   * @returns {Object}
   */
  renderTablaPendientes = () => {
    return (
      <table className='table table-striped mt25 nodisplaylabel'>
        <thead>
          <tr>
            Lista Puntos Positivos
          </tr>
          <tr>
            <th>Punto De Salida</th>
            <th>Estado</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.listaPuntosSalidaAgregados.map((dato, index) => {
              return (
                <tr key={"punto_" + dato.ptsaIderegistro}>
                  <td>{dato.ptsaNombre}</td>
                  <td>
                    <Combo
                      opciones={listaEstados}
                      propTexto='texto'
                      propValor='id'
                      name='estado'
                      value={dato.ctbEstado}
                      cols={12}
                      onChange={(evento) => {
                        this.controlarCambioEstado(evento, index)
                      }}
                    />
                  </td>
                  <td>
                    <button className='btnEliminar' onClick={() => {
                      this.eliminarPunto(index);
                    }}>
                      X
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  };

  /**
   * Método encargado de mostrar la tabla de los puntos negativos agregados
   * @returns {Object}
   */
  renderTablaNegativos = () => {
    return (
      <table className='table table-striped mt25'>
        <thead>
          <tr>
            <th>Punto De Salida</th>
            <th>Tarifa USD/KPC</th>
            <th>TMR impuesto</th>
            <th>Tarifa $/KPC</th>
            <th>Calcular</th>
            <th>Total Servicio</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.listaPuntosSalidaNegativosAgregados.map((dato, index) => {
              return (
                <tr key={"punto_" + dato.ptsaIderegistro}>
                  <td>{dato.ptsaNombre}</td>
                  <td>{dato.tarifaUSD}</td>
                  <td>{dato.tmrImpuesto}</td>
                  <td>{dato.tarifa}</td>
                  <td><button className='btn btn-primary' onClick={() => {
                    this.calcular(index);
                  }}>Calcular</button></td>
                  <td>{dato.calculoTotal}</td>
                  <td>
                    <button className='btnEliminar' onClick={() => {
                      this.eliminarPuntoNegativo(index);
                    }}>
                      X
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
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
          <Combo
            opciones={this.state.listaPuntosSalida}
            propTexto='ptsaNombre'
            propValor='ptsaIderegistro'
            label='Puntos Positivos Pendientes:'
            name='puntoSalida'
            value={this.state.puntoSalida}
            onChange={this.controlarCambio}
          />
          <div className='col-4 mt-25'>
            <button className='btn btn-primary' onClick={this.agregarSeleccionado}>Agregar</button>

          </div>
        </div>

        <div className='conf-general row mt-5'>
          {this.state.listaPuntosSalidaAgregados.length > 0 &&
            this.renderTablaPendientes()
          }
        </div>

        <div className='conf-general row mt-5'>
          <Combo
            opciones={this.state.listaPuntosSalidaNegativos}
            propTexto='ptsaNombre'
            propValor='ptsaIderegistro'
            label='Puntos Negativos Pendientes:'
            name='puntoSalidaNegativo'
            value={this.state.puntoSalidaNegativo}
            onChange={this.controlarCambio}
          />
          <div className='col-4 mt-25'>
            <button className='btn btn-primary' onClick={this.agregarSeleccionadoNegativo}>Agregar</button>
          </div>
        </div>

        <div className='conf-general row mt-5'>
          {this.state.listaPuntosSalidaNegativosAgregados.length > 0 &&
            this.renderTablaNegativos()
          }
        </div>
        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Puntos'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaPuntos
            esModal
          />
        </VentanaModal>
      </Fragment>
    );
  }
}

GestionAprovacionCuentaBalance.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionAprovacionCuentaBalance);

export { VistaRedux as RGestionAprovacionCuentaBalance };
