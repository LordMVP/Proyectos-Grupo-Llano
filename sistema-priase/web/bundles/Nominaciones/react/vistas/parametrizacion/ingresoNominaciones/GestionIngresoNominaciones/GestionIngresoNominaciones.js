import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, Fecha } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import { CLASES_UNIDADES } from '../../../../global/constantes';
import { RConsultaContratos } from '../../../contratos/ConsultaContratos'
import { toast } from 'react-toastify'
import './GestionIngresoNominaciones.scss';
import moment from 'moment';
import { TIPOS_UNIDADES_MEDIDA } from '../../../../global/util_nominaciones';

const VENTA = 'V';

class GestionIngresoNominaciones extends Component {

  state = {
    // Datos de la entidad
    listaActividades: [],
    listaPuntosConsumo: [],
    listaPuntosConsumoSeleccionados: [],
    listaUnidadMedida: [],
    listaEmpresas: [],
    actividad: '',
    puntoConsumo: '',
    fecha: '',
    contratoSeleccionado: '',
    idContrato: '',
    //Estado de la aplicación
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
      axios.post(RUTAS_API.PARAMETRIZACION.GESTION_INGRESO_NOMINACIONES.CONSULTAR_ACTIVIDADES, { criterio: '' }),
      axios.post(RUTAS_API.CONFIGURACION.CONSULTAR_UNIDAD, { criterio: '', idClase: CLASES_UNIDADES.ACTIVIDADES }),
      axios.post(RUTAS_API.PARAMETRIZACION.UNIDADES_MEDIDA.CONSULTAR_POR_ESTRUCTURA, { criterio: '', categoria: TIPOS_UNIDADES_MEDIDA.CANTIDAD }),
      axios.post(RUTAS_API.GLOBAL.CONSULTAR_FECHA_ACTUAL)
    ];
    axios.all(peticiones)
      .then(axios.spread((actividadesCreadas, actividades, unidadMedida, fechaActual) => {
        const datosAplicacion = {
          listaActividades: [],
          listaUnidadMedida: [],
        };
        if (actividadesCreadas.data.codigo > 0) {
          datosAplicacion.listaActividades = this.construirObjecto(actividadesCreadas.data.datos, actividades.data.datos);
        }

        if (unidadMedida.data.codigo > 0) {
          datosAplicacion.listaUnidadMedida = unidadMedida.data.datos;
        }

        if (fechaActual.data.codigo > 0) {
          datosAplicacion.fecha = this.formatearFecha(fechaActual.data.datos);
        }

        this.setState({ ...datosAplicacion });
      }));
  };

  /**
 * Método encargado de convertir la fecha a formato YYYY/MM/DD
 * @returns {String}
 */
  formatearFecha = (timestamp) => {
    const fecha = new Date(timestamp);
    const anio = fecha.getFullYear();
    let mes = (1 + fecha.getMonth()).toString();
    mes = mes.length > 1 ? mes : '0' + mes;
    let dia = fecha.getDate().toString();
    dia = dia.length > 1 ? dia : '0' + dia;
    return anio + '-' + mes + '-' + dia;
  };

  /**
   * Método encargado de armar un objecto con los datos de actividades consultados
   * @param {Object} actividadesCreadas Actividades que han sido creadas en la interfaz de horarios
   * @param {Object} actividades Actividades generales
   * @returns {Object}
   */
  construirObjecto = (actividadesCreadas, actividades) => {
    const actividadesC = actividadesCreadas;
    const actividad = actividades;
    if (!Util.validarArreglo(actividadesC) || !Util.validarArreglo(actividad)) {
      return [];
    }
    for (let index = 0; index < actividadesC.length; index++) {
      const contador = index;
      const actividadCreada = actividadesC[index];
      for (let f = 0; f < actividad.length; f++) {
        const actividadGeneral = actividad[f];
        if (actividadCreada.uniIdeactividad.uniIderegistro == actividadGeneral.uniIderegistro) {
          actividadesC[contador].nombre = actividadGeneral.uniNombre1
        }
      }
    }
    return actividadesC;
  };

  /**
   * Método encargado de limpiar los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      fecha: ' ',
      actividad: '-1',
      contratoSeleccionado: '',
      idContrato: '',
      listaPuntosConsumoSeleccionados: [],
      puntoConsumo: '',
      // Estado de la aplicacion
      mostrarModalConsulta: false,

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
      { texto: 'Guardar', callback: this.guardarEntidad },
      { texto: 'Limpiar', callback: this.limpiarFormulario },
    ];
  };

  /**
   * Método encargado de validar los valores de la tabla compuestos
   * @return {bool}
   */
  validarTabla = () => {
    for (let i = 0; i < this.state.listaPuntosConsumoSeleccionados.length; i++) {
      const puntoConsumo = this.state.listaPuntosConsumoSeleccionados[i];
      if (!puntoConsumo.cantidadRN || puntoConsumo.cantidadRN === '') {
        this.props.mostrarAlerta('Datos incompletos', 'Debe ingresar una cantidad para el punto de consumo: ' + puntoConsumo.ptcoNombre);
        return false;
      }
    };
    return true;
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { fecha, listaPuntosConsumoSeleccionados } = this.state;
    const fechaActual = moment().valueOf();
    //Validaciones
    if (fecha.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe seleccionar una fecha' } };
    }

    if (fecha < fechaActual) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'La fecha seleccionada no puede ser menor a la actual' } };
    }

    if (!Util.validarArreglo(listaPuntosConsumoSeleccionados)) {
      return { respuesta: false, mensaje: { titulo: 'Datos Incompletos', mensaje: 'Debe agregar al menos un punto de consumo' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de generar un objeto con los valores para guardar la entidad
   * @returns {Object}
   */
  obtenerObjeto = () => {
    const { fecha, listaPuntosConsumoSeleccionados, actividad, idContrato } = this.state;
    const lista = listaPuntosConsumoSeleccionados.map((dato) => {
      const obj = {
        nomFechanomina: fecha,
        ptcIdepuntoconsumo: { ptcIderegistro: dato.ptcIderegistro },
        nomCantidad: dato.cantidadRN,
        uniIdemedida: { uniIderegistro: dato.uniIdemedidanomin.uniIderegistro },
        actIdeactividad: { actIderegistro: actividad },
        cntIdecontrato: { cntIderegistro: (idContrato != '') ? idContrato : null },
      };
      if (dato.ptcIdepuntoconsumo) {
        obj.ptcIderegistro = dato.ptcIderegistro;
      }
      return obj;
    });
    let objetoEnviar = lista;
    return objetoEnviar;
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = () => {
    const validacion = this.validarFormulario();
    const validarTabla = this.validarTabla();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }

    if (!validarTabla) {
      return false;
    }
    const entidadGuardar = this.obtenerObjeto();

    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_INGRESO_NOMINACIONES.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventana modal del boton de consulta
   * @returns {bool}
   */
  consultarEntidad = () => {
    if (this.state.actividad == '' || this.state.actividad == '-1' || this.state.actividad == -1) {
      this.props.mostrarAlerta('Atención', 'Debe seleccionar un tipo de solicitud');
      return;
    }
    this.setState({ mostrarModalConsulta: true });
  };

  /**
   * Método encargado de cerrar la ventana del boton de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de que no se agreguen contratos repetidos
   * @param {number} idPuntoConsumo Identificador del punto de consumo seleccionado
   * @param {number} listaPuntosConsumoSeleccionados Lista con los puntos ya agregados
   * @returns {number}
   */
  validarRepetido = (idPuntoConsumo, listaPuntosConsumoSeleccionados) => {
    const lista = listaPuntosConsumoSeleccionados;
    const index = lista.findIndex(p => p.ptcIderegistro == idPuntoConsumo);
    return index >= 0;
  };

  /**
   * Método encargado de consultar la capacidad máxima de nominación por punto de consumo
   * @param {number} puntoSeleccionado Datos del punto de consumo seleccionado
   */
  consultarCapacidadMaximaNominacion = (puntoSeleccionado, fecha, actividad, listaPuntosConsumoSeleccionados = null) => {
    let objeto = {
      ptcIdepuntoconsumo: { ptcIderegistro: puntoSeleccionado.ptcIderegistro },
      actIdeactividad: { actIderegistro: actividad },
      nomFechanomina: fecha
    };
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_INGRESO_NOMINACIONES.CONSULTAR_CAPACIDAD_MAXIMA_NOMINACION, objeto)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          listaPuntosConsumoSeleccionados.push(respuesta.data.datos);
          this.setState({ listaPuntosConsumoSeleccionados: listaPuntosConsumoSeleccionados });
        }
      });
  };

  /**
   * Método encargado de agregar el contrato seleccionado a una lista
   * @returns {bool}
   */
  agregarSeleccionado = () => {
    const { listaPuntosConsumoSeleccionados, listaPuntosConsumo, puntoConsumo, actividad, listaActividades, fecha } = this.state;
    if (puntoConsumo === '' || puntoConsumo === '-1') {
      this.props.mostrarAlerta('Datos incompletos', 'Debe seleccionar un punto de consumo');
      return false;
    }

    if (actividad === '' || actividad === '-1') {
      this.props.mostrarAlerta('Datos incompletos', 'Debe el tipo de solicitud');
      return false;
    }
    if (fecha.trim() === '') {
      this.props.mostrarAlerta('Datos Incompletos', 'Debe seleccionar una fecha');
      return false;
    }
    const puntoSeleccionado = listaPuntosConsumo.find(p => p.ptcIderegistro == puntoConsumo);
    const validarRepetido = this.validarRepetido(puntoConsumo, listaPuntosConsumoSeleccionados);
    if (validarRepetido) {
      this.props.mostrarAlerta('Error', 'El punto de consumo ya se encuentra en la lista');
      return false;
    }
    this.consultarCapacidadMaximaNominacion(puntoSeleccionado, fecha, actividad, listaPuntosConsumoSeleccionados);
  };

  /**
   * Método encargado de controlar el cambio al ingresar nuevas cantidades a los puntos de consumo
   * @param {number} index Posición que se esta modificando
   * @param {Event} evento El evento que se ejecuta en el control de usuario.
   */
  controlarCambioCantidad = (index, evento) => {
    const puntosConsumo = [...this.state.listaPuntosConsumoSeleccionados];
    puntosConsumo[index].cantidadRN = evento.target.value;
    this.setState({ puntosConsumo });
  };

  /**
   * Método encargado de mostrar la tabla con los puntos de consumo agregados
   * @returns {Object}
   */
  renderTabla = () => {
    return (
      <table className='table table-striped mt28 nodisplaylabel'>
        <thead>
          <tr>
            <th>Punto de Consumo</th>
            <th>Cantidad</th>
            <th>Cantidad Maxima Nominación</th>
            <th>Unidad de Medida</th>
          </tr>
        </thead>
        <tbody>
          {this.state.listaPuntosConsumoSeleccionados.map((dato, index) => {
            return (
              <tr key={dato.ptcIderegistro}>
                <td>{dato.ptcoNombre}</td>
                <td>
                  <Input
                    value={dato.cantidadRN}
                    cols={12}
                    onChange={(evento) => {
                      this.controlarCambioCantidad(index, evento)
                    }}
                    name='cantidadRN'
                  />
                </td>
                <td>{dato.ptcMaxnominacion}</td>
                <td>{(dato.uniIdemedidanomin.uniNombre1) ? dato.uniIdemedidanomin.uniNombre1 : dato.unidadDeMedida.uniNombre1}</td>
              </tr>
            );
          })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    const nombrePropiedad = evento.target.name;
    const valor = evento.target.value;
    change[nombrePropiedad] = valor;
    let callback = null;
    if (nombrePropiedad === 'fecha') {
      callback = this.consultarPuntosConsumoNominados;
    }
    if (nombrePropiedad == 'actividad' && valor != '-1') {
      this.consultarPuntosConsumo(null, valor);
    }
    if (nombrePropiedad == 'actividad' && valor != this.state.actividad) {
      change.listaPuntosConsumoSeleccionados = [];
      change.contratoSeleccionado = '';
      change.idContrato = '';
    }

    if (nombrePropiedad == 'actividad' && valor == '-1') {
      change.listaPuntosConsumo = [];
    }
    this.setState(change, callback);
  };

  /**
   * Método encargado de consultar los puntos de consumo del contrato seleccionado
   * @param {number} idContrato Identificador del contrato seleccionado
   */
  consultarPuntosConsumo = (idContrato = null, valor) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_INGRESO_NOMINACIONES.CONSULTAR_PUNTOS_CONSUMO, { idContrato: idContrato, idActividad: valor })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaPuntosConsumo: respuesta.data.datos });
        }
        if (respuesta.data.codigo == 0) {
          this.setState({ listaPuntosConsumo: [] });
        }
      });
  };

  /**
   * Consulta los puntos de consumo nominados de una actividad en una fecha específica.
   */
  consultarPuntosConsumoNominados = () => {
    const { fecha, actividad, idContrato } = this.state;
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_INGRESO_NOMINACIONES.CONSULTAR_POR_FECHA, { fecha: fecha, idActividad: actividad, idContrato: idContrato })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          const listaNominaciones = respuesta.data.datos;
          let { listaPuntosConsumoSeleccionados } = this.state;
          listaPuntosConsumoSeleccionados = listaPuntosConsumoSeleccionados.filter(p => !p.temp);
          listaNominaciones.forEach(nominacion => {
            const index = listaPuntosConsumoSeleccionados.findIndex(p => p.ptcIderegistro === nominacion.ptcIdepuntoconsumo.ptcIderegistro);
            if (index >= 0) {
              listaPuntosConsumoSeleccionados[index].cantidadRN = nominacion.nomCantidad;
              listaPuntosConsumoSeleccionados[index].unidadDeMedida = nominacion.uniIdemedida.uniIderegistro;
              // listaPuntosConsumoSeleccionados[index].temp = true;
            } else {
              const punto = this.state.listaPuntosConsumo.find(p => p.ptcIderegistro == nominacion.ptcIdepuntoconsumo.ptcIderegistro);
              if (punto) {
                punto.cantidadRN = nominacion.nomCantidad;
                punto.unidadDeMedida = nominacion.uniIdemedida;
                punto.temp = true;
                punto.ptcMaxnominacion = nominacion.ptcIdepuntoconsumo.ptcMaxnominacion;
                listaPuntosConsumoSeleccionados.push(punto);
              }
            }
          });
          this.setState({ listaPuntosConsumoSeleccionados: listaPuntosConsumoSeleccionados })
        }
        if (respuesta.data.codigo == 0) {
          this.setState({ listaPuntosConsumoSeleccionados: [] })
        }
      });
  };

  /**
   * Método encargado de cargar los datos de la ventana modal de consulta
   * @param {Object} entidad Datos seleccionados de la consulta
   */
  cargarDatos = (entidad) => {
    const idContrato = entidad.cntIderegistro;
    const actividad = this.state.actividad;
    const contratoSeleccionado = entidad.cntNumero + ' - ' + entidad.terIdeagente.terNomcompleto;
    this.consultarPuntosConsumo(entidad.cntIderegistro, actividad),
      this.setState({
        mostrarModalConsulta: false,
        listaPuntosConsumoSeleccionados: [],
        idContrato: idContrato,
        contratoSeleccionado: contratoSeleccionado,
        puntoConsumo: '',
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
            opciones={this.state.listaActividades}
            propTexto='nombre'
            propValor='actIderegistro'
            label='Tipo de Solicitud:'
            name='actividad'
            value={this.state.actividad}
            onChange={this.controlarCambio}
          />
          <div className='col-4 form-group'>
            <label htmlFor="txtBuscarContrato">Contrato:</label>
            <div className='input-group'>
              <input type="text" id="txtBuscarContrato" className='form-control' placeholder='Buscar Contrato' value={this.state.contratoSeleccionado} disabled={true} />
              <div className='form-group-btn'>
                <button className='btn btn-primary' onClick={this.consultarEntidad}><i className='fa fa-fw fa-search'></i></button>
              </div>
            </div>
          </div>
          <Fecha
            label='Fecha:'
            name='fecha'
            fecha={this.state.fecha}
            onChange={this.controlarCambio}
            extra={{ disabled: (typeof this.state.actividad === 'string' && (this.state.actividad.trim() == '' || this.state.actividad == '-1')) }}
          />
          <Combo
            opciones={this.state.listaPuntosConsumo}
            propTexto='ptcoNombre'
            propValor='ptcIderegistro'
            label='Punto de Consumo:'
            name='puntoConsumo'
            value={this.state.puntoConsumo}
            onChange={this.controlarCambio}
            extra={{ disabled: (typeof this.state.fecha !== 'string' || this.state.fecha.trim() == '') }}
          />
          <div className='form-group col-4'>
            <button className='btn btn-primary m-t-24' onClick={this.agregarSeleccionado}><i className='fa fa-fw fa-plus'></i> Agregar Punto de Consumo</button>
          </div>
          {
            this.renderTabla()
          }
        </div>
        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo={'Consultar Contratos'}
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaContratos
            esModal
            seleccionarEntidad={this.cargarDatos}
            estadosContrato={['A']}
            inhabilitarEstado={true}
            inhabilitarTercero={true}
            tipoNegocio={VENTA}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionIngresoNominaciones.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionIngresoNominaciones);

export { VistaRedux as RGestionIngresoNominaciones };
