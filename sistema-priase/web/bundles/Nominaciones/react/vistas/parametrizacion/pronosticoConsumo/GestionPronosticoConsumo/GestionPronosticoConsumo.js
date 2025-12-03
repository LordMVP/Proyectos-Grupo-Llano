import React, { Component, Fragment } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico, Fecha } from 'appfuture-react';
import axios from 'axios';
import RUTAS_API from '../../../../global/rutas_api';
import { mostrarAlerta } from '../../../../store/actions/AplicacionAcciones';
import moment from 'moment';
import { formatearArray } from '../../../../global/util_nominaciones'
import { TIPO_EVENTO_PRONOSTICO } from '../../../../global/constantes'
import Calendar from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import './GestionPronosticoConsumo.scss';
import { RConsultaCalendario } from '../ConsultaCalendarios';
import { RGestionGenerarPronostico } from '../GenerarPronosticoConsumo/GenerarPronosticoConsumo';

const localizer = Calendar.momentLocalizer(moment);

const listaTipoEvento = [
  { id: 'DSC', texto: 'Día sin Carro' },
  { id: 'FYF', texto: 'Ferias Turisticas' },
  { id: 'FES', texto: 'Día Festivo' },
  { id: 'DN', texto: 'Día Normal' },
];

let listaAnios = [];

class GestionPronosticoConsumo extends Component {

  generarPronostico = null;

  state = {
    // Datos de la entidad
    listaPuntosConsumo: [],
    listaEventos: [],
    puntoConsumo: '',
    fechaSeleccionada: '',
    fechaEvento: {},
    diaNormal: '0',
    diaFestivo: '',
    diaFerias: '',
    diaSinCarro: '',
    tipoEvento: '',
    idCalendario: '',
    idEventoBorrar: '',
    tipoEventoBorrar: '',
    fechaBorrar: '',
    anio: '',
    // Estado de la aplicacion
    mostrarModalPronostico: false,
    mostrarModalEventos: false,
    mostrarModalConsulta: false,
    crearEvento: true,
  };

  /**
   * Método encargado de comprobar si el formulario ya cargo
   */
  componentDidMount() {
    const { state } = this.props.history && this.props.history.location;
    this.obtenerAnios();
    if (state && state.entidadEditar) {
      this.cargarDatos(state.entidadEditar);
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PRONOSTICO_CONSUMO.CONSULTAR_PUNTOS_CONSUMO)
      .then(respuesta => {
        if (respuesta.data.codigo >= 0) {
          this.setState({ listaPuntosConsumo: formatearArray(respuesta.data.datos) }, this.consultarCalendarioActual());
        }
      });
  }

  /**
   * Método encargado de generar una lista con 100 años
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
   * Método encargado de consultar los datos del calendario para el año actual.
   */
  consultarCalendarioActual = () => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PRONOSTICO_CONSUMO.CONSULTAR_CALENDARIOS, { anio: new Date().getFullYear() })
      .then(respuesta => {
        if (respuesta.data.codigo > 0 && respuesta.data.datos != null) {
          this.cargarDatosCalendarioActual(respuesta.data.datos);
          //this.configurarValoresPuntosSalida(respuesta.data.datos);
        } else {
          this.consultarFechaSistema();
        }
      });
  };

  /**
   * Método encargado de validar los valores configurados para un punto de consumo
   * @param {Array} calendarios Lista con los calendarios parametrizados
   */
  configurarValoresPuntosSalida = (calendarios) => {
    let listaPuntosConsumo = [...this.state.listaPuntosConsumo];
    this.state.listaPuntosConsumo.forEach(puntoConsumo => {
      //Buscamos el valor actual del punto de salida más reciente.
      let fecha = 0;
      calendarios.forEach(calendario => {
        const info = JSON.parse(calendario.calInfoadicional);
        const fechaCalendario = calendario.calFechaevento.match(/\d+/g).join('');
        const puntosSalida = info.filter(i => i.ptcIdepunto == puntoConsumo.ptcIderegistro);
        //Buscamos si el calendario está asociado al punto de salida actual y si es la fecha mayor de referencia.
        if (fecha < fechaCalendario && puntosSalida.length > 0) {
          const indexPuntoSalida = listaPuntosConsumo.findIndex(ps => ps.ptcIderegistro == puntoConsumo.ptcIderegistro);
          const puntoConsumoTemp = puntosSalida[0];
          listaPuntosConsumo[indexPuntoSalida].diaSinCarro = puntoConsumoTemp.calpDiasincarro;
          listaPuntosConsumo[indexPuntoSalida].diaNormal = puntoConsumoTemp.calpNormal;
          listaPuntosConsumo[indexPuntoSalida].diaFerias = puntoConsumoTemp.calpFerias;
          listaPuntosConsumo[indexPuntoSalida].diaFestivo = puntoConsumoTemp.calpFestivo;
        }
      });
    });
    this.setState({
      listaPuntosConsumo: listaPuntosConsumo
    });
  };

  /**
   * Método encargado de traer los datos del calendario del año actual
   * @param {Object} datosCalendario Datos del calendario del año actual
   */
  cargarDatosCalendarioActual = (datosCalendario) => {
    this.consultarFechaSistema(() => {
      this.setState({
        listaEventos: this.obtenerEventosConsultados(JSON.parse(datosCalendario)),
      });
    });
  };

  /**
   * Consulta la fecha del sistema y setea el año actual.
   */
  consultarFechaSistema = (callback) => {
    axios.post(RUTAS_API.GLOBAL.CONSULTAR_FECHA_ACTUAL).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        this.setState({
          anio: (new Date(respuesta.data.datos)).getFullYear()
        }, callback);
      }
    });
  };

  /**
   * Método encargado de obtener la lista de eventos.
   * @param {Object} eventos Datos de los eventos del calendario.
   */
  obtenerEventosConsultados = (eventos) => {
    let listaFinal = [];
    let eventoSeleccionado = {};
    if (eventos.length <= 0) {
      return;
    }
    eventos.map(dato => {
      for (let index = 0; index < dato.eventos.length; index++) {
        const evento = dato.eventos[index];
        eventoSeleccionado = listaTipoEvento.find(p => p.id == evento.calTipoevento);
        listaFinal.push(
          {
            start: new Date(dato.fecha + " :"),
            end: new Date(dato.fecha + " :"),
            title: `${evento.ptcoNombre}-${eventoSeleccionado.texto}`,
            pts_ideregistro: evento.ptcIderegistro,
            puntoNombre: evento.ptcoNombre,
            tipoEvento: eventoSeleccionado.id,
            nombreEvento: eventoSeleccionado.texto,
            fechaSeleccionada: dato.fecha,
            calideregistro: evento.calIderegistro,
            calp_ideregistro: evento.calpIderegitro,
            idEvento: Util.generarIdControl('evento'),
            porcentajeSinCarro: evento.calpDiasincarro,
            porcentajeNormal: evento.calpNormal,
            porcentajeFestivo: evento.calpFestivo,
            porcentajeFerias: evento.calpFerias,
          }
        );
      };
    });
    return listaFinal;
  };

  /**
   * Método encargado de limpiar los campos del formulario
   */
  limpiarFormulario = () => {
    this.setState({
      // Datos de la entidad
      puntoConsumo: '',
      diaFestivo: '',
      diaNormal: '0',
      diaSinCarro: '',
      diaFerias: '',
      idCalendario: '',
      idEventoBorrar: '',
      tipoEventoBorrar: '',
      fechaBorrar: '',
      // Estado de la aplicacion
      mostrarModalPronostico: false,
      mostrarModalEventos: false,
      mostrarModalConsulta: false,
      crearEvento: true,
    });
    this.consultarCalendarioActual();
  };

  /**
   * Método encargado de limpiar el formulario editar al momento de salir
   */
  componentWillUnmount() {
    this.limpiarFormulario();
  }

  /**
   * Método encargado de generar los botones del formulario
	 * @returns {Object}
   */
  obtenerFunciones = () => {
    const fecha = new Date();
    const anioActual = fecha.getFullYear();
    let funciones = [{ texto: 'Consultar', callback: this.consultarEntidad }];
    funciones.push({ texto: 'Limpiar', callback: this.limpiarFormulario });
    if (this.state.anio == anioActual || !this.state.anio) {
      funciones.push({ texto: 'Guardar', callback: this.guardarEntidad });
      funciones.push({ texto: 'Generar Pronostico', callback: this.consultarEntidadPronostico });
    }
    return funciones;
  };

  /**
   * Método encargado de validar las variables del formulario
	 * @returns {Object}
   */
  validarFormulario = () => {
    const { listaEventos, diaNormal, diaFestivo, diaFerias, diaSinCarro } = this.state;
    //Validaciones
    if (!Util.validarArreglo(listaEventos)) {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe agregar al menos un evento' } };
    }
    return { respuesta: true };
  };

  /**
   * Método encargado de validar las variables del formulario para crear eventos
	 * @returns {Object}
   */
  validarFormularioEventos = () => {
    const { puntoConsumo, tipoEvento } = this.state;
    // Validaciones
    if (puntoConsumo === '' || puntoConsumo === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el punto al cual le quiere agregar el evento' } };
    }

    if (tipoEvento === '' || tipoEvento === '-1') {
      return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Debe seleccionar el tipo de evento' } };
    }

    return { respuesta: true };
  };

  /**
   * Método encargado de guardar los datos de la entidad
	 * @returns {bool}
   */
  guardarEntidad = () => {
    const { listaEventos } = this.state;
    const validacion = this.validarFormulario();
    if (!validacion.respuesta) {
      this.props.mostrarAlerta(validacion.mensaje.titulo, validacion.mensaje.mensaje);
      return false;
    }
    const entidadGuardar = this.obtenerObjetoEnvio(listaEventos);
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PRONOSTICO_CONSUMO.GUARDAR, entidadGuardar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.limpiarFormulario();
        }
      });
  };

  /**
   * Método encargado de abrir la ventana modal del botón de consulta
   */
  consultarEntidad = () => {
    this.setState({ mostrarModalConsulta: true });
  };

  /**
   * Método encargado de abrir la ventana modal del botón de pronóstico
   */
  consultarEntidadPronostico = () => {
    this.setState({ mostrarModalPronostico: true });
  };

  /**
   * Método encargado de controlar el cambio del valor de los campos del formulario
	 * @param {Event} evento El evento que se ejecuta en el control de usuario
   */
  controlarCambio = (evento) => {
    let change = {};
    change[evento.target.name] = evento.target.value;
    if (evento.target.name == 'puntoConsumo') {
      this.actualizarValoresPorcentaje(evento.target.value);
    }
    this.setState(change);
  };

  /**
   * Obtiene el punto de salida seleccionado y actualiza sus valores.
   */
  actualizarPuntoSalida = (evento) => {
    let change = {};
    const nombrePropiedad = evento.target.name;
    const valor = evento.target.value;
    change[nombrePropiedad] = valor;
    if (this.state.puntoConsumo != '') {
      this.actualizarValorPuntoSalida(nombrePropiedad, valor);
    }
    this.setState(change);
  };

  /**
   * Agrega un valor al punto de salida seleccionado.
   */
  actualizarValorPuntoSalida = (nombrePropiedad, valor) => {
    const listaPuntosConsumo = [...this.state.listaPuntosConsumo];
    const index = listaPuntosConsumo.findIndex(p => p.ptcIderegistro == this.state.puntoConsumo);
    if (index >= 0) {
      listaPuntosConsumo[index][nombrePropiedad] = valor;
    }
    this.setState({
      listaPuntosConsumo: listaPuntosConsumo
    });
  };

  /**
   * Busca el punto de salida por id y asigna los valores de porcentaje guardados en la misma.
   */
  actualizarValoresPorcentaje = (idPuntoConsumo) => {
    const puntoConsumo = this.state.listaPuntosConsumo.find(p => {
      if (p.ptcIderegistro == idPuntoConsumo) {
        return p;
      }
    });
    this.obtenerValoresPorcentaje(puntoConsumo);
  };

  /**
   * Consulta valores porcentaje y los fija en el state.
   */
  obtenerValoresPorcentaje = (puntoConsumo) => {
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PRONOSTICO_CONSUMO.CONSULTAR_VALORES_PUNTO_CONSUMO, {
      idPuntoConsumo: puntoConsumo.ptcIderegistro
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        const punto = respuesta.data.datos;
        this.setState({
          diaSinCarro: punto.calpDiasincarro,
          diaNormal: punto.calpNormal,
          diaFerias: punto.calpFerias,
          diaFestivo: punto.calpFestivo
        });
      } else {
        this.setState({
          diaSinCarro: '',
          diaNormal: 0,
          diaFerias: '',
          diaFestivo: ''
        });
      }
    });
  };

  /**
   * Método encargado de cerrar la ventana modal del botón de consulta
   */
  abrirCerrarModal = () => {
    this.setState({
      mostrarModalConsulta: false,
      mostrarModalPronostico: false,
      mostrarModalEventos: false,
    });
  };

  /**
   * Método encargado de eliminar todos los eventos festivos del día seleccionado
   * @returns {bool}
   */
  eliminarEventoFestivo = () => {
    const { listaEventos, fechaBorrar } = this.state;
    const listaValidar = listaEventos.filter(p => p.fechaSeleccionada == fechaBorrar);
    const listaFiltrada = listaEventos.filter(p => p.fechaSeleccionada == fechaBorrar && p.tipoEvento == 'FES');
    if (!listaFiltrada[0].calideregistro) {
      let posicion = -1;
      for (let index = 0; index < listaFiltrada.length; index++) {
        const evento = listaFiltrada[index];
        if (!evento.calIderegistro) {
          posicion = listaEventos.findIndex(p => p.idEvento == evento.idEvento);
          listaEventos.splice(posicion, 1);
        }
      }
      this.setState({
        listaEventos: listaEventos,
        mostrarModalEventos: false,
      });
      return;
    }
    const objetoEnviar = this.obtenerObjetoEnvio(listaValidar);
    if (listaValidar.length > listaFiltrada.length) {
      for (let index = 0; index < listaFiltrada.length; index++) {
        const eventoFestivo = listaFiltrada[index];
        const posicion = listaEventos.findIndex(p => p.idEvento == eventoFestivo.idEvento);
        listaEventos.splice(posicion, 1);
      }
      this.setState({
        listaEventos: listaEventos,
        mostrarModalEventos: false,
      });
      return;
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PRONOSTICO_CONSUMO.ELIMINAR_DIA, objetoEnviar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          for (let index = 0; index < listaFiltrada.length; index++) {
            const eventoFestivo = listaFiltrada[index];
            const posicion = listaEventos.findIndex(p => p.idEvento == eventoFestivo.idEvento);
            listaEventos.splice(posicion, 1);
          }
          this.setState({
            listaEventos: listaEventos,
            mostrarModalEventos: false,
          });
        }
      })
  };

  /**
   * Método encargado de eliminar el evento seleccionado
   * @returns {bool}
   */
  eliminarEvento = () => {
    const { listaEventos, idEventoBorrar, fechaBorrar } = this.state;
    const validarLista = listaEventos.filter(p => p.fechaSeleccionada == fechaBorrar);
    const index = listaEventos.findIndex(p => p.idEvento == idEventoBorrar);
    const eventoBorrar = listaEventos.find(p => p.idEvento == idEventoBorrar);
    if (eventoBorrar.calideregistro == '') {
      listaEventos.splice(index, 1);
      this.setState({
        listaEventos: listaEventos,
        mostrarModalEventos: false,
      });
      return;
    }
    const objetoEnviar = this.obtenerObjetoEnvio(validarLista);
    if (validarLista.length > 1) {
      listaEventos.splice(index, 1);
      this.setState({
        listaEventos: listaEventos,
        mostrarModalEventos: false,
      });
      return;
    }
    axios.post(RUTAS_API.PARAMETRIZACION.GESTION_PRONOSTICO_CONSUMO.ELIMINAR_DIA, objetoEnviar)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          listaEventos.splice(index, 1);
          this.setState({
            listaEventos: listaEventos,
            mostrarModalEventos: false,
          });
        }
      })
  };

  /**
   * Método encargado de mostrar la alerta de confirmación para eliminar el evento
   */
  confirmarEliminarEvento = () => {
    const { tipoEventoBorrar } = this.state;
    if (tipoEventoBorrar != 'FES') {
      this.props.mostrarAlerta('Confirmación Eliminar', 'Confirmar que desea eliminar el evento', [
        {
          clase: 'btn btn-danger',
          callback: () => this.eliminarEvento(),
          texto: 'Aceptar'
        },
        {
          clase: 'btn btn-secondary',
          texto: 'Cancelar'
        }
      ]);
      return;
    }
    this.props.mostrarAlerta('Confirmación Eliminar Festivo', '¿Desea eliminar el festivo de este día?', [
      {
        clase: 'btn btn-danger',
        callback: () => this.eliminarEventoFestivo(),
        texto: 'Aceptar'
      },
      {
        clase: 'btn btn-secondary',
        texto: 'Cancelar'
      }
    ]);
  }

  /**
   * Método encargado de armar el objeto para enviar
   * @param {Object} listaEventos Lista con los eventos para armar el objeto
   * @returns {Object}
   */
  obtenerObjetoEnvio = (listaEventos) => {
    let gruposFecha = {};
    listaEventos.filter(a => {
      const fecha = a.fechaSeleccionada;
      //Creamos los grupos por fecha.
      if (!gruposFecha[fecha]) {
        gruposFecha[fecha] = [];
      }
      //Insertamos en el grupo por fecha.
      gruposFecha[fecha].push(a);
    });
    let listaFinal = [];

    //Recorremos los grupos por fecha.
    for (const fecha in gruposFecha) {
      let eventos = [];
      const grupoFecha = gruposFecha[fecha];
      for (let index = 0; index < grupoFecha.length; index++) {
        const evento = grupoFecha[index];
        eventos.push(
          {
            calideregistro: (evento.calideregistro != '') ? evento.calideregistro : '',
            calTipoevento: evento.tipoEvento,
            calpDiasincarro: evento.porcentajeSinCarro,
            calpFerias: evento.porcentajeFerias,
            calpNormal: evento.porcentajeNormal,
            calpFestivo: evento.porcentajeFestivo,
            ptcIderegistro: evento.pts_ideregistro,
            ptcoNombre: evento.puntoNombre,
            calp_ideregistro: evento.calp_ideregistro
          }
        );
      }
      let obj = {
        fecha: fecha,
        eventos: eventos,
      };
      listaFinal.push(obj);
    }
    return listaFinal;
  };

  /**
   * Método encargado de validar que no se ponga un punto repetido con el mismo evento.
   * @param {string} idPuntoConsumo Identificador del punto de consumo seleccionado.
   * @param {string} fechaSeleccionada Fecha seleccionada.
   * @returns {number}
   */
  validarPuntoRepetido = (idPuntoConsumo, fechaSeleccionada) => {
    const { listaEventos } = this.state;
    const index = listaEventos.findIndex(p => p.pts_ideregistro == idPuntoConsumo && p.fechaSeleccionada == fechaSeleccionada);
    return index >= 0;
  };

  /**
   * Método encargado de validar los porcentajes por punto de consumo.
   * @returns {Object}
   */
  validarPuntoSalida = () => {
    const { puntoConsumo, diaSinCarro, diaFerias, diaFestivo, tipoEvento } = this.state;
    if (puntoConsumo < 0) {
      return { respuesta: false, mensaje: { mensaje: 'Debe seleccionar un punto de consumo.', titulo: 'Error' } };
    }
    switch (tipoEvento) {
      case TIPO_EVENTO_PRONOSTICO.FESTIVO:
        if (!diaFestivo || diaFestivo == '-1') {
          return { respuesta: false, mensaje: { mensaje: 'Debe seleccionar el porcentaje del día festivo.', titulo: 'Error' } };
        }
        break;
      case TIPO_EVENTO_PRONOSTICO.FERIAS_Y_FIESTAS:
        if (!diaFerias || diaFerias == '-1') {
          return { respuesta: false, mensaje: { mensaje: 'Debe seleccionar el porcentaje de ferias y fiestas.', titulo: 'Error' } };
        }
        break;
      case TIPO_EVENTO_PRONOSTICO.DIA_SIN_CARRO:
        if (!diaSinCarro || diaSinCarro == '-1') {
          return { respuesta: false, mensaje: { mensaje: 'Debe seleccionar el porcentaje del día sin carro.', titulo: 'Error' } };
        }
        break;
      default:
        break;
    }
    return { respuesta: true };
  };


  /**
   * Método encargado de agregar el evento
   * @returns {bool}
   */
  agregarEvento = () => {
    const respuesta = this.validarPuntoSalida();
    if (!respuesta.respuesta) {
      this.props.mostrarAlerta(respuesta.mensaje.titulo, respuesta.mensaje.mensaje);
      return;
    }
    const { listaEventos, fechaSeleccionada, fechaEvento,
      puntoConsumo, listaPuntosConsumo, tipoEvento,
      diaFerias, diaFestivo, diaNormal, diaSinCarro
    } = this.state;
    const validar = this.validarFormularioEventos();
    const puntoSeleccionado = listaPuntosConsumo.find(p => p.ptcIderegistro == puntoConsumo);
    const eventoSeleccionado = listaTipoEvento.find(p => p.id == tipoEvento);
    if (!validar.respuesta) {
      this.props.mostrarAlerta(validar.mensaje.titulo, validar.mensaje.mensaje);
      return false;
    }
    if (this.validarPuntoRepetido(puntoSeleccionado.ptcIderegistro, fechaSeleccionada)) {
      this.props.mostrarAlerta('Atención', `Ya se ha agregado un evento en la fecha ${fechaSeleccionada} en el punto ${puntoSeleccionado.ptcoNombre}`);
      return false;
    }
    if (eventoSeleccionado.id != 'FES') {
      listaEventos.push(
        {
          start: fechaEvento,
          end: fechaEvento,
          title: `${puntoSeleccionado.ptcoNombre}-${eventoSeleccionado.texto}`,
          pts_ideregistro: puntoSeleccionado.ptcIderegistro,
          puntoNombre: puntoSeleccionado.ptcoNombre,
          tipoEvento: eventoSeleccionado.id,
          nombreEvento: eventoSeleccionado.texto,
          fechaSeleccionada: fechaSeleccionada,
          idEvento: Util.generarIdControl('evento'),
          porcentajeSinCarro: diaSinCarro,
          porcentajeNormal: diaNormal,
          porcentajeFestivo: diaFestivo,
          porcentajeFerias: diaFerias,
          calideregistro: '',
          calp_ideregistro: '',
        }
      );
    }
    if (eventoSeleccionado.id === 'FES') {
      for (let index = 0; index < listaPuntosConsumo.length; index++) {
        const puntoConsumo = listaPuntosConsumo[index];
        listaEventos.push(
          {
            start: fechaEvento,
            end: fechaEvento,
            title: `${puntoConsumo.ptcoNombre}-${eventoSeleccionado.texto}`,
            pts_ideregistro: puntoConsumo.ptcIderegistro,
            puntoNombre: puntoConsumo.ptcoNombre,
            tipoEvento: eventoSeleccionado.id,
            nombreEvento: eventoSeleccionado.texto,
            fechaSeleccionada: fechaSeleccionada,
            idEvento: Util.generarIdControl('evento'),
            porcentajeSinCarro: diaSinCarro,
            porcentajeNormal: diaNormal,
            porcentajeFestivo: diaFestivo,
            porcentajeFerias: diaFerias,
            calideregistro: '',
            calp_ideregistro: '',
          }
        );
      }
    }
    this.setState({
      listaEventos: listaEventos,
      mostrarModalEventos: false,
    });
  };

  /**
   * Método encargado de mostrar la ventana modal para agregar eventos
   * @return {Object}
   */
  renderModalEventos = () => {
    return (
      <VentanaModal
        mostrar={this.state.mostrarModalEventos}
        cerrarModal={this.abrirCerrarModal}>
        {this.state.crearEvento &&
          <div>
            <div className="modal-header">
              <h4 className="modal-title"><b>Agregar Evento</b></h4>
            </div>
            <div className="modal-body">
              <div className='row'>
                <Input
                  label='Fecha'
                  value={this.state.fechaSeleccionada}
                  extra={{ disabled: true, readOnly: true }}
                  name='fechaSeleccionada'
                />
                <Combo
                  opciones={this.state.listaPuntosConsumo}
                  propTexto='ptcoNombre'
                  propValor='ptcIderegistro'
                  label='Punto de consumo:'
                  label='Punto de consumo:'
                  name='puntoConsumo'
                  value={this.state.puntoConsumo}
                  onChange={this.controlarCambio}
                />
                <Combo
                  opciones={listaTipoEvento}
                  propTexto='texto'
                  propValor='id'
                  label='Tipo Evento:'
                  name='tipoEvento'
                  value={this.state.tipoEvento}
                  onChange={this.controlarCambio}
                />
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={true}
                  label='% Día sin Carro:'
                  cols={4}
                  value={this.state.diaSinCarro}
                  onChange={this.actualizarPuntoSalida}
                  name='diaSinCarro'
                />
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={true}
                  label='% Día normal:'
                  value={this.state.diaNormal}
                  onChange={this.actualizarPuntoSalida}
                  name='diaNormal'
                  extra={{ disabled: true }}
                />
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={true}
                  label='% Ferias Turisticas:'
                  value={this.state.diaFerias}
                  onChange={this.actualizarPuntoSalida}
                  name='diaFerias'
                />
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={true}
                  label='% Día Festivo:'
                  value={this.state.diaFestivo}
                  onChange={this.actualizarPuntoSalida}
                  name='diaFestivo'
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className='btn btn-primary' onClick={this.agregarEvento}>Agregar</button>
              <button className='btn btn-secondary' onClick={() => { this.setState({ mostrarModalEventos: false }) }}>Cerrar</button>
            </div>
          </div>
        }
        {!this.state.crearEvento &&
          <div>
            <div className="modal-header">
              <h4 className="modal-title"><b>Consultar Evento</b></h4>
            </div>
            <div className="modal-body">
              <div className='row'>
                <Input
                  label='Fecha'
                  value={this.state.fechaSeleccionada}
                  extra={{ disabled: true, readOnly: true }}
                  name='fechaSeleccionada'
                />
                <Input
                  label='Punto de Consumo'
                  value={this.state.puntoConsumo}
                  extra={{ disabled: true, readOnly: true }}
                  name='puntoConsumo'
                />
                <Input
                  label='Tipo de Evento'
                  value={this.state.tipoEvento}
                  extra={{ disabled: true, readOnly: true }}
                  name='tipoEvento'
                />
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={true}
                  label='% Día sin Carro:'
                  value={this.state.diaSinCarro}
                  name='diaSinCarro'
                  extra={{ disabled: true, readOnly: true }}
                />
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={true}
                  label='% Día normal:'
                  value={this.state.diaNormal}
                  name='diaNormal'
                  extra={{ disabled: true, readOnly: true }}
                />
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={true}
                  label='% Ferias Turisticas:'
                  value={this.state.diaFerias}
                  name='diaFerias'
                  extra={{ disabled: true, readOnly: true }}
                />
                <TextoNumerico
                  aceptaDecimales={true}
                  aceptaNegativos={false}
                  label='% Día Festivo:'
                  value={this.state.diaFestivo}
                  name='diaFestivo'
                  extra={{ disabled: true, readOnly: true }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className='btn btn-danger' onClick={() => { this.confirmarEliminarEvento() }}>Eliminar</button>
              <button className='btn btn-secondary' onClick={() => { this.setState({ mostrarModalEventos: false }) }}>Cerrar</button>
            </div>
          </div>
        }
      </VentanaModal>
    );
  };

  /**
   * Método encargado de cargar los datos de el calendario seleccionado
   * @param {Object} entidad Datos seleccionados de la consulta
   */
  cargarDatos = (entidad) => {
    this.setState({
      listaEventos: this.obtenerEventosConsultados(entidad),
      mostrarModalConsulta: false,
      anio: entidad[0].fecha.substr(0, 4)
    })
  };

  /**
   * Método encargado de parsear la fecha del día seleccionado
   * @param {Date} fechaSeleccionada El evento que se ejecuta en el control de usuario
   * @return {String}
   */
  parsearFecha = (fechaSeleccionada) => {
    let fecha = fechaSeleccionada;
    const anio = fecha.getFullYear();
    const dia = fecha.getDate();
    const mes = fecha.getMonth();
    return `${anio}-${(mes < 10) ? '0' : ''}${mes + 1}-${((dia < 10) ? '0' : '')}${dia}`;
  };

  /**
   * Método encargado de abrir el modal de crear eventos
   * @param {Event} evento El evento que se ejecuta en el control de usuario
   * @return {bool}
   */
  abrirModalEventos = (evento) => {
    this.setState({
      fechaSeleccionada: this.parsearFecha(evento.start),
      fechaEvento: evento.start,
      puntoConsumo: '-1',
      tipoEvento: '-1',
      mostrarModalEventos: true,
      crearEvento: true,
      fechaBorrar: this.parsearFecha(evento.start),
      diaNormal: 0,
      diaFestivo: '',
      diaFerias: '',
      diaSinCarro: '',
    });
  };

  /**
   * Método encargado de abrir el modal para ver los datos de un evento
   * @param {Event} evento El evento que se ejecuta en el control de usuarioF
   */
  abrirModalVer = (evento) => {
    this.setState({
      fechaSeleccionada: evento.fechaSeleccionada,
      puntoConsumo: evento.puntoNombre,
      tipoEvento: evento.nombreEvento,
      mostrarModalEventos: true,
      crearEvento: false,
      idEventoBorrar: evento.idEvento,
      tipoEventoBorrar: evento.tipoEvento,
      fechaBorrar: evento.fechaSeleccionada,
      diaNormal: evento.porcentajeNormal,
      diaFestivo: evento.porcentajeFestivo,
      diaFerias: evento.porcentajeFerias,
      diaSinCarro: evento.porcentajeSinCarro,
    });
  };

  /**
   * Método encargado de mostrar el formulario
	 * @returns {Object}
   */
  render() {
    return (
      <Fragment>
        <Botonera className='mb-3' funciones={this.obtenerFunciones()} />
        <div>
          <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={this.state.listaEventos}
            selectable={true}
            onSelectSlot={(evento) => {
              this.abrirModalEventos(evento)
            }}
            onSelectEvent={this.abrirModalVer}
            style={{ height: "100vh" }}
          />
        </div>
        {this.renderModalEventos()}
        <VentanaModal
          mostrar={this.state.mostrarModalConsulta}
          titulo='Selecionar el calendario'
          cerrarModal={this.abrirCerrarModal}>
          <RConsultaCalendario
            esModal
            listaAnios={listaAnios}
            seleccionarEntidad={this.cargarDatos}
            mostrarAlerta={this.props.mostrarAlerta}
          />
        </VentanaModal>
        <VentanaModal
          mostrar={this.state.mostrarModalPronostico}
          titulo='Generar Pronostico de Consumo'
          cerrarModal={this.abrirCerrarModal}>
          <RGestionGenerarPronostico
            mostrarAlerta={this.props.mostrarAlerta}
            ref={ref => this.generarPronostico = ref}
            history={this.props.history}
            listaPuntos={this.state.listaPuntosConsumo}
          />
        </VentanaModal>
      </Fragment>
    );
  };
}

GestionPronosticoConsumo.propTypes = {
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

const VistaRedux = connect(mapStateToProps, mapDispatchToProps)(GestionPronosticoConsumo);

export { VistaRedux as RGestionPronosticoConsumo };
