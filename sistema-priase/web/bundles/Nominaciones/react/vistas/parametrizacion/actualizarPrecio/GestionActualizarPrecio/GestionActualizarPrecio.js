import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { formatearArray, parsearJSONUniPropiedad, obtenerDatosRespuesta, limpiarHistorico } from '../../../../global/util_nominaciones';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { CLASES_UNIDADES } from '../../../../global/constantes';
import { RConsultaContratos } from '../../../contratos/ConsultaContratos';
import './GestionActualizarPrecio.scss';
import RUTAS_VISTA from '../../../../global/rutas_vista';
import { toast } from 'react-toastify';

const listaOpciones = [
  { texto: '%IPC', id: 'IPC' },
  { texto: 'Aporte GNV', id: 'GNV' },
];


const GNC = 'GNC';
const CONEXION = 'CNX';
const GNVS = 'GNCV';
const ESTADO_ACTIVO = 'A';

class GestionActualizarPrecio extends Component {
  state = {
    // Datos de la entidad
    listaContratosActualizados: [],
    listaHistorico: [],
    listaTipo: [],
    listaEstados: [],
    listaRutas: [],
    tipo: '',
    aporteGNV: '',
    porcentajeIPC: '',
    tipoContrato: '',
    nombreTipoContrato: '',
    //Estado de la aplicación
    mostrarModalConsulta: false,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    if (state && state.listaContratos) {
      this.cargarDatos(state);
    }

    const peticiones = [
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_ESTADOS, { criterio: '', idClase: CLASES_UNIDADES.ESTADOS_CONTRATO }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { idClase: CLASES_UNIDADES.TIPO_CONTRATO, criterio: '' })
    ];

    axios.all(peticiones)
      .then(
        axios.spread((estados, tiposContrato) => {
          const datosAplicacion = {
            listaEstados: [],
            listaTipo: []
          };
          datosAplicacion.listaTipo = formatearArray(parsearJSONUniPropiedad(tiposContrato.data.datos));
          datosAplicacion.listaEstados = obtenerDatosRespuesta(estados);
          this.setState({ ...datosAplicacion });
        })
      );
  }

  /**
   * Método encargado de limpiar los campos del formulario al momento de ejecutar el botón limpiar
0   */
  limpiarFormularioTotal = () => {
    this.setState({
      // Datos de la entidad
      listaHistorico: [],
      listaContratosActualizados: [],
      listaRutas: [],
      aporteGNV: '',
      porcentajeIPC: '',
      tipoContrato: '',
      tipo: '',
    });
    limpiarHistorico(this.props);
  };

  /**
   * Método encargado de limpiar el formulario editar al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormularioTotal();
  };

  /**
   * Método encargado de generar los botones del formulario
   * @returns {Object}
   */
  obtenerFunciones = () => {
    return [
      { texto: 'Consultar Contrato', callback: this.consultarEntidad },
      { texto: 'Actualizar', callback: this.actualizarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormularioTotal },
    ];
  };

  /**
   * Método encargado de abrir la ventana modal del boton de consulta
   * @returns {bool}
   */
  consultarEntidad = () => {
    if (this.state.tipo == '' || this.state.tipo == '-1') {
      toast.error('Debe seleccionar el tipo de actualización');
      return;
    }
    const estadoActivo = this.obtenerIdEstado(ESTADO_ACTIVO);
    if (estadoActivo == -1) {
      return;
    }
    this.props.history.push({
      pathname: RUTAS_VISTA.CONSULTA_CONTRATOS.url,
      state: {
        interfazGestion: RUTAS_VISTA.GESTION_ACTUALIZAR_PRECIO.url,
        seleccionMultiple: true,
        estadosContrato: [estadoActivo],
        inhabilitarEstado: true,
        tiposContrato: this.obtenerTiposContrato(),
        tiposContratoDisabled: true,
        tipoPrecio: this.state.tipo
      }
    });
  };

  /**
   * Método encargado de obtener el identificador del estado del contrato dado un codigo
   * @param {String} codigoEstado Codigo de estado
   * @returns {number}
   */
  obtenerIdEstado = (codigoEstado) => {
    const { listaEstados } = this.state;
    if (!Util.validarArreglo(listaEstados)) {
      this.props.mostrarAlerta('Error de configuración', 'No hay estados configurados.');
      return -1;
    }
    const estado = listaEstados.find(e => (JSON.parse(e.uniPropiedad).estado == codigoEstado));
    if (estado == null) {
      return -1;
    }
    return estado.uniIderegistro;
  };

  /**
   * Obtener tipos contrato.
   * @return {array}
   */
  obtenerTiposContrato = () => {
    const { listaTipo } = this.state;
    const gnc = listaTipo.find(t => t.listaPropiedades.tipocontrato == GNC);
    const gnvs = listaTipo.find(t => t.listaPropiedades.tipocontrato == GNVS);
    const conexion = listaTipo.find(t => t.listaPropiedades.tipocontrato == CONEXION);
    if (this.state.tipo == 'IPC') {
      return [gnc.listaPropiedades.tipocontrato, conexion.listaPropiedades.tipocontrato];
    } else if (this.state.tipo == 'GNV') {
      return [gnvs.listaPropiedades.tipocontrato];
    }
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { aporteGNV, porcentajeIPC, tipo, listaContratosActualizados } = this.state;
    //Validaciones
    if (tipo === '-1' || tipo === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de actualización que desea realizar' } };
    }
    if (tipo === 'IPC') {
      if (porcentajeIPC < 0) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El porcentaje ipc no puede ser menor a 0' } };
      }

      if (porcentajeIPC > 100) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El porcentaje ipc no puede ser mayor a 100' } };
      }

      if (isNaN(porcentajeIPC)) {
        return { respuesta: false, mensaje: { titulo: 'Datos Erroneos', mensaje: 'El porcentaje ipc debe ser un número' } };
      }

      if (porcentajeIPC.trim() === '') {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el porcentaje IPC' } };
      }
    }

    if (tipo === 'GNV') {
      if (aporteGNV.trim() === '') {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe ingresar el aporte GNV' } };
      }

      if (aporteGNV < 0) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'El aporte GNV no puede ser menor a 0' } };
      }

      if (isNaN(aporteGNV)) {
        return { respuesta: false, mensaje: { titulo: 'Datos Erroneos', mensaje: 'El aporte GNV ipc debe ser un número' } };
      }
    }

    if (!Util.validarArreglo(listaContratosActualizados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar al menos un contrato' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de generar la tabla con el historico del contrato seleccionado
   * @param {number} idContrato Identificador del contrato seleccionado
   */
  verHistorico = (idContrato) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_ACTUALIZAR_PRECIO.CONSULTAR_HISTORICO, { idContrato: idContrato })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const listaNueva = respuesta.data.datos.map(dato => {
            dato.infonueva = JSON.parse(dato.infonueva);
            dato.infoanterior = JSON.parse(dato.infoanterior);
            return dato
          });
          this.setState({ listaHistorico: formatearArray(listaNueva) });
        }
      });
  };

  /**
   * Método encargado de eliminar el contrato de la lista de seleccionados.
   * @param {number} posicion Posición del arreglo que se desea remover.
   */
  eliminarContrato = (posicion) => {
    const lista = [...this.state.listaContratosActualizados];
    lista.splice(posicion, 1);
    this.setState({
      listaContratosActualizados: lista,
      listaHistorico: []
    });
  };

  /**
   * @method
   * Método encargado de listar las rutas del contrato
   * @param {Array} rutas Rutas de del contrato
   */
  listarRutas = (rutas) => {
    this.setState({ listaRutas: rutas });
  }

  /**
   * @method
   * Método encargado de mostrar la lista de rutas
   * @returns {JSX}
   */
  renderRutas = () => {
    const { listaRutas } = this.state;
    if (!Util.validarArreglo(listaRutas)) {
      return;
    }
    return (
      <table className="table table-bordered mt-5">
        <thead>
          <tr>
            <th colSpan={2} className='text-center'>Lista Rutas</th>
          </tr>
          <tr>
            <th>Ruta</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {listaRutas.filter(r => r.seleccionado).map(r => (
            <tr key={r.uniIderegistro}>
              <td>{r.uniNombre1}</td>
              <td>{r.cntuVlrunitario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  /**
   * Método encargado de mostrar la tabla con los contratos actualizados
   * @returns {Object}
   */
  renderTablaContratos = () => {
    return (
      <Fragment>
        <h2 className='color-black m-all-0'>Lista Contratos</h2>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Tercero</th>
              <th>No Contrato</th>
              <th>Valor GNV</th>
              <th>Porcentaje IPC</th>
              <th>Precio</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.listaContratosActualizados.map((dato, index) => {
              return (
                <tr key={dato.cntIderegistro}>
                  <td>{dato.terIdeagente.terNomcompleto}</td>
                  <td>{dato.cntNumero}</td>
                  <td>{dato.cntValoraportegnv}</td>
                  <td>{dato.cntIpc}</td>
                  <td>{dato.cntPreciopesos}</td>
                  <td>
                    <button
                      className="btn-primary btn-buscador input-group-btn"
                      title='Eliminar'
                      onClick={() => {
                        this.eliminarContrato(index)
                      }}><i className='fa fa-fw fa-minus'></i>
                    </button>
                    <button
                      className="btn-primary btn-buscador input-group-btn"
                      title='Detalle'
                      onClick={() => {
                        this.verHistorico(dato.cntIderegistro)
                      }}><i className='fa fa-fw fa-search'></i>
                    </button>
                    <button
                      className="btn-primary btn-buscador input-group-btn"
                      title='Rutas'
                      onClick={() => {
                        this.listarRutas(dato.listaRutas)
                      }}><i className='fa fa-fw fa-info-circle'></i>
                    </button>
                  </td>
                </tr>
              );
            })
            }
          </tbody>
        </table>
      </Fragment>
    );
  };

  /**
   * Método encargado de convertir traida en el histórico a Date
   * @param {number} fechaModificacion Fecha traida en la consulta del histórico
   * @returns {Date}
   */
  obtenerFecha = (fechaModificacion) => {
    let fecha = new Date(fechaModificacion);
    const anio = fecha.getFullYear();
    const dia = fecha.getDate();
    const mes = fecha.getMonth();
    return `${((dia < 9) ? '0' : '')}${dia}/${(mes < 9) ? '0' : ''}${(mes + 1)}/${anio}`;
  };

  /**
   * Método encargado de obtener el valor actual de los historicos
   * @param {number} posicion del historico.
   * @returns {number}
   */
  obtenerValorActualHistoricoPrecio = (posicion) => {
    const lista = [...this.state.listaHistorico];
    return lista[posicion].precio;
  };

  /**
   * Método encargado de obtener el valor actual de los historicos
   * @param {number} posicion del historico.
   * @returns {number}
   */
  obtenerValorActualHistorico = (posicion) => {
    const lista = [...this.state.listaHistorico];
    return lista[posicion].ipc;
  };

  /**
   * Método encargado de mostrar la tabla con los contratos actualizados
   * @returns {Object}
   */
  renderTablaActualizados = () => {
    return (
      <table className='table table-striped mt-5'>
        <thead>
          <tr>
            <th colSpan={9} className='text-center'>Lista Histórico</th>
          </tr>
          <tr>
            <th>Fecha de Modificación</th>
            <th>Contrato</th>
            {this.state.tipo === 'IPC' &&
              <Fragment>
                <th>Ruta</th>
                <th>Valor Ipc Actual</th>
                <th>Valor IPC Antiguo</th>
              </Fragment>
            }
            {
              this.state.tipo === 'GNV' &&
              <Fragment>
                <th>Aporte GNV Actual</th>
                <th>Aporte GNV Antiguo</th>
              </Fragment>
            }
          </tr>
        </thead>
        <tbody>
          {this.state.listaHistorico.map((dato, index2) => {
            return (
              <Fragment>
                {
                  Util.validarArreglo(dato.infonueva.rutas) && dato.infonueva.rutas.map((r, index) => {
                    return (
                      <Fragment>
                        <tr key={index2}>
                          <td>{dato.fecha.substr(0, 10)}</td>
                          <td>{dato.numero}</td>
                          <td>{r.ruta}</td>
                          <td>{r.cntuVlrunitario}</td>
                          <td>{dato.infoanterior.rutas[index].cntuVlrunitario}</td>
                        </tr>
                      </Fragment>
                    )
                  })
                }
                {
                  this.state.tipo === 'GNV' &&
                  <Fragment>
                    <tr key={index2}>
                      <td>{dato.fecha.substr(0, 10)}</td>
                      <td>{dato.numero}</td>
                      <td>{dato.infonueva.cntValoraportegnv}</td>
                      <td>{dato.infoanterior.cntValoraportegnv}</td>
                    </tr>
                  </Fragment>
                }
              </Fragment>
            )
          })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de generar un objeto con los datos para actualizar los contratos
   * @returns {Object}
   */
  obtenerObjeto = () => {
    const { aporteGNV, porcentajeIPC, listaContratosActualizados } = this.state;
    const lista = listaContratosActualizados.map((dato) => {
      return {
        cntIderegistro: dato.cntIderegistro,
        cntPreciopesos: dato.cntPreciopesos,
        cntPrecio: dato.cntPrecio,
        cntIpc: porcentajeIPC == '' ? null : porcentajeIPC,
        cntVersion: dato.cntVersion,
        cntValoraportegnv: aporteGNV == '' ? null : aporteGNV,
      }
    });
    return lista;
  };

  /**
   * @method
   * Método encargado de actualizar los contratos
   * @returns {bool}
   */
  actualizarEntidad = () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    const entidadGuardar = this.obtenerObjeto();

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_ACTUALIZAR_PRECIO.EDITAR_CONTRATO, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormularioTotal();
        }
      });
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
   * Método encargado de controlar el valor de la lista de contratos dependiendo del tipo (IPC/GNV)
   * @returns {Array}
   */
  controlListaContratos = (tipo = '') => {
    const { listaContratosActualizados } = this.state;
    if (listaContratosActualizados.length == 0) {
      return [];
    }
    if (tipo == 'IPC') {
      if (listaContratosActualizados[0].cntValoraportegnv) {
        return []
      }
      return listaContratosActualizados;
    }
    if (listaContratosActualizados[0].cntIpc) {
      return []
    }
    return listaContratosActualizados;
  }

  /**
   * Método encargado de controlar el cambio del valor de la lectura ingresada
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambioTipo = (evento) => {
    let { listaRutas, aporteGNV, porcentajeIPC, listaTipo, tipoContrato, nombreTipoContrato, listaContratosActualizados, listaHistorico } = this.state;
    const { value } = evento.target;
    if (Array.isArray(listaTipo)) {
      const contratoGNC = listaTipo.find(p => p.uniPropiedad && p.uniPropiedad.tipocontrato == "GNC");
      const contratoGNV = listaTipo.find(p => p.uniPropiedad && p.uniPropiedad.tipocontrato == "GNV");
      if (value === 'IPC') {
        aporteGNV = '';
        tipoContrato = contratoGNC.uniIderegistro;
        nombreTipoContrato = contratoGNC.uniNombre1;
        listaContratosActualizados = this.controlListaContratos('IPC');
        listaHistorico = [];
        listaRutas = [];
      }
      if (value === 'GNV') {
        porcentajeIPC = '';
        tipoContrato = contratoGNV.uniIderegistro;
        nombreTipoContrato = contratoGNV.uniNombre1;
        listaContratosActualizados = this.controlListaContratos('GNV');
        listaHistorico = [];
        listaRutas = [];
      }
    }
    this.setState({
      tipo: value,
      aporteGNV: aporteGNV,
      porcentajeIPC: porcentajeIPC,
      tipoContrato: tipoContrato,
      nombreTipoContrato: nombreTipoContrato,
      listaContratosActualizados: listaContratosActualizados,
      listaHistorico: listaHistorico,
      listaRutas: listaRutas
    });
  };

  /**
   * Método encargado de cerrar la ventana modal del botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * @method
   * Método encargado de llenar llenar una lista con los contratos seleccionados
   * @param {Object} state Datos de los contratos seleccionados
   */
  cargarDatos = async (state) => {
    let contratosNuevos = [];
    for (let index = 0; index < state.listaContratos.length; index++) {
      let contrato = { ...state.listaContratos[index] };
      const { data: { datos } } = await axios.post(RUTAS_API.CONTRATOS.CONSULTAR_DETALLE_CONTRATO, { idContrato: contrato.cntIderegistro });
      contrato = { ...datos };
      contratosNuevos = [...contratosNuevos, { ...contrato }];
    }
    this.setState({
      listaContratosActualizados: contratosNuevos,
      listaHistorico: [],
      tipo: state.tipo
    });
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
            opciones={listaOpciones}
            propTexto='texto'
            propValor='id'
            label='Tipo:'
            name='tipo'
            value={this.state.tipo}
            onChange={this.controlarCambioTipo}
          />
          {this.state.tipo === 'IPC' &&
            <TextoNumerico
              aceptaDecimales={true}
              aceptaNegativos={false}
              label='IPC%:'
              value={this.state.porcentajeIPC}
              onChange={this.controlarCambio}
              name='porcentajeIPC'
            />
          }
          {this.state.tipo === 'GNV' &&
            <TextoNumerico
              aceptaDecimales={false}
              aceptaNegativos={false}
              label='Aporte GNV:'
              value={this.state.aporteGNV}
              onChange={this.controlarCambio}
              name='aporteGNV'
            />
          }
          <div className='col-12 mt28'>
            {
              this.renderTablaContratos()
            }
          </div>
          <div className='col-12'>
            {this.state.listaHistorico.length > 0 &&
              this.renderTablaActualizados()
            }
          </div>
        </div>
        {this.renderRutas()}
      </Fragment>
    );
  };
}

GestionActualizarPrecio.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionActualizarPrecio);

export { VistaRedux as RGestionActualizarPrecio };
