import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util } from 'appfuture-react';
import axios from 'axios';

import RUTAS_API from '../../../global/rutas_api';
import { mostrarAlerta } from '../../../store/actions/AplicacionAcciones';

import './GestionAdministrarRutasRecoleccion.scss';

const MACRO_RUTA = 'macro';
const MICRO_RUTA = 'micro';
const listaDias = [
  { texto: 'Lunes', valor: 'Lunes' },
  { texto: 'Martes', valor: 'Martes' },
  { texto: 'Miercoles', valor: 'Miercoles' },
  { texto: 'Jueves', valor: 'Jueves' },
  { texto: 'Viernes', valor: 'Viernes' },
  { texto: 'Sabado', valor: 'Sabado' },
  { texto: 'Domingo', valor: 'Domingo' },
];

class GestionAdministrarRutasRecoleccion extends Component {

  state = {
    // Datos de la entidad
    idRegistro: '',
    fechaGrabacion: '',
    usuId: '',
    macroRuta: '',
    areaPrestacion: '',
    horaInicio: '',
    horaFin: '',
    dia: '',
    microRuta: '',
    listaAreaPrestacion: [],
    listaMacroRutas: [],
    listaMicroRutas: [],
    listaHorarios: [],
    listaMicroRutasAgregadas: [],
    listaMicroDatos: [],
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
      axios.post(RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS_RECOLECCION.CONSULTAR_TIPO_RUTA, { tipoRuta: MACRO_RUTA }),
      axios.post(RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS_RECOLECCION.CONSULTAR_MICRO_RUTA, { tipoRuta: MICRO_RUTA }),
      axios.post(RUTAS_API.PARAMETRIZACION.AREAS_PRESTACION.FILTRO, { criterio: '' }),
      axios.post(RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS_RECOLECCION.CONSULTAR_TIPO_RUTA, { tipoRuta: MICRO_RUTA }),
    ];
    axios.all(peticiones)

      .then(axios.spread((macroRutas, microRutas, areaPrestacion, microDatos) => {
        const datosAplicacion = {
          listaMacroRutas: [],
          listaMicroRutas: [],
          listaAreaPrestacion: [],
          listaMicroDatos: [],
        };
        if (macroRutas.data.codigo > 0) {
          datosAplicacion.listaMacroRutas = macroRutas.data.datos;
        }
        if (microRutas.data.codigo > 0) {
          datosAplicacion.listaMicroRutas = microRutas.data.datos;
        }
        if (areaPrestacion.data.codigo > 0) {
          datosAplicacion.listaAreaPrestacion = areaPrestacion.data.datos;
        }
        if (microDatos.data.codigo > 0) {
          datosAplicacion.listaMicroDatos = microDatos.data.datos;
        }
        this.setState({ ...datosAplicacion });
      }));
  };

  /**
   * Método encargado ejecutar una acción cuando se elimina el componente
   */
  componentWillUnmount() {
    this.props.history.replace({ entidadEditar: null });
  };

  /**
   * Método encargado de limpiar los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  limpiarFormulario = (evento) => {
    this.setState({
      // Datos de la entidad
      idRegistro: '',
      macroRuta: '',
      areaPrestacion: '',
      horaInicio: '',
      horaFin: '',
      dia: '',
      usuId: '',
      fechaGrabacion: '',
      microRuta: '',
      listaHorarios: [],
      listaMicroRutasAgregadas: [],
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
      { texto: 'Limpiar', callback: this.limpiarFormulario }
    ];
  };

  /**
   * Método encargado de validar el formulario para agregar días de recolección
   * @returns {Object}
   */
  validarFormularioHorarios = () => {
    const { horaInicio, horaFin, dia } = this.state;
    const regExp = /(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/;
    if (dia.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el día' } };
    }

    if (horaInicio.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Se debe digitar la hora inicial' } };
    }

    if (horaFin.trim() === '') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Se debe digitar la hora final' } };
    }

    if (!regExp.test(horaInicio) || !regExp.test(horaFin)) {
      return { respuesta: false, mensaje: { titulo: 'Datos Erroneos', mensaje: 'Las horas deben estar en formato 24 horas hh:mm:ss' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de validar las variables del formulario
   * @returns {Object}
   */
  validarFormulario = () => {
    const { areaPrestacion, listaHorarios, listaMicroRutasAgregadas, idRegistro, macroRuta } = this.state;
    const listaActivosHorarios = this.obtenerListaFiltrada();
    // Validaciones
    if (areaPrestacion <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar un área de prestación' } };
    }
    if (macroRuta <= 0) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar una macro ruta' } };
    }
    if (!Util.validarArreglo(listaHorarios)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos un día de recolección ' } };
    }
    if (!Util.validarArreglo(listaMicroRutasAgregadas)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos una micro ruta' } };
    }
    if (idRegistro != '') {
      if (!Util.validarArreglo(listaActivosHorarios)) {
        return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos un día de recolección ' } };
      }
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de construir el objeto de micro rutas
   * @returns {string}
   */
  obtenerObjetoMicroRutas = () => {
    const { listaMicroRutasAgregadas } = this.state;
    const lista = listaMicroRutasAgregadas.map((dato, index) => {
      return {
        microRuta: dato.rutIderegistro,
      }
    });
    return JSON.stringify(lista);
  };

  /**
   * Método encargado de obtener el objeto para guardar
   * @returns {Object}
   */
  obtenerObjeto = () => {
    const { areaPrestacion, listaHorarios, idRegistro, macroRuta, usuId, fechaGrabacion } = this.state;
    let objeto = {
      rureIderegistro: idRegistro,
      usuIderegistroGb: usuId,
      rureFecgrabacion: fechaGrabacion,
      arprIderegistro: {
        arprIderegistro: areaPrestacion
      },
      rutIdemacruta: macroRuta,
      listaDias: listaHorarios,
      rutMicroruta: this.obtenerObjetoMicroRutas(),
    };
    return objeto;
  };

  /**
   * Método encargado de guardar los datos de la entidad
   * @returns {bool}
   */
  guardarEntidad = async () => {
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const entidadGuardar = this.obtenerObjeto();
    const respuesta = await axios.post(RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS_RECOLECCION.GUARDAR, entidadGuardar)
    if (respuesta.data.codigo > 0) {
      this.limpiarFormulario();
      this.consultarMicroRutas();
    }
  };

  /**
   * Método encargado de consultar el periodo
   */
  consultarEntidad = () => {
    const { areaPrestacion, macroRuta } = this.state;
    if (areaPrestacion <= 0) {
      this.props.mostrarAlerta('Datos incompletos', 'Debe seleccionar un área de prestación');
      return false;
    }
    if (macroRuta <= 0) {
      this.props.mostrarAlerta('Datos incompletos', 'Debe seleccionar una macro ruta');
      return false;
    }
    const parametros = {
      areaPrestacion: areaPrestacion,
      macroRuta: macroRuta,
    };
    axios.post(RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS_RECOLECCION.CONSULTAR_RUTA_RECOLECCION, parametros)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.cargarDatos(respuesta.data.datos);
        }
      });
  };

  /**
   * Método encargado de consultar las micro rutas que no pertenecen a una macro ruta
   */
  consultarMicroRutas = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.ADMINISTRAR_RUTAS_RECOLECCION.CONSULTAR_MICRO_RUTA, { tipoRuta: MICRO_RUTA })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaMicroRutas: respuesta.data.datos });
        }
      });
  };

  /**
   * Método encargado de consultar las variables.
   */
  controlarConsulta = () => {
    const { areaPrestacion, macroRuta } = this.state;
    if (areaPrestacion > 0 && macroRuta > 0) {
      this.consultarEntidad();
    }
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambioConsulta = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    this.setState(change, this.controlarConsulta);
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
   * Método encargado de cerrar la ventana modal del boton consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false
    });
  };

  /**
   * Método encargado de cargar los datos de la consulta de rutas de recoleccion
   * @param {Object} entidad Datos seleccionados de la consulta
   */
  cargarDatos = (entidad) => {
    const datos = entidad[0];
    const datosDias = (datos.info) ? JSON.parse(datos.info) : '';
    const datosRutas = (datos.rutMicroruta) ? JSON.parse(datos.rutMicroruta) : '';
    this.setState({
      idRegistro: datos.rureIderegistro,
      usuId: datos.usuIderegistroGb,
      fechaGrabacion: datos.rureFecgrabacion,
      listaMicroRutasAgregadas: this.obtenerMicroRutasConsultadas(datosRutas),
      listaHorarios: this.obtenerDiasConsultados(datosDias),
    });
  };

  /**
   * Método encargado de obtener la lista con los días parametrizados consultados
   * @param {Object} diasParametrizados Días parametrizados consultados
   */
  obtenerDiasConsultados = (diasParametrizados) => {
    const lista = diasParametrizados.map((dato, index) => {
      return {
        hrrIderegistro: dato.hrr_ideregistro,
        hrrDia: dato.hrr_dia,
        hrrHorinicio: dato.hrr_horinicio,
        hrrHorfin: dato.hrr_horfin,
        hrrSwtact: dato.hrr_swtact,
      }
    });
    return lista;
  };

  /**
   * Método encargado de obtener la lista con las micro rutas consultadas
   * @param {Object} microRutas Micro rutas consultadas
   */
  obtenerMicroRutasConsultadas = (microRutas) => {
    const { listaMicroDatos } = this.state;
    let rutaSeleccionada = '';
    let lista = [];
    for (let index = 0; index < microRutas.length; index++) {
      const idMicroRuta = microRutas[index];
      rutaSeleccionada = listaMicroDatos.find(p => p.rutIderegistro == idMicroRuta.microRuta);
      lista.push({
        rutIderegistro: idMicroRuta.microRuta,
        nombreRuta: rutaSeleccionada.rutNombre,
      });
    }
    return lista;
  };

  /**
   * Método encargado de inactivar el horario seleccionado
   * @param {number} posicion Posicion de la lista que se desea inactivar
   * @returns {bool}
   */
  inactivarHorario = (posicion) => {
    const lista = this.state.listaHorarios;
    let listaHorarios = this.obtenerListaFiltrada(this.state.listaHorarios);
    if (listaHorarios[posicion].hrrIderegistro == '') {
      const index = lista.findIndex(p => p.hrrDia == listaHorarios[posicion].hrrDia && p.hrrHorfin == listaHorarios[posicion].hrrHorfin && p.hrrHorinicio == listaHorarios[posicion].hrrHorinicio);
      lista.splice(index, 1);
      this.setState({ listaHorarios: lista });
      return false;
    }
    listaHorarios[posicion].hrrSwtact = 'I';
    this.setState(listaHorarios);
  };

  /**
   * Método encargado de obtener la lista con los horarios activos
   * @returns {Array}
   */
  obtenerListaFiltrada = () => {
    const lista = this.state.listaHorarios;
    return lista.filter(p => p.hrrSwtact == 'A');
  };

  /**
   * Método encargado de mostrar la tabla con los horarios agregados
   * @returns {Object}
   */
  renderTablaHorarios = () => {
    const lista = this.obtenerListaFiltrada();
    return (
      <table className='table table-striped mt-25'>
        <thead>
          <tr>
            Lista Días de Recoleccion
          </tr>
          <tr>
            <th>Día</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Inactivar</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((dato, index) => {
            return (
              <tr key={`${Util.generarIdControl('horario')}`}>
                <td>{dato.hrrDia}</td>
                <td>{dato.hrrHorinicio}</td>
                <td>{dato.hrrHorfin}</td>
                <td>
                  <button className='btnEliminar' onClick={(evento) => {
                    this.inactivarHorario(index);
                  }}>X
                  </button>
                </td>
              </tr>
            );
          })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de agregar el día de recolección
   * @returns {bool}
   */
  agregarDia = () => {
    const validar = this.validarFormularioHorarios();
    const { horaInicio, horaFin, dia, listaHorarios } = this.state;
    if (!validar.respuesta) {
      this.props.mostrarAlerta(validar.mensaje.titulo, validar.mensaje.mensaje);
      return false;
    }
    listaHorarios.push({
      hrrIderegistro: '',
      hrrDia: dia,
      hrrHorinicio: horaInicio,
      hrrHorfin: horaFin,
      hrrSwtact: 'A',
    });
    this.setState({
      dia: '',
      horaFin: '',
      horaInicio: '',
      listaHorarios: listaHorarios
    });
  };

  /**
   * Método encargado de mostrar el formulario para agregar días de recolección
   * @returns {Object}
   */
  renderHorarios = () => {
    return (
      <div className='row mt-25'>
        <Combo
          opciones={listaDias}
          propTexto='texto'
          propValor='valor'
          label='Día:'
          name='dia'
          value={this.state.dia}
          onChange={this.controlarCambio}
          cols={3}
        />
        <Input
          label='Hora Inicio:'
          value={this.state.horaInicio}
          onChange={this.controlarCambio}
          name='horaInicio'
          cols={3}
          placeholder='10:00'
        />
        <Input
          label='Hora Final:'
          value={this.state.horaFin}
          onChange={this.controlarCambio}
          name='horaFin'
          cols={3}
          placeholder='12:00'
        />
        <div className='col-3 mt-25'>
          <button className='btn btn-primary' onClick={this.agregarDia}>Agregar Día</button>
        </div>
      </div>
    );
  };

  /**
   * Método encargado de validar que no se agreguen micro rutas repetidas
   * @returns {number}
   */
  validarMicroRutaRepetida = (microRuta) => {
    const lista = [...this.state.listaMicroRutasAgregadas];
    const index = lista.findIndex(p => p.rutIderegistro == microRuta);
    return index >= 0
  };

  /**
   * Método encargado de agregar la micro ruta seleccionada a la lista
   * @returns {bool}
   */
  agregarMicroRuta = () => {
    const { microRuta, listaMicroRutasAgregadas, listaMicroRutas } = this.state;
    const rutaSeleccionada = listaMicroRutas.find(p => p.rutIderegistro == microRuta);
    if (microRuta <= 0) {
      this.props.mostrarAlerta('Datos Incompletos', 'Debe seleccionar la micro ruta que desea agregar');
      return false;
    }
    if (this.validarMicroRutaRepetida(microRuta)) {
      this.props.mostrarAlerta('Atención', 'La ruta que esta intentado agregar ya se encuentra en la lista');
      return false;
    }

    listaMicroRutasAgregadas.push({
      rutIderegistro: microRuta,
      nombreRuta: rutaSeleccionada.rutNombre,
    });
    this.setState({
      microRuta: '',
      listaMicroRutasAgregadas: listaMicroRutasAgregadas,
    });
  };

  /**
   * Método encargado de inactivar el horario seleccionado
   * @param {Event} evento Evento ejecutado en el control de usuario
   * @param {number} posicion Posicion de la lista que se desea inactivar
   * @returns {bool}
   */
  eliminarMicroRuta = (posicion) => {
    let listaMicroRutasAgregadas = this.state.listaMicroRutasAgregadas;
    listaMicroRutasAgregadas.splice(posicion, 1);
    this.setState(listaMicroRutasAgregadas);
  };

  /**
   * Método encargado de mostrar la tabla con las micro rutas seleccionadas
   * @returns {Array}
   */
  renderTablaMicroRutas = () => {
    return (
      <table className='table table-striped mt-25'>
        <thead>
          <tr>
            Lista Micro Rutas
          </tr>
          <tr>
            <th>Micro Ruta</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {this.state.listaMicroRutasAgregadas.map((dato, index) => {
            return (
              <tr key={`ruta_${dato.nombreRuta}`}>
                <td>{dato.nombreRuta}</td>
                <td>
                  <button className='btnEliminar' onClick={() => {
                    this.eliminarMicroRuta(index);
                  }}>X
                  </button>
                </td>
              </tr>
            );
          })
          }
        </tbody>
      </table>
    );
  };

  /**
   * Método encargado de mostrar el formulario para agregar micro rutas
   * @returns {Object}
   */
  renderMicroRutas = () => {
    return (
      <div className='row mt-25'>
        <Combo
          opciones={this.state.listaMicroRutas}
          propTexto='rutNombre'
          propValor='rutIderegistro'
          label='Micro Ruta:'
          name='microRuta'
          value={this.state.microRuta}
          onChange={this.controlarCambio}
          cols={4}
        />
        <div className='col-4 mt-25'>
          <button className='btn btn-primary' onClick={this.agregarMicroRuta}>Agregar Micro Ruta</button>
        </div>
      </div>
    );
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
            opciones={this.state.listaAreaPrestacion}
            propTexto='arprNombre'
            propValor='arprIderegistro'
            label='Área de Prestación:'
            name='areaPrestacion'
            value={this.state.areaPrestacion}
            onChange={this.controlarCambioConsulta}
          />
          <Combo
            opciones={this.state.listaMacroRutas}
            propTexto='rutNombre'
            propValor='rutIderegistro'
            label='Macro Ruta:'
            name='macroRuta'
            value={this.state.macroRuta}
            onChange={this.controlarCambioConsulta}
          />
        </div>
        {
          this.renderHorarios()
        }
        {
          this.renderMicroRutas()
        }
        <div className='row'>
          <div className='col-6'>
            {Util.validarArreglo(this.obtenerListaFiltrada()) &&
              this.renderTablaHorarios()
            }
          </div>
          <div className='col-6'>
            {this.state.listaMicroRutasAgregadas.length > 0 &&
              this.renderTablaMicroRutas()
            }
          </div>
        </div>
      </Fragment>
    );
  };
}

GestionAdministrarRutasRecoleccion.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionAdministrarRutasRecoleccion);

export { VistaRedux as RGestionAdministrarRutasRecoleccion };
